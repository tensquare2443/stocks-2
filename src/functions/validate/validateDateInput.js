export default function(dateInput) {
  let dateInputError = false;

  if (dateInput.length !== 10) {
    // alert('start date length is wrong. error');
    dateInputError =
      'In "mm/dd/yyyy" format, please enter the date from which your stock\'s data should begin (example: "03/25/2012").';
  }

  const monthChar1 = dateInput[0];
  const monthChar2 = dateInput[1];
  const slash1 = dateInput[2];
  const dayChar1 = dateInput[3];
  const dayChar2 = dateInput[4];
  const slash2 = dateInput[5];
  const yearChar1 = dateInput[6];
  const yearChar2 = dateInput[7];
  const yearChar3 = dateInput[8];
  const yearChar4 = dateInput[9];

  if (
    isNaN(monthChar1) ||
    isNaN(monthChar2) ||
    slash1 !== "/" ||
    isNaN(dayChar1) ||
    isNaN(dayChar2) ||
    slash2 !== "/" ||
    isNaN(yearChar1) ||
    isNaN(yearChar2) ||
    isNaN(yearChar3) ||
    isNaN(yearChar4)
  ) {
    // alert('at least one of the ten chars is bad. error.');
    dateInputError =
      'In "mm/dd/yyyy" format, please enter the date from which your stock\'s data should begin (example: "03/25/2012").';
  }

  if (+`${yearChar1}${yearChar2}${yearChar3}${yearChar4}` < 1980) {
    // alert('date is before 1980. not allowed. error.');
    dateInputError = "Please enter a more recent date.";
  }

  const todaysDate = +new Date();
  const earliestDate = +new Date(
    `${dateInput.split("/")[0]} ${dateInput.split("/")[1]} ${
      dateInput.split("/")[2]
    }`
  );

  if (earliestDate > todaysDate) {
    // alert('date is in the future. error');
    dateInputError = "Please enter a date in the past.";
  }

  return dateInputError;
}
