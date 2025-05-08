import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import SimpleProof from './pages/simple-proof';
import PoseidonProof from './pages/poseidon-proof';
import BoundingProof from './pages/bounding-proof';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SimpleProof" component={SimpleProof} />
          <Stack.Screen name="PoseidonProof" component={PoseidonProof} />
          <Stack.Screen name="BoundingProof" component={BoundingProof} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

export default App;
