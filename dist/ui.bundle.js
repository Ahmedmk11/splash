(self["webpackChunksplash"] = self["webpackChunksplash"] || []).push([["ui"],{

/***/ "./node_modules/@datastructures-js/heap/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@datastructures-js/heap/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { Heap } = __webpack_require__(/*! ./src/heap */ "./node_modules/@datastructures-js/heap/src/heap.js");
const { MinHeap } = __webpack_require__(/*! ./src/minHeap */ "./node_modules/@datastructures-js/heap/src/minHeap.js");
const { MaxHeap } = __webpack_require__(/*! ./src/maxHeap */ "./node_modules/@datastructures-js/heap/src/maxHeap.js");

exports.Heap = Heap;
exports.MinHeap = MinHeap;
exports.MaxHeap = MaxHeap;


/***/ }),

/***/ "./node_modules/@datastructures-js/heap/src/heap.js":
/*!**********************************************************!*\
  !*** ./node_modules/@datastructures-js/heap/src/heap.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 *
 * @class
 */
class Heap {
  /**
   * @param {function} compare
   * @param {array} [_values]
   * @param {number|string|object} [_leaf]
   */
  constructor(compare, _values, _leaf) {
    if (typeof compare !== 'function') {
      throw new Error('Heap constructor expects a compare function');
    }
    this._compare = compare;
    this._nodes = Array.isArray(_values) ? _values : [];
    this._leaf = _leaf || null;
  }

  /**
   * Converts the heap to a cloned array without sorting.
   * @public
   * @returns {Array}
   */
  toArray() {
    return Array.from(this._nodes);
  }

  /**
   * Checks if a parent has a left child
   * @private
   */
  _hasLeftChild(parentIndex) {
    const leftChildIndex = (parentIndex * 2) + 1;
    return leftChildIndex < this.size();
  }

  /**
   * Checks if a parent has a right child
   * @private
   */
  _hasRightChild(parentIndex) {
    const rightChildIndex = (parentIndex * 2) + 2;
    return rightChildIndex < this.size();
  }

  /**
   * Compares two nodes
   * @private
   */
  _compareAt(i, j) {
    return this._compare(this._nodes[i], this._nodes[j]);
  }

  /**
   * Swaps two nodes in the heap
   * @private
   */
  _swap(i, j) {
    const temp = this._nodes[i];
    this._nodes[i] = this._nodes[j];
    this._nodes[j] = temp;
  }

  /**
   * Checks if parent and child should be swapped
   * @private
   */
  _shouldSwap(parentIndex, childIndex) {
    if (parentIndex < 0 || parentIndex >= this.size()) {
      return false;
    }

    if (childIndex < 0 || childIndex >= this.size()) {
      return false;
    }

    return this._compareAt(parentIndex, childIndex) > 0;
  }

  /**
   * Compares children of a parent
   * @private
   */
  _compareChildrenOf(parentIndex) {
    if (!this._hasLeftChild(parentIndex) && !this._hasRightChild(parentIndex)) {
      return -1;
    }

    const leftChildIndex = (parentIndex * 2) + 1;
    const rightChildIndex = (parentIndex * 2) + 2;

    if (!this._hasLeftChild(parentIndex)) {
      return rightChildIndex;
    }

    if (!this._hasRightChild(parentIndex)) {
      return leftChildIndex;
    }

    const compare = this._compareAt(leftChildIndex, rightChildIndex);
    return compare > 0 ? rightChildIndex : leftChildIndex;
  }

  /**
   * Compares two children before a position
   * @private
   */
  _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
    const compare = this._compareAt(rightChildIndex, leftChildIndex);

    if (compare <= 0 && rightChildIndex < index) {
      return rightChildIndex;
    }

    return leftChildIndex;
  }

  /**
   * Recursively bubbles up a node if it's in a wrong position
   * @private
   */
  _heapifyUp(startIndex) {
    let childIndex = startIndex;
    let parentIndex = Math.floor((childIndex - 1) / 2);

    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      childIndex = parentIndex;
      parentIndex = Math.floor((childIndex - 1) / 2);
    }
  }

  /**
   * Recursively bubbles down a node if it's in a wrong position
   * @private
   */
  _heapifyDown(startIndex) {
    let parentIndex = startIndex;
    let childIndex = this._compareChildrenOf(parentIndex);

    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      parentIndex = childIndex;
      childIndex = this._compareChildrenOf(parentIndex);
    }
  }

  /**
   * Recursively bubbles down a node before a given index
   * @private
   */
  _heapifyDownUntil(index) {
    let parentIndex = 0;
    let leftChildIndex = 1;
    let rightChildIndex = 2;
    let childIndex;

    while (leftChildIndex < index) {
      childIndex = this._compareChildrenBefore(
        index,
        leftChildIndex,
        rightChildIndex
      );

      if (this._shouldSwap(parentIndex, childIndex)) {
        this._swap(parentIndex, childIndex);
      }

      parentIndex = childIndex;
      leftChildIndex = (parentIndex * 2) + 1;
      rightChildIndex = (parentIndex * 2) + 2;
    }
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {Heap}
   */
  insert(value) {
    this._nodes.push(value);
    this._heapifyUp(this.size() - 1);
    if (this._leaf === null || this._compare(value, this._leaf) > 0) {
      this._leaf = value;
    }
    return this;
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {Heap}
   */
  push(value) {
    return this.insert(value);
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  extractRoot() {
    if (this.isEmpty()) {
      return null;
    }

    const root = this.root();
    this._nodes[0] = this._nodes[this.size() - 1];
    this._nodes.pop();
    this._heapifyDown(0);

    if (root === this._leaf) {
      this._leaf = this.root();
    }

    return root;
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.extractRoot();
  }

  /**
   * Applies heap sort and return the values sorted by priority
   * @public
   * @returns {array}
   */
  sort() {
    for (let i = this.size() - 1; i > 0; i -= 1) {
      this._swap(0, i);
      this._heapifyDownUntil(i);
    }
    return this._nodes;
  }

  /**
   * Fixes node positions in the heap
   * @public
   * @returns {Heap}
   */
  fix() {
    // fix node positions
    for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i -= 1) {
      this._heapifyDown(i);
    }

    // fix leaf value
    for (let i = Math.floor(this.size() / 2); i < this.size(); i += 1) {
      const value = this._nodes[i];
      if (this._leaf === null || this._compare(value, this._leaf) > 0) {
        this._leaf = value;
      }
    }

    return this;
  }

  /**
   * Verifies that all heap nodes are in the right position
   * @public
   * @returns {boolean}
   */
  isValid() {
    const isValidRecursive = (parentIndex) => {
      let isValidLeft = true;
      let isValidRight = true;

      if (this._hasLeftChild(parentIndex)) {
        const leftChildIndex = (parentIndex * 2) + 1;
        if (this._compareAt(parentIndex, leftChildIndex) > 0) {
          return false;
        }
        isValidLeft = isValidRecursive(leftChildIndex);
      }

      if (this._hasRightChild(parentIndex)) {
        const rightChildIndex = (parentIndex * 2) + 2;
        if (this._compareAt(parentIndex, rightChildIndex) > 0) {
          return false;
        }
        isValidRight = isValidRecursive(rightChildIndex);
      }

      return isValidLeft && isValidRight;
    };

    return isValidRecursive(0);
  }

  /**
   * Returns a shallow copy of the heap
   * @public
   * @returns {Heap}
   */
  clone() {
    return new Heap(this._compare, this._nodes.slice(), this._leaf);
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  root() {
    if (this.isEmpty()) {
      return null;
    }

    return this._nodes[0];
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  top() {
    return this.root();
  }

  /**
   * Returns a leaf node in the heap
   * @public
   * @returns {number|string|object}
   */
  leaf() {
    return this._leaf;
  }

  /**
   * Returns the number of nodes in the heap
   * @public
   * @returns {number}
   */
  size() {
    return this._nodes.length;
  }

  /**
   * Checks if the heap is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * Clears the heap
   * @public
   */
  clear() {
    this._nodes = [];
    this._leaf = null;
  }

  /**
   * Implements an iterable on the heap
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Builds a heap from a array of values
   * @public
   * @static
   * @param {array} values
   * @param {function} compare
   * @returns {Heap}
   */
  static heapify(values, compare) {
    if (!Array.isArray(values)) {
      throw new Error('Heap.heapify expects an array of values');
    }

    if (typeof compare !== 'function') {
      throw new Error('Heap.heapify expects a compare function');
    }

    return new Heap(compare, values).fix();
  }

  /**
   * Checks if a list of values is a valid heap
   * @public
   * @static
   * @param {array} values
   * @param {function} compare
   * @returns {boolean}
   */
  static isHeapified(values, compare) {
    return new Heap(compare, values).isValid();
  }
}

exports.Heap = Heap;


/***/ }),

/***/ "./node_modules/@datastructures-js/heap/src/maxHeap.js":
/*!*************************************************************!*\
  !*** ./node_modules/@datastructures-js/heap/src/maxHeap.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 */

const { Heap } = __webpack_require__(/*! ./heap */ "./node_modules/@datastructures-js/heap/src/heap.js");

const getMaxCompare = (getCompareValue) => (a, b) => {
  const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
  const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
  return aVal < bVal ? 1 : -1;
};

/**
 * @class MaxHeap
 * @extends Heap
 */
class MaxHeap {
  /**
   * @param {function} [getCompareValue]
   * @param {Heap} [_heap]
   */
  constructor(getCompareValue, _heap) {
    this._getCompareValue = getCompareValue;
    this._heap = _heap || new Heap(getMaxCompare(getCompareValue));
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {MaxHeap}
   */
  insert(value) {
    return this._heap.insert(value);
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {Heap}
   */
  push(value) {
    return this.insert(value);
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  extractRoot() {
    return this._heap.extractRoot();
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.extractRoot();
  }

  /**
   * Applies heap sort and return the values sorted by priority
   * @public
   * @returns {array}
   */
  sort() {
    return this._heap.sort();
  }

  /**
   * Converts the heap to a cloned array without sorting.
   * @public
   * @returns {Array}
   */
  toArray() {
    return Array.from(this._heap._nodes);
  }

  /**
   * Fixes node positions in the heap
   * @public
   * @returns {MaxHeap}
   */
  fix() {
    return this._heap.fix();
  }

  /**
   * Verifies that all heap nodes are in the right position
   * @public
   * @returns {boolean}
   */
  isValid() {
    return this._heap.isValid();
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  root() {
    return this._heap.root();
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  top() {
    return this.root();
  }

  /**
   * Returns a leaf node in the heap
   * @public
   * @returns {number|string|object}
   */
  leaf() {
    return this._heap.leaf();
  }

  /**
   * Returns the number of nodes in the heap
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * Checks if the heap is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Clears the heap
   * @public
   */
  clear() {
    this._heap.clear();
  }

  /**
   * Returns a shallow copy of the MaxHeap
   * @public
   * @returns {MaxHeap}
   */
  clone() {
    return new MaxHeap(this._getCompareValue, this._heap.clone());
  }

  /**
   * Implements an iterable on the heap
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Builds a MaxHeap from an array
   * @public
   * @static
   * @param {array} values
   * @param {function} [getCompareValue]
   * @returns {MaxHeap}
   */
  static heapify(values, getCompareValue) {
    if (!Array.isArray(values)) {
      throw new Error('MaxHeap.heapify expects an array');
    }
    const heap = new Heap(getMaxCompare(getCompareValue), values);
    return new MaxHeap(getCompareValue, heap).fix();
  }

  /**
   * Checks if a list of values is a valid max heap
   * @public
   * @static
   * @param {array} values
   * @param {function} [getCompareValue]
   * @returns {boolean}
   */
  static isHeapified(values, getCompareValue) {
    const heap = new Heap(getMaxCompare(getCompareValue), values);
    return new MaxHeap(getCompareValue, heap).isValid();
  }
}

exports.MaxHeap = MaxHeap;


/***/ }),

/***/ "./node_modules/@datastructures-js/heap/src/minHeap.js":
/*!*************************************************************!*\
  !*** ./node_modules/@datastructures-js/heap/src/minHeap.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 */

const { Heap } = __webpack_require__(/*! ./heap */ "./node_modules/@datastructures-js/heap/src/heap.js");

const getMinCompare = (getCompareValue) => (a, b) => {
  const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
  const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
  return aVal < bVal ? -1 : 1;
};

/**
 * @class MinHeap
 * @extends Heap
 */
class MinHeap {
  /**
   * @param {function} [getCompareValue]
   * @param {Heap} [_heap]
   */
  constructor(getCompareValue, _heap) {
    this._getCompareValue = getCompareValue;
    this._heap = _heap || new Heap(getMinCompare(getCompareValue));
  }

  /**
   * Converts the heap to a cloned array without sorting.
   * @public
   * @returns {Array}
   */
  toArray() {
    return Array.from(this._heap._nodes);
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {MinHeap}
   */
  insert(value) {
    return this._heap.insert(value);
  }

  /**
   * Inserts a new value into the heap
   * @public
   * @param {number|string|object} value
   * @returns {Heap}
   */
  push(value) {
    return this.insert(value);
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  extractRoot() {
    return this._heap.extractRoot();
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.extractRoot();
  }

  /**
   * Applies heap sort and return the values sorted by priority
   * @public
   * @returns {array}
   */
  sort() {
    return this._heap.sort();
  }

  /**
   * Fixes node positions in the heap
   * @public
   * @returns {MinHeap}
   */
  fix() {
    return this._heap.fix();
  }

  /**
   * Verifies that all heap nodes are in the right position
   * @public
   * @returns {boolean}
   */
  isValid() {
    return this._heap.isValid();
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  root() {
    return this._heap.root();
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {number|string|object}
   */
  top() {
    return this.root();
  }

  /**
   * Returns a leaf node in the heap
   * @public
   * @returns {number|string|object}
   */
  leaf() {
    return this._heap.leaf();
  }

  /**
   * Returns the number of nodes in the heap
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * Checks if the heap is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Clears the heap
   * @public
   */
  clear() {
    this._heap.clear();
  }

  /**
   * Returns a shallow copy of the MinHeap
   * @public
   * @returns {MinHeap}
   */
  clone() {
    return new MinHeap(this._getCompareValue, this._heap.clone());
  }

  /**
   * Implements an iterable on the heap
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Builds a MinHeap from an array
   * @public
   * @static
   * @param {array} values
   * @param {function} [getCompareValue]
   * @returns {MinHeap}
   */
  static heapify(values, getCompareValue) {
    if (!Array.isArray(values)) {
      throw new Error('MinHeap.heapify expects an array');
    }
    const heap = new Heap(getMinCompare(getCompareValue), values);
    return new MinHeap(getCompareValue, heap).fix();
  }

  /**
   * Checks if a list of values is a valid min heap
   * @public
   * @static
   * @param {array} values
   * @param {function} [getCompareValue]
   * @returns {boolean}
   */
  static isHeapified(values, getCompareValue) {
    const heap = new Heap(getMinCompare(getCompareValue), values);
    return new MinHeap(getCompareValue, heap).isValid();
  }
}

exports.MinHeap = MinHeap;


/***/ }),

/***/ "./node_modules/@datastructures-js/priority-queue/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@datastructures-js/priority-queue/index.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { MinPriorityQueue } = __webpack_require__(/*! ./src/minPriorityQueue */ "./node_modules/@datastructures-js/priority-queue/src/minPriorityQueue.js");
const { MaxPriorityQueue } = __webpack_require__(/*! ./src/maxPriorityQueue */ "./node_modules/@datastructures-js/priority-queue/src/maxPriorityQueue.js");
const { PriorityQueue } = __webpack_require__(/*! ./src/priorityQueue */ "./node_modules/@datastructures-js/priority-queue/src/priorityQueue.js")

module.exports = { MinPriorityQueue, MaxPriorityQueue, PriorityQueue };


/***/ }),

/***/ "./node_modules/@datastructures-js/priority-queue/src/maxPriorityQueue.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@datastructures-js/priority-queue/src/maxPriorityQueue.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { Heap, MaxHeap } = __webpack_require__(/*! @datastructures-js/heap */ "./node_modules/@datastructures-js/heap/index.js");

const getMaxCompare = (getCompareValue) => (a, b) => {
  const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
  const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
  return aVal < bVal ? 1 : -1;
};

/**
 * @class MaxPriorityQueue
 * @extends MaxHeap
 */
class MaxPriorityQueue {
  constructor(getCompareValue, _heap) {
    if (getCompareValue && typeof getCompareValue !== 'function') {
      throw new Error('MaxPriorityQueue constructor requires a callback for object values');
    }
    this._heap = _heap || new MaxHeap(getCompareValue);
  }

  /**
   * Returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  front() {
    return this._heap.root();
  }

  /**
   * Returns an element with lowest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  back() {
    return this._heap.leaf();
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {MaxPriorityQueue}
   */
  enqueue(value) {
    return this._heap.insert(value);
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {MaxPriorityQueue}
   */
  push(value) {
    return this.enqueue(value);
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  dequeue() {
    return this._heap.extractRoot();
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.dequeue();
  }

  /**
   * Returns the number of elements in the queue
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * Checks if the queue is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Clears the queue
   * @public
   */
  clear() {
    this._heap.clear();
  }

  /**
   * Returns a sorted list of elements from highest to lowest priority
   * @public
   * @returns {array}
   */
  toArray() {
    return this._heap.clone().sort().reverse();
  }

  /**
   * Implements an iterable on the min priority queue
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Creates a priority queue from an existing array
   * @public
   * @static
   * @returns {MaxPriorityQueue}
   */
  static fromArray(values, getCompareValue) {
    const heap = new Heap(getMaxCompare(getCompareValue), values);
    return new MaxPriorityQueue(
      getCompareValue,
      new MaxHeap(getCompareValue, heap).fix()
    );
  }
}

exports.MaxPriorityQueue = MaxPriorityQueue;


/***/ }),

/***/ "./node_modules/@datastructures-js/priority-queue/src/minPriorityQueue.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@datastructures-js/priority-queue/src/minPriorityQueue.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { Heap, MinHeap } = __webpack_require__(/*! @datastructures-js/heap */ "./node_modules/@datastructures-js/heap/index.js");

const getMinCompare = (getCompareValue) => (a, b) => {
  const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
  const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
  return aVal < bVal ? -1 : 1;
};

/**
 * @class MinPriorityQueue
 */
class MinPriorityQueue {
  constructor(getCompareValue, _heap) {
    if (getCompareValue && typeof getCompareValue !== 'function') {
      throw new Error('MinPriorityQueue constructor requires a callback for object values');
    }
    this._heap = _heap || new MinHeap(getCompareValue);
  }

  /**
   * Returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  front() {
    return this._heap.root();
  }

  /**
   * Returns an element with lowest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  back() {
    return this._heap.leaf();
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {MinPriorityQueue}
   */
  enqueue(value) {
    return this._heap.insert(value);
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {MinPriorityQueue}
   */
  push(value) {
    return this.enqueue(value);
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  dequeue() {
    return this._heap.extractRoot();
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.dequeue();
  }

  /**
   * Returns the number of elements in the queue
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * Checks if the queue is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Clears the queue
   * @public
   */
  clear() {
    this._heap.clear();
  }

  /**
   * Returns a sorted list of elements from highest to lowest priority
   * @public
   * @returns {array}
   */
  toArray() {
    return this._heap.clone().sort().reverse();
  }

  /**
   * Implements an iterable on the min priority queue
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Creates a priority queue from an existing array
   * @public
   * @static
   * @returns {MinPriorityQueue}
   */
  static fromArray(values, getCompareValue) {
    const heap = new Heap(getMinCompare(getCompareValue), values);
    return new MinPriorityQueue(
      getCompareValue,
      new MinHeap(getCompareValue, heap).fix()
    );
  }
}

exports.MinPriorityQueue = MinPriorityQueue;


/***/ }),

/***/ "./node_modules/@datastructures-js/priority-queue/src/priorityQueue.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@datastructures-js/priority-queue/src/priorityQueue.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { Heap } = __webpack_require__(/*! @datastructures-js/heap */ "./node_modules/@datastructures-js/heap/index.js");

/**
 * @class PriorityQueue
 */
class PriorityQueue {
  /**
   * Creates a priority queue
   * @params {function} compare
   */
  constructor(compare, _values) {
    if (typeof compare !== 'function') {
      throw new Error('PriorityQueue constructor expects a compare function');
    }
    this._heap = new Heap(compare, _values);
    if (_values) {
      this._heap.fix();
    }
  }

  /**
   * Returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  front() {
    return this._heap.root();
  }

  /**
   * Returns an element with lowest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  back() {
    return this._heap.leaf();
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {PriorityQueue}
   */
  enqueue(value) {
    return this._heap.insert(value);
  }

  /**
   * Adds a value to the queue
   * @public
   * @param {number|string|object} value
   * @returns {PriorityQueue}
   */
  push(value) {
    return this.enqueue(value);
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  dequeue() {
    return this._heap.extractRoot();
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {number|string|object}
   */
  pop() {
    return this.dequeue();
  }

  /**
   * Returns the number of elements in the queue
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * Checks if the queue is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Clears the queue
   * @public
   */
  clear() {
    this._heap.clear();
  }

  /**
   * Returns a sorted list of elements from highest to lowest priority
   * @public
   * @returns {array}
   */
  toArray() {
    return this._heap.clone().sort().reverse();
  }

  /**
   * Implements an iterable on the priority queue
   * @public
   */
  [Symbol.iterator]() {
    let size = this.size();
    return {
      next: () => {
        size -= 1;
        return {
          value: this.pop(),
          done: size === -1
        };
      }
    };
  }

  /**
   * Creates a priority queue from an existing array
   * @public
   * @static
   * @returns {PriorityQueue}
   */
  static fromArray(values, compare) {
    return new PriorityQueue(compare, values);
  }
}

exports.PriorityQueue = PriorityQueue;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/style.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/icons/srch.svg */ "./src/assets/images/icons/srch.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body.en {\n    --flex-row-direction: row;\n    --flex-s-e: flex-start;\n    --pos-icon: 98%;\n    --direction: ltr;\n    --slide: 100%;\n    --text-align: left;\n}\n\nbody.ar {\n    --flex-row-direction: row-reverse;\n    --flex-s-e: flex-end;\n    --pos-icon: 2%;\n    --direction: rtl;\n    --slide: -100%;\n    --text-align: right;\n}\n\nhtml,\nbody {\n    height: 100%;\n    min-height: fit-content;\n    width: 100%;\n    padding: 0%;\n    margin: 0%;\n    --light-color: #dfe3e8;\n}\n\nbody {\n    font-family: Arial, Helvetica, sans-serif;\n    background-color: white;\n    display: flex;\n    flex-direction: column;\n}\nbody img {\n    user-select: none;\n}\n\nimg:hover:after {\n    content: attr(data);\n    padding: 4px 8px;\n    border: 1px black solid;\n    color: rgba(0, 0, 0, 0.5);\n    position: absolute;\n    left: 0;\n    top: 100%;\n    white-space: nowrap;\n    z-index: 2;\n    background: rgba(0, 0, 0, 0.5);\n}\n\n.fade {\n    animation-name: fade;\n    animation-duration: 1.5s;\n}\n\n.zoom {\n    filter: blur(20px);\n    -webkit-filter: blur(10px);\n}\n\n.zoomed-container {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    -webkit-transform: translate(-50%, -50%);\n    -moz-transform: translate(-50%, -50%);\n    -ms-transform: translate(-50%, -50%);\n    -o-transform: translate(-50%, -50%);\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n}\n\n.zoomed-in {\n    position: relative;\n    max-height: 500px;\n    width: auto;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    -webkit-transform: translate(-50%, -50%);\n    -moz-transform: translate(-50%, -50%);\n    -ms-transform: translate(-50%, -50%);\n    -o-transform: translate(-50%, -50%);\n}\n\n.supdiv {\n    display: block !important;\n    width: fit-content !important;\n}\n\n#dots {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n}\n\n.astr {\n    margin: 0%;\n    padding: 0%;\n    color: red;\n}\n\n#success-message {\n    width: 60%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-around;\n    background-color: var(--light-color);\n    direction: var(--direction);\n    padding: 1em;\n    margin-top: 0%;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n#success-message button {\n    background-color: #111827;\n    border: 1px solid transparent;\n    border-radius: 0.75rem;\n    box-sizing: border-box;\n    color: #ffffff;\n    cursor: pointer;\n    flex: 0 0 auto;\n    font-size: 1.125rem;\n    font-weight: 600;\n    line-height: 1.5rem;\n    padding: 0.75rem 1.2rem;\n    text-align: center;\n    text-decoration: none #6b7280 solid;\n    text-decoration-thickness: auto;\n    transition-duration: 0.2s;\n    transition-property: background-color, border-color, color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    user-select: none;\n    -webkit-user-select: none;\n    touch-action: manipulation;\n    width: fit-content;\n}\n#success-message button:hover {\n    background-color: #374151;\n}\n#success-message button:focus {\n    box-shadow: none;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n}\n#success-message p {\n    font-weight: 500;\n    font-size: 18px;\n}\n\n#order-main {\n    width: 60%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-around;\n    background-color: var(--light-color);\n    direction: var(--direction);\n    padding: 1em;\n    margin-top: 0%;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n#order-main button {\n    background-color: #111827;\n    border: 1px solid transparent;\n    border-radius: 0.75rem;\n    box-sizing: border-box;\n    color: #ffffff;\n    cursor: pointer;\n    flex: 0 0 auto;\n    font-size: 1.125rem;\n    font-weight: 600;\n    line-height: 1.5rem;\n    padding: 0.75rem 1.2rem;\n    text-align: center;\n    text-decoration: none #6b7280 solid;\n    text-decoration-thickness: auto;\n    transition-duration: 0.2s;\n    transition-property: background-color, border-color, color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    user-select: none;\n    -webkit-user-select: none;\n    touch-action: manipulation;\n    width: fit-content;\n}\n#order-main button:hover {\n    background-color: #374151;\n}\n#order-main button:focus {\n    box-shadow: none;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n}\n#order-main #order-address-cont {\n    width: 75%;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    font-weight: 600;\n    font-size: 20px;\n}\n#order-main #order-address-cont p {\n    direction: var(--direction);\n    text-align: center;\n    height: fit-content;\n    margin: 10px;\n}\n#order-main #order-price-cont {\n    width: 75%;\n    height: 160px;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    font-size: 20px;\n    font-weight: 600;\n}\n#order-main #order-price-cont p {\n    margin: 5px;\n}\n#order-main #order-price-cont p:first-child {\n    border: #111827 2px solid;\n    padding: 5px;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n#order-main #order-price-cont #gray-text {\n    font-size: 14px;\n    color: gray;\n}\n\nform {\n    background-color: var(--light-color);\n    width: 60vw;\n    height: 80vh;\n    display: flex;\n    padding: 1em;\n    border-radius: 20px;\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n    position: fixed;\n    -webkit-border-radius: 20px;\n    -moz-border-radius: 20px;\n    -ms-border-radius: 20px;\n    -o-border-radius: 20px;\n    z-index: 1001;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\nform label {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n    direction: var(--direction);\n}\nform div {\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    justify-content: space-around;\n    align-items: center;\n    width: 100%;\n    height: 25%;\n}\nform #x3 {\n    user-select: none;\n    margin-right: auto;\n    padding: 0%;\n}\nform #x3:hover {\n    cursor: pointer;\n}\nform label {\n    font-size: 1.2rem;\n    font-weight: 900;\n}\nform .three label,\nform .three input {\n    width: 25%;\n    text-align: center;\n}\nform .two label,\nform .two input {\n    width: 35%;\n    text-align: center;\n}\nform input {\n    height: 24px;\n    width: 100%;\n    padding: 5px;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n    border: black 2px solid;\n}\nform button {\n    background-color: #111827;\n    border: 1px solid transparent;\n    border-radius: 0.75rem;\n    box-sizing: border-box;\n    color: #ffffff;\n    cursor: pointer;\n    flex: 0 0 auto;\n    font-size: 1.125rem;\n    font-weight: 600;\n    line-height: 1.5rem;\n    padding: 0.75rem 1.2rem;\n    text-align: center;\n    text-decoration: none #6b7280 solid;\n    text-decoration-thickness: auto;\n    transition-duration: 0.2s;\n    transition-property: background-color, border-color, color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    user-select: none;\n    -webkit-user-select: none;\n    touch-action: manipulation;\n    width: 200px;\n}\nform button:hover {\n    background-color: #374151;\n}\nform button:focus {\n    box-shadow: none;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n}\n\ninput::placeholder {\n    font-size: 0.71rem;\n}\n\n.x2 {\n    position: absolute;\n    top: 5%;\n    left: 5%;\n}\n\n.x2:hover {\n    cursor: pointer;\n}\n\n.popup {\n    filter: blur(20px);\n    -webkit-filter: blur(20px);\n}\n\n@keyframes fade {\n    from {\n        opacity: 0.4;\n    }\n    to {\n        opacity: 1;\n    }\n}\n.u {\n    cursor: default !important;\n}\n\n#container2 {\n    display: flex;\n    flex-direction: column;\n    height: fit-content;\n    width: 100%;\n    justify-content: center;\n    align-items: center;\n}\n\n#recommendations-container {\n    width: 92%;\n    height: fit-content;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-around;\n}\n#recommendations-container #prev-img,\n#recommendations-container #next-img {\n    border-radius: 50%;\n    -webkit-border-radius: 50%;\n    -moz-border-radius: 50%;\n    -ms-border-radius: 50%;\n    -o-border-radius: 50%;\n    touch-action: manipulation;\n}\n#recommendations-container #prev-img:hover,\n#recommendations-container #next-img:hover {\n    cursor: pointer;\n}\n#recommendations-container #recommendations {\n    height: 42vh;\n    padding: 0px 25px 0px 25px;\n    width: 68vw;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 1em;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n    overflow: hidden;\n}\n#recommendations-container #recommendations .item {\n    padding: 5px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-between;\n    background-color: var(--light-color);\n    max-width: 200px;\n    height: 250px;\n    border-radius: 15px;\n    -webkit-border-radius: 15px;\n    -moz-border-radius: 15px;\n    -ms-border-radius: 15px;\n    -o-border-radius: 15px;\n}\n#recommendations-container #recommendations .item div {\n    font-size: 16px !important;\n}\n#recommendations-container #recommendations .item img {\n    max-width: 180px;\n    max-height: 120px;\n}\n#recommendations-container #recommendations .item button {\n    display: none;\n}\n\n#main-container {\n    min-height: fit-content;\n}\n\n#header {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 100%;\n    height: max-content;\n    justify-content: center;\n    background-color: #0d4d79;\n    box-shadow: 0px 3px 10px black;\n    position: sticky;\n    top: 0;\n    z-index: 1000;\n}\n\n#header-upper {\n    width: 100%;\n    min-height: fit-content;\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n}\n\n#menu.slide {\n    transform: translate(var(--slide));\n    -webkit-transform: translate(var(--slide));\n    -moz-transform: translate(var(--slide));\n    -ms-transform: translate(var(--slide));\n    -o-transform: translate(var(--slide));\n}\n\n.ens {\n    left: 0 !important;\n}\n\n.ars {\n    right: 0 !important;\n}\n\n.empty-cart-main {\n    align-items: center;\n}\n\n#cart-empty {\n    font-size: 26px !important;\n    direction: var(--direction);\n}\n\n#cart-main {\n    padding: 1em;\n    margin-top: 0%;\n    width: 60%;\n    height: fit-content;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    background-color: var(--light-color);\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n#cart-main button {\n    background-color: #111827;\n    border: 1px solid transparent;\n    border-radius: 0.75rem;\n    box-sizing: border-box;\n    color: #ffffff;\n    cursor: pointer;\n    flex: 0 0 auto;\n    font-size: 1.125rem;\n    font-weight: 600;\n    line-height: 1.5rem;\n    padding: 0.75rem 1.2rem;\n    text-align: center;\n    text-decoration: none #6b7280 solid;\n    text-decoration-thickness: auto;\n    transition-duration: 0.2s;\n    transition-property: background-color, border-color, color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    user-select: none;\n    -webkit-user-select: none;\n    touch-action: manipulation;\n    width: auto;\n}\n#cart-main button:hover {\n    background-color: #374151;\n}\n#cart-main button:focus {\n    box-shadow: none;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n}\n#cart-main #cart-header {\n    width: 100%;\n    font-size: 20px;\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    justify-content: space-between;\n    align-items: center;\n}\n#cart-main #cart-header p {\n    margin: 0%;\n    padding: 0%;\n    text-align: var(--text-align);\n}\n#cart-main #cart-header .tit {\n    width: 75%;\n}\n#cart-main #cart-header .qph {\n    width: 25%;\n}\n#cart-main #cart-mid {\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: stretch;\n}\n#cart-main #cart-mid .cart-item {\n    direction: var(--direction);\n    width: 100%;\n    height: 150px;\n    display: flex;\n    flex-direction: row;\n    background-color: var(--light-color);\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n#cart-main #cart-mid .cart-item img:hover {\n    cursor: pointer;\n}\n#cart-main #cart-mid .cart-item .cart-item-img {\n    max-width: 100px;\n    max-height: 100px;\n}\n#cart-main #cart-mid .cart-item p {\n    text-align: var(--text-align);\n    margin: 0%;\n    padding: 0%;\n}\n#cart-main #cart-mid .cart-item .qp {\n    width: 25%;\n    line-height: 150px;\n}\n#cart-main #cart-mid .cart-item span {\n    width: 75%;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-evenly;\n    align-items: center;\n    margin: 0%;\n    padding: 0%;\n}\n#cart-main #cart-mid .cart-item span p {\n    width: 50%;\n    text-align: var(--text-align);\n    margin: 5px;\n    overflow-wrap: break-word;\n    direction: var(--direction);\n}\n#cart-main #cart-mid .cart-item div {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n#cart-main #cart-mid .cart-item div img {\n    height: 20px;\n}\n#cart-main #cart-footer {\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n    direction: var(--direction);\n    justify-content: space-between;\n    align-items: center;\n}\n#cart-main #cart-footer #cart-total-price {\n    width: fit-content;\n    margin: 0%;\n    background-color: #fff;\n    padding: 4px 10px 4px 10px;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n}\n\n.hlc {\n    width: 100%;\n    border: 0px;\n    height: 1px;\n    background-image: linear-gradient(\n        to right,\n        rgba(0, 0, 0, 0),\n        rgba(0, 0, 0, 0.75),\n        rgba(0, 0, 0, 0)\n    );\n}\n\n#menu {\n    width: 0%;\n    height: 100%;\n    background-color: #fff;\n    position: fixed;\n    z-index: 1001;\n    top: 0;\n    overflow-x: hidden;\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    align-items: flex-start;\n    justify-content: space-between;\n    transition: 0.5s;\n    -webkit-transition: 0.5s;\n    -moz-transition: 0.5s;\n    -ms-transition: 0.5s;\n    -o-transition: 0.5s;\n}\n#menu img {\n    margin: 30px;\n}\n#menu img:hover {\n    cursor: pointer;\n}\n#menu div {\n    align-self: center;\n    height: 80%;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: var(--flex-s-e);\n}\n#menu p {\n    font-size: 24px;\n    text-decoration: underline;\n    padding: 0px 10px 0px 10px;\n    color: #000;\n    white-space: nowrap;\n    margin: 8px;\n}\n#menu p:hover {\n    cursor: pointer;\n}\n\n.selected-p {\n    color: black !important;\n    font-weight: 900 !important;\n}\n\n#logo-img {\n    width: 25%;\n    min-width: 340px;\n    justify-self: flex-start;\n    cursor: pointer;\n}\n\nfooter {\n    font-family: Arial, Helvetica, sans-serif;\n    background-color: #0d4d79;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    height: 60px;\n}\nfooter p {\n    margin: 0.4em;\n    color: white;\n}\nfooter p a:visited {\n    color: white;\n}\nfooter p a:hover {\n    color: white;\n}\n\n.ttpopup {\n    position: relative;\n    z-index: 0;\n    display: inline-block;\n    cursor: pointer;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    direction: var(--direction);\n}\n\n.ttpopup .popuptext {\n    visibility: hidden;\n    width: 160px;\n    background-color: #555;\n    color: #fff;\n    text-align: center;\n    border-radius: 6px;\n    padding: 8px 0;\n    position: absolute;\n    z-index: 1;\n    bottom: 125%;\n    left: 50%;\n    margin-left: -80px;\n}\n\n#notif {\n    font-weight: 600;\n    display: flex;\n    flex-direction: column;\n    font-size: medium;\n    align-items: center;\n    justify-content: center;\n    background-color: #fff;\n    width: 80%;\n    height: 75px;\n    justify-self: center;\n    border-radius: 10px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    -ms-border-radius: 10px;\n    -o-border-radius: 10px;\n    direction: var(--direction);\n    margin-bottom: 30px;\n}\n\n.ttpopup .popuptext::after {\n    content: '';\n    position: absolute;\n    top: 100%;\n    left: 50%;\n    margin-left: -5px;\n    border-width: 5px;\n    border-style: solid;\n    border-color: #555 transparent transparent transparent;\n}\n\n.ttpopup .show {\n    animation: fadeIn 1s;\n    -webkit-animation: fadeIn 1s;\n}\n\n.ttpopup .hide {\n    animation: fadeOut 1s;\n    -webkit-animation: fadeOut 1s;\n}\n\n@keyframes fadeIn {\n    from {\n        opacity: 0;\n        visibility: hidden;\n    }\n    to {\n        opacity: 1;\n        visibility: visible;\n    }\n}\n@keyframes fadeOut {\n    from {\n        opacity: 1;\n        visibility: visible;\n    }\n    to {\n        opacity: 0;\n        visibility: hidden;\n    }\n}\n.icon-bar {\n    position: fixed;\n    top: 50%;\n    right: 1%;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    transform: translateY(140%);\n    -webkit-transform: translateY(140%);\n    -moz-transform: translateY(140%);\n    -ms-transform: translateY(140%);\n    -o-transform: translateY(140%);\n}\n.icon-bar a,\n.icon-bar img {\n    width: 35px;\n}\n.icon-bar a:hover {\n    cursor: pointer;\n}\n\ninput[type='search'] {\n    border: none;\n    background-color: #e2e8f0;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n    background-position: var(--pos-icon);\n    background-size: 25px;\n    background-repeat: no-repeat;\n    border-radius: 2vmin;\n    -webkit-border-radius: 2vmin;\n    -moz-border-radius: 2vmin;\n    -ms-border-radius: 2vmin;\n    -o-border-radius: 2vmin;\n    height: 5.5vh;\n    min-width: 500px;\n    padding: 18px;\n    margin: 10px;\n    justify-self: flex-start;\n}\n\ninput[type='search']::after {\n    background-color: #e2e8f0;\n    border: none;\n}\n\ninput[type='search']:focus,\nselect:focus {\n    border: 1px blue solid;\n    outline: none;\n}\n\n#lgn {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    align-items: center;\n    min-width: fit-content;\n    height: 80%;\n}\n\n#actions-container {\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    justify-content: space-evenly;\n    align-items: center;\n    height: 100%;\n    width: 20%;\n    flex-wrap: wrap;\n}\n#actions-container div {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n}\n#actions-container div img {\n    margin: 10px;\n}\n#actions-container select {\n    border: none;\n    background-color: #0d4d79;\n    border-radius: 2vmin;\n    -webkit-border-radius: 2vmin;\n    -moz-border-radius: 2vmin;\n    -ms-border-radius: 2vmin;\n    -o-border-radius: 2vmin;\n    height: max-content;\n    width: auto;\n    padding: 10px 10px 10px 10px;\n    margin-bottom: 6px;\n    border: 2px solid white;\n    color: white;\n}\n#actions-container select:hover {\n    cursor: pointer;\n}\n#actions-container input[type='email'],\n#actions-container input[type='password'] {\n    border: none;\n    background-color: #e2e8f0;\n    border-radius: 2vmin;\n    -webkit-border-radius: 2vmin;\n    -moz-border-radius: 2vmin;\n    -ms-border-radius: 2vmin;\n    -o-border-radius: 2vmin;\n    height: max-content;\n    width: 100%;\n    padding: 10px 15px 10px 15px;\n}\n#actions-container select::after,\n#actions-container input[type='email']::after,\n#actions-container input[type='password']::after {\n    background-color: #fff;\n    border: 0px;\n}\n#actions-container img {\n    cursor: pointer;\n    transition: transform ease-in-out 400ms;\n    -webkit-transition: transform ease-in-out 400ms;\n    -moz-transition: transform ease-in-out 400ms;\n    -ms-transition: transform ease-in-out 400ms;\n    -o-transition: transform ease-in-out 400ms;\n}\n\n.loggedout {\n    display: none;\n}\n\n.loggedin {\n    display: flex;\n}\n\n.selected-page-dd {\n    text-decoration: underline !important;\n}\n\n#bedrooms-icon {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: space-evenly;\n    font-size: 1.35rem;\n    font-weight: 900;\n    display: inline-block;\n    position: relative;\n    color: #fff;\n    margin-left: 15px;\n}\n#bedrooms-icon #bedrooms-drpdn {\n    display: none !important;\n    position: absolute !important;\n    background-color: rgba(0, 0, 0, 0.8);\n    min-width: 160px;\n    max-height: 350px;\n    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n    z-index: 1;\n    margin: 0%;\n}\n#bedrooms-icon #bedrooms-drpdn p {\n    padding: 0.8em;\n    font-size: 1.1rem;\n    font-weight: 900;\n    display: inline-block;\n    position: relative;\n    margin: 0%;\n    color: white;\n    text-decoration: none;\n}\n#bedrooms-icon #bedrooms-drpdn p:hover {\n    background-color: #ddd;\n    cursor: pointer;\n    color: black !important;\n}\n\n.mobile {\n    display: none;\n}\n\n#bedrooms-icon:hover #bedrooms-drpdn {\n    display: flex !important;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n#bedrooms-icon:hover {\n    cursor: pointer;\n}\n\n#bottominfo {\n    margin-top: 40px;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    align-items: center;\n    width: 85%;\n}\n#bottominfo p {\n    font-weight: 600;\n}\n#bottominfo h2 {\n    font-weight: 900;\n    text-decoration: underline;\n    text-align: var(--text-align);\n}\n#bottominfo #aboutus {\n    padding: 15px;\n    background-color: var(--light-color);\n    direction: var(--direction);\n    width: 100%;\n    border-radius: 15px;\n    -webkit-border-radius: 15px;\n    -moz-border-radius: 15px;\n    -ms-border-radius: 15px;\n    -o-border-radius: 15px;\n}\n#bottominfo #contactinfo {\n    margin-top: 40px;\n    padding: 15px;\n    background-color: var(--light-color);\n    text-align: var(--text-align);\n    direction: var(--direction);\n    width: 100%;\n    border-radius: 15px;\n    -webkit-border-radius: 15px;\n    -moz-border-radius: 15px;\n    -ms-border-radius: 15px;\n    -o-border-radius: 15px;\n}\n#bottominfo #contactinfo a {\n    color: #000;\n    font-weight: 900;\n    margin: 0px 5px 0px 5px;\n}\n#bottominfo #contactinfo a:visited {\n    color: #000;\n}\n#bottominfo #contactinfo #map-cont {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    align-items: center;\n}\n#bottominfo #contactinfo #map-cont p {\n    align-self: flex-start;\n}\n\n.empn {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n}\n\n#nav-bar {\n    width: 95%;\n    padding: 10px 0px 10px 0px;\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n}\n#nav-bar .line {\n    font-size: 1.35rem;\n    font-weight: 900;\n    display: inline-block;\n    position: relative;\n    color: white;\n    margin-left: 15px;\n}\n#nav-bar .line::after {\n    content: '';\n    position: absolute;\n    width: 100%;\n    transform: scaleX(0);\n    height: 2px;\n    bottom: 0;\n    left: 0;\n    background-color: white;\n    transform-origin: bottom right;\n    transition: transform 500ms ease-out;\n    -webkit-transition: transform 500ms ease-out;\n    -moz-transition: transform 500ms ease-out;\n    -ms-transition: transform 500ms ease-out;\n    -o-transition: transform 500ms ease-out;\n}\n#nav-bar .line:hover::after {\n    transform: scaleX(1);\n    transform-origin: bottom left;\n}\n#nav-bar .line:hover {\n    cursor: pointer;\n}\n\n#middle-container {\n    padding: 35px 0px 35px 0px;\n    width: 100%;\n    min-height: 90vh;\n    background-color: white;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: flex-start;\n}\n#middle-container #grid {\n    margin: auto;\n    width: 90%;\n    min-height: fit-content;\n    display: grid;\n    gap: 40px;\n    grid-template-columns: repeat(auto-fill, 400px);\n    grid-template-rows: repeat(auto-fill, 500px);\n    justify-content: center;\n    direction: var(--direction);\n}\n\n#results-found {\n    width: 80%;\n    text-align: var(--text-align);\n    direction: var(--direction);\n}\n\n.recommendation-info-L {\n    height: fit-content !important;\n}\n\n.recommendation-info {\n    height: fit-content !important;\n}\n\n.item {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n    width: 400px;\n    height: 500px;\n    background-color: var(--light-color);\n    padding-bottom: 5px;\n    border-radius: 3vmin;\n    -webkit-border-radius: 3vmin;\n    -moz-border-radius: 3vmin;\n    -ms-border-radius: 3vmin;\n    -o-border-radius: 3vmin;\n}\n.item button {\n    background-color: #111827;\n    border: 1px solid transparent;\n    border-radius: 0.75rem;\n    box-sizing: border-box;\n    color: #ffffff;\n    cursor: pointer;\n    flex: 0 0 auto;\n    font-size: 1.125rem;\n    font-weight: 600;\n    line-height: 1.5rem;\n    padding: 0.75rem 1.2rem;\n    text-align: center;\n    text-decoration: none #6b7280 solid;\n    text-decoration-thickness: auto;\n    transition-duration: 0.2s;\n    transition-property: background-color, border-color, color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    user-select: none;\n    -webkit-user-select: none;\n    touch-action: manipulation;\n    width: auto;\n}\n.item button:hover {\n    background-color: #374151;\n}\n.item button:focus {\n    box-shadow: none;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n}\n.item img {\n    margin-top: 10px;\n    display: block;\n    max-width: 350px;\n    max-height: 250px;\n    width: auto;\n    height: auto;\n    cursor: pointer;\n}\n.item hr {\n    border: 0px;\n    height: 1px;\n    width: 80%;\n    background-image: linear-gradient(\n        to right,\n        rgba(0, 0, 0, 0),\n        rgba(0, 0, 0, 0.75),\n        rgba(0, 0, 0, 0)\n    );\n}\n.item div {\n    height: 150px;\n    width: 80%;\n    font-size: 1.2rem;\n}\n.item div .info {\n    display: flex;\n    justify-content: space-between;\n    direction: var(--direction);\n    align-items: center;\n    width: 100%;\n}\n.item div .info .info-left {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    margin-bottom: 5px;\n    width: fit-content;\n}\n.item div .info .info-left p {\n    width: fit-content;\n    margin: 5px 0px 5px 0px;\n}\n.item div .info img {\n    margin: 0%;\n    transition: transform ease-in-out 400ms;\n    -webkit-transition: transform ease-in-out 400ms;\n    -moz-transition: transform ease-in-out 400ms;\n    -ms-transition: transform ease-in-out 400ms;\n    -o-transition: transform ease-in-out 400ms;\n}\n\n#view-item {\n    display: flex;\n    flex-direction: var(--flex-row-direction);\n    justify-content: space-evenly;\n    align-items: center;\n    margin: auto;\n    width: 90%;\n    min-height: fit-content;\n}\n#view-item .item {\n    width: 40vw;\n    min-width: 440px;\n    height: 600px;\n}\n#view-item .item img {\n    max-width: 80%;\n    max-height: 300px;\n    width: auto;\n    height: auto;\n    cursor: pointer;\n}\n#view-item .item .info img {\n    cursor: pointer;\n}\n#view-item #item-details {\n    min-width: 440px;\n    width: 40vw;\n    height: 600px;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    align-items: center;\n    background-color: var(--light-color);\n    padding-bottom: 5px;\n    border-radius: 3vmin;\n    -webkit-border-radius: 3vmin;\n    -moz-border-radius: 3vmin;\n    -ms-border-radius: 3vmin;\n    -o-border-radius: 3vmin;\n}\n#view-item #item-details #detailsH,\n#view-item #item-details #detailsB {\n    background-color: white;\n    width: 80%;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    border-radius: 3vmin;\n    -webkit-border-radius: 3vmin;\n    -moz-border-radius: 3vmin;\n    -ms-border-radius: 3vmin;\n    -o-border-radius: 3vmin;\n}\n#view-item #item-details #detailsH {\n    height: 10%;\n    font-size: xx-large;\n    text-align: center;\n}\n#view-item #item-details #detailsB {\n    direction: var(--direction);\n    height: 65%;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    align-items: stretch;\n    padding: 1vmin;\n}\n#view-item #item-details #detailsB div {\n    height: 25%;\n    width: 80%;\n    width: fit-content;\n    height: fit-content;\n    font-size: 1.35rem;\n}\n\n@media (max-width: 1000px) {\n    #bottominfo #aboutus {\n        width: 100%;\n    }\n    #bottominfo #aboutus h2 {\n        text-align: center;\n    }\n    #bottominfo #aboutus p {\n        font-weight: 600;\n    }\n    #bottominfo #contactinfo {\n        width: 100%;\n    }\n}\n@media (min-width: 601px) and (max-width: 1000px) {\n    #view-item {\n        display: flex;\n        flex-direction: column;\n        justify-content: space-evenly;\n        align-items: center;\n    }\n    #view-item .item,\n    #view-item #item-details {\n        width: 80vw !important;\n        margin: 15px;\n        min-height: fit-content;\n    }\n}\n.selected-page {\n    color: black !important;\n}\n\n.selected-page::after {\n    background-color: black !important;\n}\n\n@media (min-width: 768px) {\n    .button-40 {\n        padding: 0.75rem 1.5rem;\n    }\n}\n@media only screen and (max-width: 600px) {\n    html,\n    body {\n        overflow-x: hidden;\n    }\n    select {\n        font-size: 16px;\n    }\n    #header {\n        justify-content: center;\n    }\n    #header input[type='search'] {\n        min-width: 350px;\n    }\n    #header #header-upper {\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n    }\n    #header #actions-container {\n        flex-direction: row;\n        justify-content: space-between;\n        align-items: center;\n        width: 95%;\n    }\n    #header #nav-bar {\n        display: none;\n    }\n    .mobile {\n        display: block;\n    }\n    #grid {\n        display: grid;\n        grid-template-columns: repeat(auto-fill, 80vw);\n    }\n    #grid .item {\n        width: 80vw !important;\n        min-height: fit-content;\n        margin: auto;\n    }\n    #grid .item img {\n        max-width: 60vw !important;\n    }\n    #view-item {\n        min-height: fit-content;\n        display: flex;\n        flex-direction: column;\n        justify-content: space-around;\n        align-items: center;\n    }\n    .item,\n    #item-details {\n        width: 80vw !important;\n        min-width: 0px !important;\n        margin: 15px;\n        height: 450px !important;\n    }\n    .item img,\n    #item-details img {\n        max-width: 60vw !important;\n        max-height: 300px !important;\n    }\n    #view-item #item-details #detailsB div {\n        font-size: 1.15rem !important;\n    }\n    #container2 #recommendations-container #recommendations {\n        background-color: #fff;\n    }\n    #container2 #recommendations-container #recommendations .item {\n        max-width: 200px;\n        height: 250px !important;\n        overflow-y: scroll;\n    }\n    #container2 #recommendations-container #recommendations .item img {\n        max-width: 180px !important;\n        max-height: 120px !important;\n    }\n    .zoomed-in,\n    .zoomed-container {\n        max-width: 100vw !important;\n    }\n    .x2 {\n        position: absolute;\n        top: 10%;\n        left: 8%;\n    }\n    #cart-main {\n        width: 90vw;\n        font-size: x-small;\n    }\n    #cart-main #cart-header {\n        font-size: 16px;\n    }\n    #order-main {\n        width: 85vw;\n    }\n    form {\n        width: 90vw;\n    }\n    form label p {\n        font-size: small;\n    }\n    form button {\n        width: fit-content;\n        font-size: small;\n    }\n    #success-message {\n        width: 85vw;\n    }\n}\n\n/*# sourceMappingURL=style.css.map */\n", "",{"version":3,"sources":["webpack://./src/styles/style.scss","webpack://./src/styles/style.css"],"names":[],"mappings":"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","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/lodash/_DataView.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Promise.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_Stack.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_Uint8Array.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./node_modules/lodash/_WeakMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayEach.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_assignValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssign.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseAssign.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseAssignIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseClone.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseClone.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ "./node_modules/lodash/_baseAssign.js"),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ "./node_modules/lodash/_baseAssignIn.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./node_modules/lodash/_cloneBuffer.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./node_modules/lodash/_copyArray.js"),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ "./node_modules/lodash/_copySymbols.js"),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ "./node_modules/lodash/_copySymbolsIn.js"),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js"),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ "./node_modules/lodash/_getAllKeysIn.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ "./node_modules/lodash/_initCloneArray.js"),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ "./node_modules/lodash/_initCloneByTag.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./node_modules/lodash/_initCloneObject.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isMap = __webpack_require__(/*! ./isMap */ "./node_modules/lodash/isMap.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSet = __webpack_require__(/*! ./isSet */ "./node_modules/lodash/isSet.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ "./node_modules/lodash/_baseCreate.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ "./node_modules/lodash/_baseGetAllKeys.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMap.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsMap.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseIsSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsSet.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_baseKeys.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseKeysIn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./node_modules/lodash/_nativeKeysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_cloneArrayBuffer.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_cloneArrayBuffer.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js");

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneBuffer.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneBuffer.js ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneDataView.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_cloneDataView.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ "./node_modules/lodash/_cloneRegExp.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneRegExp.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ "./node_modules/lodash/_cloneSymbol.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneSymbol.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ "./node_modules/lodash/_cloneTypedArray.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_cloneTypedArray.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_copyArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ "./node_modules/lodash/_copyObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_copyObject.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js");

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ "./node_modules/lodash/_copySymbols.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_copySymbols.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js");

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ "./node_modules/lodash/_copySymbolsIn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_copySymbolsIn.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js");

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getAllKeysIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getPrototype.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getSymbols.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "./node_modules/lodash/_getSymbolsIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getSymbolsIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_getTag.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ "./node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_initCloneArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneArray.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ "./node_modules/lodash/_initCloneByTag.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneByTag.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js"),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ "./node_modules/lodash/_cloneDataView.js"),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ "./node_modules/lodash/_cloneRegExp.js"),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ "./node_modules/lodash/_cloneSymbol.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./node_modules/lodash/_cloneTypedArray.js");

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ "./node_modules/lodash/_initCloneObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_initCloneObject.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ "./node_modules/lodash/_baseCreate.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js");

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_stackClear.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "./node_modules/lodash/_stackDelete.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "./node_modules/lodash/_stackGet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "./node_modules/lodash/_stackHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "./node_modules/lodash/_stackSet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/clonedeep.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/clonedeep.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./node_modules/lodash/_baseClone.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isMap.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isMap.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ "./node_modules/lodash/_baseIsMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSet.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isSet.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ "./node_modules/lodash/_baseIsSet.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "./node_modules/lodash/keys.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash/keysIn.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ "./node_modules/lodash/stubArray.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$":
/*!***************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \***************************************************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*****************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*****************************************************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/diningrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/diningrooms/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/diningrooms/1.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/livingrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/livingrooms/0.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/displayed/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/receptions sync \\.(png%7Cjpe?g%7Csvg)$":
/*!************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/receptions/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/receptions/0.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/displayed/receptions sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/tvunits/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/tvunits/1.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/displayed/tvunits sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$":
/*!**************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \**************************************************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/original/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$":
/*!****************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \****************************************************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/diningrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/diningrooms/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/diningrooms/1.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/livingrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/livingrooms/0.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/original/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/receptions sync \\.(png%7Cjpe?g%7Csvg)$":
/*!***********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/receptions/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \***********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/receptions/0.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/original/receptions sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits sync \\.(png%7Cjpe?g%7Csvg)$":
/*!********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/tvunits/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/tvunits/1.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/pictures/products/original/tvunits sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "abedroomsArr": () => (/* binding */ abedroomsArr),
/* harmony export */   "abedroomsArrOG": () => (/* binding */ abedroomsArrOG),
/* harmony export */   "abedroomsBtn": () => (/* binding */ abedroomsBtn),
/* harmony export */   "abedroomsP": () => (/* binding */ abedroomsP),
/* harmony export */   "actionsContainer": () => (/* binding */ actionsContainer),
/* harmony export */   "addAddress": () => (/* binding */ addAddress),
/* harmony export */   "addToCart": () => (/* binding */ addToCart),
/* harmony export */   "addressPop": () => (/* binding */ addressPop),
/* harmony export */   "bedroomsBtn": () => (/* binding */ bedroomsBtn),
/* harmony export */   "cartImg": () => (/* binding */ cartImg),
/* harmony export */   "chooseDetails": () => (/* binding */ chooseDetails),
/* harmony export */   "chooseMode": () => (/* binding */ chooseMode),
/* harmony export */   "clf": () => (/* binding */ clf),
/* harmony export */   "diningroomsArr": () => (/* binding */ diningroomsArr),
/* harmony export */   "diningroomsArrOG": () => (/* binding */ diningroomsArrOG),
/* harmony export */   "diningroomsBtn": () => (/* binding */ diningroomsBtn),
/* harmony export */   "diningroomsP": () => (/* binding */ diningroomsP),
/* harmony export */   "editDistance": () => (/* binding */ editDistance),
/* harmony export */   "fbImg": () => (/* binding */ fbImg),
/* harmony export */   "ftr": () => (/* binding */ ftr),
/* harmony export */   "getCount": () => (/* binding */ getCount),
/* harmony export */   "getProductIDIndex": () => (/* binding */ getProductIDIndex),
/* harmony export */   "goHome": () => (/* binding */ goHome),
/* harmony export */   "hasTouch": () => (/* binding */ hasTouch),
/* harmony export */   "headerUp": () => (/* binding */ headerUp),
/* harmony export */   "hideMenu": () => (/* binding */ hideMenu),
/* harmony export */   "homeBtn": () => (/* binding */ homeBtn),
/* harmony export */   "homeP": () => (/* binding */ homeP),
/* harmony export */   "igImg": () => (/* binding */ igImg),
/* harmony export */   "importAll": () => (/* binding */ importAll),
/* harmony export */   "kbedroomsArr": () => (/* binding */ kbedroomsArr),
/* harmony export */   "kbedroomsArrOG": () => (/* binding */ kbedroomsArrOG),
/* harmony export */   "kbedroomsBtn": () => (/* binding */ kbedroomsBtn),
/* harmony export */   "kbedroomsP": () => (/* binding */ kbedroomsP),
/* harmony export */   "langBtn": () => (/* binding */ langBtn),
/* harmony export */   "livingroomsArr": () => (/* binding */ livingroomsArr),
/* harmony export */   "livingroomsArrOG": () => (/* binding */ livingroomsArrOG),
/* harmony export */   "livingroomsBtn": () => (/* binding */ livingroomsBtn),
/* harmony export */   "livingroomsP": () => (/* binding */ livingroomsP),
/* harmony export */   "logoImg": () => (/* binding */ logoImg),
/* harmony export */   "menu": () => (/* binding */ menu),
/* harmony export */   "menuImg": () => (/* binding */ menuImg),
/* harmony export */   "middleContainer": () => (/* binding */ middleContainer),
/* harmony export */   "navBtns": () => (/* binding */ navBtns),
/* harmony export */   "navP": () => (/* binding */ navP),
/* harmony export */   "newSelect": () => (/* binding */ newSelect),
/* harmony export */   "orderPlaced": () => (/* binding */ orderPlaced),
/* harmony export */   "populateGrid": () => (/* binding */ populateGrid),
/* harmony export */   "populateLang": () => (/* binding */ populateLang),
/* harmony export */   "populateOrder": () => (/* binding */ populateOrder),
/* harmony export */   "populateRecommendations": () => (/* binding */ populateRecommendations),
/* harmony export */   "populateSearchResults": () => (/* binding */ populateSearchResults),
/* harmony export */   "populateViewCart": () => (/* binding */ populateViewCart),
/* harmony export */   "receptionsArr": () => (/* binding */ receptionsArr),
/* harmony export */   "receptionsArrOG": () => (/* binding */ receptionsArrOG),
/* harmony export */   "receptionsBtn": () => (/* binding */ receptionsBtn),
/* harmony export */   "receptionsP": () => (/* binding */ receptionsP),
/* harmony export */   "saveToDB": () => (/* binding */ saveToDB),
/* harmony export */   "searchResults": () => (/* binding */ searchResults),
/* harmony export */   "showResultsCount": () => (/* binding */ showResultsCount),
/* harmony export */   "similarity": () => (/* binding */ similarity),
/* harmony export */   "srch": () => (/* binding */ srch),
/* harmony export */   "submitAddress": () => (/* binding */ submitAddress),
/* harmony export */   "switchLang": () => (/* binding */ switchLang),
/* harmony export */   "tvunitsArr": () => (/* binding */ tvunitsArr),
/* harmony export */   "tvunitsArrOG": () => (/* binding */ tvunitsArrOG),
/* harmony export */   "tvunitsBtn": () => (/* binding */ tvunitsBtn),
/* harmony export */   "tvunitsP": () => (/* binding */ tvunitsP),
/* harmony export */   "waImg": () => (/* binding */ waImg),
/* harmony export */   "xImg": () => (/* binding */ xImg)
/* harmony export */ });
/* harmony import */ var _assets_images_pictures_logo_jpg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/images/pictures/logo.jpg */ "./src/assets/images/pictures/logo.jpg");
/* harmony import */ var _assets_images_icons_cart_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/images/icons/cart.svg */ "./src/assets/images/icons/cart.svg");
/* harmony import */ var _assets_images_icons_menu_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/images/icons/menu.svg */ "./src/assets/images/icons/menu.svg");
/* harmony import */ var _assets_images_icons_left_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/icons/left.svg */ "./src/assets/images/icons/left.svg");
/* harmony import */ var _assets_images_icons_right_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/icons/right.svg */ "./src/assets/images/icons/right.svg");
/* harmony import */ var _assets_images_icons_uleft_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/images/icons/uleft.svg */ "./src/assets/images/icons/uleft.svg");
/* harmony import */ var _assets_images_icons_uright_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/images/icons/uright.svg */ "./src/assets/images/icons/uright.svg");
/* harmony import */ var _assets_images_icons_x_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/images/icons/x.svg */ "./src/assets/images/icons/x.svg");
/* harmony import */ var _assets_images_icons_dot_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assets/images/icons/dot.svg */ "./src/assets/images/icons/dot.svg");
/* harmony import */ var _assets_images_icons_sdot_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../assets/images/icons/sdot.svg */ "./src/assets/images/icons/sdot.svg");
/* harmony import */ var _assets_images_icons_x2_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../assets/images/icons/x2.svg */ "./src/assets/images/icons/x2.svg");
/* harmony import */ var _assets_images_icons_remove_cart_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../assets/images/icons/remove-cart.svg */ "./src/assets/images/icons/remove-cart.svg");
/* harmony import */ var _local_storage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./local-storage */ "./src/scripts/local-storage.js");
/* harmony import */ var _assets_images_icons_fb_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../assets/images/icons/fb.svg */ "./src/assets/images/icons/fb.svg");
/* harmony import */ var _assets_images_icons_ig_svg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../assets/images/icons/ig.svg */ "./src/assets/images/icons/ig.svg");
/* harmony import */ var _assets_images_icons_wa_svg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../assets/images/icons/wa.svg */ "./src/assets/images/icons/wa.svg");
/* harmony import */ var _db_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./db.json */ "./src/scripts/db.json");
/* harmony import */ var _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @datastructures-js/priority-queue */ "./node_modules/@datastructures-js/priority-queue/index.js");
/* harmony import */ var _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");





















const cloneDeep = __webpack_require__(/*! lodash/clonedeep */ "./node_modules/lodash/clonedeep.js")

let products = _db_json__WEBPACK_IMPORTED_MODULE_16__.Products

const middleContainer = document.getElementById('middle-container')
const headerUp = document.getElementById('header-upper')
const actionsContainer = document.getElementById('actions-container')
const clf = document.getElementById('clf')
const langBtn = document.getElementById('slct-lang')
const livingroomsBtn = document.getElementById('livingrooms')
const homeBtn = document.getElementById('home')
const bedroomsBtn = document.getElementById('bedrooms')
const abedroomsBtn = document.getElementById('adults-bedrooms')
const kbedroomsBtn = document.getElementById('kids-bedrooms')
const receptionsBtn = document.getElementById('receptions')
const tvunitsBtn = document.getElementById('tvunits')
const diningroomsBtn = document.getElementById('diningrooms')
const srch = document.getElementById('srch-in')
const ftr = document.getElementById('ftr')
const menu = document.getElementById('menu')
const homeP = document.getElementById('home-p')
const livingroomsP = document.getElementById('livingrooms-p')
const abedroomsP = document.getElementById('abedrooms-p')
const kbedroomsP = document.getElementById('kbedrooms-p')
const receptionsP = document.getElementById('receptions-p')
const tvunitsP = document.getElementById('tvunits-p')
const diningroomsP = document.getElementById('diningrooms-p')
const addressPop = document.getElementById('address-popup')

const logoImg = new Image()
const cartImg = new Image()
const menuImg = new Image()
const xImg = new Image()
const fbImg = new Image()
const igImg = new Image()
const waImg = new Image()

logoImg.src = _assets_images_pictures_logo_jpg__WEBPACK_IMPORTED_MODULE_0__
cartImg.src = _assets_images_icons_cart_svg__WEBPACK_IMPORTED_MODULE_1__
menuImg.src = _assets_images_icons_menu_svg__WEBPACK_IMPORTED_MODULE_2__
xImg.src = _assets_images_icons_x_svg__WEBPACK_IMPORTED_MODULE_7__
fbImg.src = _assets_images_icons_fb_svg__WEBPACK_IMPORTED_MODULE_13__
igImg.src = _assets_images_icons_ig_svg__WEBPACK_IMPORTED_MODULE_14__
waImg.src = _assets_images_icons_wa_svg__WEBPACK_IMPORTED_MODULE_15__

cartImg.setAttribute(
    'style',
    'width: 40px;height: 40px; transform: translate(0px, -5px);'
)
menuImg.setAttribute('style', 'width: 40px;height: 40px;')
xImg.setAttribute('style', 'width: 20px;height: 20px;')

const sm = document.getElementById('sm')
const fbl = document.getElementById('fbl')
const igl = document.getElementById('igl')
const pn = document.getElementById('pn')
fbl.appendChild(fbImg)
igl.appendChild(igImg)
pn.appendChild(waImg)
sm.appendChild(fbl)
sm.appendChild(igl)
sm.appendChild(pn)

menuImg.classList.add('mobile')
menu.appendChild(xImg)

const livingroomsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$")
)
const abedroomsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$")
)
const kbedroomsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$")
)
const receptionsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/receptions sync \\.(png%7Cjpe?g%7Csvg)$")
)
const tvunitsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/tvunits sync \\.(png%7Cjpe?g%7Csvg)$")
)
const diningroomsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$")
)

const livingroomsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$")
)
const abedroomsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$")
)
const kbedroomsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$")
)
const receptionsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/receptions sync \\.(png%7Cjpe?g%7Csvg)$")
)
const tvunitsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/tvunits sync \\.(png%7Cjpe?g%7Csvg)$")
)
const diningroomsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$")
)

const navBtns = [
    homeBtn,
    livingroomsBtn,
    abedroomsBtn,
    kbedroomsBtn,
    receptionsBtn,
    tvunitsBtn,
    diningroomsBtn,
]
const navP = [
    homeP,
    livingroomsP,
    abedroomsP,
    kbedroomsP,
    receptionsP,
    tvunitsP,
    diningroomsP,
]
const navAr = [
    '????????????????',
    '?????? ??????????????',
    '?????? ?????? ????????????',
    '?????? ?????? ??????????',
    '??????????????',
    '????????????',
    '?????? ????????',
]
const navEn = [
    'Home',
    'Living Rooms',
    'Master Bedrooms',
    'Kids Bedrooms',
    'Receptions',
    'TV Units',
    'Dining Rooms',
]
const navAr2 = [
    '????????????????',
    '?????? ??????????????',
    '?????? ?????? ????????????',
    '?????? ?????? ??????????',
    '??????????????',
    '????????????',
    '?????? ????????',
]
const navEn2 = [
    'Home',
    'Living Rooms',
    'Master Bedrooms',
    'Kids Bedrooms',
    'Receptions',
    'TV Units',
    'Dining Rooms',
]

const LivingRoomsDetails = []
const KidsBedroomsDetails = []
const MasterBedroomsDetails = []
const DiningRoomsDetails = []
const ReceptionsDetails = []
const TVUnitsDetails = []

const recommendationsArrDetails = []
const recommendationsArr = {}
const recommendationsArrOG = {}

let searchArr = {}
let searchArrOG = {}
let searchArrDetails = []

let cartArrDetails = []
let cartArr = {}
let cartArrOG = {}
let cartIndexes = []

let _address = {
    username: 'u',
    phone: 'p',
    email: 'e',
    city: 'c',
    area: 'a',
    street: 's',
    building: 'b',
    floor: 'f',
    apartment: 'apt',
    landmark: 'l',
    instructions: 'i',
    exists: false,
}

let f1 = _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.getDetails()
let f2 = _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.getArr()
let f3 = _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.getArrOg()
let f4 = _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.getIndexes()
let f5 = _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.getAddress()

if (f1) {
    cartArrDetails = JSON.parse(f1)
}

if (f2) {
    cartArr = JSON.parse(f2)
}

if (f3) {
    cartArrOG = JSON.parse(f3)
}

if (f4) {
    cartIndexes = JSON.parse(f4)
}

if (f5) {
    _address = JSON.parse(f5)
}

let resultsQueue = new _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_17__.PriorityQueue((a, b) => {
    if (a[1] > b[1]) {
        return -1
    }
    if (a[1] < b[1]) {
        return 1
    }
})

let iii = 0
let tp = 0
let flag = 'page'
let nflag = true
let currItem = []

products.forEach((p) => {
    switch (p.product_type) {
        case 'Livingrooms':
            LivingRoomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = livingroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = livingroomsArrOG[indx2]
                iii++
            }
            break
        case 'Kids Bedrooms':
            KidsBedroomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = kbedroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = kbedroomsArrOG[indx2]
                iii++
            }
            break
        case 'Master Bedrooms':
            MasterBedroomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = abedroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = abedroomsArrOG[indx2]
                iii++
            }
            break
        case 'Diningrooms':
            DiningRoomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = diningroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = diningroomsArrOG[indx2]
                iii++
            }
            break
        case 'Receptions':
            ReceptionsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = receptionsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = receptionsArrOG[indx2]
                iii++
            }
            break
        case 'TV Units':
            TVUnitsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = tvunitsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = tvunitsArrOG[indx2]
                iii++
            }
            break
        default:
            break
    }
    if (p.recommended == 1) {
        recommendationsArrDetails.push(p.index)
    }
})

goHome()
switchLang('en')

function importAll(r) {
    let images = {}
    r.keys().map((item) => {
        images[item.replace('./', '')] = r(item)
    })
    return images
}

function popUp(m, i) {
    let popup =
        m == 1
            ? document.getElementById(`myPopup-${i}`)
            : document.getElementById('myPopup2')
    popup.classList.remove('hide')
    popup.classList.add('show')

    setTimeout(function () {
        popup.classList.remove('show')
        popup.classList.add('hide')
    }, 1000)
}

function submitAddress() {
    let un = document.getElementById('user-name')
    let pn = document.getElementById('phone-num')
    let email = document.getElementById('email-address')
    let city = document.getElementById('city')
    let area = document.getElementById('area')
    let st = document.getElementById('street')
    let building = document.getElementById('building')
    let floor = document.getElementById('floor')
    let apt = document.getElementById('apartment')
    let landmark = document.getElementById('landmark')
    let instructions = document.getElementById('instructions')

    if (
        un.reportValidity() &&
        pn.reportValidity() &&
        email.reportValidity() &&
        city.reportValidity() &&
        area.reportValidity() &&
        st.reportValidity() &&
        building.reportValidity() &&
        floor.reportValidity() &&
        apt.reportValidity() &&
        landmark.reportValidity() &&
        instructions.reportValidity()
    ) {
        _address = {
            username: un.value,
            phone: pn.value,
            email: email.value,
            city: city.value,
            area: area.value,
            street: st.value,
            building: building.value,
            floor: floor.value,
            apartment: apt.value,
            landmark: landmark.value,
            instructions: instructions.value,
            exists: true,
        }

        un.value = ''
        pn.value = ''
        email.value = ''
        city.value = ''
        area.value = ''
        st.value = ''
        building.value = ''
        floor.value = ''
        apt.value = ''
        landmark.value = ''
        instructions.value = ''

        _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.saveAddress(_address)
        const blurred = document.body.children
        const con = document.getElementById('address-popup')
        for (let k = 0; k < blurred.length; k++) {
            blurred[k].classList.remove('popup')
        }
        con.setAttribute('style', 'display: none;')
        document.getElementById('zio').remove()

        populateOrder()
    }
}

function addAddress() {
    const submit = document.getElementById('submit-address')
    const x3 = document.getElementById('x3')
    let astrs = []
    let ps = []
    let astr = ''
    let p = ''
    for (let l = 0; l < 11; l++) {
        if (l < 8) {
            astr = document.createElement('sup')
            astr.textContent = '*'
            astr.classList.add('astr')
            astrs.push(astr)
        }
        p = document.createElement('p')
        ps.push(p)
    }

    const zoomedCont = document.createElement('div')
    zoomedCont.id = 'zio'
    zoomedCont.classList.add('zoomed-container')

    if (document.body.classList.contains('en')) {
        ps[0].textContent = 'Name'
        ps[1].textContent = 'Phone Number'
        ps[2].textContent = 'Email'
        ps[3].textContent = 'City'
        ps[4].textContent = 'Area'
        ps[5].textContent = 'Street Name / Number'
        ps[6].textContent = 'Building / Villa'
        ps[7].textContent = 'Floor'
        ps[8].textContent = `Apartment`
        ps[9].textContent = 'Landmark'
        ps[10].textContent = 'Instructions'
    } else {
        ps[0].textContent = '??????????'
        ps[1].textContent = '?????? ????????????'
        ps[2].textContent = '???????????? ????????????????????'
        ps[3].textContent = '????????????????'
        ps[4].textContent = '??????????????'
        ps[5].textContent = '?????? / ?????? ????????????'
        ps[6].textContent = '?????? ?????????????? / ????????????'
        ps[7].textContent = '????????????'
        ps[8].textContent = '??????????'
        ps[9].textContent = '?????????? ??????????'
        ps[10].textContent = '?????????????? ????????'
    }

    document.getElementById('un-label').append(astrs[0])
    document.getElementById('un-label').append(ps[0])
    document.getElementById('pn-label').append(astrs[1])
    document.getElementById('pn-label').append(ps[1])
    document.getElementById('email-label').append(astrs[2])
    document.getElementById('email-label').append(ps[2])
    document.getElementById('city-label').append(astrs[3])
    document.getElementById('city-label').append(ps[3])
    document.getElementById('area-label').append(astrs[4])
    document.getElementById('area-label').append(ps[4])
    document.getElementById('st-label').append(astrs[5])
    document.getElementById('st-label').append(ps[5])
    document.getElementById('building-label').append(astrs[6])
    document.getElementById('building-label').append(ps[6])
    document.getElementById('floor-label').append(astrs[7])
    document.getElementById('floor-label').append(ps[7])
    document.getElementById('apt-label').append(ps[8])
    document.getElementById('landmark-label').append(ps[9])
    document.getElementById('instructions-label').append(ps[10])

    document.body.appendChild(zoomedCont)
    const blurred = document.body.children
    for (let k = 0; k < blurred.length; k++) {
        blurred[k].classList.add('popup')
    }
    addressPop.classList.remove('popup')
    x3.src = _assets_images_icons_x_svg__WEBPACK_IMPORTED_MODULE_7__
    x3.setAttribute('style', 'width: 20px;height: 20px;')
    x3.addEventListener('click', () => {
        const blurred = document.body.children
        const con = document.getElementById('address-popup')
        for (let k = 0; k < blurred.length; k++) {
            blurred[k].classList.remove('popup')
        }

        document.getElementById('un-label').innerHTML = ''
        document.getElementById('un-label').innerHTML = ''
        document.getElementById('pn-label').innerHTML = ''
        document.getElementById('pn-label').innerHTML = ''
        document.getElementById('email-label').innerHTML = ''
        document.getElementById('email-label').innerHTML = ''
        document.getElementById('city-label').innerHTML = ''
        document.getElementById('city-label').innerHTML = ''
        document.getElementById('area-label').innerHTML = ''
        document.getElementById('area-label').innerHTML = ''
        document.getElementById('st-label').innerHTML = ''
        document.getElementById('st-label').innerHTML = ''
        document.getElementById('building-label').innerHTML = ''
        document.getElementById('building-label').innerHTML = ''
        document.getElementById('floor-label').innerHTML = ''
        document.getElementById('floor-label').innerHTML = ''
        document.getElementById('apt-label').innerHTML = ''
        document.getElementById('landmark-label').innerHTML = ''
        document.getElementById('instructions-label').innerHTML = ''

        con.setAttribute('style', 'display: none;')
        zoomedCont.remove()
    })

    addressPop.setAttribute('style', 'display: flex;')

    submit.addEventListener('click', () => {
        submitAddress()
    })
}

function getProductIDIndex(m) {
    let res = []
    if (m == 1) {
        cartIndexes.forEach((index) => {
            products.forEach((product) => {
                if (index == product.index) {
                    res.push(product.p_id)
                }
            })
        })
    } else if (m == 2) {
        cartIndexes.forEach((index) => {
            products.forEach((product) => {
                if (index == product.index) {
                    res.push(product.product_title_en)
                }
            })
        })
    }
    return res
}

async function saveToDB(order) {
    _db_json__WEBPACK_IMPORTED_MODULE_16__.Orders.push(order)
    let obj = {
        db: _db_json__WEBPACK_IMPORTED_MODULE_16__,
        curr: order,
    }
    let objStr = await JSON.stringify(obj)
    let response = await fetch('https://splash-7e1y.onrender.com/', {
        method: `POST`,
        // mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: objStr,
    })

    return response.body
}

function getCount(arr) {
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        obj[arr[i]] = 1
        for (let j = 0; j < arr.length; j++) {
            if (i != j && arr[i] == arr[j]) {
                obj[arr[i]]++
            }
        }
    }
    return obj
}

function orderPlaced(id) {
    middleContainer.innerHTML = ''
    const main = document.createElement('div')
    const success = document.createElement('h3')
    const success2 = document.createElement('h4')
    const orderNum = document.createElement('p')
    const btn = document.createElement('button')

    main.id = 'success-message'

    let today = new Date()
    let date =
        today.getDate() +
        '/' +
        (today.getMonth() + 1) +
        '/' +
        today.getFullYear()
    let time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    let dateTime =
        date +
        ' ' +
        time +
        ' ' +
        Intl.DateTimeFormat().resolvedOptions().timeZone

    let gpii = getProductIDIndex(2)
    let obj = getCount(gpii)
    let ot = ''
    const keys = Object.keys(obj)
    keys.forEach((key) => {
        ot += `${obj[key]}x '${key}' - `
    })
    ot = ot.slice(0, -3)

    let order = {
        order_id: id,
        order_address: _address,
        order_subtotal: tp,
        order_datetime: dateTime,
        order_items: ot,
        order_items_ids: getProductIDIndex(1).join(' - '),
    }

    let wait = document.createElement('h3')
    wait.textContent = document.body.classList.contains('en')
        ? 'Please Wait..'
        : '???????????? ????????????????..'
    main.append(wait)
    middleContainer.append(main)

    saveToDB(order)
        .then(function () {
            if (document.body.classList.contains('en')) {
                success.textContent = 'Order Placed Successfully!'
                success2.textContent =
                    'Please check your mail for confirmation.'
                orderNum.textContent = `Order ID: ${id}`
                btn.textContent = 'Continue Shopping'
            } else {
                success.textContent = '???? ?????????? ?????????? ??????????!'
                success2.textContent =
                    '???????? ???????????? ???? ?????????? ???????????????????? ??????????????.'
                orderNum.textContent = `?????? ??????????: ${id}`
                btn.textContent = '???????????? ????????????'
            }
            cartArrDetails = []
            cartArr = {}
            cartArrOG = {}
            cartIndexes = []
            tp = 0
            _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.saveCart(cartArrDetails, cartArr, cartArrOG, cartIndexes)

            btn.addEventListener('click', () => {
                goHome()
            })
            main.innerHTML = ''
            middleContainer.innerHTML = ''
            main.append(success)
            main.append(success2)
            main.append(orderNum)
            main.append(btn)

            middleContainer.append(main)
        })
        .catch(function (err) {
            console.log(err)
            if (document.body.classList.contains('en')) {
                success.textContent = 'Oops Something Went Wrong.'
                success2.textContent = 'Please try again or contact us.'
                btn.textContent = 'Try Again'
            } else {
                success.textContent = '?????? ?????? ?????? ????.'
                success2.textContent = '???????? ???????????????? ?????? ???????? ???? ?????????????? ??????.'
                btn.textContent = '?????????? ????????????????'
            }
            btn.addEventListener('click', () => {
                orderPlaced(id)
            })

            main.innerHTML = ''
            middleContainer.innerHTML = ''
            main.append(success)
            main.append(success2)
            main.append(btn)

            middleContainer.append(main)
        })

    flag = 'page'
}

function populateOrder() {
    middleContainer.innerHTML = ''
    const main = document.createElement('div')

    const addressContainer = document.createElement('div')
    const addressDNE = document.createElement('p')
    const addressP = document.createElement('p')
    const instP = document.createElement('p')
    const landmarkP = document.createElement('p')
    const addChange = document.createElement('button')

    const priceContainer = document.createElement('div')
    const subtotal = document.createElement('p')
    const shipping = document.createElement('p')

    const placeOrder = document.createElement('button')

    main.id = 'order-main'
    addressContainer.id = 'order-address-cont'
    priceContainer.id = 'order-price-cont'

    if (document.body.classList.contains('en')) {
        if (_address.exists) {
            addChange.textContent = 'Change'
            let addArr = Object.values(_address)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            if (!_address.apartment) {
                addArr.splice(-1, 1)
            }
            if (_address.landmark) {
                landmarkP.textContent = `Landmark: ${_address.landmark}`
            }
            if (_address.instructions) {
                instP.textContent = `Instructions: ${_address.instructions}`
            }
            addressP.textContent = addArr.join(' - ')
        } else {
            addChange.textContent = 'Add'
            addressDNE.textContent = 'No Address Found.'
        }
        subtotal.textContent = `Subtotal: ${tp} EGP`
        shipping.textContent = 'plus shipping fee.'
        placeOrder.textContent = 'Place Order'
    } else {
        if (_address.exists) {
            addChange.textContent = '??????????'
            let addArr = Object.values(_address)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            if (!_address.apartment) {
                addArr.splice(-1, 1)
            }
            if (_address.landmark) {
                landmarkP.textContent = `?????????? ??????????: ${_address.landmark}`
            }
            if (_address.instructions) {
                instP.textContent = `?????????????? ????????: ${_address.instructions}`
            }
            addressP.textContent = addArr.join(' - ')
        } else {
            addChange.textContent = '??????????'
            addressDNE.textContent = '???? ?????? ???????????? ?????? ??????????.'
        }
        subtotal.textContent = `????????????????: ${tp} ??.??`
        shipping.textContent = '???????? ???????????? ??????????.'
        placeOrder.textContent = `?????????? ?????????? ????????????`
    }

    if (!_address.exists) {
        placeOrder.disabled = true
    } else {
        placeOrder.disabled = false
    }

    addChange.addEventListener('click', () => {
        addAddress()
    })

    placeOrder.addEventListener('click', () => {
        orderPlaced((0,nanoid__WEBPACK_IMPORTED_MODULE_18__.nanoid)(21))
    })

    if (_address.exists) {
        addressContainer.append(addressP)
        addressContainer.append(landmarkP)
        addressContainer.append(instP)
    } else {
        addressContainer.append(addressDNE)
    }

    shipping.id = 'gray-text'

    addressContainer.append(addChange)
    priceContainer.append(subtotal)
    priceContainer.append(shipping)
    main.append(addressContainer)
    main.append(priceContainer)
    main.append(placeOrder)
    middleContainer.append(main)
    flag = 'order'
}

function addToCart(product_index, i) {
    cartIndexes.push(product_index)
    popUp(1, i)
}

function populateViewCart() {
    middleContainer.innerHTML = ''
    const main = document.createElement('div')
    cartArrDetails = []
    cartArr = {}
    cartArrOG = {}
    let a = ''
    let indx2 = -1
    let iiii = 0
    main.id = 'cart-main'
    cartIndexes.forEach((cartIndex) => {
        products.forEach((p) => {
            if (cartIndex == p.index) {
                switch (p.product_type) {
                    case 'Livingrooms':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = livingroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = livingroomsArrOG[indx2]
                        iiii++
                        break
                    case 'Kids Bedrooms':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = kbedroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = kbedroomsArrOG[indx2]
                        iiii++
                        break
                    case 'Master Bedrooms':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = abedroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = abedroomsArrOG[indx2]
                        iiii++
                        break
                    case 'Diningrooms':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = diningroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = diningroomsArrOG[indx2]
                        iiii++
                        break
                    case 'Receptions':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = receptionsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = receptionsArrOG[indx2]
                        iiii++
                        break
                    case 'TV Units':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = tvunitsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = tvunitsArrOG[indx2]
                        iiii++
                        break
                    default:
                        break
                }
                cartArrDetails.push(p.index)
            }
        })
    })

    if (cartArrDetails.length <= 0) {
        const empty = document.createElement('p')
        const add = document.createElement('button')
        empty.id = 'cart-empty'
        if (document.body.classList.contains('en')) {
            empty.textContent = 'Shopping Cart is Empty.'
            add.textContent = 'Add Items'
        } else {
            empty.textContent = '???????? ???????????? ??????????.'
            add.textContent = '?????? ????????????'
        }
        add.addEventListener('click', () => {
            goHome()
        })
        main.classList.add('empty-cart-main')
        main.append(empty)
        main.append(add)
    } else {
        const notif = document.createElement('div')
        const header = document.createElement('div')
        const mid = document.createElement('div')
        const cartfooter = document.createElement('div')
        const title = document.createElement('p')
        const price = document.createElement('p')
        const notifP = document.createElement('p')
        const totalprice = document.createElement('p')
        const place = document.createElement('button')

        tp = 0

        notif.id = 'notif'

        if (document.body.classList.contains('en')) {
            title.textContent = 'Product'
            price.textContent = 'Price'
            notifP.textContent = 'Item Removed from Cart!'
        } else {
            title.textContent = '????????????'
            price.textContent = '??????????'
            notifP.textContent = ' ?????? ?????????????? ???? ???????? ????????????!'
        }

        for (let i = 0; i < Object.keys(cartArr).length; i++) {
            let temp = document.createElement('div')
            let prod = document.createElement('span')
            let titlei = document.createElement('p')
            let pricei = document.createElement('p')
            let hlc = document.createElement('hr')
            let removeImgDiv = document.createElement('div')
            let removeImg = new Image()

            removeImg.src = _assets_images_icons_remove_cart_svg__WEBPACK_IMPORTED_MODULE_11__
            removeImg.setAttribute('style', 'width: 22px;height: 22px;')

            if (document.body.classList.contains('en')) {
                titlei.textContent = `${
                    products[parseInt(cartArrDetails[i])].p_id
                }, ${products[parseInt(cartArrDetails[i])].product_title_en}`
                pricei.textContent =
                    products[parseInt(cartArrDetails[i])].product_price_en
            } else {
                titlei.textContent = `${
                    products[parseInt(cartArrDetails[i])].p_id
                }?? ${products[parseInt(cartArrDetails[i])].product_title_ar}`
                pricei.textContent =
                    products[parseInt(cartArrDetails[i])].product_price_ar
            }

            hlc.classList.add('hlc')
            pricei.classList.add('qp')

            let img = new Image()
            img.src = cartArrOG[`${i}.jpg`]
            img.classList.add('cart-item-img')
            img.addEventListener('click', () => {
                populateItem(8, i)
            })

            removeImg.addEventListener('click', () => {
                cartArrDetails.splice(i, 1)
                delete cartArr[`${i}.jpg`]
                delete cartArrOG[`${i}.jpg`]
                cartIndexes.splice(i, 1)
                nflag = false
                populateViewCart()
            })

            temp.classList.add('cart-item')

            removeImgDiv.append(removeImg)
            prod.append(img)
            prod.append(titlei)
            temp.append(prod)
            temp.append(pricei)
            temp.append(removeImgDiv)
            mid.append(temp)
            mid.append(hlc)

            tp += parseInt(products[parseInt(cartArrDetails[i])].product_price)
        }
        let hlc = document.createElement('hr')
        hlc.classList.add('hlc')

        if (document.body.classList.contains('en')) {
            totalprice.textContent = `Total Price: ${tp}`
            place.textContent = `Continue`
        } else {
            totalprice.textContent = `???????????? ??????????: ${tp}`
            place.textContent = `??????????????????`
        }

        place.addEventListener('click', () => {
            populateOrder()
        })

        title.classList.add('tit')
        price.classList.add('qph')

        header.append(title)
        header.append(price)

        header.id = 'cart-header'
        mid.id = 'cart-mid'
        totalprice.id = 'cart-total-price'
        cartfooter.id = 'cart-footer'

        cartfooter.append(totalprice)
        cartfooter.append(place)

        if (!nflag) {
            notif.append(notifP)
            main.append(notif)
            nflag = true
        }

        main.append(header)
        main.append(hlc)
        main.append(mid)
        main.append(cartfooter)
    }

    _local_storage__WEBPACK_IMPORTED_MODULE_12__.Storage.saveCart(cartArrDetails, cartArr, cartArrOG, cartIndexes)
    middleContainer.append(main)
    flag = 'cart'
}

function showResultsCount(m, a) {
    let resultsFound = document.createElement('h2')
    resultsFound.id = 'results-found'
    let grm = ''

    if (document.body.classList.contains('en')) {
        if (Object.keys(a).length == 1) {
            grm = ' was'
        } else {
            grm = 's were'
        }
        resultsFound.textContent = `${
            Object.keys(a).length
        } Product${grm} found.`
    } else {
        if (Object.keys(a).length == 1) {
            grm = '????????'
        } else {
            grm = '????????????'
        }
        resultsFound.textContent = `???? ???????????? ?????? ${
            Object.keys(a).length
        } ${grm}.`
    }
    m.append(resultsFound)
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase()
    s2 = s2.toLowerCase()

    var costs = new Array()
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j
            else {
                if (j > 0) {
                    var newValue = costs[j - 1]
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue =
                            Math.min(Math.min(newValue, lastValue), costs[j]) +
                            1
                    costs[j - 1] = lastValue
                    lastValue = newValue
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue
    }
    return costs[s2.length]
}

function similarity(s1, s2) {
    var longer = s1
    var shorter = s2
    if (s1.length < s2.length) {
        longer = s2
        shorter = s1
    }
    var longerLength = longer.length
    if (longerLength == 0) {
        return 1.0
    }
    return (
        (longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)
    )
}

function searchResults(target) {
    middleContainer.focus()
    let added = []
    resultsQueue = new _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_17__.PriorityQueue((a, b) => {
        if (a[1] > b[1]) {
            return -1
        }
        if (a[1] < b[1]) {
            return 1
        }
    })

    target = target.toUpperCase()
    let breakk = false
    const re = new RegExp(/[A-Za-z]\d\d(\d)?(\d)?/)
    if (re.test(target)) {
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            if (product.p_id == target) {
                resultsQueue.enqueue([i, 1, product.product_type])
                breakk = true
            }
        }
    }
    if (!breakk) {
        for (let i = 0; i < products.length; i++) {
            let pool = []
            const product = products[i]
            pool.push(
                product.product_description_ar,
                product.product_description_en,
                product.product_title_ar,
                product.product_title_en,
                product.product_type
            )
            pool.forEach((el) => {
                if (el.length > 1) {
                    el = el.toUpperCase()
                    let sim = similarity(el, target)
                    if (
                        sim > 0.65 ||
                        (target.length > 1 &&
                            (el.includes(target) || target.includes(el)))
                    ) {
                        if (!added.includes(product.p_id)) {
                            resultsQueue.enqueue([i, sim, product.product_type])
                            added.push(product.p_id)
                        }
                    }
                }
            })
        }
    }
    srch.value = ''
    populateSearchResults()
}

function populateSearchResults() {
    let r = cloneDeep(resultsQueue)
    middleContainer.innerHTML = ''
    searchArr = {}
    let ls = []
    let indxx = 0
    while (!r.isEmpty()) {
        let l = r.dequeue()
        ls.push(l)
    }

    ls.forEach((l) => {
        let p = products[l[0]]
        if (l[2] == 'Livingrooms') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = livingroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = livingroomsArrOG[indx2]
            indxx++
        } else if (l[2] == 'Kids Bedrooms') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = kbedroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = kbedroomsArrOG[indx2]
            indxx++
        } else if (l[2] == 'Master Bedrooms') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = abedroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = abedroomsArrOG[indx2]
            indxx++
        } else if (l[2] == 'Diningrooms') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = diningroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = diningroomsArrOG[indx2]
            indxx++
        } else if (l[2] == 'Receptions') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = receptionsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = receptionsArrOG[indx2]
            indxx++
        } else if (l[2] == 'TV Units') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = tvunitsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = tvunitsArrOG[indx2]
            indxx++
        }
        searchArrDetails.push(l[0])
    })

    showResultsCount(middleContainer, searchArr)

    flag = 'search'
    let grid = document.createElement('div')
    grid.id = 'grid'

    for (let i = 0; i < Object.keys(searchArr).length; i++) {
        let img = createCard(grid, -1, i)
        img.addEventListener('click', () => {
            populateItem(-1, i)
        })
    }
    middleContainer.append(grid)
}

function populateRecommendations(r) {
    let num
    let b = []
    if (2000 < window.innerWidth && window.innerWidth <= 2500) {
        num = 6
    }
    if (1600 < window.innerWidth && window.innerWidth <= 2000) {
        num = 5
    }
    if (1300 < window.innerWidth && window.innerWidth <= 1600) {
        num = 4
    }
    if (1024 < window.innerWidth && window.innerWidth <= 1300) {
        num = 3
    }
    if (600 < window.innerWidth && window.innerWidth <= 1024) {
        num = 2
    }
    if (0 < window.innerWidth && window.innerWidth <= 600) {
        num = 1
    }

    r.innerHTML = ''

    for (let ii = 0; ii < Math.ceil(10 / num); ii += 1) {
        let ar = []
        for (let i = ii * num; i < ii * num + num; i++) {
            if (Object.keys(recommendationsArr).includes(`${i}.jpg`)) {
                const c = document.createElement('div')
                let img = createCard(c, 7, i)
                img.addEventListener('click', () => {
                    populateItem(7, i)
                })
                ar.push(c)
            }
        }
        b.push(ar)
    }
    let p = 0
    if (num == 1 || num == 2) {
        p = 1
    }
    return [b, Math.floor(10 / num) - p, num]
}

function goHome() {
    newSelect(homeBtn)
    middleContainer.innerHTML = ''
    const container = document.createElement('div')
    const container2 = document.createElement('div')
    const dots = document.createElement('div')
    const prev = new Image()
    const recommendations = document.createElement('div')
    const next = new Image()

    prev.src = _assets_images_icons_uleft_svg__WEBPACK_IMPORTED_MODULE_5__
    next.src = _assets_images_icons_right_svg__WEBPACK_IMPORTED_MODULE_4__
    prev.classList.add('u')
    container2.id = 'container2'

    prev.setAttribute('style', 'width: 50px;height: 50px;')
    next.setAttribute('style', 'width: 50px;height: 50px;')
    dots.id = 'dots'

    let a = populateRecommendations(recommendations)
    let b = a[0]
    let curr = 0
    let last = a[1]
    let num = a[2]
    for (let i = 0; i < b[curr].length; i++) {
        recommendations.appendChild(b[curr][i])
    }
    dots.innerHTML = ''
    for (let i = 0; i < Math.ceil(10 / num); i++) {
        let dot = new Image()
        if (i == curr) {
            dot.setAttribute('style', 'width: 15px;height: 15px;')
            dot.src = _assets_images_icons_sdot_svg__WEBPACK_IMPORTED_MODULE_9__
        } else {
            dot.setAttribute('style', 'width: 12px;height: 12px;')
            dot.src = _assets_images_icons_dot_svg__WEBPACK_IMPORTED_MODULE_8__
        }
        dots.appendChild(dot)
    }
    if (!hasTouch()) {
        window.addEventListener('resize', () => {
            a = populateRecommendations(recommendations)
            curr = 0
            b = a[0]
            last = a[1]
            num = a[2]
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            if (curr <= 0) {
                prev.classList.add('u')
                prev.src = _assets_images_icons_uleft_svg__WEBPACK_IMPORTED_MODULE_5__
            } else {
                prev.classList.remove('u')
                prev.src = _assets_images_icons_left_svg__WEBPACK_IMPORTED_MODULE_3__
            }
            if (curr >= last) {
                next.src = _assets_images_icons_uright_svg__WEBPACK_IMPORTED_MODULE_6__
                next.classList.add('u')
            } else {
                next.src = _assets_images_icons_right_svg__WEBPACK_IMPORTED_MODULE_4__
                next.classList.remove('u')
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10 / num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.setAttribute('style', 'width: 15px;height: 15px;')
                    dot.src = _assets_images_icons_sdot_svg__WEBPACK_IMPORTED_MODULE_9__
                } else {
                    dot.setAttribute('style', 'width: 12px;height: 12px;')
                    dot.src = _assets_images_icons_dot_svg__WEBPACK_IMPORTED_MODULE_8__
                }
                dots.appendChild(dot)
            }
        })
    }

    prev.addEventListener('click', () => {
        if (curr > 0) {
            b = populateRecommendations(recommendations)[0]
            curr--
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10 / num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.setAttribute('style', 'width: 15px;height: 15px;')
                    dot.src = _assets_images_icons_sdot_svg__WEBPACK_IMPORTED_MODULE_9__
                } else {
                    dot.setAttribute('style', 'width: 12px;height: 12px;')
                    dot.src = _assets_images_icons_dot_svg__WEBPACK_IMPORTED_MODULE_8__
                }
                dots.appendChild(dot)
            }
            next.classList.remove('u')
            next.src = _assets_images_icons_right_svg__WEBPACK_IMPORTED_MODULE_4__
            if (curr <= 0) {
                prev.classList.add('u')
                prev.src = _assets_images_icons_uleft_svg__WEBPACK_IMPORTED_MODULE_5__
            }
        }
    })

    next.addEventListener('click', () => {
        if (curr < last) {
            b = populateRecommendations(recommendations)[0]
            curr++
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10 / num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.setAttribute('style', 'width: 15px;height: 15px;')
                    dot.src = _assets_images_icons_sdot_svg__WEBPACK_IMPORTED_MODULE_9__
                } else {
                    dot.setAttribute('style', 'width: 12px;height: 12px;')
                    dot.src = _assets_images_icons_dot_svg__WEBPACK_IMPORTED_MODULE_8__
                }
                dots.appendChild(dot)
            }
            prev.classList.remove('u')
            prev.src = _assets_images_icons_left_svg__WEBPACK_IMPORTED_MODULE_3__
            if (curr >= last) {
                next.src = _assets_images_icons_uright_svg__WEBPACK_IMPORTED_MODULE_6__
                next.classList.add('u')
            }
        }
    })

    const bottominfo = document.createElement('div')
    const aboutus = document.createElement('div')
    const aboutusP = document.createElement('h2')
    const contactusP = document.createElement('h2')
    const bodyP = document.createElement('p')
    const contactinfo = document.createElement('div')
    let emailP = document.createElement('p')
    let phoneP = document.createElement('p')
    const locationdiv = document.createElement('div')
    const locationH = document.createElement('p')
    const map = document.createElement('div')
    const emaila = document.createElement('a')
    const phonen = document.createElement('a')
    emaila.href = 'amgadkamalsplash@gmail.com'
    phonen.href = 'tel:+201221045135'

    emaila.textContent = 'amgadkamalsplash@gmail.com'
    phonen.textContent = '\u200e+201221045135'

    const em = document.createElement('div')
    const pn = document.createElement('div')

    em.classList.add('empn')
    pn.classList.add('empn')
    bottominfo.id = 'bottominfo'
    aboutus.id = 'aboutus'
    contactinfo.id = 'contactinfo'
    locationdiv.id = 'map-cont'

    if (document.body.classList.contains('en')) {
        aboutusP.textContent = 'About Us'
        contactusP.textContent = 'Contact Us'
        bodyP.textContent =
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum.'
        locationH.textContent = 'Address: '
        emailP.textContent = 'Email: '
        phoneP.textContent = 'Phone Number: '
    } else {
        aboutusP.textContent = '?????????????? ??????'
        contactusP.textContent = '???????? ??????'
        bodyP.textContent =
            '?????????? ???????????? ?????????? ?????? ???????? ,?????????????????????? ???????????? ???????????? ????????????,?????? ???? ?????????????? ???????????? ???????????????? ?????????????? ???????????? ???? ?????????? ?????????? ?????????????? . ?????? ???????? ???? ?????????? ????????????,?????????? ?????????????? ?????????? ???????????? ?????????????? ?????????????? ???????? ???? ?????????????? ?????? ?????? ?????????????? ???????????????????? . ?????????? ?????????? ?????????? ?????????? ???? ???????????????????????????? ???????????????????? ???????????? ?????????? ???????????????? ?????????? ?????? ???????????? ?????????? ????????????????????. ?????????????????????? ?????????? ?????????????????? ?????????????????????? ?????? ?????????????????? ,?????????? ???? ???????????? ?????? ?????????????? ???????????????????????????? ???????? ???????? ???????? ????????????????.'
        locationH.textContent = '??????????????: '
        emailP.textContent = '???????????? ????????????????????: '
        phoneP.textContent = '?????? ????????????: '
    }

    map.innerHTML =
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d928.3980224242471!2d31.35023753591257!3d30.067931390829408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e0b0fc3d643%3A0x8d5a05fcf35f394e!2sTawfik%20Ahmed%20El-Bakry%2C%20Al%20Manteqah%20as%20Sadesah%2C%20Nasr%20City%2C%20Cairo%20Governorate%204450473!5e0!3m2!1sen!2seg!4v1678397177975!5m2!1sen!2seg" style="border:0;width: 80vw; height: 500px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" id="map"></iframe>'

    container.id = 'recommendations-container'
    prev.id = 'prev-img'
    next.id = 'next-img'
    recommendations.id = 'recommendations'

    em.append(emailP)
    em.append(emaila)
    pn.append(phoneP)
    pn.append(phonen)
    locationdiv.appendChild(locationH)
    locationdiv.appendChild(map)
    contactinfo.append(contactusP)
    contactinfo.append(em)
    contactinfo.append(pn)
    contactinfo.append(locationdiv)
    aboutus.appendChild(aboutusP)
    aboutus.appendChild(bodyP)
    bottominfo.append(aboutus)
    bottominfo.append(contactinfo)
    container.appendChild(prev)
    container.appendChild(recommendations)
    container.appendChild(next)
    container2.appendChild(container)
    container2.appendChild(dots)
    middleContainer.appendChild(container2)
    middleContainer.appendChild(bottominfo)
    flag = 'page'
    hideMenu()
}

function hideMenu() {
    menu.style.width = '0%'
}

function hasTouch() {
    return (
        'ontouchstart' in document.documentElement ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    )
}

function chooseMode(n) {
    switch (n) {
        case 1:
            return livingroomsArr
        case 2:
            return abedroomsArr
        case 3:
            return kbedroomsArr
        case 4:
            return receptionsArr
        case 5:
            return diningroomsArr
        case 6:
            return tvunitsArr
        case 7:
            return recommendationsArr
        case 8:
            return cartArr
        case -1:
            return searchArr
        default:
            break
    }
}

function chooseDetails(n) {
    switch (n) {
        case 1:
            return LivingRoomsDetails
        case 2:
            return MasterBedroomsDetails
        case 3:
            return KidsBedroomsDetails
        case 4:
            return ReceptionsDetails
        case 5:
            return DiningRoomsDetails
        case 6:
            return TVUnitsDetails
        case 7:
            return recommendationsArrDetails
        case 8:
            return cartArrDetails
        case -1:
            return searchArrDetails
        default:
            break
    }
}

function createCard(container, n, index) {
    let arr = chooseMode(n)
    let arrDetails = chooseDetails(n)
    let p_title_en = ''
    let p_title_ar = ''
    let p_price_en = ''
    let p_price_ar = ''

    const tmp = document.createElement('div')
    const info = document.createElement('div')
    const infoL = document.createElement('div')
    const cart = document.createElement('button')
    const tmpL = document.createElement('div')
    const nameP = document.createElement('p')
    const priceP = document.createElement('p')
    const hr = document.createElement('hr')
    let span = document.createElement('span')
    span.classList.add('popuptext')
    span.id = `myPopup-${index}`
    cart.classList.add('ttpopup')
    tmp.classList.add('item')
    info.classList.add('info')
    infoL.classList.add('info-left')
    const img = new Image()
    img.src = arr[`${index}.jpg`]
    p_title_en = document.createElement('p').textContent =
        products[parseInt(arrDetails[index])].product_title_en
    p_title_ar = document.createElement('p').textContent =
        products[parseInt(arrDetails[index])].product_title_ar
    p_price_en = document.createElement('p').textContent =
        products[parseInt(arrDetails[index])].product_price_en
    p_price_ar = document.createElement('p').textContent =
        products[parseInt(arrDetails[index])].product_price_ar
    if (n == 7) {
        infoL.classList.add('recommendation-info-L')
        info.classList.add('recommendation-info')
    }
    img.setAttribute('data-scale', '1.2')
    if (langBtn.value == 'english') {
        nameP.textContent = p_title_en
        cart.textContent = 'Add to Cart'
        priceP.textContent = p_price_en
        span.textContent = 'Item Added to Cart!'
    } else {
        nameP.textContent = p_title_ar
        cart.textContent = '?????????? ?????? ???????? ????????????'
        priceP.textContent = p_price_ar
        span.textContent = '?????? ?????????????? ?????? ???????? ????????????!'
    }

    cart.addEventListener('click', () => {
        addToCart(products[parseInt(arrDetails[index])].index, index)
    })

    cart.append(span)
    infoL.append(nameP)
    infoL.append(priceP)
    info.append(infoL)
    tmpL.append(hr)
    tmpL.append(info)
    tmp.append(img)
    tmp.append(tmpL)
    tmp.append(cart)
    container.append(tmp)
    return img
}

function populateItem(n, i) {
    middleContainer.innerHTML = ''
    currItem.push(n)
    currItem.push(i)
    let p_code_en = ''
    let p_code_ar = ''
    let p_dimensions_en = ''
    let p_dimensions_ar = ''
    let p_desc_en = ''
    let p_desc_ar = ''

    flag = 'item'
    let fl = false
    const item = document.createElement('div')
    const details = document.createElement('div')
    const viewItem = document.createElement('div')
    const detailsHead = document.createElement('div')
    const detailsBody = document.createElement('div')
    const desc1 = document.createElement('div')
    const desc2 = document.createElement('div')
    const desc3 = document.createElement('div')
    let img = ''

    img = createCard(item, n, i)

    let arrDetails = chooseDetails(n)

    let arr = []

    switch (n) {
        case 1:
            arr = livingroomsArrOG
            break
        case 2:
            arr = abedroomsArrOG
            break
        case 3:
            arr = kbedroomsArrOG
            break
        case 4:
            arr = receptionsArrOG
            break
        case 5:
            arr = diningroomsArrOG
            break
        case 6:
            arr = tvunitsArrOG
            break
        case 7:
            arr = recommendationsArrOG
            break
        case 8:
            arr = cartArrOG
            break
        case -1:
            arr = searchArrOG
            break
        default:
            break
    }

    p_code_en = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_code_en
    p_code_ar = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_code_ar
    p_dimensions_en = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_dimensions_en
    p_dimensions_ar = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_dimensions_ar
    p_desc_en = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_description_en
    p_desc_ar = document.createElement('p').textContent =
        products[parseInt(arrDetails[i])].product_description_ar

    img.addEventListener('click', () => {
        if (!fl) {
            const zoomedCont = document.createElement('div')
            const blurred = document.body.children
            for (let k = 0; k < blurred.length; k++) {
                blurred[k].classList.add('popup')
            }
            fl = true
            let zoomedIn = new Image()
            let x2 = new Image()
            zoomedIn.src = arr[`${i}.jpg`]
            x2.src = _assets_images_icons_x2_svg__WEBPACK_IMPORTED_MODULE_10__
            x2.setAttribute('style', 'width: 40px;height: 40px;')
            zoomedIn.classList.add('zoomed-in')
            x2.classList.add('x2')
            zoomedCont.classList.add('zoomed-container')
            zoomedCont.appendChild(zoomedIn)
            zoomedCont.appendChild(x2)
            document.body.appendChild(zoomedCont)
            x2.addEventListener('click', () => {
                fl = false
                const elements = document.getElementsByClassName('zoomed-in')
                const el = document.getElementsByClassName('x2')
                const con = document.getElementsByClassName('zoomed-container')
                elements[0].parentNode.removeChild(elements[0])
                el[0].parentNode.removeChild(el[0])
                const blurred = document.body.children
                for (let k = 0; k < blurred.length; k++) {
                    blurred[k].classList.remove('popup')
                }
                con[0].parentNode.removeChild(con[0])
            })
        }
    })

    viewItem.id = 'view-item'
    details.id = 'item-details'
    detailsHead.id = 'detailsH'
    detailsBody.id = 'detailsB'

    if (document.body.classList.contains('en')) {
        detailsHead.textContent = 'Product Details'
        desc2.textContent = p_desc_en
        desc3.textContent = p_dimensions_en
        desc1.textContent = p_code_en
    } else {
        detailsHead.textContent = '???????????? ????????????'
        desc2.textContent = p_desc_ar
        desc3.textContent = p_dimensions_ar
        desc1.textContent = p_code_ar
    }

    detailsBody.append(desc1)
    detailsBody.append(desc2)
    detailsBody.append(desc3)
    details.append(detailsHead)
    details.append(detailsBody)
    viewItem.appendChild(item)
    viewItem.appendChild(details)
    middleContainer.append(viewItem)
}

function populateGrid(n) {
    middleContainer.innerHTML = ''
    let imageArr = chooseMode(n)
    flag = 'page'
    let grid = document.createElement('div')

    grid.id = 'grid'

    showResultsCount(middleContainer, imageArr)

    for (let i = 0; i < Object.keys(imageArr).length; i++) {
        let img = createCard(grid, n, i)
        img.addEventListener('click', () => {
            populateItem(n, i)
        })
    }
    hideMenu()
    middleContainer.append(grid)
}

function populateLang() {
    navBtns.forEach((btn) => {
        if (flag == 'page') {
            if (
                btn.classList.contains('selected-page') ||
                btn.classList.contains('selected-page-dd')
            ) {
                switch (btn.id) {
                    case 'home':
                        goHome()
                        break
                    case 'livingrooms':
                        populateGrid(1)
                        break
                    case 'adults-bedrooms':
                        populateGrid(2)
                        break
                    case 'kids-bedrooms':
                        populateGrid(3)
                        break
                    case 'receptions':
                        populateGrid(4)
                        break
                    case 'diningrooms':
                        populateGrid(5)
                        break
                    case 'tvunits':
                        populateGrid(6)
                        break
                    default:
                        break
                }
            }
        } else if (flag == 'item') {
            populateItem(currItem[0], currItem[1])
        } else if (flag == 'cart') {
            populateViewCart()
        } else if (flag == 'search') {
            populateSearchResults()
        } else if (flag == 'order') {
            populateOrder()
        }
    })
}

function newSelect(button) {
    bedroomsBtn.classList.remove('selected-page')
    navBtns.forEach((btn) => {
        btn.classList.remove('selected-page')
        btn.classList.remove('selected-page-dd')
    })
    if (
        [
            homeBtn,
            livingroomsBtn,
            receptionsBtn,
            tvunitsBtn,
            diningroomsBtn,
        ].includes(button)
    ) {
        button.classList.add('selected-page')
    } else if ([abedroomsBtn, kbedroomsBtn].includes(button)) {
        button.classList.add('selected-page-dd')
        bedroomsBtn.classList.add('selected-page')
    }
    navP.forEach((btn) => {
        btn.classList.remove('selected-p')
    })
    let a = button.id
    switch (a) {
        case 'home':
            homeP.classList.add('selected-p')
            break
        case 'livingrooms':
            livingroomsP.classList.add('selected-p')
            break
        case 'adults-bedrooms':
            abedroomsP.classList.add('selected-p')
            break
        case 'kids-bedrooms':
            kbedroomsP.classList.add('selected-p')
            break
        case 'receptions':
            receptionsP.classList.add('selected-p')
            break
        case 'diningrooms':
            diningroomsP.classList.add('selected-p')
            break
        case 'tvunits':
            tvunitsP.classList.add('selected-p')
            break
        default:
            break
    }
}

function switchLang(target) {
    if (target == 'ar') {
        srch.setAttribute('placeholder', '???????? ??????..')
        ftr.textContent = '???????? ???????????? ????????????'
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i]
            btn.textContent = navAr[i]
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i]
            btn.textContent = navAr2[i]
        }
        menu.classList.remove('ens')
        menu.classList.add('ars')
        bedroomsBtn.textContent = '?????? ??????????'
        cartImg.setAttribute('title', '?????? ???????? ????????????')
    } else {
        srch.setAttribute('placeholder', 'Search here..')
        ftr.textContent = 'All Rights Reserved.'
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i]
            btn.textContent = navEn[i]
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i]
            btn.textContent = navEn2[i]
        }
        menu.classList.remove('ars')
        menu.classList.add('ens')
        bedroomsBtn.textContent = 'Bedrooms'
        cartImg.setAttribute('title', 'View Cart')
    }
}


/***/ }),

/***/ "./src/scripts/local-storage.js":
/*!**************************************!*\
  !*** ./src/scripts/local-storage.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Storage": () => (/* binding */ Storage)
/* harmony export */ });
class Storage {
    static saveCart(x, y, z, w) {
        localStorage.setItem('cartArrDetails', JSON.stringify(x))
        localStorage.setItem('cartArr', JSON.stringify(y))
        localStorage.setItem('cartArrOG', JSON.stringify(z))
        localStorage.setItem('cartIndexes', JSON.stringify(w))
    }

    static saveAddress(x) {
        localStorage.setItem('userAddress', JSON.stringify(x))
    }

    static getDetails() {
        return localStorage.getItem('cartArrDetails')
    }

    static getArr() {
        return localStorage.getItem('cartArr')
    }

    static getArrOg() {
        return localStorage.getItem('cartArrOG')
    }

    static getIndexes() {
        return localStorage.getItem('cartIndexes')
    }

    static getAddress() {
        return localStorage.getItem('userAddress')
    }
}


/***/ }),

/***/ "./src/scripts/ui.js":
/*!***************************!*\
  !*** ./src/scripts/ui.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/style.css */ "./src/styles/style.css");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./src/scripts/index.js");



_index_js__WEBPACK_IMPORTED_MODULE_1__.logoImg.id = 'logo-img'
_index_js__WEBPACK_IMPORTED_MODULE_1__.headerUp.prepend(_index_js__WEBPACK_IMPORTED_MODULE_1__.logoImg)
_index_js__WEBPACK_IMPORTED_MODULE_1__.clf.append(_index_js__WEBPACK_IMPORTED_MODULE_1__.cartImg)
_index_js__WEBPACK_IMPORTED_MODULE_1__.clf.append(_index_js__WEBPACK_IMPORTED_MODULE_1__.menuImg)
_index_js__WEBPACK_IMPORTED_MODULE_1__.actionsContainer.append(_index_js__WEBPACK_IMPORTED_MODULE_1__.clf)

if ((0,_index_js__WEBPACK_IMPORTED_MODULE_1__.hasTouch)()) {
    try {
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si]
            if (!styleSheet.rules) continue

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri)
                }
            }
        }
    } catch (ex) {
        console.log(ex)
    }
}

_index_js__WEBPACK_IMPORTED_MODULE_1__.homeBtn.addEventListener('click', () => {
    (0,_index_js__WEBPACK_IMPORTED_MODULE_1__.goHome)()
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.livingroomsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.livingroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(1)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.abedroomsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.abedroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(2)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.kbedroomsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.kbedroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(3)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.receptionsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.receptionsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(4)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.diningroomsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.diningroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(5)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.tvunitsBtn.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.tvunitsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(6)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.homeP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.goHome)()
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.livingroomsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.livingroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(1)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.abedroomsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.abedroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(2)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.kbedroomsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.kbedroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(3)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.receptionsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.receptionsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(4)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.diningroomsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.diningroomsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(5)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.tvunitsP.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.tvunitsBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateGrid)(6)
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.langBtn.addEventListener('change', () => {
    if (_index_js__WEBPACK_IMPORTED_MODULE_1__.langBtn.value == 'arabic') {
        document.body.classList.add('ar')
        document.body.classList.remove('en')
        _index_js__WEBPACK_IMPORTED_MODULE_1__.srch.setAttribute('dir', 'rtl')
        ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.switchLang)('ar')
        ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateLang)()
    } else {
        document.body.classList.add('en')
        document.body.classList.remove('ar')
        _index_js__WEBPACK_IMPORTED_MODULE_1__.srch.setAttribute('dir', 'ltr')
        ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.switchLang)('en')
        ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateLang)()
    }
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.logoImg.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.newSelect)(_index_js__WEBPACK_IMPORTED_MODULE_1__.homeBtn)
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.goHome)()
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.xImg.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.hideMenu)()
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.menuImg.addEventListener('click', () => {
    _index_js__WEBPACK_IMPORTED_MODULE_1__.menu.style.width = '100%'
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.srch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        (0,_index_js__WEBPACK_IMPORTED_MODULE_1__.searchResults)(_index_js__WEBPACK_IMPORTED_MODULE_1__.srch.value)
    }
})

_index_js__WEBPACK_IMPORTED_MODULE_1__.cartImg.addEventListener('click', () => {
    ;(0,_index_js__WEBPACK_IMPORTED_MODULE_1__.populateViewCart)()
})


/***/ }),

/***/ "./src/assets/images/icons/cart.svg":
/*!******************************************!*\
  !*** ./src/assets/images/icons/cart.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c730821562a2b458d4c7.svg";

/***/ }),

/***/ "./src/assets/images/icons/dot.svg":
/*!*****************************************!*\
  !*** ./src/assets/images/icons/dot.svg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d6b29acd6028a882773d.svg";

/***/ }),

/***/ "./src/assets/images/icons/fb.svg":
/*!****************************************!*\
  !*** ./src/assets/images/icons/fb.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2331665376bd55d4be31.svg";

/***/ }),

/***/ "./src/assets/images/icons/ig.svg":
/*!****************************************!*\
  !*** ./src/assets/images/icons/ig.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a0943643c0d5afa017fc.svg";

/***/ }),

/***/ "./src/assets/images/icons/left.svg":
/*!******************************************!*\
  !*** ./src/assets/images/icons/left.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f544e204f5b32475aeb5.svg";

/***/ }),

/***/ "./src/assets/images/icons/menu.svg":
/*!******************************************!*\
  !*** ./src/assets/images/icons/menu.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "72d490f578a38ae6135a.svg";

/***/ }),

/***/ "./src/assets/images/icons/remove-cart.svg":
/*!*************************************************!*\
  !*** ./src/assets/images/icons/remove-cart.svg ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b85698eb2e70c31bf5dc.svg";

/***/ }),

/***/ "./src/assets/images/icons/right.svg":
/*!*******************************************!*\
  !*** ./src/assets/images/icons/right.svg ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8c579dbbba3b0a766b7c.svg";

/***/ }),

/***/ "./src/assets/images/icons/sdot.svg":
/*!******************************************!*\
  !*** ./src/assets/images/icons/sdot.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cb2d25cb5c1547e970a2.svg";

/***/ }),

/***/ "./src/assets/images/icons/srch.svg":
/*!******************************************!*\
  !*** ./src/assets/images/icons/srch.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "70184bec3a3476a1904a.svg";

/***/ }),

/***/ "./src/assets/images/icons/uleft.svg":
/*!*******************************************!*\
  !*** ./src/assets/images/icons/uleft.svg ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4a60737a7804d803d965.svg";

/***/ }),

/***/ "./src/assets/images/icons/uright.svg":
/*!********************************************!*\
  !*** ./src/assets/images/icons/uright.svg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c3717605c941be2190f8.svg";

/***/ }),

/***/ "./src/assets/images/icons/wa.svg":
/*!****************************************!*\
  !*** ./src/assets/images/icons/wa.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6580dc0147b64ec46a85.svg";

/***/ }),

/***/ "./src/assets/images/icons/x.svg":
/*!***************************************!*\
  !*** ./src/assets/images/icons/x.svg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f8cce9d8e61785e46719.svg";

/***/ }),

/***/ "./src/assets/images/icons/x2.svg":
/*!****************************************!*\
  !*** ./src/assets/images/icons/x2.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8a7fc1bff957368a6fb0.svg";

/***/ }),

/***/ "./src/assets/images/pictures/logo.jpg":
/*!*********************************************!*\
  !*** ./src/assets/images/pictures/logo.jpg ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5d62b8efa233cf5b25a4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/diningrooms/0.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/diningrooms/0.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/diningrooms/1.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/diningrooms/1.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/livingrooms/0.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/livingrooms/0.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/receptions/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/receptions/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/0.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/0.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "025cf5475d3548a237d0.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/1.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/1.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "025cf5475d3548a237d0.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/diningrooms/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/diningrooms/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/diningrooms/1.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/diningrooms/1.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/livingrooms/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/livingrooms/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/receptions/0.jpg":
/*!***********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/receptions/0.jpg ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "421890401a3de0740dc3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/0.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/0.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "025cf5475d3548a237d0.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/1.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/1.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "025cf5475d3548a237d0.jpg";

/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customAlphabet": () => (/* binding */ customAlphabet),
/* harmony export */   "customRandom": () => (/* binding */ customRandom),
/* harmony export */   "nanoid": () => (/* binding */ nanoid),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "urlAlphabet": () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./node_modules/nanoid/url-alphabet/index.js");

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')


/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlAlphabet": () => (/* binding */ urlAlphabet)
/* harmony export */ });
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'


/***/ }),

/***/ "./src/scripts/db.json":
/*!*****************************!*\
  !*** ./src/scripts/db.json ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Products":[{"p_id":"M22","product_code_en":"- ID: M22","product_code_ar":"- ?????? ????????????:  M22","product_title_en":"Brown TV Unit","product_title_ar":"???????? ?????????? ??????","product_description_en":"- Details: The TV unit is made of imported high-quality LPL wood, glued with high-quality melamine synthetic veneer, with impact-resistant PVC board.","product_description_ar":"- ????????????????: ???????? ?????????????????? ???????????? ???? ?????? LPL ???????????? ???????? ???????????? ?? ???????????? ?????????? ?????????????????? ???????????????????? ?????????? ???????????? ?? ???? ?????? PVC ?????????????? ??????????????.","product_price_en":"5000 EGP","product_price_ar":"5000 ??.??","product_price":5000,"product_dimensions_en":"- Dimensions: 200 x 190","product_dimensions_ar":"- ??????????????: ???200 x 190","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/0.jpg","recommended":1,"index":0},{"p_id":"M01","product_code_en":"- ID: M01","product_code_ar":"- ?????? ????????????:  M01","product_title_en":"Test","product_title_ar":"t","product_description_en":"- Details: t","product_description_ar":"- ????????????????: t","product_price_en":"100 EGP","product_price_ar":"100 ??.??","product_price":100,"product_dimensions_en":"- Dimensions: 300","product_dimensions_ar":"- ??????????????: ???300","product_type":"Livingrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/livingrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/livingrooms/0.jpg","recommended":1,"index":1},{"p_id":"M04","product_code_en":"- ID: M04","product_code_ar":"- ?????? ????????????:  M04","product_title_en":"Test","product_title_ar":"t","product_description_en":"- Details: t","product_description_ar":"- ????????????????: t","product_price_en":"4000 EGP","product_price_ar":"4000 ??.??","product_price":4000,"product_dimensions_en":"- Dimensions: t","product_dimensions_ar":"- ??????????????: ???t","product_type":"Receptions","product_img_path_displayed":"src/assets/images/pictures/products/displayed/receptions/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/receptions/0.jpg","recommended":1,"index":2},{"p_id":"M44","product_code_en":"- ID: M44","product_code_ar":"- ?????? ????????????:  M44","product_title_en":"EJEJ","product_title_ar":"EJEJ","product_description_en":"- Details: EJEJ","product_description_ar":"- ????????????????: EJEJ","product_price_en":"2222 EGP","product_price_ar":"2222 ??.??","product_price":2222,"product_dimensions_en":"- Dimensions: EJEJ","product_dimensions_ar":"- ??????????????: ???EJEJ","product_type":"Diningrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/diningrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/diningrooms/0.jpg","recommended":1,"index":3},{"p_id":"M42","product_code_en":"- ID: M42","product_code_ar":"- ?????? ????????????:  M42","product_title_en":"EJEJ","product_title_ar":"EJEJ","product_description_en":"- Details: EJEJ","product_description_ar":"- ????????????????: EJEJ","product_price_en":"3222 EGP","product_price_ar":"3222 ??.??","product_price":3222,"product_dimensions_en":"- Dimensions: EJEJ","product_dimensions_ar":"- ??????????????: ???EJEJ","product_type":"Diningrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/diningrooms/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/diningrooms/1.jpg","recommended":1,"index":4},{"p_id":"M500","product_code_en":"- ID: M500","product_code_ar":"- ?????? ????????????:  M500","product_title_en":"as","product_title_ar":"as","product_description_en":"- Details: as","product_description_ar":"- ????????????????: as","product_price_en":"22 EGP","product_price_ar":"22 ??.??","product_price":22,"product_dimensions_en":"- Dimensions: as","product_dimensions_ar":"- ??????????????: ???as","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/1.jpg","recommended":0,"index":5}],"Orders":[]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/scripts/ui.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFVBQVU7QUFDdkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFVBQVUsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxLQUFLLEtBQUssVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFVBQVUsS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFdBQVcsV0FBVyxLQUFLLE1BQU0sVUFBVSxXQUFXLEtBQUssTUFBTSxVQUFVLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssS0FBSyxXQUFXLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsS0FBSyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssTUFBTSxVQUFVLEtBQUssS0FBSyxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsT0FBTyxLQUFLLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxZQUFZLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLEtBQUssS0FBSyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFlBQVksV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLE1BQU0sTUFBTSxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFNBQVMsS0FBSyxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFlBQVksWUFBWSxXQUFXLFlBQVksWUFBWSxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsWUFBWSxZQUFZLFVBQVUsWUFBWSxXQUFXLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxXQUFXLFVBQVUsTUFBTSxLQUFLLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssVUFBVSxVQUFVLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLFVBQVUsV0FBVyxVQUFVLFlBQVksYUFBYSxZQUFZLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLFdBQVcsVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFlBQVksYUFBYSxZQUFZLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsVUFBVSxZQUFZLFlBQVksV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsV0FBVyxLQUFLLEtBQUssS0FBSyxLQUFLLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxXQUFXLEtBQUssS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsWUFBWSxZQUFZLFdBQVcsV0FBVyxZQUFZLE1BQU0sTUFBTSxVQUFVLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxZQUFZLFdBQVcsVUFBVSxXQUFXLE1BQU0sS0FBSyxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsV0FBVyxZQUFZLFlBQVksVUFBVSxVQUFVLFVBQVUsS0FBSyxLQUFLLFVBQVUsV0FBVyxZQUFZLFlBQVksS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxZQUFZLFdBQVcsS0FBSyxLQUFLLFVBQVUsS0FBSyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxZQUFZLGFBQWEsV0FBVyxVQUFVLFdBQVcsS0FBSyxPQUFPLFlBQVksVUFBVSxLQUFLLEtBQUssV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxhQUFhLGFBQWEsV0FBVyxVQUFVLFdBQVcsS0FBSyxLQUFLLFlBQVksV0FBVyxXQUFXLFlBQVksWUFBWSxXQUFXLFVBQVUsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsWUFBWSxhQUFhLFVBQVUsVUFBVSxXQUFXLE1BQU0sS0FBSyxZQUFZLFVBQVUsYUFBYSxPQUFPLEtBQUssV0FBVyxPQUFPLEtBQUssWUFBWSxXQUFXLGFBQWEsT0FBTyxLQUFLLFdBQVcsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLFdBQVcsYUFBYSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsVUFBVSxhQUFhLGFBQWEsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFlBQVksVUFBVSxXQUFXLFdBQVcsV0FBVyxVQUFVLGFBQWEsWUFBWSxXQUFXLFdBQVcsV0FBVyxNQUFNLE1BQU0sVUFBVSxhQUFhLFlBQVksTUFBTSxLQUFLLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxhQUFhLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFdBQVcsV0FBVyxXQUFXLE9BQU8sS0FBSyxXQUFXLFdBQVcsVUFBVSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsYUFBYSxhQUFhLFdBQVcsV0FBVyxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxNQUFNLFdBQVcsT0FBTyxLQUFLLFlBQVksVUFBVSxXQUFXLGFBQWEsWUFBWSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLFlBQVksYUFBYSxXQUFXLFdBQVcsT0FBTyxLQUFLLFdBQVcsV0FBVyxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFdBQVcsYUFBYSxhQUFhLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLGFBQWEsYUFBYSxXQUFXLGFBQWEsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFlBQVksVUFBVSxhQUFhLGFBQWEsVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFdBQVcsVUFBVSxVQUFVLFNBQVMsS0FBSyxNQUFNLEtBQUssVUFBVSxXQUFXLFdBQVcsT0FBTyxLQUFLLFlBQVksV0FBVyxhQUFhLFlBQVksVUFBVSxPQUFPLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE9BQU8sS0FBSyxXQUFXLFdBQVcsYUFBYSxhQUFhLFVBQVUsVUFBVSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksVUFBVSxPQUFPLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxZQUFZLFVBQVUsVUFBVSxVQUFVLGFBQWEsYUFBYSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxNQUFNLFlBQVksWUFBWSxVQUFVLFdBQVcsV0FBVyxhQUFhLGFBQWEsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxhQUFhLE1BQU0sTUFBTSxhQUFhLFVBQVUsVUFBVSxXQUFXLGFBQWEsYUFBYSxZQUFZLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxhQUFhLFlBQVksT0FBTyxLQUFLLE1BQU0sV0FBVyxLQUFLLE1BQU0sV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLE1BQU0sV0FBVyxLQUFLLE1BQU0sS0FBSyxNQUFNLFdBQVcsWUFBWSxhQUFhLFdBQVcsTUFBTSxNQUFNLFlBQVksV0FBVyxZQUFZLE9BQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLE1BQU0sYUFBYSxPQUFPLE1BQU0sS0FBSyxPQUFPLGFBQWEsT0FBTyxLQUFLLFVBQVUsS0FBSyxNQUFNLFlBQVksS0FBSyxLQUFLLFdBQVcsS0FBSyxNQUFNLFlBQVksV0FBVyxhQUFhLE9BQU8sS0FBSyxhQUFhLGFBQWEsV0FBVyxVQUFVLE1BQU0sTUFBTSxVQUFVLEtBQUssS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLGFBQWEsS0FBSyxLQUFLLFdBQVcsV0FBVyxVQUFVLE1BQU0sTUFBTSxXQUFXLEtBQUssS0FBSyxXQUFXLFVBQVUsYUFBYSxhQUFhLFdBQVcsS0FBSyxNQUFNLFdBQVcsV0FBVyxXQUFXLFlBQVksS0FBSyxPQUFPLGFBQWEsV0FBVyxLQUFLLE9BQU8sYUFBYSxLQUFLLEtBQUssY0FBYyxPQUFPLEtBQUssV0FBVyxhQUFhLGFBQWEsS0FBSyxLQUFLLFdBQVcsYUFBYSxPQUFPLE1BQU0sYUFBYSxPQUFPLEtBQUssYUFBYSxZQUFZLFVBQVUsTUFBTSxNQUFNLFVBQVUsYUFBYSxNQUFNLEtBQUssV0FBVyxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sVUFBVSxNQUFNLEtBQUssWUFBWSxN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QUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTs7QUFFQTtBQUNBLHlEQUF5RDtBQUN6RCxJQUFJOztBQUVKOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCcUQ7QUFDQztBQUNBO0FBQ0Q7QUFDQztBQUNDO0FBQ0M7QUFDUDtBQUNFO0FBQ0U7QUFDSjtBQUNhO0FBQ3JCOztBQUVLO0FBQ0E7QUFDQTtBQUNwQjs7QUFFdUM7QUFDbEM7QUFDL0Isa0JBQWtCLG1CQUFPLENBQUMsNERBQWtCOztBQUU1QyxlQUFlLCtDQUFXOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVAsY0FBYyw2REFBSTtBQUNsQixjQUFjLDBEQUFRO0FBQ3RCLGNBQWMsMERBQVE7QUFDdEIsV0FBVyx1REFBTTtBQUNqQixZQUFZLHlEQUFFO0FBQ2QsWUFBWSx5REFBRTtBQUNkLFlBQVkseURBQUU7O0FBRWQ7QUFDQTtBQUNBLGlCQUFpQixjQUFjLGdDQUFnQztBQUMvRDtBQUNBLDJDQUEyQyxhQUFhO0FBQ3hELHdDQUF3QyxhQUFhOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1AsSUFBSSwrR0FJQztBQUNMO0FBQ087QUFDUCxJQUFJLG1IQUlDO0FBQ0w7QUFDTztBQUNQLElBQUksaUhBSUM7QUFDTDtBQUNPO0FBQ1AsSUFBSSw4R0FJQztBQUNMO0FBQ087QUFDUCxJQUFJLDJHQUlDO0FBQ0w7QUFDTztBQUNQLElBQUksK0dBSUM7QUFDTDs7QUFFTztBQUNQLElBQUksOEdBSUM7QUFDTDtBQUNPO0FBQ1AsSUFBSSxrSEFJQztBQUNMO0FBQ087QUFDUCxJQUFJLGdIQUlDO0FBQ0w7QUFDTztBQUNQLElBQUksNkdBSUM7QUFDTDtBQUNPO0FBQ1AsSUFBSSwwR0FJQztBQUNMO0FBQ087QUFDUCxJQUFJLDhHQUlDO0FBQ0w7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUywrREFBa0I7QUFDM0IsU0FBUywyREFBYztBQUN2QixTQUFTLDZEQUFnQjtBQUN6QixTQUFTLCtEQUFrQjtBQUMzQixTQUFTLCtEQUFrQjs7QUFFM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsNkVBQWE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSSxHQUFHLEdBQUc7QUFDaEQsd0NBQXdDLElBQUksR0FBRyxHQUFHO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxJQUFJLEdBQUcsR0FBRztBQUNoRCx3Q0FBd0MsSUFBSSxHQUFHLEdBQUc7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLElBQUksR0FBRyxHQUFHO0FBQ2hELHdDQUF3QyxJQUFJLEdBQUcsR0FBRztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSSxHQUFHLEdBQUc7QUFDaEQsd0NBQXdDLElBQUksR0FBRyxHQUFHO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxJQUFJLEdBQUcsR0FBRztBQUNoRCx3Q0FBd0MsSUFBSSxHQUFHLEdBQUc7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLElBQUksR0FBRyxHQUFHO0FBQ2hELHdDQUF3QyxJQUFJLEdBQUcsR0FBRztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLGdFQUFtQjtBQUMzQjtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLG9CQUFvQjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxhQUFhLHVEQUFNO0FBQ25CLDBDQUEwQyxhQUFhO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixvQkFBb0I7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7QUFDQSxLQUFLOztBQUVMLG9EQUFvRDs7QUFFcEQ7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVPO0FBQ1AsSUFBSSxrREFBYztBQUNsQjtBQUNBLFlBQVksc0NBQUU7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0NBQW9DO0FBQ3ZEO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVPO0FBQ1A7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTLEtBQUssSUFBSTtBQUNuQyxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELEdBQUc7QUFDdkQ7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EscURBQXFELEdBQUc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDZEQUFnQjs7QUFFNUI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxrQkFBa0I7QUFDdkU7QUFDQTtBQUNBLHFEQUFxRCxzQkFBc0I7QUFDM0U7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsSUFBSTtBQUNoRDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGtCQUFrQjtBQUMxRTtBQUNBO0FBQ0EscURBQXFELHNCQUFzQjtBQUMzRTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxJQUFJO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0IsK0NBQU07QUFDMUIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLEtBQUs7QUFDeEMscUNBQXFDLEtBQUs7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxLQUFLO0FBQ3hDLHFDQUFxQyxLQUFLO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsS0FBSztBQUN4QyxxQ0FBcUMsS0FBSztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLEtBQUs7QUFDeEMscUNBQXFDLEtBQUs7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxLQUFLO0FBQ3hDLHFDQUFxQyxLQUFLO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsS0FBSztBQUN4QyxxQ0FBcUMsS0FBSztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0IsaUNBQWlDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixrRUFBUztBQUNyQyx5REFBeUQsYUFBYTs7QUFFdEU7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLElBQUksdURBQXVEO0FBQzVFO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLGlCQUFpQixJQUFJLHVEQUF1RDtBQUM1RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxFQUFFO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBLGtDQUFrQyxFQUFFO0FBQ3BDLG9DQUFvQyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFEQUFxRCxHQUFHO0FBQ3hEO0FBQ0EsVUFBVTtBQUNWLHNEQUFzRCxHQUFHO0FBQ3pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksNkRBQWdCO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFNBQVMsS0FBSztBQUN4QixNQUFNO0FBQ047QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsRUFBRSxJQUFJO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLHVCQUF1Qiw2RUFBYTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsTUFBTSxHQUFHLEdBQUc7QUFDckMsMkJBQTJCLE1BQU0sR0FBRyxHQUFHO0FBQ3ZDO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixNQUFNLEdBQUcsR0FBRztBQUNyQywyQkFBMkIsTUFBTSxHQUFHLEdBQUc7QUFDdkM7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLE1BQU0sR0FBRyxHQUFHO0FBQ3JDLDJCQUEyQixNQUFNLEdBQUcsR0FBRztBQUN2QztBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsTUFBTSxHQUFHLEdBQUc7QUFDckMsMkJBQTJCLE1BQU0sR0FBRyxHQUFHO0FBQ3ZDO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixNQUFNLEdBQUcsR0FBRztBQUNyQywyQkFBMkIsTUFBTSxHQUFHLEdBQUc7QUFDdkM7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLE1BQU0sR0FBRyxHQUFHO0FBQ3JDLDJCQUEyQixNQUFNLEdBQUcsR0FBRztBQUN2QztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUNBQW1DO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQSwrQkFBK0Isb0JBQW9CO0FBQ25ELDREQUE0RCxFQUFFO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsMkRBQVE7QUFDdkIsZUFBZSwyREFBTztBQUN0QjtBQUNBOztBQUVBLDRDQUE0QyxhQUFhO0FBQ3pELDRDQUE0QyxhQUFhO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isb0JBQW9CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQTtBQUNBLG1EQUFtRCxhQUFhO0FBQ2hFLHNCQUFzQiwwREFBTztBQUM3QixVQUFVO0FBQ1YsbURBQW1ELGFBQWE7QUFDaEUsc0JBQXNCLHlEQUFNO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwyREFBUTtBQUNuQyxjQUFjO0FBQ2Q7QUFDQSwyQkFBMkIsMERBQU87QUFDbEM7QUFDQTtBQUNBLDJCQUEyQiw0REFBUTtBQUNuQztBQUNBLGNBQWM7QUFDZCwyQkFBMkIsMkRBQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHlCQUF5QjtBQUNyRDtBQUNBO0FBQ0EsMkRBQTJELGFBQWE7QUFDeEUsOEJBQThCLDBEQUFPO0FBQ3JDLGtCQUFrQjtBQUNsQiwyREFBMkQsYUFBYTtBQUN4RSw4QkFBOEIseURBQU07QUFDcEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUJBQXlCO0FBQ3JEO0FBQ0E7QUFDQSwyREFBMkQsYUFBYTtBQUN4RSw4QkFBOEIsMERBQU87QUFDckMsa0JBQWtCO0FBQ2xCLDJEQUEyRCxhQUFhO0FBQ3hFLDhCQUE4Qix5REFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwyREFBTztBQUM5QjtBQUNBO0FBQ0EsMkJBQTJCLDJEQUFRO0FBQ25DO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUJBQXlCO0FBQ3JEO0FBQ0E7QUFDQSwyREFBMkQsYUFBYTtBQUN4RSw4QkFBOEIsMERBQU87QUFDckMsa0JBQWtCO0FBQ2xCLDJEQUEyRCxhQUFhO0FBQ3hFLDhCQUE4Qix5REFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwREFBTztBQUM5QjtBQUNBLDJCQUEyQiw0REFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9aQUFvWixhQUFhLGNBQWM7O0FBRS9hO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixNQUFNO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsTUFBTTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0JBQW9CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsRUFBRTtBQUNwQyxxQkFBcUIseURBQUs7QUFDMUIsa0RBQWtELGFBQWE7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxvQkFBb0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsb0JBQW9CLGtDQUFrQztBQUN0RDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixvQkFBb0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3Q1RE87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDL0I0QjtBQW1DVDs7QUFFbkIsaURBQVU7QUFDVix1REFBZ0IsQ0FBQyw4Q0FBTztBQUN4QixpREFBVSxDQUFDLDhDQUFPO0FBQ2xCLGlEQUFVLENBQUMsOENBQU87QUFDbEIsOERBQXVCLENBQUMsMENBQUc7O0FBRTNCLElBQUksbURBQVE7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1REFBdUQsU0FBUztBQUNoRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQSwrREFBd0I7QUFDeEIsSUFBSSxpREFBTTtBQUNWLENBQUM7O0FBRUQsc0VBQStCO0FBQy9CLElBQUkscURBQVMsQ0FBQyxxREFBYztBQUM1QixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQsb0VBQTZCO0FBQzdCLElBQUkscURBQVMsQ0FBQyxtREFBWTtBQUMxQixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQsb0VBQTZCO0FBQzdCLElBQUkscURBQVMsQ0FBQyxtREFBWTtBQUMxQixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQscUVBQThCO0FBQzlCLElBQUkscURBQVMsQ0FBQyxvREFBYTtBQUMzQixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQsc0VBQStCO0FBQy9CLElBQUkscURBQVMsQ0FBQyxxREFBYztBQUM1QixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQsa0VBQTJCO0FBQzNCLElBQUkscURBQVMsQ0FBQyxpREFBVTtBQUN4QixJQUFJLHdEQUFZO0FBQ2hCLENBQUM7O0FBRUQsNkRBQXNCO0FBQ3RCLElBQUksa0RBQU07QUFDVixDQUFDOztBQUVELG9FQUE2QjtBQUM3QixJQUFJLHFEQUFTLENBQUMscURBQWM7QUFDNUIsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELGtFQUEyQjtBQUMzQixJQUFJLHFEQUFTLENBQUMsbURBQVk7QUFDMUIsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELGtFQUEyQjtBQUMzQixJQUFJLHFEQUFTLENBQUMsbURBQVk7QUFDMUIsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELG1FQUE0QjtBQUM1QixJQUFJLHFEQUFTLENBQUMsb0RBQWE7QUFDM0IsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELG9FQUE2QjtBQUM3QixJQUFJLHFEQUFTLENBQUMscURBQWM7QUFDNUIsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELGdFQUF5QjtBQUN6QixJQUFJLHFEQUFTLENBQUMsaURBQVU7QUFDeEIsSUFBSSx3REFBWTtBQUNoQixDQUFDOztBQUVELCtEQUF3QjtBQUN4QixRQUFRLG9EQUFhO0FBQ3JCO0FBQ0E7QUFDQSxRQUFRLHdEQUFpQjtBQUN6QixRQUFRLHNEQUFVO0FBQ2xCLFFBQVEsd0RBQVk7QUFDcEIsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRLHdEQUFpQjtBQUN6QixRQUFRLHNEQUFVO0FBQ2xCLFFBQVEsd0RBQVk7QUFDcEI7QUFDQSxDQUFDOztBQUVELCtEQUF3QjtBQUN4QixJQUFJLHFEQUFTLENBQUMsOENBQU87QUFDckIsSUFBSSxrREFBTTtBQUNWLENBQUM7O0FBRUQsNERBQXFCO0FBQ3JCLElBQUksb0RBQVE7QUFDWixDQUFDOztBQUVELCtEQUF3QjtBQUN4QixJQUFJLHVEQUFnQjtBQUNwQixDQUFDOztBQUVELDREQUFxQjtBQUNyQjtBQUNBLFFBQVEsd0RBQWEsQ0FBQyxpREFBVTtBQUNoQztBQUNBLENBQUM7O0FBRUQsK0RBQXdCO0FBQ3hCLElBQUksNERBQWdCO0FBQ3BCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdktvRDtBQUM5QztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ0k7QUFDUCIsInNvdXJjZXMiOlsid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9pbmRleC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAvc3JjL2hlYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwL3NyYy9tYXhIZWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9zcmMvbWluSGVhcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL2luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvcHJpb3JpdHktcXVldWUvc3JjL21heFByaW9yaXR5UXVldWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZS9zcmMvbWluUHJpb3JpdHlRdWV1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL3NyYy9wcmlvcml0eVF1ZXVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2xvbmUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1NldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVSZWdFeHAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVUeXBlZEFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9scy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFZhbHVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZU9iamVjdC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZWRlZXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5c0luLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzP2ZmOTQiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9kaW5pbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvbGl2aW5ncm9vbXMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3JlY2VwdGlvbnMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXIvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZGluaW5ncm9vbXMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvbGl2aW5ncm9vbXMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zY3JpcHRzL2xvY2FsLXN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL3NjcmlwdHMvdWkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnLi9zcmMvaGVhcCcpO1xuY29uc3QgeyBNaW5IZWFwIH0gPSByZXF1aXJlKCcuL3NyYy9taW5IZWFwJyk7XG5jb25zdCB7IE1heEhlYXAgfSA9IHJlcXVpcmUoJy4vc3JjL21heEhlYXAnKTtcblxuZXhwb3J0cy5IZWFwID0gSGVhcDtcbmV4cG9ydHMuTWluSGVhcCA9IE1pbkhlYXA7XG5leHBvcnRzLk1heEhlYXAgPSBNYXhIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcGFyYW0ge2FycmF5fSBbX3ZhbHVlc11cbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gW19sZWFmXVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29tcGFyZSwgX3ZhbHVlcywgX2xlYWYpIHtcbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhcCBjb25zdHJ1Y3RvciBleHBlY3RzIGEgY29tcGFyZSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9jb21wYXJlID0gY29tcGFyZTtcbiAgICB0aGlzLl9ub2RlcyA9IEFycmF5LmlzQXJyYXkoX3ZhbHVlcykgPyBfdmFsdWVzIDogW107XG4gICAgdGhpcy5fbGVhZiA9IF9sZWFmIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGhlYXAgdG8gYSBjbG9uZWQgYXJyYXkgd2l0aG91dCBzb3J0aW5nLlxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fbm9kZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBhcmVudCBoYXMgYSBsZWZ0IGNoaWxkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSB7XG4gICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDE7XG4gICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4IDwgdGhpcy5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcGFyZW50IGhhcyBhIHJpZ2h0IGNoaWxkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkge1xuICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcbiAgICByZXR1cm4gcmlnaHRDaGlsZEluZGV4IDwgdGhpcy5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdHdvIG5vZGVzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGFyZUF0KGksIGopIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZSh0aGlzLl9ub2Rlc1tpXSwgdGhpcy5fbm9kZXNbal0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN3YXBzIHR3byBub2RlcyBpbiB0aGUgaGVhcFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3N3YXAoaSwgaikge1xuICAgIGNvbnN0IHRlbXAgPSB0aGlzLl9ub2Rlc1tpXTtcbiAgICB0aGlzLl9ub2Rlc1tpXSA9IHRoaXMuX25vZGVzW2pdO1xuICAgIHRoaXMuX25vZGVzW2pdID0gdGVtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgcGFyZW50IGFuZCBjaGlsZCBzaG91bGQgYmUgc3dhcHBlZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpIHtcbiAgICBpZiAocGFyZW50SW5kZXggPCAwIHx8IHBhcmVudEluZGV4ID49IHRoaXMuc2l6ZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkSW5kZXggPCAwIHx8IGNoaWxkSW5kZXggPj0gdGhpcy5zaXplKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSA+IDA7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgY2hpbGRyZW4gb2YgYSBwYXJlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQ2hpbGRyZW5PZihwYXJlbnRJbmRleCkge1xuICAgIGlmICghdGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSAmJiAhdGhpcy5faGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG5cbiAgICBpZiAoIXRoaXMuX2hhc0xlZnRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgIHJldHVybiByaWdodENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4O1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBhcmUgPSB0aGlzLl9jb21wYXJlQXQobGVmdENoaWxkSW5kZXgsIHJpZ2h0Q2hpbGRJbmRleCk7XG4gICAgcmV0dXJuIGNvbXBhcmUgPiAwID8gcmlnaHRDaGlsZEluZGV4IDogbGVmdENoaWxkSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdHdvIGNoaWxkcmVuIGJlZm9yZSBhIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGFyZUNoaWxkcmVuQmVmb3JlKGluZGV4LCBsZWZ0Q2hpbGRJbmRleCwgcmlnaHRDaGlsZEluZGV4KSB7XG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmVBdChyaWdodENoaWxkSW5kZXgsIGxlZnRDaGlsZEluZGV4KTtcblxuICAgIGlmIChjb21wYXJlIDw9IDAgJiYgcmlnaHRDaGlsZEluZGV4IDwgaW5kZXgpIHtcbiAgICAgIHJldHVybiByaWdodENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGJ1YmJsZXMgdXAgYSBub2RlIGlmIGl0J3MgaW4gYSB3cm9uZyBwb3NpdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hlYXBpZnlVcChzdGFydEluZGV4KSB7XG4gICAgbGV0IGNoaWxkSW5kZXggPSBzdGFydEluZGV4O1xuICAgIGxldCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoKGNoaWxkSW5kZXggLSAxKSAvIDIpO1xuXG4gICAgd2hpbGUgKHRoaXMuX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpKSB7XG4gICAgICB0aGlzLl9zd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KTtcbiAgICAgIGNoaWxkSW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgIHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoY2hpbGRJbmRleCAtIDEpIC8gMik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGJ1YmJsZXMgZG93biBhIG5vZGUgaWYgaXQncyBpbiBhIHdyb25nIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeURvd24oc3RhcnRJbmRleCkge1xuICAgIGxldCBwYXJlbnRJbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IGNoaWxkSW5kZXggPSB0aGlzLl9jb21wYXJlQ2hpbGRyZW5PZihwYXJlbnRJbmRleCk7XG5cbiAgICB3aGlsZSAodGhpcy5fc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkpIHtcbiAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgcGFyZW50SW5kZXggPSBjaGlsZEluZGV4O1xuICAgICAgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyBkb3duIGEgbm9kZSBiZWZvcmUgYSBnaXZlbiBpbmRleFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hlYXBpZnlEb3duVW50aWwoaW5kZXgpIHtcbiAgICBsZXQgcGFyZW50SW5kZXggPSAwO1xuICAgIGxldCBsZWZ0Q2hpbGRJbmRleCA9IDE7XG4gICAgbGV0IHJpZ2h0Q2hpbGRJbmRleCA9IDI7XG4gICAgbGV0IGNoaWxkSW5kZXg7XG5cbiAgICB3aGlsZSAobGVmdENoaWxkSW5kZXggPCBpbmRleCkge1xuICAgICAgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbkJlZm9yZShcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIGxlZnRDaGlsZEluZGV4LFxuICAgICAgICByaWdodENoaWxkSW5kZXhcbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLl9zaG91bGRTd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSkge1xuICAgICAgICB0aGlzLl9zd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50SW5kZXggPSBjaGlsZEluZGV4O1xuICAgICAgbGVmdENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDE7XG4gICAgICByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fbm9kZXMucHVzaCh2YWx1ZSk7XG4gICAgdGhpcy5faGVhcGlmeVVwKHRoaXMuc2l6ZSgpIC0gMSk7XG4gICAgaWYgKHRoaXMuX2xlYWYgPT09IG51bGwgfHwgdGhpcy5fY29tcGFyZSh2YWx1ZSwgdGhpcy5fbGVhZikgPiAwKSB7XG4gICAgICB0aGlzLl9sZWFmID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgcHVzaCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZXh0cmFjdFJvb3QoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5yb290KCk7XG4gICAgdGhpcy5fbm9kZXNbMF0gPSB0aGlzLl9ub2Rlc1t0aGlzLnNpemUoKSAtIDFdO1xuICAgIHRoaXMuX25vZGVzLnBvcCgpO1xuICAgIHRoaXMuX2hlYXBpZnlEb3duKDApO1xuXG4gICAgaWYgKHJvb3QgPT09IHRoaXMuX2xlYWYpIHtcbiAgICAgIHRoaXMuX2xlYWYgPSB0aGlzLnJvb3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGhlYXAgc29ydCBhbmQgcmV0dXJuIHRoZSB2YWx1ZXMgc29ydGVkIGJ5IHByaW9yaXR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2FycmF5fVxuICAgKi9cbiAgc29ydCgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5zaXplKCkgLSAxOyBpID4gMDsgaSAtPSAxKSB7XG4gICAgICB0aGlzLl9zd2FwKDAsIGkpO1xuICAgICAgdGhpcy5faGVhcGlmeURvd25VbnRpbChpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpeGVzIG5vZGUgcG9zaXRpb25zIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBmaXgoKSB7XG4gICAgLy8gZml4IG5vZGUgcG9zaXRpb25zXG4gICAgZm9yIChsZXQgaSA9IE1hdGguZmxvb3IodGhpcy5zaXplKCkgLyAyKSAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICB0aGlzLl9oZWFwaWZ5RG93bihpKTtcbiAgICB9XG5cbiAgICAvLyBmaXggbGVhZiB2YWx1ZVxuICAgIGZvciAobGV0IGkgPSBNYXRoLmZsb29yKHRoaXMuc2l6ZSgpIC8gMik7IGkgPCB0aGlzLnNpemUoKTsgaSArPSAxKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX25vZGVzW2ldO1xuICAgICAgaWYgKHRoaXMuX2xlYWYgPT09IG51bGwgfHwgdGhpcy5fY29tcGFyZSh2YWx1ZSwgdGhpcy5fbGVhZikgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xlYWYgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IGFsbCBoZWFwIG5vZGVzIGFyZSBpbiB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVmFsaWQoKSB7XG4gICAgY29uc3QgaXNWYWxpZFJlY3Vyc2l2ZSA9IChwYXJlbnRJbmRleCkgPT4ge1xuICAgICAgbGV0IGlzVmFsaWRMZWZ0ID0gdHJ1ZTtcbiAgICAgIGxldCBpc1ZhbGlkUmlnaHQgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmVBdChwYXJlbnRJbmRleCwgbGVmdENoaWxkSW5kZXgpID4gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1ZhbGlkTGVmdCA9IGlzVmFsaWRSZWN1cnNpdmUobGVmdENoaWxkSW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAyO1xuICAgICAgICBpZiAodGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCByaWdodENoaWxkSW5kZXgpID4gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1ZhbGlkUmlnaHQgPSBpc1ZhbGlkUmVjdXJzaXZlKHJpZ2h0Q2hpbGRJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc1ZhbGlkTGVmdCAmJiBpc1ZhbGlkUmlnaHQ7XG4gICAgfTtcblxuICAgIHJldHVybiBpc1ZhbGlkUmVjdXJzaXZlKDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaGFsbG93IGNvcHkgb2YgdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgSGVhcCh0aGlzLl9jb21wYXJlLCB0aGlzLl9ub2Rlcy5zbGljZSgpLCB0aGlzLl9sZWFmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICByb290KCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25vZGVzWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxlYWYgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGxlYWYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xlYWY7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGhlYXAgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9ub2RlcyA9IFtdO1xuICAgIHRoaXMuX2xlYWYgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIGhlYXAgZnJvbSBhIGFycmF5IG9mIHZhbHVlc1xuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBzdGF0aWMgaGVhcGlmeSh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheSBvZiB2YWx1ZXMnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhcC5oZWFwaWZ5IGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBIZWFwKGNvbXBhcmUsIHZhbHVlcykuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgbGlzdCBvZiB2YWx1ZXMgaXMgYSB2YWxpZCBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICByZXR1cm4gbmV3IEhlYXAoY29tcGFyZSwgdmFsdWVzKS5pc1ZhbGlkKCk7XG4gIH1cbn1cblxuZXhwb3J0cy5IZWFwID0gSGVhcDtcbiIsIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICovXG5cbmNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnLi9oZWFwJyk7XG5cbmNvbnN0IGdldE1heENvbXBhcmUgPSAoZ2V0Q29tcGFyZVZhbHVlKSA9PiAoYSwgYikgPT4ge1xuICBjb25zdCBhVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShhKSA6IGE7XG4gIGNvbnN0IGJWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGIpIDogYjtcbiAgcmV0dXJuIGFWYWwgPCBiVmFsID8gMSA6IC0xO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgTWF4SGVhcFxuICogQGV4dGVuZHMgSGVhcFxuICovXG5jbGFzcyBNYXhIZWFwIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEBwYXJhbSB7SGVhcH0gW19oZWFwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2V0Q29tcGFyZVZhbHVlLCBfaGVhcCkge1xuICAgIHRoaXMuX2dldENvbXBhcmVWYWx1ZSA9IGdldENvbXBhcmVWYWx1ZTtcbiAgICB0aGlzLl9oZWFwID0gX2hlYXAgfHwgbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIGluc2VydCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgaGVhcCB0byBhIGNsb25lZCBhcnJheSB3aXRob3V0IHNvcnRpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9oZWFwLl9ub2Rlcyk7XG4gIH1cblxuICAvKipcbiAgICogRml4ZXMgbm9kZSBwb3NpdGlvbnMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIGZpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IGFsbCBoZWFwIG5vZGVzIGFyZSBpbiB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHJvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxlYWYgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGxlYWYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGhlYXAgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNFbXB0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNoYWxsb3cgY29weSBvZiB0aGUgTWF4SGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBNYXhIZWFwKHRoaXMuX2dldENvbXBhcmVWYWx1ZSwgdGhpcy5faGVhcC5jbG9uZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBNYXhIZWFwIGZyb20gYW4gYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIHN0YXRpYyBoZWFwaWZ5KHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF4SGVhcC5oZWFwaWZ5IGV4cGVjdHMgYW4gYXJyYXknKTtcbiAgICB9XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1heENvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1heEhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBsaXN0IG9mIHZhbHVlcyBpcyBhIHZhbGlkIG1heCBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNIZWFwaWZpZWQodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmlzVmFsaWQoKTtcbiAgfVxufVxuXG5leHBvcnRzLk1heEhlYXAgPSBNYXhIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKi9cblxuY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL2hlYXAnKTtcblxuY29uc3QgZ2V0TWluQ29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAtMSA6IDE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNaW5IZWFwXG4gKiBAZXh0ZW5kcyBIZWFwXG4gKi9cbmNsYXNzIE1pbkhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHBhcmFtIHtIZWFwfSBbX2hlYXBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgdGhpcy5fZ2V0Q29tcGFyZVZhbHVlID0gZ2V0Q29tcGFyZVZhbHVlO1xuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBoZWFwIHRvIGEgY2xvbmVkIGFycmF5IHdpdGhvdXQgc29ydGluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2hlYXAuX25vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluSGVhcH1cbiAgICovXG4gIGluc2VydCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXhlcyBub2RlIHBvc2l0aW9ucyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgZml4KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc1ZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBNaW5IZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IE1pbkhlYXAodGhpcy5fZ2V0Q29tcGFyZVZhbHVlLCB0aGlzLl9oZWFwLmNsb25lKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIE1pbkhlYXAgZnJvbSBhbiBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgc3RhdGljIGhlYXBpZnkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5IZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheScpO1xuICAgIH1cbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWluQ29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWluSGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGxpc3Qgb2YgdmFsdWVzIGlzIGEgdmFsaWQgbWluIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuaXNWYWxpZCgpO1xuICB9XG59XG5cbmV4cG9ydHMuTWluSGVhcCA9IE1pbkhlYXA7XG4iLCJjb25zdCB7IE1pblByaW9yaXR5UXVldWUgfSA9IHJlcXVpcmUoJy4vc3JjL21pblByaW9yaXR5UXVldWUnKTtcbmNvbnN0IHsgTWF4UHJpb3JpdHlRdWV1ZSB9ID0gcmVxdWlyZSgnLi9zcmMvbWF4UHJpb3JpdHlRdWV1ZScpO1xuY29uc3QgeyBQcmlvcml0eVF1ZXVlIH0gPSByZXF1aXJlKCcuL3NyYy9wcmlvcml0eVF1ZXVlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7IE1pblByaW9yaXR5UXVldWUsIE1heFByaW9yaXR5UXVldWUsIFByaW9yaXR5UXVldWUgfTtcbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbmNvbnN0IHsgSGVhcCwgTWF4SGVhcCB9ID0gcmVxdWlyZSgnQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAnKTtcblxuY29uc3QgZ2V0TWF4Q29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAxIDogLTE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNYXhQcmlvcml0eVF1ZXVlXG4gKiBAZXh0ZW5kcyBNYXhIZWFwXG4gKi9cbmNsYXNzIE1heFByaW9yaXR5UXVldWUge1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgaWYgKGdldENvbXBhcmVWYWx1ZSAmJiB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01heFByaW9yaXR5UXVldWUgY29uc3RydWN0b3IgcmVxdWlyZXMgYSBjYWxsYmFjayBmb3Igb2JqZWN0IHZhbHVlcycpO1xuICAgIH1cbiAgICB0aGlzLl9oZWFwID0gX2hlYXAgfHwgbmV3IE1heEhlYXAoZ2V0Q29tcGFyZVZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGZyb250KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBsb3dlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgYmFjaygpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHZhbHVlIHRvIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgZW5xdWV1ZSh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHZhbHVlIHRvIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgcHVzaCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmVucXVldWUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZGVxdWV1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmRlcXVldWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgcXVldWUgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNFbXB0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5faGVhcC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzb3J0ZWQgbGlzdCBvZiBlbGVtZW50cyBmcm9tIGhpZ2hlc3QgdG8gbG93ZXN0IHByaW9yaXR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5jbG9uZSgpLnNvcnQoKS5yZXZlcnNlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgbWluIHByaW9yaXR5IHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWUgZnJvbSBhbiBleGlzdGluZyBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBzdGF0aWMgZnJvbUFycmF5KHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1heENvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1heFByaW9yaXR5UXVldWUoXG4gICAgICBnZXRDb21wYXJlVmFsdWUsXG4gICAgICBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnRzLk1heFByaW9yaXR5UXVldWUgPSBNYXhQcmlvcml0eVF1ZXVlO1xuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuY29uc3QgeyBIZWFwLCBNaW5IZWFwIH0gPSByZXF1aXJlKCdAZGF0YXN0cnVjdHVyZXMtanMvaGVhcCcpO1xuXG5jb25zdCBnZXRNaW5Db21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IC0xIDogMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1pblByaW9yaXR5UXVldWVcbiAqL1xuY2xhc3MgTWluUHJpb3JpdHlRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICBpZiAoZ2V0Q29tcGFyZVZhbHVlICYmIHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWluUHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNhbGxiYWNrIGZvciBvYmplY3QgdmFsdWVzJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgTWluSGVhcChnZXRDb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01pblByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01pblByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBtaW4gcHJpb3JpdHkgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZSBmcm9tIGFuIGV4aXN0aW5nIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHN0YXRpYyBmcm9tQXJyYXkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWluQ29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWluUHJpb3JpdHlRdWV1ZShcbiAgICAgIGdldENvbXBhcmVWYWx1ZSxcbiAgICAgIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KClcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydHMuTWluUHJpb3JpdHlRdWV1ZSA9IE1pblByaW9yaXR5UXVldWU7XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG5jb25zdCB7IEhlYXAgfSA9IHJlcXVpcmUoJ0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwJyk7XG5cbi8qKlxuICogQGNsYXNzIFByaW9yaXR5UXVldWVcbiAqL1xuY2xhc3MgUHJpb3JpdHlRdWV1ZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWVcbiAgICogQHBhcmFtcyB7ZnVuY3Rpb259IGNvbXBhcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmUsIF92YWx1ZXMpIHtcbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciBleHBlY3RzIGEgY29tcGFyZSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9oZWFwID0gbmV3IEhlYXAoY29tcGFyZSwgX3ZhbHVlcyk7XG4gICAgaWYgKF92YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2hlYXAuZml4KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByaW9yaXR5IHF1ZXVlIGZyb20gYW4gZXhpc3RpbmcgYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgc3RhdGljIGZyb21BcnJheSh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICByZXR1cm4gbmV3IFByaW9yaXR5UXVldWUoY29tcGFyZSwgdmFsdWVzKTtcbiAgfVxufVxuXG5leHBvcnRzLlByaW9yaXR5UXVldWUgPSBQcmlvcml0eVF1ZXVlO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvc3JjaC5zdmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJib2R5LmVuIHtcXG4gICAgLS1mbGV4LXJvdy1kaXJlY3Rpb246IHJvdztcXG4gICAgLS1mbGV4LXMtZTogZmxleC1zdGFydDtcXG4gICAgLS1wb3MtaWNvbjogOTglO1xcbiAgICAtLWRpcmVjdGlvbjogbHRyO1xcbiAgICAtLXNsaWRlOiAxMDAlO1xcbiAgICAtLXRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbmJvZHkuYXIge1xcbiAgICAtLWZsZXgtcm93LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XFxuICAgIC0tZmxleC1zLWU6IGZsZXgtZW5kO1xcbiAgICAtLXBvcy1pY29uOiAyJTtcXG4gICAgLS1kaXJlY3Rpb246IHJ0bDtcXG4gICAgLS1zbGlkZTogLTEwMCU7XFxuICAgIC0tdGV4dC1hbGlnbjogcmlnaHQ7XFxufVxcblxcbmh0bWwsXFxuYm9keSB7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBwYWRkaW5nOiAwJTtcXG4gICAgbWFyZ2luOiAwJTtcXG4gICAgLS1saWdodC1jb2xvcjogI2RmZTNlODtcXG59XFxuXFxuYm9keSB7XFxuICAgIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuYm9keSBpbWcge1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuaW1nOmhvdmVyOmFmdGVyIHtcXG4gICAgY29udGVudDogYXR0cihkYXRhKTtcXG4gICAgcGFkZGluZzogNHB4IDhweDtcXG4gICAgYm9yZGVyOiAxcHggYmxhY2sgc29saWQ7XFxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgbGVmdDogMDtcXG4gICAgdG9wOiAxMDAlO1xcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICB6LWluZGV4OiAyO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxufVxcblxcbi5mYWRlIHtcXG4gICAgYW5pbWF0aW9uLW5hbWU6IGZhZGU7XFxuICAgIGFuaW1hdGlvbi1kdXJhdGlvbjogMS41cztcXG59XFxuXFxuLnpvb20ge1xcbiAgICBmaWx0ZXI6IGJsdXIoMjBweCk7XFxuICAgIC13ZWJraXQtZmlsdGVyOiBibHVyKDEwcHgpO1xcbn1cXG5cXG4uem9vbWVkLWNvbnRhaW5lciB7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgdG9wOiA1MCU7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICAgLW8tdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIHotaW5kZXg6IDE7XFxufVxcblxcbi56b29tZWQtaW4ge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIG1heC1oZWlnaHQ6IDUwMHB4O1xcbiAgICB3aWR0aDogYXV0bztcXG4gICAgdG9wOiA1MCU7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgIC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICAgLW8tdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxufVxcblxcbi5zdXBkaXYge1xcbiAgICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQgIWltcG9ydGFudDtcXG59XFxuXFxuI2RvdHMge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmFzdHIge1xcbiAgICBtYXJnaW46IDAlO1xcbiAgICBwYWRkaW5nOiAwJTtcXG4gICAgY29sb3I6IHJlZDtcXG59XFxuXFxuI3N1Y2Nlc3MtbWVzc2FnZSB7XFxuICAgIHdpZHRoOiA2MCU7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1jb2xvcik7XFxuICAgIGRpcmVjdGlvbjogdmFyKC0tZGlyZWN0aW9uKTtcXG4gICAgcGFkZGluZzogMWVtO1xcbiAgICBtYXJnaW4tdG9wOiAwJTtcXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG4jc3VjY2Vzcy1tZXNzYWdlIGJ1dHRvbiB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMTE4Mjc7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBmbGV4OiAwIDAgYXV0bztcXG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcXG4gICAgcGFkZGluZzogMC43NXJlbSAxLjJyZW07XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lICM2YjcyODAgc29saWQ7XFxuICAgIHRleHQtZGVjb3JhdGlvbi10aGlja25lc3M6IGF1dG87XFxuICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XFxuICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IGJhY2tncm91bmQtY29sb3IsIGJvcmRlci1jb2xvciwgY29sb3IsIGZpbGwsIHN0cm9rZTtcXG4gICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG4jc3VjY2Vzcy1tZXNzYWdlIGJ1dHRvbjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMzNzQxNTE7XFxufVxcbiNzdWNjZXNzLW1lc3NhZ2UgYnV0dG9uOmZvY3VzIHtcXG4gICAgYm94LXNoYWRvdzogbm9uZTtcXG4gICAgb3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xcbn1cXG4jc3VjY2Vzcy1tZXNzYWdlIHAge1xcbiAgICBmb250LXdlaWdodDogNTAwO1xcbiAgICBmb250LXNpemU6IDE4cHg7XFxufVxcblxcbiNvcmRlci1tYWluIHtcXG4gICAgd2lkdGg6IDYwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWNvbG9yKTtcXG4gICAgZGlyZWN0aW9uOiB2YXIoLS1kaXJlY3Rpb24pO1xcbiAgICBwYWRkaW5nOiAxZW07XFxuICAgIG1hcmdpbi10b3A6IDAlO1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcbiNvcmRlci1tYWluIGJ1dHRvbiB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMTE4Mjc7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBmbGV4OiAwIDAgYXV0bztcXG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcXG4gICAgcGFkZGluZzogMC43NXJlbSAxLjJyZW07XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lICM2YjcyODAgc29saWQ7XFxuICAgIHRleHQtZGVjb3JhdGlvbi10aGlja25lc3M6IGF1dG87XFxuICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XFxuICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IGJhY2tncm91bmQtY29sb3IsIGJvcmRlci1jb2xvciwgY29sb3IsIGZpbGwsIHN0cm9rZTtcXG4gICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG4jb3JkZXItbWFpbiBidXR0b246aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzc0MTUxO1xcbn1cXG4jb3JkZXItbWFpbiBidXR0b246Zm9jdXMge1xcbiAgICBib3gtc2hhZG93OiBub25lO1xcbiAgICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XFxufVxcbiNvcmRlci1tYWluICNvcmRlci1hZGRyZXNzLWNvbnQge1xcbiAgICB3aWR0aDogNzUlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcbn1cXG4jb3JkZXItbWFpbiAjb3JkZXItYWRkcmVzcy1jb250IHAge1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgaGVpZ2h0OiBmaXQtY29udGVudDtcXG4gICAgbWFyZ2luOiAxMHB4O1xcbn1cXG4jb3JkZXItbWFpbiAjb3JkZXItcHJpY2UtY29udCB7XFxuICAgIHdpZHRoOiA3NSU7XFxuICAgIGhlaWdodDogMTYwcHg7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcbiNvcmRlci1tYWluICNvcmRlci1wcmljZS1jb250IHAge1xcbiAgICBtYXJnaW46IDVweDtcXG59XFxuI29yZGVyLW1haW4gI29yZGVyLXByaWNlLWNvbnQgcDpmaXJzdC1jaGlsZCB7XFxuICAgIGJvcmRlcjogIzExMTgyNyAycHggc29saWQ7XFxuICAgIHBhZGRpbmc6IDVweDtcXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG4jb3JkZXItbWFpbiAjb3JkZXItcHJpY2UtY29udCAjZ3JheS10ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcbiAgICBjb2xvcjogZ3JheTtcXG59XFxuXFxuZm9ybSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWNvbG9yKTtcXG4gICAgd2lkdGg6IDYwdnc7XFxuICAgIGhlaWdodDogODB2aDtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgcGFkZGluZzogMWVtO1xcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAyMHB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDIwcHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAyMHB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAyMHB4O1xcbiAgICB6LWluZGV4OiAxMDAxO1xcbiAgICB0b3A6IDUwJTtcXG4gICAgbGVmdDogNTAlO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG59XFxuZm9ybSBsYWJlbCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxufVxcbmZvcm0gZGl2IHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHZhcigtLWZsZXgtcm93LWRpcmVjdGlvbik7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAyNSU7XFxufVxcbmZvcm0gI3gzIHtcXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIG1hcmdpbi1yaWdodDogYXV0bztcXG4gICAgcGFkZGluZzogMCU7XFxufVxcbmZvcm0gI3gzOmhvdmVyIHtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5mb3JtIGxhYmVsIHtcXG4gICAgZm9udC1zaXplOiAxLjJyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XFxufVxcbmZvcm0gLnRocmVlIGxhYmVsLFxcbmZvcm0gLnRocmVlIGlucHV0IHtcXG4gICAgd2lkdGg6IDI1JTtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5mb3JtIC50d28gbGFiZWwsXFxuZm9ybSAudHdvIGlucHV0IHtcXG4gICAgd2lkdGg6IDM1JTtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5mb3JtIGlucHV0IHtcXG4gICAgaGVpZ2h0OiAyNHB4O1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgcGFkZGluZzogNXB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIGJvcmRlcjogYmxhY2sgMnB4IHNvbGlkO1xcbn1cXG5mb3JtIGJ1dHRvbiB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMTE4Mjc7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBmbGV4OiAwIDAgYXV0bztcXG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcXG4gICAgcGFkZGluZzogMC43NXJlbSAxLjJyZW07XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lICM2YjcyODAgc29saWQ7XFxuICAgIHRleHQtZGVjb3JhdGlvbi10aGlja25lc3M6IGF1dG87XFxuICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XFxuICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IGJhY2tncm91bmQtY29sb3IsIGJvcmRlci1jb2xvciwgY29sb3IsIGZpbGwsIHN0cm9rZTtcXG4gICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcXG4gICAgd2lkdGg6IDIwMHB4O1xcbn1cXG5mb3JtIGJ1dHRvbjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMzNzQxNTE7XFxufVxcbmZvcm0gYnV0dG9uOmZvY3VzIHtcXG4gICAgYm94LXNoYWRvdzogbm9uZTtcXG4gICAgb3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xcbn1cXG5cXG5pbnB1dDo6cGxhY2Vob2xkZXIge1xcbiAgICBmb250LXNpemU6IDAuNzFyZW07XFxufVxcblxcbi54MiB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1JTtcXG4gICAgbGVmdDogNSU7XFxufVxcblxcbi54Mjpob3ZlciB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnBvcHVwIHtcXG4gICAgZmlsdGVyOiBibHVyKDIwcHgpO1xcbiAgICAtd2Via2l0LWZpbHRlcjogYmx1cigyMHB4KTtcXG59XFxuXFxuQGtleWZyYW1lcyBmYWRlIHtcXG4gICAgZnJvbSB7XFxuICAgICAgICBvcGFjaXR5OiAwLjQ7XFxuICAgIH1cXG4gICAgdG8ge1xcbiAgICAgICAgb3BhY2l0eTogMTtcXG4gICAgfVxcbn1cXG4udSB7XFxuICAgIGN1cnNvcjogZGVmYXVsdCAhaW1wb3J0YW50O1xcbn1cXG5cXG4jY29udGFpbmVyMiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuI3JlY29tbWVuZGF0aW9ucy1jb250YWluZXIge1xcbiAgICB3aWR0aDogOTIlO1xcbiAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuI3JlY29tbWVuZGF0aW9ucy1jb250YWluZXIgI3ByZXYtaW1nLFxcbiNyZWNvbW1lbmRhdGlvbnMtY29udGFpbmVyICNuZXh0LWltZyB7XFxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIHRvdWNoLWFjdGlvbjogbWFuaXB1bGF0aW9uO1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcHJldi1pbWc6aG92ZXIsXFxuI3JlY29tbWVuZGF0aW9ucy1jb250YWluZXIgI25leHQtaW1nOmhvdmVyIHtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIHtcXG4gICAgaGVpZ2h0OiA0MnZoO1xcbiAgICBwYWRkaW5nOiAwcHggMjVweCAwcHggMjVweDtcXG4gICAgd2lkdGg6IDY4dnc7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBnYXA6IDFlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIC5pdGVtIHtcXG4gICAgcGFkZGluZzogNXB4O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWNvbG9yKTtcXG4gICAgbWF4LXdpZHRoOiAyMDBweDtcXG4gICAgaGVpZ2h0OiAyNTBweDtcXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIC5pdGVtIGRpdiB7XFxuICAgIGZvbnQtc2l6ZTogMTZweCAhaW1wb3J0YW50O1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIC5pdGVtIGltZyB7XFxuICAgIG1heC13aWR0aDogMTgwcHg7XFxuICAgIG1heC1oZWlnaHQ6IDEyMHB4O1xcbn1cXG4jcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIC5pdGVtIGJ1dHRvbiB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNtYWluLWNvbnRhaW5lciB7XFxuICAgIG1pbi1oZWlnaHQ6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4jaGVhZGVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGQ0ZDc5O1xcbiAgICBib3gtc2hhZG93OiAwcHggM3B4IDEwcHggYmxhY2s7XFxuICAgIHBvc2l0aW9uOiBzdGlja3k7XFxuICAgIHRvcDogMDtcXG4gICAgei1pbmRleDogMTAwMDtcXG59XFxuXFxuI2hlYWRlci11cHBlciB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBtaW4taGVpZ2h0OiBmaXQtY29udGVudDtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHZhcigtLWZsZXgtcm93LWRpcmVjdGlvbik7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4jbWVudS5zbGlkZSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKHZhcigtLXNsaWRlKSk7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUodmFyKC0tc2xpZGUpKTtcXG4gICAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZSh2YXIoLS1zbGlkZSkpO1xcbiAgICAtbXMtdHJhbnNmb3JtOiB0cmFuc2xhdGUodmFyKC0tc2xpZGUpKTtcXG4gICAgLW8tdHJhbnNmb3JtOiB0cmFuc2xhdGUodmFyKC0tc2xpZGUpKTtcXG59XFxuXFxuLmVucyB7XFxuICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcXG59XFxuXFxuLmFycyB7XFxuICAgIHJpZ2h0OiAwICFpbXBvcnRhbnQ7XFxufVxcblxcbi5lbXB0eS1jYXJ0LW1haW4ge1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4jY2FydC1lbXB0eSB7XFxuICAgIGZvbnQtc2l6ZTogMjZweCAhaW1wb3J0YW50O1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxufVxcblxcbiNjYXJ0LW1haW4ge1xcbiAgICBwYWRkaW5nOiAxZW07XFxuICAgIG1hcmdpbi10b3A6IDAlO1xcbiAgICB3aWR0aDogNjAlO1xcbiAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1jb2xvcik7XFxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW1vei1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW8tYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuI2NhcnQtbWFpbiBidXR0b24ge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExODI3O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgY29sb3I6ICNmZmZmZmY7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgZmxleDogMCAwIGF1dG87XFxuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjVyZW07XFxuICAgIHBhZGRpbmc6IDAuNzVyZW0gMS4ycmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZSAjNmI3MjgwIHNvbGlkO1xcbiAgICB0ZXh0LWRlY29yYXRpb24tdGhpY2tuZXNzOiBhdXRvO1xcbiAgICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgICB0cmFuc2l0aW9uLXByb3BlcnR5OiBiYWNrZ3JvdW5kLWNvbG9yLCBib3JkZXItY29sb3IsIGNvbG9yLCBmaWxsLCBzdHJva2U7XFxuICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XFxuICAgIHdpZHRoOiBhdXRvO1xcbn1cXG4jY2FydC1tYWluIGJ1dHRvbjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMzNzQxNTE7XFxufVxcbiNjYXJ0LW1haW4gYnV0dG9uOmZvY3VzIHtcXG4gICAgYm94LXNoYWRvdzogbm9uZTtcXG4gICAgb3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xcbn1cXG4jY2FydC1tYWluICNjYXJ0LWhlYWRlciB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiB2YXIoLS1mbGV4LXJvdy1kaXJlY3Rpb24pO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcbiNjYXJ0LW1haW4gI2NhcnQtaGVhZGVyIHAge1xcbiAgICBtYXJnaW46IDAlO1xcbiAgICBwYWRkaW5nOiAwJTtcXG4gICAgdGV4dC1hbGlnbjogdmFyKC0tdGV4dC1hbGlnbik7XFxufVxcbiNjYXJ0LW1haW4gI2NhcnQtaGVhZGVyIC50aXQge1xcbiAgICB3aWR0aDogNzUlO1xcbn1cXG4jY2FydC1tYWluICNjYXJ0LWhlYWRlciAucXBoIHtcXG4gICAgd2lkdGg6IDI1JTtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1taWQge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcbn1cXG4jY2FydC1tYWluICNjYXJ0LW1pZCAuY2FydC1pdGVtIHtcXG4gICAgZGlyZWN0aW9uOiB2YXIoLS1kaXJlY3Rpb24pO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxNTBweDtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQtY29sb3IpO1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcbiNjYXJ0LW1haW4gI2NhcnQtbWlkIC5jYXJ0LWl0ZW0gaW1nOmhvdmVyIHtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4jY2FydC1tYWluICNjYXJ0LW1pZCAuY2FydC1pdGVtIC5jYXJ0LWl0ZW0taW1nIHtcXG4gICAgbWF4LXdpZHRoOiAxMDBweDtcXG4gICAgbWF4LWhlaWdodDogMTAwcHg7XFxufVxcbiNjYXJ0LW1haW4gI2NhcnQtbWlkIC5jYXJ0LWl0ZW0gcCB7XFxuICAgIHRleHQtYWxpZ246IHZhcigtLXRleHQtYWxpZ24pO1xcbiAgICBtYXJnaW46IDAlO1xcbiAgICBwYWRkaW5nOiAwJTtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1taWQgLmNhcnQtaXRlbSAucXAge1xcbiAgICB3aWR0aDogMjUlO1xcbiAgICBsaW5lLWhlaWdodDogMTUwcHg7XFxufVxcbiNjYXJ0LW1haW4gI2NhcnQtbWlkIC5jYXJ0LWl0ZW0gc3BhbiB7XFxuICAgIHdpZHRoOiA3NSU7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBtYXJnaW46IDAlO1xcbiAgICBwYWRkaW5nOiAwJTtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1taWQgLmNhcnQtaXRlbSBzcGFuIHAge1xcbiAgICB3aWR0aDogNTAlO1xcbiAgICB0ZXh0LWFsaWduOiB2YXIoLS10ZXh0LWFsaWduKTtcXG4gICAgbWFyZ2luOiA1cHg7XFxuICAgIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxuICAgIGRpcmVjdGlvbjogdmFyKC0tZGlyZWN0aW9uKTtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1taWQgLmNhcnQtaXRlbSBkaXYge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1taWQgLmNhcnQtaXRlbSBkaXYgaW1nIHtcXG4gICAgaGVpZ2h0OiAyMHB4O1xcbn1cXG4jY2FydC1tYWluICNjYXJ0LWZvb3RlciB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI2NhcnQtbWFpbiAjY2FydC1mb290ZXIgI2NhcnQtdG90YWwtcHJpY2Uge1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICAgIG1hcmdpbjogMCU7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICAgIHBhZGRpbmc6IDRweCAxMHB4IDRweCAxMHB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi5obGMge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYm9yZGVyOiAwcHg7XFxuICAgIGhlaWdodDogMXB4O1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXFxuICAgICAgICB0byByaWdodCxcXG4gICAgICAgIHJnYmEoMCwgMCwgMCwgMCksXFxuICAgICAgICByZ2JhKDAsIDAsIDAsIDAuNzUpLFxcbiAgICAgICAgcmdiYSgwLCAwLCAwLCAwKVxcbiAgICApO1xcbn1cXG5cXG4jbWVudSB7XFxuICAgIHdpZHRoOiAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHotaW5kZXg6IDEwMDE7XFxuICAgIHRvcDogMDtcXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogdmFyKC0tZmxleC1yb3ctZGlyZWN0aW9uKTtcXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgdHJhbnNpdGlvbjogMC41cztcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjVzO1xcbiAgICAtbW96LXRyYW5zaXRpb246IDAuNXM7XFxuICAgIC1tcy10cmFuc2l0aW9uOiAwLjVzO1xcbiAgICAtby10cmFuc2l0aW9uOiAwLjVzO1xcbn1cXG4jbWVudSBpbWcge1xcbiAgICBtYXJnaW46IDMwcHg7XFxufVxcbiNtZW51IGltZzpob3ZlciB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuI21lbnUgZGl2IHtcXG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgICBoZWlnaHQ6IDgwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xcbiAgICBhbGlnbi1pdGVtczogdmFyKC0tZmxleC1zLWUpO1xcbn1cXG4jbWVudSBwIHtcXG4gICAgZm9udC1zaXplOiAyNHB4O1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG4gICAgcGFkZGluZzogMHB4IDEwcHggMHB4IDEwcHg7XFxuICAgIGNvbG9yOiAjMDAwO1xcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICBtYXJnaW46IDhweDtcXG59XFxuI21lbnUgcDpob3ZlciB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnNlbGVjdGVkLXAge1xcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcXG4gICAgZm9udC13ZWlnaHQ6IDkwMCAhaW1wb3J0YW50O1xcbn1cXG5cXG4jbG9nby1pbWcge1xcbiAgICB3aWR0aDogMjUlO1xcbiAgICBtaW4td2lkdGg6IDM0MHB4O1xcbiAgICBqdXN0aWZ5LXNlbGY6IGZsZXgtc3RhcnQ7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuZm9vdGVyIHtcXG4gICAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwZDRkNzk7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgaGVpZ2h0OiA2MHB4O1xcbn1cXG5mb290ZXIgcCB7XFxuICAgIG1hcmdpbjogMC40ZW07XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuZm9vdGVyIHAgYTp2aXNpdGVkIHtcXG4gICAgY29sb3I6IHdoaXRlO1xcbn1cXG5mb290ZXIgcCBhOmhvdmVyIHtcXG4gICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4udHRwb3B1cCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgei1pbmRleDogMDtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIGRpcmVjdGlvbjogdmFyKC0tZGlyZWN0aW9uKTtcXG59XFxuXFxuLnR0cG9wdXAgLnBvcHVwdGV4dCB7XFxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gICAgd2lkdGg6IDE2MHB4O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTU1O1xcbiAgICBjb2xvcjogI2ZmZjtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XFxuICAgIHBhZGRpbmc6IDhweCAwO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHotaW5kZXg6IDE7XFxuICAgIGJvdHRvbTogMTI1JTtcXG4gICAgbGVmdDogNTAlO1xcbiAgICBtYXJnaW4tbGVmdDogLTgwcHg7XFxufVxcblxcbiNub3RpZiB7XFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGZvbnQtc2l6ZTogbWVkaXVtO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gICAgd2lkdGg6IDgwJTtcXG4gICAgaGVpZ2h0OiA3NXB4O1xcbiAgICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XFxufVxcblxcbi50dHBvcHVwIC5wb3B1cHRleHQ6OmFmdGVyIHtcXG4gICAgY29udGVudDogJyc7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAxMDAlO1xcbiAgICBsZWZ0OiA1MCU7XFxuICAgIG1hcmdpbi1sZWZ0OiAtNXB4O1xcbiAgICBib3JkZXItd2lkdGg6IDVweDtcXG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gICAgYm9yZGVyLWNvbG9yOiAjNTU1IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4udHRwb3B1cCAuc2hvdyB7XFxuICAgIGFuaW1hdGlvbjogZmFkZUluIDFzO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogZmFkZUluIDFzO1xcbn1cXG5cXG4udHRwb3B1cCAuaGlkZSB7XFxuICAgIGFuaW1hdGlvbjogZmFkZU91dCAxcztcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGZhZGVPdXQgMXM7XFxufVxcblxcbkBrZXlmcmFtZXMgZmFkZUluIHtcXG4gICAgZnJvbSB7XFxuICAgICAgICBvcGFjaXR5OiAwO1xcbiAgICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgICB9XFxuICAgIHRvIHtcXG4gICAgICAgIG9wYWNpdHk6IDE7XFxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xcbiAgICB9XFxufVxcbkBrZXlmcmFtZXMgZmFkZU91dCB7XFxuICAgIGZyb20ge1xcbiAgICAgICAgb3BhY2l0eTogMTtcXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2libGU7XFxuICAgIH1cXG4gICAgdG8ge1xcbiAgICAgICAgb3BhY2l0eTogMDtcXG4gICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gICAgfVxcbn1cXG4uaWNvbi1iYXIge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHRvcDogNTAlO1xcbiAgICByaWdodDogMSU7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTQwJSk7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE0MCUpO1xcbiAgICAtbW96LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNDAlKTtcXG4gICAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNDAlKTtcXG4gICAgLW8tdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE0MCUpO1xcbn1cXG4uaWNvbi1iYXIgYSxcXG4uaWNvbi1iYXIgaW1nIHtcXG4gICAgd2lkdGg6IDM1cHg7XFxufVxcbi5pY29uLWJhciBhOmhvdmVyIHtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5pbnB1dFt0eXBlPSdzZWFyY2gnXSB7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZThmMDtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKTtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogdmFyKC0tcG9zLWljb24pO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDI1cHg7XFxuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICAgIGJvcmRlci1yYWRpdXM6IDJ2bWluO1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDJ2bWluO1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDJ2bWluO1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogMnZtaW47XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDJ2bWluO1xcbiAgICBoZWlnaHQ6IDUuNXZoO1xcbiAgICBtaW4td2lkdGg6IDUwMHB4O1xcbiAgICBwYWRkaW5nOiAxOHB4O1xcbiAgICBtYXJnaW46IDEwcHg7XFxuICAgIGp1c3RpZnktc2VsZjogZmxleC1zdGFydDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nc2VhcmNoJ106OmFmdGVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZThmMDtcXG4gICAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG5pbnB1dFt0eXBlPSdzZWFyY2gnXTpmb2N1cyxcXG5zZWxlY3Q6Zm9jdXMge1xcbiAgICBib3JkZXI6IDFweCBibHVlIHNvbGlkO1xcbiAgICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4jbGduIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIG1pbi13aWR0aDogZml0LWNvbnRlbnQ7XFxuICAgIGhlaWdodDogODAlO1xcbn1cXG5cXG4jYWN0aW9ucy1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogdmFyKC0tZmxleC1yb3ctZGlyZWN0aW9uKTtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgd2lkdGg6IDIwJTtcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG4jYWN0aW9ucy1jb250YWluZXIgZGl2IHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG4jYWN0aW9ucy1jb250YWluZXIgZGl2IGltZyB7XFxuICAgIG1hcmdpbjogMTBweDtcXG59XFxuI2FjdGlvbnMtY29udGFpbmVyIHNlbGVjdCB7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzBkNGQ3OTtcXG4gICAgYm9yZGVyLXJhZGl1czogMnZtaW47XFxuICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMnZtaW47XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMnZtaW47XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAydm1pbjtcXG4gICAgLW8tYm9yZGVyLXJhZGl1czogMnZtaW47XFxuICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICAgIHdpZHRoOiBhdXRvO1xcbiAgICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCAxMHB4O1xcbiAgICBtYXJnaW4tYm90dG9tOiA2cHg7XFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlO1xcbiAgICBjb2xvcjogd2hpdGU7XFxufVxcbiNhY3Rpb25zLWNvbnRhaW5lciBzZWxlY3Q6aG92ZXIge1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbiNhY3Rpb25zLWNvbnRhaW5lciBpbnB1dFt0eXBlPSdlbWFpbCddLFxcbiNhY3Rpb25zLWNvbnRhaW5lciBpbnB1dFt0eXBlPSdwYXNzd29yZCddIHtcXG4gICAgYm9yZGVyOiBub25lO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJlOGYwO1xcbiAgICBib3JkZXItcmFkaXVzOiAydm1pbjtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAydm1pbjtcXG4gICAgLW1vei1ib3JkZXItcmFkaXVzOiAydm1pbjtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDJ2bWluO1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAydm1pbjtcXG4gICAgaGVpZ2h0OiBtYXgtY29udGVudDtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBhZGRpbmc6IDEwcHggMTVweCAxMHB4IDE1cHg7XFxufVxcbiNhY3Rpb25zLWNvbnRhaW5lciBzZWxlY3Q6OmFmdGVyLFxcbiNhY3Rpb25zLWNvbnRhaW5lciBpbnB1dFt0eXBlPSdlbWFpbCddOjphZnRlcixcXG4jYWN0aW9ucy1jb250YWluZXIgaW5wdXRbdHlwZT0ncGFzc3dvcmQnXTo6YWZ0ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgICBib3JkZXI6IDBweDtcXG59XFxuI2FjdGlvbnMtY29udGFpbmVyIGltZyB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIGVhc2UtaW4tb3V0IDQwMG1zO1xcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IHRyYW5zZm9ybSBlYXNlLWluLW91dCA0MDBtcztcXG4gICAgLW1vei10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgNDAwbXM7XFxuICAgIC1tcy10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgNDAwbXM7XFxuICAgIC1vLXRyYW5zaXRpb246IHRyYW5zZm9ybSBlYXNlLWluLW91dCA0MDBtcztcXG59XFxuXFxuLmxvZ2dlZG91dCB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5sb2dnZWRpbiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5zZWxlY3RlZC1wYWdlLWRkIHtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgIWltcG9ydGFudDtcXG59XFxuXFxuI2JlZHJvb21zLWljb24ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGZvbnQtc2l6ZTogMS4zNXJlbTtcXG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGNvbG9yOiAjZmZmO1xcbiAgICBtYXJnaW4tbGVmdDogMTVweDtcXG59XFxuI2JlZHJvb21zLWljb24gI2JlZHJvb21zLWRycGRuIHtcXG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xcbiAgICBtaW4td2lkdGg6IDE2MHB4O1xcbiAgICBtYXgtaGVpZ2h0OiAzNTBweDtcXG4gICAgYm94LXNoYWRvdzogMHB4IDhweCAxNnB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICAgIHotaW5kZXg6IDE7XFxuICAgIG1hcmdpbjogMCU7XFxufVxcbiNiZWRyb29tcy1pY29uICNiZWRyb29tcy1kcnBkbiBwIHtcXG4gICAgcGFkZGluZzogMC44ZW07XFxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgICBmb250LXdlaWdodDogOTAwO1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgbWFyZ2luOiAwJTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcbiNiZWRyb29tcy1pY29uICNiZWRyb29tcy1kcnBkbiBwOmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcXG59XFxuXFxuLm1vYmlsZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNiZWRyb29tcy1pY29uOmhvdmVyICNiZWRyb29tcy1kcnBkbiB7XFxuICAgIGRpc3BsYXk6IGZsZXggIWltcG9ydGFudDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbn1cXG5cXG4jYmVkcm9vbXMtaWNvbjpob3ZlciB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI2JvdHRvbWluZm8ge1xcbiAgICBtYXJnaW4tdG9wOiA0MHB4O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgd2lkdGg6IDg1JTtcXG59XFxuI2JvdHRvbWluZm8gcCB7XFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcbiNib3R0b21pbmZvIGgyIHtcXG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxuICAgIHRleHQtYWxpZ246IHZhcigtLXRleHQtYWxpZ24pO1xcbn1cXG4jYm90dG9taW5mbyAjYWJvdXR1cyB7XFxuICAgIHBhZGRpbmc6IDE1cHg7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWNvbG9yKTtcXG4gICAgZGlyZWN0aW9uOiB2YXIoLS1kaXJlY3Rpb24pO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcXG4gICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICAgIC1tcy1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgICAtby1ib3JkZXItcmFkaXVzOiAxNXB4O1xcbn1cXG4jYm90dG9taW5mbyAjY29udGFjdGluZm8ge1xcbiAgICBtYXJnaW4tdG9wOiA0MHB4O1xcbiAgICBwYWRkaW5nOiAxNXB4O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1jb2xvcik7XFxuICAgIHRleHQtYWxpZ246IHZhcigtLXRleHQtYWxpZ24pO1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTVweDtcXG4gICAgLW1zLWJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDE1cHg7XFxufVxcbiNib3R0b21pbmZvICNjb250YWN0aW5mbyBhIHtcXG4gICAgY29sb3I6ICMwMDA7XFxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICAgIG1hcmdpbjogMHB4IDVweCAwcHggNXB4O1xcbn1cXG4jYm90dG9taW5mbyAjY29udGFjdGluZm8gYTp2aXNpdGVkIHtcXG4gICAgY29sb3I6ICMwMDA7XFxufVxcbiNib3R0b21pbmZvICNjb250YWN0aW5mbyAjbWFwLWNvbnQge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI2JvdHRvbWluZm8gI2NvbnRhY3RpbmZvICNtYXAtY29udCBwIHtcXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcXG59XFxuXFxuLmVtcG4ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4jbmF2LWJhciB7XFxuICAgIHdpZHRoOiA5NSU7XFxuICAgIHBhZGRpbmc6IDEwcHggMHB4IDEwcHggMHB4O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogdmFyKC0tZmxleC1yb3ctZGlyZWN0aW9uKTtcXG59XFxuI25hdi1iYXIgLmxpbmUge1xcbiAgICBmb250LXNpemU6IDEuMzVyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xcbn1cXG4jbmF2LWJhciAubGluZTo6YWZ0ZXIge1xcbiAgICBjb250ZW50OiAnJztcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMCk7XFxuICAgIGhlaWdodDogMnB4O1xcbiAgICBib3R0b206IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiBib3R0b20gcmlnaHQ7XFxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSA1MDBtcyBlYXNlLW91dDtcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gNTAwbXMgZWFzZS1vdXQ7XFxuICAgIC1tb3otdHJhbnNpdGlvbjogdHJhbnNmb3JtIDUwMG1zIGVhc2Utb3V0O1xcbiAgICAtbXMtdHJhbnNpdGlvbjogdHJhbnNmb3JtIDUwMG1zIGVhc2Utb3V0O1xcbiAgICAtby10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gNTAwbXMgZWFzZS1vdXQ7XFxufVxcbiNuYXYtYmFyIC5saW5lOmhvdmVyOjphZnRlciB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiBib3R0b20gbGVmdDtcXG59XFxuI25hdi1iYXIgLmxpbmU6aG92ZXIge1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNtaWRkbGUtY29udGFpbmVyIHtcXG4gICAgcGFkZGluZzogMzVweCAwcHggMzVweCAwcHg7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBtaW4taGVpZ2h0OiA5MHZoO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xcbn1cXG4jbWlkZGxlLWNvbnRhaW5lciAjZ3JpZCB7XFxuICAgIG1hcmdpbjogYXV0bztcXG4gICAgd2lkdGg6IDkwJTtcXG4gICAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdhcDogNDBweDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCA0MDBweCk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KGF1dG8tZmlsbCwgNTAwcHgpO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgZGlyZWN0aW9uOiB2YXIoLS1kaXJlY3Rpb24pO1xcbn1cXG5cXG4jcmVzdWx0cy1mb3VuZCB7XFxuICAgIHdpZHRoOiA4MCU7XFxuICAgIHRleHQtYWxpZ246IHZhcigtLXRleHQtYWxpZ24pO1xcbiAgICBkaXJlY3Rpb246IHZhcigtLWRpcmVjdGlvbik7XFxufVxcblxcbi5yZWNvbW1lbmRhdGlvbi1pbmZvLUwge1xcbiAgICBoZWlnaHQ6IGZpdC1jb250ZW50ICFpbXBvcnRhbnQ7XFxufVxcblxcbi5yZWNvbW1lbmRhdGlvbi1pbmZvIHtcXG4gICAgaGVpZ2h0OiBmaXQtY29udGVudCAhaW1wb3J0YW50O1xcbn1cXG5cXG4uaXRlbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgd2lkdGg6IDQwMHB4O1xcbiAgICBoZWlnaHQ6IDUwMHB4O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1jb2xvcik7XFxuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogM3ZtaW47XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbn1cXG4uaXRlbSBidXR0b24ge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExODI3O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgY29sb3I6ICNmZmZmZmY7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgZmxleDogMCAwIGF1dG87XFxuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjVyZW07XFxuICAgIHBhZGRpbmc6IDAuNzVyZW0gMS4ycmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZSAjNmI3MjgwIHNvbGlkO1xcbiAgICB0ZXh0LWRlY29yYXRpb24tdGhpY2tuZXNzOiBhdXRvO1xcbiAgICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgICB0cmFuc2l0aW9uLXByb3BlcnR5OiBiYWNrZ3JvdW5kLWNvbG9yLCBib3JkZXItY29sb3IsIGNvbG9yLCBmaWxsLCBzdHJva2U7XFxuICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XFxuICAgIHdpZHRoOiBhdXRvO1xcbn1cXG4uaXRlbSBidXR0b246aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzc0MTUxO1xcbn1cXG4uaXRlbSBidXR0b246Zm9jdXMge1xcbiAgICBib3gtc2hhZG93OiBub25lO1xcbiAgICBvdXRsaW5lOiAycHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XFxufVxcbi5pdGVtIGltZyB7XFxuICAgIG1hcmdpbi10b3A6IDEwcHg7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBtYXgtd2lkdGg6IDM1MHB4O1xcbiAgICBtYXgtaGVpZ2h0OiAyNTBweDtcXG4gICAgd2lkdGg6IGF1dG87XFxuICAgIGhlaWdodDogYXV0bztcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uaXRlbSBociB7XFxuICAgIGJvcmRlcjogMHB4O1xcbiAgICBoZWlnaHQ6IDFweDtcXG4gICAgd2lkdGg6IDgwJTtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxcbiAgICAgICAgdG8gcmlnaHQsXFxuICAgICAgICByZ2JhKDAsIDAsIDAsIDApLFxcbiAgICAgICAgcmdiYSgwLCAwLCAwLCAwLjc1KSxcXG4gICAgICAgIHJnYmEoMCwgMCwgMCwgMClcXG4gICAgKTtcXG59XFxuLml0ZW0gZGl2IHtcXG4gICAgaGVpZ2h0OiAxNTBweDtcXG4gICAgd2lkdGg6IDgwJTtcXG4gICAgZm9udC1zaXplOiAxLjJyZW07XFxufVxcbi5pdGVtIGRpdiAuaW5mbyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgZGlyZWN0aW9uOiB2YXIoLS1kaXJlY3Rpb24pO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB3aWR0aDogMTAwJTtcXG59XFxuLml0ZW0gZGl2IC5pbmZvIC5pbmZvLWxlZnQge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgbWFyZ2luLWJvdHRvbTogNXB4O1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcbi5pdGVtIGRpdiAuaW5mbyAuaW5mby1sZWZ0IHAge1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICAgIG1hcmdpbjogNXB4IDBweCA1cHggMHB4O1xcbn1cXG4uaXRlbSBkaXYgLmluZm8gaW1nIHtcXG4gICAgbWFyZ2luOiAwJTtcXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIGVhc2UtaW4tb3V0IDQwMG1zO1xcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IHRyYW5zZm9ybSBlYXNlLWluLW91dCA0MDBtcztcXG4gICAgLW1vei10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgNDAwbXM7XFxuICAgIC1tcy10cmFuc2l0aW9uOiB0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgNDAwbXM7XFxuICAgIC1vLXRyYW5zaXRpb246IHRyYW5zZm9ybSBlYXNlLWluLW91dCA0MDBtcztcXG59XFxuXFxuI3ZpZXctaXRlbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiB2YXIoLS1mbGV4LXJvdy1kaXJlY3Rpb24pO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgbWFyZ2luOiBhdXRvO1xcbiAgICB3aWR0aDogOTAlO1xcbiAgICBtaW4taGVpZ2h0OiBmaXQtY29udGVudDtcXG59XFxuI3ZpZXctaXRlbSAuaXRlbSB7XFxuICAgIHdpZHRoOiA0MHZ3O1xcbiAgICBtaW4td2lkdGg6IDQ0MHB4O1xcbiAgICBoZWlnaHQ6IDYwMHB4O1xcbn1cXG4jdmlldy1pdGVtIC5pdGVtIGltZyB7XFxuICAgIG1heC13aWR0aDogODAlO1xcbiAgICBtYXgtaGVpZ2h0OiAzMDBweDtcXG4gICAgd2lkdGg6IGF1dG87XFxuICAgIGhlaWdodDogYXV0bztcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4jdmlldy1pdGVtIC5pdGVtIC5pbmZvIGltZyB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuI3ZpZXctaXRlbSAjaXRlbS1kZXRhaWxzIHtcXG4gICAgbWluLXdpZHRoOiA0NDBweDtcXG4gICAgd2lkdGg6IDQwdnc7XFxuICAgIGhlaWdodDogNjAwcHg7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1jb2xvcik7XFxuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogM3ZtaW47XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbn1cXG4jdmlldy1pdGVtICNpdGVtLWRldGFpbHMgI2RldGFpbHNILFxcbiN2aWV3LWl0ZW0gI2l0ZW0tZGV0YWlscyAjZGV0YWlsc0Ige1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gICAgd2lkdGg6IDgwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbiAgICAtbXMtYm9yZGVyLXJhZGl1czogM3ZtaW47XFxuICAgIC1vLWJvcmRlci1yYWRpdXM6IDN2bWluO1xcbn1cXG4jdmlldy1pdGVtICNpdGVtLWRldGFpbHMgI2RldGFpbHNIIHtcXG4gICAgaGVpZ2h0OiAxMCU7XFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuI3ZpZXctaXRlbSAjaXRlbS1kZXRhaWxzICNkZXRhaWxzQiB7XFxuICAgIGRpcmVjdGlvbjogdmFyKC0tZGlyZWN0aW9uKTtcXG4gICAgaGVpZ2h0OiA2NSU7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcXG4gICAgcGFkZGluZzogMXZtaW47XFxufVxcbiN2aWV3LWl0ZW0gI2l0ZW0tZGV0YWlscyAjZGV0YWlsc0IgZGl2IHtcXG4gICAgaGVpZ2h0OiAyNSU7XFxuICAgIHdpZHRoOiA4MCU7XFxuICAgIHdpZHRoOiBmaXQtY29udGVudDtcXG4gICAgaGVpZ2h0OiBmaXQtY29udGVudDtcXG4gICAgZm9udC1zaXplOiAxLjM1cmVtO1xcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMTAwMHB4KSB7XFxuICAgICNib3R0b21pbmZvICNhYm91dHVzIHtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICB9XFxuICAgICNib3R0b21pbmZvICNhYm91dHVzIGgyIHtcXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgfVxcbiAgICAjYm90dG9taW5mbyAjYWJvdXR1cyBwIHtcXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICAgIH1cXG4gICAgI2JvdHRvbWluZm8gI2NvbnRhY3RpbmZvIHtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICB9XFxufVxcbkBtZWRpYSAobWluLXdpZHRoOiA2MDFweCkgYW5kIChtYXgtd2lkdGg6IDEwMDBweCkge1xcbiAgICAjdmlldy1pdGVtIHtcXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB9XFxuICAgICN2aWV3LWl0ZW0gLml0ZW0sXFxuICAgICN2aWV3LWl0ZW0gI2l0ZW0tZGV0YWlscyB7XFxuICAgICAgICB3aWR0aDogODB2dyAhaW1wb3J0YW50O1xcbiAgICAgICAgbWFyZ2luOiAxNXB4O1xcbiAgICAgICAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgIH1cXG59XFxuLnNlbGVjdGVkLXBhZ2Uge1xcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcXG59XFxuXFxuLnNlbGVjdGVkLXBhZ2U6OmFmdGVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2sgIWltcG9ydGFudDtcXG59XFxuXFxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XFxuICAgIC5idXR0b24tNDAge1xcbiAgICAgICAgcGFkZGluZzogMC43NXJlbSAxLjVyZW07XFxuICAgIH1cXG59XFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgICBodG1sLFxcbiAgICBib2R5IHtcXG4gICAgICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcXG4gICAgfVxcbiAgICBzZWxlY3Qge1xcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICB9XFxuICAgICNoZWFkZXIge1xcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIH1cXG4gICAgI2hlYWRlciBpbnB1dFt0eXBlPSdzZWFyY2gnXSB7XFxuICAgICAgICBtaW4td2lkdGg6IDM1MHB4O1xcbiAgICB9XFxuICAgICNoZWFkZXIgI2hlYWRlci11cHBlciB7XFxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB9XFxuICAgICNoZWFkZXIgI2FjdGlvbnMtY29udGFpbmVyIHtcXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICAgICAgd2lkdGg6IDk1JTtcXG4gICAgfVxcbiAgICAjaGVhZGVyICNuYXYtYmFyIHtcXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIH1cXG4gICAgLm1vYmlsZSB7XFxuICAgICAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgfVxcbiAgICAjZ3JpZCB7XFxuICAgICAgICBkaXNwbGF5OiBncmlkO1xcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCA4MHZ3KTtcXG4gICAgfVxcbiAgICAjZ3JpZCAuaXRlbSB7XFxuICAgICAgICB3aWR0aDogODB2dyAhaW1wb3J0YW50O1xcbiAgICAgICAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgICAgICBtYXJnaW46IGF1dG87XFxuICAgIH1cXG4gICAgI2dyaWQgLml0ZW0gaW1nIHtcXG4gICAgICAgIG1heC13aWR0aDogNjB2dyAhaW1wb3J0YW50O1xcbiAgICB9XFxuICAgICN2aWV3LWl0ZW0ge1xcbiAgICAgICAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XFxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgfVxcbiAgICAuaXRlbSxcXG4gICAgI2l0ZW0tZGV0YWlscyB7XFxuICAgICAgICB3aWR0aDogODB2dyAhaW1wb3J0YW50O1xcbiAgICAgICAgbWluLXdpZHRoOiAwcHggIWltcG9ydGFudDtcXG4gICAgICAgIG1hcmdpbjogMTVweDtcXG4gICAgICAgIGhlaWdodDogNDUwcHggIWltcG9ydGFudDtcXG4gICAgfVxcbiAgICAuaXRlbSBpbWcsXFxuICAgICNpdGVtLWRldGFpbHMgaW1nIHtcXG4gICAgICAgIG1heC13aWR0aDogNjB2dyAhaW1wb3J0YW50O1xcbiAgICAgICAgbWF4LWhlaWdodDogMzAwcHggIWltcG9ydGFudDtcXG4gICAgfVxcbiAgICAjdmlldy1pdGVtICNpdGVtLWRldGFpbHMgI2RldGFpbHNCIGRpdiB7XFxuICAgICAgICBmb250LXNpemU6IDEuMTVyZW0gIWltcG9ydGFudDtcXG4gICAgfVxcbiAgICAjY29udGFpbmVyMiAjcmVjb21tZW5kYXRpb25zLWNvbnRhaW5lciAjcmVjb21tZW5kYXRpb25zIHtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICAgIH1cXG4gICAgI2NvbnRhaW5lcjIgI3JlY29tbWVuZGF0aW9ucy1jb250YWluZXIgI3JlY29tbWVuZGF0aW9ucyAuaXRlbSB7XFxuICAgICAgICBtYXgtd2lkdGg6IDIwMHB4O1xcbiAgICAgICAgaGVpZ2h0OiAyNTBweCAhaW1wb3J0YW50O1xcbiAgICAgICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcbiAgICB9XFxuICAgICNjb250YWluZXIyICNyZWNvbW1lbmRhdGlvbnMtY29udGFpbmVyICNyZWNvbW1lbmRhdGlvbnMgLml0ZW0gaW1nIHtcXG4gICAgICAgIG1heC13aWR0aDogMTgwcHggIWltcG9ydGFudDtcXG4gICAgICAgIG1heC1oZWlnaHQ6IDEyMHB4ICFpbXBvcnRhbnQ7XFxuICAgIH1cXG4gICAgLnpvb21lZC1pbixcXG4gICAgLnpvb21lZC1jb250YWluZXIge1xcbiAgICAgICAgbWF4LXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xcbiAgICB9XFxuICAgIC54MiB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDEwJTtcXG4gICAgICAgIGxlZnQ6IDglO1xcbiAgICB9XFxuICAgICNjYXJ0LW1haW4ge1xcbiAgICAgICAgd2lkdGg6IDkwdnc7XFxuICAgICAgICBmb250LXNpemU6IHgtc21hbGw7XFxuICAgIH1cXG4gICAgI2NhcnQtbWFpbiAjY2FydC1oZWFkZXIge1xcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICB9XFxuICAgICNvcmRlci1tYWluIHtcXG4gICAgICAgIHdpZHRoOiA4NXZ3O1xcbiAgICB9XFxuICAgIGZvcm0ge1xcbiAgICAgICAgd2lkdGg6IDkwdnc7XFxuICAgIH1cXG4gICAgZm9ybSBsYWJlbCBwIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogc21hbGw7XFxuICAgIH1cXG4gICAgZm9ybSBidXR0b24ge1xcbiAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgICAgICAgZm9udC1zaXplOiBzbWFsbDtcXG4gICAgfVxcbiAgICAjc3VjY2Vzcy1tZXNzYWdlIHtcXG4gICAgICAgIHdpZHRoOiA4NXZ3O1xcbiAgICB9XFxufVxcblxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlLmNzcy5tYXAgKi9cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3N0eWxlLnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0kseUJBQUE7SUFDQSxzQkFBQTtJQUNBLGVBQUE7SUFDQSxnQkFBQTtJQUNBLGFBQUE7SUFDQSxrQkFBQTtBQ0NKOztBREVBO0lBQ0ksaUNBQUE7SUFDQSxvQkFBQTtJQUNBLGNBQUE7SUFDQSxnQkFBQTtJQUNBLGNBQUE7SUFDQSxtQkFBQTtBQ0NKOztBREVBOztJQUVJLFlBQUE7SUFDQSx1QkFBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsVUFBQTtJQUNBLHNCQUFBO0FDQ0o7O0FERUE7SUFDSSx5Q0FBQTtJQUNBLHVCQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0FDQ0o7QURBSTtJQUNJLGlCQUFBO0FDRVI7O0FERUE7SUFDSSxtQkFBQTtJQUNBLGdCQUFBO0lBQ0EsdUJBQUE7SUFDQSx5QkFBQTtJQUNBLGtCQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7SUFDQSxtQkFBQTtJQUNBLFVBQUE7SUFDQSw4QkFBQTtBQ0NKOztBREVBO0lBQ0ksb0JBQUE7SUFDQSx3QkFBQTtBQ0NKOztBREVBO0lBQ0ksa0JBQUE7SUFDQSwwQkFBQTtBQ0NKOztBREVBO0lBQ0ksZUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsZ0NBQUE7SUFDQSx3Q0FBQTtJQUNBLHFDQUFBO0lBQ0Esb0NBQUE7SUFDQSxtQ0FBQTtJQUNBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsVUFBQTtBQ0NKOztBREVBO0lBQ0ksa0JBQUE7SUFDQSxpQkFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtJQUNBLGdDQUFBO0lBQ0Esd0NBQUE7SUFDQSxxQ0FBQTtJQUNBLG9DQUFBO0lBQ0EsbUNBQUE7QUNDSjs7QURFQTtJQUNJLHlCQUFBO0lBQ0EsNkJBQUE7QUNDSjs7QURFQTtJQUNJLGFBQUE7SUFDQSxtQkFBQTtJQUNBLG1CQUFBO0lBQ0EsdUJBQUE7QUNDSjs7QURFQTtJQUNJLFVBQUE7SUFDQSxXQUFBO0lBQ0EsVUFBQTtBQ0NKOztBREVBO0lBb0NJLFVBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUE7SUFDQSxtQkFBQTtJQUNBLDZCQUFBO0lBQ0Esb0NBQUE7SUFDQSwyQkFBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsbUJBQUE7SUFDQSwyQkFBQTtJQUNBLHdCQUFBO0lBQ0EsdUJBQUE7SUFDQSxzQkFBQTtBQ2xDSjtBRGRJO0lBQ0kseUJBQUE7SUFDQSw2QkFBQTtJQUNBLHNCQUFBO0lBQ0Esc0JBQUE7SUFDQSxjQUFBO0lBQ0EsZUFBQTtJQUNBLGNBQUE7SUFDQSxtQkFBQTtJQUNBLGdCQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtJQUNBLGtCQUFBO0lBQ0EsbUNBQUE7SUFDQSwrQkFBQTtJQUNBLHlCQUFBO0lBQ0Esd0VBQUE7SUFDQSx3REFBQTtJQUNBLGlCQUFBO0lBQ0EseUJBQUE7SUFDQSwwQkFBQTtJQUNBLGtCQUFBO0FDZ0JSO0FEZEk7SUFDSSx5QkFBQTtBQ2dCUjtBRGRJO0lBQ0ksZ0JBQUE7SUFDQSw4QkFBQTtJQUNBLG1CQUFBO0FDZ0JSO0FEZEk7SUFDSSxnQkFBQTtJQUNBLGVBQUE7QUNnQlI7O0FERUE7SUFDSSxVQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0lBQ0EsbUJBQUE7SUFDQSw2QkFBQTtJQUNBLG9DQUFBO0lBQ0EsMkJBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7QUNDSjtBREFJO0lBQ0kseUJBQUE7SUFDQSw2QkFBQTtJQUNBLHNCQUFBO0lBQ0Esc0JBQUE7SUFDQSxjQUFBO0lBQ0EsZUFBQTtJQUNBLGNBQUE7SUFDQSxtQkFBQTtJQUNBLGdCQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtJQUNBLGtCQUFBO0lBQ0EsbUNBQUE7SUFDQSwrQkFBQTtJQUNBLHlCQUFBO0lBQ0Esd0VBQUE7SUFDQSx3REFBQTtJQUNBLGlCQUFBO0lBQ0EseUJBQUE7SUFDQSwwQkFBQTtJQUNBLGtCQUFBO0FDRVI7QURBSTtJQUNJLHlCQUFBO0FDRVI7QURBSTtJQUNJLGdCQUFBO0lBQ0EsOEJBQUE7SUFDQSxtQkFBQTtBQ0VSO0FEQUk7SUFDSSxVQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0lBQ0EsdUJBQUE7SUFDQSxtQkFBQTtJQUNBLGdCQUFBO0lBQ0EsZUFBQTtBQ0VSO0FERFE7SUFDSSwyQkFBQTtJQUNBLGtCQUFBO0lBQ0EsbUJBQUE7SUFDQSxZQUFBO0FDR1o7QURBSTtJQWFJLFVBQUE7SUFDQSxhQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0lBQ0EsdUJBQUE7SUFDQSxtQkFBQTtJQUNBLGVBQUE7SUFDQSxnQkFBQTtBQ1ZSO0FEVFE7SUFDSSxXQUFBO0FDV1o7QURUUTtJQUNJLHlCQUFBO0lBQ0EsWUFBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7QUNXWjtBRERRO0lBQ0ksZUFBQTtJQUNBLFdBQUE7QUNHWjs7QURFQTtJQUNJLG9DQUFBO0lBQ0EsV0FBQTtJQUNBLFlBQUE7SUFDQSxhQUFBO0lBQ0EsWUFBQTtJQUNBLG1CQUFBO0lBQ0Esc0JBQUE7SUFDQSw4QkFBQTtJQUNBLG1CQUFBO0lBQ0EsZUFBQTtJQUNBLDJCQUFBO0lBQ0Esd0JBQUE7SUFDQSx1QkFBQTtJQUNBLHNCQUFBO0lBQ0EsYUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsZ0NBQUE7QUNDSjtBREFJO0lBQ0ksYUFBQTtJQUNBLG1CQUFBO0lBQ0EsdUJBQUE7SUFDQSxtQkFBQTtJQUNBLDJCQUFBO0FDRVI7QURBSTtJQUNJLGFBQUE7SUFDQSx5Q0FBQTtJQUNBLDZCQUFBO0lBQ0EsbUJBQUE7SUFDQSxXQUFBO0lBQ0EsV0FBQTtBQ0VSO0FEQUk7SUFDSSxpQkFBQTtJQUNBLGtCQUFBO0lBQ0EsV0FBQTtBQ0VSO0FEQUk7SUFDSSxlQUFBO0FDRVI7QURBSTtJQUNJLGlCQUFBO0lBQ0EsZ0JBQUE7QUNFUjtBRENROztJQUVJLFVBQUE7SUFDQSxrQkFBQTtBQ0NaO0FER1E7O0lBRUksVUFBQTtJQUNBLGtCQUFBO0FDRFo7QURJSTtJQUNJLFlBQUE7SUFDQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7SUFDQSx1QkFBQTtBQ0ZSO0FESUk7SUFDSSx5QkFBQTtJQUNBLDZCQUFBO0lBQ0Esc0JBQUE7SUFDQSxzQkFBQTtJQUNBLGNBQUE7SUFDQSxlQUFBO0lBQ0EsY0FBQTtJQUNBLG1CQUFBO0lBQ0EsZ0JBQUE7SUFDQSxtQkFBQTtJQUNBLHVCQUFBO0lBQ0Esa0JBQUE7SUFDQSxtQ0FBQTtJQUNBLCtCQUFBO0lBQ0EseUJBQUE7SUFDQSx3RUFBQTtJQUNBLHdEQUFBO0lBQ0EsaUJBQUE7SUFDQSx5QkFBQTtJQUNBLDBCQUFBO0lBQ0EsWUFBQTtBQ0ZSO0FESUk7SUFDSSx5QkFBQTtBQ0ZSO0FESUk7SUFDSSxnQkFBQTtJQUNBLDhCQUFBO0lBQ0EsbUJBQUE7QUNGUjs7QURNQTtJQUNJLGtCQUFBO0FDSEo7O0FETUE7SUFDSSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0FDSEo7O0FETUE7SUFDSSxlQUFBO0FDSEo7O0FETUE7SUFDSSxrQkFBQTtJQUNBLDBCQUFBO0FDSEo7O0FETUE7SUFDSTtRQUNJLFlBQUE7SUNISjtJREtBO1FBQ0ksVUFBQTtJQ0hKO0FBQ0o7QURNQTtJQUNJLDBCQUFBO0FDSko7O0FET0E7SUFDSSxhQUFBO0lBQ0Esc0JBQUE7SUFDQSxtQkFBQTtJQUNBLFdBQUE7SUFDQSx1QkFBQTtJQUNBLG1CQUFBO0FDSko7O0FET0E7SUFDSSxVQUFBO0lBQ0EsbUJBQUE7SUFDQSxhQUFBO0lBQ0EsbUJBQUE7SUFDQSxtQkFBQTtJQUNBLDZCQUFBO0FDSko7QURLSTs7SUFFSSxrQkFBQTtJQUNBLDBCQUFBO0lBQ0EsdUJBQUE7SUFDQSxzQkFBQTtJQUNBLHFCQUFBO0lBQ0EsMEJBQUE7QUNIUjtBREtJOztJQUVJLGVBQUE7QUNIUjtBREtJO0lBQ0ksWUFBQTtJQUNBLDBCQUFBO0lBQ0EsV0FBQTtJQUNBLGFBQUE7SUFDQSxtQkFBQTtJQUNBLHVCQUFBO0lBQ0EsUUFBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7SUFDQSxnQkFBQTtBQ0hSO0FESVE7SUFDSSxZQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0lBQ0EsbUJBQUE7SUFDQSw4QkFBQTtJQUNBLG9DQUFBO0lBQ0EsZ0JBQUE7SUFDQSxhQUFBO0lBQ0EsbUJBQUE7SUFDQSwyQkFBQTtJQUNBLHdCQUFBO0lBQ0EsdUJBQUE7SUFDQSxzQkFBQTtBQ0ZaO0FER1k7SUFDSSwwQkFBQTtBQ0RoQjtBREdZO0lBQ0ksZ0JBQUE7SUFDQSxpQkFBQTtBQ0RoQjtBREdZO0lBQ0ksYUFBQTtBQ0RoQjs7QURPQTtJQUNJLHVCQUFBO0FDSko7O0FET0E7SUFDSSxhQUFBO0lBQ0Esc0JBQUE7SUFDQSxtQkFBQTtJQUNBLFdBQUE7SUFDQSxtQkFBQTtJQUNBLHVCQUFBO0lBQ0EseUJBQUE7SUFDQSw4QkFBQTtJQUNBLGdCQUFBO0lBQ0EsTUFBQTtJQUNBLGFBQUE7QUNKSjs7QURPQTtJQUNJLFdBQUE7SUFDQSx1QkFBQTtJQUNBLGFBQUE7SUFDQSx5Q0FBQTtJQUNBLDhCQUFBO0lBQ0EsbUJBQUE7SUFDQSxlQUFBO0FDSko7O0FET0E7SUFDSSxrQ0FBQTtJQUNBLDBDQUFBO0lBQ0EsdUNBQUE7SUFDQSxzQ0FBQTtJQUNBLHFDQUFBO0FDSko7O0FET0E7SUFDSSxrQkFBQTtBQ0pKOztBRE9BO0lBQ0ksbUJBQUE7QUNKSjs7QURPQTtJQUNJLG1CQUFBO0FDSko7O0FET0E7SUFDSSwwQkFBQTtJQUNBLDJCQUFBO0FDSko7O0FET0E7SUFnQ0ksWUFBQTtJQUNBLGNBQUE7SUFDQSxVQUFBO0lBQ0EsbUJBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUE7SUFDQSxtQkFBQTtJQUNBLG9DQUFBO0lBbUdBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7QUNySUo7QURSSTtJQUNJLHlCQUFBO0lBQ0EsNkJBQUE7SUFDQSxzQkFBQTtJQUNBLHNCQUFBO0lBQ0EsY0FBQTtJQUNBLGVBQUE7SUFDQSxjQUFBO0lBQ0EsbUJBQUE7SUFDQSxnQkFBQTtJQUNBLG1CQUFBO0lBQ0EsdUJBQUE7SUFDQSxrQkFBQTtJQUNBLG1DQUFBO0lBQ0EsK0JBQUE7SUFDQSx5QkFBQTtJQUNBLHdFQUFBO0lBQ0Esd0RBQUE7SUFDQSxpQkFBQTtJQUNBLHlCQUFBO0lBQ0EsMEJBQUE7SUFDQSxXQUFBO0FDVVI7QURSSTtJQUNJLHlCQUFBO0FDVVI7QURSSTtJQUNJLGdCQUFBO0lBQ0EsOEJBQUE7SUFDQSxtQkFBQTtBQ1VSO0FEQUk7SUFDSSxXQUFBO0lBQ0EsZUFBQTtJQUNBLGFBQUE7SUFDQSx5Q0FBQTtJQUNBLDhCQUFBO0lBQ0EsbUJBQUE7QUNFUjtBRERRO0lBQ0ksVUFBQTtJQUNBLFdBQUE7SUFDQSw2QkFBQTtBQ0daO0FERFE7SUFDSSxVQUFBO0FDR1o7QUREUTtJQUNJLFVBQUE7QUNHWjtBREFJO0lBQ0ksV0FBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQTtJQUNBLHVCQUFBO0lBQ0Esb0JBQUE7QUNFUjtBRERRO0lBSUksMkJBQUE7SUFDQSxXQUFBO0lBQ0EsYUFBQTtJQUNBLGFBQUE7SUFDQSxtQkFBQTtJQUNBLG9DQUFBO0lBc0NBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7QUNyQ1o7QURiWTtJQUNJLGVBQUE7QUNlaEI7QURQWTtJQUNJLGdCQUFBO0lBQ0EsaUJBQUE7QUNTaEI7QURQWTtJQUNJLDZCQUFBO0lBQ0EsVUFBQTtJQUNBLFdBQUE7QUNTaEI7QURQWTtJQUNJLFVBQUE7SUFDQSxrQkFBQTtBQ1NoQjtBRFBZO0lBQ0ksVUFBQTtJQUNBLGFBQUE7SUFDQSxtQkFBQTtJQUNBLDZCQUFBO0lBQ0EsbUJBQUE7SUFDQSxVQUFBO0lBQ0EsV0FBQTtBQ1NoQjtBRFJnQjtJQUNJLFVBQUE7SUFDQSw2QkFBQTtJQUNBLFdBQUE7SUFDQSx5QkFBQTtJQUNBLDJCQUFBO0FDVXBCO0FEUFk7SUFDSSxhQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtBQ1NoQjtBRFJnQjtJQUNJLFlBQUE7QUNVcEI7QURBSTtJQUNJLFdBQUE7SUFDQSxhQUFBO0lBQ0EsbUJBQUE7SUFDQSwyQkFBQTtJQUNBLDhCQUFBO0lBQ0EsbUJBQUE7QUNFUjtBRERRO0lBQ0ksa0JBQUE7SUFDQSxVQUFBO0lBQ0Esc0JBQUE7SUFDQSwwQkFBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0lBQ0Esc0JBQUE7QUNHWjs7QURPQTtJQUNJLFdBQUE7SUFDQSxXQUFBO0lBQ0EsV0FBQTtJQUNBOzs7OztLQVVBO0FDVEo7O0FBRUE7SURXSSxTQUFBO0lBQ0EsWUFBQTtJQUNBLHNCQUFBO0lBQ0EsZUFBQTtJQUNBLGFBQUE7SUFDQSxNQUFBO0lBQ0Esa0JBQUE7SUFDQSxhQUFBO0lBQ0EseUNBQUE7SUFDQSx1QkFBQTtJQUNBLDhCQUFBO0lDVEEsZ0JBQWdCO0lEVWhCLHdCQUFBO0lBQ0kscUJBQUE7SUNSSixvQkFBb0I7SURVcEIsbUJBQUE7QUNSSjtBQUNBO0lEVUksWUFBQTtBQ1JKO0FBQ0E7SURVUSxlQUFBO0FDUlI7QUFDQTtJRFVRLGtCQUFBO0lDUkosV0FBVztJRFVYLGFBQUE7SUFDSSxzQkFBQTtJQUNBLDJCQUFBO0lBQ0EsNEJBQUE7QUNSUjtBQUNBO0lEVVEsZUFBQTtJQ1JKLDBCQUEwQjtJRFUxQiwwQkFBQTtJQUNJLFdBQUE7SUNSSixtQkFBbUI7SUFDbkIsV0FBVztBRFdmO0FDVEE7SURXSSxlQUFBO0FDVEo7O0FEWUE7SUFDSSx1QkFBQTtJQUNBLDJCQUFBO0FDVEo7O0FBRUE7SUFDSSxVQUFVO0lEV2QsZ0JBQUE7SUFDSSx3QkFBQTtJQUNBLGVBQUE7QUNUSjs7QUFFQTtJRFdJLHlDQUFBO0lBQ0EseUJBQUE7SUFDQSxXQUFBO0lDVEEsYUFBYTtJRFViLHNCQUFBO0lBQ0ksdUJBQUE7SUFDQSxtQkFBQTtJQ1JKLFlBQVk7QURTUjtBQ1BSO0lBQ0ksYUFBYTtJRFNULFlBQUE7QUNQUjtBQUNBO0lBQ0ksWUFBWTtBRFdoQjtBQ1RBO0lEV0ksWUFBQTtBQ1RKOztBQUVBO0lEV0ksa0JBQUE7SUFDQSxVQUFBO0lBQ0EscUJBQUE7SUFDQSxlQUFBO0lDVEEseUJBQXlCO0lBQ3pCLHNCQUFzQjtJRFcxQixxQkFBQTtJQUNJLGlCQUFBO0lBQ0EsMkJBQUE7QUNUSjs7QUFFQTtJRFdJLGtCQUFBO0lBQ0EsWUFBQTtJQUNBLHNCQUFBO0lBQ0EsV0FBQTtJQUNBLGtCQUFBO0lBQ0Esa0JBQUE7SUFDQSxjQUFBO0lDVEEsa0JBQWtCO0lBQ2xCLFVBQVU7SURXZCxZQUFBO0lBQ0ksU0FBQTtJQUNBLGtCQUFBO0FDVEo7O0FBRUE7SURXSSxnQkFBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQTtJQUNBLGlCQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtJQUNBLHNCQUFBO0lBQ0EsVUFBQTtJQUNBLFlBQUE7SUFDQSxvQkFBQTtJQUNBLG1CQUFBO0lBQ0EsMkJBQUE7SUNUQSx3QkFBd0I7SUFDeEIsdUJBQXVCO0lEVzNCLHNCQUFBO0lBQ0ksMkJBQUE7SUFDQSxtQkFBQTtBQ1RKOztBQUVBO0lEV0ksV0FBQTtJQUNBLGtCQUFBO0lBQ0EsU0FBQTtJQ1RBLFNBQVM7SUFDVCxpQkFBaUI7SURXckIsaUJBQUE7SUFDSSxtQkFBQTtJQUNBLHNEQUFBO0FDVEo7O0FEWUE7SUFDSSxvQkFBQTtJQUNBLDRCQUFBO0FDVEo7O0FEWUE7SUFDSSxxQkFBQTtJQUNJLDZCQUFBO0FDVFI7O0FBRUE7SURXUTtRQUNBLFVBQUE7UUNUQSxrQkFBa0I7SUFDdEI7SURZSjtRQUNJLFVBQUE7UUFDSSxtQkFBQTtJQUNBO0FDVlI7QUFDQTtJRFlRO1FBQ0EsVUFBQTtRQ1ZBLG1CQUFtQjtJQUN2QjtJRGFKO1FBQ0ksVUFBQTtRQUNBLGtCQUFBO0lBQ0E7QUNYSjtBQUNBO0lEYUksZUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBO0lBQ0EsdUJBQUE7SUFDQSxtQkFBQTtJQ1hBLDJCQUEyQjtJRFkzQixtQ0FBQTtJQUFBLGdDQUFBO0lBRUksK0JBQUE7SUNWSiw4QkFBOEI7QURZOUI7QUNWSjs7SUFFSSxXQUFXO0FEYWY7QUNYQTtJRGFJLGVBQUE7QUNYSjs7QUFFQTtJRGFJLFlBQUE7SUFDQSx5QkFBQTtJQUNBLHlEQUFBO0lBQ0Esb0NBQUE7SUFDQSxxQkFBQTtJQUNBLDRCQUFBO0lBQ0Esb0JBQUE7SUFDQSw0QkFBQTtJQUNBLHlCQUFBO0lBQ0Esd0JBQUE7SUFDQSx1QkFBQTtJQ1hBLGFBQWE7SUFDYixnQkFBZ0I7SURhcEIsYUFBQTtJQUNJLFlBQUE7SUFDQSx3QkFBQTtBQ1hKOztBRGNBO0lBQUEseUJBQUE7SUFFSSxZQUFBO0FDWEo7O0FBRUE7O0lEY0ksc0JBQUE7SUFDQSxhQUFBO0FDWEo7O0FBRUE7SURhSSxhQUFBO0lDWEEsc0JBQXNCO0lBQ3RCLDZCQUE2QjtJRGFqQyxtQkFBQTtJQUNJLHNCQUFBO0lBQ0EsV0FBQTtBQ1hKOztBQUVBO0lEYUksYUFBQTtJQUNBLHlDQUFBO0lDWEEsNkJBQTZCO0lEWTdCLG1CQUFBO0lBQ0ksWUFBQTtJQUNBLFVBQUE7SUFDQSxlQUFBO0FDVlI7QUFDQTtJRFdRLGFBQUE7SUFDSSxtQkFBQTtJQ1RSLDhCQUE4QjtJRFk5QixtQkFBQTtBQ1ZKO0FBQ0E7SURZUSxZQUFBO0FDVlI7QUFDQTtJRFlRLFlBQUE7SUFDQSx5QkFBQTtJQUNBLG9CQUFBO0lBQ0EsNEJBQUE7SUFDQSx5QkFBQTtJQUNBLHdCQUFBO0lBQ0EsdUJBQUE7SUFFQSxtQkFBQTtJQ1hKLFdBQVc7SURjWCw0QkFBQTtJQUNJLGtCQUFBO0lDWkosdUJBQXVCO0lEZXZCLFlBQUE7QUFBQTtBQ1pKO0lEZVEsZUFBQTtBQ2JSO0FBQ0E7O0lEZ0JRLFlBQUE7SUFDQSx5QkFBQTtJQUNBLG9CQUFBO0lBQ0EsNEJBQUE7SUFDQSx5QkFBQTtJQ2JKLHdCQUF3QjtJRGdCeEIsdUJBQUE7SUFBQSxtQkFBQTtJQUFBLFdBQUE7SUFHSSw0QkFBQTtBQ2RSO0FBQ0E7OztJRG1CUSxzQkFBQTtJQUNBLFdBQUE7QUNmUjtBQUNBO0lEaUJRLGVBQUE7SUNmSix1Q0FBdUM7SUFDdkMsK0NBQStDO0lEa0JuRCw0Q0FBQTtJQUNJLDJDQUFBO0lDaEJBLDBDQUEwQztBQUM5Qzs7QUFFQTtJQUNJLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lEa0JJLHFDQUFBO0FDaEJKOztBQUVBO0lEa0JJLGFBQUE7SUFDQSxzQkFBQTtJQUNBLHVCQUFBO0lBQ0EsNkJBQUE7SUFDQSxrQkFBQTtJQ2hCQSxnQkFBZ0I7SURpQmhCLHFCQUFBO0lBQ0ksa0JBQUE7SUFDQSxXQUFBO0lBQ0EsaUJBQUE7QUNmUjtBQUNBO0lEaUJRLHdCQUFBO0lBQ0EsNkJBQUE7SUFDQSxvQ0FBQTtJQ2ZKLGdCQUFnQjtJRGlCWixpQkFBQTtJQUNJLCtDQUFBO0lBQ0EsVUFBQTtJQUNBLFVBQUE7QUNmWjtBQUNBO0lEaUJZLGNBQUE7SUFDQSxpQkFBQTtJQUNBLGdCQUFBO0lDZlIscUJBQXFCO0lEa0JqQixrQkFBQTtJQUNJLFVBQUE7SUFDQSxZQUFBO0lBQ0EscUJBQUE7QUNoQlo7QUFDQTtJRG9CQSxzQkFBQTtJQUNJLGVBQUE7SUNsQkEsdUJBQXVCO0FBQzNCOztBQUVBO0lEcUJRLGFBQUE7QUNuQlI7O0FBRUE7SURzQkEsd0JBQUE7SUFDSSxzQkFBQTtJQ3BCQSw4QkFBOEI7QUFDbEM7O0FBRUE7SURzQkksZUFBQTtBQ3BCSjs7QUFFQTtJRHNCSSxnQkFBQTtJQ3BCQSxhQUFhO0lEcUJiLHNCQUFBO0lBQ0ksNkJBQUE7SUNuQkosbUJBQW1CO0lEcUJuQixVQUFBO0FDbkJKO0FBQ0E7SURxQlEsZ0JBQUE7QUNuQlI7QURxQkk7SUFDSSxnQkFBQTtJQUNBLDBCQUFBO0lBQ0EsNkJBQUE7QUNuQlI7QUFDQTtJRHFCUSxhQUFBO0lBQ0Esb0NBQUE7SUFDQSwyQkFBQTtJQUNBLFdBQUE7SUNuQkosbUJBQW1CO0lEcUJuQiwyQkFBQTtJQUNJLHdCQUFBO0lBQ0EsdUJBQUE7SUFDQSxzQkFBQTtBQ25CUjtBQUNBO0lEcUJRLGdCQUFBO0lBQ0EsYUFBQTtJQUNBLG9DQUFBO0lBQ0EsNkJBQUE7SUFDQSwyQkFBQTtJQUNBLFdBQUE7SUNuQkosbUJBQW1CO0lEb0JmLDJCQUFBO0lBQ0ksd0JBQUE7SUFDQSx1QkFBQTtJQUNBLHNCQUFBO0FDbEJaO0FEb0JRO0lBQ0ksV0FBQTtJQ2xCUixnQkFBZ0I7SURvQlosdUJBQUE7QUNsQlI7QUFDQTtJRG9CWSxXQUFBO0FDbEJaO0FBQ0E7SURtQlksYUFBQTtJQUNJLHNCQUFBO0lDakJaLDZCQUE2QjtJQUM3QixtQkFBbUI7QURzQnZCO0FDcEJBO0lEc0JJLHNCQUFBO0FDcEJKOztBQUVBO0lEc0JBLGFBQUE7SUFDSSxtQkFBQTtJQUNBLG1CQUFBO0FDcEJKOztBQUVBO0lEcUJJLFVBQUE7SUFDSSwwQkFBQTtJQUNBLGFBQUE7SUFDQSx5Q0FBQTtBQ25CUjtBQUNBO0lEcUJRLGtCQUFBO0lDbkJKLGdCQUFnQjtJRHFCaEIscUJBQUE7SUFDSSxrQkFBQTtJQUNBLFlBQUE7SUFDQSxpQkFBQTtBQ25CUjtBQUNBO0lEcUJRLFdBQUE7SUFDQSxrQkFBQTtJQUNBLFdBQUE7SUFDQSxvQkFBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsT0FBQTtJQUNBLHVCQUFBO0lBQ0EsOEJBQUE7SUNuQkosb0NBQW9DO0lEcUJwQyw0Q0FBQTtJQUNJLHlDQUFBO0lBQ0Esd0NBQUE7SUNuQkosdUNBQXVDO0FEcUJ2QztBQ25CSjtJQUNJLG9CQUFvQjtJQUNwQiw2QkFBNkI7QURzQmpDO0FDcEJBO0lEc0JJLGVBQUE7QUNwQko7O0FBRUE7SURzQkksMEJBQUE7SUFDQSxXQUFBO0lBQ0EsZ0JBQUE7SUNwQkEsdUJBQXVCO0lEcUJ2QixhQUFBO0lBQ0ksc0JBQUE7SUFDQSxtQkFBQTtJQUNBLDJCQUFBO0FDbkJSO0FBQ0E7SURxQlEsWUFBQTtJQUNBLFVBQUE7SUFDQSx1QkFBQTtJQUNBLGFBQUE7SUNuQkosU0FBUztJQUNULCtDQUErQztJRHNCbkQsNENBQUE7SUFDSSx1QkFBQTtJQUNBLDJCQUFBO0FDcEJKOztBQUVBO0lEc0JBLFVBQUE7SUFDSSw2QkFBQTtJQ3BCQSwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSw4QkFBOEI7QUFDbEM7O0FBRUE7SURzQkksOEJBQUE7QUNwQko7O0FBRUE7SURzQkksYUFBQTtJQUNBLHNCQUFBO0lBQ0EsOEJBQUE7SUFDQSxtQkFBQTtJQUNBLFlBQUE7SUFDQSxhQUFBO0lBQ0Esb0NBQUE7SUFDQSxtQkFBQTtJQ3BCQSxvQkFBb0I7SURxQnBCLDRCQUFBO0lBQ0kseUJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0FDbkJSO0FBQ0E7SURxQlEseUJBQUE7SUFDQSw2QkFBQTtJQUNBLHNCQUFBO0lBQ0Esc0JBQUE7SUFDQSxjQUFBO0lBQ0EsZUFBQTtJQUNBLGNBQUE7SUFDQSxtQkFBQTtJQUNBLGdCQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtJQUNBLGtCQUFBO0lBQ0EsbUNBQUE7SUFDQSwrQkFBQTtJQUNBLHlCQUFBO0lBQ0Esd0VBQUE7SUNuQkosd0RBQXdEO0lEcUJ4RCxpQkFBQTtJQUNJLHlCQUFBO0lDbkJKLDBCQUEwQjtJRHFCMUIsV0FBQTtBQ25CSjtBQUNBO0lEcUJRLHlCQUFBO0FDbkJSO0FEcUJJO0lBQ0ksZ0JBQUE7SUFDQSw4QkFBQTtJQUNBLG1CQUFBO0FDbkJSO0FBQ0E7SURxQlEsZ0JBQUE7SUFDQSxjQUFBO0lDbkJKLGdCQUFnQjtJRHNCaEIsaUJBQUE7SUFDSSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGVBQUE7QUNwQlI7QUFDQTtJRDJCSSxXQUFBO0lBQ0ksV0FBQTtJQUNBLFVBQUE7SUFDQTs7Ozs7S0FJSTtBQ3hCWjtBQUNBO0lBQ0ksYUFBYTtJRHlCTCxVQUFBO0lBQ0ksaUJBQUE7QUN2QmhCO0FBQ0E7SUR5QmdCLGFBQUE7SUFDQSw4QkFBQTtJQ3ZCWiwyQkFBMkI7SUR3QmYsbUJBQUE7SUFDSSxXQUFBO0FDdEJwQjtBQUNBO0lEeUJZLGFBQUE7SUFDSSxzQkFBQTtJQUNBLDZCQUFBO0lBQ0Esa0JBQUE7SUFDQSxrQkFBQTtBQ3ZCaEI7QUFDQTtJQUNJLGtCQUFrQjtJQUNsQix1QkFBdUI7QUQ0QjNCO0FDMUJBO0lENEJJLFVBQUE7SUFDQSx1Q0FBQTtJQUNBLCtDQUFBO0lBQ0EsNENBQUE7SUFDQSwyQ0FBQTtJQUNBLDBDQUFBO0FDMUJKOztBQUVBO0lEMkJRLGFBQUE7SUFDQSx5Q0FBQTtJQ3pCSiw2QkFBNkI7SUQwQnpCLG1CQUFBO0lBQ0ksWUFBQTtJQUNBLFVBQUE7SUFDQSx1QkFBQTtBQ3hCWjtBQUNBO0lBQ0ksV0FBVztJRDJCSCxnQkFBQTtJQUNJLGFBQUE7QUN6QmhCO0FENkJJO0lBQ0ksY0FBQTtJQUNBLGlCQUFBO0lBQ0EsV0FBQTtJQUNBLFlBQUE7SUFDQSxlQUFBO0FDM0JSO0FBQ0E7SUQ2QlEsZUFBQTtBQzNCUjtBQUNBO0lENkJRLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLGFBQUE7SUFDQSxhQUFBO0lDM0JKLHNCQUFzQjtJRDRCbEIsNkJBQUE7SUFBQSxtQkFBQTtJQUVJLG9DQUFBO0lBQ0EsbUJBQUE7SUFDQSxvQkFBQTtJQUNBLDRCQUFBO0lBQ0EseUJBQUE7SUFDQSx3QkFBQTtJQUNBLHVCQUFBO0FDMUJaO0FBQ0E7O0lBRUksdUJBQXVCO0lENEJuQixVQUFBO0lBQ0ksYUFBQTtJQUNBLHNCQUFBO0lBQ0EsNkJBQUE7SUMxQlIsb0JBQW9CO0lENEJoQiw0QkFBQTtJQUNJLHlCQUFBO0lBQ0Esd0JBQUE7SUFDQSx1QkFBQTtBQzFCWjtBQUNBO0lENEJZLFdBQUE7SUFDQSxtQkFBQTtJQzFCUixrQkFBa0I7QUQyQlY7QUN6Qlo7SUQyQmdCLDJCQUFBO0lBQ0EsV0FBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQTtJQ3pCWiw2QkFBNkI7SUFDN0Isb0JBQW9CO0lEOEJ4QixjQUFBO0FDNUJBO0FBQ0E7SUFDSSxXQUFXO0lEOEJILFVBQUE7SUFDSSxrQkFBQTtJQzVCWixtQkFBbUI7SUQ4Qlgsa0JBQUE7QUM1Qlo7O0FBRUE7SUQrQlk7UUM3QkosV0FBVztJQUNmO0lEaUNKO1FBQ0ksa0JBQUE7SUFDSTtJQUNBO1FBQ0EsZ0JBQUE7SUFDQTtJQy9CSjtRRGdDSSxXQUFBO0lBQUE7QUM3QlI7QUFDQTtJRGdDWTtRQzlCSixhQUFhO1FBQ2Isc0JBQXNCO1FEa0M5Qiw2QkFBQTtRQUNJLG1CQUFBO0lDaENBO0lBQ0E7O1FEa0NBLHNCQUFBO1FDL0JJLFlBQVk7UUFDWix1QkFBdUI7SURpQy9CO0FDL0JBO0FBQ0E7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SURpQ0ksa0NBQUE7QUMvQko7O0FBRUE7SURrQ1E7UUNoQ0EsdUJBQXVCO0lEa0MzQjtBQ2hDSjtBQUNBO0lEaUNROztRQzlCQSxrQkFBa0I7SURpQ2xCO0lBQ0k7UUFDQSxlQUFBO0lBQ0E7SUMvQlI7UURpQ0ksdUJBQUE7SUFDSTtJQUNBO1FBQ0EsZ0JBQUE7SUFDQTtJQy9CUjtRRGlDSSxzQkFBQTtRQUNJLHVCQUFBO1FDL0JKLG1CQUFtQjtJRG1DdkI7SUFDSTtRQ2pDQSxtQkFBbUI7UURvQ3ZCLDhCQUFBO1FBQ0ksbUJBQUE7UUFDQSxVQUFBO0lDbENKO0lEbUNJO1FBQ0ksYUFBQTtJQUNBO0lBQ0E7UUNqQ0osY0FBYztJRGtDVjtJQUNJO1FDaENSLGFBQWE7UURvQ2pCLDhDQUFBO0lBQ0k7SUFDQTtRQUNBLHNCQUFBO1FBQ0EsdUJBQUE7UUFDQSxZQUFBO0lDbENKO0lEcUNBO1FBQUEsMEJBQUE7SUFFSTtJQUNBO1FBQ0EsdUJBQUE7UUFDQSxhQUFBO1FDbkNBLHNCQUFzQjtRRG9DdEIsNkJBQUE7UUFBQSxtQkFBQTtJQUNJO0lBQ0E7O1FBR1Isc0JBQUE7UUFDSSx5QkFBQTtRQ2xDQSxZQUFZO1FEc0NSLHdCQUFBO0lBQ0k7SUNwQ1o7O1FEc0NnQiwwQkFBQTtRQUNBLDRCQUFBO0lBQ0E7SUNuQ2hCO1FEb0NnQiw2QkFBQTtJQUNJO0lBQ0E7UUNsQ2hCLHNCQUFzQjtJRHdDMUI7SUFBQTtRQUVJLGdCQUFBO1FDdENBLHdCQUF3QjtRRHdDNUIsa0JBQUE7SUFDSTtJQUNBO1FBQ0EsMkJBQUE7UUN0Q0EsNEJBQTRCO0lEd0NoQztJQUNJOztRQ3JDQSwyQkFBMkI7SUR1QzNCO0lBQ0k7UUNyQ0osa0JBQWtCO1FEd0N0QixRQUFBO1FBQ0ksUUFBQTtJQ3RDSjtJRHdDQTtRQUNJLFdBQUE7UUN0Q0Esa0JBQWtCO0lEd0NkO0lBQ0k7UUN0Q1IsZUFBZTtJRHlDZjtJQUNJO1FBQ0EsV0FBQTtJQ3ZDUjtJRDBDQTtRQUNJLFdBQUE7SUN4Q0o7SUFDQTtRQUNJLGdCQUFnQjtJQUNwQjtJQUNBO1FBQ0ksa0JBQWtCO1FBQ2xCLGdCQUFnQjtJQUNwQjtJQUNBO1FBQ0ksV0FBVztJQUNmO0FBQ0o7O0FBRUEsb0NBQW9DXCIsXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNNYXAgPSByZXF1aXJlKCcuL2lzTWFwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTZXQgPSByZXF1aXJlKCcuL2lzU2V0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hcGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWFwKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gbWFwVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hcDtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzU2V0YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNTZXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBzZXRUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzSW47XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5jbG9uZWAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgY2xvbmVzIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlY3Vyc2l2ZWx5IGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGRlZXAgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9ERUVQX0ZMQUcgfCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBiYXNlSXNNYXAgPSByZXF1aXJlKCcuL19iYXNlSXNNYXAnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzTWFwID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNNYXA7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBNYXBgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTWFwKG5ldyBNYXApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNNYXAobmV3IFdlYWtNYXApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzTWFwID0gbm9kZUlzTWFwID8gYmFzZVVuYXJ5KG5vZGVJc01hcCkgOiBiYXNlSXNNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXA7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlSXNTZXQgPSByZXF1aXJlKCcuL19iYXNlSXNTZXQnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzU2V0ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNTZXQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTZXRgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU2V0KG5ldyBTZXQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTZXQ7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9ICgpID0+IChbXSk7XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9ICgpID0+IChbXSk7XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zLzEuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zLzAuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3JlY2VwdGlvbnMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9ICgpID0+IChbXSk7XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3RlciBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZGluaW5ncm9vbXMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2xpdmluZ3Jvb21zLzAuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvbGl2aW5ncm9vbXMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9yZWNlcHRpb25zLzAuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLzEuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJpbXBvcnQgbG9nbyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL2xvZ28uanBnJ1xuaW1wb3J0IGNhcnRMb2dvIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvY2FydC5zdmcnXG5pbXBvcnQgbWVudUxvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9tZW51LnN2ZydcbmltcG9ydCBwcmV2SW1nIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvbGVmdC5zdmcnXG5pbXBvcnQgbmV4dEltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3JpZ2h0LnN2ZydcbmltcG9ydCB1UHJldkltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3VsZWZ0LnN2ZydcbmltcG9ydCB1TmV4dEltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3VyaWdodC5zdmcnXG5pbXBvcnQgeENsb3NlIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMveC5zdmcnXG5pbXBvcnQgZG90SWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZG90LnN2ZydcbmltcG9ydCBzZG90SWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvc2RvdC5zdmcnXG5pbXBvcnQgeDJJY24gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy94Mi5zdmcnXG5pbXBvcnQgcmVtb3ZlSWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvcmVtb3ZlLWNhcnQuc3ZnJ1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vbG9jYWwtc3RvcmFnZSdcblxuaW1wb3J0IGZiIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZmIuc3ZnJ1xuaW1wb3J0IGlnIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvaWcuc3ZnJ1xuaW1wb3J0IHdhIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvd2Euc3ZnJ1xuaW1wb3J0IGRiIGZyb20gJy4vZGIuanNvbidcblxuaW1wb3J0IHsgUHJpb3JpdHlRdWV1ZSB9IGZyb20gJ0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZSdcbmltcG9ydCB7IG5hbm9pZCB9IGZyb20gJ25hbm9pZCdcbmNvbnN0IGNsb25lRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC9jbG9uZWRlZXAnKVxuXG5sZXQgcHJvZHVjdHMgPSBkYi5Qcm9kdWN0c1xuXG5leHBvcnQgY29uc3QgbWlkZGxlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pZGRsZS1jb250YWluZXInKVxuZXhwb3J0IGNvbnN0IGhlYWRlclVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci11cHBlcicpXG5leHBvcnQgY29uc3QgYWN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpb25zLWNvbnRhaW5lcicpXG5leHBvcnQgY29uc3QgY2xmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZicpXG5leHBvcnQgY29uc3QgbGFuZ0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGN0LWxhbmcnKVxuZXhwb3J0IGNvbnN0IGxpdmluZ3Jvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmluZ3Jvb21zJylcbmV4cG9ydCBjb25zdCBob21lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvbWUnKVxuZXhwb3J0IGNvbnN0IGJlZHJvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JlZHJvb21zJylcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWR1bHRzLWJlZHJvb21zJylcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna2lkcy1iZWRyb29tcycpXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRpb25zJylcbmV4cG9ydCBjb25zdCB0dnVuaXRzQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2dW5pdHMnKVxuZXhwb3J0IGNvbnN0IGRpbmluZ3Jvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpbmluZ3Jvb21zJylcbmV4cG9ydCBjb25zdCBzcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NyY2gtaW4nKVxuZXhwb3J0IGNvbnN0IGZ0ciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdHInKVxuZXhwb3J0IGNvbnN0IG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpXG5leHBvcnQgY29uc3QgaG9tZVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG9tZS1wJylcbmV4cG9ydCBjb25zdCBsaXZpbmdyb29tc1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGl2aW5ncm9vbXMtcCcpXG5leHBvcnQgY29uc3QgYWJlZHJvb21zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhYmVkcm9vbXMtcCcpXG5leHBvcnQgY29uc3Qga2JlZHJvb21zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdrYmVkcm9vbXMtcCcpXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjZXB0aW9ucy1wJylcbmV4cG9ydCBjb25zdCB0dnVuaXRzUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0dnVuaXRzLXAnKVxuZXhwb3J0IGNvbnN0IGRpbmluZ3Jvb21zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaW5pbmdyb29tcy1wJylcbmV4cG9ydCBjb25zdCBhZGRyZXNzUG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZHJlc3MtcG9wdXAnKVxuXG5leHBvcnQgY29uc3QgbG9nb0ltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgY2FydEltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgbWVudUltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgeEltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgZmJJbWcgPSBuZXcgSW1hZ2UoKVxuZXhwb3J0IGNvbnN0IGlnSW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCB3YUltZyA9IG5ldyBJbWFnZSgpXG5cbmxvZ29JbWcuc3JjID0gbG9nb1xuY2FydEltZy5zcmMgPSBjYXJ0TG9nb1xubWVudUltZy5zcmMgPSBtZW51TG9nb1xueEltZy5zcmMgPSB4Q2xvc2VcbmZiSW1nLnNyYyA9IGZiXG5pZ0ltZy5zcmMgPSBpZ1xud2FJbWcuc3JjID0gd2FcblxuY2FydEltZy5zZXRBdHRyaWJ1dGUoXG4gICAgJ3N0eWxlJyxcbiAgICAnd2lkdGg6IDQwcHg7aGVpZ2h0OiA0MHB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIC01cHgpOydcbilcbm1lbnVJbWcuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogNDBweDtoZWlnaHQ6IDQwcHg7JylcbnhJbWcuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMjBweDtoZWlnaHQ6IDIwcHg7JylcblxuY29uc3Qgc20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc20nKVxuY29uc3QgZmJsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZibCcpXG5jb25zdCBpZ2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWdsJylcbmNvbnN0IHBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuJylcbmZibC5hcHBlbmRDaGlsZChmYkltZylcbmlnbC5hcHBlbmRDaGlsZChpZ0ltZylcbnBuLmFwcGVuZENoaWxkKHdhSW1nKVxuc20uYXBwZW5kQ2hpbGQoZmJsKVxuc20uYXBwZW5kQ2hpbGQoaWdsKVxuc20uYXBwZW5kQ2hpbGQocG4pXG5cbm1lbnVJbWcuY2xhc3NMaXN0LmFkZCgnbW9iaWxlJylcbm1lbnUuYXBwZW5kQ2hpbGQoeEltZylcblxuZXhwb3J0IGNvbnN0IGxpdmluZ3Jvb21zQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc0FyciA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9yZWNlcHRpb25zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCB0dnVuaXRzQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IGRpbmluZ3Jvb21zQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcblxuZXhwb3J0IGNvbnN0IGxpdmluZ3Jvb21zQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9saXZpbmdyb29tcycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgYWJlZHJvb21zQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXInLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IGtiZWRyb29tc0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgdHZ1bml0c0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNBcnJPRyA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcblxuZXhwb3J0IGNvbnN0IG5hdkJ0bnMgPSBbXG4gICAgaG9tZUJ0bixcbiAgICBsaXZpbmdyb29tc0J0bixcbiAgICBhYmVkcm9vbXNCdG4sXG4gICAga2JlZHJvb21zQnRuLFxuICAgIHJlY2VwdGlvbnNCdG4sXG4gICAgdHZ1bml0c0J0bixcbiAgICBkaW5pbmdyb29tc0J0bixcbl1cbmV4cG9ydCBjb25zdCBuYXZQID0gW1xuICAgIGhvbWVQLFxuICAgIGxpdmluZ3Jvb21zUCxcbiAgICBhYmVkcm9vbXNQLFxuICAgIGtiZWRyb29tc1AsXG4gICAgcmVjZXB0aW9uc1AsXG4gICAgdHZ1bml0c1AsXG4gICAgZGluaW5ncm9vbXNQLFxuXVxuY29uc3QgbmF2QXIgPSBbXG4gICAgJ9in2YTYsdim2YrYs9mK2KknLFxuICAgICfYutix2YEg2KfZhNmF2LnZiti02KknLFxuICAgICfYutix2YEg2YbZiNmFINix2KbZitiz2YrYqScsXG4gICAgJ9i62LHZgSDZhtmI2YUg2KfYt9mB2KfZhCcsXG4gICAgJ9i12KfZhNmI2YbYp9iqJyxcbiAgICAn2YXZg9iq2KjYp9iqJyxcbiAgICAn2LrYsdmBINiz2YHYsdipJyxcbl1cbmNvbnN0IG5hdkVuID0gW1xuICAgICdIb21lJyxcbiAgICAnTGl2aW5nIFJvb21zJyxcbiAgICAnTWFzdGVyIEJlZHJvb21zJyxcbiAgICAnS2lkcyBCZWRyb29tcycsXG4gICAgJ1JlY2VwdGlvbnMnLFxuICAgICdUViBVbml0cycsXG4gICAgJ0RpbmluZyBSb29tcycsXG5dXG5jb25zdCBuYXZBcjIgPSBbXG4gICAgJ9in2YTYsdim2YrYs9mK2KknLFxuICAgICfYutix2YEg2KfZhNmF2LnZiti02KknLFxuICAgICfYutix2YEg2YbZiNmFINix2KbZitiz2YrYqScsXG4gICAgJ9i62LHZgSDZhtmI2YUg2KfYt9mB2KfZhCcsXG4gICAgJ9i12KfZhNmI2YbYp9iqJyxcbiAgICAn2YXZg9iq2KjYp9iqJyxcbiAgICAn2LrYsdmBINiz2YHYsdipJyxcbl1cbmNvbnN0IG5hdkVuMiA9IFtcbiAgICAnSG9tZScsXG4gICAgJ0xpdmluZyBSb29tcycsXG4gICAgJ01hc3RlciBCZWRyb29tcycsXG4gICAgJ0tpZHMgQmVkcm9vbXMnLFxuICAgICdSZWNlcHRpb25zJyxcbiAgICAnVFYgVW5pdHMnLFxuICAgICdEaW5pbmcgUm9vbXMnLFxuXVxuXG5jb25zdCBMaXZpbmdSb29tc0RldGFpbHMgPSBbXVxuY29uc3QgS2lkc0JlZHJvb21zRGV0YWlscyA9IFtdXG5jb25zdCBNYXN0ZXJCZWRyb29tc0RldGFpbHMgPSBbXVxuY29uc3QgRGluaW5nUm9vbXNEZXRhaWxzID0gW11cbmNvbnN0IFJlY2VwdGlvbnNEZXRhaWxzID0gW11cbmNvbnN0IFRWVW5pdHNEZXRhaWxzID0gW11cblxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyRGV0YWlscyA9IFtdXG5jb25zdCByZWNvbW1lbmRhdGlvbnNBcnIgPSB7fVxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyT0cgPSB7fVxuXG5sZXQgc2VhcmNoQXJyID0ge31cbmxldCBzZWFyY2hBcnJPRyA9IHt9XG5sZXQgc2VhcmNoQXJyRGV0YWlscyA9IFtdXG5cbmxldCBjYXJ0QXJyRGV0YWlscyA9IFtdXG5sZXQgY2FydEFyciA9IHt9XG5sZXQgY2FydEFyck9HID0ge31cbmxldCBjYXJ0SW5kZXhlcyA9IFtdXG5cbmxldCBfYWRkcmVzcyA9IHtcbiAgICB1c2VybmFtZTogJ3UnLFxuICAgIHBob25lOiAncCcsXG4gICAgZW1haWw6ICdlJyxcbiAgICBjaXR5OiAnYycsXG4gICAgYXJlYTogJ2EnLFxuICAgIHN0cmVldDogJ3MnLFxuICAgIGJ1aWxkaW5nOiAnYicsXG4gICAgZmxvb3I6ICdmJyxcbiAgICBhcGFydG1lbnQ6ICdhcHQnLFxuICAgIGxhbmRtYXJrOiAnbCcsXG4gICAgaW5zdHJ1Y3Rpb25zOiAnaScsXG4gICAgZXhpc3RzOiBmYWxzZSxcbn1cblxubGV0IGYxID0gU3RvcmFnZS5nZXREZXRhaWxzKClcbmxldCBmMiA9IFN0b3JhZ2UuZ2V0QXJyKClcbmxldCBmMyA9IFN0b3JhZ2UuZ2V0QXJyT2coKVxubGV0IGY0ID0gU3RvcmFnZS5nZXRJbmRleGVzKClcbmxldCBmNSA9IFN0b3JhZ2UuZ2V0QWRkcmVzcygpXG5cbmlmIChmMSkge1xuICAgIGNhcnRBcnJEZXRhaWxzID0gSlNPTi5wYXJzZShmMSlcbn1cblxuaWYgKGYyKSB7XG4gICAgY2FydEFyciA9IEpTT04ucGFyc2UoZjIpXG59XG5cbmlmIChmMykge1xuICAgIGNhcnRBcnJPRyA9IEpTT04ucGFyc2UoZjMpXG59XG5cbmlmIChmNCkge1xuICAgIGNhcnRJbmRleGVzID0gSlNPTi5wYXJzZShmNClcbn1cblxuaWYgKGY1KSB7XG4gICAgX2FkZHJlc3MgPSBKU09OLnBhcnNlKGY1KVxufVxuXG5sZXQgcmVzdWx0c1F1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoKGEsIGIpID0+IHtcbiAgICBpZiAoYVsxXSA+IGJbMV0pIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGlmIChhWzFdIDwgYlsxXSkge1xuICAgICAgICByZXR1cm4gMVxuICAgIH1cbn0pXG5cbmxldCBpaWkgPSAwXG5sZXQgdHAgPSAwXG5sZXQgZmxhZyA9ICdwYWdlJ1xubGV0IG5mbGFnID0gdHJ1ZVxubGV0IGN1cnJJdGVtID0gW11cblxucHJvZHVjdHMuZm9yRWFjaCgocCkgPT4ge1xuICAgIHN3aXRjaCAocC5wcm9kdWN0X3R5cGUpIHtcbiAgICAgICAgY2FzZSAnTGl2aW5ncm9vbXMnOlxuICAgICAgICAgICAgTGl2aW5nUm9vbXNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gbGl2aW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gbGl2aW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnS2lkcyBCZWRyb29tcyc6XG4gICAgICAgICAgICBLaWRzQmVkcm9vbXNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0ga2JlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IGtiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdNYXN0ZXIgQmVkcm9vbXMnOlxuICAgICAgICAgICAgTWFzdGVyQmVkcm9vbXNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gYWJlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IGFiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdEaW5pbmdyb29tcyc6XG4gICAgICAgICAgICBEaW5pbmdSb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBkaW5pbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBkaW5pbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdSZWNlcHRpb25zJzpcbiAgICAgICAgICAgIFJlY2VwdGlvbnNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gcmVjZXB0aW9uc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSByZWNlcHRpb25zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1RWIFVuaXRzJzpcbiAgICAgICAgICAgIFRWVW5pdHNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gdHZ1bml0c0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSB0dnVuaXRzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbiAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgIHJlY29tbWVuZGF0aW9uc0FyckRldGFpbHMucHVzaChwLmluZGV4KVxuICAgIH1cbn0pXG5cbmdvSG9tZSgpXG5zd2l0Y2hMYW5nKCdlbicpXG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRBbGwocikge1xuICAgIGxldCBpbWFnZXMgPSB7fVxuICAgIHIua2V5cygpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBpbWFnZXNbaXRlbS5yZXBsYWNlKCcuLycsICcnKV0gPSByKGl0ZW0pXG4gICAgfSlcbiAgICByZXR1cm4gaW1hZ2VzXG59XG5cbmZ1bmN0aW9uIHBvcFVwKG0sIGkpIHtcbiAgICBsZXQgcG9wdXAgPVxuICAgICAgICBtID09IDFcbiAgICAgICAgICAgID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYG15UG9wdXAtJHtpfWApXG4gICAgICAgICAgICA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVBvcHVwMicpXG4gICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgIH0sIDEwMDApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJtaXRBZGRyZXNzKCkge1xuICAgIGxldCB1biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLW5hbWUnKVxuICAgIGxldCBwbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaG9uZS1udW0nKVxuICAgIGxldCBlbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbC1hZGRyZXNzJylcbiAgICBsZXQgY2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5JylcbiAgICBsZXQgYXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcmVhJylcbiAgICBsZXQgc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZWV0JylcbiAgICBsZXQgYnVpbGRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRpbmcnKVxuICAgIGxldCBmbG9vciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG9vcicpXG4gICAgbGV0IGFwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGFydG1lbnQnKVxuICAgIGxldCBsYW5kbWFyayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kbWFyaycpXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN0cnVjdGlvbnMnKVxuXG4gICAgaWYgKFxuICAgICAgICB1bi5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIHBuLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgZW1haWwucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBjaXR5LnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgYXJlYS5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIHN0LnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgYnVpbGRpbmcucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBmbG9vci5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGFwdC5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGxhbmRtYXJrLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnJlcG9ydFZhbGlkaXR5KClcbiAgICApIHtcbiAgICAgICAgX2FkZHJlc3MgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogdW4udmFsdWUsXG4gICAgICAgICAgICBwaG9uZTogcG4udmFsdWUsXG4gICAgICAgICAgICBlbWFpbDogZW1haWwudmFsdWUsXG4gICAgICAgICAgICBjaXR5OiBjaXR5LnZhbHVlLFxuICAgICAgICAgICAgYXJlYTogYXJlYS52YWx1ZSxcbiAgICAgICAgICAgIHN0cmVldDogc3QudmFsdWUsXG4gICAgICAgICAgICBidWlsZGluZzogYnVpbGRpbmcudmFsdWUsXG4gICAgICAgICAgICBmbG9vcjogZmxvb3IudmFsdWUsXG4gICAgICAgICAgICBhcGFydG1lbnQ6IGFwdC52YWx1ZSxcbiAgICAgICAgICAgIGxhbmRtYXJrOiBsYW5kbWFyay52YWx1ZSxcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogaW5zdHJ1Y3Rpb25zLnZhbHVlLFxuICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxuICAgICAgICB9XG5cbiAgICAgICAgdW4udmFsdWUgPSAnJ1xuICAgICAgICBwbi52YWx1ZSA9ICcnXG4gICAgICAgIGVtYWlsLnZhbHVlID0gJydcbiAgICAgICAgY2l0eS52YWx1ZSA9ICcnXG4gICAgICAgIGFyZWEudmFsdWUgPSAnJ1xuICAgICAgICBzdC52YWx1ZSA9ICcnXG4gICAgICAgIGJ1aWxkaW5nLnZhbHVlID0gJydcbiAgICAgICAgZmxvb3IudmFsdWUgPSAnJ1xuICAgICAgICBhcHQudmFsdWUgPSAnJ1xuICAgICAgICBsYW5kbWFyay52YWx1ZSA9ICcnXG4gICAgICAgIGluc3RydWN0aW9ucy52YWx1ZSA9ICcnXG5cbiAgICAgICAgU3RvcmFnZS5zYXZlQWRkcmVzcyhfYWRkcmVzcylcbiAgICAgICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICAgICAgY29uc3QgY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZHJlc3MtcG9wdXAnKVxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGJsdXJyZWQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAnKVxuICAgICAgICB9XG4gICAgICAgIGNvbi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7JylcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ppbycpLnJlbW92ZSgpXG5cbiAgICAgICAgcG9wdWxhdGVPcmRlcigpXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQWRkcmVzcygpIHtcbiAgICBjb25zdCBzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0LWFkZHJlc3MnKVxuICAgIGNvbnN0IHgzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3gzJylcbiAgICBsZXQgYXN0cnMgPSBbXVxuICAgIGxldCBwcyA9IFtdXG4gICAgbGV0IGFzdHIgPSAnJ1xuICAgIGxldCBwID0gJydcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IDExOyBsKyspIHtcbiAgICAgICAgaWYgKGwgPCA4KSB7XG4gICAgICAgICAgICBhc3RyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3VwJylcbiAgICAgICAgICAgIGFzdHIudGV4dENvbnRlbnQgPSAnKidcbiAgICAgICAgICAgIGFzdHIuY2xhc3NMaXN0LmFkZCgnYXN0cicpXG4gICAgICAgICAgICBhc3Rycy5wdXNoKGFzdHIpXG4gICAgICAgIH1cbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBwcy5wdXNoKHApXG4gICAgfVxuXG4gICAgY29uc3Qgem9vbWVkQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgem9vbWVkQ29udC5pZCA9ICd6aW8nXG4gICAgem9vbWVkQ29udC5jbGFzc0xpc3QuYWRkKCd6b29tZWQtY29udGFpbmVyJylcblxuICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICBwc1swXS50ZXh0Q29udGVudCA9ICdOYW1lJ1xuICAgICAgICBwc1sxXS50ZXh0Q29udGVudCA9ICdQaG9uZSBOdW1iZXInXG4gICAgICAgIHBzWzJdLnRleHRDb250ZW50ID0gJ0VtYWlsJ1xuICAgICAgICBwc1szXS50ZXh0Q29udGVudCA9ICdDaXR5J1xuICAgICAgICBwc1s0XS50ZXh0Q29udGVudCA9ICdBcmVhJ1xuICAgICAgICBwc1s1XS50ZXh0Q29udGVudCA9ICdTdHJlZXQgTmFtZSAvIE51bWJlcidcbiAgICAgICAgcHNbNl0udGV4dENvbnRlbnQgPSAnQnVpbGRpbmcgLyBWaWxsYSdcbiAgICAgICAgcHNbN10udGV4dENvbnRlbnQgPSAnRmxvb3InXG4gICAgICAgIHBzWzhdLnRleHRDb250ZW50ID0gYEFwYXJ0bWVudGBcbiAgICAgICAgcHNbOV0udGV4dENvbnRlbnQgPSAnTGFuZG1hcmsnXG4gICAgICAgIHBzWzEwXS50ZXh0Q29udGVudCA9ICdJbnN0cnVjdGlvbnMnXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHNbMF0udGV4dENvbnRlbnQgPSAn2KfZhNin2LPZhSdcbiAgICAgICAgcHNbMV0udGV4dENvbnRlbnQgPSAn2LHZgtmFINin2YTZh9in2KrZgSdcbiAgICAgICAgcHNbMl0udGV4dENvbnRlbnQgPSAn2KfZhNio2LHZitivINin2YTYp9mE2YPYqtix2YjZhtmKJ1xuICAgICAgICBwc1szXS50ZXh0Q29udGVudCA9ICfYp9mE2YXYrdin2YHYuNipJ1xuICAgICAgICBwc1s0XS50ZXh0Q29udGVudCA9ICfYp9mE2YXZhti32YLYqSdcbiAgICAgICAgcHNbNV0udGV4dENvbnRlbnQgPSAn2KfYs9mFIC8g2LHZgtmFINin2YTYtNin2LHYuSdcbiAgICAgICAgcHNbNl0udGV4dENvbnRlbnQgPSAn2LHZgtmFINin2YTYudmF2KfYsdipIC8g2KfZhNqk2YrZhNinJ1xuICAgICAgICBwc1s3XS50ZXh0Q29udGVudCA9ICfYp9mE2LfYp9io2YInXG4gICAgICAgIHBzWzhdLnRleHRDb250ZW50ID0gJ9in2YTYtNmC2KknXG4gICAgICAgIHBzWzldLnRleHRDb250ZW50ID0gJ9i52YTYp9mF2Kkg2YXZhdmK2LLYqSdcbiAgICAgICAgcHNbMTBdLnRleHRDb250ZW50ID0gJ9iq2LnZhNmK2YXYp9iqINin2K7YsdmKJ1xuICAgIH1cblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bi1sYWJlbCcpLmFwcGVuZChhc3Ryc1swXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW4tbGFiZWwnKS5hcHBlbmQocHNbMF0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuLWxhYmVsJykuYXBwZW5kKGFzdHJzWzFdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbi1sYWJlbCcpLmFwcGVuZChwc1sxXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwtbGFiZWwnKS5hcHBlbmQoYXN0cnNbMl0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsLWxhYmVsJykuYXBwZW5kKHBzWzJdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWxhYmVsJykuYXBwZW5kKGFzdHJzWzNdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWxhYmVsJykuYXBwZW5kKHBzWzNdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcmVhLWxhYmVsJykuYXBwZW5kKGFzdHJzWzRdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcmVhLWxhYmVsJykuYXBwZW5kKHBzWzRdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdC1sYWJlbCcpLmFwcGVuZChhc3Ryc1s1XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3QtbGFiZWwnKS5hcHBlbmQocHNbNV0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkaW5nLWxhYmVsJykuYXBwZW5kKGFzdHJzWzZdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGluZy1sYWJlbCcpLmFwcGVuZChwc1s2XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3ItbGFiZWwnKS5hcHBlbmQoYXN0cnNbN10pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yLWxhYmVsJykuYXBwZW5kKHBzWzddKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHQtbGFiZWwnKS5hcHBlbmQocHNbOF0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRtYXJrLWxhYmVsJykuYXBwZW5kKHBzWzldKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN0cnVjdGlvbnMtbGFiZWwnKS5hcHBlbmQocHNbMTBdKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh6b29tZWRDb250KVxuICAgIGNvbnN0IGJsdXJyZWQgPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBibHVycmVkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LmFkZCgncG9wdXAnKVxuICAgIH1cbiAgICBhZGRyZXNzUG9wLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwJylcbiAgICB4My5zcmMgPSB4Q2xvc2VcbiAgICB4My5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAyMHB4O2hlaWdodDogMjBweDsnKVxuICAgIHgzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgICAgICBjb25zdCBjb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcy1wb3B1cCcpXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cCcpXG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW4tbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW4tbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4tbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4tbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyZWEtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJlYS1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdC1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdC1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGluZy1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGluZy1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG9vci1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG9vci1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHQtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZG1hcmstbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zdHJ1Y3Rpb25zLWxhYmVsJykuaW5uZXJIVE1MID0gJydcblxuICAgICAgICBjb24uc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lOycpXG4gICAgICAgIHpvb21lZENvbnQucmVtb3ZlKClcbiAgICB9KVxuXG4gICAgYWRkcmVzc1BvcC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IGZsZXg7JylcblxuICAgIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgc3VibWl0QWRkcmVzcygpXG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2R1Y3RJREluZGV4KG0pIHtcbiAgICBsZXQgcmVzID0gW11cbiAgICBpZiAobSA9PSAxKSB7XG4gICAgICAgIGNhcnRJbmRleGVzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IHByb2R1Y3QuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gocHJvZHVjdC5wX2lkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChtID09IDIpIHtcbiAgICAgICAgY2FydEluZGV4ZXMuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gcHJvZHVjdC5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9kdWN0LnByb2R1Y3RfdGl0bGVfZW4pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZVRvREIob3JkZXIpIHtcbiAgICBkYi5PcmRlcnMucHVzaChvcmRlcilcbiAgICBsZXQgb2JqID0ge1xuICAgICAgICBkYjogZGIsXG4gICAgICAgIGN1cnI6IG9yZGVyLFxuICAgIH1cbiAgICBsZXQgb2JqU3RyID0gYXdhaXQgSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwczovL3NwbGFzaC03ZTF5Lm9ucmVuZGVyLmNvbS8nLCB7XG4gICAgICAgIG1ldGhvZDogYFBPU1RgLFxuICAgICAgICAvLyBtb2RlOiAnbm8tY29ycycsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICBib2R5OiBvYmpTdHIsXG4gICAgfSlcblxuICAgIHJldHVybiByZXNwb25zZS5ib2R5XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3VudChhcnIpIHtcbiAgICBsZXQgb2JqID0ge31cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBvYmpbYXJyW2ldXSA9IDFcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChpICE9IGogJiYgYXJyW2ldID09IGFycltqXSkge1xuICAgICAgICAgICAgICAgIG9ialthcnJbaV1dKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcmRlclBsYWNlZChpZCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHN1Y2Nlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpXG4gICAgY29uc3Qgc3VjY2VzczIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpXG4gICAgY29uc3Qgb3JkZXJOdW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgbWFpbi5pZCA9ICdzdWNjZXNzLW1lc3NhZ2UnXG5cbiAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpXG4gICAgbGV0IGRhdGUgPVxuICAgICAgICB0b2RheS5nZXREYXRlKCkgK1xuICAgICAgICAnLycgK1xuICAgICAgICAodG9kYXkuZ2V0TW9udGgoKSArIDEpICtcbiAgICAgICAgJy8nICtcbiAgICAgICAgdG9kYXkuZ2V0RnVsbFllYXIoKVxuICAgIGxldCB0aW1lID1cbiAgICAgICAgdG9kYXkuZ2V0SG91cnMoKSArICc6JyArIHRvZGF5LmdldE1pbnV0ZXMoKSArICc6JyArIHRvZGF5LmdldFNlY29uZHMoKVxuICAgIGxldCBkYXRlVGltZSA9XG4gICAgICAgIGRhdGUgK1xuICAgICAgICAnICcgK1xuICAgICAgICB0aW1lICtcbiAgICAgICAgJyAnICtcbiAgICAgICAgSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lXG5cbiAgICBsZXQgZ3BpaSA9IGdldFByb2R1Y3RJREluZGV4KDIpXG4gICAgbGV0IG9iaiA9IGdldENvdW50KGdwaWkpXG4gICAgbGV0IG90ID0gJydcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIG90ICs9IGAke29ialtrZXldfXggJyR7a2V5fScgLSBgXG4gICAgfSlcbiAgICBvdCA9IG90LnNsaWNlKDAsIC0zKVxuXG4gICAgbGV0IG9yZGVyID0ge1xuICAgICAgICBvcmRlcl9pZDogaWQsXG4gICAgICAgIG9yZGVyX2FkZHJlc3M6IF9hZGRyZXNzLFxuICAgICAgICBvcmRlcl9zdWJ0b3RhbDogdHAsXG4gICAgICAgIG9yZGVyX2RhdGV0aW1lOiBkYXRlVGltZSxcbiAgICAgICAgb3JkZXJfaXRlbXM6IG90LFxuICAgICAgICBvcmRlcl9pdGVtc19pZHM6IGdldFByb2R1Y3RJREluZGV4KDEpLmpvaW4oJyAtICcpLFxuICAgIH1cblxuICAgIGxldCB3YWl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKVxuICAgIHdhaXQudGV4dENvbnRlbnQgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKVxuICAgICAgICA/ICdQbGVhc2UgV2FpdC4uJ1xuICAgICAgICA6ICfYp9mE2LHYrNin2KEg2KfZhNin2YbYqti42KfYsS4uJ1xuICAgIG1haW4uYXBwZW5kKHdhaXQpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChtYWluKVxuXG4gICAgc2F2ZVRvREIob3JkZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MudGV4dENvbnRlbnQgPSAnT3JkZXIgUGxhY2VkIFN1Y2Nlc3NmdWxseSEnXG4gICAgICAgICAgICAgICAgc3VjY2VzczIudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAnUGxlYXNlIGNoZWNrIHlvdXIgbWFpbCBmb3IgY29uZmlybWF0aW9uLidcbiAgICAgICAgICAgICAgICBvcmRlck51bS50ZXh0Q29udGVudCA9IGBPcmRlciBJRDogJHtpZH1gXG4gICAgICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gJ0NvbnRpbnVlIFNob3BwaW5nJ1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzLnRleHRDb250ZW50ID0gJ9iq2YUg2KrZgtiv2YrZhSDYp9mE2LfZhNioINio2YbYrNin2K0hJ1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MyLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgJ9mK2LHYrNmJINin2YTYqtit2YLZgiDZhdmGINio2LHZitiv2YMg2KfZhNil2YTZg9iq2LHZiNmG2Yog2YTZhNiq2KPZg9mK2K8uJ1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtLnRleHRDb250ZW50ID0gYNix2YLZhSDYp9mE2LfZhNioOiAke2lkfWBcbiAgICAgICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSAn2YXZiNin2LXZhNipINin2YTYqtiz2YjZgidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhcnRBcnJEZXRhaWxzID0gW11cbiAgICAgICAgICAgIGNhcnRBcnIgPSB7fVxuICAgICAgICAgICAgY2FydEFyck9HID0ge31cbiAgICAgICAgICAgIGNhcnRJbmRleGVzID0gW11cbiAgICAgICAgICAgIHRwID0gMFxuICAgICAgICAgICAgU3RvcmFnZS5zYXZlQ2FydChjYXJ0QXJyRGV0YWlscywgY2FydEFyciwgY2FydEFyck9HLCBjYXJ0SW5kZXhlcylcblxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdvSG9tZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbWFpbi5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBtYWluLmFwcGVuZChzdWNjZXNzKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQoc3VjY2VzczIpXG4gICAgICAgICAgICBtYWluLmFwcGVuZChvcmRlck51bSlcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKGJ0bilcblxuICAgICAgICAgICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChtYWluKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzcy50ZXh0Q29udGVudCA9ICdPb3BzIFNvbWV0aGluZyBXZW50IFdyb25nLidcbiAgICAgICAgICAgICAgICBzdWNjZXNzMi50ZXh0Q29udGVudCA9ICdQbGVhc2UgdHJ5IGFnYWluIG9yIGNvbnRhY3QgdXMuJ1xuICAgICAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9ICdUcnkgQWdhaW4nXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MudGV4dENvbnRlbnQgPSAn2YTZgtivINit2K/YqyDYrti32KMg2YXYpy4nXG4gICAgICAgICAgICAgICAgc3VjY2VzczIudGV4dENvbnRlbnQgPSAn2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2Ykg2KPZiCDYp9mE2KfYqti12KfZhCDYqNmG2KcuJ1xuICAgICAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9ICfYp9i52KfYr9ipINin2YTZhdit2KfZiNmE2KknXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXJQbGFjZWQoaWQpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBtYWluLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKHN1Y2Nlc3MpXG4gICAgICAgICAgICBtYWluLmFwcGVuZChzdWNjZXNzMilcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKGJ0bilcblxuICAgICAgICAgICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChtYWluKVxuICAgICAgICB9KVxuXG4gICAgZmxhZyA9ICdwYWdlJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVPcmRlcigpIHtcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGNvbnN0IGFkZHJlc3NDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGFkZHJlc3NETkUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBhZGRyZXNzUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGluc3RQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgbGFuZG1hcmtQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgYWRkQ2hhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcblxuICAgIGNvbnN0IHByaWNlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBzdWJ0b3RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IHNoaXBwaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cbiAgICBjb25zdCBwbGFjZU9yZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcblxuICAgIG1haW4uaWQgPSAnb3JkZXItbWFpbidcbiAgICBhZGRyZXNzQ29udGFpbmVyLmlkID0gJ29yZGVyLWFkZHJlc3MtY29udCdcbiAgICBwcmljZUNvbnRhaW5lci5pZCA9ICdvcmRlci1wcmljZS1jb250J1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGlmIChfYWRkcmVzcy5leGlzdHMpIHtcbiAgICAgICAgICAgIGFkZENoYW5nZS50ZXh0Q29udGVudCA9ICdDaGFuZ2UnXG4gICAgICAgICAgICBsZXQgYWRkQXJyID0gT2JqZWN0LnZhbHVlcyhfYWRkcmVzcylcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGlmICghX2FkZHJlc3MuYXBhcnRtZW50KSB7XG4gICAgICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5sYW5kbWFyaykge1xuICAgICAgICAgICAgICAgIGxhbmRtYXJrUC50ZXh0Q29udGVudCA9IGBMYW5kbWFyazogJHtfYWRkcmVzcy5sYW5kbWFya31gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2FkZHJlc3MuaW5zdHJ1Y3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgaW5zdFAudGV4dENvbnRlbnQgPSBgSW5zdHJ1Y3Rpb25zOiAke19hZGRyZXNzLmluc3RydWN0aW9uc31gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRyZXNzUC50ZXh0Q29udGVudCA9IGFkZEFyci5qb2luKCcgLSAnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkQ2hhbmdlLnRleHRDb250ZW50ID0gJ0FkZCdcbiAgICAgICAgICAgIGFkZHJlc3NETkUudGV4dENvbnRlbnQgPSAnTm8gQWRkcmVzcyBGb3VuZC4nXG4gICAgICAgIH1cbiAgICAgICAgc3VidG90YWwudGV4dENvbnRlbnQgPSBgU3VidG90YWw6ICR7dHB9IEVHUGBcbiAgICAgICAgc2hpcHBpbmcudGV4dENvbnRlbnQgPSAncGx1cyBzaGlwcGluZyBmZWUuJ1xuICAgICAgICBwbGFjZU9yZGVyLnRleHRDb250ZW50ID0gJ1BsYWNlIE9yZGVyJ1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfYWRkcmVzcy5leGlzdHMpIHtcbiAgICAgICAgICAgIGFkZENoYW5nZS50ZXh0Q29udGVudCA9ICfYqti62YrZitixJ1xuICAgICAgICAgICAgbGV0IGFkZEFyciA9IE9iamVjdC52YWx1ZXMoX2FkZHJlc3MpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBpZiAoIV9hZGRyZXNzLmFwYXJ0bWVudCkge1xuICAgICAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2FkZHJlc3MubGFuZG1hcmspIHtcbiAgICAgICAgICAgICAgICBsYW5kbWFya1AudGV4dENvbnRlbnQgPSBg2LnZhNin2YXYqSDZhdmF2YrYstipOiAke19hZGRyZXNzLmxhbmRtYXJrfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpbnN0UC50ZXh0Q29udGVudCA9IGDYqti52YTZitmF2KfYqiDYp9iu2LHZijogJHtfYWRkcmVzcy5pbnN0cnVjdGlvbnN9YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkcmVzc1AudGV4dENvbnRlbnQgPSBhZGRBcnIuam9pbignIC0gJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZENoYW5nZS50ZXh0Q29udGVudCA9ICfYp9i22KfZgdipJ1xuICAgICAgICAgICAgYWRkcmVzc0RORS50ZXh0Q29udGVudCA9ICfZhNmFINmK2KrZhSDYp9mE2LnYq9mI2LEg2LnZhNmJINi52YbZiNin2YYuJ1xuICAgICAgICB9XG4gICAgICAgIHN1YnRvdGFsLnRleHRDb250ZW50ID0gYNin2YTYp9is2YXYp9mE2Yo6ICR7dHB9INisLtmFYFxuICAgICAgICBzaGlwcGluZy50ZXh0Q29udGVudCA9ICfYstin2KbYryDZhdi12KfYsdmK2YEg2KfZhNi02K3Zhi4nXG4gICAgICAgIHBsYWNlT3JkZXIudGV4dENvbnRlbnQgPSBg2KfYqtmF2KfZhSDYudmF2YTZitipINin2YTYtNix2KfYoWBcbiAgICB9XG5cbiAgICBpZiAoIV9hZGRyZXNzLmV4aXN0cykge1xuICAgICAgICBwbGFjZU9yZGVyLmRpc2FibGVkID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYWNlT3JkZXIuZGlzYWJsZWQgPSBmYWxzZVxuICAgIH1cblxuICAgIGFkZENoYW5nZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgYWRkQWRkcmVzcygpXG4gICAgfSlcblxuICAgIHBsYWNlT3JkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIG9yZGVyUGxhY2VkKG5hbm9pZCgyMSkpXG4gICAgfSlcblxuICAgIGlmIChfYWRkcmVzcy5leGlzdHMpIHtcbiAgICAgICAgYWRkcmVzc0NvbnRhaW5lci5hcHBlbmQoYWRkcmVzc1ApXG4gICAgICAgIGFkZHJlc3NDb250YWluZXIuYXBwZW5kKGxhbmRtYXJrUClcbiAgICAgICAgYWRkcmVzc0NvbnRhaW5lci5hcHBlbmQoaW5zdFApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkcmVzc0NvbnRhaW5lci5hcHBlbmQoYWRkcmVzc0RORSlcbiAgICB9XG5cbiAgICBzaGlwcGluZy5pZCA9ICdncmF5LXRleHQnXG5cbiAgICBhZGRyZXNzQ29udGFpbmVyLmFwcGVuZChhZGRDaGFuZ2UpXG4gICAgcHJpY2VDb250YWluZXIuYXBwZW5kKHN1YnRvdGFsKVxuICAgIHByaWNlQ29udGFpbmVyLmFwcGVuZChzaGlwcGluZylcbiAgICBtYWluLmFwcGVuZChhZGRyZXNzQ29udGFpbmVyKVxuICAgIG1haW4uYXBwZW5kKHByaWNlQ29udGFpbmVyKVxuICAgIG1haW4uYXBwZW5kKHBsYWNlT3JkZXIpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChtYWluKVxuICAgIGZsYWcgPSAnb3JkZXInXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0NhcnQocHJvZHVjdF9pbmRleCwgaSkge1xuICAgIGNhcnRJbmRleGVzLnB1c2gocHJvZHVjdF9pbmRleClcbiAgICBwb3BVcCgxLCBpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVWaWV3Q2FydCgpIHtcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjYXJ0QXJyRGV0YWlscyA9IFtdXG4gICAgY2FydEFyciA9IHt9XG4gICAgY2FydEFyck9HID0ge31cbiAgICBsZXQgYSA9ICcnXG4gICAgbGV0IGluZHgyID0gLTFcbiAgICBsZXQgaWlpaSA9IDBcbiAgICBtYWluLmlkID0gJ2NhcnQtbWFpbidcbiAgICBjYXJ0SW5kZXhlcy5mb3JFYWNoKChjYXJ0SW5kZXgpID0+IHtcbiAgICAgICAgcHJvZHVjdHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhcnRJbmRleCA9PSBwLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwLnByb2R1Y3RfdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdMaXZpbmdyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IGxpdmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gbGl2aW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnS2lkcyBCZWRyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IGtiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IGtiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdNYXN0ZXIgQmVkcm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSBhYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBhYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnRGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSBkaW5pbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IGRpbmluZ3Jvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1JlY2VwdGlvbnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSByZWNlcHRpb25zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gcmVjZXB0aW9uc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUViBVbml0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IHR2dW5pdHNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSB0dnVuaXRzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXJ0QXJyRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIGlmIChjYXJ0QXJyRGV0YWlscy5sZW5ndGggPD0gMCkge1xuICAgICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgICBlbXB0eS5pZCA9ICdjYXJ0LWVtcHR5J1xuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgIGVtcHR5LnRleHRDb250ZW50ID0gJ1Nob3BwaW5nIENhcnQgaXMgRW1wdHkuJ1xuICAgICAgICAgICAgYWRkLnRleHRDb250ZW50ID0gJ0FkZCBJdGVtcydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVtcHR5LnRleHRDb250ZW50ID0gJ9i52LHYqNipINin2YTYqtiz2YjZgiDZgdin2LHYutipLidcbiAgICAgICAgICAgIGFkZC50ZXh0Q29udGVudCA9ICfYo9i22YEg2YXZhtiq2KzYp9iqJ1xuICAgICAgICB9XG4gICAgICAgIGFkZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGdvSG9tZSgpXG4gICAgICAgIH0pXG4gICAgICAgIG1haW4uY2xhc3NMaXN0LmFkZCgnZW1wdHktY2FydC1tYWluJylcbiAgICAgICAgbWFpbi5hcHBlbmQoZW1wdHkpXG4gICAgICAgIG1haW4uYXBwZW5kKGFkZClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBub3RpZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IG1pZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IGNhcnRmb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBwcmljZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBub3RpZlAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3QgdG90YWxwcmljZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBwbGFjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cbiAgICAgICAgdHAgPSAwXG5cbiAgICAgICAgbm90aWYuaWQgPSAnbm90aWYnXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9ICdQcm9kdWN0J1xuICAgICAgICAgICAgcHJpY2UudGV4dENvbnRlbnQgPSAnUHJpY2UnXG4gICAgICAgICAgICBub3RpZlAudGV4dENvbnRlbnQgPSAnSXRlbSBSZW1vdmVkIGZyb20gQ2FydCEnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfYp9mE2YXZhtiq2KwnXG4gICAgICAgICAgICBwcmljZS50ZXh0Q29udGVudCA9ICfYp9mE2LPYudixJ1xuICAgICAgICAgICAgbm90aWZQLnRleHRDb250ZW50ID0gJyDYqtmF2Kog2KfZhNil2LLYp9mE2Kkg2YXZhiDYudix2KjYqSDYp9mE2KrYs9mI2YIhJ1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhjYXJ0QXJyKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgbGV0IHByb2QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICAgIGxldCB0aXRsZWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgICAgIGxldCBwcmljZWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgICAgIGxldCBobGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdocicpXG4gICAgICAgICAgICBsZXQgcmVtb3ZlSW1nRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIGxldCByZW1vdmVJbWcgPSBuZXcgSW1hZ2UoKVxuXG4gICAgICAgICAgICByZW1vdmVJbWcuc3JjID0gcmVtb3ZlSWNuXG4gICAgICAgICAgICByZW1vdmVJbWcuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMjJweDtoZWlnaHQ6IDIycHg7JylcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVpLnRleHRDb250ZW50ID0gYCR7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucF9pZFxuICAgICAgICAgICAgICAgIH0sICR7cHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wcm9kdWN0X3RpdGxlX2VufWBcbiAgICAgICAgICAgICAgICBwcmljZWkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2VfZW5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGl0bGVpLnRleHRDb250ZW50ID0gYCR7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucF9pZFxuICAgICAgICAgICAgICAgIH3YjCAke3Byb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF90aXRsZV9hcn1gXG4gICAgICAgICAgICAgICAgcHJpY2VpLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wcm9kdWN0X3ByaWNlX2FyXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhsYy5jbGFzc0xpc3QuYWRkKCdobGMnKVxuICAgICAgICAgICAgcHJpY2VpLmNsYXNzTGlzdC5hZGQoJ3FwJylcblxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBpbWcuc3JjID0gY2FydEFyck9HW2Ake2l9LmpwZ2BdXG4gICAgICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZCgnY2FydC1pdGVtLWltZycpXG4gICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9wdWxhdGVJdGVtKDgsIGkpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZW1vdmVJbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FydEFyckRldGFpbHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRBcnJbYCR7aX0uanBnYF1cbiAgICAgICAgICAgICAgICBkZWxldGUgY2FydEFyck9HW2Ake2l9LmpwZ2BdXG4gICAgICAgICAgICAgICAgY2FydEluZGV4ZXMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgbmZsYWcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHBvcHVsYXRlVmlld0NhcnQoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGVtcC5jbGFzc0xpc3QuYWRkKCdjYXJ0LWl0ZW0nKVxuXG4gICAgICAgICAgICByZW1vdmVJbWdEaXYuYXBwZW5kKHJlbW92ZUltZylcbiAgICAgICAgICAgIHByb2QuYXBwZW5kKGltZylcbiAgICAgICAgICAgIHByb2QuYXBwZW5kKHRpdGxlaSlcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHByb2QpXG4gICAgICAgICAgICB0ZW1wLmFwcGVuZChwcmljZWkpXG4gICAgICAgICAgICB0ZW1wLmFwcGVuZChyZW1vdmVJbWdEaXYpXG4gICAgICAgICAgICBtaWQuYXBwZW5kKHRlbXApXG4gICAgICAgICAgICBtaWQuYXBwZW5kKGhsYylcblxuICAgICAgICAgICAgdHAgKz0gcGFyc2VJbnQocHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wcm9kdWN0X3ByaWNlKVxuICAgICAgICB9XG4gICAgICAgIGxldCBobGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdocicpXG4gICAgICAgIGhsYy5jbGFzc0xpc3QuYWRkKCdobGMnKVxuXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICAgICAgdG90YWxwcmljZS50ZXh0Q29udGVudCA9IGBUb3RhbCBQcmljZTogJHt0cH1gXG4gICAgICAgICAgICBwbGFjZS50ZXh0Q29udGVudCA9IGBDb250aW51ZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvdGFscHJpY2UudGV4dENvbnRlbnQgPSBg2KfYrNmF2KfZhNmKINin2YTYs9i52LE6ICR7dHB9YFxuICAgICAgICAgICAgcGxhY2UudGV4dENvbnRlbnQgPSBg2KfZhNin2LPYqtmF2LHYp9ixYFxuICAgICAgICB9XG5cbiAgICAgICAgcGxhY2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1bGF0ZU9yZGVyKClcbiAgICAgICAgfSlcblxuICAgICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0aXQnKVxuICAgICAgICBwcmljZS5jbGFzc0xpc3QuYWRkKCdxcGgnKVxuXG4gICAgICAgIGhlYWRlci5hcHBlbmQodGl0bGUpXG4gICAgICAgIGhlYWRlci5hcHBlbmQocHJpY2UpXG5cbiAgICAgICAgaGVhZGVyLmlkID0gJ2NhcnQtaGVhZGVyJ1xuICAgICAgICBtaWQuaWQgPSAnY2FydC1taWQnXG4gICAgICAgIHRvdGFscHJpY2UuaWQgPSAnY2FydC10b3RhbC1wcmljZSdcbiAgICAgICAgY2FydGZvb3Rlci5pZCA9ICdjYXJ0LWZvb3RlcidcblxuICAgICAgICBjYXJ0Zm9vdGVyLmFwcGVuZCh0b3RhbHByaWNlKVxuICAgICAgICBjYXJ0Zm9vdGVyLmFwcGVuZChwbGFjZSlcblxuICAgICAgICBpZiAoIW5mbGFnKSB7XG4gICAgICAgICAgICBub3RpZi5hcHBlbmQobm90aWZQKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQobm90aWYpXG4gICAgICAgICAgICBuZmxhZyA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIG1haW4uYXBwZW5kKGhlYWRlcilcbiAgICAgICAgbWFpbi5hcHBlbmQoaGxjKVxuICAgICAgICBtYWluLmFwcGVuZChtaWQpXG4gICAgICAgIG1haW4uYXBwZW5kKGNhcnRmb290ZXIpXG4gICAgfVxuXG4gICAgU3RvcmFnZS5zYXZlQ2FydChjYXJ0QXJyRGV0YWlscywgY2FydEFyciwgY2FydEFyck9HLCBjYXJ0SW5kZXhlcylcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgZmxhZyA9ICdjYXJ0J1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1Jlc3VsdHNDb3VudChtLCBhKSB7XG4gICAgbGV0IHJlc3VsdHNGb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICByZXN1bHRzRm91bmQuaWQgPSAncmVzdWx0cy1mb3VuZCdcbiAgICBsZXQgZ3JtID0gJydcblxuICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGdybSA9ICcgd2FzJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JtID0gJ3Mgd2VyZSdcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzRm91bmQudGV4dENvbnRlbnQgPSBgJHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLmxlbmd0aFxuICAgICAgICB9IFByb2R1Y3Qke2dybX0gZm91bmQuYFxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZ3JtID0gJ9mF2YbYqtisJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JtID0gJ9mF2YbYqtis2KfYqidcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzRm91bmQudGV4dENvbnRlbnQgPSBg2KrZhSDYp9mE2LnYq9mI2LEg2LnZhNmJICR7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhKS5sZW5ndGhcbiAgICAgICAgfSAke2dybX0uYFxuICAgIH1cbiAgICBtLmFwcGVuZChyZXN1bHRzRm91bmQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlZGl0RGlzdGFuY2UoczEsIHMyKSB7XG4gICAgczEgPSBzMS50b0xvd2VyQ2FzZSgpXG4gICAgczIgPSBzMi50b0xvd2VyQ2FzZSgpXG5cbiAgICB2YXIgY29zdHMgPSBuZXcgQXJyYXkoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHMxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBsYXN0VmFsdWUgPSBpXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IHMyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoaSA9PSAwKSBjb3N0c1tqXSA9IGpcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBjb3N0c1tqIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMxLmNoYXJBdChpIC0gMSkgIT0gczIuY2hhckF0KGogLSAxKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihNYXRoLm1pbihuZXdWYWx1ZSwgbGFzdFZhbHVlKSwgY29zdHNbal0pICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgIGNvc3RzW2ogLSAxXSA9IGxhc3RWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBuZXdWYWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA+IDApIGNvc3RzW3MyLmxlbmd0aF0gPSBsYXN0VmFsdWVcbiAgICB9XG4gICAgcmV0dXJuIGNvc3RzW3MyLmxlbmd0aF1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbWlsYXJpdHkoczEsIHMyKSB7XG4gICAgdmFyIGxvbmdlciA9IHMxXG4gICAgdmFyIHNob3J0ZXIgPSBzMlxuICAgIGlmIChzMS5sZW5ndGggPCBzMi5sZW5ndGgpIHtcbiAgICAgICAgbG9uZ2VyID0gczJcbiAgICAgICAgc2hvcnRlciA9IHMxXG4gICAgfVxuICAgIHZhciBsb25nZXJMZW5ndGggPSBsb25nZXIubGVuZ3RoXG4gICAgaWYgKGxvbmdlckxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiAxLjBcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgICAgKGxvbmdlckxlbmd0aCAtIGVkaXREaXN0YW5jZShsb25nZXIsIHNob3J0ZXIpKSAvXG4gICAgICAgIHBhcnNlRmxvYXQobG9uZ2VyTGVuZ3RoKVxuICAgIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaFJlc3VsdHModGFyZ2V0KSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmZvY3VzKClcbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIHJlc3VsdHNRdWV1ZSA9IG5ldyBQcmlvcml0eVF1ZXVlKChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhWzFdID4gYlsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFbMV0gPCBiWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIHRhcmdldCA9IHRhcmdldC50b1VwcGVyQ2FzZSgpXG4gICAgbGV0IGJyZWFrayA9IGZhbHNlXG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKC9bQS1aYS16XVxcZFxcZChcXGQpPyhcXGQpPy8pXG4gICAgaWYgKHJlLnRlc3QodGFyZ2V0KSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHNbaV1cbiAgICAgICAgICAgIGlmIChwcm9kdWN0LnBfaWQgPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1F1ZXVlLmVucXVldWUoW2ksIDEsIHByb2R1Y3QucHJvZHVjdF90eXBlXSlcbiAgICAgICAgICAgICAgICBicmVha2sgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFicmVha2spIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvb2wgPSBbXVxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzW2ldXG4gICAgICAgICAgICBwb29sLnB1c2goXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X2Rlc2NyaXB0aW9uX2FyLFxuICAgICAgICAgICAgICAgIHByb2R1Y3QucHJvZHVjdF9kZXNjcmlwdGlvbl9lbixcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnByb2R1Y3RfdGl0bGVfYXIsXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X3RpdGxlX2VuLFxuICAgICAgICAgICAgICAgIHByb2R1Y3QucHJvZHVjdF90eXBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBwb29sLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBlbC50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaW0gPSBzaW1pbGFyaXR5KGVsLCB0YXJnZXQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbSA+IDAuNjUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICh0YXJnZXQubGVuZ3RoID4gMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbC5pbmNsdWRlcyh0YXJnZXQpIHx8IHRhcmdldC5pbmNsdWRlcyhlbCkpKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWRkZWQuaW5jbHVkZXMocHJvZHVjdC5wX2lkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHNRdWV1ZS5lbnF1ZXVlKFtpLCBzaW0sIHByb2R1Y3QucHJvZHVjdF90eXBlXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZC5wdXNoKHByb2R1Y3QucF9pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgc3JjaC52YWx1ZSA9ICcnXG4gICAgcG9wdWxhdGVTZWFyY2hSZXN1bHRzKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlU2VhcmNoUmVzdWx0cygpIHtcbiAgICBsZXQgciA9IGNsb25lRGVlcChyZXN1bHRzUXVldWUpXG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgc2VhcmNoQXJyID0ge31cbiAgICBsZXQgbHMgPSBbXVxuICAgIGxldCBpbmR4eCA9IDBcbiAgICB3aGlsZSAoIXIuaXNFbXB0eSgpKSB7XG4gICAgICAgIGxldCBsID0gci5kZXF1ZXVlKClcbiAgICAgICAgbHMucHVzaChsKVxuICAgIH1cblxuICAgIGxzLmZvckVhY2goKGwpID0+IHtcbiAgICAgICAgbGV0IHAgPSBwcm9kdWN0c1tsWzBdXVxuICAgICAgICBpZiAobFsyXSA9PSAnTGl2aW5ncm9vbXMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gbGl2aW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfSBlbHNlIGlmIChsWzJdID09ICdLaWRzIEJlZHJvb21zJykge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0ga2JlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSBrYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfSBlbHNlIGlmIChsWzJdID09ICdNYXN0ZXIgQmVkcm9vbXMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBhYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IGFiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9IGVsc2UgaWYgKGxbMl0gPT0gJ0RpbmluZ3Jvb21zJykge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IGRpbmluZ3Jvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH0gZWxzZSBpZiAobFsyXSA9PSAnUmVjZXB0aW9ucycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IHJlY2VwdGlvbnNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IHJlY2VwdGlvbnNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfSBlbHNlIGlmIChsWzJdID09ICdUViBVbml0cycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IHR2dW5pdHNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IHR2dW5pdHNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfVxuICAgICAgICBzZWFyY2hBcnJEZXRhaWxzLnB1c2gobFswXSlcbiAgICB9KVxuXG4gICAgc2hvd1Jlc3VsdHNDb3VudChtaWRkbGVDb250YWluZXIsIHNlYXJjaEFycilcblxuICAgIGZsYWcgPSAnc2VhcmNoJ1xuICAgIGxldCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBncmlkLmlkID0gJ2dyaWQnXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKHNlYXJjaEFycikubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGltZyA9IGNyZWF0ZUNhcmQoZ3JpZCwgLTEsIGkpXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHBvcHVsYXRlSXRlbSgtMSwgaSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChncmlkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocikge1xuICAgIGxldCBudW1cbiAgICBsZXQgYiA9IFtdXG4gICAgaWYgKDIwMDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAyNTAwKSB7XG4gICAgICAgIG51bSA9IDZcbiAgICB9XG4gICAgaWYgKDE2MDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAyMDAwKSB7XG4gICAgICAgIG51bSA9IDVcbiAgICB9XG4gICAgaWYgKDEzMDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAxNjAwKSB7XG4gICAgICAgIG51bSA9IDRcbiAgICB9XG4gICAgaWYgKDEwMjQgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAxMzAwKSB7XG4gICAgICAgIG51bSA9IDNcbiAgICB9XG4gICAgaWYgKDYwMCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDEwMjQpIHtcbiAgICAgICAgbnVtID0gMlxuICAgIH1cbiAgICBpZiAoMCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDYwMCkge1xuICAgICAgICBudW0gPSAxXG4gICAgfVxuXG4gICAgci5pbm5lckhUTUwgPSAnJ1xuXG4gICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IE1hdGguY2VpbCgxMCAvIG51bSk7IGlpICs9IDEpIHtcbiAgICAgICAgbGV0IGFyID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IGlpICogbnVtOyBpIDwgaWkgKiBudW0gKyBudW07IGkrKykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlY29tbWVuZGF0aW9uc0FycikuaW5jbHVkZXMoYCR7aX0uanBnYCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gY3JlYXRlQ2FyZChjLCA3LCBpKVxuICAgICAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVJdGVtKDcsIGkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBhci5wdXNoKGMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYi5wdXNoKGFyKVxuICAgIH1cbiAgICBsZXQgcCA9IDBcbiAgICBpZiAobnVtID09IDEgfHwgbnVtID09IDIpIHtcbiAgICAgICAgcCA9IDFcbiAgICB9XG4gICAgcmV0dXJuIFtiLCBNYXRoLmZsb29yKDEwIC8gbnVtKSAtIHAsIG51bV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvSG9tZSgpIHtcbiAgICBuZXdTZWxlY3QoaG9tZUJ0bilcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGNvbnRhaW5lcjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRvdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHByZXYgPSBuZXcgSW1hZ2UoKVxuICAgIGNvbnN0IHJlY29tbWVuZGF0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgbmV4dCA9IG5ldyBJbWFnZSgpXG5cbiAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgbmV4dC5zcmMgPSBuZXh0SW1nXG4gICAgcHJldi5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICBjb250YWluZXIyLmlkID0gJ2NvbnRhaW5lcjInXG5cbiAgICBwcmV2LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDUwcHg7aGVpZ2h0OiA1MHB4OycpXG4gICAgbmV4dC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiA1MHB4O2hlaWdodDogNTBweDsnKVxuICAgIGRvdHMuaWQgPSAnZG90cydcblxuICAgIGxldCBhID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVxuICAgIGxldCBiID0gYVswXVxuICAgIGxldCBjdXJyID0gMFxuICAgIGxldCBsYXN0ID0gYVsxXVxuICAgIGxldCBudW0gPSBhWzJdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgIH1cbiAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAgLyBudW0pOyBpKyspIHtcbiAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGlmIChpID09IGN1cnIpIHtcbiAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxNXB4O2hlaWdodDogMTVweDsnKVxuICAgICAgICAgICAgZG90LnNyYyA9IHNkb3RJY25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxMnB4O2hlaWdodDogMTJweDsnKVxuICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICB9XG4gICAgICAgIGRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgIH1cbiAgICBpZiAoIWhhc1RvdWNoKCkpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgIGEgPSBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyZWNvbW1lbmRhdGlvbnMpXG4gICAgICAgICAgICBjdXJyID0gMFxuICAgICAgICAgICAgYiA9IGFbMF1cbiAgICAgICAgICAgIGxhc3QgPSBhWzFdXG4gICAgICAgICAgICBudW0gPSBhWzJdXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJbY3Vycl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnMuYXBwZW5kQ2hpbGQoYltjdXJyXVtpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJyIDw9IDApIHtcbiAgICAgICAgICAgICAgICBwcmV2LmNsYXNzTGlzdC5hZGQoJ3UnKVxuICAgICAgICAgICAgICAgIHByZXYuc3JjID0gdVByZXZJbWdcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJldi5jbGFzc0xpc3QucmVtb3ZlKCd1JylcbiAgICAgICAgICAgICAgICBwcmV2LnNyYyA9IHByZXZJbWdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJyID49IGxhc3QpIHtcbiAgICAgICAgICAgICAgICBuZXh0LnNyYyA9IHVOZXh0SW1nXG4gICAgICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dC5zcmMgPSBuZXh0SW1nXG4gICAgICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QucmVtb3ZlKCd1JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvdHMuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5jZWlsKDEwIC8gbnVtKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gY3Vycikge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTVweDtoZWlnaHQ6IDE1cHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IHNkb3RJY25cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTJweDtoZWlnaHQ6IDEycHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb3RzLmFwcGVuZENoaWxkKGRvdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcmV2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoY3VyciA+IDApIHtcbiAgICAgICAgICAgIGIgPSBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyZWNvbW1lbmRhdGlvbnMpWzBdXG4gICAgICAgICAgICBjdXJyLS1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYltjdXJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAgLyBudW0pOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZG90ID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxNXB4O2hlaWdodDogMTVweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxMnB4O2hlaWdodDogMTJweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gZG90SWNuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QucmVtb3ZlKCd1JylcbiAgICAgICAgICAgIG5leHQuc3JjID0gbmV4dEltZ1xuICAgICAgICAgICAgaWYgKGN1cnIgPD0gMCkge1xuICAgICAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgICAgICAgICAgICAgcHJldi5zcmMgPSB1UHJldkltZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIG5leHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyIDwgbGFzdCkge1xuICAgICAgICAgICAgYiA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylbMF1cbiAgICAgICAgICAgIGN1cnIrK1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zLmFwcGVuZENoaWxkKGJbY3Vycl1baV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbCgxMCAvIG51bSk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkb3QgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgICAgIGlmIChpID09IGN1cnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDE1cHg7aGVpZ2h0OiAxNXB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBzZG90SWNuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDEycHg7aGVpZ2h0OiAxMnB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBkb3RJY25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgcHJldi5zcmMgPSBwcmV2SW1nXG4gICAgICAgICAgICBpZiAoY3VyciA+PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgbmV4dC5zcmMgPSB1TmV4dEltZ1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgYm90dG9taW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgYWJvdXR1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgYWJvdXR1c1AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgY29uc3QgY29udGFjdHVzUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICBjb25zdCBib2R5UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGNvbnRhY3RpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBsZXQgZW1haWxQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgbGV0IHBob25lUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGxvY2F0aW9uZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBsb2NhdGlvbkggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBtYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGVtYWlsYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGNvbnN0IHBob25lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGVtYWlsYS5ocmVmID0gJ2FtZ2Fka2FtYWxzcGxhc2hAZ21haWwuY29tJ1xuICAgIHBob25lbi5ocmVmID0gJ3RlbDorMjAxMjIxMDQ1MTM1J1xuXG4gICAgZW1haWxhLnRleHRDb250ZW50ID0gJ2FtZ2Fka2FtYWxzcGxhc2hAZ21haWwuY29tJ1xuICAgIHBob25lbi50ZXh0Q29udGVudCA9ICdcXHUyMDBlKzIwMTIyMTA0NTEzNSdcblxuICAgIGNvbnN0IGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBwbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBlbS5jbGFzc0xpc3QuYWRkKCdlbXBuJylcbiAgICBwbi5jbGFzc0xpc3QuYWRkKCdlbXBuJylcbiAgICBib3R0b21pbmZvLmlkID0gJ2JvdHRvbWluZm8nXG4gICAgYWJvdXR1cy5pZCA9ICdhYm91dHVzJ1xuICAgIGNvbnRhY3RpbmZvLmlkID0gJ2NvbnRhY3RpbmZvJ1xuICAgIGxvY2F0aW9uZGl2LmlkID0gJ21hcC1jb250J1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGFib3V0dXNQLnRleHRDb250ZW50ID0gJ0Fib3V0IFVzJ1xuICAgICAgICBjb250YWN0dXNQLnRleHRDb250ZW50ID0gJ0NvbnRhY3QgVXMnXG4gICAgICAgIGJvZHlQLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBNYXhpbWUgbW9sbGl0aWEsIG1vbGVzdGlhZSBxdWFzIHZlbCBzaW50IGNvbW1vZGkgcmVwdWRpYW5kYWUgY29uc2VxdXVudHVyIHZvbHVwdGF0dW0gbGFib3J1bSBudW1xdWFtIGJsYW5kaXRpaXMgaGFydW0gcXVpc3F1YW0gZWl1cyBzZWQgb2RpdCBmdWdpYXQgaXVzdG8gZnVnYSBwcmFlc2VudGl1bSBvcHRpbywgZWFxdWUgcmVydW0hIFByb3ZpZGVudCBzaW1pbGlxdWUgYWNjdXNhbnRpdW0gbmVtbyBhdXRlbS4gVmVyaXRhdGlzIG9iY2FlY2F0aSB0ZW5ldHVyIGl1cmUgZWl1cyBlYXJ1bSB1dCBtb2xlc3RpYXMgYXJjaGl0ZWN0byB2b2x1cHRhdGUgYWxpcXVhbSBuaWhpbCwgZXZlbmlldCBhbGlxdWlkIGN1bHBhIG9mZmljaWEgYXV0ISBJbXBlZGl0IHNpdCBzdW50IHF1YWVyYXQsIG9kaXQsIHRlbmV0dXIgZXJyb3IsIGhhcnVtLidcbiAgICAgICAgbG9jYXRpb25ILnRleHRDb250ZW50ID0gJ0FkZHJlc3M6ICdcbiAgICAgICAgZW1haWxQLnRleHRDb250ZW50ID0gJ0VtYWlsOiAnXG4gICAgICAgIHBob25lUC50ZXh0Q29udGVudCA9ICdQaG9uZSBOdW1iZXI6ICdcbiAgICB9IGVsc2Uge1xuICAgICAgICBhYm91dHVzUC50ZXh0Q29udGVudCA9ICfZhdi52YTZiNmF2KfYqiDYudmG2KcnXG4gICAgICAgIGNvbnRhY3R1c1AudGV4dENvbnRlbnQgPSAn2KXYqti12YQg2KjZhtinJ1xuICAgICAgICBib2R5UC50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAn2YTZiNix2YrZhSDYp9mK2KjYs9mI2YUg2K/ZiNmE2KfYsSDYs9mK2Kog2KPZhdmK2KogLNmD2YjZhtiz2YrZg9iq2YrYqtmI2LEg2KPYr9in2YrYqNinINmK2LPZg9mK2YbYrCDYo9mE2YrYp9mK2Kos2LPZitiqINiv2Ygg2KPZitmI2LPZhdmI2K8g2KrZitmF2KjZiNixINij2YbZg9in2YrYr9mK2K8g2YrZiNmG2KrZitmI2Kog2YTYp9io2YjYsdmKINin2Kog2K/ZiNmE2KfYsSDZhdin2KzZhtinINij2YTZitmD2YrZiNinIC4g2YrZiNiqINin2YbZitmFINij2K8g2YXZitmG2YrZhSDZgdmK2YbYp9mK2YUs2YPZitmI2KfYsyDZhtmI2LPYqtix2YrYryDYo9mD2LPZitixINiz2YrYqtin2LTZhiDZitmE2YTYo9mF2YPZiCDZhNin2KjZiNix2KPYsyDZhtmK2LPZiiDZitiqINij2YTZitmD2YrZiNioINij2YPYsyDYo9mK2Kcg2YPZiNmF2YXZiNiv2Ygg2YPZiNmG2LPZitmD2YrZiNin2KogLiDYr9mK2YjYp9izINij2YrZiNiq2Yog2KPYsdmK2LHZiiDYr9mI2YTYp9ixINil2YYg2LHZitio2LHZitmH2YrZhtiv2YrYsdij2YrYqiDZgdmI2YTZitmI2KjYqtin2KrZiiDZgdmK2YTYp9mK2Kog2KPZitiz2LPZiiDZg9in2YrZhNmE2YrZiNmFINiv2YjZhNin2LEg2KPZitmIINmB2YrYrNin2YrYqiDZhtmK2YjZhNinINio2KfYsdin2YrYp9iq2YrZiNixLiDYo9mK2YPYs9iz2YrYqNiq2YrZiNixINiz2KfZitmG2Kog2KPZiNmD2YPYp9mK2YPYp9iqINmD2YrZiNio2KfZitiv2KfYqtin2Kog2YbZiNmGINio2LHZiNin2YrYr9mK2YbYqiAs2LPZitmI2YbYqiDYp9mGINmD2YrZiNmE2KjYpyDZg9mK2Ygg2KPZiNmB2YrYs9mK2Kcg2K/Zitiz2YrYsdmK2YjZhtiq2YXZiNmE2YrYqiDYp9mG2YrZhSDYo9mK2K/ZiiDYp9mK2LPYqiDZhNin2KjZiNix2YrZiNmFLidcbiAgICAgICAgbG9jYXRpb25ILnRleHRDb250ZW50ID0gJ9in2YTYudmG2YjYp9mGOiAnXG4gICAgICAgIGVtYWlsUC50ZXh0Q29udGVudCA9ICfYp9mE2KjYsdmK2K8g2KfZhNin2YTZg9iq2LHZiNmG2Yo6ICdcbiAgICAgICAgcGhvbmVQLnRleHRDb250ZW50ID0gJ9ix2YLZhSDYp9mE2YfYp9iq2YE6ICdcbiAgICB9XG5cbiAgICBtYXAuaW5uZXJIVE1MID1cbiAgICAgICAgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL2VtYmVkP3BiPSExbTE4ITFtMTIhMW0zITFkOTI4LjM5ODAyMjQyNDI0NzEhMmQzMS4zNTAyMzc1MzU5MTI1NyEzZDMwLjA2NzkzMTM5MDgyOTQwOCEybTMhMWYwITJmMCEzZjAhM20yITFpMTAyNCEyaTc2OCE0ZjEzLjEhM20zITFtMiExczB4MTQ1ODNlMGIwZmMzZDY0MyUzQTB4OGQ1YTA1ZmNmMzVmMzk0ZSEyc1Rhd2ZpayUyMEFobWVkJTIwRWwtQmFrcnklMkMlMjBBbCUyME1hbnRlcWFoJTIwYXMlMjBTYWRlc2FoJTJDJTIwTmFzciUyMENpdHklMkMlMjBDYWlybyUyMEdvdmVybm9yYXRlJTIwNDQ1MDQ3MyE1ZTAhM20yITFzZW4hMnNlZyE0djE2NzgzOTcxNzc5NzUhNW0yITFzZW4hMnNlZ1wiIHN0eWxlPVwiYm9yZGVyOjA7d2lkdGg6IDgwdnc7IGhlaWdodDogNTAwcHg7XCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgbG9hZGluZz1cImxhenlcIiByZWZlcnJlcnBvbGljeT1cIm5vLXJlZmVycmVyLXdoZW4tZG93bmdyYWRlXCIgaWQ9XCJtYXBcIj48L2lmcmFtZT4nXG5cbiAgICBjb250YWluZXIuaWQgPSAncmVjb21tZW5kYXRpb25zLWNvbnRhaW5lcidcbiAgICBwcmV2LmlkID0gJ3ByZXYtaW1nJ1xuICAgIG5leHQuaWQgPSAnbmV4dC1pbWcnXG4gICAgcmVjb21tZW5kYXRpb25zLmlkID0gJ3JlY29tbWVuZGF0aW9ucydcblxuICAgIGVtLmFwcGVuZChlbWFpbFApXG4gICAgZW0uYXBwZW5kKGVtYWlsYSlcbiAgICBwbi5hcHBlbmQocGhvbmVQKVxuICAgIHBuLmFwcGVuZChwaG9uZW4pXG4gICAgbG9jYXRpb25kaXYuYXBwZW5kQ2hpbGQobG9jYXRpb25IKVxuICAgIGxvY2F0aW9uZGl2LmFwcGVuZENoaWxkKG1hcClcbiAgICBjb250YWN0aW5mby5hcHBlbmQoY29udGFjdHVzUClcbiAgICBjb250YWN0aW5mby5hcHBlbmQoZW0pXG4gICAgY29udGFjdGluZm8uYXBwZW5kKHBuKVxuICAgIGNvbnRhY3RpbmZvLmFwcGVuZChsb2NhdGlvbmRpdilcbiAgICBhYm91dHVzLmFwcGVuZENoaWxkKGFib3V0dXNQKVxuICAgIGFib3V0dXMuYXBwZW5kQ2hpbGQoYm9keVApXG4gICAgYm90dG9taW5mby5hcHBlbmQoYWJvdXR1cylcbiAgICBib3R0b21pbmZvLmFwcGVuZChjb250YWN0aW5mbylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocHJldilcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVjb21tZW5kYXRpb25zKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXh0KVxuICAgIGNvbnRhaW5lcjIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgIGNvbnRhaW5lcjIuYXBwZW5kQ2hpbGQoZG90cylcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyMilcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kQ2hpbGQoYm90dG9taW5mbylcbiAgICBmbGFnID0gJ3BhZ2UnXG4gICAgaGlkZU1lbnUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZU1lbnUoKSB7XG4gICAgbWVudS5zdHlsZS53aWR0aCA9ICcwJSdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1RvdWNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fFxuICAgICAgICBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwIHx8XG4gICAgICAgIG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMFxuICAgIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNob29zZU1vZGUobikge1xuICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gbGl2aW5ncm9vbXNBcnJcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIGFiZWRyb29tc0FyclxuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4ga2JlZHJvb21zQXJyXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiByZWNlcHRpb25zQXJyXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBkaW5pbmdyb29tc0FyclxuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gdHZ1bml0c0FyclxuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gcmVjb21tZW5kYXRpb25zQXJyXG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBjYXJ0QXJyXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoQXJyXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNob29zZURldGFpbHMobikge1xuICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gTGl2aW5nUm9vbXNEZXRhaWxzXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBNYXN0ZXJCZWRyb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIEtpZHNCZWRyb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIFJlY2VwdGlvbnNEZXRhaWxzXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBEaW5pbmdSb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFRWVW5pdHNEZXRhaWxzXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbnNBcnJEZXRhaWxzXG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBjYXJ0QXJyRGV0YWlsc1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaEFyckRldGFpbHNcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDYXJkKGNvbnRhaW5lciwgbiwgaW5kZXgpIHtcbiAgICBsZXQgYXJyID0gY2hvb3NlTW9kZShuKVxuICAgIGxldCBhcnJEZXRhaWxzID0gY2hvb3NlRGV0YWlscyhuKVxuICAgIGxldCBwX3RpdGxlX2VuID0gJydcbiAgICBsZXQgcF90aXRsZV9hciA9ICcnXG4gICAgbGV0IHBfcHJpY2VfZW4gPSAnJ1xuICAgIGxldCBwX3ByaWNlX2FyID0gJydcblxuICAgIGNvbnN0IHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgaW5mb0wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGNhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgIGNvbnN0IHRtcEwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IG5hbWVQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgcHJpY2VQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgaHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdocicpXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ3BvcHVwdGV4dCcpXG4gICAgc3Bhbi5pZCA9IGBteVBvcHVwLSR7aW5kZXh9YFxuICAgIGNhcnQuY2xhc3NMaXN0LmFkZCgndHRwb3B1cCcpXG4gICAgdG1wLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nKVxuICAgIGluZm8uY2xhc3NMaXN0LmFkZCgnaW5mbycpXG4gICAgaW5mb0wuY2xhc3NMaXN0LmFkZCgnaW5mby1sZWZ0JylcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgIGltZy5zcmMgPSBhcnJbYCR7aW5kZXh9LmpwZ2BdXG4gICAgcF90aXRsZV9lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF90aXRsZV9lblxuICAgIHBfdGl0bGVfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLnByb2R1Y3RfdGl0bGVfYXJcbiAgICBwX3ByaWNlX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3ByaWNlX2VuXG4gICAgcF9wcmljZV9hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF9wcmljZV9hclxuICAgIGlmIChuID09IDcpIHtcbiAgICAgICAgaW5mb0wuY2xhc3NMaXN0LmFkZCgncmVjb21tZW5kYXRpb24taW5mby1MJylcbiAgICAgICAgaW5mby5jbGFzc0xpc3QuYWRkKCdyZWNvbW1lbmRhdGlvbi1pbmZvJylcbiAgICB9XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnZGF0YS1zY2FsZScsICcxLjInKVxuICAgIGlmIChsYW5nQnRuLnZhbHVlID09ICdlbmdsaXNoJykge1xuICAgICAgICBuYW1lUC50ZXh0Q29udGVudCA9IHBfdGl0bGVfZW5cbiAgICAgICAgY2FydC50ZXh0Q29udGVudCA9ICdBZGQgdG8gQ2FydCdcbiAgICAgICAgcHJpY2VQLnRleHRDb250ZW50ID0gcF9wcmljZV9lblxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gJ0l0ZW0gQWRkZWQgdG8gQ2FydCEnXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZVAudGV4dENvbnRlbnQgPSBwX3RpdGxlX2FyXG4gICAgICAgIGNhcnQudGV4dENvbnRlbnQgPSAn2KfYttin2YHYqSDYp9mE2Yog2LnYsdio2Kkg2KfZhNiq2LPZiNmCJ1xuICAgICAgICBwcmljZVAudGV4dENvbnRlbnQgPSBwX3ByaWNlX2FyXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSAn2KrZhdiqINin2YTYpdi22KfZgdipINil2YTZiSDYudix2KjYqSDYp9mE2KrYs9mI2YIhJ1xuICAgIH1cblxuICAgIGNhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGFkZFRvQ2FydChwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLmluZGV4LCBpbmRleClcbiAgICB9KVxuXG4gICAgY2FydC5hcHBlbmQoc3BhbilcbiAgICBpbmZvTC5hcHBlbmQobmFtZVApXG4gICAgaW5mb0wuYXBwZW5kKHByaWNlUClcbiAgICBpbmZvLmFwcGVuZChpbmZvTClcbiAgICB0bXBMLmFwcGVuZChocilcbiAgICB0bXBMLmFwcGVuZChpbmZvKVxuICAgIHRtcC5hcHBlbmQoaW1nKVxuICAgIHRtcC5hcHBlbmQodG1wTClcbiAgICB0bXAuYXBwZW5kKGNhcnQpXG4gICAgY29udGFpbmVyLmFwcGVuZCh0bXApXG4gICAgcmV0dXJuIGltZ1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUl0ZW0obiwgaSkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGN1cnJJdGVtLnB1c2gobilcbiAgICBjdXJySXRlbS5wdXNoKGkpXG4gICAgbGV0IHBfY29kZV9lbiA9ICcnXG4gICAgbGV0IHBfY29kZV9hciA9ICcnXG4gICAgbGV0IHBfZGltZW5zaW9uc19lbiA9ICcnXG4gICAgbGV0IHBfZGltZW5zaW9uc19hciA9ICcnXG4gICAgbGV0IHBfZGVzY19lbiA9ICcnXG4gICAgbGV0IHBfZGVzY19hciA9ICcnXG5cbiAgICBmbGFnID0gJ2l0ZW0nXG4gICAgbGV0IGZsID0gZmFsc2VcbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCB2aWV3SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGV0YWlsc0hlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRldGFpbHNCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXNjMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGVzYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRlc2MzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBsZXQgaW1nID0gJydcblxuICAgIGltZyA9IGNyZWF0ZUNhcmQoaXRlbSwgbiwgaSlcblxuICAgIGxldCBhcnJEZXRhaWxzID0gY2hvb3NlRGV0YWlscyhuKVxuXG4gICAgbGV0IGFyciA9IFtdXG5cbiAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgYXJyID0gbGl2aW5ncm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgYXJyID0gYWJlZHJvb21zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGFyciA9IGtiZWRyb29tc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBhcnIgPSByZWNlcHRpb25zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGFyciA9IGRpbmluZ3Jvb21zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIGFyciA9IHR2dW5pdHNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgYXJyID0gcmVjb21tZW5kYXRpb25zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIGFyciA9IGNhcnRBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIGFyciA9IHNlYXJjaEFyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBwX2NvZGVfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9jb2RlX2VuXG4gICAgcF9jb2RlX2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfY29kZV9hclxuICAgIHBfZGltZW5zaW9uc19lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2RpbWVuc2lvbnNfZW5cbiAgICBwX2RpbWVuc2lvbnNfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9kaW1lbnNpb25zX2FyXG4gICAgcF9kZXNjX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfZGVzY3JpcHRpb25fZW5cbiAgICBwX2Rlc2NfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9kZXNjcmlwdGlvbl9hclxuXG4gICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoIWZsKSB7XG4gICAgICAgICAgICBjb25zdCB6b29tZWRDb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIGNvbnN0IGJsdXJyZWQgPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGJsdXJyZWQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBibHVycmVkW2tdLmNsYXNzTGlzdC5hZGQoJ3BvcHVwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZsID0gdHJ1ZVxuICAgICAgICAgICAgbGV0IHpvb21lZEluID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIGxldCB4MiA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICB6b29tZWRJbi5zcmMgPSBhcnJbYCR7aX0uanBnYF1cbiAgICAgICAgICAgIHgyLnNyYyA9IHgySWNuXG4gICAgICAgICAgICB4Mi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiA0MHB4O2hlaWdodDogNDBweDsnKVxuICAgICAgICAgICAgem9vbWVkSW4uY2xhc3NMaXN0LmFkZCgnem9vbWVkLWluJylcbiAgICAgICAgICAgIHgyLmNsYXNzTGlzdC5hZGQoJ3gyJylcbiAgICAgICAgICAgIHpvb21lZENvbnQuY2xhc3NMaXN0LmFkZCgnem9vbWVkLWNvbnRhaW5lcicpXG4gICAgICAgICAgICB6b29tZWRDb250LmFwcGVuZENoaWxkKHpvb21lZEluKVxuICAgICAgICAgICAgem9vbWVkQ29udC5hcHBlbmRDaGlsZCh4MilcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoem9vbWVkQ29udClcbiAgICAgICAgICAgIHgyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZsID0gZmFsc2VcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3pvb21lZC1pbicpXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd4MicpXG4gICAgICAgICAgICAgICAgY29uc3QgY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnem9vbWVkLWNvbnRhaW5lcicpXG4gICAgICAgICAgICAgICAgZWxlbWVudHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c1swXSlcbiAgICAgICAgICAgICAgICBlbFswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsWzBdKVxuICAgICAgICAgICAgICAgIGNvbnN0IGJsdXJyZWQgPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBibHVycmVkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25bMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjb25bMF0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIHZpZXdJdGVtLmlkID0gJ3ZpZXctaXRlbSdcbiAgICBkZXRhaWxzLmlkID0gJ2l0ZW0tZGV0YWlscydcbiAgICBkZXRhaWxzSGVhZC5pZCA9ICdkZXRhaWxzSCdcbiAgICBkZXRhaWxzQm9keS5pZCA9ICdkZXRhaWxzQidcblxuICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICBkZXRhaWxzSGVhZC50ZXh0Q29udGVudCA9ICdQcm9kdWN0IERldGFpbHMnXG4gICAgICAgIGRlc2MyLnRleHRDb250ZW50ID0gcF9kZXNjX2VuXG4gICAgICAgIGRlc2MzLnRleHRDb250ZW50ID0gcF9kaW1lbnNpb25zX2VuXG4gICAgICAgIGRlc2MxLnRleHRDb250ZW50ID0gcF9jb2RlX2VuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGV0YWlsc0hlYWQudGV4dENvbnRlbnQgPSAn2KrZgdin2LXZitmEINin2YTZhdmG2KrYrCdcbiAgICAgICAgZGVzYzIudGV4dENvbnRlbnQgPSBwX2Rlc2NfYXJcbiAgICAgICAgZGVzYzMudGV4dENvbnRlbnQgPSBwX2RpbWVuc2lvbnNfYXJcbiAgICAgICAgZGVzYzEudGV4dENvbnRlbnQgPSBwX2NvZGVfYXJcbiAgICB9XG5cbiAgICBkZXRhaWxzQm9keS5hcHBlbmQoZGVzYzEpXG4gICAgZGV0YWlsc0JvZHkuYXBwZW5kKGRlc2MyKVxuICAgIGRldGFpbHNCb2R5LmFwcGVuZChkZXNjMylcbiAgICBkZXRhaWxzLmFwcGVuZChkZXRhaWxzSGVhZClcbiAgICBkZXRhaWxzLmFwcGVuZChkZXRhaWxzQm9keSlcbiAgICB2aWV3SXRlbS5hcHBlbmRDaGlsZChpdGVtKVxuICAgIHZpZXdJdGVtLmFwcGVuZENoaWxkKGRldGFpbHMpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZCh2aWV3SXRlbSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlR3JpZChuKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgbGV0IGltYWdlQXJyID0gY2hvb3NlTW9kZShuKVxuICAgIGZsYWcgPSAncGFnZSdcbiAgICBsZXQgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBncmlkLmlkID0gJ2dyaWQnXG5cbiAgICBzaG93UmVzdWx0c0NvdW50KG1pZGRsZUNvbnRhaW5lciwgaW1hZ2VBcnIpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGltYWdlQXJyKS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaW1nID0gY3JlYXRlQ2FyZChncmlkLCBuLCBpKVxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1bGF0ZUl0ZW0obiwgaSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgaGlkZU1lbnUoKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQoZ3JpZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlTGFuZygpIHtcbiAgICBuYXZCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBpZiAoZmxhZyA9PSAncGFnZScpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZC1wYWdlJykgfHxcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZC1wYWdlLWRkJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYnRuLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZ29Ib21lKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xpdmluZ3Jvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWR1bHRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCgyKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAna2lkcy1iZWRyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoMylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlY2VwdGlvbnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDQpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkaW5pbmdyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R2dW5pdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PSAnaXRlbScpIHtcbiAgICAgICAgICAgIHBvcHVsYXRlSXRlbShjdXJySXRlbVswXSwgY3Vyckl0ZW1bMV0pXG4gICAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PSAnY2FydCcpIHtcbiAgICAgICAgICAgIHBvcHVsYXRlVmlld0NhcnQoKVxuICAgICAgICB9IGVsc2UgaWYgKGZsYWcgPT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICAgIHBvcHVsYXRlU2VhcmNoUmVzdWx0cygpXG4gICAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PSAnb3JkZXInKSB7XG4gICAgICAgICAgICBwb3B1bGF0ZU9yZGVyKClcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdTZWxlY3QoYnV0dG9uKSB7XG4gICAgYmVkcm9vbXNCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcGFnZScpXG4gICAgbmF2QnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkLXBhZ2UnKVxuICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcGFnZS1kZCcpXG4gICAgfSlcbiAgICBpZiAoXG4gICAgICAgIFtcbiAgICAgICAgICAgIGhvbWVCdG4sXG4gICAgICAgICAgICBsaXZpbmdyb29tc0J0bixcbiAgICAgICAgICAgIHJlY2VwdGlvbnNCdG4sXG4gICAgICAgICAgICB0dnVuaXRzQnRuLFxuICAgICAgICAgICAgZGluaW5ncm9vbXNCdG4sXG4gICAgICAgIF0uaW5jbHVkZXMoYnV0dG9uKVxuICAgICkge1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcGFnZScpXG4gICAgfSBlbHNlIGlmIChbYWJlZHJvb21zQnRuLCBrYmVkcm9vbXNCdG5dLmluY2x1ZGVzKGJ1dHRvbikpIHtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXBhZ2UtZGQnKVxuICAgICAgICBiZWRyb29tc0J0bi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wYWdlJylcbiAgICB9XG4gICAgbmF2UC5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkLXAnKVxuICAgIH0pXG4gICAgbGV0IGEgPSBidXR0b24uaWRcbiAgICBzd2l0Y2ggKGEpIHtcbiAgICAgICAgY2FzZSAnaG9tZSc6XG4gICAgICAgICAgICBob21lUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2xpdmluZ3Jvb21zJzpcbiAgICAgICAgICAgIGxpdmluZ3Jvb21zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2FkdWx0cy1iZWRyb29tcyc6XG4gICAgICAgICAgICBhYmVkcm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAna2lkcy1iZWRyb29tcyc6XG4gICAgICAgICAgICBrYmVkcm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAncmVjZXB0aW9ucyc6XG4gICAgICAgICAgICByZWNlcHRpb25zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RpbmluZ3Jvb21zJzpcbiAgICAgICAgICAgIGRpbmluZ3Jvb21zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3R2dW5pdHMnOlxuICAgICAgICAgICAgdHZ1bml0c1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hMYW5nKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT0gJ2FyJykge1xuICAgICAgICBzcmNoLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAn2KfYqNit2Ksg2YfZhtinLi4nKVxuICAgICAgICBmdHIudGV4dENvbnRlbnQgPSAn2KzZhdmK2Lkg2KfZhNit2YLZiNmCINmF2K3ZgdmI2LjYqSdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYXZCdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSBuYXZCdG5zW2ldXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZBcltpXVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2UC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2UFtpXVxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gbmF2QXIyW2ldXG4gICAgICAgIH1cbiAgICAgICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdlbnMnKVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5hZGQoJ2FycycpXG4gICAgICAgIGJlZHJvb21zQnRuLnRleHRDb250ZW50ID0gJ9i62LHZgSDYp9mE2YbZiNmFJ1xuICAgICAgICBjYXJ0SW1nLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAn2LnYsdi2INi52LHYqNipINin2YTYqtiz2YjZgicpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3JjaC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1NlYXJjaCBoZXJlLi4nKVxuICAgICAgICBmdHIudGV4dENvbnRlbnQgPSAnQWxsIFJpZ2h0cyBSZXNlcnZlZC4nXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2QnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2QnRuc1tpXVxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gbmF2RW5baV1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdlAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IG5hdlBbaV1cbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IG5hdkVuMltpXVxuICAgICAgICB9XG4gICAgICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYXJzJylcbiAgICAgICAgbWVudS5jbGFzc0xpc3QuYWRkKCdlbnMnKVxuICAgICAgICBiZWRyb29tc0J0bi50ZXh0Q29udGVudCA9ICdCZWRyb29tcydcbiAgICAgICAgY2FydEltZy5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ1ZpZXcgQ2FydCcpXG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFN0b3JhZ2Uge1xuICAgIHN0YXRpYyBzYXZlQ2FydCh4LCB5LCB6LCB3KSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0QXJyRGV0YWlscycsIEpTT04uc3RyaW5naWZ5KHgpKVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FydEFycicsIEpTT04uc3RyaW5naWZ5KHkpKVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FydEFyck9HJywgSlNPTi5zdHJpbmdpZnkoeikpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0SW5kZXhlcycsIEpTT04uc3RyaW5naWZ5KHcpKVxuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQWRkcmVzcyh4KSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyQWRkcmVzcycsIEpTT04uc3RyaW5naWZ5KHgpKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXREZXRhaWxzKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRBcnJEZXRhaWxzJylcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJyKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRBcnInKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBcnJPZygpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJ0QXJyT0cnKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRJbmRleGVzKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRJbmRleGVzJylcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QWRkcmVzcygpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyQWRkcmVzcycpXG4gICAgfVxufVxuIiwiaW1wb3J0ICcuLi9zdHlsZXMvc3R5bGUuY3NzJ1xuaW1wb3J0IHtcbiAgICBnb0hvbWUsXG4gICAgcG9wdWxhdGVHcmlkLFxuICAgIG5ld1NlbGVjdCxcbiAgICBwb3B1bGF0ZUxhbmcsXG4gICAgc3dpdGNoTGFuZyxcbiAgICBsaXZpbmdyb29tc0J0bixcbiAgICBtZW51SW1nLFxuICAgIHhJbWcsXG4gICAgbWVudSxcbiAgICBob21lUCxcbiAgICBsaXZpbmdyb29tc1AsXG4gICAgcmVjZXB0aW9uc1AsXG4gICAgY2xmLFxuICAgIHR2dW5pdHNQLFxuICAgIGRpbmluZ3Jvb21zUCxcbiAgICBrYmVkcm9vbXNQLFxuICAgIGFiZWRyb29tc1AsXG4gICAgaGFzVG91Y2gsXG4gICAgaGlkZU1lbnUsXG4gICAgaG9tZUJ0bixcbiAgICBhYmVkcm9vbXNCdG4sXG4gICAga2JlZHJvb21zQnRuLFxuICAgIHJlY2VwdGlvbnNCdG4sXG4gICAgdHZ1bml0c0J0bixcbiAgICBkaW5pbmdyb29tc0J0bixcbiAgICBsYW5nQnRuLFxuICAgIHNyY2gsXG4gICAgbG9nb0ltZyxcbiAgICBjYXJ0SW1nLFxuICAgIGhlYWRlclVwLFxuICAgIGFjdGlvbnNDb250YWluZXIsXG4gICAgc2VhcmNoUmVzdWx0cyxcbiAgICBwb3B1bGF0ZVZpZXdDYXJ0LFxufSBmcm9tICcuL2luZGV4LmpzJ1xuXG5sb2dvSW1nLmlkID0gJ2xvZ28taW1nJ1xuaGVhZGVyVXAucHJlcGVuZChsb2dvSW1nKVxuY2xmLmFwcGVuZChjYXJ0SW1nKVxuY2xmLmFwcGVuZChtZW51SW1nKVxuYWN0aW9uc0NvbnRhaW5lci5hcHBlbmQoY2xmKVxuXG5pZiAoaGFzVG91Y2goKSkge1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIHNpIGluIGRvY3VtZW50LnN0eWxlU2hlZXRzKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGVTaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW3NpXVxuICAgICAgICAgICAgaWYgKCFzdHlsZVNoZWV0LnJ1bGVzKSBjb250aW51ZVxuXG4gICAgICAgICAgICBmb3IgKHZhciByaSA9IHN0eWxlU2hlZXQucnVsZXMubGVuZ3RoIC0gMTsgcmkgPj0gMDsgcmktLSkge1xuICAgICAgICAgICAgICAgIGlmICghc3R5bGVTaGVldC5ydWxlc1tyaV0uc2VsZWN0b3JUZXh0KSBjb250aW51ZVxuXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlU2hlZXQucnVsZXNbcmldLnNlbGVjdG9yVGV4dC5tYXRjaCgnOmhvdmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVTaGVldC5kZWxldGVSdWxlKHJpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV4KVxuICAgIH1cbn1cblxuaG9tZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnb0hvbWUoKVxufSlcblxubGl2aW5ncm9vbXNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgbmV3U2VsZWN0KGxpdmluZ3Jvb21zQnRuKVxuICAgIHBvcHVsYXRlR3JpZCgxKVxufSlcblxuYWJlZHJvb21zQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1NlbGVjdChhYmVkcm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDIpXG59KVxuXG5rYmVkcm9vbXNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgbmV3U2VsZWN0KGtiZWRyb29tc0J0bilcbiAgICBwb3B1bGF0ZUdyaWQoMylcbn0pXG5cbnJlY2VwdGlvbnNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgbmV3U2VsZWN0KHJlY2VwdGlvbnNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDQpXG59KVxuXG5kaW5pbmdyb29tc0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuZXdTZWxlY3QoZGluaW5ncm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDUpXG59KVxuXG50dnVuaXRzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1NlbGVjdCh0dnVuaXRzQnRuKVxuICAgIHBvcHVsYXRlR3JpZCg2KVxufSlcblxuaG9tZVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZ29Ib21lKClcbn0pXG5cbmxpdmluZ3Jvb21zUC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuZXdTZWxlY3QobGl2aW5ncm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDEpXG59KVxuXG5hYmVkcm9vbXNQLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1NlbGVjdChhYmVkcm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDIpXG59KVxuXG5rYmVkcm9vbXNQLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1NlbGVjdChrYmVkcm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDMpXG59KVxuXG5yZWNlcHRpb25zUC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuZXdTZWxlY3QocmVjZXB0aW9uc0J0bilcbiAgICBwb3B1bGF0ZUdyaWQoNClcbn0pXG5cbmRpbmluZ3Jvb21zUC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuZXdTZWxlY3QoZGluaW5ncm9vbXNCdG4pXG4gICAgcG9wdWxhdGVHcmlkKDUpXG59KVxuXG50dnVuaXRzUC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuZXdTZWxlY3QodHZ1bml0c0J0bilcbiAgICBwb3B1bGF0ZUdyaWQoNilcbn0pXG5cbmxhbmdCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgIGlmIChsYW5nQnRuLnZhbHVlID09ICdhcmFiaWMnKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnYXInKVxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2VuJylcbiAgICAgICAgc3JjaC5zZXRBdHRyaWJ1dGUoJ2RpcicsICdydGwnKVxuICAgICAgICBzd2l0Y2hMYW5nKCdhcicpXG4gICAgICAgIHBvcHVsYXRlTGFuZygpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdlbicpXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnYXInKVxuICAgICAgICBzcmNoLnNldEF0dHJpYnV0ZSgnZGlyJywgJ2x0cicpXG4gICAgICAgIHN3aXRjaExhbmcoJ2VuJylcbiAgICAgICAgcG9wdWxhdGVMYW5nKClcbiAgICB9XG59KVxuXG5sb2dvSW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG5ld1NlbGVjdChob21lQnRuKVxuICAgIGdvSG9tZSgpXG59KVxuXG54SW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGhpZGVNZW51KClcbn0pXG5cbm1lbnVJbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgbWVudS5zdHlsZS53aWR0aCA9ICcxMDAlJ1xufSlcblxuc3JjaC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICBzZWFyY2hSZXN1bHRzKHNyY2gudmFsdWUpXG4gICAgfVxufSlcblxuY2FydEltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBwb3B1bGF0ZVZpZXdDYXJ0KClcbn0pXG4iLCJleHBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmV4cG9ydCBsZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSA9IDIxKSA9PlxuICBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmV4cG9ydCBsZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbiIsImV4cG9ydCBjb25zdCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9