import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import { JWT_SECRET } from '../utils/utils.js';
import config from './config.js';

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
}

export const init = () => {
    const registerOptions = {
        usernameField: 'email',
        passReqToCallback: true,
    };
    passport.use('register', new LocalStrategy(registerOptions, async (req, email, password, done) => {
        const {
            body: {
                first_name,
                last_name,
                age,
            },
        } = req;
        if (
            !first_name ||
            !last_name ||
            !email ||
            !password
        ) {
            return done(new Error('Todos los campos son requqeridos.'));
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return done(new Error(`Ya existe un usuario con el correo ${email} en el sistema`));
        }

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
        })
        done(null, newUser);
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return done(new Error('Correo o contraseña invalidos'));
        }
        if (!isValidPassword(password, user)) {
            return done(new Error('Correo o contraseña invalidos'));
        }
        done(null, user);
    }));

    const githubOpts = {
        clientID: config.clientID,  /*'Iv1.3d6e2c5b9a335f7e'*/
        clientSecret: config.clientSecret, /*"d24ecc4e78fc36a6d32ee81cd3522c446e84b6d7"*/
        callbackURL: config.callbackURL, /*'http://localhost:8080/api/sessions/github/callback'*/
    };
    
    passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await UserModel.findOne({ email });
        if (user) {
            return done(null, user);
        }

        user = {
            first_name: profile._json.name,
            last_name: '',
            email,
            password: '',
            age: 18,
        };

        const newUser = await UserModel.create(user);
        done(null, newUser);
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (uid, done) => {
        const user = await UserModel.findById(uid);
        done(null, user);
    });

    const jwtOptions = {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    };
    
    passport.use('jwt', new JWTStrategy(jwtOptions, (payload, done) => {
        return done(null, payload);
    }));
}