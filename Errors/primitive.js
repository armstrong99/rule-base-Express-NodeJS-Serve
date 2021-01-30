exports.primitive = (first = true, second = { k: 1 }) => {
  if (typeof first === typeof second) {
    if (Array.isArray(first)) {
      if (Array.isArray(second)) {
        return true;
      }
    } else if (Array.isArray(second)) {
      if (Array.isArray(first)) {
        return true;
      }
    }

    return true;
  } else return false;
};
