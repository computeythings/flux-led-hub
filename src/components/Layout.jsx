const React = require('react');
const createReactClass = require('create-react-class');

const Light = require('./Light.jsx');

module.exports = createReactClass({
  render: function() {
    var apikey = this.props.apikey;
    var Lights = this.props.bulbs.map((bulb) =>
      <Light apikey={this.props.apikey} name={bulb.name} image={bulb.image} 
        ipaddr={bulb.ipaddr} />
    );

    return(
      <html lang="en">
        <head>
           <title>Flux Hub</title>
           <link rel="stylesheet" href="resources/css/style.css" />
           <script type="text/javascript" src="resources/js/jquery-3.2.1.min.js"></script>
           <script type="text/javascript" src="/socket.io/socket.io.js"></script>
           <script type="text/javascript" src="resources/js/socketlistener.js"></script>
           <script type="text/javascript" src="resources/js/transactions.js"></script>
           <script type="text/javascript" src="resources/js/navbar.js"></script>
         </head>

         <body>
           <h2>React Flux Hub</h2>
           <div>
             Light Info:
           </div>
           <form action="">
             <button id="on-btn" className="light-btn" value="on">All on</button>
             <button id="off-btn" className="light-btn" value="off" >All off</button>
             <button id="toggle-btn" className="light-btn" value="toggle">Toggle All</button>
           </form>

           <div id="lights">
             {Lights}
           </div>

           <script dangerouslySetInnerHTML={{
             __html: 'window.PROPS=' + JSON.stringify(this.props)
           }} />
           <script src="resources/js/bundle.js" />
         </body>
       </html>
    )
  }
});
