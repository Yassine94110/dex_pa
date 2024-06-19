// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./LiquidityPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";




contract PoolTracker {


    address[] private allPools;
     mapping(address => mapping(address => address)) private poolRegistry;


    event PoolCreated(address indexed pool, address token1, address token2);

    function createPool(address _token1, address _token2) internal  {
        require(_token1 != _token2, "Tokens must be different");
        (address tokenA, address tokenB) = _token1 < _token2 ? (_token1, _token2) : (_token2, _token1);
        require(poolRegistry[tokenA][tokenB] == address(0), "Pool already exists");

        LiquidityPool pool = new LiquidityPool(tokenA, tokenB);
        allPools.push(address(pool));
        poolRegistry[tokenA][tokenB] = address(pool);

        emit PoolCreated(address(pool), tokenA, tokenB);
    }

    

    function getAllPools() internal view returns (address[] memory) {
        return allPools;
    }
    
   function getPool(address _token1, address _token2) public view returns (address) {
        (address tokenA, address tokenB) = _token1 < _token2 ? (_token1, _token2) : (_token2, _token1);
        return poolRegistry[tokenA][tokenB];
    }

    
}