// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Talhak911 is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("Talhak911", "TK911") ERC20Permit("Talhak911") {
        _mint(msg.sender, initialSupply);
    }

    // Public faucet function to allow users to mint test Token A for swapping or liquidity
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
