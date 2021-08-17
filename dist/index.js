"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var http = _interopRequireWildcard(require("http"));

var _productos = require("./routes/productos");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = 8080;
const app = (0, _express.default)();

const layoutDirPath = _path.default.resolve(__dirname, '../views/layouts');

const defaultLayerPth = _path.default.resolve(__dirname, '../views/main.hbs');

const server = http.Server(app);
(0, _productos.ioServer)(server);
app.set('view engine', 'hbs');
app.engine('hbs', (0, _expressHandlebars.default)({
  layoutsDir: layoutDirPath,
  defaultLayout: defaultLayerPth,
  extname: 'hbs'
}));

const publicPath = _path.default.resolve(__dirname, '../public');

app.use(_express.default.static(publicPath));
server.listen(port, () => {
  console.log(`Server running in port:  ${port}`);
});
server.on('error', err => {
  console.error(`There was an error: ${err}`);
});
app.set('json spaces', 2);
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use('/api', _productos.router);