// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DEX} from "../src/DEX.sol";

contract CounterTest is Test {
    DEX public Dex;

    function setUp() public {
        Dex = new DEX();
    }
}
