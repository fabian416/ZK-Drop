# Build the circuit
nargo build

# Generate the verification key. You need to pass the `--oracle_hash keccak` flag when generating vkey and proving
# to instruct bb to use keccak as the hash function, which is more optimal in Solidity
bb write_vk -b ./target/bounding.json -o ./target --oracle_hash keccak

# Generate the Solidity verifier from the vkey
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol

# Copy the verifier to the contracts
cp ./target/Verifier.sol ../../../contracts/src/Verifier.sol

cd ../../../contracts/

forge build

cp ./out/Verifier.sol/HonkVerifier.json ../zk-front/src/lib/abis/HonkVerifier.json
cp ./out/MockUSDC.sol/MockUSDC.json ../zk-front/src/lib/abis/MockUSDC.json
cp ./out/MockUSDC.sol/ZKL.json ../zk-front/src/lib/abis/ZKL.json
cp ./out/AirdropContracts.sol/AirdropContracts.json ../zk-front/src/lib/abis/AirdropContracts.json
cp ./out/MockUSDC.sol/PreSale.sol.json ../zk-front/src/lib/abis/PreSale.sol.json
