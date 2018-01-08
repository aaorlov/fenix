var main =
webpackJsonp_name_([0],{

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(75);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(196);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(206);

var _propTypes2 = _interopRequireDefault(_propTypes);

__webpack_require__(210);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** app */
var HelloMessage = function HelloMessage(props) {
  return _react2.default.createElement(
    'div',
    null,
    'Hello ',
    props.name
  );
};

HelloMessage.propTypes = {
  name: _propTypes2.default.string.isRequired
};

_reactDom2.default.render(_react2.default.createElement(HelloMessage, { name: 'Taylor' }), document.getElementById('root'));

/***/ }),

/***/ 210:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[194]);