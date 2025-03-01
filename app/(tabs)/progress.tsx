import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressChart } from '@/app/components/progress/ProgressChart';
import { OutfitTicket } from '@/app/components/progress/OutfitTicket';
import { OutfitDetailModal } from '@/app/components/progress/OutfitDetailModal';
import { mockDailyScores, mockOutfits, Outfit } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';

export default function ProgressScreen() {
  // State for outfit detail modal
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Handle outfit ticket press
  const handleOutfitPress = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setDetailModalVisible(true);
  };

  // Render each outfit ticket
  const renderOutfitTicket = ({ item }: { item: Outfit }) => (
    <OutfitTicket item={item} onPress={handleOutfitPress} />
  );

  return (
    <SafeAreaView style={progressStyles.container}>
      <View style={progressStyles.header}>
        <Text style={progressStyles.title}>Style Progress</Text>
        <Text style={progressStyles.subtitle}>Track your fashion journey</Text>
      </View>

      {/* Progress Chart */}
      <ProgressChart dailyScores={mockDailyScores} />

      {/* Recent Outfits Section */}
      <Text style={progressStyles.sectionTitle}>Recent Outfits</Text>
      <FlatList
        data={mockOutfits}
        renderItem={renderOutfitTicket}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={progressStyles.outfitsContainer}
        columnWrapperStyle={progressStyles.outfitGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Outfit Detail Modal */}
      <OutfitDetailModal
        visible={detailModalVisible}
        outfit={selectedOutfit}
        onClose={() => {
          setDetailModalVisible(false);
          // Reset selected outfit after animation completes
          setTimeout(() => setSelectedOutfit(null), 300);
        }}
      />
    </SafeAreaView>
  );
}