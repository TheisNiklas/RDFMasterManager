/**
 * Contributions made by:
 * Niklas Theis
 * Bjarne Küper
 * Sarah Flohr
 */

import load_data from "../components/triple2graph";
import { QueryTriple } from "../rdf/models/query-triple";
import { Triple } from "../rdf/models/triple";
import { Rdfcsa } from "../rdf/rdfcsa";

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

//element by which is sorted
export const setSortElement = (sortElement: string) => ({
  type: "SET_SORT_ELEMENT",
  payload: sortElement,
});

//sorting order - ascending, descending
export const setSortOrder = (sortOrder: string) => ({
  type: "SET_SORT_ORDER",
  payload: sortOrder,
});

//limit of visualized triples
export const setVisualLimit = (visualLimit: number) => ({
  type: "SET_VISUAL_LIMIT",
  payload: visualLimit,
});

//add query triple
export const addQueryTriple = (triple: QueryTriple) => ({
  type: "ADD_QUERYTRIPLE",
  payload: triple,
});

//remove query triple
export const removeQueryTriple = (index: number) => ({
  type: "REMOVE_QUERYTRIPLE",
  payload: index,
});

//subject form
export const updateSubject = (index: number, value: string) => ({
  type: "UPDATE_SUBJECT",
  payload: { index, value },
});

//pedicate form
export const updatePredicate = (index: number, value: string) => ({
  type: "UPDATE_PREDICATE",
  payload: { index, value },
});

//object form
export const updateObject = (index: number, value: string) => ({
  type: "UPDATE_OBJECT",
  payload: { index, value },
});

//current data
export const setCurrentData = (triples: Triple[]) => ({
  type: "SET_CURRENTDATA",
  payload: triples,
});

//database
export const setDatabase = (rdfcsa: Rdfcsa) => ({
  type: "SET_DATABASE",
  payload: rdfcsa,
});

//visulization - text or graph
export const setMainFrame = (mainFrameContent: string) => ({
  type: "SET_MAINFRAME",
  payload: mainFrameContent,
});

//graph data
export const setGraphData = (database: any, currentData: any) => ({
  type: "SET_GRAPHDATA",
  payload: load_data(database, currentData),
});

//metadata
export const setMetaData = (triples: Triple[]) => ({
  type: "SET_METADATA",
  payload: triples,
});

//loading
export const setLoading = (loading: boolean) => ({
  type: "SET_LOADING",
  payload: loading,
});
