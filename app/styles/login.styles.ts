import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for responsive layout
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.8, // Slightly increased opacity to make image more visible
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
    },
    content: {
      flex: 1,
      justifyContent: 'space-between', // Changed to space-between to separate title and auth container
      padding: 20,
      paddingTop: height * 0.15, // Top padding as percentage of screen height
      paddingBottom: height * 0.08, // Bottom padding as percentage of screen height
    },
    logoContainer: {
      alignItems: 'center',
      // Removed marginBottom to let space-between handle the spacing
    },
    logoText: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#cca702',
      letterSpacing: 2,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
    tagline: {
      fontSize: 16,
      color: '#fff',
      opacity: 0.9,
      marginTop: 5,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    authContainer: {
      borderRadius: 20,
      padding: 25,
      width: '100%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(204, 167, 2, 0.3)', // Subtle gold border
      marginTop: 'auto', // Push to the bottom of the available space
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitleText: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 30,
      textAlign: 'center',
    },
    socialButtonsContainer: {
      width: '100%',
      gap: 15,
    //   marginBottom: 0,
    },
    socialButton: {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    googleButton: {
      backgroundColor: '#4285F4',
    },
    appleButton: {
      backgroundColor: '#000',
      borderWidth: 1,
      borderColor: '#fff',
    },
    googleIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    googleIconText: {
      color: '#4285F4',
      fontSize: 16,
      fontWeight: 'bold',
    },
    appleIcon: {
      marginRight: 12,
    },
    socialIcon: {
      marginRight: 10,
    },
    socialButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    demoButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#cca702',
    },
    demoButtonText: {
      color: '#cca702',
      fontSize: 16,
      fontWeight: '500',
    },
    privacyText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 12,
      textAlign: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
    },
    link: {
      color: '#cca702',
    },
  }); 