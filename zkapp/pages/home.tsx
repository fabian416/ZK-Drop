/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { prepareSrs } from '../lib/noir';
import { TextBold } from '../components/TextBold'
import GradientText from '../components/GradientText';
import LinearGradient from 'react-native-linear-gradient'

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const handleBoundingProof = () => navigation.navigate('BoundingProof');

  return (
    <MainLayout>
      <LinearGradient
        colors={['#f8f7ff', '#ede4ff', '#e0d9ff']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1 px-6 py-10 justify-center"
      >
        
        <View className="items-center mb-12">
          <View className="flex-row items-center gap-3 mb-4">
            <GradientText>zkDrop</GradientText>
          </View>
          <Text className="text-center text-base text-[#453978] mt-4">
            Prove your location to <TextBold>unlock regional opportunities</TextBold> without revealing your exact coordinates.
          </Text>
          <Text className="text-center text-base text-[#453978] mt-4">
            <TextBold>Privacy</TextBold> is protected using <TextBold>zero-knowledge proofs</TextBold> powered by <TextBold>Noir</TextBold>.
          </Text>
        </View>

        <View className="w-full max-w-md mx-auto my-2">
          <Button className="bg-white border-2 border-[#c1ff72] rounded-xl py-3">
            <Text className="text-center text-[#453978] font-extrabold" onPress={handleBoundingProof}>
              Prove Location Now
            </Text>
          </Button>
        </View>


      </LinearGradient>
    </MainLayout>
  );
}