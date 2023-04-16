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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/4.jpg",
	"./5.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/kids/5.jpg"
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
	"./10.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/10.jpg",
	"./11.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/11.jpg",
	"./12.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/12.jpg",
	"./13.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/13.jpg",
	"./14.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/14.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/4.jpg",
	"./5.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/5.jpg",
	"./6.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/6.jpg",
	"./7.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/7.jpg",
	"./8.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/8.jpg",
	"./9.jpg": "./src/assets/images/pictures/products/displayed/bedrooms/master/9.jpg"
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
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/displayed/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/dressings sync \\.(png%7Cjpe?g%7Csvg)$":
/*!***********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/dressings/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \***********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/displayed/dressings/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/displayed/dressings/1.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/displayed/dressings sync \\.(png%7Cjpe?g%7Csvg)$";

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
	"./1.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/4.jpg",
	"./5.jpg": "./src/assets/images/pictures/products/original/bedrooms/kids/5.jpg"
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
	"./10.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/10.jpg",
	"./11.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/11.jpg",
	"./12.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/12.jpg",
	"./13.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/13.jpg",
	"./14.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/14.jpg",
	"./2.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/2.jpg",
	"./3.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/3.jpg",
	"./4.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/4.jpg",
	"./5.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/5.jpg",
	"./6.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/6.jpg",
	"./7.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/7.jpg",
	"./8.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/8.jpg",
	"./9.jpg": "./src/assets/images/pictures/products/original/bedrooms/master/9.jpg"
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
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/assets/images/pictures/products/original/diningrooms sync \\.(png%7Cjpe?g%7Csvg)$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/assets/images/pictures/products/original/dressings sync \\.(png%7Cjpe?g%7Csvg)$":
/*!**********************************************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/dressings/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \**********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./0.jpg": "./src/assets/images/pictures/products/original/dressings/0.jpg",
	"./1.jpg": "./src/assets/images/pictures/products/original/dressings/1.jpg"
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
webpackContext.id = "./src/assets/images/pictures/products/original/dressings sync \\.(png%7Cjpe?g%7Csvg)$";

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
/* harmony export */   "dressingsArr": () => (/* binding */ dressingsArr),
/* harmony export */   "dressingsArrOG": () => (/* binding */ dressingsArrOG),
/* harmony export */   "dressingsBtn": () => (/* binding */ dressingsBtn),
/* harmony export */   "dressingsP": () => (/* binding */ dressingsP),
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
const dressingsBtn = document.getElementById('dressings')
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
const dressingsP = document.getElementById('dressings-p')
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

