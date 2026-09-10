/* datos de productos */

const productos = [
    {
        id: 1,
        codigo: "TC001",
        imagen: "../assets/img/torta-cuadr-chocolate.jpg",
        categoria: "Tortas Cuadradas",
        nombre: "Torta Cuadrada de Chocolate",
        precio: 45000,
        descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
    },
    {
        id: 2,
        codigo: "TC002",
        imagen: "../assets/img/torta-cuadr-frutas.jpg",
        categoria: "Tortas Cuadradas",
        nombre: "Torta Cuadrada de Frutas",
        precio: 50000,
        descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
    },
    {
        id: 3,
        codigo: "TT001",
        imagen: "../assets/img/torta-circu-vainilla.jpg",
        categoria: "Tortas Circulares",
        nombre: "Torta Circular de Vainilla",
        precio: 40000,
        descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
    },
    {
        id: 4,
        codigo: "TT002",
        imagen: "../assets/img/torta-circu-manjar.jpg",
        categoria: "Tortas Circulares",
        nombre: "Torta Circular de Manjar",
        precio: 42000,
        descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
    },
    {
        id: 5,
        codigo: "PI001",
        imagen: "../assets/img/mousse-chocolate.jpg",
        categoria: "Postres Individuales",
        nombre: "Mousse de Chocolate",
        precio: 5000,
        descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
    },
    {
        id: 6,
        codigo: "PI002",
        imagen: "../assets/img/tiramisu.jpg",
        categoria: "Postres Individuales",
        nombre: "Tiramisú Clásico",
        precio: 5500,
        descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
    },
    {
        id: 7,
        codigo: "PSA001",
        imagen: "../assets/img/torta-sa-naranja.jpg",
        categoria: "Productos Sin Azúcar",
        nombre: "Torta Sin Azúcar de Naranja",
        precio: 48000,
        descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
    },
    {
        id: 8,
        codigo: "PSA002",
        imagen: "../assets/img/cheesecake-sa.jpg",
        categoria: "Productos Sin Azúcar",
        nombre: "Cheesecake Sin Azúcar",
        precio: 47000,
        descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
    },
    {
        id: 9,
        codigo: "PT001",
        imagen: "../assets/img/empanada-manzana.jpg",
        categoria: "Pastelería Tradicional",
        nombre: "Empanada de Manzana",
        precio: 3000,
        descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
    },
    {
        id: 10,
        codigo: "PT002",
        imagen: "../assets/img/tarta-santiago.jpg",
        categoria: "Pastelería Tradicional",
        nombre: "Tarta de Santiago",
        precio: 6000,
        descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos."
    },
    {
        id: 11,
        codigo: "PG001",
        imagen: "../assets/img/brownie-sg.jpg",
        categoria: "Productos Sin Gluten",
        nombre: "Brownie Sin Gluten",
        precio: 4000,
        descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
    },
    {
        id: 12,
        codigo: "PG002",
        imagen: "../assets/img/pan-sg.jpg",
        categoria: "Productos Sin Gluten",
        nombre: "Pan Sin Gluten",
        precio: 3500,
        descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida."
    },
    {
        id: 13,
        codigo: "PV001",
        imagen: "../assets/img/torta-veg-choc.jpg",
        categoria: "Productos Vegana",
        nombre: "Torta Vegana de Chocolate",
        precio: 50000,
        descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."
    },
    {
        id: 14,
        codigo: "PV002",
        imagen: "../assets/img/galletas-veg-avena.jpg",
        categoria: "Productos Vegana",
        nombre: "Galletas Veganas de Avena",
        precio: 4500,
        descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
    },
    {
        id: 15,
        codigo: "TE001",
        imagen: "../assets/img/torta-cumple.jpg",
        categoria: "Tortas Especiales",
        nombre: "Torta Especial de Cumpleaños",
        precio: 55000,
        descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
    },
    {
        id: 16,
        codigo: "TE002",
        imagen: "../assets/img/torta-bodas.jpg",
        categoria: "Tortas Especiales",
        nombre: "Torta Especial de Boda",
        precio: 60000,
        descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."
    }
];


/* categorías de productos */

const categoriasDisponibles = [
    "Tortas Cuadradas",
    "Tortas Circulares",
    "Postres Individuales",
    "Productos Sin Azúcar",
    "Pastelería Tradicional",
    "Productos Sin Gluten",
    "Productos Vegana",
    "Tortas Especiales"
];


/* tamaños disponibles */

const tamanosDisponibles = [
    "Pequeño",
    "Mediano",
    "Grande"
];


/* tipos de torta */

const tiposTorta = [
    "Cuadrada",
    "Circular"
];


/* regiones y comunas */

const regionesComunas = {
    "Arica y Parinacota": [
        "Arica",
        "Camarones",
        "General Lagos",
        "Putre"
    ],
    "Tarapacá": [
        "Alto Hospicio",
        "Iquique",
        "Pozo Almonte",
        "Pica"
    ],
    "Antofagasta": [
        "Antofagasta",
        "Calama",
        "Mejillones",
        "Taltal"
    ],
    "Atacama": [
        "Copiapó",
        "Caldera",
        "Chañaral",
        "Vallenar"
    ],
    "Coquimbo": [
        "La Serena",
        "Coquimbo",
        "Ovalle",
        "Illapel"
    ],
    "Valparaíso": [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué",
        "Villa Alemana",
        "San Antonio"
    ],
    "Metropolitana": [
        "Santiago",
        "Maipú",
        "Las Condes",
        "Providencia",
        "Ñuñoa",
        "La Florida",
        "Puente Alto"
    ],
    "O'Higgins": [
        "Rancagua",
        "Machalí",
        "San Fernando",
        "Rengo"
    ],
    "Maule": [
        "Talca",
        "Curicó",
        "Linares",
        "Cauquenes"
    ],
    "Ñuble": [
        "Chillán",
        "San Carlos",
        "Bulnes",
        "Yungay"
    ],
    "Biobío": [
        "Concepción",
        "Talcahuano",
        "Los Ángeles",
        "Coronel"
    ],
    "La Araucanía": [
        "Temuco",
        "Angol",
        "Villarrica",
        "Pucón"
    ],
    "Los Ríos": [
        "Valdivia",
        "La Unión",
        "Panguipulli",
        "Río Bueno"
    ],
    "Los Lagos": [
        "Puerto Montt",
        "Osorno",
        "Castro",
        "Ancud"
    ],
    "Aysén": [
        "Coyhaique",
        "Aysén",
        "Chile Chico",
        "Cochrane"
    ],
    "Magallanes": [
        "Punta Arenas",
        "Puerto Natales",
        "Porvenir",
        "Cabo de Hornos"
    ]
};
