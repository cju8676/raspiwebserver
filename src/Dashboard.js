import React, { Component } from 'react'



class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user
        }
    }

    render() {
        return (
            <div>
                <p>Hello, {this.state.currentUser}!!!! </p>
            </div>
        )
    }
}

export default Dashboard;