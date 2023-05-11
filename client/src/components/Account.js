import React from 'react'
import { NavLink } from "react-router-dom";

function Account({ currentUser, setCurrentUser, onLogout }){
   
   
    return(
        <div>
            { currentUser ? (
                <div>
                    <br />
                    <div><h2><b>Logged in as:</b></h2></div>
                    <div>Name: {currentUser.fname} {currentUser.lname}</div>
                    <div>Email: {currentUser.email}</div>
                    <div>Phone: {currentUser.phone}</div>
                    <br />
                    <div className='flex justify-center items-center'><button><NavLink className='NavLink' to ='/edituser'>Update My Account</NavLink></button></div>
                    <div className='flex justify-center items-center'><button>Logout</button></div>
                </div>) : (
                <div>
                    <br />
                    <div className='flex justify-center items-center'><NavLink className='NavLink' to = '/login'><button>Login</button></NavLink></div>
                    <div className='flex justify-center items-center'><NavLink className='NavLink' to = '/createaccount'><button>Create an Account</button></NavLink></div>
                </div>)}
        </div>
    )
}

export default Account;