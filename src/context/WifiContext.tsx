import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkESP32IP, ESP_AP_URL, listenForESP32IP } from '../utils/api';

interface WifiContextType {
  isWifiConfigured: boolean | undefined;
  setWifiConfigured: (value: boolean) => void;
  resetWifi: () => void;
}

export const WifiContext = createContext<WifiContextType | undefined>(undefined);

export const WifiProvider = ({ children }: { children: ReactNode }) => {
  const [isWifiConfigured, setWifiConfigured] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkWifiStatus = async () => {
      await listenForESP32IP(); // Start listening for ESP32 broadcasts
    
      const storedIP = await AsyncStorage.getItem("esp32IP");
      console.log('Stored IP', storedIP);

      if (!storedIP) {
        console.log("No ESP32 IP stored. Requesting broadcast...");
        fetch(`http://${ESP_AP_URL}/broadcast`).catch((err) =>
          console.error("Failed to request broadcast:", err)
        );
        return;
      }
    
      const ip = await checkESP32IP();
      if (ip) {
        setWifiConfigured(true);
        console.log("ESP32 connected at:", ip);
      } else {
        setWifiConfigured(false);
        console.log("ESP32 NOT connected.");
      }
    };

    checkWifiStatus();
  }, []);

  const resetWifi = async () => {
    console.log('Resetting wifi...');
    await AsyncStorage.removeItem('esp32IP');
    setWifiConfigured(false);
  };

  return (
    <WifiContext.Provider value={{ isWifiConfigured, setWifiConfigured, resetWifi }}>
      {children}
    </WifiContext.Provider>
  );
};
