import {Page} from '@playwright/test';
import { SignInPage } from './sign-in-page';
import { NavigationPage } from './navigation-page';
import { LandingPage } from './landing-page';

export class PageManager{
    navigationPage: NavigationPage;
    signInPage: SignInPage;
    landingPage: LandingPage;
    constructor(public page: Page){
        this.navigationPage= new NavigationPage(this.page);
        this.signInPage= new SignInPage(this.page);
        this.landingPage= new LandingPage(this.page);
    }

    navigate(){
        return this.navigationPage
    }

    onSignInPage(){
        return this.signInPage;
    }

    onLandingPage(){
        return this.landingPage;
    }
}