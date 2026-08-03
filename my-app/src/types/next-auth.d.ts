import type { DefaultSession } from 'next-auth';

// The jwt callback in `@/auth` resolves the login email to a DB user_id and
// stores it on the token, so every session carries it through to the client.
declare module 'next-auth' {
  interface Session {
    user: {
      userId?: number;
    } & DefaultSession['user'];
  }
}

// `next-auth/jwt` only re-exports `@auth/core/jwt`, so the augmentation has to
// target the module that actually declares JWT.
declare module '@auth/core/jwt' {
  interface JWT {
    userId?: number;
  }
}
