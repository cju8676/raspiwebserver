import { getDefaultNormalizer } from '@testing-library/react';
import React, { Component } from 'react'
import { Button, Icon, Card, Image, Modal, Divider, Dropdown, Input, Label, Segment } from 'semantic-ui-react'

class ImageTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : props.id,
            tags : props.tags,
            myTags : [],
            tagModal : false
        }

        this.newTag = {
            name : "",
            color : ""
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
                if (jsonOutput.length !== 0)
                    this.setState({ myTags: jsonOutput})
            })
    }

    updateTagsDropdown = () => {
        this.toggleTag();
        this.setState(prevState => ({
            tags:
                [...prevState.tags, [this.newTag.name, this.newTag.color]]
        }));
        //this.getTags();
        this.newTag.name = "";
        this.newTag.color = "";
        this.componentDidMount();
    }

    toggleTag = () => {
        this.setState({ tagModal: !this.state.tagModal })
    }

    createTag = () => {
        const data = {
            name : this.newTag.name,
            color : this.newTag.color
        }
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
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
        }
    }

    handleDrop = (e, data) => {
        if (data.id === 'enteredColor') {
            this.newTag.color = data.value;
        }
    }

    addTag = () => {
        const data = {
            name : this.newTag.name,
            color : this.newTag.color
        }
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
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
        console.log("deleting : " + tag);
    }

    componentDidMount() {
        this.myTags();
    }

    render () {
        return (
            <div>
                <h2>Tags</h2>
                <Label.Group>
                {this.state.myTags.map(tag => {
                    return (
                        <Label color={tag[1]} onMouseEnter={() => {}}>
                            {tag[0]}
                            <Icon name='delete'/>
                        </Label>)
                })}
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
                        <Input type='text' id='enteredName' placeholder='Name' onChange={this.update}/>
                        <Dropdown placeholder='Color' search selection options={this.options} id='enteredColor' onChange={this.handleDrop}/>
                        <Button color='black' onClick={this.toggleTag}>Cancel</Button>
                        <Button positive onClick={this.createTag}>Submit</Button>
                    </Segment>)}
            </Label.Group>
            </div>
        )
    }
}
export default ImageTags;