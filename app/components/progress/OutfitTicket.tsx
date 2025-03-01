import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Outfit } from '@/app/data/progress.data';
import { progressStyles, outfitDimensions } from '@/app/styles/progress.styles';

interface OutfitTicketProps {
  item: Outfit;
  onPress: (outfit: Outfit) => void;
}

export const OutfitTicket = ({ item, onPress }: OutfitTicketProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View 
        style={[
          progressStyles.outfitTicket, 
          { 
            width: outfitDimensions.ticketWidth, 
            height: outfitDimensions.ticketWidth * 1.5 
          }
        ]}
      >
        <Image source={{ uri: item.image }} style={progressStyles.outfitImage} />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.9)']}
          locations={[0.4, 0.7, 1]}
          style={progressStyles.outfitGradient}
        >
          <Text style={progressStyles.outfitDate}>{item.date}</Text>
          <View style={progressStyles.scoreCircle}>
            <Text style={progressStyles.scoreText}>{item.score}</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}; 