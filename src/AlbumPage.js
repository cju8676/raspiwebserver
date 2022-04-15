import React, { useState, useEffect, useContext } from 'react'
import { Header, Button, Card, Divider, Confirm, Segment, Icon } from 'semantic-ui-react'
import ImagePane from './imagePackage/ImagePane';
import SharePane from './SharePane';
import { UserContext } from './UserContext';
//import {withRouter} from 'react-router-dom'

export default function AlbumPage(props) {
    const { user, files } = useContext(UserContext)
    const albName = props.match.params.album;
    // is confirm dialog open
    const [confirmDelete, setConfirmDelete] = useState(false);
    // is share Modal visible
    const [shareModal, setShareModal] = useState(false);
    const [albIDs, setAlbIDs] = useState([])
    const [img, setImg] = useState([])

    const deleteAlbum = () => {
        setConfirmDelete(false);
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/delAlbum/' + user + '/' + albName, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? props.history.push('/home') : console.log("not del"))
    }

    useEffect(async () => {
        // returns the IDs of the image panes we need to extract
        await fetch('/getAlbumPhotos/' + user + '/' + albName)
            .then(response => response.json())
            .then(JSONresponse => {
                setAlbIDs(JSONresponse
                    .flat()
                    .filter(i => i !== -1)    
                )
            })

    }, []);

    useEffect(() => {
        setImg(
            files
                .filter(i => albIDs.includes(i.id))
                .sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
                .map(picture => {
                    return <ImagePane
                        picture={picture.link}
                        filename={picture.name}
                        id={picture.id}
                        key={picture.id}
                        albums={[]}
                        path={picture.info}
                        inAlbum={albName}
                        updateAlb={updateAlb}
                        date={picture.date}
                        isVideo={picture.video}
                    />
                })
        )
    }, [files, albIDs])

    // id was either added or removed from favs, update AlbumPage accordingly
    const updateAlb = (id) => {
        // removed case
        if (albIDs.includes(id))
            setAlbIDs([...albIDs].filter(i => i !== id))
        // added case
        else
            setAlbIDs([...albIDs, id])
    }

    // TODO if not owner then disable delete functionality
    return (
        <div>
            <Segment>
                <Header>
                    <Button color='orange' size='large' href='#home'>Back</Button>
                    {albName}
                    <Button color='red' size='large' floated='right' onClick={() => setConfirmDelete(!confirmDelete)}>Delete</Button>
                    <Button color='blue' size='large' floated='right' onClick={() => setShareModal(!shareModal)}><Icon name='share' />Share</Button>
                    <Confirm
                        open={confirmDelete}
                        onCancel={() => setConfirmDelete(false)}
                        onConfirm={deleteAlbum}
                    />
                </Header>
                <Divider />
                {shareModal &&
                    <SharePane
                        albName={albName}
                        closeModal={() => setShareModal(false)}
                    />}
                <Segment>
                    <div>
                        <Card.Group itemsPerRow={4}>
                            {img.map(pane => pane)}
                        </Card.Group>
                    </div>
                </Segment>
            </Segment>
        </div>
    )
}