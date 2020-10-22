/*global chrome*/
import React, {Component} from "react";
import {Card, Row, Container, Col, Image, Modal, Button, Form, Table, Spinner} from 'react-bootstrap';
import {getComponentByID,randomIntFromInterval,cachingImage} from './../Utils';
import Gallery  from './Gallery.component'
import { v4 as uuidv4 } from 'uuid';



export default class Home extends Component {

    constructor(props) {
        super(props);

        this.mouseMove = this.mouseMove.bind(this);
        this.selected = this.selected.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.save = this.save.bind(this);
        this.onShowWallpaperModal = this.onShowWallpaperModal.bind(this);
        this.onHideWallpaperModal = this.onHideWallpaperModal.bind(this);
        this.reloadWallpaper = this.reloadWallpaper.bind(this);


        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseup);

        this.state = {
            editMode: false,
            mouseDown: false,
            selected: -1,
            widgets: [],
            newType:0,
            wallpaperModal:false,
            backgroundImage:"",
            spinning:false,
        };


        if(chrome.storage !== undefined) {

            chrome.storage.local.get("home", function (items) {
                if(!items["home"])
                    return;
                console.log("home: " + JSON.stringify(items));
                this.setState({widgets:items.home})
                this.reloadWallpaper(false);
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

    onDelete(index)
    {
        this.state.widgets.splice(index,1);
        //TODO: Found a fix, when removing, the delete one move strangely and only the last index disappear.
        this.save(() => {document.location.reload();});

        //this.setState({ state: this.state });
        //this.setState({widgets:this.state.widgets});
        //this.forceUpdate();
    }

    onEdit() {
        console.log("OnEdit:");
        console.log(this.state.widgets);

        this.setState({editMode: !this.state.editMode})
        this.forceUpdate();

        this.save(() => {});
    }

    save(callback)
    {
        if(this.state.editMode)
            chrome.storage.local.set({ "home": this.state.widgets}, function(){
                //  Data's been saved boys and girls, go on home
                console.log(this.state.widgets);
                console.log("Saved.");
                callback();
            }.bind(this));
    }

    onAdd()
    {
        console.log("Creating new component: " + this.state.newType);
        this.state.widgets.push({UUID:uuidv4(),componentID:parseInt(this.state.newType),top:"0%",left:"0%"});

        //this.forceUpdate();
        this.setState({widgets:this.state.widgets,show:false});
    }

    handleShow() {
        this.setState({show:true})
    }

    handleClose() {
        this.setState({show:false})
    }

    onShowWallpaperModal()
    {
        this.setState({wallpaperModal:true})
    }

    onHideWallpaperModal(){
        this.setState({wallpaperModal:false})
    }

    reloadWallpaper(needCaching)
    {
        console.log("Wallpaper reload request");
        this.onHideWallpaperModal();
        this.setState({spinning:true},() => {

            console.log("Get gallery from storage");
            chrome.storage.local.get("Gallery", function (items) {

                if(!items["Gallery"]) {
                    this.setState({spinning: false});
                    return;
                }

                //console.log("Data: " + JSON.stringify(items["Gallery"].selected));
                if(items["Gallery"] === undefined) {
                    console.log("Empty");
                    return;
                }
                let selected = items["Gallery"].selected;

                let urls = [];
                for(let i = 0 ; i < selected.photos.length; i ++)
                {
                    urls.push(selected.photos[i].src.original)
                }


                if(needCaching)
                    cachingImage(urls,(index) => {
                        this.setState({backgroundImage:"url("+selected.photos[index].src.original+")",spinning:false})
                    })
                else
                    this.setState({backgroundImage:"url("+selected.photos[randomIntFromInterval(0,urls.length-1)].src.original+")",spinning:false})


            }.bind(this));

        });

    }

    render() {


        return (
            <Container className="home" style={{backgroundImage:this.state.backgroundImage}}>
                {this.state.widgets?.map((item,i) => {
                    return <div key={i}
                                className="movable"
                                style={{top:item.top,left:item.left}}>
                        {this.state.editMode?<div className={"editMenu"} ><i className="fa fa-arrows-alt dragIcon" onMouseDown={() => this.selected(i)}/><br/><i className="fa fa-trash trashIcon" onClick={() => this.onDelete(i)}/></div>:<></>}
                        { React.createElement(getComponentByID(item.componentID), {UUID:item.UUID, editor:this.state.editMode})}
                    </div>
                })}

                <Container className="tools">
                    <Row>
                        <Col md="auto"><a href="#"><i className="fa fa-paint-brush fa-2x" onClick={this.onEdit}></i></a></Col>
                        {/*<Col md="auto"><i className="fa fa-cog fa-2x"></i></Col>*/}
                        <Col md="auto"><a href="#"><i className="fa fa-plus fa-2x" onClick={this.handleShow}></i></a></Col>
                        <Col md="auto"><a href="#"><i className="fa fa-image fa-2x" onClick={this.onShowWallpaperModal}></i></a></Col>
                    </Row>
                </Container>

                {this.state.spinning?<Spinner animation="border" role="status" style={{top: "50%", left: "50%", position:"absolute"}}>
                    <span className="sr-only">Loading...</span>
                </Spinner>: <></>}

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a widget</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Widgets</Form.Label>
                                <Form.Control as="select"
                                              value={this.state.newType}
                                              onChange={e => this.setState({ newType: e.target.value })}>
                                    <option value={0}>Shortcut widget</option>
                                    <option value={1}>Todo List</option>
                                    <option value={2}>Text widget</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.onAdd}>Add</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.wallpaperModal}
                    onHide={this.onHideWallpaperModal}
                    backdrop="static"
                    size="lg"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Pexels gallery</Modal.Title>
                    </Modal.Header>
                    <Gallery/>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({wallpaperModal:false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.reloadWallpaper(true)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}