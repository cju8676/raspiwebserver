import React, { useEffect, useState } from 'react'
import { Route, HashRouter, Redirect } from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'
import SettingsPage from './settingPackage/SettingsPage'
import { UserContext } from './UserContext'

export default function PageHandle(props) {

    const [redirect, setRedirect] = useState("/login");
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('name')) || null);
    const [files, setFiles] = useState([]);
    // contains array of: { name: "", color: "", isPerson: boolean, ids: [], owner: "" }
    const [tags, setTags] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [errorNotification, showErrorNotification] = useState(null)
    const [successNotification, showSuccessNotification] = useState(null)

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

    useEffect(() => {
    }, [currentName])

    useEffect(async () => {
        var id_path = {};
        await fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                var files = JSON.parse(JSONresponse)
                // this.setState({ filesLen: files.length })
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
                                    video: isVideo
                                }
                                ]
                            })
                        })
                }
            })
    }, [])

    useEffect(async() => {
        var tagArray = []
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
    }, [])

    return (
        <HashRouter>
            <UserContext.Provider value={{ user: currentUser, name: currentName, files, tags, activeIndex, setActiveIndex, errorNotification, showErrorNotification, successNotification, showSuccessNotification }}>
                {currentUser ? <Redirect to="/home" /> : <Redirect to={redirect} />}
                <Route path="/login" component={(props) => <LoginScreen newUser={currentUser} onChange={handleUserChange} />} />
                <Route path="/home" component={(props) => <HomePage onChange={handleLogout} onRefresh={handleHomeRefresh} />} />
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} />} />
                <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={handleLogout} setPage={setPage} />} />
            </UserContext.Provider>
        </HashRouter>
    )
}