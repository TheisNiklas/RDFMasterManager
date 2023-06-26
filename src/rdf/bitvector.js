export class BitVector {
  constructor() {
    this.bits = new Uint32Array([0]);
    this.superblocks = [0];
    this.arrayLength = 1;
  }

  /**
   * Get value of Bit at index in BitVector.
   * In BitVector the last value is the value of the last 1. All following 0 are not saved in BitVector.
   * @param {number} index of Bit
   * @returns bit value at index
   */
  getBit(index) {
    if (index >= this.toString().length) {
      return 0;
    }
    let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));
    const mask = 1 << index % (Uint32Array.BYTES_PER_ELEMENT * 8);
    return (this.bits[element] & mask) === 0 ? 0 : 1;
  }

  /**
   * Set value of Bit at index in BitVector
   * @param {number} index
   */
  setBit(index) {
    if (this.getBit(index) != 1) {
      let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));
      if (element >= this.arrayLength) {
        let array = [];
        for (let i = 0; i < this.arrayLength; i++) {
          array.push(this.bits[i]);
        }
        for (this.arrayLength; this.arrayLength <= element; this.arrayLength++) {
          array.push(0);
          this.superblocks.push(1);
        }
        this.bits = new Uint32Array(array);
      } else {
        this.superblocks[element]++;
      }
      this.bits[element] |= 1 << index % (Uint32Array.BYTES_PER_ELEMENT * 8);
    }
  }

  /**
   * Unset value of Bit at index in BitVector
   * @param {number} index
   */
  unsetBit(index) {
    if (this.getBit(index) != 0) {
      if (index >= this.toString().length) {
        throw new Error("Index out of range");
      }
      let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));
      this.bits[element] &= ~(1 << index % (Uint32Array.BYTES_PER_ELEMENT * 8));
      this.superblocks[element] -= 1;
    }
  }

  /**
   *
   * @param {number} index
   * @returns {number} rank 1 of index
   */
  rank(index) {
    let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));
    if (element >= this.arrayLength) {
      index = this.arrayLength * (Uint32Array.BYTES_PER_ELEMENT * 8) - 1;
    }
    let result = 0;
    for (let j = 0; j < element; j++) {
      result += this.superblocks[j];
    }
    for (let i = element * Uint32Array.BYTES_PER_ELEMENT * 8; i <= index; i++) {
      if (this.getBit(i) === 1) {
        result += 1;
      }
    }

    return result;
  }

  /**
   *
   * @param {number} count
   * @returns {number}
   */
  select(count) {
    if (count >= 0) {
      let element = 0;
      while (count - this.superblocks[element] > 0) {
        count -= this.superblocks[element];
        element++;
      }

      if (count === 0) {
        if (element === 0) {
          return 0;
        }
        return Uint32Array.BYTES_PER_ELEMENT * 8 * element - 1;
      }

      for (let index = Uint32Array.BYTES_PER_ELEMENT * 8 * element; index < this.toString().length; index++) {
        count -= this.getBit(index);
        if (count === 0) {
          return index;
        }
      }
    }
    return -1;
  }

  /**
   * add 0 Bit at index.
   * @param {number} index
   */
  addBit(index) {
    if (index < this.toString().length) {
      let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));

      let length = Uint32Array.BYTES_PER_ELEMENT * 8 - 1 - (index % (Uint32Array.BYTES_PER_ELEMENT * 8));
      const mask = ((1 << length) - 1) << index % (Uint32Array.BYTES_PER_ELEMENT * 8);
      const subpart = (this.bits[element] & mask) >>> index % (Uint32Array.BYTES_PER_ELEMENT * 8);
      const shiftedSubpart = subpart << 1;
      let prelastbit = (this.bits[element] >> 31) & 1;
      this.bits[element] =
        (this.bits[element] & ~mask) | (shiftedSubpart << index % (Uint32Array.BYTES_PER_ELEMENT * 8));

      let stop = false;
      for (let i = element + 1; i <= this.arrayLength; i++) {
        // Shift the number 31 bits to the right to keep only the last bit
        if (i === this.arrayLength) {
          if (!stop && prelastbit > 0) {
            this.addNewIntElement(this.arrayLength + 1);
            this.superblocks.push(0);
            stop = true;
          }
        }
        if (prelastbit === 1) {
          this.superblocks[i] += 1;
          this.superblocks[i - 1] -= 1;
        }
        let temp = (this.bits[i] >> 31) & 1;
        this.bits[i] = (this.bits[i] << 1) | prelastbit;
        prelastbit = temp;
      }
    }
  }

  /**
   * delete Bit at index.
   * @param {number} index
   */
  deleteBit(index) {
    if (index < this.toString().length) {
      let element = Math.floor(index / (Uint32Array.BYTES_PER_ELEMENT * 8));

      if (this.getBit(index) === 1) {
        this.superblocks[element] -= 1;
      }

      let length = Uint32Array.BYTES_PER_ELEMENT * 8 - 1 - (index % (Uint32Array.BYTES_PER_ELEMENT * 8));
      const mask = ((1 << length) - 1) << index % (Uint32Array.BYTES_PER_ELEMENT * 8);
      const subpart = (this.bits[element] & mask) >>> index % (Uint32Array.BYTES_PER_ELEMENT * 8);
      const shiftedSubpart = subpart >> 1;

      let bit = 0;
      if (element < this.arrayLength - 1) {
        bit = this.bits[element + 1] & 1;
      }
      this.bits[element] =
        (this.bits[element] & ~mask) | (shiftedSubpart << index % (Uint32Array.BYTES_PER_ELEMENT * 8)) | (bit << 31);

      for (let i = element + 1; i < this.arrayLength; i++) {
        let prefirstbit = 0;
        if (i !== this.arrayLength - 1) {
          prefirstbit = this.bits[element + 1] & 1;
          if (prefirstbit === 1) {
            this.superblocks[i] += 1;
            this.superblocks[i + 1] -= 1;
          }
        }
        // Shift the number 1 bit to the left
        this.bits[i] = (prefirstbit << 31) | (this.bits[i] >> 1);
      }

      if (this.bits[this.arrayLength - 1] === 0 && this.arrayLength > 1) {
        this.arrayLength--;
        this.superblocks.pop();
      }
    }
  }

  addNewIntElement(newArrayLength) {
    let array = [];
    for (let i = 0; i < this.arrayLength; i++) {
      array.push(this.bits[i]);
    }
    for (this.arrayLength; this.arrayLength <= newArrayLength - 1; this.arrayLength++) {
      array.push(0);
    }

    this.bits = new Uint32Array(array);
  }

  /**
   *
   * @returns string of bits in BitVector ordered by index (left to right)
   */
  toString() {
    let bitString = "";
    for (let i = 0; i < this.arrayLength; i++) {
      let elementString = this.bits[i].toString(2);
      elementString = elementString.split("").reverse().join("");
      while (i < this.arrayLength - 1 && elementString.length < 32) {
        elementString += "0";
      }
      bitString += elementString;
    }
    return bitString;
  }
}
