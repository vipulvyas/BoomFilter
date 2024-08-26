const murmurhash = require('murmurhash');

class BloomFilter {
    constructor(size = 100, hashFunctionsCount = 3) {
        this.size = size;
        this.hashFunctionsCount = hashFunctionsCount;
        this.bitArray = new Array(size).fill(0);
    }

    _hash(value, seed) {
        return murmurhash.v3(value, seed) % this.size;
    }

    add(value) {
        for (let i = 0; i < this.hashFunctionsCount; i++) {
            const position = this._hash(value, i);
            this.bitArray[position] = 1;
        }
    }

    mayContain(value) {
        for (let i = 0; i < this.hashFunctionsCount; i++) {
            const position = this._hash(value, i);
            if (this.bitArray[position] === 0) {
                return false;
            }
        }
        return true;
    }
}

const bloomFilter = new BloomFilter(100, 3);

bloomFilter.add('apple');
bloomFilter.add('banana');
bloomFilter.add('orange');

console.log(bloomFilter.mayContain('apple'));  // true
console.log(bloomFilter.mayContain('banana')); // true
console.log(bloomFilter.mayContain('grape'));  // false
console.log(bloomFilter.mayContain('orange')); // true
