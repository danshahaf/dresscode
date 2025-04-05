import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 60;
const ticketWidth = (screenWidth - 50) / 3;

export const progressStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
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
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    paddingBottom: 0,
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
    height: 180,
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
    justifyContent: 'flex-start',
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
    height: 50,
    padding: 10,
    justifyContent: 'flex-end',
  },
  outfitDate: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 2,
  },
  scoreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#cca702',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    bottom: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '95%',
    backgroundColor: 'transparent', // animated container is transparent
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalInner: {
    flex: 1,
    backgroundColor: '#fff', // visible content has white background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor: '#eee',
  },
  modalImageFull: {
    width: '100%',
    height: '100%',
  },
  basicInfoContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,  
    paddingBottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
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
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  critiqueFeedback: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    lineHeight: 16,
  },
  overallCritique: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  collapsibleScrollView: {
    // position: 'fixed', 
    flex: 1,
    top: -15,
    zIndex: 10
  },
  collapsibleImageContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  analysisContentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '100%',
    // top: -20,
    // zIndex: 999
  },
  scoreMetersList: {
    marginTop: 10,
  },
  fixedHeaderLayout: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  metricsGridContainer: {
    marginTop: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  circularMeterContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circularMeterInner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  circularScoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  circularScoreText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  circularMeterTextContainer: {
    marginTop: 10,
  },
  circularMeterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    lineHeight: 16,
  },
  meterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meterLabelContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  suggestionsContainer: {
    marginTop: 1,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#cca702',
  },
  suggestionsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cca702',
    marginTop: 6,
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cca702',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  noAnalysisText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
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
