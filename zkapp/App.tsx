import React, { useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getGNSSCoordinates } from './gnss';
import { generateZKProof } from './wasmRunner';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [proofGenerated, setProofGenerated] = useState(false);

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
  };

  const handlePress = async () => {
    const gnss = await getGNSSCoordinates();
    if (gnss) {
      setCoords(gnss);
      const proof = await generateZKProof(gnss.latitude, gnss.longitude);
      setProofGenerated(!!proof);
    }
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <Button title="Obtener coordenadas y generar prueba ZK" onPress={handlePress} />

      {coords && (
        <Text style={styles.info}>
          Latitud: {coords.latitude.toFixed(5)} | Longitud: {coords.longitude.toFixed(5)}
        </Text>
      )}

      {proofGenerated && (
        <Text style={[styles.info, { color: 'green' }]}>
          ✅ Prueba ZK generada con éxito
        </Text>
      )}
    </View>
  );
}