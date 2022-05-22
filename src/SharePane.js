import { React } from 'react'
import { Label, Segment, Dropdown, Divider, Button, Icon } from 'semantic-ui-react'
import { showSuccessNotification, showErrorNotification } from './notificationUtils'

export default function SharePane({ albName, closeModal, availShareUsers, setAvailShareUsers, sharedWith, setSharedWith, owner }) {

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

    async function deleteUser(user) {
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
        await fetch('/delUserFromAlbum/' + albName + '/' + user[0], reqOptions)
            .then(response => response.json())
            .then(JSONresponse =>
                JSONresponse ?
                    showSuccessNotification(`${user[1]} removed from ${albName}`) :
                    showErrorNotification(`Unable to remove ${user[1]} with ${albName}. Please try again.`))
        setSharedWith(sharedWith.filter(i => i !== user))
        setAvailShareUsers([...availShareUsers, user])
    }

    return (
        <>
            <Segment>
                <div className='shared-with'>
                    <h4 style={{ padding: "10px 10px 10px 10px" }}>Shared With:</h4>
                    <Label.Group style={{ padding: "10px 10px 10px 0px" }}>
                        {sharedWith && sharedWith.map(user => 
                            <Label color="blue">
                                {`${user[1]} (${user[0]})`}
                                {owner && <Icon name='delete' onClick={() => deleteUser(user)} />}
                            </Label>
                        )}
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