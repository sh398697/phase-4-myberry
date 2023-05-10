import React from 'react'
import NavBar from './NavBar'
import BookList from './BookList'
import './Home.css'

function Home({books, currentUser, setCurrentUser, checkOutBook, checkInBook}) {
    return(
    <div>
        <BookList books={books} currentUser={currentUser} myBooks={false} checkInBook={checkInBook}  checkOutBook={checkOutBook}/>
    </div>
    )
}

export default Home 