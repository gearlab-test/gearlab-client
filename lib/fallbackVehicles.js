const commonBikeServices = [
  { category: 'services', name: 'Full Health Check', price: 1200 },
  { category: 'services', name: 'Oil & Filter Change', price: 2500 },
  { category: 'services', name: 'Chain Cleaning & Lubing', price: 800 },
  { category: 'services', name: 'Brake Pad Replacement', price: 1800 },
  { category: 'services', name: 'Ceramic Coating', price: 8500 },
];

const commonCarServices = [
  { category: 'services', name: 'Complete Diagnostics', price: 2500 },
  { category: 'services', name: 'Synthetic Oil Service', price: 4500 },
  { category: 'services', name: 'Brake System Overhaul', price: 6500 },
  { category: 'services', name: 'AC Deep Cleaning', price: 3200 },
  { category: 'services', name: 'Nano Ceramic Coating', price: 25000 },
];

export const fallbackVehicles = [
  // ─── BIKES (15) ───
  {
    _id: '663000000000000000000001',
    name: 'Royal Enfield Meteor 350',
    type: 'bike',
    basePrice: 1500,
    images: ['https://asset.kompas.com/crops/gU9EkWsd0GhOiomSuy3pDVs9J2I=/252x0:1852x1066/1200x800/data/photo/2021/02/15/6029e417e4432.jpg'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Fireball Red', price: 0 },
      { category: 'color', name: 'Supernova Blue', price: 0 },
      { category: 'color', name: 'Stellar Black', price: 0 },
      { category: 'exhaust', name: 'Stock Exhaust', price: 0 },
      { category: 'exhaust', name: 'Rynox Performance Exhaust', price: 14000 },
      { category: 'exhaust', name: 'Arrow Full System', price: 28000 },
      { category: 'accessories', name: 'Touring Windscreen', price: 4500 },
      { category: 'accessories', name: 'Leather Saddlebags', price: 7000 },
      { category: 'accessories', name: 'Crash Guard', price: 3200 },
      { category: 'tyres', name: 'MRF Zapper Stock', price: 0 },
      { category: 'tyres', name: 'Michelin Road 5', price: 8500 },
      { category: 'wrapping', name: 'Matte Black Wrap', price: 12000 },
    ]
  },
  {
    _id: '663000000000000000000002',
    name: 'KTM Duke 390',
    type: 'bike',
    basePrice: 1800,
    images: ['https://cdn1.smartprix.com/rx-iCMjliXyo-w1200-h1200/CMjliXyo.webp'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'KTM Orange', price: 0 },
      { category: 'color', name: 'Ceramic White', price: 0 },
      { category: 'exhaust', name: 'Akrapovic Slip-On', price: 22000 },
      { category: 'accessories', name: 'Tail Tidy Kit', price: 2500 },
      { category: 'accessories', name: 'Frame Sliders', price: 3500 },
      { category: 'tyres', name: 'Pirelli Angel GT', price: 9000 },
      { category: 'wrapping', name: 'Matte Orange Wrap', price: 13000 },
    ]
  },
  {
    _id: '663000000000000000000003',
    name: 'Bajaj Pulsar NS200',
    type: 'bike',
    basePrice: 1200,
    images: ['https://i.ytimg.com/vi/3icGZF9yfyg/maxresdefault.jpg'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Fiery Orange', price: 0 },
      { category: 'color', name: 'Midnight Black', price: 0 },
      { category: 'exhaust', name: 'Mivv Urban Steel', price: 11000 },
      { category: 'accessories', name: 'Fairing Kit', price: 5500 },
      { category: 'tyres', name: 'CEAT Zoom Cruz', price: 5500 },
      { category: 'wrapping', name: 'Matte Grey Wrap', price: 10000 },
    ]
  },
  {
    _id: '663000000000000000000004',
    name: 'Honda H\'ness CB350',
    type: 'bike',
    basePrice: 1400,
    images: ['https://blog.gaadikey.com/wp-content/uploads/2020/09/Honda-CB350-Motorcycle-Honda-Hness.jpg'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Precious Red Metallic', price: 0 },
      { category: 'color', name: 'Pearl Night Star Black', price: 0 },
      { category: 'exhaust', name: 'Custom Chrome Slip-On', price: 13500 },
      { category: 'accessories', name: 'Vintage Split Seats', price: 6000 },
      { category: 'accessories', name: 'Engine Bash Plate', price: 2800 },
      { category: 'wrapping', name: 'Cafe Racer Brown Wrap', price: 14000 },
    ]
  },
  {
    _id: '663000000000000000000005',
    name: 'TVS Apache RTR 200 4V',
    type: 'bike',
    basePrice: 1300,
    images: ['https://cdn.bikedekho.com/processedimages/tvs/2025-apache-rtr-200-4v/source/2025-apache-rtr-200-4v6846e0a85525b.jpg'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Gloss Black', price: 0 },
      { category: 'color', name: 'Pearl White', price: 0 },
      { category: 'exhaust', name: 'TVS Racing Custom Canister', price: 9500 },
      { category: 'accessories', name: 'Adjustable Levers', price: 2200 },
      { category: 'tyres', name: 'Eurogrip Protorq Extreme', price: 6800 },
      { category: 'wrapping', name: 'Matte Red Wrap', price: 10500 },
    ]
  },
  {
    _id: '663000000000000000000006',
    name: 'Yamaha YZF R15 V4',
    type: 'bike',
    basePrice: 1600,
    images: ['https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Racing Blue', price: 0 },
      { category: 'color', name: 'Metallic Grey', price: 0 },
      { category: 'exhaust', name: 'Akrapovic GP Racing Full System', price: 24000 },
      { category: 'accessories', name: 'Aerodynamic Winglets', price: 3800 },
      { category: 'accessories', name: 'Quickshifter Upgrade', price: 7500 },
      { category: 'tyres', name: 'Metzeler Sportec M5', price: 9500 },
      { category: 'wrapping', name: 'Monster Energy Stealth Wrap', price: 13500 },
    ]
  },
  {
    _id: '663000000000000000000007',
    name: 'Kawasaki Ninja 400',
    type: 'bike',
    basePrice: 2800,
    images: ['https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Lime Green KRT Edition', price: 0 },
      { category: 'color', name: 'Metallic Carbon Grey', price: 0 },
      { category: 'exhaust', name: 'Yoshimura Alpha-T Slip-On', price: 38000 },
      { category: 'accessories', name: 'Dark Smoke Double Bubble Windscreen', price: 4200 },
      { category: 'accessories', name: 'R&G Aero Frame Sliders', price: 6500 },
      { category: 'tyres', name: 'Pirelli Diablo Rosso IV', price: 16000 },
      { category: 'wrapping', name: 'Satin Lime & Black Wrap', price: 18000 },
    ]
  },
  {
    _id: '663000000000000000000008',
    name: 'Royal Enfield Continental GT 650',
    type: 'bike',
    basePrice: 2200,
    images: ['https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Mr Clean Chrome', price: 8000 },
      { category: 'color', name: 'British Racing Green', price: 0 },
      { category: 'exhaust', name: 'Red Rooster Performance Twin Slip-Ons', price: 22000 },
      { category: 'accessories', name: 'Single Cafe Racer Seat with Cowl', price: 5500 },
      { category: 'accessories', name: 'CNC Machined Bar-End Mirrors', price: 3800 },
      { category: 'tyres', name: 'Ceat Zoom Cruz Dual', price: 9000 },
      { category: 'wrapping', name: 'Vintage Emerald Green Wrap', price: 16000 },
    ]
  },
  {
    _id: '663000000000000000000009',
    name: 'BMW G 310 GS',
    type: 'bike',
    basePrice: 2500,
    images: ['https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Rallye Style Cyan & Red', price: 0 },
      { category: 'color', name: 'Cosmic Black', price: 0 },
      { category: 'exhaust', name: 'Akrapovic Titanium Hexagonal Exhaust', price: 34000 },
      { category: 'accessories', name: 'Aluminum Pannier Set & Top Case', price: 28000 },
      { category: 'accessories', name: 'Touring Tall Windscreen', price: 6200 },
      { category: 'tyres', name: 'Metzeler Tourance Dual-Sport', price: 12500 },
      { category: 'wrapping', name: 'Dakar Desert Sand Wrap', price: 15500 },
    ]
  },
  {
    _id: '663000000000000000000010',
    name: 'Triumph Speed 400',
    type: 'bike',
    basePrice: 2400,
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Carnival Red', price: 0 },
      { category: 'color', name: 'Phantom Black', price: 0 },
      { category: 'exhaust', name: 'Triumph Vance & Hines Silencer', price: 26000 },
      { category: 'accessories', name: 'Quilted Diamond Stitch Twin Seat', price: 7200 },
      { category: 'accessories', name: 'Compact Flyscreen', price: 3900 },
      { category: 'tyres', name: 'Apollo Alpha H1 Radial', price: 9200 },
      { category: 'wrapping', name: 'Matte Storm Grey Wrap', price: 14500 },
    ]
  },
  {
    _id: '663000000000000000000011',
    name: 'Harley-Davidson X440',
    type: 'bike',
    basePrice: 2600,
    images: ['https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Mustard Denim Yellow', price: 0 },
      { category: 'color', name: 'Dark Silver Metallic', price: 0 },
      { category: 'exhaust', name: 'Screamin\' Eagle Custom Pipe', price: 32000 },
      { category: 'accessories', name: 'Backrest with Luggage Rack', price: 8500 },
      { category: 'tyres', name: 'MRF Zapper Hyke Spec', price: 9500 },
      { category: 'wrapping', name: 'Matte Denim Black Wrap', price: 16500 },
    ]
  },
  {
    _id: '663000000000000000000012',
    name: 'Ducati Scrambler Icon',
    type: 'bike',
    basePrice: 4500,
    images: ['https://images.unsplash.com/photo-1596700878567-96a6d6361a34?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: '\'62 Yellow', price: 0 },
      { category: 'color', name: 'Thrilling Black', price: 0 },
      { category: 'exhaust', name: 'Termignoni Racing Silencer Kit', price: 68000 },
      { category: 'accessories', name: 'Billet Aluminum Footpegs', price: 8500 },
      { category: 'tyres', name: 'Pirelli MT 60 RS', price: 21000 },
      { category: 'wrapping', name: 'Urban Camo Matte Wrap', price: 22000 },
    ]
  },
  {
    _id: '663000000000000000000013',
    name: 'Suzuki Hayabusa',
    type: 'bike',
    basePrice: 8500,
    images: ['https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Glass Sparkle Black / Candy Burnt Gold', price: 0 },
      { category: 'exhaust', name: 'Yoshimura Heptacone Dual Titanium Exhaust', price: 120000 },
      { category: 'accessories', name: 'Brembo Stylema Racing Master Cylinder', price: 35000 },
      { category: 'tyres', name: 'Bridgestone Battlax Hypersport S22', price: 32000 },
      { category: 'wrapping', name: 'Full Satin Pearl White Wrap', price: 28000 },
    ]
  },
  {
    _id: '663000000000000000000014',
    name: 'KTM RC 390',
    type: 'bike',
    basePrice: 2000,
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'KTM Factory Racing Blue & Orange', price: 0 },
      { category: 'exhaust', name: 'Akrapovic Titanium GP Slip-on', price: 29000 },
      { category: 'accessories', name: 'Adjustable Clip-on Handlebars', price: 7800 },
      { category: 'tyres', name: 'Continental ContiSlice Track Tyres', price: 14500 },
      { category: 'wrapping', name: 'Red Bull Moto3 Livery Wrap', price: 18500 },
    ]
  },
  {
    _id: '663000000000000000000015',
    name: 'Hero Xpulse 200 4V',
    type: 'bike',
    basePrice: 1100,
    images: ['https://images.unsplash.com/photo-1568772585472-d5cb6934c9c8?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonBikeServices,
      { category: 'color', name: 'Matte Nexus Blue', price: 0 },
      { category: 'exhaust', name: 'Rally Pack Free-Flow Exhaust', price: 12500 },
      { category: 'accessories', name: 'Maxxis Rally Kit Knobby Tyres', price: 8500 },
      { category: 'accessories', name: 'High-Rise Rally Handlebar & Risers', price: 3200 },
      { category: 'wrapping', name: 'Mud Splatter Adventure Wrap', price: 11000 },
    ]
  },

  // ─── CARS (15) ───
  {
    _id: '663000000000000000000016',
    name: 'Maruti Suzuki Swift',
    type: 'car',
    basePrice: 2500,
    images: ['https://motoringworld.in/wp-content/uploads/2023/12/2024-maruti-swift-1.jpg'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Luster Blue', price: 0 },
      { category: 'color', name: 'Sizzling Red', price: 0 },
      { category: 'exhaust', name: 'Remus Sport Dual Tip', price: 28000 },
      { category: 'alloys', name: '16" Diamond Cut Alloys', price: 24000 },
      { category: 'spoiler', name: 'Sport Roof Spoiler', price: 6500 },
      { category: 'tyres', name: 'Yokohama Earth-1', price: 18000 },
      { category: 'wrapping', name: 'Matte Black Wrap', price: 45000 },
    ]
  },
  {
    _id: '663000000000000000000017',
    name: 'Hyundai Creta',
    type: 'car',
    basePrice: 4000,
    images: ['https://images.overdrive.in/wp-content/uploads/2024/01/2024-hyundai-creta-04-900x506.jpg'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Ranger Khaki', price: 0 },
      { category: 'color', name: 'Abyss Black', price: 0 },
      { category: 'alloys', name: '17" Diamond Cut Alloys', price: 32000 },
      { category: 'sunroof', name: 'Panoramic Sunroof Upgrade', price: 45000 },
      { category: 'accessories', name: 'Side Step Board', price: 12000 },
      { category: 'wrapping', name: 'Matte Grey Wrap', price: 55000 },
    ]
  },
  {
    _id: '663000000000000000000018',
    name: 'Tata Nexon',
    type: 'car',
    basePrice: 3500,
    images: ['https://imgd.aeplcdn.com/1920x1080/n/cw/ec/141867/nexon-facelift-exterior-right-front-three-quarter-69.jpeg?isig=0&q=80&q=80'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Fearless Purple', price: 0 },
      { category: 'color', name: 'Creative Ocean', price: 0 },
      { category: 'alloys', name: '16" Aero Alloys', price: 26000 },
      { category: 'sunroof', name: 'Electric Sunroof', price: 35000 },
      { category: 'wrapping', name: 'Matte Black Wrap', price: 48000 },
    ]
  },
  {
    _id: '663000000000000000000019',
    name: 'Mahindra Scorpio-N',
    type: 'car',
    basePrice: 5000,
    images: ['https://www.team-bhp.com/sites/default/files/pictures2021/mahindra-scorpio-gto-review-1.jpg'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Deep Forest', price: 5000 },
      { category: 'alloys', name: '20" Off-Road Alloys', price: 35000 },
      { category: 'tyres', name: 'BF Goodrich All-Terrain', price: 42000 },
      { category: 'accessories', name: 'Bull Bar', price: 18000 },
      { category: 'accessories', name: 'Snorkel Kit', price: 22000 },
      { category: 'wrapping', name: 'Army Green Wrap', price: 65000 },
    ]
  },
  {
    _id: '663000000000000000000020',
    name: 'Honda City',
    type: 'car',
    basePrice: 4500,
    images: ['https://akm-img-a-in.tosshub.com/indiatoday/images/story/202302/honda_city_2-sixteen_nine.jpg?VersionId=Pa4WaR8KrPfyJu4oRtTvEk0w0G7TQp3z'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Radiant Red Metallic', price: 5000 },
      { category: 'alloys', name: '17" Diamond Cut Alloys', price: 20000 },
      { category: 'sunroof', name: 'Electric Sunroof', price: 38000 },
      { category: 'spoiler', name: 'OEM Trunk Spoiler', price: 7500 },
      { category: 'accessories', name: 'Honda Sensing ADAS Kit', price: 35000 },
      { category: 'wrapping', name: 'Gloss Black Wrap', price: 50000 },
    ]
  },
  {
    _id: '663000000000000000000021',
    name: 'Mahindra Thar 4x4',
    type: 'car',
    basePrice: 4800,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Rocky Beige', price: 0 },
      { category: 'alloys', name: '18" Fuel Off-Road Matte Black Wheels', price: 48000 },
      { category: 'tyres', name: 'Maxxis Bighorn 33-inch M/T Tyres', price: 55000 },
      { category: 'accessories', name: 'Steel Winch Bumper with Warn 9.5cti', price: 42000 },
      { category: 'accessories', name: 'Bravo Snorkel Kit', price: 18500 },
      { category: 'wrapping', name: 'Matte Battle Green Wrap', price: 68000 },
    ]
  },
  {
    _id: '663000000000000000000022',
    name: 'Toyota Fortuner',
    type: 'car',
    basePrice: 6500,
    images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Platinum White Pearl', price: 10000 },
      { category: 'exhaust', name: 'TRD Twin-Pipe Exhaust System', price: 58000 },
      { category: 'alloys', name: '20" Lenso Venom Forged Alloys', price: 65000 },
      { category: 'tyres', name: 'Yokohama Geolandar A/T G015', price: 48000 },
      { category: 'accessories', name: 'Legender Aerodynamic Bodykit', price: 75000 },
      { category: 'wrapping', name: 'Satin Stealth Black Wrap', price: 75000 },
    ]
  },
  {
    _id: '663000000000000000000023',
    name: 'Volkswagen Virtus GT',
    type: 'car',
    basePrice: 4800,
    images: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Wild Cherry Red', price: 0 },
      { category: 'exhaust', name: 'Remus Valvetronic Quad Performance Exhaust', price: 65000 },
      { category: 'alloys', name: '17" BBS Super RS Replica Alloys', price: 38000 },
      { category: 'spoiler', name: 'Carbon Fiber Ducktail Trunk Spoiler', price: 14500 },
      { category: 'accessories', name: 'Stage 1 Carbon Cold Air Intake', price: 24000 },
      { category: 'wrapping', name: 'Nardo Grey Satin Wrap', price: 58000 },
    ]
  },
  {
    _id: '663000000000000000000024',
    name: 'BMW M340i xDrive',
    type: 'car',
    basePrice: 9500,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Tanzanite Blue Metallic', price: 25000 },
      { category: 'exhaust', name: 'M Performance Titanium Valved Exhaust', price: 185000 },
      { category: 'alloys', name: '19" M Light Double-spoke 792 M Bicolour', price: 95000 },
      { category: 'spoiler', name: 'M Performance Carbon Pro Rear Spoiler', price: 36000 },
      { category: 'accessories', name: 'M Performance Carbon Rear Diffuser', price: 48000 },
      { category: 'tyres', name: 'Michelin Pilot Sport 4S (Staggered)', price: 65000 },
      { category: 'wrapping', name: 'Frozen Deep Grey Satin Wrap', price: 85000 },
    ]
  },
  {
    _id: '663000000000000000000025',
    name: 'Tata Harrier Dark Edition',
    type: 'car',
    basePrice: 5200,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Oberon Black (Dark Edition)', price: 0 },
      { category: 'alloys', name: '19" Blackstone Diamond Cut Alloys', price: 42000 },
      { category: 'sunroof', name: 'Voice-Activated Panoramic Sunroof', price: 52000 },
      { category: 'accessories', name: 'Harrier Stealth Body Aerokit', price: 28000 },
      { category: 'wrapping', name: 'Matte Obsidian Wrap', price: 62000 },
    ]
  },
  {
    _id: '663000000000000000000026',
    name: 'Hyundai Verna Turbo',
    type: 'car',
    basePrice: 4200,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Abyss Black Pearl', price: 0 },
      { category: 'exhaust', name: 'Twin-Tip Sport Tuned Muffler', price: 29000 },
      { category: 'alloys', name: '17" Midnight Black Turbo Alloys', price: 31000 },
      { category: 'spoiler', name: 'Lip Trunk Spoiler', price: 8500 },
      { category: 'wrapping', name: 'Gloss Miami Blue Wrap', price: 52000 },
    ]
  },
  {
    _id: '663000000000000000000027',
    name: 'Kia Seltos GT Line',
    type: 'car',
    basePrice: 4400,
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Pewter Olive Matte', price: 12000 },
      { category: 'alloys', name: '18" Crystal Cut Gloss Alloys', price: 36000 },
      { category: 'sunroof', name: 'Dual-Pane Panoramic Sunroof', price: 46000 },
      { category: 'wrapping', name: 'Matte Graphite Wrap', price: 56000 },
    ]
  },
  {
    _id: '663000000000000000000028',
    name: 'Jeep Wrangler Rubicon',
    type: 'car',
    basePrice: 8000,
    images: ['https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Firecracker Red', price: 0 },
      { category: 'exhaust', name: 'Borla Touring Cat-Back Dual Exhaust', price: 78000 },
      { category: 'alloys', name: '17" Beadlock-Capable Offroad Wheels', price: 62000 },
      { category: 'tyres', name: 'BF Goodrich 35-inch Mud-Terrain KM3', price: 68000 },
      { category: 'accessories', name: 'Fox 2.5 Factory Race Series Suspension', price: 115000 },
      { category: 'wrapping', name: 'Desert Storm Matte Wrap', price: 78000 },
    ]
  },
  {
    _id: '663000000000000000000029',
    name: 'Skoda Octavia RS',
    type: 'car',
    basePrice: 6000,
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Mamba Green', price: 15000 },
      { category: 'exhaust', name: 'Milltek Sport Non-Resonated Cat-Back Exhaust', price: 82000 },
      { category: 'alloys', name: '19" Altair Anthracite Gloss Wheels', price: 52000 },
      { category: 'spoiler', name: 'RS Carbon Fiber Aerodynamic Spoiler', price: 21000 },
      { category: 'tyres', name: 'Pirelli P Zero Corsa', price: 46000 },
      { category: 'wrapping', name: 'Nardo Grey Satin Wrap', price: 64000 },
    ]
  },
  {
    _id: '663000000000000000000030',
    name: 'Porsche 911 Carrera',
    type: 'car',
    basePrice: 15000,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000'],
    availableOptions: [
      ...commonCarServices,
      { category: 'color', name: 'Guards Red', price: 0 },
      { category: 'color', name: 'Shark Blue', price: 35000 },
      { category: 'exhaust', name: 'Akrapovic Evolution Titanium Exhaust System', price: 320000 },
      { category: 'alloys', name: '20/21-inch Carrera Classic Wheels', price: 160000 },
      { category: 'spoiler', name: 'Aerokit High-Downforce Carbon Wing', price: 85000 },
      { category: 'accessories', name: 'Porsche Ceramic Composite Brakes (PCCB)', price: 280000 },
      { category: 'tyres', name: 'Michelin Pilot Sport Cup 2 R', price: 95000 },
      { category: 'wrapping', name: 'Satin Crayon Grey Full Vehicle Wrap', price: 110000 },
    ]
  }
];

export function getFallbackVehicles(type = null) {
  if (!type) return fallbackVehicles;
  return fallbackVehicles.filter(v => v.type === type);
}

export function getFallbackVehicleById(id) {
  return fallbackVehicles.find(v => v._id === id || String(v._id) === String(id));
}
