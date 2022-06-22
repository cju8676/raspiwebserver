import React, { useState, useEffect, useContext } from "react";
import { Card, Dimmer, Loader } from 'semantic-ui-react'
import { UserContext } from "./UserContext";
import ImagePane from "./imagePackage/ImagePane";

export default function Favorited({ albums, onRefresh }) {
    const { user, files } = useContext(UserContext)
    const [favs, setFavs] = useState([])
    const [favorited, setFavorited] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // returns the IDs of the image panes we need to extract
        fetch('/getFavoriteIDs/' + user).then(res => res.json())
            .then(JSONresponse => setFavorited(JSONresponse.flat()))
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    type={picture.type}
                    mp4Data={picture.mp4Data}
                    movData={picture.movData}
                />
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, favorited])

    useEffect(() => {
        if (favs) setLoading(false)
    }, [favs])

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
        <Dimmer.Dimmable active={loading}>
            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>
            <div className="gallery-scroll">
                <div style={{ padding: "5px" }}>
                    <Card.Group itemsPerRow={4}>
                        {favs.map(fav =>
                            <div className="pane-pad">
                                {fav}
                            </div>
                        )}
                    </Card.Group>
                </div>
            </div>

        </Dimmer.Dimmable>
    )
}