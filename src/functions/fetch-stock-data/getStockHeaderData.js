export default function(symbol) {
  return fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=30min&apikey=447KWSIKEZ0MV00S`
  )
    .then(response => response.json())
    .then(json => {
      const possibleDates = Object.keys(json["Time Series (30min)"]);
      const latestDate = possibleDates[0].split(" ")[0];
      const latestPrice = +json["Time Series (30min)"][possibleDates[0]][
        "4. close"
      ];

      let openPrice;

      for (var i = 0; i < possibleDates.length; i++) {
        if (possibleDates[i].split(" ")[0] === latestDate) {
          if (possibleDates[i].split(" ")[1] === "10:00:00") {
            openPrice = +json["Time Series (30min)"][possibleDates[i]][
              "1. open"
            ];
            break;
          }
        } else {
          openPrice = +json["Time Series (30min)"][possibleDates[i - 1]][
            "1. open"
          ];
          break;
        }
      }

      let latestMonth = latestDate.split("-")[1];
      if (latestMonth[0] === "0") {
        latestMonth = latestMonth[1];
      }
      let latestDay = latestDate.split("-")[2];
      if (latestDay[0] === "0") {
        latestDay = latestDay[1];
      }
      const latestYear = latestDate
        .split("-")[0][2]
        .concat(latestDate.split("-")[0][3]);
      const latestHour = possibleDates[0].split(" ")[1].split(":")[0];
      const latestMinute = possibleDates[0].split(" ")[1].split(":")[1];
      const latestTime = `${latestHour}:${latestMinute}`;
      const latestDateAndTime = `${latestMonth}/${latestDay}/${latestYear} ${latestTime}`;
      const amountChange = Math.round(100 * (latestPrice - openPrice)) / 100;
      const percentChange = +(
        Math.round(1000 * (amountChange / openPrice)) / 1000
      )
        .toString()
        .replace("-", "");
      const symbol = json["Meta Data"]["2. Symbol"].toUpperCase();
      const timezone = json["Meta Data"]["6. Time Zone"];

      return {
        latestPrice,
        openPrice,
        latestDateAndTime,
        amountChange,
        percentChange,
        symbol,
        timezone
      };
    })
    .catch(e => {
      // alert('getStockHeaderData.js catch. e: ' + e);
      return "Server Error";
    });
}
