// import {test as base} from './base.fixture';
// import { ArticleDetailsPage } from '../pages/article-details.page';
// import { Article } from '../types/article';
// import { createArticle } from '../apis/article.api';

// export const test = base.extend<{articleDetailsPage: ArticleDetailsPage}>({
//     articleDetailsPage: async ({pageManager, request}, use) =>{
//         //Step 1: Create an article to ensure there is an article to delete
//         const article: Article ={
//             title: `Hanh\'s Article to Delete ${Date.now()}`,
//             description: 'This article will be deleted in the test',
//             body: 'This is the body of the article that will be deleted.',
//             tagList: ['delete', 'hanhs-article']
//         }
//         const slug = await createArticle(request, article);

//         await pageManager.navigate().goToHomePage();
//         const feedsPage = pageManager.onFeedsPage();
//         await feedsPage.openGlobalFeed();
//         const articleDetailsPage = await feedsPage.viewArticleBySlug(slug);

//         await use(articleDetailsPage);        
//     }   
// });

import {test as base} from './article-create-an-sample-article.fixture';
import { ArticleDetailsPage } from '../pages/article-details.page';
import { Article } from '../types/article';
import { createArticle } from '../apis/article.api';
import { expect } from '@playwright/test';

export const test = base.extend<{articleDetailsPage: ArticleDetailsPage}>({
    articleDetailsPage: async ({sampleArticleTitle, sampleTag,pageManager, request}, use) =>{
        // force article setup to complete before opening the feeds page
        void sampleArticleTitle;

        //intercept the tag API call to ensure the favorite tag is included in the list of tags 
        await pageManager.page.route('**/api/tags**', async route =>{
            if (route.request().method() === 'GET') {
                const response = await route.fetch();
                const data = await response.json() as { tags?: string[] };
                const tags = Array.isArray(data.tags) ? data.tags : [];
                if(!tags.map(tag => tag.trim().toLowerCase()).includes(sampleTag.trim().toLowerCase())){
                    tags.push(sampleTag);
                }
                await route.fulfill({body: JSON.stringify({...data, tags})});
            }
        });

        try {
            //navigate to the Feeds page on the Global Feed tab          
            await Promise.all([
                pageManager.page.waitForResponse(response =>
                    response.url().includes('/api/tags') &&
                    response.request().method() === 'GET' &&
                    response.ok()
                ),
                pageManager.navigate().goToHomePage()
            ]);
            const feedsPage = pageManager.onFeedsPage();
            expect(await feedsPage.getTagLocator(sampleTag).count()).toBeGreaterThan(0);
            await feedsPage.clickTag(sampleTag);//click on the sample tag to filter articles by that tag and ensure the test article is visible in the feed
            
            await expect(feedsPage.articleCards).toBeVisible();
            const articleDetailsPage = await feedsPage.viewArticleByIndex(0);
            await use(articleDetailsPage);
        } finally {
            await pageManager.page.unrouteAll({ behavior: 'ignoreErrors' });
        }    
    }   
});