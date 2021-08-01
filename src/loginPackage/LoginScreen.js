import React, { Component } from 'react'
import CreateNewAccount from './CreateNewAccount'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'



class LoginScreen extends Component {


    render() {
        return (
            <Grid textAlign='center' style={{ height: '50vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='orange' textAlign='center'>
                        Login to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' />
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' />
                            <Button color='orange' fluid size='large'>Login</Button>
                        </Segment>
                    </Form>
                    <Message>New user? <CreateNewAccount /></Message>
                </Grid.Column>
            </Grid>
        )
    }

}

export default LoginScreen