import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const result = await res.json()
        
        if (res.ok && result.status) {
          return {
            id: result.data.token as string,
            email: result.data.email as string,
            name: result.data.userName as string,
            role: result.data.role as string,
            language: result.data.language as number,
            token: result.data.token as string
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role as string
        token.language = user.language as number
        token.accessToken = user.token as string
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.language = token.language as number
        session.accessToken = token.accessToken as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
