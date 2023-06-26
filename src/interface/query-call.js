import { QueryElement } from "../rdf/models/query-element";
import { QueryTriple } from "../rdf/models/query-triple";
import { Triple } from "../rdf/models/triple";
import { QueryManager } from "../rdf/query-manager";
import { Rdfcsa } from "../rdf/rdfcsa";

//Formats the user query for the rdf backend.
//The same query variables marked with a "?" are stored in a list.
//For the backend these are formatted with "true" and counting up from 0 with an id.
//The same query variables also have the same id.
//If no query variable is given, "false" is stored and the id becomes the data content of the element in the dictionary.
//"NULL" is stored if no input has been made. The TripleName indicates whether it is a subject, predicate or object.
//Returns false if the entered data is incorrect.

//Example for the format:
/*
?s lives in $x
$x is in USA
[
  {
    "subject": null,
    "predicate": {
      "isVar": false,
      "id": 15
    },
    "object": {
      "isVar": true,
      "id": 0
    }
  },
  {
    "subject": 
    {
      "isVar": true,
      "id": 0
    },
    "predicate": {
      "isVar": false,
      "id": 14
    },
    "object": {
      "isVar": false,
      "id": 154
    }
  }
]
*/
export class QueryCall {
  /**
   * 
   * @param {{ subject: string; predicate: string; object: string; }[]} queryData 
   * @param {Rdfcsa} database 
   * @param {Triple[]} currentData 
   * @param {React.Dispatch<React.SetStateAction<Triple[]>>} setCurrentData 
   * @returns 
   */
  static queryCallData(queryData, database) {
    const queryManager = new QueryManager(database);

    const query = [];
    const idString = [];

    queryData.forEach(function (obj, index) {

      const queryTriple = new QueryTriple();

      if (obj.subject == "") {
        queryTriple.subject = null;
      } else {
        if (obj.subject.includes("?") && !obj.subject.includes("??")) {
          let idName = obj.subject;
          idName = idName.replace("?", "");
          let queryEleVar;
          if (idString.includes(idName)) {
            const index = idString.indexOf(idName);
            queryEleVar = new QueryElement(index, true);
          } else {
            idString.push(idName);
            queryEleVar = new QueryElement(idString.length - 1, true);
          }
          queryTriple.subject = queryEleVar;
        } else {
          let name = obj.subject;
          if (obj.subject.includes("??")) {
            name = name.replace("?", "");
          }
          const id = database.dictionary.getIdBySubject(name);
          const queryEle = new QueryElement(id, false);
          queryTriple.subject = queryEle;
        }
      }

      if (obj.predicate == "") {
        queryTriple.predicate = null;
      } else {
        if (obj.predicate.includes("?") && !obj.predicate.includes("??")) {
          return false;
        } else {
          let name = obj.predicate;
          if (obj.predicate.includes("??")) {
            name = name.replace("?", "");
          }
          const id = database.dictionary.getIdByPredicate(name)
          const queryEle = new QueryElement(id, false);
          queryTriple.predicate = queryEle;
        }
      }

      if (obj.object == "") {
        queryTriple.object = null;
      } else {
        if (obj.object.includes("?") && !obj.object.includes("??")) {
          let idName = obj.object;
          idName = idName.replace("?", "");
          let queryEleVar;
          if (idString.includes(idName)) {
            const index = idString.indexOf(idName);
            queryEleVar = new QueryElement(index, true);
          } else {
            idString.push(idName);
            queryEleVar = new QueryElement(idString.length - 1, true);
          }
          queryTriple.object = queryEleVar;
        } else {
          let name = obj.object;
          if (obj.object.includes("??")) {
            name = name.replace("?", "");
          }
          const id = database.dictionary.getIdByObject(name)
          const queryEle = new QueryElement(id, false);
          queryTriple.object = queryEle;
        }
      }
      query.push(queryTriple);
    });

    const result = queryManager.getTriples(query);

    return result;
  }
}