// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, 10_000_000_000 ether);
        _mint(0x53B05A3E5545d376246ce90185f97bc5cdf7E54f, 10_000_000_000 ether);
    }
}
