import React, { useCallback, useEffect, useState } from "react";
import { Switch, TouchableOpacity } from "react-native";
import { StackY, StackX, Text } from '@viktorvojtek/react-native-simple-components';
import VerticalSlider from 'rn-vertical-slider';
import type { TSliderRef } from "rn-vertical-slider/lib/typescript/types";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_SPEED = 255;
const MIN_SPEED = 60; // 160; // 155;
const MIN_PERCENTAGE = 25;

type Props = {
  fanSpeed: number;
  setFanSpeed: (speed: number) => void;
};

const FanController = ({ fanSpeed = 0, setFanSpeed }: Props) => {
  const slider = React.useRef<TSliderRef>(null);
  const insets = useSafeAreaInsets();
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const percSpeed = speedToPercentage(fanSpeed);
    setSpeed(percSpeed);
    slider.current?.setValue(percSpeed);
  }, [fanSpeed]);

  const toggleSwitch = useCallback(() => {
    const newFanSpeed = fanSpeed === 0 ? MIN_SPEED : 0;
    const percentage = speedToPercentage(newFanSpeed);

    setFanSpeed(newFanSpeed);
    setSpeed(percentage);
    slider.current?.setValue(percentage);
  }, [fanSpeed, setFanSpeed]);

  const sendSpeed = useCallback(
    (percentage: number) => {
      const rawSpeed = percentageToSpeed(percentage);
      setSpeed(percentage);
      setFanSpeed(rawSpeed);
    },
    [setFanSpeed]
  );

  const updateSpeed = (percentage: number) => {
    if (percentage < MIN_PERCENTAGE) return;
    setSpeed(percentage);
  };

  const onPressUpdateSpeed = useCallback((percentage: number) => {
    if (percentage < MIN_PERCENTAGE) return;
    sendSpeed(percentage);
    slider.current?.setValue(percentage);
  }, [speed, sendSpeed]);

  return (
    <StackY flex={1} gap={50} backgroundColor="#8ecae6" px={16}>
      {/** Toggle Fan On/Off */}
      <StackX flexGrow={0} justifyContent="flex-end" alignItems="center">
        <Switch
          trackColor={{ false: '#003049', true: '#003049' }}
          thumbColor={!fanSpeed ? '#219ebc' : '#ffb703'}
          ios_backgroundColor={"#003049"}
          onValueChange={toggleSwitch}
          value={fanSpeed > 0}
        />
      </StackX>

      {/** Fan Speed Slider */}
      <StackY alignItems="center" justifyContent="center">
        <VerticalSlider
          ref={slider}
          value={speed}
          onChange={updateSpeed}
          onComplete={sendSpeed}
          height={400}
          width={60}
          step={5}
          min={0}
          max={100}
          borderRadius={16}
          minimumTrackTintColor="#023047"
          maximumTrackTintColor="#669bbc"
          showIndicator
          containerStyle={{alignItems: 'center'}}
          renderIndicator={() => (
            <StackY
              alignItems="center"
              flexGrow={1}
              flexShrink={0}
              mb={10}
            >
              <Text
                fontWeight={800}
                color={speed > 82 ? '#fb8500' : '#003049'}
              >{speed}%</Text>
            </StackY>
          )}
        />
      </StackY>

      {/** Speed Controls */}
      <StackY flexShrink={0} mb={insets.bottom}>
        <StackX justifyContent="space-evenly">
          <TouchableOpacity onPress={() => onPressUpdateSpeed(MIN_PERCENTAGE)}>
            <StackX
              borderWidth={1}
              borderRadius={25}
              backgroundColor={speed === MIN_PERCENTAGE ? '#fb8500' : 'transparent'}
              width={50}
              height={50}
              alignItems="center"
              justifyContent="center"
            >
              <Icon name="moon" size={20} color="#003049" />
            </StackX>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressUpdateSpeed(50)}>
          <StackX
            borderWidth={1}
            borderRadius={25}
            backgroundColor={speed === 50 ? '#fb8500' : 'transparent'}
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
          >
              <Icon name="sun" size={20} color="#003049" />
            </StackX>
          </TouchableOpacity> 
          <TouchableOpacity onPress={() => onPressUpdateSpeed(100)}>
          <StackX
            borderWidth={1}
            borderRadius={25}
            backgroundColor={speed > 99 ? '#fb8500' : 'transparent'}
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
          >
              <Icon name="bolt" size={20} color="#003049" />
            </StackX>
          </TouchableOpacity>
        </StackX>
      </StackY>
    </StackY>
  );
};

function percentageToSpeed(percentage: number): number {
  console.log('percentage', percentage);
  console.log(Math.round((percentage / 100) * MAX_SPEED));
  return Math.round((percentage / 100) * MAX_SPEED);// (MAX_SPEED - MIN_SPEED) + MIN_SPEED);
}

function speedToPercentage(speed: number): number {
  if (speed === 0) return 0; // Handle special off case
  if (speed <= MIN_SPEED) return 25; // Handle special low case (MIN_SPEED of MAX_SPEED = 25%)

  return Math.round(speed / MAX_SPEED * 100); // Math.round(((speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100);
}

export default FanController;
