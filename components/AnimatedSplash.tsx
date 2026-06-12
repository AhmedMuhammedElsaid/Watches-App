import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

import { Logo } from '@/components/Logo';
import { Fonts } from '@/constants/Type';

const BG = '#0a0a0c';
const GOLD = '#c9a96a';

/**
 * Branded startup animation that plays over the app on cold start:
 * the gold dial scales + rotates into place, the wordmark fades up,
 * then the whole overlay dissolves to reveal the app.
 */
export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const scale = useRef(new Animated.Value(0.55)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textShift = useRef(new Animated.Value(12)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(spin, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(textShift, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
      Animated.delay(650),
      Animated.timing(containerOpacity, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, [containerOpacity, logoOpacity, onFinish, scale, spin, textOpacity, textShift]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['-110deg', '0deg'] });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale }, { rotate }] }}>
        <Logo size={112} color={GOLD} />
      </Animated.View>
      <Animated.View
        style={[styles.textWrap, { opacity: textOpacity, transform: [{ translateY: textShift }] }]}>
        <Text style={styles.word}>Elaraby Watches</Text>
        <Text style={styles.kicker}>FINE TIMEPIECES</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    zIndex: 100,
    elevation: 100,
  },
  textWrap: {
    alignItems: 'center',
  },
  word: {
    fontFamily: Fonts.display,
    fontSize: 30,
    color: '#f3efe5',
    letterSpacing: 1,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 4,
    color: GOLD,
    marginTop: 8,
  },
});
