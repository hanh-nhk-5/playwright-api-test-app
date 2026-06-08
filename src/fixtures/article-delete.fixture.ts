import {test as base} from './base.fixture';
import { ArticleDetailsPage } from '../pages/article-details.page';

export const test = base.extend<{articleDetailsPage: ArticleDetailsPage}>({
    articleDetailsPage: async ({pageManager, request}, use) =>{
        //Step 1: Create an article to ensure there is an article to delete
        const apiResponse = await request.post('/api/articles', 
            {
                data: {
                    article: {
                        title: `Hanh\'s Article to Delete ${Date.now()}`,
                        description: 'This article will be deleted in the test',
                        body: 'This is the body of the article that will be deleted.',
                        tagList: ['delete', 'hanhs-article']
                    }
                }
            });

        if (!apiResponse.ok()) {
            throw new Error(`Failed to create article for deletion: ${apiResponse.status()} ${apiResponse.statusText()}`);
        }
        const responseData = await apiResponse.json();
        const slug = responseData.article.slug;

        const feedsPage = pageManager.onFeedsPage();
        await feedsPage.openGlobalFeed();
        const articleDetailsPage = await feedsPage.viewArticleBySlug(slug);

        use(articleDetailsPage);        
    }   
});