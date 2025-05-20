import React, { useEffect, useState } from 'react';
import { View, Text, Share, Alert, StyleSheet } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {
  clearCircuit,
  extractProof,
  extractRawPublicInputs,
  generateProof,
  setupCircuit,
  verifyProof,
} from '../lib/noir';
import circuit from '../circuits/bounding/target/bounding.json';
import { formatProof } from '../lib';
import { Circuit } from '../types';
import { getGNSSCoordinates } from '../gnss'; 
import { PermissionsAndroid } from 'react-native';


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
      // Step 1: Request location permission (Android only)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location to generate a zero-knowledge proof.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Cannot continue without location access.');
        return;
      }
  
      // Step 2: Set up the circuit and store its ID
      const id = await setupCircuit(circuit as Circuit);
      setCircuitId(id);
    };
  
    setup();
  
    // Cleanup: clear the circuit instance when unmounting the component
    return () => {
      if (circuitId) clearCircuit(circuitId);
    };
  }, []);

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

    // Get GNSS coordinates
    const coords = await getGNSSCoordinates();
    if (!coords) {
      Alert.alert('Error', 'Cannot get GNSS coordinates');
      return;
    }

    // Private coords
    const lat = BigInt(Math.round(coords.latitude * 1e6));  // Convert into integer
    const lon = BigInt(Math.round(coords.longitude * 1e6));
    console.log("GNSS coordinates:", { lat, lon });
  
    // Adjust negative values
    const adjustedLon = (lon < 0n) ? (lon + FIELD_MODULUS) % FIELD_MODULUS : lon;
    const latHex = `0x${lat.toString(16)}`;
    const lonHex = `0x${adjustedLon.toString(16)}`;

    const minLat = "0x1744214";
    const maxLat = "0x2f18ba6";
    const minLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593e88ef4b3";
    const maxLon = "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593ec02a8cf";
    const regionHash = "0xa84bbbb7e92739e37dfe00ec56b943c3b15c58aaeaf91ed5c348083f7e74987";
    const challenge = "0x3039"; // 12345
    const nullifier = "0x2804ef4ee0db656a2b181393074541fef5777c16f03fa6aa88f181c0cc94d126";
  
    console.log("Generating proof with inputs:", {
      latHex,
      lonHex,
      min_lat: minLat,
      max_lat: maxLat,
      min_lon: minLon,
      max_lon: maxLon,
      region_hash: regionHash,
      challenge,
      nullifier: nullifier,
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
          nullifier: nullifier,
        },
        circuitId!,
      );
      const end = Date.now();
      setProvingTime(end - start);
      setProofWithInputs(proofWithPublicInputs);

      const extractedProof = extractProof(circuit as Circuit, proofWithPublicInputs);
      const rawPublicInputs = extractRawPublicInputs(circuit as Circuit, proofWithPublicInputs);

      console.log("---- ZK Proof and Inputs ----");
      console.log("Public Inputs (extracted):");
      const formattedInputs = rawPublicInputs.match(/.{1,64}/g)?.map(hex => '0x' + hex);
      console.log(formattedInputs);

      console.log("Private Inputs:");
      console.log({
        lat: latHex,
        lon: lonHex,
      });

      console.log("Proof only:");
      console.log(`proof = "${extractedProof}";`);
      console.log("------------------------------");

      setProof(extractedProof);
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
      <Text style={styles.sectionTitle}>Location Proof</Text>

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
