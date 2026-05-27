1. Create an **.env** file with the same content as the .env.template file
2. In the **.auth** folder, ensure a **user.json** file exists with the same content as the user.template file


**Note**:
1. Use '**storageState**' to store the login state that is shared between pages. 
   - The login state is stored in the '.auth/user.json' file by 'auth-setup.ts'
   - In 'playwright.config.ts', configure:
     - 'storageState' to point to the '.auth/user.json' file     
     - ensure 'auth-setup.ts' run first for all projects
2. For testing sign-in and sign-up, use an **isolated storage state** to ensure it runs without any pre-existing authentication data
