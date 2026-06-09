import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/feeds-tag.fixture';

test('User can see all articles belong to a popular tag', async ({ feedsPage, tagName }) =>{
    await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.url().includes(`tag=${encodeURIComponent(tagName)}`) &&
            response.request().method() === 'GET' &&
            response.ok()
        ),
        feedsPage.clickTag(tagName)
    ]);
    const allArticlesHaveTag = await feedsPage.allArticlesHaveTag(tagName);
    expect(allArticlesHaveTag).toBeTruthy();

    const numberOfPages = await feedsPage.getNumberOfPages();
    
    for(let page = 2; page <= numberOfPages; page++){
        await Promise.all([
            feedsPage.page.waitForResponse(response =>
                response.url().includes('/api/articles') &&
                response.url().includes(`tag=${encodeURIComponent(tagName)}`) &&
                response.request().method() === 'GET' &&
                response.ok()
            ),
            feedsPage.clickPagination(page)
        ]);
        const allArticlesHaveTag = await feedsPage.allArticlesHaveTag(tagName);
        expect(allArticlesHaveTag).toBeTruthy();
    }
    
    
})