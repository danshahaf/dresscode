import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { heightPickerStyles } from '@/app/styles/profile.styles';

interface HeightPickerModalProps {
  visible: boolean;
  onClose: () => void;
  feet: string;
  inches: string;
  onFeetChange: (value: string) => void;
  onInchesChange: (value: string) => void;
  onSave: () => void;
}

export const HeightPickerModal = ({ 
  visible, 
  onClose, 
  feet, 
  inches, 
  onFeetChange, 
  onInchesChange, 
  onSave 
}: HeightPickerModalProps) => {
  // Generate feet options (4-7 feet)
  const feetOptions = [];
  for (let i = 4; i <= 7; i++) {
    feetOptions.push(i.toString());
  }

  // Generate inches options (0-11 inches)
  const inchesOptions = [];
  for (let i = 0; i <= 11; i++) {
    inchesOptions.push(i.toString());
  }
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={heightPickerStyles.pickerModalOverlay}>
        <View style={heightPickerStyles.pickerContainer}>
          <View style={heightPickerStyles.pickerHeader}>
            <TouchableOpacity onPress={onClose} style={heightPickerStyles.pickerCancelButton}>
              <Text style={heightPickerStyles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={heightPickerStyles.pickerTitle}>Select Height</Text>
            
            <TouchableOpacity onPress={onSave} style={heightPickerStyles.pickerDoneButton}>
              <Text style={heightPickerStyles.pickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={heightPickerStyles.pickerContent}>
            <View style={heightPickerStyles.pickerColumn}>
              <Text>Feet</Text>
              <Picker
                selectedValue={feet}
                onValueChange={onFeetChange}
                style={heightPickerStyles.picker}
                itemStyle={heightPickerStyles.pickerItem}
              >
                {feetOptions.map((value) => (
                  <Picker.Item key={`feet-${value}`} label={`${value} ft`} value={value} />
                ))}
              </Picker>
            </View>
            
            <View style={heightPickerStyles.pickerColumn}>
              <Text>Inches</Text>
              <Picker
                selectedValue={inches}
                onValueChange={onInchesChange}
                style={heightPickerStyles.picker}
                itemStyle={heightPickerStyles.pickerItem}
              >
                {inchesOptions.map((value) => (
                  <Picker.Item key={`inches-${value}`} label={`${value} in`} value={value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 