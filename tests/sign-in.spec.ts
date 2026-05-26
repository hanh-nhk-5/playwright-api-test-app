
import { SignInPage } from '../page-objects/sign-in-page';
import { test } from './my-fixtures';

test('user can sign in', async({signinPage}) => {   
    const username = process.env.MY_USERNAME!;
    const password = process.env.MY_PASSWORD!;
    await signinPage.signIn(username, password);
    
})