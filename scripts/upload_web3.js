const fs = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');
const { Service, Web3Storage, File } = require("web3.storage");

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


// update index.html file
let html = fs.readFileSync(buildPath + "/index.html").toString();
html = html.replaceAll("static/css/" + cssFilename, cssFilename);
fs.writeFileSync(buildPath + "/index.html", html);


// upload to web3

const client = new Web3Storage({
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVmMDc4OWQwYjRhMWNFNTE5QjIwNjNkRjA2ZjJhRjg2YzBFNjIwRDAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAyNDQ2MDY2MDcsIm5hbWUiOiJ0b2tlbjEifQ.iLx7RjI1SfygVXg0OSDqKFStPlZeEUtGrK53AyY359U",
});

(async function() {
  try {
    const uploadFiles = [];
    files.forEach((file) => {
      if (file === "static" || file.substring(file.length - 4) === ".map") {
        return;
      }
  
      const data = fs.readFileSync("./build/" + file);
      const blob = new File([data], file);
      uploadFiles.push(blob);
    })
  
  
    const rootCid = await client.put(uploadFiles, {
      name: "build_" + (new Date()).getTime(),
      maxRetries: 3,
      wrapWithDirectory: true,
    });
  
    console.log(`https://${rootCid}.ipfs.w3s.link`);
  } catch (err) {
    console.log(err);
  }  
})();
