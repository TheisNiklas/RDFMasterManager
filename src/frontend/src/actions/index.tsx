//open drawer
export const open = () => {
  return {
    type: "IS_OPEN",
  };
};

//close drawer
export const close = () => {
  return {
    type: "IS_CLOSED",
  };
};
