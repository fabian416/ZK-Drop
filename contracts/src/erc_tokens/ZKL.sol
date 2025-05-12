// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZKL is ERC20 {

    constructor()ERC20("ZKL Token", "ZKL") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}