
/*!
 * heap-sort
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * MIT Licensed
 */

const convertObjectArray = array => {
  return array.map(
    (item, i) =>
      ({
        index: i,
        value: item,
        father: undefined,
        children: {
          keys: {},
          values: []
        }
      })
    )
}

const initializeChildrens = scope => {
  scope.list.map(
    (father, index) => {
      index = index *2
      initChild(father, index +1, scope)
      initChild(father, index +2, scope)
      })
}

const initChild = (father, index, scope) => {
  const child = scope.list[index]
  if (child !== undefined) {
    child.father = father
    father.children.keys[child.index] = father.children.values.length
    father.children.values.push(child)
  }
}

const processModifieds = scope => {
  let modifieds = scope.modifieds.length
  let last
  while (last = scope.modifieds.pop()) {
    if (last !== undefined) {
      testChildren(last, scope)
      scope.iterations += 1
    }
  }
}

const testChildren = (father, scope) => {
  father.children.values.map(
    child => {
      if (father.value < child.value) {
        const big = child.value
        child.value = father.value
        father.value = big
        scope.modifieds.push(child)
      }
    })
}

const changeBigToLast = scope => {
  scope.limit -= 1
  const last = scope.list[scope.limit]
  if (last !== undefined) {
    const big = scope.root.value
    scope.root.value = last.value
    last.value = big

    blockChild(last)
    scope.modifieds.push(scope.root)
    scope.iterations += 1
  }
  if (scope.debug) {
    scope.iterationsAll = scope.iterations
  }
}

const blockChild = child => {
  const father = child.father
  if (father !== undefined) {
    const key = father.children.keys[child.index]
    delete father.children.values[key]
  }
}

const doHeap = scope => {
  while (scope.limit >= 0) {
    changeBigToLast(scope)
    processModifieds(scope)
  }
  if (scope.debug) {
    scope.crono = (+new Date() -scope.crono) /1000
    console.log(`ALL iteration's: ${scope.iterations} in ${scope.crono} ms.`)
  }
}

const revertToArray = scope => {
  return scope.list.map(
    item => (item.value))
}

const main = (array, debug = false) => {
  if (type(array) !== 'array' || array.length <= 1) {
    return array
  }
  // convert object array
  const list = convertObjectArray(array)
  // initialize global var's
  const scope = {
    list: list,
    root: list[0],
    limit: list.length,
    modifieds: [],
    iterations: 0,
    iterationsAll: 0,
    debug: debug,
    crono: undefined
  }
  scope.debug
    ? scope.crono = +new Date()
    : undefined
  // initialize children
  initializeChildrens(scope)
  // add all to modified's
  scope.list.map(
    item => {
      scope.modifieds.push(item)
    })
  // order list processing modified's
  processModifieds(scope)
  // order heap list
  doHeap(scope)
  // revert object to array
  return revertToArray(scope)
}

const { type, hasProp, length, keys } = require('pytils')

module.exports = main
