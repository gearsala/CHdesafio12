import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import * as http from 'http';
import { router, ioServer } from './routes/productos';

const port = 8080;
const app = express();
const layoutDirPath = path.resolve(__dirname, '../views/layouts');
const defaultLayerPth = path.resolve(__dirname, '../views/main.hbs');
const server = http.Server(app);

ioServer(server);

app.set('view engine', 'hbs');

app.engine(
	'hbs',
	handlebars({
		layoutsDir: layoutDirPath,
		defaultLayout: defaultLayerPth,
		extname: 'hbs',
	})
);

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`Server running in port:  ${port}`);
});

server.on('error', (err) => {
	console.error(`There was an error: ${err}`);
});

app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);