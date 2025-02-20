const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/3572c2150c";
    const options = {
        method: "POST",
        auth: "Sahil:a47298a693c573bfe2be7b521b8d0ac0-us21",
    };

    const mailchimpRequest = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.send("Successfully subscribed!");
        } else {
            res.send("There was an error.");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
