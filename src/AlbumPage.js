import React, {Component} from 'react'
import {Header, Button, Card, Divider, Confirm } from 'semantic-ui-react'
import ImagePane from './ImagePane';
//import {withRouter} from 'react-router-dom'

class AlbumPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link_name_id: [],
            name_path_id: [],
            open: false
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
        fetch('/delAlbum/' + this.props.user + '/' + this.props.match.params.album, reqOptions)
            .then(response => response.json())
            .then(JSONresponse => 
                JSONresponse ? this.props.history.push('/home') : console.log("not del"))
        
    }

    fetchAlbumPhotos = () => {
        //fixme if these are already previously fetched by gallery then we would just want to
        // get those instead to be more efficient
        // todo to do this we would change every /files/ instance to just the id, fetch
        // id's from db first then use those id's to fetch /files/ 
        fetch('/getAlbumPhotos/'+ this.props.user + '/' + this.props.match.params.album).then(response => response.json())
            .then(JSONresponse => {
                this.setState({name_path_id : JSONresponse})
                for (let i = 0; i < this.state.name_path_id.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.name_path_id[i][1]).replace('/', '%2F');
                    //fixme could change this to just the id to simplify
                    fetch('/files/' + encodeURIComponent(path) + '/' + encodeURIComponent(this.state.name_path_id[i][0]))
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            this.setState(prevState => ({
                                link_name_id: 
                                [...prevState.link_name_id, [imageURL, this.state.name_path_id[i][0], this.state.name_path_id[i][2]]]
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
                    {this.props.match.params.album}
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
                        {this.state.link_name_id.map(picture => {
                            return <ImagePane 
                            picture={picture[0]} 
                            filename={picture[1]} 
                            id={picture[2]} 
                            user={this.props.currentUser}
                            albums={[]}
                            />
                        })}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default AlbumPage;