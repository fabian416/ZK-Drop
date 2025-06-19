import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { View, Text, Share, Alert } from 'react-native';
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
import { clsx } from 'clsx';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../components/GradientText';
import { TextBold } from '../components/TextBold'
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useBarcodeScanner, CameraHighlights } from '@mgcrea/vision-camera-barcode-scanner';
import { runOnJS } from 'react-native-reanimated';
import type { Barcode } from '@mgcrea/vision-camera-barcode-scanner';

export default function BoundingProof() {
  const [proof, setProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [proofWithInputs, setProofWithInputs] = useState('');
  const [circuitId, setCircuitId] = useState<string>();
  const [generatingProof, setGeneratingProof] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [provingTime, setProvingTime] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const device = useCameraDevice('back');
  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['qr'],
    onBarcodeScanned: (barcodes) => {
    if (barcodes.length > 0) {
        const data = barcodes[0].rawValue;
        if (data) {
          runOnJS(Alert.alert)('QR Scanned', data);
          runOnJS(postProofToBackend)(data, "proof");
          runOnJS(setShowScanner)(false);
        }
      }
    }
  });



  useEffect(() => {
    if (barcodes.length > 0) {
      const data = barcodes[0].rawValue;
      if (data) {
        Alert.alert('QR Scanned', data);
        setShowScanner(false);
      }
    }
  }, [barcodes]);


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

      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app requires access to your camera to scan documents.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Cannot continue without camera access.');
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

    const minLat = "0x2d1d6a4";
    const maxLat = "0x347d454";
    const minLon = "0x598e7c";
    const maxLon = "0xe56ca4";
    const regionHash = "0x2deaeb85a25ed7942de2e93760f232514ecd88f5d80230860fafcab8f2c7dbd8";
    const challenge = "0x3039"; // 12345
    const nullifier = "0x2a437cc092b606f3af2cdb45addec9a10270e2d24eed458a3a9256534fd98b8b";
  
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

  const postProofToBackend = async (url: string, proof: string) => {
  try {
      const parsedUrl = new URL(url);
      const id = parsedUrl.pathname.split('/').pop(); // extrae el UUID del path

    const endpoint = `http://localhost:5000/relay-session/${id}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: proof }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    Alert.alert('Success', 'Proof sent successfully!');
  } catch (err: any) {
    Alert.alert('Error sending proof', err.message || 'Unknown error');
  }
};


  return (
    <MainLayout canGoBack={true}>
       <LinearGradient
          colors={['#f8f7ff', '#ede4ff', '#e0d9ff']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="flex-1 px-6 py-10 justify-start"
        >
      <View className="items-center mt-12 mb-6">
        <View className="flex-row items-center gap-3 mb-4">
          <GradientText>zkDrop</GradientText>
        </View>
      </View>

 

      {!proof ?
      (
        <Button
          disabled={generatingProof || !circuitId || !!proof}
          onPress={onGenerateProof}
          className={clsx(
            'w-full  border-2 border-[#c1ff72] rounded-xl py-3 mb-4',
            generatingProof || !circuitId
              ? 'bg-gray-400'
              : 'bg-white'
          )}
        >
          <Text className="text-[#453978] font-extrabold text-center">
            {proof ? 'Generated' : generatingProof ? 'Generating...' : circuitId ? 'Generate Location Proof' : 'Loading...'}
          </Text>
        </Button>
      )
      :
      (
        <View className="items-center">
          <Text className="text-center text-xl text-[#453978] mb-4">
            <TextBold>Proof generated</TextBold>
          </Text>
          <Button
            onPress={() => setShowScanner(true)}
            className="w-full border-2 border-[#c1ff72] rounded-xl py-3 mb-4 bg-white"
          >
            <Text className="text-[#453978] font-extrabold text-center">
              Share my proof
            </Text>
          </Button>

           {showScanner && device && (
              <View className="w-full h-96 rounded-xl overflow-hidden border border-[#453978] mb-4">
                <Camera
                  style={{ flex: 1 }}
                  device={device}
                  isActive={true}
                  {...cameraProps}
                />
                <CameraHighlights highlights={highlights} color="#453978" />
              </View>
            )}
        </View>
      )}
      </LinearGradient>
    </MainLayout>
  );
}
