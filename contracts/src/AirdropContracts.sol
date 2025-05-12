// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BASE_ERC} from "./erc_tokens/BASE_ERC.sol";
import {HonkVerifier} from "./Verifier.sol";

contract AirdropContracts {
    BASE_ERC public base_erc;
    HonkVerifier public bonk_verifier;

    uint256 public airdrop_amount;

    constructor(uint256 _airdrop_amount) {
        base_erc = new BASE_ERC("BASE_ERC", "BASE", 1000000000000000000);
        bonk_verifier = new HonkVerifier();
        airdrop_amount = _airdrop_amount;
    }

    function airdrop(bytes memory proof, bytes32[] memory publicInputs) public {
        require(bonk_verifier.verify(proof, publicInputs), "Invalid proof");
        base_erc.transfer(msg.sender, airdrop_amount);
    }

}