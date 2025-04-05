import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const statusBarHeight = StatusBar.currentHeight || 0;
const headerHeight = Dimensions.get('window').height / 2.2 + statusBarHeight; 

export const profileScreenStyles = StyleSheet.create({
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
    backgroundColor: '#fff',
  },
  logoutButton: {
    marginBottom: 30,
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
  logoutDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 30,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export const dimensions = {
  headerHeight,
  screenWidth,
};