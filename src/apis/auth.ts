const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export type Role = 'student' | 'tutor';

export type PurchasedCourse = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  format?: 'formal' | 'informal';
  tutor?: { _id: string; name: string; email: string } | string;
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
  fetch(`${API_BASE_URL}${path}`, {
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
  return data.user as User;
};

export const login = async (email: string, password: string, roleHint?: Role): Promise<User> => {
  const isTutor = roleHint === 'tutor' || email.toLowerCase().includes('tutor');
  const path = isTutor ? '/auth/tutor/login' : '/auth/student/login';
  const res = await json('POST', path, { email, password });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  const data = await res.json();
  return data.user as User;
};

export const logout = async (role: Role): Promise<void> => {
  const path = role === 'tutor' ? '/auth/tutor/logout' : '/auth/student/logout';
  await json('POST', path);
};

export const me = async (): Promise<User | null> => {
  // Try tutor first, then student
  const tutorRes = await fetch(`${API_BASE_URL}/auth/tutor/me`, { credentials: 'include' });
  if (tutorRes.ok) {
    const data = await tutorRes.json();
    return data.user as User;
  }
  const studentRes = await fetch(`${API_BASE_URL}/auth/student/me`, { credentials: 'include' });
  if (studentRes.ok) {
    const data = await studentRes.json();
    return data.user as User;
  }
  return null;
};

export const updateProfile = async (role: Role, updates: Partial<User>): Promise<User> => {
  const path = role === 'tutor' ? '/auth/tutor/me' : '/auth/student/me';
  const res = await fetch(`${API_BASE_URL}${path}`, {
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


