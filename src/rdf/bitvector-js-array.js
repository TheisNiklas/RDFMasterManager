/**
 * Bitvector using a js array
 */
export class BitVectorJsArray{
  /**
   * 
   * @param {number[]} bits 
   */
  constructor(bits){
    this.bits = bits;
  }
  
  /**
   * Get value of bit at index in BitVector.
   * @param {number} index of Bit
   * @returns bit value at index
   */
  getBit(index) {
    return this.bits[index]
  }

  /**
   * Set value of bit at index in BitVector
   * @param {number} index 
   */
  setBit(index) {
    this.bits[index] = 1
  }

  /**
   * Unset value of bit at index in BitVector
   * @param {number} index 
   */
  unsetBit(index) {
    this.bits[index] = 0
  }

  /**
   * Counts all ones up to `index`
   * @param {number} index 
   * @returns {number} rank 1 of index
   */
  rank(index) {
    let result = 0;
    for (let i = 0; i <= index; i++) {
      result += this.bits[i];
    }
    return result;
  }

  /**
   * Gets the index `count`th 1
   * @param {number} count 
   * @returns {number}
   */
  select(count) {
    for (let index = 0; index < this.bits.length; index++) {
      count -= this.bits[index];
      if (count === 0) {
        return index;
      }
    }
    return this.bits.length;
  }

  /**
   * Add 0 bit at index.
   * @param {number} index 
   */
  addBit(index){
    this.bits.splice(index, 0, 0);
  }

  /**
   * Appends a new bit to the bitVector
   * @param {number} value 
   */
  pushBit(value) {
    this.bits.push(value);
  }

  /**
   * Delete bit at index.
   * @param {number} index 
   */
  deleteBit(index){
    this.bits.splice(index, 1);
  }

  /**
   * generates string representation of current bitvector
   * @returns bitvector as string
   */
  toString() {
    let output = "";
    this.bits.forEach(bit => {
      output += bit
    });
    return output;
  }
}