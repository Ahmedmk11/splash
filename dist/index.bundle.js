(self["webpackChunksplash"] = self["webpackChunksplash"] || []).push([["index"],{

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

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$":
/*!***************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \***************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*****************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*****************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/diningrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/diningrooms/0.jpg"
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
	"./0.jpg": "./src/assets/images/pictures/products/displayed/livingrooms/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/livingrooms/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/displayed/livingrooms/2.jpg"
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
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/displayed/receptions sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits sync \\.(png%7Cjpe?g%7Csvg)$":
/*!*********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \*********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/tvunits/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/tvunits/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/displayed/tvunits/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/displayed/tvunits/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/displayed/tvunits/4.jpg"
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/original/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$":
/*!****************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \****************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/3.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$":
/*!************************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/diningrooms/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/diningrooms/0.jpg"
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
	"./0.jpg": "./src/assets/images/pictures/products/original/livingrooms/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/livingrooms/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/original/livingrooms/2.jpg"
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
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/original/receptions sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits sync \\.(png%7Cjpe?g%7Csvg)$":
/*!********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/tvunits/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/tvunits/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/original/tvunits/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/original/tvunits/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/original/tvunits/4.jpg"
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
/* harmony export */   "addToCart": () => (/* binding */ addToCart),
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
/* harmony export */   "populateGrid": () => (/* binding */ populateGrid),
/* harmony export */   "populateLang": () => (/* binding */ populateLang),
/* harmony export */   "populateRecommendations": () => (/* binding */ populateRecommendations),
/* harmony export */   "populateSearchResults": () => (/* binding */ populateSearchResults),
/* harmony export */   "populateViewCart": () => (/* binding */ populateViewCart),
/* harmony export */   "receptionsArr": () => (/* binding */ receptionsArr),
/* harmony export */   "receptionsArrOG": () => (/* binding */ receptionsArrOG),
/* harmony export */   "receptionsBtn": () => (/* binding */ receptionsBtn),
/* harmony export */   "receptionsP": () => (/* binding */ receptionsP),
/* harmony export */   "searchResults": () => (/* binding */ searchResults),
/* harmony export */   "showResultsCount": () => (/* binding */ showResultsCount),
/* harmony export */   "similarity": () => (/* binding */ similarity),
/* harmony export */   "srch": () => (/* binding */ srch),
/* harmony export */   "switchLang": () => (/* binding */ switchLang),
/* harmony export */   "tvunitsArr": () => (/* binding */ tvunitsArr),
/* harmony export */   "tvunitsArrOG": () => (/* binding */ tvunitsArrOG),
/* harmony export */   "tvunitsBtn": () => (/* binding */ tvunitsBtn),
/* harmony export */   "tvunitsP": () => (/* binding */ tvunitsP),
/* harmony export */   "waImg": () => (/* binding */ waImg),
/* harmony export */   "xImg": () => (/* binding */ xImg)
/* harmony export */ });
/* harmony import */ var _assets_images_pictures_logo_jpg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/images/pictures/logo.jpg */ "./src/assets/images/pictures/logo.jpg");
/* harmony import */ var _assets_images_icons_cart_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/images/icons/cart.png */ "./src/assets/images/icons/cart.png");
/* harmony import */ var _assets_images_icons_menu_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/images/icons/menu.png */ "./src/assets/images/icons/menu.png");
/* harmony import */ var _assets_images_icons_left_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/icons/left.png */ "./src/assets/images/icons/left.png");
/* harmony import */ var _assets_images_icons_right_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/icons/right.png */ "./src/assets/images/icons/right.png");
/* harmony import */ var _assets_images_icons_uleft_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/images/icons/uleft.png */ "./src/assets/images/icons/uleft.png");
/* harmony import */ var _assets_images_icons_uright_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/images/icons/uright.png */ "./src/assets/images/icons/uright.png");
/* harmony import */ var _assets_images_icons_x_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/images/icons/x.png */ "./src/assets/images/icons/x.png");
/* harmony import */ var _assets_images_icons_dot_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assets/images/icons/dot.png */ "./src/assets/images/icons/dot.png");
/* harmony import */ var _assets_images_icons_sdot_png__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../assets/images/icons/sdot.png */ "./src/assets/images/icons/sdot.png");
/* harmony import */ var _assets_images_icons_x2_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../assets/images/icons/x2.png */ "./src/assets/images/icons/x2.png");
/* harmony import */ var _assets_images_icons_remove_cart_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../assets/images/icons/remove-cart.png */ "./src/assets/images/icons/remove-cart.png");
/* harmony import */ var _assets_images_icons_fb_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../assets/images/icons/fb.svg */ "./src/assets/images/icons/fb.svg");
/* harmony import */ var _assets_images_icons_ig_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../assets/images/icons/ig.svg */ "./src/assets/images/icons/ig.svg");
/* harmony import */ var _assets_images_icons_wa_svg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../assets/images/icons/wa.svg */ "./src/assets/images/icons/wa.svg");
/* harmony import */ var _db_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./db.json */ "./src/scripts/db.json");
/* harmony import */ var _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @datastructures-js/priority-queue */ "./node_modules/@datastructures-js/priority-queue/index.js");
/* harmony import */ var _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_16__);




















let products = _db_json__WEBPACK_IMPORTED_MODULE_15__.Products

const middleContainer = document.getElementById('middle-container');
const headerUp = document.getElementById('header-upper');
const actionsContainer = document.getElementById('actions-container');
const clf = document.getElementById('clf');
const langBtn = document.getElementById('slct-lang');
const livingroomsBtn = document.getElementById('livingrooms');
const homeBtn = document.getElementById('home');
const bedroomsBtn = document.getElementById('bedrooms');
const abedroomsBtn = document.getElementById('adults-bedrooms');
const kbedroomsBtn = document.getElementById('kids-bedrooms');
const receptionsBtn = document.getElementById('receptions');
const tvunitsBtn = document.getElementById('tvunits');
const diningroomsBtn = document.getElementById('diningrooms');
const srch = document.getElementById('srch-in');
const ftr = document.getElementById('ftr');
const menu = document.getElementById('menu');
const homeP = document.getElementById('home-p');
const livingroomsP = document.getElementById('livingrooms-p');
const abedroomsP = document.getElementById('abedrooms-p');
const kbedroomsP = document.getElementById('kbedrooms-p');
const receptionsP = document.getElementById('receptions-p');
const tvunitsP = document.getElementById('tvunits-p');
const diningroomsP = document.getElementById('diningrooms-p');

const logoImg = new Image();
const cartImg = new Image();
const menuImg = new Image();
const xImg = new Image();
const fbImg = new Image();
const igImg = new Image();
const waImg = new Image();

logoImg.src = _assets_images_pictures_logo_jpg__WEBPACK_IMPORTED_MODULE_0__;
cartImg.src = _assets_images_icons_cart_png__WEBPACK_IMPORTED_MODULE_1__;
menuImg.src = _assets_images_icons_menu_png__WEBPACK_IMPORTED_MODULE_2__;
xImg.src = _assets_images_icons_x_png__WEBPACK_IMPORTED_MODULE_7__;
fbImg.src = _assets_images_icons_fb_svg__WEBPACK_IMPORTED_MODULE_12__;
igImg.src = _assets_images_icons_ig_svg__WEBPACK_IMPORTED_MODULE_13__;
waImg.src = _assets_images_icons_wa_svg__WEBPACK_IMPORTED_MODULE_14__;

const sm = document.getElementById('sm');
const fbl = document.getElementById('fbl');
const igl = document.getElementById('igl');
const pn = document.getElementById('pn');
fbl.appendChild(fbImg)
igl.appendChild(igImg)
pn.appendChild(waImg)
sm.appendChild(fbl)
sm.appendChild(igl)
sm.appendChild(pn)

menuImg.classList.add('mobile');
menu.appendChild(xImg)

const livingroomsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$"));
const abedroomsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$"));
const kbedroomsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$"));
const receptionsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/receptions sync \\.(png%7Cjpe?g%7Csvg)$"));
const tvunitsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/tvunits sync \\.(png%7Cjpe?g%7Csvg)$"));
const diningroomsArr = importAll(__webpack_require__("./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$"));

const livingroomsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/livingrooms sync \\.(png%7Cjpe?g%7Csvg)$"));
const abedroomsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/bedrooms/master sync \\.(png%7Cjpe?g%7Csvg)$"));
const kbedroomsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/bedrooms/kids sync \\.(png%7Cjpe?g%7Csvg)$"));
const receptionsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/receptions sync \\.(png%7Cjpe?g%7Csvg)$"));
const tvunitsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/tvunits sync \\.(png%7Cjpe?g%7Csvg)$"));
const diningroomsArrOG = importAll(__webpack_require__("./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$"));

const navBtns = [homeBtn, livingroomsBtn, abedroomsBtn, kbedroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn];
const navP = [homeP, livingroomsP, abedroomsP, kbedroomsP, receptionsP, tvunitsP, diningroomsP];
const navAr = ['الرئيسية', 'غرف المعيشة', 'غرف نوم رئيسية', 'غرف نوم اطفال', 'صالونات', 'مكتبات', 'غرف سفرة'];
const navEn = ['Home', 'Living Rooms', 'Master Bedrooms', 'Kids Bedrooms', 'Receptions', 'TV Units', 'Dining Rooms'];
const navAr2 = ['الرئيسية', 'غرف المعيشة', 'غرف نوم رئيسية', 'غرف نوم اطفال', 'صالونات', 'مكتبات', 'غرف سفرة'];
const navEn2 = ['Home', 'Living Rooms', 'Master Bedrooms', 'Kids Bedrooms', 'Receptions', 'TV Units', 'Dining Rooms'];

const LivingRoomsDetails = []
const KidsBedroomsDetails = []
const MasterBedroomsDetails = []
const DiningRoomsDetails = []
const ReceptionsDetails = []
const TVUnitsDetails = []
const recommendationsArrDetails = []
const searchArrDetails = []
const cartIndexes = []

const recommendationsArr = {}
const recommendationsArrOG = {}
const searchArr = {}
const searchArrOG = {}

let iii = 0

let flag = 'page';
let currItem = [];

products.forEach(p => {
    switch (p.product_type) {
        case "Livingrooms":
            LivingRoomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = livingroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = livingroomsArrOG[indx2]
                iii++
            }
            break;
        case "Kids Bedrooms":
            KidsBedroomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = kbedroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = kbedroomsArrOG[indx2]
                iii++
            }
            break;
        case "Master Bedrooms":
            MasterBedroomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = abedroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = abedroomsArrOG[indx2]
                iii++

            }
            break;
        case "Diningrooms":
            DiningRoomsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = diningroomsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = diningroomsArrOG[indx2]
                iii++
            }
            break;
        case "Receptions":
            ReceptionsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = receptionsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = receptionsArrOG[indx2]
                iii++
            }
            break;
        case "TV Units":
            TVUnitsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length-1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = tvunitsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = tvunitsArrOG[indx2]
                iii++
            }
            break;
        default:
            break;
    }
    if (p.recommended == 1) {
        recommendationsArrDetails.push(p.index)
    }
});

goHome()
switchLang('ar');

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

function addToCart(product_index) {
    cartIndexes.push(product_index)
}

function populateViewCart() {
    middleContainer.innerHTML = ''
    const main = document.createElement('div')
    const cartArrDetails = []
    const cartArr = {}
    const cartArrOG = {}
    let a = ''
    let indx2 = -1
    let iiii = 0
    main.id = 'cart-main'
    cartIndexes.forEach(cartIndex => {
        products.forEach(p => {
            if (cartIndex == p.index) {
                switch (p.product_type) {
                    case "Livingrooms":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = livingroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = livingroomsArrOG[indx2]
                        iiii++
                        break;
                    case "Kids Bedrooms":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = kbedroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = kbedroomsArrOG[indx2]
                        iiii++
                        break;
                    case "Master Bedrooms":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = abedroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = abedroomsArrOG[indx2]
                        iiii++
                        break;
                    case "Diningrooms":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = diningroomsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = diningroomsArrOG[indx2]
                        iiii++
                        break;
                    case "Receptions":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = receptionsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = receptionsArrOG[indx2]
                        iiii++
                        break;
                    case "TV Units":
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length-1]
                        cartArr[`${iiii}.jpg`] = tvunitsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = tvunitsArrOG[indx2]
                        iiii++
                        break;
                    default:
                        break;
                }
                cartArrDetails.push(p.index)
            }
        });
    });

    if (cartArrDetails.length <= 0) {
        const empty = document.createElement('p')
        const add = document.createElement('button')
        empty.id = 'cart-empty'
        if (document.body.classList.contains('en')) {
            empty.textContent = 'Shopping Cart is Empty.'
            add.textContent = 'Add Items'
        } else {
            empty.textContent = 'عربة التسوق فارغة.'
            add.textContent = 'أضف منتجات'
        }

        add.addEventListener('click', () => {
            goHome()
        })

        main.classList.add('empty-cart-main')
        main.append(empty)
        main.append(add)
    } else {
        const header = document.createElement('div');
        const mid = document.createElement('div');
        const cartfooter = document.createElement('div');
        const title = document.createElement('p')
        const quantity = document.createElement('p')
        const price = document.createElement('p')
        const totalprice = document.createElement('p')
        const place = document.createElement('button')
        let tp = 0

        if (document.body.classList.contains('en')) {
            title.textContent = 'Product'
            quantity.textContent = 'Quantity'
            price.textContent = 'Price'
        } else {
            title.textContent = 'المنتج'
            quantity.textContent = 'الكمية'
            price.textContent = 'السعر'
        }

        for (let i = 0; i < Object.keys(cartArr).length; i++) {
            let temp = document.createElement('div')
            let prod = document.createElement('span')
            let titlei = document.createElement('p')
            let quantityi = document.createElement('p')
            let pricei = document.createElement('p')
            let hlc = document.createElement('hr')
            let removeImgDiv = document.createElement('div')
            let removeImg = new Image()

            removeImg.src = _assets_images_icons_remove_cart_png__WEBPACK_IMPORTED_MODULE_11__
            
            if (document.body.classList.contains('en')) {
                titlei.textContent = products[parseInt(cartArrDetails[i])].product_title_en
                pricei.textContent = products[parseInt(cartArrDetails[i])].product_price_en
            } else {
                titlei.textContent = products[parseInt(cartArrDetails[i])].product_title_ar
                pricei.textContent = products[parseInt(cartArrDetails[i])].product_price_ar
            }

            quantityi.textContent = 1; // here

            hlc.classList.add('hlc')
            quantityi.classList.add('qp')
            pricei.classList.add('qp')

            let img = new Image();
            img.src = cartArrOG[`${i}.jpg`];
            img.classList.add('cart-item-img')
            img.addEventListener('click', () => {
                populateItem(8, i)
            });
            temp.classList.add('cart-item')
            
            removeImgDiv.append(removeImg)
            prod.append(img)
            prod.append(titlei)
            temp.append(prod)
            temp.append(quantityi)
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
            place.textContent = `Place Order`
        } else {
            totalprice.textContent = `اجمالي السعر: ${tp}`
            place.textContent = `اتمام عملية الشراء`
        }

        title.classList.add('tit')
        quantity.classList.add('qph')
        price.classList.add('qph')

        header.append(title)
        header.append(quantity)
        header.append(price)

        header.id = 'cart-header'
        mid.id = 'cart-mid'
        totalprice.id = 'cart-total-price'
        cartfooter.id = 'cart-footer'

        cartfooter.append(totalprice)
        cartfooter.append(place)

        main.append(header)
        main.append(hlc)
        main.append(mid)
        main.append(cartfooter)
    }
    middleContainer.append(main)
    flag = 'page'
}

