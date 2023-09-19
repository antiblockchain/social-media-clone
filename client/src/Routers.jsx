
import './App.css'

import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import { useState } from 'react';
import { UserProvider } from './components/authFunctions';
import Signup from './components/Signup';
import Nav from './components/Nav';
import Left from './components/Left';
import Right from './components/Right';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import SearchResults from './components/SearchResults';

const queryClient = new QueryClient()


function Routers() {
  const [user, setUser] = useState(null);

  



  const Layout = () => {
    return (
      
      <>
        <Nav></Nav>
        <div className="browser-window">
          <Left></Left>
          <Outlet></Outlet>
          {/* <Right></Right> */}

        </div>
        
        
        
      </>

    )
  };
 
  const AuthorizedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login"></Navigate>;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthorizedRoute> <Layout /></AuthorizedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/profile/:id/friends",
          element: <Profile />,
        },
        {
          path: "/search",
          element: <SearchResults/>,
        }
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <Signup />
    },
    {
      path: "*",
      element: <NotFound />
    }

  ]);
    



  return (
    <QueryClientProvider client={queryClient}>
      
<UserProvider value={{ user, setUser }}>
    <RouterProvider router={router}>

    </RouterProvider>
    
    </UserProvider>
    
<ReactQueryDevtools />
    </QueryClientProvider>

  )
}

export default Routers
