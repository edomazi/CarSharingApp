import React from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SignIn from './components/SignIn.js'
import SignUp from './components/SignUp.js'
import Homepage from './components/Homepage.js'
import Dashboard from './components/Dashboard.js'
import {UIStore} from "../store/store";
import Profile from "./components/Profile";
import Payment from "./components/Payment";


const App = () => {
  const isLoggedin = UIStore.useState(s => s.isLoggedin);

  return (
    <Router>
      <Switch>
        <Route path="/signin" exact component={SignIn}/>
        <Route path="/signup" exact component={SignUp}/>
        <Route path="/profile" exact component={Profile}/>
        <Route path="/payment" exact component={Payment}/>
        <Route path="/dashboard" exact  render={(props) => (
          <Dashboard {...props} isLoggedin={isLoggedin} />
        )}>
        </Route>
        <Route path="/" exact component={Homepage}/>
      </Switch>
    </Router>
  );
}

export default App;
