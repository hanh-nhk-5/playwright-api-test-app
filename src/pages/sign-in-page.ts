import {Locator, Page, expect} from '@playwright/test';

export class SignInPage{
    emailInput: Locator;
    passwordInput: Locator;
    submitButton: Locator;
    constructor(public page: Page){
        this.emailInput = this.page.locator('input[placeholder="Email"]');
        this.passwordInput = this.page.locator('input[placeholder="Password"]');        
        this.submitButton= this.page.locator('button[type="submit"]');
    }
    
    async signIn(email: string, password: string){
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();

        await this.page.waitForSelector('a[href="/editor"]');

        const path = '.auth/user.json';
        await this.page.context().storageState({path});
    }
}