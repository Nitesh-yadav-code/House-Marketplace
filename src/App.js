import  {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import PrivateRouter from './components/PrivateRouter';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offer from './pages/Offer';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


function App() {
  return (
    <>
     <Router>
       <Routes>
         <Route path='/' element={<Explore/>} />
         <Route path='/offer' element={<Offer/>} />
         <Route path='/profile' element={<PrivateRouter/>}>

         <Route path='/profile' element={<Profile/>} />
         </Route>
         <Route path='/sign-in' element={<SignIn/>} />
         <Route path='/sign-up' element={<SignUp/>} />
         <Route path='/forgot-password' element={<ForgotPassword/>} />
       </Routes>
       <Navbar/>
     </Router>
     <ToastContainer/>
    </>
  );
}

export default App;
