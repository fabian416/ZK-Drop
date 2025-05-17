// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NRH is ERC20 {
    constructor() ERC20("ZKL", "ZKL") {}

    /// @notice Allow to anyone to mint ZKL tokens
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}