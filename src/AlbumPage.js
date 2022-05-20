import React, { useState, useEffect, useContext } from 'react'
import { Header, Button, Card, Divider, Confirm, Segment, Icon, Dropdown } from 'semantic-ui-react'
import ImagePane from './imagePackage/ImagePane';
import { mapByYear, sortByYear, sortByMonth } from './imageUtils';
import Notification from './Notification';
import SharePane from './SharePane';
import { UserContext } from './UserContext';
//import {withRouter} from 'react-router-dom'

export default function AlbumPage(props) {
    const { user, files, setActiveIndex, showSuccessNotification, showErrorNotification } = useContext(UserContext)
    const albName = props.match.params.album;
    // is confirm dialog open
    const [confirmDelete, setConfirmDelete] = useState(false);
    // is share Modal visible
    const [shareModal, setShareModal] = useState(false);
    const [albIDs, setAlbIDs] = useState([])
    const [img, setImg] = useState([])
    const [availShareUsers, setAvailShareUsers] = useState([])
    const [sharedWith, setSharedWith] = useState([])
    const [owner, setOwner] = useState(false)
    // maps user to array of ids they added to the album [{ user: "", ids: []}]
    const [addedBy, setAddedBy] = useState([])
    const [filter, setFilter] = useState(null)

    const deleteAlbum = () => {
        setConfirmDelete(false);
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/delAlbum/' + user + '/' + albName, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? handleDelete() : showErrorNotification(`Unable to delete ${albName}... Please try again.`))
    }

    useEffect(() => {
        getAlbumPhotos();
        getShareData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // returns the IDs of the image panes we need to extract
    async function getAlbumPhotos() {
        await fetch('/getAlbumPhotos/' + user + '/' + albName)
            .then(response => response.json())
            .then(JSONresponse => {
                setAlbIDs(JSONresponse.map(arr => arr[0]))
                var addedBy = []
                for (let i = 0; i < JSONresponse.length; i++) {
                    if (addedBy.some(obj => obj.user === JSONresponse[i][1]))
                        addedBy.find(obj => obj.user === JSONresponse[i][1]).ids.push(JSONresponse[i][0])
                    else addedBy.push({ user: JSONresponse[i][1], ids: [JSONresponse[i][0]] })
                }
                setAddedBy(addedBy)
            })
    }

    console.log(addedBy)

    async function getShareData() {
        await fetch('/getShareData/' + albName + '/' + user)
            .then(res => res.json())
            .then(JSONresponse => {
                console.log("SHARE DATA", JSONresponse)
                setAvailShareUsers(JSONresponse["availShareUsers"])
                setSharedWith(JSONresponse["sharedWith"])
                setOwner(JSONresponse["owner"])
            })
    }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleDelete = (event) => {
        handleBack(event)
        showSuccessNotification(`Album '${albName}' successfully removed.`)
    }

    const handleBack = (event) => {
        props.history.push('/home')
        setActiveIndex(2)
    }

    const shareProps = {
        availShareUsers,
        setAvailShareUsers,
        sharedWith,
        setSharedWith,
        owner
    }

    const filterOptions = [
        {
            key: "all",
            text: "All",
            value: "all"
        },
        {
            key: "addedBy",
            text: "Added By",
            value: "addedBy"
        },
        {
            key: "year",
            text: "Year",
            value: "year"
        },
    ]

    const getFilteredPanes = () => {
        if (!filter || filter === 'all')
            return (
                <div className='gallery-scroll'>
                    <div style={{ padding: "5px" }}>
                        <Card.Group itemsPerRow={4}>
                            {img.map(pane =>
                                <div className='pane-pad'>
                                    {pane}
                                </div>
                            )}
                        </Card.Group>
                    </div>
                </div>
            )
        else if (filter === 'addedBy')
            return (
                <div className='noflex-scroll'>
                    {addedBy.map(obj =>
                        <div>
                            <Header style={{ padding: "10px" }}>{obj.user}</Header>
                            <div style={{ padding: "5px" }}>
                                <Card.Group itemsPerRow={4}>
                                    {img
                                        .filter(pane => obj.ids.includes(pane.props.id))
                                        .map(pane =>
                                            <div className='pane-pad'>
                                                {pane}
                                            </div>
                                        )}
                                </Card.Group>
                            </div>
                        </div>
                    )}
                </div>
            )
        else if (filter === 'year') {
            const sortedPanes = sortByYear([...img]);
            var sortedByMonth = [];
            for (const year of sortedPanes) {
                sortedByMonth.push(sortByMonth(year))
            }
            const cardGroups = mapByYear(sortedByMonth);
            return (
                <div className='gallery-scroll'>
                    {cardGroups.map(group => group)}
                </div>
            )
        }
    }

    return (
        <div>
            <Notification />
            <div className='segment-pad'>
                <Segment>
                    <Header>
                        <Button color='orange' size='large' onClick={handleBack}>Back</Button>
                        {albName}
                        {owner && <Button color='red' size='large' floated='right' onClick={() => setConfirmDelete(!confirmDelete)}>Delete</Button>}
                        <Button color='blue' size='large' floated='right' onClick={() => setShareModal(!shareModal)}><Icon name='share' />Share</Button>
                        <Confirm
                            open={confirmDelete}
                            onCancel={() => setConfirmDelete(false)}
                            onConfirm={deleteAlbum}
                        />
                    </Header>
                </Segment>
                {shareModal &&
                    <SharePane
                        albName={albName}
                        closeModal={() => setShareModal(false)}
                        {...shareProps}
                    />}
                <Divider />
                <Dropdown floated placeholder='Filter' search selection options={filterOptions} onChange={(e, { value }) => setFilter(value)} />
                <Segment>
                    {getFilteredPanes()}
                </Segment>
            </div>
        </div>
    )
}