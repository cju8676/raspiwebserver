import React, { useState, useEffect } from "react";
import { Button, Divider, Icon, Label } from "semantic-ui-react";
import EditForm from "./EditForm";
import TagRow from "./TagRow";


export default function EditTags(props) {

    const { user } = props;
    const [tags, setTags] = useState([])

    useEffect(() => {
        fetch('/getEditTags/' + user)
            .then(res => res.json())
            .then(data => setTags(data))
    }, [])

    function delTag(name, color) {
        console.log("deleting", name, color)
        setTags(tags.filter(tag => !((tag[0] === name) && (tag[1] === color)) ))
        fetch('/deleteTagOverall/' + name + '/' + color, {
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
                        <TagRow name={tag[0]} color={tag[1]} delTag={delTag} />
                    </div>
                })}
            </div>
        </div>
    )
}