// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./erc_tokens/NRH.sol"; // Tu contrato ERC721
import {IVerifier} from "./Verifier.sol"; // Interfaz esperada del Verifier generado por Noir

contract AirdropMockNFT {
    NRH public nrh;
    IVerifier public verifier;
    uint256 public nextTokenId;

    // mapping(uint256 => bool) public nullifierUsed; // ⚠️ Uncomment for production Sybil protection

    constructor(address _verifier) {
        nrh = new NRH();
        verifier = IVerifier(_verifier);
        nextTokenId = 1;
    }

    /**
     * @notice Mint NFT if user provides a valid ZK proof.
     * @param proof The ZK proof
     * @param publicInputs Expected: [minLat, maxLat, minLon, maxLon, regionHash, challenge, nullifier]
     */
    function airdrop(bytes calldata proof, bytes32[] calldata publicInputs) external {
        require(verifier.verify(proof, publicInputs), "Invalid ZK proof");

        // // Uncomment for production use
        // bytes32 nullifier = publicInputs[6];
        // require(!nullifierUsed[nullifier], "Nullifier already used");
        // nullifierUsed[nullifier] = true;

        nrh.mint(msg.sender, nextTokenId);
        nextTokenId++;
    }
}