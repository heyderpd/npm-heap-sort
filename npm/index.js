'use strict';

/*!
 * h-sort
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * MIT Licensed
 */

var convertObjectArray = function convertObjectArray(array) {
  return array.map(function (item) {
    return {
      value: item,
      father: undefined,
      children: []
    };
  });
};

var initializeChildren = function initializeChildren(scope) {
  scope.list.map(function (father, index) {
    [1, 2].map(function (child) {
      child = scope.list[index * 2 + child];
      if (child !== undefined) {
        child.father = father;
        father.children.push(child);
      }
    });
  });
};

var processModifieds = function processModifieds(scope) {
  var modifieds = scope.modifieds.length;
  var iterations = 0,
      last = void 0;
  while (last = scope.modifieds.pop()) {
    if (last !== undefined && last.children !== undefined) {
      testChildren(last, scope);
      iterations += 1;
    }
  }
  scope.iterations += iterations;
};

var testChildren = function testChildren(father, scope) {
  father.children.map(function (child) {
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
    scope.debug ? scope.iterations += 1 : undefined;
  }
  if (scope.debug) {
    console.log('=>', scope.iterations - scope.iterationsAll);
    scope.iterationsAll = scope.iterations;
  }
};

var blockChild = function blockChild(block) {
  var father = block.father;
  if (father !== undefined) {
    (function () {
      var children = [];
      father.children.map(function (child) {
        child !== block ? children.push(child) : undefined;
      });
      father.children = children;
    })();
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

  if (array.length === undefined || array.length <= 1) {
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
  scope.crono = scope.debug ? +new Date() : undefined;
  // initialize children
  initializeChildren(scope);
  // add all to modified's
  scope.list.map(function (item) {
    scope.modifieds.push(item);
  });
  // order list processing modified's
  scope.debug ? console.log('order tree iteration\'s:') : undefined;
  processModifieds(scope);
  // order heap list
  doHeap(scope);
  // revert object to array
  return revertToArray(scope);
};

module.exports = main;
