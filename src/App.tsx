// 导入路由
import { Router, Route, Switch,Redirect } from "react-router-dom";
import { customHistory } from './utils/history';
// 导入组件
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import "./App.scss";
function App() {
  return (
    <Router history={customHistory}>
      <div className="App">
        <Switch>
          <Route exact path="/" render={()=><Redirect to="home"/>}></Route> 
          <Route path="/home" component={Layout}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
