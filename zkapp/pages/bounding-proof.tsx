import React, { useEffect, useState } from 'react';
import { View, Text, Share, Alert, StyleSheet } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {
  clearCircuit,
  extractProof,
  generateProof,
  setupCircuit,
  verifyProof,
} from '../lib/noir';
import circuit from '../circuits/bounding/target/bounding.json';
import { formatProof } from '../lib';
import { Circuit } from '../types';

export default function BoundingProof() {
  const [proof, setProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [proofWithInputs, setProofWithInputs] = useState('');
  const [circuitId, setCircuitId] = useState<string>();
  const [generatingProof, setGeneratingProof] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [provingTime, setProvingTime] = useState(0);

  useEffect(() => {
    const setup = async () => {
      const id = await setupCircuit(circuit as Circuit);
      setCircuitId(id);
    };
    setup();
    return () => {
      if (circuitId) clearCircuit(circuitId);
    };
  }, []);

  const onGenerateProof = async () => {

    const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
  
    // Private coords
    const lat = BigInt(35000000);
    const lon = BigInt(-90000000);
  
    // Adjust negative values
    const adjustedLon = (lon + FIELD_MODULUS) % FIELD_MODULUS;
    const latHex = `0x${lat.toString(16)}`;
    const lonHex = `0x${adjustedLon.toString(16)}`;

    const minLat = "0x1744214";
    const maxLat = "0x2f18ba6";
    const minLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593e88ef4b3";
    const maxLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593ec02a8cf";
    const regionHash = "0xa84bbbb7e92739e37dfe00ec56b943c3b15c58aaeaf91ed5c348083f7e74987";
    const challenge = "0x3039"; // 12345
    const sessionHash = "0x2804ef4ee0db656a2b181393074541fef5777c16f03fa6aa88f181c0cc94d126";
  
    console.log("Generating proof with inputs:", {
      latHex,
      lonHex,
      min_lat: minLat,
      max_lat: maxLat,
      min_lon: minLon,
      max_lon: maxLon,
      region_hash: regionHash,
      challenge,
      session_hash: sessionHash,
    });
  
    setGeneratingProof(true);
    try {
      const start = Date.now();
      const { proofWithPublicInputs, vkey: _vkey } = await generateProof(
        {
          lat: latHex,
          lon: lonHex,
          min_lat: minLat,
          max_lat: maxLat,
          min_lon: minLon,
          max_lon: maxLon,
          region_hash: regionHash,
          challenge,
          session_hash: sessionHash,
        },
        circuitId!,
      );
      const end = Date.now();
      setProvingTime(end - start);
      setProofWithInputs(proofWithPublicInputs);
      setProof(extractProof(circuit as Circuit, proofWithPublicInputs));
      setVkey(_vkey);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unable to generate the proof');
      console.error("Detailed error:", err);
    }
    setGeneratingProof(false);
  };
  const onVerifyProof = async () => {
    setVerifyingProof(true);
    try {
      const verified = await verifyProof(proofWithInputs, vkey, circuitId!);
      Alert.alert('Verification result', verified ? 'Valid' : 'Invalid');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setVerifyingProof(false);
  };

  return (
    <MainLayout canGoBack={true}>
      <Text style={styles.sectionTitle}>Bounding Box Location Proof</Text>

      <Button disabled={generatingProof || !circuitId} onPress={onGenerateProof}>
        <Text style={{ color: 'white', fontWeight: '700' }}>
          {generatingProof ? 'Generating...' : 'Generate Proof'}
        </Text>
      </Button>

      {proof && (
        <>
          <Text style={styles.sectionTitle}>Proof</Text>
          <Text style={styles.proof}>{formatProof(proof)}</Text>

          <Text style={styles.sectionTitle}>Proving time</Text>
          <Text style={styles.proof}>{provingTime} ms</Text>

          <Button disabled={verifyingProof} onPress={onVerifyProof}>
            <Text style={{ color: 'white', fontWeight: '700' }}>
              {verifyingProof ? 'Verifying...' : 'Verify Proof'}
            </Text>
          </Button>

          <Button
            theme="secondary"
            onPress={() =>
              Share.share({ title: 'Bounding Box Proof', message: proof })
            }
          >
            <Text style={{ color: '#151628', fontWeight: '700' }}>
              Share my proof
            </Text>
          </Button>
        </>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#151628',
    fontSize: 16,
    marginVertical: 10,
  },
  proof: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
});