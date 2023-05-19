class QueryElement {
  id = Null;
  isJoinVar = true;
  constructor(id = null, isJoinVar = false) {
    this.id = id;
    this.isJoinVar = isJoinVar;
  }
}

function queryCallData(queryData, sortData) {
  console.log("queryDataCall start: ");
  console.log(queryData);
  console.log(sortData);
  console.log("queryDataCall end");

  //queryData

  let queryEle = new QueryElement();

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