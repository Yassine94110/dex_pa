// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DEX} from "../src/DEX.sol";
import {ERC20Factory} from "../src/ERC20Factory.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract DexScript is Script {
    DEX public dex;
    ERC20Factory public erc20Factory;
    uint256 maxSupply = (10 ** 18) * (10 ** 12);

    address account1 = 0xA21039F3c7ba23C1fC14BBD59481e0E7f085C68d; // Hamza admin
    address account3 = 0xE1E71b5FeA42cBa159fF3f12C4C104eE38a33a2F; // Teyik0 admin
    address account4 = 0x1232627c42266AfE57626da09948B6ED55C899C0; // Teyik0 user

    function approveTokens(
        address tokenAddress1,
        address tokenAddress2,
        uint256 amount
    ) internal {
        address pool = dex.getPool(tokenAddress1, tokenAddress2);
        IERC20 token1 = IERC20(tokenAddress1);
        token1.approve(pool, amount);
        IERC20 token2 = IERC20(tokenAddress2);
        token2.approve(pool, amount);
    }

    function transferTokensTo(
        address[10] memory tokenAddress,
        address to,
        uint256 amount
    ) internal {
        address[] memory tokens = new address[](tokenAddress.length);
        for (uint256 i = 0; i < tokenAddress.length; i++) {
            tokens[i] = tokenAddress[i];
        }
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).transfer(to, amount);
        }
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

            dex.grantAdmin(account1);
            dex.grantAdmin(account3);
            erc20Factory = new ERC20Factory();

            erc20Factory.createToken("GalaxySwapProtocol", "GST", maxSupply);
            erc20Factory.createToken("Solstice", "SOL", maxSupply);
            erc20Factory.createToken("Nebula", "NBL", maxSupply);
            erc20Factory.createToken("Aether", "AET", maxSupply);
            erc20Factory.createToken("Zephyr", "ZPH", maxSupply);
            erc20Factory.createToken("Lumin", "LMN", maxSupply);
            erc20Factory.createToken("Orion", "ORN", maxSupply);
            erc20Factory.createToken("Phoenix", "PHX", maxSupply);
            erc20Factory.createToken("Aurora", "AUR", maxSupply);
            erc20Factory.createToken("Celestia", "CLT", maxSupply);
            erc20Factory.createToken("Horizon", "HRZ", maxSupply);

            address[10] memory tokenAddresses = [
                erc20Factory.getToken(0).tokenAddress,
                erc20Factory.getToken(1).tokenAddress,
                erc20Factory.getToken(2).tokenAddress,
                erc20Factory.getToken(3).tokenAddress,
                erc20Factory.getToken(4).tokenAddress,
                erc20Factory.getToken(5).tokenAddress,
                erc20Factory.getToken(6).tokenAddress,
                erc20Factory.getToken(7).tokenAddress,
                erc20Factory.getToken(8).tokenAddress,
                erc20Factory.getToken(9).tokenAddress
            ];
            for (uint256 i = 0; i < tokenAddresses.length; i++) {
                console.log("Token address: ", tokenAddresses[i]);
            }
            transferTokensTo(tokenAddresses, account1, 1000000 * 1 ether);
            transferTokensTo(tokenAddresses, account3, 1000000 * 1 ether);
            transferTokensTo(tokenAddresses, account4, 1000000 * 1 ether);

            dex.createLiquidityPool(tokenAddresses[0], tokenAddresses[1]);
            dex.createLiquidityPool(tokenAddresses[2], tokenAddresses[3]);
            dex.createLiquidityPool(tokenAddresses[4], tokenAddresses[5]);
            dex.createLiquidityPool(tokenAddresses[6], tokenAddresses[7]);
            dex.createLiquidityPool(tokenAddresses[8], tokenAddresses[9]);

            approveTokens(
                tokenAddresses[0],
                tokenAddresses[1],
                100000000 * 1 ether
            );
            approveTokens(
                tokenAddresses[2],
                tokenAddresses[3],
                100000000 * 1 ether
            );
            approveTokens(
                tokenAddresses[4],
                tokenAddresses[5],
                100000000 * 1 ether
            );
            approveTokens(
                tokenAddresses[6],
                tokenAddresses[7],
                100000000 * 1 ether
            );
            approveTokens(
                tokenAddresses[8],
                tokenAddresses[9],
                100000000 * 1 ether
            );

            dex.addInitialLiquidity(
                dex.getPool(tokenAddresses[0], tokenAddresses[1]),
                100000 * 1 ether,
                100000 * 1 ether
            );
            dex.addInitialLiquidity(
                dex.getPool(tokenAddresses[2], tokenAddresses[3]),
                100000 * 1 ether,
                200000 * 1 ether
            );
            dex.addInitialLiquidity(
                dex.getPool(tokenAddresses[4], tokenAddresses[5]),
                100000 * 1 ether,
                300000 * 1 ether
            );
            dex.addInitialLiquidity(
                dex.getPool(tokenAddresses[6], tokenAddresses[7]),
                180000 * 1 ether,
                400000 * 1 ether
            );
            dex.addInitialLiquidity(
                dex.getPool(tokenAddresses[8], tokenAddresses[9]),
                280000 * 1 ether,
                435000 * 1 ether
            );

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
