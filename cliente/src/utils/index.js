/* eslint-disable prettier/prettier */

export function ViewDollar(strt) {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "COP",
    });

    return USDollar.format(strt);
  }

export function tieneDescuentoVigente(product) {
  if (!product?.is_descuento || !product?.porcentaje_descuento) return false
  if (!product?.fecha_limite_descuento) return true
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return hoy <= new Date(product.fecha_limite_descuento)
}

export function precioConDescuento(product) {
  if (!tieneDescuentoVigente(product)) return product?.price ?? 0
  return product.price - (product.price * product.porcentaje_descuento) / 100
}