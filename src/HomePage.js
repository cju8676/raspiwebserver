import React, { Component } from 'react'
import { Header, Tab, Icon, Button, Segment } from 'semantic-ui-react'
import Gallery from './galleryPackage/Gallery'
import Favorited from './Favorited'
import AlbumsList from './AlbumsList'
import { UserContext } from './UserContext'

class HomePage extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props)
        this.state = {
            currentUserName: JSON.parse(localStorage.getItem('user')) || null,
            currentName: JSON.parse(localStorage.getItem('name')) || null,
            logout: props.onChange,
            refresh: props.onRefresh,
            windowWidth: window.innerWidth
        }
    }

    //todo use for loading
    // status = (response) => {
    //     if (response.status >= 200 && response.status < 300) {
    //         return Promise.resolve(response)
    //     } else {
    //         return Promise.reject(new Error(response.statusText))
    //     }
    // }

    handleTabChange = (e, { activeIndex }) => this.context.setActiveIndex(activeIndex)

    handleWindowChange = () => {
        this.setState({ windowWidth: window.innerWidth })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowChange)
    }

    render() {
        const panes = [
            {
                menuItem: 'Gallery',
                /*pane:*/render: () => {
                    return <Tab.Pane attached={false}>
                        <Gallery
                            onRefresh={this.state.refresh}
                            albums={this.state.albums}
                        />
                    </Tab.Pane>
                }
            },
            {
                menuItem: 'Favorites',
                render: () => {
                    return <Tab.Pane attached={false}>
                        <Favorited
                            albums={this.state.albums}
                            onRefresh={this.state.refresh}
                        />
                    </Tab.Pane>
                }
            },
            {
                menuItem: 'Albums',
                /*pane:*/render: () => {
                    return <Tab.Pane attached={false}>
                        <AlbumsList />
                    </Tab.Pane>
                }
            },
        ]
        return (
            <div className='segment-pad'>
                <Segment clearing>
                    <Header as='h2'>
                        {/* <div> */}
                            Welcome, {this.context.name}.

                            <Button href='#settings' floated='right' size='large'>
                                <Icon name='setting' />
                                {this.state.windowWidth > 530 && "Settings"}
                            </Button>
                            <Button onClick={this.state.logout} floated='right' size='large'>
                                <Icon name='sign out' />
                                {this.state.windowWidth > 530 && "Logout"}
                            </Button>
                        {/* </div> */}
                    </Header>
                </Segment>
                <Tab 
                    menu={{ color: 'orange', tabular: false, attached: false, inverted: true }} 
                    panes={panes} 
                    activeIndex={this.context.activeIndex} 
                    onTabChange={this.handleTabChange}/*renderActiveOnly={false}*/ 
                />
            </div>
        )
    }
}

export default HomePage;