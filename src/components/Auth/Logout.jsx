import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from "../../components/Spinner";

const Logout = () => {

    const navigate = useNavigate();
    useEffect(()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');


        navigate('/');

    },[navigate]);
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg"><Spinner/></p>
    </div>
    </>
  )
}

export default Logout
