// requided's

const assert = require('assert')

// const heapSort = require('../src/main')
const heapSort = require('../npm/index')


// start test

describe('heap', function() {
  it('sort', function() {
    const array = [5, 6, 2, 8, 4, 9, 3, 7, 1, 0]

    assert.deepEqual(
      heapSort(array, true),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('big', function() {
    const array = [4, 9, 4, 9, 3, 7, 1, 5, 6, 2, 8, 0, 8, 4, 5, 6, 2, 8, 7, 1, 0, 8, 4, 9, 4, 9, 3, 7, 1, 5, 6, 2, 8, 0, 8, 4, 9, 3, 7, 42]

    assert.deepEqual(
      heapSort(array, true),
      [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 42])
  })
})
