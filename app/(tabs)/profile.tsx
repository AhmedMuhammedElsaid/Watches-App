import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Type';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { useFavourites } from '@/features/favourites/hooks';
import { useOrders } from '@/features/orders/hooks';
import { formatPrice, type Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { session } = useAuth();
  const scheme = useColorScheme();
  const palette = Colors[scheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { count: bagCount } = useCart();
  const { data: orders } = useOrders();
  const { data: saved } = useFavourites();

  const tint = palette.tint;
  const onTint = palette.onTint;
  const card = palette.card;
  const border = palette.border;
  const muted = palette.muted;

  if (!session) {
    return (
      <View style={styles.center}>
        <View style={[styles.guestAvatar, { backgroundColor: card, borderColor: border }]}>
          <MaterialIcons name="person-outline" size={40} color={muted} />
        </View>
        <Text style={styles.title}>Welcome</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Sign in to track your orders, save your details, and check out faster.
        </Text>
        <Pressable
          onPress={() => router.push('/sign-in')}
          style={({ pressed }) => [styles.cta, { backgroundColor: tint, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={[styles.ctaLabel, { color: onTint }]}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  const email = session.user.email ?? '';
  const fullName = (session.user.user_metadata?.full_name as string | undefined) ?? null;
  const displayName = fullName ?? email.split('@')[0] ?? 'Guest';
  const initial = displayName.charAt(0).toUpperCase();
  const orderCount = orders?.length ?? 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <LinearGradient
        colors={[tint, palette.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 28 }]}>
        <View style={[styles.avatar, { backgroundColor: palette.background, borderColor: tint }]}>
          <Text style={[styles.avatarLetter, { color: tint }]}>{initial}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={[styles.email, { color: palette.text }]}>{email}</Text>
      </LinearGradient>

      {/* Stats */}
      <View style={[styles.stats, { backgroundColor: card, borderColor: border }]}>
        <Stat label="Orders" value={String(orderCount)} />
        <View style={[styles.statDivider, { backgroundColor: border }]} />
        <Stat label="Saved" value={String(saved?.length ?? 0)} />
        <View style={[styles.statDivider, { backgroundColor: border }]} />
        <Stat label="In bag" value={String(bagCount)} />
      </View>

      {/* Saved items */}
      <Text style={[styles.sectionTitle, { color: muted }]}>Saved items</Text>
      {saved && saved.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedScroll}>
          {saved.map((product) => (
            <SavedCard key={product.id} product={product} />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.savedEmpty, { backgroundColor: card, borderColor: border }]}>
          <MaterialIcons name="favorite-border" size={22} color={muted} />
          <Text style={[styles.savedEmptyText, { color: muted }]}>
            Tap the heart on any watch to save it here.
          </Text>
        </View>
      )}

      {/* Account menu */}
      <Text style={[styles.sectionTitle, { color: muted }]}>Account</Text>
      <View style={[styles.menu, { backgroundColor: card, borderColor: border }]}>
        <MenuRow
          icon="receipt-long"
          label="My orders"
          hint={orderCount > 0 ? `${orderCount} placed` : 'None yet'}
          onPress={() => router.push('/(tabs)/orders')}
        />
        <Divider color={border} />
        <MenuRow
          icon="shopping-bag"
          label="Shopping bag"
          hint={bagCount > 0 ? `${bagCount} item${bagCount > 1 ? 's' : ''}` : 'Empty'}
          onPress={() => router.push('/(tabs)/cart')}
        />
        <Divider color={border} />
        <MenuRow icon="storefront" label="Continue shopping" onPress={() => router.push('/(tabs)')} />
      </View>

      {/* Sign out */}
      <Pressable
        onPress={() => supabase.auth.signOut()}
        style={({ pressed }) => [
          styles.signOut,
          { borderColor: border, opacity: pressed ? 0.6 : 1 },
        ]}>
        <MaterialIcons name="logout" size={18} color="#d05252" />
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

function SavedCard({ product }: { product: Product }) {
  const router = useRouter();
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const muted = useThemeColor({}, 'muted');

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/watch/[id]', params: { id: product.id } })}
      style={({ pressed }) => [
        styles.savedCard,
        { backgroundColor: card, borderColor: border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Image source={{ uri: product.image_url }} style={styles.savedImage} contentFit="cover" transition={200} />
      <View style={[styles.savedBody, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.savedBrand, { color: tint }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.savedName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.savedPrice, { color: muted }]}>
          {formatPrice(product.price_cents, product.currency)}
        </Text>
      </View>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const muted = useThemeColor({}, 'muted');
  return (
    <View style={[styles.stat, { backgroundColor: 'transparent' }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  const tint = useThemeColor({}, 'tint');
  const muted = useThemeColor({}, 'muted');
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, { opacity: pressed ? 0.6 : 1 }]}>
      <MaterialIcons name={icon} size={22} color={tint} />
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={[styles.menuRight, { backgroundColor: 'transparent' }]}>
        {hint && <Text style={[styles.menuHint, { color: muted }]}>{hint}</Text>}
        <MaterialIcons name="chevron-right" size={22} color={muted} />
      </View>
    </Pressable>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 28,
  },
  guestAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 26,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  cta: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 26,
    gap: 6,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarLetter: {
    fontFamily: Fonts.display,
    fontSize: 38,
  },
  name: {
    fontFamily: Fonts.display,
    fontSize: 24,
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 14,
    opacity: 0.8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: -16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontFamily: Fonts.displayMedium,
    fontSize: 18,
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 34,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginHorizontal: 22,
    marginTop: 24,
    marginBottom: 10,
  },
  savedScroll: {
    paddingHorizontal: 18,
    gap: 12,
  },
  savedCard: {
    width: 150,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  savedImage: {
    width: '100%',
    height: 150,
  },
  savedBody: {
    padding: 10,
    gap: 2,
  },
  savedBrand: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  savedName: {
    fontFamily: Fonts.displayMedium,
    fontSize: 13,
  },
  savedPrice: {
    fontSize: 12.5,
    marginTop: 2,
  },
  savedEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  savedEmptyText: {
    flex: 1,
    fontSize: 14,
  },
  menu: {
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuHint: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 18,
    marginTop: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 14,
  },
  signOutLabel: {
    color: '#d05252',
    fontSize: 15,
    fontWeight: '600',
  },
});
