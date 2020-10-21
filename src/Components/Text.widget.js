/*global chrome*/
import React from "react";
import { Container ,Form} from 'react-bootstrap';
import Widget from "../Widget";

import ColorPicker from '@mapbox/react-colorpickr'


export default class TodoWidget extends Widget {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {};

        this.loadState((isEmpty) => {
            if(isEmpty)
            {
                //Init with default data
                this.setState({value:"Title",color:"#FFF"});
            }

            this.setState({editor:false, OnEditorChangeListener:(value) => {
                    this.setState({editor:value});

                    if(!value)
                        this.saveState(() => {
                            //console.log("Saved");
                        })
            }});
        });
    }

    onChange(color) {
        console.log(color);
        var bgColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        this.setState({ color: bgColor });
    };

    render() {

        let elem = this.state.editor?
            <div><Form.Control style={{maxWidth:"100%",color:this.state.color, background:"rgba(255,255,255,0.52)"}} size="lg" type="text" placeholder="Large text" value={this.state.value} onChange={e => this.setState({ value: e.target.value })} /><ColorPicker onChange={this.onChange} /></div>:
            <Form.Label style={{maxWidth:"100%",color:this.state.color}} column="lg" lg={2}>{this.state.value}</Form.Label>

        return (
            <Container className="section todo ">
                <Form.Group >
                    {elem}
                </Form.Group>
            </Container>
        );
    }
}