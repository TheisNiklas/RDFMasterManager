import { QueryTriple } from "@rdf/models/query-triple";
import { Triple } from "@/rdf/models/triple";
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

export const addQueryTriple = (triple: QueryTriple) => ({
  type: "ADD_QUERYTRIPLE",
  payload: triple,
});

export const removeQueryTriple = (index: number) => ({
  type: "REMOVE_QUERYTRIPLE",
  payload: index,
});

export const updateSubject = (index: number, value: string) => ({
  type: "UPDATE_SUBJECT",
  payload: { index, value },
});

export const updatePredicate = (index: number, value: string) => ({
  type: "UPDATE_PREDICATE",
  payload: { index, value },
});

export const updateObject = (index: number, value: string) => ({
  type: "UPDATE_OBJECT",
  payload: { index, value },
});

export const addTripleToCurrentData = (triple: Triple) => ({
  type: "ADD_TRIPLE",
  payload: triple,
});

export const removeTripleFromCurrentData = (index: number) => ({
  type: "REMOVE_TRIPLE",
  payload: index,
});

export const setCurrentData = (triples: Triple[]) => ({
  type: "SET_CURRENTDATA",
  payload: triples,
});
