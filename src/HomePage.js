import React, { Component } from 'react'
import { Header, Tab, Icon, Button, Card } from 'semantic-ui-react'
import Gallery from './galleryPackage/Gallery'
import FavoritesGallery from './FavoritesGallery'
import Albums from './Albums'
import ImagePane from './imagePackage/ImagePane'
import { sortByYear, mapByYear } from './imageUtils'

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserName: JSON.parse(localStorage.getItem('user')) || null,
            currentName: JSON.parse(localStorage.getItem('name')) || null,
            logout: props.onChange,
            refresh: props.onRefresh,
            link_name_id_info: [],
            filesLen: -1,
        }
    }

    fetchPictures = async () => {
        var files = [];
        var id_path = {};
        let data = await fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                files = JSON.parse(JSONresponse)
                this.setState({filesLen: files.length})
                for (let i = 0; i < files.length; i++) {
                    var path = (files[i].path).replace('/', '%2F');
                    id_path[files[i].id] = path

                    fetch('/files/' + files[i].id)
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            this.setState(prevState => ({
                                ...prevState,
                                link_name_id_info:
                                    [...prevState.link_name_id_info,
                                    {
                                        link: imageURL,
                                        name: files[i].name,
                                        id: files[i].id,
                                        info: id_path[files[i].id],
                                        date: files[i].date
                                    }]
                            }));
                        })
                }
            })
    }
    // status = (response) => {
    //     if (response.status >= 200 && response.status < 300) {
    //         return Promise.resolve(response)
    //     } else {
    //         return Promise.reject(new Error(response.statusText))
    //     }
    // }

    fetchAlbums = () => {
        fetch('/getAlbums/' + this.props.user).then(response => response.json())
            .then(JSONresponse => {
                this.setState({ albums: JSONresponse })
            })
    }

    componentDidMount() {
        this.fetchAlbums();
        this.fetchPictures();
        // let sort = sortByYear();
        // console.log(sort)
    }

    render() {
        if (this.state.filesLen === -1) return <></>
        
        const img = this.state.link_name_id_info.map(picture => {
            return <ImagePane
                picture={picture.link}
                filename={picture.name}
                id={picture.id}
                key={picture.id}
                user={this.props.user}
                albums={this.state.albums}
                path={picture.info}
                inAlbum={false}
                refresh={this.state.refresh}
                date={picture.date}
            />
        })

        var cardGroups = []
        if (img.length === this.state.filesLen) {
            const sortedPanes = sortByYear(img);
            cardGroups = mapByYear(sortedPanes);
        }
        
        const panes = [
            {
                menuItem: 'Gallery',
                /*pane:*/render: () => <Tab.Pane attached={false}><Gallery user={this.state.currentUserName} onRefresh={this.state.refresh} img={img} cardGroups={cardGroups}/></Tab.Pane>
            },
            {
                menuItem: 'Favorites',
                /*pane:*/render: () => <Tab.Pane attached={false}><FavoritesGallery user={this.state.currentUserName} onRefresh={this.state.refresh} /></Tab.Pane>
            },
            {
                menuItem: 'Albums',
                /*pane:*/render: () => <Tab.Pane attached={false}><Albums user={this.state.currentUserName} /></Tab.Pane>
            },
        ]
        return (
            <div>
                <Header as='h2'>
                    <div>
                        Welcome, {this.state.currentName}.

                        <Button href='#settings' floated='right' size='large'>
                            <Icon name='setting' />
                            Settings
                        </Button>
                        <Button onClick={this.state.logout} floated='right' size='large'>
                            <Icon name='sign out' />
                            Logout
                        </Button>
                    </div>
                </Header>
                <Tab menu={{ color: 'orange', tabular: false, attached: false, inverted: true }} panes={panes} /*renderActiveOnly={false}*/ />
            </div>
        )
    }
}

export default HomePage;