function showResultsCount(m, a) {
    let resultsFound = document.createElement("h2");
    resultsFound.id = "results-found"
    let grm = ''

    if (document.body.classList.contains('en')) {
        if (Object.keys(a).length == 1) {
            grm = ' was'
        } else {
            grm = 's were'
        }
        resultsFound.textContent = `${Object.keys(a).length} Product${grm} found.`
    } else {   
        if (Object.keys(a).length == 1) {
            grm = 'منتج'
        } else {
            grm = 'منتجات'
        }
        resultsFound.textContent = `تم العثور على ${Object.keys(a).length} ${grm}.`
    }
    m.append(resultsFound);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function searchResults(target) {
    middleContainer.focus()
    let added = []
    const resultsQueue = new _datastructures_js_priority_queue__WEBPACK_IMPORTED_MODULE_16__.PriorityQueue((a, b) => {
        if (a[1] > b[1]) {
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }
      }
    );

    target = target.toUpperCase()
    let breakk = false
    const re = new RegExp(/[A-Za-z]\d\d(\d)?(\d)?/);
    if (re.test(target)) {
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product.p_id == target) {
                resultsQueue.enqueue([i, 1, product.product_type])
                breakk = true
            }
        }
    }
    if (!breakk){
        for (let i = 0; i < products.length; i++) {
            let pool = []
            const product = products[i];
            pool.push(product.product_description_ar, product.product_description_en,
            product.product_title_ar, product.product_title_en, product.product_type)
            pool.forEach(el => {
                if (el.length > 3){
                    el = el.toUpperCase()
                    let sim = similarity(el, target)
                    if (sim > 0.65 || (target.length > 2 && (el.includes(target) || target.includes(el)))){
                        if (!added.includes(product.p_id)) {
                            resultsQueue.enqueue([i, sim, product.product_type])
                            added.push(product.p_id)
                        }
                    }
                }
            });
        }
    }
    srch.value = ''
    populateSearchResults(resultsQueue)
}

function populateSearchResults(r) {
    middleContainer.innerHTML = '';
    searchArr = {}
    let ls = []
    let indxx = 0
    while(!r.isEmpty()) {
        let l = r.dequeue()
        ls.push(l)
    }

    ls.forEach(l => {
        let p = products[l[0]]
        if (l[2] == "Livingrooms") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = livingroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = livingroomsArrOG[indx2]
            indxx++
        }
        else if (l[2] == "Kids Bedrooms") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = kbedroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = kbedroomsArrOG[indx2]
            indxx++
        }
        else if (l[2] == "Master Bedrooms") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = abedroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = abedroomsArrOG[indx2]
            indxx++
        }
        else if (l[2] == "Diningrooms") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = diningroomsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = diningroomsArrOG[indx2]
            indxx++
        }
        else if (l[2] == "Receptions") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = receptionsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = receptionsArrOG[indx2]
            indxx++
        }
        else if (l[2] == "TV Units") {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length-1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = tvunitsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = tvunitsArrOG[indx2]
            indxx++
        }
        searchArrDetails.push(l[0])
    });

    showResultsCount(middleContainer, searchArr)

    flag = 'page'
    let grid = document.createElement("div");
    grid.id = 'grid';

    for (let i = 0; i < Object.keys(searchArr).length; i++) {
        let img = createCard(grid, -1, i);
        img.addEventListener('click', () => {
            populateItem(-1, i)
        });
    }
    middleContainer.append(grid);
}

function populateRecommendations(r) {
    let num;
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

    for (let ii = 0; ii < Math.ceil(10/num); ii+=1) {
        let ar = []
        for (let i = ii * num; i < (ii * num) + num; i++) {
            if (Object.keys(recommendationsArr).includes(`${i}.jpg`)) {
                const c = document.createElement('div')
                let img = createCard(c, 7, i)
                img.addEventListener('click', () => {
                    populateItem(7, i)
                });
                ar.push(c)
            }
        }
        b.push(ar)
    }
    let p = 0
    if (num == 1 || num == 2) {p = 1}
    return [b, Math.floor(10/num) - p,num]
}

function goHome() {
    newSelect(homeBtn)
    middleContainer.innerHTML = '';
    const container = document.createElement('div')
    const container2 = document.createElement('div')
    const dots = document.createElement('div')
    const prev = new Image()
    const recommendations = document.createElement('div')
    const next = new Image()
    
    prev.src = _assets_images_icons_uleft_png__WEBPACK_IMPORTED_MODULE_5__
    next.src = _assets_images_icons_right_png__WEBPACK_IMPORTED_MODULE_4__
    prev.classList.add('u')
    container2.id = 'container2'

    let a = populateRecommendations(recommendations)
    let b = a[0]
    let curr = 0;
    let last = a[1];
    let num = a[2]
    for (let i = 0; i < b[curr].length; i++) {
        recommendations.appendChild(b[curr][i])
    }
    dots.innerHTML = ''
    for (let i = 0; i < Math.ceil(10/num); i++) {
        let dot = new Image()
        if (i == curr) {
            dot.src = _assets_images_icons_sdot_png__WEBPACK_IMPORTED_MODULE_9__
        } else {
            dot.src = _assets_images_icons_dot_png__WEBPACK_IMPORTED_MODULE_8__
        }
        dots.appendChild(dot)
    }
    window.addEventListener('resize', () => {
        a = populateRecommendations(recommendations)
        curr = 0
        b = a[0]
        last = a[1];
        num = a[2]
        for (let i = 0; i < b[curr].length; i++) {
            recommendations.appendChild(b[curr][i])
        }
        if (curr <= 0) {
            prev.classList.add('u')
            prev.src = _assets_images_icons_uleft_png__WEBPACK_IMPORTED_MODULE_5__
        } else {
            prev.classList.remove('u')
            prev.src = _assets_images_icons_left_png__WEBPACK_IMPORTED_MODULE_3__
        }
        if (curr >= last) {
            next.src = _assets_images_icons_uright_png__WEBPACK_IMPORTED_MODULE_6__
            next.classList.add('u')
        } else {
            next.src = _assets_images_icons_right_png__WEBPACK_IMPORTED_MODULE_4__
            next.classList.remove('u')
        }
        dots.innerHTML = ''
        for (let i = 0; i < Math.ceil(10/num); i++) {
            let dot = new Image()
            if (i == curr) {
                dot.src = _assets_images_icons_sdot_png__WEBPACK_IMPORTED_MODULE_9__
            } else {
                dot.src = _assets_images_icons_dot_png__WEBPACK_IMPORTED_MODULE_8__
            }
            dots.appendChild(dot)
        }
    });

    prev.addEventListener('click', () => {
        if (curr > 0) {
            b = populateRecommendations(recommendations)[0]
            curr--;
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10/num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.src = _assets_images_icons_sdot_png__WEBPACK_IMPORTED_MODULE_9__
                } else {
                    dot.src = _assets_images_icons_dot_png__WEBPACK_IMPORTED_MODULE_8__
                }
                dots.appendChild(dot)
            }
            next.classList.remove('u')
            next.src = _assets_images_icons_right_png__WEBPACK_IMPORTED_MODULE_4__
            if (curr <= 0) {
                prev.classList.add('u')
                prev.src = _assets_images_icons_uleft_png__WEBPACK_IMPORTED_MODULE_5__
            }
        }
    })

    next.addEventListener('click', () => {
        if (curr < last) {
            b = populateRecommendations(recommendations)[0]
            curr++;
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10/num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.src = _assets_images_icons_sdot_png__WEBPACK_IMPORTED_MODULE_9__
                } else {
                    dot.src = _assets_images_icons_dot_png__WEBPACK_IMPORTED_MODULE_8__
                }
                dots.appendChild(dot)
            }
            prev.classList.remove('u')
            prev.src = _assets_images_icons_left_png__WEBPACK_IMPORTED_MODULE_3__
            if (curr >= last) {
                next.src = _assets_images_icons_uright_png__WEBPACK_IMPORTED_MODULE_6__
                next.classList.add('u')
            }
        }
    })

    container.id = 'recommendations-container'
    prev.id = 'prev-img'
    next.id = 'next-img'
    recommendations.id = 'recommendations'

    container.appendChild(prev)
    container.appendChild(recommendations)
    container.appendChild(next)
    container2.appendChild(container)
    container2.appendChild(dots)
    middleContainer.appendChild(container2)
    flag = 'page'
    hideMenu()
}

function hideMenu() {
    menu.style.width = "0%";
}

function hasTouch() {
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
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
            break;
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
            break;
    }
}


function createCard(container, n, index) {
    let arr = chooseMode(n)
    let arrDetails = chooseDetails(n)
    let p_title_en = ''
    let p_title_ar = ''
    let p_price_en = ''
    let p_price_ar = ''
    
    const tmp = document.createElement("div");
    const info = document.createElement("div");
    const infoL = document.createElement("div");
    const cart = document.createElement("button");
    const tmpL = document.createElement("div");
    const nameP = document.createElement("p");
    const priceP = document.createElement("p");
    const hr = document.createElement('hr');
    tmp.classList.add('item');
    info.classList.add('info');
    infoL.classList.add('info-left');
    const img = new Image();
    img.src = arr[`${index}.jpg`];
    p_title_en = document.createElement('p').textContent = products[parseInt(arrDetails[index])].product_title_en
    p_title_ar = document.createElement('p').textContent = products[parseInt(arrDetails[index])].product_title_ar
    p_price_en = document.createElement('p').textContent = products[parseInt(arrDetails[index])].product_price_en
    p_price_ar = document.createElement('p').textContent = products[parseInt(arrDetails[index])].product_price_ar
    if (n == 7) {
        infoL.classList.add('recommendation-info-L')
        info.classList.add('recommendation-info')
    }
    img.setAttribute('data-scale', '1.2');
    if (langBtn.value == 'english') {
        nameP.textContent = p_title_en
        cart.textContent = 'Add to Cart';
        priceP.textContent = p_price_en
    } else {
        nameP.textContent = p_title_ar
        cart.textContent = "اضافة الي عربة التسوق";
        priceP.textContent = p_price_ar
    }

    
    cart.addEventListener('click', () => {
        addToCart(products[parseInt(arrDetails[index])].index)
    });
    

    infoL.append(nameP);
    infoL.append(priceP);
    info.append(infoL);
    tmpL.append(hr);
    tmpL.append(info);
    tmp.append(img);
    tmp.append(tmpL);
    tmp.append(cart)
    container.append(tmp);
    return img
}

function populateItem(n, i) {
    middleContainer.innerHTML = '';
    currItem.push(n)
    currItem.push(i)
    let p_code_en = ''
    let p_code_ar = ''
    let p_dimensions_en = ''
    let p_dimensions_ar = ''
    let p_desc_en = ''
    let p_desc_ar = ''

    flag = 'item';
    let fl = false
    const item = document.createElement('div');
    const details = document.createElement('div');
    const viewItem = document.createElement('div');
    const detailsHead = document.createElement('div');
    const detailsBody = document.createElement('div');
    const desc1 = document.createElement('div');
    const desc2 = document.createElement('div');
    const desc3 = document.createElement('div');
    let img = ''
    
    img = createCard(item, n, i);

    let arrDetails = chooseDetails(n)

    let arr = []

    switch (n) {
        case 1:
            arr = livingroomsArrOG
            break;
        case 2:
            arr = abedroomsArrOG
            break;
        case 3:
            arr = kbedroomsArrOG
            break;
        case 4:
            arr = receptionsArrOG
            break;
        case 5:
            arr = diningroomsArrOG
            break;
        case 6:
            arr = tvunitsArrOG
            break;
        case 7:
            arr = recommendationsArrOG
            break;
        case 8:
            arr = cartArrOG
            break;
        case -1:
            arr = searchArrOG
            break;
        default:
            break;
    }

    p_code_en = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_code_en
    p_code_ar = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_code_ar
    p_dimensions_en = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_dimensions_en
    p_dimensions_ar = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_dimensions_ar
    p_desc_en = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_description_en
    p_desc_ar = document.createElement('p').textContent = products[parseInt(arrDetails[i])].product_description_ar

    img.addEventListener('click', () => {
        if (!fl) {
            const zoomedCont = document.createElement('div')
            const blurred = document.body.children
            for (let k = 0; k < blurred.length; k++){
                blurred[k].classList.add('popup')
            }
            fl = true
            let zoomedIn = new Image()
            let x2 = new Image()
            zoomedIn.src = arr[`${i}.jpg`];
            x2.src = _assets_images_icons_x2_png__WEBPACK_IMPORTED_MODULE_10__
            zoomedIn.classList.add('zoomed-in')
            x2.classList.add('x2')
            zoomedCont.classList.add('zoomed-container')
            zoomedCont.appendChild(zoomedIn)
            zoomedCont.appendChild(x2)
            document.body.appendChild(zoomedCont)
            x2.addEventListener('click', () => {
                fl = false
                const elements = document.getElementsByClassName('zoomed-in');
                const el = document.getElementsByClassName('x2')
                const con = document.getElementsByClassName('zoomed-container')
                elements[0].parentNode.removeChild(elements[0]);
                el[0].parentNode.removeChild(el[0]);
                const blurred = document.body.children
                for (let k = 0; k < blurred.length; k++){
                    blurred[k].classList.remove('popup')
                }
                con[0].parentNode.removeChild(con[0]);
            })
        }
    })

    viewItem.id = 'view-item';
    details.id = 'item-details';
    detailsHead.id = 'detailsH';
    detailsBody.id = 'detailsB';

    if (document.body.classList.contains('en')) {
        detailsHead.textContent = 'Product Details';
        desc2.textContent = p_desc_en
        desc3.textContent = p_dimensions_en
        desc1.textContent = p_code_en;
    } else {
        detailsHead.textContent = 'تفاصيل المنتج'
        desc2.textContent = p_desc_ar
        desc3.textContent = p_dimensions_ar
        desc1.textContent = p_code_ar;
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
    middleContainer.innerHTML = '';
    let imageArr = chooseMode(n)
    flag = 'page'
    let grid = document.createElement("div");

    grid.id = 'grid';

    showResultsCount(middleContainer, imageArr)

    for (let i = 0; i < Object.keys(imageArr).length; i++) {
        let img = createCard(grid, n, i);
        img.addEventListener('click', () => {
            populateItem(n, i)
        });
    }
    hideMenu()
    middleContainer.append(grid);
}

function populateLang() {
    navBtns.forEach(btn => {
        if (flag == 'page') {
            if (btn.classList.contains('selected-page')
            || btn.classList.contains('selected-page-dd')) {
                switch (btn.id) {
                    case 'home':
                        goHome();
                        break;
                    case 'livingrooms':
                        populateGrid(1);
                        break;
                    case 'adults-bedrooms':
                        populateGrid(2);
                        break;
                    case 'kids-bedrooms':
                        populateGrid(3);
                        break;
                    case 'receptions':
                        populateGrid(4);
                        break;
                    case 'diningrooms':
                        populateGrid(5);
                        break;
                    case 'tvunits':
                        populateGrid(6);
                        break;
                    default:
                        break;
                }
            }
        } else {
            populateItem(currItem[0], currItem[1])
        }
    });
}

function newSelect(button) {
    bedroomsBtn.classList.remove('selected-page')
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
        btn.classList.remove('selected-page-dd');
    });
    if ([homeBtn, livingroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn].includes(button)) {
        button.classList.add('selected-page');
    }
    else if ([abedroomsBtn, kbedroomsBtn].includes(button)) {
        button.classList.add('selected-page-dd');
        bedroomsBtn.classList.add('selected-page')
    }
    navP.forEach(btn => {
        btn.classList.remove('selected-p');
    })
    let a = button.id
    switch (a) {
        case 'home':
            homeP.classList.add('selected-p');
            break;
        case 'livingrooms':
            livingroomsP.classList.add('selected-p');
            break;
        case 'adults-bedrooms':
            abedroomsP.classList.add('selected-p');
            break;
        case 'kids-bedrooms':
            kbedroomsP.classList.add('selected-p');
            break;
        case 'receptions':
            receptionsP.classList.add('selected-p');
            break;
        case 'diningrooms':
            diningroomsP.classList.add('selected-p');
            break;
        case 'tvunits':
            tvunitsP.classList.add('selected-p');
            break;
        default:
            break;
    }
}

