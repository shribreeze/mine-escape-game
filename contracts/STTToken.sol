// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STTToken is ERC20, Ownable {
    constructor() ERC20("Somnia Test Token", "STT") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M STT
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function faucet() public {
        // Give 100 STT to anyone who calls this (for testing)
        _mint(msg.sender, 100 * 10**decimals());
    }
}