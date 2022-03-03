import react, { useEffect, useState } from "react";
import { Dropdown, SearchResults } from "semantic-ui-react";


export default function AddToAlbumButton(props) {
    const { albums, id, user } = props;
    function getOptions() {
        if (albums.length === 0) return [];
        else {
            const op = albums.map(album => {
                return { key: album, text: album, value: album }
            })
            return op
        }
    }

    // filter out albums this photo is already a part of
    const [availAlbums, setAvailAlbums] = useState([])

    useEffect(async () => {
        const options = getOptions()
        // const optionsValues = options.map((item) => item.value)
        // const valuesValuesMap = optionsValues.map((item) => item[0])
        const result = await fetch('/getImageAlbums/' + id + '/' + user).then(response => response.json())
            .then(res => {
                // return JSONresponse
                return res.map((item) => item[0])
            })

        setAvailAlbums(options.filter(item => {
            return !result.includes(item.value[0])
        }))

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
        //TODO handle response - success or failed to add to album
        // quick success pop up
    }

    return (
        <Dropdown
            text='Add to Album'
            icon='add' floating labeled button
            className='icon'
            options={availAlbums}>
            <Dropdown.Menu>
                {availAlbums.map(item => {
                    return <Dropdown.Item text={item.value} onClick={selectAlbum} />
                })}
            </Dropdown.Menu>
        </Dropdown >
    )
}