-- Agregar tablas necesarias para devoluciones y venta_detalle
-- Ejecutar este script si las tablas no existen

-- Tabla de ventas_detalle (si no existe)
CREATE TABLE IF NOT EXISTS venta_detalle (
    idVentaDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    cantidadVendida INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

-- Tabla de devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    idDevolucion INT AUTO_INCREMENT PRIMARY KEY,
    fechaDevolucion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idUsuario INT NOT NULL,
    idVenta INT NOT NULL,
    motivo TEXT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idVenta) REFERENCES ventas(idVenta)
);

-- Tabla de devolucion_detalle
CREATE TABLE IF NOT EXISTS devolucion_detalle (
    idDevolucionDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idDevolucion INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idDevolucion) REFERENCES devoluciones(idDevolucion),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

-- Actualizar la tabla de ventas para incluir la columna observacion si no existe
-- ALTER TABLE ventas ADD COLUMN observacion TEXT AFTER total;

-- Verificar estructura actual de la tabla ventas
-- DESCRIBE ventas;
