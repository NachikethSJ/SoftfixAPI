const helper = {}

helper.calculateTimePeriod = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const timeDifference = endDate - startDate;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { hours, minutes };
  };

helper.addHoursToTime = (timeString, hoursToAdd) => {
    const [hours, minutes] = timeString.split(":").map(Number);

    const totalMinutesToAdd = hoursToAdd * 60;

    let totalNewMinutes = hours * 60 + minutes + totalMinutesToAdd;

    let newHours = Math.floor(totalNewMinutes / 60) % 24;
    let newMinutes = totalNewMinutes % 60;

    let newTimeString = `${newHours < 10 ? "0" : ""}${newHours}:${
      newMinutes < 10 ? "0" : ""
    }${newMinutes}`;

    return newTimeString;
  };

helper.isTimeGreaterThan = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 > hours2) {
      return true;
    } else if (hours1 === hours2 && minutes1 > minutes2) {
      return true;
    } else {
      return false;
    }
  };


module.exports = helper;