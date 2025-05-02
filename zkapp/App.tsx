import React, { useState, useEffect } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getGNSSCoordinates } from './gnss.ts';
import { generateZKProof } from './wasmRunner.ts';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [proofGenerated, setProofGenerated] = useState(false);

  useEffect(() => {
    (async () => {
      const location = await getGNSSCoordinates();
      console.log("Ubication GNSS:", location);
    })();
  }, []);

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
    <View style={styles.background}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <Button title="Get cords and generate ZK proof" onPress={handlePress} />

      {coords && (
        <Text style={styles.info}>
          Latitud: {coords.latitude.toFixed(5)} | Longitud: {coords.longitude.toFixed(5)}
        </Text>
      )}

      {proofGenerated && (
        <Text style={[styles.info, { color: 'green' }]}>
          ZK Proof generated succesfully
        </Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  info: {
    marginTop: 20,
    fontSize: 16,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter, 
    padding: 20,
  },
});

export default App;