import React, { Component } from 'react'
import {Route, HashRouter, Redirect} from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'

class PageHandle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: "/login",
            currentUser: null
        }
    }

    handleUserChange = (output) => {
        this.setState({currentUser: output})
        this.setState({redirect: "/home"})
    }

    render() {
        return ( 
            <HashRouter>
                <Redirect to={this.state.redirect}/>
                <Route path="/login" component={(props) => <LoginScreen newUser={this.state.currentUser} onChange={this.handleUserChange}/>} />
                <Route path="/home" component={(props) => <HomePage user={this.state.currentUser} />} />
            </HashRouter>
        )
    }
}

export default PageHandle