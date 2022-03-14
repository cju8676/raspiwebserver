import React, { useState, useEffect, useRef } from 'react'
import { Divider, Header, Card } from 'semantic-ui-react'
import UploadFileModal from './UploadFileModal'
import SearchBar from '../SearchBar'


export default function Gallery(props) {
    const { user, onRefresh, img, cardGroups, years } = props;
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


    const prevScrollY = useRef(0);
    const [goingUp, setGoingUp] = useState(false);

    const onScroll = (e) => {
        const currentScrollY = e.target.scrollTop;
        if (prevScrollY.current < currentScrollY && goingUp) {
            setGoingUp(false);
        }
        if (prevScrollY.current > currentScrollY && !goingUp) {
            setGoingUp(true);
        }
        prevScrollY.current = currentScrollY;
        // console.log(goingUp, currentScrollY);
    };

    const theYears = [].concat(years)
        .sort((a, b) => a < b ? 1 : -1)
        .map((yr, i) => <h4 key={i}>{yr}</h4>);

    return (
        <div>
            <div>
                <Header as='h3'>
                    <UploadFileModal onRefresh={onRefresh} user={user}/>
                    <SearchBar onChange={searchResults} source={img} />
                </Header>
            </div>
            <Divider />
            <div className='gallery-scroll' onScroll={onScroll}>
                <div className='gallery'>
                    <div>
                        <Card.Group stackable itemsPerRow={4}>
                            {shownImg.map(picture => picture)}
                        </Card.Group>
                    </div>
                    <div>
                        {cardGroups.map(group => group)}
                    </div>
                </div>
                <div className='scrollbar'>
                    {theYears}
                </div>
            </div>
        </div>
    )
}