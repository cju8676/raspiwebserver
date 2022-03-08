import React, { Component } from 'react'
import { Header, Button, Divider, Confirm, Container } from 'semantic-ui-react'
import EditForm from "./EditForm"
//import { withRouter } from 'react-router-dom'

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name: props.name,
            user: props.user,
            logout: props.onChange,
            nameModal: false,
            usernameModal: false,
            passModal: false
        }

        this.updateInfo = "";
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


    toggleName = () => {
        // if off
        if (!this.state.nameModal) {
            // toggle name visibility, toggle everything else off
            this.setState({
                nameModal: true,
                usernameModal: false,
                passModal: false
            })
        }
        else this.setState({ nameModal: false })
    }

    toggleuserName = () => {
        // if off
        if (!this.state.usernameModal) {
            // toggle user visibility, toggle everything else off
            this.setState({
                usernameModal: true,
                nameModal: false,
                passModal: false
            })
        }
        else this.setState({ usernameModal: false })
    }

    togglePass = () => {
        // if off
        if (!this.state.passModal) {
            // toggle pass visibility, toggle everything else off
            this.setState({
                passModal: true,
                nameModal: false,
                usernameModal: false
            })
        }
        else this.setState({ passModal: false })
    }

    update = (e, val) => {
        if (e === 'Name') {
            this.setState({ name: val })
            localStorage.setItem('name', JSON.stringify(val));
            this.props.setPage('name', val)
        }
        else if (e === 'Username') {
            this.setState({ user: val })
            localStorage.setItem('user', JSON.stringify(val));
            this.props.setPage('user', val)
        }
        //else todo password
        this.componentDidMount();
    }

    componentDidMount() { }

    render() {
        return (
            <div>
                <Header>
                    <Button color='orange' size='large' href='#home'>Back</Button>
                    Settings
                </Header>
                <Container>
                    <h2>Name</h2>
                    {this.state.name} <Button basic compact icon='edit' color='black' onClick={this.toggleName} />
                    {this.state.nameModal && (
                        <EditForm
                            user={this.state.user}
                            name="Name"
                            visible={this.state.nameModal}
                            toggle={this.toggleName}
                            update={this.update}
                        />
                    )}
                    <h2>Username</h2>
                    {this.state.user} <Button basic compact icon='edit' color='black' onClick={this.toggleuserName} />
                    {this.state.usernameModal && (
                        <EditForm
                            user={this.state.user}
                            name="Username"
                            visible={this.state.usernameModal}
                            toggle={this.toggleuserName}
                            update={this.update}
                            errorMsg={"Name already taken!"}
                        />
                    )}
                    <h2>Password</h2>
                    <Button basic compact icon='edit' color='black' onClick={this.togglePass} />
                    {this.state.passModal && (
                        <EditForm
                            user={this.state.user}
                            name="Password"
                            visible={this.state.passModal}
                            toggle={this.togglePass}
                            update={this.update}
                            errorMsg={"This is your current password"}
                        />
                    )}
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