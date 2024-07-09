// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {GSToken} from "../src/GSToken.sol";
import {JapanToken} from "../src/JapanToken.sol";

error Unauthorized();

contract LiquidityPoolTest is Test {
    LiquidityPool public liquidityPool;
    GSToken public gsToken;
    JapanToken public japanToken;
    uint256 public maxSupply = 100000;

    // uint256 public maxSupply = (10 ** 18) * (10 ** 12);

    function setUp() public {
        gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        liquidityPool = new LiquidityPool(
            address(gsToken),
            address(japanToken)
        );
    }

    function test_changeSwapFeeAsOwner() public {
        assertEq(liquidityPool.swapFee(), 10 ** 15); // 10 ** 15 = 1% fee
        liquidityPool.changeSwapFee(10 ** 15 * 2); // 10 ** 15 * 2 = 2% fee
        assertEq(liquidityPool.swapFee(), 10 ** 15 * 2);
    }

    function test_changeSwapFeeRevertIfNotOwner() public {
        vm.expectRevert(Unauthorized.selector);
        vm.prank(address(0));
        liquidityPool.changeSwapFee(10 ** 15 * 9);
    }

    function test_addInitialLiquidityAsOwner() public {
        assertEq(liquidityPool.lpTokenQuantity(address(this)), 0);
        console.log("LiquidityPool owner: ", liquidityPool.owner());
        console.log("LiquidityPool address: ", address(liquidityPool));
        console.log(
            "gsToken balance: ",
            gsToken.balanceOf(address(this)),
            "japanToken balance: ",
            japanToken.balanceOf(address(this))
        );
        // give allowance to liquidityPool to spend tokens
        // uint256 largeAmount = 10 ** gsToken.decimals() * 10 ** 6;
        gsToken.approve(address(liquidityPool), 10000);
        japanToken.approve(address(liquidityPool), 10000);
        console.log(
            "gsToken allowance: ",
            gsToken.allowance(address(this), address(liquidityPool)),
            "japanToken allowance: ",
            japanToken.allowance(address(this), address(liquidityPool))
        );
        liquidityPool.addInitialLiquidity(1000, 1000);
        uint256 constantK = 10 ** gsToken.decimals() *
            10 ** 6 *
            10 ** japanToken.decimals() *
            10 ** 6;
        assertEq(liquidityPool.lpTokenQuantity(address(this)), constantK);
    }
}
