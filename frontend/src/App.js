import './App.css';
// import { Button } from "./components/ui/button";
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import { Toaster } from '../src/components/ui/toaster';

function App() {
  return (
    <div className="App">
      <Route path='/' component={Homepage} exact />
      <Route path='/chats' component={ChatPage} />
      <Toaster/>
    </div>
  );
}

export default App;
