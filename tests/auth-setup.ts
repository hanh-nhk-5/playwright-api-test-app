import { test as setup, request, expect} from "@playwright/test";
import fs from 'fs';
import user from '../.auth/user.json';
import {faker} from '@faker-js/faker';

setup ('authenticate', async ({request}, testInfo) => {  
    //Login                 
    let apiResponse= await request.post(`${process.env.API_URL}/users/login`, {
        data: {
            "user":{
                "email": process.env.MY_EMAIL!,
                "password": process.env.MY_PASSWORD!
            }
        }
    });
    if(apiResponse.ok()){
        const token = (await apiResponse.json()).user.token;        
        writeTokenToAuthFile(token);
    }
    else{  
        //sign up      
        let username = `dungchungonline${faker.number.int({min: 10, max: 99999})}`;
        process.env.MY_EMAIL= `${username}@gmail.com`   
        console.log(`Creating new account with email: ${process.env.MY_EMAIL}`);
        apiResponse= await request.post(`${process.env.API_URL}/users`, {        
            data: {
                "user":{
                    "email": process.env.MY_EMAIL,    
                    "password": process.env.MY_PASSWORD!,
                    "username": username}
            }
        });
        if(apiResponse.ok()){
            const token = (await apiResponse.json()).user.token;
            writeTokenToAuthFile(token);
        }
    }
});

function writeTokenToAuthFile(token: string){
    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(process.env.AUTHENTICATION_FILE_PATH!, JSON.stringify(user));
}
