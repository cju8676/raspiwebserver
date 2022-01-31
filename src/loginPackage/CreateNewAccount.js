import React, { Component } from 'react'
import { Button, Modal, Form, Message } from 'semantic-ui-react'

class CreateNewAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            firstName: "",
            modal: false,
            created: false,
            takenUser: false,
            nameBlank: false,
            userBlank: false,
            passBlank: false
        }
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
        if (this.state.modal === false) {
            this.setState({
                 username: "",
                 password: "",
                 firstName: "",
                 userBlank: false,
                 passBlank: false,
                 nameBlank: false
         })
        }
    }

    handleResponse = (jsonOutput) => {
        console.log(jsonOutput)
        if (jsonOutput === false) {
            this.setState({takenUser : true});
        }
        else {
            this.setState({created : true});
            this.toggle();
        } 
    }

    createUser = () => {
        if (this.state.firstName === "" || this.state.username === "" || this.state.password === "") {
            if (this.state.firstName === "") this.setState({nameBlank : true})
            if (this.state.username === "") this.setState({userBlank : true})
            if (this.state.password === "") this.setState({passBlank : true})
            return;
        }
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
            .then(jsonOutput => {
                this.handleResponse(jsonOutput)
            })
    }

    submitForm = () => {
        this.createUser()
    }

    updateProp = (event) => {
        if (event.target.id === "enteredName") {
            this.setState({
                firstName : event.target.value,
                nameBlank : false
            })
        }    
        else if (event.target.id === "enteredUsername") {
            this.setState({
                username : event.target.value,
                userBlank : false
            })
        }
        else if (event.target.id === "enteredPassword") {
            this.setState({
                password : event.target.value,
                passBlank : false
            })
        }
    }

    render() {
        return (
            <div>
                <Message success
                    hidden={!this.state.created}
                    header='Successfully created your account!'
                    content='You may now log in with your new credentials.'
                 />
                <Modal
                    open={this.state.modal}
                    trigger={<Button onClick={this.toggle}>Create New Account</Button>}>
                    <Modal.Header>Create New Account</Modal.Header>
                    <Modal.Content>
                        <Message error
                            hidden={!this.state.takenUser}
                            header='Sorry!'
                            content='The username input is taken. Try another.'
                        />
                        <Form>
                            <Form.Input
                                error={this.state.nameBlank}
                                //error={{content: 'Please enter your name', pointing: 'below'}}
                                /// if 20 error - name too long!! todo
                                fluid
                                id='enteredName'
                                label='Name'
                                placeholder='Name'
                                onChange={this.updateProp}
                            />
                            <Form.Input
                                error={this.state.userBlank}
                                //error={{content: 'Please enter a username', pointing: 'below'}}
                                fluid
                                id='enteredUsername'
                                label='Username'
                                placeholder='Username'
                                onChange={this.updateProp}
                            />
                            <Form.Input
                                error={this.state.passBlank}
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