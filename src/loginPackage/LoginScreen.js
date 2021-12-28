import React, { Component } from 'react'
import CreateNewAccount from './CreateNewAccount'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'



class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            newUserChange: props.onChange
        }
    }

    handleOutput = (output) => {
        console.log(output)
        if(output !== false) {
            this.state.newUserChange(output)
        }
    }

    tryLogin = () => {
        const getURL = '/login/' + this.state.username + '/' + this.state.password
        fetch(getURL).then(
            response => response.json()
        ).then(jsonOutput => {
            console.log(jsonOutput)
            this.handleOutput(jsonOutput)
        })
    }

    updateUsername = (event) => {
        this.setState({username: event.target.value})
    }

    updatePassword = (event) => {
        this.setState({password: event.target.value})
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '50vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header >

                    </Header>
                    <Header as='h2' color='orange' textAlign='center'>
                        Login
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={this.updateUsername} />
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={this.updatePassword} />
                            <Button color='orange' fluid size='large' onClick={this.tryLogin}>Login</Button>
                        </Segment>
                    </Form>
                    <Message>New user? <CreateNewAccount /></Message>
                </Grid.Column>
            </Grid>
        )
    }

}

export default LoginScreen