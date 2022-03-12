import React, { Component } from 'react'
import { Button, Icon, Card, Image, Modal, Divider, Confirm, Grid } from 'semantic-ui-react'
// import PeopleTags from './PeopleTags'
import MapContainer from '../MapContainer'
import Tags from './Tags'
import People from './People'
import AddToAlbumButton from './AddToAlbumButton'

class ImagePane extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display: false,
            name: props.filename,
            picture: props.picture,
            favorited: props.favorited,
            id: props.id,
            infoModal: false,
            // [len, wid, make, modal, datetime, [lat, long]]
            info: [],

            open: false,
            openDel: false,
            refresh: props.refresh,
            map: null,
        }
    }
    open = () => this.setState({ open: true })

    openDel = () => this.setState({ openDel: true })

    close = () => this.setState({ open: false })

    closeDel = () => this.setState({ openDel: false })

    favorite = () => {
        const data = {
            username: this.props.user,
            id: this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        if (this.state.favorited) {
            this.setState({ favorited: false })
            this.props.inFavs && this.props.refresh();
            // delete where user and picture id
            const getUrl = '/removeFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
        else {
            this.setState({ favorited: true })
            // post user and picture id
            const getUrl = '/addFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
    }

    fetchInfo = () => {
        fetch('/info/' + encodeURIComponent(this.props.path) + '/' + encodeURIComponent(this.state.name) + '/' + this.props.user)
            .then(response => response.json())
            .then(output => {
                // var id = this.state.id;
                // this.setState(prevState => ({
                //     ...prevState,
                //     id_info: {
                //         ...prevState.id_info,
                //         [id]: output
                //     }
                // }))
                this.setState({ info: output });
                this.setState({ favorited: Boolean(output[5]) })
                if (output[6].length !== 0) this.setState({
                    map: {
                        lat: output[6][0],
                        long: output[6][1]
                    }
                })
            })
    }

    toggleInfoModal = () => {
        this.fetchInfo();
        this.setState({ infoModal: !this.state.infoModal })
    }

    handleRemove = () => {
        console.log("handle remove")
        this.props.inAlbum && this.close();
        this.props.inAlbum && this.state.refresh(this.props.inAlbum);
        !this.props.inAlbum && this.closeDel();
    }

    removeFromAlbum = () => {
        const postData = {
            username: this.props.user,
            album_name: this.props.inAlbum,
            id: this.state.id
        }
        console.log(postData)
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
                this.handleRemove()
            })
    }

    date = () => {
        if (this.state.info[4] === '---') {
            return (
                <>
                    <h2>Date Uploaded</h2>
                    {new Date(this.props.date).toDateString()}
                </>
            )
        }
        else {
            return (
                <>
                    <h2>Date Taken</h2>
                    {this.state.info[4]}
                </>
            )
        }
    }

    componentDidMount() {
        // todo split info into its own component
        this.state.infoModal && this.fetchInfo();
    }

    render() {
        return (
            <Card>
                <Image src={this.state.picture} alt="pic" />
                <Card.Content>
                    <Modal
                        open={this.state.infoModal}
                        trigger={<Button onClick={this.toggleInfoModal}><Icon name='info' /></Button>}>
                        <Modal.Content>
                            <Grid columns={2} divided>
                                <Grid.Column>
                                    <Image fluid src={this.state.picture} alt={this.state.name} />
                                    <Divider />
                                    <a href={this.state.picture} download={this.state.name}>
                                        <Button type="submit"><Icon name='download' />Save</Button>
                                    </a>
                                    <Button onClick={this.favorite}>
                                        {!this.state.favorited && <Icon name='favorite' />}
                                        {this.state.favorited && <Icon name='favorite' color='yellow' />}
                                        Favorite
                                    </Button>
                                    {!this.props.inAlbum &&
                                        <AddToAlbumButton
                                            selectAlbum={this.selectAlbum}
                                            id={this.state.id}
                                            user={this.props.user}
                                        />}
                                    {this.props.inAlbum &&
                                        <Button color='red' onClick={this.open}>
                                            Remove
                                        </Button>}
                                    <Confirm
                                        open={this.state.open}
                                        onCancel={this.close}
                                        onConfirm={this.removeFromAlbum}
                                        content='This will remove this file from the album'
                                    />
                                    <Divider />
                                    {this.state.map !== null && <MapContainer lat={this.state.map.lat} long={this.state.map.long} />}
                                </Grid.Column>
                                <Grid.Column>
                                    <h3>{this.state.name}</h3>
                                    <Divider />
                                    <Tags id={this.state.id} />
                                    <Divider />
                                    {/* <PeopleTags picture={this.state.picture} id={this.state.id} /> */}
                                    {/* <Divider /> */}
                                    <People id={this.state.id} />
                                    <Divider />
                                    <h2>Dimensions</h2>
                                    {this.state.info[0]} x {this.state.info[1]}
                                    <h2>Make</h2>
                                    {this.state.info[2]}
                                    <h2>Model</h2>
                                    {this.state.info[3]}
                                    {this.date()}
                                    <Divider />
                                    ID: {this.state.id}
                                </Grid.Column>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.toggleInfoModal}>Close</Button>
                        </Modal.Actions>
                    </Modal>
                    <Button negative icon='trash' onClick={this.openDel}></Button>
                    <Confirm
                        open={this.state.openDel}
                        onCancel={this.closeDel}
                        onConfirm={this.delete}
                        header='Delete File?'
                        content='This will delete this file for EVERYONE! Are you sure you want to proceed?'
                    />
                </Card.Content>
            </Card>
        )
    }
}
export default ImagePane
