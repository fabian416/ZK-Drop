const fs = require("fs");
const path = require("path");

const proofJson = fs.readFileSync(path.resolve(__dirname, "../lib/abis/proof.json"), "utf8");
const parsed = JSON.parse(proofJson);
const proofObj = parsed.proof;

const byteArray = Object.values(proofObj) as number[];
const hexProof = "0x" + byteArray.map((b) => b.toString(16).padStart(2, "0")).join("");

console.log("Hex proof:");
console.log(hexProof);