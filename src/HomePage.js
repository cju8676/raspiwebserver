import React, { Component } from 'react'
import { Header, Tab, Icon, Button } from 'semantic-ui-react'

import Gallery from './galleryPackage/Gallery'
import FavoritesGallery from './FavoritesGallery'
import Albums from './Albums'
import ImagePane from './imagePackage/ImagePane'



class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserName: props.user,
            currentName: props.name,
            logout: props.onChange,
            refresh: props.onRefresh,



            //lets see
            files: [],
            link_name_id_info: [],
            id_path: {},

            imgPanes: [],

            fav_ids: []
        }  
    }

    fetchPictures = () => {
        fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                this.setState({ files: JSON.parse(JSONresponse) })
                console.log(this.state.files)
                for (let i = 0; i < this.state.files.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.files[i].path).replace('/', '%2F');
                    //fixme could change this to just the id to simplify
                    this.setState(prevState => ({
                        ...prevState,
                        id_path: {
                            ...prevState.id_path,
                            [this.state.files[i].id]: [path]
                        }
                    }))

                    fetch('/files/' + encodeURIComponent(path) + '/' + encodeURIComponent(this.state.files[i].name))
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            this.setState(prevState => ({
                                ...prevState,
                                link_name_id_info:
                                    [...prevState.link_name_id_info,
                                    {
                                        link: imageURL,
                                        name: this.state.files[i].name,
                                        id: this.state.files[i].id,
                                        info: this.state.id_path[this.state.files[i].id],
                                        // info: path
                                    }]
                            }));
                        })
                }
            })


    }

    fetchAlbums = () => {
        fetch('/getAlbums/' + this.props.user).then(response => response.json())
            .then(JSONresponse => {
                this.setState({ albums: JSONresponse })
            })
    }

    getFavs = () => {
        fetch('/getFavIDs/' + this.props.user).then(res => res.json())
            .then(JSONresponse => {
                console.log(JSONresponse)
                this.setState({fav_ids : JSONresponse})
            })
    }

    favs(img) {
        let ret;
            for (let pane in img) {
                if (this.state.fav_ids.includes(pane.props.id)) {
                    console.log(pane.props.id)
                    ret.push(pane)
                }
            }
        return ret
    }

    componentDidMount() {
        this.fetchAlbums();
        this.fetchPictures();
        this.getFavs();
    }

    render() {
        const img = this.state.link_name_id_info.map(picture => {
            return <ImagePane
                picture={picture.link}
                filename={picture.name}
                id={picture.id}
                user={this.props.user}
                albums={this.state.albums}
                path={picture.info}
                inAlbum={false}
                refresh={this.state.refresh}
            />
        })

        // for(var i = 0; i < img.length ; i++) {
        //     console.log(img[i].props.id)
        // }

        //const favs = this.favs(img);

        const panes = [
            {
                menuItem: 'Gallery',
                /*pane:*/render: () => <Tab.Pane attached={false}><Gallery user={this.state.currentUserName} onRefresh={this.state.refresh} img={img} /></Tab.Pane>
            },
            {
                menuItem: 'Favorites',
                /*pane:*/render: () => <Tab.Pane attached={false}><FavoritesGallery user={this.state.currentUserName} /*img={favs}*/ /></Tab.Pane>
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