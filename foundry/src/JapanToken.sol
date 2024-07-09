// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JapanToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("JapanToken", "JPN") {
        _mint(msg.sender, initialSupply);
    }
}
