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

    const verifyAuth = async () => {
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
          } else {
            dispatch(logout());
          }
          setIsCheckingAuth(false);
        }
      } catch (error) {
        if (isMounted) {
          dispatch(logout());
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
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