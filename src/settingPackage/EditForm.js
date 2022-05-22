import { React, useState, useContext } from "react"
import { Button, Segment, Input, Label, Divider, Dropdown } from 'semantic-ui-react'
import { UserContext } from "../UserContext";
import { showErrorNotification, showSuccessNotification  } from "../notificationUtils";

export default function EditForm({ name, updateName, updateColor, update, toggle, visible, tagName, tagColor, errorMsg }) {
    const { user } = useContext(UserContext)
    const [blank, setBlank] = useState(false);
    const [colorBlank, setColorBlank] = useState(false)
    const [error, setError] = useState(false);
    const [updateInfo, setUpdateInfo] = useState("")
    // applicable to tags
    const [newColor, setNewColor] = useState("")

    function handleUpdate(e, output) {
        console.log(e, output)
        if (output) {
            showSuccessNotification("Update Success.")
            if (name === 'Tag') {
                updateName(updateInfo);
                updateColor(newColor);
                setNewColor("");
            }
            else 
                update(e, updateInfo);
            setUpdateInfo("");
            toggle();
        }
        else {
            showErrorNotification("Unable to Update. Please try again.")
            setBlank(true);
            setError(true);
        }
    }

    function submitUpdate() {
        if (name === 'Tag' && ( updateInfo === "" || newColor === "")) {
            if (updateInfo === "") setBlank(true)
            if (newColor === "") setColorBlank(true);
            return;
        }
        if (visible && updateInfo === "") {
            setBlank(true);
            return;
        }
        const data = {
            username: user,
            new_name: updateInfo,
            
            // if tag
            new_color: newColor,
            old_name: tagName,
            old_color: tagColor
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`/update${name}/`, reqOptions).then(res => res.json())
            .then(output => {
                handleUpdate(name, output)
            }
            )

    }

    function updateInput(event) {
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
            setNewColor(data.value)
            setColorBlank(false);
        }
    }

    return (
        <div>
            <Segment>
                <h4>Edit {name}</h4>
                <Input type='text' id={'entered' + name} placeholder={name} onChange={updateInput} error={blank} />
                {error && <Label pointing='left' color='red'>{errorMsg}</Label>}
                {name === 'Tag' &&
                    <Dropdown placeholder='Color' search selection options={options} id='enteredColor' onChange={handleDrop} error={colorBlank} />
                }
                <Divider />
                <Button color='black' onClick={toggle}>Cancel</Button>
                <Button positive onClick={submitUpdate}>Confirm</Button>
            </Segment>
        </div>
    )
}