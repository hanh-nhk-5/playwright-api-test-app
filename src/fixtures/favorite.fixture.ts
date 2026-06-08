// import {test as base} from './base.fixture';
// import { FeedsPage } from '../pages/feeds.page';
// import { createArticle, deleteArticleBySlug } from '../apis/article.api';
// import { Article } from '../types/article';


// export const test = base.extend<{feedsPage: FeedsPage; favoriteArticleTitle: string}>({
//     favoriteArticleTitle: async ({request}, use) => {
//         //create a new article to test favorite functionality
//         const article: Article = {
//             title: `Hanh for Favorites ${Date.now()}`,
//             description: 'Description for favorites test',
//             body: 'Body of the article for favorites test',
//             tags: ['favorites', 'test']
//         };
//         const slug = await createArticle(request, article);
//         try {
//             await use(article.title);
//         } finally {
//             await deleteArticleBySlug(request, slug); //delete the created article
//         }
//     },

//     feedsPage: async ({pageManager, favoriteArticleTitle}, use) => {
//         // force article setup to complete before opening global feed
//         void favoriteArticleTitle;

//         //navigate to feeds page and open global feed
//         const feedspage = pageManager.onFeedsPage()
//         await feedspage.openGlobalFeed();
//         await use (feedspage);
//     }    
// });


import {test as base} from './feeds.fixture';
import { FeedsPage } from '../pages/feeds.page';
import { createArticle, deleteArticleBySlug } from '../apis/article.api';
import { Article } from '../types/article';


export const test = base.extend<{favoriteArticleTitle: string}>({
    favoriteArticleTitle: async ({request}, use) => {
        //create a new article to test favorite functionality
        const article: Article = {
            title: `Hanh for Favorites ${Date.now()}`,
            description: 'Description for favorites test',
            body: 'Body of the article for favorites test',
            tags: ['favorites', 'test']
        };
        const slug = await createArticle(request, article);
        try {
            await use(article.title);
        } finally {
            await deleteArticleBySlug(request, slug); //delete the created article
        }
    },

    feedsPage: async ({feedsPage, favoriteArticleTitle}, use) => {
        // force article setup to complete before opening global feed
        void favoriteArticleTitle;

        //navigate to the Feeds page on the Global Feed tab
        await use (feedsPage);
    }    
});