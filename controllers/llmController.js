"use strict";

const fs = require("fs");
const path = require("path");

const ENDPOINT = "https://httpqas26-frontend-qasazap-prod-dsm02p.qas.binginternal.com/completions";
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2OGRmNjZhNC1jYWQ5LTRiZmQtODcyYi1jNmRkZGUwMGQ2YjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NzY2MjM5MTIsIm5iZiI6MTY3NjYyMzkxMiwiZXhwIjoxNjc2NjI4Mzg4LCJhaW8iOiJBV1FBbS84VEFBQUEwYkN6amlFdC9QdWYvNVhNMGh5SEpXQzhjQlZ5Szd0WFpQQXJRSVBDd25ydVJkemlKN3JIN2VQRTRVbFNnZndpMGxOeEgxM2xSRzlFTklkdjBacW02Ui93dE1TWmV4cFJlY0lkc3l6WjFjRkc2V0tCcS9WOFRZVjBSTFFXSytCSSIsImF6cCI6IjY4ZGY2NmE0LWNhZDktNGJmZC04NzJiLWM2ZGRkZTAwZDZiMiIsImF6cGFjciI6IjAiLCJlbWFpbCI6Inlhbnlhbm11QG1pY3Jvc29mdC5jb20iLCJuYW1lIjoiWWFueWFuIE11Iiwib2lkIjoiMGEyMWZiZTgtOGJmMC00Y2Q2LTg1Y2QtZDI0MGMzMDU2ZGYxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoieWFueWFubXVAbWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BUUVBdjRqNWN2R0dyMEdScXkxODBCSGJSNlJtMzJqWnl2MUxoeXZHM2Q0QTFySWFBR3MuIiwic2NwIjoiYWNjZXNzIiwic3ViIjoiSVJnblp4VW4wS1BPZXhDdlBaZWdzMllHMk41Rmk5dDN3Z1dNTWQ2T0xwNCIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInV0aSI6InJiQkhTT0pGMzA2d2FsZ3dUOHdQQUEiLCJ2ZXIiOiIyLjAiLCJ2ZXJpZmllZF9wcmltYXJ5X2VtYWlsIjpbInlhbnlhbm11QG1pY3Jvc29mdC5jb20iXX0.KLw80kZxJlYBUq2yPLb8KjzzsP4CSaPGtIt5G8rpFFT6kfMkUQsQTUZSMVfjzRMQqI4KPwiBONv9BVVLOpfeShZXGrz0fURH33gXIuPcEXzELYrK5qBWKC8HcfsAi39zfpdGJaOLqyQv-aU-s3DLcnd6BgTQFY-o6FqHyEBE2tu8AstYKXtE6ggaYkVQx06zJOkBJ59g81RNz9c3RCqjuva6Ir6kFwBdiXFYP04YdtMpM9IrcRoPKuELNojckSiVFZcSfrdG0X-4LUaQzY00OxbHPuHYBx2uiK_Qfhgl5dKxctglEwNjMTM8uN2ADuRtwLNl4Ql5nAMfdpdiYMzvPQ"

async function sendRequest(prompt) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-ModelType": "text-davinci-003"
    },
    body: JSON.stringify({
      "prompt": prompt,
      "max_tokens": 1500,
      "temperature": 1,
      "top_p": 1,
      "n": 1,
      "stream": false,
      "logprobs": null,
      "stop": null
    })
  });

  return await response.json();
}

exports.test = async (_, res) => {
  const responseJSON = await sendRequest("Portland is a city that");
  res.json(responseJSON);
}

async function sendSearchRequest(query) {
  const fileList = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/images.json")));

  let prompt = "";

  for (const file of fileList) {
    prompt += "name: " + file.name + "\n" + "url: " + file.url + "\n";
    prompt += "\n";
  }

  prompt += "query: " + query + "\n";
  prompt += "\n";

  prompt += "result (JSON, name and url fields):\n";

  console.log(prompt);

  const responseJSON = await sendRequest(prompt);

  console.log(responseJSON);

  return JSON.parse(responseJSON.choices[0].text);
}

exports.getSearchResult = async (req, res) => {
  res.json(await sendSearchRequest(req.params.query));
}

exports.getSearchPage = async (req, res) => {
  const searchQeury = req.query.query;
  try{
    const searchResult = await sendSearchRequest(searchQeury);
    res.render("search", {data: searchResult, query: searchQeury,err: null});
  }catch(err){
    res.render("search", {err:"No search results.",data:[],query:searchQeury});
  }
}

exports.postSearchPage = async (req, res) => {
  const searchQeury = req.body.searchInput; 
  try{
    const searchResult = await sendSearchRequest(searchQeury);
    res.render("search", {data: searchResult, query: searchQeury, err: null});
  }catch(err){
    res.render("search", {err:"No search results.",data:[],query:searchQeury});
  } 
}

const msal = require("@azure/msal-node");
const _SCOPES = ["api://68df66a4-cad9-4bfd-872b-c6ddde00d6b2/access"];

const config = {
  "authOptions": {
    "clientId": "68df66a4-cad9-4bfd-872b-c6ddde00d6b2",
    "authority": "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47"
  },
  "request": {
    "deviceCodeUrlParameters": {
      "scopes": ["api://68df66a4-cad9-4bfd-872b-c6ddde00d6b2/access"]
    }
  }
};

const msalApp = new msal.PublicClientApplication({ "auth": config.authOptions });

async function acquireToken() {
  const loginResponse = await msalApp.acquireTokenByDeviceCode({ scopes: _SCOPES, deviceCodeCallback: (response) => { console.log(response.message); } });
  return loginResponse.accessToken;
}

exports.getToken = async (_, res) => {
  token = await acquireToken();
  res.end(token);
}
