import React from "react";
import { Card } from 'semantic-ui-react'


export default function Favorited(props) {
    const { favs } = props

    return (
        <div>
            <Card.Group itemsPerRow={4}>
                {favs.map(fav => fav)}
            </Card.Group>
        </div>
    )
}