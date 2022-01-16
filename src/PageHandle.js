import React, { Component } from 'react'
import {Route, HashRouter, Redirect} from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'
import SettingsPage from './SettingsPage'

class PageHandle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: "/login",
            currentUser: null,
            currentName: null
        }
    }

    handleUserChange = (output) => {
        this.setState({currentUser: output[0], currentName: output[1], redirect: "/home"})
    }

    handleLogout = () => {
        this.setState({currentUser: null, currentName: null, redirect: "/login"})
    }

    handleRefresh = (album) => {
        this.setState({redirect: "/album/" + album})
    }

    render() {
        return ( 
            <HashRouter>
                <Redirect to={this.state.redirect}/>
                <Route path="/login" component={(props) => <LoginScreen newUser={this.state.currentUser} onChange={this.handleUserChange}/>} />
                <Route path="/home" component={(props) => <HomePage user={this.state.currentUser} name={this.state.currentName} onChange={this.handleLogout}/>}/>
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} user={this.state.currentUser} onChange={this.handleRefresh}/>}/>
                <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={this.handleLogout} name={this.state.currentName} user={this.state.currentUser}/>}/>
            </HashRouter>
        )
    }
}

export default PageHandle