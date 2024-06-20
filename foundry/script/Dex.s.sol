// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DEX} from "../src/DEX.sol";

contract DexScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();
    }
}
