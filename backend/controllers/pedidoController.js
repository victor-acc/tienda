// backend/controllers/pedidoController.js
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

const crearPedido = async (req, res) => {
  const { productos } = req.body; // [{ id_producto, cantidad }, ...]
  const id_usuario = req.usuario.id;

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Lista de productos requerida' });
  }

  try {
    let total = 0;
    const detalles = [];

    // Validar y calcular total
    for (const item of productos) {
      const producto = await Producto.findById(item.id_producto);
      if (!producto) {
        return res.status(400).json({ error: `Producto con ID ${item.id_producto} no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });
      }
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      detalles.push({ ...item, precio_unitario: producto.precio });
    }

    // Crear pedido
    const id_pedido = await Pedido.create(id_usuario, total);

    // Agregar productos al pedido
    for (const item of detalles) {
      await Pedido.addProducto(id_pedido, item.id_producto, item.cantidad, item.precio_unitario);
    }

    res.status(201).json({ id: id_pedido, total, productos: detalles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

const obtenerMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.getByUsuario(req.usuario.id);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

const obtenerTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.getAll();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

module.exports = { crearPedido, obtenerMisPedidos, obtenerTodosPedidos };