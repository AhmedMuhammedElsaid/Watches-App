import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { ProductImage } from '@/components/ProductImage';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { useCart } from '@/features/cart/CartContext';
import { formatPrice, type CartItem } from '@/lib/types';

export default function CartScreen() {
  const { items, totalCents } = useCart();
  const router = useRouter();
  const tint = useThemeColor({}, 'tint');
  const onTint = useThemeColor({}, 'onTint');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialIcons name="shopping-bag" size={44} color={muted} />
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={{ color: muted }}>Pieces you add will appear here.</Text>
        <Pressable
          onPress={() => router.push('/(tabs)')}
          style={({ pressed }) => [
            styles.browseButton,
            { borderColor: tint, opacity: pressed ? 0.7 : 1 },
          ]}>
          <Text style={[styles.browseLabel, { color: tint }]}>Browse the boutique</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartRow item={item} />}
        contentContainerStyle={styles.list}
      />
      <View style={[styles.footer, { borderTopColor: border }]}>
        <View style={[styles.totalRow, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.totalLabel, { color: muted }]}>Total</Text>
          <Text style={styles.totalValue}>
            {formatPrice(totalCents, items[0].product.currency)}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/checkout')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: tint, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.buttonLabel, { color: onTint }]}>Proceed to checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const { setQuantity, remove } = useCart();
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.row, { backgroundColor: card, borderColor: border }]}>
      <ProductImage uri={item.product.image_url} style={styles.thumb} transition={200} />
      <View style={[styles.rowBody, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.rowBrand, { color: tint }]}>{item.product.brand}</Text>
        <Text style={styles.rowName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={[styles.rowPrice, { color: muted }]}>
          {formatPrice(item.product.price_cents * item.quantity, item.product.currency)}
        </Text>
        <View style={[styles.qtyRow, { backgroundColor: 'transparent' }]}>
          <View style={[styles.stepper, { borderColor: border, backgroundColor: 'transparent' }]}>
            <Pressable
              onPress={() => setQuantity(item.product.id, item.quantity - 1)}
              hitSlop={6}
              style={styles.stepBtn}>
              <MaterialIcons name="remove" size={16} color={tint} />
            </Pressable>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Pressable
              onPress={() => setQuantity(item.product.id, item.quantity + 1)}
              hitSlop={6}
              style={styles.stepBtn}>
              <MaterialIcons name="add" size={16} color={tint} />
            </Pressable>
          </View>
          <Pressable onPress={() => remove(item.product.id)} hitSlop={8}>
            <MaterialIcons name="delete-outline" size={20} color={muted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  emptyTitle: {
    fontFamily: Fonts.displayMedium,
    fontSize: 22,
  },
  browseButton: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  browseLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  list: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumb: {
    width: 104,
    height: 136,
  },
  rowBody: {
    flex: 1,
    padding: 13,
    gap: 3,
  },
  rowBrand: {
    fontSize: 10.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  rowName: {
    fontFamily: Fonts.displayMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  rowPrice: {
    fontSize: 14,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  qty: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontFamily: Fonts.display,
    fontSize: 22,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
