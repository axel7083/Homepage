/*global chrome*/
import React from "react";
import Widget from "../Widget";

import { Card , Row, Container ,Col ,Image, Modal, Button,Form} from 'react-bootstrap';
import {extractHostname} from './../Utils';
//const favURL = "https://besticon-demo.herokuapp.com/allicons.json?url=" //Down ???
const favURL = "chrome://favicon/size/64@1x/"

export default class ShortcutWidget extends Widget {

    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.state = {};


    }

    componentDidMount() {
        this.loadState((isEmpty) => {
            if(isEmpty)
            {
                //Init with default data
                this.setState({allowManualAdding:true,shortcut:[], icon:""});
            }

            /*this.setState({OnEditorChangeListener:(value) => {
                console.log("OnEditorChange: " + value);
            }});*/
        });
    }

    handleShow() {
        this.setState({show:true})
    }

    handleClose() {
        this.setState({show:false})
    }

    handleAdd() {
        //console.log(this.state.url);
        //console.log(this.state.icon);
        this.setState({disabled:true}, () => {
            if(this.state.icon.length === 0)
            {
                /*fetch(favURL + this.state.url)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        if(data.icons === undefined)
                        {
                            this.state.shortcut.push({
                                src: undefined,
                                url: this.state.url,
                                customName: this.state.customName
                            });
                        }
                        else
                        {
                            this.state.shortcut.push({
                                src: data.icons[0].url,
                                url: this.state.url,
                                customName: this.state.customName,
                            });
                        }

                        this.setState({show: false, shortcut: this.state.shortcut,icon:"",customName:"",url:"",disabled:false},() => {

                            this.saveState(() => {
                                console.log("State saved.");
                            });
                        });
                        //console.log(data)
                    })
                    .catch((err) => {
                        // Do something for an error here
                    })*/
                this.state.shortcut.push({
                    src: favURL + this.state.url,
                    url: this.state.url,
                    customName: this.state.customName,
                });

                this.setState({show: false, shortcut: this.state.shortcut,icon:"",customName:"",url:"",disabled:false},() => {
                    this.saveState(() => {
                        console.log("State saved.");
                    });
                });
            }
            else //User put his own icon
            {
                this.state.shortcut.push({
                    src: this.state.icon,
                    url: this.state.url,
                    customName: this.state.customName,
                });
                this.setState({show: false, shortcut: this.state.shortcut,icon:"",customName:"",url:"",disabled:false},() => {

                    this.saveState(() => {
                        console.log("State saved.");
                    });

                });
            }
        })


    }

    handleRemove(index)
    {
        this.state.shortcut.splice(index,1);
        this.setState({shortcut: this.state.shortcut}, () => {

            this.saveState(() => {
                console.log("State saved.");
            });

        });
        //console.log("Removing " + index);
    }

    render() {

        let add;
        if(this.state.allowManualAdding)
        {
            add = <Col md="auto" >
                <Card className="shortcut">
                    <a href="#" onClick={this.handleShow}>
                        <Card.Body>
                            <Image style={{width: "3rem",height: "3rem"}} src="./images/plus.png" fluid />
                        </Card.Body>
                    </a>
                </Card>
            </Col>;
        }
        return (
            <Container className="section">
                <Row style={{textAlign: "center", fontSize:"x-small"}}>
                    {this.state.shortcut?this.state.shortcut.map((item,i) => {
                        return <Col md="auto" key={i} >
                            <Card className="shortcut">
                                <a href="#" onClick={() => this.handleRemove(i)}><i className="fa fa-close fa-sm closeIcon"></i></a>
                                <a href={item.url} target="_blank">
                                    <Card.Body>
                                        {item.src?<Image style={{width: "3rem",height: "3rem"}} src={item.src} fluid />:<></>}
                                        <br/>
                                        <span>{item.customName?item.customName:extractHostname(item.url)}</span>
                                    </Card.Body>
                                </a>
                            </Card>
                        </Col>
                    }):<></>}
                    {add}
                </Row>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add shortcut</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control id="name"
                                          type="text"
                                          placeholder="Example"
                                          value={this.state.customName}
                                          onChange={e => this.setState({ customName: e.target.value })}/>
                            <br />
                            <Form.Label>Url</Form.Label>
                            <Form.Control id="url"
                                          type="url"
                                          placeholder="http://example.com/"
                                          value={this.state.url}
                                          onChange={e => this.setState({ url: e.target.value })}/>
                            <br />
                            <Form.Label>Custom icon (Optional)</Form.Label>
                            <Form.Control id="url"
                                          type="url"
                                          placeholder="http://example.com/image.png"
                                          value={this.state.icon}
                                          onChange={e => this.setState({ icon: e.target.value })}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose} disabled={this.state.disabled}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleAdd} disabled={this.state.disabled}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}