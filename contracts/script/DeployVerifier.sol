// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
// import {HonkVerifier} from "../contracts/Verifier.sol";

contract DeployVerifier is Script {
    function run() external {
        // Obtiene la clave privada desde ENV (ej: .env)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Inicia la transacción como el deployer
        vm.startBroadcast(deployerPrivateKey);

        // Despliega el contrato Verifier
        //  Verifier verifier = new Verifier();

        // Muestra la dirección en consola
        //   console.log("Verifier deployed at:", address(verifier));

        vm.stopBroadcast();
    }
}