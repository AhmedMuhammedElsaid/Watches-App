import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const text = useThemeColor({}, 'text');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');
  const onTint = useThemeColor({}, 'onTint');

  const submit = async () => {
    setError(null);
    setPending(true);
    const credentials = { email: email.trim(), password };
    const { error: authError } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);
    setPending(false);

    if (authError) {
      setError(authError.message);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.kicker, { color: tint }]}>Fine timepieces</Text>
      <Text style={styles.title}>{mode === 'sign-in' ? 'Welcome back' : 'Create account'}</Text>

      <TextInput
        style={[styles.input, { backgroundColor: card, borderColor: border, color: text }]}
        placeholder="Email"
        placeholderTextColor={muted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, { backgroundColor: card, borderColor: border, color: text }]}
        placeholder="Password"
        placeholderTextColor={muted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        disabled={pending || !email.trim() || !password}
        onPress={submit}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: tint, opacity: pending ? 0.5 : pressed ? 0.85 : 1 },
        ]}>
        <Text style={[styles.buttonLabel, { color: onTint }]}>
          {pending ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')} hitSlop={8}>
        <Text style={[styles.switch, { color: tint }]}>
          {mode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 14,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 30,
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  error: {
    color: '#d05252',
    fontSize: 14,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  switch: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
});
