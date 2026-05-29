
import { ArticleDetailsPage } from '../../src/pages/article-details-page';
import {test, expect} from '../../src/fixtures/my-fixtures';
import { deleteArticleBySlug } from '../../src/apis/article.api';

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

        await deleteArticleBySlug(request, articleSlug);
    });
});

