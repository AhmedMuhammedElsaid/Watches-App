import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, type ImageContentFit } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, type StyleProp, type ImageStyle, type ViewStyle } from 'react-native';

import { View, useThemeColor } from '@/components/Themed';

type Props = {
  uri: string | null | undefined;
  style: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  transition?: number;
  recyclingKey?: string;
  accessibilityLabel?: string;
};

/**
 * Product image that falls back to a branded placeholder when the source is
 * missing or fails to load (e.g. the seeded catalog URLs that 403). Keeps the
 * grid/detail/cart looking intentional instead of blank.
 */
export function ProductImage({
  uri,
  style,
  contentFit = 'cover',
  transition = 250,
  recyclingKey,
  accessibilityLabel,
}: Props) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');

  const [failed, setFailed] = useState(false);

  // Reset the error state whenever the source changes so a recycled card or a
  // re-hosted URL gets a fresh attempt.
  useEffect(() => setFailed(false), [uri]);

  if (!uri || failed) {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={[style as StyleProp<ViewStyle>, styles.placeholder, { backgroundColor: card, borderColor: border }]}>
        <MaterialIcons name="watch" size={40} color={muted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      transition={transition}
      recyclingKey={recyclingKey}
      accessibilityLabel={accessibilityLabel}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
