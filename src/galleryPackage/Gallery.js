import React, { useState, useEffect, useRef, useContext } from 'react'
import { Divider, Header, Card, Message, Button, Icon } from 'semantic-ui-react'
import SearchBar from '../SearchBar'
import { UserContext } from '../UserContext';
import { sortByYear, mapByYear, sortByMonth } from '../imageUtils'
import ImagePane from '../imagePackage/ImagePane'


export default function Gallery({ onRefresh, albums }) {
    const { user, files, tags } = useContext(UserContext)
    const [shownImg, setShownImg] = useState([])
    const [searchInput, setSearchInput] = useState("");
    const [img, setImg] = useState([]);
    const [years, setYears] = useState([]);
    const [cardGroups, setCardGroups] = useState([]);
    const prevScrollY = useRef(0);
    const [goingUp, setGoingUp] = useState(false);
    const [noResults, setNoResultsMessage] = useState(false)
    const [category, setCategory] = useState('filename')
    const [shownTags, setShownTags] = useState([])
    const [quickButtons, setQuickButtons] = useState([])
    const [mobile, setMobile] = useState(false)

    function searchResults(val, category) {
        setCategory(category)
        setSearchInput(val);
    }

    useEffect(() => {
        if (searchInput === "") {
            setShownImg([])
            setShownTags([])
            setNoResultsMessage(false)
        }
        else {
            switch (category) {
                case 'filename':
                    const filter = img.filter(pic => pic.props.filename.includes(searchInput))
                    if (filter.length > 0) {
                        setShownImg(filter)
                        setNoResultsMessage(false)
                    }
                    else {
                        setShownImg([])
                        setShownTags([])
                        setNoResultsMessage(true);
                    }
                    return;
                case 'tag':
                    // get tags by name and ensure they are NOT people tags
                    const shownTags = tags.filter(tag => tag.name.includes(searchInput) && !tag.isPerson)
                    setShownTags(shownTags)
                    // get ids from each tag, flatten into one array, filter out duplicates
                    const ids = [...new Set(shownTags.map(tag => tag.ids).flat())]
                    // filter images based on ids we have gathered
                    const shownImgByTag = img.filter(pic => ids.includes(pic.props.id))
                    setShownImg(shownImgByTag)
                    if (shownImgByTag.length > 0) {
                        setShownImg(shownImgByTag)
                        setNoResultsMessage(false)
                    }
                    else {
                        setShownImg([])
                        setShownTags([])
                        setNoResultsMessage(true);
                    }
                    return;
                case 'person':
                    // get tags by name and ensure they ARE people tags
                    const shownPeople = tags.filter(tag => tag.name.includes(searchInput) && tag.isPerson)
                    setShownTags(shownPeople)
                    // get ids from each tag, flatten into one array, filter out duplicates
                    const peopleIds = [...new Set(shownPeople.map(tag => tag.ids).flat())]
                    // filter images based on ids we have gathered
                    const shownImgByPerson = img.filter(pic => peopleIds.includes(pic.props.id))
                    setShownImg(shownImgByPerson)
                    if (shownImgByPerson.length > 0) {
                        setShownImg(shownImgByPerson)
                        setNoResultsMessage(false)
                    }
                    else {
                        setShownImg([])
                        setShownTags([])
                        setNoResultsMessage(true);
                    }
                    return;
                case 'type':
                    const shownByType = img.filter(pic => pic.props.type.includes(searchInput))
                    const shownByFileExtension = img.filter(pic =>
                        pic.props.filename
                            .split('.')
                            .pop()
                            .toLowerCase()
                            .includes(searchInput)
                    )
                    const shown = [...new Set(shownByType.concat(shownByFileExtension))]
                    if (shown.length > 0) {
                        setShownImg(shown)
                        setNoResultsMessage(false)
                    }
                    else {
                        setShownImg([])
                        setNoResultsMessage(true)
                    }
                    return;
                default:
                    setShownImg([])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, category])

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
                type={picture.type}
                mp4Data={picture.mp4Data}
                movData={picture.movData}
            />
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files])

    useEffect(() => {
        if (img.length > 0) {
            const sortedPanes = sortByYear([...img]);
            var sortedByMonth = [];
            for (const year of sortedPanes) {
                sortedByMonth.push(sortByMonth(year))
            }
            setYears(
                [].concat(sortedPanes.map(obj => obj.year))
                    .sort((a, b) => a < b ? 1 : -1)
                    //.map((yr, i) => <h4 key={i}>{yr}</h4>)
            )
            setCardGroups(mapByYear(sortedByMonth));
        }
    }, [img])

    useEffect(() => {
        if (cardGroups.length && years.length) {
            setQuickButtons(years.map(year => 
                <Button basic
                    onClick={() => document.getElementById(year).scrollIntoView()}
                >{year}</Button>
                ))
        }
    }, [cardGroups, years])

    const handleMobile = () => {
        if (window.innerWidth < 560) setMobile(true)
        else setMobile(false)
    }

    useEffect(() => {
        window.addEventListener('resize', handleMobile)
        return () => {
            window.removeEventListener('resize', handleMobile``)
        }
    }, [])

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
                    <Button floated='right' color="orange" href="#upload" size='large'>
                    {mobile ? <Icon name='upload'/> : "Upload"}
                    </Button>
                    <SearchBar onChange={searchResults} source={img} shownTags={shownTags} />
                </Header>
            </div>
            <Divider />
            <div className='gallery-scroll' onScroll={onScroll}>
                <div className='gallery'>
                    {noResults &&
                        <div style={{ padding: "10px 5px" }}>
                            <Message negative floating compact content="No results found." />
                        </div>}
                    <div style={{ padding: "5px" }}>
                        <Card.Group stackable itemsPerRow={4}>
                            {shownImg.map(picture =>
                                <div className='pane-pad' key={picture}>
                                    {picture}
                                </div>
                            )}
                        </Card.Group>
                    </div>
                    <div>
                        {cardGroups.map(group => group)}
                    </div>
                </div>
                <div className='scrollbar'>
                    <Header as='h4' textAlign="center">Jump to</Header>
                    {quickButtons.map(b => b)}
                </div>
            </div>
        </div>
    )
}