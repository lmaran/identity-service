import * as nosql2 from "nosql";
const nosql = nosql2.load("database.nosql");
import tokenService from "../components/token/token.service";

export const getAccessToken = async (req, res, next) => {
    // check the auth header first
    const auth = req.headers.authorization;
    let inToken;
    if (auth && auth.toLowerCase().indexOf("bearer") === 0) {
        inToken = auth.slice("bearer ".length);
    } else if (req.body && req.body.access_token) {
        // not in the header, check in the form body
        inToken = req.body.access_token;
    } else if (req.query && req.query.access_token) {
        inToken = req.query.access_token;
    }

    console.log("Incoming token: %s", inToken);

    // nosql.one().make(filter => {
    //     filter.where("access_token", inToken);
    //     filter.callback((err, token) => {
    //         if (token) {
    //             console.log("We found a matching token: %s", inToken);
    //         } else {
    //             console.log("No matching token was found.");
    //         }
    //         req.access_token = token;
    //         next();
    //         return;
    //     });
    // });

    const token = await tokenService.getAccessToken(inToken);
    if (token) {
        console.log("We found a matching token: %s", inToken);
    } else {
        console.log("No matching token was found.");
    }
    req.access_token = token;
    next();
    return;

};

export const requireAccessToken = (req, res, next) => {
    if (req.access_token) {
        next();
    } else {
        res.status(401).end();
    }
};
