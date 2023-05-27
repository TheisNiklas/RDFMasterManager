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

export const setSortElement = (sortElement: string) => ({
  type: "SET_SORT_ELEMENT",
  payload: sortElement,
});

export const setSortOrder = (sortOrder: string) => ({
  type: "SET_SORT_ORDER",
  payload: sortOrder,
});

export const setVisualLimit = (visualLimit: number) => ({
  type: "SET_VISUAL_LIMIT",
  payload: visualLimit,
});
