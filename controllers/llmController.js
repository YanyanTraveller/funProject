const fs = require("fs");
const path = require("path");

const ENDPOINT = "https://httpqas26-frontend-qasazap-prod-dsm02p.qas.binginternal.com/completions";
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2OGRmNjZhNC1jYWQ5LTRiZmQtODcyYi1jNmRkZGUwMGQ2YjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2NzY1MzkwNTAsIm5iZiI6MTY3NjUzOTA1MCwiZXhwIjoxNjc2NTQzMjQyLCJhaW8iOiJBV1FBbS84VEFBQUFhZkJaSlZzMW0yd0dJQ0Jua0FKTFdWUU5JT3dVUVp2ZWpNRFdkdmFmcE5CWjM3ZUx0SzVrTURicnl3dUp0dE1wUTFJYlRsU0d0MnhTU21mN0RTU29ZM21adHpCeHlKazE0azhxNkJLN05Yd3I4ZTFtbHV1YmRFamFIdGdKdCtuQyIsImF6cCI6IjY4ZGY2NmE0LWNhZDktNGJmZC04NzJiLWM2ZGRkZTAwZDZiMiIsImF6cGFjciI6IjAiLCJlbWFpbCI6Inlhbnlhbm11QG1pY3Jvc29mdC5jb20iLCJuYW1lIjoiWWFueWFuIE11Iiwib2lkIjoiMGEyMWZiZTgtOGJmMC00Y2Q2LTg1Y2QtZDI0MGMzMDU2ZGYxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoieWFueWFubXVAbWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BUUVBdjRqNWN2R0dyMEdScXkxODBCSGJSNlJtMzJqWnl2MUxoeXZHM2Q0QTFySWFBR3MuIiwic2NwIjoiYWNjZXNzIiwic3ViIjoiSVJnblp4VW4wS1BPZXhDdlBaZWdzMllHMk41Rmk5dDN3Z1dNTWQ2T0xwNCIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInV0aSI6IndzY3FSNDVyNGtXbjRBQ21CSXdFQUEiLCJ2ZXIiOiIyLjAiLCJ2ZXJpZmllZF9wcmltYXJ5X2VtYWlsIjpbInlhbnlhbm11QG1pY3Jvc29mdC5jb20iXX0.T4KsPvq-uEs-NymYDxyyeHOvNTZWH9MgDafY8jS0mW2C0EVB9KNWiaqo0tjaO_4cmApjKjX5dejnCIP2XoRm34GTHes0WrYTUIT2Ao7qGwGIVV2anMSSlF85dAapdsOf2PkwIhzvLyYtnpKSPuHzcwYBQnboI3RTXi58nqmXDl2316yIRMTEXGY2pdH-pV79ltFqOdo8fwUamz9YwJels4KyPDX1tpL9LKuSsQRWE-yabJNQ9hhHm3YpAV2-UPppkmQAfxx_XqYCo832L77sW1UQKmR80RMioAEMv-_gHtogTzUz9IVqMf5H5FVbkQI5OotsNpwrnMAk28m_NURdKw"

exports.sendRequest = async (prompt) => {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
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

exports.getSearchResult = async (req, res) => {
    const fileList = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/images.json"))); 

    let prompt = ""; 

    for (const file of fileList) {
        prompt += "name: " + file.name + "\n" + "url: " + file.url + "\n";
        prompt += "\n";
    }

    prompt += "query: " + req.query.query + "\n";
    prompt += "\n";

    prompt += "result (JSON, name and url fields):\n"

    console.log(prompt);

    const responseJSON = await sendRequest(prompt);

    console.log(responseJSON);

    const searchResults = JSON.parse(responseJSON.choices[0].text);

    res.json(searchResults);
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
}

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
