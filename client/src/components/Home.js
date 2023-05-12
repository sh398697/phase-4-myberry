import React from 'react'
import NavBar from './NavBar'
import BookList from './BookList'
import './Home.css'

function Home({books, currentUser, setCurrentUser, checkOutBook, checkInBook}) {
    return(
        <div className="container mx-auto bg-gray-200 rounded-xl border p-8">
            <h1>Welcome to MyBerry Digital Library</h1>
            <BookList books={books} currentUser={currentUser} myBooks={false} checkInBook={checkInBook} checkOutBook={checkOutBook}/>
        </div>
    )
}

export default Home 