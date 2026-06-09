import {test} from '../../src/fixtures/feeds.fixture';
import { expect } from '@playwright/test';

test('should display articles in the feed', async({feedsPage})=>{
    const [apiResponse] = await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.request().method() === 'GET' &&
            response.ok()),
        feedsPage.openGlobalFeed()
    ]);

    const responseBody = await apiResponse.json();
    const articles = responseBody.articles;

    for(const article of articles){        
        const isDiplayed = await feedsPage.display(article);
        expect(isDiplayed).toBeTruthy();
    }
});