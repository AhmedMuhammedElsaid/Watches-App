import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { FavouriteButton } from '@/components/FavouriteButton';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { useCart } from '@/features/cart/CartContext';
import { useProduct } from '@/features/products/hooks';
import { formatPrice } from '@/lib/types';

export default function WatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const { add, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');
  const onTint = useThemeColor({}, 'onTint');

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} color={tint} />;
  }
  if (isError || !product) {
    return <Text style={styles.message}>Could not load this watch.</Text>;
  }

  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const canAdd = product.stock > inCart;

  const onAdd = () => {
    add(product);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: product.brand,
          headerBackTitle: 'Back',
          headerRight: () => <FavouriteButton product={product} size={24} />,
        }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={300}
            accessibilityLabel={`${product.brand} ${product.name}`}
          />
          <LinearGradient
            colors={['transparent', background]}
            style={styles.imageFade}
            pointerEvents="none"
          />
        </View>

        <View style={styles.body}>
          <Text style={[styles.brand, { color: tint }]}>
            {product.brand} · {product.model}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price_cents, product.currency)}</Text>

          {product.description.length > 0 && (
            <Text style={[styles.description, { color: muted }]}>{product.description}</Text>
          )}

          {Object.keys(product.specs).length > 0 && (
            <View style={[styles.specs, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.specsTitle, { color: muted }]}>Specifications</Text>
              {Object.entries(product.specs).map(([key, value], index) => (
                <View
                  key={key}
                  style={[
                    styles.specRow,
                    index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: border },
                    { backgroundColor: 'transparent' },
                  ]}>
                  <Text style={[styles.specKey, { color: muted }]}>{key.replaceAll('_', ' ')}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.stockRow, { backgroundColor: 'transparent' }]}>
            <MaterialIcons
              name={product.stock > 0 ? 'check-circle-outline' : 'remove-circle-outline'}
              size={16}
              color={product.stock > 0 ? tint : muted}
            />
            <Text style={[styles.stock, { color: muted }]}>
              {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
              {inCart > 0 ? `  ·  ${inCart} in your bag` : ''}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: card, borderTopColor: border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to bag"
          disabled={!canAdd}
          onPress={onAdd}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: tint, opacity: canAdd ? (pressed ? 0.85 : 1) : 0.35 },
          ]}>
          <Text style={[styles.buttonLabel, { color: onTint }]}>
            {justAdded ? 'Added to bag ✓' : canAdd ? 'Add to bag' : 'Unavailable'}
          </Text>
        </Pressable>
        {inCart > 0 && (
          <Pressable onPress={() => router.push('/(tabs)/cart')} hitSlop={8}>
            <Text style={[styles.viewBag, { color: tint }]}>View bag</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loader: {
    marginTop: 48,
  },
  message: {
    textAlign: 'center',
    marginTop: 48,
  },
  content: {
    paddingBottom: 24,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 10,
  },
  brand: {
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: Fonts.display,
    fontSize: 27,
    lineHeight: 34,
  },
  price: {
    fontFamily: Fonts.displayMedium,
    fontSize: 21,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 2,
  },
  specs: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  specsTitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingTop: 14,
    paddingBottom: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
  },
  specKey: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  stock: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  viewBag: {
    fontSize: 14,
    fontWeight: '600',
  },
});
