const { throws } = require("../Errors/throws");
const { fieldCondition } = require("./fieldConditon");

const validateSchema = ({ field, condition, condition_value }, data) => {
  if (field.includes(".")) {
    let splitVal = field.split(".");
    let splitLength = splitVal.length;

    switch (splitLength) {
      case 2:
        let found = data[splitVal[0]][splitVal[1]];
        return fieldCondition(found, condition_value, condition, field);
      case 3:
        let foundX = data[splitVal[0]][splitVal[1]][splitVal[2]];
        return fieldCondition(foundX, condition_value, condition, field);
      default:
        throws(field, "FIELD_VALIDATE_DEPTH");
        break;
    }
  } else {
    return fieldCondition(data[field], condition_value, condition, field);
  }
};

module.exports = validateSchema;
