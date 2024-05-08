import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from './pages/App/App'
import './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Router>
      <App />
	  <ToastContainer autoClose={100} />
    <ToastContainer />
    </Router>
  </React.Fragment>,
)
