import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Switch} from "react-router-dom";
import UserPages from "./UserComponents/UserPages";
import Hyrje from './NormalComponents/Hyrje';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/User/" component={UserPages} />
          <Route path="/" component={Hyrje} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
