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

    function handleUserChange(output) {
        console.log(output)
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
        console.log("one time")
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

    return (
        <HashRouter>
            <UserContext.Provider value={{ user: currentUser, name: currentName, files }}>
                {currentUser ? <Redirect to="/home" /> : <Redirect to={redirect} />}
                <Route path="/login" component={(props) => <LoginScreen newUser={currentUser} onChange={handleUserChange} />} />
                <Route path="/home" component={(props) => <HomePage onChange={handleLogout} onRefresh={handleHomeRefresh} />} />
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} />} />
                <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={handleLogout} setPage={setPage} />} />
            </UserContext.Provider>
        </HashRouter>
    )
}