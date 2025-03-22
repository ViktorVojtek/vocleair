import { useContext } from 'react';
import { WifiContext } from '../context/WifiContext';

export const useWifi = () => {
  const context = useContext(WifiContext);

  if (!context) {
    throw new Error("useWifi must be used within a WifiProvider");
  }

  return context;
};
