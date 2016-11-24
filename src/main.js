
/*!
 * h-sort
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * MIT Licensed
 */

const convertObjectArray = array => {
  return array.map(
    item => ({
      value: item,
      father: undefined,
      children: []
      })
    )
}

const initializeChildren = scope => {
  scope.list.map(
    (father, index) => {
      [1, 2].map(
        child => {
          child = scope.list[index *2 +child]
          if (child !== undefined) {
            child.father = father
            father.children.push(child)
          }
        })
    })
}

const processModifieds = scope => {
  let modifieds = scope.modifieds.length
  let iterations = 0, last
  while (last = scope.modifieds.pop()) {
    if (last !== undefined && last.children !== undefined) {
      testChildren(last, scope)
      iterations += 1
    }
  }
  scope.iterations += iterations
}

const testChildren = (father, scope) => {
  father.children.map(child => {
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
    scope.debug
      ? scope.iterations += 1
      : undefined
  }
  if (scope.debug) {
    console.log('=>', scope.iterations -scope.iterationsAll)
    scope.iterationsAll = scope.iterations
  }
}

const blockChild = block => {
  const father = block.father
  if (father !== undefined) {
    let children = []
    father.children.map(
      child => {
        child !== block ? children.push(child) : undefined
      })
    father.children = children
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
    item => (item.value)
    )
}

const main = (array, debug = false) => {
  if (array.length === undefined || array.length <= 1) {
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
  scope.crono = scope.debug
    ? +new Date()
    : undefined
  // initialize children
  initializeChildren(scope)
  // add all to modified's
  scope.list.map(
    item => {
      scope.modifieds.push(item)
    })
  // order list processing modified's
  scope.debug
    ? console.log('order tree iteration\'s:')
    : undefined
  processModifieds(scope)
  // order heap list
  doHeap(scope)
  // revert object to array
  return revertToArray(scope)
}

module.exports = main
