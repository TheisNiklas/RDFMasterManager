/**
 * Contributions made by:
 * Svea Worms
 * Tobias Kaps
 * Niklas Theis
 */

export class BitVector {
  /**
   * bits representing the bitvector as array of elements of type Uint32
   * -- in bits only goes up to the index of the last 1
   * superblocks saves the count of 1s of each element in bits
   * arrayLength saves the element count of bits
   */
  constructor() {
    this.bits = new Uint32Array([0]);
    this.superblocks = [0];
    this.arrayLength = 1;
    this.bitsPerElement = Uint32Array.BYTES_PER_ELEMENT * 8;
  }

  /**
   * Get value of Bit at index in BitVector.
   * In BitVector the last value is the value of the last 1. All following 0 are not saved in BitVector.
   * @param {number} index of Bit
   * @returns bit value at index
   */
  getBit(index) {
    // if the index is greater than the saved bitvector, it must be a 0
    // because in bits the index of the last 1 is saved but not the index of the last 0
    if (index >= this.toString().length) {
      return 0;
    }
    // get the elment of the array bits, where the index is saved in
    let element = Math.floor(index / this.bitsPerElement);
    // create a mask, which includes a 1 at index, else 0
    const mask = 1 << index % this.bitsPerElement;
    // get the index's value
    return (this.bits[element] & mask) === 0 ? 0 : 1;
  }

  /**
   * Set value of Bit at index in BitVector to 1
   * @param {number} index
   */
  setBit(index) {
    // check if value of index is already 1
    if (this.getBit(index) != 1) {
      // get the elment of the array bits, where the index is saved in
      let element = Math.floor(index / this.bitsPerElement);
      // if element is outside of bits array, add new elment to bits
      if (element >= this.arrayLength) {
        this.#addNewIntElement(element + 1);
      }
      // increase superblocks at element by 1
      this.superblocks[element] += 1;
      // set bits at element at index to 1
      this.bits[element] |= 1 << index % this.bitsPerElement;
    }
  }

  /**
   * Unset value of Bit at index in BitVector (set to 0)
   * @param {number} index
   */
  unsetBit(index) {
    // check if value of index is already 0
    if (this.getBit(index) != 0) {
      // check if index is valid
      if (index >= this.toString().length) {
        throw new Error("Index out of range");
      }
      // get the elment of the array bits, where the index is saved in
      let element = Math.floor(index / this.bitsPerElement);
      // set bits at element at index to 1
      this.bits[element] &= ~(1 << index % this.bitsPerElement);
      // decrease superblocks at element by 1
      this.superblocks[element] -= 1;
    }
  }

  /**
   * Get the rank 1 of index in BitVector
   * @param {number} index
   * @returns {number} rank 1 of index
   */
  rank(index) {
    // get the elment of the array bits, where the index is saved in
    let element = Math.floor(index / this.bitsPerElement);
    // if element is outside of bits array, set index to last index of BitVector
    if (element >= this.arrayLength) {
      index = this.arrayLength * this.bitsPerElement - 1;
    }
    // define result
    let result = 0;
    // foreach element in array before current element, add value of superblocks to result
    for (let j = 0; j < element; j++) {
      result += this.superblocks[j];
    }
    // foreach i in bits at element less or equal to index, get value and at to result
    for (let i = element * this.bitsPerElement; i <= index; i++) {
      if (this.getBit(i) === 1) {
        result += 1;
      }
    }

    return result;
  }

  /**
   * Get the select 1 of count in BitVector
   * @param {number} count
   * @returns {number} select 1 of count
   */
  select(count) {
    // check if count is valid
    if (count >= 0) {
      // check if count is equal to 0
      if (count === 0) {
        return 0;
      }
      // define element
      let element = 0;

      // check if count - superblock at element is greater than 0,
      // than decrease count by superblocks at element and increase element by 1
      while (count - this.superblocks[element] > 0) {
        count -= this.superblocks[element];
        element++;
      }

      // foreach index in bits starting by element, decrease count by value of index until count equals 0
      for (let index = this.bitsPerElement * element; index < this.toString().length; index++) {
        count -= this.getBit(index);
        if (count === 0) {
          return index;
        }
      }
    }
    return -1;
  }

