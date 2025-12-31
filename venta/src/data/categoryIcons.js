import {
  IconBasket,
  IconShoppingCart,
  IconBuildingStore,
  IconMilk,
  IconMeat,
  IconFish,
  IconApple,
  IconCarrot,
  IconBread,
  IconIceCream,
  IconCoffee,
  IconBeer,
  IconGlassFull, // bebidas general
  IconDeviceLaptop,
  IconDeviceMobile,
  IconBabyBottle,
  IconHome,
  IconTool,
  IconDeviceGamepad,
  IconMusic,
  IconMovie,
  IconHeart,
  IconBallBasketball,
  IconTent,
  IconGasStation,
  IconCar,
  IconPackage,
  IconPencil, // para escritura, marcadores y resaltadores
  IconRuler,
  IconScissors,
  IconPaperclip,
  IconFileText,
  IconPrinter,
  IconCopy,
  IconGenderFemale,
  IconGenderMale,

  IconSunglasses, // gafas/accesorios
  IconUmbrella,
  IconDiamond, // joyería
  IconClock,
  IconHeadphones,
  IconDeviceTv,
  IconPlug,
  IconBulb,
  IconBattery,
  IconCamera,
  IconBallBaseball,
  IconBike,
  IconWaveSine, // natación
  IconRun,
  IconFirstAidKit,
  IconPills,
  IconThermometer,
  IconStethoscope,
  IconPlant,
  IconTree,
  IconDog,
  IconCat,
  IconBrush, // pintura y limpieza
  IconKey,
  IconMotorbike,
  IconBus,
  IconTruck,
  IconSofa,
  IconArmchair,
  IconBed,
  IconBath, // ← IconBath existe (perfecto para baño y duchas)
  IconToolsKitchen,
  IconGlassCocktail, // fiestas, vino, cheers
  IconCookie,
  IconCake,
  IconBriefcase,
  IconBallFootball,
  IconBallVolleyball,
  IconBallTennis,
  IconMountain,
  IconSkateboard, // esquí aproximado
  IconSnowflake, // snowboard
  IconBook,
  IconPaint,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconCpu,
  IconUserCheck, // doctor
  IconBuildingHospital,
  IconCapsule,
  IconBandage,
  IconPaw,
  IconBone,
  IconDoor,
  IconFlame,
  IconWind,
  IconToiletPaper,
  IconDroplet, // aceite
  IconBatteryAutomotive,
  IconBabyCarriage,
  IconPuzzle,
  IconRobot,
  IconDice,
  IconGuitarPick,
  IconShoe,
  IconShoppingBag,
  IconGift,
  IconPizza,
  IconBurger,
  IconShirt, // ← IconShirt existe directamente
  IconChefHat as IconHat // sombrero/gorra (gorro de chef, el más cercano)
} from '@tabler/icons-react';

// Icono por defecto
const defaultIcon = IconBuildingStore;

