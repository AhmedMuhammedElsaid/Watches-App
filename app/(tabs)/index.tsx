import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/ProductCard';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';
import { useCategories, useProducts } from '@/features/products/hooks';

export default function ShopScreen() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const insets = useSafeAreaInsets();

  const text = useThemeColor({}, 'text');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const tint = useThemeColor({}, 'tint');

  const { data: categories } = useCategories();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useProducts({ search: search.trim() || undefined, categoryId });

  const products = data?.pages.flat() ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 14 }]}>
      <View style={styles.masthead}>
        <Text style={[styles.kicker, { color: tint }]}>Fine timepieces</Text>
        <Text style={styles.title}>The Boutique</Text>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: card, borderColor: border }]}>
        <MaterialIcons name="search" size={20} color={muted} />
        <TextInput
          style={[styles.search, { color: text }]}
          placeholder="Search brand or model…"
          placeholderTextColor={muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <MaterialIcons name="close" size={18} color={muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <Chip label="All" active={!categoryId} onPress={() => setCategoryId(undefined)} />
          {categories?.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              active={categoryId === category.id}
              onPress={() => setCategoryId(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.listArea}>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={tint} />
        ) : isError ? (
          <Text style={styles.message}>
            {error instanceof Error ? error.message : 'Failed to load watches.'}
          </Text>
        ) : products.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Nothing found</Text>
            <Text style={[styles.message, { color: muted }]}>Try a different search or category.</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cell}>
                <ProductCard product={item} />
              </View>
            )}
            columnWrapperStyle={styles.column}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isFetchingNextPage ? <ActivityIndicator style={styles.footerLoader} color={tint} /> : null
            }
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const onTint = useThemeColor({}, 'onTint');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active
          ? { backgroundColor: tint, borderColor: tint }
          : { backgroundColor: card, borderColor: border },
      ]}>
      <Text style={[styles.chipLabel, active && { color: onTint, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  masthead: {
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 18,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  chipsRow: {
    height: 60,
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  chip: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  chipLabel: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  loader: {
    marginTop: 48,
  },
  footerLoader: {
    marginVertical: 16,
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 56,
  },
  emptyTitle: {
    fontFamily: Fonts.displayMedium,
    fontSize: 20,
  },
  listArea: {
    flex: 1,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  column: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cell: {
    width: '48%',
    marginBottom: 16,
  },
});
