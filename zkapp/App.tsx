import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import BoundingProof from './pages/bounding-proof';
import "./global.css"
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Stack.Screen name="BoundingProof" component={BoundingProof} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

export default App;
