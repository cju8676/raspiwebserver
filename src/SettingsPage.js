import React, { Component } from 'react'
import { Header, Button, Divider, Confirm, Container, Segment, Input } from 'semantic-ui-react'
//import { withRouter } from 'react-router-dom'

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name : props.name,
            user : props.user,
            logout: props.onChange,
            nameModal: false,
            usernameModal : false,
            passModal: false,
            nameBlank: false,
            userBlank : false,
            passBlank: false
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
        if (e ==='Name') {
            this.setState({name : this.updateInfo});
            this.updateInfo= "";
            this.toggleName();
            this.componentDidMount();
        }
        else if (e === 'Username') {
            this.setState({user : this.updateInfo});
            this.updateInfo= "";
            this.toggleuserName();
            this.componentDidMount();
        }
        else if (e === 'Pass') {
            //this.setState({})
            this.updateInfo = "";
            this.togglePass();
            this.componentDidMount();
        }
    }

    /* Update name or username in DB */
    updateNameInfo = () => {
        if (this.state.nameModal && this.updateInfo === "") {
            this.setState({nameBlank: true})
            return;
        }
        else if (this.state.usernameModal && this.updateInfo === "") {
            this.setState({userBlank : true})
            return;
        }
        else if (this.state.passModal && this.updateInfo === "") {
            this.setState({passBlank : true})
            return;
        }
        const data = {
            username: this.props.user,
            new_name: this.updateInfo
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        var nameOrUser = "";
        if (this.state.nameModal) nameOrUser = 'Name'
        else if (this.state.usernameModal) nameOrUser = 'Username';
        else nameOrUser = 'Pass'
        console.log(nameOrUser)
        fetch('/update' + nameOrUser + '/', reqOptions).then(response => response.json)
            .then(
                // todo handle success pop up
                this.handleUpdate(nameOrUser)
            )
    }

    toggleName = () => {
        // if off
        if (!this.state.nameModal) {
            // toggle name visibility, toggle everything else off
            this.setState({
                nameModal : true,
                usernameModal : false,
                passModal : false
            })
        }
        else this.setState({nameModal : false})
    }

    toggleuserName = () => {
        // if off
        if (!this.state.usernameModal) {
            // toggle user visibility, toggle everything else off
            this.setState({
                usernameModal : true,
                nameModal : false,
                passModal : false
            })
        }
        else this.setState({usernameModal : false})
    }

    togglePass = () => {
        // if off
        if (!this.state.passModal) {
            // toggle pass visibility, toggle everything else off
            this.setState({
                passModal : true,
                nameModal : false,
                usernameModal : false
            })
        }
        else this.setState({passModal : false})
    }

    update = (event) => {
        if (event.target.id === 'enteredName') {
            this.updateInfo = event.target.value;
            this.setState({
                nameBlank: false,
                userBlank : false
            })
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
                        <Input type='text' id='enteredName' placeholder='Name' onChange={this.update} error={this.state.nameBlank}/>
                        <Button color='black' onClick={this.toggleName}>Cancel</Button>
                        <Button positive onClick={this.updateNameInfo}>Confirm</Button>
                    </Segment>)}
                    <h2>Username</h2>
                    {this.state.user} <Button basic compact icon='edit' color='black' onClick={this.toggleuserName}/>
                    {this.state.usernameModal && (
                    <Segment>
                        <h4>Edit Username</h4>
                        <Input type='text' id='enteredName' placeholder='Name' onChange={this.update} error={this.state.userBlank}/>
                        <Button color='black' onClick={this.toggleuserName}>Cancel</Button>
                        <Button positive onClick={this.updateNameInfo}>Confirm</Button>
                    </Segment>)}
                    <h2>Password</h2>
                    <Button basic compact icon='edit' color='black' onClick={this.togglePass}/>
                    {this.state.passModal && (
                    <Segment>
                        <h4>Edit Password</h4>
                        <Input type='text' id='enteredName' placeholder='Password' onChange={this.update} error={this.state.passBlank}/>
                        <Button color='black' onClick={this.togglePass}>Cancel</Button>
                        <Button positive onClick={this.updateNameInfo}>Confirm</Button>
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