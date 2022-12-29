import { Request, Response } from 'express';
import { encryptPassword } from '../services/userService';
import { generateToken } from '../utils/handleToken';

async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const id = await encryptPassword({ name, email, password });

  res.status(201).send({ id });
}

async function signin(_req: Request, res: Response) {
  const { id, name } = res.locals.user;

  const refreshToken = generateToken({ id, name, type: 'refresh' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.sendStatus(200);
}

async function reauthenticate(_req: Request, res: Response) {
  const { id, name } = res.locals.payload;

  const accessToken = generateToken({ id, name, type: 'access' });

  res.status(200).send({ accessToken });
}

export { signup, signin, reauthenticate };
