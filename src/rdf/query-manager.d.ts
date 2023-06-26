export class QueryManager {
    constructor(rdfcsa: any);
    /**
     * Handles all query directed at the dataset
     * @param {Rdfcsa} rdfcsa
     */
    chosenJoinType: string;
    rdfcsa: any;
    /**
     *
     * @param {Rdfcsa} rdfcsa
     */
    setRdfcsa(rdfcsa: Rdfcsa): void;
    /**
     * Get the triples matching a given `query`
     * @param {QueryTriple[]} queries
     * @returns {Triple[]}
     */
    getTriples(queries: QueryTriple[]): Triple[];
    /**
     * Get all triples in psi
     * @returns {Triple[]}
     */
    getAllTriples(): Triple[];
    /**
     * Queries whether a given fully bound query is in the dataset
     * If true returns the triple in an array, else returns an empty array
     * @param {QueryTriple} query
     * @returns {number[][]}
     */
    getBoundTriple(query: QueryTriple): number[][];
    /**
     * Queries the dataset for the given query with one unbound element
     * @param {QueryTriple} query
     * @returns {number[][]} array with the matching triples, empty if none found
     */
    getOneUnboundTriple(query: QueryTriple): number[][];
    /**
     * Queries the dataset for the given query with two unbound elements
     * @param {QueryTriple} query
     * @returns {number[][]} array with the matching triples, empty if none found
     */
    getTwoUnboundTriple(query: QueryTriple): number[][];
    leftChainingJoinTwoQueries(queries: any): any[];
    rightChainingJoinTwoQueries(queries: any): any[];
    #private;
}
import { Rdfcsa } from "./rdfcsa";
import { QueryTriple } from "../../src/rdf/models/query-triple";
import { Triple } from "./models/triple";
