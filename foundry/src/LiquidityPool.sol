// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ILiquidityPool} from "../src/ILiquidityPool.sol";
import {console} from "forge-std/Test.sol";

error Unauthorized();
error assetNotCorrect();
error notEnoughTokens();
error notEnoughGas();
error notEnoughTimePassed();
error initialLiquidityAlreadyProvided();
error addressNotCorrect();
error amountTooBig();
error needToCallExistingFunction();

/**
 * @title LiquidityPool
 * @dev A decentralized liquidity pool contract for swapping assets and providing liquidity.
 */
contract LiquidityPool is ReentrancyGuard {
    // Events
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

    // Token Addresses
    address public assetOneAddress;
    address public assetTwoAddress;

    // Liquidity and Yield (fees)
    uint256 public initialLiquidity;
    uint256 public liquidity;
    uint256 public yield;
    uint256 public swapFee;
    address public immutable owner;

    /**
     * @dev Modifier to restrict functions only to the owner.
     */
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    /**
     * @dev Constructor to initialize the liquidity pool with two asset addresses.
     * @param _assetOneAddress The address of the first asset.
     * @param _assetTwoAddress The address of the second asset.
     */
    constructor(
        address _assetOneAddress,
        address _assetTwoAddress,
        address _owner
    ) {
        assetOneAddress = _assetOneAddress;
        assetTwoAddress = _assetTwoAddress;
        owner = _owner;
        swapFee = 1000000000000000; // 0.001 ether
    }

    /**
     * @dev Function to change the swap fee. Only callable by the owner.
     * @param newSwapFee The new swap fee to set.
     */
    function changeSwapFee(uint256 newSwapFee) public onlyOwner {
        swapFee = newSwapFee;
    }

    // TRACK THE LP TOKEN QUANTITY, INITIAL LIQUIDITY
    mapping(address => uint256) public lpTokenQuantity;

    /**
     * @dev Function to add initial liquidity to the pool. Only callable by the owner.
     * @dev Needs the ERC-20 approval Sefor transferFrom.
     * @param _assetOneAmount The amount of the first asset to add.
     * @param _assetTwoAmount The amount of the second asset to add.
     */
    function addInitialLiquidity(
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    ) public onlyOwner {
        if (initialLiquidityProvidedTime[owner] > 0) {
            revert initialLiquidityAlreadyProvided();
        }
        initialLiquidityProvidedTime[tx.origin] = block.timestamp;

        // SENDS THE TOKENS TO THE LIQUIDITY POOL
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

        // SET THE INITIAL LIQUIDITY
        initialLiquidity = _assetOneAmount * _assetTwoAmount;
        liquidity = initialLiquidity;

        // GIVE LP TOKENS TO THE INITIAL LIQUIDITY PROVIDER
        lpTokenQuantity[tx.origin] = initialLiquidity;

        // EMIT EVENT
        emit liquidityAdded(tx.origin, _assetOneAmount, _assetTwoAmount);
    }

    /**
     * @dev Function to add additional liquidity to the pool.
     * @dev Needs the ERC-20 approval for transferFrom.
     * @param _asset The address of the first asset.
     * @param _secondAsset The address of the second asset.
     * @param _amount The amount of the first asset to add.
     */
    function addLiquidity(
        address _asset,
        address _secondAsset,
        uint256 _amount
    ) public nonReentrant {
        // SET THE RATIO, require token balance provided in ERC20, reverted if too low
        IERC20(_secondAsset).transferFrom(
            tx.origin,
            address(this),
            amountOfOppositeTokenNeeded(_asset, _amount)
        );
        IERC20(_asset).transferFrom(tx.origin, address(this), _amount);

        // give lp tokens to new liquidity provider
        lpTokenQuantity[tx.origin] += (_amount *
            amountOfOppositeTokenNeeded(_asset, _amount));
        liquidity += (_amount * amountOfOppositeTokenNeeded(_asset, _amount));

        // EMIT EVENT
        emit liquidityAdded(
            tx.origin,
            amountOfOppositeTokenNeeded(_asset, _amount),
            _amount
        );
    }

    /**
     * @dev Function to remove liquidity from the pool.
     * @param _amount The percentage of liquidity to withdraw(10 -> 10%).
     */
    function removeLiquidity(uint256 _amount) public nonReentrant {
        uint256 userLpTokens = lpTokenQuantity[tx.origin];
        uint256 percentageOfLiquidity = (userLpTokens * 1 ether) / liquidity; // How much user owns out of all Liquidity in percentage
        uint256 percentageOfUserLiquidity = (percentageOfLiquidity * _amount) /
            100; // How much out of their liquidity they want to withdraw in percentage
        uint256 resultAssetOne = (percentageOfUserLiquidity * getAssetOne()) /
            1 ether;
        uint256 resultAssetTwo = (percentageOfUserLiquidity * getAssetTwo()) /
            1 ether;
        // condition for owner, because of the initial liquidity timer
        if (
            (tx.origin == owner) &&
            (isTimeInitialLiquidity() == false) &&
            //the owner has the ability to withdraw liquidity if it wasn't part of initial liquidity
            ((lpTokenQuantity[tx.origin] - (resultAssetOne * resultAssetTwo)) <
                initialLiquidity)
        ) {
            revert notEnoughTokens();
        }
        // check balance if it is high enough to continue, can't get reverted at transfer, it should have the balance but just in case
        if (
            IERC20(assetOneAddress).balanceOf(address(this)) < resultAssetOne ||
            IERC20(assetTwoAddress).balanceOf(address(this)) < resultAssetTwo
        ) {
            revert notEnoughTokens();
        }
        IERC20(assetOneAddress).transfer(tx.origin, resultAssetOne);
        IERC20(assetTwoAddress).transfer(tx.origin, resultAssetTwo);

        // EMIT EVENT
        emit liquidityRemoved(msg.sender, resultAssetOne, resultAssetTwo);
    }

    function sellAsset(
        address _asset,
        uint256 _amount
    ) public payable nonReentrant returns (uint256) {
        if (_asset == assetOneAddress) {
            return _sellAssetOne(_amount);
        } else if (_asset == assetTwoAddress) {
            return _sellAssetTwo(_amount);
        } else {
            revert assetNotCorrect();
        }
    }

    /**
     * @dev Function to sell the first asset and receive the second asset.
     * @param _amount The amount of the first asset to sell.
     */
    function _sellAssetOne(uint256 _amount) private returns (uint256) {
        if (msg.value < swapFee) {
            revert notEnoughGas();
        }
        if (_amount > getAssetOne()) {
            revert amountTooBig();
        }
        yield += swapFee;

        //CALCULATION
        uint256 assetOne = getAssetOne() + _amount;
        uint256 newAssetTwo = liquidity / assetOne;
        uint256 result = getAssetTwo() - newAssetTwo;

        //SENDING THE OPPOSITE ASSET TO THE CALLER FROM LIQUIDITY POOL
        IERC20(assetOneAddress).transferFrom(tx.origin, address(this), _amount);
        IERC20(assetTwoAddress).transfer(tx.origin, result);
        //EVENTS
        emit priceChanged(assetOneAddress, assetOnePrice());
        emit priceChanged(assetTwoAddress, assetTwoPrice());
        // Returns the amount of token
        return result;
    }

    /**
     * @dev Function to sell the second asset and receive the first asset.
     * @param _amount The amount of the second asset to sell.
     */
    function _sellAssetTwo(uint256 _amount) private returns (uint256) {
        //PAY THE ETH FEE
        if (msg.value < swapFee) {
            revert notEnoughGas();
        }
        if (_amount > getAssetTwo()) {
            revert amountTooBig();
        }

        yield += swapFee;
        //CALCULATION
        uint256 assetTwo = getAssetTwo() + _amount;
        uint256 newAssetOne = liquidity / assetTwo;
        uint256 result = getAssetOne() - newAssetOne;

        //GETTING THE ASSET FROM CALLER TO THE LIQUIDITY POOL AND SENDING THE OPPOSITE ASSET TO THE CALLER FROM LIQUIDITY POOL
        IERC20(assetTwoAddress).transferFrom(tx.origin, address(this), _amount);
        IERC20(assetOneAddress).transfer(tx.origin, result);
        //EVENTS
        emit priceChanged(assetOneAddress, assetOnePrice());
        emit priceChanged(assetTwoAddress, assetTwoPrice());
        //Returns amount of token
        return result;
    }

    /**
     * @dev Function to get the current balance of a given asset held by the contract.
     * @param _address The address of the asset.
     * @return The current balance of the asset.
     */
    function getAssetBalance(address _address) public view returns (uint256) {
        return IERC20(_address).balanceOf(address(this));
    }

    /**
     * @dev Function to get the current price of the first asset in terms of the second asset.
     * @return The current price of the first asset * 10**18.
     */
    function assetOnePrice() public view returns (uint256) {
        return (getAssetTwo() * 1 ether) / getAssetOne();
    }

    /**
     * @dev Function to get the current price of the second asset in terms of the first asset.
     * @return The current price of the second asset * 10**18.
     */
    function assetTwoPrice() public view returns (uint256) {
        return (getAssetOne() * 1 ether) / getAssetTwo();
    }

    /**
     * @dev Function to get the amount of the first asset held by the contract.
     * @return The current balance of the first asset.
     */
    function getAssetOne() public view returns (uint256) {
        return IERC20(assetOneAddress).balanceOf(address(this));
    }

    /**
     * @dev Function to get the amount of the second asset held by the contract.
     * @return The current balance of the second asset.
     */
    function getAssetTwo() public view returns (uint256) {
        return IERC20(assetTwoAddress).balanceOf(address(this));
    }

    /**
     * @dev Function to get the quantity of LP tokens owned by a specific address.
     * @param _address The address of the LP token holder.
     * @return The quantity of LP tokens owned by the address.
     */
    function getLpTokenQuantity(
        address _address
    ) public view returns (uint256) {
        if (msg.sender != owner && _address == msg.sender) {
            revert addressNotCorrect();
        }
        return lpTokenQuantity[_address];
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

    function getYield() public {
        if (isTime() == false) {
            revert notEnoughTimePassed();
        }
        lastYieldFarmedTime[msg.sender] = block.timestamp; // Reentrancy guard
        uint256 yieldSoFar = yieldTaken[msg.sender];
        uint256 userLiquidity = (lpTokenQuantity[msg.sender] * 100) / liquidity;
        uint256 availableYield = ((yield -
            ((yieldSoFar * 100) / userLiquidity)) * userLiquidity) / 100;
        if (availableYield > address(this).balance) {
            revert notEnoughTokens();
        }
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
