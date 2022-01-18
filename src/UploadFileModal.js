import React, { Component } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'

class UploadFileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile : false,
            refresh : props.onRefresh
        }
    }

    toggleUpload = () => {
        this.setState({ uploadFile : !this.state.uploadFile })
    }

    handleUploadImage = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", this.uploadInput.files[0]);
        fetch('/uploadPic', {
            method: 'POST',
            body: data
        })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            this.setState({uploadFile : !this.state.uploadFile});
            this.state.refresh();
        })
    }

    handleSubmit = () => {
        this.setState({uploadFile : !this.state.uploadFile})
        this.state.refresh();
    }

    render() {
        return (
            <div>
            <Modal
                open={this.state.uploadFile}
                trigger={<Button className="rightButton" onClick={this.toggleUpload} color='orange' size='large' >Upload</Button>}>
                <Modal.Header>New File Upload</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleUploadImage}>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                        <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                        <Button type='submit' positive >Submit</Button>
                    </Form>
                </Modal.Content>
                {/* <Modal.Actions>
                    <Button color='black' onClick={this.toggleUpload}>Cancel</Button>
                    <Button positive onSubmit={this.handleUploadImage}>Upload</Button>
                </Modal.Actions> */}
            </Modal>
            </div>
        )
    }

}
export default UploadFileModal;