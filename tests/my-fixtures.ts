import {test as base, APIRequestContext} from '@playwright/test';
import fs from 'fs';
import {PageManager} from '../page-objects/page-manager';
import { SignInPage } from '../page-objects/sign-in-page';
import { LandingPage } from '../page-objects/landing-page';
import { NewArticlePage } from '../page-objects/new-article-page';
import { SignUpPage } from '../page-objects/sign-up-page';

type MyFixtures={
    pageManager: PageManager;
    signUpPage: SignUpPage;
    signinPage: SignInPage;    
    landingPage: LandingPage;
    newArticlePage: NewArticlePage;
    request: APIRequestContext;
}

export const test= base.extend<MyFixtures>({
    request: async ({playwright}, use) => {
        const token =getJwtTokenFromAuthState();
        const requestContext = await playwright.request.newContext({
            baseURL: process.env.API_URL,
            extraHTTPHeaders: token? {Authorization: `Token ${token}`} : undefined,
        });
        await use(requestContext);
        await requestContext.dispose();
    },
    signUpPage: async ({pageManager}, use) =>{        
        await pageManager.navigate().goToSignUpPage();
        const signUpPage = pageManager.onSignUpPage();
        await use(signUpPage);
    },
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
    },
    newArticlePage: async ({pageManager}, use) =>{
        await pageManager.navigate().gotoNewArticlePage();
        const newArticlePage= pageManager.onNewArticlePage();        
        await use(newArticlePage);
    }

});

export {expect} from '@playwright/test';

function getJwtTokenFromAuthState(): string | undefined {
    const authFilePath = process.env.AUTHENTICATION_FILE_PATH || '.auth/user.json';
    const authState = JSON.parse(fs.readFileSync(authFilePath, 'utf8')) as {
        origins?: Array<{
            localStorage?: Array<{ name: string; value: string }>;
        }>;
    };

    for (const origin of authState.origins || []) {
        const tokenEntry = (origin.localStorage || []).find(item => item.name === 'jwtToken');
        if (tokenEntry?.value) {
            return tokenEntry.value;
        }
    }

    return undefined;
}