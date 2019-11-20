<template>
  <div>
    <div v-if="fetchError">
      <p class="fetch-error-txt">
        {{ fetchError }}
      </p>
    </div>
    <div v-if="fetching.headerData || fetching.historicalData">
      <div v-if="!fetchError">
        <LoadingIcon></LoadingIcon>
      </div>
    </div>
    <div v-if="stockHistoricalData && stockHeaderData">
      <h2 class="stock__symbol">{{ stockHeaderData.symbol }}</h2>
      <h2 class="stock__price">{{ stockHeaderData.latestPrice }}</h2>
      <p
        v-if="stockHeaderData.amountChange.toString()[0] !== '-'"
        class="stock__price-details"
        style="color: green;"
      >
        <span class="grey-txt">USD</span>
        <span class="green-txt"
          >{{ reformatAmountChange(stockHeaderData.amountChange) }} ({{
            stockHeaderData.percentChange
          }}%)</span
        >
      </p>
      <p v-else class="stock__price-details">
        <span class="grey-txt">USD</span>
        <span class="red-txt"
          >{{ reformatAmountChange(stockHeaderData.amountChange) }} ({{
            stockHeaderData.percentChange
          }})</span
        >
      </p>
      <p class="stock__updated">
        <span class="grey-txt"
          >Updated: {{ stockHeaderData.latestDateAndTime }}</span
        >
      </p>
      <canvas id="stockChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import LoadingIcon from "./LoadingIcon.vue";

import formatXTooltip from "../functions/format-chart/formatXTooltip.js";
import formatYTooltip from "../functions/format-chart/formatYTooltip.js";
import formatXTicks from "../functions/format-chart/formatXTicks.js";
import formatYTicks from "../functions/format-chart/formatYTicks.js";

export default {
  components: {
    LoadingIcon
  },
  props: [
    "stockHistoricalData",
    "stockInputError",
    "dateInputError",
    "fetchError",
    "stockHeaderData",
    "dayRange",
    "fetching",
    "preventRefetch"
  ],
  methods: {
    reformatAmountChange: function(amountChange) {
      if (amountChange.toString()[0] !== "-") {
        return `+${amountChange}`;
      } else {
        return amountChange.toString();
      }
    }
  },
  updated() {
    if (
      !this.fetching.headerData &&
      !this.fetching.historicalData &&
      this.stockHistoricalData &&
      this.stockHeaderData &&
      !this.stockInputError &&
      !this.dateInputError
    ) {
      //gets symbol & date range of currently displaying to prevent re-fetching same data
      this.preventRefetch();

      let ctx = document.getElementById("stockChart");

      if (
        this.stockHistoricalData.stockPriceData[
          this.stockHistoricalData.stockPriceData.length - 1
        ] >= this.stockHistoricalData.stockPriceData[0]
      ) {
        var backgroundColor = "rgba(0,128,0, 0.5)";
        var borderColor = "rgba(0,100,0, 0.5)";
      } else {
        backgroundColor = "rgba(255,0,0, 0.4)";
        borderColor = "rgba(139,0,0, 0.5)";
      }

      let chartData = {
        labels: this.stockHistoricalData.labels,
        datasets: [
          {
            data: this.stockHistoricalData.stockPriceData,
            backgroundColor,
            borderColor
          }
        ]
      };
      const tickStatus = () => (window.innerWidth >= 481 ? true : false);
      var stockChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          elements: {
            line: {
              tension: 0
            }
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              title: (tooltipItem, data) => {
                return formatXTooltip(tooltipItem, data, this.dayRange);
              },
              label: formatYTooltip
            },
            titleFontFamily: "'Source Sans Pro', sans-serif",
            bodyFontFamily: "'Source Sans Pro', sans-serif",
            cornerRadius: 2,
            displayColors: false
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  display: tickStatus(),
                  maxTicksLimit: 9,
                  fontFamily: "'Source Sans Pro', sans-serif",
                  callback: value => {
                    return formatXTicks(value, this.dayRange);
                  }
                },
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  display: tickStatus(),
                  fontFamily: "'Source Sans Pro', sans-serif",
                  callback: formatYTicks
                }
              }
            ]
          },
          onResize: () => {
            stockChart.options.scales.xAxes[0].ticks.display = tickStatus();
            stockChart.options.scales.yAxes[0].ticks.display = tickStatus();
          }
        }
      });
    }
  }
};
</script>
