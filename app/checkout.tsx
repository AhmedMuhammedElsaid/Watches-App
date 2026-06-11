import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { useCreateOrder } from '@/features/orders/hooks';
import { formatPrice } from '@/lib/types';

export default function CheckoutScreen() {
  const { items, totalCents, clear } = useCart();
  const { session } = useAuth();
  const createOrder = useCreateOrder();
  const router = useRouter();

  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');
  const onTint = useThemeColor({}, 'onTint');

  const placeOrder = () => {
    createOrder.mutate(items, {
      onSuccess: () => {
        clear();
        router.dismissAll();
        router.replace('/(tabs)/orders');
      },
    });
  };

  if (!session) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="lock-outline" size={40} color={muted} />
        <Text style={styles.title}>Sign in to checkout</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          You need an account to place an order.
        </Text>
        <Pressable
          onPress={() => router.replace('/sign-in')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: tint, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.buttonLabel, { color: onTint }]}>Go to sign in</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.sectionTitle, { color: muted }]}>Order summary</Text>
      <View style={[styles.summary, { backgroundColor: card, borderColor: border }]}>
        {items.map((item, index) => (
          <View
            key={item.product.id}
            style={[
              styles.line,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: border },
              { backgroundColor: 'transparent' },
            ]}>
            <Text style={styles.lineName} numberOfLines={2}>
              {item.quantity} × {item.product.brand} — {item.product.name}
            </Text>
            <Text style={styles.linePrice}>
              {formatPrice(item.product.price_cents * item.quantity, item.product.currency)}
            </Text>
          </View>
        ))}
        <View
          style={[
            styles.line,
            { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: border, backgroundColor: 'transparent' },
          ]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatPrice(totalCents, items[0]?.product.currency)}
          </Text>
        </View>
      </View>

      <Text style={[styles.note, { color: muted }]}>
        Demo checkout — the order is recorded as “pending”. Connect a payment provider (e.g.
        Stripe) to accept real payments.
      </Text>

      {createOrder.isError && (
        <Text style={styles.error}>
          {createOrder.error instanceof Error ? createOrder.error.message : 'Failed to place order.'}
        </Text>
      )}

      <Pressable
        disabled={createOrder.isPending || items.length === 0}
        onPress={placeOrder}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: tint, opacity: createOrder.isPending ? 0.5 : pressed ? 0.85 : 1 },
        ]}>
        <Text style={[styles.buttonLabel, { color: onTint }]}>
          {createOrder.isPending ? 'Placing order…' : 'Place order'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  title: {
    fontFamily: Fonts.displayMedium,
    fontSize: 22,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  summary: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 13,
  },
  lineName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  linePrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabel: {
    fontFamily: Fonts.displayMedium,
    fontSize: 16,
  },
  totalValue: {
    fontFamily: Fonts.display,
    fontSize: 17,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    color: '#d05252',
    fontSize: 14,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
