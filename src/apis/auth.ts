const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export type Role = 'student' | 'tutor';

export type PurchasedCourse = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  format?: 'formal' | 'informal';
  tutor?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  // optional profile fields
  bio?: string;
  expertise?: string;
  interests?: string;
  purchasedCourses?: PurchasedCourse[];
};

const json = (method: string, path: string, body?: unknown) =>
  fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

export const signup = async (name: string, email: string, password: string, role: Role): Promise<User> => {
  const path = role === 'tutor' ? '/auth/tutor/signup' : '/auth/student/signup';
  const res = await json('POST', path, { name, email, password });
  if (!res.ok) throw new Error(`Signup failed (${res.status})`);
  const data = await res.json();
  const user = data.user as User;
  // Store the role in localStorage for future use
  localStorage.setItem('userRole', user.role);
  return user;
};

export const login = async (email: string, password: string, roleHint?: Role): Promise<User> => {
  const isTutor = roleHint === 'tutor' || email.toLowerCase().includes('tutor');
  const path = isTutor ? '/auth/tutor/login' : '/auth/student/login';
  const res = await json('POST', path, { email, password });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  const data = await res.json();
  const user = data.user as User;
  // Store the role in localStorage for future use
  localStorage.setItem('userRole', user.role);
  return user;
};

export const logout = async (role: Role): Promise<void> => {
  const path = role === 'tutor' ? '/auth/tutor/logout' : '/auth/student/logout';
  await json('POST', path);
  // Clear the stored role
  localStorage.removeItem('userRole');
};

export const me = async (): Promise<User | null> => {
  // Check if we have a stored role in localStorage to avoid unnecessary API calls
  const storedRole = localStorage.getItem('userRole');
  
  if (storedRole === 'tutor') {
    try {
      const tutorRes = await fetch(`${API_BASE_URL}/api/auth/tutor/me`, { credentials: 'include' });
      if (tutorRes.ok) {
        const data = await tutorRes.json();
        return data.user as User;
      }
    } catch (error) {
      console.log('Tutor auth failed, trying student...');
    }
  }
  
  if (storedRole === 'student' || !storedRole) {
    try {
      const studentRes = await fetch(`${API_BASE_URL}/api/auth/student/me`, { credentials: 'include' });
      if (studentRes.ok) {
        const data = await studentRes.json();
        return data.user as User;
      }
    } catch (error) {
      console.log('Student auth failed, trying tutor...');
    }
  }
  
  // Fallback: try both if no stored role or if the specific role failed
  if (!storedRole) {
    try {
      const tutorRes = await fetch(`${API_BASE_URL}/api/auth/tutor/me`, { credentials: 'include' });
      if (tutorRes.ok) {
        const data = await tutorRes.json();
        return data.user as User;
      }
    } catch (error) {
      // Ignore error, try student
    }
    
    try {
      const studentRes = await fetch(`${API_BASE_URL}/api/auth/student/me`, { credentials: 'include' });
      if (studentRes.ok) {
        const data = await studentRes.json();
        return data.user as User;
      }
    } catch (error) {
      // Ignore error
    }
  }
  
  return null;
};

export const updateProfile = async (role: Role, updates: Partial<User>): Promise<User> => {
  const path = role === 'tutor' ? '/auth/tutor/me' : '/auth/student/me';
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const data = await res.json();
  return data.user as User;
};

export default { signup, login, logout, me, updateProfile };


