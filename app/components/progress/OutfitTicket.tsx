import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Outfit } from '@/app/data/progress.data';
import { progressStyles, outfitDimensions } from '@/app/styles/progress.styles';

interface OutfitTicketProps {
  outfit: Outfit;
  onPress: (outfit: Outfit) => void;
  size?: 'small' | 'medium' | 'large';
}

export const OutfitTicket = ({ outfit, onPress, size = 'medium' }: OutfitTicketProps) => {
  // Determine dimensions based on size prop
  const getTicketHeight = () => {
    switch(size) {
      case 'small': return 120;
      case 'large': return 200;
      default: return 160; // medium
    }
  };
  
  const ticketHeight = getTicketHeight();
  const ticketWidth = outfitDimensions.ticketWidth;
  
  return (
    <TouchableOpacity 
      style={[
        progressStyles.outfitTicket, 
        { width: ticketWidth, height: ticketHeight }
      ]}
      onPress={() => onPress(outfit)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: outfit.imageUrl }} 
        style={progressStyles.outfitImage}
        resizeMode="cover"
      />
      
      {/* Overlay for date and score */}
      <View style={styles.overlay}>
        <Text style={styles.dateText}>{outfit.date}</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{outfit.score}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scoreCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 167, 2, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  scoreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  }
}); 