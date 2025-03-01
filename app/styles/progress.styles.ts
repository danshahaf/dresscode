import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 60; // Chart width with padding
const ticketWidth = (screenWidth - 50) / 3; // 3 tickets per row with spacing

export const progressStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingHorizontal: 20,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chartLegend: {
    fontSize: 12,
    color: '#666',
  },
  svgContainer: {
    height: 150,
    width: '100%',
  },
  dateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  outfitsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  outfitTicket: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
  outfitGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    padding: 10,
  },
  outfitDate: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  scoreCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#cca702',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '95%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  swipeIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 3,
  },
  modalImageFullContainer: {
    width: '100%',
    height: '65%',
    position: 'relative',
  },
  modalImageFull: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  scoreCircleContainer: {
    alignItems: 'flex-end',
  },
  modalScoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#cca702',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalScoreText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalBottomSection: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  aiCritiqueButton: {
    backgroundColor: '#cca702',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  aiCritiqueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // AI Analysis styles
  aiAnalysisContainer: {
    flex: 1,
  },
  aiAnalysisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreMeterContainer: {
    marginBottom: 15,
  },
  scoreMeterLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  scoreMeterLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  scoreMeterValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreMeterTrack: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreMeterFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallScoreContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  overallScoreLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  overallScoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#cca702',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  overallScoreText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  outfitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  outfitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  aiSummaryContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#cca702',
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  critiqueFeedback: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    lineHeight: 18,
  },
  overallCritique: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export const chartDimensions = {
  width: chartWidth,
  height: 120,
  padding: 20,
};

export const outfitDimensions = {
  ticketWidth: ticketWidth,
}; 