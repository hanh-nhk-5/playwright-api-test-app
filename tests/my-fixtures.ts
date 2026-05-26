import {test as base} from '@playwright/test';
import {PageManager} from '../page-objects/page-manager';
import { SignInPage } from '../page-objects/sign-in-page';
import { LandingPage } from '../page-objects/landing-page';

type MyFixtures={
    pageManager: PageManager;
    signinPage: SignInPage;    
    landingPage: LandingPage;
}

export const test= base.extend<MyFixtures>({
    signinPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToSignInPage();
        const signInPage = pageManager.onSignInPage();
        await use(signInPage);
    },
    pageManager: async ({page}, use) =>{
        await page.goto('/');        
        const pageManager= new PageManager(page);
        await use(pageManager);
    },
    landingPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToHomePage();
        const landingPage = pageManager.onLandingPage();
        await use (landingPage);
    }

});

export {expect} from '@playwright/test';