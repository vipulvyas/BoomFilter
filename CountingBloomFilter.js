const murmurhash = require('murmurhash');

class CountingBloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.countArray = new Array(size).fill(0);
  }

  _hash(value, seed) {
    return murmurhash.v3(value, seed) % this.size;
  }

  _getHashIndices(value) {
    const indices = [];
    for (let i = 0; i < this.numHashes; i++) {
      indices.push(this._hash(value, i));
    }
    return indices;
  }

  add(value) {
    const indices = this._getHashIndices(value);
    indices.forEach(index => {
      this.countArray[index]++;
    });
  }

  remove(value) {
    const indices = this._getHashIndices(value);
    indices.forEach(index => {
      if (this.countArray[index] > 0) {
        this.countArray[index]--;
      }
    });
  }

  contains(value) {
    const indices = this._getHashIndices(value);
    return indices.every(index => this.countArray[index] > 0);
  }
}

// Example usage
const filter = new CountingBloomFilter(100, 4);

// Add elements
filter.add('apple');
filter.add('banana');

// Check for existence
console.log(filter.contains('apple')); // true
console.log(filter.contains('banana')); // true
console.log(filter.contains('cherry')); // false

// Remove an element
filter.remove('banana');
console.log(filter.contains('banana')); // false
