import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumArt } from '@/components/AlbumArt';
import { quickPlay, shelves, type QuickPlayItem, type Shelf, type ShelfItem } from '@/data/mockHome';
import { colors } from '@/theme/colors';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function QuickPlayCard({ item }: { item: QuickPlayItem }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.quickCard}>
      <AlbumArt palette={item.palette} seed={item.id} size={56} radius={12} />
      <Text style={styles.quickTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

function ShelfRow({ shelf }: { shelf: Shelf }) {
  return (
    <View style={styles.shelf}>
      <Text style={styles.shelfTitle}>{shelf.title}</Text>
      <FlatList
        data={shelf.items}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shelfList}
        renderItem={({ item }) => <ShelfCard item={item} />}
      />
    </View>
  );
}

function ShelfCard({ item }: { item: ShelfItem }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.shelfCard}>
      <AlbumArt palette={item.palette} seed={item.id} size={148} radius={20} />
      <Text style={styles.shelfCardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.shelfCardSubtitle} numberOfLines={2}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );
}

export default function Home() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{greeting()}</Text>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </View>

        <View style={styles.quickGrid}>
          {quickPlay.map((item) => (
            <QuickPlayCard key={item.id} item={item} />
          ))}
        </View>

        {shelves.map((shelf) => (
          <ShelfRow key={shelf.id} shelf={shelf} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  quickCard: {
    width: '47%',
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginBottom: 10,
    marginHorizontal: 4,
    flexBasis: '47%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
    marginRight: 6,
  },
  shelf: {
    marginBottom: 28,
  },
  shelfTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  shelfList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  shelfCard: {
    width: 148,
  },
  shelfCardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
  },
  shelfCardSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
