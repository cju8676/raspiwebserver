import React, { Component } from 'react'
import { Header, Tab } from 'semantic-ui-react'

import Gallery from './Gallery'



class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserName: props.user,
            currentName: props.name
        }
    }

    render() {

        const panes = [
            { menuItem: 'Gallery', render: () => <Tab.Pane attached ={false}><Gallery user={this.state.currentUserName}/></Tab.Pane> },
            { menuItem: 'Favorites', render: () => <Tab.Pane attached ={false}>Favorites coming soon..</Tab.Pane> },
            { menuItem: 'Albums', render: () => <Tab.Pane attached ={false}>albums coming soon..</Tab.Pane> },
        ]

        return (
            <div>
                <Header as='h2'>
                    Welcome, {this.state.currentName}.
                    <Tab menu={{color:'orange',tabular:false, attached:false, inverted:true}} panes={panes} />
                </Header>
            </div>
        )
    }
}

export default HomePage;