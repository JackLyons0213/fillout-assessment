const compareValues = (type, condition, a, b) => {
  let compareFunc = undefined;
  if (type === "string") {
    compareFunc = (a, b) => {
      switch (condition) {
        case "equals":
          return a === b;
        case "does_not_equal":
          return a !== b;
        case "greater_than":
          return a.localeCompare(b) > 0;
        case "less_than":
          return a.localeCompare(b) < 0;
      }
    };
  } else {
    compareFunc = (a, b) => {
      switch (condition) {
        case "equals":
          return a === b;
        case "does_not_equal":
          return a !== b;
        case "greater_than":
          return a > b;
        case "less_than":
          return a < b;
      }
    };
  }
  return compareFunc(a, b);
};

module.exports = {
  compareValues,
};