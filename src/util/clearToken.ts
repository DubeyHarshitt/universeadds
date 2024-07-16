import React from 'react'
import { useNavigate } from 'react-router'

function clearToken() {
    const navigate = useNavigate()
    localStorage.removeItem('token')
    navigate("/login")
}

export default clearToken