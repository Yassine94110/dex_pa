// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILiquidityPool {
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

    function sellAssetOne(uint256 _amount) external payable returns (uint256);

    function sellAssetTwo(uint256 _amount) external payable returns (uint256);

    function getSwapQuantity(
        address sellingAsset,
        uint256 _amount
    ) external view returns (uint256);

    function assetOneAddress() external view returns (address);

    function assetTwoAddress() external view returns (address);

    function getSwapFee() external payable returns (uint256);
}
