import React, { Component } from "react";
import Slider from "react-slick";
import {Card, Row, Container, Col, Image, Modal, Button, Form, Table, Spinner} from 'react-bootstrap';

const slider_1 = [
    [
        {title:"Landscape",src:"https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Forest",src:"https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Mountain",src:"https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"}],
    [
        {title:"Marine life",src:"https://images.pexels.com/photos/1086584/pexels-photo-1086584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Ocean",src:"https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Fruit",src:"https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"}],
    [
        {title:"Animals", src:"https://images.pexels.com/photos/689784/pexels-photo-689784.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Dogs",src:"https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"},
        {title:"Cats",src:"https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=240&w=403"}]
]

export default class SimpleSlider extends Component {

    constructor() {
        super();

        this.onAdd = this.onAdd.bind(this);

        this.state = {tag:"",tags:[]};
    }

    onAdd()
    {
        this.state.tags.push(this.state.tag);
        this.setState({tags:this.state.tags,tag:""});
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false,
        };
        return (
            <div>
                <h3 style={{marginLeft:"1rem",marginTop:"1rem"}}>Collections</h3>
                <Slider {...settings}>
                    {slider_1.map((item,i) => {
                        return <div style={{textAlign:"center",display:"contents"}} key={i}>
                            <Row>
                            {item.map((item2,i2) => {
                                return <Col><Card key={i2} className={"niceBG"} style={{backgroundImage: "url("+item2.src+")", height:"15rem",margin:"1rem",borderRadius:"20px"}}>
                                    <h3 className={"textOutline"} style={{margin:"auto"}}>{item2.title}</h3>
                                </Card></Col>
                            })}
                        </Row>
                        </div>
                    })}
                </Slider>
                <h3 style={{marginLeft:"1rem",marginTop:"1rem"}}>Choose your own themes</h3>
                {(this.state.tags.length===0)?<span style={{marginLeft:"1rem",marginTop:"1rem"}}>No custom tag saved.</span>:<></>}
                <Row style={{margin:"1rem 0 1rem 0"}}>
                {this.state.tags.map((item,i) => {
                    return <Col style={{flexGrow:"0"}}><Card key={i} style={{borderRadius:"20px",width:"fit-content",padding:"0.5rem 1rem 0.5rem 1rem", marginBottom:"0.5rem"}}><span style={{margin:"auto"}}>{item}</span></Card></Col>
                })}
                </Row>
                <Form style={{padding: "0rem 1rem 0rem 1rem"}}>
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Control
                                className="mb-2"
                                value={this.state.tag}
                                onChange={e => this.setState({ tag: e.target.value })}
                                placeholder="Forest, Cats, Dogs..."
                                onKeyPress={event => {
                                    if (event.key === "Enter") {
                                        this.onAdd();
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button className="mb-2" onClick={this.onAdd}>
                                Add
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>

            </div>
        );
    }
}