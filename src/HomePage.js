import React, { Component } from 'react'
import { Header, Tab, Icon, Button } from 'semantic-ui-react'
import Gallery from './galleryPackage/Gallery'
import Favorited from './Favorited'
import AlbumsList from './AlbumsList'
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
            favs: []
        }
    }

    fetchPictures = async () => {
        var id_path = {};
        await fetch('/getAllImages/').then(response => response.json())
        .then(JSONresponse => {
                var files = JSON.parse(JSONresponse)
                this.setState({filesLen: files.length})
                for (let i = 0; i < files.length; i++) {
                    var path = (files[i].path).replace('/', '%2F');
                    id_path[files[i].id] = path

                    fetch('/files/' + files[i].id)
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            const isVideo = imageBlob.type === 'video/mp4' ? true : false
                            if (isVideo) console.log(imageURL)
                            this.setState(prevState => ({
                                ...prevState,
                                link_name_id_info:
                                    [...prevState.link_name_id_info,
                                    {
                                        link: imageURL,
                                        name: files[i].name,
                                        id: files[i].id,
                                        info: id_path[files[i].id],
                                        date: files[i].date,
                                        video: isVideo
                                    }]
                            }));
                        })
                }
            })
    }

    //todo use for loading
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

    // returns the IDs of the image panes we need to extract
    fetchFavorites = () => {
        fetch('/getFavoriteIDs/' + this.props.user).then(res => res.json())
            .then(JSONresponse => this.setState({favs : JSONresponse.flat()}))
    }

    componentDidMount() {
        this.fetchAlbums();
        this.fetchFavorites();
        this.fetchPictures();
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
                isVideo={picture.video}
            />
        })

        const favs = this.state.link_name_id_info
            .filter(item => this.state.favs.includes(item.id))
            .map(picture => {
                return <ImagePane
                    picture={picture.link}
                    filename={picture.name}
                    id={picture.id}
                    key={picture.id}
                    user={this.props.user}
                    favorited='true'
                    albums={this.state.albums}
                    path={picture.info}
                    inAlbum={false}
                    inFavs={true}
                    refresh={this.state.refresh}
                    date={picture.date} />
            })

        const imgCopy = [...img]

        var cardGroups = []
        var years = []
        if (img.length === this.state.filesLen) {
            const sortedPanes = sortByYear(img);
            years = sortedPanes.map(obj => obj.year) 
            cardGroups = mapByYear(sortedPanes);
        }
        
        const panes = [
            {
                menuItem: 'Gallery',
                /*pane:*/render: () => {
                    return <Tab.Pane attached={false}>
                                <Gallery user={this.props.user} 
                                    onRefresh={this.state.refresh} 
                                    img={imgCopy} 
                                    cardGroups={cardGroups}
                                    years={years}
                                    />
                            </Tab.Pane>
                }
            },
            {
                menuItem: 'Favorites',
                render: () => {
                    return <Tab.Pane attached={false}>
                            <Favorited favs={favs} />
                        </Tab.Pane>
                }
            },
            {
                menuItem: 'Albums',
                /*pane:*/render: () => {
                    return <Tab.Pane attached={false}>
                                <AlbumsList user={this.props.user}/>
                            </Tab.Pane>
                }
            },
        ]
        return (
            <div>
                <Header as='h2'>
                    <div>
                        Welcome, {this.props.name}.

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