import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'RECRUITER') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/tests');
    }
  }, [navigate, role]);

  return null;
}
