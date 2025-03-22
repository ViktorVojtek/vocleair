import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { StackY } from '@viktorvojtek/react-native-simple-components';
import HomeScreen from '../screens/HomeScreen';
import SetupScreen from '../screens/SetupScreen';
import { useWifi } from '../hooks/useWifi';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isWifiConfigured } = useWifi();

  console.log('Is wifi configured:', isWifiConfigured);

  if (isWifiConfigured === undefined) {
    return (
      <StackY alignItems='center' justifyContent='center' flex={1}>
        <ActivityIndicator size="large" color="#007AFF" />
      </StackY>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isWifiConfigured ? (
          <Stack.Screen name="Setup" component={SetupScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;