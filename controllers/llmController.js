"use strict";

const fs = require("fs");
const path = require("path");

const ENDPOINT = "https://httpqas26-frontend-qasazap-prod-dsm02p.qas.binginternal.com/completions";
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2OGRmNjZhNC1jYWQ5LTRiZmQtODcyYi1jNmRkZGUwMGQ2YjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NzY2MTM4MjUsIm5iZiI6MTY3NjYxMzgyNSwiZXhwIjoxNjc2NjE5MzgwLCJhaW8iOiJBV1FBbS84VEFBQUFyN0xaRkVldmJ2cmJlS0RqUWlxZkw4TEdJSE13a1VEUVNXUW1ucWtnUWNjMXM4eVZ6MWJMYnF5YUZzOVMzeVFIVWszb1hNSVpiY3REeGpOdkY2UVBiMzZNbGMxeUZIazgwRWdZdFFBQUdySGhWZFNwUHhLL1gyMTI4RUR2TXhhWSIsImF6cCI6IjY4ZGY2NmE0LWNhZDktNGJmZC04NzJiLWM2ZGRkZTAwZDZiMiIsImF6cGFjciI6IjAiLCJlbWFpbCI6ImppYWdhb0BtaWNyb3NvZnQuY29tIiwibmFtZSI6IkppYW4gR2FvIiwib2lkIjoiODI4YjkzNmUtODlhNy00MzI4LTg5NGMtMjM0Nzc3ZGQ4OGNkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiamlhZ2FvQG1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjZSbTMyalp5djFMaHl2RzNkNEExcklhQU5JLiIsInNjcCI6ImFjY2VzcyIsInN1YiI6InBNTV9iWGlma3JyVDBOUmpQVmVhM1ZhVGlDS05pSlMyVzdGS0Z1MzRqQjAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJ0RDJ0WF9iLXprT3NTMUoycnBnSkFBIiwidmVyIjoiMi4wIiwidmVyaWZpZWRfcHJpbWFyeV9lbWFpbCI6WyJqaWFnYW9AbWljcm9zb2Z0LmNvbSJdfQ.Wu4G3lyAy63Ue7pT9IS_CLaX7KNxU_7LADb1N-dnof4CB8VB2z-qv5hkr4MH3GIL34JhWRVCJ_wWe1MWCU15C2m3KXV0P6YEsDW3PLKvA_j4MiZs4bdn-KgTgWgkAcaayr1y5bq8KtN5YzWcytNjBi-ZXjQ2ti000f_XUhtlAB6uAkTBG7dmMp5slDgDsVPrbqysVyB9r0_folCRHEysf6ISlX5QvjD51X6yJGC1N8-4C7Wam6_L59GG0Eqg3LX2_79E0QQaaBehpCA5yBbcMZ7Tq3vzEqVC00oXepLoJchjvY_7ckQeegggoBAEPiR1KgyRxgfO6HQyjZPViVzrjg";

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
