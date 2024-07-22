// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Token.sol";

contract ERC20Factory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 initialSupply;
        address owner;
    }

    TokenInfo[] private tokens;

    event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 initialSupply, address owner);

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public returns (address) {
        ERC20Token token = new ERC20Token(name, symbol, initialSupply, msg.sender);
        TokenInfo memory newToken = TokenInfo({
            tokenAddress: address(token),
            name: name,
            symbol: symbol,
            initialSupply: initialSupply,
            owner: msg.sender
        });
        tokens.push(newToken);
        emit TokenCreated(address(token), name, symbol, initialSupply, msg.sender);
        return address(token);
    }

    function getTokens() public view returns (TokenInfo[] memory) {
        return tokens;
    }

    function getToken(uint256 index) public view returns (TokenInfo memory) {
        require(index < tokens.length, "Index out of bounds");
        return tokens[index];
    }
}
