import { React, Component } from "react"
import { Button, Segment, Input } from 'semantic-ui-react'

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blank : false
        };
        this.updateInfo = "";
    }

    handleUpdate = (e) => {
        this.props.update(e, this.updateInfo);
        this.updateInfo = "";
        this.props.toggle();
    }

    submitUpdate = () => {
        if (this.props.visible && this.updateInfo === "") {
            this.setState({blank : true });
            return;
        }
        const data = {
            username : this.props.user,
            new_name : this.updateInfo
        }
        const reqOptions = {
            method : 'POST',
            headers : { Accept : 'application/json', 'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        }
        fetch(`/update${this.props.name}/`, reqOptions).then(res => res.json())
            .then(
                //todo handle success pop up
                this.handleUpdate(this.props.name)
            )

    }

    update = (event) => {
        this.updateInfo = event.target.value;
        if (event.target.value !== "") {
            this.setState({blank : false})
        }
    }

    render() {

        return (
            <div>
                <Segment>
                    <h4>Edit {this.props.name}</h4>
                    <Input type='text' id={'entered'+this.props.name} placeholder={this.props.name} onChange={this.update} error={this.state.blank} />
                    <Button color='black' onClick={this.props.toggle}>Cancel</Button>
                    <Button positive onClick={this.submitUpdate}>Confirm</Button>
                </Segment>
            </div>
        )
    }
}

export default EditForm;