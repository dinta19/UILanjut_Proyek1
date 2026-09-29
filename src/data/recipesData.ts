import type { Category, Recipe } from '../types/recipe'

export const categoriesData: Category[] = [
  {
    id: 'cat-1',
    slug: 'nusantara',
    name: 'Masakan Nusantara',
    description: 'Kelezatan cita rasa otentik rempah Indonesia yang kaya tradisi dan aroma memikat.',
    icon: '🍛',
    color: '#e06d28',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    recipeCount: 3
  },
  {
    id: 'cat-2',
    slug: 'western',
    name: 'Western & Pasta',
    description: 'Menu hidangan ala barat yang elegan, mulai dari pasta lembut hingga burger gurih.',
    icon: '🍝',
    color: '#2563eb',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    recipeCount: 2
  },
  {
    id: 'cat-3',
    slug: 'sarapan',
    name: 'Sarapan Praktis',
    description: 'Ide sarapan lezat, berenergi, dan cepat dibuat untuk mengawali pagi dengan ceria.',
    icon: '🥞',
    color: '#16a34a',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    recipeCount: 2
  },
  {
    id: 'cat-4',
    slug: 'dessert',
    name: 'Dessert & Camilan',
    description: 'Kudapan manis legit dan hidangan penutup pencuci mulut yang memanjakan lidah.',
    icon: '🍰',
    color: '#db2777',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    recipeCount: 2
  },
  {
    id: 'cat-5',
    slug: 'minuman',
    name: 'Minuman Segar',
    description: 'Racikan minuman dingin menyegarkan dan kopi kekinian pelepas dahaga.',
    icon: '🍹',
    color: '#0891b2',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    recipeCount: 1
  }
]

