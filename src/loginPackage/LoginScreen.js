import React, { Component } from 'react'
import CreateNewAccount from './CreateNewAccount'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'


class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            newUserChange: props.onChange,
            error: false,
            userBlank: false,
            passBlank: false
        }
    }

    handleOutput = (output) => {
        if (output === null) {
            this.setState({error : true})
        }
        else if (output !== false) {
            this.state.newUserChange(output)
        }
    }

    tryLogin = () => {
        if (this.state.username === "") {
            this.setState({userBlank: true})
            return;
        }
        if (this.state.password === "") {
            this.setState({passBlank : true})
            return;
        }
        const getURL = '/login/' + this.state.username + '/' + this.state.password
        fetch(getURL).then(
            response => response.json()
        ).then(jsonOutput => {
            this.handleOutput(jsonOutput)
        })
    }

    updateUsername = (event) => {
        this.setState({
             username: event.target.value,
             userBlank: false
             })
    }

    updatePassword = (event) => {
        this.setState({ 
            password: event.target.value,
            passBlank : false
        })
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
                    <Message error
                            hidden={!this.state.error}
                            header='Invalid Username or Password'
                            content='Please try again.'
                        />
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={this.updateUsername} error={this.state.userBlank}/>
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={this.updatePassword} error={this.state.passBlank}/>
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