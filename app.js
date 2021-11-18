require('dotenv').config();
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;

const projectId = process.env.PROJECT_ID;
const translate = new Translate({ projectId });

const sourceFile = fs.readFileSync('./en.json', console.log);
const source = JSON.parse(sourceFile);

const to = 'es';

const translateObject = async obj => {
    const res = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            res[key] = await translateObject(obj[key]);
        } else {
            const [translation] = await translate.translate(obj[key], {
                from: 'en',
                to,
            });
            res[key] = translation;
            console.log(`${obj[key]} => ${translation}`);
        }
    }
    return res;
};

const run = async () => {
    const out = await translateObject(source);
    fs.writeFileSync(`./${to}.json`, JSON.stringify(out));
};

run();
