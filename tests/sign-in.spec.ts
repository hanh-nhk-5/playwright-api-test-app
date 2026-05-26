
import { SignInPage } from '../page-objects/sign-in-page';
import { test } from './my-fixtures';

test.use({
    //use the isolated storage state for this test to ensure it runs without any pre-existing authentication data
    storageState: { cookies: [], origins: []},
})
test('user can sign in', async({signinPage}) => {  
    if (!process.env.MY_EMAIL || !process.env.MY_PASSWORD) { 
        throw new Error('Environment variables MY_EMAIL and MY_PASSWORD must be set');
    }
    const email = process.env.MY_EMAIL!;
    const password = process.env.MY_PASSWORD!;
    await signinPage.signIn(email, password);
    
})