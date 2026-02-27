import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';
let latestLocation: { latitude: number; longitude: number } | null = null;

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

export default function PermissionsButton() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Poll latestLocation every 2 seconds (simple demo approach)
  useEffect(() => {
    const interval = setInterval(() => {
      if (latestLocation) {
        setCoords(latestLocation);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Button
        onPress={requestPermissions}
        title="Enable background location"
      />

      {coords && (
        <>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
        </>
      )}
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, async({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latitude = locations[0].coords.latitude;
    const longitude = locations[0].coords.longitude;

    latestLocation = { latitude, longitude };
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
