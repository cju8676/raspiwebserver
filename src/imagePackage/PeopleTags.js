import React, { Component } from 'react'
import { Button, Dropdown, Input, Label, Segment, Icon } from 'semantic-ui-react'
//import Cropper from 'react-easy-crop'

class PeopleTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            people: [],
            peopleModal: false,
            // // name : imageURL
            // people: {},
            file: null,
            cropper : false,
            myPeople : [],
            nameBlank : false,
            colorBlank : false
        }

        this.newPerson = {
            name: "",
            color: "",
            //pic: ""
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

    createPerson = () => {
        if (this.newPerson.name === "" || this.newPerson.color === "") {
            if (this.newPerson.name === "") this.setState({nameBlank : true})
            if (this.newPerson.color === "") this.setState({colorBlank : true})
            return;
        }
        const data = {
            name: this.newPerson.name,
            color: this.newPerson.color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/createPerson/', reqOptions)
            .then(response => response.json())
            .then(
                // confirm person has been created
                this.updatePeopleDropdown()
            )
    }

    updatePeopleDropdown = () => {
        this.togglePeople();
        this.setState(prevState => ({
            people:
                [...prevState.people, [this.newPerson.name, this.newPerson.color]]
        }));
        this.newPerson.name = "";
        this.newPerson.color = "";
        this.componentDidMount();
    }

    togglePeople = () => {
        this.newPerson = {name : "", color : ""}
        this.setState({ 
            peopleModal: !this.state.peopleModal,
            nameBlank : false,
            colorBlank : false
        })
    }

    myPeople = () => {
        fetch('/getPeople/' + this.state.id).then(response => response.json())
            .then(jsonOutput => {
                if (jsonOutput.length !== 0) {
                    this.setState({ myPeople: jsonOutput })
                }
            })
        }

    availPeople = () => {
        fetch('/getAvailPeople/' + this.state.id).then(response => response.json())
            .then(jsonOutput => {
                this.setState({ people: jsonOutput })
            })
    }

    handleDelete = (person) => {
        const data = {
            name: person[0],
            color: person[1]
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/delPerson/' + this.state.id, reqOptions)
            .then(response => response.json())
            .then(
                // confirm tag has been created
                this.updatePeopleList()
                //this.componentDidMount
            )
    }

    addPerson = () => {
        const data = {
            name: this.newPerson.name,
            color: this.newPerson.color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/addPerson/' + this.state.id, reqOptions)
            .then(response => response.json())
            .then(
                // confirm tag has been created
                this.updatePeopleList()
            )
    }

    updatePeopleList = () => {
        this.setState(prevState => ({
            myPeople:
                [...prevState.myPeople, [this.newPerson.name, this.newPerson.color]]
        }));
        this.newPerson.name = "";
        this.newPerson.color = "";
        this.componentDidMount();
    }

    selectPerson = (e, data) => {
        this.newPerson.name = data.text;
        this.newPerson.color = data.label.color;
        this.addPerson();
    }

    update = (event) => {
        if (event.target.id === 'enteredName') {
            this.newPerson.name = event.target.value;
            this.setState({nameBlank: false})
        }
    }

    handleDrop = (e, data) => {
        if (data.id === 'enteredColor') {
            this.newPerson.color = data.value;
            this.setState({colorBlank: false})
        }
    }

    componentDidMount() {
        this.availPeople();
        this.myPeople();
    }

    render() {
        return (
            <div>
                <h2>People</h2>
                <Label.Group>
                    {this.state.myPeople.map(person => {
                        return (
                            <Label color={person[1]}>
                                {person[0]}
                                <Icon name='delete' onClick={e => this.handleDelete(person)} />
                            </Label>
                        )
                    })}
                    {/* <Label picture color='blue'>
                        Juice */}
                        {/*FIXME MAKE SURE IMAGE IS SQUARE WHEN CREATING PERSON*/}
                        {/* <img src={this.props.picture} alt='Profile pic' /> */}
                    {/* </Label> */}
                    <Label>
                        <Dropdown icon='add'>
                            <Dropdown.Menu>
                                {/* {Object.keys(people).map((key, idx) => {
                                    return (<Dropdown.Item text={key} label={{ color: people[key] }} />)
                                })} */}
                                {this.state.people.map(person => {
                                    return (<Dropdown.Item text={person[0]} label={{color : person[1] }} onClick={this.selectPerson} />)
                                })}
                                <Dropdown.Item text='Create New Person' onClick={this.togglePeople} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Label>
                    {this.state.peopleModal && (
                        <Segment>
                            <h4>Create New Person</h4>
                            <Input placeholder='Name' id='enteredName' onChange={this.update} error={this.state.nameBlank}/>
                            <Dropdown placeholder='Color' search selection options={this.options} id='enteredColor' onChange={this.handleDrop} error={this.state.colorBlank}/>
                            {/* <Button method='post' action="/upload" enctype="multipart/form-data">Upload Profile Pic</Button> */}
                            <Button color='black' onClick={this.togglePeople}>Cancel</Button>
                            <Button positive onClick={this.createPerson}>Submit</Button>
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
                            {/* <Form onSubmit={this.handleUploadImage}>
                                <Container>
                                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" /> */}
                                    {/* <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" /> */}
                                    {/* <Button positive>Submit</Button>
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
                            </Form> */}


                        </Segment>)}
                </Label.Group>
            </div>
        )
    }
}
export default PeopleTags;