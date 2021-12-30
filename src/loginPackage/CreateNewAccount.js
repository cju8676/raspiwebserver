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

    createUser = () => {
        const data = {
            name: this.state.firstName,
            username: this.state.username,
            password: this.state.password
        }
        const reqOptions = {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }
        fetch('/createUser/', reqOptions)
            .then(response => response.json())
            .then(this.fetchData)
    }

    submitForm = () => {
        this.createUser()
        this.toggle()
        //fixme - add popup saying account was successfully created
    }

    updateProp = (event) => {
        if (event.target.id === "enteredName") this.setState({firstName : event.target.value})
        else if (event.target.id === "enteredUsername") this.setState({username : event.target.value})
        else if (event.target.id === "enteredPassword") this.setState({password : event.target.value})
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
                                id='enteredName'
                                label='Name'
                                placeholder='Name'
                                onChange={this.updateProp}
                            />
                            <Form.Input
                                //error={{content: 'Please enter a username', pointing: 'below'}}
                                fluid
                                id='enteredUsername'
                                label='Username'
                                placeholder='Username'
                                onChange={this.updateProp}
                            />
                            <Form.Input
                                //error={{content: 'Please enter a valid password', pointing: 'below'}}
                                fluid
                                id='enteredPassword'
                                label='Password'
                                placeholder='Password'
                                onChange={this.updateProp}
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