import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './features/Login/Login';
import Mint from './features/Mint/Mint';

export default function App() {
  return (
    <Container maxWidth='md'>
      <BrowserRouter>
        <Box sx={{ minHeight: '50px' }} />
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='mint' element={<Mint />} />

          <Route path='*' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}
