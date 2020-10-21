/*global chrome*/
import React from "react";
import { Card , Container ,Col , Button,Form,Table} from 'react-bootstrap';
import Widget from "../Widget";


export default class TodoWidget extends Widget {

    constructor(props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {};

        this.loadState((isEmpty) => {
            if(isEmpty)
            {
                //Init with default data
                this.setState({todoList:["Stop hating my life"]});
            }
        });
    }

    onAdd()
    {
        if(this.state.text.length === 0 )
            return;
        this.state.todoList.push(this.state.text);
        this.setState({todoList:this.state.todoList,text:""}, () => {
            this.saveState(() => {
                console.log("State saved.");
            });
        });

    }

    onRemove(index)
    {
        this.state.todoList.splice(index,1);
        this.setState({todoList:this.state.todoList}, () => {
            this.saveState(() => {
                console.log("State saved.");
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
                        {this.state.todoList?this.state.todoList.map((item,i) => {
                            return <tr key={i}>
                                <td>{i+1}</td>
                                <td>{item}</td>
                                <td style={{textAlign:"center"}}><a href="#" style={{color:"red"}} onClick={() => this.onRemove(i)}><i className="fa fa-trash"></i></a></td>
                            </tr>
                        }):<></>}
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