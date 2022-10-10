const fs = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');

const buildPath = "./build";
let cssFilename = "";

// move css file
const cssFiles = fs.readdirSync(buildPath + "/static/css");
for (let i = 0; i < cssFiles.length; i++) {
  const filename = cssFiles[i];
  if (filename.substring(filename.length - 4) === ".css") {
    cssFilename = filename;
    fs.moveSync(buildPath + "/static/css/" + filename, buildPath + "/" + filename);
    break;
  }
}

// remove js map file
const files = fs.readdirSync(buildPath);
for (let i = 0; i < files.length; i++) {
  const filename = files[i];
  if (filename.substring(filename.length - 4) === ".map") {
    fs.removeSync(buildPath + "/" + filename);
  }
  else if (filename.substring(filename.length - 4) === ".css") {
    cssFilename = filename;
  }
}

const pinata = {
  apiKey: '74b148e5d7e7f830d57e',
  apiSecret: 'a0eee26f43e71af17cc83a8d46d877581dbfe11dba6ef7287dcc28781241bc37',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNDBlNzQwOS03Mzc1LTQxNmUtOTY3Zi1mNTdmNmQyZjM5YWMiLCJlbWFpbCI6Imxlb2d1c2hpa2VuMDExMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzRiMTQ4ZTVkN2U3ZjgzMGQ1N2UiLCJzY29wZWRLZXlTZWNyZXQiOiJhMGVlZTI2ZjQzZTcxYWYxN2NjODNhOGQ0NmQ4Nzc1ODFkYmZlMTFkYmE2ZWY3Mjg3ZGNjMjg3ODEyNDFiYzM3IiwiaWF0IjoxNjY0MzA2OTk5fQ.vtp_-dfhkZd1WCj1up0-LLljXsTB21gfQBczI2zOJug'
};

// update index.html file
let html = fs.readFileSync(buildPath + "/index.html").toString();
html = html.replaceAll("static/css/" + cssFilename, cssFilename);
fs.writeFileSync(buildPath + "/index.html", html);

// upload to pinata
const api = axios.create({
  headers: {
    common: {
      pinata_api_key: pinata.apiKey,
      pinata_secret_api_key: pinata.apiSecret,
    },
  },
})

const data = new FormData()
files.forEach((file) => {
  if (file === "static" || file.substring(file.length - 4) === ".map") {
    return;
  }

  data.append(`file`, fs.createReadStream("./build/" + file), {
    filepath: "./build/" + file,
  })
})

api.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
  maxContentLength: 'Infinity',
  maxBodyLength: 'Infinity',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  },
}).then(res => {
}, err => {
  console.error(err);
});