export const categoryIcons = {
  // Abarrotes y Supermercado
  'abarrotes': IconBasket,
  'supermercado': IconShoppingCart,
  'lácteos': IconMilk,
  'carnes': IconMeat,
  'pescados': IconFish,
  'frutas': IconApple,
  'verduras': IconCarrot,
  'panadería': IconBread,
  'congelados': IconIceCream,
  'bebidas': IconGlassFull,
  'alcohol': IconBeer,
  'snacks': IconCookie,
  'granos': IconPlant,
  'enlatados': IconPackage,
  'especias': IconCookie,

  // Papelería y Oficina
  'papelería': IconBook,
  'oficina': IconPrinter,
  'escritura': IconPencil,
  'arte': IconPaint,
  'útiles escolares': IconPencil,
  'cuadernos': IconBook,
  'papel': IconFileText,
  'marcadores': IconPencil,
  'resaltadores': IconPencil,
  'tijeras': IconScissors,
  'pegamento': IconPaperclip,
  'reglas': IconRuler,

  // Ropa y Accesorios
  'ropa': IconShirt,
  'camisetas': IconShirt,
  'zapatos': IconShoe,
  'accesorios': IconSunglasses,
  'ropa femenina': IconGenderFemale,
  'ropa masculina': IconGenderMale,
  'ropa infantil': IconBabyCarriage,
  
  'sombreros': IconHat,
  'bolsos': IconShoppingBag,
  'joyería': IconDiamond,
  'relojes': IconClock,
  'gafas': IconSunglasses,
  'paraguas': IconUmbrella,

  // Electrónica
  'electrónica': IconDeviceLaptop,
  'celulares': IconDeviceMobile,
  'computadoras': IconDeviceDesktop,
  'tablets': IconDeviceTablet,
  'audífonos': IconHeadphones,
  'televisores': IconDeviceTv,
  'cámaras': IconCamera,
  'consolas': IconDeviceGamepad,
  'baterías': IconBattery,
  'cables': IconPlug,
  'bombillos': IconBulb,
  'componentes': IconCpu,

  // Deportes
  'deportes': IconBallBasketball,
  'fútbol': IconBallFootball,
  'béisbol': IconBallBaseball,
  'vóleibol': IconBallVolleyball,
  'tenis': IconBallTennis,
  'ciclismo': IconBike,
  'natación': IconWaveSine,
  'atletismo': IconRun,
  'camping': IconTent,
  'montañismo': IconMountain,
  'senderismo': IconRun,
  'esquí': IconSkateboard,
  'snowboard': IconSnowflake,

  // Farmacia y Salud
  'farmacia': IconHeart,
  'medicinas': IconPills,
  'primeros auxilios': IconFirstAidKit,
  'termómetros': IconThermometer,
  'equipo médico': IconStethoscope,
  'hospital': IconBuildingHospital,
  'doctor': IconUserCheck,
  'cápsulas': IconCapsule,
  'curitas': IconBandage,

  // Mascotas
  'mascotas': IconPaw,
  'perros': IconDog,
  'gatos': IconCat,
  'alimento mascotas': IconBone,
  'juguetes mascotas': IconPaw,

  // Ferretería y Hogar
  'ferretería': IconTool,
  'pintura': IconBrush,
  'cerraduras': IconKey,
  'cajas herramientas': IconTool,
  'hogar': IconHome,
  'muebles': IconSofa,
  'sillas': IconArmchair,
  'camas': IconBed,
  'baño': IconBath,
  'cocina': IconToolsKitchen,
  'puertas': IconDoor,
  'sofás': IconSofa,
  'iluminación': IconBulb,
  'calefacción': IconFlame,
  'ventilación': IconWind,
  'duchas': IconBath, // uso IconBath (bañera/ducha)
  'inodoros': IconToiletPaper,

  // Automóviles
  'automóviles': IconCar,
  'motocicletas': IconMotorbike,
  'bicicletas': IconBike,
  'camiones': IconTruck,
  'autobuses': IconBus,
  'gasolina': IconGasStation,
  'aceite': IconDroplet,
  'baterías': IconBatteryAutomotive,

  // Bebés
  'bebés': IconBabyCarriage,
  'pañales': IconBabyCarriage,
  'juguetes bebé': IconBabyCarriage,
  'cunas': IconBed,

  // Juguetes y Entretenimiento
  'juguetes': IconDeviceGamepad,
  'rompecabezas': IconPuzzle,
  'robots': IconRobot,
  'juegos mesa': IconDice,
  'música': IconMusic,
  'instrumentos': IconGuitarPick,
  'películas': IconMovie,
  'videojuegos': IconDeviceGamepad,
  'libros': IconBook,

  // Varios
  'fiestas': IconGlassCocktail,
  'cumpleaños': IconCake,
  'regalos': IconGift,
  'limpieza': IconBrush,
  'jardinería': IconTree,
  'oficina': IconBriefcase,
  'cafetería': IconCoffee,
  'restaurante': IconToolsKitchen,
  'hamburguesas': IconBurger,
  'pizzas': IconPizza,
  'helados': IconIceCream,
  'pasteles': IconCake,
  'café': IconCoffee,
  'vino': IconGlassCocktail,
  'cerveza': IconBeer,

  // Default
  'default': defaultIcon,
  'general': defaultIcon,
  'sin categoría': defaultIcon,
  'otros': IconPackage,
  'varios': IconPackage
};

