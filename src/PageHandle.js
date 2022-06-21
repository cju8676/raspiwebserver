import React, { useEffect, useState } from 'react'
import { Route, HashRouter, Redirect } from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'
import SettingsPage from './settingPackage/SettingsPage'
import { UserContext } from './UserContext'
import Upload from './galleryPackage/Upload'
import { duplicates, count, getFilenames } from './galleryPackage/uploadUtils'
import ErrorReport from './ErrorReport'

export default function PageHandle(props) {

    const [redirect, setRedirect] = useState("/login");
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('name')) || null);
    const [files, setFiles] = useState([]);
    // contains array of: { name: "", color: "", isPerson: boolean, ids: [], owner: "" }
    const [tags, setTags] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [refresh, setRefresh] = useState(true)

    function handleUserChange(output) {
        setCurrentUser(output[0])
        setCurrentName(output[1])
        setRedirect("/home")
        localStorage.setItem('user', JSON.stringify(output[0]));
        localStorage.setItem('name', JSON.stringify(output[1]));
    }

    function handleLogout() {
        setCurrentUser(null);
        setCurrentName(null);
        localStorage.removeItem('user');
        localStorage.removeItem('name')
        setRedirect("/login");
    }

    function handleHomeRefresh() {
        setRedirect("/home");
    }

    function setPage(item, val) {
        if (item === 'name')
            setCurrentName(val)
        else if (item === 'user')
            setCurrentUser(val);
    }

    // get our blobs associated with this live photo
    async function getLiveBlobs(movFile, jpgFile, mp4File) {
        const mov = fetch('/files/' + movFile.id) // fetch movFile
            .then(res => res.blob())
        const jpg = fetch('/files/' + jpgFile.id) // fetch jpgFile
            .then(res => res.blob())
        const mp4 = fetch('/files/' + mp4File.id) // fetch mp4File
            .then(res => res.blob())

        // does not return until all fetches return
        return {
            mov: await mov.then(blob => blob),
            jpg: await jpg.then(blob => blob),
            mp4: await mp4.then(blob => blob),
        }
    }

    async function getLivePhotos(files) {

        //todo we should be allowed to have same filename from separate folders - should parse
        // for that once sample size gets bigger

        // get duplicate file names and ensure there is three files of that name
        // mov, jpg, and mp4 files
        const dupFileNames = duplicates(count(getFilenames([...files])))
        if (dupFileNames.length) {
            var getLive = [...files]
            for (let i = 0; i < dupFileNames.length; i++) {
                const movFile = files.find(item => item.name === `${dupFileNames[i]}.mov`)
                const jpgFile = files.find(item => item.name === `${dupFileNames[i]}.jpg`)
                const mp4File = files.find(item => item.name === `${dupFileNames[i]}.mp4`)
                // await all of these and then update our files state
                let liveLinks = {};
                await getLiveBlobs(movFile, jpgFile, mp4File)
                    .then(obj => {
                        liveLinks = {
                            mov: URL.createObjectURL(obj.mov),
                            jpg: URL.createObjectURL(obj.jpg),
                            mp4: URL.createObjectURL(obj.mp4),
                        };
                    })
                // use info of photo
                setFiles(prevState => {
                    return [...prevState,
                    {
                        link: liveLinks.jpg,
                        name: jpgFile.name,
                        id: jpgFile.id,
                        info: jpgFile.path.replace('/', '%2F'),
                        date: jpgFile.date,
                        type: "live",
                        movData:{
                            link: liveLinks.mov,
                            name: movFile.name,
                            id: movFile.id,
                            info: movFile.path.replace('/', '%$2F'), 
                            date: movFile.date
                        }, 
                        mp4Data:{
                            link: liveLinks.mp4,
                            name: mp4File.name,
                            id: mp4File.id,
                            info: mp4File.path.replace('/', '%$2F'),
                            date: mp4File.date
                        },
                    }
                    ]
                })
                // and then filter out from files array
                getLive = [...getLive].filter(file => {
                    return file !== movFile && file !== jpgFile && file !== mp4File
                })
            }
            return getLive
        }
        else return files

        // return files without live
    }

    useEffect(() => {
        var id_path = {};
        async function fetchImg() {
            setFiles([])
            await fetch('/getAllImages/').then(response => response.json())
                .then(async JSONresponse => {
                    var files = JSON.parse(JSONresponse)
                    // extract live photos and then proceed with normal files
                    files = await getLivePhotos(files)

                    for (let i = 0; i < files.length; i++) {
                        var path = (files[i].path).replace('/', '%2F');
                        id_path[files[i].id] = path

                        fetch('/files/' + files[i].id)
                            .then(response => response.blob())
                            .then(imageBlob => {
                                const imageURL = URL.createObjectURL(imageBlob);
                                const isVideo = imageBlob.type === 'video/mp4' ? true : false
                                setFiles(prevState => {
                                    return [...prevState,
                                    {
                                        link: imageURL,
                                        name: files[i].name,
                                        id: files[i].id,
                                        info: id_path[files[i].id],
                                        date: files[i].date,
                                        type: isVideo ? "video" : "photo", 
                                        movData: null,
                                        mp4Data: null
                                    }
                                    ]
                                })
                            })
                    }
                })
        }
        if (refresh) fetchImg()
        setRefresh(false)
    }, [refresh])

    useEffect(() => {
        var tagArray = []
        async function fetchTags() {
            await fetch('/getAllTags/').then(res => res.json())
                .then(JSONresponse => {
                    // arr - [name, id, color, people, owner]
                    JSONresponse.forEach(arr => {
                        const inTagArr = tagArray.find(t => t.name === arr[0])
                        if (inTagArr)
                            inTagArr.ids.push(arr[1])
                        else
                            tagArray.push({
                                name: arr[0],
                                color: arr[2],
                                isPerson: Boolean(parseInt(arr[3])),
                                owner: arr[4],
                                ids: [arr[1]]
                            })
                    })
                })
            setTags(tagArray)
        }
        fetchTags()
    }, [])

    return (
        <HashRouter>
            <UserContext.Provider value={{ user: currentUser, name: currentName, files, setFiles, tags, activeIndex, setActiveIndex, setRefresh }}>
                {currentUser ? <Redirect to="/home" /> : <Redirect to={redirect} />}
                <Route path="/login" component={(props) => <LoginScreen newUser={currentUser} onChange={handleUserChange} />} />
                <Route path="/home" component={(props) => <HomePage onChange={handleLogout} onRefresh={handleHomeRefresh} />} />
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} />} />
                <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={handleLogout} setPage={setPage} />} />
                <Route path="/upload" component={(props) => <Upload {...props} />} />
                <Route path="/error" component={() => <ErrorReport />} />
            </UserContext.Provider>
        </HashRouter>
    )
}