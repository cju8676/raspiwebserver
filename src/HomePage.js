import React, { Component } from 'react'
import { Header, Image } from 'semantic-ui-react'

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
                <Header as='h2'>
                    <Image circular src='/getImage/juicewrld.jpg' /> {this.state.currentUser}
                </Header>
                <Dashboard user={this.state.currentUser}/>
            </div>
        )
    }
}

export default HomePage;