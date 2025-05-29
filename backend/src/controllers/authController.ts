import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('[REGISTER] Attempt:', { email, password: password ? '***' : undefined });
  if (!email || !password) {
    console.log('[REGISTER] Missing email or password');
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('[REGISTER] Supabase error:', error);
    return res.status(400).json({ error: error.message });
  }
  console.log('[REGISTER] Success:', data.user?.id);
  return res.status(201).json({ user: data.user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  return res.status(200).json({ session: data.session, user: data.user });
}; 