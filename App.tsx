import 'react-native-gesture-handler';

import React from "react";
import { SafeAreaView } from "react-native";
import Navigation from './src/navigation';
import { WifiProvider } from "./src/context/WifiContext";

const App = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#8ecae6" }}>
    <WifiProvider>
      <Navigation />
    </WifiProvider>
  </SafeAreaView>
);

export default App;
