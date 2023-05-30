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
  constructor(){
    this.bits = 0;
  }
  
  getBit(index) {
    if (index >= this.toString().length) {
      return 0;
    }
    const mask = 1 << index;
    return (this.bits & mask) === 0 ? 0 : 1;
  }

  setBit(pos) {
    if (pos >= this.toString().length) {
      throw new Error('Index out of range');
    }
    this.bits |= 1 << pos;
  }

  unsetBit(pos) {
    if (pos >= this.toString().length) {
      throw new Error('Index out of range');
    }
    this.bits &= ~(1 << pos);
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
    for (let index = 0; index < this.toString().length; index++) {
      count -= this.getBit(index);
      if (count === 0) {
        return index;
      }
    }
    return -1;
  }

  addBit(index){
    let length = this.toString().length - index;
    const mask = ((1 << length) - 1) << index;
    const subpart = (this.bits & mask) >>> index;
    const shiftedSubpart = subpart << 1;
    this.bits = (this.bits & ~mask) | (shiftedSubpart << index);
  }

  deleteBit(index){
    let length = this.toString().length - index;
    const mask = ((1 << length) - 1) << index;
    const subpart = (this.bits & mask) >>> index;
    const shiftedSubpart = subpart >> 1;
    this.bits = (this.bits & ~mask) | (shiftedSubpart << index);
  }
  
   toString() {
    const bitString = this.bits.toString(2);
    return bitString.split('').reverse().join('');
  }
}