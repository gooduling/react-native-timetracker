import React, {Component} from 'react';
import {getRandomKey, getColor} from "../utils.js";
import {Font} from "expo";

const config = {
  chart_wh: 200
};
const DEFAULT_TASK = {
  time: 0,
  pausedTime: 0,
  isRuning: false,
  name: '',
  editMode: true
};
const Tracker_HOC = function(ComponentToWrap) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        singleMode: false,
        tasksMap: {},
        totalTime: 0,
        pausedTime: 0,
        totalIsRuning: false,
        fontLoaded: false,
        indexCounter: 0
      };
    }

    async componentDidMount() {
      this.addTask(true);
      await Font.loadAsync({
        'indieFlower': require('../assets/fonts/IndieFlower.ttf')
      });
      this.setState({fontLoaded: true});
    }

    startTimer = () => {
      const {tasksMap} = this.state;
      const idArr = Object.keys(tasksMap);
      const someTaskIsActive = idArr.some(id => tasksMap[id].isActive);
      const someTaskIsRuning = idArr.some(id => tasksMap[id].isRuning);
      if (!this.state.totalIsRuning && someTaskIsActive) {
        const tickFn = () => {
          let newTasks = {...this.state.tasksMap};
          Object.keys(newTasks).forEach(id => {
            let t = newTasks[id];
            (t.isActive && t.isRuning) && (newTasks[id].time = t.time + 1)
          });
          this.setState({totalTime: this.state.totalTime + 1, tasksMap: newTasks})
        };
        if(someTaskIsActive && !someTaskIsRuning) {
          let idToRun = idArr.find(id => tasksMap[id].isActive);
          let newTasks = {...this.state.tasksMap};
          newTasks[idToRun] = {...newTasks[idToRun], isRuning: true}
          this.setState({tasksMap: newTasks})
        }
        this.timer = setInterval(tickFn, 1000);
        this.setState({totalIsRuning: true});
      }
    };

    clearTimer = () => {
      console.info('clearTimer');
      this.setState({
        time: 0,
        pausedTime: 0,
        totalTime: 0,
        totalIsRuning: false,
        cleanTriger: this.state.cleanTriger + 1,
        tasksInfo: []
      });
      if (this.timer) clearInterval(this.timer);
    };

    pauseTimer = (pauseTask) => {
      const {totalTime, tasksMap} = this.state;
      const wasLastActive = !Object.keys(tasksMap).some(id => (tasksMap[id].isRuning && tasksMap[id].isActive))
      console.log('pauseTimer', pauseTask,);
      if (!pauseTask
        || this.state.singleMode
        || wasLastActive) {
        this.setState({
          pausedTime: totalTime,
          totalIsRuning: false
        });
        if (this.timer) clearInterval(this.timer);
      }
      if(!pauseTask) {
        const newTasks = {...tasksMap};
        Object.keys(newTasks).forEach(id => newTasks[id].isRuning = false);
        this.setState({tasksMap: newTasks});
      }
    };

    updateTask = (id, changeObj, key = '') => {
      let newTasksMap = {...this.state.tasksMap};
      console.info('updateTask', id, changeObj, key, this.state.tasksMap);
      if ((key === 'setActive' || key === 'start' || key === 'pause') && this.state.singleMode) newTasksMap = this.setInactive(newTasksMap, id);
      newTasksMap[id] = {...newTasksMap[id], ...changeObj};
      console.log(key, newTasksMap)
      this.setState({tasksMap: newTasksMap});
      if (key === 'start' && !this.state.totalIsRuning) {
        setTimeout(()=>this.startTimer(), 1);
      }
      if (key === 'pause' && this.state.totalIsRuning) {
        setTimeout(()=>this.pauseTimer(true), 1);
      }
    };

    removeTask = (id) => {
      console.info('removetask', id, this.state.tasksMap[id]);
      const {totalTime, tasksMap} = this.state;
      let newTasksMap = {...tasksMap};
      let newTime = totalTime - tasksMap[id].time;
      if (newTasksMap[id].isActive) this.pauseTimer();
      delete newTasksMap[id];
      this.setState({tasksMap: newTasksMap, totalTime: newTime})
    };

    addTask = (setActive = false) => {
      console.info('addTask', this.state.tasksMap);
      const {indexCounter, tasksMap} = this.state;
      let newTasksMap = tasksMap; //this.state.singleMode ? this.setInactive(tasksMap) : tasksMap;
      newTasksMap = {...newTasksMap, [getRandomKey()]: {...DEFAULT_TASK, isActive: setActive, index: indexCounter, color: getColor(indexCounter)}};
      this.setState({tasksMap: newTasksMap, indexCounter: indexCounter + 1});
    };

    setInactive = (obj, exceptionId) => {
      console.info('setInactive', exceptionId, {...obj});
      Object.keys(obj).forEach(key => {
        if (!exceptionId || key !== exceptionId) obj[key].isActive = obj[key].isRuning = false;
      });
      if(!exceptionId) this.pauseTimer();
      return obj;
    };
    toggleSingle = (value)=> {
      this.setState({singleMode: value});
    };

    render() {
      const {totalTime, totalIsRuning, fontLoaded, tasksMap, singleMode} = this.state;
      const {clearTimer, pauseTimer, startTimer, addTask, removeTask, updateTask, toggleSingle} = this;
      const trackerProps = {
        totalTime, totalIsRuning, fontLoaded, tasksMap, clearTimer, singleMode, toggleSingle,
        pauseTimer, startTimer, addTask, removeTask, updateTask, chart_wh: config.chart_wh
      };
      return <ComponentToWrap {...trackerProps}/>
    }
  }
}
export default Tracker_HOC;