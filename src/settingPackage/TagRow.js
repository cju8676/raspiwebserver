import react, { useEffect, useState } from "react";
import { Label, Icon, Button, Divider } from "semantic-ui-react";
import EditForm from "./EditForm";

export default function TagRow({ name, color, delTag }) {
    const [confirm, setConf] = useState(false);
    const [labelName, setLabelName]= useState(name)
    const [labelColor, setLabelColor] = useState(color)
    const [buttonColor, setColor] = useState('red');
    //todo fake loading for now
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        if (confirm) {
            const timer = setTimeout(() => {
                setColor('red');
                setConf(false);
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [confirm])

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                console.log("simulate end loading")
                delTag(name, color)
                setColor('red')
                setConf(false)
                setLoading(false)
            }, 1000)
            return () => clearTimeout(timer);
        }
    }, [loading])

    // assess whether we are in normal red state, green 3 second confirm state, or loading state,
    // and bring us where we need to be based on where we are
    // red + click = green confirm
    // green confirm + click = loading for 1 second then remove myself all together
    function handleClick() {
        console.log(confirm)
        if (confirm) {
            setLoading(true)
        }
        else {
            setConf(true);
            setColor('green')
        }
    }

    function updateColor(color) {
        setLabelColor(color)
    }

    function updateName(name) {
        setLabelName(name);
    }

    return (
        <>
            <div className="tagRow">
                <div className="rowLabel">
                    <Label color={labelColor} key={labelName}>
                        {labelName}
                    </Label>
                </div>
                <div className="rowButtons">
                    <div>
                        <Button color='orange' content="Edit" icon="edit" onClick={() => setEditModal(true)} />
                    </div>
                    <div>
                        <Button
                            loading={loading}
                            color={buttonColor}
                            active={confirm}
                            onClick={() => handleClick()}>
                            <Button.Content visible>
                                {confirm ? <Icon name='check circle' /> : <Icon name="trash" />}
                                {confirm ? "Confirm Delete" : "Delete Tag?"}
                            </Button.Content>
                        </Button>
                    </div>
                </div>
            </div>
            {editModal && <EditForm
                //user={user}
                name="Tag"
                toggle={() => setEditModal(!editModal)}
                updateColor={updateColor}
                updateName={updateName}
                tagName={labelName}
                tagColor={labelColor}
            />}
        </>
    )
}