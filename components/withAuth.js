import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        loginWithRedirect();
      }
    }, [isAuthenticated, isLoading, loginWithRedirect]);

    if (isLoading || !isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
