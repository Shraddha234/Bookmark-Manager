const user = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bycrpt = require('bcrypt');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// dotenv.config();
let salt = 10

// Login Module
// exports.loginController = async (req, res) => {
//     try {
//       const data = await user.findOne({ email: req.body.email }); // Use email field for login
//       if (!data) {
//         res.status(200).send({ data: "User does not exist", status: false });
//         return;
//       } else {
//         // The token will expire after 30 minutes
//         let token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: '200m' });
//         let password = data.password;
//         let inpPassword = req.body.password;
//         bycrpt.compare(inpPassword.toString(), password, (err, response) => {
//           if (err) throw err;
//           if (response) {
//             return res.status(200).send({ data: "Successfully Logged in", status: true, token: token, expire: "20" });
//           }
//           return res.status(200).send({ data: "Password does not match", status: false, message: "Unsuccessful" });
//         });
//       }
//     } catch (error) {
//         console.error(error)
//       res.status(500).send({ message: "Something went wrong", data: error, status: false });
//     }
//   };
exports.loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the email and password fields are provided in the request body
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required', status: false });
      }
  
      // Find the user with the provided email in the database
      const data = await user.findOne({ email });
  
      // If the user is not found, respond with an error
      if (!data) {
        return res.status(404).json({ message: 'User does not exist', status: false });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = bycrpt.compare(password, data.password);
  
      // If the passwords don't match, respond with an error
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Password does not match', status: false });
      }
  
      // If the login is successful, generate a JWT token
      const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: '1y' });
  
      // Respond with a success message along with the token
      return res.status(200).json({
        message: 'Successfully logged in',
        status: true,
        token: token,
        expiresIn: '1y'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong', data: error, status: false });
    }
  };


// signup Module 
exports.signUpController = async (req, res) => {
    try {
        let password = req.body.password;
        bycrpt.hash(password.toString(), salt, async (err, hash) => {
            if (err) throw err;
            let data = {
                name: req.body.name,
                email: req.body.email,
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
        req.user = decode.data;
        next();
    })
}

// Authentication Token 
exports.checkTokenAuthentication = (req, res) => {
    try {
        const userData = req.user;
        return res.status(200).send({ message: "user is valid", data: "Authenticated", status: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}





