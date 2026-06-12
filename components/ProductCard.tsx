import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { FavouriteButton } from '@/components/FavouriteButton';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { formatPrice, type Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');

  return (
    <Link href={{ pathname: '/watch/[id]', params: { id: product.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${product.brand} ${product.name}, ${formatPrice(product.price_cents, product.currency)}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: card, borderColor: border, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}>
        <View style={[styles.imageWrap, { backgroundColor: 'transparent' }]}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={250}
            recyclingKey={product.id}
          />
          {product.stock === 0 && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutLabel}>Sold out</Text>
            </View>
          )}
          <FavouriteButton product={product} overlay />
        </View>
        <View style={[styles.body, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.brand, { color: tint }]}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={[styles.priceRow, { backgroundColor: 'transparent' }]}>
            <View style={[styles.rule, { backgroundColor: border }]} />
            <Text style={[styles.price, { color: muted }]}>
              {formatPrice(product.price_cents, product.currency)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 0.92,
  },
  soldOutBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(10,10,12,0.75)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soldOutLabel: {
    color: '#f3efe5',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  body: {
    padding: 12,
    gap: 4,
  },
  brand: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: Fonts.displayMedium,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  rule: {
    width: 22,
    height: StyleSheet.hairlineWidth * 2,
  },
  price: {
    fontSize: 13.5,
    letterSpacing: 0.3,
  },
});
