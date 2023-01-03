import React, { Component } from 'react'
import { Button, Icon, Card, Image, Modal, Divider, Confirm, Grid, Placeholder } from 'semantic-ui-react'
import MapContainer from '../MapContainer'
import AddToAlbumButton from './AddToAlbumButton'
import ReactPlayer from 'react-player'
import { UserContext } from '../UserContext'
import handleViewport from 'react-in-viewport'
import PaneMedia from './PaneMedia'
import PaneInfo from './PaneInfo'
import Timer from '../Timer'
import { showErrorNotification, showSuccessNotification } from '../notificationUtils'
import MyLivePhoto from '../LivePhoto'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

class ImagePane extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props)
        this.state = {
            display: false,
            name: props.filename,
            picture: props.picture,
            favorited: props.favorited,
            id: props.id,
            type: props.type,
            path: props.path,
            movData: props.movData,
            mp4Data: props.mp4Data,

            // modals
            infoModal: false,   // info panel
            removeModal: false, // confirm remove from album
            delModal: false,    // confirm delete from app

            map: null,
            vidPreview: false,
            loading: true,

            deleted: false
        }
    }

    toggleRemoveModal = () => this.setState({ removeModal: !this.state.removeModal })

    toggleDelModal = () => this.setState({ delModal: !this.state.delModal })

    toggleInfoModal = () => this.setState({ infoModal: !this.state.infoModal })

    favorite = () => {
        const data = {
            username: this.context.user,
            id: this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        if (this.state.favorited) {
            this.setState({ favorited: false })
            this.props.inFavs && this.props.inFavs(this.state.id)
            // delete where user and picture id
            const getUrl = '/removeFav/' + this.context.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
        else {
            this.setState({ favorited: true })
            // post user and picture id
            const getUrl = '/addFav/' + this.context.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
    }

    handleRemove = () => {
        this.props.inAlbum && this.toggleRemoveModal();
        this.props.inAlbum && this.props.updateAlb(this.state.id);
        !this.props.inAlbum && this.toggleDelModal();
    }

    handleConfirmClick = () => {
        this.setState({ deleted: true })
        this.toggleDelModal();
    }

    removeFromAlbum = () => {
        const postData = {
            username: this.context.user,
            album_name: this.props.inAlbum,
            id: this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        }
        fetch('/removeFromAlbum/', reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                jsonOutput ? showSuccessNotification(`Removed ${this.state.name} from album.`) :
                    showErrorNotification('Failed to remove. Please try again.')
                this.handleRemove()
            })
            .catch(err => showErrorNotification('Failed to remove. Please try again.'))
    }

    // deletes 1/3 of a live photo component - called 3 times
    deleteLive = (id, path, name, reqOptions) => {
        fetch('/deleteImage/' + id + '/' + encodeURIComponent(path) + '/' + encodeURIComponent(name), reqOptions)
            .catch(err => {
                showErrorNotification('Unexpected error occured in deleting portion of live photo')
            })
    }

    delete = () => {
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        }
        // if live, we want to delete all 3 parts
        if (this.state.type === 'live') {
            // delete all 3 parts
            const imgPromise = this.deleteLive(this.state.id, this.state.path, this.state.name, reqOptions);
            const mp4Promise = this.deleteLive(this.state.mp4Data.id, this.state.mp4Data.info, this.state.mp4Data.name, reqOptions)
            const movPromise = this.deleteLive(this.state.movData.id, this.state.movData.info, this.state.movData.name, reqOptions)
            Promise.all([imgPromise, mp4Promise, movPromise])
                .then(() => {
                    showSuccessNotification(this.state.name + " deleted successfully")
                    this.context.setRefresh(true)
                })
        }
        else {
            // otherwise we could just delete the one part normally
            fetch('/deleteImage/' + this.state.id + '/' + encodeURIComponent(this.props.path) + '/' + encodeURIComponent(this.state.name), reqOptions)
                .then(response => response.json())
                .then(jsonOutput => {
                    if (jsonOutput) {
                        showSuccessNotification(this.state.name + " deleted successfully")
                        // this.context.setFiles([...this.context.files.filter(obj => obj.id !== this.state.id)])
                        this.context.setRefresh(true)
                    }
                    else
                        showErrorNotification("Unable to delete " + this.state.name + "... Please try again.");
                })
        }
    }

    // update favorited state from PaneInfo child
    setFavorited = (boolean) => this.setState({ favorited: boolean })

    // update map state from PaneInfo child
    setMap = (mapObj) => this.setState({ map: mapObj })

    loadingSquare = () => <Placeholder><Placeholder.Image square /></Placeholder>

    // returns either placeholder or display depending on type of file
    getCardDisplay = () => {
        switch (this.state.type) {
            case "live":
                return (
                    <div >
                        {this.state.loading ? (this.loadingSquare()) :
                            (
                                <div className='pane-media'>
                                    <MyLivePhoto vid={this.state.mp4Data.link} img={this.state.picture} />
                                </div>
                            )}
                    </div>
                )
            case "video":
                return (
                    <div >
                        {this.state.loading ? (this.loadingSquare()) :
                            (
                                <div className='pane-media'
                                    onMouseEnter={() => this.setState({ vidPreview: true })}
                                    onMouseLeave={() => this.setState({ vidPreview: false })}>
                                    <ReactPlayer
                                        url={this.state.picture}
                                        playing={this.state.vidPreview}
                                        loop muted
                                        style={{
                                            "max-width": "100%",
                                            "max-height": "100%"
                                        }}
                                    />
                                </div>
                            )}
                    </div>
                )
            case "altvideo":
                return (
                    <div>
                        {this.state.loading ? (this.loadingSquare()) :
                            (
                                <video muted className='pane-media'>
                                    <source src={this.state.picture} type="video/mp4"></source>
                                </video>
                            )}
                    </div>
                )
            case "photo":
            default:
                return (
                    <div className='pane-media'>

                        {this.state.loading ? (this.loadingSquare()) :
                            (
                                <Image
                                    style={{
                                        "max-width": "100%",
                                        "max-height": "100%",
                                        "margin-left": 'auto',
                                        "margin-right": "auto"
                                    }}
                                    src={this.state.picture}
                                    alt="pic"
                                />
                            )}
                    </div>
                )

        }
    }

    // either render normal download or
    // ensure logic for downloading live photo zip
    getDownload = () => {
        if (this.state.type === 'live') {
            // zip up MOV and JPG
            const exportZip = () => {
                const zip = JSZip();
                zip.file(this.state.movData.name, this.state.movData.link)
                zip.file(this.state.name, this.props.link)
                zip.generateAsync({ type: 'blob' })
                    .then(zipFile => {
                        FileSaver.saveAs(zipFile, 'LivePhoto.zip')
                    })
            }
            // render download button
            return <Button onClick={exportZip}><Icon name='download' />Save</Button>

        }
        else {
            // render normal download button
            return (
                <a href={this.state.picture} download={this.state.name}>
                    <Button type="submit"><Icon name='download' />Save</Button>
                </a>
            )
        }
    }

    loadFile = () => {
        if (this.state.type === "live") {
            // await all of these and then update our files state
            fetch('/files/' + encodeURIComponent(this.state.movData.info) + '/' + encodeURIComponent(this.state.movData.name)) // fetch movFile
                .then(res => res.blob())
                .then(b => this.setState({ movData: { ...this.state.movData, link: URL.createObjectURL(b) } }))
            fetch('/files/' + encodeURIComponent(this.state.path) + '/' + encodeURIComponent(this.state.name)) // fetch jpgFile
                .then(res => res.blob())
                .then(b => this.setState({ picture: URL.createObjectURL(b) }))
            fetch('/files/' + encodeURIComponent(this.state.mp4Data.info) + '/' + encodeURIComponent(this.state.mp4Data.name)) // fetch mp4File
                .then(res => res.blob())
                .then(b => this.setState({ mp4Data: { ...this.state.mp4Data, link: URL.createObjectURL(b) } }))
        }
        else {
            fetch('/files/' + encodeURIComponent(this.props.path) + '/' + encodeURIComponent(this.props.filename))
                .then(response => {
                    // console.log("res", response)
                    if (response.status === 404)
                        return null;
                    else return response.blob()
                })
                .then(imageBlob => {
                    if (!imageBlob) return;
                    const imageURL = URL.createObjectURL(imageBlob);
                    console.log("my name and type", this.state.name, imageBlob.type)
                    const isVideo = imageBlob.type === 'video/mp4'
                    const isAltVideo = imageBlob.type === 'video/quicktime'
                    this.setState(
                        {
                            picture: imageURL,
                            type: isVideo ? "video" : isAltVideo ? "altvideo" : "photo",
                        })
                })
        }
    }

    render() {

        if (this.state.picture === null && this.props.enterCount === 1 && this.props.inViewport) {
            this.loadFile();
        }
        // if we have loaded but still have loading state
        else if (this.state.picture !== null && this.state.loading) {
            this.setState({ loading: false })
        }

        return (
            <div ref={this.props.forwardedRef}> {(this.props.inViewport || this.props.enterCount > 1) ? (
                <Card>
                    {this.getCardDisplay()}
                    <Card.Content>
                        <Modal
                            open={this.state.infoModal}
                            trigger={<Button onClick={this.toggleInfoModal} disabled={this.state.loading}><Icon name='info' /></Button>}>
                            <Modal.Content>
                                <Grid columns={2} divided>
                                    <Grid.Column>
                                        <PaneMedia media={this.state.picture} name={this.state.name} type={this.state.type} mp4={this.state.mp4Data && this.state.mp4Data.link} />
                                        <Divider />
                                        {this.getDownload()}
                                        <Button onClick={this.favorite}>
                                            {!this.state.favorited && <Icon name='favorite' />}
                                            {this.state.favorited && <Icon name='favorite' color='yellow' />}
                                            Favorite
                                        </Button>
                                        {
                                            this.props.inAlbum ?
                                                (
                                                    <Button color='red' onClick={this.toggleRemoveModal} content='Remove' />
                                                ) : (
                                                    <AddToAlbumButton
                                                        selectAlbum={this.selectAlbum}
                                                        id={this.state.id}
                                                    />
                                                )
                                        }
                                        <Confirm
                                            open={this.state.removeModal}
                                            onCancel={this.toggleInfoModal}
                                            onConfirm={this.removeFromAlbum}
                                            content='This will remove this file from the album'
                                        />
                                        <Divider />
                                        {this.state.map !== null && <MapContainer lat={this.state.map.lat} long={this.state.map.long} />}
                                    </Grid.Column>
                                    <PaneInfo
                                        setFavorited={this.setFavorited}
                                        setMap={this.setMap}
                                        path={this.state.path}
                                        name={this.state.name}
                                        date={this.state.date}
                                        id={this.state.id}
                                    />
                                </Grid>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.toggleInfoModal}>Close</Button>
                            </Modal.Actions>
                        </Modal>
                        {this.state.deleted ?
                            <Button negative onClick={() => this.setState({ deleted: false })}>Undo - <Timer duration={5} handleAtZero={this.delete} /></Button>
                            : <Button negative icon='trash' onClick={this.toggleDelModal} disabled={this.state.loading}></Button>
                        }
                        <Confirm
                            open={this.state.delModal}
                            onCancel={this.toggleDelModal}
                            onConfirm={this.handleConfirmClick}
                            header='Delete File?'
                            content='This will delete this file for EVERYONE! Are you sure you want to proceed?'
                        />
                    </Card.Content>
                </Card>
            ) : (
                <Card><Placeholder><Placeholder.Image square /></Placeholder></Card>
            )}
            </div>
        )
    }
}
const MyImagePane = handleViewport(ImagePane, /*options: {}, config{} */);

export default MyImagePane
