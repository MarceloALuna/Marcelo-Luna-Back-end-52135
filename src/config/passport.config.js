import passport from "passport";
import local from 'passport-local'
import UserModel from "../DAO/mongoManager/models/users.model.js";
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from "../utils.js";

/**
 * 
 * 
 * App ID: 375156

    Client ID: Iv1.42ae653ed8a66872
 *  Secret: 7eff1a591930fc3823944a2934e421ebdda6dba9
 */

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.a2ed1131a5cd0957',
            clientSecret: 'ea40aac0956c48f7d2eb7ab8e1a399dc34f75f7b',
            callbackURL: 'http://127.0.0.1:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            
            const email = profile._json.email

            try  {
                const user = await UserModel.findOne({ email })
                if(user) {
                    console.log('User already exits ' + email)
                    return done(null, user)
                }

                const newUser = {
                    name: profile._json.name,
                    email: {
                        type: String,
                        unique: true
                    },
                    password: '',
                    role: {
                        type: String,
                        default: 'user'
                    }
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch(e) {
                return done('Error to login wuth github' + e)
            }
        }
    ))

    // register Es el nomber para Registrar con Local
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    email: {
                        type: String,
                        unique: true
                    },
                    age: Number,
                    password: createHash(password),
                    role: {
                        type: String,
                        default: 'user'
                    }
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + e)
            }
        }
    ))

    // login Es el nomber para IniciarSesion con Local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport