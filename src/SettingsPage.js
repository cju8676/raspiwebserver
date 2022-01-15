import React, { Component } from 'react'
import { Header, Button, Icon, Divider, Confirm, Container, Segment, Input } from 'semantic-ui-react'
import ImagePane from './ImagePane';
import { withRouter } from 'react-router-dom'

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name : props.name,
            user : props.user,
            logout: props.onChange,
            nameModal: false,
            usernameModal : false
        }

        this.updateInfo= "";
    }

    open = () => this.setState({ open: true })

    close = () => this.setState({ open: false })

    deleteAcc = () => {
        console.log("deleted everything");
        this.close();
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/delAcc/' + this.props.user, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? this.state.logout() : console.log("not del"))
    }

    handleUpdate = (e) => {
        if (e ==='name') {
            console.log('NAME')
            this.state.name = this.updateInfo;
            this.updateInfo= "";
            this.toggleName();
            this.componentDidMount();
        }
        else if (e === 'user') {
            console.log('USER')
            this.state.user = this.updateInfo;
            this.updateInfo= "";
            this.toggleuserName();
            this.componentDidMount();
        }
    }

    updateName = () => {
        const data = {
            username: this.props.user,
            new_name: this.updateInfo
        }
        console.log(data)
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/updateName/', reqOptions).then(response => response.json)
            .then(
                // todo handle success pop up
                this.handleUpdate('name')
            )
    }

    updateUsername = () => {
        //FIXME COMBINE WITH OTHER UPDATE
        const data = {
            username: this.props.user,
            new_username: this.updateInfo
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/updateUsername/', reqOptions).then(response => response.json)
            .then(
                // todo handle success pop up
                this.handleUpdate('user')
            )
    }

    toggleName = () => {
        this.setState({nameModal : !this.state.nameModal})
    }

    toggleuserName = () => {
        this.setState({usernameModal : !this.state.usernameModal})
    }

    update = (event) => {
        //fixme if i do it this way i cant edit 2 at the same time
        console.log(event)
        if (event.target.id === 'enteredName') {
            this.updateInfo= event.target.value;
        }
    }

    componentDidMount () {

    }

    render() {
        return (
            <div>
                <Header>
                    <Button color='orange' size='large' href='#home'>Back</Button>
                    Settings
                </Header>
                <Container>
                    <h2>Name</h2>
                    {this.state.name} <Button basic compact icon='edit' color='black' onClick={this.toggleName}/>
                    {this.state.nameModal && (
                    <Segment>
                        <h4>Edit Name</h4>
                        <Input type='text' id='enteredName' placeholder='Name' onChange={this.update}/>
                        <Button color='black' onClick={this.toggleName}>Cancel</Button>
                        <Button positive onClick={this.updateName}>Confirm</Button>
                    </Segment>)}
                    <h2>Username</h2>
                    {this.state.user} <Button basic compact icon='edit' color='black' onClick={this.toggleuserName}/>
                    {this.state.usernameModal && (
                    <Segment>
                        <h4>Edit Username</h4>
                        <Input type='text' id='enteredName' placeholder='Name' onChange={this.update}/>
                        <Button color='black' onClick={this.toggleuserName}>Cancel</Button>
                        <Button positive onClick={this.updateUsername}>Confirm</Button>
                    </Segment>)}
                    <Divider />
                    <Button onClick={this.state.logout}>Logout</Button>
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