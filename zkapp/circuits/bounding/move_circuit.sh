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
