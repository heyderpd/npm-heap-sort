'use strict';

/*!
 * heap-sort
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * MIT Licensed
 */

var convertObjectArray = function convertObjectArray(array) {
  return array.map(function (item, i) {
    return {
      index: i,
      value: item,
      father: undefined,
      children: {
        keys: {},
        values: []
      }
    };
  });
};

var initializeChildrens = function initializeChildrens(scope) {
  scope.list.map(function (father, index) {
    index = index * 2;
    initChild(father, index + 1, scope);
    initChild(father, index + 2, scope);
  });
};

var initChild = function initChild(father, index, scope) {
  var child = scope.list[index];
  if (child !== undefined) {
    child.father = father;
    father.children.keys[child.index] = father.children.values.length;
    father.children.values.push(child);
  }
};

var processModifieds = function processModifieds(scope) {
  var modifieds = scope.modifieds.length;
  var last = void 0;
  while (last = scope.modifieds.pop()) {
    if (last !== undefined) {
      testChildren(last, scope);
      scope.iterations += 1;
    }
  }
};

var testChildren = function testChildren(father, scope) {
  father.children.values.map(function (child) {
    if (father.value < child.value) {
      var big = child.value;
      child.value = father.value;
      father.value = big;
      scope.modifieds.push(child);
    }
  });
};

var changeBigToLast = function changeBigToLast(scope) {
  scope.limit -= 1;
  var last = scope.list[scope.limit];
  if (last !== undefined) {
    var big = scope.root.value;
    scope.root.value = last.value;
    last.value = big;

    blockChild(last);
    scope.modifieds.push(scope.root);
    scope.iterations += 1;
  }
  if (scope.debug) {
    scope.iterationsAll = scope.iterations;
  }
};

var blockChild = function blockChild(child) {
  var father = child.father;
  if (father !== undefined) {
    var key = father.children.keys[child.index];
    delete father.children.values[key];
  }
};

var doHeap = function doHeap(scope) {
  while (scope.limit >= 0) {
    changeBigToLast(scope);
    processModifieds(scope);
  }
  if (scope.debug) {
    scope.crono = (+new Date() - scope.crono) / 1000;
    console.log('ALL iteration\'s: ' + scope.iterations + ' in ' + scope.crono + ' ms.');
  }
};

var revertToArray = function revertToArray(scope) {
  return scope.list.map(function (item) {
    return item.value;
  });
};

var main = function main(array) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (type(array) !== 'array' || array.length <= 1) {
    return array;
  }
  // convert object array
  var list = convertObjectArray(array);
  // initialize global var's
  var scope = {
    list: list,
    root: list[0],
    limit: list.length,
    modifieds: [],
    iterations: 0,
    iterationsAll: 0,
    debug: debug,
    crono: undefined
  };
  scope.debug ? scope.crono = +new Date() : undefined;
  // initialize children
  initializeChildrens(scope);
  // add all to modified's
  scope.list.map(function (item) {
    scope.modifieds.push(item);
  });
  // order list processing modified's
  processModifieds(scope);
  // order heap list
  doHeap(scope);
  // revert object to array
  return revertToArray(scope);
};

var _require = require('pytils'),
    type = _require.type,
    hasProp = _require.hasProp,
    length = _require.length,
    keys = _require.keys;

module.exports = main;
