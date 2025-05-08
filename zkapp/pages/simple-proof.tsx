import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Share, StyleSheet } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  clearCircuit,
  extractProof,
  generateProof,
  setupCircuit,
  verifyProof,
} from '../lib/noir';
import circuit from '../circuits/simple_circuit/target/simple_circuit.json';
import { formatProof } from '../lib';
import { Circuit } from '../types';

export default function SimpleProof() {
  const [inputs, setInputs] = useState({ a: '', b: '' });
  const [proof, setProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [proofWithInputs, setProofWithInputs] = useState('');
  const [circuitId, setCircuitId] = useState<string>();
  const [generatingProof, setGeneratingProof] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [provingTime, setProvingTime] = useState(0);

  useEffect(() => {
    setupCircuit(circuit as Circuit).then(setCircuitId);
    return () => {
      if (circuitId) clearCircuit(circuitId);
    };
  }, []);

  const onGenerateProof = async () => {
    if (!inputs.a || !inputs.b) {
      Alert.alert('Missing input', 'Please enter both a and b');
      return;
    }

    setGeneratingProof(true);
    try {
      const start = Date.now();
      const { proofWithPublicInputs, vkey: _vkey } = await generateProof(
        {
          a: Number(inputs.a), // private input
          b: Number(inputs.b), // public input
        },
        circuitId!,
      );
      const end = Date.now();
      setProvingTime(end - start);
      setProofWithInputs(proofWithPublicInputs);
      setProof(extractProof(circuit as Circuit, proofWithPublicInputs));
      setVkey(_vkey);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setGeneratingProof(false);
  };

  const onVerifyProof = async () => {
    setVerifyingProof(true);
    try {
      const verified = await verifyProof(proofWithInputs, vkey, circuitId!);
      Alert.alert('Verification result', verified ? '✅ Valid' : '❌ Invalid');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setVerifyingProof(false);
  };

  return (
    <MainLayout canGoBack={true}>
      <Text style={styles.title}>Proof of a &gt; b</Text>
      <Text style={styles.sectionTitle}>Inputs</Text>
      <View style={styles.inputRow}>
        <Input
          value={inputs.a}
          placeholder="a (private)"
          style={{ flex: 1 }}
          onChangeText={val => setInputs(prev => ({ ...prev, a: val }))}
        />
        <Text>&gt;</Text>
        <Input
          value={inputs.b}
          placeholder="b (public)"
          style={{ flex: 1 }}
          onChangeText={val => setInputs(prev => ({ ...prev, b: val }))}
        />
      </View>

      {!proof && (
        <Button disabled={generatingProof || !circuitId} onPress={onGenerateProof}>
          <Text style={{ color: 'white', fontWeight: '700' }}>
            {generatingProof ? 'Generating...' : 'Generate Proof'}
          </Text>
        </Button>
      )}

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

          <Button theme="secondary" onPress={() => {
            Share.share({ title: 'Simple Proof', message: proof });
          }}>
            <Text style={{ color: '#151628', fontWeight: '700' }}>Share my proof</Text>
          </Button>
        </>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#151628',
    fontSize: 16,
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  proof: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
});