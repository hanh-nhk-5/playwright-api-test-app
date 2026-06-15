import {test as base} from '../fixtures/feeds.fixture';
import {createArticle, deleteArticleBySlug} from '../apis/article.api';
import { Article } from '../types/article';

export const test = base.extend<{tagName: string}>({
    // tagName: async({}, use) =>{
    //     const tagName = `Test`;
    //     await use(tagName);
    // },
    tagName: 'Test',
    feedsPage: async({request, feedsPage, tagName}, use) => {
        //create an article with the tag to ensure it appears in the feed
        const numberOfArticles = 15;
        const now = Date.now();
        const slugsToDelete: string[] = [];
        for (let i = 0; i < numberOfArticles; i++) {            
            const article: Article = {
                title: `Hanh - ${now} - ${i}`,
                description: `Description for Article ${i}`,
                body: `Body for Article ${i}`,
                tagList: [tagName]
            }
            const slug = await createArticle(request, article);
            slugsToDelete.push(slug);
        }
                
        try{
            await use(feedsPage);
        } finally {
            //cleanup - delete the articles created for the test
            await Promise.all(slugsToDelete.map(slug => deleteArticleBySlug(request, slug)));
        }

        
    }
});