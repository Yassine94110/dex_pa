// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./RoleManager.sol";
import "./PoolTracker.sol";
import "./ILiquidityPool.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract DEX is RoleManager, PoolTracker {
    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor() {
        _grantRole(ROLE_ADMIN, msg.sender);
    }

    function createLiquidityPool(
        address _token1,
        address _token2
    ) public onlyRole(ROLE_ADMIN) {
        createPool(_token1, _token2);
    }

    function addInitialLiquidity(
        address _pool,
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    ) public {
        ILiquidityPool pool = ILiquidityPool(_pool);
        pool.addInitialLiquidity(_assetOneAmount, _assetTwoAmount);
    }

    function removeLiquidity(address _pool, uint256 _amount) public {
        ILiquidityPool pool = ILiquidityPool(_pool);
        pool.removeLiquidity(_amount);
    }

    function swap(
        address _pool,
        address _tokenIn,
        uint256 _amountIn
    ) public payable returns (uint256 amountOut) {
        ILiquidityPool pool = ILiquidityPool(_pool);
        uint256 swapFee = pool.getSwapFee();
        require(msg.value >= swapFee, "notEnoughGas");

        if (_tokenIn == pool.assetOneAddress()) {
            amountOut = pool.sellAssetOne{value: msg.value}(_amountIn);
        } else {
            amountOut = pool.sellAssetTwo{value: msg.value}(_amountIn);
        }

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
        return getAllPools();
    }

    receive() external payable onlyRole(ROLE_ADMIN) {}

    fallback() external payable onlyRole(ROLE_ADMIN) {}
}
