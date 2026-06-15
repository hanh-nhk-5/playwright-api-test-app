import { test as base } from './article-create-an-sample-article.fixture';
import { ArticleEditorPage } from '../pages/article-editor.page';
import { deleteArticleBySlug} from '../apis/article.api';
import {expect, Response} from '@playwright/test'

export const test= base.extend<{ editArticlePage: ArticleEditorPage }>({
    editArticlePage: async ({sampleArticleTitle, sampleTag, pageManager, request}, use) =>{
        void sampleArticleTitle;
        let slug = '';
        const updateSlugTasks: Promise<void>[] = [];
        //intercept the tag API call to ensure the sample tag is included in the list of tags
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

            //filter articles by the sample tag and open the article details page for the first article in the list
            await feedsPage.clickTag(sampleTag);            
            await expect(feedsPage.articleCards).toBeVisible();
            const articleDetailsPage = await feedsPage.viewArticleByIndex(0);
            const articleEditorPage = await articleDetailsPage.openArticleEditor();

            const onResponse = (response: Response) => {
                if (response.url().includes('/api/articles') && response.request().method() === 'PUT' && response.ok()) {
                    const task = response.json()
                        .then((responseBody: unknown) => {
                            const maybeSlug = (responseBody as { article?: { slug?: string } })?.article?.slug;
                            if (maybeSlug) {
                                slug = maybeSlug;
                            }
                        })
                        .catch((error: unknown) => {
                            console.error(`Failed to parse response body for article update: ${String(error)}`);
                        });

                    updateSlugTasks.push(task);
                }
            };
            articleEditorPage.page.on('response', onResponse);

            try {
                // edit the article
                await use(articleEditorPage);
            } finally {
                // Remove listener and settle captured update tasks even when test body fails.
                articleEditorPage.page.off('response', onResponse);
                await articleEditorPage.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => undefined);
                await Promise.allSettled(updateSlugTasks);

                if (slug) {
                    console.log(`Attempting to delete article with slug: ${slug}`);
                    await deleteArticleBySlug(request, slug);
                } else {
                    console.warn('Skip deleteArticleBySlug: no updated article slug was captured.');
                }
            }
        } finally {
            await pageManager.page.unrouteAll({ behavior: 'ignoreErrors' });            
        }   
    }
});
