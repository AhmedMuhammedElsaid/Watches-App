import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { useAuth } from '@/features/auth/AuthContext';
import { useOrders } from '@/features/orders/hooks';
import { formatPrice, type OrderStatus, type OrderWithItems } from '@/lib/types';

const STATUS_ICONS: Record<OrderStatus, keyof typeof MaterialIcons.glyphMap> = {
  pending: 'schedule',
  paid: 'credit-card',
  shipped: 'local-shipping',
  delivered: 'check-circle-outline',
  cancelled: 'cancel',
};

export default function OrdersScreen() {
  const { session } = useAuth();
  const { data: orders, isLoading, isError } = useOrders();
  const tint = useThemeColor({}, 'tint');
  const muted = useThemeColor({}, 'muted');

  if (!session) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="receipt-long" size={44} color={muted} />
        <Text style={styles.title}>Your orders</Text>
        <Link href="/sign-in" style={[styles.link, { color: tint }]}>
          Sign in to see your order history
        </Link>
      </View>
    );
  }

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} color={tint} />;
  }

  if (isError) {
    return <Text style={styles.message}>Failed to load orders.</Text>;
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="receipt-long" size={44} color={muted} />
        <Text style={styles.title}>No orders yet</Text>
        <Text style={{ color: muted }}>Your purchases will appear here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.id}
      renderItem={({ item }) => <OrderCard order={item} />}
      contentContainerStyle={styles.list}
    />
  );
}

function OrderCard({ order }: { order: OrderWithItems }) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
      <View style={[styles.cardHeader, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.date, { color: muted }]}>
          {new Date(order.created_at).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <View style={[styles.status, { backgroundColor: 'transparent' }]}>
          <MaterialIcons name={STATUS_ICONS[order.status]} size={14} color={tint} />
          <Text style={[styles.statusLabel, { color: tint }]}>{order.status}</Text>
        </View>
      </View>
      {order.order_items.map((item) => (
        <Text key={item.id} style={styles.item} numberOfLines={1}>
          {item.quantity} × {item.products.brand} {item.products.name}
        </Text>
      ))}
      <View style={[styles.cardFooter, { borderTopColor: border, backgroundColor: 'transparent' }]}>
        <Text style={[styles.totalLabel, { color: muted }]}>Total</Text>
        <Text style={styles.total}>{formatPrice(order.total_cents, order.currency)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontFamily: Fonts.displayMedium,
    fontSize: 22,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  loader: {
    marginTop: 48,
  },
  message: {
    textAlign: 'center',
    marginTop: 48,
  },
  list: {
    padding: 14,
  },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 5,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  item: {
    fontSize: 14,
    lineHeight: 21,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  total: {
    fontFamily: Fonts.displayMedium,
    fontSize: 17,
  },
});
