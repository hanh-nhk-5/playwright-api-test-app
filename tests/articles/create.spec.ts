import {test} from '../../src/fixtures/article-create.fixture';
import { expect } from '@playwright/test';
import { ArticleDetailsPage } from '../../src/pages/article-details.page';

test('should create a new article successfully', async({newArticlePage}) =>{
    const article = {
        title: `Hanh's article ${Date.now()}`,
        description: 'This is a description for my new article',
        body: 'This is the body of my new article',
        tagList: ['test', 'playwright']
    };

    const [createArticleResponse] = await Promise.all([
        newArticlePage.page.waitForResponse(response =>
            response.url().includes('/api/articles') &&
            response.request().method() === 'POST' &&
            response.status() === 201
        ),
        newArticlePage.publishArticle(article),
    ]);

    expect(createArticleResponse.ok()).toBeTruthy();

    const articleDetailsPage = new ArticleDetailsPage(newArticlePage.page);        
    await expect(articleDetailsPage.titleLocator).toHaveText(article.title);
    await expect(articleDetailsPage.bodyLocator).toHaveText(article.body);
    expect(await articleDetailsPage.matchTags(article.tagList)).toBeTruthy();
});


