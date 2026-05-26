import {Locator, Page} from '@playwright/test';

export class NavigationPage{
    signInLink: Locator;
    constructor(public page: Page){
        this.signInLink = this.page.locator('a[href="/login"]');        
    }   

    async goToSignInPage(){
        await this.signInLink.click();
    }
    async goToHomePage(){
        await this.page.goto('/');
    }
}