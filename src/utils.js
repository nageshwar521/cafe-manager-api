const dayjs = require("dayjs");
const uuid = require("uuid");

const successResponse = ({ message, data = null }) => {
  return { success: true, message, data };
};

const errorResponse = ({ message, error = null }) => {
  return { success: false, message, error };
};

const generateId = () => {
  return uuid.v4();
};

const isValidEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null;
  }
  const yearNumber = Number.parseInt(date.substring(6, 10));
  const monthNumber = Number.parseInt(date.substring(3, 5));
  const dayNumber = Number.parseInt(date.substring(0, 2));
  return yearNumber * 10000 + monthNumber * 100 + dayNumber;
}

function dateComparator(date1, date2) {
  const date1Number = monthToComparableNumber(
    dayjs(date1).format("DD-MM-YYYY")
  );
  const date2Number = monthToComparableNumber(
    dayjs(date2).format("DD-MM-YYYY")
  );
  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }
  return date1Number - date2Number;
}

module.exports = {
  successResponse,
  errorResponse,
  generateId,
  isValidEmail,
  dateComparator,
};
