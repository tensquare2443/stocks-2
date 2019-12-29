<template>
  <div id="app">
    <h1 class="title">Get a Stock's Historical Data:</h1>
    <StockInput
      :stockInput="stockInput"
      :dateInput="dateInput"
      :updateStockInput="updateStockInput"
      :updateDateInput="updateDateInput"
      :getStockData="getStockData"
      :stockInputError="stockInputError"
      :dateInputError="dateInputError"
      :dataDisplayed="dataDisplayed"
    ></StockInput>
    <Stock
      :fetchError="fetchError"
      :stockInputError="stockInputError"
      :dateInputError="dateInputError"
      :stockHistoricalData="stockHistoricalData"
      :stockHeaderData="stockHeaderData"
      :dayRange="dayRange"
      :fetching="fetching"
      :preventRefetch="preventRefetch"
    ></Stock>
  </div>
</template>

<script>
import Stock from "./components/Stock.vue";
import StockInput from "./components/StockInput.vue";

import getStockHeaderData from "./functions/fetch-stock-data/getStockHeaderData.js";
import getHistoricalStockData from "./functions/fetch-stock-data/getHistoricalStockData.js";
import validateStockInput from "./functions/validate/validateStockInput.js";
import validateDateInput from "./functions/validate/validateDateInput.js";
import setDefaultRange from "./functions/setDefaultRange.js";

export default {
  name: "app",
  components: {
    Stock,
    StockInput
  },
  data() {
    return {
      stockInput: "",
      dateInput: "",
      stockHeaderData: false,
      stockHistoricalData: false,
      fetchError: false,
      stockInputError: false,
      dateInputError: false,
      dayRange: 7,
      fetching: {
        headerData: false,
        historicalData: false
      },
      dataDisplayed: false
    };
  },
  methods: {
    updateStockInput: function(e) {
      this.stockInput = e.target.value;
    },
    updateDateInput: function(e) {
      this.dateInput = e.target.value;
    },
    getStockData: function(e) {
      e.preventDefault();

      this.fetchError = false;
      this.stockInputError = validateStockInput(this.stockInput);
      this.dateInputError = validateDateInput(this.dateInput);

      if (this.stockInputError || this.dateInputError) return;

      //gets number of days in selected range
      this.dayRange =
        Math.round(
          (+new Date() -
            +new Date(
              `${this.dateInput.split("/")[0]}/${
                this.dateInput.split("/")[1]
              }/${this.dateInput.split("/")[2]}`
            )) /
            (1000 * 60 * 60 * 24)
        ) - 1;

      this.fetching = {
        headerData: true,
        historicalData: true
      };
      this.stockHeaderData = false;
      this.stockHistoricalData = false;

      const handleFetchError = dataset => {
        if (dataset === "header") {
          this.fetching.headerData = false;
        } else if (dataset === "historical") {
          this.fetching.historicalData = false;
        }
        this.fetchError =
          'Unable to collect stock data. Please either enter a valid stock symbol (example: "MSFT"), or make fewer requests to prevent throttling.';
        this.stockHeaderData = false;
        this.stockHistoricalData = false;
        this.dataDisplayed = false;
      };

      getStockHeaderData(this.stockInput)
        .then(stockHeaderData => {
          this.fetching.headerData = false;

          if (stockHeaderData === "Server Error") throw "Server Error";

          this.stockHeaderData = stockHeaderData;
        })
        .catch(e => handleFetchError("header"));

      getHistoricalStockData(this.stockInput, this.dayRange)
        .then(stockHistoricalData => {
          this.fetching.historicalData = false;

          if (stockHistoricalData === "Server Error") throw "Server Error";

          this.stockHistoricalData = stockHistoricalData;
        })
        .catch(e => handleFetchError("historical"));
    },
    preventRefetch: function() {
      this.dataDisplayed = {
        symbol: this.stockInput,
        startDate: this.dateInput
      };
    }
  },
  mounted() {
    this.dateInput = setDefaultRange();
  }
};
</script>

<style lang="scss">
@import "./styling/App.scss";
</style>
