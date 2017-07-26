const React = require('react');
const createReactClass = require('create-react-class');

const Light = require('./Light.jsx');

module.exports = createReactClass({
  render: function() {
    var apikey = this.props.apikey;
    var Lights = this.props.bulbs.map((bulb) =>
      <Light key={bulb.ipaddr} name={bulb.name} image={bulb.image} />
    );

    return(
      <html lang="en">
        <head>
             <title>Flux Hub</title>
             <script type="text/javascript" src="resources/js/jquery-3.2.1.min.js"></script>
             <script type="text/javascript" src="resources/js/transactions.js"></script>
         </head>

         <body>
           <h2>React Flux Hub</h2>
           <div>
             Light Info:
           </div>
           <form action="">
             <button id="on-btn" value={apikey} name="on_button">Power on</button>
             <button id="off-btn" value={apikey} name="off_button">Power off</button>
             <button id="toggle-btn" value={apikey} name="toggle_button">Toggle</button>
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
