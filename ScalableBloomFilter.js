const murmurhash = require('murmurhash');

class BloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.bitArray = new Array(size).fill(false);
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
      this.bitArray[index] = true;
    });
  }

  contains(value) {
    const indices = this._getHashIndices(value);
    return indices.every(index => this.bitArray[index]);
  }
}

class ScalableBloomFilter {
  constructor(initialSize, numHashes, growthFactor = 2, maxFalsePositiveRate = 0.01) {
    this.filters = [];
    this.growthFactor = growthFactor;
    this.maxFalsePositiveRate = maxFalsePositiveRate;
    this.numHashes = numHashes;
    this.currentFilterSize = initialSize;

    // Create the first filter
    this._addFilter();
  }

  _addFilter() {
    const filter = new BloomFilter(this.currentFilterSize, this.numHashes);
    this.filters.push(filter);
    this.currentFilterSize *= this.growthFactor;
  }

  add(value) {
    const lastFilter = this.filters[this.filters.length - 1];

    // Check if the last filter can handle the new element
    if (this._calculateFalsePositiveRate() > this.maxFalsePositiveRate) {
      this._addFilter();
    }

    lastFilter.add(value);
  }

  contains(value) {
    return this.filters.some(filter => filter.contains(value));
  }

  _calculateFalsePositiveRate() {
    // Approximating the false-positive rate of the last filter
    const n = this.filters.length;
    return Math.pow(1 - Math.exp(-this.numHashes / this.currentFilterSize), this.numHashes) * n;
  }
}

// Example usage
const scalableFilter = new ScalableBloomFilter(100, 4);

// Add elements
scalableFilter.add('apple');
scalableFilter.add('banana');

// Check for existence
console.log(scalableFilter.contains('apple')); // true
console.log(scalableFilter.contains('banana')); // true
console.log(scalableFilter.contains('cherry')); // false
