import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Func to get .ifc file data
export async function getFile (fileName) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/ifc', fileName);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};