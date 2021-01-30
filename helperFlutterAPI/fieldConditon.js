const { primitive } = require("../Errors/primitive");
const { throws } = require("../Errors/throws");

exports.fieldCondition = (found, condition_value, condition, field) => {
  if (found === undefined) {
    throws(field, "FIELD_VALIDATE_MISSING");
  } else {
    let prim_val = primitive(condition_value, found);
    console.log(prim_val);
    if (prim_val) {
      switch (condition) {
        case "eq":
          if (found === condition_value)
            return `field ${field} successfully validated.`;
          else throws(field, "FIELD_VALIDATE_FAILED");
        case "gt":
          if (found > condition_value) {
            console.log(found, condition, condition_value);

            return `field ${field} successfully validated.`;
          } else throws(field, "FIELD_VALIDATE_FAILED");
        case "gte":
          if (found >= condition_value)
            return `field ${field} successfully validated.`;
          else throws(field, "FIELD_VALIDATE_FAILED");
        case "neq":
          if (found !== condition_value)
            return `field ${field} successfully validated.`;
          else throws(field, "FIELD_VALIDATE_FAILED");
        case "contains":
          if (found.includes(condition_value))
            return `field ${field} successfully validated.`;
          else throws(field, "FIELD_VALIDATE_FAILED");
          break;

        default:
          break;
      }
    } else throws(field, "FIELD_VALIDATE_FAILED");
  }
};
