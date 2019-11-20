export default function(tooltipItem, data) {
  let value = data.datasets[0].data[tooltipItem.index];

  if (value.toString().includes('.')) {
    var valueIntegerChars = value.toString().split('.')[0];
    var valueDecimalChars = value.toString().split('.')[1];
  } else {
    valueIntegerChars = value.toString();
    valueDecimalChars = false;
  }

  if (valueIntegerChars.length <= 3) {
    var valueIntegersFormatted = valueIntegerChars;
  } else {
    valueIntegersFormatted = [];
    for (var i = valueIntegerChars.length - 1; i >= 0; i--) {
      if (
        i !== valueIntegerChars.length - 1 &&
        (valueIntegerChars.length - 1 - i) % 3 === 0
      ) {
        valueIntegersFormatted.unshift(",");
      }
      valueIntegersFormatted.unshift(valueIntegerChars[i]);
    }
    valueIntegersFormatted = valueIntegersFormatted.join("");
  }
  
  if (valueDecimalChars) {
    return `$${valueIntegersFormatted}.${valueDecimalChars}`;
  } else {
    return `$${valueIntegersFormatted}`;
  }
}
