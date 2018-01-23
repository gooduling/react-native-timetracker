import React from 'react';
import {View} from 'react-native';
import styles from './styles.js';
import tracker from './components/trackerLogic.js'; //HOC
import TrackerWrapperNative from './components/trackerWrapper.native';

const Tracker = tracker(TrackerWrapperNative);

export default () => (
  <View style={styles.container}>
    <Tracker/>
  </View>
)