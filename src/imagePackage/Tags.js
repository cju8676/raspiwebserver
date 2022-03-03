import React, { useState, useEffect } from 'react'
import { Label, Icon, Dropdown, Segment, Input, Button } from 'semantic-ui-react';

export default function Tags(props) {
    const { id } = props;

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

    const [tags, setTags] = useState([]);
    const [availTags, setAvailTags] = useState([]);
    const [tagModal, setTagModal] = useState(false);
    const [nameBlank, setNameBlank] = useState(false);
    const [colorBlank, setColorBlank] = useState(false);
    const [newTag, setNewTag] = useState({ name: "", color: "" })

    useEffect(() => {
        fetch('/getTags/' + id).then(response => response.json())
            .then(jsonOutput => {
                if (jsonOutput.length !== 0) {
                    setTags(jsonOutput)
                }
                else setTags([]);
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch('/getAvailTags/' + id).then(response => response.json())
            .then(jsonOutput => {
                setAvailTags(jsonOutput)
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    function addTag(name, color) {
        // changed in db, this should never hit bc should never show up in avail tags
        // if (JSON.stringify(this.state.myTags) != -1)
        //     return false;
        const data = {
            name: name,
            color: color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/addTag/' + id, reqOptions)
            .then(response => response.json())
            .then(() => {
                // confirm tag has been created
                setTags([...tags, [name, color]])
                //else setTags([name, color])
                setAvailTags(availTags.filter(prev => !(prev[0] === name && prev[1] === color)));
            })
    }

    function delTag(tag) {
        const data = {
            name: tag[0],
            color: tag[1]
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/delTag/' + id, reqOptions)
            .then(response => response.json())
            .then(() => {
                setTags(tags.filter(prevTag => prevTag !== tag))
                setAvailTags([...availTags, tag])
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
            color: newTag.color
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch('/createTag/', reqOptions)
            .then(response => response.json())
            .then(() => {
                // confirm tag has been created
                setTagModal(false);
                setAvailTags([...availTags, [newTag.name, newTag.color]])
                setNewTag({ name: "", color: "" })
                setNameBlank(false)
                setColorBlank(false)
            })
    }

    // useEffect(() => {
    //     console.log("rendered again");
    //     console.log(tags)
    // }, [tags])

    return (
        <div>
            <h2>Tags</h2>
            <Label.Group>
                {tags && tags.map(tag => {
                    return (
                        <Label color={tag[1]} >
                            {tag[0]}
                            <Icon name='delete' onClick={e => delTag(tag)} />
                        </Label>)
                })}
                <Label>
                    <Dropdown icon='add'>
                        <Dropdown.Menu>
                            {availTags && availTags.map(tag => {
                                return (<Dropdown.Item text={tag[0]} label={{ color: tag[1] }} onClick={selectTag} />)
                            })}
                            <Dropdown.Item text='New Tag' onClick={() => setTagModal(true)} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Label>
                {tagModal && (
                    <Segment>
                        <h4>Create Tag</h4>
                        <Input type='text' id='enteredName' placeholder='Name' onChange={update} error={nameBlank} />
                        <Dropdown placeholder='Color' search selection options={options} id='enteredColor' onChange={handleDrop} error={colorBlank} />
                        <Button color='black' onClick={() => setTagModal(false)}>Cancel</Button>
                        <Button positive onClick={createTag}>Submit</Button>
                    </Segment>)}
            </Label.Group>
        </div>
    )
}