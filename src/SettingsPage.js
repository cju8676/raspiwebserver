import React, {Component} from 'react'
import {Header, Button, Card, Divider, Confirm, Container } from 'semantic-ui-react'
import ImagePane from './ImagePane';
import {withRouter} from 'react-router-dom'

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false
        }
    }

    open = () => this.setState({open : true})

    close = () => this.setState({open : false})

    deleteAcc = () => {
        console.log("deleted everything");
        this.close();
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
        }
        fetch('/delAcc/' + this.props.match.params.user, reqOptions)
            .then(response => response.json())
            .then(JSONresponse => 
                JSONresponse ? this.props.history.push('/login') : console.log("not del"))
    }

    render() {
        return (
            <div>
                <Header>
                    <Button color='orange' size='large' href='#home'>Back</Button>
                    Settings for {this.props.match.params.user}
                </Header>
                <Container>
                <Button color='red' size='large' onClick={this.open}>Delete Account</Button>
                    <Confirm
                        header='Delete My Account'
                        content='Are you sure? This will delete everything associated with your account
                            , including favorites, created albums, and any saved info.'
                        open={this.state.open}
                        onCancel={this.close}
                        confirmButton='DELETE ACCOUNT'
                        onConfirm={this.deleteAcc}
                        />
                </Container>

            </div>
        )
    }
}

export default SettingsPage