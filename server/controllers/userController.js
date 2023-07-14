// const dotenv = require('dotenv');
// const got = require('got');
// const fetch = require('node-fetch');
const user = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bycrpt = require('bcrypt');
const axios = require('axios');

// dotenv.config();
let salt = 10

// Login Module
exports.loginController = async (req, res) => {
    try {
        let data = await user.find({ name: req.body.name });
        if (data.length === 0) {
            res.status(200).send({ data: "user doesnot exists", status: false })
            return;
        }
        else {
            // The token will expire after 30min 
            let token = jwt.sign({ data }, "jwt-key", { expiresIn: '30m' });
            let password = data[0].password;
            let inpPassword = req.body.password;
            bycrpt.compare(inpPassword.toString(), password, (err, response) => {
                if (err) throw err;
                if (response) {
                    return res.status(200).send({ data: "Successfully Login ", status: true, token: token, expire: "20" });
                }
                return res.status(200).send({ data: "password doesnot Match", status: false, message: "Unsuccesssful" });

            })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", data: error, status: false });
    }
}


// signup Module 
exports.signUpController = async (req, res) => {
    try {
        let password = req.body.password;
        bycrpt.hash(password.toString(), salt, async (err, hash) => {
            if (err) throw err;
            let data = {
                name: req.body.name,
                password: hash,
            }

            let UserData = await user.create(data);
            res.status(200).send({ data: UserData, status: true, message: "Successfull " });

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ data: error, message: "Unsuccessfull, something went wrong", status: false });
    }
}

// Request Url function for SSO 
exports.requestUrl = async (url) => {
    try {
        let data = await axios.get(url).then((resp) => {
            return resp.data;
        }).catch((err) => {
            console.log(err);
            return err;
        });
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

// SSO Login Module
exports.ssoLoginController = async (req, res) => {
    try {
        let token = req.body.token;
        res.status(200).send({ data: token, message: "Successfull", status: true });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong", status: false, data: error })
    }
}

// Verifying Token
exports.verifyJwt = (req, res, next) => {
    let token = req.headers['access-token'];
    // let token = req.body.token;
    if (!token) {
        // return res.send();
        return res.send({ data: "Token is not found", message: "user is not valid", status: false });
    }
    jwt.verify(token, "jwt-key", (err, decode) => {
        if (err) {
            return res.send({ data: "Not Authenticated", message: "user is not valid", status: false });
        }
        req.name = decode.name;
        next();
    })
}

// Authentication Token 
exports.checkTokenAuthentication = (req, res) => {
    try {

        return res.status(200).send({ message: "user is valid", data: "Authenticated", status: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}





