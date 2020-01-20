/*
 * Test Runner
 *
 *
 */

// Dependencies

// Application logic for the test runner
const _app = {};

// Container for the tests
_app.tests = {};

_app.tests.unit = require("./unit");

// Produce a test outcome report
_app.produceTestReport = function(limit, successes, errors) {
  console.log("");
  console.log("-------------BEGIN TEST REPORT--------------");
  console.log("");
  console.log("Total tests: ", limit);
  console.log("Pass: ", successes);
  console.log("Fail: ", errors.length);
  console.log("");

  // if there are errors, print them in detail
  if (errors.length > 0) {
    console.log("-------------BEGIN ERROR DETAILS--------------");
    console.log("");

    errors.forEach(function(testError) {
      console.log("\x1b[31m%s\x1b[0m", testError.name);
      console.log(testError.error);
      console.log("");
    });

    console.log("");
    console.log("-------------END ERROR DETAILS--------------");
  }

  console.log("");
  console.log("-------------END TEST REPORT--------------");
};

// Run all the tests collecting the errors and success
_app.runTests = function() {
  const errors = [];
  let successes = 0;
  const limit = Object.keys(_app.tests.unit).length;
  let counter = 0;

  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (function() {
            const tmpTestName = testName;
            const testValue = subTests[testName];
            // Call the test
            try {
              testValue(function() {
                // if it calls back without throwing, then it succeded, so log it in green
                console.log("\x1b[32m%s\x1b[0m", tmpTestName);
                counter++;
                successes++;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (e) {
              // If it throws, then it failed, so capture the error thrown and log it in red
              errors.push({
                name: testName,
                error: e
              });
              console.log("\x1b[31m%s\x1b[0m", tmpTestName);
              counter++;
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

// Run tests
_app.runTests();
