import { useEffect, useState } from 'react';
import api from "@/lib/api";
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '@/stores/authslice';

interface User {
  id: number;
  email: string;
  role: string;        // 👈 role of user (mentor/student/admin)
  is_verified: boolean; // 👈 if you send mentor verification status
  [key: string]: any;   // in case there are extra fields
}

export const useAuthVerification = () => {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/check-session');
        if (res.data.valid) {
          setUser(res.data.user);        
          console.log(res.data.user,"this is user in userverif")
          dispatch(loginSuccess(res.data.user));
        } else {
          setUser(null);
          dispatch(logout());
        }
      } catch {
        setUser(null);
        dispatch(logout());
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [dispatch]);

  return { checking, user };  
};
