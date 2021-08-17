"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ioServer = exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _productClass = _interopRequireDefault(require("../productClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.router = router;
const products = new _productClass.default();
router.get('/', (req, res) => {
  res.render('main', {
    layout: 'index'
  });
});
router.get('/productos/listar', (req, res) => {
  const getProducts = products.getProducts();
  getProducts.length !== 0 ? res.json({
    products: getProducts
  }) : res.status(404).json({
    error: 'No hay productos cargados'
  });
});
router.get('/productos/listar/:id', (req, res) => {
  const specificId = req.params.id;
  const getProducts = products.getProducts();
  const product = getProducts.find(product => product.id == specificId);
  product ? res.json({
    product
  }) : res.status(404).json({
    error: 'Producto no encontrado'
  });
});
router.post('/productos/guardar', (req, res) => {
  const body = req.body;
  products.addProduct(body.title, body.price, body.thumbnail);
  res.redirect('/api/productos/agregar');
});
router.put('/productos/actualizar/:id', (req, res) => {
  const specificId = req.params.id;
  const body = req.body;
  const updatedProduct = products.updateProduct(specificId, body.title, body.price, body.thumbnail);
  updatedProduct === -1 ? res.status(404).json({
    error: 'Producto no encontrado'
  }) : res.status(201).json({
    product: updatedProduct
  });
});
router.delete('/productos/borrar/:id', (req, res) => {
  const specificId = req.params.id;
  const deletedProduct = products.deleteProduct(specificId);
  deletedProduct === -1 ? res.status(404).json({
    error: 'Producto no encontrado o ya eliminado'
  }) : res.status(200).json({
    deletedProduct
  });
});

const ioServer = server => {
  const io = (0, _socket.default)(server);
  io.on('connection', socket => {
    console.log('Client Connected');
    socket.on('add products', data => {
      products.addProduct(data.title, data.price, data.thumbnail);
      io.emit('products', products.getProducts());
    });
    socket.on('askCurrentData', () => {
      socket.emit('products', products.getProducts());
    });
  });
  return io;
};

exports.ioServer = ioServer;