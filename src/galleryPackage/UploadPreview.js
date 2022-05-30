import React from 'react'
import ReactPlayer from 'react-player'
import { Header, Image, Segment, Dimmer, Loader, Card } from 'semantic-ui-react'
import MyLivePhoto from '../LivePhoto'

// Component to handle the preview section of the UploadFileModal
export default function UploadPreview({ uploadFiles, folders, isBulk, loading }) {
    console.log("upload files", uploadFiles)
    console.log("folders", folders)
    // todo save folder to album

    const getFileExtension = (filename) => {
        return filename
            .split('.')
            .pop()
            .toLowerCase()
    }

    // maps based on if file is a photo/video
    // file obj contains {name: "", url: "blob://"}
    const mapFile = (fileObj) => {
        const supportedPhotoFormats = ['jpg', 'jpeg', 'gif', 'jfif', 'png']
        const supportedVideoFormats = ['mp4']
        const fileExtension = getFileExtension(fileObj.name)
        const isSupportedPhoto = supportedPhotoFormats.includes(fileExtension)
        const isSupportedVideo = supportedVideoFormats.includes(fileExtension)

        if (isSupportedPhoto)
            return (
                <Image size="large" src={fileObj.url} />
            )
        else if (isSupportedVideo)
            return (
                <ReactPlayer
                    url={uploadFiles[0].url}
                    muted
                    loop
                    playing
                />
            )
        else
            return (
                <Card content={`Warning - ${fileObj.name} - Unsupported File type`}></Card>
            )
    }

    // if in bulk we are given File
    // this converts File to obj containing {name: "", url: "blob://"}
    const convertFileToObj = (file) => {
        return {
            name: file.name,
            url: URL.createObjectURL(file)
        }
    }

    return isBulk ? (
        <Dimmer.Dimmable>
            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>
            <Header>Preview:</Header>
            {folders && folders.length > 0 &&
                <div>
                    {folders.map(folder => {
                        return (
                            <>
                                <Segment color='orange'>
                                    <Header as='h4'>{folder.name}</Header>
                                    <div className='upload-parent'>
                                        {folder.files.map(file => {
                                            return file instanceof File ? mapFile(convertFileToObj(file)) : <MyLivePhoto {...file} />
                                        })}
                                    </div>
                                </Segment>
                            </>)
                    })}
                </div>
            }
        </Dimmer.Dimmable>
    ) : (
        <>
            <Header>Preview:</Header>
            {uploadFiles.length ? (mapFile(uploadFiles[0])) : (<></>)}
        </>
    )
}