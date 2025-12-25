import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LineProvider from 'next-auth/providers/line';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      checks: ["state"],
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // 首次登入時，user 物件存在
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      // 將 token 資料傳遞給 session
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log('[NextAuth Redirect] url:', url);
      console.log('[NextAuth Redirect] baseUrl:', baseUrl);

      // 如果 URL 包含 callbackUrl 參數，使用它進行重定向
      if (url.startsWith(baseUrl)) {
        console.log('[NextAuth Redirect] ✅ URL starts with baseUrl, returning:', url);
        return url;
      }

      // 檢查是否有 callbackUrl 查詢參數
      const urlObj = new URL(url, baseUrl);
      const callbackUrl = urlObj.searchParams.get('callbackUrl');
      if (callbackUrl) {
        const redirectUrl = `${baseUrl}${callbackUrl}`;
        console.log('[NextAuth Redirect] ✅ Found callbackUrl, redirecting to:', redirectUrl);
        return redirectUrl;
      }

      console.log('[NextAuth Redirect] ⚠️ No callback, returning baseUrl:', baseUrl);
      return baseUrl;
    },
  },
});
