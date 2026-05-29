1. Create an **.env** file with the same content as the .env.template file
2. In the **.auth** folder, ensure a **user.json** file exists with the same content as the user.template file


**Note**:
1. Use '**storageState**' to store the login state that is shared between pages. 
   - The login state is stored in the '.auth/user.json' file by 'auth-setup.ts'
   - In 'playwright.config.ts', configure:
     - 'storageState' to point to the '.auth/user.json' file     
     - ensure 'auth-setup.ts' run first for all projects
2. For testing sign-in and sign-up, use an **isolated storage state** to ensure it runs without any pre-existing authentication data
3. Apply the Page Object Model to manage pages. Each page has it own class, which defines the locators and the actions can be performed on that page. This allows tests to leverage these class for more efficient and maintenable testing.
4. Define custom fixtures in 'my-fixtures.ts' file to prepare test environment for tests, and inject reusable page object instances representing individual pages such as Sign in, Sign up, Landing pages.