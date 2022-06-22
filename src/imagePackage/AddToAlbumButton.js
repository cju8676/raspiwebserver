import { useEffect, useState, useContext } from "react";
import { Dropdown } from "semantic-ui-react";
import { showErrorNotification, showSuccessNotification } from "../notificationUtils";
import { UserContext } from "../UserContext";


export default function AddToAlbumButton({ id }) {
    const { user } = useContext(UserContext)
    // filter out albums this photo is already a part of
    const [availAlbums, setAvailAlbums] = useState([])

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/getAlbums/' + user)
            const ops = await res.json()
            const options = ops.flat().map(op => { return { key: op, text: op, value: op } })
            if (options.length === 0) return;
            const response = await fetch('/getImageAlbums/' + id + '/' + user)
            const result = (await response.json()).flat()
            if (result.length === 0) setAvailAlbums(options)
            else
                setAvailAlbums(options.filter(item => {
                    return !result.includes(item.value)
                }))
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function selectAlbum(e, data) {
        const postData = {
            username: user,
            album_name: data.text,
            id: id
        }
        const reqOptions = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        }
        fetch('/addPicToAlbum/', reqOptions)
            .then(response => response.json())
            .then(jsonOutput => {
                handleAlbumAdd(jsonOutput);
                setAvailAlbums(availAlbums.filter(item => item.value !== data.text));
            })
    }

    function handleAlbumAdd(output) {
        output ?
            showSuccessNotification('Added to album!') :
            showErrorNotification('Failed to Add. Please Try again.')
    }

    return (
        <Dropdown
            text='Add to Album'
            icon='add' floating labeled button
            className='icon'
            options={availAlbums}>
            <Dropdown.Menu>
                {availAlbums.map(item => {
                    return <Dropdown.Item key={item.value} text={item.value} onClick={selectAlbum} />
                })}
            </Dropdown.Menu>
        </Dropdown >
    )
}