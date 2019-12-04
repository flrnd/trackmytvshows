/* Going to keep this file just in case I use auth0 service again.
 * but this can be marked as deprecated.
 *
 * Check: verifyToken.ts instead.
 */

//import jwt from "express-jwt";
//import jwksRsa from "jwks-rsa";
//
//const token = process.env.AUTH_TOKEN;
//
//// Auth
//export const checkJwt = jwt({ secret: process.env.JWT_SECRET });
//export const checkJwt = jwt({
//  secret: jwksRsa.expressJwtSecret({
//    cache: true,
//    rateLimit: true,
//    jwksRequestsPerMinute: 5,
//    jwksUri: process.env.AUTH0_JWKS_URI,
//  }),
//  audience: process.env.AUTH0_AUDIENCE,
//  issuer: process.env.AUTH0_ISSUER,
//  algorithms: ["RS256"],
//});
