const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    // TODO: Implement bulb edit form
    return (
      <div className="modal-content">
        <h1>{this.props.ipaddr}</h1>
        <ul>
          <li>name</li>
          <li>color</li>
          <li>brightness</li>
          <li>groups?</li>
        </ul>
      </div>
    );
  }
});
