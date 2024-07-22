const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'public/imgs/whackerlink-logo.png'),
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true
        }
    });

    win.loadURL('http://localhost:3000');
}

function startServer() {
    const app = express();
    const codeplugDirectory = path.join(__dirname, 'codeplugs');

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

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
        const selectedCodeplug = codeplugs[0];
        res.render('index', { codeplugs, selectedCodeplug });
    });

    app.get('/codeplug/:name', (req, res) => {
        const codeplugs = loadCodeplugs();
        const selectedCodeplug = codeplugs.find(cp => cp.name === req.params.name);
        res.render('index', { codeplugs, selectedCodeplug });
    });

    app.listen(3000, () => console.log(`Server running on port 3000`));
}

app.on('ready', () => {
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});