import {test as base} from './feeds.fixture';
import {createArticle, deleteArticleBySlug} from '../apis/article.api';

export const test = base.extend<{createdArticleTitles: string[]}>({
    createdArticleTitles: async({request}, use) =>{
        //create articles to ensure there are at least 2 pages in the global feed
        const articlesToCreate= 25;
        const createdSlugs: string[] = [];
        const createdArticleTitles: string[] = [];
        
        for(let i=0; i< articlesToCreate; i++){
            const title = `Hanh for Paging Test ${Date.now()}-${i}`;
            const slug =await createArticle(request, {
                title: title,
                description: 'Description for paging test',
                body: 'Body of the article for paging test',
                tagList: ['paging', 'test']
            });
            createdSlugs.push(slug);
            createdArticleTitles.push(title);
        }
        await use(createdArticleTitles);

        //cleanup created articles after test
        await Promise.all(createdSlugs.map(slug => deleteArticleBySlug(request, slug)));
    },
    feedsPage: async ({createdArticleTitles, feedsPage}, use) =>{
        void createdArticleTitles; // ensure articles are created before test starts        
        
        await use(feedsPage);
    }
});