import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import MyBooks from './components/MyBooks'
import Account from './components/Account'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'
import EditUser from './components/EditUser'
import Cookies from "js-cookie";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import API_URL from "./apiConfig.js";
import NavBar from './components/NavBar';
import './App.css';

function App() {


  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetch(`${API_URL}/get-user-data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          console.log("Use Effect Token called")
          console.log(data);
          const newCookiedUser = { id: data.id, email: data.email, fname: data.fname, lname: data.lname, phone: data.phone}
          setCurrentUser(newCookiedUser);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

    const handleLogin = (newEmail) => {
      const newLoggedInUser = users.map(user => {
        if (user.email == newEmail) {
          return user;
        }
      })
      setCurrentUser(newLoggedInUser[0]);
      }

  function checkOutBook(r) {
    const updatedBooks = books.map(bookObj => {
      if ((bookObj.id) == (r.book_id)) {
        bookObj.checkout_log = true;
        bookObj.checkout_id = r.checkout_id;
        bookObj.user_id = r.user_id;
        return bookObj;
      } else {
        return bookObj;
      }
    });
    setBooks(updatedBooks);
  }

  function checkInBook(deleteID) {
    const updatedBooks = books.map(bookObj => {
      if ((bookObj.checkout_id) == (deleteID)) {
        bookObj.checkout_log = false;
        bookObj.checkout_id = null;
        bookObj.user_id = null;
        return bookObj;
      } else {
        return bookObj;
      }
    });
    setBooks(updatedBooks);
    //mybooks = books.filter(bookObj => bookObj.user_id == currentUser.id)
  }

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(r => r.json())
      .then(setUsers)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then(r => r.json())
      .then(setBooks)
  }, [])

  const navigate = useNavigate();


  function handleLogout() {
    fetch(`${API_URL}/logout`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(setCurrentUser(''))
      .then(navigate("/"))
      .then(Cookies.remove("token"))
  }

  let mybooks = books.filter(bookObj => bookObj.user_id == currentUser.id)

  return (
    <div className="App bg-yellow-50 h-screen">

      <NavBar currentUser={currentUser} />
      <Routes>
        <Route exact path="/mybooks" element={<MyBooks currentUser={currentUser} books={books} xx={mybooks} checkInBook={checkInBook} checkOutBook={checkOutBook} />} />
        <Route exact path="/account" element={
          <Account currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
        } />
        <Route exact path="/login" element={
          <Login users={users} currentUser={currentUser} setCurrentUser={setCurrentUser} handleLogin={handleLogin} />
        } />
        <Route exact path="/createaccount" element={
          <CreateAccount />
        } />
        <Route exact path="/edituser" element={
          <EditUser currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
        } />
        <Route exact path="/" element={
          <Home books={books} currentUser={currentUser} setCurrentUser={setCurrentUser} checkOutBook={checkOutBook} checkInBook={checkInBook} />
        } />
      </Routes>

    </div>
  );
}

export default App;
