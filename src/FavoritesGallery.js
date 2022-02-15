import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'

import ImagePane from './imagePackage/ImagePane'


class FavoritesGallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user,
            link_name_id_info: [],
            files: [],
            albums : [],
            id_path: {}
        }
    }

    fetchPictures = () => {
        fetch('/getFavorites/' + this.state.currentUser ).then(response => response.json())
            .then(JSONresponse => {
                this.setState({ files: JSON.parse(JSONresponse) })
                for (let i = 0; i < this.state.files.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.files[i].path).replace('/', '%2F');
                    //fixme could change this to just the id to simplify
                    this.setState(prevState => ({
                        ...prevState,
                        id_path: {
                            ...prevState.id_path,
                            [this.state.files[i].id]:[path]
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
                this.setState({albums : JSONresponse})
            })
    }

    componentDidMount() {
        //FIXME if photos are already loaded then switching tabs shouldn't reset this
        this.fetchAlbums();
        this.fetchPictures();
    }

    render() {

        return (
            <div>
                {console.log(this.state)}
                <Card.Group itemsPerRow={4}>
                    {this.state.link_name_id_info.map(picture => {
                        return <ImagePane 
                        picture={picture.link} 
                        filename={picture.name} 
                        id={picture.id} 
                        user={this.state.currentUser} 
                        favorited='true'
                        albums={this.state.albums}
                        path={picture.info}/>
                    })}
                    {/* {this.props.img.map(pane => pane)} */}
                </Card.Group>
            </div>
        )
    }
}

export default FavoritesGallery;