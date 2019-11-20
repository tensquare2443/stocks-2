export default function(symbol, dayRange) {
  if (dayRange < 8) {
    var dataToRetrieve = "TIME_SERIES_INTRADAY";
    var endpointTimePeriodName = "Time Series (30min)";
  } else if (dayRange >= 8 && dayRange < 101) {
    dataToRetrieve = "TIME_SERIES_DAILY";
    endpointTimePeriodName = "Time Series (Daily)";
  } else if (dayRange >= 101 && dayRange < 365) {
    dataToRetrieve = "TIME_SERIES_WEEKLY";
    endpointTimePeriodName = "Weekly Time Series";
  } else if (dayRange >= 365) {
    dataToRetrieve = "TIME_SERIES_MONTHLY";
    endpointTimePeriodName = "Monthly Time Series";
  }

  return fetch(
    `https://www.alphavantage.co/query?function=${dataToRetrieve}&symbol=${symbol}&interval=30min&apikey=447KWSIKEZ0MV00S`
  )
    .then(response => response.json())
    .then(json => {
      let labels = [];
      let stockPriceData = [];
      // const earliestTime = +new Date() - 1000 * 60 * 60 * 24 * dayRange;
      const earliestTimeNonRounded = new Date(+new Date() - 1000 * 60 * 60 * 24 * dayRange).toString();
      const earliestTimeMonth = earliestTimeNonRounded.split(' ')[1];
      const earliestTimeDay = earliestTimeNonRounded.split(' ')[2];
      const earliestTimeYear = earliestTimeNonRounded.split(' ')[3];
      const earliestTime = +new Date(`${earliestTimeMonth} ${earliestTimeDay} ${earliestTimeYear}`);
      const possibleTimes = Object.keys(json[endpointTimePeriodName]);

      for (var i = 0; i < possibleTimes.length; i++) {
        const possibleTime = +new Date(possibleTimes[i]);
        if (possibleTime >= earliestTime) {
          labels.unshift(possibleTime);
          stockPriceData.unshift(
            Math.round(
              100 * json[endpointTimePeriodName][possibleTimes[i]]["4. close"]
            ) / 100
          );
        } else {
          if (dataToRetrieve === "TIME_SERIES_MONTHLY") {
            const earliestTimeMonth = new Date(earliestTime)
              .toString()
              .split(" ")[1];
            const possibleTimeMonth = new Date(possibleTime)
              .toString()
              .split(" ")[1];

            if (earliestTimeMonth === possibleTimeMonth) {
              labels.unshift(possibleTime);
              stockPriceData.unshift(
                Math.round(
                  100 *
                    json["Monthly Time Series"][possibleTimes[i]]["4. close"]
                ) / 100
              );
            }
          }
          break;
        }
      }

      return {
        labels,
        stockPriceData
      };
    })
    .catch(e => {
      return "Server Error";
    });
}
