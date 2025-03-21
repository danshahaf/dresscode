import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressChart } from '@/app/components/progress/ProgressChart';
import { OutfitTicket } from '@/app/components/progress/OutfitTicket';
import { OutfitDetailModal } from '@/app/components/progress/OutfitDetailModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { progressStyles } from '@/app/styles/progress.styles';
import { Outfit } from '@/app/data/progress.data';

import { useLocalSearchParams, useRouter } from 'expo-router';



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




// second date formatting function
const formatDateForChart = (dateObj: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const resetTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayStr = resetTime(today).toISOString().slice(0, 10);
  const yesterdayStr = resetTime(yesterday).toISOString().slice(0, 10);
  const currentStr = resetTime(dateObj).toISOString().slice(0, 10);
  
  if (currentStr === todayStr) return "Today";
  if (currentStr === yesterdayStr) return "Yesterday";
  
  const day = dateObj.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthNames[dateObj.getMonth()]}`;
};


interface DailyScore {
  date: string; // e.g., "Today", "Yesterday", "23 May"
  score: number | null; // average score; null if no outfits on that day
}


export default function ProgressScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
    
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOutfits(); // or call all your refresh functions as needed
    setRefreshing(false);
  };
  

  async function fetchOutfits() {
    try {
      // Query the "outfits" table where the user_id matches the logged in user
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', {ascending: false});

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

  useEffect(() => {
    const newOutfitId = searchParams.newOutfitId;
    if (newOutfitId && outfits.length > 0) {
      const outfitToShow = outfits.find((o) => o.id.toString() === newOutfitId);
      if (outfitToShow) {
        setSelectedOutfit(outfitToShow);
        setDetailModalVisible(true);
        router.replace('/(tabs)/progress');
      }
    }
  }, [searchParams.newOutfitId, outfits]);
  

  useEffect(() => {
    async function fetchDailyScores() {
      try {
        if (!user) return;
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 7); // 7 days including today

        const { data, error } = await supabase
          .from('outfits')
          .select('created_at, score')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString());

        if (error) {
          console.error('Error fetching outfits for daily scores:', error);
          return;
        }

        // Group scores by day key (YYYY-MM-DD)
        const scoresByDay: { [key: string]: number[] } = {};
        (data || []).forEach((outfit: any) => {
          const dayKey = outfit.created_at.slice(0, 10);
          if (!scoresByDay[dayKey]) scoresByDay[dayKey] = [];
          scoresByDay[dayKey].push(outfit.score);
        });

        const daily: DailyScore[] = [];
        for (let i = 0; i < 8; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const key = d.toISOString().slice(0, 10);
          const scores = scoresByDay[key];
          const avgScore = scores ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
          daily.push({
            date: formatDateForChart(d),
            score: avgScore,
          });
        }
        setDailyScores(daily);
      } catch (err) {
        console.error('Unexpected error fetching daily scores:', err);
      }
    }
    if (user) fetchDailyScores();
  }, [user]);
  
  // Fetch outfits from Supabase
  useEffect(() => {
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
    <View style={styles.outfitItem}>
      <OutfitTicket outfit={item} onPress={handleOutfitPress} />
    </View>
  );


  if (loading) {
    return (
      <SafeAreaView style={progressStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>Loading outfits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={progressStyles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#cca702"
          />
        }
      >
        {/* Progress Chart */}
        <ProgressChart dailyScores={dailyScores} />
        
        {/* Recent Outfits Section */}
        <View>
          <Text style={progressStyles.sectionTitle}>Recent Outfits</Text>
          <FlatList
            data={outfits}
            renderItem={renderOutfitTicket}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={progressStyles.outfitsContainer}
            columnWrapperStyle={progressStyles.outfitGrid}
            showsVerticalScrollIndicator={false}
            // Remove refreshControl from here if you previously added it
          />
  
          {/* Outfit Detail Modal */}
          <OutfitDetailModal
            visible={detailModalVisible}
            outfit={selectedOutfit}
            onClose={() => {
              setDetailModalVisible(false);
              setTimeout(() => setSelectedOutfit(null), 300);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  outfitItem: {
    width: '28%',
    marginVertical: '1%',
    marginHorizontal: '2.5%',
  },
});

