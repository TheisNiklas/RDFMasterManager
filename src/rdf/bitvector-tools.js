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
    return bitvector.length;
  }
}

export class BitVector{
  constructor(size){
    this.size = size;
  }
  
  getBit(index) {
    if (index >= this.size) {
      throw new Error('Index out of range');
    }

    const mask = BigInt(1) << BigInt(index);
    return (this.bits & mask) !== BigInt(0) ? 1 : 0;
  }

  setBit(pos) {
    if (pos >= this.size) {
      throw new Error('Index out of range');
    }
    this.bits |= BigInt(1) << BigInt(pos);
  }

  unsetBit(pos) {
    if (pos >= this.size) {
      throw new Error('Index out of range');
    }
    this.bits &= ~(BigInt(1) << BigInt(pos));
  }

  static rank(index) {
    let result = 0;
    for (let i = 0; i <= index; i++) {
      if(this.getBit(i)){
        result += 1;
      }
    }
    return result;
  }

  static select(count) {
    for (let index = 0; index < this.size; index++) {
      count -= this.getBit(index);
      if (count === 0) {
        return index;
      }
    }
    return size;
  }
  
   toString() {
    const bitString = this.bits.toString(2).padStart(this.size, '0');
    return bitString.split('').reverse().join('');
  }
}