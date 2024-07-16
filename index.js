const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const app = express();

const codeplugDirectory = path.join(__dirname, 'codeplugs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

function loadCodeplugs() {
    const files = fs.readdirSync(codeplugDirectory);
    const codeplugs = files.map(file => {
        const filepath = path.join(codeplugDirectory, file);
        const codeplug = yaml.load(fs.readFileSync(filepath, 'utf8'));
        return {
            name: path.basename(file, path.extname(file)),
            data: codeplug
        };
    });
    return codeplugs;
}

app.get('/', (req, res) => {
    const codeplugs = loadCodeplugs();
    const selectedCodeplug = codeplugs[0]; // Default to the first codeplug
    res.render('index', { codeplugs, selectedCodeplug });
});

app.get('/codeplug/:name', (req, res) => {
    const codeplugs = loadCodeplugs();
    const selectedCodeplug = codeplugs.find(cp => cp.name === req.params.name);
    res.render('index', { codeplugs, selectedCodeplug });
});

app.listen(3000, "0.0.0.0", () => console.log(`Server running on port 3000`));