import UserModel from "../DAO/mongoManager/models/users.model.js";
import { Router } from "express"
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";

const router = Router()

// router.get('/', (req, res) => { 
//     res.render('', {}) 
// })

// URL para render
router.get('/login', (req, res) => { res.render('login', {}) })
router.get('/register', (req, res) => { res.render('register', {}) })


// Iniciar Session
router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {

    if (!user) return res.status(400).json({message:'Invalid Credentials'})
    req.session.user = req.user

    return res.redirect('/profile')
})

// Cerrar sesion
router.delete('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) {
            return res.json({status:'Logout ERROR', body: error})
        }
        res.send('Logout OK!')
    })
})


// Registro
router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register', }),
    async (req, res) => {
        res.redirect('/login')
    }
)

// Profile
function auth(req, res, next) {
    if (req.session?.user) next()
    else res.redirect('/login')
}
router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user)
})


// GITHUB
router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email'] }),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log(req.session)
        res.redirect('/profile')
    }
)


export default router
