const React = require('react');
const createReactClass = require('create-react-class');

const icons = {
  35: 'resources/img/on.png',
  36: 'resources/img/off.png',
  0: 'resources/img/dc.png'
};

module.exports = createReactClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      icon: icons[this.props.powerState],
      ipaddr: this.props.ipaddr,
      brightness: this.props.brightness
    };
  },
  _toggle: function() {

  },
  _handleChange: function() {

  },
  render: function(){
    return (
      <span className="lightbulb">
        <img className="bulb-image" src={this.state.icon} onClick={this.props.toggleLight}/>
        <br/><input type="range" className="dimmer" value={this.state.brightness} onChange={this._handleChange}/>
        <h4>{this.state.name || this.state.ipaddr}</h4>
      </span>
    );
  }
});
