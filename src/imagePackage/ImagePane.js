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

    toggleDelModal = () => this.setState({ delModal : !this.state.delModal })

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
        this.setState({ deleted : true })
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
                //TODO handle response - success or failed to remove from album
                this.handleRemove()
            })
    }

    delete = () => {
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        }
        fetch('/deleteImage/' + this.state.id + '/' + encodeURIComponent(this.props.path) + '/' + encodeURIComponent(this.state.name), reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                //todo provide pop up that says it was deleted
                // this.handleRemove()
            })
    }

    // update favorited state from PaneInfo child
    setFavorited = (boolean) => this.setState({ favorited: boolean })

    // update map state from PaneInfo child
    setMap = (mapObj) => this.setState({ map: mapObj })

    componentDidMount() {
        // use this code to test loading
        //setTimeout(() => {
        this.setState({ loading: false })
        //}, 3000)
    }

    render() {
        return (
            <div ref={this.props.forwardedRef}> {(this.props.inViewport || this.props.enterCount > 1) ? (
                <Card>
                    {this.props.isVideo ? (
                        <>
                            {this.state.loading ? (
                                <Placeholder><Placeholder.Image square /></Placeholder>
                            ) : (
                                <div onMouseEnter={() => this.setState({ vidPreview: true })} onMouseLeave={() => this.setState({ vidPreview: false })}>
                                    <ReactPlayer url={this.state.picture} playing={this.state.vidPreview} loop muted width='100%' /*height='100%'*/ />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {this.state.loading ? (
                                <Placeholder><Placeholder.Image square /></Placeholder>
                            ) : (
                                <Image src={this.state.picture} alt="pic" />
                            )}
                        </>
                    )}
                    <Card.Content>
                        <Modal
                            open={this.state.infoModal}
                            trigger={<Button onClick={this.toggleInfoModal} disabled={this.state.loading}><Icon name='info' /></Button>}>
                            <Modal.Content>
                                <Grid columns={2} divided>
                                    <Grid.Column>
                                        <PaneMedia media={this.state.picture} name={this.state.name} isVideo={this.props.isVideo} />
                                        <Divider />
                                        <a href={this.state.picture} download={this.state.name}>
                                            <Button type="submit"><Icon name='download' />Save</Button>
                                        </a>
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
                                        path={this.props.path}
                                        name={this.state.name}
                                        date={this.props.date}
                                        id={this.state.id}
                                    />
                                </Grid>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.toggleInfoModal}>Close</Button>
                            </Modal.Actions>
                        </Modal>
                        {this.state.deleted ?
                            <Button negative onClick={() => this.setState({deleted: false})}>Undo - <Timer duration={10} handleAtZero={this.delete}/></Button>
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
