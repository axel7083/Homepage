import React, {Component} from "react";
import { Card , Row, Container ,Col ,Image, Modal, Button} from 'react-bootstrap';



export default class Home extends Component {


    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            shortcut: [{name:"Facebook",src:""},{name:"Messenger",src:""}],
        };

    }

    handleShow() {
        this.setState({show:true})
    }

    handleClose() {
        this.setState({show:false})
    }


    render() {
        return (
            <Container>
                <Button variant="primary" onClick={this.handleShow}>
                    Launch static backdrop modal
                </Button>

                <h3 style={{color:"white"}}>Shortcuts</h3>
                <Row>
                    {this.state.shortcut.map((item,i) => {
                        return  <Col md="auto" key={i} >
                                    <Card className="shortcut">
                                        <a href="#">
                                            <Card.Body>
                                                <Image style={{width: "3rem",height: "3rem"}} src="./images/plus.png" fluid />
                                            </Card.Body>
                                        </a>
                                    </Card>
                                </Col>
                    })}

                </Row>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        I will not close if you click outside me. Don't even try to press
                        escape key.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary">Understood</Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        );
    }
}