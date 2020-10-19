import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Home  from './Components/Home.component'
import {createClient} from "pexels";

import './App.css';

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      background: "",
    };
  }



  componentDidMount() {
    const client = createClient('563492ad6f91700001000001c3951a9a512740f593c60a433aa03598');
    const query = 'Forest';
    client.photos.search({ query, per_page: 1 }).then(photos => {

      toDataUrl(photos.photos[0].src.original,(base64) => {
        console.log(base64);
        this.setState({background: base64});
      })

    });

  }

  render() {
    return (
      <div className="App" style={{backgroundImage: "url("+ this.state.background +")"}}>
        <Home />
      </div>
    );
  }
}

export default App;
