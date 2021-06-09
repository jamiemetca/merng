import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from 'semantic-ui-react'

import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import NotFound from "../Pages/NotFound";
import MenuBar from "../Components/MenuBar";
import AuthRoute from "../Util/AuthRoute";
import SinglePost from "../Pages/SinglePost";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <MenuBar />
        <Switch>
          <Route exact path="/" component={ Home }/>
          <AuthRoute exact path="/login" component={ Login }/>
          <AuthRoute exact path="/register" component={ Register }/>
          <Route exact path="/posts/:postId" component={ SinglePost } />
          <Route component={ NotFound }/>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
