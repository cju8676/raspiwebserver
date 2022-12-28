import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Header, Image, Segment, Dimmer, Loader, Card, Grid, Button } from 'semantic-ui-react'
import Tags from '../imagePackage/Tags'
import People from '../imagePackage/People'
import MyLivePhoto from '../LivePhoto'

// Component to handle the preview section of the UploadFileModal
export default function UploadPreview({ uploadFiles, folders, isBulk, loading, addAlbum, removeAlbum }) {
    // todo save folder to album
    const [albumEnable, setAlbumEnable] = useState([]);

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
                <Image size="small" src={fileObj.url} />
            )
        else if (isSupportedVideo)
            return (
                <div className='live-photo-preview'>
                    <ReactPlayer
                        url={uploadFiles[0].url}
                        muted
                        loop
                        playing
                        width='100%'
                        height='100%'
                    />
                </div>
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

    function addToAlbumToggle(tagId) {
        // if enabled:
        // remove from enabled save to album buttons array
        // and reset back to default false
        if (albumEnable.includes(tagId)) {
            removeAlbum(tagId);
            setAlbumEnable(prev => [...prev.filter(id => id !== tagId)]);
        }
        // if disabled:
        // add to albums parent
        // add to enabled button array
        else {
            addAlbum(tagId);
            setAlbumEnable(prev => [...prev, tagId]);
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
                    {folders.map((folder, idx) => {
                        // -5 and below will be for each successive folder
                        const tagId = -5 - idx;
                        return (
                            <>
                                <Segment color='orange'>
                                    <Header as='h4'>{folder.name}</Header>
                                    <div style={{ padding: "25px" }}>
                                        <Grid stackable columns={5}>
                                            {folder.files.map(file => {
                                                return file instanceof File ? mapFile(convertFileToObj(file)) : <div className='live-photo-preview'><MyLivePhoto {...file} /></div>
                                            })}
                                        </Grid>
                                    </div>
                                    <Tags id={tagId} bulk={true} />
                                    <People id={tagId} bulk={true} />
                                    {/* todo css later */}
                                    <Button 
                                        type="button" 
                                        onClick={() => addToAlbumToggle(tagId)}
                                        color={albumEnable.includes(tagId) ? 'green' : ''}
                                    >
                                        Save as Album?
                                    </Button>
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