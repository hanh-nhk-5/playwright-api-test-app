To run the test
   1. Create an **.env** file with the same content as the .env.template file
   2. In the **.auth** folder, ensure a **user.json** file exists with the same content as the user.template file

**Project Note**:
1. Share the login state amongs tests to avoid logging in before every test.
   In playwright.config.ts,
   - configure **storageState** to point to the '.auth/user.json' file.
   - configure all projects to depend on the 'authenticate' project which runs a test that calls the login API and save the authenticated state to the '.auth/user.json' file.
2. For sign-in and sign-up tests, use an **isolated storage state** to ensure the tests run without any pre-existing authentication data.
3. Apply the **Page Object Model** design pattern.
   - Each page is represented by a class, that encapsulates its locators and actions.
   - Tests only focus business flows and assertions.
   - This approach to separate concerns, reduce code duplication, improve maintainability and make tests easy to read
5. Define **fixtures** to prepare test environment as needed and inject reusable page object instances representing individual pages such as Sign in, Sign up, Feeds page, and Article Editor page.
6. Demonstrate **network interception techniques**:
   - mocking API data
   - modifing API response
   - mornitor and validating API request/response
7. Support cross-browsers testing with Chrome and Firefox
8. Enable parallel test execution
9. The .env and .auth/user.json files contain credentials required to execute the tests. For security reson, these files are excluded from Github. However, to ensure that tests can still run whenever code is pushed to Github:
   - Define Github's Action secrets and variables to store the .env parameters and values, as well as the content of .auth/user.json encoded in base64
   - Update the github workflows to recreate these files from the Github's Action secrets and variables before executing the tests.
