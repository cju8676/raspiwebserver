import React, { Component } from 'react'
import { Header, Button, Divider, Confirm, Segment } from 'semantic-ui-react'
import Notification from '../Notification'
import { UserContext } from '../UserContext'
import EditForm from "./EditForm"
import EditLabels from "./EditLabels"
//import { withRouter } from 'react-router-dom'

class SettingsPage extends Component {
    static contextType = UserContext
    constructor(props) {
        super(props);
        this.state = {
            open: false,
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
        this.close();
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/delAcc/' + this.context.user, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? this.state.logout() : this.context.showErrorNotification('Unable to Delete account. Please try again.'))
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
            <div className='segment-pad'>
                <Notification />
                <Segment>
                    <Header>
                        <Button color='orange' size='large' href='#home'>Back</Button>
                        Settings
                    </Header>
                </Segment>
                <Divider />
                <Segment className="settings">
                    <h2>Name</h2>
                    {this.context.name} <Button basic compact icon='edit' color='black' onClick={this.toggleName} />
                    {this.state.nameModal && (
                        <EditForm
                            name="Name"
                            visible={this.state.nameModal}
                            toggle={this.toggleName}
                            update={this.update}
                        />
                    )}
                    <h2>Username</h2>
                    {this.context.user} <Button basic compact icon='edit' color='black' onClick={this.toggleuserName} />
                    {this.state.usernameModal && (
                        <EditForm
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
                            name="Password"
                            visible={this.state.passModal}
                            toggle={this.togglePass}
                            update={this.update}
                            errorMsg={"This is your current password"}
                        />
                    )}
                    <Divider />
                    <h2>Edit Tag Labels</h2>
                    <EditLabels isTags={true} />
                    <Divider />
                    <h2>Edit People Labels</h2>
                    <EditLabels isTags={false} />
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
                </Segment>
            </div>
        )
    }
}

export default SettingsPage