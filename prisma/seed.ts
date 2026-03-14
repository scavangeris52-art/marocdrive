import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('ChangezCeMotDePasse123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@marocdrive.ma' },
    update: {},
    create: {
      email: 'admin@marocdrive.ma',
      password: hashedPassword,
      name: 'Admin MarocDrive',
      role: 'admin',
    },
  })

  // Cars — suppression et recréation avec les bonnes images
  await prisma.car.deleteMany({})

  const cars = [
    {
      brand: 'Dacia',
      model: 'Logan',
      year: 2023,
      price: 250,
      category: 'economy',
      transmission: 'manual',
      fuel: 'petrol',
      image: 'https://i.postimg.cc/8jGyJNLk/dacilogan.jpg',
      descEn: 'Perfect for city driving and short trips. Fuel-efficient and easy to handle.',
      descFr: 'Parfaite pour la ville et les courts trajets. Économique et facile à conduire.',
      descAr: 'مثالية للقيادة في المدينة والرحلات القصيرة. اقتصادية وسهلة القيادة.',
      descEs: 'Perfecta para conducir en ciudad y viajes cortos. Eficiente en combustible.',
      featured: true,
    },
    {
      brand: 'Renault',
      model: 'Clio',
      year: 2024,
      price: 300,
      category: 'compact',
      transmission: 'manual',
      fuel: 'petrol',
      image: 'https://i.postimg.cc/dLFWkwGP/clio.jpg',
      descEn: 'Compact and stylish, ideal for exploring cities and countryside.',
      descFr: 'Compacte et élégante, idéale pour explorer villes et campagne.',
      descAr: 'مدمجة وأنيقة، مثالية لاستكشاف المدن والريف.',
      descEs: 'Compacto y elegante, ideal para explorar ciudades y campo.',
      featured: true,
    },
    {
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2023,
      price: 550,
      category: 'suv',
      transmission: 'automatic',
      fuel: 'diesel',
      image: 'https://i.postimg.cc/xcQsJnLT/hyuntucson.jpg',
      descEn: 'Spacious SUV perfect for family trips and desert excursions.',
      descFr: 'SUV spacieux, parfait pour les voyages en famille et le désert.',
      descAr: 'سيارة دفع رباعي فسيحة مثالية للرحلات العائلية وجولات الصحراء.',
      descEs: 'SUV espacioso perfecto para viajes familiares y excursiones al desierto.',
      featured: true,
    },
    {
      brand: 'Fiat',
      model: 'Tipo',
      year: 2023,
      price: 280,
      category: 'sedan',
      transmission: 'manual',
      fuel: 'diesel',
      image: 'https://i.postimg.cc/F7vPdN0v/fiat-tipo.jpg',
      descEn: 'Comfortable sedan with great fuel economy for long distances.',
      descFr: 'Berline confortable avec excellente économie de carburant.',
      descAr: 'سيدان مريحة مع اقتصاد ممتاز في الوقود للمسافات الطويلة.',
      descEs: 'Sedán cómodo con excelente economía de combustible para largas distancias.',
      featured: true,
    },
    {
      brand: 'Dacia',
      model: 'Duster',
      year: 2024,
      price: 450,
      category: 'suv',
      transmission: 'manual',
      fuel: 'diesel',
      image: 'https://i.postimg.cc/PPH6pT1h/Dacduster.jpg',
      descEn: 'Rugged and versatile — perfect for mountain roads and off-road adventures.',
      descFr: 'Robuste et polyvalent — parfait pour la montagne et le hors-piste.',
      descAr: 'متينة ومتعددة الاستخدامات — مثالية لطرق الجبال والمغامرات.',
      descEs: 'Robusto y versátil — perfecto para carreteras de montaña y aventuras.',
      featured: true,
    },
    {
      brand: 'Peugeot',
      model: '208',
      year: 2024,
      price: 320,
      category: 'compact',
      transmission: 'automatic',
      fuel: 'petrol',
      image: 'https://i.postimg.cc/0bCV7FCR/peu208.jpg',
      descEn: 'Modern compact with automatic transmission. Comfortable and fun to drive.',
      descFr: 'Compacte moderne avec boîte automatique. Agréable à conduire.',
      descAr: 'سيارة مدمجة حديثة بناقل حركة أوتوماتيكي. مريحة وممتعة للقيادة.',
      descEs: 'Compacto moderno con transmisión automática. Cómodo y divertido de conducir.',
      featured: true,
    },
  ]

  for (const car of cars) {
    await prisma.car.create({ data: car })
  }

  // Site settings
  const settings = [
    { key: 'site_name', value: 'MimounRifCar' },
    { key: 'phone', value: '+212 6 61 23 45 67' },
    { key: 'whatsapp', value: '+212661234567' },
    { key: 'email', value: 'contact@mimounrifcar.ma' },
    { key: 'address', value: '15 Bd Mohammed V, Centre-ville, Nador 62000' },
    { key: 'hours', value: '08:00-20:00 tous les jours' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Seed terminé avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
