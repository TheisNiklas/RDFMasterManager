class QueryElement {
  constructor(id = null, isJoinVar = false) {
    this.id = id;
    this.isJoinVar = isJoinVar;
  }
}

class TripleElement {
  constructor(tripleName = "", queryElement = null) {
    this.tripleName = tripleName;
    this.queryElement = queryElement;
  }
}

function queryCallData(queryData, sortData) {
  console.log("queryDataCall start: ");
  console.log(queryData);
  console.log(sortData);

  const tripleElements = [];
  const idString = [];

  queryData.forEach(function (obj, index) {
    console.log(`Object ${index}:`);
    console.log(obj.subject);
    console.log(obj.predicat);
    console.log(obj.object);

    if (obj.subject == "") {
      tripleElements.push(new TripleElement("subject", null));
    }
    else {
      if (obj.subject.includes('?') && !obj.subject.includes('??')) {
        let idName = obj.subject;
        idName = idName.replace('?', '');
        let queryEleVar;
        if (idString.includes(idName)) {
          const index = idString.indexOf(idName);
          queryEleVar = new QueryElement(index, true)
        } else {
          idString.push(idName);
          queryEleVar = new QueryElement(idString.length - 1, true)
        }

        tripleElements.push(new TripleElement("subject", queryEleVar));
      }
      else {
        let id = obj.subject;
        if (obj.subject.includes('??')) {
          id = id.replace('?', '');
        }

        const queryEle = new QueryElement(id, false);
        tripleElements.push(new TripleElement("subject", queryEle));
      }
    }

    if (obj.predicat == "") {
      tripleElements.push(new TripleElement("predicat", null));
    }
    else {
      if (obj.predicat.includes('?') && !obj.predicat.includes('??')) {
        let idName = obj.predicat;
        idName = idName.replace('?', '');
        let queryEleVar;
        if (idString.includes(idName)) {
          const index = idString.indexOf(idName);
          queryEleVar = new QueryElement(index, true)
        } else {
          idString.push(idName);
          queryEleVar = new QueryElement(idString.length - 1, true)
        }
        tripleElements.push(new TripleElement("predicat", queryEleVar));
      }
      else {
        let id = obj.predicat;
        if (obj.predicat.includes('??')) {
          id = id.replace('?', '');
        }

        const queryEle = new QueryElement(id, false);
        tripleElements.push(new TripleElement("predicat", queryEle));
      }
    }

    if (obj.object == "") {
      tripleElements.push(new TripleElement("object", null));
    }
    else {
      if (obj.object.includes('?') && !obj.object.includes('??')) {
        let idName = obj.object;
        idName = idName.replace('?', '');
        let queryEleVar;
        if (idString.includes(idName)) {
          const index = idString.indexOf(idName);
          queryEleVar = new QueryElement(index, true)
        } else {
          idString.push(idName);
          queryEleVar = new QueryElement(idString.length - 1, true)
        }
        tripleElements.push(new TripleElement("object", queryEleVar));
      }
      else {
        let id = obj.object;
        if (obj.object.includes('??')) {
          id = id.replace('?', '');
        }

        const queryEle = new QueryElement(id, false);
        tripleElements.push(new TripleElement("object", queryEle));
      }
    }

  });
  for (let i = 0; i < tripleElements.length; i++) {
    console.log(`Triple ${i}:`);
    console.log(`tripleName: ${tripleElements[i].tripleName}`);
    if (tripleElements[i].queryElement == null) {
      console.log(`query element: null`);
    }
    else {
      console.log(`id: ${tripleElements[i].queryElement.id}`);
      console.log(`isJoinVar: ${tripleElements[i].queryElement.isJoinVar}`);
    }

  }
  console.log("queryDataCall end");
  return true;
  //send Data to the rdf part  
}

function queryDataFormatting(queryData) {

}



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

export { queryCallData };