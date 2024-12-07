const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin");

router.get('/', (req, res) => {
    res.send("hello")
})

router.post("/signup", (req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({error: "Please add all the fields" })
    }

    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exist with that email or userName" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new USER({
            name,
            email,
            userName,
            password: hashedPassword
        })
    
        user.save()
        .then(user => { res.json({ message: "Registered successfully" }) })
        .catch(err => { console.log(err) })
        })
    })  
})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" })
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                // return res.status(200).json({ message: "Signed in Successfully" })
                const token = jwt.sign({_id:savedUser.id},Jwt_secret)
                const {_id,name,email,userName} = savedUser

                res.json({token,user:{_id,name,email,userName}})

                console.log({token,user:{_id,name,email,userName}}) 
            } else {
                return res.status(422).json({ error: "Invalid password" })
            }
        })
            .catch(err => console.log(err))
    })
})

router.post("/googleLogin", (req, res) => {
    const { email_verified, email, name, clientId, userName, Photo } = req.body;

    if (!email_verified) {
        return res.status(400).json({ error: "Email verification failed" });
    }

    USER.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                // If the user already exists, generate a token and send user details back
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
                const { _id, name, email, userName } = savedUser;
                res.json({ token, user: { _id, name, email, userName } });
            } else {
                // Create a new user if not found
                const password = email + clientId; // Temporary password generation
                const newUser = new USER({
                    name,
                    email,
                    userName,
                    password,
                    Photo
                });

                newUser.save()
                    .then((user) => {
                        const token = jwt.sign({ _id: user._id.toString() }, Jwt_secret);
                        const { _id, name, email, userName } = user;
                        res.json({ token, user: { _id, name, email, userName } });
                    })
                    .catch((err) => {
                        console.error("Error saving user:", err);
                        res.status(500).json({ error: "Error saving user. Please try again." });
                    });
            }
        })
        .catch((err) => {
            console.error("Error finding user:", err);
            res.status(500).json({ error: "Error finding user. Please try again." });
        });
});


module.exports = router;