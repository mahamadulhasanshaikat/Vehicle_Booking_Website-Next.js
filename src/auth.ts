import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import { use } from "react"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            async authorize(credentials, requset) {
                if (!credentials.email || !credentials.password) {
                    throw Error("missing credentials!")
                }
                const email = credentials.email;
                const password = credentials.password as string
                await connectDB()
                const user = await User.findOne({ email })
                if (!user) {
                    throw Error("user doesn't exist!")
                }
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    throw Error("incorrect password")
                }
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            token.id = user.id,
            token.name = user.name,
            token.email = user.email,
            token.role = user.role

            return token
        }

    }
})