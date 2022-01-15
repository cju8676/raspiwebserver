import React, { Component } from 'react'
import { Button, Dropdown, Input, Label, Segment } from 'semantic-ui-react'

class PeopleTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            people: props.people,
            peopleModal: false
            // // name : imageURL
            // people: {},
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
    }

    togglePeople = () => {
        this.setState({ peopleModal: !this.state.peopleModal })
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
                            <Button>Upload Profile Pic</Button>
                            <Button color='black' onClick={this.togglePeople}>Cancel</Button>
                            <Button positive/*onClick={this.submitForm}*/>Submit</Button>
                        </Segment>)}
                </Label.Group>
            </div>
        )
    }
}
export default PeopleTags;