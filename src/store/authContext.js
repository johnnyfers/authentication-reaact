import React, { useEffect, useState } from 'react';

let logoutTimer = null

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
})

const calculateRemainingTime = (expirationTime)=> {
    const currentTime = new Date().getTime()
    const adjExpirationTime = new Date(expirationTime).getTime

    const remainingTime = adjExpirationTime - currentTime

    return remainingTime
}

const retrieveStoredTime = ()=> {
    const storedToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expirationTime')

    const remainingTime = calculateRemainingTime(storedExpirationDate)

    if(remainingTime <= 3600){
        localStorage.clear()
        return null
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredTime()
    let initialToken

    if(tokenData){
        initialToken = tokenData.token
    }

    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token

    const logoutHandler = () => {
        setToken(null)
        localStorage.removeItem('token')

        if(logoutTimer){
            clearTimeout(logoutTimer)
        }
    }

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('token',token)
        localStorage.setItem('expirationTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime)
    
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    }

    useEffect(()=> {
        if(tokenData){
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext