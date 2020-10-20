/*global chrome*/
import React, {Component} from "react";
import { Card , Row, Container ,Col ,Image, Modal, Button,Form,Table} from 'react-bootstrap';
import {getComponentByID} from './../Utils';



export default class TodoSectionComponent extends Component {

    constructor(props) {
        super(props);

        this.mouseMove = this.mouseMove.bind(this);
        this.selected = this.selected.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.onEdit = this.onEdit.bind(this);


        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseup);

        this.state = {
            editMode: false,
            mouseDown: false,
            selected: -1,
            widgets: []
        };


        if(chrome.storage !== undefined) {

            chrome.storage.local.get("home", function (items) {
                console.log("home: " + JSON.stringify(items));
                this.setState({widgets:items.home})
            }.bind(this));
        }
        else
        {
            console.log("Debugging");
        }
    }

    mouseMove(e) {
        if(this.state.selected === -1)
            return;

        let widget = this.state.widgets[this.state.selected];

        // get new mouse coordinates
        const newMouseY = e.clientY;
        const newMouseX = e.clientX;

        const width = window.innerWidth;
        const height = window.innerHeight;

        widget.top = Math.floor((newMouseY/height)*100)+"%";
        widget.left =  Math.floor((newMouseX/width)*100)+"%";

        this.state.widgets[this.state.selected] = widget;
        this.setState({widgets:this.state.widgets});
    }

    mouseup() {
        this.setState({selected: -1});
    }


    selected(index) {
        if(this.state.selected !== -1) {
            this.setState({selected: -1});
            return;
        }
        console.log("Selected " + index + " selected:" + this.state.selected);

        this.setState({selected:index});

        console.log("MouseDown");
        this.setState({mouseDown:true});
    }

    onEdit() {
        this.setState({editMode: !this.state.editMode})
        this.forceUpdate();

        if(this.state.editMode)
            chrome.storage.local.set({ "home": this.state.widgets}, function(){
                //  Data's been saved boys and girls, go on home
                console.log(this.state.widgets);
                console.log("Saved.");
            }.bind(this));
    }

    render() {


        return (
            <Container className="home">
                {this.state.widgets.map((item,i) => {
                    return <div key={i}
                                className="movable"
                                style={{top:item.top,left:item.left}}>
                        {this.state.editMode?<i className="fa fa-arrows-alt dragIcon" onMouseDown={() => this.selected(i)}/>:<></>}
                        {React.createElement(getComponentByID(item.componentID),item.props)}
                    </div>
                })}

                <Container className="tools">
                    <Row>
                        <Col md="auto"><a href="#"><i className="fa fa-paint-brush fa-2x" onClick={this.onEdit}></i></a></Col>
                        <Col md="auto"><i className="fa fa-cog fa-2x"></i></Col>
                    </Row>
                </Container>

            </Container>
        );
    }
}