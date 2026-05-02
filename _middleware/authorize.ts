import { expressjwt as jwt } from 'express-jwt';
import config from '../config.json';
import db from '../_helpers/db';
const { secret } = config;

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt ({ secret, algorithms: ['HS256'] }),
        async (req: any, res: any, next: any) => {
            console.log('auth hit, req.auth:', req.auth);
            console.log('auth hit, req.user:', req.user);
            try {
                const account = await db.Account.findByPk(req.auth.id);
                console.log('account found:', account?.id, account?.role);
                
                if (!account || (roles.length && !roles.includes(account.role))) {
                    return res.status(401).json({message : 'Unauthorized'});
                }

                req.auth.roles = account.role;
                const refreshTokens = await account.getRefreshTokens();
                req.auth.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
                next();
            } catch(err) {
                console.log('authorize error:', err);
                next(err);
            }
        },
        async (req: any, res: any, next: any) => {
            const account = await db.Account.findByPk(req.auth.id);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({message : 'Unauthorized'});
            }

            req.auth.roles = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.auth.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
            next();
        }
    ];
}