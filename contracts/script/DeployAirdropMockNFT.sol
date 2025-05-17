// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AirdropMockNFT} from "../src/AirdropMockNFT.sol";

contract DeployAirdropMockNFT is Script {
    function run() external {
        // Verifier addres hardcoded
        address verifierAddress = 0x5ddF795A03C9bd399739FA02BB973D877993ba02;

        vm.startBroadcast();

        // Deploy the contract
        AirdropMockNFT nftDrop = new AirdropMockNFT(verifierAddress);

        console.log("AirdropMockNFT deployed at:", address(nftDrop));
        vm.stopBroadcast();
    }
}