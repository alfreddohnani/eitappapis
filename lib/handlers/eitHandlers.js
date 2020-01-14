const database = require("./../database");
const helpers = require("./../helpers");

const _eitHandlers = {};

/*
 * eits - post
 * required fields : firstName, lastName, age, country
 *
 *
 */

_eitHandlers.post = (data, callback) => {
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const age = typeof data.payload.age === "number" ? data.payload.age : false;
  const country =
    typeof data.payload.country === "string" &&
    data.payload.country.trim().length > 0
      ? data.payload.country.trim()
      : false;

  if (firstName && lastName && age && country) {
    // Make sure that the eit doesn't already exist
    const name = `${firstName}_${lastName}`
      .split(" ")
      .join("_")
      .toLowerCase();
    database.read("eits", name, (err, data) => {
      if (err) {
        //  Hash the password
        // const hashedPassword = helpers.hash(password);

        //create the eit object
        const eitObject = {
          firstName,
          lastName,
          age,
          country
        };

        database.create("eits", name, eitObject, err => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not create the new eit" });
          }
        });
      } else {
        callback(400, {
          Error: "An eit with this name already exists"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

_eitHandlers.get = (data, callback) => {
  const name =
    typeof data.queryStringObject.name === "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name
          .trim()
          .split(" ")
          .join("_")
          .toLowerCase()
      : false;

  if (name) {
    database.read("eits", name, (err, data) => {
      if (!err && data) {
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else if (Object.keys(data.queryStringObject).length === 0) {
    database.readdir("eits", (err, files) => {
      if (!err && files) {
        callback(200, files);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

_eitHandlers.put = (data, callback) => {
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const age = typeof data.payload.age === "number" ? data.payload.age : false;
  const country =
    typeof data.payload.country === "string" &&
    data.payload.country.trim().length > 0
      ? data.payload.country.trim()
      : false;

  const name =
    typeof data.queryStringObject.name === "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name
          .trim()
          .split(" ")
          .join("_")
          .toLowerCase()
      : false;

  if (name) {
    if (firstName || lastName || age || country) {
      database.read("eits", name, (err, userData) => {
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (age) {
            userData.age = age;
          }
          if (country) {
            userData.country = country;
          }
          //   if (password) {
          //     userData.hashedPassword = helpers.hash(password);
          //   }

          database.update("eits", name, userData, err => {
            if (!err) {
              if (firstName || lastName) {
                const oldName = name;
                const newName = `${firstName}_${lastName}`
                  .split(" ")
                  .join("_")
                  .toLowerCase();

                database.rename("eits", oldName, newName, err => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { Error: "Could not rename the eit file" });
                  }
                });
              }
            } else {
              callback(500, { Error: "Could not update the eit" });
            }
          });
        } else {
          callback(400, { Error: "The specified eit does not exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

_eitHandlers.delete = (data, callback) => {
  const name =
    typeof data.queryStringObject.name === "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name
          .trim()
          .split(" ")
          .join("_")
          .toLowerCase()
      : false;

  if (name) {
    database.read("eits", name, (err, data) => {
      if (!err && data) {
        database.delete("eits", name, err => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Error deleting eit" });
          }
        });
      } else {
        callback(400, { Error: "Could not find specified eit" });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field"
    });
  }
};

const eitHandlers = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    _eitHandlers[data.method](data, callback);
  } else {
    callback(405);
  }
};

module.exports = eitHandlers;
