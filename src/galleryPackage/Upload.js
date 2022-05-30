import React, { useState, useEffect, useContext } from 'react'
import { Button, Divider, Dropdown, Header, Segment, Form } from 'semantic-ui-react'
import { extractLivePhotos, filterUnsupportedFiles, sortBulkUpload } from './uploadUtils'
import { UserContext } from '../UserContext'
import { showSuccessNotification } from '../notificationUtils'
import UploadPreview from './UploadPreview'

export default function Upload(props) {
    const [uploadType, setUploadType] = useState("single")
    const [uploadInput, setUploadInput] = useState(null)
    const [folders, setFolders] = useState(null)
    const [files, setFiles] = useState([])
    const { setRefresh } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const options =
        [
            {
                key: "single",
                text: "Single Upload",
                value: "single"
            },
            {
                key: "bulk",
                text: "Bulk/Folder Upload",
                value: "bulk"
            }
        ]
    const getInput = () => uploadType === "single" ?
        (<>
            <Header>Select File</Header>
            <input type="file" onChange={handleChange} ref={(ref) => { setUploadInput(ref) }} />
        </>
        ) : (<>
            <Header>Select Folder</Header>
            <input type="file" onChange={handleChange} ref={(ref) => { setUploadInput(ref) }} directory="" webkitdirectory="" />
        </>)

    async function handleUpload(e) {
        e.preventDefault();
        for (var i = 0; i < uploadInput.files.length; i++) {
            const data = new FormData();
            data.append("file", uploadInput.files[i])
            await fetch('/uploadPic', {
                method: 'POST',
                body: data
            })
                .then(res => res.text())
                .then(data => {
                    // console.log("upload", data)
                })
        }
        props.history.push('/home')
        setRefresh(true)
        showSuccessNotification("Successfully uploaded media. Refreshing...")
    }

    async function handleChange(e) {
        // FileList => Array
        var filesArray = Array.from(e.target.files)
        // Parse array into folder objects UploadPreview can use
        setLoading(true)
        const sortedFolders = sortBulkUpload(filterUnsupportedFiles(filesArray))
        const extracted = await extractLivePhotos(sortedFolders)
        setFolders(extracted)
        for (var i = 0; i < filesArray.length; i++) {
            const name = filesArray[i]["name"]
            const url = URL.createObjectURL(filesArray[i])
            setFiles([...files, {
                name: name,
                url: url
            }])
        }
    }

    useEffect(() => {
        if (folders) setLoading(false)
    }, [folders])

    function handleCancel() {
        // todo delete from dbconversions
        // remove from files in db
    }

    return (
        <div className='segment-pad'>
            <Segment>
                <Header>
                    <Button color='orange' size='large' href="#home">Back</Button>
                    Upload
                </Header>
            </Segment>
            <Divider />
            <Segment>
                <Dropdown placeholder='Single Upload' selection options={options} onChange={(e, { value }) => setUploadType(value)} />
            </Segment>
            <Divider />
            <Segment className='noflex-scroll'>
                <Form onSubmit={handleUpload}>
                    {getInput()}
                    <Divider />
                    <UploadPreview
                        isBulk={uploadType === 'bulk'}
                        uploadFiles={files}
                        folders={folders}
                        loading={loading}/>
                    <Divider />
                    <Button as='a' onClick={handleCancel}>Cancel</Button>
                    <Button type='submit' color='orange' disabled={loading}>Submit</Button>
                </Form>
            </Segment>
        </div>
    )
}