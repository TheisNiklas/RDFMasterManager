export class QueryTriple {
    /**
     *
     * @param {QueryElement | null} subject
     * @param {QueryElement | null} predicate
     * @param {QueryElement | null} object
     */
    constructor(subject?: QueryElement | null, predicate?: QueryElement | null, object?: QueryElement | null);
    subject: any;
    predicate: any;
    object: any;
}
