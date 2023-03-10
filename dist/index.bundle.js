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
    'الرئيسية',
    'غرف المعيشة',
    'غرف نوم رئيسية',
    'غرف نوم اطفال',
    'صالونات',
    'مكتبات',
    'غرف سفرة',
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
    'الرئيسية',
    'غرف المعيشة',
    'غرف نوم رئيسية',
    'غرف نوم اطفال',
    'صالونات',
    'مكتبات',
    'غرف سفرة',
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
        ps[0].textContent = 'الاسم'
        ps[1].textContent = 'رقم الهاتف'
        ps[2].textContent = 'البريد الالكتروني'
        ps[3].textContent = 'المحافظة'
        ps[4].textContent = 'المنطقة'
        ps[5].textContent = 'اسم / رقم الشارع'
        ps[6].textContent = 'رقم العمارة / الڤيلا'
        ps[7].textContent = 'الطابق'
        ps[8].textContent = 'الشقة'
        ps[9].textContent = 'علامة مميزة'
        ps[10].textContent = 'تعليمات اخري'
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
        : 'الرجاء الانتظار..'
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
                success.textContent = 'تم تقديم الطلب بنجاح!'
                success2.textContent =
                    'يرجى التحقق من بريدك الإلكتروني للتأكيد.'
                orderNum.textContent = `رقم الطلب: ${id}`
                btn.textContent = 'مواصلة التسوق'
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
                success.textContent = 'لقد حدث خطأ ما.'
                success2.textContent = 'يرجى المحاولة مرة أخرى أو الاتصال بنا.'
                btn.textContent = 'اعادة المحاولة'
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
            addChange.textContent = 'تغيير'
            let addArr = Object.values(_address)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            addArr.splice(-1, 1)
            if (!_address.apartment) {
                addArr.splice(-1, 1)
            }
            if (_address.landmark) {
                landmarkP.textContent = `علامة مميزة: ${_address.landmark}`
            }
            if (_address.instructions) {
                instP.textContent = `تعليمات اخري: ${_address.instructions}`
            }
            addressP.textContent = addArr.join(' - ')
        } else {
            addChange.textContent = 'اضافة'
            addressDNE.textContent = 'لم يتم العثور على عنوان.'
        }
        subtotal.textContent = `الاجمالي: ${tp} ج.م`
        shipping.textContent = 'زائد مصاريف الشحن.'
        placeOrder.textContent = `اتمام عملية الشراء`
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
            title.textContent = 'المنتج'
            price.textContent = 'السعر'
            notifP.textContent = ' تمت الإزالة من عربة التسوق!'
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
                }، ${products[parseInt(cartArrDetails[i])].product_title_ar}`
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
            totalprice.textContent = `اجمالي السعر: ${tp}`
            place.textContent = `الاستمرار`
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
            grm = 'منتج'
        } else {
            grm = 'منتجات'
        }
        resultsFound.textContent = `تم العثور على ${
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
        aboutusP.textContent = 'معلومات عنا'
        contactusP.textContent = 'إتصل بنا'
        bodyP.textContent =
            'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديد يونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا باراياتيور. أيكسسيبتيور ساينت أوككايكات كيوبايداتات نون بروايدينت ,سيونت ان كيولبا كيو أوفيسيا ديسيريونتموليت انيم أيدي ايست لابوريوم.'
        locationH.textContent = 'العنوان: '
        emailP.textContent = 'البريد الالكتروني: '
        phoneP.textContent = 'رقم الهاتف: '
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
        cart.textContent = 'اضافة الي عربة التسوق'
        priceP.textContent = p_price_ar
        span.textContent = 'تمت الإضافة إلى عربة التسوق!'
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
        detailsHead.textContent = 'تفاصيل المنتج'
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
        srch.setAttribute('placeholder', 'ابحث هنا..')
        ftr.textContent = 'جميع الحقوق محفوظة'
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
        bedroomsBtn.textContent = 'غرف النوم'
        cartImg.setAttribute('title', 'عرض عربة التسوق')
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
module.exports = JSON.parse('{"Products":[{"p_id":"M22","product_code_en":"- ID: M22","product_code_ar":"- رقم المنتج:  M22","product_title_en":"Brown TV Unit","product_title_ar":"وحدة تلفاز بني","product_description_en":"- Details: The TV unit is made of imported high-quality LPL wood, glued with high-quality melamine synthetic veneer, with impact-resistant PVC board.","product_description_ar":"- التفاصيل: وحدة التلفزيون مصنوعة من خشب LPL مستورد عالي الجودة ، ومُلصق بقشرة الميلامين الاصطناعية عالية الجودة ، مع لوح PVC المقاوم للصدمات.","product_price_en":"5000 EGP","product_price_ar":"5000 ج.م","product_price":5000,"product_dimensions_en":"- Dimensions: 200 x 190","product_dimensions_ar":"- الابعاد: ‎200 x 190","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/0.jpg","recommended":1,"index":0},{"p_id":"M01","product_code_en":"- ID: M01","product_code_ar":"- رقم المنتج:  M01","product_title_en":"Test","product_title_ar":"t","product_description_en":"- Details: t","product_description_ar":"- التفاصيل: t","product_price_en":"100 EGP","product_price_ar":"100 ج.م","product_price":100,"product_dimensions_en":"- Dimensions: 300","product_dimensions_ar":"- الابعاد: ‎300","product_type":"Livingrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/livingrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/livingrooms/0.jpg","recommended":1,"index":1},{"p_id":"M04","product_code_en":"- ID: M04","product_code_ar":"- رقم المنتج:  M04","product_title_en":"Test","product_title_ar":"t","product_description_en":"- Details: t","product_description_ar":"- التفاصيل: t","product_price_en":"4000 EGP","product_price_ar":"4000 ج.م","product_price":4000,"product_dimensions_en":"- Dimensions: t","product_dimensions_ar":"- الابعاد: ‎t","product_type":"Receptions","product_img_path_displayed":"src/assets/images/pictures/products/displayed/receptions/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/receptions/0.jpg","recommended":1,"index":2},{"p_id":"M44","product_code_en":"- ID: M44","product_code_ar":"- رقم المنتج:  M44","product_title_en":"EJEJ","product_title_ar":"EJEJ","product_description_en":"- Details: EJEJ","product_description_ar":"- التفاصيل: EJEJ","product_price_en":"2222 EGP","product_price_ar":"2222 ج.م","product_price":2222,"product_dimensions_en":"- Dimensions: EJEJ","product_dimensions_ar":"- الابعاد: ‎EJEJ","product_type":"Diningrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/diningrooms/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/diningrooms/0.jpg","recommended":1,"index":3},{"p_id":"M42","product_code_en":"- ID: M42","product_code_ar":"- رقم المنتج:  M42","product_title_en":"EJEJ","product_title_ar":"EJEJ","product_description_en":"- Details: EJEJ","product_description_ar":"- التفاصيل: EJEJ","product_price_en":"3222 EGP","product_price_ar":"3222 ج.م","product_price":3222,"product_dimensions_en":"- Dimensions: EJEJ","product_dimensions_ar":"- الابعاد: ‎EJEJ","product_type":"Diningrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/diningrooms/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/diningrooms/1.jpg","recommended":1,"index":4},{"p_id":"M500","product_code_en":"- ID: M500","product_code_ar":"- رقم المنتج:  M500","product_title_en":"as","product_title_ar":"as","product_description_en":"- Details: as","product_description_ar":"- التفاصيل: as","product_price_en":"22 EGP","product_price_ar":"22 ج.م","product_price":22,"product_dimensions_en":"- Dimensions: as","product_dimensions_ar":"- الابعاد: ‎as","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/1.jpg","recommended":0,"index":5}],"Orders":[]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/scripts/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFVBQVU7QUFDdkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0NURPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9CcUQ7QUFDOUM7QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7O0FDaENJO0FBQ1AiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwL3NyYy9oZWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9zcmMvbWF4SGVhcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAvc3JjL21pbkhlYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL3NyYy9tYXhQcmlvcml0eVF1ZXVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvcHJpb3JpdHktcXVldWUvc3JjL21pblByaW9yaXR5UXVldWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZS9zcmMvcHJpb3JpdHlRdWV1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2xvbmUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1NldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVSZWdFeHAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVUeXBlZEFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9scy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFZhbHVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZU9iamVjdC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZWRlZXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5c0luLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9saXZpbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3Rlci8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9saXZpbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9yZWNlcHRpb25zLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL3NjcmlwdHMvbG9jYWwtc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL3NyYy9oZWFwJyk7XG5jb25zdCB7IE1pbkhlYXAgfSA9IHJlcXVpcmUoJy4vc3JjL21pbkhlYXAnKTtcbmNvbnN0IHsgTWF4SGVhcCB9ID0gcmVxdWlyZSgnLi9zcmMvbWF4SGVhcCcpO1xuXG5leHBvcnRzLkhlYXAgPSBIZWFwO1xuZXhwb3J0cy5NaW5IZWFwID0gTWluSGVhcDtcbmV4cG9ydHMuTWF4SGVhcCA9IE1heEhlYXA7XG4iLCIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgSGVhcCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlXG4gICAqIEBwYXJhbSB7YXJyYXl9IFtfdmFsdWVzXVxuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSBbX2xlYWZdXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb21wYXJlLCBfdmFsdWVzLCBfbGVhZikge1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwIGNvbnN0cnVjdG9yIGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBhcmUgPSBjb21wYXJlO1xuICAgIHRoaXMuX25vZGVzID0gQXJyYXkuaXNBcnJheShfdmFsdWVzKSA/IF92YWx1ZXMgOiBbXTtcbiAgICB0aGlzLl9sZWFmID0gX2xlYWYgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgaGVhcCB0byBhIGNsb25lZCBhcnJheSB3aXRob3V0IHNvcnRpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9ub2Rlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcGFyZW50IGhhcyBhIGxlZnQgY2hpbGRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpIHtcbiAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICByZXR1cm4gbGVmdENoaWxkSW5kZXggPCB0aGlzLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBwYXJlbnQgaGFzIGEgcmlnaHQgY2hpbGRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSB7XG4gICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAyO1xuICAgIHJldHVybiByaWdodENoaWxkSW5kZXggPCB0aGlzLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gbm9kZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQXQoaSwgaikge1xuICAgIHJldHVybiB0aGlzLl9jb21wYXJlKHRoaXMuX25vZGVzW2ldLCB0aGlzLl9ub2Rlc1tqXSk7XG4gIH1cblxuICAvKipcbiAgICogU3dhcHMgdHdvIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc3dhcChpLCBqKSB7XG4gICAgY29uc3QgdGVtcCA9IHRoaXMuX25vZGVzW2ldO1xuICAgIHRoaXMuX25vZGVzW2ldID0gdGhpcy5fbm9kZXNbal07XG4gICAgdGhpcy5fbm9kZXNbal0gPSB0ZW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBwYXJlbnQgYW5kIGNoaWxkIHNob3VsZCBiZSBzd2FwcGVkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkge1xuICAgIGlmIChwYXJlbnRJbmRleCA8IDAgfHwgcGFyZW50SW5kZXggPj0gdGhpcy5zaXplKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGRJbmRleCA8IDAgfHwgY2hpbGRJbmRleCA+PSB0aGlzLnNpemUoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jb21wYXJlQXQocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyBjaGlsZHJlbiBvZiBhIHBhcmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KSB7XG4gICAgaWYgKCF0aGlzLl9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpICYmICF0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAxO1xuICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcblxuICAgIGlmICghdGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGRJbmRleDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2hhc1JpZ2h0Q2hpbGQocGFyZW50SW5kZXgpKSB7XG4gICAgICByZXR1cm4gbGVmdENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmVBdChsZWZ0Q2hpbGRJbmRleCwgcmlnaHRDaGlsZEluZGV4KTtcbiAgICByZXR1cm4gY29tcGFyZSA+IDAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gY2hpbGRyZW4gYmVmb3JlIGEgcG9zaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQ2hpbGRyZW5CZWZvcmUoaW5kZXgsIGxlZnRDaGlsZEluZGV4LCByaWdodENoaWxkSW5kZXgpIHtcbiAgICBjb25zdCBjb21wYXJlID0gdGhpcy5fY29tcGFyZUF0KHJpZ2h0Q2hpbGRJbmRleCwgbGVmdENoaWxkSW5kZXgpO1xuXG4gICAgaWYgKGNvbXBhcmUgPD0gMCAmJiByaWdodENoaWxkSW5kZXggPCBpbmRleCkge1xuICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGRJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVmdENoaWxkSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyB1cCBhIG5vZGUgaWYgaXQncyBpbiBhIHdyb25nIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeVVwKHN0YXJ0SW5kZXgpIHtcbiAgICBsZXQgY2hpbGRJbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoY2hpbGRJbmRleCAtIDEpIC8gMik7XG5cbiAgICB3aGlsZSAodGhpcy5fc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkpIHtcbiAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgY2hpbGRJbmRleCA9IHBhcmVudEluZGV4O1xuICAgICAgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChjaGlsZEluZGV4IC0gMSkgLyAyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyBkb3duIGEgbm9kZSBpZiBpdCdzIGluIGEgd3JvbmcgcG9zaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oZWFwaWZ5RG93bihzdGFydEluZGV4KSB7XG4gICAgbGV0IHBhcmVudEluZGV4ID0gc3RhcnRJbmRleDtcbiAgICBsZXQgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KTtcblxuICAgIHdoaWxlICh0aGlzLl9zaG91bGRTd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSkge1xuICAgICAgdGhpcy5fc3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCk7XG4gICAgICBwYXJlbnRJbmRleCA9IGNoaWxkSW5kZXg7XG4gICAgICBjaGlsZEluZGV4ID0gdGhpcy5fY29tcGFyZUNoaWxkcmVuT2YocGFyZW50SW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBidWJibGVzIGRvd24gYSBub2RlIGJlZm9yZSBhIGdpdmVuIGluZGV4XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeURvd25VbnRpbChpbmRleCkge1xuICAgIGxldCBwYXJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGxlZnRDaGlsZEluZGV4ID0gMTtcbiAgICBsZXQgcmlnaHRDaGlsZEluZGV4ID0gMjtcbiAgICBsZXQgY2hpbGRJbmRleDtcblxuICAgIHdoaWxlIChsZWZ0Q2hpbGRJbmRleCA8IGluZGV4KSB7XG4gICAgICBjaGlsZEluZGV4ID0gdGhpcy5fY29tcGFyZUNoaWxkcmVuQmVmb3JlKFxuICAgICAgICBpbmRleCxcbiAgICAgICAgbGVmdENoaWxkSW5kZXgsXG4gICAgICAgIHJpZ2h0Q2hpbGRJbmRleFxuICAgICAgKTtcblxuICAgICAgaWYgKHRoaXMuX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpKSB7XG4gICAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRJbmRleCA9IGNoaWxkSW5kZXg7XG4gICAgICBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICAgIHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBpbnNlcnQodmFsdWUpIHtcbiAgICB0aGlzLl9ub2Rlcy5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLl9oZWFwaWZ5VXAodGhpcy5zaXplKCkgLSAxKTtcbiAgICBpZiAodGhpcy5fbGVhZiA9PT0gbnVsbCB8fCB0aGlzLl9jb21wYXJlKHZhbHVlLCB0aGlzLl9sZWFmKSA+IDApIHtcbiAgICAgIHRoaXMuX2xlYWYgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3QoKTtcbiAgICB0aGlzLl9ub2Rlc1swXSA9IHRoaXMuX25vZGVzW3RoaXMuc2l6ZSgpIC0gMV07XG4gICAgdGhpcy5fbm9kZXMucG9wKCk7XG4gICAgdGhpcy5faGVhcGlmeURvd24oMCk7XG5cbiAgICBpZiAocm9vdCA9PT0gdGhpcy5fbGVhZikge1xuICAgICAgdGhpcy5fbGVhZiA9IHRoaXMucm9vdCgpO1xuICAgIH1cblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnNpemUoKSAtIDE7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgIHRoaXMuX3N3YXAoMCwgaSk7XG4gICAgICB0aGlzLl9oZWFwaWZ5RG93blVudGlsKGkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XG4gIH1cblxuICAvKipcbiAgICogRml4ZXMgbm9kZSBwb3NpdGlvbnMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIGZpeCgpIHtcbiAgICAvLyBmaXggbm9kZSBwb3NpdGlvbnNcbiAgICBmb3IgKGxldCBpID0gTWF0aC5mbG9vcih0aGlzLnNpemUoKSAvIDIpIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgIHRoaXMuX2hlYXBpZnlEb3duKGkpO1xuICAgIH1cblxuICAgIC8vIGZpeCBsZWFmIHZhbHVlXG4gICAgZm9yIChsZXQgaSA9IE1hdGguZmxvb3IodGhpcy5zaXplKCkgLyAyKTsgaSA8IHRoaXMuc2l6ZSgpOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fbm9kZXNbaV07XG4gICAgICBpZiAodGhpcy5fbGVhZiA9PT0gbnVsbCB8fCB0aGlzLl9jb21wYXJlKHZhbHVlLCB0aGlzLl9sZWFmKSA+IDApIHtcbiAgICAgICAgdGhpcy5fbGVhZiA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICBjb25zdCBpc1ZhbGlkUmVjdXJzaXZlID0gKHBhcmVudEluZGV4KSA9PiB7XG4gICAgICBsZXQgaXNWYWxpZExlZnQgPSB0cnVlO1xuICAgICAgbGV0IGlzVmFsaWRSaWdodCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLl9oYXNMZWZ0Q2hpbGQocGFyZW50SW5kZXgpKSB7XG4gICAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAxO1xuICAgICAgICBpZiAodGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCBsZWZ0Q2hpbGRJbmRleCkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzVmFsaWRMZWZ0ID0gaXNWYWxpZFJlY3Vyc2l2ZShsZWZ0Q2hpbGRJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG4gICAgICAgIGlmICh0aGlzLl9jb21wYXJlQXQocGFyZW50SW5kZXgsIHJpZ2h0Q2hpbGRJbmRleCkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzVmFsaWRSaWdodCA9IGlzVmFsaWRSZWN1cnNpdmUocmlnaHRDaGlsZEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzVmFsaWRMZWZ0ICYmIGlzVmFsaWRSaWdodDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGlzVmFsaWRSZWN1cnNpdmUoMCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNoYWxsb3cgY29weSBvZiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBIZWFwKHRoaXMuX2NvbXBhcmUsIHRoaXMuX25vZGVzLnNsaWNlKCksIHRoaXMuX2xlYWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHJvb3QoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbm9kZXNbMF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5fbGVhZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZXMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaXplKCkgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX25vZGVzID0gW107XG4gICAgdGhpcy5fbGVhZiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGEgaGVhcCBmcm9tIGEgYXJyYXkgb2YgdmFsdWVzXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHN0YXRpYyBoZWFwaWZ5KHZhbHVlcywgY29tcGFyZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hlYXAuaGVhcGlmeSBleHBlY3RzIGFuIGFycmF5IG9mIHZhbHVlcycpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwLmhlYXBpZnkgZXhwZWN0cyBhIGNvbXBhcmUgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEhlYXAoY29tcGFyZSwgdmFsdWVzKS5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBsaXN0IG9mIHZhbHVlcyBpcyBhIHZhbGlkIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzSGVhcGlmaWVkKHZhbHVlcywgY29tcGFyZSkge1xuICAgIHJldHVybiBuZXcgSGVhcChjb21wYXJlLCB2YWx1ZXMpLmlzVmFsaWQoKTtcbiAgfVxufVxuXG5leHBvcnRzLkhlYXAgPSBIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKi9cblxuY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL2hlYXAnKTtcblxuY29uc3QgZ2V0TWF4Q29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAxIDogLTE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNYXhIZWFwXG4gKiBAZXh0ZW5kcyBIZWFwXG4gKi9cbmNsYXNzIE1heEhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHBhcmFtIHtIZWFwfSBbX2hlYXBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgdGhpcy5fZ2V0Q29tcGFyZVZhbHVlID0gZ2V0Q29tcGFyZVZhbHVlO1xuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgSGVhcChnZXRNYXhDb21wYXJlKGdldENvbXBhcmVWYWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGV4dHJhY3RSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBoZWFwIHNvcnQgYW5kIHJldHVybiB0aGUgdmFsdWVzIHNvcnRlZCBieSBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHNvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBoZWFwIHRvIGEgY2xvbmVkIGFycmF5IHdpdGhvdXQgc29ydGluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2hlYXAuX25vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXhlcyBub2RlIHBvc2l0aW9ucyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgZml4KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc1ZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBNYXhIZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01heEhlYXB9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IE1heEhlYXAodGhpcy5fZ2V0Q29tcGFyZVZhbHVlLCB0aGlzLl9oZWFwLmNsb25lKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIE1heEhlYXAgZnJvbSBhbiBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgc3RhdGljIGhlYXBpZnkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXhIZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheScpO1xuICAgIH1cbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGxpc3Qgb2YgdmFsdWVzIGlzIGEgdmFsaWQgbWF4IGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNYXhDb21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNYXhIZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuaXNWYWxpZCgpO1xuICB9XG59XG5cbmV4cG9ydHMuTWF4SGVhcCA9IE1heEhlYXA7XG4iLCIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqL1xuXG5jb25zdCB7IEhlYXAgfSA9IHJlcXVpcmUoJy4vaGVhcCcpO1xuXG5jb25zdCBnZXRNaW5Db21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IC0xIDogMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1pbkhlYXBcbiAqIEBleHRlbmRzIEhlYXBcbiAqL1xuY2xhc3MgTWluSGVhcCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcGFyYW0ge0hlYXB9IFtfaGVhcF1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICB0aGlzLl9nZXRDb21wYXJlVmFsdWUgPSBnZXRDb21wYXJlVmFsdWU7XG4gICAgdGhpcy5faGVhcCA9IF9oZWFwIHx8IG5ldyBIZWFwKGdldE1pbkNvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGhlYXAgdG8gYSBjbG9uZWQgYXJyYXkgd2l0aG91dCBzb3J0aW5nLlxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5faGVhcC5fbm9kZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGV4dHJhY3RSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBoZWFwIHNvcnQgYW5kIHJldHVybiB0aGUgdmFsdWVzIHNvcnRlZCBieSBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHNvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpeGVzIG5vZGUgcG9zaXRpb25zIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZpZXMgdGhhdCBhbGwgaGVhcCBub2RlcyBhcmUgaW4gdGhlIHJpZ2h0IHBvc2l0aW9uXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc1ZhbGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzVmFsaWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICByb290KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICB0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsZWFmIG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBsZWFmKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBoZWFwIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5faGVhcC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaGFsbG93IGNvcHkgb2YgdGhlIE1pbkhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7TWluSGVhcH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgTWluSGVhcCh0aGlzLl9nZXRDb21wYXJlVmFsdWUsIHRoaXMuX2hlYXAuY2xvbmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGEgTWluSGVhcCBmcm9tIGFuIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBzdGF0aWMgaGVhcGlmeSh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pbkhlYXAuaGVhcGlmeSBleHBlY3RzIGFuIGFycmF5Jyk7XG4gICAgfVxuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgbGlzdCBvZiB2YWx1ZXMgaXMgYSB2YWxpZCBtaW4gaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzSGVhcGlmaWVkKHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1pbkNvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1pbkhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5pc1ZhbGlkKCk7XG4gIH1cbn1cblxuZXhwb3J0cy5NaW5IZWFwID0gTWluSGVhcDtcbiIsImNvbnN0IHsgTWluUHJpb3JpdHlRdWV1ZSB9ID0gcmVxdWlyZSgnLi9zcmMvbWluUHJpb3JpdHlRdWV1ZScpO1xuY29uc3QgeyBNYXhQcmlvcml0eVF1ZXVlIH0gPSByZXF1aXJlKCcuL3NyYy9tYXhQcmlvcml0eVF1ZXVlJyk7XG5jb25zdCB7IFByaW9yaXR5UXVldWUgfSA9IHJlcXVpcmUoJy4vc3JjL3ByaW9yaXR5UXVldWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTWluUHJpb3JpdHlRdWV1ZSwgTWF4UHJpb3JpdHlRdWV1ZSwgUHJpb3JpdHlRdWV1ZSB9O1xuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuY29uc3QgeyBIZWFwLCBNYXhIZWFwIH0gPSByZXF1aXJlKCdAZGF0YXN0cnVjdHVyZXMtanMvaGVhcCcpO1xuXG5jb25zdCBnZXRNYXhDb21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IDEgOiAtMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1heFByaW9yaXR5UXVldWVcbiAqIEBleHRlbmRzIE1heEhlYXBcbiAqL1xuY2xhc3MgTWF4UHJpb3JpdHlRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICBpZiAoZ2V0Q29tcGFyZVZhbHVlICYmIHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF4UHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNhbGxiYWNrIGZvciBvYmplY3QgdmFsdWVzJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBtaW4gcHJpb3JpdHkgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZSBmcm9tIGFuIGV4aXN0aW5nIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7TWF4UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHN0YXRpYyBmcm9tQXJyYXkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4UHJpb3JpdHlRdWV1ZShcbiAgICAgIGdldENvbXBhcmVWYWx1ZSxcbiAgICAgIG5ldyBNYXhIZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KClcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydHMuTWF4UHJpb3JpdHlRdWV1ZSA9IE1heFByaW9yaXR5UXVldWU7XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG5jb25zdCB7IEhlYXAsIE1pbkhlYXAgfSA9IHJlcXVpcmUoJ0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwJyk7XG5cbmNvbnN0IGdldE1pbkNvbXBhcmUgPSAoZ2V0Q29tcGFyZVZhbHVlKSA9PiAoYSwgYikgPT4ge1xuICBjb25zdCBhVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShhKSA6IGE7XG4gIGNvbnN0IGJWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGIpIDogYjtcbiAgcmV0dXJuIGFWYWwgPCBiVmFsID8gLTEgOiAxO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgTWluUHJpb3JpdHlRdWV1ZVxuICovXG5jbGFzcyBNaW5Qcmlvcml0eVF1ZXVlIHtcbiAgY29uc3RydWN0b3IoZ2V0Q29tcGFyZVZhbHVlLCBfaGVhcCkge1xuICAgIGlmIChnZXRDb21wYXJlVmFsdWUgJiYgdHlwZW9mIGdldENvbXBhcmVWYWx1ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5Qcmlvcml0eVF1ZXVlIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgY2FsbGJhY2sgZm9yIG9iamVjdCB2YWx1ZXMnKTtcbiAgICB9XG4gICAgdGhpcy5faGVhcCA9IF9oZWFwIHx8IG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBmcm9udCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggbG93ZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIGVucXVldWUodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnF1ZXVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGRlcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGxpc3Qgb2YgZWxlbWVudHMgZnJvbSBoaWdoZXN0IHRvIGxvd2VzdCBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuY2xvbmUoKS5zb3J0KCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIG1pbiBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByaW9yaXR5IHF1ZXVlIGZyb20gYW4gZXhpc3RpbmcgYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtNaW5Qcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgc3RhdGljIGZyb21BcnJheSh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5Qcmlvcml0eVF1ZXVlKFxuICAgICAgZ2V0Q29tcGFyZVZhbHVlLFxuICAgICAgbmV3IE1pbkhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5maXgoKVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0cy5NaW5Qcmlvcml0eVF1ZXVlID0gTWluUHJpb3JpdHlRdWV1ZTtcbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbmNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAnKTtcblxuLyoqXG4gKiBAY2xhc3MgUHJpb3JpdHlRdWV1ZVxuICovXG5jbGFzcyBQcmlvcml0eVF1ZXVlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcGFyYW1zIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29tcGFyZSwgX3ZhbHVlcykge1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcmlvcml0eVF1ZXVlIGNvbnN0cnVjdG9yIGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBuZXcgSGVhcChjb21wYXJlLCBfdmFsdWVzKTtcbiAgICBpZiAoX3ZhbHVlcykge1xuICAgICAgdGhpcy5faGVhcC5maXgoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBmcm9udCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IHdpdGggbG93ZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIGVucXVldWUodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pbnNlcnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7UHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHB1c2godmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnF1ZXVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGRlcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmlzRW1wdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc29ydGVkIGxpc3Qgb2YgZWxlbWVudHMgZnJvbSBoaWdoZXN0IHRvIGxvd2VzdCBwcmlvcml0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHthcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuY2xvbmUoKS5zb3J0KCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIHByaW9yaXR5IHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWUgZnJvbSBhbiBleGlzdGluZyBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBzdGF0aWMgZnJvbUFycmF5KHZhbHVlcywgY29tcGFyZSkge1xuICAgIHJldHVybiBuZXcgUHJpb3JpdHlRdWV1ZShjb21wYXJlLCB2YWx1ZXMpO1xuICB9XG59XG5cbmV4cG9ydHMuUHJpb3JpdHlRdWV1ZSA9IFByaW9yaXR5UXVldWU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNNYXAgPSByZXF1aXJlKCcuL2lzTWFwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTZXQgPSByZXF1aXJlKCcuL2lzU2V0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hcGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWFwKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gbWFwVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hcDtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzU2V0YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNTZXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBzZXRUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzSW47XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5jbG9uZWAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgY2xvbmVzIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlY3Vyc2l2ZWx5IGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGRlZXAgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9ERUVQX0ZMQUcgfCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBiYXNlSXNNYXAgPSByZXF1aXJlKCcuL19iYXNlSXNNYXAnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzTWFwID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNNYXA7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBNYXBgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTWFwKG5ldyBNYXApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNNYXAobmV3IFdlYWtNYXApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzTWFwID0gbm9kZUlzTWFwID8gYmFzZVVuYXJ5KG5vZGVJc01hcCkgOiBiYXNlSXNNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXA7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlSXNTZXQgPSByZXF1aXJlKCcuL19iYXNlSXNTZXQnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzU2V0ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNTZXQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTZXRgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU2V0KG5ldyBTZXQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTZXQ7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZGluaW5ncm9vbXMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZGluaW5ncm9vbXMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZGluaW5ncm9vbXMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvbGl2aW5ncm9vbXMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvbGl2aW5ncm9vbXMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucy8wLmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9yZWNlcHRpb25zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8xLmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL2tpZHMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7IiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZGluaW5ncm9vbXMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcy8xLmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvbGl2aW5ncm9vbXMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9saXZpbmdyb29tcyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3JlY2VwdGlvbnMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9yZWNlcHRpb25zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cy8wLmpwZ1wiLFxuXHRcIi4vMS5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsImltcG9ydCBsb2dvIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvbG9nby5qcGcnXG5pbXBvcnQgY2FydExvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9jYXJ0LnN2ZydcbmltcG9ydCBtZW51TG9nbyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL21lbnUuc3ZnJ1xuaW1wb3J0IHByZXZJbWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9sZWZ0LnN2ZydcbmltcG9ydCBuZXh0SW1nIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvcmlnaHQuc3ZnJ1xuaW1wb3J0IHVQcmV2SW1nIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvdWxlZnQuc3ZnJ1xuaW1wb3J0IHVOZXh0SW1nIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvdXJpZ2h0LnN2ZydcbmltcG9ydCB4Q2xvc2UgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy94LnN2ZydcbmltcG9ydCBkb3RJY24gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9kb3Quc3ZnJ1xuaW1wb3J0IHNkb3RJY24gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9zZG90LnN2ZydcbmltcG9ydCB4MkljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3gyLnN2ZydcbmltcG9ydCByZW1vdmVJY24gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9yZW1vdmUtY2FydC5zdmcnXG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi9sb2NhbC1zdG9yYWdlJ1xuXG5pbXBvcnQgZmIgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9mYi5zdmcnXG5pbXBvcnQgaWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9pZy5zdmcnXG5pbXBvcnQgd2EgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy93YS5zdmcnXG5pbXBvcnQgZGIgZnJvbSAnLi9kYi5qc29uJ1xuXG5pbXBvcnQgeyBQcmlvcml0eVF1ZXVlIH0gZnJvbSAnQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlJ1xuaW1wb3J0IHsgbmFub2lkIH0gZnJvbSAnbmFub2lkJ1xuY29uc3QgY2xvbmVEZWVwID0gcmVxdWlyZSgnbG9kYXNoL2Nsb25lZGVlcCcpXG5cbmxldCBwcm9kdWN0cyA9IGRiLlByb2R1Y3RzXG5cbmV4cG9ydCBjb25zdCBtaWRkbGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWlkZGxlLWNvbnRhaW5lcicpXG5leHBvcnQgY29uc3QgaGVhZGVyVXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXVwcGVyJylcbmV4cG9ydCBjb25zdCBhY3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbnMtY29udGFpbmVyJylcbmV4cG9ydCBjb25zdCBjbGYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xmJylcbmV4cG9ydCBjb25zdCBsYW5nQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsY3QtbGFuZycpXG5leHBvcnQgY29uc3QgbGl2aW5ncm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGl2aW5ncm9vbXMnKVxuZXhwb3J0IGNvbnN0IGhvbWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG9tZScpXG5leHBvcnQgY29uc3QgYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmVkcm9vbXMnKVxuZXhwb3J0IGNvbnN0IGFiZWRyb29tc0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZHVsdHMtYmVkcm9vbXMnKVxuZXhwb3J0IGNvbnN0IGtiZWRyb29tc0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdraWRzLWJlZHJvb21zJylcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlY2VwdGlvbnMnKVxuZXhwb3J0IGNvbnN0IHR2dW5pdHNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHZ1bml0cycpXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGluaW5ncm9vbXMnKVxuZXhwb3J0IGNvbnN0IHNyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3JjaC1pbicpXG5leHBvcnQgY29uc3QgZnRyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z0cicpXG5leHBvcnQgY29uc3QgbWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51JylcbmV4cG9ydCBjb25zdCBob21lUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lLXAnKVxuZXhwb3J0IGNvbnN0IGxpdmluZ3Jvb21zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZpbmdyb29tcy1wJylcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FiZWRyb29tcy1wJylcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2tiZWRyb29tcy1wJylcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRpb25zLXAnKVxuZXhwb3J0IGNvbnN0IHR2dW5pdHNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2dW5pdHMtcCcpXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpbmluZ3Jvb21zLXAnKVxuZXhwb3J0IGNvbnN0IGFkZHJlc3NQb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcy1wb3B1cCcpXG5cbmV4cG9ydCBjb25zdCBsb2dvSW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBjYXJ0SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBtZW51SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCB4SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBmYkltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgaWdJbWcgPSBuZXcgSW1hZ2UoKVxuZXhwb3J0IGNvbnN0IHdhSW1nID0gbmV3IEltYWdlKClcblxubG9nb0ltZy5zcmMgPSBsb2dvXG5jYXJ0SW1nLnNyYyA9IGNhcnRMb2dvXG5tZW51SW1nLnNyYyA9IG1lbnVMb2dvXG54SW1nLnNyYyA9IHhDbG9zZVxuZmJJbWcuc3JjID0gZmJcbmlnSW1nLnNyYyA9IGlnXG53YUltZy5zcmMgPSB3YVxuXG5jYXJ0SW1nLnNldEF0dHJpYnV0ZShcbiAgICAnc3R5bGUnLFxuICAgICd3aWR0aDogNDBweDtoZWlnaHQ6IDQwcHg7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgLTVweCk7J1xuKVxubWVudUltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiA0MHB4O2hlaWdodDogNDBweDsnKVxueEltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAyMHB4O2hlaWdodDogMjBweDsnKVxuXG5jb25zdCBzbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbScpXG5jb25zdCBmYmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmJsJylcbmNvbnN0IGlnbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZ2wnKVxuY29uc3QgcG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4nKVxuZmJsLmFwcGVuZENoaWxkKGZiSW1nKVxuaWdsLmFwcGVuZENoaWxkKGlnSW1nKVxucG4uYXBwZW5kQ2hpbGQod2FJbWcpXG5zbS5hcHBlbmRDaGlsZChmYmwpXG5zbS5hcHBlbmRDaGlsZChpZ2wpXG5zbS5hcHBlbmRDaGlsZChwbilcblxubWVudUltZy5jbGFzc0xpc3QuYWRkKCdtb2JpbGUnKVxubWVudS5hcHBlbmRDaGlsZCh4SW1nKVxuXG5leHBvcnQgY29uc3QgbGl2aW5ncm9vbXNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvbGl2aW5ncm9vbXMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IGFiZWRyb29tc0FyciA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXInLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IGtiZWRyb29tc0FyciA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3JlY2VwdGlvbnMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IHR2dW5pdHNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZGluaW5ncm9vbXMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuXG5leHBvcnQgY29uc3QgbGl2aW5ncm9vbXNBcnJPRyA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2xpdmluZ3Jvb21zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNBcnJPRyA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3RlcicsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3Qga2JlZHJvb21zQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9yZWNlcHRpb25zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCB0dnVuaXRzQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCBkaW5pbmdyb29tc0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZGluaW5ncm9vbXMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuXG5leHBvcnQgY29uc3QgbmF2QnRucyA9IFtcbiAgICBob21lQnRuLFxuICAgIGxpdmluZ3Jvb21zQnRuLFxuICAgIGFiZWRyb29tc0J0bixcbiAgICBrYmVkcm9vbXNCdG4sXG4gICAgcmVjZXB0aW9uc0J0bixcbiAgICB0dnVuaXRzQnRuLFxuICAgIGRpbmluZ3Jvb21zQnRuLFxuXVxuZXhwb3J0IGNvbnN0IG5hdlAgPSBbXG4gICAgaG9tZVAsXG4gICAgbGl2aW5ncm9vbXNQLFxuICAgIGFiZWRyb29tc1AsXG4gICAga2JlZHJvb21zUCxcbiAgICByZWNlcHRpb25zUCxcbiAgICB0dnVuaXRzUCxcbiAgICBkaW5pbmdyb29tc1AsXG5dXG5jb25zdCBuYXZBciA9IFtcbiAgICAn2KfZhNix2KbZitiz2YrYqScsXG4gICAgJ9i62LHZgSDYp9mE2YXYudmK2LTYqScsXG4gICAgJ9i62LHZgSDZhtmI2YUg2LHYptmK2LPZitipJyxcbiAgICAn2LrYsdmBINmG2YjZhSDYp9i32YHYp9mEJyxcbiAgICAn2LXYp9mE2YjZhtin2KonLFxuICAgICfZhdmD2KrYqNin2KonLFxuICAgICfYutix2YEg2LPZgdix2KknLFxuXVxuY29uc3QgbmF2RW4gPSBbXG4gICAgJ0hvbWUnLFxuICAgICdMaXZpbmcgUm9vbXMnLFxuICAgICdNYXN0ZXIgQmVkcm9vbXMnLFxuICAgICdLaWRzIEJlZHJvb21zJyxcbiAgICAnUmVjZXB0aW9ucycsXG4gICAgJ1RWIFVuaXRzJyxcbiAgICAnRGluaW5nIFJvb21zJyxcbl1cbmNvbnN0IG5hdkFyMiA9IFtcbiAgICAn2KfZhNix2KbZitiz2YrYqScsXG4gICAgJ9i62LHZgSDYp9mE2YXYudmK2LTYqScsXG4gICAgJ9i62LHZgSDZhtmI2YUg2LHYptmK2LPZitipJyxcbiAgICAn2LrYsdmBINmG2YjZhSDYp9i32YHYp9mEJyxcbiAgICAn2LXYp9mE2YjZhtin2KonLFxuICAgICfZhdmD2KrYqNin2KonLFxuICAgICfYutix2YEg2LPZgdix2KknLFxuXVxuY29uc3QgbmF2RW4yID0gW1xuICAgICdIb21lJyxcbiAgICAnTGl2aW5nIFJvb21zJyxcbiAgICAnTWFzdGVyIEJlZHJvb21zJyxcbiAgICAnS2lkcyBCZWRyb29tcycsXG4gICAgJ1JlY2VwdGlvbnMnLFxuICAgICdUViBVbml0cycsXG4gICAgJ0RpbmluZyBSb29tcycsXG5dXG5cbmNvbnN0IExpdmluZ1Jvb21zRGV0YWlscyA9IFtdXG5jb25zdCBLaWRzQmVkcm9vbXNEZXRhaWxzID0gW11cbmNvbnN0IE1hc3RlckJlZHJvb21zRGV0YWlscyA9IFtdXG5jb25zdCBEaW5pbmdSb29tc0RldGFpbHMgPSBbXVxuY29uc3QgUmVjZXB0aW9uc0RldGFpbHMgPSBbXVxuY29uc3QgVFZVbml0c0RldGFpbHMgPSBbXVxuXG5jb25zdCByZWNvbW1lbmRhdGlvbnNBcnJEZXRhaWxzID0gW11cbmNvbnN0IHJlY29tbWVuZGF0aW9uc0FyciA9IHt9XG5jb25zdCByZWNvbW1lbmRhdGlvbnNBcnJPRyA9IHt9XG5cbmxldCBzZWFyY2hBcnIgPSB7fVxubGV0IHNlYXJjaEFyck9HID0ge31cbmxldCBzZWFyY2hBcnJEZXRhaWxzID0gW11cblxubGV0IGNhcnRBcnJEZXRhaWxzID0gW11cbmxldCBjYXJ0QXJyID0ge31cbmxldCBjYXJ0QXJyT0cgPSB7fVxubGV0IGNhcnRJbmRleGVzID0gW11cblxubGV0IF9hZGRyZXNzID0ge1xuICAgIHVzZXJuYW1lOiAndScsXG4gICAgcGhvbmU6ICdwJyxcbiAgICBlbWFpbDogJ2UnLFxuICAgIGNpdHk6ICdjJyxcbiAgICBhcmVhOiAnYScsXG4gICAgc3RyZWV0OiAncycsXG4gICAgYnVpbGRpbmc6ICdiJyxcbiAgICBmbG9vcjogJ2YnLFxuICAgIGFwYXJ0bWVudDogJ2FwdCcsXG4gICAgbGFuZG1hcms6ICdsJyxcbiAgICBpbnN0cnVjdGlvbnM6ICdpJyxcbiAgICBleGlzdHM6IGZhbHNlLFxufVxuXG5sZXQgZjEgPSBTdG9yYWdlLmdldERldGFpbHMoKVxubGV0IGYyID0gU3RvcmFnZS5nZXRBcnIoKVxubGV0IGYzID0gU3RvcmFnZS5nZXRBcnJPZygpXG5sZXQgZjQgPSBTdG9yYWdlLmdldEluZGV4ZXMoKVxubGV0IGY1ID0gU3RvcmFnZS5nZXRBZGRyZXNzKClcblxuaWYgKGYxKSB7XG4gICAgY2FydEFyckRldGFpbHMgPSBKU09OLnBhcnNlKGYxKVxufVxuXG5pZiAoZjIpIHtcbiAgICBjYXJ0QXJyID0gSlNPTi5wYXJzZShmMilcbn1cblxuaWYgKGYzKSB7XG4gICAgY2FydEFyck9HID0gSlNPTi5wYXJzZShmMylcbn1cblxuaWYgKGY0KSB7XG4gICAgY2FydEluZGV4ZXMgPSBKU09OLnBhcnNlKGY0KVxufVxuXG5pZiAoZjUpIHtcbiAgICBfYWRkcmVzcyA9IEpTT04ucGFyc2UoZjUpXG59XG5cbmxldCByZXN1bHRzUXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgoYSwgYikgPT4ge1xuICAgIGlmIChhWzFdID4gYlsxXSkge1xuICAgICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgaWYgKGFbMV0gPCBiWzFdKSB7XG4gICAgICAgIHJldHVybiAxXG4gICAgfVxufSlcblxubGV0IGlpaSA9IDBcbmxldCB0cCA9IDBcbmxldCBmbGFnID0gJ3BhZ2UnXG5sZXQgbmZsYWcgPSB0cnVlXG5sZXQgY3Vyckl0ZW0gPSBbXVxuXG5wcm9kdWN0cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgc3dpdGNoIChwLnByb2R1Y3RfdHlwZSkge1xuICAgICAgICBjYXNlICdMaXZpbmdyb29tcyc6XG4gICAgICAgICAgICBMaXZpbmdSb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdLaWRzIEJlZHJvb21zJzpcbiAgICAgICAgICAgIEtpZHNCZWRyb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBrYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0ga2JlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ01hc3RlciBCZWRyb29tcyc6XG4gICAgICAgICAgICBNYXN0ZXJCZWRyb29tc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBhYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gYWJlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ0RpbmluZ3Jvb21zJzpcbiAgICAgICAgICAgIERpbmluZ1Jvb21zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IGRpbmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IGRpbmluZ3Jvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1JlY2VwdGlvbnMnOlxuICAgICAgICAgICAgUmVjZXB0aW9uc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSByZWNlcHRpb25zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IHJlY2VwdGlvbnNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnVFYgVW5pdHMnOlxuICAgICAgICAgICAgVFZVbml0c0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSB0dnVuaXRzQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0Fyck9HW2Ake2lpaX0uJHtleH1gXSA9IHR2dW5pdHNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgfVxufSlcblxuZ29Ib21lKClcbnN3aXRjaExhbmcoJ2VuJylcblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydEFsbChyKSB7XG4gICAgbGV0IGltYWdlcyA9IHt9XG4gICAgci5rZXlzKCkubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIGltYWdlc1tpdGVtLnJlcGxhY2UoJy4vJywgJycpXSA9IHIoaXRlbSlcbiAgICB9KVxuICAgIHJldHVybiBpbWFnZXNcbn1cblxuZnVuY3Rpb24gcG9wVXAobSwgaSkge1xuICAgIGxldCBwb3B1cCA9XG4gICAgICAgIG0gPT0gMVxuICAgICAgICAgICAgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbXlQb3B1cC0ke2l9YClcbiAgICAgICAgICAgIDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215UG9wdXAyJylcbiAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcbiAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgfSwgMTAwMClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Ym1pdEFkZHJlc3MoKSB7XG4gICAgbGV0IHVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItbmFtZScpXG4gICAgbGV0IHBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob25lLW51bScpXG4gICAgbGV0IGVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsLWFkZHJlc3MnKVxuICAgIGxldCBjaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHknKVxuICAgIGxldCBhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyZWEnKVxuICAgIGxldCBzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJlZXQnKVxuICAgIGxldCBidWlsZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGluZycpXG4gICAgbGV0IGZsb29yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yJylcbiAgICBsZXQgYXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwYXJ0bWVudCcpXG4gICAgbGV0IGxhbmRtYXJrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRtYXJrJylcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc3RydWN0aW9ucycpXG5cbiAgICBpZiAoXG4gICAgICAgIHVuLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgcG4ucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBlbWFpbC5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGNpdHkucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBhcmVhLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgc3QucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBidWlsZGluZy5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGZsb29yLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgYXB0LnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgbGFuZG1hcmsucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBpbnN0cnVjdGlvbnMucmVwb3J0VmFsaWRpdHkoKVxuICAgICkge1xuICAgICAgICBfYWRkcmVzcyA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1bi52YWx1ZSxcbiAgICAgICAgICAgIHBob25lOiBwbi52YWx1ZSxcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbC52YWx1ZSxcbiAgICAgICAgICAgIGNpdHk6IGNpdHkudmFsdWUsXG4gICAgICAgICAgICBhcmVhOiBhcmVhLnZhbHVlLFxuICAgICAgICAgICAgc3RyZWV0OiBzdC52YWx1ZSxcbiAgICAgICAgICAgIGJ1aWxkaW5nOiBidWlsZGluZy52YWx1ZSxcbiAgICAgICAgICAgIGZsb29yOiBmbG9vci52YWx1ZSxcbiAgICAgICAgICAgIGFwYXJ0bWVudDogYXB0LnZhbHVlLFxuICAgICAgICAgICAgbGFuZG1hcms6IGxhbmRtYXJrLnZhbHVlLFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zOiBpbnN0cnVjdGlvbnMudmFsdWUsXG4gICAgICAgICAgICBleGlzdHM6IHRydWUsXG4gICAgICAgIH1cblxuICAgICAgICB1bi52YWx1ZSA9ICcnXG4gICAgICAgIHBuLnZhbHVlID0gJydcbiAgICAgICAgZW1haWwudmFsdWUgPSAnJ1xuICAgICAgICBjaXR5LnZhbHVlID0gJydcbiAgICAgICAgYXJlYS52YWx1ZSA9ICcnXG4gICAgICAgIHN0LnZhbHVlID0gJydcbiAgICAgICAgYnVpbGRpbmcudmFsdWUgPSAnJ1xuICAgICAgICBmbG9vci52YWx1ZSA9ICcnXG4gICAgICAgIGFwdC52YWx1ZSA9ICcnXG4gICAgICAgIGxhbmRtYXJrLnZhbHVlID0gJydcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnZhbHVlID0gJydcblxuICAgICAgICBTdG9yYWdlLnNhdmVBZGRyZXNzKF9hZGRyZXNzKVxuICAgICAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgICAgICBjb25zdCBjb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcy1wb3B1cCcpXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cCcpXG4gICAgICAgIH1cbiAgICAgICAgY29uLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZTsnKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnemlvJykucmVtb3ZlKClcblxuICAgICAgICBwb3B1bGF0ZU9yZGVyKClcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBZGRyZXNzKCkge1xuICAgIGNvbnN0IHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQtYWRkcmVzcycpXG4gICAgY29uc3QgeDMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneDMnKVxuICAgIGxldCBhc3RycyA9IFtdXG4gICAgbGV0IHBzID0gW11cbiAgICBsZXQgYXN0ciA9ICcnXG4gICAgbGV0IHAgPSAnJ1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgMTE7IGwrKykge1xuICAgICAgICBpZiAobCA8IDgpIHtcbiAgICAgICAgICAgIGFzdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdXAnKVxuICAgICAgICAgICAgYXN0ci50ZXh0Q29udGVudCA9ICcqJ1xuICAgICAgICAgICAgYXN0ci5jbGFzc0xpc3QuYWRkKCdhc3RyJylcbiAgICAgICAgICAgIGFzdHJzLnB1c2goYXN0cilcbiAgICAgICAgfVxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIHBzLnB1c2gocClcbiAgICB9XG5cbiAgICBjb25zdCB6b29tZWRDb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB6b29tZWRDb250LmlkID0gJ3ppbydcbiAgICB6b29tZWRDb250LmNsYXNzTGlzdC5hZGQoJ3pvb21lZC1jb250YWluZXInKVxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIHBzWzBdLnRleHRDb250ZW50ID0gJ05hbWUnXG4gICAgICAgIHBzWzFdLnRleHRDb250ZW50ID0gJ1Bob25lIE51bWJlcidcbiAgICAgICAgcHNbMl0udGV4dENvbnRlbnQgPSAnRW1haWwnXG4gICAgICAgIHBzWzNdLnRleHRDb250ZW50ID0gJ0NpdHknXG4gICAgICAgIHBzWzRdLnRleHRDb250ZW50ID0gJ0FyZWEnXG4gICAgICAgIHBzWzVdLnRleHRDb250ZW50ID0gJ1N0cmVldCBOYW1lIC8gTnVtYmVyJ1xuICAgICAgICBwc1s2XS50ZXh0Q29udGVudCA9ICdCdWlsZGluZyAvIFZpbGxhJ1xuICAgICAgICBwc1s3XS50ZXh0Q29udGVudCA9ICdGbG9vcidcbiAgICAgICAgcHNbOF0udGV4dENvbnRlbnQgPSBgQXBhcnRtZW50YFxuICAgICAgICBwc1s5XS50ZXh0Q29udGVudCA9ICdMYW5kbWFyaydcbiAgICAgICAgcHNbMTBdLnRleHRDb250ZW50ID0gJ0luc3RydWN0aW9ucydcbiAgICB9IGVsc2Uge1xuICAgICAgICBwc1swXS50ZXh0Q29udGVudCA9ICfYp9mE2KfYs9mFJ1xuICAgICAgICBwc1sxXS50ZXh0Q29udGVudCA9ICfYsdmC2YUg2KfZhNmH2KfYqtmBJ1xuICAgICAgICBwc1syXS50ZXh0Q29udGVudCA9ICfYp9mE2KjYsdmK2K8g2KfZhNin2YTZg9iq2LHZiNmG2YonXG4gICAgICAgIHBzWzNdLnRleHRDb250ZW50ID0gJ9in2YTZhdit2KfZgdi42KknXG4gICAgICAgIHBzWzRdLnRleHRDb250ZW50ID0gJ9in2YTZhdmG2LfZgtipJ1xuICAgICAgICBwc1s1XS50ZXh0Q29udGVudCA9ICfYp9iz2YUgLyDYsdmC2YUg2KfZhNi02KfYsdi5J1xuICAgICAgICBwc1s2XS50ZXh0Q29udGVudCA9ICfYsdmC2YUg2KfZhNi52YXYp9ix2KkgLyDYp9mE2qTZitmE2KcnXG4gICAgICAgIHBzWzddLnRleHRDb250ZW50ID0gJ9in2YTYt9in2KjZgidcbiAgICAgICAgcHNbOF0udGV4dENvbnRlbnQgPSAn2KfZhNi02YLYqSdcbiAgICAgICAgcHNbOV0udGV4dENvbnRlbnQgPSAn2LnZhNin2YXYqSDZhdmF2YrYstipJ1xuICAgICAgICBwc1sxMF0udGV4dENvbnRlbnQgPSAn2KrYudmE2YrZhdin2Kog2KfYrtix2YonXG4gICAgfVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuLWxhYmVsJykuYXBwZW5kKGFzdHJzWzBdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bi1sYWJlbCcpLmFwcGVuZChwc1swXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4tbGFiZWwnKS5hcHBlbmQoYXN0cnNbMV0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuLWxhYmVsJykuYXBwZW5kKHBzWzFdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbC1sYWJlbCcpLmFwcGVuZChhc3Ryc1syXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwtbGFiZWwnKS5hcHBlbmQocHNbMl0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbGFiZWwnKS5hcHBlbmQoYXN0cnNbM10pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbGFiZWwnKS5hcHBlbmQocHNbM10pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyZWEtbGFiZWwnKS5hcHBlbmQoYXN0cnNbNF0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyZWEtbGFiZWwnKS5hcHBlbmQocHNbNF0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0LWxhYmVsJykuYXBwZW5kKGFzdHJzWzVdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdC1sYWJlbCcpLmFwcGVuZChwc1s1XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRpbmctbGFiZWwnKS5hcHBlbmQoYXN0cnNbNl0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkaW5nLWxhYmVsJykuYXBwZW5kKHBzWzZdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG9vci1sYWJlbCcpLmFwcGVuZChhc3Ryc1s3XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3ItbGFiZWwnKS5hcHBlbmQocHNbN10pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwdC1sYWJlbCcpLmFwcGVuZChwc1s4XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZG1hcmstbGFiZWwnKS5hcHBlbmQocHNbOV0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc3RydWN0aW9ucy1sYWJlbCcpLmFwcGVuZChwc1sxMF0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHpvb21lZENvbnQpXG4gICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICBmb3IgKGxldCBrID0gMDsgayA8IGJsdXJyZWQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QuYWRkKCdwb3B1cCcpXG4gICAgfVxuICAgIGFkZHJlc3NQb3AuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAnKVxuICAgIHgzLnNyYyA9IHhDbG9zZVxuICAgIHgzLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDIwcHg7aGVpZ2h0OiAyMHB4OycpXG4gICAgeDMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsdXJyZWQgPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuXG4gICAgICAgIGNvbnN0IGNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRyZXNzLXBvcHVwJylcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBibHVycmVkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBibHVycmVkW2tdLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwJylcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bi1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bi1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbi1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbi1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbC1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbC1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJlYS1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcmVhLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0LWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0LWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkaW5nLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkaW5nLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwdC1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kbWFyay1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN0cnVjdGlvbnMtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuXG4gICAgICAgIGNvbi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7JylcbiAgICAgICAgem9vbWVkQ29udC5yZW1vdmUoKVxuICAgIH0pXG5cbiAgICBhZGRyZXNzUG9wLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogZmxleDsnKVxuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBzdWJtaXRBZGRyZXNzKClcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvZHVjdElESW5kZXgobSkge1xuICAgIGxldCByZXMgPSBbXVxuICAgIGlmIChtID09IDEpIHtcbiAgICAgICAgY2FydEluZGV4ZXMuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gcHJvZHVjdC5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9kdWN0LnBfaWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKG0gPT0gMikge1xuICAgICAgICBjYXJ0SW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgICAgICAgcHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBwcm9kdWN0LmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb2R1Y3QucHJvZHVjdF90aXRsZV9lbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlVG9EQihvcmRlcikge1xuICAgIGRiLk9yZGVycy5wdXNoKG9yZGVyKVxuICAgIGxldCBvYmogPSB7XG4gICAgICAgIGRiOiBkYixcbiAgICAgICAgY3Vycjogb3JkZXIsXG4gICAgfVxuICAgIGxldCBvYmpTdHIgPSBhd2FpdCBKU09OLnN0cmluZ2lmeShvYmopXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vc3BsYXNoLTdlMXkub25yZW5kZXIuY29tLycsIHtcbiAgICAgICAgbWV0aG9kOiBgUE9TVGAsXG4gICAgICAgIC8vIG1vZGU6ICduby1jb3JzJyxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIGJvZHk6IG9ialN0cixcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmJvZHlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50KGFycikge1xuICAgIGxldCBvYmogPSB7fVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9ialthcnJbaV1dID0gMVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGkgIT0gaiAmJiBhcnJbaV0gPT0gYXJyW2pdKSB7XG4gICAgICAgICAgICAgICAgb2JqW2FycltpXV0rK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmpcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyUGxhY2VkKGlkKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJylcbiAgICBjb25zdCBzdWNjZXNzMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0JylcbiAgICBjb25zdCBvcmRlck51bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cbiAgICBtYWluLmlkID0gJ3N1Y2Nlc3MtbWVzc2FnZSdcblxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKClcbiAgICBsZXQgZGF0ZSA9XG4gICAgICAgIHRvZGF5LmdldERhdGUoKSArXG4gICAgICAgICcvJyArXG4gICAgICAgICh0b2RheS5nZXRNb250aCgpICsgMSkgK1xuICAgICAgICAnLycgK1xuICAgICAgICB0b2RheS5nZXRGdWxsWWVhcigpXG4gICAgbGV0IHRpbWUgPVxuICAgICAgICB0b2RheS5nZXRIb3VycygpICsgJzonICsgdG9kYXkuZ2V0TWludXRlcygpICsgJzonICsgdG9kYXkuZ2V0U2Vjb25kcygpXG4gICAgbGV0IGRhdGVUaW1lID1cbiAgICAgICAgZGF0ZSArXG4gICAgICAgICcgJyArXG4gICAgICAgIHRpbWUgK1xuICAgICAgICAnICcgK1xuICAgICAgICBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmVcblxuICAgIGxldCBncGlpID0gZ2V0UHJvZHVjdElESW5kZXgoMilcbiAgICBsZXQgb2JqID0gZ2V0Q291bnQoZ3BpaSlcbiAgICBsZXQgb3QgPSAnJ1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgb3QgKz0gYCR7b2JqW2tleV19eCAnJHtrZXl9JyAtIGBcbiAgICB9KVxuICAgIG90ID0gb3Quc2xpY2UoMCwgLTMpXG5cbiAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgIG9yZGVyX2lkOiBpZCxcbiAgICAgICAgb3JkZXJfYWRkcmVzczogX2FkZHJlc3MsXG4gICAgICAgIG9yZGVyX3N1YnRvdGFsOiB0cCxcbiAgICAgICAgb3JkZXJfZGF0ZXRpbWU6IGRhdGVUaW1lLFxuICAgICAgICBvcmRlcl9pdGVtczogb3QsXG4gICAgICAgIG9yZGVyX2l0ZW1zX2lkczogZ2V0UHJvZHVjdElESW5kZXgoMSkuam9pbignIC0gJyksXG4gICAgfVxuXG4gICAgbGV0IHdhaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpXG4gICAgd2FpdC50ZXh0Q29udGVudCA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpXG4gICAgICAgID8gJ1BsZWFzZSBXYWl0Li4nXG4gICAgICAgIDogJ9in2YTYsdis2KfYoSDYp9mE2KfZhtiq2LjYp9ixLi4nXG4gICAgbWFpbi5hcHBlbmQod2FpdClcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG5cbiAgICBzYXZlVG9EQihvcmRlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzcy50ZXh0Q29udGVudCA9ICdPcmRlciBQbGFjZWQgU3VjY2Vzc2Z1bGx5ISdcbiAgICAgICAgICAgICAgICBzdWNjZXNzMi50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgICdQbGVhc2UgY2hlY2sgeW91ciBtYWlsIGZvciBjb25maXJtYXRpb24uJ1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtLnRleHRDb250ZW50ID0gYE9yZGVyIElEOiAke2lkfWBcbiAgICAgICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSAnQ29udGludWUgU2hvcHBpbmcnXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MudGV4dENvbnRlbnQgPSAn2KrZhSDYqtmC2K/ZitmFINin2YTYt9mE2Kgg2KjZhtis2KfYrSEnXG4gICAgICAgICAgICAgICAgc3VjY2VzczIudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAn2YrYsdis2Ykg2KfZhNiq2K3ZgtmCINmF2YYg2KjYsdmK2K/ZgyDYp9mE2KXZhNmD2KrYsdmI2YbZiiDZhNmE2KrYo9mD2YrYry4nXG4gICAgICAgICAgICAgICAgb3JkZXJOdW0udGV4dENvbnRlbnQgPSBg2LHZgtmFINin2YTYt9mE2Kg6ICR7aWR9YFxuICAgICAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9ICfZhdmI2KfYtdmE2Kkg2KfZhNiq2LPZiNmCJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FydEFyckRldGFpbHMgPSBbXVxuICAgICAgICAgICAgY2FydEFyciA9IHt9XG4gICAgICAgICAgICBjYXJ0QXJyT0cgPSB7fVxuICAgICAgICAgICAgY2FydEluZGV4ZXMgPSBbXVxuICAgICAgICAgICAgdHAgPSAwXG4gICAgICAgICAgICBTdG9yYWdlLnNhdmVDYXJ0KGNhcnRBcnJEZXRhaWxzLCBjYXJ0QXJyLCBjYXJ0QXJyT0csIGNhcnRJbmRleGVzKVxuXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ29Ib21lKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBtYWluLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKHN1Y2Nlc3MpXG4gICAgICAgICAgICBtYWluLmFwcGVuZChzdWNjZXNzMilcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKG9yZGVyTnVtKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQoYnRuKVxuXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzLnRleHRDb250ZW50ID0gJ09vcHMgU29tZXRoaW5nIFdlbnQgV3JvbmcuJ1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MyLnRleHRDb250ZW50ID0gJ1BsZWFzZSB0cnkgYWdhaW4gb3IgY29udGFjdCB1cy4nXG4gICAgICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gJ1RyeSBBZ2FpbidcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzcy50ZXh0Q29udGVudCA9ICfZhNmC2K8g2K3Yr9irINiu2LfYoyDZhdinLidcbiAgICAgICAgICAgICAgICBzdWNjZXNzMi50ZXh0Q29udGVudCA9ICfZitix2KzZiSDYp9mE2YXYrdin2YjZhNipINmF2LHYqSDYo9iu2LHZiSDYo9mIINin2YTYp9iq2LXYp9mEINio2YbYpy4nXG4gICAgICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gJ9in2LnYp9iv2Kkg2KfZhNmF2K3Yp9mI2YTYqSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBvcmRlclBsYWNlZChpZClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIG1haW4uaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgbWFpbi5hcHBlbmQoc3VjY2VzcylcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKHN1Y2Nlc3MyKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQoYnRuKVxuXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgICAgIH0pXG5cbiAgICBmbGFnID0gJ3BhZ2UnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZU9yZGVyKCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgY29uc3QgYWRkcmVzc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgYWRkcmVzc0RORSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGFkZHJlc3NQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgaW5zdFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBsYW5kbWFya1AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBhZGRDaGFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgY29uc3QgcHJpY2VDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHN1YnRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3Qgc2hpcHBpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblxuICAgIGNvbnN0IHBsYWNlT3JkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgbWFpbi5pZCA9ICdvcmRlci1tYWluJ1xuICAgIGFkZHJlc3NDb250YWluZXIuaWQgPSAnb3JkZXItYWRkcmVzcy1jb250J1xuICAgIHByaWNlQ29udGFpbmVyLmlkID0gJ29yZGVyLXByaWNlLWNvbnQnXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgaWYgKF9hZGRyZXNzLmV4aXN0cykge1xuICAgICAgICAgICAgYWRkQ2hhbmdlLnRleHRDb250ZW50ID0gJ0NoYW5nZSdcbiAgICAgICAgICAgIGxldCBhZGRBcnIgPSBPYmplY3QudmFsdWVzKF9hZGRyZXNzKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgaWYgKCFfYWRkcmVzcy5hcGFydG1lbnQpIHtcbiAgICAgICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9hZGRyZXNzLmxhbmRtYXJrKSB7XG4gICAgICAgICAgICAgICAgbGFuZG1hcmtQLnRleHRDb250ZW50ID0gYExhbmRtYXJrOiAke19hZGRyZXNzLmxhbmRtYXJrfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpbnN0UC50ZXh0Q29udGVudCA9IGBJbnN0cnVjdGlvbnM6ICR7X2FkZHJlc3MuaW5zdHJ1Y3Rpb25zfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZHJlc3NQLnRleHRDb250ZW50ID0gYWRkQXJyLmpvaW4oJyAtICcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGRDaGFuZ2UudGV4dENvbnRlbnQgPSAnQWRkJ1xuICAgICAgICAgICAgYWRkcmVzc0RORS50ZXh0Q29udGVudCA9ICdObyBBZGRyZXNzIEZvdW5kLidcbiAgICAgICAgfVxuICAgICAgICBzdWJ0b3RhbC50ZXh0Q29udGVudCA9IGBTdWJ0b3RhbDogJHt0cH0gRUdQYFxuICAgICAgICBzaGlwcGluZy50ZXh0Q29udGVudCA9ICdwbHVzIHNoaXBwaW5nIGZlZS4nXG4gICAgICAgIHBsYWNlT3JkZXIudGV4dENvbnRlbnQgPSAnUGxhY2UgT3JkZXInXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF9hZGRyZXNzLmV4aXN0cykge1xuICAgICAgICAgICAgYWRkQ2hhbmdlLnRleHRDb250ZW50ID0gJ9iq2LrZitmK2LEnXG4gICAgICAgICAgICBsZXQgYWRkQXJyID0gT2JqZWN0LnZhbHVlcyhfYWRkcmVzcylcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGlmICghX2FkZHJlc3MuYXBhcnRtZW50KSB7XG4gICAgICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5sYW5kbWFyaykge1xuICAgICAgICAgICAgICAgIGxhbmRtYXJrUC50ZXh0Q29udGVudCA9IGDYudmE2KfZhdipINmF2YXZitiy2Kk6ICR7X2FkZHJlc3MubGFuZG1hcmt9YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9hZGRyZXNzLmluc3RydWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGluc3RQLnRleHRDb250ZW50ID0gYNiq2LnZhNmK2YXYp9iqINin2K7YsdmKOiAke19hZGRyZXNzLmluc3RydWN0aW9uc31gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRyZXNzUC50ZXh0Q29udGVudCA9IGFkZEFyci5qb2luKCcgLSAnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkQ2hhbmdlLnRleHRDb250ZW50ID0gJ9in2LbYp9mB2KknXG4gICAgICAgICAgICBhZGRyZXNzRE5FLnRleHRDb250ZW50ID0gJ9mE2YUg2YrYqtmFINin2YTYudir2YjYsSDYudmE2Ykg2LnZhtmI2KfZhi4nXG4gICAgICAgIH1cbiAgICAgICAgc3VidG90YWwudGV4dENvbnRlbnQgPSBg2KfZhNin2KzZhdin2YTZijogJHt0cH0g2Kwu2YVgXG4gICAgICAgIHNoaXBwaW5nLnRleHRDb250ZW50ID0gJ9iy2KfYptivINmF2LXYp9ix2YrZgSDYp9mE2LTYrdmGLidcbiAgICAgICAgcGxhY2VPcmRlci50ZXh0Q29udGVudCA9IGDYp9iq2YXYp9mFINi52YXZhNmK2Kkg2KfZhNi02LHYp9ihYFxuICAgIH1cblxuICAgIGlmICghX2FkZHJlc3MuZXhpc3RzKSB7XG4gICAgICAgIHBsYWNlT3JkZXIuZGlzYWJsZWQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2VPcmRlci5kaXNhYmxlZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgYWRkQ2hhbmdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBhZGRBZGRyZXNzKClcbiAgICB9KVxuXG4gICAgcGxhY2VPcmRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgb3JkZXJQbGFjZWQobmFub2lkKDIxKSlcbiAgICB9KVxuXG4gICAgaWYgKF9hZGRyZXNzLmV4aXN0cykge1xuICAgICAgICBhZGRyZXNzQ29udGFpbmVyLmFwcGVuZChhZGRyZXNzUClcbiAgICAgICAgYWRkcmVzc0NvbnRhaW5lci5hcHBlbmQobGFuZG1hcmtQKVxuICAgICAgICBhZGRyZXNzQ29udGFpbmVyLmFwcGVuZChpbnN0UClcbiAgICB9IGVsc2Uge1xuICAgICAgICBhZGRyZXNzQ29udGFpbmVyLmFwcGVuZChhZGRyZXNzRE5FKVxuICAgIH1cblxuICAgIHNoaXBwaW5nLmlkID0gJ2dyYXktdGV4dCdcblxuICAgIGFkZHJlc3NDb250YWluZXIuYXBwZW5kKGFkZENoYW5nZSlcbiAgICBwcmljZUNvbnRhaW5lci5hcHBlbmQoc3VidG90YWwpXG4gICAgcHJpY2VDb250YWluZXIuYXBwZW5kKHNoaXBwaW5nKVxuICAgIG1haW4uYXBwZW5kKGFkZHJlc3NDb250YWluZXIpXG4gICAgbWFpbi5hcHBlbmQocHJpY2VDb250YWluZXIpXG4gICAgbWFpbi5hcHBlbmQocGxhY2VPcmRlcilcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgZmxhZyA9ICdvcmRlcidcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQ2FydChwcm9kdWN0X2luZGV4LCBpKSB7XG4gICAgY2FydEluZGV4ZXMucHVzaChwcm9kdWN0X2luZGV4KVxuICAgIHBvcFVwKDEsIGkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVZpZXdDYXJ0KCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNhcnRBcnJEZXRhaWxzID0gW11cbiAgICBjYXJ0QXJyID0ge31cbiAgICBjYXJ0QXJyT0cgPSB7fVxuICAgIGxldCBhID0gJydcbiAgICBsZXQgaW5keDIgPSAtMVxuICAgIGxldCBpaWlpID0gMFxuICAgIG1haW4uaWQgPSAnY2FydC1tYWluJ1xuICAgIGNhcnRJbmRleGVzLmZvckVhY2goKGNhcnRJbmRleCkgPT4ge1xuICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FydEluZGV4ID09IHAuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHAucHJvZHVjdF90eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0xpdmluZ3Jvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gbGl2aW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBsaXZpbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdLaWRzIEJlZHJvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0ga2JlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0ga2JlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ01hc3RlciBCZWRyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IGFiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IGFiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdEaW5pbmdyb29tcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IGRpbmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gZGluaW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUmVjZXB0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFycltgJHtpaWlpfS5qcGdgXSA9IHJlY2VwdGlvbnNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSByZWNlcHRpb25zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1RWIFVuaXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gdHZ1bml0c0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IHR2dW5pdHNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhcnRBcnJEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgaWYgKGNhcnRBcnJEZXRhaWxzLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgICAgIGVtcHR5LmlkID0gJ2NhcnQtZW1wdHknXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSAnU2hvcHBpbmcgQ2FydCBpcyBFbXB0eS4nXG4gICAgICAgICAgICBhZGQudGV4dENvbnRlbnQgPSAnQWRkIEl0ZW1zJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSAn2LnYsdio2Kkg2KfZhNiq2LPZiNmCINmB2KfYsdi62KkuJ1xuICAgICAgICAgICAgYWRkLnRleHRDb250ZW50ID0gJ9ij2LbZgSDZhdmG2KrYrNin2KonXG4gICAgICAgIH1cbiAgICAgICAgYWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgZ29Ib21lKClcbiAgICAgICAgfSlcbiAgICAgICAgbWFpbi5jbGFzc0xpc3QuYWRkKCdlbXB0eS1jYXJ0LW1haW4nKVxuICAgICAgICBtYWluLmFwcGVuZChlbXB0eSlcbiAgICAgICAgbWFpbi5hcHBlbmQoYWRkKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5vdGlmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3QgbWlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3QgY2FydGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IHByaWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IG5vdGlmUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBjb25zdCB0b3RhbHByaWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IHBsYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcblxuICAgICAgICB0cCA9IDBcblxuICAgICAgICBub3RpZi5pZCA9ICdub3RpZidcblxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ1Byb2R1Y3QnXG4gICAgICAgICAgICBwcmljZS50ZXh0Q29udGVudCA9ICdQcmljZSdcbiAgICAgICAgICAgIG5vdGlmUC50ZXh0Q29udGVudCA9ICdJdGVtIFJlbW92ZWQgZnJvbSBDYXJ0ISdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9in2YTZhdmG2KrYrCdcbiAgICAgICAgICAgIHByaWNlLnRleHRDb250ZW50ID0gJ9in2YTYs9i52LEnXG4gICAgICAgICAgICBub3RpZlAudGV4dENvbnRlbnQgPSAnINiq2YXYqiDYp9mE2KXYstin2YTYqSDZhdmGINi52LHYqNipINin2YTYqtiz2YjZgiEnXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGNhcnRBcnIpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBsZXQgcHJvZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICAgICAgbGV0IHRpdGxlaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICAgICAgbGV0IHByaWNlaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICAgICAgbGV0IGhsYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICAgICAgICAgIGxldCByZW1vdmVJbWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgbGV0IHJlbW92ZUltZyA9IG5ldyBJbWFnZSgpXG5cbiAgICAgICAgICAgIHJlbW92ZUltZy5zcmMgPSByZW1vdmVJY25cbiAgICAgICAgICAgIHJlbW92ZUltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAyMnB4O2hlaWdodDogMjJweDsnKVxuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgICAgICB0aXRsZWkudGV4dENvbnRlbnQgPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wX2lkXG4gICAgICAgICAgICAgICAgfSwgJHtwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfdGl0bGVfZW59YFxuICAgICAgICAgICAgICAgIHByaWNlaS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9wcmljZV9lblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aXRsZWkudGV4dENvbnRlbnQgPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wX2lkXG4gICAgICAgICAgICAgICAgfdiMICR7cHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wcm9kdWN0X3RpdGxlX2FyfWBcbiAgICAgICAgICAgICAgICBwcmljZWkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2VfYXJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGxjLmNsYXNzTGlzdC5hZGQoJ2hsYycpXG4gICAgICAgICAgICBwcmljZWkuY2xhc3NMaXN0LmFkZCgncXAnKVxuXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIGltZy5zcmMgPSBjYXJ0QXJyT0dbYCR7aX0uanBnYF1cbiAgICAgICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdjYXJ0LWl0ZW0taW1nJylcbiAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZUl0ZW0oOCwgaSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlbW92ZUltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYXJ0QXJyRGV0YWlscy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBkZWxldGUgY2FydEFycltgJHtpfS5qcGdgXVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0QXJyT0dbYCR7aX0uanBnYF1cbiAgICAgICAgICAgICAgICBjYXJ0SW5kZXhlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBuZmxhZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcG9wdWxhdGVWaWV3Q2FydCgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0ZW1wLmNsYXNzTGlzdC5hZGQoJ2NhcnQtaXRlbScpXG5cbiAgICAgICAgICAgIHJlbW92ZUltZ0Rpdi5hcHBlbmQocmVtb3ZlSW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQoaW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQodGl0bGVpKVxuICAgICAgICAgICAgdGVtcC5hcHBlbmQocHJvZClcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHByaWNlaSlcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHJlbW92ZUltZ0RpdilcbiAgICAgICAgICAgIG1pZC5hcHBlbmQodGVtcClcbiAgICAgICAgICAgIG1pZC5hcHBlbmQoaGxjKVxuXG4gICAgICAgICAgICB0cCArPSBwYXJzZUludChwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2UpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhsYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICAgICAgaGxjLmNsYXNzTGlzdC5hZGQoJ2hsYycpXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICB0b3RhbHByaWNlLnRleHRDb250ZW50ID0gYFRvdGFsIFByaWNlOiAke3RwfWBcbiAgICAgICAgICAgIHBsYWNlLnRleHRDb250ZW50ID0gYENvbnRpbnVlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG90YWxwcmljZS50ZXh0Q29udGVudCA9IGDYp9is2YXYp9mE2Yog2KfZhNiz2LnYsTogJHt0cH1gXG4gICAgICAgICAgICBwbGFjZS50ZXh0Q29udGVudCA9IGDYp9mE2KfYs9iq2YXYsdin2LFgXG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHBvcHVsYXRlT3JkZXIoKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdCcpXG4gICAgICAgIHByaWNlLmNsYXNzTGlzdC5hZGQoJ3FwaCcpXG5cbiAgICAgICAgaGVhZGVyLmFwcGVuZCh0aXRsZSlcbiAgICAgICAgaGVhZGVyLmFwcGVuZChwcmljZSlcblxuICAgICAgICBoZWFkZXIuaWQgPSAnY2FydC1oZWFkZXInXG4gICAgICAgIG1pZC5pZCA9ICdjYXJ0LW1pZCdcbiAgICAgICAgdG90YWxwcmljZS5pZCA9ICdjYXJ0LXRvdGFsLXByaWNlJ1xuICAgICAgICBjYXJ0Zm9vdGVyLmlkID0gJ2NhcnQtZm9vdGVyJ1xuXG4gICAgICAgIGNhcnRmb290ZXIuYXBwZW5kKHRvdGFscHJpY2UpXG4gICAgICAgIGNhcnRmb290ZXIuYXBwZW5kKHBsYWNlKVxuXG4gICAgICAgIGlmICghbmZsYWcpIHtcbiAgICAgICAgICAgIG5vdGlmLmFwcGVuZChub3RpZlApXG4gICAgICAgICAgICBtYWluLmFwcGVuZChub3RpZilcbiAgICAgICAgICAgIG5mbGFnID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbWFpbi5hcHBlbmQoaGVhZGVyKVxuICAgICAgICBtYWluLmFwcGVuZChobGMpXG4gICAgICAgIG1haW4uYXBwZW5kKG1pZClcbiAgICAgICAgbWFpbi5hcHBlbmQoY2FydGZvb3RlcilcbiAgICB9XG5cbiAgICBTdG9yYWdlLnNhdmVDYXJ0KGNhcnRBcnJEZXRhaWxzLCBjYXJ0QXJyLCBjYXJ0QXJyT0csIGNhcnRJbmRleGVzKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQobWFpbilcbiAgICBmbGFnID0gJ2NhcnQnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93UmVzdWx0c0NvdW50KG0sIGEpIHtcbiAgICBsZXQgcmVzdWx0c0ZvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgIHJlc3VsdHNGb3VuZC5pZCA9ICdyZXN1bHRzLWZvdW5kJ1xuICAgIGxldCBncm0gPSAnJ1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZ3JtID0gJyB3YXMnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm0gPSAncyB3ZXJlJ1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNGb3VuZC50ZXh0Q29udGVudCA9IGAke1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYSkubGVuZ3RoXG4gICAgICAgIH0gUHJvZHVjdCR7Z3JtfSBmb3VuZC5gXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGEpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBncm0gPSAn2YXZhtiq2KwnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm0gPSAn2YXZhtiq2KzYp9iqJ1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNGb3VuZC50ZXh0Q29udGVudCA9IGDYqtmFINin2YTYudir2YjYsSDYudmE2YkgJHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLmxlbmd0aFxuICAgICAgICB9ICR7Z3JtfS5gXG4gICAgfVxuICAgIG0uYXBwZW5kKHJlc3VsdHNGb3VuZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVkaXREaXN0YW5jZShzMSwgczIpIHtcbiAgICBzMSA9IHMxLnRvTG93ZXJDYXNlKClcbiAgICBzMiA9IHMyLnRvTG93ZXJDYXNlKClcblxuICAgIHZhciBjb3N0cyA9IG5ldyBBcnJheSgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gczEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IGlcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gczIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChpID09IDApIGNvc3RzW2pdID0galxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGNvc3RzW2ogLSAxXVxuICAgICAgICAgICAgICAgICAgICBpZiAoczEuY2hhckF0KGkgLSAxKSAhPSBzMi5jaGFyQXQoaiAtIDEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWluKE1hdGgubWluKG5ld1ZhbHVlLCBsYXN0VmFsdWUpLCBjb3N0c1tqXSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgY29zdHNbaiAtIDFdID0gbGFzdFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpID4gMCkgY29zdHNbczIubGVuZ3RoXSA9IGxhc3RWYWx1ZVxuICAgIH1cbiAgICByZXR1cm4gY29zdHNbczIubGVuZ3RoXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2ltaWxhcml0eShzMSwgczIpIHtcbiAgICB2YXIgbG9uZ2VyID0gczFcbiAgICB2YXIgc2hvcnRlciA9IHMyXG4gICAgaWYgKHMxLmxlbmd0aCA8IHMyLmxlbmd0aCkge1xuICAgICAgICBsb25nZXIgPSBzMlxuICAgICAgICBzaG9ydGVyID0gczFcbiAgICB9XG4gICAgdmFyIGxvbmdlckxlbmd0aCA9IGxvbmdlci5sZW5ndGhcbiAgICBpZiAobG9uZ2VyTGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIDEuMFxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgICAobG9uZ2VyTGVuZ3RoIC0gZWRpdERpc3RhbmNlKGxvbmdlciwgc2hvcnRlcikpIC9cbiAgICAgICAgcGFyc2VGbG9hdChsb25nZXJMZW5ndGgpXG4gICAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoUmVzdWx0cyh0YXJnZXQpIHtcbiAgICBtaWRkbGVDb250YWluZXIuZm9jdXMoKVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgcmVzdWx0c1F1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGFbMV0gPiBiWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgfVxuICAgICAgICBpZiAoYVsxXSA8IGJbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnRvVXBwZXJDYXNlKClcbiAgICBsZXQgYnJlYWtrID0gZmFsc2VcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoL1tBLVphLXpdXFxkXFxkKFxcZCk/KFxcZCk/LylcbiAgICBpZiAocmUudGVzdCh0YXJnZXQpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0c1tpXVxuICAgICAgICAgICAgaWYgKHByb2R1Y3QucF9pZCA9PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzUXVldWUuZW5xdWV1ZShbaSwgMSwgcHJvZHVjdC5wcm9kdWN0X3R5cGVdKVxuICAgICAgICAgICAgICAgIGJyZWFrayA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWJyZWFraykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcG9vbCA9IFtdXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHNbaV1cbiAgICAgICAgICAgIHBvb2wucHVzaChcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnByb2R1Y3RfZGVzY3JpcHRpb25fYXIsXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X2Rlc2NyaXB0aW9uX2VuLFxuICAgICAgICAgICAgICAgIHByb2R1Y3QucHJvZHVjdF90aXRsZV9hcixcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnByb2R1Y3RfdGl0bGVfZW4sXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X3R5cGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHBvb2wuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWwubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGVsLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNpbSA9IHNpbWlsYXJpdHkoZWwsIHRhcmdldClcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltID4gMC42NSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHRhcmdldC5sZW5ndGggPiAxICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsLmluY2x1ZGVzKHRhcmdldCkgfHwgdGFyZ2V0LmluY2x1ZGVzKGVsKSkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhZGRlZC5pbmNsdWRlcyhwcm9kdWN0LnBfaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1F1ZXVlLmVucXVldWUoW2ksIHNpbSwgcHJvZHVjdC5wcm9kdWN0X3R5cGVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkLnB1c2gocHJvZHVjdC5wX2lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBzcmNoLnZhbHVlID0gJydcbiAgICBwb3B1bGF0ZVNlYXJjaFJlc3VsdHMoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVTZWFyY2hSZXN1bHRzKCkge1xuICAgIGxldCByID0gY2xvbmVEZWVwKHJlc3VsdHNRdWV1ZSlcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICBzZWFyY2hBcnIgPSB7fVxuICAgIGxldCBscyA9IFtdXG4gICAgbGV0IGluZHh4ID0gMFxuICAgIHdoaWxlICghci5pc0VtcHR5KCkpIHtcbiAgICAgICAgbGV0IGwgPSByLmRlcXVldWUoKVxuICAgICAgICBscy5wdXNoKGwpXG4gICAgfVxuXG4gICAgbHMuZm9yRWFjaCgobCkgPT4ge1xuICAgICAgICBsZXQgcCA9IHByb2R1Y3RzW2xbMF1dXG4gICAgICAgIGlmIChsWzJdID09ICdMaXZpbmdyb29tcycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGxpdmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSBsaXZpbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9IGVsc2UgaWYgKGxbMl0gPT0gJ0tpZHMgQmVkcm9vbXMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBrYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICBzZWFyY2hBcnJPR1tgJHtpbmR4eH0uJHtleH1gXSA9IGtiZWRyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9IGVsc2UgaWYgKGxbMl0gPT0gJ01hc3RlciBCZWRyb29tcycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGFiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gYWJlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH0gZWxzZSBpZiAobFsyXSA9PSAnRGluaW5ncm9vbXMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSBkaW5pbmdyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfSBlbHNlIGlmIChsWzJdID09ICdSZWNlcHRpb25zJykge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gcmVjZXB0aW9uc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gcmVjZXB0aW9uc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9IGVsc2UgaWYgKGxbMl0gPT0gJ1RWIFVuaXRzJykge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gdHZ1bml0c0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gdHZ1bml0c0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9XG4gICAgICAgIHNlYXJjaEFyckRldGFpbHMucHVzaChsWzBdKVxuICAgIH0pXG5cbiAgICBzaG93UmVzdWx0c0NvdW50KG1pZGRsZUNvbnRhaW5lciwgc2VhcmNoQXJyKVxuXG4gICAgZmxhZyA9ICdzZWFyY2gnXG4gICAgbGV0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGdyaWQuaWQgPSAnZ3JpZCdcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoc2VhcmNoQXJyKS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaW1nID0gY3JlYXRlQ2FyZChncmlkLCAtMSwgaSlcbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgcG9wdWxhdGVJdGVtKC0xLCBpKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKGdyaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyKSB7XG4gICAgbGV0IG51bVxuICAgIGxldCBiID0gW11cbiAgICBpZiAoMjAwMCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDI1MDApIHtcbiAgICAgICAgbnVtID0gNlxuICAgIH1cbiAgICBpZiAoMTYwMCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDIwMDApIHtcbiAgICAgICAgbnVtID0gNVxuICAgIH1cbiAgICBpZiAoMTMwMCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDE2MDApIHtcbiAgICAgICAgbnVtID0gNFxuICAgIH1cbiAgICBpZiAoMTAyNCA8IHdpbmRvdy5pbm5lcldpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IDEzMDApIHtcbiAgICAgICAgbnVtID0gM1xuICAgIH1cbiAgICBpZiAoNjAwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMTAyNCkge1xuICAgICAgICBudW0gPSAyXG4gICAgfVxuICAgIGlmICgwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gNjAwKSB7XG4gICAgICAgIG51bSA9IDFcbiAgICB9XG5cbiAgICByLmlubmVySFRNTCA9ICcnXG5cbiAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgTWF0aC5jZWlsKDEwIC8gbnVtKTsgaWkgKz0gMSkge1xuICAgICAgICBsZXQgYXIgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gaWkgKiBudW07IGkgPCBpaSAqIG51bSArIG51bTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocmVjb21tZW5kYXRpb25zQXJyKS5pbmNsdWRlcyhgJHtpfS5qcGdgKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBjcmVhdGVDYXJkKGMsIDcsIGkpXG4gICAgICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUl0ZW0oNywgaSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGFyLnB1c2goYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBiLnB1c2goYXIpXG4gICAgfVxuICAgIGxldCBwID0gMFxuICAgIGlmIChudW0gPT0gMSB8fCBudW0gPT0gMikge1xuICAgICAgICBwID0gMVxuICAgIH1cbiAgICByZXR1cm4gW2IsIE1hdGguZmxvb3IoMTAgLyBudW0pIC0gcCwgbnVtXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29Ib21lKCkge1xuICAgIG5ld1NlbGVjdChob21lQnRuKVxuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgY29udGFpbmVyMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZG90cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcHJldiA9IG5ldyBJbWFnZSgpXG4gICAgY29uc3QgcmVjb21tZW5kYXRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBuZXh0ID0gbmV3IEltYWdlKClcblxuICAgIHByZXYuc3JjID0gdVByZXZJbWdcbiAgICBuZXh0LnNyYyA9IG5leHRJbWdcbiAgICBwcmV2LmNsYXNzTGlzdC5hZGQoJ3UnKVxuICAgIGNvbnRhaW5lcjIuaWQgPSAnY29udGFpbmVyMidcblxuICAgIHByZXYuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogNTBweDtoZWlnaHQ6IDUwcHg7JylcbiAgICBuZXh0LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDUwcHg7aGVpZ2h0OiA1MHB4OycpXG4gICAgZG90cy5pZCA9ICdkb3RzJ1xuXG4gICAgbGV0IGEgPSBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyZWNvbW1lbmRhdGlvbnMpXG4gICAgbGV0IGIgPSBhWzBdXG4gICAgbGV0IGN1cnIgPSAwXG4gICAgbGV0IGxhc3QgPSBhWzFdXG4gICAgbGV0IG51bSA9IGFbMl1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJbY3Vycl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVjb21tZW5kYXRpb25zLmFwcGVuZENoaWxkKGJbY3Vycl1baV0pXG4gICAgfVxuICAgIGRvdHMuaW5uZXJIVE1MID0gJydcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbCgxMCAvIG51bSk7IGkrKykge1xuICAgICAgICBsZXQgZG90ID0gbmV3IEltYWdlKClcbiAgICAgICAgaWYgKGkgPT0gY3Vycikge1xuICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDE1cHg7aGVpZ2h0OiAxNXB4OycpXG4gICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDEycHg7aGVpZ2h0OiAxMnB4OycpXG4gICAgICAgICAgICBkb3Quc3JjID0gZG90SWNuXG4gICAgICAgIH1cbiAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgfVxuICAgIGlmICghaGFzVG91Y2goKSkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgICAgYSA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylcbiAgICAgICAgICAgIGN1cnIgPSAwXG4gICAgICAgICAgICBiID0gYVswXVxuICAgICAgICAgICAgbGFzdCA9IGFbMV1cbiAgICAgICAgICAgIG51bSA9IGFbMl1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYltjdXJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnIgPD0gMCkge1xuICAgICAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgICAgICAgICAgICAgcHJldi5zcmMgPSB1UHJldkltZ1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmV2LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgICAgIHByZXYuc3JjID0gcHJldkltZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnIgPj0gbGFzdCkge1xuICAgICAgICAgICAgICAgIG5leHQuc3JjID0gdU5leHRJbWdcbiAgICAgICAgICAgICAgICBuZXh0LmNsYXNzTGlzdC5hZGQoJ3UnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0LnNyYyA9IG5leHRJbWdcbiAgICAgICAgICAgICAgICBuZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAgLyBudW0pOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZG90ID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxNXB4O2hlaWdodDogMTVweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxMnB4O2hlaWdodDogMTJweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gZG90SWNuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByZXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyID4gMCkge1xuICAgICAgICAgICAgYiA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylbMF1cbiAgICAgICAgICAgIGN1cnItLVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zLmFwcGVuZENoaWxkKGJbY3Vycl1baV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbCgxMCAvIG51bSk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkb3QgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgICAgIGlmIChpID09IGN1cnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDE1cHg7aGVpZ2h0OiAxNXB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBzZG90SWNuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDEycHg7aGVpZ2h0OiAxMnB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBkb3RJY25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ3UnKVxuICAgICAgICAgICAgbmV4dC5zcmMgPSBuZXh0SW1nXG4gICAgICAgICAgICBpZiAoY3VyciA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJldi5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgICAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgbmV4dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGN1cnIgPCBsYXN0KSB7XG4gICAgICAgICAgICBiID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVswXVxuICAgICAgICAgICAgY3VycisrXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJbY3Vycl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnMuYXBwZW5kQ2hpbGQoYltjdXJyXVtpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvdHMuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5jZWlsKDEwIC8gbnVtKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gY3Vycikge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTVweDtoZWlnaHQ6IDE1cHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IHNkb3RJY25cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTJweDtoZWlnaHQ6IDEycHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb3RzLmFwcGVuZENoaWxkKGRvdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LnJlbW92ZSgndScpXG4gICAgICAgICAgICBwcmV2LnNyYyA9IHByZXZJbWdcbiAgICAgICAgICAgIGlmIChjdXJyID49IGxhc3QpIHtcbiAgICAgICAgICAgICAgICBuZXh0LnNyYyA9IHVOZXh0SW1nXG4gICAgICAgICAgICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBib3R0b21pbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBhYm91dHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBhYm91dHVzUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICBjb25zdCBjb250YWN0dXNQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgIGNvbnN0IGJvZHlQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgY29udGFjdGluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGxldCBlbWFpbFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBsZXQgcGhvbmVQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgbG9jYXRpb25kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGxvY2F0aW9uSCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IG1hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZW1haWxhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY29uc3QgcGhvbmVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgZW1haWxhLmhyZWYgPSAnYW1nYWRrYW1hbHNwbGFzaEBnbWFpbC5jb20nXG4gICAgcGhvbmVuLmhyZWYgPSAndGVsOisyMDEyMjEwNDUxMzUnXG5cbiAgICBlbWFpbGEudGV4dENvbnRlbnQgPSAnYW1nYWRrYW1hbHNwbGFzaEBnbWFpbC5jb20nXG4gICAgcGhvbmVuLnRleHRDb250ZW50ID0gJ1xcdTIwMGUrMjAxMjIxMDQ1MTM1J1xuXG4gICAgY29uc3QgZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHBuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGVtLmNsYXNzTGlzdC5hZGQoJ2VtcG4nKVxuICAgIHBuLmNsYXNzTGlzdC5hZGQoJ2VtcG4nKVxuICAgIGJvdHRvbWluZm8uaWQgPSAnYm90dG9taW5mbydcbiAgICBhYm91dHVzLmlkID0gJ2Fib3V0dXMnXG4gICAgY29udGFjdGluZm8uaWQgPSAnY29udGFjdGluZm8nXG4gICAgbG9jYXRpb25kaXYuaWQgPSAnbWFwLWNvbnQnXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgYWJvdXR1c1AudGV4dENvbnRlbnQgPSAnQWJvdXQgVXMnXG4gICAgICAgIGNvbnRhY3R1c1AudGV4dENvbnRlbnQgPSAnQ29udGFjdCBVcydcbiAgICAgICAgYm9keVAudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIE1heGltZSBtb2xsaXRpYSwgbW9sZXN0aWFlIHF1YXMgdmVsIHNpbnQgY29tbW9kaSByZXB1ZGlhbmRhZSBjb25zZXF1dW50dXIgdm9sdXB0YXR1bSBsYWJvcnVtIG51bXF1YW0gYmxhbmRpdGlpcyBoYXJ1bSBxdWlzcXVhbSBlaXVzIHNlZCBvZGl0IGZ1Z2lhdCBpdXN0byBmdWdhIHByYWVzZW50aXVtIG9wdGlvLCBlYXF1ZSByZXJ1bSEgUHJvdmlkZW50IHNpbWlsaXF1ZSBhY2N1c2FudGl1bSBuZW1vIGF1dGVtLiBWZXJpdGF0aXMgb2JjYWVjYXRpIHRlbmV0dXIgaXVyZSBlaXVzIGVhcnVtIHV0IG1vbGVzdGlhcyBhcmNoaXRlY3RvIHZvbHVwdGF0ZSBhbGlxdWFtIG5paGlsLCBldmVuaWV0IGFsaXF1aWQgY3VscGEgb2ZmaWNpYSBhdXQhIEltcGVkaXQgc2l0IHN1bnQgcXVhZXJhdCwgb2RpdCwgdGVuZXR1ciBlcnJvciwgaGFydW0uJ1xuICAgICAgICBsb2NhdGlvbkgudGV4dENvbnRlbnQgPSAnQWRkcmVzczogJ1xuICAgICAgICBlbWFpbFAudGV4dENvbnRlbnQgPSAnRW1haWw6ICdcbiAgICAgICAgcGhvbmVQLnRleHRDb250ZW50ID0gJ1Bob25lIE51bWJlcjogJ1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFib3V0dXNQLnRleHRDb250ZW50ID0gJ9mF2LnZhNmI2YXYp9iqINi52YbYpydcbiAgICAgICAgY29udGFjdHVzUC50ZXh0Q29udGVudCA9ICfYpdiq2LXZhCDYqNmG2KcnXG4gICAgICAgIGJvZHlQLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICfZhNmI2LHZitmFINin2YrYqNiz2YjZhSDYr9mI2YTYp9ixINiz2YrYqiDYo9mF2YrYqiAs2YPZiNmG2LPZitmD2KrZitiq2YjYsSDYo9iv2KfZitio2Kcg2YrYs9mD2YrZhtisINij2YTZitin2YrYqizYs9mK2Kog2K/ZiCDYo9mK2YjYs9mF2YjYryDYqtmK2YXYqNmI2LEg2KPZhtmD2KfZitiv2YrYryDZitmI2YbYqtmK2YjYqiDZhNin2KjZiNix2Yog2KfYqiDYr9mI2YTYp9ixINmF2KfYrNmG2Kcg2KPZhNmK2YPZitmI2KcgLiDZitmI2Kog2KfZhtmK2YUg2KPYryDZhdmK2YbZitmFINmB2YrZhtin2YrZhSzZg9mK2YjYp9izINmG2YjYs9iq2LHZitivINij2YPYs9mK2LEg2LPZitiq2KfYtNmGINmK2YTZhNij2YXZg9mIINmE2KfYqNmI2LHYo9izINmG2YrYs9mKINmK2Kog2KPZhNmK2YPZitmI2Kgg2KPZg9izINij2YrYpyDZg9mI2YXZhdmI2K/ZiCDZg9mI2YbYs9mK2YPZitmI2KfYqiAuINiv2YrZiNin2LMg2KPZitmI2KrZiiDYo9ix2YrYsdmKINiv2YjZhNin2LEg2KXZhiDYsdmK2KjYsdmK2YfZitmG2K/Zitix2KPZitiqINmB2YjZhNmK2YjYqNiq2KfYqtmKINmB2YrZhNin2YrYqiDYo9mK2LPYs9mKINmD2KfZitmE2YTZitmI2YUg2K/ZiNmE2KfYsSDYo9mK2Ygg2YHZitis2KfZitiqINmG2YrZiNmE2Kcg2KjYp9ix2KfZitin2KrZitmI2LEuINij2YrZg9iz2LPZitio2KrZitmI2LEg2LPYp9mK2YbYqiDYo9mI2YPZg9in2YrZg9in2Kog2YPZitmI2KjYp9mK2K/Yp9iq2KfYqiDZhtmI2YYg2KjYsdmI2KfZitiv2YrZhtiqICzYs9mK2YjZhtiqINin2YYg2YPZitmI2YTYqNinINmD2YrZiCDYo9mI2YHZitiz2YrYpyDYr9mK2LPZitix2YrZiNmG2KrZhdmI2YTZitiqINin2YbZitmFINij2YrYr9mKINin2YrYs9iqINmE2KfYqNmI2LHZitmI2YUuJ1xuICAgICAgICBsb2NhdGlvbkgudGV4dENvbnRlbnQgPSAn2KfZhNi52YbZiNin2YY6ICdcbiAgICAgICAgZW1haWxQLnRleHRDb250ZW50ID0gJ9in2YTYqNix2YrYryDYp9mE2KfZhNmD2KrYsdmI2YbZijogJ1xuICAgICAgICBwaG9uZVAudGV4dENvbnRlbnQgPSAn2LHZgtmFINin2YTZh9in2KrZgTogJ1xuICAgIH1cblxuICAgIG1hcC5pbm5lckhUTUwgPVxuICAgICAgICAnPGlmcmFtZSBzcmM9XCJodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZW1iZWQ/cGI9ITFtMTghMW0xMiExbTMhMWQ5MjguMzk4MDIyNDI0MjQ3MSEyZDMxLjM1MDIzNzUzNTkxMjU3ITNkMzAuMDY3OTMxMzkwODI5NDA4ITJtMyExZjAhMmYwITNmMCEzbTIhMWkxMDI0ITJpNzY4ITRmMTMuMSEzbTMhMW0yITFzMHgxNDU4M2UwYjBmYzNkNjQzJTNBMHg4ZDVhMDVmY2YzNWYzOTRlITJzVGF3ZmlrJTIwQWhtZWQlMjBFbC1CYWtyeSUyQyUyMEFsJTIwTWFudGVxYWglMjBhcyUyMFNhZGVzYWglMkMlMjBOYXNyJTIwQ2l0eSUyQyUyMENhaXJvJTIwR292ZXJub3JhdGUlMjA0NDUwNDczITVlMCEzbTIhMXNlbiEyc2VnITR2MTY3ODM5NzE3Nzk3NSE1bTIhMXNlbiEyc2VnXCIgc3R5bGU9XCJib3JkZXI6MDt3aWR0aDogODB2dzsgaGVpZ2h0OiA1MDBweDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiIHJlZmVycmVycG9saWN5PVwibm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGVcIiBpZD1cIm1hcFwiPjwvaWZyYW1lPidcblxuICAgIGNvbnRhaW5lci5pZCA9ICdyZWNvbW1lbmRhdGlvbnMtY29udGFpbmVyJ1xuICAgIHByZXYuaWQgPSAncHJldi1pbWcnXG4gICAgbmV4dC5pZCA9ICduZXh0LWltZydcbiAgICByZWNvbW1lbmRhdGlvbnMuaWQgPSAncmVjb21tZW5kYXRpb25zJ1xuXG4gICAgZW0uYXBwZW5kKGVtYWlsUClcbiAgICBlbS5hcHBlbmQoZW1haWxhKVxuICAgIHBuLmFwcGVuZChwaG9uZVApXG4gICAgcG4uYXBwZW5kKHBob25lbilcbiAgICBsb2NhdGlvbmRpdi5hcHBlbmRDaGlsZChsb2NhdGlvbkgpXG4gICAgbG9jYXRpb25kaXYuYXBwZW5kQ2hpbGQobWFwKVxuICAgIGNvbnRhY3RpbmZvLmFwcGVuZChjb250YWN0dXNQKVxuICAgIGNvbnRhY3RpbmZvLmFwcGVuZChlbSlcbiAgICBjb250YWN0aW5mby5hcHBlbmQocG4pXG4gICAgY29udGFjdGluZm8uYXBwZW5kKGxvY2F0aW9uZGl2KVxuICAgIGFib3V0dXMuYXBwZW5kQ2hpbGQoYWJvdXR1c1ApXG4gICAgYWJvdXR1cy5hcHBlbmRDaGlsZChib2R5UClcbiAgICBib3R0b21pbmZvLmFwcGVuZChhYm91dHVzKVxuICAgIGJvdHRvbWluZm8uYXBwZW5kKGNvbnRhY3RpbmZvKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2KVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWNvbW1lbmRhdGlvbnMpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5leHQpXG4gICAgY29udGFpbmVyMi5hcHBlbmRDaGlsZChjb250YWluZXIpXG4gICAgY29udGFpbmVyMi5hcHBlbmRDaGlsZChkb3RzKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIyKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChib3R0b21pbmZvKVxuICAgIGZsYWcgPSAncGFnZSdcbiAgICBoaWRlTWVudSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlTWVudSgpIHtcbiAgICBtZW51LnN0eWxlLndpZHRoID0gJzAlJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzVG91Y2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8XG4gICAgICAgIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDAgfHxcbiAgICAgICAgbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwXG4gICAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hvb3NlTW9kZShuKSB7XG4gICAgc3dpdGNoIChuKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBsaXZpbmdyb29tc0FyclxuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWJlZHJvb21zQXJyXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBrYmVkcm9vbXNBcnJcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIHJlY2VwdGlvbnNBcnJcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIGRpbmluZ3Jvb21zQXJyXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiB0dnVuaXRzQXJyXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbnNBcnJcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGNhcnRBcnJcbiAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hBcnJcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hvb3NlRGV0YWlscyhuKSB7XG4gICAgc3dpdGNoIChuKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBMaXZpbmdSb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIE1hc3RlckJlZHJvb21zRGV0YWlsc1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gS2lkc0JlZHJvb21zRGV0YWlsc1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gUmVjZXB0aW9uc0RldGFpbHNcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIERpbmluZ1Jvb21zRGV0YWlsc1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gVFZVbml0c0RldGFpbHNcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgcmV0dXJuIHJlY29tbWVuZGF0aW9uc0FyckRldGFpbHNcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGNhcnRBcnJEZXRhaWxzXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoQXJyRGV0YWlsc1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhcmQoY29udGFpbmVyLCBuLCBpbmRleCkge1xuICAgIGxldCBhcnIgPSBjaG9vc2VNb2RlKG4pXG4gICAgbGV0IGFyckRldGFpbHMgPSBjaG9vc2VEZXRhaWxzKG4pXG4gICAgbGV0IHBfdGl0bGVfZW4gPSAnJ1xuICAgIGxldCBwX3RpdGxlX2FyID0gJydcbiAgICBsZXQgcF9wcmljZV9lbiA9ICcnXG4gICAgbGV0IHBfcHJpY2VfYXIgPSAnJ1xuXG4gICAgY29uc3QgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBpbmZvTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgY2FydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgY29uc3QgdG1wTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgbmFtZVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBwcmljZVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBociA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgncG9wdXB0ZXh0JylcbiAgICBzcGFuLmlkID0gYG15UG9wdXAtJHtpbmRleH1gXG4gICAgY2FydC5jbGFzc0xpc3QuYWRkKCd0dHBvcHVwJylcbiAgICB0bXAuY2xhc3NMaXN0LmFkZCgnaXRlbScpXG4gICAgaW5mby5jbGFzc0xpc3QuYWRkKCdpbmZvJylcbiAgICBpbmZvTC5jbGFzc0xpc3QuYWRkKCdpbmZvLWxlZnQnKVxuICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpXG4gICAgaW1nLnNyYyA9IGFycltgJHtpbmRleH0uanBnYF1cbiAgICBwX3RpdGxlX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3RpdGxlX2VuXG4gICAgcF90aXRsZV9hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF90aXRsZV9hclxuICAgIHBfcHJpY2VfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLnByb2R1Y3RfcHJpY2VfZW5cbiAgICBwX3ByaWNlX2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3ByaWNlX2FyXG4gICAgaWYgKG4gPT0gNykge1xuICAgICAgICBpbmZvTC5jbGFzc0xpc3QuYWRkKCdyZWNvbW1lbmRhdGlvbi1pbmZvLUwnKVxuICAgICAgICBpbmZvLmNsYXNzTGlzdC5hZGQoJ3JlY29tbWVuZGF0aW9uLWluZm8nKVxuICAgIH1cbiAgICBpbWcuc2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJywgJzEuMicpXG4gICAgaWYgKGxhbmdCdG4udmFsdWUgPT0gJ2VuZ2xpc2gnKSB7XG4gICAgICAgIG5hbWVQLnRleHRDb250ZW50ID0gcF90aXRsZV9lblxuICAgICAgICBjYXJ0LnRleHRDb250ZW50ID0gJ0FkZCB0byBDYXJ0J1xuICAgICAgICBwcmljZVAudGV4dENvbnRlbnQgPSBwX3ByaWNlX2VuXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSAnSXRlbSBBZGRlZCB0byBDYXJ0ISdcbiAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lUC50ZXh0Q29udGVudCA9IHBfdGl0bGVfYXJcbiAgICAgICAgY2FydC50ZXh0Q29udGVudCA9ICfYp9i22KfZgdipINin2YTZiiDYudix2KjYqSDYp9mE2KrYs9mI2YInXG4gICAgICAgIHByaWNlUC50ZXh0Q29udGVudCA9IHBfcHJpY2VfYXJcbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9ICfYqtmF2Kog2KfZhNil2LbYp9mB2Kkg2KXZhNmJINi52LHYqNipINin2YTYqtiz2YjZgiEnXG4gICAgfVxuXG4gICAgY2FydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgYWRkVG9DYXJ0KHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0uaW5kZXgsIGluZGV4KVxuICAgIH0pXG5cbiAgICBjYXJ0LmFwcGVuZChzcGFuKVxuICAgIGluZm9MLmFwcGVuZChuYW1lUClcbiAgICBpbmZvTC5hcHBlbmQocHJpY2VQKVxuICAgIGluZm8uYXBwZW5kKGluZm9MKVxuICAgIHRtcEwuYXBwZW5kKGhyKVxuICAgIHRtcEwuYXBwZW5kKGluZm8pXG4gICAgdG1wLmFwcGVuZChpbWcpXG4gICAgdG1wLmFwcGVuZCh0bXBMKVxuICAgIHRtcC5hcHBlbmQoY2FydClcbiAgICBjb250YWluZXIuYXBwZW5kKHRtcClcbiAgICByZXR1cm4gaW1nXG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlSXRlbShuLCBpKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgY3Vyckl0ZW0ucHVzaChuKVxuICAgIGN1cnJJdGVtLnB1c2goaSlcbiAgICBsZXQgcF9jb2RlX2VuID0gJydcbiAgICBsZXQgcF9jb2RlX2FyID0gJydcbiAgICBsZXQgcF9kaW1lbnNpb25zX2VuID0gJydcbiAgICBsZXQgcF9kaW1lbnNpb25zX2FyID0gJydcbiAgICBsZXQgcF9kZXNjX2VuID0gJydcbiAgICBsZXQgcF9kZXNjX2FyID0gJydcblxuICAgIGZsYWcgPSAnaXRlbSdcbiAgICBsZXQgZmwgPSBmYWxzZVxuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHZpZXdJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXRhaWxzSGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGV0YWlsc0JvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRlc2MxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXNjMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGVzYzMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGxldCBpbWcgPSAnJ1xuXG4gICAgaW1nID0gY3JlYXRlQ2FyZChpdGVtLCBuLCBpKVxuXG4gICAgbGV0IGFyckRldGFpbHMgPSBjaG9vc2VEZXRhaWxzKG4pXG5cbiAgICBsZXQgYXJyID0gW11cblxuICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBhcnIgPSBsaXZpbmdyb29tc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBhcnIgPSBhYmVkcm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgYXJyID0ga2JlZHJvb21zQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGFyciA9IHJlY2VwdGlvbnNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgYXJyID0gZGluaW5ncm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgYXJyID0gdHZ1bml0c0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICBhcnIgPSByZWNvbW1lbmRhdGlvbnNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgYXJyID0gY2FydEFyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgYXJyID0gc2VhcmNoQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cblxuICAgIHBfY29kZV9lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2NvZGVfZW5cbiAgICBwX2NvZGVfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9jb2RlX2FyXG4gICAgcF9kaW1lbnNpb25zX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfZGltZW5zaW9uc19lblxuICAgIHBfZGltZW5zaW9uc19hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2RpbWVuc2lvbnNfYXJcbiAgICBwX2Rlc2NfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9kZXNjcmlwdGlvbl9lblxuICAgIHBfZGVzY19hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2Rlc2NyaXB0aW9uX2FyXG5cbiAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICghZmwpIHtcbiAgICAgICAgICAgIGNvbnN0IHpvb21lZENvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LmFkZCgncG9wdXAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmwgPSB0cnVlXG4gICAgICAgICAgICBsZXQgem9vbWVkSW4gPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgbGV0IHgyID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIHpvb21lZEluLnNyYyA9IGFycltgJHtpfS5qcGdgXVxuICAgICAgICAgICAgeDIuc3JjID0geDJJY25cbiAgICAgICAgICAgIHgyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDQwcHg7aGVpZ2h0OiA0MHB4OycpXG4gICAgICAgICAgICB6b29tZWRJbi5jbGFzc0xpc3QuYWRkKCd6b29tZWQtaW4nKVxuICAgICAgICAgICAgeDIuY2xhc3NMaXN0LmFkZCgneDInKVxuICAgICAgICAgICAgem9vbWVkQ29udC5jbGFzc0xpc3QuYWRkKCd6b29tZWQtY29udGFpbmVyJylcbiAgICAgICAgICAgIHpvb21lZENvbnQuYXBwZW5kQ2hpbGQoem9vbWVkSW4pXG4gICAgICAgICAgICB6b29tZWRDb250LmFwcGVuZENoaWxkKHgyKVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh6b29tZWRDb250KVxuICAgICAgICAgICAgeDIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZmwgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnem9vbWVkLWluJylcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3gyJylcbiAgICAgICAgICAgICAgICBjb25zdCBjb24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd6b29tZWQtY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICBlbGVtZW50c1swXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzWzBdKVxuICAgICAgICAgICAgICAgIGVsWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxbMF0pXG4gICAgICAgICAgICAgICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGJsdXJyZWQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvblswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvblswXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdmlld0l0ZW0uaWQgPSAndmlldy1pdGVtJ1xuICAgIGRldGFpbHMuaWQgPSAnaXRlbS1kZXRhaWxzJ1xuICAgIGRldGFpbHNIZWFkLmlkID0gJ2RldGFpbHNIJ1xuICAgIGRldGFpbHNCb2R5LmlkID0gJ2RldGFpbHNCJ1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGRldGFpbHNIZWFkLnRleHRDb250ZW50ID0gJ1Byb2R1Y3QgRGV0YWlscydcbiAgICAgICAgZGVzYzIudGV4dENvbnRlbnQgPSBwX2Rlc2NfZW5cbiAgICAgICAgZGVzYzMudGV4dENvbnRlbnQgPSBwX2RpbWVuc2lvbnNfZW5cbiAgICAgICAgZGVzYzEudGV4dENvbnRlbnQgPSBwX2NvZGVfZW5cbiAgICB9IGVsc2Uge1xuICAgICAgICBkZXRhaWxzSGVhZC50ZXh0Q29udGVudCA9ICfYqtmB2KfYtdmK2YQg2KfZhNmF2YbYqtisJ1xuICAgICAgICBkZXNjMi50ZXh0Q29udGVudCA9IHBfZGVzY19hclxuICAgICAgICBkZXNjMy50ZXh0Q29udGVudCA9IHBfZGltZW5zaW9uc19hclxuICAgICAgICBkZXNjMS50ZXh0Q29udGVudCA9IHBfY29kZV9hclxuICAgIH1cblxuICAgIGRldGFpbHNCb2R5LmFwcGVuZChkZXNjMSlcbiAgICBkZXRhaWxzQm9keS5hcHBlbmQoZGVzYzIpXG4gICAgZGV0YWlsc0JvZHkuYXBwZW5kKGRlc2MzKVxuICAgIGRldGFpbHMuYXBwZW5kKGRldGFpbHNIZWFkKVxuICAgIGRldGFpbHMuYXBwZW5kKGRldGFpbHNCb2R5KVxuICAgIHZpZXdJdGVtLmFwcGVuZENoaWxkKGl0ZW0pXG4gICAgdmlld0l0ZW0uYXBwZW5kQ2hpbGQoZGV0YWlscylcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKHZpZXdJdGVtKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVHcmlkKG4pIHtcbiAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICBsZXQgaW1hZ2VBcnIgPSBjaG9vc2VNb2RlKG4pXG4gICAgZmxhZyA9ICdwYWdlJ1xuICAgIGxldCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGdyaWQuaWQgPSAnZ3JpZCdcblxuICAgIHNob3dSZXN1bHRzQ291bnQobWlkZGxlQ29udGFpbmVyLCBpbWFnZUFycilcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoaW1hZ2VBcnIpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpbWcgPSBjcmVhdGVDYXJkKGdyaWQsIG4sIGkpXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHBvcHVsYXRlSXRlbShuLCBpKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBoaWRlTWVudSgpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZChncmlkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVMYW5nKCkge1xuICAgIG5hdkJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgIGlmIChmbGFnID09ICdwYWdlJykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkLXBhZ2UnKSB8fFxuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkLXBhZ2UtZGQnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChidG4uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG9tZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBnb0hvbWUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGl2aW5ncm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhZHVsdHMtYmVkcm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdraWRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCgzKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmVjZXB0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RpbmluZ3Jvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCg1KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndHZ1bml0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdpdGVtJykge1xuICAgICAgICAgICAgcG9wdWxhdGVJdGVtKGN1cnJJdGVtWzBdLCBjdXJySXRlbVsxXSlcbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdjYXJ0Jykge1xuICAgICAgICAgICAgcG9wdWxhdGVWaWV3Q2FydCgpXG4gICAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PSAnc2VhcmNoJykge1xuICAgICAgICAgICAgcG9wdWxhdGVTZWFyY2hSZXN1bHRzKClcbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdvcmRlcicpIHtcbiAgICAgICAgICAgIHBvcHVsYXRlT3JkZXIoKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1NlbGVjdChidXR0b24pIHtcbiAgICBiZWRyb29tc0J0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlJylcbiAgICBuYXZCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcGFnZScpXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlLWRkJylcbiAgICB9KVxuICAgIGlmIChcbiAgICAgICAgW1xuICAgICAgICAgICAgaG9tZUJ0bixcbiAgICAgICAgICAgIGxpdmluZ3Jvb21zQnRuLFxuICAgICAgICAgICAgcmVjZXB0aW9uc0J0bixcbiAgICAgICAgICAgIHR2dW5pdHNCdG4sXG4gICAgICAgICAgICBkaW5pbmdyb29tc0J0bixcbiAgICAgICAgXS5pbmNsdWRlcyhidXR0b24pXG4gICAgKSB7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wYWdlJylcbiAgICB9IGVsc2UgaWYgKFthYmVkcm9vbXNCdG4sIGtiZWRyb29tc0J0bl0uaW5jbHVkZXMoYnV0dG9uKSkge1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcGFnZS1kZCcpXG4gICAgICAgIGJlZHJvb21zQnRuLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXBhZ2UnKVxuICAgIH1cbiAgICBuYXZQLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcCcpXG4gICAgfSlcbiAgICBsZXQgYSA9IGJ1dHRvbi5pZFxuICAgIHN3aXRjaCAoYSkge1xuICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgIGhvbWVQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnbGl2aW5ncm9vbXMnOlxuICAgICAgICAgICAgbGl2aW5ncm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYWR1bHRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgIGFiZWRyb29tc1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdraWRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgIGtiZWRyb29tc1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZWNlcHRpb25zJzpcbiAgICAgICAgICAgIHJlY2VwdGlvbnNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgZGluaW5ncm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndHZ1bml0cyc6XG4gICAgICAgICAgICB0dnVuaXRzUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaExhbmcodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldCA9PSAnYXInKSB7XG4gICAgICAgIHNyY2guc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICfYp9io2K3YqyDZh9mG2KcuLicpXG4gICAgICAgIGZ0ci50ZXh0Q29udGVudCA9ICfYrNmF2YrYuSDYp9mE2K3ZgtmI2YIg2YXYrdmB2YjYuNipJ1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IG5hdkJ0bnNbaV1cbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IG5hdkFyW2ldXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYXZQLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSBuYXZQW2ldXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZBcjJbaV1cbiAgICAgICAgfVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2VucycpXG4gICAgICAgIG1lbnUuY2xhc3NMaXN0LmFkZCgnYXJzJylcbiAgICAgICAgYmVkcm9vbXNCdG4udGV4dENvbnRlbnQgPSAn2LrYsdmBINin2YTZhtmI2YUnXG4gICAgICAgIGNhcnRJbWcuc2V0QXR0cmlidXRlKCd0aXRsZScsICfYudix2LYg2LnYsdio2Kkg2KfZhNiq2LPZiNmCJylcbiAgICB9IGVsc2Uge1xuICAgICAgICBzcmNoLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnU2VhcmNoIGhlcmUuLicpXG4gICAgICAgIGZ0ci50ZXh0Q29udGVudCA9ICdBbGwgUmlnaHRzIFJlc2VydmVkLidcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYXZCdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSBuYXZCdG5zW2ldXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZFbltpXVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2UC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2UFtpXVxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gbmF2RW4yW2ldXG4gICAgICAgIH1cbiAgICAgICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhcnMnKVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5hZGQoJ2VucycpXG4gICAgICAgIGJlZHJvb21zQnRuLnRleHRDb250ZW50ID0gJ0JlZHJvb21zJ1xuICAgICAgICBjYXJ0SW1nLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnVmlldyBDYXJ0JylcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZSB7XG4gICAgc3RhdGljIHNhdmVDYXJ0KHgsIHksIHosIHcpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRBcnJEZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkoeCkpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0QXJyJywgSlNPTi5zdHJpbmdpZnkoeSkpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0QXJyT0cnLCBKU09OLnN0cmluZ2lmeSh6KSlcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRJbmRleGVzJywgSlNPTi5zdHJpbmdpZnkodykpXG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVBZGRyZXNzKHgpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJBZGRyZXNzJywgSlNPTi5zdHJpbmdpZnkoeCkpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldERldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEFyckRldGFpbHMnKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBcnIoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEFycicpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFyck9nKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRBcnJPRycpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEluZGV4ZXMoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEluZGV4ZXMnKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBZGRyZXNzKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJBZGRyZXNzJylcbiAgICB9XG59XG4iLCJleHBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmV4cG9ydCBsZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSA9IDIxKSA9PlxuICBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmV4cG9ydCBsZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbiIsImV4cG9ydCBjb25zdCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9