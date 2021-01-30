exports.throws = (msg, type) => {
  switch (type) {
    case "FIELD_VALIDATE_MISSING":
      throw new Error(`field ${msg} is missing from data`);
    case "FIELD_VALIDATE_FAILED":
      throw new Error(`field ${msg} failed validation`);
    case "FIELD_VALIDATE_DEPTH":
      throw new Error(`field ${msg} is more than two level deep`);

    default:
      break;
  }
};
