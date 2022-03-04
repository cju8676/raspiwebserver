import React, { useEffect, useState } from 'react'
import { Route, HashRouter, Redirect } from 'react-router-dom'
import LoginScreen from './loginPackage/LoginScreen'
import HomePage from './HomePage'
import AlbumPage from './AlbumPage'
import SettingsPage from './settingPackage/SettingsPage'

export default function PageHandle(props) {

    const [redirect, setRedirect] = useState("/login")
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('name')) || null)

    function handleUserChange(output) {
        setCurrentUser(output[0])
        setCurrentName(output[1])
        setRedirect("/home")
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('name', JSON.stringify(currentName));
    }

    function handleLogout() {
            setCurrentUser(null);
            setCurrentName(null);
            setRedirect("/login");
    }

    function handleRefresh(album) {
       setRedirect("/album/" + album);
    }

    function handleHomeRefresh() {
        setRedirect("/home");
    }

    useEffect(() => {
        setRedirect('/home')
    }, [currentName])

    return (
        <HashRouter>
            {currentUser ? <Redirect to="/home" /> : <Redirect to={redirect} />}
            <Route path="/login" component={(props) => <LoginScreen newUser={currentUser} onChange={handleUserChange} />} />
            <Route path="/home" component={(props) => <HomePage user={currentUser} name={currentName} onChange={handleLogout} onRefresh={handleHomeRefresh} />} />
            <Route path="/album/:album" component={(props) => <AlbumPage {...props} user={currentUser} onChange={handleRefresh} />} />
            <Route path="/settings" component={(props) => <SettingsPage {...props} onChange={handleLogout} name={currentName} user={currentUser} />} />
        </HashRouter>
    )
}