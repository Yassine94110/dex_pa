// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {PoolFactory} from "../src/PoolFactory.sol";
import {GSToken} from "../src/GSToken.sol";
import {JapanToken} from "../src/JapanToken.sol";
import {ILiquidityPool} from "../src/ILiquidityPool.sol";

contract GSTokenTest is Test {
    PoolFactory public poolFactory;
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
        poolFactory = new PoolFactory();
        gsToken = new GSToken(maxSupply1);
        japanToken = new JapanToken(maxSupply2);
    }

    function test_createPool() public {
        address pool = poolFactory.createPool(
            address(gsToken),
            address(japanToken)
        );
        assertEq(ILiquidityPool(pool).initialLiquidity(), 0);
    }

    function test_createPool_revertCauseAlreadyExist() public {
        poolFactory.createPool(address(gsToken), address(japanToken));
        vm.expectRevert("Pool already exists");
        poolFactory.createPool(address(gsToken), address(japanToken));
    }

    function test_createPool_revertCauseAlreadyExist2() public {
        poolFactory.createPool(address(gsToken), address(japanToken));
        vm.expectRevert("Pool already exists");
        poolFactory.createPool(address(japanToken), address(gsToken));
    }

    function test_createPool_revertCauseSameToken() public {
        vm.expectRevert("Tokens must be different");
        poolFactory.createPool(address(gsToken), address(gsToken));
    }

    function test_getAllPools() public {
        poolFactory.createPool(address(gsToken), address(japanToken));
        address[] memory pools = poolFactory.getAllPools();
        assertEq(pools.length, 1);
    }

    function test_getPool() public {
        address poolVal = poolFactory.createPool(
            address(gsToken),
            address(japanToken)
        );
        address pool = poolFactory.getPool(
            address(gsToken),
            address(japanToken)
        );
        assertEq(poolVal, pool);
    }

    function test_getPool_inverseToken() public {
        address poolVal = poolFactory.createPool(
            address(gsToken),
            address(japanToken)
        );
        address pool = poolFactory.getPool(
            address(japanToken),
            address(gsToken)
        );
        assertEq(poolVal, pool);
    }

    function test_getPool_revertCauseNotExist() public {
        vm.expectRevert("Pool does not exist");
        poolFactory.getPool(address(gsToken), address(japanToken));
    }
}
