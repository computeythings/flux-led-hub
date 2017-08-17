import React from 'react';
import lightPost from './transaction';

const data = {
  'on': {
    'icon': 'resources/img/on.png',
  },
  'off': {
    'icon': 'resources/img/off.png',
  },
  'dc': {
    'icon': 'resources/img/dc.png',
  }
};

function handleClick(url, data) {
  lightPost(url, data);
}

export default class Light extends React.Component {
  render() {
    const name = this.props.name;
    const icon = data[this.props.powerState].icon;
    const data = { 'target': this.props.ipaddr,
    'access_token': this.props.apikey};

    return (
      <span className="lightbulb">
        <img className="icon" src=`{icon}`
          onClick={() => this.handleClick("toggle", data)}/>
        <br/><input type="range" class="dimmer" value="100"/>
        <h4>{name}</h4>
      </span>
    );
  }
}
