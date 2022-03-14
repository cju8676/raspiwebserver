import React, { useState, useEffect } from "react";
import { Divider, Label } from "semantic-ui-react";
import TagRow from "./TagRow";


export default function EditPeople(props) {

    const { user } = props;
    const [tags, setTags] = useState([])

    useEffect(() => {
        fetch('/getEditPeople/' + user)
            .then(res => res.json())
            .then(data => setTags(data))
    }, [])

    function delTag(name, color) {
        console.log("deleting", name, color)
        setTags(tags.filter(tag => !((tag[0] === name) && (tag[1] === color)) ))
        fetch('/deletePersonOverall/' + name + '/' + color, {
            method: 'POST'
        })
            .then(res => res.text())
            .then(data => console.log(data));
    }

    return (
        <div>
            <h4>Created by you:</h4>
            <div className="editTags">
            {tags.map(tag => {
                    return <div className="editTag">
                        <Divider />
                        <TagRow name={tag[0]} color={tag[1]} delTag={delTag}/>
                    </div>
                })}
            </div>
        </div>
    )
}