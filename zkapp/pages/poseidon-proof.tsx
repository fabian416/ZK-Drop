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
import circuit from '../circuits/poseidon/target/poseidon.json';
import { formatProof } from '../lib';
import { Circuit } from '../types';

export default function PoseidonProof() {
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
    // Hexadecimals values hardcoded for testing
    const minLat = "0x1744214";
    const maxLat = "0x2f18ba6";
    const minLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593e88ef4b3";
    const maxLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593ec02a8cf";
    const expectedHex = "0xa84bbbb7e92739e37dfe00ec56b943c3b15c58aaeaf91ed5c348083f7e74987";

    console.log("Generating proof with inputs:", {
      min_lat: minLat,
      max_lat: maxLat,
      min_lon: minLon,
      max_lon: maxLon,
      expected: expectedHex,
    });

    setGeneratingProof(true);
    try {
      const start = Date.now();
      const { proofWithPublicInputs, vkey: _vkey } = await generateProof(
        {
          min_lat: minLat,
          max_lat: maxLat,
          min_lon: minLon,
          max_lon: maxLon,
          expected: expectedHex,
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
      <Text style={styles.sectionTitle}>Poseidon Hash Proof</Text>
      <Text style={styles.label}>Using fixed coordinates:</Text>
      <Text style={styles.label}>min_lat: 24394900 (0x1744214)</Text>
      <Text style={styles.label}>max_lat: 49381862 (0x2f18ba6)</Text>
      <Text style={styles.label}>min_lon: 21888242871839275222246405745257275088548364400416034343698204186575683646643 (0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593e88ef4b3)</Text>
      <Text style={styles.label}>max_lon: 21888242871839275222246405745257275088548364400416034343698204186575741561039 (0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593ec02a8cf)</Text>
      <Text style={styles.label}>expected: 0xa84bbbb7e92739e37dfe00ec56b943c3b15c58aaeaf91ed5c348083f7e74987</Text>

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
              Share.share({ title: 'Poseidon Proof', message: proof })
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
  label: {
    textAlign: 'center',
    color: '#151628',
    fontSize: 14,
    marginVertical: 5,
  },
  proof: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
});