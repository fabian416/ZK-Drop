// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ZKL} from "./erc_tokens/ZKL.sol";

contract MockedAirdropContract {
    ZKL public zkl;
    uint256 public airdrop_amount;

    constructor(uint256 _airdrop_amount, uint256 circulating_supply) {
        zkl = new ZKL();
        airdrop_amount = _airdrop_amount;
        zkl.mint(address(this), circulating_supply);
    }

    function airdrop() public {
        zkl.transfer(msg.sender, airdrop_amount);
    }

}