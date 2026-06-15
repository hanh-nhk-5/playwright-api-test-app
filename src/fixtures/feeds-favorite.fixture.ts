import { test as base} from './article-create-an-sample-article.fixture';
import { FeedsPage } from '../pages/feeds.page';

export const test = base.extend<{feedsPage: FeedsPage}>({
    feedsPage: async ({sampleArticleTitle, sampleTag, pageManager}, use) => {
        // force article setup to complete before opening the feeds page
        void sampleArticleTitle;

        //intercept the tag API call to ensure the favorite tag is included in the list of tags for the test favorite article
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
            await pageManager.navigate().goToHomePage();
            const feedsPage = pageManager.onFeedsPage();
            await use(feedsPage);
        } finally {
            await pageManager.page.unrouteAll({ behavior: 'ignoreErrors' });
        }
       
    }    
});