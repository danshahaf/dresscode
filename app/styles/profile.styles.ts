import { StyleSheet, Platform, Dimensions } from 'react-native';

// Create styles for the profile screen
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Header styles
  headerImageContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWidgetsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  headerWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  headerWidgetText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Settings section styles
  settingsSection: {
    marginBottom: 25,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  
  // Logout button
  logoutButton: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  logoutText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Switch styles
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Divider
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
    marginVertical: 10,
  },
  
  // Add this to the existing styles
  highlightedText: {
    color: '#cca702',
    fontWeight: '500',
  },
  
  // Add these styles to the existing profileStyles
  planSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  planSubtitleText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
});

// Edit profile modal styles
export const editProfileStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#cca702',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  changeImageText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#cca702',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Height Display
  heightDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  heightDisplayText: {
    fontSize: 16,
    color: '#333',
  },
});

// Height picker modal styles
export const heightPickerStyles = StyleSheet.create({
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerCancelButton: {
    paddingHorizontal: 10,
  },
  pickerCancelText: {
    color: '#999',
    fontSize: 16,
  },
  pickerDoneButton: {
    paddingHorizontal: 10,
  },
  pickerDoneText: {
    color: '#cca702',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: 150,
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
  },
});

// Subscription modal styles
export const subscriptionStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  renewalDateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  currentPlanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  currentPlanLabel: {
    fontSize: 16,
    color: '#666',
  },
  currentPlanValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cca702',
    marginLeft: 10,
  },
  planOptionsContainer: {
    marginBottom: 15,
  },
  planOption: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPlan: {
    borderColor: '#cca702',
  },
  planOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cca702',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#cca702',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  savingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  savingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cancelSubscriptionButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  cancelSubscriptionText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,  // Adjust as needed
  },
  
}); 