import React, { useState } from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('UserID');
    if (userId) {
      navigate('/contests');
    }
  }, [navigate]);

  const handleSubmit = () => {
    if (!email) {
      setError('Please fill the email in above text');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
    } else {
      localStorage.setItem('UserID', email);
      setError('');
      alert('Email stored successfully');
      navigate('/contests');
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
      sx={{ backgroundColor: 'rgba(135, 153, 183, 0.88)' }}
    >
      <Typography variant="h4" color="white" gutterBottom>
        WelCome To TLE
      </Typography>
      <TextField 
        label="Email" 
        variant="outlined" 
        sx={{ marginBottom: 2 }} 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Login
      </Button>
    </Box>
  );
}

export default Home;