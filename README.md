# ZK Drop

ZK Drop unlocks regional airdrops and token presales using zero-knowledge location proofs — without revealing your exact coordinates.

---

## 🔍 What It Does

ZK Drop allows users to prove that they are physically located within specific regions (like Argentina, Europe, or Asia) **without sharing their coordinates**.

This enables projects to offer:

- ✅ Regional airdrops (e.g., South America only)
- 🎯 Fair token presales by location
- 🔒 Private on-chain eligibility using ZK proofs

---

## 🧪 How It Works

1. User generates a ZK proof on their mobile using GNSS data + region hash.
2. A public QR code provides the circuit’s public inputs (`region_hash`, `challenge`, `nullifier`).
3. The proof is verified on-chain by a smart contract before allowing access to airdrops or presales.

---

## 🔧 Circuit Logic (Noir)

The circuit checks that:

- The user’s private GPS coordinates (`lat`, `lon`) are **within a valid bounding box**.
- The bounding box (`min_lat`, `max_lat`, `min_lon`, `max_lon`) matches the claimed `region_hash`.
- A challenge is included to generate a **nullifier** for session uniqueness or anti-replay protection.

```rust
use std::hash::poseidon;

fn main(
    lat: Field,
    lon: Field,
    min_lat: pub Field,
    max_lat: pub Field,
    min_lon: pub Field,
    max_lon: pub Field,
    region_hash: pub Field,
    challenge: pub Field,
    nullifier: pub Field,
) {
    // Cast to integers for comparison
    let lat_i32 = lat as i32;
    let lon_i32 = lon as i32;
    let min_lat_i32 = min_lat as i32;
    let max_lat_i32 = max_lat as i32;
    let min_lon_i32 = min_lon as i32;
    let max_lon_i32 = max_lon as i32;

    // Step 1: Verify location is within the region
    assert(lat_i32 >= min_lat_i32);
    assert(lat_i32 <= max_lat_i32);
    assert(lon_i32 >= min_lon_i32);
    assert(lon_i32 <= max_lon_i32);

    // Step 2: Verify region_hash is valid
    let computed_hash = poseidon::bn254::hash_4([min_lat, max_lat, min_lon, max_lon]);
    assert(computed_hash == region_hash);

    // Step 3: Prevent proof reuse with a nullifier
    let computed_nullifier = poseidon::bn254::hash_2([region_hash, challenge]);
    assert(computed_nullifier == nullifier);
}
```

---

## ✅ On-Chain Verification

Once the user generates the zero-knowledge proof on their mobile device (after scanning the QR code), they send the result back to the frontend. The frontend then submits the proof to a smart contract which verifies the user’s region without revealing coordinates.

### 🔐 Flow Overview

1. **Frontend** shows QR with public inputs (`region_hash`, bounding box, challenge).
2. **User** scans it with a mobile app and generates a ZK proof **locally** using GNSS data.
3. **Mobile app** sends `{ proof, publicInputs }` to the frontend (e.g. via QR, NFC, deep link, or server).
4. **Frontend** calls a Solidity smart contract that uses `verifier.sol` to verify the proof.
5. **If valid**, the contract lets the user:
   - Claim an airdrop
   - Purchase tokens during a regional presale
   - Access other regional features

---

### 🧱 Solidity Verifier Integration

A typical interaction looks like this:

```solidity
contract ZKDrop {
    IVerifier public verifier;
    mapping(bytes32 => bool) public usedNullifiers;

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    function claimAirdrop(bytes calldata proof, bytes32[] calldata publicInputs) external {
        require(verifier.verify(proof, publicInputs), "Invalid ZK proof");

        bytes32 nullifier = publicInputs[6];
        require(!usedNullifiers[nullifier], "Proof already used");
        usedNullifiers[nullifier] = true;
    }
}
```

---

### 🛡️ Preventing Sybil Attacks (Optional zk-access Integration)

To strengthen resistance against Sybil attacks (users creating multiple wallets to farm airdrops), we are exploring an integration with [zk-access](https://github.com/LuchoLeonel/zk-access) — another project from the Noir Hackathon.

zk-access allows users to:

- Generate **modular ZK credentials** based on past proofs or identity claims.
- Selectively disclose facts like "I haven’t claimed this drop yet" or "I’m a unique person" — without revealing wallet addresses or identities.

---

## 🤝 Credits & Acknowledgements

Built with ❤️ for the [Noir Hackathon](https://aztec.network/noir).

We believe privacy and fairness. ZK Drop is our step toward a more equitable and anonymous future. 🚀🌍
