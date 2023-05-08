import React, {useState, useEffect} from 'react'
import Home from './components/Home'
import MyBooks from './components/MyBooks'
import Account from './components/Account'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import API_URL from "./apiConfig.js";
import './App.css';

function App() {

  const [books, setBooks] = useState([])

  useEffect( () => {
    fetch(`${API_URL}/books`)
      .then( r => r.json() )
      .then( setBooks )
  }, [] )
  console.log(books)
  
  return (
    <div className="App">
        <Switch>
          <Route exact path="/mybooks">
            <MyBooks/>
          </Route>
          <Route exact path="/account">
            <Account />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/createaccount">
            <CreateAccount />
          </Route>
          <Route exact path= "/">
            <Home books={books}/>
          </Route>
        </Switch>
    </div>
  );
}

export default App;
