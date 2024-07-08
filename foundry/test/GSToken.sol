// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {GSToken} from "../src/GSToken.sol";

contract GSTokenTest is Test {
    GSToken public gsToken;

    function setUp() public {
        gsToken = new GSToken((10 ** 18) * (10 ** 6));
    }

    function test_transfer() public {
        assertEq(gsToken.totalSupply(), (10 ** 18) * (10 ** 6));
        gsToken.transfer(address(1), (10 ** 18) * (10 ** 3));
        assertEq(gsToken.balanceOf(address(1)), (10 ** 18) * (10 ** 3));
    }
}
