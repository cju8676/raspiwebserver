import React, { Component } from 'react'
import { Button, Icon, Dropdown, Input, Label, Segment } from 'semantic-ui-react'

class ImageTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            tags: [],
            myTags: [],
            myTagsComps: [],
            tagModal: false,
            nameBlank: false,
            colorBlank: false
        }

        this.newTag = {
            name: "",
            color: ""
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
    }

    myTags = () => {
        fetch('/getTags/' + this.state.id).then(response => response.json())
            .then(jsonOutput => {
                if (jsonOutput.length !== 0) {
                    this.setState({ myTags: jsonOutput })
                    // this.setState({ myTagsComps: [] })
                    // for(var i = 0 ; i < jsonOutput.length ; i++) {
                    //     this.setState(prevState => ({
                    //         myTagsComps:
                    //         [...prevState.myTagsComps, 
                    //         <Label color={jsonOutput[i][1]}>
                    //             {jsonOutput[i][0]}
                    //             <Icon name='delete' 
                    //             onClick={() => this.handleDelete(jsonOutput[i])}
                    //             />
                    //         </Label>
                    //         ]
                    //     }))
                    // }
                }
            })
        }

    availTags = () => {
        fetch('/getAvailTags/' + this.state.id).then(response => response.json())
            .then(jsonOutput => {
                console.log(jsonOutput)
                this.setState({ tags: jsonOutput })
            })
    }

    updateTagsDropdown = () => {
        this.toggleTag();
        this.setState(prevState => ({
            tags:
                [...prevState.tags, [this.newTag.name, this.newTag.color]]
        }));
        this.newTag.name = "";
        this.newTag.color = "";
        this.setState({
            nameBlank: false,
            colorBlank : false
        })
        this.componentDidMount();
    }

    toggleTag = () => {
        this.newTag = {name : "", color : ""}
        this.setState({
             tagModal: !this.state.tagModal,
             nameBlank: false,
             colorBlank : false
            })
    }

    createTag = () => {
        if (this.newTag.name === "" || this.newTag.color === "") {
            if (this.newTag.name === "") this.setState({nameBlank : true})
            if (this.newTag.color === "") this.setState({colorBlank : true})
            return;
        }
        const data = {
            name: this.newTag.name,
            color: this.newTag.color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/createTag/', reqOptions)
            .then(response => response.json())
            .then(
                // confirm tag has been created
                this.updateTagsDropdown()
            )
    }

    update = (event) => {
        if (event.target.id === 'enteredName') {
            this.newTag.name = event.target.value;
            this.setState({nameBlank : false})
        }
    }

    handleDrop = (e, data) => {
        if (data.id === 'enteredColor') {
            this.newTag.color = data.value;
            this.setState({colorBlank : false})
        }
    }

    addTag = () => {
        // changed in db, this should never hit bc should never show up in avail tags
        // if (JSON.stringify(this.state.myTags) != -1)
        //     return false;
        const data = {
            name: this.newTag.name,
            color: this.newTag.color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/addTag/' + this.state.id, reqOptions)
            .then(response => response.json())
            .then(
                // confirm tag has been created
                this.updateTagsList()
            )
    }

    selectTag = (e, data) => {
        this.newTag.name = data.text;
        this.newTag.color = data.label.color;
        this.addTag();
    }

    updateTagsList = () => {
        console.log(this.newTag.name, this.newTag.color);
        this.setState(prevState => ({
            myTags:
                [...prevState.myTags, [this.newTag.name, this.newTag.color]]
        }));
        this.newTag.name = "";
        this.newTag.color = "";
        this.componentDidMount();
    }

    handleDelete = (tag) => {
        const data = {
            name: tag[0],
            color: tag[1]
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/delTag/' + this.state.id, reqOptions)
            .then(response => response.json())
            .then(
                // confirm tag has been created
                this.updateTagsList()
                //this.componentDidMount
            )
    }

    componentDidMount() {
        this.availTags();
        this.myTags();
    }

    render() {
        return (
            <div>
                <h2>Tags</h2>
                <Label.Group>
                    {this.state.myTags.map(tag => {
                        return (
                            <Label color={tag[1]} >
                                {tag[0]}
                                <Icon name='delete' onClick={e => this.handleDelete(tag)}/>
                            </Label>)
                    })}
                    {/* {this.state.myTagsComps} */}
                    <Label>
                        <Dropdown icon='add'>
                            <Dropdown.Menu>
                                {this.state.tags.map(tag => {
                                    return (<Dropdown.Item text={tag[0]} label={{ color: tag[1] }} onClick={this.selectTag} />)
                                })}
                                <Dropdown.Item text='New Tag' onClick={this.toggleTag} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Label>
                    {this.state.tagModal && (
                        <Segment>
                            <h4>Create Tag</h4>
                            <Input type='text' id='enteredName' placeholder='Name' onChange={this.update} error={this.state.nameBlank}/>
                            <Dropdown placeholder='Color' search selection options={this.options} id='enteredColor' onChange={this.handleDrop} error={this.state.colorBlank}/>
                            <Button color='black' onClick={this.toggleTag}>Cancel</Button>
                            <Button positive onClick={this.createTag}>Submit</Button>
                        </Segment>)}
                </Label.Group>
            </div>
        )
    }
}
export default ImageTags;