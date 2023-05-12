import React, { useState, useEffect } from 'react'
import BookList from './BookList'

function MyBooks({ currentUser, books, xx, checkInBook, checkOutBook }) {

  const [myCheckedOutBooks, setmyCheckedOutBooks] = useState([])


  return (
      <div className="container mx-auto bg-amber-200 rounded-xl border p-8 drop-shadow-3xl ">
        <h1>My Books</h1>
        <BookList books={xx} currentUser={currentUser} myBooks={true} checkInBook={checkInBook} checkOutBook={checkOutBook} />
    </div>
  )
}

export default MyBooks;