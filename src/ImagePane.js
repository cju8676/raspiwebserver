import React, { Component } from 'react'
import { Button, Icon, Card, Image, Modal, Divider, Dropdown } from 'semantic-ui-react'
import ImageTags from './ImageTags'
import PeopleTags from './PeopleTags'

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
            albums: props.albums,
            // [len, wid, make, modal, datetime, [tags]]
            info: [],
        }
    }

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
        fetch('/info/' + encodeURIComponent(this.props.path) + '/' + encodeURIComponent(this.state.name))
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
            })
    }

    toggleInfoModal = () => { this.setState({ infoModal: !this.state.infoModal }) }

    getOptions = () => {
        if (this.state.albums.length === 0) return [];
        else {
            const op = this.state.albums.map(album => {
                return { key: album, text: album, value: album }
            })
            return op
        }
    }

    selectAlbum = (e, data) => {
        console.log(data.value);
        const postData = {
            username: this.props.user,
            album_name: data.value,
            id: this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        }
        fetch('/addPicToAlbum/', reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                //TODO handle response - success or failed to add to album
            })
    }

    componentDidMount() {
        //fixme only query this info if we open the modal, otherwise we'd be loading double time for every photo
        // to do this just make a separate info component and attach it to image pane like we did
        // for tags and people
        this.fetchInfo();
    }

    render() {
        return (
            <Card
                onMouseEnter={e => this.setState({ display: true })}
                onMouseLeave={e => this.setState({ display: false })}>
                <Image src={this.state.picture} alt="pic" />
                <Card.Content>
                    <a href={this.state.picture} download={this.state.name}>
                        {/*this.state.display &&*/ <Button type="submit"><Icon name='download' />Save</Button>}
                    </a>
                    <Button onClick={this.favorite}>
                        {!this.state.favorited && <Icon name='favorite' />}
                        {this.state.favorited && <Icon name='favorite' color='yellow' />}
                        Favorite
                    </Button>
                    <Dropdown
                        text='Add to Album'
                        icon='add' floating labeled button
                        className='icon'
                        options={this.getOptions()}
                        onChange={this.selectAlbum}>
                    </Dropdown>
                    <Modal
                        open={this.state.infoModal}
                        trigger={<Button onClick={this.toggleInfoModal}><Icon name='info' /></Button>}>
                        <Modal.Header><Image fluid src={this.state.picture} alt={this.state.name} /></Modal.Header>
                        <Modal.Content>
                            <h3>{this.state.name}</h3>
                            <Divider />
                            <ImageTags tags={this.state.info[5]} id={this.state.id}/>
                            <Divider />
                            <PeopleTags picture={this.state.picture} id={this.state.id}/>
                            <Divider />
                            <h2>Dimensions</h2>
                            {this.state.info[0]} x {this.state.info[1]}
                            <h2>Make</h2>
                            {this.state.info[2]}
                            <h2>Model</h2>
                            {this.state.info[3]}
                            <h2>Date Taken</h2>
                            {this.state.info[4]}
                            <Divider />
                            ID: {this.state.id}
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.toggleInfoModal}>Close</Button>
                        </Modal.Actions>
                    </Modal>
                </Card.Content>
            </Card>
        )
    }
}
export default ImagePane
