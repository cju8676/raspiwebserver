import React, {Component} from 'react'
import {Header, Button, Card, Divider, Confirm } from 'semantic-ui-react'
import ImagePane from './imagePackage/ImagePane';
import { UserContext } from './UserContext';
//import {withRouter} from 'react-router-dom'

class AlbumPage extends Component {
    static contextType = UserContext
    constructor(props) {
        super(props);
        this.state = {
            albName: props.match.params.album,
            link_name_id_info: [],
            open: false,
        }
    }

    open = () => this.setState({open : true})

    close = () => this.setState({open : false})

    deleteAlbum = () => {
        this.close();
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
        }
        fetch('/delAlbum/' + this.context.user + '/' + this.props.match.params.album, reqOptions)
            .then(response => response.json())
            .then(JSONresponse => 
                JSONresponse ? this.props.history.push('/home') : console.log("not del"))
        
    }

    fetchAlbumPhotos = async () => {
        var id_path = {};
        await fetch('/getAlbumPhotos/'+ this.context.user + '/' + this.props.match.params.album).then(response => response.json())
            .then(JSONresponse => {
                var files = JSON.parse(JSONresponse)
                for (let i = 0; i < files.length; i++) {
                    var path = (files[i].path).replace('/', '%2F');
                    id_path[files[i].id] = path

                    fetch('/files/' + files[i].id)
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            const isVideo = imageBlob.type === 'video/mp4' ? true : false
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

    componentDidMount() {
        this.fetchAlbumPhotos();
    }


    render () {
        return (
            <div>
                <Header>
                    <Button color='orange' size='large' href='#home'>Back</Button>
                    {this.state.albName}
                    <Button color='red' size='large' floated='right' onClick={this.open}>Delete</Button>
                    <Confirm
                        open={this.state.open}
                        onCancel={this.close}
                        onConfirm={this.deleteAlbum}
                        />
                </Header>
                <Divider />
                <div>
                    <Card.Group itemsPerRow={4}>
                        {this.state.link_name_id_info.map(picture => {
                            return <ImagePane 
                            picture={picture.link} 
                            filename={picture.name} 
                            id={picture.id}
                            key={picture.id}
                            albums={[]}
                            path={picture.info}
                            inAlbum={this.props.match.params.album}
                            refresh={this.props.onChange}
                            date={picture.date}
                            isVideo={picture.video}
                            />
                        })}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default AlbumPage;