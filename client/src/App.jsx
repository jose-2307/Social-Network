import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import RecoveryPassword from './components/RecoveryPassword';
import ChangePassword from './components/ChangePassword';
import Comments from './components/Comments';

const App = () => {

  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/recovery-password" element={<RecoveryPassword />}/>
        <Route path="/change-password" element={<ChangePassword />}/>
        <Route path="/:id/comments" element={<Comments />}/>
        <Route path="*" element={"404: ruta no encontrada"} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
