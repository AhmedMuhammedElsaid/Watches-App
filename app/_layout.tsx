import {
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Type';
import { AuthProvider } from '@/features/auth/AuthContext';
import { CartProvider } from '@/features/cart/CartContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_500Medium_Italic,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 2 },
  },
});

function buildTheme(base: Theme, palette: (typeof Colors)['light']): Theme {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.tint,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.border,
    },
  };
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme =
    colorScheme === 'dark'
      ? buildTheme(DarkTheme, Colors.dark)
      : buildTheme(DefaultTheme, Colors.light);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider value={theme}>
            <Stack
              screenOptions={{
                headerTitleStyle: { fontFamily: Fonts.displayMedium, fontSize: 18 },
                headerShadowVisible: false,
              }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="watch/[id]" options={{ title: '' , headerTransparent: false }} />
              <Stack.Screen name="checkout" options={{ presentation: 'modal', title: 'Checkout' }} />
              <Stack.Screen name="sign-in" options={{ presentation: 'modal', title: 'Welcome' }} />
            </Stack>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
