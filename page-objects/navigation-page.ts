import {Locator, Page} from '@playwright/test';

export class NavigationPage{
    signUpLink: Locator;
    signInLink: Locator;
    newArticleLink: Locator;    
    constructor(public page: Page){
        this.signUpLink = this.page.locator('a[href="/register"]');
        this.signInLink = this.page.locator('a[href="/login"]');        
        this.newArticleLink = this.page.locator('a[href="/editor"]');
    }   
    async goToSignUpPage(){
        await this.signUpLink.click();
    }
    async goToSignInPage(){
        await this.signInLink.click();
    }
    async goToHomePage(){
        await this.page.goto('/');
    }
    async gotoNewArticlePage(){
        await this.newArticleLink.click();
    }
}