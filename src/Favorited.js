import React, { useState, useEffect, useContext } from "react";
import { Card } from 'semantic-ui-react'
import { UserContext } from "./UserContext";
import ImagePane from "./imagePackage/ImagePane";

export default function Favorited(props) {
    const { albums, onRefresh } = props;
    const { user, files } = useContext(UserContext)
    const [favs, setFavs] = useState([])
    const [favorited, setFavorited] = useState([])

    useEffect(() => {
        // returns the IDs of the image panes we need to extract
        fetch('/getFavoriteIDs/' + user).then(res => res.json())
            .then(JSONresponse => setFavorited(JSONresponse.flat()))
    }, [])

    useEffect(() => {
        setFavs(files
            .filter(item => favorited.includes(item.id))
            .map(picture => {
                return <ImagePane
                    picture={picture.link}
                    filename={picture.name}
                    id={picture.id}
                    key={picture.id}
                    favorited='true'
                    albums={albums}
                    path={picture.info}
                    inFavs={updateFav}
                    refresh={onRefresh}
                    date={picture.date}
                    isVideo={picture.video}
                />
            }))
    }, [files, favorited])

    // fav was either added or removed from favs, update Favorited page accordingly
    const updateFav = (fav) => {
        // removed case
        if (favorited.includes(fav))
            setFavorited([...favorited].filter(i => i !== fav))
        // added case
        else
            setFavorited([...favorited, fav])
    }

    return (
        <div>
            <Card.Group itemsPerRow={4}>
                {favs.map(fav => fav)}
            </Card.Group>
        </div>
    )
}