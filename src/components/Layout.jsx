const React = require('react');
const createReactClass = require('create-react-class');
const transactions = require('./rest.js');
const Light = require('./Light.jsx');
const io = require('socket.io-client');
const socket = io('localhost:8000');

module.exports = createReactClass({
  getInitialState: function() {
    return {
      showNav: false,
      Lights: this.props.bulbs.map((bulb) =>
        <Light name={bulb.name} ipaddr={bulb.ipaddr} key={bulb.ipaddr}
          powerState={bulb.powerState} brightness={bulb.brightness}
          toggleLight={() => this._toggleLights('toggle', [bulb.ipaddr])}
          apikey={this.props.apikey} eventListener={socket} />
      )
    };
  },
  _toggleNav: function() {
    this.setState({showNav: !this.state.showNav});
  },
  _toggleLights: async function(url, target) {
    let result = await transactions.post(url, {
      'access_token': this.props.apikey,
      'target': target
    });
    console.log(await result.text());
  },
  _scan: async function() {
    let discovered = await transactions.post(
      'scan', {'access_token': this.props.apikey});
    this.setScanResults(await discovered.json());
  },
  setScanResults: function(lightArray) {
    this.setState({scanResults: lightArray});
    //TODO: Handle this in html to create a nice scanned list.
  },
  render: function() {
    return (
      <html lang="en">
      <head>
           <meta charSet="UTF-8" />
           <title>Flux Hub</title>
           <link rel="stylesheet" href="resources/css/style.css" />
           <meta name="description" content="DESCRIPTION" />
       </head>

       <body>
         <div id="navbar"
           className={`sidenav ${this.state.showNav ? 'menu-open':''}`}>
           <button className={`hamburger hamburger--arrowturn closebtn
             ${this.state.showNav ? 'is-active':''}`} type="button"
             onClick={this._toggleNav}>
             <span className="hamburger-box">
               <span className="hamburger-inner"></span>
             </span>
           </button>
          <a className="menuitem" onClick={this._scan}>Scan</a>
          <a id="test-a">{this.state.scanResults}</a>
        </div>
        <div id="main" className={this.state.showNav ? 'menu-open' :''}>
          <div id="header">
            <h2>Flux Hub</h2>
            <button id="on-btn" className="light-btn" onClick={() =>
                 this._toggleLights('on','all')} >All on</button>
            <button id="off-btn" className="light-btn" onClick={() =>
                this._toggleLights('off','all')} >All off</button>
            <button id="toggle-btn" className="light-btn" onClick={() =>
                this._toggleLights('toggle','all')} >Toggle All</button>
          </div>
          <div id="lights">
            {this.state.Lights}

            <script dangerouslySetInnerHTML={{
              __html: 'window.PROPS=' + JSON.stringify(this.props)
            }} />
            <script type='text/javascript' src='./bundle.js' />
          </div>
        </div>
       </body>

      </html>
    );
  }
});
