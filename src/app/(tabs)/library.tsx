import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthContext';
import { colors } from '@/theme/colors';

export default function Library() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity
          onPress={() => signOut()}
          hitSlop={8}
          activeOpacity={0.7}
          style={styles.signOutButton}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.text} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.hint}>Coming soon</Text>
        {user?.email ? <Text style={styles.email}>Signed in as {user.email}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
  },
  email: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
