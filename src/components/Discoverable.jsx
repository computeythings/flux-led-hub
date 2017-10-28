const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div className="discoverable">
        <img className="bulb-image" src="resources/img/on.png" onClick={this.props.toggleLight}/>
        <br />
        <h4>{this.props.ipaddr}</h4>
      </div>
    );
  }
});
