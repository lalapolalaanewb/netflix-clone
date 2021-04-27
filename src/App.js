import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'

function App() {
  const user = null

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <Route path="*" component={() => "404 Page Not Found!"} />
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
