import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { Logo } from '@/components/Logo';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <Logo size={38} />
          <Text style={styles.wordmark} numberOfLines={1}>
            Elaraby Watches
          </Text>
        </View>
        <Text style={[styles.kicker, { color: muted }]}>Fine Timepieces</Text>
        <Text style={styles.title}>{mode === 'sign-in' ? 'Welcome back' : 'Create account'}</Text>

        <TextInput
          style={[styles.input, { backgroundColor: card, borderColor: border, color: text }]}
          placeholder="Email"
          placeholderTextColor={muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCorrect={false}
          returnKeyType="next"
        />
        <View style={[styles.passwordRow, { backgroundColor: card, borderColor: border }]}>
          <TextInput
            style={[styles.passwordInput, { color: text }]}
            placeholder="Password"
            placeholderTextColor={muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <Pressable
            onPress={() => setShowPassword((shown) => !shown)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            style={styles.eyeButton}>
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={22}
              color={muted}
            />
          </Pressable>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          accessibilityRole="button"
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
            {mode === 'sign-in'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 14,
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    fontFamily: Fonts.display,
    fontSize: 27,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginLeft: 50,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
  },
  eyeButton: {
    paddingLeft: 12,
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
