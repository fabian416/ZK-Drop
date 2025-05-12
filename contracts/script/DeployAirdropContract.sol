// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {AirdropContracts} from "../src/AirdropContracts.sol";

contract DeployAirdropContract is Script {
    uint256 public _airdrop_amount = 0.5 ether;
    uint256 public _circulating_supply = 500 ether;
    
    function run() public {
        vm.startBroadcast();
        new AirdropContracts(_airdrop_amount, _circulating_supply);
        vm.stopBroadcast();
    }
}