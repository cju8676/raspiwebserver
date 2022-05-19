import React, { useState, useEffect, useContext } from "react";
import { Divider } from "semantic-ui-react";
import { UserContext } from "../UserContext";
import TagRow from "./TagRow";


export default function EditLabels(props) {

    // tags if true, people if false...
    const { isTags } = props;
    const [tags, setTags] = useState([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        fetch(`/getEdit${isTags ? 'Tags' : 'People'}/` + user)
            .then(res => res.json())
            .then(data => setTags(data))
    }, [])

    function delTag(name, color) {
        setTags(tags.filter(tag => !((tag[0] === name) && (tag[1] === color))))
        fetch(`/delete${isTags ? 'Tag' : 'Person'}Overall/` + name + '/' + color, {
            method: 'POST'
        })
            .then(res => res.text())
            .then(data => data/*todo success msg if true failure msg if false*/);
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