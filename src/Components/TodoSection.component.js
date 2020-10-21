/*global chrome*/
import React, {Component} from "react";
import { Card , Row, Container ,Col ,Image, Modal, Button,Form,Table} from 'react-bootstrap';

const TAG = "TodoList";

export default class TodoSectionComponent extends Component {

    constructor(props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {
            text:"",
            todoList:["Finish this project","Found motivation","Found my soul back"]
        }
    }

    componentDidMount() {
        chrome.storage.local.get(TAG, function (items) {
            console.log(TAG + ": " + items[TAG]);
            if(items[TAG]=== undefined)
                return;
            this.setState({todoList:items[TAG]})
        }.bind(this));
    }

    onAdd()
    {
        if(this.state.text.length === 0 )
            return;
        this.state.todoList.push(this.state.text);
        this.setState({todoList:this.state.todoList,text:""}, () => {
            chrome.storage.local.set({ [TAG]: this.state.todoList}, function(){
                //  Data's been saved boys and girls, go on home
            });
        });

    }

    onRemove(index)
    {
        this.state.todoList.splice(index,1);
        this.setState({todoList:this.state.todoList}, () => {
        chrome.storage.local.set({ [TAG]: this.state.todoList}, function(){
            //  Data's been saved boys and girls, go on home
        });
    });
    }
    render() {
        return (
            <Container className="section todo ">
                <Card  md="auto" style={{maxWidth:" 25rem"}}>
                    <Card.Header style={{paddingLeft:"35px"}} as="h5">Todo List</Card.Header>
                    <Table striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tasks</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.todoList.map((item,i) => {
                            return <tr key={i}>
                                <td>{i+1}</td>
                                <td>{item}</td>
                                <td style={{textAlign:"center"}}><a href="#" style={{color:"red"}} onClick={() => this.onRemove(i)}><i className="fa fa-trash"></i></a></td>
                            </tr>
                        })}
                        </tbody>
                    </Table>
                    <Form style={{padding: "0rem 1rem 0rem 1rem"}}>
                        <Form.Row className="align-items-center">
                            <Col xs="auto">
                                <Form.Control
                                    className="mb-2"
                                    value={this.state.text}
                                    onChange={e => this.setState({ text: e.target.value })}
                                    placeholder="Things to do..."
                                />
                            </Col>
                            <Col xs="auto">
                                <Button className="mb-2" onClick={this.onAdd}>
                                    Add
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Card>
            </Container>
        );
    }
}