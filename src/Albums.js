import React, { Component } from 'react'
import { Card, Icon, Button, Modal, Input, Message } from 'semantic-ui-react'

//import ImagePane from './ImagePane'

class Albums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.user,
            album_name: "",
            albums : [],
            modal: false,
            duplicate: false,
            nameBlank : false
        }
    }


    toggle = () => {
        this.setState({modal : !this.state.modal})
    }

    submitForm = () => {
        this.createAlbum()
    }

    handleResponse = (jsonOutput) => {
        if (jsonOutput === false) {
            // album name already exists
            this.setState({duplicate : true})
        }
        else {
            // album created - toggle off create modal
            this.toggle();
            this.componentDidMount();
        }
    }

    createAlbum = () => {
        if (this.state.album_name === "") {
            this.setState({nameBlank : true})
            return;
        }
        const data = {
            username : this.state.username,
            album_name : this.state.album_name
        }
        const reqOptions = {
            method : 'POST',
            headers: {Accept: 'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }
        fetch('createAlbum/' + this.state.username + '/' + this.state.album_name, reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                this.handleResponse(jsonOutput)
            })
    }

    updateProp = (event) => {
        // eventually can add more info to this whole thing
        if (event.target.id === "enteredAlbumName") 
            this.setState({
                album_name : event.target.value,
                nameBlank: false
            })
    }

    fetchAlbums = () => {
        fetch('/getAlbums/' + this.state.username).then(response => response.json())
            .then(JSONresponse => {
                this.setState({albums : JSONresponse})
            })
    }

    componentDidMount() {
        //fixme albums already fetched dont need to fetch again
        this.fetchAlbums();
    }

    render() {
        return (
            <div>
                <Card.Group itemsPerRow={4}>
                    <Card>
                        <Modal
                            open={this.state.modal}
                            trigger={
                                <Button basic size='massive' onClick={this.toggle}>
                                    <Icon name='add' />
                                    Create New Album 
                                </Button>}>
                            <Modal.Header>
                                Create New Album
                            </Modal.Header>
                            <Modal.Content>
                                <Message error
                                    hidden={!this.state.duplicate}
                                    header='Album with that name already exists.'
                                    content='Please try again.'
                                    />
                                <Input
                                    error={this.state.nameBlank}
                                    fluid
                                    id='enteredAlbumName'
                                    placeholder='Album Name'
                                    onChange={this.updateProp}
                                />
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.toggle}>Cancel</Button>
                                <Button
                                    content='Create'
                                    labelPosition='right'
                                    icon='checkmark'
                                    onClick={this.submitForm}
                                    positive
                                />    
                            </Modal.Actions>
                        </Modal>

                    </Card>
                    {this.state.albums.map(album => {
                        return <Card href={('#album/').concat(album)}><Card.Content>{album}</Card.Content></Card>
                    })}
                </Card.Group>
            </div>
        )
    }

}
export default Albums;