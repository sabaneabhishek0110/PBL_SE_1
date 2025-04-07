import { useState} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import Set_Password from './Pages/Set_Password';
import Layout from './Components/Layout';
import Dashboard from './Pages/Dashboard';
import To_Do_List from './Pages/To_Do_List'
import ProfilePage from './Pages/ProfilePage';
import YourTeams from './Pages/YourTeams';
import TaskDrawer from './Pages/TaskDrawer';
import TextEditor from './Pages/TextEditor'
import Your_Documents from './Pages/Your_Documents';


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Toaster 
        toastOptions={{
          style: {
              background: "black",
              color: "white",
              width : "400px",
              height : "80px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/AuthPage" element={<AuthPage />}/>
        <Route path="/set-Password" element={<Set_Password />}/>
        <Route path="/textEditor/:id/:accessType" element={<TextEditor />}/>
        {/* <Route path="/taskDrawer" element={<TaskDrawer />}/> */}
        
        <Route path='/' element={<Layout />}>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path='profile' element={<ProfilePage />}/>
          <Route path="to_Do_List" element={<To_Do_List/>}/>
          <Route path='your_Teams' element={<YourTeams />}/>
          <Route path='your_documents' element={<Your_Documents />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
