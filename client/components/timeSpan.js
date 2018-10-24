import React from 'react';
import UnorderedList from './unorderedList.js';

const startTimeFormatter = function(time) {
  if (time == null) {
    return '6';
  } 
  return time;
}

const endTimeFormatter = function(time) {
  if (time == null) {
   return 'EOD'; 
  }
  return time;
};

const TimeSpan = function (props) {
  if (Array.isArray(props.startTime)) {
      let toReturn = [];
      for (var i = 0; i < props.startTime.length; i++) {
       toReturn.push({
         startTime: startTimeFormatter(props.startTime[i]),
         endTime: endTimeFormatter(props.endTime[i])
       });
     }
     return (<UnorderedList>
             {toReturn.map((times) => <span key={times.startTime}>{startTimeFormatter(times.startTime)} - {endTimeFormatter(times.endTime)}</span>)}
             </UnorderedList>);
  } else if (props.startTime == null) {
     return <span>Anytime</span>;    
 }
  return <span>{startTimeFormatter(props.startTime)} - {endTimeFormatter(props.endTime)}</span>;
}

export default TimeSpan;