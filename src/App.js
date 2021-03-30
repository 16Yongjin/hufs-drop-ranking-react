import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import List from './views/List'
import Detail from './views/Detail'
import Home from './views/Home'
import Search from './views/Search'
import { useStore } from './store'

function App() {
  const fetchLectures = useStore((state) => state.fetchLectures)

  useEffect(() => {
    fetchLectures()
  })

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/list/:campusType">
            <List />
          </Route>
          <Route path="/detail/:id">
            <Detail />
          </Route>
          <Route path="/search/:query">
            <Search />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
