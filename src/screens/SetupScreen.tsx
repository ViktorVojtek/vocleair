import React, { useState, useEffect, ElementRef, useRef } from 'react';
import {TouchableOpacity} from 'react-native';
import { setWiFiCredentials, listenForESP32IP } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWifi } from '../hooks/useWifi';
import { StackX, StackY, Text, TextInput } from '@viktorvojtek/react-native-simple-components';

const SetupScreen = () => {
  const { setWifiConfigured } = useWifi();
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [waitingForIP, setWaitingForIP] = useState(false);
  const [error, setError] = useState('');
  const [textInputFocused, setTextInputFocused] = useState<'TXT_INPUT_1' | 'TXT_INPUT_2' | undefined>(undefined);

  const inputRef1 = useRef<ElementRef<typeof TextInput>>(null);
  const inputRef2 = useRef<ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    listenForESP32IP(); // Start listening for ESP32's new IP
  }, []);

  const handleSetup = async () => {
    setError('');
    setWaitingForIP(true);

    const success = await setWiFiCredentials(ssid, password);
    if (!success) {
      setError("Failed to send WiFi credentials. Make sure you're connected to ESP32 AP mode.");
      setWaitingForIP(false);
      return;
    }

    console.log("WiFi credentials sent, waiting for ESP32 IP...");
    
    // Wait and check if ESP32 IP is stored in AsyncStorage
    let attempts = 0;
    const maxAttempts = 30; // Wait for 30 seconds max

    while (attempts < maxAttempts) {
      const esp32IP = await AsyncStorage.getItem('esp32IP');
      if (esp32IP) {
        setWifiConfigured(true);
        console.log(`ESP32 connected! New IP: ${esp32IP}`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    setError("ESP32 did not connect. Please try again.");
    setWaitingForIP(false);
  };

  const onFocus = () => {
    if (inputRef1.current!.isFocused()) {
      setTextInputFocused('TXT_INPUT_1');
      return;
    }
    
    setTextInputFocused('TXT_INPUT_2');
  };

  const onBlur = () => {
    setTextInputFocused(undefined);
  };

  const textInputStyle = {
    backgroundColor: '#219ebc',
    color: '#fefae0',
    justifyContent: 'center' as const,
    width: 300,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  };

  return (
    <StackY
      flex={1}
      backgroundColor="#8ecae6"
      justifyContent="center"
      alignItems='center'
      gap={35}
    >
      <StackY flex={1} my={20}>
        <Text
          fontSize={24}
          fontWeight='bold'
          marginBottom={20}
        >
          Setup WiFi
        </Text>
      </StackY>
      
      <StackY alignSelf="center" flex={1} gap={20} height="auto">
        <StackX>
          <TextInput
            ref={inputRef1}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="WiFi SSID"
            value={ssid}
            onChangeText={setSSID}
            {...textInputStyle}
            backgroundColor={textInputFocused === 'TXT_INPUT_1' ? '#ffb703' : '#219ebc'}
          />
        </StackX>

        <StackX>
          <TextInput
            ref={inputRef2}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="WiFi Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            {...textInputStyle}
            backgroundColor={textInputFocused === 'TXT_INPUT_2' ? '#ffb703' : '#219ebc'}
          />
        </StackX>

        <StackX justifyContent='center'>
        <TouchableOpacity onPress={handleSetup} disabled={waitingForIP}>
          <Text>Save WiFi</Text>
        </TouchableOpacity>
        </StackX>
      </StackY>
      
      <StackY flex={1}>
        {waitingForIP && <Text marginTop={10} fontSize={16} color='blue'>Waiting for ESP32 to connect...</Text>}
        {error !== '' && <Text marginTop={10} fontSize={16} color='red'>{error}</Text>}
      </StackY>
    </StackY>
  );
};

export default SetupScreen;
