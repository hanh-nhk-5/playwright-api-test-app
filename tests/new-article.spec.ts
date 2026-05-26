
import { ArticleDetailsPage } from '../page-objects/article-details-page';
import {test, expect} from './my-fixtures';

test.describe('Creating a new article', () =>{
    let articleSlug: string | undefined;

    test('should create a new article successfully', async({newArticlePage}) =>{
        const title= `My new article ${Date.now()}`;
        const description= 'This is a description for my new article';
        const body= 'This is the body of my new article';
        const tags= ['test', 'playwright'];

        const [createArticleResponse] = await Promise.all([
            newArticlePage.page.waitForResponse(response =>
                response.url().includes('/api/articles') &&
                response.request().method() === 'POST' &&
                response.status() === 201
            ),
            newArticlePage.createArticle(title, description, body, tags),
        ]);

        expect(createArticleResponse.ok()).toBeTruthy();
        const createdArticle = (await createArticleResponse.json()).article;
        expect(createdArticle?.slug).toBeTruthy();
        articleSlug = createdArticle.slug;

        const articleDetailsPage = new ArticleDetailsPage(newArticlePage.page);        
        await expect(articleDetailsPage.title).toHaveText(title);
    });

    test.afterEach(async ({request}) =>{
        if (!articleSlug) {
            return;
        }

        const response = await request.delete(`/articles/${articleSlug}`);
        if (!response.ok()) {
            const responseBody = await response.text();
            console.error(`Failed to delete article with slug ${articleSlug}: ${response.status()} ${response.statusText()} ${responseBody}`);
        }

        articleSlug = undefined;
    });
});

