
/*!
 * heap-sort
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * MIT Licensed
 */

const convertObjectArray = array => {
  each(array,
    (i, item) => {
      array[i] = {
        index: i,
        value: item,
        father: undefined,
        children: {}
      }
    })
  return array
}

const initializeChildrens = scope => {
  each(scope.list,
    (index, father) => {
      index = index *2
      initChild(father, index +1, scope)
      initChild(father, index +2, scope)
      })
}

const initChild = (father, index, scope) => {
  const child = scope.list[index]
  if (child !== undefined) {
    child.father = father
    father.children[child.index] = child
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
  eachVal(father.children,
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
    // console.log('=>', scope.iterations -scope.iterationsAll)
    scope.iterationsAll = scope.iterations
  }
}

const blockChild = child => {
  const father = child.father
  if (father !== undefined) {
    delete father.children[child.index]
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
  each(scope.list,
    (i, item) => (scope.list[i] = item.value))
  return scope.list
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
  eachVal(scope.list,
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

/*    ---   */
const each = (list, func) => {
  forEachUnify(
    list,
    func)
}

const eachVal = (list, func) => {
  forEachUnify(
    list,
    args => {
      func(args[1])
    })
}

const forEachUnify = (list, func) => {
  let keyList = undefined
  const typeList = type(list)
  switch (typeList) {
    case 'object':
      keyList = keys(list)
    case 'array':
      forEach(keyList, list, func)
    default:
  }
}

const forEach = (keys, vaules, func) => {
  let limit
  if (k === undefined) {
    limit = vaules.length
    for (let i=0; i<limit; i++) {
      func(
        i,
        vaules[i])
    }
  } else {
    limit = keys.length
    for (let i=0; i<limit; i++) {
      let key = keys[i]
      func(
        key,
        vaules[key])
    }
  }
}
/*    ---   */

// const { type, hasProp, length, keys, each, eachVal } = require('pytils')
const { type, hasProp, length, keys } = require('pytils')

module.exports = main
