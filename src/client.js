const React = require('react');
const ReactDOM = require('react-dom');
const Component = require('./components/Layout.jsx');

var props = window.PROPS;

ReactDOM.render(
  React.createElement(Component, props), document
);
