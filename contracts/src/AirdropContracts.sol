// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ZKL} from "./erc_tokens/ZKL.sol";
import {HonkVerifier} from "./Verifier.sol";

contract AirdropContracts {
    ZKL public zkl;
    HonkVerifier public bonk_verifier;

    uint256 public airdrop_amount;

    constructor(uint256 _airdrop_amount, uint256 circulating_supply) {
        zkl = new ZKL();
        bonk_verifier = new HonkVerifier();
        airdrop_amount = _airdrop_amount;
        zkl.mint(address(this), circulating_supply);
    }

    function airdrop(bytes memory proof, bytes32[] memory publicInputs) public {
        require(bonk_verifier.verify(proof, publicInputs), "Invalid proof");
        zkl.transfer(msg.sender, airdrop_amount);
    }

}