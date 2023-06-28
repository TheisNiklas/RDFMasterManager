import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { QueryManager } from "../../src/rdf/query-manager";
import { QueryElement } from "../../src/rdf/models/query-element";
import { QueryTriple } from "../../src/rdf/models/query-triple";
import { paperSample } from "./fixtures/rdfcsa.test.json";
import { Triple } from "../../src/rdf/models/triple";

describe("QueryManager", () => {
  let queryManager;
  beforeEach(() => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(paperSample.tripleList)), true);
    queryManager = new QueryManager(rdfcsa);
  });
  test("getBoundTriple(0,9,12)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(9);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([[0, 9, 12]]);
  });
  test("getBoundTriple(3,5,11)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([[3, 5, 11]]);
  });
  test("getBoundTriple(2,5,11)", () => {
    const subject = new QueryElement(2);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([[2, 5, 11]]);
  });
  test("getBoundTripleIncorrect(3,7,12)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(7);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getBoundTripleIncorrect(0,8,12)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(8);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getBoundTripleIncorrect(0,0,0)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(0);
    const object = new QueryElement(0);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getOneUnboundTriple(?,5,11)", () => {
    const subject = null;
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getOneUnboundTriple(1,?,15)", () => {
    const subject = new QueryElement(1);
    const predicate = null;
    const object = new QueryElement(15);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([[1, 8, 15]]);
  });
  test("getOneUnboundTriple(4,7,?)", () => {
    const subject = new QueryElement(4);
    const predicate = new QueryElement(7);
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([[4, 7, 15]]);
  });
  test("getTwoUnboundTriple(3,,)", () => {
    const subject = new QueryElement(3);
    const predicate = null;
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [3, 5, 11],
      [3, 7, 15],
      [3, 10, 12],
    ]);
  });
  test("getTwoUnboundTriple(4,,)", () => {
    const subject = new QueryElement(4);
    const predicate = null;
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [4, 5, 11],
      [4, 6, 14],
      [4, 7, 15],
    ]);
  });
  test("getTwoUnboundTriple(,5,)", () => {
    const subject = null;
    const predicate = new QueryElement(5);
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getTwoUnboundTriple(,,15)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(15);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [1, 8, 15],
      [3, 7, 15],
      [4, 7, 15],
    ]);
  });
  test("getTwoUnboundTriple(,,11)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getTriple(0,9,12)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(9);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTriples([queryTriple]);
    expect(result).toEqual([new Triple(0, 9, 12)]);
  });
  test("getTriple(,,11)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTriples([queryTriple]);
    expect(result).toEqual([new Triple(2, 5, 11), new Triple(3, 5, 11), new Triple(4, 5, 11)]);
  });
  test("getTriple(,5,11)", () => {
    const subject = null;
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTriples([queryTriple]);
    expect(result).toEqual([new Triple(2, 5, 11), new Triple(3, 5, 11), new Triple(4, 5, 11)]);
  });
  test("getTriple(,,)", () => {
    const subject = null;
    const predicate = null;
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTriples([queryTriple]);
    expect(result).toEqual([
      { subject: 0, predicate: 9, object: 12 },
      { subject: 1, predicate: 8, object: 15 },
      { subject: 2, predicate: 5, object: 11 },
      { subject: 2, predicate: 7, object: 13 },
      { subject: 3, predicate: 5, object: 11 },
      { subject: 3, predicate: 7, object: 15 },
      { subject: 3, predicate: 10, object: 12 },
      { subject: 4, predicate: 5, object: 11 },
      { subject: 4, predicate: 6, object: 14 },
      { subject: 4, predicate: 7, object: 15 },
    ]);
  });

  /**
   * J. Gordon born in ?x
   * L. DiCaprio born in ?x
   * x=USA
   */
  test("getJoin(3,7,x)(4,7,x)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(7);
    const object = new QueryElement(0, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(4);
    const predicate1 = new QueryElement(7);
    const object1 = new QueryElement(0, true);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple]);
    expect(new Set(result)).toEqual(new Set([new Triple(3, 7, 15), new Triple(4, 7, 15)]));
  });

  /**
   * Get all subjects that are also objects
   */
  test("getJoin(,,x)(x,,)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(0, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(0, true);
    const predicate1 = null;
    const object1 = null;
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple]);
    expect(new Set(result)).toEqual(
      new Set([
        new Triple(0, 9, 12),
        new Triple(2, 5, 11),
        new Triple(3, 5, 11),
        new Triple(3, 10, 12),
        new Triple(4, 5, 11),
        new Triple(1, 8, 15),
      ])
    );
  });
  /**
   * Return all subjects that have a relation to an object that is also a subject that has a relation to the initial subject
   */
  test("getJoin(x,,y)(y,,x)", () => {
    const subject = new QueryElement(0, true);
    const predicate = null;
    const object = new QueryElement(1, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(1, true);
    const predicate1 = null;
    const object1 = new QueryElement(0, true);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple]);
    expect(result).toEqual([new Triple(0, 9, 12)]);
  });

  /**
   * Testing more complex joins with three variables
   * ?x appears in ?y
   * ?x lives in ?z
   * ?y filmed in ?z
   * x={J.Gordon}
   * y={Inception}
   * z={L.A.}
   */
  test("getJoin(?x,5,?y)(?x,10,?z)(?y,9,?z)", () => {
    const firstQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(5, false),
      new QueryElement(1, true)
    );
    const secondQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(10, false),
      new QueryElement(2, true)
    );
    const thirdQueryTriple = new QueryTriple(
      new QueryElement(1, true),
      new QueryElement(9, false),
      new QueryElement(2, true)
    );
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple, thirdQueryTriple]);
    expect(new Set(result)).toEqual(new Set([new Triple(3, 10, 12), new Triple(3, 5, 11), new Triple(0, 9, 12)]));
  });

  /**
   * Testing UNION for constant query
   * E. Page appears in ?
   * Inception filmed in L.A.
   * RESULT: [(E. Page appears in Inception), (Inception filmed in L.A.)]
   */
  test("getJoin(4,5,)(0,9,12)", () => {
    const firstQueryTriple = new QueryTriple(new QueryElement(4, false), new QueryElement(5, false), null);
    const secondQueryTriple = new QueryTriple(
      new QueryElement(0, false),
      new QueryElement(9, false),
      new QueryElement(12, false)
    );
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple]);
    expect(new Set(result)).toEqual(new Set([new Triple(4, 5, 11), new Triple(0, 9, 12)]));
  });

  /**
   * Testing UNION
   * ?x appears in Inception
   * ?x awarded Oscar 2015
   * ?y appears in Inception
   * ?y born in USA
   * RESULT: Everyone who appeared in Inception and (got awarded an Oscar 2015 or born in USA)
   * x=L. DiCaprio
   * y=J. Gordon
   */
  test("getJoin(?x,5,11)(?x,6,14)(?y,5,11)(?y,10,12)", () => {
    const firstQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(5, false),
      new QueryElement(11, false)
    );
    const secondQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(6, false),
      new QueryElement(14, false)
    );
    const thirdQueryTriple = new QueryTriple(
      new QueryElement(1, true),
      new QueryElement(5, false),
      new QueryElement(11, false)
    );
    const fourthQueryTriple = new QueryTriple(
      new QueryElement(1, true),
      new QueryElement(10, false),
      new QueryElement(12, false)
    );
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple, thirdQueryTriple, fourthQueryTriple]);
    expect(new Set(result)).toEqual(
      new Set([new Triple(4, 5, 11), new Triple(4, 6, 14), new Triple(3, 5, 11), new Triple(3, 10, 12)])
    );
  });

  test("leftChainingJoinTwoQueries(x,5,11)(x,7,15)", () => {
    const subject = new QueryElement(0, true);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const firstQueryTriple = new QueryTriple(subject, predicate, object); // (x, "appears in", "Inception")
    const subject1 = new QueryElement(0, true);
    const predicate1 = new QueryElement(7);
    const object1 = new QueryElement(15);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1); // (x, "born in", "USA")
    const result = queryManager.leftChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple]);
    expect(new Set(result)).toEqual(new Set([[3, 7, 15], [4, 7, 15]])); // ("L. DiCarpio", "born in", "USA"), (J. Gordon, "born in", "USA")
  });

  /**
   * J. Gordon born in ?x
   * L. DiCaprio born in ?x
   * x=USA
   */
  test("leftChainingJoinTwoQueries(3,7,x)(4,7,x)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(7);
    const object = new QueryElement(0, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(4);
    const predicate1 = new QueryElement(7);
    const object1 = new QueryElement(0, true);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.leftChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple]);
    expect(new Set(result)).toEqual(new Set([[3, 7, 15], [4, 7, 15]]));
  });

  /**
   * Get all subjects that are also objects
   */
  test("leftChainingJoinTwoQueries(,,x)(x,,)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(0, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(0, true);
    const predicate1 = null;
    const object1 = null;
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.leftChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple])
    expect(new Set(result)).toEqual(
      new Set([
        new Triple(0, 9, 12),
        new Triple(2, 5, 11),
        new Triple(3, 5, 11),
        new Triple(3, 10, 12),
        new Triple(4, 5, 11),
        new Triple(1, 8, 15),
      ])
    );
  });
  /**
   * Return all subjects that have a relation to an object that is also a subject that has a relation to the initial subject
   */
  test("leftChainingJoinTwoQueries(x,,y)(y,,x)", () => {
    const subject = new QueryElement(0, true);
    const predicate = null;
    const object = new QueryElement(1, true);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(1, true);
    const predicate1 = null;
    const object1 = new QueryElement(0, true);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.leftChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple]);
    expect(result).toEqual([new Triple(0, 9, 12)]);
  });

  /**
   * Testing more complex joins with three variables
   * ?x appears in ?y
   * ?x lives in ?z
   * ?y filmed in ?z
   * x={J.Gordon}
   * y={Inception}
   * z={L.A.}
   */
  test.skip("getJoin(?x,5,?y)(?x,10,?z)(?y,9,?z)", () => {
    const firstQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(5, false),
      new QueryElement(1, true)
    );
    const secondQueryTriple = new QueryTriple(
      new QueryElement(0, true),
      new QueryElement(10, false),
      new QueryElement(2, true)
    );
    const thirdQueryTriple = new QueryTriple(
      new QueryElement(1, true),
      new QueryElement(9, false),
      new QueryElement(2, true)
    );
    const result = queryManager.getTriples([firstQueryTriple, secondQueryTriple, thirdQueryTriple]);
    expect(new Set(result)).toEqual(new Set([new Triple(3, 10, 12), new Triple(3, 5, 11), new Triple(0, 9, 12)]));
  });

  test.skip("rightChainingJoinTwoQueries(x,5,11)(x,7,15)", () => {
    const subject = new QueryElement(0, true);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const firstQueryTriple = new QueryTriple(subject, predicate, object);
    const subject1 = new QueryElement(0, true);
    const predicate1 = new QueryElement(7);
    const object1 = new QueryElement(15);
    const secondQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const result = queryManager.rightChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple]);
    expect(result).toEqual([new Triple(3, 5, 11), new Triple(4, 5, 11)]);
  });

  test.skip("rightChainingJoinTwoQueries(x,7,15)(x,5,11)", () => {
    const subject1 = new QueryElement(0, true);
    const predicate1 = new QueryElement(7);
    const object1 = new QueryElement(15);
    const firstQueryTriple = new QueryTriple(subject1, predicate1, object1);
    const subject = new QueryElement(0, true);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const secondQueryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.rightChainingJoinTwoQueries([firstQueryTriple, secondQueryTriple]);
    expect(result).toEqual([new Triple(3, 7, 15), new Triple(4, 7, 15)]);
  });
});
