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
        gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        Dex = new DEX();
        Dex.grantAdmin(address(this));
        vm.stopPrank();
    }

    // function test_createLiquidityPool() public {
    //     Dex.createLiquidityPool(address(gsToken), address(japanToken));

    //     // Verify if the pool is created by checking the pools list
    //     address[] memory pools = Dex.getPools();
    //     assertEq(pools.length, 1, "Liquidity pool should be created");
    //     console.log("Pool created: ", pools[0]);
    // }
    function test_createLiquidityPoolAndAddLiquidity() public {
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
}
