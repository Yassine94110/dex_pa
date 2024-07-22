// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DEX} from "../src/DEX.sol";
import {GSToken} from "../src/GSToken.sol";
import {JapanToken} from "../src/JapanToken.sol";
import {ERC20Factory} from "../src/ERC20Factory.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract DexScript is Script {
    DEX public dex;
    GSToken public gsToken;
    JapanToken public japanToken;
    ERC20Factory public erc20Factory;

    address account1 = 0xA21039F3c7ba23C1fC14BBD59481e0E7f085C68d; // Hamza admin
    // address account2 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // Hamza user

    address account3 = 0xE1E71b5FeA42cBa159fF3f12C4C104eE38a33a2F; // Teyik0 admin
    address account4 = 0x1232627c42266AfE57626da09948B6ED55C899C0; // Teyik0 user

    // address account5 = 0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C; // Cyass admin
    // address account6 = 0x6B0C5F0E5d4c9fC31Ff9D3Ff5efb3b5fBf2Df8E2; // Cyass user

    function approveTokens(uint256 amount, address liquidityPool) internal {
        gsToken.approve(address(liquidityPool), amount);
        japanToken.approve(address(liquidityPool), amount);
    }

    function transferTokensTo(address to, uint256 amount) internal {
        gsToken.transfer(to, amount);
        japanToken.transfer(to, amount);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("WALLET_PRIVATE_KEY");

        uint256 id;
        assembly {
            id := chainid()
        }
        if (id == 11155111) {
            //SEPOLIA
            vm.startBroadcast(deployerPrivateKey);

            console.log("Deploying DEX contract...");
            dex = new DEX();
            console.log("DEX contract deployed at:", address(dex));
            address ownerOfDex = dex.owner();
            console.log("Owner of the dex: ", ownerOfDex);

            console.log("Deploying GSToken contract...");
            uint256 maxSupply1 = (10 ** 18) * (10 ** 12);
            gsToken = new GSToken(maxSupply1);
            console.log("GSToken contract deployed at:", address(gsToken));

            console.log("Deploying JapanToken contract...");
            uint256 maxSupply2 = (10 ** 18) * (10 ** 10);
            japanToken = new JapanToken(maxSupply2);
            console.log(
                "JapanToken contract deployed at:",
                address(japanToken)
            );

            console.log("Creating a liquidity pool...");
            dex.createLiquidityPool(address(gsToken), address(japanToken));
            console.log("Liquidity pool created.");
            console.log("Adding initial liquidity with ratio 1:1...");
            address pool = dex.getPool(address(gsToken), address(japanToken));
            approveTokens(10000 * 1 ether, pool);
            dex.addInitialLiquidity(pool, 10000 * 1 ether, 10000 * 1 ether);
            console.log("Initial liquidity added.");

            console.log("Give token to some addresses...");
            transferTokensTo(account1, 100000 * 1 ether);
            transferTokensTo(account3, 100000 * 1 ether);
            transferTokensTo(account4, 100000 * 1 ether);
            console.log("Tokens given successfully.");

            console.log("Give right accesses to the accounts...");
            dex.grantAdmin(account1);
            dex.grantAdmin(account3);
            console.log("Accesses granted successfully.");

            // create factory
            console.log("Deploying ERC20Factory contract...");
            erc20Factory = new ERC20Factory();
            console.log("ERC20Factory contract deployed at:", address(erc20Factory));
            // create 10 token 
            console.log("Creating 10 tokens...");
            for (uint256 i = 0; i < 10; i++) {
                erc20Factory.createToken(string.concat("Token", string(abi.encodePacked(i))), string.concat("T" , string(abi.encodePacked(i))), 100000 * 1 ether);
            }
            console.log("10 tokens created successfully.");
            // create 5 liquidity pool
            console.log("Creating 4 liquidity pools...");
            for (uint256 i = 0; i < 5; i++) {
                address token1 = erc20Factory.getToken(i).tokenAddress;
                address token2 = erc20Factory.getToken(i + 5).tokenAddress;
                dex.createLiquidityPool(token1, token2);
            }
            console.log("4 liquidity pools created successfully.");
            // add initial liquidity
            console.log("Adding initial liquidity to the pools...");
            for (uint256 i = 0; i < 5; i++) {
                address token1 = erc20Factory.getToken(i).tokenAddress;
                address token2 = erc20Factory.getToken(i + 5).tokenAddress;
                address pool = dex.getPool(token1, token2);
                // approve tokens
                IERC20(token1).approve(pool, 10000 * 1 ether);
                IERC20(token2).approve(pool, 10000 * 1 ether);
                dex.addInitialLiquidity(pool, 10000 * 1 ether, 10000 * 1 ether);
            }




            vm.stopBroadcast();
        }
    }
}

/* 
1. To load the .env in the shell:
-> source .env

2. To run the deploy script:
-> Simulation: forge script script/Dex.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $WALLET_PRIVATE_KEY
-> Production: forge script script/Dex.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $WALLET_PRIVATE_KEY --broadcast

3. Deploy the DEX contract without using the script:
-> forge create --rpc-url $SEPOLIA_RPC_URL --private-key $WALLET_PRIVATE_KEY src/DEX.sol:DEX
*/
