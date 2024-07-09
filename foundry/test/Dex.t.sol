// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DEX} from "../src/DEX.sol";
import {JapanToken} from "../src/Japan.sol";
import {GSToken} from "../src/GSToken.sol";


contract CounterTest is Test {
    DEX public Dex;
    GSToken public gsToken;
    JapanToken public japanToken;
    uint256 public maxSupply = 1000;


    function setUp() public {
         gsToken = new GSToken(maxSupply);
        japanToken = new JapanToken(maxSupply);
        Dex = new DEX();
        Dex.grantAdmin(address(this));

    }
    function test_createLiquidityPool() public {
        Dex.createLiquidityPool(address(gsToken),address(japanToken));

        // Verify if the pool is created by checking the pools list
        address[] memory pools = Dex.getPools();
        assertEq(pools.length, 1, "Liquidity pool should be created");
        console.log("Liquidity Pool Created");
    }
    



  


}
