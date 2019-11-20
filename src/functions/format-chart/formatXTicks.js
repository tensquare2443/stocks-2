export default function(value, dayRange) {
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };
  const fullTime = new Date(value).toString();
  let month = months[fullTime.split(" ")[1]];
  let day = fullTime.split(" ")[2];
  if (day[0] === "0") day = day[1];
  const year = `${fullTime.split(" ")[3][2]}${fullTime.split(" ")[3][3]}`;

  if (dayRange < 8) {
    var time = `${fullTime.split(" ")[4].split(":")[0]}:${
      fullTime.split(" ")[4].split(":")[1]
    }`;

    return `${month}/${day}/${year} ${time}`;
  } else if (dayRange >= 8 && dayRange < 101) {
    return `${month}/${day}/${year}`;
  } else if (dayRange >= 101 && dayRange < 365) {
    const weekStartTime = new Date(value - 1000 * 60 * 60 * 24 * 7).toString();
    const weekStartMonth = months[weekStartTime.split(" ")[1]];
    let weekStartDay = weekStartTime.split(" ")[2];
    if (weekStartDay[0] === "0") weekStartDay = weekStartDay[1];
    const weekStartYear = `${weekStartTime.split(" ")[3][2]}${
      weekStartTime.split(" ")[3][3]
    }`;
    return `${weekStartMonth}/${weekStartDay}/${weekStartYear} - ${month}/${day}/${year}`;
  } else {
    month = fullTime.split(" ")[1];

    return `${month} '${year}`;
  }
}
