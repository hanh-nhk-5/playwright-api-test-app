import {test as base} from './base.fixture';
import { ArticleDetailsPage } from '../pages/article-details.page';
import { Article } from '../types/article';
import { createArticle } from '../apis/article.api';

export const test = base.extend<{articleDetailsPage: ArticleDetailsPage}>({
    articleDetailsPage: async ({pageManager, request}, use) =>{
        //Step 1: Create an article to ensure there is an article to delete
        const article: Article ={
            title: `Hanh\'s Article to Delete ${Date.now()}`,
            description: 'This article will be deleted in the test',
            body: 'This is the body of the article that will be deleted.',
            tagList: ['delete', 'hanhs-article']
        }
        const slug = await createArticle(request, article);

        const feedsPage = pageManager.onFeedsPage();
        await feedsPage.openGlobalFeed();
        const articleDetailsPage = await feedsPage.viewArticleBySlug(slug);

        await use(articleDetailsPage);        
    }   
});