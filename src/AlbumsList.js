import React, { useEffect, useState, useContext } from "react";
import { Card, Icon, Button, Modal, Input, Message } from 'semantic-ui-react'
import { UserContext } from "./UserContext";



export default function AlbumsList(props) {
    const { user } = useContext(UserContext);
    const [albums, setAlbums] = useState([]);
    const [modal, toggleModal] = useState(false);
    const [duplicate, toggleDuplicate] = useState(false);
    const [nameBlank, toggleNameBlank] = useState(false);
    const [albumName, setAlbumName] = useState("")


    useEffect(() => {
        fetch('/getAlbums/' + user)
            .then(response => response.json())
            .then(JSONresponse => setAlbums(JSONresponse))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function updateProp(event) {
        // eventually can add more info to this whole thing like shared?
        if (event.target.id === 'enteredAlbumName') {
            setAlbumName(event.target.value);
            toggleNameBlank(false);
        }
    }

    function handleResponse(jsonOutput) {
        if (jsonOutput === false) {
            toggleDuplicate(true);
        }
        else {
            toggleDuplicate(false);
            toggleModal(false);
            setAlbums([...albums, albumName])
        }
    }

    function createAlbum() {
        if (albumName === "") {
            toggleNameBlank(true);
            return;
        }
        const data = {
            username : user,
            album_name : albumName
        }
        const reqOptions = {
            method : 'POST',
            headers: {Accept: 'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }
        fetch('createAlbum/' + user + '/' + albumName, reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                handleResponse(jsonOutput)
        })
    }

    return (
        <div>
            <Card.Group itemsPerRow={4}>
                <Card>
                    <Modal
                        open={modal}
                        trigger={
                            <Button basic size='massive' onClick={() => toggleModal(true)}>
                                <Icon name='add' />
                                Create New Album
                            </Button>}>
                        <Modal.Header>
                            Create New Album
                        </Modal.Header>
                        <Modal.Content>
                            <Message error
                                hidden={!duplicate}
                                header='Album with that name already exists.'
                                content='Please try again.'
                            />
                            <Input
                                error={nameBlank}
                                fluid
                                id='enteredAlbumName'
                                placeholder='Album Name'
                                onChange={updateProp}
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => toggleModal(false)}>Cancel</Button>
                            <Button
                                content='Create'
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => createAlbum()}
                                positive
                            />
                        </Modal.Actions>
                    </Modal>
                </Card>
                {albums.map(album => {
                    return <Card href={('#album/').concat(album)}><Card.Content>{album}</Card.Content></Card>
                })}
            </Card.Group>
        </div>
    )
}