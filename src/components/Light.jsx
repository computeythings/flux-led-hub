const React = require('react');
const createReactClass = require('create-react-class');
const transactions = require('./rest.js');

const icons = {
  35: 'resources/img/on.png',
  36: 'resources/img/off.png',
  0: 'resources/img/dc.png'
};

module.exports = createReactClass({
  getInitialState: function() {
    this.props.eventListener.on('update', (data) => {
      if(data.bulb === this.props.ipaddr && this.refs.root) {
        if(data.powerState) {
          this.setState({powerState: data.powerState});
        }
        if(data.name) {
          this.setState({name: data.name});
        }
        if(data.brightness) {
          this.refs.dimmer.value = data.brightness;
          this.setState({brightness: data.brightness});
        }
      }
    });
    return {
      name: this.props.name,
      powerState: this.props.powerState,
      brightness: this.props.brightness
    };
  },
  setBrightness: async function(brightness) {
    let result = await transactions.post('brightness', {
      'access_token': this.props.apikey,
      'target': [this.props.ipaddr],
      'brightness': brightness
    });
    console.log(await result.text());
  },
  _handleChange: function(e) {
    let value = e.target.value;
    this.setBrightness(value);
  },
  render: function(){
    return (
      <span className="lightbulb" ref="root">
        <img className="bulb-image" src={icons[this.state.powerState]} onClick={this.props.toggleLight}/>
        <br /> <input type="range" className="dimmer" ref="dimmer"
          defaultValue={this.state.brightness}
          onMouseUp={this._handleChange} />
        <h4>{this.state.name}</h4>
      </span>
    );
  }
});
