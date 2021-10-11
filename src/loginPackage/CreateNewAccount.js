import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'

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
                <Button>Create New Account</Button>
            </div>
        )
    }
}

export default CreateNewAccount