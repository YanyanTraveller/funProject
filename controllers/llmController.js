const fs = require("fs");
const path = require("path");

const ENDPOINT = "https://httpqas26-frontend-qasazap-prod-dsm02p.qas.binginternal.com/completions";
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2OGRmNjZhNC1jYWQ5LTRiZmQtODcyYi1jNmRkZGUwMGQ2YjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NzY2MDA4MjIsIm5iZiI6MTY3NjYwMDgyMiwiZXhwIjoxNjc2NjA1OTQ5LCJhaW8iOiJBV1FBbS84VEFBQUE3M1dBTFFkUExDcFhEQS9WaHRKSVdHU0diK0E1VzJRVXBtWHR5RDNHSkdSWkVpc21RbDNtVE5QUXI2QmJzWUN4WkFISzJkeUpHejRCWEhKT2I1bUZtU3M0allGSFJXZ1pYMEFYNjk1OHhEUnNpUU5VZm9PSFZWeitDUU52WGdEbiIsImF6cCI6IjY4ZGY2NmE0LWNhZDktNGJmZC04NzJiLWM2ZGRkZTAwZDZiMiIsImF6cGFjciI6IjAiLCJlbWFpbCI6ImppYWdhb0BtaWNyb3NvZnQuY29tIiwibmFtZSI6IkppYW4gR2FvIiwib2lkIjoiODI4YjkzNmUtODlhNy00MzI4LTg5NGMtMjM0Nzc3ZGQ4OGNkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiamlhZ2FvQG1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjZSbTMyalp5djFMaHl2RzNkNEExcklhQU5JLiIsInNjcCI6ImFjY2VzcyIsInN1YiI6InBNTV9iWGlma3JyVDBOUmpQVmVhM1ZhVGlDS05pSlMyVzdGS0Z1MzRqQjAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiI5ZHpQdkxNaXZFVy15dlBWWERrSEFBIiwidmVyIjoiMi4wIiwidmVyaWZpZWRfcHJpbWFyeV9lbWFpbCI6WyJqaWFnYW9AbWljcm9zb2Z0LmNvbSJdfQ.LC4sycFG-v-Os_hkemvCx_1HM-Retg1JDJwtyYudAydZQkxTv4pfSVJ3_x9ww2OFqGl2KODLFMdmk36kM962KXVIR_0V76eblhfVavhlsJEfv1U_vA4zkhip6iJbJGCeD-sH0grlWDOKNVN-Dd8OEL6YOKkw-OMY-vsjyIRS-T4P_QDV_WcmaGQ8XPXPe3pFFEua9sXknUbI4JUGiLwhFFgAKyAI-Wkk2ms5Zak1B4ZRVQIeh0uqvhLwxa3ldo7gyiwpdrK1CbSVnS8kmAZKPc10eMIWxazcyEDvHnth02N_CZGLH7FIhX1OV8Ul_bmjNNp0iBKM5x0AlZWIMncnbQ"

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

  prompt += "result (JSON, name and url fields):\n"

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
  return msalApp
    .acquireTokenByDeviceCode({ scopes: _SCOPES, deviceCodeCallback: (response) => { console.log(response.message); } })
    .then((loginResponse) => {
      if (loginResponse) {
        return loginResponse.accessToken;
      }
    })
    .catch((error) => {
      console.error("Acire token error:", error);
      return "";
    });
}

exports.getToken = async (_, res) => {
  token = await acquireToken();
  res.end(token);
}
