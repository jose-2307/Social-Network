import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import RecoveryPassword from './components/RecoveryPassword';
import ChangePassword from './components/ChangePassword';
import MyCard from './components/Cards';
import Dashboard from './components/Recomendations';


const App = () => {

  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/recovery-password" element={<RecoveryPassword />}/>
        <Route path="/change-password" element={<ChangePassword />}/>
        <Route path="/recommendations" element={<Dashboard/>}/>
        <Route path="*" element={"404: ruta no encontrada"} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
