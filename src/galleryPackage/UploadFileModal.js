import React, { Component } from 'react'
import { Modal, Button, Form, Container, Header, Divider, Tab } from 'semantic-ui-react'
import Tags from '../imagePackage/Tags';
import People from '../imagePackage/People';
import LivePhoto from '../LivePhoto';
import UploadPreview from './UploadPreview';
import { UserContext } from '../UserContext'

class UploadFileModal extends Component {
    static contextType = UserContext
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: false,
            refresh: props.onRefresh,
            file: null,
            // array of URLs with names [{name: '', url: ''}, ...]
            files: [],
            // array of objects : { vid: url, img: url }
            livePhotos: [],
            // array of folders : { name: "", files: [File, File, File]}
            folders: [],
        }
        this.handleChange = this.handleChange.bind(this)
    }

    toggleUpload = () => {
        this.setState({ uploadFile: !this.state.uploadFile })
        this.setState({ file: null })
        this.setState({ files: [] })
        this.setState({ folders: [] })
        this.deleteUploadTags();
    }

    deleteUploadTags = () => {
        fetch('/deleteUploadTags/', {
            method: 'POST'
        }).then(res => res.text()).then(data => console.log(data))
    }

    handleUploadFolder = (e) => {
        e.preventDefault();
        console.log(this.uploadInput.files)
        for (var i = 0; i < this.uploadInput.files.length; i++) {
            const data = new FormData();
            data.append("file", this.uploadInput.files[i])
            fetch('/uploadPic', {
                method: 'POST',
                body: data
            })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                })
        }
        this.setState({ uploadFile: !this.state.uploadFile })
        this.state.refresh()
        this.context.setRefresh(true)
    }

    handleUploadImage = (e) => {
        console.log(this.uploadInput.files)
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
                this.context.setRefresh(true)
            })
    }

    // // parse webkitRelativePath up to
    // // the last forward slash and return that
    // getFolder = (path) => {
    //     return path.substring(0, path.lastIndexOf('/'))
    // }

    // // takes in Array of Files
    // // returns folders will include
    // // array of objects containing Files sorted by folder
    // // { name: "", files: [File, File, ..., File] }
    // sortBulkUpload = (filesArray) => {
    //     if (filesArray.length === 0) return;
    //     var sorted = [];
    //     var files = [...filesArray];
    //     // iterate through files adding each of its respective object's array
    //     while (files.length !== 0) {
    //         const f = files.pop()
    //         // get folder name
    //         const folder = this.getFolder(f.webkitRelativePath)
    //         // we have not seen this folder name yet, add it and push
    //         if (!sorted.some(f => f.name === folder)) {
    //             sorted.push({ name: folder, files: [f] })
    //         }
    //         // we have seen this folder name - add it to its respective object's array
    //         else {
    //             sorted.find(f => f.name === folder).files.push(f)
    //         }
    //     }
    //     console.log("SORTED", sorted)
    //     // this.setState({ folders: sorted })
    //     return sorted
    // }

    // // takes in Array of Files
    // // returns Array of Files
    // // that are supported by the application
    // filterUnsupportedFiles = (filesArray) => {
    //     const supported = ["jpeg", "jpg", "jfif", "gif", "mp4", "mov"]
    //     return filesArray.filter(file => 
    //         supported.includes(
    //             file.name
    //                 .split('.')
    //                 .pop()
    //                 .toLowerCase())
    //         )
    // }

    handleChange(event) {


        // get all non-unique file names in array of filenames
        // count accumulates an object of names to their count in given array
        const count = names =>
            names.reduce((result, value) => ({
                ...result,
                [value]: (result[value] || 0) + 1
            }), {}); // don't forget to initialize the accumulator
        // duplicates takes in the accumulated object to return an array of which values are duplicates
        const duplicates = dict =>
            Object.keys(dict).filter((a) => dict[a] > 1);

        // FileList => Array
        var filesArray = Array.from(event.target.files);

        // Sort our upload into folders to be displayed

        this.setState({ folders: this.sortBulkUpload(this.filterUnsupportedFiles(filesArray)) })


        // parse for live photos
        // get names along with truncating file extension
        const filenames = filesArray.map(i => i.name.replace(/\.[^/.]+$/, ""))
        // if there is two of the same filename - this indicates we have a img and mov file for a live photo
        const dupFileNames = duplicates(count(filenames))

        if (dupFileNames.length) {
            for (let i = 0; i < dupFileNames.length; i++) {
                const movFile = filesArray.find(item => item.name === `${dupFileNames[i]}.mov`)
                console.log("MOV ", movFile)
                const jpgFile = filesArray.find(item => item.name === `${dupFileNames[i]}.jpg`)
                console.log("JPEG ", jpgFile)
                this.setState(prevState => ({
                    ...prevState,
                    livePhotos:
                        [...prevState.livePhotos,
                        {
                            vid: URL.createObjectURL(movFile),
                            img: URL.createObjectURL(jpgFile)
                        }
                        ]
                }))
                filesArray = [...filesArray].filter(s => !s.name.includes(dupFileNames[i]))
            }
        }
        console.log("files array now here", filesArray)
        if (filesArray.length > 1) {
            for (var i = 0; i < filesArray.length; i++) {
                const name = filesArray[i]["name"]
                const url = URL.createObjectURL(filesArray[i])
                this.setState(prevState => ({
                    ...prevState,
                    files:
                        [...prevState.files, {

                            name: name,
                            url: url
                        }]
                }))
            }
        }
        else if (filesArray.length === 1) {
            this.setState({
                file: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    render() {
        const tabs = [
            {
                menuItem: 'Single File Upload',
                render: () => {
                    return <Tab.Pane>
                        <Form onSubmit={this.handleUploadImage}>
                            <Header>Select File</Header>
                            <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <UploadPreview uploadFiles={this.state.file} />
                            <Divider />
                            <Container>
                                <Tags id={'-2'} />
                            </Container>
                            <Container>
                                <People id={'-2'} />
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' color='orange' >Submit</Button>
                        </Form>
                    </Tab.Pane>
                }
            },
            {
                menuItem: 'Bulk Folder Upload',
                render: () => {
                    return <Tab.Pane>
                        <Form onSubmit={this.handleUploadFolder}>
                            <Header>Select FOLDER</Header>
                            <input type="file" directory="" webkitdirectory="" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <UploadPreview uploadFiles={this.state.files} folders={this.state.folders} isBulk={true} />
                            <div className='previewImgs'>
                                {this.state.livePhotos.length > 0 && this.state.livePhotos.map(obj => <LivePhoto {...obj} />)}
                            </div>
                            <Divider />
                            <Container>
                                <Tags id={'-2'} bulk={true} />
                            </Container>
                            <Container>
                                <People id={'-2'} bulk={true} />
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' color='orange' >Submit</Button>
                        </Form>
                    </Tab.Pane>
                }
            }
        ]
        return (
            <div>
                <Modal
                    open={this.state.uploadFile}
                    trigger={<Button className="rightButton" onClick={this.toggleUpload} color='orange' size='large' >Upload</Button>}>
                    <Modal.Content>
                        <Tab menu={{ color: 'orange', attached: true, inverted: true }} panes={tabs} />
                    </Modal.Content>
                </Modal>
            </div>
        )
    }

}
export default UploadFileModal;