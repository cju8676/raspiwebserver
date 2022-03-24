import { React, useState, useContext } from "react"
import { Button, Segment, Input, Label, Divider, Dropdown } from 'semantic-ui-react'
import { UserContext } from "../UserContext";

export default function EditForm(props) {
    const { user } = useContext(UserContext)
    const [blank, setBlank] = useState(false);
    const [colorBlank, setColorBlank] = useState(false)
    const [error, setError] = useState(false);
    const [updateInfo, setUpdateInfo] = useState("")
    // applicable to tags
    const [updateColor, setUpdateColor] = useState("")

    function handleUpdate(e, output) {
        console.log(e, output)
        if (output) {
            if (props.name === 'Tag') {
                props.updateName(updateInfo);
                props.updateColor(updateColor);
                setUpdateColor("");
            }
            else 
                props.update(e, updateInfo);
            setUpdateInfo("");
            props.toggle();
        }
        else {
            setBlank(true);
            setError(true);
        }
    }

    function submitUpdate() {
        if (props.name === 'Tag' && ( updateInfo === "" || updateColor === "")) {
            if (updateInfo === "") setBlank(true)
            if (updateColor === "") setColorBlank(true);
            return;
        }
        if (props.visible && updateInfo === "") {
            setBlank(true);
            return;
        }
        const data = {
            username: user,
            new_name: updateInfo,
            
            // if tag
            new_color: updateColor,
            old_name: props.tagName,
            old_color: props.tagColor
        }
        console.log(data)
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`/update${props.name}/`, reqOptions).then(res => res.json())
            .then(output => {
                //todo handle success pop up
                handleUpdate(props.name, output)
            }
            )

    }

    function update(event) {
        setUpdateInfo(event.target.value);
        if (event.target.value !== "") {
            setBlank(false);
            setError(false);
        }
    }

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

    function handleDrop(e, data) {
        if (data.id === 'enteredColor') {
            setUpdateColor(data.value)
            setColorBlank(false);
        }
    }

    return (
        <div>
            <Segment>
                <h4>Edit {props.name}</h4>
                <Input type='text' id={'entered' + props.name} placeholder={props.name} onChange={update} error={blank} />
                {error && <Label pointing='left' color='red'>{props.errorMsg}</Label>}
                {props.name === 'Tag' &&
                    <Dropdown placeholder='Color' search selection options={options} id='enteredColor' onChange={handleDrop} error={colorBlank} />
                }
                <Divider />
                <Button color='black' onClick={props.toggle}>Cancel</Button>
                <Button positive onClick={submitUpdate}>Confirm</Button>
            </Segment>
        </div>
    )
}