import React, { Component } from 'react'

import Dashboard from './Dashboard'



class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user
        }
    }

    render() {
        return (
            <div>
                <p>WELCOME {this.state.currentUser}!!!! </p>
                <Dashboard user={this.state.currentUser}/>
            </div>
        )
    }
}

export default HomePage;