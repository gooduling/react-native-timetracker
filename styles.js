import {StyleSheet, Dimensions} from 'react-native';
import { Font } from 'expo';

Font.loadAsync({
  'indieFlower': require('./assets/fonts/IndieFlower.ttf'),
});

const flexRow = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const ROW_HEIGHT = 50;
const {height, width} = Dimensions.get('window')

export default StyleSheet.create({
  flexRow,
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 18,
    padding: 5
  },
  trackerWrapper: {
    flex: 1
  },
  header: {
    ...flexRow,
    height: ROW_HEIGHT
  },
  scrollView: {
    maxHeight: height - 300
  },
  taskRow: {
    ...flexRow,
    height: ROW_HEIGHT,
    padding: 5
  },
  rowName: {
    ...flexRow,
    flex: 1,
  },
  rowControls: {
    ...flexRow
  },
  button: {
    width: 50
  },
  chart: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  switcherBlock: {
    ...flexRow,
    width: 100
  }
});