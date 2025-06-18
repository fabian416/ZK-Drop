/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { prepareSrs } from '../lib/noir';
import { TextBold } from '../components/TextBold'
import GradientText from '../components/GradientText';
import LinearGradient from 'react-native-linear-gradient'

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
  const hanldeBoundingProof = () => navigation.navigate('BoundingProof');

  return (

    <MainLayout>
      <LinearGradient
        colors={['#4c1d95', '#6b21a8', '#000000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1 px-6 py-10 justify-center"
      >
        
        <View className="items-center mb-12">
          <View className="flex-row items-center gap-3 mb-4">
            <GradientText>zkDrop</GradientText>
          </View>
          <Text className="text-center text-base text-gray-300 mt-4">
            Use Noir to generate <TextBold>zk proofs</TextBold> in Android with React Native.
          </Text>
          <Text className="text-center text-base text-gray-300 mt-4">
            <TextBold>Click on the button below</TextBold> to try out the Simple and Poseidon proofs.
          </Text>
        </View>

        <View className="w-full max-w-md mx-auto my-2">
           <Button onPress={handleSimpleProof}>
            <Text style={{ color: 'white', fontWeight: '700' }}>
              Run Simple Proof
            </Text>
          </Button>
        </View>
        <View className="w-full max-w-md mx-auto my-2">
          <Button onPress={handlePoseidonProof}>
            <Text style={{ color: 'white', fontWeight: '700' }}>
              Run Poseidon Proof
            </Text>
          </Button>
        </View>
        <View className="w-full max-w-md mx-auto my-2">
          <Button onPress={hanldeBoundingProof}>
            <Text style={{ color: 'white', fontWeight: '700' }}>
              Run Location Proof
            </Text>
          </Button>
        </View>

      </LinearGradient>
    </MainLayout>
  );
}