  /**
   * add 0 Bit at index in BitVector (before current value at index)
   * @param {number} index
   */
  addBit(index) {
    // check if index is valid
    if (index < this.toString().length) {
      // get the elment of the array bits, where the index is saved in
      let element = Math.floor(index / this.bitsPerElement);

      // create shifted subpart of current element in bits
      // get the length to be shifted
      let length = this.bitsPerElement - 1 - (index % this.bitsPerElement);
      // create a mask, where 1 are at the indices to shift
      const mask = ((1 << length) - 1) << index % this.bitsPerElement;
      // get subpart of element of bits
      const subpart = (this.bits[element] & mask) >>> index % this.bitsPerElement;
      // left shift subpart by one
      const shiftedSubpart = subpart << 1;

      // save bit that is shifted to next element
      // shift the number this.bitsPerElement - 1 bits to the right to keep only the last bit
      let prelastbit = (this.bits[element] >> (this.bitsPerElement - 1)) & 1;

      // set shifted and not shifted parts together
      this.bits[element] = (this.bits[element] & ~mask) | (shiftedSubpart << index % this.bitsPerElement);

      // stop save if new element is already added to bits
      let stop = false;
      // foreach i in bits array do shifting
      for (let i = element + 1; i <= this.arrayLength; i++) {
        // check if i is not in array
        if (i === this.arrayLength) {
          //if no new element is already added to bits and the prelastbit equals 0, add new array element
          if (!stop && prelastbit > 0) {
            this.#addNewIntElement(this.arrayLength + 1);
            stop = true;
          } else {
            return;
          }
        }
        // check prelast, if 1 => edit superblocks
        if (prelastbit === 1) {
          this.superblocks[i] += 1;
          this.superblocks[i - 1] -= 1;
        }
        // save bit that is shifted to next element
        // shift the number this.bitsPerElement - 1 bits to the right to keep only the last bit
        let temp = (this.bits[i] >> (this.bitsPerElement - 1)) & 1;
        // set bits at i to shifted bits (left shift) plus prelastbit
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
    // check if index is valid
    if (index < this.toString().length) {
      // get the elment of the array bits, where the index is saved in
      let element = Math.floor(index / this.bitsPerElement);

      // get value of bit to be deleted and edit superblocks
      if (this.getBit(index) === 1) {
        this.superblocks[element] -= 1;
      }

      // create shifted subpart of current element in bits
      // get the length to be shifted
      let length = this.bitsPerElement - 1 - (index % this.bitsPerElement);
      // define mask
      let mask = 0;
      // if index is last saved 1
      if (
        element === this.arrayLength - 1 &&
        this.bits[element] < 2 ** this.bitsPerElement - 2 ** (this.bitsPerElement - 1)
      ) {
        // create a mask, where 1 are at the indices to shift
        mask = ((1 << length) - 1) << index % this.bitsPerElement;
      } else {
        // create a mask, where 1 are at the indices to shift
        mask = ((1 << length) - 1) << ((index % this.bitsPerElement) + 1);
      }
      // get subpart of element of bits
      const subpart = (this.bits[element] & mask) >>> index % this.bitsPerElement;
      // right shift subpart by one
      let shiftedSubpart = subpart >> 1;

      // define bit
      let bit = 0;
      // if element is not last element of bits,
      // get the first bit of next element and edit superblocks
      if (element < this.arrayLength - 1) {
        bit = this.bits[element + 1] & 1;
        this.superblocks[element] += bit;
        this.superblocks[element + 1] -= bit;
      }

      // define the count of shifting
      let shift = this.bitsPerElement - 1;
      // if element is last element of bits, edit shift
      if (element === this.arrayLength - 1) {
        // shift = length of last element -1
        shift = (index % this.bitsPerElement) - 1;
      }
      // shift the number "shift" bits to the right, add the not shifted part and add the first bit of the next element or 0
      this.bits[element] =
        (this.bits[element] & ~mask) | (shiftedSubpart << index % this.bitsPerElement) | (bit << shift);

      // foreach i in bits array do shifting
      for (let i = element + 1; i < this.arrayLength; i++) {
        // define nextfirstbit
        let nextfirstbit = 0;

        // check if i is not last element of array
        if (i !== this.arrayLength - 1) {
          // get first bit of next element
          nextfirstbit = this.bits[element + 1] & 1;

          if (nextfirstbit === 1) {
            // edit superblocks
            this.superblocks[i] += 1;
            this.superblocks[i + 1] -= 1;
          }
        }

        let shift = this.bitsPerElement - 1;
        // if element is last element of bits, edit shift
        if (i === this.arrayLength - 1) {
          // shift = length of last element -1
          shift = (index % this.bitsPerElement) - 1;
        }
        // shift the number "shift" bits to the right and add the first bit of the next element or 0
        this.bits[i] = (nextfirstbit << shift) | (this.bits[i] >> 1);
      }
      // delete all not used elements in bits array
      this.#deleteUnusedIntElements();
    }
  }

  /**
   * Add new element to bits array until newArrayLength is reached
   * @param {*} newArrayLength
   */
  #addNewIntElement(newArrayLength) {
    // define array
    let array = [];
    // add arrays from bits array
    for (let i = 0; i < this.arrayLength; i++) {
      array.push(this.bits[i]);
    }
    // add new elements until newArrayLength is reached
    for (this.arrayLength; this.arrayLength <= newArrayLength - 1; this.arrayLength++) {
      array.push(0);
      this.superblocks.push(0);
    }
    // set arrayLength
    this.arrayLength = newArrayLength;
    // set bits
    this.bits = new Uint32Array(array);
  }

  /**
   * Delete as much element in bits as not used at the end
   * @param {*} newArrayLength
   */
  #deleteUnusedIntElements() {
    let newArrayLength = this.arrayLength;
    // check if lat element of bits array is empty and not the first element
    while (this.bits[newArrayLength - 1] === 0 && newArrayLength > 1) {
      // delete element in superblocks
      this.superblocks.pop();
      // delete element in bits
      newArrayLength--;
    }

    // check if elements has to be removed
    if (newArrayLength < this.arrayLength) {
      // define array
      let array = [];
      // add element until index lower than newArrayLength
      for (let index = 0; index < newArrayLength; index++) {
        array.push(this.bits[index]);
      }
      // edit arrayLength
      this.arrayLength = newArrayLength;
      // set bits to new array
      this.bits = new Uint32Array(array);
    }
  }

  /**
   *  Printing bits as string. Used for debugging
   * @returns string of bits in BitVector ordered by index (left to right)
   */
  toString() {
    let bitString = "";
    for (let i = 0; i < this.arrayLength; i++) {
      let elementString = this.bits[i].toString(2);
      elementString = elementString.split("").reverse().join("");
      while (i < this.arrayLength - 1 && elementString.length < this.bitsPerElement) {
        elementString += "0";
      }
      bitString += elementString;
    }
    return bitString;
  }
}
