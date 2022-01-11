import React, { Component } from 'react'
import { Button, Icon, Card, Image, Modal, Divider, Dropdown, Confirm } from 'semantic-ui-react'

class ImagePane extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display : false,
            name: props.filename,
            picture: props.picture,
            favorited: props.favorited,
            id : props.id,
            infoModal: false,
            albums : props.albums,
        }
    }

    favorite = () => {
        const data = {
            username : this.props.user,
            id : this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }
        if (this.state.favorited) {
            this.setState({favorited : false})
            // delete where user and picture id
            const getUrl = '/removeFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
        else {
            this.setState({favorited : true})
            // post user and picture id
            const getUrl = '/addFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
    }

    toggleInfoModal = () => {this.setState({infoModal : !this.state.infoModal})}

    getOptions = () => {
        if (this.state.albums.length === 0) return [];
        else {
            const op = this.state.albums.map(album => {
                return {key: album, text: album, value: album}
            })
            return op
        }
    }

    selectAlbum = (e, data) => {
        console.log(data.value);
        const postData = {
            username : this.props.user,
            album_name : data.value,
            id : this.state.id
        }
        const reqOptions = {
            method : 'POST',
            headers : {Accept: 'application/json', 'Content-Type':'application/json'},
            body : JSON.stringify(postData)
        }
        fetch('/addPicToAlbum/', reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                //TODO handle response - success or failed to add to album
            })
    }

    // todo exif information
    // name
    // dimensions
    // taken on: 
    // etc.
    // etc....

    render() {
        // return (
        //     <div className='imgPane'
        //     onMouseEnter={e => this.setState({display: true})}
        //     onMouseLeave={e => this.setState({display: false})}>
        //     <img src={this.state.picture} alt="pic" />
        //     <a href={this.state.picture} download={this.state.name}>
        //     {this.state.display && <Button type="submit"><Icon name='download'/></Button>}
        //     </a>
        //     {this.state.display && <Button><Icon name='favorite'/></Button>}
        //     </div>
        // )
        return (
        <Card
            onMouseEnter={e => this.setState({display: true})}
            onMouseLeave={e => this.setState({display: false})}>
            <Image src={this.state.picture} alt="pic"/>    
            <Card.Content>
                <a href={this.state.picture} download={this.state.name}>
                    {/*this.state.display &&*/ <Button type="submit"><Icon name='download' />Save</Button>}
                </a>
                <Button onClick={this.favorite}>
                    {!this.state.favorited && <Icon name='favorite' />}
                    {this.state.favorited && <Icon name='favorite' color='yellow' />}
                    Favorite
                    </Button>
                {/* <Button>
                    <Icon name='add'/>Add to Album
                    
                </Button> */}
                <Dropdown
                    text='Add to Album'
                    icon='add'
                    floating
                    labeled
                    button
                    className='icon'
                    options={this.getOptions()}
                    onChange={this.selectAlbum}>
                </Dropdown>
                <Modal
                    open={this.state.infoModal}
                    trigger={<Button onClick={this.toggleInfoModal}><Icon name='info' /></Button>}>
                    <Modal.Header><Image fluid src={this.state.picture} alt={this.state.name} /></Modal.Header>
                    <Modal.Content>
                        {this.state.name}
                        <Divider />
                        {this.state.id}
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
