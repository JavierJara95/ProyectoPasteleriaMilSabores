const regionesComunas = {
    "Región Metropolitana": [
        "Santiago",
        "Maipú",
        "Puente Alto",
        "Las Condes",
        "Ñuñoa"
    ],
    "Valparaíso": [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué",
        "Villa Alemana"
    ],
    "Biobío": [
        "Concepción",
        "Talcahuano",
        "Chiguayante",
        "San Pedro de la Paz"
    ],
    "La Araucanía": [
        "Temuco",
        "Padre Las Casas",
        "Villarrica",
        "Angol"
    ]
};

const productos = [
    {
        codigo: "TC001",
        categoria: "Tortas Cuadradas",
        nombre: "Torta Cuadrada de Chocolate",
        precio: 45000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta cuadrada de chocolate, ideal para celebraciones y ocasiones especiales.",
        imagen: "../assets/img/torta-cuadr-chocolate.jpg"
    },
    {
        codigo: "TC002",
        categoria: "Tortas Cuadradas",
        nombre: "Torta Cuadrada de Frutas",
        precio: 50000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta cuadrada de frutas, ideal para compartir en celebraciones.",
        imagen: "../assets/img/torta-cuadr-frutas.jpg"
    },
    {
        codigo: "TT001",
        categoria: "Tortas Circulares",
        nombre: "Torta Circular de Vainilla",
        precio: 40000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta circular de vainilla con un sabor suave y delicioso.",
        imagen: "../assets/img/torta-circu-vainilla.jpg"
    },
    {
        codigo: "TT002",
        categoria: "Tortas Circulares",
        nombre: "Torta Circular de Manjar",
        precio: 42000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta circular de manjar, perfecta para disfrutar en familia.",
        imagen: "../assets/img/torta-circu-manjar.jpg"
    },
    {
        codigo: "PI001",
        categoria: "Postres Individuales",
        nombre: "Mousse de Chocolate",
        precio: 5000,
        tipo: "Postre",
        tamano: "Individual",
        descripcion: "Mousse individual de chocolate con una textura suave y cremosa.",
        imagen: "../assets/img/mousse-chocolate.jpg"
    },
    {
        codigo: "PI002",
        categoria: "Postres Individuales",
        nombre: "Tiramisu Clásico",
        precio: 5500,
        tipo: "Postre",
        tamano: "Individual",
        descripcion: "Tiramisu clásico en formato individual.",
        imagen: "../assets/img/tiramisu.jpg"
    },
    {
        codigo: "PSA001",
        categoria: "Productos Sin Azúcar",
        nombre: "Torta Sin Azúcar de Naranja",
        precio: 48000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta de naranja sin azúcar, ideal para quienes buscan una alternativa diferente.",
        imagen: "../assets/img/torta-sa-naranja.jpg"
    },
    {
        codigo: "PSA002",
        categoria: "Productos Sin Azúcar",
        nombre: "Cheesecake Sin Azúcar",
        precio: 47000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Cheesecake sin azúcar con una textura cremosa y suave.",
        imagen: "../assets/img/cheesecake-sa.jpg"
    },
    {
        codigo: "PT001",
        categoria: "Pastelería Tradicional",
        nombre: "Empanada de Manzana",
        precio: 3000,
        tipo: "Pastelería",
        tamano: "Individual",
        descripcion: "Empanada de manzana, una preparación tradicional y deliciosa.",
        imagen: "../assets/img/empanada-manzana.jpg"
    },
    {
        codigo: "PT002",
        categoria: "Pastelería Tradicional",
        nombre: "Tarta de Santiago",
        precio: 6000,
        tipo: "Pastelería",
        tamano: "Individual",
        descripcion: "Tarta de Santiago, una preparación tradicional de la pastelería.",
        imagen: "../assets/img/tarta-santiago.jpg"
    },
    {
        codigo: "PG001",
        categoria: "Productos Sin Gluten",
        nombre: "Brownie Sin Gluten",
        precio: 4000,
        tipo: "Postre",
        tamano: "Individual",
        descripcion: "Brownie sin gluten, ideal para disfrutar de un dulce delicioso.",
        imagen: "../assets/img/brownie-sg.jpg"
    },
    {
        codigo: "PG002",
        categoria: "Productos Sin Gluten",
        nombre: "Pan Sin Gluten",
        precio: 3500,
        tipo: "Panadería",
        tamano: "Individual",
        descripcion: "Pan sin gluten, preparado como una alternativa para distintos tipos de alimentación.",
        imagen: "../assets/img/pan-sg.jpg"
    },
    {
        codigo: "PV001",
        categoria: "Productos Vegana",
        nombre: "Torta Vegana de Chocolate",
        precio: 50000,
        tipo: "Torta",
        tamano: "Mediana",
        descripcion: "Torta vegana de chocolate, ideal para celebraciones y ocasiones especiales.",
        imagen: "../assets/img/torta-veg-choc.jpg"
    },
    {
        codigo: "PV002",
        categoria: "Productos Vegana",
        nombre: "Galletas Veganas de Avena",
        precio: 4500,
        tipo: "Galleta",
        tamano: "Individual",
        descripcion: "Galletas veganas de avena, una alternativa dulce y deliciosa.",
        imagen: "../assets/img/galletas-veg-avena.jpg"
    },
    {
        codigo: "TE001",
        categoria: "Tortas Especiales",
        nombre: "Torta Especial de Cumpleaños",
        precio: 55000,
        tipo: "Torta",
        tamano: "Grande",
        descripcion: "Torta especial de cumpleaños pensada para celebrar momentos importantes.",
        imagen: "../assets/img/torta-cumple.jpg"
    },
    {
        codigo: "TE002",
        categoria: "Tortas Especiales",
        nombre: "Torta Especial de Boda",
        precio: 60000,
        tipo: "Torta",
        tamano: "Grande",
        descripcion: "Torta especial de boda diseñada para acompañar una celebración única.",
        imagen: "../assets/img/torta-bodas.jpg"
    }
];
