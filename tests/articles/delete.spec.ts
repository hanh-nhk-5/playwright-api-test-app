import {test} from '../../src/fixtures/article-delete.fixture';
import { expect } from '@playwright/test';
import { FeedsPage } from '../../src/pages/feeds.page';

test ('should delete an article successfully', async ({articleDetailsPage}) =>{
    await articleDetailsPage.page.waitForSelector('.banner h1', { timeout: 5000 });
    let title = await articleDetailsPage.getTitle();
    title = title?.trim() || '';

    const [apiResponse] = await Promise.all([
        articleDetailsPage.page.waitForResponse(response =>
            response.url().includes('/api/articles/') && response.request().method() === 'DELETE' && response.status() === 204
        ),
        articleDetailsPage.deleteArticle()
    ])
    expect(apiResponse.ok()).toBeTruthy();

    const feedsPage = new FeedsPage(articleDetailsPage.page);
    const isArticlePresent = await feedsPage.isThereArticleWithTitle(title);
    expect(isArticlePresent).toBeFalsy();
})