import { test as setup} from "@playwright/test";
import fs from 'fs';
import process from "process";

setup ('authenticate', async ({request}) => {       
    console.log('Starting authentication setup...');          
    let apiResponse= await request.post(`${process.env.API_URL}/api/users/login`, {
        data: {
            "user":{
                "email": process.env.MY_EMAIL!,
                "password": process.env.MY_PASSWORD!
            }
        }
    });
    if(apiResponse.ok()){        
        const user = JSON.parse(fs.readFileSync(process.env.AUTHENTICATION_FILE_PATH!, 'utf8'));
        const token = (await apiResponse.json()).user.token;        
        user.origins[0].localStorage[0].value = token;
        fs.writeFileSync(process.env.AUTHENTICATION_FILE_PATH!, JSON.stringify(user));        
    }
    else{
        console.error(`Failed to authenticate: ${apiResponse.status()} ${apiResponse.statusText()} ${await apiResponse.text()}`);   
    }
});
