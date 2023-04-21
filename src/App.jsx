import {createHashRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import MasterLayout from './Components/MasterLayout/MasterLayout';
import ParticlesComponent from './Components/Particles/Particles';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Register from './Components/Register/Register';

function App() {
  const routes=createHashRouter([
    {path:'',element:<MasterLayout/>,children:([

    {index:true,element:<ProtectedRoute><Home/></ProtectedRoute> },
      {path:'register',element:<Register/>},
      {path:'login',element:<Login/>},
      
    ])}
  ])
  return (
 <>
<RouterProvider router={routes} />
<ParticlesComponent/>
 </>
  );
}

export default App;
