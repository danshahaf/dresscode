import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressChart } from '@/app/components/progress/ProgressChart';
import { OutfitTicket } from '@/app/components/progress/OutfitTicket';
import { OutfitDetailModal } from '@/app/components/progress/OutfitDetailModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { progressStyles } from '@/app/styles/progress.styles';
import { Outfit } from '@/app/data/progress.data';

function formatDate(dateString: string): string {
  const dateObj = new Date(dateString);
  const today = new Date();
  // Reset both dates to midnight for accurate day comparison
  const todayYMD = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateYMD = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffTime = todayYMD.getTime() - dateYMD.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    const day = dateObj.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];
    return `${day} ${month}`;
  }
}


export default function ProgressScreen() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    async function fetchOutfits() {
      try {
        // Query the "outfits" table where the user_id matches the logged in user
        const { data, error } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user?.id);
  
        if (error) {
          console.error('Error fetching outfits:', error);
        } else {
          // Convert snake_case fields from Supabase to camelCase for your app
          const formattedData = (data || []).map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            imageUrl: item.image_url,  // converting "image_url" to "imageUrl"
            score: item.score,
            date: formatDate(item.created_at),     // converting "created_at" to "date"
          }));
          setOutfits(formattedData);
        }
      } catch (err) {
        console.error('Unexpected error fetching outfits:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchOutfits();
    }
  }, [user]);
  

  // Handle outfit ticket press
  const handleOutfitPress = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setDetailModalVisible(true);
  };

  // Render each outfit ticket
  const renderOutfitTicket = ({ item }: { item: Outfit }) => (
    <OutfitTicket outfit={item} onPress={handleOutfitPress} />
  );

  if (loading) {
    return (
      <SafeAreaView style={progressStyles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading outfits...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={progressStyles.container}>
      {/* Progress Chart */}
      <ProgressChart dailyScores={[]} /> {/* Update if you have real chart data */}
      
      {/* Recent Outfits Section */}
      <Text style={progressStyles.sectionTitle}>Recent Outfits</Text>
      <FlatList
        data={outfits}
        renderItem={renderOutfitTicket}
        keyExtractor={(item) => item.id.toString()}
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
