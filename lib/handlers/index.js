const eitHandlers = require("./../handlers/eitHandlers");

const handlers = {};

handlers.eits = eitHandlers;
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
