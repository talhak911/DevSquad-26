// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenB is ERC20 {
    constructor() ERC20("Token B", "TKNB") {
        // Mint initial supply of 1,000,000 TKNB to the deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    // Public faucet function to allow users to mint test Token B for swapping or liquidity
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
