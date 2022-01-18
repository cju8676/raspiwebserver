import React, { Component } from 'react'
import { Button, Dropdown, Input, Label, Segment, Form, Container } from 'semantic-ui-react'
import Cropper from 'react-easy-crop'

class PeopleTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            people: props.people,
            peopleModal: false,
            // // name : imageURL
            // people: {},
            file: null,
            cropper : false
        }

        this.newPerson = {
            name: "",
            color: "",
            pic: ""
        }

        this.options = [
            { label: { color: 'red' }, text: 'Red', value: 'red' },
            { label: { color: 'orange' }, text: 'Orange', value: 'orange' },
            { label: { color: 'yellow' }, text: 'Yellow', value: 'yellow' },
            { label: { color: 'olive' }, text: 'Olive', value: 'olive' },
            { label: { color: 'green' }, text: 'Green', value: 'green' },
            { label: { color: 'teal' }, text: 'Teal', value: 'teal' },
            { label: { color: 'blue' }, text: 'Blue', value: 'blue' },
            { label: { color: 'violet' }, text: 'Violet', value: 'violet' },
            { label: { color: 'purple' }, text: 'Purple', value: 'purple' },
            { label: { color: 'pink' }, text: 'Pink', value: 'pink' },
            { label: { color: 'brown' }, text: 'Brown', value: 'brown' },
            { label: { color: 'grey' }, text: 'Grey', value: 'grey' },
            { label: { color: 'black' }, text: 'Black', value: 'black' },
        ]

        this.crop = {x : 0, y: 0}
        this.zoom = 1

        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    togglePeople = () => {
        this.setState({ peopleModal: !this.state.peopleModal })
        this.setState({ cropper : false})
    }

    handleUploadImage = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", this.uploadInput.files[0]);
        // data.append('filename', this.fileName.value);
        fetch('/upload', {
            method: 'POST',
            body: data
        }).then((response) => {
            response.blob().then((imageBlob) => {
                console.log(imageBlob)
                this.setState({ imageURL: URL.createObjectURL(imageBlob) });
            });
          });
          
        this.setState({ cropper : true });
    }

    setCrop = (x, y) => {
        this.crop.x = x;
        this.crop.y = y;
    }

    setZoom = (x) => {
        this.zoom = x;
    }

    onCropComplete = (area, pixels) => {
        console.log(area, pixels)
    }

    render() {
        const people = {
            "Juice": "blue",
        }
        return (
            <div>
                <h2>People</h2>
                <Label.Group>
                    <Label picture color='blue'>
                        Juice
                        {/*FIXME MAKE SURE IMAGE IS SQUARE WHEN CREATING PERSON*/}
                        <img src={this.props.picture} alt='Profile pic' />
                    </Label>
                    <Label>
                        <Dropdown icon='add'>
                            <Dropdown.Menu>
                                {Object.keys(people).map((key, idx) => {
                                    return (<Dropdown.Item text={key} label={{ color: people[key] }} />)
                                })}
                                <Dropdown.Item text='Create New Person' onClick={this.togglePeople} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Label>
                    {this.state.peopleModal && (
                        <Segment>
                            <h4>Create New Person</h4>
                            <Input placeholder='Name' />
                            <Dropdown placeholder='Tag Color' search selection options={this.options} />
                            {/* <Button method='post' action="/upload" enctype="multipart/form-data">Upload Profile Pic</Button> */}
                            <Button color='black' onClick={this.togglePeople}>Cancel</Button>
                            <Button positive >Submit</Button>
                            {/* <form onSubmit={this.handleUploadImage}>
                                <div>
                                    <Button>
                                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                                    </Button>
                                </div>
                                <div>
                                    <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
                                </div>
                                <br />
                                <div>
                                    <button>Upload</button>
                                </div>
                                <img src={this.state.imageURL} alt="img" />
                            </form> */}
                            <Form onSubmit={this.handleUploadImage}>
                                <Container>
                                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                                    {/* <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" /> */}
                                    <Button positive>Submit</Button>
                                    {this.state.cropper && 
                                        <Cropper 
                                            image={this.state.imageURL}
                                            crop={this.crop}
                                            zoom={this.zoom}
                                            aspect={4 / 4}
                                            onCropChange={this.setCrop}
                                            onCropComplete={this.onCropComplete}
                                            onZoomChange={this.setZoom}/>}
                                </Container>
                            </Form>


                        </Segment>)}
                </Label.Group>
            </div>
        )
    }
}
export default PeopleTags;