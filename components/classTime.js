import moment from "moment";

const GetClassTime = ({ day, classDetails, setClassDetails }) => {
    console.log(' class detilas passed from monday are',classDetails)
    const modifiedDetails = classDetails.map((detail) => {
        console.log('modified details are', modifiedDetails)
      let startTime, endTime;
      switch(detail.time) {
        case 'morning':
          startTime = moment(`${day} 08:00`, 'dddd HH:mm');
          endTime = moment(`${day} 10:00`, 'dddd HH:mm');
          break;
        case 'midmorning':
          startTime = moment(`${day} 10:30`, 'dddd HH:mm');
          endTime = moment(`${day} 12:30`, 'dddd HH:mm');
          break;
        case 'afternoon':
          startTime = moment(`${day} 14:00`, 'dddd HH:mm');
          endTime = moment(`${day} 16:00`, 'dddd HH:mm');
          break;
        case 'evening':
          startTime = moment(`${day} 18:00`, 'dddd HH:mm');
          endTime = moment(`${day} 20:00`, 'dddd HH:mm');
          break;
        default:
          startTime = moment(`${day} 08:00`, 'dddd HH:mm');
          endTime = moment(`${day} 10:00`, 'dddd HH:mm');
          break;
      }
      const duration = moment.duration(endTime.diff(startTime)).asMinutes();
      detail.startTime = startTime.format('hh:mm A');
      detail.endTime = endTime.format('hh:mm A');
      detail.duration = duration;
      return detail;
    });
    setClassDetails(modifiedDetails);
    return null;
  };
  

export default GetClassTime;