function switchLang(target) {
    if (target == 'ar') {
        srch.setAttribute('placeholder', "ابحث هنا..");
        ftr.textContent = 'جميع الحقوق محفوظة';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navAr[i];
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i];
            btn.textContent = navAr2[i];
        }
        menu.classList.remove('ens');
        menu.classList.add('ars');
        bedroomsBtn.textContent = 'غرف النوم';
        cartImg.setAttribute("title", "عرض عربة التسوق");
    } else {
        srch.setAttribute('placeholder', "Search here..");
        ftr.textContent = 'All Rights Reserved.';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navEn[i];
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i];
            btn.textContent = navEn2[i];
        }
        menu.classList.remove('ars');
        menu.classList.add('ens');
        bedroomsBtn.textContent = 'Bedrooms'
        cartImg.setAttribute("title", "View Cart");
    }
}


/***/ }),

/***/ "./src/assets/images/icons/cart.png":
/*!******************************************!*\
  !*** ./src/assets/images/icons/cart.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a893da322e7d7a97cbc6.png";

/***/ }),

/***/ "./src/assets/images/icons/dot.png":
/*!*****************************************!*\
  !*** ./src/assets/images/icons/dot.png ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ec1fa0ac4138e4fdedbe.png";

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

/***/ "./src/assets/images/icons/left.png":
/*!******************************************!*\
  !*** ./src/assets/images/icons/left.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "860d6fdf01466a9b89e9.png";

/***/ }),

/***/ "./src/assets/images/icons/menu.png":
/*!******************************************!*\
  !*** ./src/assets/images/icons/menu.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bc6cbac29511422fc44e.png";

/***/ }),

/***/ "./src/assets/images/icons/remove-cart.png":
/*!*************************************************!*\
  !*** ./src/assets/images/icons/remove-cart.png ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c8445489c602b5d11f14.png";

/***/ }),

/***/ "./src/assets/images/icons/right.png":
/*!*******************************************!*\
  !*** ./src/assets/images/icons/right.png ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a85d80d26a3ec3021c0a.png";

/***/ }),

/***/ "./src/assets/images/icons/sdot.png":
/*!******************************************!*\
  !*** ./src/assets/images/icons/sdot.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "38d51a7ad1e91300f06b.png";

/***/ }),

/***/ "./src/assets/images/icons/uleft.png":
/*!*******************************************!*\
  !*** ./src/assets/images/icons/uleft.png ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6c8dda9cd7eed7b9ed5a.png";

/***/ }),

/***/ "./src/assets/images/icons/uright.png":
/*!********************************************!*\
  !*** ./src/assets/images/icons/uright.png ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "34193ded6ded864bd187.png";

/***/ }),

/***/ "./src/assets/images/icons/wa.svg":
/*!****************************************!*\
  !*** ./src/assets/images/icons/wa.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6580dc0147b64ec46a85.svg";

/***/ }),

/***/ "./src/assets/images/icons/x.png":
/*!***************************************!*\
  !*** ./src/assets/images/icons/x.png ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "34b1a900fb29e8ee792d.png";

/***/ }),

/***/ "./src/assets/images/icons/x2.png":
/*!****************************************!*\
  !*** ./src/assets/images/icons/x2.png ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "59602642f5da5200af07.png";

/***/ }),

/***/ "./src/assets/images/pictures/logo.jpg":
/*!*********************************************!*\
  !*** ./src/assets/images/pictures/logo.jpg ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "481ca208085f6e284362.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f9c6acd7931b27e205f2.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "971bd1275cd8f267fa05.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "025cf5475d3548a237d0.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "306696f5abbdc790485a.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "792a5beff3b40a463906.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f45f2c90e14fbb3ef09f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/diningrooms/0.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/diningrooms/0.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d3c3da8e862d74efc5c1.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/livingrooms/0.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/livingrooms/0.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/livingrooms/1.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/livingrooms/1.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/livingrooms/2.jpg":
/*!*************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/livingrooms/2.jpg ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/0.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/0.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4c85cdf226c04ac598bd.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/1.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/1.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "7ede983de60018a4c156.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/2.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/2.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fd85e4a1733df31cf5f0.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/3.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/3.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b686dfd6b31d5a3a9557.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/4.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/4.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "569ead41bace10f865eb.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/0.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/0.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cc5a3000619f6dd1a464.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a066ca50476113f23004.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/0.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/0.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "400c8babf10669148c26.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/1.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/1.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "857916b0224506ad366a.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/2.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/2.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8a783de5af3017be3a66.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/3.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/3.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eb44dd33de5d058cdb69.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/diningrooms/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/diningrooms/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ac621eb93ffa23e1597c.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/livingrooms/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/livingrooms/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/livingrooms/1.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/livingrooms/1.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/livingrooms/2.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/livingrooms/2.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36991944fed111c5f1f4.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/0.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/0.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ee173862382401ea2714.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/1.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/1.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ff17eb6665cb67fa6076.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/2.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/2.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "7bc7751aa98abb9ddf7b.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/3.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/3.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6a49e240f0210a336b0a.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/4.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/4.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2498f70b128bf749a67d.jpg";

/***/ }),

