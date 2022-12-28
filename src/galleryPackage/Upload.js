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
    const [uploading, setUploading] = useState(false);
    const [foldersToAlbums, setFoldersToAlbums] = useState([]);

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
    
    useEffect(() => {
        console.log("upload input", uploadInput)
        if (uploadInput && uploadInput.files) {
            console.log("up in", uploadInput.files)
            for (var i = 0 ; i < uploadInput.files.length ; i++) {
                console.log("file", uploadInput.files[i]);
                console.log("folder index", getFolderIndex(uploadInput.files[i].webkitRelativePath))
            }
        }
    }, [uploadInput])

    // get folder index for file, returns -1 on error
    const getFolderIndex = (directory) => {
        if (!directory) return -1;
        for (var i = 0; i < folders.length; i++) {
            if (directory.includes(folders[i].name)) return i;
        }
        return -1;
    }

    async function handleUpload(e) {
        e.preventDefault();
        setUploading(true);
        // upload all files
        for (var i = 0; i < uploadInput.files.length; i++) {
            const data = new FormData();
            data.append("file", uploadInput.files[i])
            const tag = getFolderIndex(uploadInput.files[i].webkitRelativePath)
            console.log("data", data)
            await fetch('/uploadPic/' + (-5 - tag), {
                method: 'POST',
                body: data
            })
                .then(res => res.text())
                .then(data => {
                    // console.log("upload", data)
                })
        }
        // delete all negative indexes corresponding to upload preview folders
        for (var j = 0 ; j < folders.length ; j++) {
            await fetch('/deleteUploadTag/' + (-5 - j),{
                method: 'POST'
            })
            .then(res => res.text())
            .then(data => {
                // successful deletion of this tag
            })
        }
        // add all uploaded folders to respective selected albums
        for (var k = 0; k < foldersToAlbums.length ; k++) {
            console.log("K ", foldersToAlbums[k])
        }
        props.history.push('/home')
        setUploading(false);
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
                        loading={loading}
                        addAlbum={(newId) => setFoldersToAlbums(prev => [...prev, newId])} 
                        removeAlbum={(newId) => setFoldersToAlbums(prev => [...prev.filter(id => id !== newId)])}    
                    />
                    <Divider />
                    <Button as='a' onClick={handleCancel}>Cancel</Button>
                    <Button type='submit' color='orange' loading={uploading} disabled={loading}>Submit</Button>
                </Form>
            </Segment>
        </div>
    )
}