// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./PoolFactory.sol";
import "./ILiquidityPool.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IAccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/IAccessControlEnumerable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract DEX is AccessControl {
    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    bytes32 public constant ROLE_USER = keccak256("user");
    bytes32 public constant ROLE_ADMIN = keccak256("admin");
    bytes32 public constant ROLE_BANNED = keccak256("banned");
    PoolFactory private poolFactory;
    address public immutable owner;

    constructor() {
        owner = msg.sender;
        _grantRole(ROLE_ADMIN, msg.sender);
        _grantRole(ROLE_USER, msg.sender);
        poolFactory = new PoolFactory();
    }

    modifier hasNoRole() {
        require(
            !hasRole(ROLE_USER, msg.sender) && !hasRole(ROLE_ADMIN, msg.sender),
            "User already has a role"
        );
        _;
    }

    function createLiquidityPool(
        address _token1,
        address _token2
    ) external onlyRole(ROLE_ADMIN) {
        poolFactory.createPool(_token1, _token2);
    }

    function addInitialLiquidity(
        address _pool,
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    ) public onlyRole(ROLE_ADMIN) {
        require(
            hasRole(ROLE_USER, msg.sender) || hasRole(ROLE_ADMIN, msg.sender),
            "userNotAuthorized"
        );
        ILiquidityPool pool = ILiquidityPool(_pool);
        pool.addInitialLiquidity(_assetOneAmount, _assetTwoAmount);
    }

    function removeLiquidity(address _pool, uint256 _amount) public {
        ILiquidityPool pool = ILiquidityPool(_pool);
        pool.removeLiquidity(_amount);
    }

    function addLiquidity(
        address _asset,
        address _secondAsset,
        uint256 _amount
    ) public onlyRole(ROLE_USER) {
        ILiquidityPool pool = ILiquidityPool(
            poolFactory.getPool(_asset, _secondAsset)
        );
        pool.addLiquidity(_asset, _secondAsset, _amount);
    }

    function swap(
        address _pool,
        address _tokenIn,
        uint256 _amountIn
    ) public payable onlyRole(ROLE_USER) returns (uint256 amountOut) {
        ILiquidityPool pool = ILiquidityPool(_pool);
        require(
            _tokenIn == pool.assetOneAddress() ||
                _tokenIn == pool.assetTwoAddress(),
            "invalidToken for this pool address"
        );
        uint256 swapFee = pool.getSwapFee();

        require(msg.value >= swapFee, "notEnoughGas");
        amountOut = pool.sellAsset{value: msg.value}(_tokenIn, _amountIn);
        emit SwapExecuted(
            msg.sender,
            _tokenIn,
            _tokenIn == pool.assetOneAddress()
                ? pool.assetTwoAddress()
                : pool.assetOneAddress(),
            _amountIn,
            amountOut
        );
        return amountOut;
    }

    function getPools() public view returns (address[] memory) {
        return poolFactory.getAllPools();
    }

    function getPool(
        address _token1,
        address _token2
    ) public view returns (address) {
        return poolFactory.getPool(_token1, _token2);
    }

    // ROLE
    function register() public hasNoRole {
        _grantRole(ROLE_USER, msg.sender);
    }

    function ban(address _bannedUser) public onlyRole(ROLE_ADMIN) {
        renounceRole(ROLE_USER, _bannedUser);
        renounceRole(ROLE_ADMIN, _bannedUser);
        _grantRole(ROLE_BANNED, _bannedUser);
    }

    function unban(address _bannedUser) public onlyRole(ROLE_ADMIN) {
        renounceRole(ROLE_BANNED, _bannedUser);
        _grantRole(ROLE_USER, _bannedUser);
    }

    function grantAdmin(address _address) external onlyRole(ROLE_ADMIN) {
        _grantRole(ROLE_ADMIN, _address);
    }

    function isUser() public view returns (bool) {
        return hasRole(ROLE_USER, msg.sender);
    }
    // get poolFactory address
    function getPoolFactory() public view returns (address) {
        return address(poolFactory);
    }

    //

    receive() external payable onlyRole(ROLE_ADMIN) {}

    fallback() external payable onlyRole(ROLE_ADMIN) {}
}
