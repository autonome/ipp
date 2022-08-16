import axios from 'axios';

const api = axios.create({
  params: {},
  headers: {},
});

export function sendFormData(url: string, method: string, FD: FormData) {
  return new Promise((resolve, reject) => {
    const XHR = new XMLHttpRequest();

    // Define what happens on successful data submission
    XHR.addEventListener('load', function (event: any) {
      if (event.target.status >= 200 && event.target.status < 300) {
        resolve(event.target.response);
      } else {
        reject(event.target.response);
      }
    });

    // Define what happens in case of error
    XHR.addEventListener(' error', function (event: any) {
      reject(event.target.response);
    });

    // Set up our request
    XHR.open(method, url);

    // Send our FormData object; HTTP headers are set automatically
    XHR.send(FD);
  });
}

export default api;
