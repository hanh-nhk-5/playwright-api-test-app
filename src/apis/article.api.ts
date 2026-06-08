import { APIRequestContext } from "@playwright/test";
import { Article } from "../types/article";

/**
 * 
 * @param request 
 * @param article: Article object containing title, description, body and tags
 * @returns: slug of the created article
 */
export async function createArticle(request: APIRequestContext, article: Article): Promise<string> {
    const response = await request.post('/api/articles', {
        data: {
            "article": {
                "title": article.title,
                "description": article.description,
                "body": article.body,
                "tagList": article.tags
            }
        }
    });

    if (!response.ok()) {
        const responseBody = await response.text();
        const errorMessage = `Failed to create article: ${response.status()} ${response.statusText()} ${responseBody}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }    
    const responseBody = await response.json();
    
    if(!responseBody.article || !responseBody.article.slug) {
        const errorMessage = `Article created but response does not contain slug: ${JSON.stringify(responseBody)}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    return responseBody.article.slug;
}


export async function deleteArticleBySlug(request: APIRequestContext, slug: string): Promise<void> {
    const response = await request.delete(`/api/articles/${slug}`);

    if (!response.ok()) {
        const responseBody = await response.text();
        const errorMessage = `Failed to delete article with slug ${slug}: ${response.status()} ${response.statusText()} ${responseBody}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}