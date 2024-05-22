import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';

const CallbackPage = () => {
  const router = useRouter();
  const { isLoading, error, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoading && !error && !isAuthenticated) {
        await loginWithRedirect();
      } else if (!isLoading && !error && isAuthenticated) {
        router.push('/');
      }
    };

    handleRedirect();
  }, [isLoading, error, isAuthenticated, loginWithRedirect, router]);

  return null;
};

export default CallbackPage;
