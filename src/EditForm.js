import { React, Component } from "react"
import { Header, Button, Divider, Confirm, Container, Segment, Input } from 'semantic-ui-react'

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <div>
                <Segment>
                    <h4>Edit {this.props.name}</h4>
                    <Input type='text' id={'entered'+this.props.name} placeholder={this.props.name} onChange={this.props.onChange} error={this.props.error} />
                    <Button color='black' onClick={this.props.toggle}>Cancel</Button>
                    <Button positive onClick={this.props.update}>Confirm</Button>
                </Segment>
            </div>
        )
    }
}

export default EditForm;