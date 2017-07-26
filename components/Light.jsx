const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  this.state = {
      name: this.props.name || this.props.key,
      image: this.props.image
  };

  changeName: function(name) {
    this.setState({name});
  },

  changeImage: function(powerState) {
    if(powerState === 36)
      this.setState({image: 'resources/img/off.png'});
    else if(powerState === 35)
      this.setState({image: 'resources/img/on.png'});
    else
      this.setState({image: 'resources/img/dc.png'});
  },

  render: function() {
    return(
      <div class="lightbulb">
         <img class="bulb-image"
           src={this.state.image} value={this.props.key} />
         <h4>{this.state.name}</h4>
      </div>
    )
  }
});

function lightPost(key,url) {
  $.ajax({
    type: "POST",
    url: "/api/" + url,
    data: JSON.stringify({
       'access_token': this.,
     }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(result) {
      console.log(result.responseText);
    },
    failure: function(result) {
      console.log(result.responseText);
    },
    error: function(result) {
      console.log(result.responseText);
    }
  });
}
