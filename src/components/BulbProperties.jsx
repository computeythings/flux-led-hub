const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  handleClick(e) {
    if (this.node.contains(e.target)) {
      console.log('You clicked INSIDE the component.')
    } else {
      console.log('You clicked OUTSIDE the component.')
    }
  },
  render: function() {
    return (
      <div className="modal-content">
        <h1>contentjsx {this.props.ipaddr}</h1>
      </div>
    );
  }
});
