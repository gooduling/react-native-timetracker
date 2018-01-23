import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import TaskRow from './taskRow';
import {createFalseArray, formatTime, getRandomKey} from "../utils.js";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import StartIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import StopIcon from 'material-ui/svg-icons/av/stop';
import AddIcon from 'material-ui/svg-icons/content/add';
import PieChart from "react-svg-piechart";

//import PieChart from 'react-minimal-pie-chart';
const iconStyle = {
  margin: 0,
  padding: 0,
  width: 24,
  height: 28,
  overflow: 'hidden'
};
class Tracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [true],
      tasksInfo: [],
      time: 0,
      totalTime: 0,
      pausedTime: 0,
      pauseTriger: 0,
      startTriger: 0,
      cleanTriger: 0,
      isRuning: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.startTriger !== this.state.startTriger) this.startTimer();
    if (nextState.pauseTriger !== this.state.pauseTriger) this.pauseTimer();
  }

  clearTimer = () => {
    this.setState({
      time: 0,
      pausedTime: 0,
      totalTime: 0,
      isRuning: false,
      cleanTriger: this.state.cleanTriger + 1,
      tasksInfo: []
    });
    if (this.timer) clearInterval(this.timer);
  };
  startTimer = () => {
    if (!this.state.isRuning) this.timer = setInterval(() => this.setState({time: this.state.time + 1}), 1000);
    if (this.state.tasks.some(el=>el)) {
      this.setState({
        time: this.state.pausedTime,
        isRuning: true
      });
    }
  };
  pauseTimer = () => {
    this.setState({
      pausedTime: this.state.time,
      isRuning: false
    });
    if (this.timer) clearInterval(this.timer);
  };
  updateTasks = (task, i) => {
    let newTasksInfo = [...this.state.tasksInfo];
    newTasksInfo[i] = task;
    this.setState({tasksInfo: newTasksInfo})
  };
  removeTask = (index) => {
    const {time, tasks, tasksInfo} = this.state;
    let newTasksInfo = [...tasksInfo];
    let newTasks = [...tasks];
    let newTime = time - tasksInfo[index];
    if (newTasks[index]) this.pauseTimer();
    console.info(index, newTasks, newTasksInfo);
    newTasksInfo.splice(index, 1);
    newTasks.splice(index, 1);
    console.info(index, newTasks, newTasksInfo);
    this.setState({tasksInfo: newTasksInfo, tasks: newTasks, time: newTime})
  }
  addTask = () => this.setState({'tasks': [...createFalseArray(this.state.tasks.length), true]});
  setActive = (i, setInactive) => {
    let newTasksState = createFalseArray(this.state.tasks.length);
    newTasksState[i] = true;
    this.setState({'tasks': newTasksState});
  };
  counterCallBack = () => this.setState({'totalTime': this.state.totalTime + 1});
  onPieHover = (d, i, e) => {
    console.log("Mouse leave - Index:", i, "Event:", e);
    console.log(e.target);
  };
  controlGlobalTimer = (action) => {
    const key = action + 'Triger';
    this.setState({
      [key]: this.state[key] + 1
    })
    // if(action === 'pause') {
    //   this.setState({tasks: createFalseArray(this.state.tasks.length)})
    // }
  };
  renderControl = ()=>(
    <View>
      <IconButton style={iconStyle} onClick={() => this.clearTimer()}>
        <StopIcon/>
      </IconButton>
      {this.state.isRuning ?
      <IconButton style={iconStyle} onClick={() => this.pauseTimer()}>
        <PauseIcon/>
      </IconButton> :
      <IconButton style={iconStyle} onClick={() => this.startTimer()}>
        <StartIcon/>
      </IconButton>
      }
    </View>);
  renderAddFloatBtn = () => (
    <FloatingActionButton className='addBtn' mini onClick={this.addTask}>
      <ContentAdd/>
    </FloatingActionButton>
  );
  renderAddBtn = () => (
    <IconButton onClick={this.addTask}>
      <AddIcon/>
    </IconButton>
  );
  render() {
    const {tasks, time, totalTime, tasksInfo, cleanTriger, isRuning} = this.state;
    return (
      <View className="tracker">
        <View className="taskRow header">
          <View className='logo'>My Time</View>
          <View className='totalTime'>{formatTime(totalTime)}</View>
          {this.renderControl()}
          {this.renderAddBtn()}
        </View>
        {tasks.map((t, i) => <TaskRow
          clickHandler={this.setActive}
          counterCallBack={this.counterCallBack}
          index={i}
          key={i}
          isActive={t}
          reportState={this.updateTasks}
          removeItem={this.removeTask}
          timeTick={t ? time : 0}
          cleanTriger={cleanTriger}
          controlGlobalTimer={this.controlGlobalTimer}
          isGlobalTimerRuning={isRuning}
        />)}
        <View style={{height: '20px'}}>

        </View>
        {tasksInfo.length > 1 && totalTime > 0 &&
        <View className='chart'>
          <PieChart
            data={tasksInfo}
          />
        </View>}
      </View>
    );
  }
}

export default Tracker;

const styles = StyleSheet.create({
  header: {
    height: 50
  }
});
