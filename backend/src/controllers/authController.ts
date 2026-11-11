import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user nantinya akan diisi oleh authMiddleware
    const userId = (req as any).user.id; 
    const user = await authService.getMe(userId);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};