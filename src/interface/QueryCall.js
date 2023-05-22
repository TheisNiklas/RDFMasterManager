import { QueryElement } from "@/rdf/models/query-element";
import { QueryTriple } from "@/rdf/models/query-triple";
import { QueryManager } from "@/rdf/query-manager";
import { getIdBySubject, getIdByPredicate, getIdByObject } from "@/rdf/dictionary";

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

/**
 *
 * @param {*} queryData
 * @param {*} sortData
 * @param {React.MutableRefObject<QueryManager>} queryManager
 * @returns
 */
function queryCallData(queryData, sortData, queryManager, currentData, setCurrentData) {
  console.log("queryDataCall start: ");
  console.log(queryData);
  console.log(sortData);

  const query = [];
  const idString = [];

  queryData.forEach(function (obj, index) {
    console.log(`Object ${index}:`);
    console.log(obj.subject);
    console.log(obj.predicat);
    console.log(obj.object);

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
        let id = obj.subject;
        if (obj.subject.includes("??")) {
          id = id.replace("?", "");
        }
        const queryEle = new QueryElement(+getIdBySubject(id), false);
        queryTriple.subject = queryEle;
      }
    }

    if (obj.predicat == "") {
      queryTriple.predicate = null;
    } else {
      if (obj.predicat.includes("?") && !obj.predicat.includes("??")) {
        return false;
      } else {
        let id = obj.predicat;
        if (obj.predicat.includes("??")) {
          id = id.replace("?", "");
        }
        const queryEle = new QueryElement(+getIdByPredicate(id), false);
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
        let id = obj.object;
        if (obj.object.includes("??")) {
          id = id.replace("?", "");
        }

        const queryEle = new QueryElement(+getIdByObject(id), false);
        queryTriple.object = queryEle;
      }
    }
    query.push(queryTriple);
  });
  for (let i = 0; i < query.length; i++) {
    console.log(`Triple ${i}:`);
    console.log(`tripleName: ${query[i].tripleName}`);
    if (query[i].queryElement == null) {
      console.log(`query element: null`);
    } else {
      console.log(`id: ${query[i].queryElement.id}`);
      console.log(`isJoinVar: ${query[i].queryElement.isJoinVar}`);
    }
  }
  console.log("queryDataCall end");

  const result = queryManager.current.getTriples(query);

  setCurrentData(result);

  return true;
}

function queryDataFormatting(queryData) { }

export { queryCallData };
