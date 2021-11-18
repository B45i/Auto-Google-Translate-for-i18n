require('dotenv').config();
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;

const projectId = process.env.PROJECT_ID;
const translate = new Translate({ projectId });

const sourceFile = fs.readFileSync('./en.json', console.log);
const source = JSON.parse(sourceFile);

const target = ['es', 'de', 'fr'];

const translateObject = async (obj, to) => {
    const res = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            res[key] = await translateObject(obj[key], to);
        } else {
            const [translation] = await translate.translate(obj[key], {
                from: 'en',
                to,
            });
            res[key] = translation;
            console.log(`${obj[key]} => ${translation} (lang: ${to})`);
        }
    }
    return res;
};

const run = async () => {
    const promises = target.map(async to => {
        const out = await translateObject(source, to);
        fs.writeFile(`./${to}.json`, JSON.stringify(out), console.log);
    });
    Promise.all(promises);
};

run();
