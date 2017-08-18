const React = require('react');
const createReactClass = require('create-react-class');
const transactions = require('./rest.js');

module.exports = createReactClass({
  getInitialState: function() {
    return {
      showNav: false
    };
  },
  _toggleNav: function() {
    this.setState({showNav: !this.state.showNav});
  },
  _handleClick: function(message) {
    alert(message);
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
           <link rel="stylesheet" href="./resources/css/style.css" />
           <meta name="description" content="DESCRIPTION" />
           <script type="text/javascript" src="resources/js/jquery-3.2.1.min.js" />
           <script type="text/javascript" src="/socket.io/socket.io.js" />
       </head>

       <body>
         <div id="navbar"
           className={`sidenav ${this.state.showNav ? 'menu-open' :''}`}>
           <button className={`hamburger hamburger--arrowturn closebtn
             ${this.state.showNav ? 'is-active' :''}`} type="button"
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
            <h1>{this.props.myTestProp}</h1>
            <button onClick={() => this._handleClick('LOOK AT MEEE!')}>
              I'm Mr. Meeseeks</button>

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
