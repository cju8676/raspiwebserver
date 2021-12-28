import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'

class CreateNewAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            firstName: "",
            modal: false
        }
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        if (this.state.modal === false) {
            this.setState({ username: "" })
            this.setState({ password: "" })
            this.setState({ firstName: "" })
        }
    }

    submitForm = () => {
        this.toggle()
        //fixme - connect POST request
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.state.modal}
                    trigger={<Button onClick={this.toggle}>Create New Account</Button>}>
                    <Modal.Header>Create New Account</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Input
                                //error={{content: 'Please enter your name', pointing: 'below'}}
                                /// if 20 error - name too long!! todo
                                fluid
                                label='Name'
                                placeholder='Name'
                            />
                            <Form.Input
                                //error={{content: 'Please enter a username', pointing: 'below'}}
                                fluid
                                label='Username'
                                placeholder='Username'
                            />
                            <Form.Input
                                //error={{content: 'Please enter a valid password', pointing: 'below'}}
                                fluid
                                label='Password'
                                placeholder='Password'
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.toggle}>Cancel</Button>
                        <Button
                            content='Create'
                            labelPosition='right'
                            icon='checkmark'
                            onClick={this.submitForm}
                            positive
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default CreateNewAccount