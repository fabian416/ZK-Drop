// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {PreSale} from "../src/PreSale.sol";
import {MockUSDC} from "../src/erc_tokens/MockUSDC.sol";
import {ZKL} from "../src/erc_tokens/ZKL.sol";


contract DeployPresaleContract is Script {

    function run() public {
        vm.startBroadcast();

        ZKL zkl = new ZKL();
        MockUSDC usdc = new MockUSDC();
        new PreSale(address(usdc), address(zkl));
        
        vm.stopBroadcast();
    }
}