export const getCategoryIcon = (category) => {
  if (!category) return defaultIcon;

  const normalizedCategory = category.toLowerCase().trim();

  if (categoryIcons[normalizedCategory]) {
    return categoryIcons[normalizedCategory];
  }

  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return icon;
    }
  }

  return defaultIcon;
};

export const categoryColors = {
  'abarrotes': 'bg-orange-100 text-orange-600',
  'supermercado': 'bg-yellow-100 text-yellow-600',
  'lácteos': 'bg-blue-100 text-blue-600',
  'carnes': 'bg-red-100 text-red-600',
  'pescados': 'bg-teal-100 text-teal-600',
  'frutas': 'bg-green-100 text-green-600',
  'verduras': 'bg-lime-100 text-lime-600',
  'panadería': 'bg-amber-100 text-amber-600',
  'congelados': 'bg-cyan-100 text-cyan-600',
  'bebidas': 'bg-purple-100 text-purple-600',
  'alcohol': 'bg-indigo-100 text-indigo-600',
  'snacks': 'bg-pink-100 text-pink-600',

  'ropa': 'bg-pink-100 text-pink-600',
  'zapatos': 'bg-rose-100 text-rose-600',
  'accesorios': 'bg-fuchsia-100 text-fuchsia-600',

  'electrónica': 'bg-violet-100 text-violet-600',
  'celulares': 'bg-indigo-100 text-indigo-600',
  'computadoras': 'bg-blue-100 text-blue-600',

  'papelería': 'bg-sky-100 text-sky-600',
  'oficina': 'bg-blue-100 text-blue-600',
  'escritura': 'bg-cyan-100 text-cyan-600',

  'deportes': 'bg-emerald-100 text-emerald-600',
  'fútbol': 'bg-green-100 text-green-600',
  'natación': 'bg-teal-100 text-teal-600',

  'farmacia': 'bg-red-100 text-red-600',
  'medicinas': 'bg-rose-100 text-rose-600',
  'salud': 'bg-pink-100 text-pink-600',

  'mascotas': 'bg-yellow-100 text-yellow-600',

  'ferretería': 'bg-stone-100 text-stone-600',
  'herramientas': 'bg-gray-100 text-gray-600',
  'hogar': 'bg-amber-100 text-amber-600',

  'automóviles': 'bg-slate-100 text-slate-600',
  'motocicletas': 'bg-gray-100 text-gray-600',

  'bebés': 'bg-pink-100 text-pink-600',

  'juguetes': 'bg-fuchsia-100 text-fuchsia-600',
  'música': 'bg-purple-100 text-purple-600',
  'películas': 'bg-blue-100 text-blue-600',
  'libros': 'bg-amber-100 text-amber-600',
  'videojuegos': 'bg-violet-100 text-violet-600',

  'restaurante': 'bg-red-100 text-red-600',
  'cafetería': 'bg-brown-100 text-brown-600',
  'pizzas': 'bg-orange-100 text-orange-600',

  'default': 'bg-gray-100 text-gray-600',
  'general': 'bg-gray-100 text-gray-600',
  'sin categoría': 'bg-gray-100 text-gray-600',
  'otros': 'bg-gray-100 text-gray-600',
  'varios': 'bg-gray-100 text-gray-600'
};

export const getCategoryColor = (category) => {
  if (!category) return categoryColors.default;

  const normalizedCategory = category.toLowerCase().trim();

  if (categoryColors[normalizedCategory]) {
    return categoryColors[normalizedCategory];
  }

  for (const [key, color] of Object.entries(categoryColors)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return color;
    }
  }

  return categoryColors.default;
};