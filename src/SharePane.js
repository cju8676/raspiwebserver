import { React, useState, useEffect, useContext } from 'react'
import { Label, Segment, Dropdown, Divider, Button } from 'semantic-ui-react'
import { UserContext } from './UserContext';

export default function SharePane({ albName, closeModal }) {
    const { user, showSuccessNotification, showErrorNotification } = useContext(UserContext)
    const [availShareUsers, setAvailShareUsers] = useState([])
    const [sharedWith, setSharedWith] = useState([])

    useEffect(() => {
        //if it our first time opening shareModal then fetch availShareUsers
        //todo this will happen every time because closing the modal re renders this comp
        if (availShareUsers.length === 0) {
            getAvailShareUsers();
            getSharedWith();
        }
    }, [])

    // TODO track which person is owner
    // if signed in user is owner of this album, they can delete a person off of album

    // share this album to user
    async function addUser(user) {
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        await fetch('/shareAlbum/' + albName + '/' + user, reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ? 
                    showSuccessNotification(`${albName} shared with ${user}`) : 
                    showErrorNotification(`Unable to share ${albName} with ${user}. Please try again.`))
        setSharedWith([...sharedWith, availShareUsers.find(i => i.includes(user))])
        setAvailShareUsers(availShareUsers.filter(item => item[0] !== user))
    }

    //TODO track which person is with owner and make only them have privileges to delete
    // any other person just tell them who the owner is

    // fetch a list of users who are not yet able to view this album
    async function getAvailShareUsers() {
        await fetch('/getAvailShareUsers/' + albName)
            .then(res => res.json())
            .then(JSONresponse => setAvailShareUsers(JSONresponse))
    }

    // excluding the user logged in, get list of users that are shared on this album
    async function getSharedWith() {
        await fetch('/getSharedWith/' + albName + '/' + user)
            .then(res => res.json())
            .then(JSONresponse => setSharedWith(JSONresponse))
    }

    return (
        <>
            <Segment>
                <div className='shared-with'>
                    <h4 style={{ padding: "10px 10px 10px 10px" }}>Shared With:</h4>
                    <Label.Group style={{ padding: "10px 10px 10px 0px" }}>
                        {sharedWith && sharedWith.map(user => <Label>{`${user[1]} (${user[0]})`}</Label>)}
                    </Label.Group>
                </div>
                <Dropdown
                    text='Add User'
                    icon='add' selection labeled
                    options={availShareUsers}
                >
                    <Dropdown.Menu>
                        {availShareUsers.map(item => {
                            return <Dropdown.Item key={item[0]} text={`${item[1]} (${item[0]})`} onClick={() => addUser(item[0])} />
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <Divider />
                <Button color='red' onClick={closeModal} content='Cancel' />
            </Segment>
            <Divider />
        </>
    )
}