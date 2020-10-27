import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Home  from './Components/Home.component'
import Clock  from './Components/Clock.widget'
import {Alert} from 'react-bootstrap';
import './App.css';
import './Clock.css';


const VERSION = "0.2.2";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        background: "",
        newVersion: false,
    };

    //We check if a new version is available

  }

  componentDidMount() {

    //Checking version using is the last one.
    fetch('https://api.github.com/repos/axel0070/Homepage/releases/latest', {
      method: 'GET'
    })
        .then(function(response) { return response.json(); })
        .then(function(json) {
          console.log("Current version:" + json.tag_name);
          if(json.tag_name !== VERSION)
          {
            this.setState({newVersion:true});
          }
        }.bind(this));
  }

  render() {
    return (
      <div className="App" onSelect={() => {return false}}>
          <Home/>
        {this.state.newVersion?<Alert className="notification" variant="warning">A new version is available, update it <Alert.Link href="https://chrome.google.com/webstore/detail/homepage/lldjhjmaljndmlnbomjcofanjalieahb">here</Alert.Link></Alert>:<></>}

      </div>
    );
  }
}

export default App;
