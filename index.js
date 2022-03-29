const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
app.use(express.json());
app.use(cors());

app.post('/signup-v3', async (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({ success: false, message: "reCaptcha token is missing" });
    }
    const secretKey = process.env.SECRET_KEY;
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;
    try {
        const { data } = await axios.post(googleVerifyUrl);
        if (!data.success) {
            return res.json({ success: false, message: "captcha verification failed" });
        }
        else if (data.score <= .5) {
            return res.json({ success: false, message: "You might be a bot. Sorry!", score: data?.score });
        }
        // here need to add signup funtionality

        return res.json({ success: true, message: "Signup successful", score: data?.score });

    } catch (e) {
        return res.status(400).json({ success: false, message: "reCaptcha error." });
    }
})


// app.post('/captcha', (req, res) => {

//     if (!req.body.captchaToken) {
//         console.log("err");
//         return res.json({ "success": false, "message": "Capctha is not checked" });

//     }

//     const secretKey = process.env.SECRET_KEY;
//     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captchaToken}`;

//     request(verifyUrl, (err, response, body) => {

//         if (err) { console.log(err); }

//         body = JSON.parse(body);
//         console.log(body, verifyUrl);
//         if (!body.success || body.success === undefined) {
//             return res.json({ "success": false, "message": "captcha verification failed" });
//         }
//         else if (body.score < 0.5) {
//             return res.json({ "success": false, "message": "you might be a bot, sorry!", "score": body.score });
//         }
//         return res.json({ "success": true, "message": "captcha verification passed", "score": body.score });

//     })

// });



app.listen(port, () => {
    console.log('server is now up!', port);
});