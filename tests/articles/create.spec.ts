import {test} from '../../src/fixtures/create-article.fixture';
import { expect } from '@playwright/test';
import { ArticleDetailsPage } from '../../src/pages/article-details.page';

test('should create a new article successfully', async({newArticlePage}) =>{
    const title= `Hanh's article ${Date.now()}`;
    const description= 'This is a description for my new article';
    const body= 'This is the body of my new article';
    const tags= ['test', 'playwright'];

    const [createArticleResponse] = await Promise.all([
        newArticlePage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.request().method() === 'POST' &&
            response.status() === 201
        ),
        newArticlePage.publishArticle(title, description, body, tags),
    ]);

    expect(createArticleResponse.ok()).toBeTruthy();

    const articleDetailsPage = new ArticleDetailsPage(newArticlePage.page);        
    await expect(articleDetailsPage.titleLocator).toHaveText(title);
});


