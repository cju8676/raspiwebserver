import React, { useState, useEffect } from 'react'
import { Divider, Header, Card } from 'semantic-ui-react'
import UploadFileModal from './UploadFileModal'
import SearchBar from '../SearchBar'


export default function Gallery(props) {
    const { /*user,*/ onRefresh, img, cardGroups } = props;
    const [shownImg, setShownImg] = useState([])
    const [searchInput, setSearchInput] = useState("")

    //fixme maximum update depth exceeded
    function searchResults(val) {
        setSearchInput(val);
    }

    useEffect(() => {
        if (searchInput === "") setShownImg([])
        else {
            const filter = img.filter(pic => pic.props.filename.includes(searchInput))
            setShownImg(filter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput])

    return (
        <div>
            <div>
                <Header as='h3'>
                    <UploadFileModal onRefresh={onRefresh} />
                    <SearchBar onChange={searchResults} source={img} />
                </Header>
            </div>
            <Divider />
            <div className='gallery-scroll'>
                <div>
                    <Card.Group stackable itemsPerRow={4}>
                        {shownImg.map(picture => picture)}
                    </Card.Group>
                </div>
                <div>
                    {cardGroups.map(group => group)}
                </div>
            </div>
        </div>
    )
}