export const recipesData: Recipe[] = [
  {
    id: 'rendang-daging-sapi',
    slug: 'rendang-daging-sapi',
    title: 'Rendang Daging Sapi Padang Asli',
    categorySlug: 'nusantara',
    categoryName: 'Masakan Nusantara',
    description: 'Rendang sapi khas Minangkabau dimasak perlahan hingga bumbu meresap hitam karamel dan empuk sempurna.',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 30,
    cookTimeMinutes: 180,
    totalTimeMinutes: 210,
    servings: 6,
    difficulty: 'Mahir',
    rating: 4.9,
    reviewsCount: 342,
    isFeatured: true,
    caloriesPerServing: 460,
    chefName: 'Ibu Fatimah',
    origin: 'Padang, Sumatera Barat',
    ingredients: [
      { name: 'Daging sapi has dalam (potong kotak)', amount: 1, unit: 'kg' },
      { name: 'Santan kental dari 3 butir kelapa', amount: 1000, unit: 'ml' },
      { name: 'Santan encer', amount: 500, unit: 'ml' },
      { name: 'Batang serai (memarkan)', amount: 3, unit: 'batang' },
      { name: 'Daun kunyit (simpulkan)', amount: 2, unit: 'lembar' },
      { name: 'Daun jeruk purut buang tulang', amount: 5, unit: 'lembar' },
      { name: 'Asam kandis', amount: 2, unit: 'buah' },
      { name: 'Cabai merah keriting (haluskan)', amount: 150, unit: 'gram' },
      { name: 'Bawang merah (haluskan)', amount: 12, unit: 'butir' },
      { name: 'Bawang putih (haluskan)', amount: 6, unit: 'siung' },
      { name: 'Jahe & Lengkuas (haluskan)', amount: 3, unit: 'cm' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Persiapan & Tumis Bumbu',
        instruction: 'Campurkan santan encer dan bumbu halus ke dalam wajan besar. Masukkan serai, daun kunyit, daun jeruk, dan asam kandis. Aduk terus dengan api sedang agar santan tidak pecah.',
        durationMinutes: 20,
        tip: 'Pastikan mengaduk dengan gerakan menimba santan dari bawah ke atas.'
      },
      {
        stepNumber: 2,
        title: 'Memasukkan Daging Sapi',
        instruction: 'Setelah santan mengeluarkan minyak kemerahan (tahap gulai), masukkan potongan daging sapi. Kecilkan api ke level sedang-rendah.',
        durationMinutes: 40
      },
      {
        stepNumber: 3,
        title: 'Proses Kalio',
        instruction: 'Tuang santan kental secara bertahap. Masak terus sambil sesekali dibalik perlahan hingga kuah mengental cokelat pekat (tahap kalio).',
        durationMinutes: 60,
        tip: 'Gunakan api kecil dan wajan tebal agar dasar wajan tidak cepat gosong.'
      },
      {
        stepNumber: 4,
        title: 'Karamerisasi Menjadi Rendang',
        instruction: 'Kecilkan api sekecil mungkin. Terus aduk perlahan hingga minyak terserap kembali dan dedak rendang berubah warna cokelat gelap kehitaman.',
        durationMinutes: 60,
        tip: 'Aroma rendang yang matang ditandai wangi gurih kelapa yang khas dan minyak yang bening.'
      }
    ],
    tips: [
      'Gunakan daging sapi bagian paha atau gandik agar tidak mudah hancur saat diaduk berjam-jam.',
      'Rendang semakin lezat bila dinikmati sehari setelah dimasak karena rempahnya semakin meresap.'
    ]
  },
  {
    id: 'soto-ayam-lamongan',
    slug: 'soto-ayam-lamongan',
    title: 'Soto Ayam Lamongan Kuah Kuning Koya',
    categorySlug: 'nusantara',
    categoryName: 'Masakan Nusantara',
    description: 'Soto ayam berkuah kuning gurih dengan taburan bubuk koya renyah yang membuat kuah semakin kental nikmat.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 25,
    cookTimeMinutes: 45,
    totalTimeMinutes: 70,
    servings: 4,
    difficulty: 'Sedang',
    rating: 4.8,
    reviewsCount: 215,
    isFeatured: true,
    caloriesPerServing: 340,
    chefName: 'Cak Wawan',
    origin: 'Lamongan, Jawa Timur',
    ingredients: [
      { name: 'Ayam kampung utuh (belah 4)', amount: 1, unit: 'ekor' },
      { name: 'Air kaldu ayam', amount: 2000, unit: 'ml' },
      { name: 'Serai (memarkan)', amount: 2, unit: 'batang' },
      { name: 'Daun salam & daun jeruk', amount: 4, unit: 'lembar' },
      { name: 'Bawang merah (bumbu halus)', amount: 8, unit: 'butir' },
      { name: 'Bawang putih (bumbu halus)', amount: 5, unit: 'siung' },
      { name: 'Kunyit bakar (bumbu halus)', amount: 4, unit: 'cm' },
      { name: 'Kemiri sangrai', amount: 4, unit: 'butir' },
      { name: 'Soun (rendam air panas)', amount: 100, unit: 'gram' },
      { name: 'Tauge segar & kol iris', amount: 150, unit: 'gram' },
      { name: 'Kerupuk udang & bawang putih goreng (bubuk koya)', amount: 6, unit: 'keping' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Rebus Kaldu Ayam',
        instruction: 'Rebus potongan ayam dengan 2 liter air hingga mendidih dan keluar busa kotorannya. Buang busa agar kuah tetap bening.',
        durationMinutes: 20
      },
      {
        stepNumber: 2,
        title: 'Menumis Bumbu Kuning',
        instruction: 'Tumis bumbu halus bersama serai, daun salam, dan daun jeruk hingga harum matang tidak langu. Masukkan ke dalam panci rebusan ayam.',
        durationMinutes: 10
      },
      {
        stepNumber: 3,
        title: 'Suwir Ayam & Bikin Koya',
        instruction: 'Angkat ayam, tiriskan lalu goreng sebentar hingga berkulit, lalu suwir-suwir. Haluskan kerupuk udang dan bawang putih goreng untuk bubuk koya.',
        durationMinutes: 15
      },
      {
        stepNumber: 4,
        title: 'Penyajian Soto',
        instruction: 'Tata soun, kol, tauge, dan ayam suwir di mangkuk. Siram kuah mendidih, beri perasan jeruk nipis, sambal, dan taburan koya melimpah.',
        durationMinutes: 5
      }
    ],
    tips: [
      'Gunakan ayam kampung agar aroma kaldunya gurih alami tanpa perlu banyak penyedap buatan.'
    ]
  },
  {
    id: 'nasi-goreng-spesial',
    slug: 'nasi-goreng-spesial',
    title: 'Nasi Goreng Spesial Resto Solaria',
    categorySlug: 'nusantara',
    categoryName: 'Masakan Nusantara',
    description: 'Nasi goreng harum wangi asap (wok hei) khas restoran dengan topping bakso, ayam, dan telur orak-arik.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 2,
    difficulty: 'Mudah',
    rating: 4.7,
    reviewsCount: 189,
    isFeatured: false,
    caloriesPerServing: 420,
    chefName: 'Chef Andre',
    origin: 'Jakarta',
    ingredients: [
      { name: 'Nasi putih pera dingin', amount: 2, unit: 'piring' },
      { name: 'Telur ayam', amount: 2, unit: 'butir' },
      { name: 'Bakso sapi (iris tipis)', amount: 5, unit: 'butir' },
      { name: 'Dada ayam fillet (potong dadu)', amount: 80, unit: 'gram' },
      { name: 'Bawang putih cincang halus', amount: 4, unit: 'siung' },
      { name: 'Kecap manis kualitas premium', amount: 2, unit: 'sdm' },
      { name: 'Kecap ikan & Saus tiram', amount: 1, unit: 'sdm' },
      { name: 'Minyak wijen', amount: 1, unit: 'sdt' },
      { name: 'Daun bawang iris tipis', amount: 2, unit: 'batang' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tumis Telur & Protein',
        instruction: 'Panaskan wajan dengan api besar. Masukkan telur, orak-arik cepat. Masukkan bawang putih, ayam, dan bakso, tumis hingga matang wangi.',
        durationMinutes: 5
      },
      {
        stepNumber: 2,
        title: 'Masukkan Nasi & Bumbu',
        instruction: 'Masukkan nasi dingin, tekan-tekan agar tidak menggumpal. Tuangkan kecap ikan di pinggir wajan agar beraroma asap, disusul saus tiram dan kecap manis.',
        durationMinutes: 6
      },
      {
        stepNumber: 3,
        title: 'Finishing Wok Hei',
        instruction: 'Aduk cepat dengan api besar hingga bumbu merata dan nasi berasap harum. Tambahkan daun bawang dan minyak wijen sesaat sebelum diangkat.',
        durationMinutes: 4
      }
    ],
    tips: [
      'Nasi yang disimpan di kulkas semalaman (day-old rice) menghasilkan tekstur nasi goreng yang tidak lembek.'
    ]
  },
  {
    id: 'spaghetti-carbonara',
    slug: 'spaghetti-carbonara',
    title: 'Spaghetti Carbonara Creamy Authentic',
    categorySlug: 'western',
    categoryName: 'Western & Pasta',
    description: 'Pasta spaghetti sutra berbalut saus keju parmesan dan kuning telur lembut dengan potongan daging gurih renyah.',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 2,
    difficulty: 'Sedang',
    rating: 4.9,
    reviewsCount: 156,
    isFeatured: true,
    caloriesPerServing: 520,
    chefName: 'Marco Bellini',
    origin: 'Roma, Italia',
    ingredients: [
      { name: 'Spaghetti pasta no. 5', amount: 200, unit: 'gram' },
      { name: 'Smoked beef / beef bacon kualitas baik', amount: 100, unit: 'gram' },
      { name: 'Kuning telur ayam segar', amount: 3, unit: 'butir' },
      { name: 'Keju Parmesan bubuk / parut halus', amount: 50, unit: 'gram' },
      { name: 'Lada hitam tumbuk kasar', amount: 1, unit: 'sdt' },
      { name: 'Bawang putih geprek', amount: 2, unit: 'siung' },
      { name: 'Air rebusan pasta', amount: 100, unit: 'ml' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Rebus Pasta Al Dente',
        instruction: 'Rebus pasta dalam air mendidih yang diberi banyak garam selama 8-9 menit hingga al dente. Sisihkan segelas air rebusan pasta.',
        durationMinutes: 10
      },
      {
        stepNumber: 2,
        title: 'Kocok Saus Telur Keju',
        instruction: 'Di dalam mangkuk terpisah, kocok kuning telur bersama keju parmesan parut dan lada hitam hingga membentuk pasta kental.',
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        title: 'Goreng Beef Bacon',
        instruction: 'Tumis beef bacon bersama bawang putih hingga kecokelatan dan renyah. Angkat bawang putihnya.',
        durationMinutes: 5
      },
      {
        stepNumber: 4,
        title: 'Emulsifikasi Saus',
        instruction: 'Matikan api kompor. Masukkan spaghetti ke wajan beef bacon, lalu tuang campuran kuning telur dan sedikit air rebusan pasta. Aduk cepat hingga saus mengental mengkilap.',
        durationMinutes: 2,
        tip: 'Penting: Jangan memasukkan telur di atas api menyala agar telur tidak menggumpal seperti orak-arik.'
      }
    ],
    tips: [
      'Gunakan air rebusan pasta bertepung untuk menghasilkan saus pasta yang creamy alami tanpa whip cream tambahan.'
    ]
  },
  {
    id: 'beef-burger-homemade',
    slug: 'beef-burger-homemade',
    title: 'Gourmet Beef Burger Juicy',
    categorySlug: 'western',
    categoryName: 'Western & Pasta',
    description: 'Burger daging sapi murni tebal dengan lelehan keju cheddar, saus spesial burger, dan roti brioche panggang wangi.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    totalTimeMinutes: 30,
    servings: 2,
    difficulty: 'Mudah',
    rating: 4.8,
    reviewsCount: 94,
    isFeatured: false,
    caloriesPerServing: 610,
    chefName: 'Chef Kevin',
    origin: 'Amerika Serikat',
    ingredients: [
      { name: 'Daging sapi cincang (lemak 20%)', amount: 300, unit: 'gram' },
      { name: 'Roti Burger Brioche', amount: 2, unit: 'buah' },
      { name: 'Keju Cheddar slice', amount: 2, unit: 'lembar' },
      { name: 'Selada keriting segar & tomat iris', amount: 4, unit: 'lembar' },
      { name: 'Mayones & Saus mustard', amount: 2, unit: 'sdm' },
      { name: 'Garam laut & Lada hitam bubuk', amount: 1, unit: 'sdt' },
      { name: 'Mentega tawar untuk memanggang roti', amount: 1, unit: 'sdm' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Bentuk Patty Daging',
        instruction: 'Bentuk daging cincang menjadi 2 bulatan pipih selebar roti burger. Beri taburan garam dan lada tepat sebelum dimasak.',
        durationMinutes: 5
      },
      {
        stepNumber: 2,
        title: 'Panggang Daging & Lelehkan Keju',
        instruction: 'Panaskan wajan teflon/cast iron dengan api tinggi. Masak patty selama 3 menit tiap sisi. Taruh keju cheddar di atasnya dan tutup wajan selama 30 detik agar keju meleleh.',
        durationMinutes: 7
      },
      {
        stepNumber: 3,
        title: 'Susun Burger',
        instruction: 'Oleskan mentega pada roti dan panggang sebentar. Oles saus mayones mustard, tata selada, tomat, daging juicy berkeju, dan tutup dengan roti atas.',
        durationMinutes: 3
      }
    ],
    tips: [
      'Jangan menekan-nekan daging patty dengan spatula saat dipanggang agar juice gurih di dalamnya tidak hilang.'
    ]
  },
  {
    id: 'pancake-pisang-fluffy',
    slug: 'pancake-pisang-fluffy',
    title: 'Fluffy Banana Pancake Madu',
    categorySlug: 'sarapan',
    categoryName: 'Sarapan Praktis',
    description: 'Pancake lembut bersarang dengan rasa manis alami pisang matang, disajikan bersama kucuran madu murni dan butter.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 3,
    difficulty: 'Mudah',
    rating: 4.8,
    reviewsCount: 110,
    isFeatured: true,
    caloriesPerServing: 280,
    chefName: 'Clara S.',
    origin: 'International',
    ingredients: [
      { name: 'Pisang cavendish matang (lumatkan)', amount: 2, unit: 'buah' },
      { name: 'Tepung terigu protein sedang', amount: 150, unit: 'gram' },
      { name: 'Susu cair full cream', amount: 180, unit: 'ml' },
      { name: 'Telur ayam', amount: 1, unit: 'butir' },
      { name: 'Baking powder', amount: 1, unit: 'sdt' },
      { name: 'Mentega cair', amount: 2, unit: 'sdm' },
      { name: 'Madu alami & irisan pisang untuk topping', amount: 3, unit: 'sdm' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Campur Adonan Basah',
        instruction: 'Lumatkan pisang dengan garpu. Campurkan telur, susu cair, dan mentega cair, aduk hingga rata.',
        durationMinutes: 5
      },
      {
        stepNumber: 2,
        title: 'Masukkan Bahan Kering',
        instruction: 'Ayak tepung terigu dan baking powder ke dalam mangkuk pisang. Aduk perlahan dengan whisk secukupnya (jangan overmix).',
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        title: 'Masak Pancake',
        instruction: 'Tuang satu sendok sayur adonan ke wajan antilengket berapi kecil. Masak hingga muncul gelembung di permukaan, lalu balik dan masak sisi satunya hingga keemasan.',
        durationMinutes: 10
      }
    ],
    tips: [
      'Gunakan pisang yang kulitnya sudah berbintik cokelat untuk manis dan aroma wangi maksimal tanpa perlu gula berlebih.'
    ]
  },
  {
    id: 'bubur-ayam-kuah-kuning',
    slug: 'bubur-ayam-kuah-kuning',
    title: 'Bubur Ayam Gurih Kuah Kuning',
    categorySlug: 'sarapan',
    categoryName: 'Sarapan Praktis',
    description: 'Bubur beras lembut wangi daun pandan dengan siraman kuah kuning hangat, suwiran ayam, cakwe, dan kerupuk.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    totalTimeMinutes: 50,
    servings: 4,
    difficulty: 'Mudah',
    rating: 4.7,
    reviewsCount: 88,
    isFeatured: false,
    caloriesPerServing: 320,
    chefName: 'Kang Asep',
    origin: 'Bandung, Jawa Barat',
    ingredients: [
      { name: 'Beras pulen cuci bersih', amount: 150, unit: 'gram' },
      { name: 'Air kaldu ayam', amount: 1500, unit: 'ml' },
      { name: 'Daun salam & daun pandan', amount: 2, unit: 'lembar' },
      { name: 'Garam & kaldu bubuk', amount: 1, unit: 'sdt' },
      { name: 'Ayam suwir bumbu kuning', amount: 150, unit: 'gram' },
      { name: 'Cakwe iris, kacang kedelai goreng, seledri', amount: 50, unit: 'gram' },
      { name: 'Kecap manis & sambal rawit', amount: 2, unit: 'sdm' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Masak Bubur Beras',
        instruction: 'Masak beras bersama air kaldu, daun salam, pandan, dan garam. Aduk secara berkala dengan api sedang hingga menjadi bubur kental lembut.',
        durationMinutes: 30
      },
      {
        stepNumber: 2,
        title: 'Siapkan Topping & Kuah',
        instruction: 'Hangatkan kuah kaldu kuning bumbu kunyit. Siapkan mangkuk saji, tuang bubuk ke dalam mangkuk.',
        durationMinutes: 5
      },
      {
        stepNumber: 3,
        title: 'Plating Bubur Lengkap',
        instruction: 'Beri taburan ayam suwir, irisan cakwe, seledri, bawang goreng, kacang kedelai, siram kuah kuning dan beri kerupuk.',
        durationMinutes: 3
      }
    ],
    tips: [
      'Gunakan beras pulen dan aduk searah jarum jam secara berkala agar bubur lembut bertekstur creamy.'
    ]
  },
  {
    id: 'matcha-burnt-cheesecake',
    slug: 'matcha-burnt-cheesecake',
    title: 'Matcha Basque Burnt Cheesecake',
    categorySlug: 'dessert',
    categoryName: 'Dessert & Camilan',
    description: 'Cheesecake panggang ala Basque dengan aroma teh hijau Jepang wangi dan bagian tengah lembut meleleh.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    totalTimeMinutes: 50,
    servings: 8,
    difficulty: 'Sedang',
    rating: 4.9,
    reviewsCount: 167,
    isFeatured: true,
    caloriesPerServing: 380,
    chefName: 'Pastry Chef Yuka',
    origin: 'San Sebastian / Tokyo',
    ingredients: [
      { name: 'Cream cheese suhu ruang', amount: 400, unit: 'gram' },
      { name: 'Gula pasir halus', amount: 100, unit: 'gram' },
      { name: 'Telur ayam suhu ruang', amount: 3, unit: 'butir' },
      { name: 'Heavy whipping cream', amount: 200, unit: 'ml' },
      { name: 'Bubuk Matcha murni (Culinary grade)', amount: 20, unit: 'gram' },
      { name: 'Tepung maizena', amount: 10, unit: 'gram' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Kocok Cream Cheese',
        instruction: 'Kocok cream cheese dan gula hingga lembut tanpa butiran. Masukkan telur satu per satu sambil diaduk rata perlahan.',
        durationMinutes: 8
      },
      {
        stepNumber: 2,
        title: 'Campur Matcha & Cream',
        instruction: 'Larutkan bubuk matcha dalam sedikit whipping cream hangat, lalu tuangkan ke sisa cream. Masukkan ke dalam adonan keju bersama maizena.',
        durationMinutes: 5
      },
      {
        stepNumber: 3,
        title: 'Panggang Suhu Tinggi',
        instruction: 'Tuang adonan ke loyang yang dialasi baking paper kusut. Panggang di oven suhu 220°C selama 28-30 menit hingga permukaan atas gosong karamel kecokelatan.',
        durationMinutes: 30
      }
    ],
    tips: [
      'Jangan memanggang terlalu lama; bagian tengah cheesecake harus tetap bergoyang (jiggly) saat dikeluarkan dari oven.'
    ]
  },
  {
    id: 'es-pisang-ijo',
    slug: 'es-pisang-ijo',
    title: 'Es Pisang Ijo Khas Makassar',
    categorySlug: 'dessert',
    categoryName: 'Dessert & Camilan',
    description: 'Pisang raja legit berbalut kulit dadar hijau pandan disajikan dengan bubur sumsum lembut, sirup merah, dan es serut.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 30,
    cookTimeMinutes: 20,
    totalTimeMinutes: 50,
    servings: 4,
    difficulty: 'Sedang',
    rating: 4.8,
    reviewsCount: 130,
    isFeatured: false,
    caloriesPerServing: 310,
    chefName: 'Daeng Rahmat',
    origin: 'Makassar, Sulawesi Selatan',
    ingredients: [
      { name: 'Pisang raja matang kukus', amount: 4, unit: 'buah' },
      { name: 'Tepung beras & terigu (kulit hijau)', amount: 100, unit: 'gram' },
      { name: 'Santan encer & jus pandan suji', amount: 250, unit: 'ml' },
      { name: 'Tepung beras (untuk bubur sumsum)', amount: 60, unit: 'gram' },
      { name: 'Santan kental (untuk bubur sumsum)', amount: 500, unit: 'ml' },
      { name: 'Sirup Pisang Ambon / Sirup Merah', amount: 100, unit: 'ml' },
      { name: 'Susu kental manis & Es serut', amount: 4, unit: 'porsi' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Buat Kulit Pisang Ijo',
        instruction: 'Masak tepung, jus pandan, dan santan hingga kalis. Pipihkan adonan di atas plastik, bungkus pisang raja hingga tertutup rapat. Kukus selama 15 menit.',
        durationMinutes: 20
      },
      {
        stepNumber: 2,
        title: 'Masak Bubur Sumsum',
        instruction: 'Campur tepung beras, santan kental, garam, dan daun pandan. Aduk terus di atas api kecil hingga meletup-letup kental dan lembut.',
        durationMinutes: 10
      },
      {
        stepNumber: 3,
        title: 'Penyajian Es Segar',
        instruction: 'Potong-potong pisang ijo, taruh bubur sumsum di piring mangkuk. Beri es serut menggunung, kucuri sirup merah dan susu kental manis.',
        durationMinutes: 5
      }
    ],
    tips: [
      'Gunakan pisang raja yang manis dan sudah dikukus terlebih dahulu agar teksturnya pulen tidak keras.'
    ]
  },
  {
    id: 'es-kopi-susu-aren',
    slug: 'es-kopi-susu-aren',
    title: 'Es Kopi Susu Gula Aren Barista Style',
    categorySlug: 'minuman',
    categoryName: 'Minuman Segar',
    description: 'Paduan espresso kopi robusta kental dengan sirup gula aren murni dan susu segar gurih yang creamy.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    servings: 1,
    difficulty: 'Mudah',
    rating: 4.9,
    reviewsCount: 220,
    isFeatured: false,
    caloriesPerServing: 190,
    chefName: 'Barista Dimas',
    origin: 'Jakarta',
    ingredients: [
      { name: 'Double shot espresso / kopi hitam pekat', amount: 60, unit: 'ml' },
      { name: 'Susu cair fresh milk / oatmilk', amount: 120, unit: 'ml' },
      { name: 'Krimer bubuk dilarutkan / evaporasi', amount: 20, unit: 'ml' },
      { name: 'Sirup gula aren kental asli', amount: 30, unit: 'ml' },
      { name: 'Es batu kristal', amount: 1, unit: 'gelas' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Lapisan Gula Aren',
        instruction: 'Tuang sirup gula aren kental ke bagian dasar gelas saji.',
        durationMinutes: 1
      },
      {
        stepNumber: 2,
        title: 'Tambahkan Es & Susu',
        instruction: 'Masukkan es batu hingga hampir penuh. Tuangkan susu cair segar bersama susu evaporasi secara perlahan agar membentuk gradasi cantik.',
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        title: 'Tuang Kopi Espresso',
        instruction: 'Tuangkan espresso pekat di atas lapisan susu. Aduk rata sebelum dinikmati untuk rasa seimbang yang gurih manis.',
        durationMinutes: 2
      }
    ],
    tips: [
      'Tambahkan sedikit krimer atau susu evaporasi untuk mendapatkan tekstur creamy khas coffee shop ternama.'
    ]
  }
]
