// Mock auth options for development
export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      return session;
    },
    async jwt({ token, user }: any) {
      return token;
    }
  }
}; 