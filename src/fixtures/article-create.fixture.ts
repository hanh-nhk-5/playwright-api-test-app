import { ArticleEditorPage } from '../pages/article-editor.page';
import{ test as base} from './base.fixture';
import { deleteArticleBySlug } from '../apis/article.api';
import {Response} from '@playwright/test';

export const test= base.extend<{ newArticlePage: ArticleEditorPage }>({
    newArticlePage: async ({pageManager, request}, use) =>{
        await pageManager.navigate().gotoNewArticlePage();
        const newArticlePage= pageManager.onNewArticlePage();   
        let slug: string | undefined;
        const slugCreateTasks: Promise<void>[] = [];

        const onResponse = (response: Response) =>{
            if (response.url().includes('/api/articles') && response.request().method() === 'POST' && response.ok()) {
                const task = response.json()
                    .then((responseBody: unknown) =>{
                        const maybeSlug = (responseBody as { article?: { slug?: string } })?.article?.slug;
                        if (maybeSlug) {
                            slug = maybeSlug;
                        }
                    })
                    .catch((error: unknown) =>{
                        console.error(`Failed to parse response body for article creation: ${String(error)}`);
                    });
                slugCreateTasks.push(task);
            }
        }
        newArticlePage.page.on('response', onResponse);

        //Step 1: create a new article using the article editor page and publish it
        await use(newArticlePage); 
        
        //Waits briefly for network idle before removing listener to catch late responses.
        await newArticlePage.page.waitForLoadState('networkidle', {timeout: 2000}).catch(() => undefined);
         //remove the listener to prevent memory leaks and unintended side effects on other tests
        newArticlePage.page.off('response', onResponse);
        //wait for slug creation tasks to complete before proceeding with cleanup
        await Promise.allSettled(slugCreateTasks);

        //Step 2: cleanup - delete the article that was created for the test
        if(slug) {
            console.log(`Attempting to delete article with slug: ${slug}`);
            await deleteArticleBySlug(request, slug);
        }
    }
});