import {test} from '../../src/fixtures/base.fixture';
import { expect } from '@playwright/test';

test('should display articles in the feed', async({pageManager})=>{   
    const [apiResponse] = await Promise.all([
        pageManager.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.request().method() === 'GET' &&
            response.ok()),
        pageManager.navigate().goToHomePage()
    ]);
    
    const feedsPage = pageManager.onFeedsPage();
    expect(apiResponse.ok()).toBeTruthy();
    await feedsPage.waitForArticlesToLoad();

    const responseBody = await apiResponse.json();
    const articles = responseBody.articles;

    await feedsPage.waitForArticlesToLoad();

    for(const article of articles){        
        const isDisplayed = await feedsPage.display(article);
        expect(isDisplayed).toBeTruthy();
    }
});