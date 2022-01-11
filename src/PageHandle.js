import React, { Component } from 'react'
import {Route, HashRouter, Redirect} from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'

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
        console.log(output)
        this.setState({currentUser: output[0]})
        this.setState({currentName: output[1]})
        this.setState({redirect: "/home"})
    }

    render() {
        return ( 
            <HashRouter>
                <Redirect to={this.state.redirect}/>
                <Route path="/login" component={(props) => <LoginScreen newUser={this.state.currentUser} onChange={this.handleUserChange}/>} />
                <Route path="/home" component={(props) => <HomePage user={this.state.currentUser} name={this.state.currentName}/>}/>
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} user={this.state.currentUser}/>}/>
            </HashRouter>
        )
    }
}

export default PageHandle