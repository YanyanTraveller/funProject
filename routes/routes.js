const express = require('express');
const appController = require('../controllers/llmController.js');
const fs = require("fs");
const path = require("path");
const router = express.Router();


router.get('/refreshToken', appController.getToken);

router.get('/api/llm-test', appController.test);
router.get('/api/searchResult', async (req,res)=>{
    const fileList = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/images.json"))); 

    let prompt = ""; 

    for (const file of fileList) {
        prompt += "name: " + file.name + "\n" + "url: " + file.url + "\n";
        prompt += "\n";
    }

    prompt += "query: " + req.query.query + "\n";
    prompt += "\n";

    prompt += "result (in JSON format, name and url fields):\n"

    console.log(prompt);

    const responseJSON = await appController.sendRequest(prompt);

    console.log(responseJSON);

    const data = JSON.parse(responseJSON.choices[0].text);


    res.render("result",{data:data, query: req.query.query});
});

module.exports = router;