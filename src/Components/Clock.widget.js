/*global chrome*/
import React from "react";
import { Container} from 'react-bootstrap';
import Widget from "../Widget";

/**
 * Thanks to https://codepen.io/rikschennink/pen/lyuaf for the design/css
 * **/
export default class Clock extends Widget {

    constructor(props) {
        super(props);

        this.setTime = this.setTime.bind(this);
        this.separate = this.separate.bind(this);

        this.state = {
            time: []
        }

    }

    setTime()
    {
        let now = new Date();

        let seconds = now.getSeconds();
        let minutes = now.getMinutes();
        let hours = now.getHours();

        let array = [];

        array = this.separate(hours,array)
        array = this.separate(minutes,array)
        array = this.separate(seconds,array)

        this.setState({time:array});
    }

    separate(val,array)
    {
        let out = val + "";
        if(out.length === 1)
        {
            array.push("0");
            array.push(out);
        }
        else
        {
            array.push(out.substring(0,1));
            array.push(out.substring(1,2));
        }
        return array;
    }

    componentDidMount() {
        this.setTime();
        this.interval = setInterval(() => this.setTime(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        return (
            <Container className="section todo ">
                <span className="clock ">
                    {this.state.time?this.state.time.map((item,i) => {
                            return <span data-now={item} className="flip">&nbsp;</span>
                        }):<></>}
                </span>
            </Container>
        );
    }
}