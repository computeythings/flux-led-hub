const React = require('react');
const createReactClass = require('create-react-class');
const Modal = require('react-modal');
const transactions = require('./rest.js');
const Light = require('./Light.jsx');
const BulbProperties = require('./BulbProperties.jsx');
const Discoverable = require('./Discoverable.jsx');
const io = require('socket.io-client');
const socket = io('http://localhost:8000');

module.exports = createReactClass({
  componentDidMount: function() {
    // 'newbulb' received when a new device is added via scan
    socket.on('newbulb', (bulb) => {
      console.log(`Adding new bulb ${bulb.ipaddr}`);
      this.setState({ Lights: [...this.state.Lights,
        <Light name={bulb.name} ipaddr={bulb.ipaddr} key={bulb.ipaddr}
          powerState={bulb.powerState} brightness={bulb.brightness}
          toggleLight={() => this._toggleLights('toggle', [bulb.ipaddr])}
          apikey={this.props.apikey} eventListener={socket} />
        ]});
    });
  },
  getInitialState: function() {
    // Default values - hide navbar + not scanning + map of saved devices list
    return {
      showNav: false,
      showProperties: false,
      scanning: false,
      Lights: this.props.bulbs.map((bulb) =>
        <Light name={bulb.name} ipaddr={bulb.ipaddr} key={bulb.ipaddr}
          powerState={bulb.powerState} brightness={bulb.brightness}
          toggleLight={() => this._toggleLights('toggle', [bulb.ipaddr])}
          edit={() => this._editBulb(bulb.ipaddr)}
          apikey={this.props.apikey} eventListener={socket} />,
      )
    };
  },
  _closeNav: function() {
    if(this.state.showNav)
      this._toggleNav();
  },
  _toggleNav: function() {
    this.setState({showNav: !this.state.showNav});
  },
  _toggleProperties: function() {
    this.setState({showProperties: !this.state.showProperties});
  },
  _addBulb: function(ipaddr, index, name) {
    transactions.post('add', {'access_token': this.props.apikey,
                        'ipaddr': ipaddr});
    var scanList = this.state.scanResults;
    delete scanList[index];
    console.log(scanList);
    this.setState({scanResults: scanList});
  },
  _editBulb: function(ipaddr) {
    this._toggleProperties();
    this.setState({modalContent:
      <BulbProperties hide={() => this._toggleProperties()} ipaddr={ipaddr}/>
    });
  },
  _toggleLights: async function(url, target) {
    let result = await transactions.post(url, {
      'access_token': this.props.apikey,
      'target': target
    });
    console.log(await result.text());
  },
  _scan: async function() {
    this.setState({scanning: true, scanResults: ''});
    let discovered = await transactions.post(
      'scan', {'access_token': this.props.apikey});
    this.setScanResults(await discovered.json());
  },
  setScanResults: function(lightArray) {
    this.setState({scanning: false});
    var noDupes = [];
    var hasDupes;
    for(var i = 0; i < lightArray.length; i++) {
      hasDupes = false;
      for(var j = 0; j < this.props.bulbs.length; j++) {
        if(this.props.bulbs[j].ipaddr === lightArray[i]) {
          hasDupes = true;
          break;
        }
      }
      if(!hasDupes) {
        noDupes.push(lightArray[i]);
      }
    }
    if(noDupes.length > 0) {
      console.log(noDupes);
      this.setState({scanResults:
        noDupes.map(
          (discovered, index) => <Discoverable ipaddr={discovered}
                key={discovered} _addBulb={() =>
                this._addBulb(ipaddr=discovered, index=index)}/>,
       )
    });
    }
    else
      this.setState({scanResults: 'No New Bulbs Found'});
  },
  render: function() {
    return (
      <html lang="en">
      <head>
           <meta charSet="UTF-8" />
           <title>Flux Hub</title>
           <link rel="stylesheet" href="resources/css/style.css" />
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
          <div id="scan-btn" className="menuitem"
            onClick={this._scan}>Scan
          </div>
          <div className="loader" hidden={!this.state.scanning}></div>
          <div className="menu-content" hidden={!this.state.showNav}>
            {this.state.scanResults}
          </div>
        </div>
        <div id="main" className={this.state.showNav ? 'menu-open' :''}
          onClick={this._closeNav}>
          <Modal className="modal" isOpen={this.state.showProperties}
            ariaHideApp={false}>
            {this.state.modalContent}
          </Modal>
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
