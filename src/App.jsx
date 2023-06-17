import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditorPage from './comopnents/EditorPage';
import Home from './comopnents/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/editor/:roomId' element={<EditorPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App