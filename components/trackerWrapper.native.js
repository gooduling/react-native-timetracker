import React from 'react';
import {ScrollView, Text, View, Switch} from 'react-native';
import TaskRow from './taskRow';
import {formatTime} from "../utils.js";
import styles from '../styles.js';
import Icon from 'react-native-vector-icons/Feather';
import PieChart from 'react-native-pie-chart';

const TrackerWrapper = ({
                          tasksMap, totalTime, totalIsRuning, fontLoaded, clearTimer, pauseTimer,
                          startTimer, addTask, removeTask, updateTask, chart_wh, singleMode, toggleSingle
                        }) => {
  const filteredTasks = Object.keys(tasksMap).map(id => ({
    time: tasksMap[id].time,
    color: tasksMap[id].color
  })).filter(i => i.time);
  console.info(filteredTasks);
  return (
    <View style={styles.trackerWrapper}>
      <View style={styles.header}>
        <View style={styles.switcherBlock}>
          <Switch value={singleMode} onValueChange={toggleSingle}/>
          <Text>  {singleMode ? 'Single' : 'Multiple'}</Text>
        </View>
        {false && <Text style={{fontFamily: 'indieFlower', fontSize: 20, fontWeight: 'bold'}}>My Time</Text>}
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{formatTime(totalTime)}</Text>
        <View style={styles.rowControls}>
          <Icon onPress={clearTimer} name="square" size={25}/>
          {totalIsRuning ?
            <Icon onPress={() => pauseTimer()} name="pause" size={25}/> :
            <Icon onPress={() => startTimer()} name="play" size={25}/>
          }
        </View>
        <Icon onPress={(e)=>addTask()} name="plus-circle" size={35}/>
      </View>
      <ScrollView style={styles.scrollView}>
        {Object.keys(tasksMap).sort((aKey, bKey) => tasksMap[aKey].index - tasksMap[bKey].index).map(id => (
          <TaskRow
            id={id}
            key={id}
            updateTask={updateTask}
            removeTask={removeTask}
            totalIsRuning={totalIsRuning}
            {...tasksMap[id]}
          />
        ))}
      </ScrollView>
      <View style={styles.chart}>
        <PieChart
          chart_wh={chart_wh}
          series={filteredTasks.length ? filteredTasks.map(i => i.time) : [100]}
          sliceColor={filteredTasks.length ? filteredTasks.map(i => i.color) : ['#ddd']}
          doughnut={true}
          coverRadius={0.3}
          coverFill={'#FFF'}
        />
      </View>
    </View>
  )
};
export default TrackerWrapper;