export const getFakeId = (val, isActive = true) => {
  if (isActive) {
    const oldId = val.split("");
    oldId[0] = "2";
    return oldId.join("");
  }
  return val;
};
