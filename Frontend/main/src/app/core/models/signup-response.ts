// src/app/core/models/signup-response.ts
import { User } from './user';

export interface SignupResponse {
  message: string;
  user: User | null;
}
