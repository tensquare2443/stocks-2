export default function() {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  };
  const oneWeekAgo = new Date(+new Date() - 1000 * 60 * 60 * 24 * 7).toString();
  const month = months[oneWeekAgo.split(" ")[1]];
  const day = oneWeekAgo.split(" ")[2];
  const year = oneWeekAgo.split(" ")[3];

  return `${month}/${day}/${year}`;
}
