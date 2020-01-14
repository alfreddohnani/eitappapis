const fs = require("fs");
const helpers = require("./../helpers");
const path = require("path");

const database = {};

database.baseDir = path.join(__dirname, "/../../.data");

database.read = (dir, file, callback) => {
  fs.readFile(
    `${database.baseDir}/${dir}/${file}.json`,
    "utf-8",
    (err, data) => {
      if (!err && data) {
        const parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

database.readdir = (dir, callback) => {
  fs.readdir(`${database.baseDir}/${dir}`, {withFileTypes: false},(err, files) => {
    if (!err && files) {
      callback(false, files);
    } else {
      callback(err, files);
    }
  });
};

database.create = (dir, file, data, callback) => {
  // Open the file for writing
  const path = `${database.baseDir}/${dir}/${file}.json`;
  fs.open(path, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create new file, it may already exist");
    }
  });
};

database.update = (dir, file, data, callback) => {
  fs.open(
    `${database.baseDir}/${dir}/${file}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, err => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Error opening file, it may not exist yet");
      }
    }
  );
};

database.delete = (dir, file, callback) => {
  fs.unlink(`${database.baseDir}/${dir}/${file}.json`, err => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

database.rename = (dir, oldFile, newFile, callback) => {
  fs.rename(
    `${database.baseDir}/${dir}/${oldFile}.json`,
    `${database.baseDir}/${dir}/${newFile}.json`,
    err => {
      if (!err) {
        callback(false);
      } else {
        callback("Error renaming file");
      }
    }
  );
};

module.exports = database;
