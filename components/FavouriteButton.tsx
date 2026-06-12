import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useThemeColor } from '@/components/Themed';
import { useAuth } from '@/features/auth/AuthContext';
import { useIsFavourite, useToggleFavourite } from '@/features/favourites/hooks';
import type { Product } from '@/lib/types';

export function FavouriteButton({
  product,
  size = 22,
  overlay = false,
}: {
  product: Product;
  size?: number;
  overlay?: boolean;
}) {
  const { session } = useAuth();
  const isFavourite = useIsFavourite(product.id);
  const toggle = useToggleFavourite();
  const router = useRouter();
  const tint = useThemeColor({}, 'tint');

  const onPress = () => {
    if (!session) {
      router.push('/sign-in');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggle.mutate({ product, isFavourite });
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Remove from saved' : 'Save to wishlist'}
      style={overlay ? styles.overlay : styles.header}>
      <MaterialIcons
        name={isFavourite ? 'favorite' : 'favorite-border'}
        size={size}
        color={isFavourite ? tint : overlay ? '#fff' : tint}
        style={[styles.icon, { width: size, height: size }]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,10,12,0.5)',
    borderRadius: 999,
  },
});
