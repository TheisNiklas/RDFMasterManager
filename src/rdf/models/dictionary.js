const data =
  "Hans hat Auto . Auto ist grün . Haus gehört Hans . Geld ist grün . Hammer farbe blau . Wissensbasis gehört Peter . <http://one.example/subject1> <http://one.example/predicate1> <http://one.example/object1> .";

[["subject", "predicate", "object"],["subject1", "predicate1", "object1"],...]

const dict_SO = {};
const dict_S = {};
const dict_P = {};
const dict_O = {};
const exampleTripleList = [["Hans", "hat", "Auto"],["Auto", "ist", "grün"], ["Haus", "gehört", "Hans"], ["Geld", "ist", "grün"]]

createDictionaries = (tripleList) => {
  const SO = []
  const S = []
  const P = []
  const O = []
  tripleList.forEach((triple) => {
    subject = triple[0]
    predicate = triple[1]
    object = triple[2]

    // for subjects
    if(O.includes(subject)){
      if(!SO.include(subject)){
        SO.push(subject);
        pos = O.indexOf(subject);
        O.splice(pos,1);
      }
    }
    else if (!S.includes(subject)){
      S.push(subject)
    }
    // for predicate
    
    // for object

  })
}

addTriple = (subject, predicate, object) => {
  if ()
};
