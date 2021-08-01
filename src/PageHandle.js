import React, { Component } from 'react'
import {Route, HashRouter, Redirect} from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'

class PageHandle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: "/login",
            currentUser: null
        }
    }

    // Put handle User change here

    render() {
        return ( 
            <HashRouter>
                <Redirect to={this.state.redirect}/>
                <Route path="/login" component={(props) => <LoginScreen/>} />
            </HashRouter>
        )
    }
}

export default PageHandle