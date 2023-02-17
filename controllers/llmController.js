"use strict";

const fs = require("fs");
const path = require("path");

const ENDPOINT = "https://httpqas26-frontend-qasazap-prod-dsm02p.qas.binginternal.com/completions";
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2OGRmNjZhNC1jYWQ5LTRiZmQtODcyYi1jNmRkZGUwMGQ2YjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NzY2MTg2NzAsIm5iZiI6MTY3NjYxODY3MCwiZXhwIjoxNjc2NjIzNDU2LCJhaW8iOiJBV1FBbS84VEFBQUFuV2NNKzd3RHpNQnRXMjVOVFBpOW1wZ1ZNNTVZekZiQ2htSVR5aU5FRVdWcTJsaGZaVlhDNEJydUxiNHo3SlBRLy90MzdhQTBBWDBuMkEzL1d0YVd6Uk14KzNBMzU2YkRxZ0tPV2g4RkRNc3pIdng3a01WQ3F0dGZ5NlNPbEM5SiIsImF6cCI6IjY4ZGY2NmE0LWNhZDktNGJmZC04NzJiLWM2ZGRkZTAwZDZiMiIsImF6cGFjciI6IjAiLCJlbWFpbCI6Inlhbnlhbm11QG1pY3Jvc29mdC5jb20iLCJuYW1lIjoiWWFueWFuIE11Iiwib2lkIjoiMGEyMWZiZTgtOGJmMC00Y2Q2LTg1Y2QtZDI0MGMzMDU2ZGYxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoieWFueWFubXVAbWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BUUVBdjRqNWN2R0dyMEdScXkxODBCSGJSNlJtMzJqWnl2MUxoeXZHM2Q0QTFySWFBR3MuIiwic2NwIjoiYWNjZXNzIiwic3ViIjoiSVJnblp4VW4wS1BPZXhDdlBaZWdzMllHMk41Rmk5dDN3Z1dNTWQ2T0xwNCIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInV0aSI6IjlmazZILWZSc0VxOUJTQVE0MHdKQUEiLCJ2ZXIiOiIyLjAiLCJ2ZXJpZmllZF9wcmltYXJ5X2VtYWlsIjpbInlhbnlhbm11QG1pY3Jvc29mdC5jb20iXX0.YIue1MrB7h461wqOGHYORgEAz7oQn6HVUEpD73Oc6yaxvMuA5YEjyDAVs0n-obp9Q83NH8kAdEstX_b-5u1qM3PAv7VijGoscvU27vwcWIq3_tljF_T0Q4Tk3UOKTLa28AGwjO_SXEPRV5P7cO38_0Brcn1lyKne8aEJP0rwaz2a2QLfGf62IEzUlym3_-rW8kuuNfD6BQtVCEdxsXB8p2nbXA9pUkzeuQZHpgIpv2bB00i9NyNmvhknzYOu0NCXbid9LQoLHGuVeUFC-sA436VaigppUVi1zIrk3wgE-0ylTRum0E6cKry9uI4G9yp4g1ERKWm-Ir0ue7O8QcJ2fQ"

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
  const searchResult = await sendSearchRequest(searchQeury);
  res.render("search", {data: searchResult, query: searchQeury});
}

exports.postSearchPage = async (req, res) => {
  const searchQeury = req.body.searchInput; 
  const searchResult = await sendSearchRequest(searchQeury);
  res.render("search", {data: searchResult, query: searchQeury});
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