const dressingsArr = importAll(
    __webpack_require__("./src/assets/images/pictures/products/displayed/dressings sync \\.(png%7Cjpe?g%7Csvg)$")
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

const dressingsArrOG = importAll(
    __webpack_require__("./src/assets/images/pictures/products/original/dressings sync \\.(png%7Cjpe?g%7Csvg)$")
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
    dressingsBtn,
    abedroomsBtn,
    kbedroomsBtn,
    receptionsBtn,
    tvunitsBtn,
    diningroomsBtn,
]
const navP = [
    homeP,
    dressingsP,
    abedroomsP,
    kbedroomsP,
    receptionsP,
    tvunitsP,
    diningroomsP,
]
const navAr = [
    'الرئيسية',
    'دريسنج',
    'غرف نوم رئيسية',
    'غرف نوم اطفال',
    'صالونات',
    'مكتبات',
    'غرف سفرة',
]
const navEn = [
    'Home',
    'Dressings',
    'Master Bedrooms',
    'Kids Bedrooms',
    'Receptions',
    'TV Units',
    'Dining Rooms',
]
const navAr2 = [
    'الرئيسية',
    'دريسنج',
    'غرف نوم رئيسية',
    'غرف نوم اطفال',
    'صالونات',
    'مكتبات',
    'غرف سفرة',
]
const navEn2 = [
    'Home',
    'Dressings',
    'Master Bedrooms',
    'Kids Bedrooms',
    'Receptions',
    'TV Units',
    'Dining Rooms',
]

const dressingsDetails = []
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
        case 'Dressings':
            dressingsDetails.push(p.index)
            if (p.recommended == 1) {
                let a = p.product_img_path_displayed.split('/')
                let indx2 = a[a.length - 1]
                let ex = indx2.split('.')[1]
                recommendationsArr[`${iii}.${ex}`] = dressingsArr[indx2]
                recommendationsArrOG[`${iii}.${ex}`] = dressingsArrOG[indx2]
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
        subtotal.textContent = `Subtotal: ${tp}`
        shipping.textContent = 'We shall be contacting you soon.'
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
        subtotal.textContent = `الاجمالي: ${tp}`
        shipping.textContent = 'سنتواصل معكم قريبًا.'
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
                    case 'Dressings':
                        a = p.product_img_path_displayed.split('/')
                        indx2 = a[a.length - 1]
                        cartArr[`${iiii}.jpg`] = dressingsArr[indx2]
                        cartArrOG[`${iiii}.jpg`] = dressingsArrOG[indx2]
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

        tp = 'TBD'

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
                pricei.textContent = 'TBD'
                    // products[parseInt(cartArrDetails[i])].product_price_en
            } else {
                titlei.textContent = `${
                    products[parseInt(cartArrDetails[i])].p_id
                }، ${products[parseInt(cartArrDetails[i])].product_title_ar}`
                pricei.textContent = 'TBD'
                    // products[parseInt(cartArrDetails[i])].product_price_ar
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

            // tp += parseInt(products[parseInt(cartArrDetails[i])].product_price)
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
    searchArr = {}
    searchArrOG = {}
    searchArrDetails = []

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
        if (l[2] == 'dressings') {
            let a = p.product_img_path_displayed.split('/')
            let indx2 = a[a.length - 1]
            let ex = indx2.split('.')[1]
            searchArr[`${indxx}.${ex}`] = dressingsArr[indx2]
            searchArrOG[`${indxx}.${ex}`] = dressingsArrOG[indx2]
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
            return dressingsArr
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
            return dressingsDetails
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
            arr = dressingsArrOG
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
                    case 'dressings':
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
            dressingsBtn,
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
        case 'dressings':
            dressingsP.classList.add('selected-p')
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

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c42d15cfe4ab5d9c12ac.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6a62bd25e38f00b72598.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/2.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/2.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ffcf938b92b57ced7b87.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/3.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/3.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "96210f16eb154a6bb7a7.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/4.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/4.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f44577641e09661f1af2.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/kids/5.jpg":
/*!***************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/kids/5.jpg ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c05fa49e5e58734ea549.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fd76ac642311f3bc0f48.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "18bc3594163a7e85ad12.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/10.jpg":
/*!******************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/10.jpg ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "3f564dcff870570235bc.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/11.jpg":
/*!******************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/11.jpg ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d6d9a95e3864cfd3f320.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/12.jpg":
/*!******************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/12.jpg ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0509ff250ac3220ae608.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/13.jpg":
/*!******************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/13.jpg ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2e4e2867ee1bdc5d80af.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/14.jpg":
/*!******************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/14.jpg ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8403e4b4d610c05d5c1f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fdd3f44b37338f1215c3.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a4f68d36b821bc79ec45.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/4.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/4.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "702d6211eadd16c4a351.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/5.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/5.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6a59d408cfb90b67e603.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/6.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/6.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "583323f670a29ca2c69b.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/7.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/7.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "10586207113cdb9a2db1.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/8.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/8.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f14a078b9994594aca21.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/bedrooms/master/9.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/bedrooms/master/9.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6c3c016860d6c63c9ba1.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/dressings/0.jpg":
/*!***********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/dressings/0.jpg ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "dccfebd0d40c947a619d.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/dressings/1.jpg":
/*!***********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/dressings/1.jpg ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "995f59e4a0fb061180af.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/receptions/0.jpg":
/*!************************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/receptions/0.jpg ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "e4c87e6c47206bc4bc20.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/0.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/0.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "75d68362145e495089d2.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/1.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/1.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5d9ad313d60e233cec12.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/2.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/2.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bf3d2e9274e4090de8e1.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/3.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/3.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "56caf67cb870459a9a76.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/displayed/tvunits/4.jpg":
/*!*********************************************************************!*\
  !*** ./src/assets/images/pictures/products/displayed/tvunits/4.jpg ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0b574558f4f811493f41.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/0.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/0.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "56a74261d5eca275d228.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/1.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a430b696a63378af78ea.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/2.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/2.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0cc8ece229ad3226c388.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/3.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/3.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "1ea1342ab9d8b58bd101.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/4.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/4.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2de72386dd114afa2729.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/kids/5.jpg":
/*!**************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/kids/5.jpg ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a5378a2bba0ce911cb5f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/0.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/0.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d475a006a44ef190277f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/1.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/1.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "55a52d2d91fb8117378f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/10.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/10.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b6480c241e73b6f196ab.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/11.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/11.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "77644600920ab2ff452b.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/12.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/12.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0509ff250ac3220ae608.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/13.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/13.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "e5ae2fc4a4fd4b068408.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/14.jpg":
/*!*****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/14.jpg ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "51a744ca4834291422ae.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/2.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/2.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fe03c459167967fafb12.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/3.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/3.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ac9d0a26428ee8d656ba.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/4.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/4.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5006d5f08e09bd427ead.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/5.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/5.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "656e762c73b5b422c383.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/6.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/6.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "391705ff2d65b72eef7f.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/7.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/7.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "599b90965182ec53be5b.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/8.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/8.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "1e0aba045f441d56bec7.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/bedrooms/master/9.jpg":
/*!****************************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/bedrooms/master/9.jpg ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4ce1a1bfe6967db5bdff.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/dressings/0.jpg":
/*!**********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/dressings/0.jpg ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b0a7cd48c467210c7875.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/dressings/1.jpg":
/*!**********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/dressings/1.jpg ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c7b072b40c3c348b057b.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/receptions/0.jpg":
/*!***********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/receptions/0.jpg ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c85f3ebd980aaa0ad8af.jpg";

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
module.exports = __webpack_require__.p + "ea871ae3ee53d923089d.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/2.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/2.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bf3d2e9274e4090de8e1.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/3.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/3.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b57fbfccf4e0260702f7.jpg";

/***/ }),

/***/ "./src/assets/images/pictures/products/original/tvunits/4.jpg":
/*!********************************************************************!*\
  !*** ./src/assets/images/pictures/products/original/tvunits/4.jpg ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ff17eb6665cb67fa6076.jpg";

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
module.exports = JSON.parse('{"Products":[{"p_id":"B24","product_code_en":"- ID: B24","product_code_ar":"- رقم المنتج:  B24","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/0.jpg","recommended":0,"index":0},{"p_id":"B20","product_code_en":"- ID: B20","product_code_ar":"- رقم المنتج:  B20","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/1.jpg","recommended":0,"index":1},{"p_id":"B22","product_code_en":"- ID: B22","product_code_ar":"- رقم المنتج:  B22","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/2.jpg","recommended":0,"index":2},{"p_id":"B30","product_code_en":"- ID: B30","product_code_ar":"- رقم المنتج:  B30","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/3.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/3.jpg","recommended":1,"index":3},{"p_id":"B28","product_code_en":"- ID: B28","product_code_ar":"- رقم المنتج:  B28","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/4.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/4.jpg","recommended":0,"index":4},{"p_id":"B31","product_code_en":"- ID: B31","product_code_ar":"- رقم المنتج:  B31","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/5.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/5.jpg","recommended":0,"index":5},{"p_id":"B32","product_code_en":"- ID: B32","product_code_ar":"- رقم المنتج:  B32","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/6.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/6.jpg","recommended":0,"index":6},{"p_id":"B34","product_code_en":"- ID: B34","product_code_ar":"- رقم المنتج:  B34","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/7.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/7.jpg","recommended":1,"index":7},{"p_id":"B33","product_code_en":"- ID: B33","product_code_ar":"- رقم المنتج:  B33","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/8.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/8.jpg","recommended":1,"index":8},{"p_id":"B36","product_code_en":"- ID: B36","product_code_ar":"- رقم المنتج:  B36","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/9.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/9.jpg","recommended":0,"index":9},{"p_id":"B35","product_code_en":"- ID: B35","product_code_ar":"- رقم المنتج:  B35","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/10.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/10.jpg","recommended":0,"index":10},{"p_id":"B38","product_code_en":"- ID: B38","product_code_ar":"- رقم المنتج:  B38","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/11.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/11.jpg","recommended":1,"index":11},{"p_id":"B26","product_code_en":"- ID: B26","product_code_ar":"- رقم المنتج:  B26","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/12.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/12.jpg","recommended":0,"index":12},{"p_id":"B37","product_code_en":"- ID: B37","product_code_ar":"- رقم المنتج:  B37","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/13.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/13.jpg","recommended":0,"index":13},{"p_id":"M22","product_code_en":"- ID: M22","product_code_ar":"- رقم المنتج:  M22","product_title_en":"TV Unit","product_title_ar":"TV Unit","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/0.jpg","recommended":1,"index":14},{"p_id":"M28","product_code_en":"- ID: M28","product_code_ar":"- رقم المنتج:  M28","product_title_en":"TV Unit","product_title_ar":"TV Unit","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/1.jpg","recommended":1,"index":15},{"p_id":"M26","product_code_en":"- ID: M26","product_code_ar":"- رقم المنتج:  M26","product_title_en":"TV Unit","product_title_ar":"TV Unit","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/2.jpg","recommended":0,"index":16},{"p_id":"M20","product_code_en":"- ID: M20","product_code_ar":"- رقم المنتج:  M20","product_title_en":"TV Unit","product_title_ar":"TV Unit","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/3.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/3.jpg","recommended":0,"index":17},{"p_id":"M24","product_code_en":"- ID: M24","product_code_ar":"- رقم المنتج:  M24","product_title_en":"TV Unit","product_title_ar":"TV Unit","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"TV Units","product_img_path_displayed":"src/assets/images/pictures/products/displayed/tvunits/4.jpg","product_img_path_original":"src/assets/images/pictures/products/original/tvunits/4.jpg","recommended":0,"index":18},{"p_id":"K24","product_code_en":"- ID: K24","product_code_ar":"- رقم المنتج:  K24","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/0.jpg","recommended":0,"index":19},{"p_id":"K25","product_code_en":"- ID: K25","product_code_ar":"- رقم المنتج:  K25","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/1.jpg","recommended":1,"index":20},{"p_id":"K26","product_code_en":"- ID: K26","product_code_ar":"- رقم المنتج:  K26","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/2.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/2.jpg","recommended":1,"index":21},{"p_id":"K23","product_code_en":"- ID: K23","product_code_ar":"- رقم المنتج:  K23","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/3.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/3.jpg","recommended":0,"index":22},{"p_id":"K20","product_code_en":"- ID: K20","product_code_ar":"- رقم المنتج:  K20","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/4.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/4.jpg","recommended":0,"index":23},{"p_id":"K22","product_code_en":"- ID: K22","product_code_ar":"- رقم المنتج:  K22","product_title_en":"Kids Bedroom","product_title_ar":"Kids Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Kids Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/kids/5.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/kids/5.jpg","recommended":0,"index":24},{"p_id":"B39","product_code_en":"- ID: B39","product_code_ar":"- رقم المنتج:  B39","product_title_en":"Master Bedroom","product_title_ar":"Master Bedroom","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Master Bedrooms","product_img_path_displayed":"src/assets/images/pictures/products/displayed/bedrooms/master/14.jpg","product_img_path_original":"src/assets/images/pictures/products/original/bedrooms/master/14.jpg","recommended":0,"index":25},{"p_id":"A20","product_code_en":"- ID: A20","product_code_ar":"- رقم المنتج:  A20","product_title_en":"Reception","product_title_ar":"Reception","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Receptions","product_img_path_displayed":"src/assets/images/pictures/products/displayed/receptions/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/receptions/0.jpg","recommended":1,"index":26},{"p_id":"D01","product_code_en":"- ID: D01","product_code_ar":"- رقم المنتج:  D01","product_title_en":"Dressing","product_title_ar":"Dressing","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Dressings","product_img_path_displayed":"src/assets/images/pictures/products/displayed/dressings/0.jpg","product_img_path_original":"src/assets/images/pictures/products/original/dressings/0.jpg","recommended":1,"index":27},{"p_id":"D02","product_code_en":"- ID: D02","product_code_ar":"- رقم المنتج:  D02","product_title_en":"Dressing","product_title_ar":"Dressing","product_description_en":"","product_description_ar":"","product_price_en":"","product_price_ar":"","product_price":"","product_dimensions_en":"For further inquiries please contact us","product_dimensions_ar":"لمزيد من الاستفسارات يرجى الاتصال بنا","product_type":"Dressings","product_img_path_displayed":"src/assets/images/pictures/products/displayed/dressings/1.jpg","product_img_path_original":"src/assets/images/pictures/products/original/dressings/1.jpg","recommended":0,"index":28}],"Orders":[]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/scripts/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFVBQVU7QUFDdkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsTUFBTTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLE1BQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0JxRDtBQUM5QztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ0k7QUFDUCIsInNvdXJjZXMiOlsid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9pbmRleC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAvc3JjL2hlYXAuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwL3NyYy9tYXhIZWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvaGVhcC9zcmMvbWluSGVhcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL2luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9AZGF0YXN0cnVjdHVyZXMtanMvcHJpb3JpdHktcXVldWUvc3JjL21heFByaW9yaXR5UXVldWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL0BkYXRhc3RydWN0dXJlcy1qcy9wcmlvcml0eS1xdWV1ZS9zcmMvbWluUHJpb3JpdHlRdWV1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvQGRhdGFzdHJ1Y3R1cmVzLWpzL3ByaW9yaXR5LXF1ZXVlL3NyYy9wcmlvcml0eVF1ZXVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0hhc2guanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUZpbHRlci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25WYWx1ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ3JlYXRlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzU2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXNJbi5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVJlZ0V4cC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHNJbi5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2RlZmluZVByb3BlcnR5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWFwRGF0YS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UHJvdG90eXBlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHNJbi5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lT2JqZWN0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlRGVsZXRlLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlU2V0LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2Nsb25lZGVlcC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTWFwLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1NldC5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly9zcGxhc2gvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzSW4uanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL2tpZHMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZGluaW5ncm9vbXMvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RyZXNzaW5ncy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3Rlci8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kaW5pbmdyb29tcy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9kcmVzc2luZ3MvIHN5bmMgbm9ucmVjdXJzaXZlIFxcLihwbmclN0NqcGUiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9zcGxhc2gvLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIiwid2VicGFjazovL3NwbGFzaC8uL3NyYy9zY3JpcHRzL2xvY2FsLXN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vc3BsYXNoLy4vbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwid2VicGFjazovL3NwbGFzaC8uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnLi9zcmMvaGVhcCcpO1xuY29uc3QgeyBNaW5IZWFwIH0gPSByZXF1aXJlKCcuL3NyYy9taW5IZWFwJyk7XG5jb25zdCB7IE1heEhlYXAgfSA9IHJlcXVpcmUoJy4vc3JjL21heEhlYXAnKTtcblxuZXhwb3J0cy5IZWFwID0gSGVhcDtcbmV4cG9ydHMuTWluSGVhcCA9IE1pbkhlYXA7XG5leHBvcnRzLk1heEhlYXAgPSBNYXhIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcGFyYW0ge2FycmF5fSBbX3ZhbHVlc11cbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gW19sZWFmXVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29tcGFyZSwgX3ZhbHVlcywgX2xlYWYpIHtcbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhcCBjb25zdHJ1Y3RvciBleHBlY3RzIGEgY29tcGFyZSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9jb21wYXJlID0gY29tcGFyZTtcbiAgICB0aGlzLl9ub2RlcyA9IEFycmF5LmlzQXJyYXkoX3ZhbHVlcykgPyBfdmFsdWVzIDogW107XG4gICAgdGhpcy5fbGVhZiA9IF9sZWFmIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGhlYXAgdG8gYSBjbG9uZWQgYXJyYXkgd2l0aG91dCBzb3J0aW5nLlxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fbm9kZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBhcmVudCBoYXMgYSBsZWZ0IGNoaWxkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSB7XG4gICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDE7XG4gICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4IDwgdGhpcy5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcGFyZW50IGhhcyBhIHJpZ2h0IGNoaWxkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkge1xuICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMjtcbiAgICByZXR1cm4gcmlnaHRDaGlsZEluZGV4IDwgdGhpcy5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdHdvIG5vZGVzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGFyZUF0KGksIGopIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZSh0aGlzLl9ub2Rlc1tpXSwgdGhpcy5fbm9kZXNbal0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN3YXBzIHR3byBub2RlcyBpbiB0aGUgaGVhcFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3N3YXAoaSwgaikge1xuICAgIGNvbnN0IHRlbXAgPSB0aGlzLl9ub2Rlc1tpXTtcbiAgICB0aGlzLl9ub2Rlc1tpXSA9IHRoaXMuX25vZGVzW2pdO1xuICAgIHRoaXMuX25vZGVzW2pdID0gdGVtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgcGFyZW50IGFuZCBjaGlsZCBzaG91bGQgYmUgc3dhcHBlZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpIHtcbiAgICBpZiAocGFyZW50SW5kZXggPCAwIHx8IHBhcmVudEluZGV4ID49IHRoaXMuc2l6ZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkSW5kZXggPCAwIHx8IGNoaWxkSW5kZXggPj0gdGhpcy5zaXplKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSA+IDA7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgY2hpbGRyZW4gb2YgYSBwYXJlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wYXJlQ2hpbGRyZW5PZihwYXJlbnRJbmRleCkge1xuICAgIGlmICghdGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSAmJiAhdGhpcy5faGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG5cbiAgICBpZiAoIXRoaXMuX2hhc0xlZnRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgIHJldHVybiByaWdodENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9oYXNSaWdodENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4O1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBhcmUgPSB0aGlzLl9jb21wYXJlQXQobGVmdENoaWxkSW5kZXgsIHJpZ2h0Q2hpbGRJbmRleCk7XG4gICAgcmV0dXJuIGNvbXBhcmUgPiAwID8gcmlnaHRDaGlsZEluZGV4IDogbGVmdENoaWxkSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdHdvIGNoaWxkcmVuIGJlZm9yZSBhIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGFyZUNoaWxkcmVuQmVmb3JlKGluZGV4LCBsZWZ0Q2hpbGRJbmRleCwgcmlnaHRDaGlsZEluZGV4KSB7XG4gICAgY29uc3QgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmVBdChyaWdodENoaWxkSW5kZXgsIGxlZnRDaGlsZEluZGV4KTtcblxuICAgIGlmIChjb21wYXJlIDw9IDAgJiYgcmlnaHRDaGlsZEluZGV4IDwgaW5kZXgpIHtcbiAgICAgIHJldHVybiByaWdodENoaWxkSW5kZXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRDaGlsZEluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGJ1YmJsZXMgdXAgYSBub2RlIGlmIGl0J3MgaW4gYSB3cm9uZyBwb3NpdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hlYXBpZnlVcChzdGFydEluZGV4KSB7XG4gICAgbGV0IGNoaWxkSW5kZXggPSBzdGFydEluZGV4O1xuICAgIGxldCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoKGNoaWxkSW5kZXggLSAxKSAvIDIpO1xuXG4gICAgd2hpbGUgKHRoaXMuX3Nob3VsZFN3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpKSB7XG4gICAgICB0aGlzLl9zd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KTtcbiAgICAgIGNoaWxkSW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgIHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoY2hpbGRJbmRleCAtIDEpIC8gMik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGJ1YmJsZXMgZG93biBhIG5vZGUgaWYgaXQncyBpbiBhIHdyb25nIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGVhcGlmeURvd24oc3RhcnRJbmRleCkge1xuICAgIGxldCBwYXJlbnRJbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IGNoaWxkSW5kZXggPSB0aGlzLl9jb21wYXJlQ2hpbGRyZW5PZihwYXJlbnRJbmRleCk7XG5cbiAgICB3aGlsZSAodGhpcy5fc2hvdWxkU3dhcChwYXJlbnRJbmRleCwgY2hpbGRJbmRleCkpIHtcbiAgICAgIHRoaXMuX3N3YXAocGFyZW50SW5kZXgsIGNoaWxkSW5kZXgpO1xuICAgICAgcGFyZW50SW5kZXggPSBjaGlsZEluZGV4O1xuICAgICAgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbk9mKHBhcmVudEluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnViYmxlcyBkb3duIGEgbm9kZSBiZWZvcmUgYSBnaXZlbiBpbmRleFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hlYXBpZnlEb3duVW50aWwoaW5kZXgpIHtcbiAgICBsZXQgcGFyZW50SW5kZXggPSAwO1xuICAgIGxldCBsZWZ0Q2hpbGRJbmRleCA9IDE7XG4gICAgbGV0IHJpZ2h0Q2hpbGRJbmRleCA9IDI7XG4gICAgbGV0IGNoaWxkSW5kZXg7XG5cbiAgICB3aGlsZSAobGVmdENoaWxkSW5kZXggPCBpbmRleCkge1xuICAgICAgY2hpbGRJbmRleCA9IHRoaXMuX2NvbXBhcmVDaGlsZHJlbkJlZm9yZShcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIGxlZnRDaGlsZEluZGV4LFxuICAgICAgICByaWdodENoaWxkSW5kZXhcbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLl9zaG91bGRTd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KSkge1xuICAgICAgICB0aGlzLl9zd2FwKHBhcmVudEluZGV4LCBjaGlsZEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50SW5kZXggPSBjaGlsZEluZGV4O1xuICAgICAgbGVmdENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDE7XG4gICAgICByaWdodENoaWxkSW5kZXggPSAocGFyZW50SW5kZXggKiAyKSArIDI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgaW5zZXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fbm9kZXMucHVzaCh2YWx1ZSk7XG4gICAgdGhpcy5faGVhcGlmeVVwKHRoaXMuc2l6ZSgpIC0gMSk7XG4gICAgaWYgKHRoaXMuX2xlYWYgPT09IG51bGwgfHwgdGhpcy5fY29tcGFyZSh2YWx1ZSwgdGhpcy5fbGVhZikgPiAwKSB7XG4gICAgICB0aGlzLl9sZWFmID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBuZXcgdmFsdWUgaW50byB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtIZWFwfVxuICAgKi9cbiAgcHVzaCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZXh0cmFjdFJvb3QoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5yb290KCk7XG4gICAgdGhpcy5fbm9kZXNbMF0gPSB0aGlzLl9ub2Rlc1t0aGlzLnNpemUoKSAtIDFdO1xuICAgIHRoaXMuX25vZGVzLnBvcCgpO1xuICAgIHRoaXMuX2hlYXBpZnlEb3duKDApO1xuXG4gICAgaWYgKHJvb3QgPT09IHRoaXMuX2xlYWYpIHtcbiAgICAgIHRoaXMuX2xlYWYgPSB0aGlzLnJvb3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXh0cmFjdFJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGhlYXAgc29ydCBhbmQgcmV0dXJuIHRoZSB2YWx1ZXMgc29ydGVkIGJ5IHByaW9yaXR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2FycmF5fVxuICAgKi9cbiAgc29ydCgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5zaXplKCkgLSAxOyBpID4gMDsgaSAtPSAxKSB7XG4gICAgICB0aGlzLl9zd2FwKDAsIGkpO1xuICAgICAgdGhpcy5faGVhcGlmeURvd25VbnRpbChpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25vZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpeGVzIG5vZGUgcG9zaXRpb25zIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBmaXgoKSB7XG4gICAgLy8gZml4IG5vZGUgcG9zaXRpb25zXG4gICAgZm9yIChsZXQgaSA9IE1hdGguZmxvb3IodGhpcy5zaXplKCkgLyAyKSAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICB0aGlzLl9oZWFwaWZ5RG93bihpKTtcbiAgICB9XG5cbiAgICAvLyBmaXggbGVhZiB2YWx1ZVxuICAgIGZvciAobGV0IGkgPSBNYXRoLmZsb29yKHRoaXMuc2l6ZSgpIC8gMik7IGkgPCB0aGlzLnNpemUoKTsgaSArPSAxKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX25vZGVzW2ldO1xuICAgICAgaWYgKHRoaXMuX2xlYWYgPT09IG51bGwgfHwgdGhpcy5fY29tcGFyZSh2YWx1ZSwgdGhpcy5fbGVhZikgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xlYWYgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IGFsbCBoZWFwIG5vZGVzIGFyZSBpbiB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVmFsaWQoKSB7XG4gICAgY29uc3QgaXNWYWxpZFJlY3Vyc2l2ZSA9IChwYXJlbnRJbmRleCkgPT4ge1xuICAgICAgbGV0IGlzVmFsaWRMZWZ0ID0gdHJ1ZTtcbiAgICAgIGxldCBpc1ZhbGlkUmlnaHQgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5faGFzTGVmdENoaWxkKHBhcmVudEluZGV4KSkge1xuICAgICAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IChwYXJlbnRJbmRleCAqIDIpICsgMTtcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmVBdChwYXJlbnRJbmRleCwgbGVmdENoaWxkSW5kZXgpID4gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1ZhbGlkTGVmdCA9IGlzVmFsaWRSZWN1cnNpdmUobGVmdENoaWxkSW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faGFzUmlnaHRDaGlsZChwYXJlbnRJbmRleCkpIHtcbiAgICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gKHBhcmVudEluZGV4ICogMikgKyAyO1xuICAgICAgICBpZiAodGhpcy5fY29tcGFyZUF0KHBhcmVudEluZGV4LCByaWdodENoaWxkSW5kZXgpID4gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1ZhbGlkUmlnaHQgPSBpc1ZhbGlkUmVjdXJzaXZlKHJpZ2h0Q2hpbGRJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc1ZhbGlkTGVmdCAmJiBpc1ZhbGlkUmlnaHQ7XG4gICAgfTtcblxuICAgIHJldHVybiBpc1ZhbGlkUmVjdXJzaXZlKDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaGFsbG93IGNvcHkgb2YgdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7SGVhcH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgSGVhcCh0aGlzLl9jb21wYXJlLCB0aGlzLl9ub2Rlcy5zbGljZSgpLCB0aGlzLl9sZWFmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICByb290KCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25vZGVzWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxlYWYgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGxlYWYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xlYWY7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGhlYXAgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9ub2RlcyA9IFtdO1xuICAgIHRoaXMuX2xlYWYgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIGhlYXAgZnJvbSBhIGFycmF5IG9mIHZhbHVlc1xuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBzdGF0aWMgaGVhcGlmeSh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheSBvZiB2YWx1ZXMnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhcC5oZWFwaWZ5IGV4cGVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBIZWFwKGNvbXBhcmUsIHZhbHVlcykuZml4KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgbGlzdCBvZiB2YWx1ZXMgaXMgYSB2YWxpZCBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICByZXR1cm4gbmV3IEhlYXAoY29tcGFyZSwgdmFsdWVzKS5pc1ZhbGlkKCk7XG4gIH1cbn1cblxuZXhwb3J0cy5IZWFwID0gSGVhcDtcbiIsIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICovXG5cbmNvbnN0IHsgSGVhcCB9ID0gcmVxdWlyZSgnLi9oZWFwJyk7XG5cbmNvbnN0IGdldE1heENvbXBhcmUgPSAoZ2V0Q29tcGFyZVZhbHVlKSA9PiAoYSwgYikgPT4ge1xuICBjb25zdCBhVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShhKSA6IGE7XG4gIGNvbnN0IGJWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGIpIDogYjtcbiAgcmV0dXJuIGFWYWwgPCBiVmFsID8gMSA6IC0xO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgTWF4SGVhcFxuICogQGV4dGVuZHMgSGVhcFxuICovXG5jbGFzcyBNYXhIZWFwIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEBwYXJhbSB7SGVhcH0gW19oZWFwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2V0Q29tcGFyZVZhbHVlLCBfaGVhcCkge1xuICAgIHRoaXMuX2dldENvbXBhcmVWYWx1ZSA9IGdldENvbXBhcmVWYWx1ZTtcbiAgICB0aGlzLl9oZWFwID0gX2hlYXAgfHwgbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIGluc2VydCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgaGVhcCB0byBhIGNsb25lZCBhcnJheSB3aXRob3V0IHNvcnRpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9oZWFwLl9ub2Rlcyk7XG4gIH1cblxuICAvKipcbiAgICogRml4ZXMgbm9kZSBwb3NpdGlvbnMgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIGZpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IGFsbCBoZWFwIG5vZGVzIGFyZSBpbiB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHJvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxlYWYgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGxlYWYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAubGVhZigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGhlYXAgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNFbXB0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNoYWxsb3cgY29weSBvZiB0aGUgTWF4SGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNYXhIZWFwfVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBNYXhIZWFwKHRoaXMuX2dldENvbXBhcmVWYWx1ZSwgdGhpcy5faGVhcC5jbG9uZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBNYXhIZWFwIGZyb20gYW4gYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7TWF4SGVhcH1cbiAgICovXG4gIHN0YXRpYyBoZWFwaWZ5KHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF4SGVhcC5oZWFwaWZ5IGV4cGVjdHMgYW4gYXJyYXknKTtcbiAgICB9XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1heENvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1heEhlYXAoZ2V0Q29tcGFyZVZhbHVlLCBoZWFwKS5maXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBsaXN0IG9mIHZhbHVlcyBpcyBhIHZhbGlkIG1heCBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2FycmF5fSB2YWx1ZXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNIZWFwaWZpZWQodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWF4Q29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmlzVmFsaWQoKTtcbiAgfVxufVxuXG5leHBvcnRzLk1heEhlYXAgPSBNYXhIZWFwO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKi9cblxuY29uc3QgeyBIZWFwIH0gPSByZXF1aXJlKCcuL2hlYXAnKTtcblxuY29uc3QgZ2V0TWluQ29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAtMSA6IDE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNaW5IZWFwXG4gKiBAZXh0ZW5kcyBIZWFwXG4gKi9cbmNsYXNzIE1pbkhlYXAge1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldENvbXBhcmVWYWx1ZV1cbiAgICogQHBhcmFtIHtIZWFwfSBbX2hlYXBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgdGhpcy5fZ2V0Q29tcGFyZVZhbHVlID0gZ2V0Q29tcGFyZVZhbHVlO1xuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBoZWFwIHRvIGEgY2xvbmVkIGFycmF5IHdpdGhvdXQgc29ydGluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2hlYXAuX25vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgbmV3IHZhbHVlIGludG8gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd8b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7TWluSGVhcH1cbiAgICovXG4gIGluc2VydCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyBhIG5ldyB2YWx1ZSBpbnRvIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge0hlYXB9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSByb290IG5vZGUgaW4gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBleHRyYWN0Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIHJvb3Qgbm9kZSBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIHBvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGVhcCBzb3J0IGFuZCByZXR1cm4gdGhlIHZhbHVlcyBzb3J0ZWQgYnkgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICBzb3J0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXhlcyBub2RlIHBvc2l0aW9ucyBpbiB0aGUgaGVhcFxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgZml4KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgYWxsIGhlYXAgbm9kZXMgYXJlIGluIHRoZSByaWdodCBwb3NpdGlvblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc1ZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5yb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGVhZiBub2RlIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgbGVhZigpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaGVhcCBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBoZWFwXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2hlYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBNaW5IZWFwXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge01pbkhlYXB9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IE1pbkhlYXAodGhpcy5fZ2V0Q29tcGFyZVZhbHVlLCB0aGlzLl9oZWFwLmNsb25lKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgYW4gaXRlcmFibGUgb24gdGhlIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIE1pbkhlYXAgZnJvbSBhbiBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHthcnJheX0gdmFsdWVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRDb21wYXJlVmFsdWVdXG4gICAqIEByZXR1cm5zIHtNaW5IZWFwfVxuICAgKi9cbiAgc3RhdGljIGhlYXBpZnkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5IZWFwLmhlYXBpZnkgZXhwZWN0cyBhbiBhcnJheScpO1xuICAgIH1cbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWluQ29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWluSGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGxpc3Qgb2YgdmFsdWVzIGlzIGEgdmFsaWQgbWluIGhlYXBcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7YXJyYXl9IHZhbHVlc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0Q29tcGFyZVZhbHVlXVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0hlYXBpZmllZCh2YWx1ZXMsIGdldENvbXBhcmVWYWx1ZSkge1xuICAgIGNvbnN0IGhlYXAgPSBuZXcgSGVhcChnZXRNaW5Db21wYXJlKGdldENvbXBhcmVWYWx1ZSksIHZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuaXNWYWxpZCgpO1xuICB9XG59XG5cbmV4cG9ydHMuTWluSGVhcCA9IE1pbkhlYXA7XG4iLCJjb25zdCB7IE1pblByaW9yaXR5UXVldWUgfSA9IHJlcXVpcmUoJy4vc3JjL21pblByaW9yaXR5UXVldWUnKTtcbmNvbnN0IHsgTWF4UHJpb3JpdHlRdWV1ZSB9ID0gcmVxdWlyZSgnLi9zcmMvbWF4UHJpb3JpdHlRdWV1ZScpO1xuY29uc3QgeyBQcmlvcml0eVF1ZXVlIH0gPSByZXF1aXJlKCcuL3NyYy9wcmlvcml0eVF1ZXVlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7IE1pblByaW9yaXR5UXVldWUsIE1heFByaW9yaXR5UXVldWUsIFByaW9yaXR5UXVldWUgfTtcbiIsIi8qKlxuICogQGNvcHlyaWdodCAyMDIwIEV5YXMgUmFuam91cyA8ZXlhcy5yYW5qb3VzQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbmNvbnN0IHsgSGVhcCwgTWF4SGVhcCB9ID0gcmVxdWlyZSgnQGRhdGFzdHJ1Y3R1cmVzLWpzL2hlYXAnKTtcblxuY29uc3QgZ2V0TWF4Q29tcGFyZSA9IChnZXRDb21wYXJlVmFsdWUpID0+IChhLCBiKSA9PiB7XG4gIGNvbnN0IGFWYWwgPSB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlID09PSAnZnVuY3Rpb24nID8gZ2V0Q29tcGFyZVZhbHVlKGEpIDogYTtcbiAgY29uc3QgYlZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYikgOiBiO1xuICByZXR1cm4gYVZhbCA8IGJWYWwgPyAxIDogLTE7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNYXhQcmlvcml0eVF1ZXVlXG4gKiBAZXh0ZW5kcyBNYXhIZWFwXG4gKi9cbmNsYXNzIE1heFByaW9yaXR5UXVldWUge1xuICBjb25zdHJ1Y3RvcihnZXRDb21wYXJlVmFsdWUsIF9oZWFwKSB7XG4gICAgaWYgKGdldENvbXBhcmVWYWx1ZSAmJiB0eXBlb2YgZ2V0Q29tcGFyZVZhbHVlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01heFByaW9yaXR5UXVldWUgY29uc3RydWN0b3IgcmVxdWlyZXMgYSBjYWxsYmFjayBmb3Igb2JqZWN0IHZhbHVlcycpO1xuICAgIH1cbiAgICB0aGlzLl9oZWFwID0gX2hlYXAgfHwgbmV3IE1heEhlYXAoZ2V0Q29tcGFyZVZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBoaWdoZXN0IHByaW9yaXR5IGluIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8c3RyaW5nfG9iamVjdH1cbiAgICovXG4gIGZyb250KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLnJvb3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgd2l0aCBsb3dlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgYmFjaygpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5sZWFmKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHZhbHVlIHRvIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgZW5xdWV1ZSh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmluc2VydCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHZhbHVlIHRvIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ3xvYmplY3R9IHZhbHVlXG4gICAqIEByZXR1cm5zIHtNYXhQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgcHVzaCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmVucXVldWUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZGVxdWV1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5leHRyYWN0Um9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgcG9wKCkge1xuICAgIHJldHVybiB0aGlzLmRlcXVldWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgcXVldWUgaXMgZW1wdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaXNFbXB0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5faGVhcC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzb3J0ZWQgbGlzdCBvZiBlbGVtZW50cyBmcm9tIGhpZ2hlc3QgdG8gbG93ZXN0IHByaW9yaXR5XG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge2FycmF5fVxuICAgKi9cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5jbG9uZSgpLnNvcnQoKS5yZXZlcnNlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBvbiB0aGUgbWluIHByaW9yaXR5IHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5zaXplKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgc2l6ZSAtPSAxO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnBvcCgpLFxuICAgICAgICAgIGRvbmU6IHNpemUgPT09IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWUgZnJvbSBhbiBleGlzdGluZyBhcnJheVxuICAgKiBAcHVibGljXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge01heFByaW9yaXR5UXVldWV9XG4gICAqL1xuICBzdGF0aWMgZnJvbUFycmF5KHZhbHVlcywgZ2V0Q29tcGFyZVZhbHVlKSB7XG4gICAgY29uc3QgaGVhcCA9IG5ldyBIZWFwKGdldE1heENvbXBhcmUoZ2V0Q29tcGFyZVZhbHVlKSwgdmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IE1heFByaW9yaXR5UXVldWUoXG4gICAgICBnZXRDb21wYXJlVmFsdWUsXG4gICAgICBuZXcgTWF4SGVhcChnZXRDb21wYXJlVmFsdWUsIGhlYXApLmZpeCgpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnRzLk1heFByaW9yaXR5UXVldWUgPSBNYXhQcmlvcml0eVF1ZXVlO1xuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMjAgRXlhcyBSYW5qb3VzIDxleWFzLnJhbmpvdXNAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuY29uc3QgeyBIZWFwLCBNaW5IZWFwIH0gPSByZXF1aXJlKCdAZGF0YXN0cnVjdHVyZXMtanMvaGVhcCcpO1xuXG5jb25zdCBnZXRNaW5Db21wYXJlID0gKGdldENvbXBhcmVWYWx1ZSkgPT4gKGEsIGIpID0+IHtcbiAgY29uc3QgYVZhbCA9IHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgPT09ICdmdW5jdGlvbicgPyBnZXRDb21wYXJlVmFsdWUoYSkgOiBhO1xuICBjb25zdCBiVmFsID0gdHlwZW9mIGdldENvbXBhcmVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGdldENvbXBhcmVWYWx1ZShiKSA6IGI7XG4gIHJldHVybiBhVmFsIDwgYlZhbCA/IC0xIDogMTtcbn07XG5cbi8qKlxuICogQGNsYXNzIE1pblByaW9yaXR5UXVldWVcbiAqL1xuY2xhc3MgTWluUHJpb3JpdHlRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKGdldENvbXBhcmVWYWx1ZSwgX2hlYXApIHtcbiAgICBpZiAoZ2V0Q29tcGFyZVZhbHVlICYmIHR5cGVvZiBnZXRDb21wYXJlVmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWluUHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNhbGxiYWNrIGZvciBvYmplY3QgdmFsdWVzJyk7XG4gICAgfVxuICAgIHRoaXMuX2hlYXAgPSBfaGVhcCB8fCBuZXcgTWluSGVhcChnZXRDb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01pblByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge01pblByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBtaW4gcHJpb3JpdHkgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLnNpemUoKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBzaXplIC09IDE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMucG9wKCksXG4gICAgICAgICAgZG9uZTogc2l6ZSA9PT0gLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcmlvcml0eSBxdWV1ZSBmcm9tIGFuIGV4aXN0aW5nIGFycmF5XG4gICAqIEBwdWJsaWNcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7TWluUHJpb3JpdHlRdWV1ZX1cbiAgICovXG4gIHN0YXRpYyBmcm9tQXJyYXkodmFsdWVzLCBnZXRDb21wYXJlVmFsdWUpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEhlYXAoZ2V0TWluQ29tcGFyZShnZXRDb21wYXJlVmFsdWUpLCB2YWx1ZXMpO1xuICAgIHJldHVybiBuZXcgTWluUHJpb3JpdHlRdWV1ZShcbiAgICAgIGdldENvbXBhcmVWYWx1ZSxcbiAgICAgIG5ldyBNaW5IZWFwKGdldENvbXBhcmVWYWx1ZSwgaGVhcCkuZml4KClcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydHMuTWluUHJpb3JpdHlRdWV1ZSA9IE1pblByaW9yaXR5UXVldWU7XG4iLCIvKipcbiAqIEBjb3B5cmlnaHQgMjAyMCBFeWFzIFJhbmpvdXMgPGV5YXMucmFuam91c0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG5jb25zdCB7IEhlYXAgfSA9IHJlcXVpcmUoJ0BkYXRhc3RydWN0dXJlcy1qcy9oZWFwJyk7XG5cbi8qKlxuICogQGNsYXNzIFByaW9yaXR5UXVldWVcbiAqL1xuY2xhc3MgUHJpb3JpdHlRdWV1ZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJpb3JpdHkgcXVldWVcbiAgICogQHBhcmFtcyB7ZnVuY3Rpb259IGNvbXBhcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmUsIF92YWx1ZXMpIHtcbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUHJpb3JpdHlRdWV1ZSBjb25zdHJ1Y3RvciBleHBlY3RzIGEgY29tcGFyZSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9oZWFwID0gbmV3IEhlYXAoY29tcGFyZSwgX3ZhbHVlcyk7XG4gICAgaWYgKF92YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2hlYXAuZml4KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGhpZ2hlc3QgcHJpb3JpdHkgaW4gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge251bWJlcnxzdHJpbmd8b2JqZWN0fVxuICAgKi9cbiAgZnJvbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAucm9vdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCB3aXRoIGxvd2VzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBiYWNrKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlYWYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXAuaW5zZXJ0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIHF1ZXVlXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfG9iamVjdH0gdmFsdWVcbiAgICogQHJldHVybnMge1ByaW9yaXR5UXVldWV9XG4gICAqL1xuICBwdXNoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5xdWV1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmV4dHJhY3RSb290KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyBhbiBlbGVtZW50IHdpdGggaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHN0cmluZ3xvYmplY3R9XG4gICAqL1xuICBwb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVxdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWVcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5zaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eVxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNvcnRlZCBsaXN0IG9mIGVsZW1lbnRzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7YXJyYXl9XG4gICAqL1xuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmNsb25lKCkuc29ydCgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIG9uIHRoZSBwcmlvcml0eSBxdWV1ZVxuICAgKiBAcHVibGljXG4gICAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIHNpemUgLT0gMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wb3AoKSxcbiAgICAgICAgICBkb25lOiBzaXplID09PSAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByaW9yaXR5IHF1ZXVlIGZyb20gYW4gZXhpc3RpbmcgYXJyYXlcbiAgICogQHB1YmxpY1xuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtQcmlvcml0eVF1ZXVlfVxuICAgKi9cbiAgc3RhdGljIGZyb21BcnJheSh2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgICByZXR1cm4gbmV3IFByaW9yaXR5UXVldWUoY29tcGFyZSwgdmFsdWVzKTtcbiAgfVxufVxuXG5leHBvcnRzLlByaW9yaXR5UXVldWUgPSBQcmlvcml0eVF1ZXVlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGJhc2VBc3NpZ25JbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25JbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgY29weVN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzSW4nKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzTWFwID0gcmVxdWlyZSgnLi9pc01hcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU2V0ID0gcmVxdWlyZSgnLi9pc1NldCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfRkxBVF9GTEFHID0gMixcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gRGVlcCBjbG9uZVxuICogIDIgLSBGbGF0dGVuIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG4gKiAgNCAtIENsb25lIHN5bWJvbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBpc0RlZXAgPSBiaXRtYXNrICYgQ0xPTkVfREVFUF9GTEFHLFxuICAgICAgaXNGbGF0ID0gYml0bWFzayAmIENMT05FX0ZMQVRfRkxBRyxcbiAgICAgIGlzRnVsbCA9IGJpdG1hc2sgJiBDTE9ORV9TWU1CT0xTX0ZMQUc7XG5cbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCwgc3RhY2spIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gY29weUFycmF5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcblxuICAgIGlmIChpc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZUJ1ZmZlcih2YWx1ZSwgaXNEZWVwKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gKGlzRmxhdCB8fCBpc0Z1bmMpID8ge30gOiBpbml0Q2xvbmVPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGlzRmxhdFxuICAgICAgICAgID8gY29weVN5bWJvbHNJbih2YWx1ZSwgYmFzZUFzc2lnbkluKHJlc3VsdCwgdmFsdWUpKVxuICAgICAgICAgIDogY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgaWYgKGlzU2V0KHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oc3ViVmFsdWUpIHtcbiAgICAgIHJlc3VsdC5hZGQoYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdWJWYWx1ZSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoaXNNYXAodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGtleXNGdW5jID0gaXNGdWxsXG4gICAgPyAoaXNGbGF0ID8gZ2V0QWxsS2V5c0luIDogZ2V0QWxsS2V5cylcbiAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IGtleXNGdW5jKHZhbHVlKTtcbiAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzdWJWYWx1ZTtcbiAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0QWxsS2V5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1NldGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzU2V0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gc2V0VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1NldDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXNJbiA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5c0luKG9iamVjdCk7XG4gIH1cbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzSW47XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGBzeW1ib2xgIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN5bWJvbCBUaGUgc3ltYm9sIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzeW1ib2wgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbG9uZVN5bWJvbChzeW1ib2wpIHtcbiAgcmV0dXJuIHN5bWJvbFZhbHVlT2YgPyBPYmplY3Qoc3ltYm9sVmFsdWVPZi5jYWxsKHN5bWJvbCkpIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTeW1ib2w7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpO1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICB2YXIgaXNOZXcgPSAhb2JqZWN0O1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9scyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXM7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzSW4sIGdldFN5bWJvbHNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5c0luO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFByb3RvdHlwZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHNJbjtcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKSxcbiAgICBjbG9uZURhdGFWaWV3ID0gcmVxdWlyZSgnLi9fY2xvbmVEYXRhVmlldycpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVN5bWJvbCA9IHJlcXVpcmUoJy4vX2Nsb25lU3ltYm9sJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBNYXBgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIGBTZXRgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlXG4gKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBleGNlcHQgdGhhdCBpdCBpbmNsdWRlcyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBuYXRpdmVLZXlzSW4ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXNJbjtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uY2xvbmVgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGNsb25lcyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZWN1cnNpdmVseSBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZVxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmVEZWVwKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coZGVlcFswXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBjbG9uZURlZXAodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgQ0xPTkVfREVFUF9GTEFHIHwgQ0xPTkVfU1lNQk9MU19GTEFHKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgYmFzZUlzTWFwID0gcmVxdWlyZSgnLi9fYmFzZUlzTWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc01hcCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzTWFwO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc01hcChuZXcgTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFwO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5c0luID0gcmVxdWlyZSgnLi9fYmFzZUtleXNJbicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJBcnJheTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL2tpZHMvMS5qcGdcIixcblx0XCIuLzIuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcy8yLmpwZ1wiLFxuXHRcIi4vMy5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzLzMuanBnXCIsXG5cdFwiLi80LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL2tpZHMvNC5qcGdcIixcblx0XCIuLzUuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMva2lkcy81LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9raWRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8wLmpwZ1wiLFxuXHRcIi4vMS5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvMS5qcGdcIixcblx0XCIuLzEwLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8xMC5qcGdcIixcblx0XCIuLzExLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8xMS5qcGdcIixcblx0XCIuLzEyLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8xMi5qcGdcIixcblx0XCIuLzEzLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8xMy5qcGdcIixcblx0XCIuLzE0LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8xNC5qcGdcIixcblx0XCIuLzIuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyLzIuanBnXCIsXG5cdFwiLi8zLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci8zLmpwZ1wiLFxuXHRcIi4vNC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvNC5qcGdcIixcblx0XCIuLzUuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyLzUuanBnXCIsXG5cdFwiLi82LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci82LmpwZ1wiLFxuXHRcIi4vNy5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIvNy5qcGdcIixcblx0XCIuLzguanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvYmVkcm9vbXMvbWFzdGVyLzguanBnXCIsXG5cdFwiLi85LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3Rlci85LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9iZWRyb29tcy9tYXN0ZXIgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RpbmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RyZXNzaW5ncy8wLmpwZ1wiLFxuXHRcIi4vMS5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9kcmVzc2luZ3MvMS5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvZHJlc3NpbmdzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3JlY2VwdGlvbnMvMC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvMS5qcGdcIixcblx0XCIuLzIuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cy8yLmpwZ1wiLFxuXHRcIi4vMy5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzLzMuanBnXCIsXG5cdFwiLi80LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL3R2dW5pdHMvNC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvdHZ1bml0cyBzeW5jIFxcXFwuKHBuZyU3Q2pwZT9nJTdDc3ZnKSRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vMC5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL2tpZHMvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzLzEuanBnXCIsXG5cdFwiLi8yLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcy8yLmpwZ1wiLFxuXHRcIi4vMy5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL2tpZHMvMy5qcGdcIixcblx0XCIuLzQuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9raWRzLzQuanBnXCIsXG5cdFwiLi81LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcy81LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL2tpZHMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXIvMC5qcGdcIixcblx0XCIuLzEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXIvMS5qcGdcIixcblx0XCIuLzEwLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzEwLmpwZ1wiLFxuXHRcIi4vMTEuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXIvMTEuanBnXCIsXG5cdFwiLi8xMi5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2JlZHJvb21zL21hc3Rlci8xMi5qcGdcIixcblx0XCIuLzEzLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzEzLmpwZ1wiLFxuXHRcIi4vMTQuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXIvMTQuanBnXCIsXG5cdFwiLi8yLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzIuanBnXCIsXG5cdFwiLi8zLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzMuanBnXCIsXG5cdFwiLi80LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzQuanBnXCIsXG5cdFwiLi81LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzUuanBnXCIsXG5cdFwiLi82LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzYuanBnXCIsXG5cdFwiLi83LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzcuanBnXCIsXG5cdFwiLi84LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzguanBnXCIsXG5cdFwiLi85LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyLzkuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMvbWFzdGVyIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZHJlc3NpbmdzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZHJlc3NpbmdzLzEuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvZHJlc3NpbmdzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi8wLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucy8wLmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3JlY2VwdGlvbnMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwidmFyIG1hcCA9IHtcblx0XCIuLzAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLzAuanBnXCIsXG5cdFwiLi8xLmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cy8xLmpwZ1wiLFxuXHRcIi4vMi5qcGdcIjogXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMvMi5qcGdcIixcblx0XCIuLzMuanBnXCI6IFwiLi9zcmMvYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC90dnVuaXRzLzMuanBnXCIsXG5cdFwiLi80LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cy80LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL3R2dW5pdHMgc3luYyBcXFxcLihwbmclN0NqcGU/ZyU3Q3N2ZykkXCI7IiwiaW1wb3J0IGxvZ28gZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9sb2dvLmpwZydcbmltcG9ydCBjYXJ0TG9nbyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2NhcnQuc3ZnJ1xuaW1wb3J0IG1lbnVMb2dvIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMvbWVudS5zdmcnXG5pbXBvcnQgcHJldkltZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2xlZnQuc3ZnJ1xuaW1wb3J0IG5leHRJbWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy9yaWdodC5zdmcnXG5pbXBvcnQgdVByZXZJbWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy91bGVmdC5zdmcnXG5pbXBvcnQgdU5leHRJbWcgZnJvbSAnLi4vYXNzZXRzL2ltYWdlcy9pY29ucy91cmlnaHQuc3ZnJ1xuaW1wb3J0IHhDbG9zZSBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3guc3ZnJ1xuaW1wb3J0IGRvdEljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2RvdC5zdmcnXG5pbXBvcnQgc2RvdEljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3Nkb3Quc3ZnJ1xuaW1wb3J0IHgySWNuIGZyb20gJy4uL2Fzc2V0cy9pbWFnZXMvaWNvbnMveDIuc3ZnJ1xuaW1wb3J0IHJlbW92ZUljbiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3JlbW92ZS1jYXJ0LnN2ZydcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL2xvY2FsLXN0b3JhZ2UnXG5cbmltcG9ydCBmYiBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2ZiLnN2ZydcbmltcG9ydCBpZyBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL2lnLnN2ZydcbmltcG9ydCB3YSBmcm9tICcuLi9hc3NldHMvaW1hZ2VzL2ljb25zL3dhLnN2ZydcbmltcG9ydCBkYiBmcm9tICcuL2RiLmpzb24nXG5cbmltcG9ydCB7IFByaW9yaXR5UXVldWUgfSBmcm9tICdAZGF0YXN0cnVjdHVyZXMtanMvcHJpb3JpdHktcXVldWUnXG5pbXBvcnQgeyBuYW5vaWQgfSBmcm9tICduYW5vaWQnXG5jb25zdCBjbG9uZURlZXAgPSByZXF1aXJlKCdsb2Rhc2gvY2xvbmVkZWVwJylcblxubGV0IHByb2R1Y3RzID0gZGIuUHJvZHVjdHNcblxuZXhwb3J0IGNvbnN0IG1pZGRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaWRkbGUtY29udGFpbmVyJylcbmV4cG9ydCBjb25zdCBoZWFkZXJVcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItdXBwZXInKVxuZXhwb3J0IGNvbnN0IGFjdGlvbnNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9ucy1jb250YWluZXInKVxuZXhwb3J0IGNvbnN0IGNsZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGYnKVxuZXhwb3J0IGNvbnN0IGxhbmdCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2xjdC1sYW5nJylcbmV4cG9ydCBjb25zdCBkcmVzc2luZ3NCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJlc3NpbmdzJylcbmV4cG9ydCBjb25zdCBob21lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvbWUnKVxuZXhwb3J0IGNvbnN0IGJlZHJvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JlZHJvb21zJylcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWR1bHRzLWJlZHJvb21zJylcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna2lkcy1iZWRyb29tcycpXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRpb25zJylcbmV4cG9ydCBjb25zdCB0dnVuaXRzQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2dW5pdHMnKVxuZXhwb3J0IGNvbnN0IGRpbmluZ3Jvb21zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpbmluZ3Jvb21zJylcbmV4cG9ydCBjb25zdCBzcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NyY2gtaW4nKVxuZXhwb3J0IGNvbnN0IGZ0ciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdHInKVxuZXhwb3J0IGNvbnN0IG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpXG5leHBvcnQgY29uc3QgaG9tZVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG9tZS1wJylcbmV4cG9ydCBjb25zdCBkcmVzc2luZ3NQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyZXNzaW5ncy1wJylcbmV4cG9ydCBjb25zdCBhYmVkcm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FiZWRyb29tcy1wJylcbmV4cG9ydCBjb25zdCBrYmVkcm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2tiZWRyb29tcy1wJylcbmV4cG9ydCBjb25zdCByZWNlcHRpb25zUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRpb25zLXAnKVxuZXhwb3J0IGNvbnN0IHR2dW5pdHNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2dW5pdHMtcCcpXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpbmluZ3Jvb21zLXAnKVxuZXhwb3J0IGNvbnN0IGFkZHJlc3NQb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcy1wb3B1cCcpXG5cbmV4cG9ydCBjb25zdCBsb2dvSW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBjYXJ0SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBtZW51SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCB4SW1nID0gbmV3IEltYWdlKClcbmV4cG9ydCBjb25zdCBmYkltZyA9IG5ldyBJbWFnZSgpXG5leHBvcnQgY29uc3QgaWdJbWcgPSBuZXcgSW1hZ2UoKVxuZXhwb3J0IGNvbnN0IHdhSW1nID0gbmV3IEltYWdlKClcblxubG9nb0ltZy5zcmMgPSBsb2dvXG5jYXJ0SW1nLnNyYyA9IGNhcnRMb2dvXG5tZW51SW1nLnNyYyA9IG1lbnVMb2dvXG54SW1nLnNyYyA9IHhDbG9zZVxuZmJJbWcuc3JjID0gZmJcbmlnSW1nLnNyYyA9IGlnXG53YUltZy5zcmMgPSB3YVxuXG5jYXJ0SW1nLnNldEF0dHJpYnV0ZShcbiAgICAnc3R5bGUnLFxuICAgICd3aWR0aDogNDBweDtoZWlnaHQ6IDQwcHg7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgLTVweCk7J1xuKVxubWVudUltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiA0MHB4O2hlaWdodDogNDBweDsnKVxueEltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAyMHB4O2hlaWdodDogMjBweDsnKVxuXG5jb25zdCBzbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbScpXG5jb25zdCBmYmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmJsJylcbmNvbnN0IGlnbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZ2wnKVxuY29uc3QgcG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4nKVxuZmJsLmFwcGVuZENoaWxkKGZiSW1nKVxuaWdsLmFwcGVuZENoaWxkKGlnSW1nKVxucG4uYXBwZW5kQ2hpbGQod2FJbWcpXG5zbS5hcHBlbmRDaGlsZChmYmwpXG5zbS5hcHBlbmRDaGlsZChpZ2wpXG5zbS5hcHBlbmRDaGlsZChwbilcblxubWVudUltZy5jbGFzc0xpc3QuYWRkKCdtb2JpbGUnKVxubWVudS5hcHBlbmRDaGlsZCh4SW1nKVxuXG5leHBvcnQgY29uc3QgZHJlc3NpbmdzQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2RyZXNzaW5ncycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgYWJlZHJvb21zQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL21hc3RlcicsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3Qga2JlZHJvb21zQXJyID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvZGlzcGxheWVkL2JlZHJvb21zL2tpZHMnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IHJlY2VwdGlvbnNBcnIgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9kaXNwbGF5ZWQvcmVjZXB0aW9ucycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgdHZ1bml0c0FyciA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC90dnVuaXRzJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcbmV4cG9ydCBjb25zdCBkaW5pbmdyb29tc0FyciA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL2Rpc3BsYXllZC9kaW5pbmdyb29tcycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5cbmV4cG9ydCBjb25zdCBkcmVzc2luZ3NBcnJPRyA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RyZXNzaW5ncycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgYWJlZHJvb21zQXJyT0cgPSBpbXBvcnRBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAnLi4vYXNzZXRzL2ltYWdlcy9waWN0dXJlcy9wcm9kdWN0cy9vcmlnaW5hbC9iZWRyb29tcy9tYXN0ZXInLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgL1xcLihwbmd8anBlP2d8c3ZnKSQvXG4gICAgKVxuKVxuZXhwb3J0IGNvbnN0IGtiZWRyb29tc0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvYmVkcm9vbXMva2lkcycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgcmVjZXB0aW9uc0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvcmVjZXB0aW9ucycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgdHZ1bml0c0Fyck9HID0gaW1wb3J0QWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgJy4uL2Fzc2V0cy9pbWFnZXMvcGljdHVyZXMvcHJvZHVjdHMvb3JpZ2luYWwvdHZ1bml0cycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvXFwuKHBuZ3xqcGU/Z3xzdmcpJC9cbiAgICApXG4pXG5leHBvcnQgY29uc3QgZGluaW5ncm9vbXNBcnJPRyA9IGltcG9ydEFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgICcuLi9hc3NldHMvaW1hZ2VzL3BpY3R1cmVzL3Byb2R1Y3RzL29yaWdpbmFsL2RpbmluZ3Jvb21zJyxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC9cXC4ocG5nfGpwZT9nfHN2ZykkL1xuICAgIClcbilcblxuZXhwb3J0IGNvbnN0IG5hdkJ0bnMgPSBbXG4gICAgaG9tZUJ0bixcbiAgICBkcmVzc2luZ3NCdG4sXG4gICAgYWJlZHJvb21zQnRuLFxuICAgIGtiZWRyb29tc0J0bixcbiAgICByZWNlcHRpb25zQnRuLFxuICAgIHR2dW5pdHNCdG4sXG4gICAgZGluaW5ncm9vbXNCdG4sXG5dXG5leHBvcnQgY29uc3QgbmF2UCA9IFtcbiAgICBob21lUCxcbiAgICBkcmVzc2luZ3NQLFxuICAgIGFiZWRyb29tc1AsXG4gICAga2JlZHJvb21zUCxcbiAgICByZWNlcHRpb25zUCxcbiAgICB0dnVuaXRzUCxcbiAgICBkaW5pbmdyb29tc1AsXG5dXG5jb25zdCBuYXZBciA9IFtcbiAgICAn2KfZhNix2KbZitiz2YrYqScsXG4gICAgJ9iv2LHZitiz2YbYrCcsXG4gICAgJ9i62LHZgSDZhtmI2YUg2LHYptmK2LPZitipJyxcbiAgICAn2LrYsdmBINmG2YjZhSDYp9i32YHYp9mEJyxcbiAgICAn2LXYp9mE2YjZhtin2KonLFxuICAgICfZhdmD2KrYqNin2KonLFxuICAgICfYutix2YEg2LPZgdix2KknLFxuXVxuY29uc3QgbmF2RW4gPSBbXG4gICAgJ0hvbWUnLFxuICAgICdEcmVzc2luZ3MnLFxuICAgICdNYXN0ZXIgQmVkcm9vbXMnLFxuICAgICdLaWRzIEJlZHJvb21zJyxcbiAgICAnUmVjZXB0aW9ucycsXG4gICAgJ1RWIFVuaXRzJyxcbiAgICAnRGluaW5nIFJvb21zJyxcbl1cbmNvbnN0IG5hdkFyMiA9IFtcbiAgICAn2KfZhNix2KbZitiz2YrYqScsXG4gICAgJ9iv2LHZitiz2YbYrCcsXG4gICAgJ9i62LHZgSDZhtmI2YUg2LHYptmK2LPZitipJyxcbiAgICAn2LrYsdmBINmG2YjZhSDYp9i32YHYp9mEJyxcbiAgICAn2LXYp9mE2YjZhtin2KonLFxuICAgICfZhdmD2KrYqNin2KonLFxuICAgICfYutix2YEg2LPZgdix2KknLFxuXVxuY29uc3QgbmF2RW4yID0gW1xuICAgICdIb21lJyxcbiAgICAnRHJlc3NpbmdzJyxcbiAgICAnTWFzdGVyIEJlZHJvb21zJyxcbiAgICAnS2lkcyBCZWRyb29tcycsXG4gICAgJ1JlY2VwdGlvbnMnLFxuICAgICdUViBVbml0cycsXG4gICAgJ0RpbmluZyBSb29tcycsXG5dXG5cbmNvbnN0IGRyZXNzaW5nc0RldGFpbHMgPSBbXVxuY29uc3QgS2lkc0JlZHJvb21zRGV0YWlscyA9IFtdXG5jb25zdCBNYXN0ZXJCZWRyb29tc0RldGFpbHMgPSBbXVxuY29uc3QgRGluaW5nUm9vbXNEZXRhaWxzID0gW11cbmNvbnN0IFJlY2VwdGlvbnNEZXRhaWxzID0gW11cbmNvbnN0IFRWVW5pdHNEZXRhaWxzID0gW11cblxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyRGV0YWlscyA9IFtdXG5jb25zdCByZWNvbW1lbmRhdGlvbnNBcnIgPSB7fVxuY29uc3QgcmVjb21tZW5kYXRpb25zQXJyT0cgPSB7fVxuXG5sZXQgc2VhcmNoQXJyID0ge31cbmxldCBzZWFyY2hBcnJPRyA9IHt9XG5sZXQgc2VhcmNoQXJyRGV0YWlscyA9IFtdXG5cbmxldCBjYXJ0QXJyRGV0YWlscyA9IFtdXG5sZXQgY2FydEFyciA9IHt9XG5sZXQgY2FydEFyck9HID0ge31cbmxldCBjYXJ0SW5kZXhlcyA9IFtdXG5cbmxldCBfYWRkcmVzcyA9IHtcbiAgICB1c2VybmFtZTogJ3UnLFxuICAgIHBob25lOiAncCcsXG4gICAgZW1haWw6ICdlJyxcbiAgICBjaXR5OiAnYycsXG4gICAgYXJlYTogJ2EnLFxuICAgIHN0cmVldDogJ3MnLFxuICAgIGJ1aWxkaW5nOiAnYicsXG4gICAgZmxvb3I6ICdmJyxcbiAgICBhcGFydG1lbnQ6ICdhcHQnLFxuICAgIGxhbmRtYXJrOiAnbCcsXG4gICAgaW5zdHJ1Y3Rpb25zOiAnaScsXG4gICAgZXhpc3RzOiBmYWxzZSxcbn1cblxubGV0IGYxID0gU3RvcmFnZS5nZXREZXRhaWxzKClcbmxldCBmMiA9IFN0b3JhZ2UuZ2V0QXJyKClcbmxldCBmMyA9IFN0b3JhZ2UuZ2V0QXJyT2coKVxubGV0IGY0ID0gU3RvcmFnZS5nZXRJbmRleGVzKClcbmxldCBmNSA9IFN0b3JhZ2UuZ2V0QWRkcmVzcygpXG5cbmlmIChmMSkge1xuICAgIGNhcnRBcnJEZXRhaWxzID0gSlNPTi5wYXJzZShmMSlcbn1cblxuaWYgKGYyKSB7XG4gICAgY2FydEFyciA9IEpTT04ucGFyc2UoZjIpXG59XG5cbmlmIChmMykge1xuICAgIGNhcnRBcnJPRyA9IEpTT04ucGFyc2UoZjMpXG59XG5cbmlmIChmNCkge1xuICAgIGNhcnRJbmRleGVzID0gSlNPTi5wYXJzZShmNClcbn1cblxuaWYgKGY1KSB7XG4gICAgX2FkZHJlc3MgPSBKU09OLnBhcnNlKGY1KVxufVxuXG5sZXQgcmVzdWx0c1F1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoKGEsIGIpID0+IHtcbiAgICBpZiAoYVsxXSA+IGJbMV0pIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGlmIChhWzFdIDwgYlsxXSkge1xuICAgICAgICByZXR1cm4gMVxuICAgIH1cbn0pXG5cbmxldCBpaWkgPSAwXG5sZXQgdHAgPSAwXG5sZXQgZmxhZyA9ICdwYWdlJ1xubGV0IG5mbGFnID0gdHJ1ZVxubGV0IGN1cnJJdGVtID0gW11cblxucHJvZHVjdHMuZm9yRWFjaCgocCkgPT4ge1xuICAgIHN3aXRjaCAocC5wcm9kdWN0X3R5cGUpIHtcbiAgICAgICAgY2FzZSAnRHJlc3NpbmdzJzpcbiAgICAgICAgICAgIGRyZXNzaW5nc0RldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uc0FycltgJHtpaWl9LiR7ZXh9YF0gPSBkcmVzc2luZ3NBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gZHJlc3NpbmdzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgaWlpKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ0tpZHMgQmVkcm9vbXMnOlxuICAgICAgICAgICAgS2lkc0JlZHJvb21zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IGtiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBrYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnTWFzdGVyIEJlZHJvb21zJzpcbiAgICAgICAgICAgIE1hc3RlckJlZHJvb21zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IGFiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJPR1tgJHtpaWl9LiR7ZXh9YF0gPSBhYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnRGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgRGluaW5nUm9vbXNEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICAgICAgICAgIGlmIChwLnJlY29tbWVuZGVkID09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJbYCR7aWlpfS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gZGluaW5ncm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICBpaWkrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnUmVjZXB0aW9ucyc6XG4gICAgICAgICAgICBSZWNlcHRpb25zRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IHJlY2VwdGlvbnNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gcmVjZXB0aW9uc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdUViBVbml0cyc6XG4gICAgICAgICAgICBUVlVuaXRzRGV0YWlscy5wdXNoKHAuaW5kZXgpXG4gICAgICAgICAgICBpZiAocC5yZWNvbW1lbmRlZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyW2Ake2lpaX0uJHtleH1gXSA9IHR2dW5pdHNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zQXJyT0dbYCR7aWlpfS4ke2V4fWBdID0gdHZ1bml0c0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgIGlpaSsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKHAucmVjb21tZW5kZWQgPT0gMSkge1xuICAgICAgICByZWNvbW1lbmRhdGlvbnNBcnJEZXRhaWxzLnB1c2gocC5pbmRleClcbiAgICB9XG59KVxuXG5nb0hvbWUoKVxuc3dpdGNoTGFuZygnZW4nKVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0QWxsKHIpIHtcbiAgICBsZXQgaW1hZ2VzID0ge31cbiAgICByLmtleXMoKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgaW1hZ2VzW2l0ZW0ucmVwbGFjZSgnLi8nLCAnJyldID0gcihpdGVtKVxuICAgIH0pXG4gICAgcmV0dXJuIGltYWdlc1xufVxuXG5mdW5jdGlvbiBwb3BVcChtLCBpKSB7XG4gICAgbGV0IHBvcHVwID1cbiAgICAgICAgbSA9PSAxXG4gICAgICAgICAgICA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBteVBvcHVwLSR7aX1gKVxuICAgICAgICAgICAgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlQb3B1cDInKVxuICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICB9LCAxMDAwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VibWl0QWRkcmVzcygpIHtcbiAgICBsZXQgdW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1uYW1lJylcbiAgICBsZXQgcG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGhvbmUtbnVtJylcbiAgICBsZXQgZW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwtYWRkcmVzcycpXG4gICAgbGV0IGNpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eScpXG4gICAgbGV0IGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJlYScpXG4gICAgbGV0IHN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cmVldCcpXG4gICAgbGV0IGJ1aWxkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1aWxkaW5nJylcbiAgICBsZXQgZmxvb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3InKVxuICAgIGxldCBhcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBhcnRtZW50JylcbiAgICBsZXQgbGFuZG1hcmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZG1hcmsnKVxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zdHJ1Y3Rpb25zJylcblxuICAgIGlmIChcbiAgICAgICAgdW4ucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBwbi5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGVtYWlsLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgY2l0eS5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGFyZWEucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBzdC5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGJ1aWxkaW5nLnJlcG9ydFZhbGlkaXR5KCkgJiZcbiAgICAgICAgZmxvb3IucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBhcHQucmVwb3J0VmFsaWRpdHkoKSAmJlxuICAgICAgICBsYW5kbWFyay5yZXBvcnRWYWxpZGl0eSgpICYmXG4gICAgICAgIGluc3RydWN0aW9ucy5yZXBvcnRWYWxpZGl0eSgpXG4gICAgKSB7XG4gICAgICAgIF9hZGRyZXNzID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVuLnZhbHVlLFxuICAgICAgICAgICAgcGhvbmU6IHBuLnZhbHVlLFxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgY2l0eTogY2l0eS52YWx1ZSxcbiAgICAgICAgICAgIGFyZWE6IGFyZWEudmFsdWUsXG4gICAgICAgICAgICBzdHJlZXQ6IHN0LnZhbHVlLFxuICAgICAgICAgICAgYnVpbGRpbmc6IGJ1aWxkaW5nLnZhbHVlLFxuICAgICAgICAgICAgZmxvb3I6IGZsb29yLnZhbHVlLFxuICAgICAgICAgICAgYXBhcnRtZW50OiBhcHQudmFsdWUsXG4gICAgICAgICAgICBsYW5kbWFyazogbGFuZG1hcmsudmFsdWUsXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnM6IGluc3RydWN0aW9ucy52YWx1ZSxcbiAgICAgICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgfVxuXG4gICAgICAgIHVuLnZhbHVlID0gJydcbiAgICAgICAgcG4udmFsdWUgPSAnJ1xuICAgICAgICBlbWFpbC52YWx1ZSA9ICcnXG4gICAgICAgIGNpdHkudmFsdWUgPSAnJ1xuICAgICAgICBhcmVhLnZhbHVlID0gJydcbiAgICAgICAgc3QudmFsdWUgPSAnJ1xuICAgICAgICBidWlsZGluZy52YWx1ZSA9ICcnXG4gICAgICAgIGZsb29yLnZhbHVlID0gJydcbiAgICAgICAgYXB0LnZhbHVlID0gJydcbiAgICAgICAgbGFuZG1hcmsudmFsdWUgPSAnJ1xuICAgICAgICBpbnN0cnVjdGlvbnMudmFsdWUgPSAnJ1xuXG4gICAgICAgIFN0b3JhZ2Uuc2F2ZUFkZHJlc3MoX2FkZHJlc3MpXG4gICAgICAgIGNvbnN0IGJsdXJyZWQgPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuXG4gICAgICAgIGNvbnN0IGNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRyZXNzLXBvcHVwJylcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBibHVycmVkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBibHVycmVkW2tdLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwJylcbiAgICAgICAgfVxuICAgICAgICBjb24uc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lOycpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6aW8nKS5yZW1vdmUoKVxuXG4gICAgICAgIHBvcHVsYXRlT3JkZXIoKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFkZHJlc3MoKSB7XG4gICAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1hZGRyZXNzJylcbiAgICBjb25zdCB4MyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd4MycpXG4gICAgbGV0IGFzdHJzID0gW11cbiAgICBsZXQgcHMgPSBbXVxuICAgIGxldCBhc3RyID0gJydcbiAgICBsZXQgcCA9ICcnXG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCAxMTsgbCsrKSB7XG4gICAgICAgIGlmIChsIDwgOCkge1xuICAgICAgICAgICAgYXN0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N1cCcpXG4gICAgICAgICAgICBhc3RyLnRleHRDb250ZW50ID0gJyonXG4gICAgICAgICAgICBhc3RyLmNsYXNzTGlzdC5hZGQoJ2FzdHInKVxuICAgICAgICAgICAgYXN0cnMucHVzaChhc3RyKVxuICAgICAgICB9XG4gICAgICAgIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgcHMucHVzaChwKVxuICAgIH1cblxuICAgIGNvbnN0IHpvb21lZENvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHpvb21lZENvbnQuaWQgPSAnemlvJ1xuICAgIHpvb21lZENvbnQuY2xhc3NMaXN0LmFkZCgnem9vbWVkLWNvbnRhaW5lcicpXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgcHNbMF0udGV4dENvbnRlbnQgPSAnTmFtZSdcbiAgICAgICAgcHNbMV0udGV4dENvbnRlbnQgPSAnUGhvbmUgTnVtYmVyJ1xuICAgICAgICBwc1syXS50ZXh0Q29udGVudCA9ICdFbWFpbCdcbiAgICAgICAgcHNbM10udGV4dENvbnRlbnQgPSAnQ2l0eSdcbiAgICAgICAgcHNbNF0udGV4dENvbnRlbnQgPSAnQXJlYSdcbiAgICAgICAgcHNbNV0udGV4dENvbnRlbnQgPSAnU3RyZWV0IE5hbWUgLyBOdW1iZXInXG4gICAgICAgIHBzWzZdLnRleHRDb250ZW50ID0gJ0J1aWxkaW5nIC8gVmlsbGEnXG4gICAgICAgIHBzWzddLnRleHRDb250ZW50ID0gJ0Zsb29yJ1xuICAgICAgICBwc1s4XS50ZXh0Q29udGVudCA9IGBBcGFydG1lbnRgXG4gICAgICAgIHBzWzldLnRleHRDb250ZW50ID0gJ0xhbmRtYXJrJ1xuICAgICAgICBwc1sxMF0udGV4dENvbnRlbnQgPSAnSW5zdHJ1Y3Rpb25zJ1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBzWzBdLnRleHRDb250ZW50ID0gJ9in2YTYp9iz2YUnXG4gICAgICAgIHBzWzFdLnRleHRDb250ZW50ID0gJ9ix2YLZhSDYp9mE2YfYp9iq2YEnXG4gICAgICAgIHBzWzJdLnRleHRDb250ZW50ID0gJ9in2YTYqNix2YrYryDYp9mE2KfZhNmD2KrYsdmI2YbZiidcbiAgICAgICAgcHNbM10udGV4dENvbnRlbnQgPSAn2KfZhNmF2K3Yp9mB2LjYqSdcbiAgICAgICAgcHNbNF0udGV4dENvbnRlbnQgPSAn2KfZhNmF2YbYt9mC2KknXG4gICAgICAgIHBzWzVdLnRleHRDb250ZW50ID0gJ9in2LPZhSAvINix2YLZhSDYp9mE2LTYp9ix2LknXG4gICAgICAgIHBzWzZdLnRleHRDb250ZW50ID0gJ9ix2YLZhSDYp9mE2LnZhdin2LHYqSAvINin2YTapNmK2YTYpydcbiAgICAgICAgcHNbN10udGV4dENvbnRlbnQgPSAn2KfZhNi32KfYqNmCJ1xuICAgICAgICBwc1s4XS50ZXh0Q29udGVudCA9ICfYp9mE2LTZgtipJ1xuICAgICAgICBwc1s5XS50ZXh0Q29udGVudCA9ICfYudmE2KfZhdipINmF2YXZitiy2KknXG4gICAgICAgIHBzWzEwXS50ZXh0Q29udGVudCA9ICfYqti52YTZitmF2KfYqiDYp9iu2LHZiidcbiAgICB9XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW4tbGFiZWwnKS5hcHBlbmQoYXN0cnNbMF0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuLWxhYmVsJykuYXBwZW5kKHBzWzBdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbi1sYWJlbCcpLmFwcGVuZChhc3Ryc1sxXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG4tbGFiZWwnKS5hcHBlbmQocHNbMV0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsLWxhYmVsJykuYXBwZW5kKGFzdHJzWzJdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbC1sYWJlbCcpLmFwcGVuZChwc1syXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1sYWJlbCcpLmFwcGVuZChhc3Ryc1szXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1sYWJlbCcpLmFwcGVuZChwc1szXSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJlYS1sYWJlbCcpLmFwcGVuZChhc3Ryc1s0XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJlYS1sYWJlbCcpLmFwcGVuZChwc1s0XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3QtbGFiZWwnKS5hcHBlbmQoYXN0cnNbNV0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0LWxhYmVsJykuYXBwZW5kKHBzWzVdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidWlsZGluZy1sYWJlbCcpLmFwcGVuZChhc3Ryc1s2XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRpbmctbGFiZWwnKS5hcHBlbmQocHNbNl0pXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yLWxhYmVsJykuYXBwZW5kKGFzdHJzWzddKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG9vci1sYWJlbCcpLmFwcGVuZChwc1s3XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXB0LWxhYmVsJykuYXBwZW5kKHBzWzhdKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kbWFyay1sYWJlbCcpLmFwcGVuZChwc1s5XSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zdHJ1Y3Rpb25zLWxhYmVsJykuYXBwZW5kKHBzWzEwXSlcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoem9vbWVkQ29udClcbiAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICBibHVycmVkW2tdLmNsYXNzTGlzdC5hZGQoJ3BvcHVwJylcbiAgICB9XG4gICAgYWRkcmVzc1BvcC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cCcpXG4gICAgeDMuc3JjID0geENsb3NlXG4gICAgeDMuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMjBweDtoZWlnaHQ6IDIwcHg7JylcbiAgICB4My5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgYmx1cnJlZCA9IGRvY3VtZW50LmJvZHkuY2hpbGRyZW5cbiAgICAgICAgY29uc3QgY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZHJlc3MtcG9wdXAnKVxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGJsdXJyZWQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGJsdXJyZWRba10uY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAnKVxuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BuLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcmVhLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyZWEtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3QtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3QtbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRpbmctbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVpbGRpbmctbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3ItbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3ItbGFiZWwnKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXB0LWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRtYXJrLWxhYmVsJykuaW5uZXJIVE1MID0gJydcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc3RydWN0aW9ucy1sYWJlbCcpLmlubmVySFRNTCA9ICcnXG5cbiAgICAgICAgY29uLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZTsnKVxuICAgICAgICB6b29tZWRDb250LnJlbW92ZSgpXG4gICAgfSlcblxuICAgIGFkZHJlc3NQb3Auc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBmbGV4OycpXG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHN1Ym1pdEFkZHJlc3MoKVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9kdWN0SURJbmRleChtKSB7XG4gICAgbGV0IHJlcyA9IFtdXG4gICAgaWYgKG0gPT0gMSkge1xuICAgICAgICBjYXJ0SW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgICAgICAgcHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBwcm9kdWN0LmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb2R1Y3QucF9pZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0gZWxzZSBpZiAobSA9PSAyKSB7XG4gICAgICAgIGNhcnRJbmRleGVzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IHByb2R1Y3QuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gocHJvZHVjdC5wcm9kdWN0X3RpdGxlX2VuKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVUb0RCKG9yZGVyKSB7XG4gICAgZGIuT3JkZXJzLnB1c2gob3JkZXIpXG4gICAgbGV0IG9iaiA9IHtcbiAgICAgICAgZGI6IGRiLFxuICAgICAgICBjdXJyOiBvcmRlcixcbiAgICB9XG4gICAgbGV0IG9ialN0ciA9IGF3YWl0IEpTT04uc3RyaW5naWZ5KG9iailcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9zcGxhc2gtN2UxeS5vbnJlbmRlci5jb20vJywge1xuICAgICAgICBtZXRob2Q6IGBQT1NUYCxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIGJvZHk6IG9ialN0cixcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmJvZHlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50KGFycikge1xuICAgIGxldCBvYmogPSB7fVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9ialthcnJbaV1dID0gMVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGkgIT0gaiAmJiBhcnJbaV0gPT0gYXJyW2pdKSB7XG4gICAgICAgICAgICAgICAgb2JqW2FycltpXV0rK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmpcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyUGxhY2VkKGlkKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJylcbiAgICBjb25zdCBzdWNjZXNzMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0JylcbiAgICBjb25zdCBvcmRlck51bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cbiAgICBtYWluLmlkID0gJ3N1Y2Nlc3MtbWVzc2FnZSdcblxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKClcbiAgICBsZXQgZGF0ZSA9XG4gICAgICAgIHRvZGF5LmdldERhdGUoKSArXG4gICAgICAgICcvJyArXG4gICAgICAgICh0b2RheS5nZXRNb250aCgpICsgMSkgK1xuICAgICAgICAnLycgK1xuICAgICAgICB0b2RheS5nZXRGdWxsWWVhcigpXG4gICAgbGV0IHRpbWUgPVxuICAgICAgICB0b2RheS5nZXRIb3VycygpICsgJzonICsgdG9kYXkuZ2V0TWludXRlcygpICsgJzonICsgdG9kYXkuZ2V0U2Vjb25kcygpXG4gICAgbGV0IGRhdGVUaW1lID1cbiAgICAgICAgZGF0ZSArXG4gICAgICAgICcgJyArXG4gICAgICAgIHRpbWUgK1xuICAgICAgICAnICcgK1xuICAgICAgICBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmVcblxuICAgIGxldCBncGlpID0gZ2V0UHJvZHVjdElESW5kZXgoMilcbiAgICBsZXQgb2JqID0gZ2V0Q291bnQoZ3BpaSlcbiAgICBsZXQgb3QgPSAnJ1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgb3QgKz0gYCR7b2JqW2tleV19eCAnJHtrZXl9JyAtIGBcbiAgICB9KVxuICAgIG90ID0gb3Quc2xpY2UoMCwgLTMpXG5cbiAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgIG9yZGVyX2lkOiBpZCxcbiAgICAgICAgb3JkZXJfYWRkcmVzczogX2FkZHJlc3MsXG4gICAgICAgIG9yZGVyX3N1YnRvdGFsOiB0cCxcbiAgICAgICAgb3JkZXJfZGF0ZXRpbWU6IGRhdGVUaW1lLFxuICAgICAgICBvcmRlcl9pdGVtczogb3QsXG4gICAgICAgIG9yZGVyX2l0ZW1zX2lkczogZ2V0UHJvZHVjdElESW5kZXgoMSkuam9pbignIC0gJyksXG4gICAgfVxuXG4gICAgbGV0IHdhaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpXG4gICAgd2FpdC50ZXh0Q29udGVudCA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpXG4gICAgICAgID8gJ1BsZWFzZSBXYWl0Li4nXG4gICAgICAgIDogJ9in2YTYsdis2KfYoSDYp9mE2KfZhtiq2LjYp9ixLi4nXG4gICAgbWFpbi5hcHBlbmQod2FpdClcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG5cbiAgICBzYXZlVG9EQihvcmRlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzcy50ZXh0Q29udGVudCA9ICdPcmRlciBQbGFjZWQgU3VjY2Vzc2Z1bGx5ISdcbiAgICAgICAgICAgICAgICBzdWNjZXNzMi50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgICdQbGVhc2UgY2hlY2sgeW91ciBtYWlsIGZvciBjb25maXJtYXRpb24uJ1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtLnRleHRDb250ZW50ID0gYE9yZGVyIElEOiAke2lkfWBcbiAgICAgICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSAnQ29udGludWUgU2hvcHBpbmcnXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MudGV4dENvbnRlbnQgPSAn2KrZhSDYqtmC2K/ZitmFINin2YTYt9mE2Kgg2KjZhtis2KfYrSEnXG4gICAgICAgICAgICAgICAgc3VjY2VzczIudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAn2YrYsdis2Ykg2KfZhNiq2K3ZgtmCINmF2YYg2KjYsdmK2K/ZgyDYp9mE2KXZhNmD2KrYsdmI2YbZiiDZhNmE2KrYo9mD2YrYry4nXG4gICAgICAgICAgICAgICAgb3JkZXJOdW0udGV4dENvbnRlbnQgPSBg2LHZgtmFINin2YTYt9mE2Kg6ICR7aWR9YFxuICAgICAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9ICfZhdmI2KfYtdmE2Kkg2KfZhNiq2LPZiNmCJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FydEFyckRldGFpbHMgPSBbXVxuICAgICAgICAgICAgY2FydEFyciA9IHt9XG4gICAgICAgICAgICBjYXJ0QXJyT0cgPSB7fVxuICAgICAgICAgICAgY2FydEluZGV4ZXMgPSBbXVxuICAgICAgICAgICAgdHAgPSAwXG4gICAgICAgICAgICBTdG9yYWdlLnNhdmVDYXJ0KGNhcnRBcnJEZXRhaWxzLCBjYXJ0QXJyLCBjYXJ0QXJyT0csIGNhcnRJbmRleGVzKVxuXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ29Ib21lKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBtYWluLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKHN1Y2Nlc3MpXG4gICAgICAgICAgICBtYWluLmFwcGVuZChzdWNjZXNzMilcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKG9yZGVyTnVtKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQoYnRuKVxuXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzLnRleHRDb250ZW50ID0gJ09vcHMgU29tZXRoaW5nIFdlbnQgV3JvbmcuJ1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MyLnRleHRDb250ZW50ID0gJ1BsZWFzZSB0cnkgYWdhaW4gb3IgY29udGFjdCB1cy4nXG4gICAgICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gJ1RyeSBBZ2FpbidcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzcy50ZXh0Q29udGVudCA9ICfZhNmC2K8g2K3Yr9irINiu2LfYoyDZhdinLidcbiAgICAgICAgICAgICAgICBzdWNjZXNzMi50ZXh0Q29udGVudCA9ICfZitix2KzZiSDYp9mE2YXYrdin2YjZhNipINmF2LHYqSDYo9iu2LHZiSDYo9mIINin2YTYp9iq2LXYp9mEINio2YbYpy4nXG4gICAgICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gJ9in2LnYp9iv2Kkg2KfZhNmF2K3Yp9mI2YTYqSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBvcmRlclBsYWNlZChpZClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIG1haW4uaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgbWFpbi5hcHBlbmQoc3VjY2VzcylcbiAgICAgICAgICAgIG1haW4uYXBwZW5kKHN1Y2Nlc3MyKVxuICAgICAgICAgICAgbWFpbi5hcHBlbmQoYnRuKVxuXG4gICAgICAgICAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKG1haW4pXG4gICAgICAgIH0pXG5cbiAgICBmbGFnID0gJ3BhZ2UnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZU9yZGVyKCkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgY29uc3QgYWRkcmVzc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgYWRkcmVzc0RORSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGNvbnN0IGFkZHJlc3NQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgaW5zdFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBsYW5kbWFya1AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBhZGRDaGFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgY29uc3QgcHJpY2VDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHN1YnRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3Qgc2hpcHBpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblxuICAgIGNvbnN0IHBsYWNlT3JkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgbWFpbi5pZCA9ICdvcmRlci1tYWluJ1xuICAgIGFkZHJlc3NDb250YWluZXIuaWQgPSAnb3JkZXItYWRkcmVzcy1jb250J1xuICAgIHByaWNlQ29udGFpbmVyLmlkID0gJ29yZGVyLXByaWNlLWNvbnQnXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgaWYgKF9hZGRyZXNzLmV4aXN0cykge1xuICAgICAgICAgICAgYWRkQ2hhbmdlLnRleHRDb250ZW50ID0gJ0NoYW5nZSdcbiAgICAgICAgICAgIGxldCBhZGRBcnIgPSBPYmplY3QudmFsdWVzKF9hZGRyZXNzKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgaWYgKCFfYWRkcmVzcy5hcGFydG1lbnQpIHtcbiAgICAgICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9hZGRyZXNzLmxhbmRtYXJrKSB7XG4gICAgICAgICAgICAgICAgbGFuZG1hcmtQLnRleHRDb250ZW50ID0gYExhbmRtYXJrOiAke19hZGRyZXNzLmxhbmRtYXJrfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpbnN0UC50ZXh0Q29udGVudCA9IGBJbnN0cnVjdGlvbnM6ICR7X2FkZHJlc3MuaW5zdHJ1Y3Rpb25zfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZHJlc3NQLnRleHRDb250ZW50ID0gYWRkQXJyLmpvaW4oJyAtICcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGRDaGFuZ2UudGV4dENvbnRlbnQgPSAnQWRkJ1xuICAgICAgICAgICAgYWRkcmVzc0RORS50ZXh0Q29udGVudCA9ICdObyBBZGRyZXNzIEZvdW5kLidcbiAgICAgICAgfVxuICAgICAgICBzdWJ0b3RhbC50ZXh0Q29udGVudCA9IGBTdWJ0b3RhbDogJHt0cH1gXG4gICAgICAgIHNoaXBwaW5nLnRleHRDb250ZW50ID0gJ1dlIHNoYWxsIGJlIGNvbnRhY3RpbmcgeW91IHNvb24uJ1xuICAgICAgICBwbGFjZU9yZGVyLnRleHRDb250ZW50ID0gJ1BsYWNlIE9yZGVyJ1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfYWRkcmVzcy5leGlzdHMpIHtcbiAgICAgICAgICAgIGFkZENoYW5nZS50ZXh0Q29udGVudCA9ICfYqti62YrZitixJ1xuICAgICAgICAgICAgbGV0IGFkZEFyciA9IE9iamVjdC52YWx1ZXMoX2FkZHJlc3MpXG4gICAgICAgICAgICBhZGRBcnIuc3BsaWNlKC0xLCAxKVxuICAgICAgICAgICAgYWRkQXJyLnNwbGljZSgtMSwgMSlcbiAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICBpZiAoIV9hZGRyZXNzLmFwYXJ0bWVudCkge1xuICAgICAgICAgICAgICAgIGFkZEFyci5zcGxpY2UoLTEsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2FkZHJlc3MubGFuZG1hcmspIHtcbiAgICAgICAgICAgICAgICBsYW5kbWFya1AudGV4dENvbnRlbnQgPSBg2LnZhNin2YXYqSDZhdmF2YrYstipOiAke19hZGRyZXNzLmxhbmRtYXJrfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYWRkcmVzcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpbnN0UC50ZXh0Q29udGVudCA9IGDYqti52YTZitmF2KfYqiDYp9iu2LHZijogJHtfYWRkcmVzcy5pbnN0cnVjdGlvbnN9YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkcmVzc1AudGV4dENvbnRlbnQgPSBhZGRBcnIuam9pbignIC0gJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZENoYW5nZS50ZXh0Q29udGVudCA9ICfYp9i22KfZgdipJ1xuICAgICAgICAgICAgYWRkcmVzc0RORS50ZXh0Q29udGVudCA9ICfZhNmFINmK2KrZhSDYp9mE2LnYq9mI2LEg2LnZhNmJINi52YbZiNin2YYuJ1xuICAgICAgICB9XG4gICAgICAgIHN1YnRvdGFsLnRleHRDb250ZW50ID0gYNin2YTYp9is2YXYp9mE2Yo6ICR7dHB9YFxuICAgICAgICBzaGlwcGluZy50ZXh0Q29udGVudCA9ICfYs9mG2KrZiNin2LXZhCDZhdi52YPZhSDZgtix2YrYqNmL2KcuJ1xuICAgICAgICBwbGFjZU9yZGVyLnRleHRDb250ZW50ID0gYNin2KrZhdin2YUg2LnZhdmE2YrYqSDYp9mE2LTYsdin2KFgXG4gICAgfVxuXG4gICAgaWYgKCFfYWRkcmVzcy5leGlzdHMpIHtcbiAgICAgICAgcGxhY2VPcmRlci5kaXNhYmxlZCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZU9yZGVyLmRpc2FibGVkID0gZmFsc2VcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGFkZEFkZHJlc3MoKVxuICAgIH0pXG5cbiAgICBwbGFjZU9yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBvcmRlclBsYWNlZChuYW5vaWQoMjEpKVxuICAgIH0pXG5cbiAgICBpZiAoX2FkZHJlc3MuZXhpc3RzKSB7XG4gICAgICAgIGFkZHJlc3NDb250YWluZXIuYXBwZW5kKGFkZHJlc3NQKVxuICAgICAgICBhZGRyZXNzQ29udGFpbmVyLmFwcGVuZChsYW5kbWFya1ApXG4gICAgICAgIGFkZHJlc3NDb250YWluZXIuYXBwZW5kKGluc3RQKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZHJlc3NDb250YWluZXIuYXBwZW5kKGFkZHJlc3NETkUpXG4gICAgfVxuXG4gICAgc2hpcHBpbmcuaWQgPSAnZ3JheS10ZXh0J1xuXG4gICAgYWRkcmVzc0NvbnRhaW5lci5hcHBlbmQoYWRkQ2hhbmdlKVxuICAgIHByaWNlQ29udGFpbmVyLmFwcGVuZChzdWJ0b3RhbClcbiAgICBwcmljZUNvbnRhaW5lci5hcHBlbmQoc2hpcHBpbmcpXG4gICAgbWFpbi5hcHBlbmQoYWRkcmVzc0NvbnRhaW5lcilcbiAgICBtYWluLmFwcGVuZChwcmljZUNvbnRhaW5lcilcbiAgICBtYWluLmFwcGVuZChwbGFjZU9yZGVyKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQobWFpbilcbiAgICBmbGFnID0gJ29yZGVyJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9DYXJ0KHByb2R1Y3RfaW5kZXgsIGkpIHtcbiAgICBjYXJ0SW5kZXhlcy5wdXNoKHByb2R1Y3RfaW5kZXgpXG4gICAgcG9wVXAoMSwgaSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlVmlld0NhcnQoKSB7XG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY2FydEFyckRldGFpbHMgPSBbXVxuICAgIGNhcnRBcnIgPSB7fVxuICAgIGNhcnRBcnJPRyA9IHt9XG4gICAgbGV0IGEgPSAnJ1xuICAgIGxldCBpbmR4MiA9IC0xXG4gICAgbGV0IGlpaWkgPSAwXG4gICAgbWFpbi5pZCA9ICdjYXJ0LW1haW4nXG4gICAgY2FydEluZGV4ZXMuZm9yRWFjaCgoY2FydEluZGV4KSA9PiB7XG4gICAgICAgIHByb2R1Y3RzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGlmIChjYXJ0SW5kZXggPT0gcC5pbmRleCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocC5wcm9kdWN0X3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnRHJlc3NpbmdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gZHJlc3NpbmdzQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gZHJlc3NpbmdzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0tpZHMgQmVkcm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSBrYmVkcm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBrYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTWFzdGVyIEJlZHJvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gYWJlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gYWJlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBpaWlpKytcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0RpbmluZ3Jvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gZGluaW5ncm9vbXNBcnJbaW5keDJdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyT0dbYCR7aWlpaX0uanBnYF0gPSBkaW5pbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdSZWNlcHRpb25zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0QXJyW2Ake2lpaWl9LmpwZ2BdID0gcmVjZXB0aW9uc0FycltpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJPR1tgJHtpaWlpfS5qcGdgXSA9IHJlY2VwdGlvbnNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlpaWkrK1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVFYgVW5pdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRBcnJbYCR7aWlpaX0uanBnYF0gPSB0dnVuaXRzQXJyW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FydEFyck9HW2Ake2lpaWl9LmpwZ2BdID0gdHZ1bml0c0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWlpaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FydEFyckRldGFpbHMucHVzaChwLmluZGV4KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICBpZiAoY2FydEFyckRldGFpbHMubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3QgYWRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICAgICAgZW1wdHkuaWQgPSAnY2FydC1lbXB0eSdcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICBlbXB0eS50ZXh0Q29udGVudCA9ICdTaG9wcGluZyBDYXJ0IGlzIEVtcHR5LidcbiAgICAgICAgICAgIGFkZC50ZXh0Q29udGVudCA9ICdBZGQgSXRlbXMnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbXB0eS50ZXh0Q29udGVudCA9ICfYudix2KjYqSDYp9mE2KrYs9mI2YIg2YHYp9ix2LrYqS4nXG4gICAgICAgICAgICBhZGQudGV4dENvbnRlbnQgPSAn2KPYttmBINmF2YbYqtis2KfYqidcbiAgICAgICAgfVxuICAgICAgICBhZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBnb0hvbWUoKVxuICAgICAgICB9KVxuICAgICAgICBtYWluLmNsYXNzTGlzdC5hZGQoJ2VtcHR5LWNhcnQtbWFpbicpXG4gICAgICAgIG1haW4uYXBwZW5kKGVtcHR5KVxuICAgICAgICBtYWluLmFwcGVuZChhZGQpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgbm90aWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBtaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBjYXJ0Zm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3Qgbm90aWZQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGNvbnN0IHRvdGFscHJpY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgICAgY29uc3QgcGxhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXG4gICAgICAgIHRwID0gJ1RCRCdcblxuICAgICAgICBub3RpZi5pZCA9ICdub3RpZidcblxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ1Byb2R1Y3QnXG4gICAgICAgICAgICBwcmljZS50ZXh0Q29udGVudCA9ICdQcmljZSdcbiAgICAgICAgICAgIG5vdGlmUC50ZXh0Q29udGVudCA9ICdJdGVtIFJlbW92ZWQgZnJvbSBDYXJ0ISdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9in2YTZhdmG2KrYrCdcbiAgICAgICAgICAgIHByaWNlLnRleHRDb250ZW50ID0gJ9in2YTYs9i52LEnXG4gICAgICAgICAgICBub3RpZlAudGV4dENvbnRlbnQgPSAnINiq2YXYqiDYp9mE2KXYstin2YTYqSDZhdmGINi52LHYqNipINin2YTYqtiz2YjZgiEnXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGNhcnRBcnIpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBsZXQgcHJvZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICAgICAgbGV0IHRpdGxlaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICAgICAgbGV0IHByaWNlaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICAgICAgbGV0IGhsYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICAgICAgICAgIGxldCByZW1vdmVJbWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgbGV0IHJlbW92ZUltZyA9IG5ldyBJbWFnZSgpXG5cbiAgICAgICAgICAgIHJlbW92ZUltZy5zcmMgPSByZW1vdmVJY25cbiAgICAgICAgICAgIHJlbW92ZUltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAyMnB4O2hlaWdodDogMjJweDsnKVxuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgICAgICAgICB0aXRsZWkudGV4dENvbnRlbnQgPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wX2lkXG4gICAgICAgICAgICAgICAgfSwgJHtwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfdGl0bGVfZW59YFxuICAgICAgICAgICAgICAgIHByaWNlaS50ZXh0Q29udGVudCA9ICdUQkQnXG4gICAgICAgICAgICAgICAgICAgIC8vIHByb2R1Y3RzW3BhcnNlSW50KGNhcnRBcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9wcmljZV9lblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aXRsZWkudGV4dENvbnRlbnQgPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wX2lkXG4gICAgICAgICAgICAgICAgfdiMICR7cHJvZHVjdHNbcGFyc2VJbnQoY2FydEFyckRldGFpbHNbaV0pXS5wcm9kdWN0X3RpdGxlX2FyfWBcbiAgICAgICAgICAgICAgICBwcmljZWkudGV4dENvbnRlbnQgPSAnVEJEJ1xuICAgICAgICAgICAgICAgICAgICAvLyBwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2VfYXJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGxjLmNsYXNzTGlzdC5hZGQoJ2hsYycpXG4gICAgICAgICAgICBwcmljZWkuY2xhc3NMaXN0LmFkZCgncXAnKVxuXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIGltZy5zcmMgPSBjYXJ0QXJyT0dbYCR7aX0uanBnYF1cbiAgICAgICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdjYXJ0LWl0ZW0taW1nJylcbiAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZUl0ZW0oOCwgaSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlbW92ZUltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYXJ0QXJyRGV0YWlscy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBkZWxldGUgY2FydEFycltgJHtpfS5qcGdgXVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0QXJyT0dbYCR7aX0uanBnYF1cbiAgICAgICAgICAgICAgICBjYXJ0SW5kZXhlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBuZmxhZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcG9wdWxhdGVWaWV3Q2FydCgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0ZW1wLmNsYXNzTGlzdC5hZGQoJ2NhcnQtaXRlbScpXG5cbiAgICAgICAgICAgIHJlbW92ZUltZ0Rpdi5hcHBlbmQocmVtb3ZlSW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQoaW1nKVxuICAgICAgICAgICAgcHJvZC5hcHBlbmQodGl0bGVpKVxuICAgICAgICAgICAgdGVtcC5hcHBlbmQocHJvZClcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHByaWNlaSlcbiAgICAgICAgICAgIHRlbXAuYXBwZW5kKHJlbW92ZUltZ0RpdilcbiAgICAgICAgICAgIG1pZC5hcHBlbmQodGVtcClcbiAgICAgICAgICAgIG1pZC5hcHBlbmQoaGxjKVxuXG4gICAgICAgICAgICAvLyB0cCArPSBwYXJzZUludChwcm9kdWN0c1twYXJzZUludChjYXJ0QXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfcHJpY2UpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhsYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJylcbiAgICAgICAgaGxjLmNsYXNzTGlzdC5hZGQoJ2hsYycpXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgICAgICB0b3RhbHByaWNlLnRleHRDb250ZW50ID0gYFRvdGFsIFByaWNlOiAke3RwfWBcbiAgICAgICAgICAgIHBsYWNlLnRleHRDb250ZW50ID0gYENvbnRpbnVlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG90YWxwcmljZS50ZXh0Q29udGVudCA9IGDYp9is2YXYp9mE2Yog2KfZhNiz2LnYsTogJHt0cH1gXG4gICAgICAgICAgICBwbGFjZS50ZXh0Q29udGVudCA9IGDYp9mE2KfYs9iq2YXYsdin2LFgXG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHBvcHVsYXRlT3JkZXIoKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdCcpXG4gICAgICAgIHByaWNlLmNsYXNzTGlzdC5hZGQoJ3FwaCcpXG5cbiAgICAgICAgaGVhZGVyLmFwcGVuZCh0aXRsZSlcbiAgICAgICAgaGVhZGVyLmFwcGVuZChwcmljZSlcblxuICAgICAgICBoZWFkZXIuaWQgPSAnY2FydC1oZWFkZXInXG4gICAgICAgIG1pZC5pZCA9ICdjYXJ0LW1pZCdcbiAgICAgICAgdG90YWxwcmljZS5pZCA9ICdjYXJ0LXRvdGFsLXByaWNlJ1xuICAgICAgICBjYXJ0Zm9vdGVyLmlkID0gJ2NhcnQtZm9vdGVyJ1xuXG4gICAgICAgIGNhcnRmb290ZXIuYXBwZW5kKHRvdGFscHJpY2UpXG4gICAgICAgIGNhcnRmb290ZXIuYXBwZW5kKHBsYWNlKVxuXG4gICAgICAgIGlmICghbmZsYWcpIHtcbiAgICAgICAgICAgIG5vdGlmLmFwcGVuZChub3RpZlApXG4gICAgICAgICAgICBtYWluLmFwcGVuZChub3RpZilcbiAgICAgICAgICAgIG5mbGFnID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbWFpbi5hcHBlbmQoaGVhZGVyKVxuICAgICAgICBtYWluLmFwcGVuZChobGMpXG4gICAgICAgIG1haW4uYXBwZW5kKG1pZClcbiAgICAgICAgbWFpbi5hcHBlbmQoY2FydGZvb3RlcilcbiAgICB9XG5cbiAgICBTdG9yYWdlLnNhdmVDYXJ0KGNhcnRBcnJEZXRhaWxzLCBjYXJ0QXJyLCBjYXJ0QXJyT0csIGNhcnRJbmRleGVzKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQobWFpbilcbiAgICBmbGFnID0gJ2NhcnQnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93UmVzdWx0c0NvdW50KG0sIGEpIHtcbiAgICBsZXQgcmVzdWx0c0ZvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgIHJlc3VsdHNGb3VuZC5pZCA9ICdyZXN1bHRzLWZvdW5kJ1xuICAgIGxldCBncm0gPSAnJ1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdlbicpKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZ3JtID0gJyB3YXMnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm0gPSAncyB3ZXJlJ1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNGb3VuZC50ZXh0Q29udGVudCA9IGAke1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYSkubGVuZ3RoXG4gICAgICAgIH0gUHJvZHVjdCR7Z3JtfSBmb3VuZC5gXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGEpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBncm0gPSAn2YXZhtiq2KwnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm0gPSAn2YXZhtiq2KzYp9iqJ1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNGb3VuZC50ZXh0Q29udGVudCA9IGDYqtmFINin2YTYudir2YjYsSDYudmE2YkgJHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLmxlbmd0aFxuICAgICAgICB9ICR7Z3JtfS5gXG4gICAgfVxuICAgIG0uYXBwZW5kKHJlc3VsdHNGb3VuZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVkaXREaXN0YW5jZShzMSwgczIpIHtcbiAgICBzMSA9IHMxLnRvTG93ZXJDYXNlKClcbiAgICBzMiA9IHMyLnRvTG93ZXJDYXNlKClcblxuICAgIHZhciBjb3N0cyA9IG5ldyBBcnJheSgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gczEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IGlcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gczIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChpID09IDApIGNvc3RzW2pdID0galxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGNvc3RzW2ogLSAxXVxuICAgICAgICAgICAgICAgICAgICBpZiAoczEuY2hhckF0KGkgLSAxKSAhPSBzMi5jaGFyQXQoaiAtIDEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWluKE1hdGgubWluKG5ld1ZhbHVlLCBsYXN0VmFsdWUpLCBjb3N0c1tqXSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgY29zdHNbaiAtIDFdID0gbGFzdFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpID4gMCkgY29zdHNbczIubGVuZ3RoXSA9IGxhc3RWYWx1ZVxuICAgIH1cbiAgICByZXR1cm4gY29zdHNbczIubGVuZ3RoXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2ltaWxhcml0eShzMSwgczIpIHtcbiAgICB2YXIgbG9uZ2VyID0gczFcbiAgICB2YXIgc2hvcnRlciA9IHMyXG4gICAgaWYgKHMxLmxlbmd0aCA8IHMyLmxlbmd0aCkge1xuICAgICAgICBsb25nZXIgPSBzMlxuICAgICAgICBzaG9ydGVyID0gczFcbiAgICB9XG4gICAgdmFyIGxvbmdlckxlbmd0aCA9IGxvbmdlci5sZW5ndGhcbiAgICBpZiAobG9uZ2VyTGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIDEuMFxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgICAobG9uZ2VyTGVuZ3RoIC0gZWRpdERpc3RhbmNlKGxvbmdlciwgc2hvcnRlcikpIC9cbiAgICAgICAgcGFyc2VGbG9hdChsb25nZXJMZW5ndGgpXG4gICAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoUmVzdWx0cyh0YXJnZXQpIHtcbiAgICBzZWFyY2hBcnIgPSB7fVxuICAgIHNlYXJjaEFyck9HID0ge31cbiAgICBzZWFyY2hBcnJEZXRhaWxzID0gW11cblxuICAgIG1pZGRsZUNvbnRhaW5lci5mb2N1cygpXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICByZXN1bHRzUXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYVsxXSA+IGJbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICB9XG4gICAgICAgIGlmIChhWzFdIDwgYlsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB0YXJnZXQgPSB0YXJnZXQudG9VcHBlckNhc2UoKVxuICAgIGxldCBicmVha2sgPSBmYWxzZVxuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgvW0EtWmEtel1cXGRcXGQoXFxkKT8oXFxkKT8vKVxuICAgIGlmIChyZS50ZXN0KHRhcmdldCkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzW2ldXG4gICAgICAgICAgICBpZiAocHJvZHVjdC5wX2lkID09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNRdWV1ZS5lbnF1ZXVlKFtpLCAxLCBwcm9kdWN0LnByb2R1Y3RfdHlwZV0pXG4gICAgICAgICAgICAgICAgYnJlYWtrID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghYnJlYWtrKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwb29sID0gW11cbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0c1tpXVxuICAgICAgICAgICAgcG9vbC5wdXNoKFxuICAgICAgICAgICAgICAgIHByb2R1Y3QucHJvZHVjdF9kZXNjcmlwdGlvbl9hcixcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnByb2R1Y3RfZGVzY3JpcHRpb25fZW4sXG4gICAgICAgICAgICAgICAgcHJvZHVjdC5wcm9kdWN0X3RpdGxlX2FyLFxuICAgICAgICAgICAgICAgIHByb2R1Y3QucHJvZHVjdF90aXRsZV9lbixcbiAgICAgICAgICAgICAgICBwcm9kdWN0LnByb2R1Y3RfdHlwZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcG9vbC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gZWwudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICBsZXQgc2ltID0gc2ltaWxhcml0eShlbCwgdGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBzaW0gPiAwLjY1IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAodGFyZ2V0Lmxlbmd0aCA+IDEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWwuaW5jbHVkZXModGFyZ2V0KSB8fCB0YXJnZXQuaW5jbHVkZXMoZWwpKSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFkZGVkLmluY2x1ZGVzKHByb2R1Y3QucF9pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzUXVldWUuZW5xdWV1ZShbaSwgc2ltLCBwcm9kdWN0LnByb2R1Y3RfdHlwZV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChwcm9kdWN0LnBfaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIHNyY2gudmFsdWUgPSAnJ1xuICAgIHBvcHVsYXRlU2VhcmNoUmVzdWx0cygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZVNlYXJjaFJlc3VsdHMoKSB7XG4gICAgbGV0IHIgPSBjbG9uZURlZXAocmVzdWx0c1F1ZXVlKVxuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIHNlYXJjaEFyciA9IHt9XG4gICAgbGV0IGxzID0gW11cbiAgICBsZXQgaW5keHggPSAwXG4gICAgd2hpbGUgKCFyLmlzRW1wdHkoKSkge1xuICAgICAgICBsZXQgbCA9IHIuZGVxdWV1ZSgpXG4gICAgICAgIGxzLnB1c2gobClcbiAgICB9XG5cbiAgICBscy5mb3JFYWNoKChsKSA9PiB7XG4gICAgICAgIGxldCBwID0gcHJvZHVjdHNbbFswXV1cbiAgICAgICAgaWYgKGxbMl0gPT0gJ2RyZXNzaW5ncycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGRyZXNzaW5nc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0gZHJlc3NpbmdzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH0gZWxzZSBpZiAobFsyXSA9PSAnS2lkcyBCZWRyb29tcycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGtiZWRyb29tc0FycltpbmR4Ml1cbiAgICAgICAgICAgIHNlYXJjaEFyck9HW2Ake2luZHh4fS4ke2V4fWBdID0ga2JlZHJvb21zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH0gZWxzZSBpZiAobFsyXSA9PSAnTWFzdGVyIEJlZHJvb21zJykge1xuICAgICAgICAgICAgbGV0IGEgPSBwLnByb2R1Y3RfaW1nX3BhdGhfZGlzcGxheWVkLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGxldCBpbmR4MiA9IGFbYS5sZW5ndGggLSAxXVxuICAgICAgICAgICAgbGV0IGV4ID0gaW5keDIuc3BsaXQoJy4nKVsxXVxuICAgICAgICAgICAgc2VhcmNoQXJyW2Ake2luZHh4fS4ke2V4fWBdID0gYWJlZHJvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSBhYmVkcm9vbXNBcnJPR1tpbmR4Ml1cbiAgICAgICAgICAgIGluZHh4KytcbiAgICAgICAgfSBlbHNlIGlmIChsWzJdID09ICdEaW5pbmdyb29tcycpIHtcbiAgICAgICAgICAgIGxldCBhID0gcC5wcm9kdWN0X2ltZ19wYXRoX2Rpc3BsYXllZC5zcGxpdCgnLycpXG4gICAgICAgICAgICBsZXQgaW5keDIgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCBleCA9IGluZHgyLnNwbGl0KCcuJylbMV1cbiAgICAgICAgICAgIHNlYXJjaEFycltgJHtpbmR4eH0uJHtleH1gXSA9IGRpbmluZ3Jvb21zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSBkaW5pbmdyb29tc0Fyck9HW2luZHgyXVxuICAgICAgICAgICAgaW5keHgrK1xuICAgICAgICB9IGVsc2UgaWYgKGxbMl0gPT0gJ1JlY2VwdGlvbnMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSByZWNlcHRpb25zQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSByZWNlcHRpb25zQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH0gZWxzZSBpZiAobFsyXSA9PSAnVFYgVW5pdHMnKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHAucHJvZHVjdF9pbWdfcGF0aF9kaXNwbGF5ZWQuc3BsaXQoJy8nKVxuICAgICAgICAgICAgbGV0IGluZHgyID0gYVthLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgZXggPSBpbmR4Mi5zcGxpdCgnLicpWzFdXG4gICAgICAgICAgICBzZWFyY2hBcnJbYCR7aW5keHh9LiR7ZXh9YF0gPSB0dnVuaXRzQXJyW2luZHgyXVxuICAgICAgICAgICAgc2VhcmNoQXJyT0dbYCR7aW5keHh9LiR7ZXh9YF0gPSB0dnVuaXRzQXJyT0dbaW5keDJdXG4gICAgICAgICAgICBpbmR4eCsrXG4gICAgICAgIH1cbiAgICAgICAgc2VhcmNoQXJyRGV0YWlscy5wdXNoKGxbMF0pXG4gICAgfSlcblxuICAgIHNob3dSZXN1bHRzQ291bnQobWlkZGxlQ29udGFpbmVyLCBzZWFyY2hBcnIpXG5cbiAgICBmbGFnID0gJ3NlYXJjaCdcbiAgICBsZXQgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZ3JpZC5pZCA9ICdncmlkJ1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhzZWFyY2hBcnIpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpbWcgPSBjcmVhdGVDYXJkKGdyaWQsIC0xLCBpKVxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1bGF0ZUl0ZW0oLTEsIGkpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQoZ3JpZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHIpIHtcbiAgICBsZXQgbnVtXG4gICAgbGV0IGIgPSBbXVxuICAgIGlmICgyMDAwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMjUwMCkge1xuICAgICAgICBudW0gPSA2XG4gICAgfVxuICAgIGlmICgxNjAwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMjAwMCkge1xuICAgICAgICBudW0gPSA1XG4gICAgfVxuICAgIGlmICgxMzAwIDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMTYwMCkge1xuICAgICAgICBudW0gPSA0XG4gICAgfVxuICAgIGlmICgxMDI0IDwgd2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gMTMwMCkge1xuICAgICAgICBudW0gPSAzXG4gICAgfVxuICAgIGlmICg2MDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSAxMDI0KSB7XG4gICAgICAgIG51bSA9IDJcbiAgICB9XG4gICAgaWYgKDAgPCB3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSA2MDApIHtcbiAgICAgICAgbnVtID0gMVxuICAgIH1cblxuICAgIHIuaW5uZXJIVE1MID0gJydcblxuICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBNYXRoLmNlaWwoMTAgLyBudW0pOyBpaSArPSAxKSB7XG4gICAgICAgIGxldCBhciA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSBpaSAqIG51bTsgaSA8IGlpICogbnVtICsgbnVtOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZWNvbW1lbmRhdGlvbnNBcnIpLmluY2x1ZGVzKGAke2l9LmpwZ2ApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IGNyZWF0ZUNhcmQoYywgNywgaSlcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlSXRlbSg3LCBpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYXIucHVzaChjKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGIucHVzaChhcilcbiAgICB9XG4gICAgbGV0IHAgPSAwXG4gICAgaWYgKG51bSA9PSAxIHx8IG51bSA9PSAyKSB7XG4gICAgICAgIHAgPSAxXG4gICAgfVxuICAgIHJldHVybiBbYiwgTWF0aC5mbG9vcigxMCAvIG51bSkgLSBwLCBudW1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnb0hvbWUoKSB7XG4gICAgbmV3U2VsZWN0KGhvbWVCdG4pXG4gICAgbWlkZGxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBjb250YWluZXIyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkb3RzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBwcmV2ID0gbmV3IEltYWdlKClcbiAgICBjb25zdCByZWNvbW1lbmRhdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IG5leHQgPSBuZXcgSW1hZ2UoKVxuXG4gICAgcHJldi5zcmMgPSB1UHJldkltZ1xuICAgIG5leHQuc3JjID0gbmV4dEltZ1xuICAgIHByZXYuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgY29udGFpbmVyMi5pZCA9ICdjb250YWluZXIyJ1xuXG4gICAgcHJldi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiA1MHB4O2hlaWdodDogNTBweDsnKVxuICAgIG5leHQuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogNTBweDtoZWlnaHQ6IDUwcHg7JylcbiAgICBkb3RzLmlkID0gJ2RvdHMnXG5cbiAgICBsZXQgYSA9IHBvcHVsYXRlUmVjb21tZW5kYXRpb25zKHJlY29tbWVuZGF0aW9ucylcbiAgICBsZXQgYiA9IGFbMF1cbiAgICBsZXQgY3VyciA9IDBcbiAgICBsZXQgbGFzdCA9IGFbMV1cbiAgICBsZXQgbnVtID0gYVsyXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYltjdXJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICByZWNvbW1lbmRhdGlvbnMuYXBwZW5kQ2hpbGQoYltjdXJyXVtpXSlcbiAgICB9XG4gICAgZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5jZWlsKDEwIC8gbnVtKTsgaSsrKSB7XG4gICAgICAgIGxldCBkb3QgPSBuZXcgSW1hZ2UoKVxuICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTVweDtoZWlnaHQ6IDE1cHg7JylcbiAgICAgICAgICAgIGRvdC5zcmMgPSBzZG90SWNuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTJweDtoZWlnaHQ6IDEycHg7JylcbiAgICAgICAgICAgIGRvdC5zcmMgPSBkb3RJY25cbiAgICAgICAgfVxuICAgICAgICBkb3RzLmFwcGVuZENoaWxkKGRvdClcbiAgICB9XG4gICAgaWYgKCFoYXNUb3VjaCgpKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgICAgICBhID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVxuICAgICAgICAgICAgY3VyciA9IDBcbiAgICAgICAgICAgIGIgPSBhWzBdXG4gICAgICAgICAgICBsYXN0ID0gYVsxXVxuICAgICAgICAgICAgbnVtID0gYVsyXVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiW2N1cnJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25zLmFwcGVuZENoaWxkKGJbY3Vycl1baV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VyciA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJldi5jbGFzc0xpc3QuYWRkKCd1JylcbiAgICAgICAgICAgICAgICBwcmV2LnNyYyA9IHVQcmV2SW1nXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZXYuY2xhc3NMaXN0LnJlbW92ZSgndScpXG4gICAgICAgICAgICAgICAgcHJldi5zcmMgPSBwcmV2SW1nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VyciA+PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgbmV4dC5zcmMgPSB1TmV4dEltZ1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NMaXN0LmFkZCgndScpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHQuc3JjID0gbmV4dEltZ1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NMaXN0LnJlbW92ZSgndScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb3RzLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguY2VpbCgxMCAvIG51bSk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkb3QgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgICAgIGlmIChpID09IGN1cnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDE1cHg7aGVpZ2h0OiAxNXB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBzZG90SWNuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6IDEycHg7aGVpZ2h0OiAxMnB4OycpXG4gICAgICAgICAgICAgICAgICAgIGRvdC5zcmMgPSBkb3RJY25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG90cy5hcHBlbmRDaGlsZChkb3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJldi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGN1cnIgPiAwKSB7XG4gICAgICAgICAgICBiID0gcG9wdWxhdGVSZWNvbW1lbmRhdGlvbnMocmVjb21tZW5kYXRpb25zKVswXVxuICAgICAgICAgICAgY3Vyci0tXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJbY3Vycl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbnMuYXBwZW5kQ2hpbGQoYltjdXJyXVtpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvdHMuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5jZWlsKDEwIC8gbnVtKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvdCA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gY3Vycikge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTVweDtoZWlnaHQ6IDE1cHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IHNkb3RJY25cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogMTJweDtoZWlnaHQ6IDEycHg7JylcbiAgICAgICAgICAgICAgICAgICAgZG90LnNyYyA9IGRvdEljblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb3RzLmFwcGVuZENoaWxkKGRvdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHQuY2xhc3NMaXN0LnJlbW92ZSgndScpXG4gICAgICAgICAgICBuZXh0LnNyYyA9IG5leHRJbWdcbiAgICAgICAgICAgIGlmIChjdXJyIDw9IDApIHtcbiAgICAgICAgICAgICAgICBwcmV2LmNsYXNzTGlzdC5hZGQoJ3UnKVxuICAgICAgICAgICAgICAgIHByZXYuc3JjID0gdVByZXZJbWdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoY3VyciA8IGxhc3QpIHtcbiAgICAgICAgICAgIGIgPSBwb3B1bGF0ZVJlY29tbWVuZGF0aW9ucyhyZWNvbW1lbmRhdGlvbnMpWzBdXG4gICAgICAgICAgICBjdXJyKytcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYltjdXJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9ucy5hcHBlbmRDaGlsZChiW2N1cnJdW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmNlaWwoMTAgLyBudW0pOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZG90ID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjdXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxNXB4O2hlaWdodDogMTVweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gc2RvdEljblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAxMnB4O2hlaWdodDogMTJweDsnKVxuICAgICAgICAgICAgICAgICAgICBkb3Quc3JjID0gZG90SWNuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldi5jbGFzc0xpc3QucmVtb3ZlKCd1JylcbiAgICAgICAgICAgIHByZXYuc3JjID0gcHJldkltZ1xuICAgICAgICAgICAgaWYgKGN1cnIgPj0gbGFzdCkge1xuICAgICAgICAgICAgICAgIG5leHQuc3JjID0gdU5leHRJbWdcbiAgICAgICAgICAgICAgICBuZXh0LmNsYXNzTGlzdC5hZGQoJ3UnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGJvdHRvbWluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGFib3V0dXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGFib3V0dXNQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgIGNvbnN0IGNvbnRhY3R1c1AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgY29uc3QgYm9keVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBjb250YWN0aW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgbGV0IGVtYWlsUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgIGxldCBwaG9uZVAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbiAgICBjb25zdCBsb2NhdGlvbmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgbG9jYXRpb25IID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBlbWFpbGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBjb25zdCBwaG9uZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBlbWFpbGEuaHJlZiA9ICdhbWdhZGthbWFsc3BsYXNoQGdtYWlsLmNvbSdcbiAgICBwaG9uZW4uaHJlZiA9ICd0ZWw6KzIwMTIyMTA0NTEzNSdcblxuICAgIGVtYWlsYS50ZXh0Q29udGVudCA9ICdhbWdhZGthbWFsc3BsYXNoQGdtYWlsLmNvbSdcbiAgICBwaG9uZW4udGV4dENvbnRlbnQgPSAnXFx1MjAwZSsyMDEyMjEwNDUxMzUnXG5cbiAgICBjb25zdCBlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgZW0uY2xhc3NMaXN0LmFkZCgnZW1wbicpXG4gICAgcG4uY2xhc3NMaXN0LmFkZCgnZW1wbicpXG4gICAgYm90dG9taW5mby5pZCA9ICdib3R0b21pbmZvJ1xuICAgIGFib3V0dXMuaWQgPSAnYWJvdXR1cydcbiAgICBjb250YWN0aW5mby5pZCA9ICdjb250YWN0aW5mbydcbiAgICBsb2NhdGlvbmRpdi5pZCA9ICdtYXAtY29udCdcblxuICAgIGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZW4nKSkge1xuICAgICAgICBhYm91dHVzUC50ZXh0Q29udGVudCA9ICdBYm91dCBVcydcbiAgICAgICAgY29udGFjdHVzUC50ZXh0Q29udGVudCA9ICdDb250YWN0IFVzJ1xuICAgICAgICBib2R5UC50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gTWF4aW1lIG1vbGxpdGlhLCBtb2xlc3RpYWUgcXVhcyB2ZWwgc2ludCBjb21tb2RpIHJlcHVkaWFuZGFlIGNvbnNlcXV1bnR1ciB2b2x1cHRhdHVtIGxhYm9ydW0gbnVtcXVhbSBibGFuZGl0aWlzIGhhcnVtIHF1aXNxdWFtIGVpdXMgc2VkIG9kaXQgZnVnaWF0IGl1c3RvIGZ1Z2EgcHJhZXNlbnRpdW0gb3B0aW8sIGVhcXVlIHJlcnVtISBQcm92aWRlbnQgc2ltaWxpcXVlIGFjY3VzYW50aXVtIG5lbW8gYXV0ZW0uIFZlcml0YXRpcyBvYmNhZWNhdGkgdGVuZXR1ciBpdXJlIGVpdXMgZWFydW0gdXQgbW9sZXN0aWFzIGFyY2hpdGVjdG8gdm9sdXB0YXRlIGFsaXF1YW0gbmloaWwsIGV2ZW5pZXQgYWxpcXVpZCBjdWxwYSBvZmZpY2lhIGF1dCEgSW1wZWRpdCBzaXQgc3VudCBxdWFlcmF0LCBvZGl0LCB0ZW5ldHVyIGVycm9yLCBoYXJ1bS4nXG4gICAgICAgIGxvY2F0aW9uSC50ZXh0Q29udGVudCA9ICdBZGRyZXNzOiAnXG4gICAgICAgIGVtYWlsUC50ZXh0Q29udGVudCA9ICdFbWFpbDogJ1xuICAgICAgICBwaG9uZVAudGV4dENvbnRlbnQgPSAnUGhvbmUgTnVtYmVyOiAnXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWJvdXR1c1AudGV4dENvbnRlbnQgPSAn2YXYudmE2YjZhdin2Kog2LnZhtinJ1xuICAgICAgICBjb250YWN0dXNQLnRleHRDb250ZW50ID0gJ9il2KrYtdmEINio2YbYpydcbiAgICAgICAgYm9keVAudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgJ9mE2YjYsdmK2YUg2KfZitio2LPZiNmFINiv2YjZhNin2LEg2LPZitiqINij2YXZitiqICzZg9mI2YbYs9mK2YPYqtmK2KrZiNixINij2K/Yp9mK2KjYpyDZitiz2YPZitmG2Kwg2KPZhNmK2KfZitiqLNiz2YrYqiDYr9mIINij2YrZiNiz2YXZiNivINiq2YrZhdio2YjYsSDYo9mG2YPYp9mK2K/ZitivINmK2YjZhtiq2YrZiNiqINmE2KfYqNmI2LHZiiDYp9iqINiv2YjZhNin2LEg2YXYp9is2YbYpyDYo9mE2YrZg9mK2YjYpyAuINmK2YjYqiDYp9mG2YrZhSDYo9ivINmF2YrZhtmK2YUg2YHZitmG2KfZitmFLNmD2YrZiNin2LMg2YbZiNiz2KrYsdmK2K8g2KPZg9iz2YrYsSDYs9mK2KrYp9i02YYg2YrZhNmE2KPZhdmD2Ygg2YTYp9io2YjYsdij2LMg2YbZitiz2Yog2YrYqiDYo9mE2YrZg9mK2YjYqCDYo9mD2LMg2KPZitinINmD2YjZhdmF2YjYr9mIINmD2YjZhtiz2YrZg9mK2YjYp9iqIC4g2K/ZitmI2KfYsyDYo9mK2YjYqtmKINij2LHZitix2Yog2K/ZiNmE2KfYsSDYpdmGINix2YrYqNix2YrZh9mK2YbYr9mK2LHYo9mK2Kog2YHZiNmE2YrZiNio2KrYp9iq2Yog2YHZitmE2KfZitiqINij2YrYs9iz2Yog2YPYp9mK2YTZhNmK2YjZhSDYr9mI2YTYp9ixINij2YrZiCDZgdmK2KzYp9mK2Kog2YbZitmI2YTYpyDYqNin2LHYp9mK2KfYqtmK2YjYsS4g2KPZitmD2LPYs9mK2KjYqtmK2YjYsSDYs9in2YrZhtiqINij2YjZg9mD2KfZitmD2KfYqiDZg9mK2YjYqNin2YrYr9in2KrYp9iqINmG2YjZhiDYqNix2YjYp9mK2K/ZitmG2KogLNiz2YrZiNmG2Kog2KfZhiDZg9mK2YjZhNio2Kcg2YPZitmIINij2YjZgdmK2LPZitinINiv2YrYs9mK2LHZitmI2YbYqtmF2YjZhNmK2Kog2KfZhtmK2YUg2KPZitiv2Yog2KfZitiz2Kog2YTYp9io2YjYsdmK2YjZhS4nXG4gICAgICAgIGxvY2F0aW9uSC50ZXh0Q29udGVudCA9ICfYp9mE2LnZhtmI2KfZhjogJ1xuICAgICAgICBlbWFpbFAudGV4dENvbnRlbnQgPSAn2KfZhNio2LHZitivINin2YTYp9mE2YPYqtix2YjZhtmKOiAnXG4gICAgICAgIHBob25lUC50ZXh0Q29udGVudCA9ICfYsdmC2YUg2KfZhNmH2KfYqtmBOiAnXG4gICAgfVxuXG4gICAgbWFwLmlubmVySFRNTCA9XG4gICAgICAgICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9lbWJlZD9wYj0hMW0xOCExbTEyITFtMyExZDkyOC4zOTgwMjI0MjQyNDcxITJkMzEuMzUwMjM3NTM1OTEyNTchM2QzMC4wNjc5MzEzOTA4Mjk0MDghMm0zITFmMCEyZjAhM2YwITNtMiExaTEwMjQhMmk3NjghNGYxMy4xITNtMyExbTIhMXMweDE0NTgzZTBiMGZjM2Q2NDMlM0EweDhkNWEwNWZjZjM1ZjM5NGUhMnNUYXdmaWslMjBBaG1lZCUyMEVsLUJha3J5JTJDJTIwQWwlMjBNYW50ZXFhaCUyMGFzJTIwU2FkZXNhaCUyQyUyME5hc3IlMjBDaXR5JTJDJTIwQ2Fpcm8lMjBHb3Zlcm5vcmF0ZSUyMDQ0NTA0NzMhNWUwITNtMiExc2VuITJzZWchNHYxNjc4Mzk3MTc3OTc1ITVtMiExc2VuITJzZWdcIiBzdHlsZT1cImJvcmRlcjowO3dpZHRoOiA4MHZ3OyBoZWlnaHQ6IDUwMHB4O1wiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGxvYWRpbmc9XCJsYXp5XCIgcmVmZXJyZXJwb2xpY3k9XCJuby1yZWZlcnJlci13aGVuLWRvd25ncmFkZVwiIGlkPVwibWFwXCI+PC9pZnJhbWU+J1xuXG4gICAgY29udGFpbmVyLmlkID0gJ3JlY29tbWVuZGF0aW9ucy1jb250YWluZXInXG4gICAgcHJldi5pZCA9ICdwcmV2LWltZydcbiAgICBuZXh0LmlkID0gJ25leHQtaW1nJ1xuICAgIHJlY29tbWVuZGF0aW9ucy5pZCA9ICdyZWNvbW1lbmRhdGlvbnMnXG5cbiAgICBlbS5hcHBlbmQoZW1haWxQKVxuICAgIGVtLmFwcGVuZChlbWFpbGEpXG4gICAgcG4uYXBwZW5kKHBob25lUClcbiAgICBwbi5hcHBlbmQocGhvbmVuKVxuICAgIGxvY2F0aW9uZGl2LmFwcGVuZENoaWxkKGxvY2F0aW9uSClcbiAgICBsb2NhdGlvbmRpdi5hcHBlbmRDaGlsZChtYXApXG4gICAgY29udGFjdGluZm8uYXBwZW5kKGNvbnRhY3R1c1ApXG4gICAgY29udGFjdGluZm8uYXBwZW5kKGVtKVxuICAgIGNvbnRhY3RpbmZvLmFwcGVuZChwbilcbiAgICBjb250YWN0aW5mby5hcHBlbmQobG9jYXRpb25kaXYpXG4gICAgYWJvdXR1cy5hcHBlbmRDaGlsZChhYm91dHVzUClcbiAgICBhYm91dHVzLmFwcGVuZENoaWxkKGJvZHlQKVxuICAgIGJvdHRvbWluZm8uYXBwZW5kKGFib3V0dXMpXG4gICAgYm90dG9taW5mby5hcHBlbmQoY29udGFjdGluZm8pXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHByZXYpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlY29tbWVuZGF0aW9ucylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dClcbiAgICBjb250YWluZXIyLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcbiAgICBjb250YWluZXIyLmFwcGVuZENoaWxkKGRvdHMpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcjIpXG4gICAgbWlkZGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKGJvdHRvbWluZm8pXG4gICAgZmxhZyA9ICdwYWdlJ1xuICAgIGhpZGVNZW51KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVNZW51KCkge1xuICAgIG1lbnUuc3R5bGUud2lkdGggPSAnMCUnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNUb3VjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHxcbiAgICAgICAgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMCB8fFxuICAgICAgICBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDBcbiAgICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaG9vc2VNb2RlKG4pIHtcbiAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGRyZXNzaW5nc0FyclxuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWJlZHJvb21zQXJyXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBrYmVkcm9vbXNBcnJcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIHJlY2VwdGlvbnNBcnJcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIGRpbmluZ3Jvb21zQXJyXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiB0dnVuaXRzQXJyXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbnNBcnJcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGNhcnRBcnJcbiAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hBcnJcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hvb3NlRGV0YWlscyhuKSB7XG4gICAgc3dpdGNoIChuKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBkcmVzc2luZ3NEZXRhaWxzXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBNYXN0ZXJCZWRyb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIEtpZHNCZWRyb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIFJlY2VwdGlvbnNEZXRhaWxzXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBEaW5pbmdSb29tc0RldGFpbHNcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFRWVW5pdHNEZXRhaWxzXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbnNBcnJEZXRhaWxzXG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBjYXJ0QXJyRGV0YWlsc1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaEFyckRldGFpbHNcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDYXJkKGNvbnRhaW5lciwgbiwgaW5kZXgpIHtcbiAgICBsZXQgYXJyID0gY2hvb3NlTW9kZShuKVxuICAgIGxldCBhcnJEZXRhaWxzID0gY2hvb3NlRGV0YWlscyhuKVxuICAgIGxldCBwX3RpdGxlX2VuID0gJydcbiAgICBsZXQgcF90aXRsZV9hciA9ICcnXG4gICAgbGV0IHBfcHJpY2VfZW4gPSAnJ1xuICAgIGxldCBwX3ByaWNlX2FyID0gJydcblxuICAgIGNvbnN0IHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgaW5mb0wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGNhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgIGNvbnN0IHRtcEwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IG5hbWVQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgcHJpY2VQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgaHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdocicpXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ3BvcHVwdGV4dCcpXG4gICAgc3Bhbi5pZCA9IGBteVBvcHVwLSR7aW5kZXh9YFxuICAgIGNhcnQuY2xhc3NMaXN0LmFkZCgndHRwb3B1cCcpXG4gICAgdG1wLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nKVxuICAgIGluZm8uY2xhc3NMaXN0LmFkZCgnaW5mbycpXG4gICAgaW5mb0wuY2xhc3NMaXN0LmFkZCgnaW5mby1sZWZ0JylcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgIGltZy5zcmMgPSBhcnJbYCR7aW5kZXh9LmpwZ2BdXG4gICAgcF90aXRsZV9lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF90aXRsZV9lblxuICAgIHBfdGl0bGVfYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLnByb2R1Y3RfdGl0bGVfYXJcbiAgICBwX3ByaWNlX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpbmRleF0pXS5wcm9kdWN0X3ByaWNlX2VuXG4gICAgcF9wcmljZV9hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaW5kZXhdKV0ucHJvZHVjdF9wcmljZV9hclxuICAgIGlmIChuID09IDcpIHtcbiAgICAgICAgaW5mb0wuY2xhc3NMaXN0LmFkZCgncmVjb21tZW5kYXRpb24taW5mby1MJylcbiAgICAgICAgaW5mby5jbGFzc0xpc3QuYWRkKCdyZWNvbW1lbmRhdGlvbi1pbmZvJylcbiAgICB9XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnZGF0YS1zY2FsZScsICcxLjInKVxuICAgIGlmIChsYW5nQnRuLnZhbHVlID09ICdlbmdsaXNoJykge1xuICAgICAgICBuYW1lUC50ZXh0Q29udGVudCA9IHBfdGl0bGVfZW5cbiAgICAgICAgY2FydC50ZXh0Q29udGVudCA9ICdBZGQgdG8gQ2FydCdcbiAgICAgICAgcHJpY2VQLnRleHRDb250ZW50ID0gcF9wcmljZV9lblxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gJ0l0ZW0gQWRkZWQgdG8gQ2FydCEnXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZVAudGV4dENvbnRlbnQgPSBwX3RpdGxlX2FyXG4gICAgICAgIGNhcnQudGV4dENvbnRlbnQgPSAn2KfYttin2YHYqSDYp9mE2Yog2LnYsdio2Kkg2KfZhNiq2LPZiNmCJ1xuICAgICAgICBwcmljZVAudGV4dENvbnRlbnQgPSBwX3ByaWNlX2FyXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSAn2KrZhdiqINin2YTYpdi22KfZgdipINil2YTZiSDYudix2KjYqSDYp9mE2KrYs9mI2YIhJ1xuICAgIH1cblxuICAgIGNhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGFkZFRvQ2FydChwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2luZGV4XSldLmluZGV4LCBpbmRleClcbiAgICB9KVxuXG4gICAgY2FydC5hcHBlbmQoc3BhbilcbiAgICBpbmZvTC5hcHBlbmQobmFtZVApXG4gICAgaW5mb0wuYXBwZW5kKHByaWNlUClcbiAgICBpbmZvLmFwcGVuZChpbmZvTClcbiAgICB0bXBMLmFwcGVuZChocilcbiAgICB0bXBMLmFwcGVuZChpbmZvKVxuICAgIHRtcC5hcHBlbmQoaW1nKVxuICAgIHRtcC5hcHBlbmQodG1wTClcbiAgICB0bXAuYXBwZW5kKGNhcnQpXG4gICAgY29udGFpbmVyLmFwcGVuZCh0bXApXG4gICAgcmV0dXJuIGltZ1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUl0ZW0obiwgaSkge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGN1cnJJdGVtLnB1c2gobilcbiAgICBjdXJySXRlbS5wdXNoKGkpXG4gICAgbGV0IHBfY29kZV9lbiA9ICcnXG4gICAgbGV0IHBfY29kZV9hciA9ICcnXG4gICAgbGV0IHBfZGltZW5zaW9uc19lbiA9ICcnXG4gICAgbGV0IHBfZGltZW5zaW9uc19hciA9ICcnXG4gICAgbGV0IHBfZGVzY19lbiA9ICcnXG4gICAgbGV0IHBfZGVzY19hciA9ICcnXG5cbiAgICBmbGFnID0gJ2l0ZW0nXG4gICAgbGV0IGZsID0gZmFsc2VcbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCB2aWV3SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGV0YWlsc0hlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRldGFpbHNCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBkZXNjMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZGVzYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGRlc2MzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBsZXQgaW1nID0gJydcblxuICAgIGltZyA9IGNyZWF0ZUNhcmQoaXRlbSwgbiwgaSlcblxuICAgIGxldCBhcnJEZXRhaWxzID0gY2hvb3NlRGV0YWlscyhuKVxuXG4gICAgbGV0IGFyciA9IFtdXG5cbiAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgYXJyID0gZHJlc3NpbmdzQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGFyciA9IGFiZWRyb29tc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBhcnIgPSBrYmVkcm9vbXNBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgYXJyID0gcmVjZXB0aW9uc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBhcnIgPSBkaW5pbmdyb29tc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBhcnIgPSB0dnVuaXRzQXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGFyciA9IHJlY29tbWVuZGF0aW9uc0Fyck9HXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICBhcnIgPSBjYXJ0QXJyT0dcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgICBhcnIgPSBzZWFyY2hBcnJPR1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgcF9jb2RlX2VuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfY29kZV9lblxuICAgIHBfY29kZV9hciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2NvZGVfYXJcbiAgICBwX2RpbWVuc2lvbnNfZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykudGV4dENvbnRlbnQgPVxuICAgICAgICBwcm9kdWN0c1twYXJzZUludChhcnJEZXRhaWxzW2ldKV0ucHJvZHVjdF9kaW1lbnNpb25zX2VuXG4gICAgcF9kaW1lbnNpb25zX2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfZGltZW5zaW9uc19hclxuICAgIHBfZGVzY19lbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS50ZXh0Q29udGVudCA9XG4gICAgICAgIHByb2R1Y3RzW3BhcnNlSW50KGFyckRldGFpbHNbaV0pXS5wcm9kdWN0X2Rlc2NyaXB0aW9uX2VuXG4gICAgcF9kZXNjX2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnRleHRDb250ZW50ID1cbiAgICAgICAgcHJvZHVjdHNbcGFyc2VJbnQoYXJyRGV0YWlsc1tpXSldLnByb2R1Y3RfZGVzY3JpcHRpb25fYXJcblxuICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKCFmbCkge1xuICAgICAgICAgICAgY29uc3Qgem9vbWVkQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBibHVycmVkLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgYmx1cnJlZFtrXS5jbGFzc0xpc3QuYWRkKCdwb3B1cCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbCA9IHRydWVcbiAgICAgICAgICAgIGxldCB6b29tZWRJbiA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBsZXQgeDIgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgem9vbWVkSW4uc3JjID0gYXJyW2Ake2l9LmpwZ2BdXG4gICAgICAgICAgICB4Mi5zcmMgPSB4MkljblxuICAgICAgICAgICAgeDIuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogNDBweDtoZWlnaHQ6IDQwcHg7JylcbiAgICAgICAgICAgIHpvb21lZEluLmNsYXNzTGlzdC5hZGQoJ3pvb21lZC1pbicpXG4gICAgICAgICAgICB4Mi5jbGFzc0xpc3QuYWRkKCd4MicpXG4gICAgICAgICAgICB6b29tZWRDb250LmNsYXNzTGlzdC5hZGQoJ3pvb21lZC1jb250YWluZXInKVxuICAgICAgICAgICAgem9vbWVkQ29udC5hcHBlbmRDaGlsZCh6b29tZWRJbilcbiAgICAgICAgICAgIHpvb21lZENvbnQuYXBwZW5kQ2hpbGQoeDIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHpvb21lZENvbnQpXG4gICAgICAgICAgICB4Mi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBmbCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd6b29tZWQtaW4nKVxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgneDInKVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3pvb21lZC1jb250YWluZXInKVxuICAgICAgICAgICAgICAgIGVsZW1lbnRzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNbMF0pXG4gICAgICAgICAgICAgICAgZWxbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbFswXSlcbiAgICAgICAgICAgICAgICBjb25zdCBibHVycmVkID0gZG9jdW1lbnQuYm9keS5jaGlsZHJlblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYmx1cnJlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBibHVycmVkW2tdLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY29uWzBdKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2aWV3SXRlbS5pZCA9ICd2aWV3LWl0ZW0nXG4gICAgZGV0YWlscy5pZCA9ICdpdGVtLWRldGFpbHMnXG4gICAgZGV0YWlsc0hlYWQuaWQgPSAnZGV0YWlsc0gnXG4gICAgZGV0YWlsc0JvZHkuaWQgPSAnZGV0YWlsc0InXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2VuJykpIHtcbiAgICAgICAgZGV0YWlsc0hlYWQudGV4dENvbnRlbnQgPSAnUHJvZHVjdCBEZXRhaWxzJ1xuICAgICAgICBkZXNjMi50ZXh0Q29udGVudCA9IHBfZGVzY19lblxuICAgICAgICBkZXNjMy50ZXh0Q29udGVudCA9IHBfZGltZW5zaW9uc19lblxuICAgICAgICBkZXNjMS50ZXh0Q29udGVudCA9IHBfY29kZV9lblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGRldGFpbHNIZWFkLnRleHRDb250ZW50ID0gJ9iq2YHYp9i12YrZhCDYp9mE2YXZhtiq2KwnXG4gICAgICAgIGRlc2MyLnRleHRDb250ZW50ID0gcF9kZXNjX2FyXG4gICAgICAgIGRlc2MzLnRleHRDb250ZW50ID0gcF9kaW1lbnNpb25zX2FyXG4gICAgICAgIGRlc2MxLnRleHRDb250ZW50ID0gcF9jb2RlX2FyXG4gICAgfVxuXG4gICAgZGV0YWlsc0JvZHkuYXBwZW5kKGRlc2MxKVxuICAgIGRldGFpbHNCb2R5LmFwcGVuZChkZXNjMilcbiAgICBkZXRhaWxzQm9keS5hcHBlbmQoZGVzYzMpXG4gICAgZGV0YWlscy5hcHBlbmQoZGV0YWlsc0hlYWQpXG4gICAgZGV0YWlscy5hcHBlbmQoZGV0YWlsc0JvZHkpXG4gICAgdmlld0l0ZW0uYXBwZW5kQ2hpbGQoaXRlbSlcbiAgICB2aWV3SXRlbS5hcHBlbmRDaGlsZChkZXRhaWxzKVxuICAgIG1pZGRsZUNvbnRhaW5lci5hcHBlbmQodmlld0l0ZW0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZUdyaWQobikge1xuICAgIG1pZGRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgIGxldCBpbWFnZUFyciA9IGNob29zZU1vZGUobilcbiAgICBmbGFnID0gJ3BhZ2UnXG4gICAgbGV0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgZ3JpZC5pZCA9ICdncmlkJ1xuXG4gICAgc2hvd1Jlc3VsdHNDb3VudChtaWRkbGVDb250YWluZXIsIGltYWdlQXJyKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhpbWFnZUFycikubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGltZyA9IGNyZWF0ZUNhcmQoZ3JpZCwgbiwgaSlcbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgcG9wdWxhdGVJdGVtKG4sIGkpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGhpZGVNZW51KClcbiAgICBtaWRkbGVDb250YWluZXIuYXBwZW5kKGdyaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZUxhbmcoKSB7XG4gICAgbmF2QnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgaWYgKGZsYWcgPT0gJ3BhZ2UnKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQtcGFnZScpIHx8XG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQtcGFnZS1kZCcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGJ0bi5pZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvSG9tZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkcmVzc2luZ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhZHVsdHMtYmVkcm9vbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVHcmlkKDIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdraWRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCgzKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmVjZXB0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RpbmluZ3Jvb21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlR3JpZCg1KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndHZ1bml0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUdyaWQoNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdpdGVtJykge1xuICAgICAgICAgICAgcG9wdWxhdGVJdGVtKGN1cnJJdGVtWzBdLCBjdXJySXRlbVsxXSlcbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdjYXJ0Jykge1xuICAgICAgICAgICAgcG9wdWxhdGVWaWV3Q2FydCgpXG4gICAgICAgIH0gZWxzZSBpZiAoZmxhZyA9PSAnc2VhcmNoJykge1xuICAgICAgICAgICAgcG9wdWxhdGVTZWFyY2hSZXN1bHRzKClcbiAgICAgICAgfSBlbHNlIGlmIChmbGFnID09ICdvcmRlcicpIHtcbiAgICAgICAgICAgIHBvcHVsYXRlT3JkZXIoKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1NlbGVjdChidXR0b24pIHtcbiAgICBiZWRyb29tc0J0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlJylcbiAgICBuYXZCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQtcGFnZScpXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZC1wYWdlLWRkJylcbiAgICB9KVxuICAgIGlmIChcbiAgICAgICAgW1xuICAgICAgICAgICAgaG9tZUJ0bixcbiAgICAgICAgICAgIGRyZXNzaW5nc0J0bixcbiAgICAgICAgICAgIHJlY2VwdGlvbnNCdG4sXG4gICAgICAgICAgICB0dnVuaXRzQnRuLFxuICAgICAgICAgICAgZGluaW5ncm9vbXNCdG4sXG4gICAgICAgIF0uaW5jbHVkZXMoYnV0dG9uKVxuICAgICkge1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcGFnZScpXG4gICAgfSBlbHNlIGlmIChbYWJlZHJvb21zQnRuLCBrYmVkcm9vbXNCdG5dLmluY2x1ZGVzKGJ1dHRvbikpIHtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXBhZ2UtZGQnKVxuICAgICAgICBiZWRyb29tc0J0bi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wYWdlJylcbiAgICB9XG4gICAgbmF2UC5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkLXAnKVxuICAgIH0pXG4gICAgbGV0IGEgPSBidXR0b24uaWRcbiAgICBzd2l0Y2ggKGEpIHtcbiAgICAgICAgY2FzZSAnaG9tZSc6XG4gICAgICAgICAgICBob21lUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RyZXNzaW5ncyc6XG4gICAgICAgICAgICBkcmVzc2luZ3NQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYWR1bHRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgIGFiZWRyb29tc1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdraWRzLWJlZHJvb21zJzpcbiAgICAgICAgICAgIGtiZWRyb29tc1AuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQtcCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZWNlcHRpb25zJzpcbiAgICAgICAgICAgIHJlY2VwdGlvbnNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZGluaW5ncm9vbXMnOlxuICAgICAgICAgICAgZGluaW5ncm9vbXNQLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLXAnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndHZ1bml0cyc6XG4gICAgICAgICAgICB0dnVuaXRzUC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1wJylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaExhbmcodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldCA9PSAnYXInKSB7XG4gICAgICAgIHNyY2guc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICfYp9io2K3YqyDZh9mG2KcuLicpXG4gICAgICAgIGZ0ci50ZXh0Q29udGVudCA9ICfYrNmF2YrYuSDYp9mE2K3ZgtmI2YIg2YXYrdmB2YjYuNipJ1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IG5hdkJ0bnNbaV1cbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IG5hdkFyW2ldXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYXZQLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSBuYXZQW2ldXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZBcjJbaV1cbiAgICAgICAgfVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2VucycpXG4gICAgICAgIG1lbnUuY2xhc3NMaXN0LmFkZCgnYXJzJylcbiAgICAgICAgYmVkcm9vbXNCdG4udGV4dENvbnRlbnQgPSAn2LrYsdmBINin2YTZhtmI2YUnXG4gICAgICAgIGNhcnRJbWcuc2V0QXR0cmlidXRlKCd0aXRsZScsICfYudix2LYg2LnYsdio2Kkg2KfZhNiq2LPZiNmCJylcbiAgICB9IGVsc2Uge1xuICAgICAgICBzcmNoLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnU2VhcmNoIGhlcmUuLicpXG4gICAgICAgIGZ0ci50ZXh0Q29udGVudCA9ICdBbGwgUmlnaHRzIFJlc2VydmVkLidcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYXZCdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSBuYXZCdG5zW2ldXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBuYXZFbltpXVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2UC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gbmF2UFtpXVxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gbmF2RW4yW2ldXG4gICAgICAgIH1cbiAgICAgICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhcnMnKVxuICAgICAgICBtZW51LmNsYXNzTGlzdC5hZGQoJ2VucycpXG4gICAgICAgIGJlZHJvb21zQnRuLnRleHRDb250ZW50ID0gJ0JlZHJvb21zJ1xuICAgICAgICBjYXJ0SW1nLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnVmlldyBDYXJ0JylcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZSB7XG4gICAgc3RhdGljIHNhdmVDYXJ0KHgsIHksIHosIHcpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRBcnJEZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkoeCkpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0QXJyJywgSlNPTi5zdHJpbmdpZnkoeSkpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXJ0QXJyT0cnLCBKU09OLnN0cmluZ2lmeSh6KSlcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnRJbmRleGVzJywgSlNPTi5zdHJpbmdpZnkodykpXG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVBZGRyZXNzKHgpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJBZGRyZXNzJywgSlNPTi5zdHJpbmdpZnkoeCkpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldERldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEFyckRldGFpbHMnKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBcnIoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEFycicpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFyck9nKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnRBcnJPRycpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEluZGV4ZXMoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydEluZGV4ZXMnKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBZGRyZXNzKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJBZGRyZXNzJylcbiAgICB9XG59XG4iLCJleHBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmV4cG9ydCBsZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSA9IDIxKSA9PlxuICBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmV4cG9ydCBsZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbiIsImV4cG9ydCBjb25zdCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9