import _ from "lodash";

// get element by selector
export const getElem = (selector: any) => {
  return document.querySelector(selector);
};

// get element by selector all
export const getElems = (selector: any) => {
  return document.querySelectorAll(selector);
};

// class add function
export const addClass = (elem: any, ...classNames: any[]) => {
  let _newElem = elem;
  if (_.isString(_newElem)) {
    _newElem = getElems(elem);
  }
  if (_newElem.length !== undefined) {
    _.forEach(_newElem, function (elem) {
      _.forEach(classNames, function (className) {
        elem.classList.add(className);
      });
    });
  } else {
    _.forEach(classNames, function (className) {
      _newElem.classList.add(className);
    });
  }
};

// class remove function
export const removeClass = (elem: any, ...className: any[]) => {
  let _newElem = elem;
  if (_.isString(_newElem)) {
    _newElem = getElems(elem);
  }
  if (_newElem.length !== undefined) {
    _.forEach(_newElem, function (elem) {
      _.forEach(className, function (className) {
        elem.classList.remove(className);
      });
    });
  } else {
    _.forEach(className, function (className) {
      _newElem.classList.remove(className);
    });
  }
};

// get attribute value
export const getAttr = function (elem: any, attr: any) {
  return elem.getAttribute(attr);
};

// set attribute value
export const setAttr = function (elems: any, object: any) {
  let _newElem = elems;
  if (_.isString(_newElem)) {
    _newElem = getElems(elems);
  }
  _.forEach(_newElem, function (elem) {
    elem.setAttribute(object.prop, object.value);
  });
};

// remove attribute value
export const removeAttr = function (elem: any, attr: any) {
  elem.removeAttribute(attr);
};

// Update html content
export const setContent = function (selector: any, content: any) {
  let _newElem = selector;
  if (_.isString(_newElem)) {
    _newElem = getElems(selector);
  }
  if (typeof _newElem.length !== typeof undefined) {
    _.forEach(_newElem, function (elem) {
      const leftJoin =
        elem.getAttribute("data-leftJoin") !== null
          ? elem.getAttribute("data-leftJoin")
          : "";
      const rightJoin =
        elem.getAttribute("data-rightJoin") !== null
          ? elem.getAttribute("data-rightJoin")
          : "";
      elem.innerHTML = leftJoin + content + rightJoin;
    });
  }
};

// Copy to Clip-board
export const copyToClipboard = (value: any, isJson: any) => {
  const elem = document.createElement("textarea");
  document.querySelector("body")?.appendChild(elem);
  if (isJson) {
    elem.value = JSON.stringify(value, null, 4);
  } else {
    elem.value = value;
  }
  elem.select();
  document.execCommand("copy");
  elem.remove();
};
