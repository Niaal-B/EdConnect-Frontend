import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores/store';
import api from '../lib/api';
import { logout, loginSuccess } from '../stores/authslice';

function PrivateRoute({ children,role }: { children: JSX.Element,role:string }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const loginUrl = `/${role}/login`;

  useEffect(() => {
    let isMounted = true; 
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 300; // 300ms delay between retries

    const verifyAuth = async (isRetry = false) => {
      try {
        const response = await api.get('auth/check-session');
        if (isMounted) {
          if (response.data.valid && response.data.user.role == role) {
            dispatch(loginSuccess({
              id: response.data.user.id,
              email: response.data.user.email,
              username: response.data.user.username,
              role: response.data.user.role,
              profile_image : response.data.user.profile_picture,
              is_verified:response.data.user.is_verified
            }));
            setIsCheckingAuth(false);
          } else {
            dispatch(logout());
            setIsCheckingAuth(false);
          }
        }
      } catch (error) {
        // If first attempt fails and we haven't exceeded retries, wait and retry
        // This handles the case where cookies aren't ready yet after Google OAuth redirect
        if (!isRetry && retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            if (isMounted) {
              verifyAuth(true);
            }
          }, retryDelay);
        } else {
          // All retries exhausted or already retried, log out
          if (isMounted) {
            dispatch(logout());
            setIsCheckingAuth(false);
          }
        }
      }
    };

    // Small initial delay to allow cookies to be processed after redirect
    const timer = setTimeout(() => {
      verifyAuth();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [dispatch, location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to={loginUrl} replace />;
}

export default PrivateRoute;