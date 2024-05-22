import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button variant="outlined" color="primary" onClick={() => loginWithRedirect()} sx={{color:'white'}}>
      Log In
    </Button>
  );
};

export default LoginButton;
