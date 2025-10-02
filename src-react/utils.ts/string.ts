export const removeEmptyStrings = (obj: { [key: string]: any }) => {
  Object.entries(obj).forEach(([k, v]) => {
    if (v == "") {
      obj[k] = undefined;
    }
  });
};
