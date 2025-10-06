-- Asegúrate de usar la base de datos correcta
USE tienda_db;

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES
('Laptop Gamer X1', 'Laptop con RTX 4060, 16GB RAM, 1TB SSD', 1200.00, 'laptop-x1.jpg', 10),
('Mouse Óptico RGB', 'Mouse con iluminación RGB y 7 botones programables', 25.50, 'mouse-rgb.jpg', 50),
('Teclado Mecánico', 'Teclado mecánico azul con retroiluminación', 65.00, 'teclado-mec.jpg', 30),
('Monitor 24 pulgadas', 'Monitor Full HD con 75Hz de refresco', 150.00, 'monitor-24.jpg', 20),
('Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 80.00, 'audifonos-bt.jpg', 40),
('Disco Duro Externo 2TB', 'Disco duro portátil USB 3.0', 60.00, 'disco-2tb.jpg', 25),
('Webcam HD 1080p', 'Cámara web con micrófono integrado', 45.00, 'webcam-hd.jpg', 35),
('Router WiFi 6', 'Router de doble banda con soporte WiFi 6', 90.00, 'router-wifi6.jpg', 15);