/***/ "./src/scripts/db.json":
/*!*****************************!*\
  !*** ./src/scripts/db.json ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Products":[{"p_id":"M22","product_code_en":"- ID: M22","product_code_ar":"- رقم المنتج:  M22","product_title_en":"Brown Wood TV Unit","product_title_ar":"مكتبة بني خشب","product_description_en":"- Details: Brown - Wood - 3 Shelves and a table","product_description_ar":"- التفاصيل: بني - خشب - 3 ارفف وطاولة","product_price_en":"40000 EGP","product_price_ar":"40000 ج.م","product_price":40000,"product_dimensions_en":"- Dimensions: 2 x 1.9","product_dimensions_ar":"- الابعاد: 2 x 1.9","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/0.jpg","recommended":0,"index":0},{"p_id":"M24","product_code_en":"- ID: M24","product_code_ar":"- رقم المنتج:  M24","product_title_en":"Brown TV Unit 2","product_title_ar":"مكتبة بني ٢","product_description_en":"- Details: Brown with 4 shelves and a table","product_description_ar":"- التفاصيل: بني مع 4 رفوف وطاولة","product_price_en":"30000 EGP","product_price_ar":"30000 ج.م","product_price":30000,"product_dimensions_en":"- Dimensions: 2 x 1.5","product_dimensions_ar":"- الابعاد: 2 x 1.5","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/1.jpg","recommended":0,"index":1},{"p_id":"M26","product_code_en":"- ID: M26","product_code_ar":"- رقم المنتج:  M26","product_title_en":"Brown White TV Unit Unit Unit Unit Unit","product_title_ar":"وحدة تلفزيون تلفزيون تلفزيون تلفزيون تلفزيون تلفزيون تلفزيون تلفزيون تلفزيون باللونين البني والأبيض","product_description_en":"- Details: 3 Shelves, 3 Drawers and a Lamp","product_description_ar":"- التفاصيل: 3 أرفف و 3 أدراج ومصباح","product_price_en":"65000 EGP","product_price_ar":"65000 ج.م","product_price":65000,"product_dimensions_en":"- Dimensions: 2 x 2","product_dimensions_ar":"- الابعاد: 2 x 2","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/2.jpg","recommended":1,"index":2},{"p_id":"M20","product_code_en":"- ID: M20","product_code_ar":"- رقم المنتج:  M20","product_title_en":"Rec 4","product_title_ar":"Rec 4","product_description_en":"- Details: Rec 4","product_description_ar":"- التفاصيل: Rec 4","product_price_en":"90000 EGP","product_price_ar":"90000 ج.م","product_price":90000,"product_dimensions_en":"- Dimensions: 2 x 2.2","product_dimensions_ar":"- الابعاد: 2 x 2.2","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/3.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/3.jpg","recommended":1,"index":3},{"p_id":"M28","product_code_en":"- ID: M28","product_code_ar":"- رقم المنتج:  M28","product_title_en":"Rec 5","product_title_ar":"Rec 5","product_description_en":"- Details: Rec 5","product_description_ar":"- التفاصيل: Rec 5","product_price_en":"120000 EGP","product_price_ar":"120000 ج.م","product_price":12000,"product_dimensions_en":"- Dimensions: 2 x 1.9","product_dimensions_ar":"- الابعاد: 2 x 1.9","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/4.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/4.jpg","recommended":1,"index":4},{"p_id":"K20","product_code_en":"- ID: K20","product_code_ar":"- رقم المنتج:  K20","product_title_en":"Rec 6","product_title_ar":"Rec 6","product_description_en":"- Details: Rec 6","product_description_ar":"- التفاصيل: Rec 6","product_price_en":"Rec 6 EGP","product_price_ar":"Rec 6 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 6","product_dimensions_ar":"- الابعاد: Rec 6","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/0.jpg","recommended":1,"index":5},{"p_id":"B26","product_code_en":"- ID: B26","product_code_ar":"- رقم المنتج:  B26","product_title_en":"Rec 7","product_title_ar":"Rec 7","product_description_en":"- Details: Rec 7","product_description_ar":"- التفاصيل: Rec 7","product_price_en":"Rec 7 EGP","product_price_ar":"Rec 7 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 7","product_dimensions_ar":"- الابعاد: Rec 7","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/1.jpg","recommended":1,"index":6},{"p_id":"Rec 8","product_code_en":"- ID: Rec 8","product_code_ar":"- رقم المنتج:  Rec 8","product_title_en":"Rec 8","product_title_ar":"Rec 8","product_description_en":"- Details: Rec 8","product_description_ar":"- التفاصيل: Rec 8","product_price_en":"Rec 8 EGP","product_price_ar":"Rec 8 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 8","product_dimensions_ar":"- الابعاد: Rec 8","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/0.jpg","recommended":1,"index":7},{"p_id":"Rec 9","product_code_en":"- ID: Rec 9","product_code_ar":"- رقم المنتج:  Rec 9","product_title_en":"Rec 9","product_title_ar":"Rec 9","product_description_en":"- Details: Rec 9","product_description_ar":"- التفاصيل: Rec 9","product_price_en":"Rec 9 EGP","product_price_ar":"Rec 9 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 9","product_dimensions_ar":"- الابعاد: Rec 9","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/1.jpg","recommended":1,"index":8},{"p_id":"Rec 10","product_code_en":"- ID: Rec 10","product_code_ar":"- رقم المنتج:  Rec 10","product_title_en":"Rec 10","product_title_ar":"Rec 10","product_description_en":"- Details: Rec 10","product_description_ar":"- التفاصيل: Rec 10","product_price_en":"Rec 10 EGP","product_price_ar":"Rec 10 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 10","product_dimensions_ar":"- الابعاد: Rec 10","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/2.jpg","recommended":1,"index":9},{"p_id":"Rec 11","product_code_en":"- ID: Rec 11","product_code_ar":"- رقم المنتج:  Rec 11","product_title_en":"Rec 11","product_title_ar":"Rec 11","product_description_en":"- Details: Rec 11","product_description_ar":"- التفاصيل: Rec 11","product_price_en":"Rec 11 EGP","product_price_ar":"Rec 11 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 11","product_dimensions_ar":"- الابعاد: Rec 11","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/3.jpg","recommended":1,"index":10},{"p_id":"Rec 12","product_code_en":"- ID: Rec 12","product_code_ar":"- رقم المنتج:  Rec 12","product_title_en":"Rec 12","product_title_ar":"Rec 12","product_description_en":"- Details: Rec 12","product_description_ar":"- التفاصيل: Rec 12","product_price_en":"Rec 12 EGP","product_price_ar":"Rec 12 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: Rec 12","product_dimensions_ar":"- الابعاد: Rec 12","product_type":"Diningrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/diningrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/diningrooms/0.jpg","recommended":1,"index":11},{"p_id":"Test","product_code_en":"- ID: Test","product_code_ar":"- رقم المنتج:  Test","product_title_en":"test","product_title_ar":"test","product_description_en":"- Details: test","product_description_ar":"- التفاصيل: test","product_price_en":"2222 EGP","product_price_ar":"2222 ج.م","product_price":2222,"product_dimensions_en":"- Dimensions: test","product_dimensions_ar":"- الابعاد: test","product_type":"Livingrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/livingrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/livingrooms/0.jpg","recommended":0,"index":12},{"p_id":"Test2","product_code_en":"- ID: Test2","product_code_ar":"- رقم المنتج:  Test2","product_title_en":"test","product_title_ar":"test","product_description_en":"- Details: test","product_description_ar":"- التفاصيل: test","product_price_en":"1 EGP","product_price_ar":"1 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: test","product_dimensions_ar":"- الابعاد: test","product_type":"Livingrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/livingrooms/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/livingrooms/1.jpg","recommended":0,"index":13},{"p_id":"Test3","product_code_en":"- ID: Test3","product_code_ar":"- رقم المنتج:  Test3","product_title_en":"test3","product_title_ar":"test","product_description_en":"- Details: test","product_description_ar":"- التفاصيل: test","product_price_en":"1 EGP","product_price_ar":"1 ج.م","product_price":1,"product_dimensions_en":"- Dimensions: test","product_dimensions_ar":"- الابعاد: test","product_type":"Livingrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/livingrooms/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/livingrooms/2.jpg","recommended":0,"index":14}]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/scripts/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFVBQVU7QUFDdkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCOzs7Ozs7Ozs7OztBQ2hKckI7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJzRDtBQUNDO0FBQ0E7QUFDRDtBQUNDO0FBQ0M7QUFDQztBQUNQO0FBQ0U7QUFDRTtBQUNKO0FBQ2E7O0FBRWhCO0FBQ0E7QUFDQTtBQUNwQjs7QUFFcUM7O0FBRWhFLGVBQWUsK0NBQVc7O0FBRW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxvQkFBb0Isa0NBQWtDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixvQkFBb0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9pbmRleC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAvc3JjL2hlYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwL3NyYy9tYXhIZWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9zcmMvbWluSGVhcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL2luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvcHJpb3JpdHktcXVldWUvc3JjL21heFByaW9yaXR5UXVldWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZS9zcmMvbWluUHJpb3JpdHlRdWV1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL3NyYy9wcmlvcml0eVF1ZXVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9saXZpbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3Rlci8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9saXZpbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9yZWNlcHRpb25zLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL3NyYy9oZWFwJyk7XG5jb25zdCB7IE1pbkhlYXAgfSA9IHJlcXVpcmUoJy4vc3JjL21pbkhlYXAnKTtcbmNvbnN0IHsgTWF4SGVhcCB9ID0gcmVxdWlyZSgnLi9zcmMvbWF4SGVhcCcpO1xuXG5leHBvcnRzLkhlYXAgPSBIZWFwO1xuZXhwb3J0cy5NaW5IZWFwID0gTWluSGVhcDtcbmV4cG9ydHMuTWF4SGVhcCA9IE1heEhlYXA7XG4iLCIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgSGVhcCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlXG4gICAqIEBwYXJhbSB7YXJyYXl9IFtfdmFsdWVzXVxuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSBbX2xlYWZdXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb21wYXJlLCBfdmFsdWVzLCBfbGVhZikge1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwIGNvbnN0cnVjdG9yIGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBhcmUgPSBjb21wYXJlO1xuICAgIHRoaXMuX25vZGVzID0gQXJyYXkuaXNBcnJheShfdmFsdWVzKSA/IF92YWx1ZXMgOiBbXTtcbiAgICB0aGlzLl9sZWFmID0gX2xlYWYgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgaGVhcCB0byBhIGNsb25lZCBhcnJheSB3aXRob3V0IHNvcnRpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9ub2Rlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcGFyZW50IGhhcyBhIGxlZnQgY2hpbGRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpIHtcbiAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICByZXR1cm4gbGVmdENoaWxkSW5kZXggPCB0aGlzLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBwYXJlbnQgaGFzIGEgcmlnaHQgY2hpbGRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSB7XG4gICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAyO1xuICAgIHJldHVybiByaWdodENoaWxkSW5kZXggPCB0aGlzLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gbm9kZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQXQoaSwgaikge1xuICAgIHJldHVybiB0aGlzLl9jb21wYXJlKHRoaXMuX25vZGVzW2ldLCB0aGlzLl9ub2Rlc1tqXSk7XG4gIH1cblxuICAvKipcbiAgICogU3dhcHMgdHdvIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc3dhcChpLCBqKSB7XG4gICAgY29uc3QgdGVtcCA9IHRoaXMuX25vZGVzW2ldO1xuICAgIHRoaXMuX25vZGVzW2ldID0gdGhpcy5fbm9kZXNbal07XG4gICAgdGhpcy5fbm9kZXNbal0gPSB0ZW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBwYXJlbnQgYW5kIGNoaWxkIHNob3VsZCBiZSBzd2FwcGVkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkge1xuICAgIGlmIChwYXJlbnRJbmRleCA8IDAgfHwgcGFyZW50SW5kZXggPj0gdGhpcy5zaXplKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGRJbmRleCA8IDAgfHwgY2hpbGRJbmRleCA+PSB0aGlzLnNpemUoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jb21wYXJlQXQocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyBjaGlsZHJlbiBvZiBhIHBhcmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KSB7XG4gICAgaWYgKCF0aGlzLl9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpICYmICF0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAxO1xuICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcblxuICAgIGlmICghdGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGRJbmRleDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2hhc1JpZ2h0Q2hpbGQocGFyZW50SW5kZXgpKSB7XG4gICAgICByZXR1cm4gbGVmdENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmVBdChsZWZ0Q2hpbGRJbmRleCwgcmlnaHRDaGlsZEluZGV4KTtcbiAgICByZXR1cm4gY29tcGFyZSA+IDAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gY2hpbGRyZW4gYmVmb3JlIGEgcG9zaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQ2hpbGRyZW5CZWZvcmUoaW5kZXgsIGxlZnRDaGlsZEluZGV4LCByaWdodENoaWxkSW5kZXgpIHtcbiAgICBjb25zdCBjb21wYXJlID0gdGhpcy5fY29tcGFyZUF0KHJpZ2h0Q2hpbGRJbmRleCwgbGVmdENoaWxkSW5kZXgpO1xuXG4gICAgaWYgKGNvbXBhcmUgPD0gMCAmJiByaWdodENoaWxkSW5kZXggPCBpbmRleCkge1xuICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGRJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVmdENoaWxkSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyB1cCBhIG5vZGUgaWYgaXQncyBpbiBhIHdyb25nIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeVVwKHN0YXJ0SW5kZXgpIHtcbiAgICBsZXQgY2hpbGRJbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoY2hpbGRJbmRleCAtIDEpIC8gMik7XG5cbiAgICB3aGlsZSAodGhpcy5fc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkpIHtcbiAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgY2hpbGRJbmRleCA9IHBhcmVudEluZGV4O1xuICAgICAgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChjaGlsZEluZGV4IC0gMSkgLyAyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyBkb3duIGEgbm9kZSBpZiBpdCdzIGluIGEgd3JvbmcgcG9zaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oZWFwaWZ5RG93bihzdGFydEluZGV4KSB7XG4gICAgbGV0IHBhcmVudEluZGV4ID0gc3RhcnRJbmRleDtcbiAgICBsZXQgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KTtcblxuICAgIHdoaWxlICh0aGlzLl9zaG91bGRTd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSkge1xuICAgICAgdGhpcy5fc3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCk7XG4gICAgICBwYXJlbnRJbmRleCA9IGNoaWxkSW5kZXg7XG4gICAgICBjaGlsZEluZGV4ID0gdGhpcy5fY29tcGFyZUNoaWxkcmVuT2YocGFyZW50SW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBidWJibGVzIGRvd24gYSBub2RlIGJlZm9yZSBhIGdpdmVuIGluZGV4XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeURvd25VbnRpbChpbmRleCkge1xuICAgIGxldCBwYXJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGxlZnRDaGlsZEluZGV4ID0gMTtcbiAgICBsZXQgcmlnaHRDaGlsZEluZGV4ID0gMjtcbiAgICBsZXQgY2hpbGRJbmRleDtcblxuICAgIHdoaWxlIChsZWZ0Q2hpbGRJbmRleCA8IGluZGV4KSB7XG4gICAgICBjaGlsZEluZGV4ID0gdGhpcy5fY29tcGFyZUNoaWxkcmVuQmVmb3JlKFxuICAgICAgICBpbmRleCxcbiAgICAgICAgbGVmdENoaWxkSW5kZXgsXG4gICAgICAgIHJpZ2h0Q2hpbGRJbmRleFxuICAgICAgKTtcblxuICAgICAgaWYgKHRoaXMuX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpKSB7XG4gICAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRJbmRleCA9IGNoaWxkSW5kZXg7XG4gICAgICBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICAgIHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBpbnNlcnQodmFsdWUpIHtcbiAgICB0aGlzLl9ub2Rlcy5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLl9oZWFwaWZ5VXAodGhpcy5zaXplKCkgLSAxKTtcbiAgICBpZiAodGhpcy5fbGVhZiA9PT0gbnVsbCB8fCB0aGlzLl9jb21wYXJlKHZhbHVlLCB0aGlzLl9sZWFmKSA+IDApIHtcbiAgICAgIHRoaXMuX2xlYWYgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3QoKTtcbiAgICB0aGlzLl9ub2Rlc1swXSA9IHRoaXMuX25vZGVzW3RoaXMuc2l6ZSgpIC0gMV07XG4gICAgdGhpcy5fbm9kZXMucG9wKCk7XG4gICAgdGhpcy5faGVhcGlmeURvd24oMCk7XG5cbiAgICBpZiAocm9vdCA9PT0gdGhpcy5fbGVhZikge1xuICAgICAgdGhpcy5fbGVhZiA9IHRoaXMucm9vdCgpO1xuICAgIH1cblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnNpemUoKSAtIDE7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgIHRoaXMuX3N3YXAoMCwgaSk7XG4gICAgICB0aGlzLl9oZWFwaWZ5RG93blVudGlsKGkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogRml4ZXMgbm9kZSBwb3NpdGlvbnMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIGZpeCgpIHtcbiAgICAvLyBmaXggbm9kZSBwb3NpdGlvbnNcbiAgICBmb3IgKGxldCBpID0gTWF0aC5mbG9vcih0aGlzLnNpemUoKSAvIDIpIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgIHRoaXMuX2hlYXBpZnlEb3duKGkpO1xuICAgIH1cblxuICAgIC8vIGZpeCBsZWFmIHZhbHVlXG4gICAgZm9yIChsZXQgaSA9IE1hdGguZmxvb3IodGhpcy5zaXplKCkgLyAyKTsgaSA8IHRoaXMuc2l6ZSgpOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fbm9kZXNbaV07XG4gICAgICBpZiAodGhpcy5fbGVhZiA9PT0gbnVsbCB8fCB0aGlzLl9jb21wYXJlKHZhbHVlLCB0aGlzLl9sZWFmKSA+IDApIHtcbiAgICAgICAgdGhpcy5fbGVhZiA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICBjb25zdCBpc1ZhbGlkUmVjdXJzaXZlID0gKHBhcmVudEluZGV4KSA9PiB7XG4gICAgICBsZXQgaXNWYWxpZExlZnQgPSB0cnVlO1xuICAgICAgbGV0IGlzVmFsaWRSaWdodCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLl9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpKSB7XG4gICAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAxO1xuICAgICAgICBpZiAodGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCBsZWZ0Q2hpbGRJbmRleCkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzVmFsaWRMZWZ0ID0gaXNWYWxpZFJlY3Vyc2l2ZShsZWZ0Q2hpbGRJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG4gICAgICAgIGlmICh0aGlzLl9jb21wYXJlQXQocGFyZW50SW5kZXgsIHJpZ2h0Q2hpbGRJbmRleCkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzVmFsaWRSaWdodCA9IGlzVmFsaWRSZWN1cnNpdmUocmlnaHRDaGlsZEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzVmFsaWRMZWZ0ICYmIGlzVmFsaWRSaWdodDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGlzVmFsaWRSZWN1cnNpdmUoMCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNoYWxsb3cgY29weSBvZiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBIZWFwKHRoaXMuX2NvbXBhcmUsIHRoaXMuX25vZGVzLnNsaWNlKCksIHRoaXMuX2xlYWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHJvb3QoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbm9kZXNbMF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGVhZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZXMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaXplKCkgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX25vZGVzID0gW107XG4gICAgdGhpcy5fbGVhZiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGEgaGVhcCBmcm9tIGEgYXJyYXkgb2YgdmFsdWVzXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHN0YXRpYyBoZWFwaWZ5KHZhbHVlcywgY29tcGFyZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hlYXAuaGVhcGlmeSBleHBlY3RzIGFuIGFycmF5IG9mIHZhbHVlcycpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwLmhlYXBpZnkgZXhwZWN0cyBhIGNvbXBhcmUgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEhlYXAoY29tcGFyZSwgdmFsdWVzKS5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBsaXN0IG9mIHZhbHVlcyBpcyBhIHZhbGlkIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzSGVhcGlmaWVkKHZhbHVlcywgY29tcGFyZSkge1xuICAgIHJldHVybiBuZXcgSGVhcChjb21wYXJlLCB2YWx1ZXMpLmlzVmFsaWQoKTtcbiAgfVxufVxuXG5leHBvcnRzLkhlYXAgPSBIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKi9cblxuY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL2hlYXAnKTtcblxuY29uc3QgZ2V0TWF4Q29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAxIDogLTE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNYXhIZWFwXG4gKiBAZXh0ZW5kcyBIZWFwXG4gKi9cbmNsYXNzIE1heEhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHBhcmFtIHtIZWFwfSBbX2hlYXBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgdGhpcy5fZ2V0Q29tcGFyZVZhbHVlID0gZ2V0Q29tcGFyZVZhbHVlO1xuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgSGVhcChnZXRNYXhDb21wYXJlKGdldENvbXBhcmVWYWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGV4dHJhY3RSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBoZWFwIHNvcnQgYW5kIHJldHVybiB0aGUgdmFsdWVzIHNvcnRlZCBieSBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHNvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBoZWFwIHRvIGEgY2xvbmVkIGFycmF5IHdpdGhvdXQgc29ydGluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2hlYXAuX25vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXhlcyBub2RlIHBvc2l0aW9ucyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgZml4KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc1ZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBNYXhIZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01heEhlYXB9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IE1heEhlYXAodGhpcy5fZ2V0Q29tcGFyZVZhbHVlLCB0aGlzLl9oZWFwLmNsb25lKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIE1heEhlYXAgZnJvbSBhbiBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgc3RhdGljIGhlYXBpZnkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXhIZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheScpO1xuICAgIH1cbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGxpc3Qgb2YgdmFsdWVzIGlzIGEgdmFsaWQgbWF4IGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNYXhDb21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNYXhIZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuaXNWYWxpZCgpO1xuICB9XG59XG5cbmV4cG9ydHMuTWF4SGVhcCA9IE1heEhlYXA7XG4iLCIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqL1xuXG5jb25zdCB7IEhlYXAgfSA9IHJlcXVpcmUoJy4vaGVhcCcpO1xuXG5jb25zdCBnZXRNaW5Db21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IC0xIDogMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1pbkhlYXBcbiAqIEBleHRlbmRzIEhlYXBcbiAqL1xuY2xhc3MgTWluSGVhcCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcGFyYW0ge0hlYXB9IFtfaGVhcF1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICB0aGlzLl9nZXRDb21wYXJlVmFsdWUgPSBnZXRDb21wYXJlVmFsdWU7XG4gICAgdGhpcy5faGVhcCA9IF9oZWFwIHx8IG5ldyBIZWFwKGdldE1pbkNvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGhlYXAgdG8gYSBjbG9uZWQgYXJyYXkgd2l0aG91dCBzb3J0aW5nLlxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5faGVhcC5fbm9kZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGV4dHJhY3RSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBoZWFwIHNvcnQgYW5kIHJldHVybiB0aGUgdmFsdWVzIHNvcnRlZCBieSBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHNvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpeGVzIG5vZGUgcG9zaXRpb25zIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZpZXMgdGhhdCBhbGwgaGVhcCBub2RlcyBhcmUgaW4gdGhlIHJpZ2h0IHBvc2l0aW9uXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc1ZhbGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzVmFsaWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICByb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICB0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsZWFmIG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBsZWFmKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBoZWFwIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5faGVhcC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaGFsbG93IGNvcHkgb2YgdGhlIE1pbkhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7TWluSGVhcH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgTWluSGVhcCh0aGlzLl9nZXRDb21wYXJlVmFsdWUsIHRoaXMuX2hlYXAuY2xvbmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGEgTWluSGVhcCBmcm9tIGFuIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBzdGF0aWMgaGVhcGlmeSh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pbkhlYXAuaGVhcGlmeSBleHBlY3RzIGFuIGFycmF5Jyk7XG4gICAgfVxuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgbGlzdCBvZiB2YWx1ZXMgaXMgYSB2YWxpZCBtaW4gaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzSGVhcGlmaWVkKHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1pbkNvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1pbkhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5pc1ZhbGlkKCk7XG4gIH1cbn1cblxuZXhwb3J0cy5NaW5IZWFwID0gTWluSGVhcDtcbiIsImNvbnN0IHsgTWluUHJpb3JpdHlRdWV1ZSB9ID0gcmVxdWlyZSgnLi9zcmMvbWluUHJpb3JpdHlRdWV1ZScpO1xuY29uc3QgeyBNYXhQcmlvcml0eVF1ZXVlIH0gPSByZXF1aXJlKCcuL3NyYy9tYXhQcmlvcml0eVF1ZXVlJyk7XG5jb25zdCB7IFByaW9yaXR5UXVldWUgfSA9IHJlcXVpcmUoJy4vc3JjL3ByaW9yaXR5UXVldWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTWluUHJpb3JpdHlRdWV1ZSwgTWF4UHJpb3JpdHlRdWV1ZSwgUHJpb3JpdHlRdWV1ZSB9O1xuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuY29uc3QgeyBIZWFwLCBNYXhIZWFwIH0gPSByZXF1aXJlKCdAZGF0YXN0cnVjdHVyZXMtanMvaGVhcCcpO1xuXG5jb25zdCBnZXRNYXhDb21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IDEgOiAtMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1heFByaW9yaXR5UXVldWVcbiAqIEBleHRlbmRzIE1heEhlYXBcbiAqL1xuY2xhc3MgTWF4UHJpb3JpdHlRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICBpZiAoZ2V0Q29tcGFyZVZhbHVlICYmIHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF4UHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNhbGxiYWNrIGZvciBvYmplY3QgdmFsdWVzJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBtaW4gcHJpb3JpdHkgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZSBmcm9tIGFuIGV4aXN0aW5nIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7TWF4UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHN0YXRpYyBmcm9tQXJyYXkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4UHJpb3JpdHlRdWV1ZShcbiAgICAgIGdldENvbXBhcmVWYWx1ZSxcbiAgICAgIG5ldyBNYXhIZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KClcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydHMuTWF4UHJpb3JpdHlRdWV1ZSA9IE1heFByaW9yaXR5UXVldWU7XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG5jb25zdCB7IEhlYXAsIE1pbkhlYXAgfSA9IHJlcXVpcmUoJ0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwJyk7XG5cbmNvbnN0IGdldE1pbkNvbXBhcmUgPSAoZ2V0Q29tcGFyZVZhbHVlKSA9PiAoYSwgYikgPT4ge1xuICBjb25zdCBhVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShhKSA6IGE7XG4gIGNvbnN0IGJWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGIpIDogYjtcbiAgcmV0dXJuIGFWYWwgPCBiVmFsID8gLTEgOiAxO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgTWluUHJpb3JpdHlRdWV1ZVxuICovXG5jbGFzcyBNaW5Qcmlvcml0eVF1ZXVlIHtcbiAgY29uc3RydWN0b3IoZ2V0Q29tcGFyZVZhbHVlLCBfaGVhcCkge1xuICAgIGlmIChnZXRDb21wYXJlVmFsdWUgJiYgdHlwZW9mIGdldENvbXBhcmVWYWx1ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5Qcmlvcml0eVF1ZXVlIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgY2FsbGJhY2sgZm9yIG9iamVjdCB2YWx1ZXMnKTtcbiAgICB9XG4gICAgdGhpcy5faGVhcCA9IF9oZWFwIHx8IG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBmcm9udCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggbG93ZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIGVucXVldWUodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnF1ZXVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGRlcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGxpc3Qgb2YgZWxlbWVudHMgZnJvbSBoaWdoZXN0IHRvIGxvd2VzdCBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuY2xvbmUoKS5zb3J0KCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIG1pbiBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByaW9yaXR5IHF1ZXVlIGZyb20gYW4gZXhpc3RpbmcgYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtNaW5Qcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgc3RhdGljIGZyb21BcnJheSh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5Qcmlvcml0eVF1ZXVlKFxuICAgICAgZ2V0Q29tcGFyZVZhbHVlLFxuICAgICAgbmV3IE1pbkhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5maXgoKVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0cy5NaW5Qcmlvcml0eVF1ZXVlID0gTWluUHJpb3JpdHlRdWV1ZTtcbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbmNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAnKTtcblxuLyoqXG4gKiBAY2xhc3MgUHJpb3JpdHlRdWV1ZVxuICovXG5jbGFzcyBQcmlvcml0eVF1ZXVlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcGFyYW1zIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29tcGFyZSwgX3ZhbHVlcykge1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcmlvcml0eVF1ZXVlIGNvbnN0cnVjdG9yIGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBuZXcgSGVhcChjb21wYXJlLCBfdmFsdWVzKTtcbiAgICBpZiAoX3ZhbHVlcykge1xuICAgICAgdGhpcy5faGVhcC5maXgoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBmcm9udCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggbG93ZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIGVucXVldWUodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnF1ZXVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGRlcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGxpc3Qgb2YgZWxlbWVudHMgZnJvbSBoaWdoZXN0IHRvIGxvd2VzdCBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuY2xvbmUoKS5zb3J0KCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIHByaW9yaXR5IHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWUgZnJvbSBhbiBleGlzdGluZyBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBzdGF0aWMgZnJvbUFycmF5KHZhbHVlcywgY29tcGFyZSkge1xuICAgIHJldHVybiBuZXcgUHJpb3JpdHlRdWV1ZShjb21wYXJlLCB2YWx1ZXMpO1xuICB9XG59XG5cbmV4cG9ydHMuUHJpb3JpdHlRdWV1ZSA9IFByaW9yaXR5UXVldWU7XG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL2tpZHMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyLzEuanBnXCIsXG5cdFwiLi8yLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8yLmpwZ1wiLFxuXHRcIi4vMy5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvMy5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zLzAuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zLzEuanBnXCIsXG5cdFwiLi8yLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zLzIuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2xpdmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9yZWNlcHRpb25zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8xLmpwZ1wiLFxuXHRcIi4vMi5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzLzIuanBnXCIsXG5cdFwiLi8zLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvMy5qcGdcIixcblx0XCIuLzQuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy80LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcy8wLmpwZ1wiLFxuXHRcIi4vMS5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL2tpZHMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzEuanBnXCIsXG5cdFwiLi8yLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzIuanBnXCIsXG5cdFwiLi8zLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzMuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZGluaW5ncm9vbXMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2xpdmluZ3Jvb21zLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvbGl2aW5ncm9vbXMvMS5qcGdcIixcblx0XCIuLzIuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9saXZpbmdyb29tcy8yLmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2xpdmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3JlY2VwdGlvbnMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cy8xLmpwZ1wiLFxuXHRcIi4vMi5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvMi5qcGdcIixcblx0XCIuLzMuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLzMuanBnXCIsXG5cdFwiLi80LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cy80LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwiaW1wb3J0IGxvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9sb2dvLmpwZyc7XG5pbXBvcnQgY2FydExvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9jYXJ0LnBuZyc7XG5pbXBvcnQgbWVudUxvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9tZW51LnBuZyc7XG5pbXBvcnQgcHJldkltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2xlZnQucG5nJztcbmltcG9ydCBuZXh0SW1nIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvcmlnaHQucG5nJztcbmltcG9ydCB1UHJldkltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3VsZWZ0LnBuZyc7XG5pbXBvcnQgdU5leHRJbWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy91cmlnaHQucG5nJztcbmltcG9ydCB4Q2xvc2UgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy94LnBuZyc7XG5pbXBvcnQgZG90SWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZG90LnBuZyc7XG5pbXBvcnQgc2RvdEljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3Nkb3QucG5nJztcbmltcG9ydCB4MkljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3gyLnBuZyc7XG5pbXBvcnQgcmVtb3ZlSWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvcmVtb3ZlLWNhcnQucG5nJztcblxuaW1wb3J0IGZiIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZmIuc3ZnJztcbmltcG9ydCBpZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2lnLnN2Zyc7XG5pbXBvcnQgd2EgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy93YS5zdmcnO1xuaW1wb3J0IGRiIGZyb20gJy4vZGIuanNvbic7XG5cbmltcG9ydCB7UHJpb3JpdHlRdWV1ZX0gZnJvbSAnQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlJztcblxubGV0IHByb2R1Y3RzID0gZGIuUHJvZHVjdHNcblxuZXhwb3J0IGNvbnN0IG1pZGRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaWRkbGUtY29udGFpbmVyJyk7XG5leHBvcnQgY29uc3QgaGVhZGVyVXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXVwcGVyJyk7XG5leHBvcnQgY29uc3QgYWN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpb25zLWNvbnRhaW5lcicpO1xuZXhwb3J0IGNvbnN0IGNsZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGYnKTtcbmV4cG9ydCBjb25zdCBsYW5nQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsY3QtbGFuZycpO1xuZXhwb3J0IGNvbnN0IGxpdmluZ3Jvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmluZ3Jvb21zJyk7XG5leHBvcnQgY29uc3QgaG9tZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lJyk7XG5leHBvcnQgY29uc3QgYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmVkcm9vbXMnKTtcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWR1bHRzLWJlZHJvb21zJyk7XG5leHBvcnQgY29uc3Qga2JlZHJvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2tpZHMtYmVkcm9vbXMnKTtcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlY2VwdGlvbnMnKTtcbmV4cG9ydCBjb25zdCB0dnVuaXRzQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2dW5pdHMnKTtcbmV4cG9ydCBjb25zdCBkaW5pbmdyb29tc0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaW5pbmdyb29tcycpO1xuZXhwb3J0IGNvbnN0IHNyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3JjaC1pbicpO1xuZXhwb3J0IGNvbnN0IGZ0ciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdHInKTtcbmV4cG9ydCBjb25zdCBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKTtcbmV4cG9ydCBjb25zdCBob21lUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lLXAnKTtcbmV4cG9ydCBjb25zdCBsaXZpbmdyb29tc1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGl2aW5ncm9vbXMtcCcpO1xuZXhwb3J0IGNvbnN0IGFiZWRyb29tc1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWJlZHJvb21zLXAnKTtcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2tiZWRyb29tcy1wJyk7XG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjZXB0aW9ucy1wJyk7XG5leHBvcnQgY29uc3QgdHZ1bml0c1AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHZ1bml0cy1wJyk7XG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpbmluZ3Jvb21zLXAnKTtcblxuZXhwb3J0IGNvbnN0IGxvZ29JbWcgPSBuZXcgSW1hZ2UoKTtcbmV4cG9ydCBjb25zdCBjYXJ0SW1nID0gbmV3IEltYWdlKCk7XG5leHBvcnQgY29uc3QgbWVudUltZyA9IG5ldyBJbWFnZSgpO1xuZXhwb3J0IGNvbnN0IHhJbWcgPSBuZXcgSW1hZ2UoKTtcbmV4cG9ydCBjb25zdCBmYkltZyA9IG5ldyBJbWFnZSgpO1xuZXhwb3J0IGNvbnN0IGlnSW1nID0gbmV3IEltYWdlKCk7XG5leHBvcnQgY29uc3Qgd2FJbWcgPSBuZXcgSW1hZ2UoKTtcblxubG9nb0ltZy5zcmMgPSBsb2dvO1xuY2FydEltZy5zcmMgPSBjYXJ0TG9nbztcbm1lbnVJbWcuc3JjID0gbWVudUxvZ287XG54SW1nLnNyYyA9IHhDbG9zZTtcbmZiSW1nLnNyYyA9IGZiO1xuaWdJbWcuc3JjID0gaWc7XG53YUltZy5zcmMgPSB3YTtcblxuY29uc3Qgc20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc20nKTtcbmNvbnN0IGZibCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYmwnKTtcbmNvbnN0IGlnbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZ2wnKTtcbmNvbnN0IHBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuJyk7XG5mYmwuYXBwZW5kQ2hpbGQoZmJJbWcpXG5pZ2wuYXBwZW5kQ2hpbGQoaWdJbWcpXG5wbi5hcHBlbmRDaGlsZCh3YUltZylcbnNtLmFwcGVuZENoaWxkKGZibClcbnNtLmFwcGVuZENoaWxkKGlnbClcbnNtLmFwcGVuZENoaWxkKHBuKVxuXG5tZW51SW1nLmNsYXNzTGlzdC5hZGQoJ21vYmlsZScpO1xubWVudS5hcHBlbmRDaGlsZCh4SW1nKVxuXG5leHBvcnQgY29uc3QgbGl2aW5ncm9vbXNBcnIgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9saXZpbmdyb29tcycsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNBcnIgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXInLCBmYWxzZSwgL1xcLihwbmd8anBlP2d8c3ZnKSQvKSk7XG5leHBvcnQgY29uc3Qga2JlZHJvb21zQXJyID0gaW1wb3J0QWxsKHJlcXVpcmUuY29udGV4dCgnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcycsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQXJyID0gaW1wb3J0QWxsKHJlcXVpcmUuY29udGV4dCgnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucycsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCB0dnVuaXRzQXJyID0gaW1wb3J0QWxsKHJlcXVpcmUuY29udGV4dCgnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cycsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCBkaW5pbmdyb29tc0FyciA9IGltcG9ydEFsbChyZXF1aXJlLmNvbnRleHQoJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zJywgZmFsc2UsIC9cXC4ocG5nfGpwZT9nfHN2ZykkLykpO1xuXG5leHBvcnQgY29uc3QgbGl2aW5ncm9vbXNBcnJPRyA9IGltcG9ydEFsbChyZXF1aXJlLmNvbnRleHQoJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvbGl2aW5ncm9vbXMnLCBmYWxzZSwgL1xcLihwbmd8anBlP2d8c3ZnKSQvKSk7XG5leHBvcnQgY29uc3QgYWJlZHJvb21zQXJyT0cgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3RlcicsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNBcnJPRyA9IGltcG9ydEFsbChyZXF1aXJlLmNvbnRleHQoJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcycsIGZhbHNlLCAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC8pKTtcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQXJyT0cgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3JlY2VwdGlvbnMnLCBmYWxzZSwgL1xcLihwbmd8anBlP2d8c3ZnKSQvKSk7XG5leHBvcnQgY29uc3QgdHZ1bml0c0Fyck9HID0gaW1wb3J0QWxsKHJlcXVpcmUuY29udGV4dCgnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzJywgZmFsc2UsIC9cXC4ocG5nfGpwZT9nfHN2ZykkLykpO1xuZXhwb3J0IGNvbnN0IGRpbmluZ3Jvb21zQXJyT0cgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zJywgZmFsc2UsIC9cXC4ocG5nfGpwZT9nfHN2ZykkLykpO1xuXG5leHBvcnQgY29uc3QgbmF2QnRucyA9IFtob21lQnRuLCBsaXZpbmdyb29tc0J0biwgYWJlZHJvb21zQnRuLCBrYmVkcm9vbXNCdG4sIHJlY2VwdGlvbnNCdG4sIHR2dW5pdHNCdG4sIGRpbmluZ3Jvb21zQnRuXTtcbmV4cG9ydCBjb25zdCBuYXZQID0gW2hvbWVQLCBsaXZpbmdyb29tc1AsIGFiZWRyb29tc1AsIGtiZWRyb29tc1AsIHJlY2VwdGlvbnNQLCB0dnVuaXRzUCwgZGluaW5ncm9vbXNQXTtcbmNvbnN0IG5hdkFyID0gWyfYp9mE2LHYptmK2LPZitipJywgJ9i62LHZgSDYp9mE2YXYudmK2LTYqScsICfYutix2YEg2YbZiNmFINix2KbZitiz2YrYqScsICfYutix2YEg2YbZiNmFINin2LfZgdin2YQnLCAn2LXYp9mE2YjZhtin2KonLCAn2YXZg9iq2KjYp9iqJywgJ9i62LHZgSDYs9mB2LHYqSddO1xuY29uc3QgbmF2RW4gPSBbJ0hvbWUnLCAnTGl2aW5nIFJvb21zJywgJ01hc3RlciBCZWRyb29tcycsICdLaWRzIEJlZHJvb21zJywgJ1JlY2VwdGlvbnMnLCAnVFYgVW5pdHMnLCAnRGluaW5nIFJvb21zJ107XG5jb25zdCBuYXZBcjIgPSBbJ9in2YTYsdim2YrYs9mK2KknLCAn2LrYsdmBINin2YTZhdi52YrYtNipJywgJ9i62LHZgSDZhtmI2YUg2LHYptmK2LPZitipJywgJ9i62LHZgSDZhtmI2YUg2KfYt9mB2KfZhCcsICfYtdin2YTZiNmG2KfYqicsICfZhdmD2KrYqNin2KonLCAn2LrYsdmBINiz2YHYsdipJ107XG5jb25zdCBuYXZFbjIgPSBbJ0hvbWUnLCAnTGl2aW5nIFJvb21zJywgJ01hc3RlciBCZWRyb29tcycsICdLaWRzIEJlZHJvb21zJywgJ1JlY2VwdGlvbnMnLCAnVFYgVW5pdHMnLCAnRGluaW5nIFJvb21zJ107XG5cbmNvbnN0IExpdmluZ1Jvb21zRGV0YWlscyA9IFtdXG5jb25zdCBLaWRzQmVkcm9vbXNEZXRhaWxzID0gW11cbmNvbnN0IE1hc3RlckJlZHJvb21zRGV0YWlscyA9IFtdXG5jb25zdCBEaW5pbmdSb29tc0RldGFpbHMgPSBbXVxuY29uc3QgUmVjZXB0aW9uc0RldGFpbHMgPSBbXVxuY29uc3QgVFZVbml0c0RldGFpbHMgPSBbXVxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyRGV0YWlscyA9IFtdXG5jb25zdCBzZWFyY2hBcnJEZXRhaWxzID0gW11cbmNvbnN0IGNhcnRJbmRleGVzID0gW11cblxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyID0ge31cbmNvbnN0IHJlY29tbWVuZGF0aW9uc0Fyck9HID0ge31cbmNvbnN0IHNlYXJjaEFyciA9IHt9XG5jb25zdCBzZWFyY2hBcnJPRyA9IHt9XG5cbmxldCBpaWkgPSAwXG5cbmxldCBmbGFnID0gJ3BhZ2UnO1xubGV0IGN1cnJJdGVtID0gW107XG5cbnByb2R1Y3RzLmZvckVhY2gocCA9PiB7XG4gICAgc3dpdGNoIChwLnByb2R1Y3RfdHlwZSkge1xuICAgICAgICBjYXNlIFwiTGl2aW5ncm9vbXNcIjpcbiAgICAgICAgICAgIExpdmluZ1Jvb21zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIktpZHMgQmVkcm9vbXNcIjpcbiAgICAgICAgICAgIEtpZHNCZWRyb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0ga2JlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IGtiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1hc3RlciBCZWRyb29tc1wiOlxuICAgICAgICAgICAgTWFzdGVyQmVkcm9vbXNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGgtMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IGFiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBhYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRpbmluZ3Jvb21zXCI6XG4gICAgICAgICAgICBEaW5pbmdSb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJSZWNlcHRpb25zXCI6XG4gICAgICAgICAgICBSZWNlcHRpb25zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSByZWNlcHRpb25zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IHJlY2VwdGlvbnNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJUViBVbml0c1wiOlxuICAgICAgICAgICAgVFZVbml0c0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gdHZ1bml0c0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSB0dnVuaXRzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgfVxufSk7XG5cbmdvSG9tZSgpXG5zd2l0Y2hMYW5nKCdhcicpO1xuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0QWxsKHIpIHtcbiAgICBsZXQgaW1hZ2VzID0ge307XG4gICAgci5rZXlzKCkubWFwKChpdGVtLCBpbmRleCkgPT4geyBpbWFnZXNbaXRlbS5yZXBsYWNlKCcuLycsICcnKV0gPSByKGl0ZW0pOyB9KTtcbiAgICByZXR1cm4gaW1hZ2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9DYXJ0KHByb2R1Y3RfaW5kZXgpIHtcbiAgICBjYXJ0SW5kZXhlcy5wdXNoKHByb2R1Y3RfaW5kZXgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVZpZXdDYXJ0KCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGNhcnRBcnJEZXRhaWxzID0gW11cbiAgICBjb25zdCBjYXJ0QXJyID0ge31cbiAgICBjb25zdCBjYXJ0QXJyT0cgPSB7fVxuICAgIGxldCBhID0gJydcbiAgICBsZXQgaW5keDIgPSAtMVxuICAgIGxldCBpaWlpID0gMFxuICAgIG1haW4uaWQgPSAnY2FydC1tYWluJ1xuICAgIGNhcnRJbmRleGVzLmZvckVhY2goY2FydEluZGV4ID0+IHtcbiAgICAgICAgcHJvZHVjdHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIGlmIChjYXJ0SW5kZXggPT0gcC5pbmRleCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocC5wcm9kdWN0X3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkxpdmluZ3Jvb21zXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGgtMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSBsaXZpbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IGxpdmluZ3Jvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiS2lkcyBCZWRyb29tc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0ga2JlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0ga2JlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWFzdGVyIEJlZHJvb21zXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGgtMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSBhYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBhYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJEaW5pbmdyb29tc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gZGluaW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBkaW5pbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlJlY2VwdGlvbnNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IHJlY2VwdGlvbnNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSByZWNlcHRpb25zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVFYgVW5pdHNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IHR2dW5pdHNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSB0dnVuaXRzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhcnRBcnJEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoY2FydEFyckRldGFpbHMubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3QgYWRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICAgICAgZW1wdHkuaWQgPSAnY2FydC1lbXB0eSdcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICBlbXB0eS50ZXh0Q29udGVudCA9ICdTaG9wcGluZyBDYXJ0IGlzIEVtcHR5LidcbiAgICAgICAgICAgIGFkZC50ZXh0Q29udGVudCA9ICdBZGQgSXRlbXMnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbXB0eS50ZXh0Q29udGVudCA9ICfYudix2KjYqSDYp9mE2KrYs9mI2YIg2YHYp9ix2LrYqS4nXG4gICAgICAgICAgICBhZGQudGV4dENvbnRlbnQgPSAn2KPYttmBINmF2YbYqtis2KfYqidcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGdvSG9tZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWFpbi5jbGFzc0xpc3QuYWRkKCdlbXB0eS1jYXJ0LW1haW4nKVxuICAgICAgICBtYWluLmFwcGVuZChlbXB0eSlcbiAgICAgICAgbWFpbi5hcHBlbmQoYWRkKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCBtaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29uc3QgY2FydGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBxdWFudGl0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCBwcmljZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCB0b3RhbHByaWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IHBsYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICAgICAgbGV0IHRwID0gMFxuXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSAnUHJvZHVjdCdcbiAgICAgICAgICAgIHF1YW50aXR5LnRleHRDb250ZW50ID0gJ1F1YW50aXR5J1xuICAgICAgICAgICAgcHJpY2UudGV4dENvbnRlbnQgPSAnUHJpY2UnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfYp9mE2YXZhtiq2KwnXG4gICAgICAgICAgICBxdWFudGl0eS50ZXh0Q29udGVudCA9ICfYp9mE2YPZhdmK2KknXG4gICAgICAgICAgICBwcmljZS50ZXh0Q29udGVudCA9ICfYp9mE2LPYudixJ1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhjYXJ0QXJyKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgbGV0IHByb2QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICAgIGxldCB0aXRsZWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgICAgIGxldCBxdWFudGl0eWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgICAgIGxldCBwcmljZWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgICAgIGxldCBobGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdocicpXG4gICAgICAgICAgICBsZXQgcmVtb3ZlSW1nRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIGxldCByZW1vdmVJbWcgPSBuZXcgSW1hZ2UoKVxuXG4gICAgICAgICAgICByZW1vdmVJbWcuc3JjID0gcmVtb3ZlSWNuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICAgICAgICAgIHRpdGxlaS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF90aXRsZV9lblxuICAgICAgICAgICAgICAgIHByaWNlaS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9wcmljZV9lblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aXRsZWkudGV4dENvbnRlbnQgPSBwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfdGl0bGVfYXJcbiAgICAgICAgICAgICAgICBwcmljZWkudGV4dENvbnRlbnQgPSBwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2VfYXJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcXVhbnRpdHlpLnRleHRDb250ZW50ID0gMTsgLy8gaGVyZVxuXG4gICAgICAgICAgICBobGMuY2xhc3NMaXN0LmFkZCgnaGxjJylcbiAgICAgICAgICAgIHF1YW50aXR5aS5jbGFzc0xpc3QuYWRkKCdxcCcpXG4gICAgICAgICAgICBwcmljZWkuY2xhc3NMaXN0LmFkZCgncXAnKVxuXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWcuc3JjID0gY2FydEFyck9HW2Ake2l9LmpwZ2BdO1xuICAgICAgICAgICAgaW1nLmNsYXNzTGlzdC5hZGQoJ2NhcnQtaXRlbS1pbWcnKVxuICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvcHVsYXRlSXRlbSg4LCBpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0ZW1wLmNsYXNzTGlzdC5hZGQoJ2NhcnQtaXRlbScpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbW92ZUltZ0Rpdi5hcHBlbmQocmVtb3ZlSW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQoaW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQodGl0bGVpKVxuICAgICAgICAgICAgdGVtcC5hcHBlbmQocHJvZClcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHF1YW50aXR5aSlcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHByaWNlaSlcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHJlbW92ZUltZ0RpdilcbiAgICAgICAgICAgIG1pZC5hcHBlbmQodGVtcClcbiAgICAgICAgICAgIG1pZC5hcHBlbmQoaGxjKVxuXG4gICAgICAgICAgICB0cCArPSBwYXJzZUludChwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2UpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhsYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICAgICAgaGxjLmNsYXNzTGlzdC5hZGQoJ2hsYycpXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICB0b3RhbHByaWNlLnRleHRDb250ZW50ID0gYFRvdGFsIFByaWNlOiAke3RwfWBcbiAgICAgICAgICAgIHBsYWNlLnRleHRDb250ZW50ID0gYFBsYWNlIE9yZGVyYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG90YWxwcmljZS50ZXh0Q29udGVudCA9IGDYp9is2YXYp9mE2Yog2KfZhNiz2LnYsTogJHt0cH1gXG4gICAgICAgICAgICBwbGFjZS50ZXh0Q29udGVudCA9IGDYp9iq2YXYp9mFINi52YXZhNmK2Kkg2KfZhNi02LHYp9ihYFxuICAgICAgICB9XG5cbiAgICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0JylcbiAgICAgICAgcXVhbnRpdHkuY2xhc3NMaXN0LmFkZCgncXBoJylcbiAgICAgICAgcHJpY2UuY2xhc3NMaXN0LmFkZCgncXBoJylcblxuICAgICAgICBoZWFkZXIuYXBwZW5kKHRpdGxlKVxuICAgICAgICBoZWFkZXIuYXBwZW5kKHF1YW50aXR5KVxuICAgICAgICBoZWFkZXIuYXBwZW5kKHByaWNlKVxuXG4gICAgICAgIGhlYWRlci5pZCA9ICdjYXJ0LWhlYWRlcidcbiAgICAgICAgbWlkLmlkID0gJ2NhcnQtbWlkJ1xuICAgICAgICB0b3RhbHByaWNlLmlkID0gJ2NhcnQtdG90YWwtcHJpY2UnXG4gICAgICAgIGNhcnRmb290ZXIuaWQgPSAnY2FydC1mb290ZXInXG5cbiAgICAgICAgY2FydGZvb3Rlci5hcHBlbmQodG90YWxwcmljZSlcbiAgICAgICAgY2FydGZvb3Rlci5hcHBlbmQocGxhY2UpXG5cbiAgICAgICAgbWFpbi5hcHBlbmQoaGVhZGVyKVxuICAgICAgICBtYWluLmFwcGVuZChobGMpXG4gICAgICAgIG1haW4uYXBwZW5kKG1pZClcbiAgICAgICAgbWFpbi5hcHBlbmQoY2FydGZvb3RlcilcbiAgICB9XG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChtYWluKVxuICAgIGZsYWcgPSAncGFnZSdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dSZXN1bHRzQ291bnQobSwgYSkge1xuICAgIGxldCByZXN1bHRzRm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgcmVzdWx0c0ZvdW5kLmlkID0gXCJyZXN1bHRzLWZvdW5kXCJcbiAgICBsZXQgZ3JtID0gJydcblxuICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGdybSA9ICcgd2FzJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JtID0gJ3Mgd2VyZSdcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzRm91bmQudGV4dENvbnRlbnQgPSBgJHtPYmplY3Qua2V5cyhhKS5sZW5ndGh9IFByb2R1Y3Qke2dybX0gZm91bmQuYFxuICAgIH0gZWxzZSB7ICAgXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZ3JtID0gJ9mF2YbYqtisJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JtID0gJ9mF2YbYqtis2KfYqidcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzRm91bmQudGV4dENvbnRlbnQgPSBg2KrZhSDYp9mE2LnYq9mI2LEg2LnZhNmJICR7T2JqZWN0LmtleXMoYSkubGVuZ3RofSAke2dybX0uYFxuICAgIH1cbiAgICBtLmFwcGVuZChyZXN1bHRzRm91bmQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZWRpdERpc3RhbmNlKHMxLCBzMikge1xuICAgIHMxID0gczEudG9Mb3dlckNhc2UoKTtcbiAgICBzMiA9IHMyLnRvTG93ZXJDYXNlKCk7XG4gIFxuICAgIHZhciBjb3N0cyA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHMxLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbGFzdFZhbHVlID0gaTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IHMyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChpID09IDApXG4gICAgICAgICAgY29zdHNbal0gPSBqO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGNvc3RzW2ogLSAxXTtcbiAgICAgICAgICAgIGlmIChzMS5jaGFyQXQoaSAtIDEpICE9IHMyLmNoYXJBdChqIC0gMSkpXG4gICAgICAgICAgICAgIG5ld1ZhbHVlID0gTWF0aC5taW4oTWF0aC5taW4obmV3VmFsdWUsIGxhc3RWYWx1ZSksXG4gICAgICAgICAgICAgICAgY29zdHNbal0pICsgMTtcbiAgICAgICAgICAgIGNvc3RzW2ogLSAxXSA9IGxhc3RWYWx1ZTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPiAwKVxuICAgICAgICBjb3N0c1tzMi5sZW5ndGhdID0gbGFzdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gY29zdHNbczIubGVuZ3RoXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbWlsYXJpdHkoczEsIHMyKSB7XG4gICAgdmFyIGxvbmdlciA9IHMxO1xuICAgIHZhciBzaG9ydGVyID0gczI7XG4gICAgaWYgKHMxLmxlbmd0aCA8IHMyLmxlbmd0aCkge1xuICAgICAgbG9uZ2VyID0gczI7XG4gICAgICBzaG9ydGVyID0gczE7XG4gICAgfVxuICAgIHZhciBsb25nZXJMZW5ndGggPSBsb25nZXIubGVuZ3RoO1xuICAgIGlmIChsb25nZXJMZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIDEuMDtcbiAgICB9XG4gICAgcmV0dXJuIChsb25nZXJMZW5ndGggLSBlZGl0RGlzdGFuY2UobG9uZ2VyLCBzaG9ydGVyKSkgLyBwYXJzZUZsb2F0KGxvbmdlckxlbmd0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hSZXN1bHRzKHRhcmdldCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5mb2N1cygpXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBjb25zdCByZXN1bHRzUXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYVsxXSA+IGJbMV0pIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFbMV0gPCBiWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnRvVXBwZXJDYXNlKClcbiAgICBsZXQgYnJlYWtrID0gZmFsc2VcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoL1tBLVphLXpdXFxkXFxkKFxcZCk/KFxcZCk/Lyk7XG4gICAgaWYgKHJlLnRlc3QodGFyZ2V0KSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHNbaV07XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5wX2lkID09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNRdWV1ZS5lbnF1ZXVlKFtpLCAxLCBwcm9kdWN0LnByb2R1Y3RfdHlwZV0pXG4gICAgICAgICAgICAgICAgYnJlYWtrID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghYnJlYWtrKXtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvb2wgPSBbXVxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzW2ldO1xuICAgICAgICAgICAgcG9vbC5wdXNoKHByb2R1Y3QucHJvZHVjdF9kZXNjcmlwdGlvbl9hciwgcHJvZHVjdC5wcm9kdWN0X2Rlc2NyaXB0aW9uX2VuLFxuICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X3RpdGxlX2FyLCBwcm9kdWN0LnByb2R1Y3RfdGl0bGVfZW4sIHByb2R1Y3QucHJvZHVjdF90eXBlKVxuICAgICAgICAgICAgcG9vbC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWwubGVuZ3RoID4gMyl7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gZWwudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICBsZXQgc2ltID0gc2ltaWxhcml0eShlbCwgdGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2ltID4gMC42NSB8fCAodGFyZ2V0Lmxlbmd0aCA+IDIgJiYgKGVsLmluY2x1ZGVzKHRhcmdldCkgfHwgdGFyZ2V0LmluY2x1ZGVzKGVsKSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWRkZWQuaW5jbHVkZXMocHJvZHVjdC5wX2lkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHNRdWV1ZS5lbnF1ZXVlKFtpLCBzaW0sIHByb2R1Y3QucHJvZHVjdF90eXBlXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZC5wdXNoKHByb2R1Y3QucF9pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNyY2gudmFsdWUgPSAnJ1xuICAgIHBvcHVsYXRlU2VhcmNoUmVzdWx0cyhyZXN1bHRzUXVldWUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVNlYXJjaFJlc3VsdHMocikge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBzZWFyY2hBcnIgPSB7fVxuICAgIGxldCBscyA9IFtdXG4gICAgbGV0IGluZHh4ID0gMFxuICAgIHdoaWxlKCFyLmlzRW1wdHkoKSkge1xuICAgICAgICBsZXQgbCA9IHIuZGVxdWV1ZSgpXG4gICAgICAgIGxzLnB1c2gobClcbiAgICB9XG5cbiAgICBscy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICBsZXQgcCA9IHByb2R1Y3RzW2xbMF1dXG4gICAgICAgIGlmIChsWzJdID09IFwiTGl2aW5ncm9vbXNcIikge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGgtMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGxpdmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxbMl0gPT0gXCJLaWRzIEJlZHJvb21zXCIpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBrYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IGtiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxbMl0gPT0gXCJNYXN0ZXIgQmVkcm9vbXNcIikge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGgtMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGFiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gYWJlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobFsyXSA9PSBcIkRpbmluZ3Jvb21zXCIpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoLTFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBkaW5pbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsWzJdID09IFwiUmVjZXB0aW9uc1wiKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gcmVjZXB0aW9uc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gcmVjZXB0aW9uc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxbMl0gPT0gXCJUViBVbml0c1wiKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aC0xXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gdHZ1bml0c0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gdHZ1bml0c0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9XG4gICAgICAgIHNlYXJjaEFyckRldGFpbHMucHVzaChsWzBdKVxuICAgIH0pO1xuXG4gICAgc2hvd1Jlc3VsdHNDb3VudChtaWRkbGVDb250YWluZXIsIHNlYXJjaEFycilcblxuICAgIGZsYWcgPSAncGFnZSdcbiAgICBsZXQgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZ3JpZC5pZCA9ICdncmlkJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoc2VhcmNoQXJyKS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaW1nID0gY3JlYXRlQ2FyZChncmlkLCAtMSwgaSk7XG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHBvcHVsYXRlSXRlbSgtMSwgaSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQoZ3JpZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyKSB7XG4gICAgbGV0IG51bTtcbiAgICBsZXQgYiA9IFtdXG4gICAgaWYgKDIwMDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAyNTAwKSB7XG4gICAgICAgIG51bSA9IDZcbiAgICB9XG4gICAgaWYgKDE2MDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAyMDAwKSB7XG4gICAgICAgIG51bSA9IDVcbiAgICB9XG4gICAgaWYgKDEzMDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAxNjAwKSB7XG4gICAgICAgIG51bSA9IDRcbiAgICB9IFxuICAgIGlmICgxMDI0IDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMTMwMCkge1xuICAgICAgICBudW0gPSAzXG4gICAgfVxuICAgIGlmICg2MDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAxMDI0KSB7XG4gICAgICAgIG51bSA9IDIgXG4gICAgfVxuICAgIGlmICgwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gNjAwKSB7XG4gICAgICAgIG51bSA9IDFcbiAgICB9XG4gICAgXG4gICAgci5pbm5lckhUTUwgPSAnJ1xuXG4gICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IE1hdGguY2VpbCgxMC9udW0pOyBpaSs9MSkge1xuICAgICAgICBsZXQgYXIgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gaWkgKiBudW07IGkgPCAoaWkgKiBudW0pICsgbnVtOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZWNvbW1lbmRhdGlvbnNBcnIpLmluY2x1ZGVzKGAke2l9LmpwZ2ApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IGNyZWF0ZUNhcmQoYywgNywgaSlcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlSXRlbSg3LCBpKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFyLnB1c2goYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBiLnB1c2goYXIpXG4gICAgfVxuICAgIGxldCBwID0gMFxuICAgIGlmIChudW0gPT0gMSB8fCBudW0gPT0gMikge3AgPSAxfVxuICAgIHJldHVybiBbYiwgTWF0aC5mbG9vcigxMC9udW0pIC0gcCxudW1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnb0hvbWUoKSB7XG4gICAgbmV3U2VsZWN0KGhvbWVCdG4pXG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgY29udGFpbmVyMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZG90cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcHJldiA9IG5ldyBJbWFnZSgpXG4gICAgY29uc3QgcmVjb21tZW5kYXRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBuZXh0ID0gbmV3IEltYWdlKClcbiAgICBcbiAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgbmV4dC5zcmMgPSBuZXh0SW1nXG4gICAgcHJldi5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICBjb250YWluZXIyLmlkID0gJ2NvbnRhaW5lcjInXG5cbiAgICBsZXQgYSA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylcbiAgICBsZXQgYiA9IGFbMF1cbiAgICBsZXQgY3VyciA9IDA7XG4gICAgbGV0IGxhc3QgPSBhWzFdO1xuICAgIGxldCBudW0gPSBhWzJdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgIH1cbiAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAvbnVtKTsgaSsrKSB7XG4gICAgICAgIGxldCBkb3QgPSBuZXcgSW1hZ2UoKVxuICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICB9XG4gICAgICAgIGRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICBhID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVxuICAgICAgICBjdXJyID0gMFxuICAgICAgICBiID0gYVswXVxuICAgICAgICBsYXN0ID0gYVsxXTtcbiAgICAgICAgbnVtID0gYVsyXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJbY3Vycl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyIDw9IDApIHtcbiAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgICAgICAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmV2LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgcHJldi5zcmMgPSBwcmV2SW1nXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnIgPj0gbGFzdCkge1xuICAgICAgICAgICAgbmV4dC5zcmMgPSB1TmV4dEltZ1xuICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHQuc3JjID0gbmV4dEltZ1xuICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QucmVtb3ZlKCd1JylcbiAgICAgICAgfVxuICAgICAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5jZWlsKDEwL251bSk7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICAgICAgZG90LnNyYyA9IHNkb3RJY25cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHByZXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyID4gMCkge1xuICAgICAgICAgICAgYiA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylbMF1cbiAgICAgICAgICAgIGN1cnItLTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYltjdXJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAvbnVtKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gY3Vycikge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBkb3RJY25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgbmV4dC5zcmMgPSBuZXh0SW1nXG4gICAgICAgICAgICBpZiAoY3VyciA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJldi5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgICAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgbmV4dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGN1cnIgPCBsYXN0KSB7XG4gICAgICAgICAgICBiID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVswXVxuICAgICAgICAgICAgY3VycisrO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zLmFwcGVuZENoaWxkKGJbY3Vycl1baV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbCgxMC9udW0pOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZG90ID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBzZG90SWNuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb3RzLmFwcGVuZENoaWxkKGRvdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LnJlbW92ZSgndScpXG4gICAgICAgICAgICBwcmV2LnNyYyA9IHByZXZJbWdcbiAgICAgICAgICAgIGlmIChjdXJyID49IGxhc3QpIHtcbiAgICAgICAgICAgICAgICBuZXh0LnNyYyA9IHVOZXh0SW1nXG4gICAgICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBjb250YWluZXIuaWQgPSAncmVjb21tZW5kYXRpb25zLWNvbnRhaW5lcidcbiAgICBwcmV2LmlkID0gJ3ByZXYtaW1nJ1xuICAgIG5leHQuaWQgPSAnbmV4dC1pbWcnXG4gICAgcmVjb21tZW5kYXRpb25zLmlkID0gJ3JlY29tbWVuZGF0aW9ucydcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2KVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWNvbW1lbmRhdGlvbnMpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5leHQpXG4gICAgY29udGFpbmVyMi5hcHBlbmRDaGlsZChjb250YWluZXIpXG4gICAgY29udGFpbmVyMi5hcHBlbmRDaGlsZChkb3RzKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIyKVxuICAgIGZsYWcgPSAncGFnZSdcbiAgICBoaWRlTWVudSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlTWVudSgpIHtcbiAgICBtZW51LnN0eWxlLndpZHRoID0gXCIwJVwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzVG91Y2goKSB7XG4gICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICAgICB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwXG4gICAgICAgIHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNob29zZU1vZGUobikge1xuICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gbGl2aW5ncm9vbXNBcnJcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIGFiZWRyb29tc0FyclxuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4ga2JlZHJvb21zQXJyXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiByZWNlcHRpb25zQXJyXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBkaW5pbmdyb29tc0FyclxuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gdHZ1bml0c0FyclxuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gcmVjb21tZW5kYXRpb25zQXJyXG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBjYXJ0QXJyXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoQXJyXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaG9vc2VEZXRhaWxzKG4pIHtcbiAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIExpdmluZ1Jvb21zRGV0YWlsc1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gTWFzdGVyQmVkcm9vbXNEZXRhaWxzXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBLaWRzQmVkcm9vbXNEZXRhaWxzXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBSZWNlcHRpb25zRGV0YWlsc1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gRGluaW5nUm9vbXNEZXRhaWxzXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBUVlVuaXRzRGV0YWlsc1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByZXR1cm4gcmVjb21tZW5kYXRpb25zQXJyRGV0YWlsc1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gY2FydEFyckRldGFpbHNcbiAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hBcnJEZXRhaWxzXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQ2FyZChjb250YWluZXIsIG4sIGluZGV4KSB7XG4gICAgbGV0IGFyciA9IGNob29zZU1vZGUobilcbiAgICBsZXQgYXJyRGV0YWlscyA9IGNob29zZURldGFpbHMobilcbiAgICBsZXQgcF90aXRsZV9lbiA9ICcnXG4gICAgbGV0IHBfdGl0bGVfYXIgPSAnJ1xuICAgIGxldCBwX3ByaWNlX2VuID0gJydcbiAgICBsZXQgcF9wcmljZV9hciA9ICcnXG4gICAgXG4gICAgY29uc3QgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb25zdCBpbmZvTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29uc3QgY2FydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgY29uc3QgdG1wTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29uc3QgbmFtZVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBjb25zdCBwcmljZVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBjb25zdCBociA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJyk7XG4gICAgdG1wLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nKTtcbiAgICBpbmZvLmNsYXNzTGlzdC5hZGQoJ2luZm8nKTtcbiAgICBpbmZvTC5jbGFzc0xpc3QuYWRkKCdpbmZvLWxlZnQnKTtcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gYXJyW2Ake2luZGV4fS5qcGdgXTtcbiAgICBwX3RpdGxlX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID0gcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3RpdGxlX2VuXG4gICAgcF90aXRsZV9hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF90aXRsZV9hclxuICAgIHBfcHJpY2VfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPSBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLnByb2R1Y3RfcHJpY2VfZW5cbiAgICBwX3ByaWNlX2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID0gcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3ByaWNlX2FyXG4gICAgaWYgKG4gPT0gNykge1xuICAgICAgICBpbmZvTC5jbGFzc0xpc3QuYWRkKCdyZWNvbW1lbmRhdGlvbi1pbmZvLUwnKVxuICAgICAgICBpbmZvLmNsYXNzTGlzdC5hZGQoJ3JlY29tbWVuZGF0aW9uLWluZm8nKVxuICAgIH1cbiAgICBpbWcuc2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJywgJzEuMicpO1xuICAgIGlmIChsYW5nQnRuLnZhbHVlID09ICdlbmdsaXNoJykge1xuICAgICAgICBuYW1lUC50ZXh0Q29udGVudCA9IHBfdGl0bGVfZW5cbiAgICAgICAgY2FydC50ZXh0Q29udGVudCA9ICdBZGQgdG8gQ2FydCc7XG4gICAgICAgIHByaWNlUC50ZXh0Q29udGVudCA9IHBfcHJpY2VfZW5cbiAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lUC50ZXh0Q29udGVudCA9IHBfdGl0bGVfYXJcbiAgICAgICAgY2FydC50ZXh0Q29udGVudCA9IFwi2KfYttin2YHYqSDYp9mE2Yog2LnYsdio2Kkg2KfZhNiq2LPZiNmCXCI7XG4gICAgICAgIHByaWNlUC50ZXh0Q29udGVudCA9IHBfcHJpY2VfYXJcbiAgICB9XG5cbiAgICBcbiAgICBjYXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBhZGRUb0NhcnQocHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5pbmRleClcbiAgICB9KTtcbiAgICBcblxuICAgIGluZm9MLmFwcGVuZChuYW1lUCk7XG4gICAgaW5mb0wuYXBwZW5kKHByaWNlUCk7XG4gICAgaW5mby5hcHBlbmQoaW5mb0wpO1xuICAgIHRtcEwuYXBwZW5kKGhyKTtcbiAgICB0bXBMLmFwcGVuZChpbmZvKTtcbiAgICB0bXAuYXBwZW5kKGltZyk7XG4gICAgdG1wLmFwcGVuZCh0bXBMKTtcbiAgICB0bXAuYXBwZW5kKGNhcnQpXG4gICAgY29udGFpbmVyLmFwcGVuZCh0bXApO1xuICAgIHJldHVybiBpbWdcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVJdGVtKG4sIGkpIHtcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgY3Vyckl0ZW0ucHVzaChuKVxuICAgIGN1cnJJdGVtLnB1c2goaSlcbiAgICBsZXQgcF9jb2RlX2VuID0gJydcbiAgICBsZXQgcF9jb2RlX2FyID0gJydcbiAgICBsZXQgcF9kaW1lbnNpb25zX2VuID0gJydcbiAgICBsZXQgcF9kaW1lbnNpb25zX2FyID0gJydcbiAgICBsZXQgcF9kZXNjX2VuID0gJydcbiAgICBsZXQgcF9kZXNjX2FyID0gJydcblxuICAgIGZsYWcgPSAnaXRlbSc7XG4gICAgbGV0IGZsID0gZmFsc2VcbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHZpZXdJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZGV0YWlsc0hlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBkZXRhaWxzQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGRlc2MxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZGVzYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBkZXNjMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxldCBpbWcgPSAnJ1xuICAgIFxuICAgIGltZyA9IGNyZWF0ZUNhcmQoaXRlbSwgbiwgaSk7XG5cbiAgICBsZXQgYXJyRGV0YWlscyA9IGNob29zZURldGFpbHMobilcblxuICAgIGxldCBhcnIgPSBbXVxuXG4gICAgc3dpdGNoIChuKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGFyciA9IGxpdmluZ3Jvb21zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBhcnIgPSBhYmVkcm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGFyciA9IGtiZWRyb29tc0Fyck9HXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgYXJyID0gcmVjZXB0aW9uc0Fyck9HXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgYXJyID0gZGluaW5ncm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIGFyciA9IHR2dW5pdHNBcnJPR1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGFyciA9IHJlY29tbWVuZGF0aW9uc0Fyck9HXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgYXJyID0gY2FydEFyck9HXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIGFyciA9IHNlYXJjaEFyck9HXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHBfY29kZV9lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2NvZGVfZW5cbiAgICBwX2NvZGVfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPSBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9jb2RlX2FyXG4gICAgcF9kaW1lbnNpb25zX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID0gcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfZGltZW5zaW9uc19lblxuICAgIHBfZGltZW5zaW9uc19hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2RpbWVuc2lvbnNfYXJcbiAgICBwX2Rlc2NfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPSBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9kZXNjcmlwdGlvbl9lblxuICAgIHBfZGVzY19hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9IHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2Rlc2NyaXB0aW9uX2FyXG5cbiAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICghZmwpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvb21lZENvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKyl7XG4gICAgICAgICAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QuYWRkKCdwb3B1cCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbCA9IHRydWVcbiAgICAgICAgICAgIGxldCB6b29tZWRJbiA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBsZXQgeDIgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgem9vbWVkSW4uc3JjID0gYXJyW2Ake2l9LmpwZ2BdO1xuICAgICAgICAgICAgeDIuc3JjID0geDJJY25cbiAgICAgICAgICAgIHpvb21lZEluLmNsYXNzTGlzdC5hZGQoJ3pvb21lZC1pbicpXG4gICAgICAgICAgICB4Mi5jbGFzc0xpc3QuYWRkKCd4MicpXG4gICAgICAgICAgICB6b29tZWRDb250LmNsYXNzTGlzdC5hZGQoJ3pvb21lZC1jb250YWluZXInKVxuICAgICAgICAgICAgem9vbWVkQ29udC5hcHBlbmRDaGlsZCh6b29tZWRJbilcbiAgICAgICAgICAgIHpvb21lZENvbnQuYXBwZW5kQ2hpbGQoeDIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHpvb21lZENvbnQpXG4gICAgICAgICAgICB4Mi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBmbCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd6b29tZWQtaW4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3gyJylcbiAgICAgICAgICAgICAgICBjb25zdCBjb24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd6b29tZWQtY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICBlbGVtZW50c1swXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzWzBdKTtcbiAgICAgICAgICAgICAgICBlbFswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsWzBdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKyl7XG4gICAgICAgICAgICAgICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25bMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjb25bMF0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2aWV3SXRlbS5pZCA9ICd2aWV3LWl0ZW0nO1xuICAgIGRldGFpbHMuaWQgPSAnaXRlbS1kZXRhaWxzJztcbiAgICBkZXRhaWxzSGVhZC5pZCA9ICdkZXRhaWxzSCc7XG4gICAgZGV0YWlsc0JvZHkuaWQgPSAnZGV0YWlsc0InO1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGRldGFpbHNIZWFkLnRleHRDb250ZW50ID0gJ1Byb2R1Y3QgRGV0YWlscyc7XG4gICAgICAgIGRlc2MyLnRleHRDb250ZW50ID0gcF9kZXNjX2VuXG4gICAgICAgIGRlc2MzLnRleHRDb250ZW50ID0gcF9kaW1lbnNpb25zX2VuXG4gICAgICAgIGRlc2MxLnRleHRDb250ZW50ID0gcF9jb2RlX2VuO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRldGFpbHNIZWFkLnRleHRDb250ZW50ID0gJ9iq2YHYp9i12YrZhCDYp9mE2YXZhtiq2KwnXG4gICAgICAgIGRlc2MyLnRleHRDb250ZW50ID0gcF9kZXNjX2FyXG4gICAgICAgIGRlc2MzLnRleHRDb250ZW50ID0gcF9kaW1lbnNpb25zX2FyXG4gICAgICAgIGRlc2MxLnRleHRDb250ZW50ID0gcF9jb2RlX2FyO1xuICAgIH1cbiAgICBcbiAgICBkZXRhaWxzQm9keS5hcHBlbmQoZGVzYzEpXG4gICAgZGV0YWlsc0JvZHkuYXBwZW5kKGRlc2MyKVxuICAgIGRldGFpbHNCb2R5LmFwcGVuZChkZXNjMylcbiAgICBkZXRhaWxzLmFwcGVuZChkZXRhaWxzSGVhZClcbiAgICBkZXRhaWxzLmFwcGVuZChkZXRhaWxzQm9keSlcbiAgICB2aWV3SXRlbS5hcHBlbmRDaGlsZChpdGVtKVxuICAgIHZpZXdJdGVtLmFwcGVuZENoaWxkKGRldGFpbHMpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZCh2aWV3SXRlbSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlR3JpZChuKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGxldCBpbWFnZUFyciA9IGNob29zZU1vZGUobilcbiAgICBmbGFnID0gJ3BhZ2UnXG4gICAgbGV0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgZ3JpZC5pZCA9ICdncmlkJztcblxuICAgIHNob3dSZXN1bHRzQ291bnQobWlkZGxlQ29udGFpbmVyLCBpbWFnZUFycilcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoaW1hZ2VBcnIpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpbWcgPSBjcmVhdGVDYXJkKGdyaWQsIG4sIGkpO1xuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1bGF0ZUl0ZW0obiwgaSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhpZGVNZW51KClcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKGdyaWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVMYW5nKCkge1xuICAgIG5hdkJ0bnMuZm9yRWFjaChidG4gPT4ge1xuICAgICAgICBpZiAoZmxhZyA9PSAncGFnZScpIHtcbiAgICAgICAgICAgIGlmIChidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZC1wYWdlJylcbiAgICAgICAgICAgIHx8IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkLXBhZ2UtZGQnKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYnRuLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZ29Ib21lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGl2aW5ncm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FkdWx0cy1iZWRyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAna2lkcy1iZWRyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmVjZXB0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R2dW5pdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3B1bGF0ZUl0ZW0oY3Vyckl0ZW1bMF0sIGN1cnJJdGVtWzFdKVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdTZWxlY3QoYnV0dG9uKSB7XG4gICAgYmVkcm9vbXNCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcGFnZScpXG4gICAgbmF2QnRucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlJyk7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlLWRkJyk7XG4gICAgfSk7XG4gICAgaWYgKFtob21lQnRuLCBsaXZpbmdyb29tc0J0biwgcmVjZXB0aW9uc0J0biwgdHZ1bml0c0J0biwgZGluaW5ncm9vbXNCdG5dLmluY2x1ZGVzKGJ1dHRvbikpIHtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXBhZ2UnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoW2FiZWRyb29tc0J0biwga2JlZHJvb21zQnRuXS5pbmNsdWRlcyhidXR0b24pKSB7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wYWdlLWRkJyk7XG4gICAgICAgIGJlZHJvb21zQnRuLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXBhZ2UnKVxuICAgIH1cbiAgICBuYXZQLmZvckVhY2goYnRuID0+IHtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkLXAnKTtcbiAgICB9KVxuICAgIGxldCBhID0gYnV0dG9uLmlkXG4gICAgc3dpdGNoIChhKSB7XG4gICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgICAgaG9tZVAuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2xpdmluZ3Jvb21zJzpcbiAgICAgICAgICAgIGxpdmluZ3Jvb21zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYWR1bHRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgIGFiZWRyb29tc1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2tpZHMtYmVkcm9vbXMnOlxuICAgICAgICAgICAga2JlZHJvb21zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVjZXB0aW9ucyc6XG4gICAgICAgICAgICByZWNlcHRpb25zUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgZGluaW5ncm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0dnVuaXRzJzpcbiAgICAgICAgICAgIHR2dW5pdHNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoTGFuZyh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0ID09ICdhcicpIHtcbiAgICAgICAgc3JjaC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgXCLYp9io2K3YqyDZh9mG2KcuLlwiKTtcbiAgICAgICAgZnRyLnRleHRDb250ZW50ID0gJ9is2YXZiti5INin2YTYrdmC2YjZgiDZhdit2YHZiNi42KknO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IG5hdkJ0bnNbaV07XG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZBcltpXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdlAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IG5hdlBbaV07XG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZBcjJbaV07XG4gICAgICAgIH1cbiAgICAgICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdlbnMnKTtcbiAgICAgICAgbWVudS5jbGFzc0xpc3QuYWRkKCdhcnMnKTtcbiAgICAgICAgYmVkcm9vbXNCdG4udGV4dENvbnRlbnQgPSAn2LrYsdmBINin2YTZhtmI2YUnO1xuICAgICAgICBjYXJ0SW1nLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwi2LnYsdi2INi52LHYqNipINin2YTYqtiz2YjZglwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzcmNoLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCBcIlNlYXJjaCBoZXJlLi5cIik7XG4gICAgICAgIGZ0ci50ZXh0Q29udGVudCA9ICdBbGwgUmlnaHRzIFJlc2VydmVkLic7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2QnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2QnRuc1tpXTtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IG5hdkVuW2ldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2UC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2UFtpXTtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IG5hdkVuMltpXTtcbiAgICAgICAgfVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FycycpO1xuICAgICAgICBtZW51LmNsYXNzTGlzdC5hZGQoJ2VucycpO1xuICAgICAgICBiZWRyb29tc0J0bi50ZXh0Q29udGVudCA9ICdCZWRyb29tcydcbiAgICAgICAgY2FydEltZy5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlZpZXcgQ2FydFwiKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=