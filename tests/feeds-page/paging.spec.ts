import {test} from '../../src/fixtures/feeds-paging.fixture';
import { expect } from '@playwright/test';

test.describe.configure({mode: 'serial'});

test('User can view the correct number of pages in the global feed', async ({pageManager}) =>{
    
    const [apiResponse] = await Promise.all([
        pageManager.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&                
            response.request().method() === 'GET' &&
            response.ok()
        ),
        pageManager.navigate().goToHomePage()
    ]);    
    expect(apiResponse.ok()).toBeTruthy();
    const feedsPage = pageManager.onFeedsPage();

    const responseData = await apiResponse.json();
    const totalArticles = responseData.articlesCount;
    const expectedPages = Math.ceil(totalArticles / feedsPage.articlesPerPage);

    await expect.poll(async () => {
        const paginationVisible = await feedsPage.paginationLocator.isVisible().catch(() => false);
        return paginationVisible ? await feedsPage.getNumberOfPages() : 1;
    }).toBe(expectedPages);
});

test('User can navigate to every page in the global feed', async ({pageManager})=>{    
    const [apiResponse] = await Promise.all([
        pageManager.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&                
            response.request().method() === 'GET' &&
            response.ok()
        ),
        pageManager.navigate().goToHomePage() 
    ]);

    const feedsPage = pageManager.onFeedsPage();
    expect(apiResponse.ok()).toBeTruthy();
    await feedsPage.waitForArticlesToLoad();
    
    const responseData = await apiResponse.json();
    for (const article of responseData.articles) {
        expect(await feedsPage.isThereArticleWithTitle(article.title)).toBeTruthy();
    }

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

        expect(apiResponse.ok()).toBeTruthy();
        await feedsPage.waitForArticlesToLoad();

        const responseData = await apiResponse.json();
        for (const article of responseData.articles) {
            expect(await feedsPage.isThereArticleWithTitle(article.title)).toBeTruthy();
        }        
    }   
})