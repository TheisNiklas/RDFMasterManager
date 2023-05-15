export class BitvectorTools {
  static rank(bitvector, index) {
    let result = 0;
    for (let i = 0; i <= index; i++) {
      result += bitvector[i];
    }
    return result;
  }

  static select(bitvector, count) {
    for (let index = 0; index < bitvector.length; index++) {
      count -= bitvector[index];
      if (count === 0) {
        return index;
      }
    }
    /*
    bitvector.forEach((value, index) => {
      if (count === 0) {
        return index;
      }
      count -= value;
    });
      */
  }
}
