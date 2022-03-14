import react, { useEffect, useState } from "react";
import { Label, Icon, Button, Divider } from "semantic-ui-react";
import EditForm from "./EditForm";

export default function TagRow(props) {

    const { name, color } = props
    const [confirm, setConf] = useState(false);
    const [buttonColor, setColor] = useState('red');
    //todo fake loading for now
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (confirm) {
            console.log("turned on")
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
                props.delTag(name, color)
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

    return (
        <div className="tagRow">
            <div className="rowLabel">
                <Label color={color} key={name}>
                    {name}
                </Label>
            </div>
            <div className="rowButtons">
                <div>
                    <Button color='orange' content="Edit" icon="edit" />
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
                {/* <div>
                    {confirm && <Button color='red' size='mini' icon='cancel' content='Cancel' />}
                    {confirm && <Button color='green' size='mini' icon='check circle' content='Confirm' />}
                </div> */}
            </div>
            {/* <EditForm
                            user={user}
                            name="Name"
                            //visible={this.state.nameModal}
                            //toggle={this.toggleName}
                            //update={this.update}
                        /> */}
        </div>
    )
}