import React, { useEffect, useState } from 'react'
import { Route, HashRouter, Redirect } from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'
import SettingsPage from './settingPackage/SettingsPage'
import { UserContext } from './UserContext'

export default function PageHandle(props) {

    const [redirect, setRedirect] = useState("/login")
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('name')) || null)

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

    function handleRefresh(album) {
        console.log("handle refresh", album)
        setRedirect("/album/:" + album);
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

    return (
        <HashRouter>
            <UserContext.Provider value={{ user: currentUser, name: currentName }}>
                {currentUser ? <Redirect to="/home" /> : <Redirect to={redirect} />}
                <Route path="/login" component={(props) => <LoginScreen newUser={currentUser} onChange={handleUserChange} />} />
                <Route path="/home" component={(props) => <HomePage onChange={handleLogout} onRefresh={handleHomeRefresh} />} />
                <Route path="/album/:album" component={(props) => <AlbumPage {...props} onChange={handleRefresh} />} />
                <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={handleLogout} setPage={setPage} />} />
            </UserContext.Provider>
        </HashRouter>
    )
}