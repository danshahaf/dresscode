import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
  // Generate feet options (3-8 feet)
  const feetOptions = Array.from({ length: 6 }, (_, i) => (i + 3).toString());
  
  // Generate inches options (0-11 inches)
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i.toString());
  
  const handleSave = () => {
    onSave();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Height</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconSymbol name="xmark" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Feet</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {feetOptions.map((value) => (
                  <TouchableOpacity
                    key={`feet-${value}`}
                    style={[
                      styles.pickerItem,
                      feet === value && styles.selectedPickerItem
                    ]}
                    onPress={() => onFeetChange(value)}
                  >
                    <Text 
                      style={[
                        styles.pickerItemText,
                        feet === value && styles.selectedPickerItemText
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Inches</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {inchesOptions.map((value) => (
                  <TouchableOpacity
                    key={`inches-${value}`}
                    style={[
                      styles.pickerItem,
                      inches === value && styles.selectedPickerItem
                    ]}
                    onPress={() => onInchesChange(value)}
                  >
                    <Text 
                      style={[
                        styles.pickerItemText,
                        inches === value && styles.selectedPickerItemText
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
    width: width * 0.3,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.3,
  },
  selectedPickerItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedPickerItemText: {
    fontWeight: 'bold',
    color: '#cca702',
  },
  saveButton: {
    backgroundColor: '#cca702',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 