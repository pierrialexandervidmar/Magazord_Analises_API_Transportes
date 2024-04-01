//import './App.css';
import Navbar from './components/layout/navbar';
import CalculoAnalises from './pages/CalculoAnalises';
import Home from './pages/Home';
import MultiplosClientes from './pages/MultiplosClientes';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/multiplosclientes">
            <MultiplosClientes />
          </Route>
          <Route path="/calculosanalises">
            <CalculoAnalises />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
