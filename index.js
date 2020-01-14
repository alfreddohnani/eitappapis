const http = require("http");
const URL = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const helpers = require("./lib/helpers");
const router = require("./lib/router");
const config = require("./lib/config");

http
  .createServer((request, response) => {
    const { method, headers, url } = request;
    const { pathname, query } = URL.parse(url, true);

    let buffer = "";
    const decoder = new StringDecoder("utf-8");
    request
      .on("error", err => {
        console.log(err);
      })
      .on("data", data => {
        buffer += decoder.write(data);
      })
      .on("end", () => {
        buffer += decoder.end();

        const requestData = {
          path: pathname.replace(/^\/+|\/+$/g, ""),
          method: method.toLowerCase(),
          queryStringObject: query,
          headers,
          payload: helpers.parseJsonToObject(buffer)
        };


        //@TODO continue with chosen handler
        const chosenHandler = typeof (router[requestData.path]) !== 'undefined' ? router[requestData.path] : router.notFound;

        chosenHandler(requestData, (statusCode, serverPayload) => {
          statusCode = typeof statusCode === "number" ? statusCode : 200;
          serverPayload =
            typeof serverPayload === "object" ? serverPayload : {};

          response.writeHead(statusCode, {
            "Content-Type": "application/json"
          });
          response.end(JSON.stringify(serverPayload));
        });
      });

  })
  .listen(config.port, () =>
    console.log(
      `The server is listening on port ${config.port} in ${config.envName} environment.`
    )
  );
