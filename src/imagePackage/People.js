import React, { useState, useEffect, useContext } from 'react'
import { Label, Icon, Dropdown, Segment, Input, Button } from 'semantic-ui-react'
import { UserContext } from '../UserContext';

export default function People({ id, bulk }) {
    const { user } = useContext(UserContext)

    const options = [
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

    const [people, setPeople] = useState([]);
    const [availPeople, setAvailPeople] = useState([]);
    const [tagModal, setTagModal] = useState(false);
    const [nameBlank, setNameBlank] = useState(false);
    const [colorBlank, setColorBlank] = useState(false);
    const [newTag, setNewTag] = useState({ name: "", color: "" });

    useEffect(() => {
        fetch('/getPeople/' + id).then(response => response.json())
            .then(jsonOutput => {
                if (jsonOutput.length !== 0)
                    setPeople(jsonOutput)
                else setPeople([])
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch('/getAvailPeople/' + id).then(response => response.json())
            .then(jsonOutput => {
                setAvailPeople(jsonOutput)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function delTag(per) {
        const data = {
            name: per[0],
            color: per[1],
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/delPerson/' + id, reqOptions)
            .then(response => response.json())
            .then(() => {
                setPeople(people.filter(prevTag => prevTag !== per))
                setAvailPeople([...availPeople, per])
            })
    }

    function addTag(name, color) {
        // changed in db, this should never hit bc should never show up in avail tags
        // if (JSON.stringify(this.state.myTags) != -1)
        //     return false;
        const data = {
            name: name,
            color: color,
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/addPerson/' + id, reqOptions)
            .then(response => response.json())
            .then(() => {
                // confirm tag has been created
                setPeople([...people, [name, color]])
                //else setTags([name, color])
                setAvailPeople(availPeople.filter(prev => !(prev[0] === name && prev[1] === color)));
            })
    }

    function selectTag(e, data) {
        addTag(data.text, data.label.color)
    }

    function update(event) {
        if (event.target.id === 'enteredName') {
            setNewTag({ name: event.target.value, color: newTag.color });
            setNameBlank(false);
        }
    }

    function handleDrop(e, data) {
        if (data.id === 'enteredColor') {
            setNewTag({ name: newTag.name, color: data.value })
            setColorBlank(false);
        }
    }

    function createTag() {
        if (newTag.name === "" || newTag.color === "") {
            if (newTag.name === "") setNameBlank(true);
            if (newTag.color === "") setColorBlank(true);
            return;
        }
        const data = {
            name: newTag.name,
            color: newTag.color,
            owner: user
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/createPerson/', reqOptions)
            .then(response => response.json())
            .then(() => {
                // confirm tag has been created
                setTagModal(false);
                setAvailPeople([...availPeople, [newTag.name, newTag.color]])
                setNewTag({ name: "", color: "" })
                setNameBlank(false)
                setColorBlank(false)
            })
    }

    return (
        <div>
            <h2>People {bulk && " for each file"}</h2>
            <Label.Group>
                {people && people.map(per => {
                    return (
                        <Label color={per[1]} key={per[0]}>
                            {per[0]}
                            <Icon name='delete' onClick={e => delTag(per)} />
                        </Label>)
                })}
                <Label>
                    <Dropdown icon='add'>
                        <Dropdown.Menu>
                            {availPeople && availPeople.map(person => {
                                return (<Dropdown.Item key={person[0]} text={person[0]} label={{ color: person[1] }} onClick={selectTag} />)
                            })}
                            <Dropdown.Item text='Create New Person' onClick={() => setTagModal(true)} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Label>
                {tagModal && (
                    <Segment>
                        <h4>Create Person</h4>
                        <Input type='text' id='enteredName' placeholder='Name' onChange={update} error={nameBlank} />
                        <Dropdown placeholder='Color' search selection options={options} id='enteredColor' onChange={handleDrop} error={colorBlank} />
                        <Button color='black' onClick={() => setTagModal(false)}>Cancel</Button>
                        <Button positive onClick={createTag}>Submit</Button>
                    </Segment>)}
            </Label.Group>
        </div>
    )
}