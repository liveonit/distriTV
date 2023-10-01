import { z } from 'zod';

export const loginBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginBodyType = z.infer<typeof loginBodySchema>;


export const googleLoginBodySchema = z.object({
  tokenId: z.string()
});

export type GoogleLoginBodyType = z.infer<typeof googleLoginBodySchema>;
