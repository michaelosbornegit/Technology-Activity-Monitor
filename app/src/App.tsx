import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './features/Login/Login';
import Home from './features/Home/Home';

export default function App() {
  return (
    <Container maxWidth='lg'>
      <BrowserRouter>
        <Box sx={{ minHeight: '50px' }} />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />

          <Route path='*' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}
