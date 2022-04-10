import React, { Component } from 'react'
import { Header, Button, Card, Divider, Confirm, Segment, Icon, Dropdown, Label } from 'semantic-ui-react'
import ImagePane from './imagePackage/ImagePane';
import { UserContext } from './UserContext';
//import {withRouter} from 'react-router-dom'

class AlbumPage extends Component {
    static contextType = UserContext
    constructor(props) {
        super(props);
        this.state = {
            albName: props.match.params.album,
            link_name_id_info: [],
            // is confirm dialog open
            confirmDelete: false,
            // is share Modal visible
            shareModal: false,
            availShareUsers: [],
            sharedWith: [],
        }
    }

    deleteAlbum = () => {
        this.setState({ confirmDelete: false })
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/delAlbum/' + this.context.user + '/' + this.props.match.params.album, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? this.props.history.push('/home') : console.log("not del"))

    }

    fetchAlbumPhotos = async () => {
        var id_path = {};
        await fetch('/getAlbumPhotos/' + this.context.user + '/' + this.props.match.params.album).then(response => response.json())
            .then(JSONresponse => {
                var files = JSON.parse(JSONresponse)
                for (let i = 0; i < files.length; i++) {
                    var path = (files[i].path).replace('/', '%2F');
                    id_path[files[i].id] = path

                    fetch('/files/' + files[i].id)
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            const isVideo = imageBlob.type === 'video/mp4' ? true : false
                            this.setState(prevState => ({
                                ...prevState,
                                link_name_id_info:
                                    [...prevState.link_name_id_info,
                                    {
                                        link: imageURL,
                                        name: files[i].name,
                                        id: files[i].id,
                                        info: id_path[files[i].id],
                                        date: files[i].date,
                                        video: isVideo
                                    }]
                            }));
                        })
                }
            })
    }

    // TODO track which person is owner
    // if signed in user is owner of this album, they can delete a person off of album

    // share this album to user
    addUser = (user) => {
        console.log(user)
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        fetch('/shareAlbum/' + this.state.albName + '/' + user, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? console.log("ADDED") : console.log("not ADDED"))
        this.setState(prevState => ({
            ...prevState,
            availShareUsers: [...prevState.availShareUsers.filter(item => item[0] !== user)],
            sharedWith: [...prevState.sharedWith, ...prevState.availShareUsers.find(i => i.includes(user))]
        }))
    }

    //TODO track which person is with owner and make only them have privileges to delete
    // any other person just tell them who the owner is


    // fetch a list of users who are not yet able to view this album
    async getAvailShareUsers() {
        await fetch('/getAvailShareUsers/' + this.state.albName)
            .then(res => res.json())
            .then(JSONresponse => {
                this.setState({ availShareUsers: JSONresponse })
            })
    }

    // excluding the user logged in, get list of users that are shared on this album
    async getSharedWith() {
        console.log("enter ")
        await fetch('/getSharedWith/' + this.state.albName + '/' + this.context.user)
            .then(res => res.json())
            .then(JSONresponse => {
                this.setState({ sharedWith: JSONresponse })
            })
    }

    componentDidMount() {
        this.fetchAlbumPhotos();
    }

    componentDidUpdate() {
        //if it our first time opening shareModal then fetch availShareUsers
        if (this.state.shareModal && this.state.availShareUsers.length === 0) {
            this.getAvailShareUsers();
            this.getSharedWith();
        }
    }


    // TODO if not owner then disable delete functionality
    render() {
        return (
            <div>
                <Segment>
                    <Header>
                        <Button color='orange' size='large' href='#home'>Back</Button>
                        {this.state.albName}
                        <Button color='red' size='large' floated='right' onClick={() => this.setState({ confirmDelete: !this.state.confirmDelete })}>Delete</Button>
                        <Button color='blue' size='large' floated='right' onClick={() => this.setState({ shareModal: !this.state.shareModal })}><Icon name='share' />Share</Button>
                        <Confirm
                            open={this.state.confirmDelete}
                            onCancel={() => this.setState({ confirmDelete: false })}
                            onConfirm={this.deleteAlbum}
                        />
                    </Header>
                    <Divider />
                    {this.state.shareModal &&
                        <>
                            <Segment>
                                <div className='shared-with'>
                                    <h4 style={{padding: "10px 10px 10px 10px"}}>Shared With:</h4>
                                    <Label.Group style={{padding: "10px 10px 10px 0px"}}>
                                        {/* <Label color='red'>
                                            {"testing"}
                                            <Icon name='delete' onClick={e => console.log(e)} />
                                        </Label>
                                        <Label color='red'>
                                            {"tester"}
                                            <Icon name='delete' onClick={e => console.log(e)} />
                                        </Label> */}
                                        {this.state.sharedWith && this.state.sharedWith.map(user => <Label>{`${user[1]} (${user[0]})`}</Label>)}
                                    </Label.Group>
                                </div>
                                <Dropdown
                                    text='Add User'
                                    icon='add' selection labeled
                                    options={this.state.availShareUsers}
                                >
                                    <Dropdown.Menu>
                                        {this.state.availShareUsers.map(item => {
                                            return <Dropdown.Item key={item[0]} text={`${item[1]} (${item[0]})`} onClick={() => this.addUser(item[0])} />
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Divider />
                                <Button color='red' onClick={() => this.setState({ shareModal: false })} content='Cancel' />
                            </Segment>
                            <Divider />
                        </>
                    }
                    <Segment>
                        <div>
                            <Card.Group itemsPerRow={4}>
                                {this.state.link_name_id_info.map(picture => {
                                    return <ImagePane
                                        picture={picture.link}
                                        filename={picture.name}
                                        id={picture.id}
                                        key={picture.id}
                                        albums={[]}
                                        path={picture.info}
                                        inAlbum={this.props.match.params.album}
                                        refresh={this.props.onChange}
                                        date={picture.date}
                                        isVideo={picture.video}
                                    />
                                })}
                            </Card.Group>
                        </div>
                    </Segment>
                </Segment>
            </div>
        )
    }
}

export default AlbumPage;