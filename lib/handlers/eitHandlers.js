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
  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  const age = typeof data.payload.age === "number" ? data.payload.age : false;
  const country =
    typeof data.payload.country === "string" &&
    data.payload.country.trim().length > 0
      ? data.payload.country.trim()
      : false;


  if (firstName && lastName && age && country && email) {
    // Make sure that the eit doesn't already exist

    database.read("eits", email, (err, data) => {
      if (err) {
        //  Hash the password
        // const hashedPassword = helpers.hash(password);

        //create the eit object
        const eitObject = {
          firstName,
          lastName,
          email,
          age,
          country
        };

        database.create("eits", email, eitObject, err => {
          if (!err) {
            callback(200, { Success: "New eit created successfully" });
          } else {
            callback(500, { Error: "Could not create the new eit" });
          }
        });
      } else {
        callback(400, {
          Error: "An eit with this email already exists"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

_eitHandlers.get = (data, callback) => {
  const email =
    typeof data.queryStringObject.email === "string" &&
    data.queryStringObject.email.trim().length > 0
      ? data.queryStringObject.name.trim().toLowerCase()
      : false;

  if (email) {
    database.read("eits", email, (err, data) => {
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
        const withoutJsonExtension = files.map(file => {
          return file.split(".json")[0];
        });
        callback(200, withoutJsonExtension);
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
  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  const age = typeof data.payload.age === "number" ? data.payload.age : false;
  const country =
    typeof data.payload.country === "string" &&
    data.payload.country.trim().length > 0
      ? data.payload.country.trim()
      : false;

  const queryEmail = data.queryStringObject.email;

  if (queryEmail) {
    if (firstName || lastName || age || country || email) {
      database.read("eits", queryEmail, (err, userData) => {
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

          if (email) {
            userData.email = email;
          }
          //   if (password) {
          //     userData.hashedPassword = helpers.hash(password);
          //   }

          database.update("eits", queryEmail, userData, err => {
            if (!err) {
              if (email) {
                const newEmail = userData.email.toLowerCase();

                database.rename("eits", queryEmail, newEmail, err => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { Error: "Could not rename the eit file" });
                  }
                });
              }

              callback(200, userData);
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
  const queryEmail = data.queryStringObject.email;

  if (queryEmail) {
    database.read("eits", queryEmail, (err, data) => {
      if (!err && data) {
        database.delete("eits", queryEmail, err => {
          if (!err) {
            callback(200, {Success: "Eit deleted successfully"});
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
