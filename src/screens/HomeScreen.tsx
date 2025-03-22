import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import FanController from '../components/FanController';
import { getFanStatus, postFanSpeed } from '../utils/api';

const HomeScreen = () => {
  const [fanSpeed, setFanSpeed] = useState(0);

  const fetchFanStatus = async () => {
    try {
      const status = await getFanStatus();
      console.log('Fan status:', status);
      if (status) {
        setFanSpeed(status.fanSpeed);
      }
    } catch (error) {
      console.error('Failed to fetch fan status:', error);
    }
  };

  // Fetch fan status when screen is loaded
  useEffect(() => {
    fetchFanStatus();
  }, []);

  // Fetch fan status when screen is focused (user returns to it)
  useFocusEffect(
    useCallback(() => {
      fetchFanStatus();
    }, [])
  );

  const updateFanSpeed = (speed: number) => {
    setFanSpeed(speed);
    postFanSpeed(speed);
  };

  return (
    <FanController fanSpeed={fanSpeed} setFanSpeed={updateFanSpeed}  />
  );
};

export default HomeScreen;
