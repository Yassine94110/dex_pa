// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error assetNotCorrect();

contract LiquidityPool is ReentrancyGuard {
    event priceChanged(address _asset, uint256 price);
    event liquidityAdded(
        address indexed _address,
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    );
    event liquidityRemoved(
        address indexed _address,
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    );
    event yieldFarmed(address indexed _address, uint256 _amount);

    address public assetOneAddress;
    address public assetTwoAddress;
    uint256 public initialLiquidity;
    uint256 public liquidity;
    uint256 public yield;
    uint256 public swapFee;
    address public owner;

    modifier onlyOwner() {
        msg.sender == owner;
        _;
    }

    constructor(address _assetOneAddress, address _assetTwoAddress) {
        assetOneAddress = _assetOneAddress;
        assetTwoAddress = _assetTwoAddress;
        owner = msg.sender;
        swapFee = 1000000000000000;
    }

    function changeSwapFee(uint256 newSwapFee) public onlyOwner {
        swapFee = newSwapFee;
    }

    mapping(address => uint256) public lpTokenQuantity;

    function addInitialLiquidity(
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    ) public onlyOwner {
        require(
            initialLiquidityProvidedTime[owner] == 0,
            "initialLiquidityAlreadyProvided"
        );
        initialLiquidityProvidedTime[tx.origin] = block.timestamp;

        IERC20(assetOneAddress).transferFrom(
            tx.origin,
            address(this),
            _assetOneAmount
        );
        IERC20(assetTwoAddress).transferFrom(
            tx.origin,
            address(this),
            _assetTwoAmount
        );

        initialLiquidity = _assetOneAmount * _assetTwoAmount;
        liquidity = initialLiquidity;

        lpTokenQuantity[tx.origin] = initialLiquidity;

        emit liquidityAdded(tx.origin, _assetOneAmount, _assetTwoAmount);
    }

    function addLiquidity(
        address _asset,
        address _secondAsset,
        uint256 _amount
    ) public nonReentrant {
        IERC20(_secondAsset).transferFrom(
            msg.sender,
            address(this),
            amountOfOppositeTokenNeeded(_asset, _amount)
        );
        IERC20(_asset).transferFrom(msg.sender, address(this), _amount);

        lpTokenQuantity[msg.sender] += (_amount *
            amountOfOppositeTokenNeeded(_asset, _amount));
        liquidity += (_amount * amountOfOppositeTokenNeeded(_asset, _amount));

        emit liquidityAdded(
            msg.sender,
            amountOfOppositeTokenNeeded(_asset, _amount),
            _amount
        );
    }

    function removeLiquidity(uint256 _amount) public nonReentrant {
        uint256 userLpTokens = lpTokenQuantity[msg.sender];
        uint256 percentageOfLiquidity = (userLpTokens * 1 ether) / liquidity;
        uint256 percentageOfUserLiquidity = (percentageOfLiquidity * _amount) /
            100;

        uint256 resultAssetOne = (percentageOfUserLiquidity * getAssetOne()) /
            1 ether;
        uint256 resultAssetTwo = (percentageOfUserLiquidity * getAssetTwo()) /
            1 ether;

        require(
            !(msg.sender == owner &&
                !isTimeInitialLiquidity() &&
                (lpTokenQuantity[msg.sender] -
                    (resultAssetOne * resultAssetTwo) <
                    initialLiquidity)),
            "notEnoughTokens"
        );

        require(
            IERC20(assetOneAddress).balanceOf(address(this)) >= resultAssetOne,
            "notEnoughTokens for asset one"
        );
        require(
            IERC20(assetTwoAddress).balanceOf(address(this)) >= resultAssetTwo,
            "notEnoughTokens for asset two"
        );

        IERC20(assetOneAddress).transfer(msg.sender, resultAssetOne);
        IERC20(assetTwoAddress).transfer(msg.sender, resultAssetTwo);

        emit liquidityRemoved(msg.sender, resultAssetOne, resultAssetTwo);
    }

    function sellAssetOne(
        uint256 _amount
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= swapFee, "notEnoughGas");
        yield += swapFee;
        uint256 n = getAssetTwo();
        uint256 assetOne = getAssetOne() + _amount;
        uint256 assetTwo = liquidity / assetOne;
        uint256 result = n - assetTwo;
        IERC20(assetOneAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        IERC20(assetTwoAddress).transfer(msg.sender, result);
        emit priceChanged(assetOneAddress, assetOnePrice());
        emit priceChanged(assetTwoAddress, assetTwoPrice());
        return result;
    }

    function sellAssetTwo(
        uint256 _amount
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= swapFee, "notEnoughGas");
        yield += swapFee;
        uint256 unrequiredFee = msg.value - swapFee; // In case the msg.sender sent more value than it is required
        uint256 n = getAssetOne();
        uint256 assetTwo = getAssetTwo() + _amount;
        uint256 assetOne = liquidity / assetTwo;
        uint256 result = n - assetOne;
        IERC20(assetTwoAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        IERC20(assetOneAddress).transfer(msg.sender, result);
        (bool sent, ) = payable(msg.sender).call{value: unrequiredFee}("");
        require(sent, "Failed to send Ether");
        emit priceChanged(assetOneAddress, assetOnePrice());
        emit priceChanged(assetTwoAddress, assetTwoPrice());

        return result;
    }

    function getAssetBalace(address _address) public view returns (uint256) {
        return IERC20(_address).balanceOf(address(this));
    }

    function assetOnePrice() public view returns (uint256) {
        return (getAssetTwo() * 1 ether) / getAssetOne();
    }

    function assetTwoPrice() public view returns (uint256) {
        return (getAssetOne() * 1 ether) / getAssetTwo();
    }

    function getAssetOne() public view returns (uint256) {
        return IERC20(assetOneAddress).balanceOf(address(this));
    }

    function getAssetTwo() public view returns (uint256) {
        return IERC20(assetTwoAddress).balanceOf(address(this));
    }

    function getLpTokenQuantity(
        address _address
    ) public view returns (uint256) {
        return lpTokenQuantity[_address];
    }

    function getLiquidity() public view returns (uint256) {
        return liquidity;
    }

    function getSwapFee() public view returns (uint256) {
        return swapFee;
    }

    function addressBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getSwapQuantity(
        address sellingAsset,
        uint256 _amount
    ) public view returns (uint256) {
        if (sellingAsset == assetOneAddress) {
            uint256 newAssetOne = getAssetOne() + _amount;
            uint256 newAssetTwo = liquidity / newAssetOne;
            return getAssetTwo() - newAssetTwo;
        } else if (sellingAsset == assetTwoAddress) {
            uint256 newAssetTwo = getAssetTwo() + _amount;
            uint256 newAssetOne = liquidity / newAssetTwo;
            return getAssetOne() - newAssetOne;
        } else {
            revert assetNotCorrect();
        }
    }

    function amountOfOppositeTokenNeeded(
        address _asset,
        uint256 _amount
    ) public view returns (uint256) {
        uint256 ratio;
        if (_asset == assetOneAddress) {
            ratio = (getAssetTwo() * 1 ether) / getAssetOne();
        } else {
            ratio = (getAssetOne() * 1 ether) / getAssetTwo();
        }
        uint256 amountNeeded = (_amount * ratio) / 1 ether;
        return amountNeeded;
    }

    mapping(address => uint256) public yieldTaken;

    function yieldAmount() public view returns (uint256) {
        return yield;
    }

    function getYield() public {
        require(isTime(), "notEnoughTimePassed");
        lastYieldFarmedTime[msg.sender] = block.timestamp; // Reentrancy guard
        uint256 yieldSoFar = yieldTaken[msg.sender];
        uint256 userLiquidity = (lpTokenQuantity[msg.sender] * 100) / liquidity;
        uint256 availableYield = ((yield -
            ((yieldSoFar * 100) / userLiquidity)) * userLiquidity) / 100;
        require(availableYield <= address(this).balance, "notEnoughTokens");

        yieldTaken[msg.sender] += availableYield;
        payable(msg.sender).transfer(availableYield);

        emit yieldFarmed(msg.sender, availableYield);
    }

    mapping(address => uint256) public lastYieldFarmedTime;
    mapping(address => uint256) public initialLiquidityProvidedTime;

    function isTime() public view returns (bool) {
        lastYieldFarmedTime[msg.sender];
        uint256 currentStamp = block.timestamp;
        if ((lastYieldFarmedTime[msg.sender] + 1 days) < currentStamp) {
            return true;
        } else {
            return false;
        }
    }

    function isTimeInitialLiquidity() public view returns (bool) {
        if (
            block.timestamp >
            (initialLiquidityProvidedTime[msg.sender] + 365 days)
        ) {
            return true;
        } else {
            return false;
        }
    }

    fallback() external payable {}

    receive() external payable {}
}
