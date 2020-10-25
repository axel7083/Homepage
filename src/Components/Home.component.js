/*global chrome*/
import React, {Component} from "react";
import {Card, Row, Container, Col, Image, Modal, Button, Form, Table, Spinner} from 'react-bootstrap';
import {getComponentByID,randomIntFromInterval,cachingImage,exportAllData} from './../Utils';
import Gallery  from './Gallery.component'
import { v4 as uuidv4 } from 'uuid';
import default_config from './../default_config.json';


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
        this.onImport = this.onImport.bind(this);
        this.onExport = this.onExport.bind(this);
        this.firstLaunch = this.firstLaunch.bind(this);

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
            restoreModal:false,
        };


        if(chrome.storage !== undefined) {

            chrome.storage.local.get("home", function (items) {
                if(!items["home"]) {
                    this.firstLaunch();
                    return;
                }
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

    firstLaunch()
    {
        console.log("First launch");
        this.onImport(default_config);
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

        this.setState({editMode: !this.state.editMode},() => {
            this.save(() => {});
        })
        //this.forceUpdate();

    }

    save(callback)
    {
        this.setState({buffer:undefined}, () => {
                chrome.storage.local.set({ "home": this.state.widgets}, function(){
                    //  Data's been saved boys and girls, go on home
                    console.log(this.state.widgets);
                    console.log("Saved.");
                    callback();
                }.bind(this));
        })



       // exportAllData(this.state.widgets);
    }

    onAdd()
    {
        console.log("Creating new component: " + this.state.newType);
        this.state.widgets.push({UUID:uuidv4(),componentID:parseInt(this.state.newType),top:"40%",left:"40%"});

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
                        this.setState({
                            backgroundImage:"url("+selected.photos[index].src.original+")",
                            spinning:false,
                            credit:{photographer:selected.photos[index].photographer,photographer_url:selected.photos[index].photographer_url}
                        });
                    })
                else {
                    let index = randomIntFromInterval(0, urls.length - 1);
                    this.setState({
                        backgroundImage:"url("+selected.photos[index].src.original+")",
                        spinning:false,
                        credit:{photographer:selected.photos[index].photographer,photographer_url:selected.photos[index].photographer_url}
                    });
                }


            }.bind(this));

        });

    }


    onImport(data = undefined)
    {
        if(data === undefined)
            data = JSON.parse(this.state.buffer);

        let count = 0;
        data.forEach((item,i) => {
            let key = Object.keys(item)[0];
            console.log("Saving " + key + " ")
            chrome.storage.local.set({ [key]: item[key]},() => {
                console.log("Saved");
                count++;

                if(count === data.length - 1)
                {
                    console.log("Reloading..");
                    window.location.reload();
                }
            });
        })
    }

    onExport()
    {
        console.log("On Export");
        exportAllData(this.state.widgets,(res) => {
            console.log("Exporting..");
            this.setState({buffer:JSON.stringify(res)});
        })
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
                {this.state.credit?<Container className="credit">
                    <span>This Photo was taken by <a target="_blank" href={this.state.credit.photographer_url}>{this.state.credit.photographer}</a> on Pexels.</span>
                </Container>:<></>}

                <Container className="tools">
                    <Row>
                        <Col md="auto"><a href="#"><i className="fa fa-paint-brush fa-2x" onClick={this.onEdit}></i></a></Col>
                        {/*<Col md="auto"><a href="#"><i className="fa fa-cog fa-2x"
                                                       onClick={() => this.setState({restoreModal: true})}></i></a></Col>*/}
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
                                    <option value={3}>Clock widget</option>
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

                <Modal
                    show={this.state.restoreModal}
                    onHide={() => this.setState({restoreModal:false})}
                    backdrop="static"
                    size="lg"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Exporting / Importing tool</Modal.Title>
                    </Modal.Header>
                    <Form>
                        <Form.Group controlId="exampleForm.Data">
                            <Form.Label>Data</Form.Label>
                            <Form.Control as="textarea" rows={10} value={this.state.buffer} onChange={e => this.setState({ buffer: e.target.value })}/>
                        </Form.Group>
                        <Button variant="primary" onClick={this.onExport}>Export (Storage->Here)</Button>{' '}
                        <Button variant="secondary" onClick={() => this.onImport()}>Import (Here->Storage)</Button>{' '}
                    </Form>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({restoreModal:false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}