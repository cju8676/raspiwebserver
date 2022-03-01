import React, { Component } from 'react'
import { Modal, Button, Form, Container, Header, Divider, Image } from 'semantic-ui-react'
import Tags from '../imagePackage/Tags';
import PeopleTags from '../imagePackage/PeopleTags';

class UploadFileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: false,
            refresh: props.onRefresh,
            file: null
        }
        this.handleChange = this.handleChange.bind(this)
    }

    toggleUpload = () => {
        this.setState({ uploadFile: !this.state.uploadFile })
        this.setState({ file: null })
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
                this.setState({ uploadFile: !this.state.uploadFile });
                this.state.refresh();
            })
    }

    handleSubmit = () => {
        this.setState({ uploadFile: !this.state.uploadFile })
        this.state.refresh();
    }

    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
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
                            <Header>Select File</Header>
                            <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <Header>Preview:</Header>
                            <Image size="large" src={this.state.file} />
                            <Divider />
                            <Container>
                                <Tags id={'-2'} />
                            </Container>
                            <Container>
                                <PeopleTags id={'-2'} />
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' positive >Submit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }

}
export default UploadFileModal;