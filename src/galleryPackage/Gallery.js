import React, { Component } from 'react'
import { Card, Search, Divider, Header } from 'semantic-ui-react'

import ImagePane from '../imagePackage/ImagePane'
import UploadFileModal from './UploadFileModal'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            albums: [],
            currentUser: props.user,
            // array of object, each object containing photo information
            files: [],
            link_name_id_info: [],
            id_path: {},
            uploadFile : false,
            refresh : props.onRefresh,
        }
    }

    fetchPictures = () => {
        fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                this.setState({files : JSON.parse(JSONresponse)})
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
                this.setState({ albums: JSONresponse })
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
                <div>
                    <Header as='h3' size='small '>
                        <UploadFileModal onRefresh={this.state.refresh}/>
                        <Search />
                    </Header>
                </div>
                <Divider />
                <div>
                    <Card.Group itemsPerRow={4}>
                        {this.state.link_name_id_info.map(picture => {
                            return <ImagePane
                                picture={picture.link}
                                filename={picture.name}
                                id={picture.id}
                                user={this.state.currentUser}
                                albums={this.state.albums}
                                path={picture.info}
                                inAlbum={false}
                                refresh={this.state.refresh}
                                />
                        })}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default Gallery;