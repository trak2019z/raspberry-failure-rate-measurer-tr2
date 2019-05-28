//--- Requires ---//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");

//-- Methods --//
exports.createUser = (request, response, next) => {
    User.findOne({ login: request.body.login })
    .then(login => {
        if(login === null && (request.body.password === request.body.repeatpassword)) {
            bcrypt.hash(request.body.password, 10)
            .then(hash => {
                const user = new User({
                    login: request.body.login,
                    password: hash,
                    isAdmin: 0,
                    isActive: 0
                });
                user.save()
                .then(result => {
                    response.status(201).json({
                        code: 201,
                        message: "Account created",
                        result: result
                    });
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'fkuca91@gmail.com',
                            pass: 'Smoki666'
                        }
                    })
                    const mailOptions = {
                        from: 'fkuca91@gmail.com',
                        to: 'fkuca91@gmail.com',
                        subject: 'RFRM - New user',
                        text: 'A new user has created account in RFRM. Log in to activate it.',
                        replyTo: 'fkuca91@gmail.com'
                    }
                    transporter.sendMail(mailOptions, function(err, res) {
                        if(err) {
                            console.log('Nodemailer ERROR: ', err)
                        } else {
                            console.log('Nodemailer SUCCESS: ', res)
                        }
                    })
                })
                .catch(err => {
                    response.status(500).json({
                        message: "Invalid authentication credentials"
                    })
                })
            })
        } else {
            return response.status(500).json({
                message: "Invalid authentication credentials"
            })
        }
    })
}

exports.loginUser = (request, response, next) => {
    let fetchedUser;
    User.findOne({ login: request.body.login })
    .then(user => {
        if(!user) {
            return response.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        if(user && user.isActive === 0) {
            return response.status(403).json({
                message: "Account disabled"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(request.body.password, user.password);
    })
    .then(result => {
        if(!result) {
            return response.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        const token = jwt.sign(
            {
                login: request.body.login
            },
            "secret",
            {
                expiresIn: "1h"
            }
        );
        response.status(201).json({
            token: token,
            tokenLifespan: 3600,
            id: fetchedUser._id,
            login: fetchedUser.login,
            isAdmin: fetchedUser.isAdmin
        });
    })
    .catch(error => {
        response.status(401).json({
            message: "Invalid authentication credentials"
        })
    })
}