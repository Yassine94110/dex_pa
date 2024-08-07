// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./LiquidityPool.sol";

contract PoolFactory {
    address[] private allPools;
    mapping(address => mapping(address => address)) private poolRegistry;

    event PoolCreated(address indexed pool, address token1, address token2);

    function createPool(
        address _token1,
        address _token2
    ) external returns (address) {
        require(_token1 != _token2, "Tokens must be different");
        (address tokenA, address tokenB) = _token1 < _token2
            ? (_token1, _token2)
            : (_token2, _token1);
        require(
            poolRegistry[tokenA][tokenB] == address(0),
            "Pool already exists"
        );

        LiquidityPool pool = new LiquidityPool(tokenA, tokenB, msg.sender);
        allPools.push(address(pool));
        poolRegistry[tokenA][tokenB] = address(pool);

        emit PoolCreated(address(pool), tokenA, tokenB);
        return address(pool);
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    function getPool(
        address _token1,
        address _token2
    ) external view returns (address) {
        (address tokenA, address tokenB) = _token1 < _token2
            ? (_token1, _token2)
            : (_token2, _token1);
        address pool = poolRegistry[tokenA][tokenB];
        if (pool == address(0)) {
            revert("Pool does not exist");
        }
        return pool;
    }
}
