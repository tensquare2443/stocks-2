<template>
  <div>
    <form @submit="getStockData">
      <p class="stock-input-label">
        Enter a Stock Symbol:
      </p>
      <input
        @input="updateStockInput"
        class="stock-input"
        :class="{ 'stock-input-error': stockInputError }"
        type="text"
        placeholder="enter a stock symbol"
        :value="stockInput"
      />
      <div v-if="stockInputError">
        <p class="input-error-txt">
          {{ stockInputError }}
        </p>
      </div>
      <p class="date-input-label">
        Enter a Start Date (mm/dd/yyyy):
      </p>
      <input
        @input="updateDateInput"
        type="text"
        class="date-input"
        :class="{ 'date-input-error': dateInputError }"
        placeholder="MM/DD/YYYY"
        :value="dateInput"
        maxlength="10"
      />
      <div v-if="dateInputError">
        <p class="input-error-txt">
          {{ dateInputError }}
        </p>
      </div>
      <button
        v-if="
          stockInput === dataDisplayed.symbol &&
            dateInput === dataDisplayed.startDate
        "
        class="fetch-data-btn"
        disabled
      >
        Fetch Stock Data
      </button>
      <button v-else class="fetch-data-btn">
        Fetch Stock Data
      </button>
      <!-- <button class="fetch-data-btn">
        Fetch Stock Data
      </button> -->
    </form>
  </div>
</template>

<script>
export default {
  props: [
    "stockInputError",
    "stockInput",
    "dateInput",
    "dateInputError",
    "updateStockInput",
    "updateDateInput",
    "getStockData",
    "dataDisplayed"
  ]
};
</script>
