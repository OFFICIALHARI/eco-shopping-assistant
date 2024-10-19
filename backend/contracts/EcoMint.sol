// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract EcoMint is ERC20, ERC20Burnable {
    address public owner;

    constructor() ERC20("EcoMint", "ECO") {
        owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    // Function to transfer tokens to another address
    function transferTokens(uint256 amount) external {
        address recipient = msg.sender;
        // require(msg.sender == owner, "Only the contract owner can transfer tokens");
        _transfer(owner, recipient, amount);
    }
}
