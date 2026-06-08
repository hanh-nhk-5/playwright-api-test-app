import {test} from '../../src/fixtures/feeds-paging.fixture';
import { expect } from '@playwright/test';

test('User can view the correct number of pages in the global feed', async ({feedsPage}) =>{
    const [apiResponse] = await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&                
            response.request().method() === 'GET' &&
            response.ok()
        ),
        feedsPage.openGlobalFeed(),
    ]);

    expect(apiResponse.ok()).toBeTruthy();    

    const responseData = await apiResponse.json();
    const totalArticles = responseData.articlesCount;
    const expectedPages = Math.ceil(totalArticles / feedsPage.articlesPerPage);

    await expect(feedsPage.paginationLocator).toBeVisible();    
    expect(await feedsPage.getNumberOfPages()).toBe(expectedPages);
});

test('User can navigate to every page in the global feed', async ({feedsPage})=>{
    const [apiResponse] = await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.request().method() === 'GET' &&
            response.ok()
        ),
        feedsPage.openGlobalFeed()
    ]);

    const responseData = await apiResponse.json();
    responseData.articles.forEach((article: {title: string}) => {
        expect(feedsPage.isThereArticleWithTitle(article.title)).toBeTruthy();
    })

    const numPages =await feedsPage.getNumberOfPages();
    for(let page=2; page<=numPages; page++){        
        const [apiResponse] = await Promise.all([
            feedsPage.page.waitForResponse(response =>
                response.url().includes('/api/articles') &&
                response.request().method() === 'GET' &&
                response.ok()
            ),
            feedsPage.clickPagination(page)
        ]);        

        const responseData = await apiResponse.json();
        responseData.articles.forEach((article: {title: string}) => {
            expect(feedsPage.isThereArticleWithTitle(article.title)).toBeTruthy();
        });
    }   
})