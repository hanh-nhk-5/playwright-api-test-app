import {test as base} from './base.fixture';
import { FeedsPage } from '../pages/feeds.page';

export const test= base.extend<{ feedsPage: FeedsPage }>({
    feedsPage: async ({pageManager}, use) =>{
        await pageManager.navigate().goToHomePage();
        await use(pageManager.onLandingPage());
    }
});