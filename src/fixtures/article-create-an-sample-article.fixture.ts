import { createArticle, deleteArticleBySlug } from '../apis/article.api';
import { Article } from '../types/article';
import {test as base} from './base.fixture';

type SampleArticle = {
    sampleArticleTitle: string,
    sampleTag: string,
}

export const test = base.extend<SampleArticle>({
    sampleTag: `SampleTag ${Date.now()}`,
    sampleArticleTitle: async ({sampleTag, request}, use) => {
        //create a sample article
        const article: Article = {
            title: `Hanh for Sample ${Date.now()}`,
            description: 'Description for sample test',
            body: 'Body of the article for sample test',
            tagList: [sampleTag]
        };
        const slug = await createArticle(request, article);
        try {
            await use(article.title);
        } finally {
            await deleteArticleBySlug(request, slug); //delete the created article
        }
    }

});