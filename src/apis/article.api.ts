import { APIRequestContext } from "@playwright/test";

export async function createArticle(request: APIRequestContext, title: string, description: string, body: string, tags: string[]): Promise<string> {
    const response = await request.post('/api/articles', {
        data: {
            "article": {
                "title": title,
                "description": description,
                "body": body,
                "tagList": tags
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