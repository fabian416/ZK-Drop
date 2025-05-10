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
2. A public QR code provides the circuit’s public inputs (`region_hash`, `challenge`, `session_hash`).
3. The proof is verified on-chain by a smart contract before allowing access to airdrops or presales.

---

## 🔧 Circuit Logic (Noir)

The circuit receives:

- A private latitude and longitude (e.g. from GNSS chip).
- A public `region_hash` that defines the accepted area.
- A challenge to prevent replay attacks.

```rust
fn main(private_lat: Field, private_lon: Field, region_hash: pub Field, challenge: pub Field, session_hash: pub Field) {
    let poseidon_result = poseidon_hash(private_lat, private_lon);
    let is_in_region = poseidon_result == region_hash;
    assert(is_in_region);
    // session_hash check here (optional)
}
```
