import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Stock from './pages/Stock.js';
import AddStock from './pages/ModifyStock.js';
import Sales from './pages/Sales.js';
import Bill from './pages/Bill.js';
import Bill_id from './pages/Bill_id.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='/modifyStock' element={<AddStock />} />
        <Route path='/modifyStock/:id' element={<AddStock />} />
        <Route path='/stock' element={<Stock />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/sales/bill/:No' element={<Bill />} />
        <Route path='/sales/:id' element={<Bill_id />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
