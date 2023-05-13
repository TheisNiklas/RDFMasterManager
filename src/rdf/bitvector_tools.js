class BitvectorTools {
  rank(bitvector, index) {
    result = 0;
    for (let i = 0; i < index; i++) {
      result += bitvector[i];
    }
    return result;
  }

  select(bitvector, count) {
    bitvector.forEach((value, index) => {
      count -= value;
      if (count === 0) {
        return index;
      }
    });
  }
}
