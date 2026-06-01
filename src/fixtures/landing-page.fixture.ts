import {test as base} from './page-manager.fixture';
import { LandingPage } from '../pages/landing.page';

export const test= base.extend<{ landingPage: LandingPage }>({
    landingPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToHomePage();
        await use(pageManager.onLandingPage());
    }
});