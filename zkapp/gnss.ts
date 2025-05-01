import { NativeModules } from 'react-native';

const { GNSSModule } = NativeModules;

export const getGNSSCoordinates = async () => {
  try {
    const coords = await GNSSModule.getGnssData(); 
    return coords;
  } catch (err) {
    console.error('GNSS error', err);
    return null;
  }
};