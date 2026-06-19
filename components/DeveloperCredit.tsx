import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Type';

const DEV_PHOTO = require('@/assets/images/AhmedMuhammedElsaid.jpg');

type LinkDef = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  url: string;
};

const LINKS: LinkDef[] = [
  { icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ahmedmuhammedelsaid' },
  { icon: 'globe', label: 'Portfolio', url: 'https://ahmed-muhammed-elsaid.netlify.app/' },
  { icon: 'github', label: 'GitHub', url: 'https://github.com/AhmedMuhammedElsaid' },
];

const DEV_NAME = 'Ahmed Elsaid';
const DEV_ROLE = 'Software Engineer';

/**
 * A self-contained "Crafted by" card crediting the app's developer, with
 * external links to LinkedIn, portfolio and GitHub. Theme-aware; renders the
 * same in light and dark.
 */
export default function DeveloperCredit() {
  const tint = useThemeColor({}, 'tint');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'muted');
  const background = useThemeColor({}, 'background');

  const version = Constants.expoConfig?.version;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.sectionTitle, { color: muted }]}>Crafted by</Text>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        {/* Identity */}
        <View style={[styles.identity, { backgroundColor: 'transparent' }]}>
          <View style={[styles.avatar, { backgroundColor: background, borderColor: tint }]}>
            <Image
              source={DEV_PHOTO}
              style={styles.avatarImage}
              contentFit="cover"
              accessibilityLabel={`Photo of ${DEV_NAME}`}
            />
          </View>
          <View style={[styles.identityText, { backgroundColor: 'transparent' }]}>
            <Text style={styles.name}>{DEV_NAME}</Text>
            <Text style={[styles.role, { color: muted }]}>{DEV_ROLE}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: border }]} />

        {/* Links */}
        <View style={[styles.links, { backgroundColor: 'transparent' }]}>
          {LINKS.map((link) => (
            <Pressable
              key={link.label}
              accessibilityRole="link"
              accessibilityLabel={`Open ${DEV_NAME}'s ${link.label}`}
              onPress={() => Linking.openURL(link.url)}
              style={({ pressed }) => [
                styles.linkButton,
                { borderColor: border, opacity: pressed ? 0.6 : 1 },
              ]}>
              <FontAwesome name={link.icon} size={18} color={tint} />
              <Text style={[styles.linkLabel, { color: muted }]} numberOfLines={1}>
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {version ? <Text style={[styles.version, { color: muted }]}>v{version}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginHorizontal: 22,
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 14,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Fonts.display,
    fontSize: 18,
  },
  role: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  links: {
    flexDirection: 'row',
    gap: 10,
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 12,
  },
  linkLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 14,
    letterSpacing: 0.5,
  },
});
