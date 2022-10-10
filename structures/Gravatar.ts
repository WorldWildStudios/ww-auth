import fetch from 'node-fetch';
import fs from 'fs';

export default class Gravatar {
    public static async getAvatar(email: string): Promise<string> {
        const hash = Gravatar.md5(email);
        const url = `https://www.gravatar.com/avatar/${hash}?s=200&d=404`;

        const res = await fetch(url);
        if (res.status === 404) {
            return 'https://cdn.discordapp.com/attachments/853692385376075776/1028955779270721537/Auth_Logo_White.png';
        }

        return url;
    }

    public static downloadAvatar(url: string, uuid: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream("../static/avatars/" + uuid + ".png");
            const request = fetch(url);

            request.then((res) => {
                if(res.body) {
                    res.body.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                } else {
                    reject();
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public static md5(str: string): string {
        return require('crypto').createHash('md5').update(str).digest('hex');
    }
}