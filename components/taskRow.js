import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import styles from '../styles.js';
import Icon from 'react-native-vector-icons/Feather';
import {formatTime} from "../utils";
import Swipeout from 'rc-swipeout'

const TaskRow = ({id, color, isActive, totalIsRuning, removeTask, updateTask, isRuning, name, editMode, time}) => (
  <Swipeout right={[{text: 'Delete', onPress: () => removeTask(id), style: {backgroundColor: 'red',
      color: 'white'}}]}>
    <View
      onKeyPress={(e) => (e.key === 'Enter' && updateTask(id, {'editMode': false}, 'inputEnter'))}
      style={StyleSheet.flatten([styles.taskRow, {backgroundColor: color}])}
    >
      <View style={styles.rowName}>
        {!editMode ?
          <Text onClick={() => updateTask(id, {editMode: true}, 'inputStart')}>
            {name}
          </Text>
          : <TextInput
            style={{width: 200}}
            maxLength={15}
            placeholder="Add Text"
            value={name}
            onChangeText={text => updateTask(id, {name: text}, 'input')}
            onBlur={e => updateTask(id, {name: e.nativeEvent.text || 'New Task'}, 'blur')}
            onKeyPress={(e) => (e.key === 'Enter' && updateTask(id, {'editMode': false}, 'inputEnter'))}
            autoFocus
          />
        }
        {isActive && <Text>A </Text>}
      </View>
      <View
        style={styles.rowControls}
        onClick={() => updateTask(id, {isActive: true}, 'setActive')}>
        <Text style={{width: 80, fontWeight: 'bold', fontSize: 20}}>
          {formatTime(time)}
        </Text>
        {(isRuning && totalIsRuning && isActive) ?
          <Icon onPress={() => updateTask(id, {pausedTime: time, isRuning: false}, 'pause')} name="pause"
                size={25}/> :
          <Icon onPress={() => updateTask(id, {isActive: true, isRuning: true}, 'start')} name="play" size={25}/>
        }
      </View>
    </View>
  </Swipeout>
);
export default TaskRow;