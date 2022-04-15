import React, { useState, useEffect, useRef, useContext } from 'react'
import { Divider, Header, Card } from 'semantic-ui-react'
import UploadFileModal from './UploadFileModal'
import SearchBar from '../SearchBar'
import { UserContext } from '../UserContext';
import { sortByYear, mapByYear, sortByMonth } from '../imageUtils'
import ImagePane from '../imagePackage/ImagePane'


export default function Gallery(props) {
    const { onRefresh, albums } = props;
    const { user, files } = useContext(UserContext)
    const [shownImg, setShownImg] = useState([])
    const [searchInput, setSearchInput] = useState("");
    const [img, setImg] = useState([]);
    const [years, setYears] = useState([]);
    const [cardGroups, setCardGroups] = useState([]);
    const prevScrollY = useRef(0);
    const [goingUp, setGoingUp] = useState(false);

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

    useEffect(() => {
        setImg(files.map(picture => {
            return <ImagePane
                picture={picture.link}
                filename={picture.name}
                id={picture.id}
                key={picture.id}
                albums={albums}
                path={picture.info}
                inAlbum={false}
                refresh={onRefresh}
                date={picture.date}
                isVideo={picture.video}
            />
        }))

        
    }, [files])

    useEffect(() => {
        if (img.length > 0) {
            const sortedPanes = sortByYear(img);
            var sortedByMonth = [];
            for (const year of sortedPanes) {
                sortedByMonth.push(sortByMonth(year))
            }
            console.log(sortedByMonth);
            setYears(
                [].concat(sortedPanes.map(obj => obj.year))
                    .sort((a, b) => a < b ? 1 : -1)
                    .map((yr, i) => <h4 key={i}>{yr}</h4>)
            )
            setCardGroups(mapByYear(sortedByMonth));
        }
    }, [img])


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

    return (
        <div>
            <div>
                <Header as='h3'>
                    <UploadFileModal onRefresh={onRefresh} user={user} />
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
                    {years}
                </div>
            </div>
        </div>
    )
}