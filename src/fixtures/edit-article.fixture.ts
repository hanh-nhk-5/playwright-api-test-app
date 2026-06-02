import {test as base} from './base.fixture';
import { ArticleEditorPage } from '../pages/article-editor.page';
import {createArticle, deleteArticleBySlug} from '../apis/article.api';
import {Response} from '@playwright/test'

export const test= base.extend<{ editArticlePage: ArticleEditorPage }>({
    editArticlePage: async ({pageManager, request}, use) =>{
        //Step 1. create a new article 
        const title= `My new article ${Date.now()}`;
        const description= 'This is a description for my new article';
        const body= 'This is the body of my new article';
        const tags= ['test', 'playwright'];
        let slug = await createArticle(request, title, description, body, tags);
         
        const feedsPage = pageManager.onFeedsPage();
        await feedsPage.openGlobalFeed();
        const articleDetailsPage = await feedsPage.viewArticleBySlug(slug);
        const articleEditorPage = await articleDetailsPage.openArticleEditor();

        const updateSlugTasks: Promise<void>[] = [];
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

        //Step 2. use the article editor page to edit the article and publish it
        await use(articleEditorPage);

        //Waits briefly for network idle before removing listener to catch late responses.
        await articleEditorPage.page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => undefined);
        //remove the listener to prevent memory leaks and unintended side effects on other tests
        articleEditorPage.page.off('response', onResponse);
        //wait for slug update tasks to complete before proceeding with cleanup  
        await Promise.allSettled(updateSlugTasks);

        // Step 3. Cleanup: delete the article after the test
        console.log(`Attempting to delete article with slug: ${slug}`);       
        await deleteArticleBySlug(request, slug);
    }
});
