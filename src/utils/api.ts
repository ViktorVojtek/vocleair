import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import dgram from 'react-native-udp';

export const ESP_AP_URL = 'http://192.168.4.1';
// const ESP32_BROADCAST_URL = 'http://192.168.4.1/broadcast'; // URL to ESP32's broadcast endpoint

let ESP32_IP: string | null = null; // Will be updated dynamically
// let socket: any = null;

export const setESP32IP = async (ip: string) => {
  ESP32_IP = ip;
  await AsyncStorage.setItem('esp32IP', ESP32_IP);
};

// Check for stored ESP32 IP or wait for UDP broadcast
export const checkESP32IP = async () => {
  if (ESP32_IP) return ESP32_IP;

  const storedIP = await AsyncStorage.getItem('esp32IP');
  if (storedIP) {
    ESP32_IP = storedIP;
    return storedIP;
  } else {
    console.warn("ESP32 IP is not set. Waiting for IP broadcast...");
    return null;
  }
};

// Set WiFi credentials to ESP32 in AP mode (default IP: 192.168.4.1)
export const setWiFiCredentials = async (ssid: string, password: string) => {
  const apModeIP = "http://192.168.4.1"; // ESP32 in AP mode
  console.log(ssid, password);

  try {
    await axios.post(`${apModeIP}/setwifi`, new URLSearchParams({ ssid, password }).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log("WiFi credentials sent. Waiting for ESP32 to reboot...");

    return true;
  } catch (error) {
    console.error("Error setting WiFi:", error);
    return false;
  }
};

// Get ESP32 fan status (only works when ESP32 is connected to WiFi)
export const getFanStatus = async () => {
  const ip = await checkESP32IP();
  if (!ip) return { fanSpeed: 0 };

  try {
    const response = await axios.get(`http://${ip}/status`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching fan status:", error);
  }

  return { fanSpeed: 0 };
};

export const postFanSpeed = async (speed: number) => {
  const ip = await checkESP32IP();
  if (!ip) return;  // No IP, no connection

  console.log("Setting fan speed to:", speed);
  console.log(`http://${ip}/speed?value=${speed}`);

  try {
    await axios.get(`http://${ip}/speed?value=${speed}`);
  } catch (error) {
    console.error("Error setting fan speed:", error);
  }
};

// Poll ESP32 for its IP via HTTP (instead of UDP)
export const listenForESP32IP = async () => {
  try {
    console.log("Polling ESP32 for IP via HTTP...");
    const response = await axios.get(`${ESP_AP_URL}/broadcast`, { timeout: 5000 });
    const newIP = response.data;
    console.log(`Received ESP32 IP: ${newIP}`);
    await setESP32IP(newIP);
  } catch (error) {
    console.error("Failed to retrieve ESP32 IP via HTTP:", error);
    // await setESP32IP(null);
  }
};
