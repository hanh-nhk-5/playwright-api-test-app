import {Locator, Page} from '@playwright/test';
export class SignUpPage{
    userNameInput: Locator;
    emailInput: Locator;
    passwordInput: Locator;
    signUpButton: Locator;
    constructor(public page: Page){
        this.userNameInput= this.page.getByRole('textbox', {name: 'Username'});
        this.emailInput= this.page.getByRole('textbox', {name: 'Email'});
        this.passwordInput= this.page.getByRole('textbox', {name: 'Password'});
        this.signUpButton= this.page.getByRole('button', {name: 'Sign up'});
    }

    async signUp(username: string, email: string, password: string){
        await this.userNameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signUpButton.click();        
    }   
}