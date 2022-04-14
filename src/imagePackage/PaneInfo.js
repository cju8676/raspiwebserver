import React, { useState, useEffect, useContext } from 'react'
import { Divider, Grid } from 'semantic-ui-react'
import { UserContext } from '../UserContext';
import Tags from './Tags';
import People from './People';

// Right hand Grid column of our ImagePane's infoModal
export default function PaneInfo(props) {
    const { name, path, id } = props;
    const { user } = useContext(UserContext)
    // todo verify this works then convert to object instead of array
    //{len, wid, make, modal, datetime, [lat, long]}
    const [info, setInfo] = useState([])

    useEffect(() => {
        fetch('/info/' + encodeURIComponent(path) + '/' + encodeURIComponent(name) + '/' + user)
            .then(response => response.json())
            .then(output => {
                setInfo(output);
                props.setFavorited(Boolean(output.isFavorited))
                if (output.gps) 
                    props.setMap({
                        lat: output.gps.lat,
                        long: output.gps.long
                    })
            })
    }, []);

    const date = () => {
        if (info.date === '---') {
            return (
                <>
                    <h2>Date Uploaded</h2>
                    {new Date(props.date).toDateString()}
                </>
            )
        }
        else {
            return (
                <>
                    <h2>Date Taken</h2>
                    {info.date}
                </>
            )
        }
    }

    return (
        <Grid.Column>
            <h3>{name}</h3>
            <Divider />
            <Tags id={id} />
            <Divider />
            <People id={id} />
            <Divider />
            <h2>Dimensions</h2>
            {info.len} x {info.wid}
            <h2>Make</h2>
            {info.make}
            <h2>Model</h2>
            {info.model}
            {date()}
            <Divider />
            ID: {id}
        </Grid.Column>
    )
}