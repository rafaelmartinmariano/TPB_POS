/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Header from "./src/components/Header";
import MenuButton from "./src/components/MenuButton";
import TopNav from "./src/components/TopNav";


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TopNav />
      <Header />
      <View className="p-4">

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menu: { flex: 1, justifyContent: "center" },
});

export default App;
