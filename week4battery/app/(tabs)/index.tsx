import { usePowerState } from 'expo-battery';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { lowPowerMode, batteryLevel, batteryState } = usePowerState();

  return (
    <View style={styles.container}>
      <Text>Current Battery Level aaaa: {batteryLevel}</Text>
      <Text>Current Battery State: {batteryState}</Text>
      <Text>Is Battery in Low Power: {lowPowerMode? "Yes": "No"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
