import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { quickPlay, shelves, type QuickPlayItem, type Shelf, type ShelfItem } from '@/data/mockHome';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function QuickPlayCard({ item }: { item: QuickPlayItem }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.quickCard}>
      <View style={[styles.quickArt, { backgroundColor: item.color }]} />
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
      <View style={[styles.shelfArt, { backgroundColor: item.color }]} />
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
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
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
    backgroundColor: '#121212',
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  quickCard: {
    width: '50%',
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 4,
    flexBasis: '47%',
    overflow: 'hidden',
  },
  quickArt: {
    width: 48,
    height: 48,
  },
  quickTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  shelf: {
    marginBottom: 24,
  },
  shelfTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  shelfList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  shelfCard: {
    width: 144,
  },
  shelfArt: {
    width: 144,
    height: 144,
    borderRadius: 4,
    marginBottom: 8,
  },
  shelfCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  shelfCardSubtitle: {
    color: '#B3B3B3',
    fontSize: 12,
  },
});
