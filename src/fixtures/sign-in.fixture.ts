import {test as base} from './page-manager.fixture';
import { SignInPage } from '../pages/sign-in-page';

export const test= base.extend<{ signinPage: SignInPage }>({
    signinPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToSignInPage(); 
        await use(pageManager.onSignInPage());
    }
});