// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ILiquidityPool {
    function initialLiquidity() external view returns (uint256);

    function addInitialLiquidity(
        uint256 _assetOneAmount,
        uint256 _assetTwoAmount
    ) external;

    function addLiquidity(
        address _asset,
        address _secondAsset,
        uint256 _amount
    ) external;

    function removeLiquidity(uint256 _amount) external;

    function sellAsset(
        address asset,
        uint256 _amount
    ) external payable returns (uint256);

    function getSwapQuantity(
        address sellingAsset,
        uint256 _amount
    ) external view returns (uint256);

    function assetOneAddress() external view returns (address);

    function assetTwoAddress() external view returns (address);

    function getSwapFee() external payable returns (uint256);
}
