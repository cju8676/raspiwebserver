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
            files: [],
            open: false,
            id_path: {}
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

    fetchAlbumPhotos = () => {
        //fixme if these are already previously fetched by gallery then we would just want to
        // get those instead to be more efficient
        // todo to do this we would change every /files/ instance to just the id, fetch
        // id's from db first then use those id's to fetch /files/ 
        fetch('/getAlbumPhotos/'+ this.context.user + '/' + this.props.match.params.album).then(response => response.json())
            .then(JSONresponse => {
                this.setState({files : JSON.parse(JSONresponse)})
                for (let i = 0; i < this.state.files.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.files[i].path).replace('/', '%2F');
                    this.setState(prevState => ({
                        ...prevState,
                        id_path: {
                            ...prevState.id_path,
                            [this.state.files[i].id]:[path]
                        }
                    }))
                    fetch('/files/' + this.state.files[i].id)
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
                            albums={[]}
                            path={picture.info}
                            inAlbum={this.props.match.params.album}
                            refresh={this.props.onChange}
                            />
                        })}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default AlbumPage;