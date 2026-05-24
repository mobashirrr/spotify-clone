import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify Clone</Text>
      <Text style={styles.subtitle}>Day 1 setup complete</Text>
      <Text style={styles.hint}>Edit src/app/index.tsx to start building</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#1DB954',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  hint: {
    color: '#888',
    fontSize: 13,
  },
});
