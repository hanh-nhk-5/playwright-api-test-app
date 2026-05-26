import { LandingPage } from "../page-objects/landing-page";
import { expect, test } from "./my-fixtures";

test.use({
    //use the isolated storage state for this test to ensure it runs without any pre-existing authentication data
    storageState: { cookies: [], origins: [] },
});

test('should sign up a new user successfully', async({ signUpPage }) =>{
    const username = `tu${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'password123';
    const [response] = await Promise.all([
        signUpPage.page.waitForResponse(response =>
            response.url().includes('/api/users') &&
            response.request().method() === 'POST'
        ),
        signUpPage.signUp(username, email, password)
    ]);
    expect(response.ok()).toBeTruthy();
    const responseBody= await response.json();
    expect(responseBody.user.username).toBe(username);
    expect(responseBody.user.email).toBe(email);    
    
    const landingPage = new LandingPage(signUpPage.page);
    await expect(landingPage.tagListLocator).toBeVisible();
    
})