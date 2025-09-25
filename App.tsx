/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//functions
import { useDeviceRegistration, checkDateSync } from './src/hooks/useDeviceRegistration';

//Components
import CategoriesWithProducts from "./src/components/CategoriesWithProducts";
import TopNav from "./src/components/TopNav";
import RegistrationScreen from './src/screens/RegistrationScreen';


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';

type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isDateSync, setIsDateSync] = useState<boolean | null>(null);

  //check if the date is sync GMT+8
  useEffect(() => {
    const check = async () => {
      const dateSync = await checkDateSync();
      setIsDateSync(dateSync);
      console.log("✅ Date Sync:", dateSync);
    };
    check();
  }, []);

  //check if device is registered
  const { isRegistered } = useDeviceRegistration();

  // Still checking → show loading spinner
  if (isDateSync == false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Time not sync.</Text>
        <Text>Kindly check the device time or contact your administrator.</Text>
      </View>
    );
  }

  //console.log("isRegistered:", isRegistered);
  //if (!isRegistered) return null;

  return (

    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isRegistered ? "Home" : "Registration"}>
          <Stack.Screen name="Home"
            component={AppContent}
            options={{
              headerTitle: () => <TopNav />, // render your component inline
            }}
          />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ title: 'Device Registration' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <CategoriesWithProducts />
      <View className="p-4">
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menu: { flex: 1, justifyContent: "center" },
});
