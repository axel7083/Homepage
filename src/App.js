import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import ShortcutSection  from './Components/ShortcutSection.component'
import TodoSection  from './Components/TodoSection.component'
import Home  from './Components/Home.component'
import {createClient} from "pexels";

import './App.css';
import {toDataUrl} from './Utils'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      background: "",
      photographer_url: "",
      photographer: ""
    };
  }

  componentDidMount() {
    /*const client = createClient('563492ad6f91700001000001c3951a9a512740f593c60a433aa03598');
    const query = 'wallpaper';
    client.photos.search({ query, per_page: 1 }).then(photos => {

      console.log("Photo by " + photos.photos[0].photographer);
      this.setState({photographer: photos.photos[0].photographer, photographer_url:photos.photos[0].photographer_url})
      toDataUrl(photos.photos[0].src.original,(base64) => {
        //console.log(base64);
        this.setState({background: base64});
      })

    });*/

  }

  render() {
    return (
      <div className="App" onSelect={() => {return false}}>
        <Home/>
        {/*<ShortcutSection name="Favorite" allowManualAdding={true}/>
        <ShortcutSection name="Most visited" allowManualAdding={false}/>
        <TodoSection/>
        <span className="author"><b>Photo by <a target="_blank" href={this.state.photographer_url}>{this.state.photographer}</a></b>
          <i style={{padding:"10px"}} className="fa fa-camera-retro fa-sm"></i></span>*/}
      </div>
    );
  }
}

export default App;
