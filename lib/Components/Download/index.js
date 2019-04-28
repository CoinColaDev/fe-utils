"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = _interopRequireDefault(require("./styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Download =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Download, _React$Component);

  function Download() {
    _classCallCheck(this, Download);

    return _possibleConstructorReturn(this, _getPrototypeOf(Download).apply(this, arguments));
  }

  _createClass(Download, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          desc = _this$props.desc,
          okText = _this$props.okText,
          onClose = _this$props.onClose,
          onOk = _this$props.onOk;
      return _react.default.createElement("div", {
        style: _styles.default.libDownload
      }, _react.default.createElement("div", {
        style: _styles.default.libClose,
        onClick: function onClick() {
          onClose && onClose();
        }
      }, _react.default.createElement("span", {
        style: _styles.default.libCloseBtn
      })), _react.default.createElement("div", {
        style: _styles.default.libInnerLogo
      }), _react.default.createElement("div", {
        style: _styles.default.libInnerContent
      }, _react.default.createElement("div", {
        style: _styles.default.libInnerTitle
      }, title || 'title'), _react.default.createElement("div", {
        style: _styles.default.libInnerDesc
      }, desc || 'desc')), _react.default.createElement("div", {
        style: _styles.default.libRedirect,
        onClick: function onClick() {
          onOk && onOk();
        }
      }, okText || 'okText'));
    }
  }]);

  return Download;
}(_react.default.Component);

exports.default = Download;