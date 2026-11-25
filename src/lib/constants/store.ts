// Dirección contrastada con la ficha actual de SICARÚ en Google Maps.
// No se asigna local ni coordenadas hasta validarlos con la propietaria.
const storeMapsQuery =
  "Sicarú, C. 20 de Noviembre Nte. 102, Col. Centro, Cadereyta Jiménez, Nuevo León, México";

export const STORE = {
  name: "Distribuidora Sicarú",
  address: {
    street: "Calle 20 de Noviembre Norte 102",
    neighborhood: "Centro",
    city: "Cadereyta Jiménez",
    state: "Nuevo León",
    zip: "67480",
    country: "México",
    full: "Calle 20 de Noviembre Norte 102, Col. Centro, Cadereyta Jiménez, Nuevo León, C.P. 67480, México",
  },
  phone: "+52 828 113 6652",
  whatsapp: "528281136652",
  // No se publica correo electrónico hasta confirmar que SICARÚ controla ese buzón.
  hours: "Lunes a Sábado 9:00 - 19:00",
  // El enlace de Google Maps identifica el NEGOCIO por su Place ID, no por
  // coordenadas deducidas ni por la coincidencia aproximada de un domicilio.
  googleMapsPlaceUrl:
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeMapsQuery)}&query_place_id=ChIJwc6gTeXbYoYReSmhZYk0oMA`,
  googleMapsEmbedUrl:
    `https://maps.google.com/maps?q=${encodeURIComponent(storeMapsQuery)}&z=17&output=embed`,
} as const;
