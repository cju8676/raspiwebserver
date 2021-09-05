import React, { Component } from 'react'
import { Image } from 'semantic-ui-react'



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
                <Image src="/getImage/juicewrld.jpg" bordered />
            </div>
        )
    }
}

export default Dashboard;