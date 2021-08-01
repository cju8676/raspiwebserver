import React, { Component } from 'react'

class CreateNewAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            first: "",
            last: ""
        }
    }

    render () {
        return (
            <div>
                Create New Account!
            </div>
        )
    }
}

export default CreateNewAccount