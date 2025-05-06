/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Button } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { clearCircuit, extractProof, generateProof, setupCircuit, verifyProof, prepareSrs } from '../zkapp/lib/noir';
import locationCircuit from '../zkapp/circuits/location/target/location.json';
import { Circuit } from './types/types';
import { getGNSSCoordinates } from './gnss';
import { poseidonHash4, poseidonHash2 } from './utils/utils.ts';

// Bounding box for EE. UU. continentales (escalado por 10^6)
const usaBoundingBox = {
  min_lat: 24500000,  // 24.5 * 10^6
  max_lat: 49000000,  // 49.0 * 10^6
  min_lon: -125000000, // -125.0 * 10^6
  max_lon: -66900000,  // -66.9 * 10^6
};

export default function LocationProof() {
  const [proofAndInputs, setProofAndInputs] = useState('');
  const [proof, setProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [generatingProof, setGeneratingProof] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [coords, setCoords] = useState<{ lat: string; lon: string }>({ lat: '', lon: '' });
  const [provingTime, setProvingTime] = useState(0);
  const [circuitId, setCircuitId] = useState<string>();

  useEffect(() => {
    (async () => {
      const granted = await requestPermissions();
      if (!granted) {
        console.warn('Location permission denied');
        return;
      }

      try {
        await prepareSrs();
        const id = await setupCircuit(locationCircuit as Circuit);
        setCircuitId(id);
        console.log('Circuit setup complete, ID:', id);
      } catch (error) {
        console.error('Error setting up circuit:', error);
        Alert.alert('Setup Error', 'Failed to setup circuit');
      }
    })();

    return () => {
      if (circuitId) clearCircuit(circuitId);
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
      );
    }
    return true;
  };

  const handleGetGNSSCoords = async () => {
    try {
      const gnss = await getGNSSCoordinates();
      if (gnss) {
        const scaledLat = Math.round(gnss.latitude * 1_000_000).toString();
        const scaledLon = Math.round(gnss.longitude * 1_000_000).toString();
        setCoords({ lat: scaledLat, lon: scaledLon });
        Alert.alert('GNSS Coordinates', `Lat: ${gnss.latitude}, Lon: ${gnss.longitude}`);
      } else {
        Alert.alert('Error', 'Failed to get GNSS coordinates');
      }
    } catch (error) {
      console.error('Error getting GNSS coords:', error);
      Alert.alert('Error', 'Failed to get GNSS coordinates');
    }
  };

  const onGenerateProof = async () => {
    const lat = Number(coords.lat);
    const lon = Number(coords.lon);

    if (isNaN(lat) || isNaN(lon)) {
      Alert.alert('Error', 'Please enter valid coordinates or use GNSS');
      return;
    }

    setGeneratingProof(true);
    try {
      const start = Date.now();

      // Calcular valores públicos
      const { min_lat, max_lat, min_lon, max_lon } = usaBoundingBox;
      const region_hash = await poseidonHash4([min_lat, max_lat, min_lon, max_lon]);
      const challenge = Math.floor(Math.random() * 1_000_000_000); // Valor único
      const session_hash = await poseidonHash2([region_hash, challenge]);

      const inputs = {
        lat,
        lon,
        min_lat,
        max_lat,
        min_lon,
        max_lon,
        region_hash,
        challenge,
        session_hash,
      };

      const { proofWithPublicInputs, vkey: _vkey } = await generateProof(inputs, circuitId!);
      console.log('PROOF_RAW:', proofWithPublicInputs);

      const end = Date.now();
      setProvingTime(end - start);
      setProofAndInputs(proofWithPublicInputs);
      setProof(extractProof(locationCircuit as Circuit, proofWithPublicInputs));
      setVkey(_vkey);
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setGeneratingProof(false);
  };

  const onVerifyProof = async () => {
    setVerifyingProof(true);
    try {
      const verified = await verifyProof(proofAndInputs, vkey, circuitId!);
      Alert.alert('Verification result', verified ? 'The proof is valid! User is in USA' : 'The proof is invalid! User is not in USA');
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setVerifyingProof(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Verify location in USA (lat, lon)</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={coords.lat}
          placeholder="Latitude (scaled x10^6)"
          onChangeText={val => setCoords(prev => ({ ...prev, lat: val }))}
          keyboardType="numeric"
        />
        <Text>,</Text>
        <TextInput
          style={styles.input}
          value={coords.lon}
          placeholder="Longitude (scaled x10^6)"
          onChangeText={val => setCoords(prev => ({ ...prev, lon: val }))}
          keyboardType="numeric"
        />
      </View>
      <Button title="Get GNSS Coordinates" onPress={handleGetGNSSCoords} />
      <Text style={styles.outcome}>Condition: Inside USA bounding box</Text>
      {proof && (
        <>
          <Text style={styles.sectionTitle}>Proof</Text>
          <Text style={styles.proofText}>{proof.slice(0, 50)}...</Text>
          <Text style={styles.sectionTitle}>Proving time</Text>
          <Text style={styles.proofText}>{provingTime} ms</Text>
        </>
      )}
      {!proof && (
        <Button
          disabled={generatingProof || !circuitId}
          onPress={onGenerateProof}
          title={generatingProof ? 'Proving...' : 'Generate Proof'}
        />
      )}
      {proof && (
        <Button
          disabled={verifyingProof}
          onPress={onVerifyProof}
          title={verifyingProof ? 'Verifying...' : 'Verify Proof'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#151628',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  outcome: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
  },
  proofText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
});