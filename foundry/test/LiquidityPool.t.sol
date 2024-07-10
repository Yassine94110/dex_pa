// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {GSToken} from "../src/GSToken.sol";
import {JapanToken} from "../src/JapanToken.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

error Unauthorized();
error initialLiquidityAlreadyProvided();

contract LiquidityPoolTest is Test {
    LiquidityPool public liquidityPool;
    GSToken public gsToken;
    JapanToken public japanToken;

    uint256 public maxSupply1 = (10 ** 18) * (10 ** 12);
    uint256 public maxSupply2 = (10 ** 18) * (10 ** 10);
    uint256 public largeAmount = 10 ** 18 * 10 ** 6;
    uint256 initialAmount = 10;

    address public owner = address(this);
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        gsToken = new GSToken(maxSupply1);
        japanToken = new JapanToken(maxSupply2);
        liquidityPool = new LiquidityPool(
            address(gsToken),
            address(japanToken)
        );

        approveTokens(owner, largeAmount);
    }

    function approveTokens(address account, uint256 amount) internal {
        vm.startPrank(account);
        gsToken.approve(address(liquidityPool), amount);
        japanToken.approve(address(liquidityPool), amount);
        vm.stopPrank();
    }

    function transferTokensTo(
        address from,
        address to,
        uint256 amount
    ) internal {
        vm.startPrank(from);
        gsToken.transfer(to, amount);
        japanToken.transfer(to, amount);
        vm.stopPrank();
    }

    function test_changeSwapFee_asOwner() public {
        assertEq(liquidityPool.swapFee(), 10 ** 15); // 10 ** 15 = 1% fee
        liquidityPool.changeSwapFee(10 ** 15 * 2); // 10 ** 15 * 2 = 2% fee
        assertEq(liquidityPool.swapFee(), 10 ** 15 * 2);
    }

    function test_changeSwapFee_revertIfNotOwner() public {
        vm.expectRevert(Unauthorized.selector);
        vm.prank(user1);
        liquidityPool.changeSwapFee(10 ** 15 * 9);
    }

    function addInitialLiquidity(uint256 amount) public {
        gsToken.approve(address(liquidityPool), largeAmount);
        japanToken.approve(address(liquidityPool), largeAmount);

        vm.startPrank(address(this), address(this));
        liquidityPool.addInitialLiquidity(amount, amount);
        uint256 constantK = amount * amount;
        assertEq(liquidityPool.lpTokenQuantity(address(this)), constantK);
        vm.stopPrank();
    }

    function test_addInitialLiquidity_asOwner() public {
        assertEq(liquidityPool.lpTokenQuantity(address(this)), 0);
        addInitialLiquidity(initialAmount);
    }

    function test_addInitialLiquidity_revertIfNotOwner() public {
        transferTokensTo(owner, user1, largeAmount);
        approveTokens(user1, largeAmount);

        vm.startPrank(user1, user1);
        vm.expectRevert(Unauthorized.selector);
        liquidityPool.addInitialLiquidity(initialAmount, initialAmount);
        vm.stopPrank();
    }

    function test_addInitialLiquidity_revertIfAlreadyProvided() public {
        addInitialLiquidity(initialAmount);
        vm.prank(address(this), address(this));
        vm.expectRevert(initialLiquidityAlreadyProvided.selector);
        liquidityPool.addInitialLiquidity(initialAmount, initialAmount);
    }

    function addLiquidity(address user, uint256 amount) public {
        vm.startPrank(user, user);
        liquidityPool.addLiquidity(
            address(gsToken),
            address(japanToken),
            amount
        );
        vm.stopPrank();
    }

    function test_addLiquidity() public {
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 100000);
        approveTokens(user1, largeAmount);

        uint256 amountToAdd = 20;
        addLiquidity(user1, amountToAdd);
        uint256 oppositeTokenNeeded = liquidityPool.amountOfOppositeTokenNeeded(
            address(gsToken),
            amountToAdd
        );
        assertEq(
            liquidityPool.liquidity(),
            initialAmount * initialAmount + amountToAdd * oppositeTokenNeeded
        );
    }

    function test_addLiquidity_revertIfNotEnoughAllowance() public {
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 100000);
        uint256 allowance = 10;
        approveTokens(user1, allowance);

        uint256 amountToAdd = 20;
        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientAllowance.selector,
                address(liquidityPool),
                allowance,
                amountToAdd
            )
        );
        addLiquidity(user1, amountToAdd);
    }

    function test_addLiquidity_withOtherAccount() public {
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 10000);
        approveTokens(user1, largeAmount);

        uint256 amountToAdd = 200;
        addLiquidity(user1, amountToAdd);
        uint256 oppositeTokenNeeded = liquidityPool.amountOfOppositeTokenNeeded(
            address(gsToken),
            amountToAdd
        );
        assertEq(
            liquidityPool.liquidity(),
            initialAmount * initialAmount + amountToAdd * oppositeTokenNeeded
        );
    }

    function test_addLiquidity_revertIfNotEnoughBalance() public {
        addInitialLiquidity(initialAmount);
        uint256 tokenToTransfer = 10;
        transferTokensTo(owner, user1, tokenToTransfer);
        approveTokens(user1, largeAmount);

        uint256 amountToAdd = 20;
        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientBalance.selector,
                address(1),
                tokenToTransfer,
                amountToAdd
            )
        );
        addLiquidity(user1, amountToAdd);
    }

    function test_sellAsset_firstAsset() public {
        initialAmount = 10 ** 18 * 10 ** 6;
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 10000);
        approveTokens(user1, largeAmount);

        vm.deal(user1, 1 ether);
        vm.startPrank(user1, user1);
        uint256 amountToSell = 1000;
        uint256 initialBalance = gsToken.balanceOf(user1);
        liquidityPool.sellAsset{value: liquidityPool.swapFee()}(
            address(gsToken),
            amountToSell
        );

        uint256 finalBalance = gsToken.balanceOf(user1);
        assertEq(finalBalance, initialBalance - amountToSell);
        vm.stopPrank();
    }

    function test_sellAsset_secondAsset() public {
        initialAmount = 10 ** 18 * 10 ** 6;
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 10000);
        approveTokens(user1, largeAmount);

        vm.deal(user1, 1 ether);
        vm.startPrank(user1, user1);
        uint256 amountToSell = 1000;
        uint256 initialBalance = japanToken.balanceOf(user1);
        liquidityPool.sellAsset{value: liquidityPool.swapFee()}(
            address(japanToken),
            amountToSell
        );

        uint256 finalBalance = japanToken.balanceOf(user1);
        assertEq(finalBalance, initialBalance - amountToSell);
        vm.stopPrank();
    }

    function test_getSwapQuantity() public {
        initialAmount = 10 ** 18 * 10 ** 6;
        addInitialLiquidity(initialAmount);
        transferTokensTo(owner, user1, 10000);
        approveTokens(user1, largeAmount);

        vm.deal(user1, 1 ether);
        uint256 amountToSell = 1000;
        uint256 swapQuantity = liquidityPool.getSwapQuantity(
            address(gsToken),
            amountToSell
        );
        assertEq(swapQuantity, amountToSell);
    }

    // function test_removeLiquidity() public {
    //     addInitialLiquidity(initialAmount);
    //     uint256 tokenToTransfer = 10000;
    //     transferTokensTo(owner, user1, tokenToTransfer);
    //     approveTokens(user1, largeAmount);

    //     uint256 amountToAdd = 20;
    //     addLiquidity(user1, amountToAdd);

    //     vm.startPrank(user1, user1);
    //     uint256 oppositeTokenNeeded = liquidityPool.amountOfOppositeTokenNeeded(
    //         address(gsToken),
    //         amountToAdd
    //     );
    //     assertEq(
    //         liquidityPool.liquidity(),
    //         initialAmount * initialAmount + amountToAdd * oppositeTokenNeeded
    //     );
    //     console.log("total liquidity: ", liquidityPool.liquidity());
    //     console.log(
    //         "user liquidity: ",
    //         liquidityPool.lpTokenQuantity(address(1))
    //     );
    //     liquidityPool.removeLiquidity(10);
    //     console.log("total liquidity: ", liquidityPool.liquidity());
    //     console.log(
    //         "user liquidity: ",
    //         liquidityPool.lpTokenQuantity(address(1))
    //     );
    //     // assertEq(
    //     //     liquidityPool.lpTokenQuantity(address(this)),
    //     //     constantK - percentageOfUserLiquidity
    //     // );
    //     vm.stopPrank();
    // }
}
