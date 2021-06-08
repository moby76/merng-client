// import logo from './logo.svg';

import { Route, BrowserRouter } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import './App.css';
import MenuBar from './components/MenuBar';
import { Container } from 'semantic-ui-react'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';//HOC - обработчик для редиректа в зависимости от состояния пользователя(в системе/не в системе)
import SinglePost from './pages/SinglePost';

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/login" component={Login} /> */}
          <AuthRoute exact path="/login" component={Login} />
          {/* <Route exact path="/register" component={Register} /> */}
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
