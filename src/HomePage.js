import React, { Component } from 'react'



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
            </div>
        )
    }
}

export default HomePage;