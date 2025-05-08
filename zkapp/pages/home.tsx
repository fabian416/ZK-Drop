/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { prepareSrs } from '../lib/noir';

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    const initializeSrs = async () => {
      try {
        console.log('Initializing SRS...');
        const res = await prepareSrs();
        console.log('SRS initialized successfully');
        console.log(`SRS source: ${res.srsSource}, path: ${res.srsPath}`);
      } catch (err: any) {
        console.error('Error initializing SRS:', err.message, err.stack);
        Alert.alert('Initialization Error', 'Failed to prepare SRS: ' + err.message);
      }
    };
    initializeSrs();
  }, []);

  const handleSimpleProof = () => navigation.navigate('SimpleProof');
  const handlePoseidonProof = () => navigation.navigate('PoseidonProof');

  return (
    <MainLayout>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 20,
          textAlign: 'center',
          color: '#6B7280',
        }}>
        Use Noir to generate ZK proofs in Android with React Native.{'\n\n'}
        Click on the button below to try out the Simple and Poseidon proofs.{'\n\n'}
      </Text>
      <View
        style={{
          gap: 20,
        }}>
        <Button onPress={handleSimpleProof}>
          <Text style={{ color: 'white', fontWeight: '700' }}>
            Run Simple Proof
          </Text>
        </Button>
        <Button onPress={handlePoseidonProof}>
          <Text style={{ color: 'white', fontWeight: '700' }}>
            Run Poseidon Proof
          </Text>
        </Button>
      </View>
    </MainLayout>
  );
}