// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DEX} from "../src/DEX.sol";
import {JapanToken} from "../src/JapanToken.sol";
import {GSToken} from "../src/GSToken.sol";

contract DexTest is Test {
    DEX public Dex;
    GSToken public gsToken;
    JapanToken public japanToken;
    uint256 public maxSupply = 1000;
    address public user1 = address(1);
    address public user2 = address(2);
    address public user3 = address(3);

    function setUp() public {
        vm.startPrank(user1, user1);
        Dex = new DEX();
        Dex.grantAdmin(address(this));
    }

    // function test_createLiquidityPool() public {
    //     Dex.createLiquidityPool(address(gsToken), address(japanToken));

    //     // Verify if the pool is created by checking the pools list
    //     address[] memory pools = Dex.getPools();
    //     assertEq(pools.length, 1, "Liquidity pool should be created");
    //     console.log("Pool created: ", pools[0]);
    // }
    function test_createLiquidityPoolAndAddLiquidissty() public {
        // Dex.createLiquidityPool(address(gsToken), address(japanToken));
        // Verify if the pool is created by checking the pools list
        // address[] memory pools = Dex.getPools();
        // assertEq(pools.length, 1, "Liquidity pool should be created");
        // console.log("Pool created: ", pools[0]);
        // gsToken.approve(address(Dex), 100);
        // japanToken.approve(address(Dex), 100);
        // // not the owner need to set tx.origin
        // Dex.addInitialLiquidity(Dex.getPools()[0], 100, 100);
        // // check balance of the msg.sender
        // console.log(
        //     "Balance of the msg.sender: ",
        //     gsToken.balanceOf(address(this))
        // );
        // console.log(
        //     "Balance of the msg.sender: ",
        //     japanToken.balanceOf(address(this))
        // );
        // console.log("Liquidity added");
    }

    function test_CreatePool() public {
        gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        Dex.createLiquidityPool(address(gsToken), address(japanToken));
        // Verify if the pool is created by checking the pools list
        address[] memory pools = Dex.getPools();
        assertEq(pools.length, 1, "Liquidity pool should be created");
        console.log("Pool created: ", pools[0]);
    }

    function test_createLiquidityPoolAndAddLiquidity() public {
        gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        Dex.createLiquidityPool(address(gsToken), address(japanToken));
        // Verify if the pool is created by checking the pools list
        address[] memory pools = Dex.getPools();
        assertEq(pools.length, 1, "Liquidity pool should be created");
        console.log("Pool created: ", pools[0]);
        gsToken.approve(address(pools[0]), 100);
        japanToken.approve(address(pools[0]), 100);
        console.log("poolFactory", Dex.getPoolFactory());
        console.log(
            "Balance of the msg.sender: Before adding liquidity",
            gsToken.balanceOf(address(user1))
        );
        console.log(
            "Balance of the msg.sender: Before adding liquidity",
            japanToken.balanceOf(address(user1))
        );
        uint gsTokenAmountBefore = gsToken.balanceOf(address(user1));
        uint japanTokenAmountBefore = japanToken.balanceOf(address(user1));

        Dex.addInitialLiquidity(address(pools[0]), 100, 100);
        // check balance of the msg.sender
        console.log(
            "Balance of the msg.sender: ",
            gsToken.balanceOf(address(user1))
        );
        console.log(
            "Balance of the msg.sender: ",
            japanToken.balanceOf(address(user1))
        );
        uint gsTokenAmountAfter = gsToken.balanceOf(address(user1));
        uint japanTokenAmountAfter = japanToken.balanceOf(address(user1));
        // assert if the balance of the user is less than the balance before adding liquidity
        assert(gsTokenAmountBefore > gsTokenAmountAfter);
    }

    function test_removeLiquidity() public {
        gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        Dex.createLiquidityPool(address(gsToken), address(japanToken));
        // Verify if the pool is created by checking the pools list
        address[] memory pools = Dex.getPools();
        assertEq(pools.length, 1, "Liquidity pool should be created");
        console.log("Pool created: ", pools[0]);
        gsToken.approve(address(pools[0]), 100);
        japanToken.approve(address(pools[0]), 100);
        // check allowance pools[0]
        console.log(
            "Balance of the msg.sender: ",
            gsToken.balanceOf(address(user1))
        );
        console.log(
            "Balance of the msg.sender: ",
            japanToken.balanceOf(address(user1))
        );
        console.log("poolFactory", Dex.getPoolFactory());

        // Dex.addInitialLiquidity(Dex.getPools()[0], 100, 100);
        Dex.addInitialLiquidity(address(pools[0]), 100, 100);
        // check balance of the msg.sender
        console.log(
            "Balance of the msg.sender: ",
            gsToken.balanceOf(address(user1))
        );
        console.log(
            "Balance of the msg.sender: ",
            japanToken.balanceOf(address(user1))
        );
        uint gsTokenAmountBefore = gsToken.balanceOf(address(user1));
        uint japanTokenAmountBefore = japanToken.balanceOf(address(user1));

        Dex.removeLiquidity(address(pools[0]), 100);

        uint gsTokenAmountAfter = gsToken.balanceOf(address(user1));
        uint japanTokenAmountAfter = japanToken.balanceOf(address(user1));

        console.log(
            "Balance of the msg.sender: after remove liquidity",
            gsToken.balanceOf(address(user1))
        );
        console.log(
            "Balance of the msg.sender: after remove liquidity",
            japanToken.balanceOf(address(user1))
        );

        // assert if eq the balance of the user before adding liquidity
        assertEq(gsTokenAmountBefore + 100, gsTokenAmountAfter);
    }
}
