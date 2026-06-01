import {test as base} from './page-manager.fixture';
import {SignUpPage} from '../pages/sign-up-page';

export const test= base.extend<{ signUpPage: SignUpPage }>({
    signUpPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToSignUpPage();
        await use(pageManager.onSignUpPage());
    }
});