import { recipesData } from '../data/recipesData'
import type { Recipe } from '../types/recipe'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: Date
  matchedRecipe?: Recipe
  suggestions?: string[]
}

const GEMINI_STORAGE_KEY = 'cookbook_gemini_api_key'

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(GEMINI_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function saveApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(GEMINI_STORAGE_KEY, key.trim())
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY)
    }
  } catch (err) {
    console.error('Failed to save API key', err)
  }
}

// Check if query matches an existing CookBook recipe
function findMatchedCookbookRecipe(query: string): Recipe | undefined {
  const lower = query.toLowerCase()
  return recipesData.find((recipe) => {
    const titleWords = recipe.title.toLowerCase().split(' ')
    const slugWords = recipe.slug.toLowerCase().split('-')
    const matchesTitle = titleWords.some((word) => word.length > 3 && lower.includes(word))
    const matchesSlug = slugWords.some((word) => word.length > 3 && lower.includes(word))
    return matchesTitle || matchesSlug
  })
}

// Built-in Intelligent Culinary Knowledge Engine
function generateLocalChefResponse(query: string): { text: string; matchedRecipe?: Recipe; suggestions?: string[] } {
  const q = query.toLowerCase().trim()
  const matchedRecipe = findMatchedCookbookRecipe(q)

  // 1. Direct match with existing CookBook recipes
  if (matchedRecipe) {
    return {
      text: `Halo! Pas sekali, kami sudah memiliki resep teruji untuk **${matchedRecipe.title}** di CookBook!\n\n` +
        `• **Kategori:** ${matchedRecipe.categoryName}\n` +
        `• **Estimasi Waktu:** ${matchedRecipe.totalTimeMinutes} menit\n` +
        `• **Tingkat Kesulitan:** ${matchedRecipe.difficulty}\n` +
        `• **Rating:** ⭐ ${matchedRecipe.rating} (${matchedRecipe.reviewsCount} ulasan)\n\n` +
        `*Catatan Chef:* ${matchedRecipe.tips[0] || matchedRecipe.description}\n\n` +
        `Klik tombol di bawah ini untuk melihat takaran bahan lengkap dan panduan memasak langkah demi langkah:`,
      matchedRecipe,
      suggestions: [
        `Berapa takaran bahan ${matchedRecipe.title}?`,
        'Rekomendasi masakan penutup / dessert',
        'Cari resep praktis lainnya'
      ]
    }
  }

  // 2. Questions about ingredients in the fridge (telur, nasi, ayam, tahu, tempe, etc.)
  if (q.includes('punya') || q.includes('ada') || q.includes('kulkas') || q.includes('bahan')) {
    if (q.includes('telur') && q.includes('nasi')) {
      const nasiGoreng = recipesData.find((r) => r.id === 'nasi-goreng-spesial')
      return {
        text: `Kombinasi klasik yang juara! Dengan **nasi dingin dan telur**, kamu bisa membuat **Nasi Goreng Wok Hei Spesial Resto** yang gurih harum.\n\n` +
          `**💡 Rahasia Chef:**\n` +
          `1. Tumis telur terlebih dahulu dengan api agak besar hingga wangi sebelum nasi dimasukkan.\n` +
          `2. Tuangkan sedikit kecap ikan atau kecap asin tepat di pinggir wajan panas agar mengeluarkan aroma asap restoran (*wok hei*).\n` +
          `3. Tambahkan irisan daun bawang dan sedikit minyak wijen di akhir sesi memasak.`,
        matchedRecipe: nasiGoreng,
        suggestions: ['Gimana kalau nasinya lembek?', 'Bikin sarapan praktis lainnya', 'Resep telur dadar tebal']
      }
    }

    if (q.includes('ayam')) {
      const soto = recipesData.find((r) => r.id === 'soto-ayam-lamongan')
      return {
        text: `Punya daging ayam di kulkas? Berikut 3 ide lezat yang bisa langsung kamu eksekusi:\n\n` +
          `1. **Soto Ayam Kuah Kuning Koya:** Kuah gurih rempah segar yang sangat cocok untuk menghangatkan badan.\n` +
          `2. **Ayam Goreng Lengkuas Gurih:** Dibalur parutan lengkuas yang digoreng hingga renyah keemasan.\n` +
          `3. **Ayam Tumis Saus Mentega:** Cukup bawang bombay, mentega, kecap manis, dan kecap inggris (siap dalam 15 menit).\n\n` +
          `Mau saya buatkan panduan langkah untuk salah satu menu di atas?`,
        matchedRecipe: soto,
        suggestions: ['Buka Resep Soto Ayam Lamongan', 'Cara ungkep ayam agar bumbu meresap', 'Ide masakan ayam pedas']
      }
    }

    if (q.includes('pisang')) {
      const pancake = recipesData.find((r) => r.id === 'pancake-pisang-fluffy')
      return {
        text: `Jangan buang pisang yang sudah matang berbintik! Pisang matang punya rasa manis alami yang sempurna untuk:\n\n` +
          `🥞 **Fluffy Banana Pancake Madu** (tanpa perlu mixer, adonan lembut bersarang).\n` +
          `🍨 **Es Pisang Ijo Khas Makassar** jika ingin hidangan penutup yang segar legit.\n\n` +
          `Keduanya sudah tersedia resep lengkapnya di CookBook!`,
        matchedRecipe: pancake,
        suggestions: ['Resep Pancake Pisang Fluffy', 'Resep Es Pisang Ijo', 'Camilan manis lainnya']
      }
    }

    if (q.includes('tempe') || q.includes('tahu')) {
      return {
        text: `Tahu dan tempe adalah bahan andalan dapur nusantara! Berikut ide olahan istimewa:\n\n` +
          `• **Tempe Orek Basah Kecap Manis:** Tumis bumbu iris (bawang merah, bawang putih, cabai, daun salam, lengkuas), masukkan tempe yang digoreng setengah matang, lalu beri kecap manis dan sedikit air hingga meresap.\n` +
          `• **Tahu Telur Bumbu Petis Khas Surabaya:** Tahu goreng berselimut dadar telur renyah disiram saus petis kacang gurih.\n` +
          `• **Mendoan Hangat Gurih:** Tempe tipis berbalut tepung bumbu kencur dan irisan daun bawang segar, goreng sebentar saja.`,
        suggestions: ['Cara goreng mendoan yang renyah basah', 'Sambal kecap yang pas untuk tempe', 'Cari resep nusantara lainnya']
      }
    }

    return {
      text: `Bahan makanan yang menarik! Kamu bisa membuat olahan tumis praktis (*stir fry*) atau sup bening hangat gurih.\n\n` +
        `**💡 Rumus Dasar Tumisan Lezat Chef:**\n` +
        `1. **Bumbu Dasar:** Cukup 3 siung bawang putih cincang + 2 siung bawang merah iris.\n` +
        `2. **Saus Gurih:** Campurkan 1 sdm saus tiram + 1 sdt kecap asin + 1/2 sdt minyak wijen.\n` +
        `3. Tumis bumbu dengan api sedang hingga harum, masukkan bahan utama, lalu siramkan saus gurih. Tambahkan sedikit air jika ingin berkuah nyemek.`,
      suggestions: ['Rekomendasi resep sarapan', 'Resep makan malam cepat', 'Tips menyimpan bumbu']
    }
  }

  // 3. Questions about meat tenderness (daging empuk / alot / rendang)
  if (q.includes('daging') || q.includes('empuk') || q.includes('alot') || q.includes('presto')) {
    const rendang = recipesData.find((r) => r.id === 'rendang-daging-sapi')
    return {
      text: `Agar **daging sapi cepat empuk dan bumbu meresap sempurna** tanpa presto, berikut rahasia para chef:\n\n` +
        `1. **Arah Potongan:** Selalu potong daging berlawanan dengan arah seratnya (*against the grain*). Ini memutus serat alot daging secara mekanis.\n` +
        `2. **Enzim Alami:** Lumuri daging dengan sedikit parutan nanas muda (atau remasan daun pepaya) selama 10-15 menit saja sebelum dimasak. Jangan terlalu lama agar daging tidak hancur.\n` +
        `3. **Teknik Slow Cooking:** Untuk rendang, gunakan santan kental dengan api kecil. Lemak santan akan melunakkan jaringan kolagen daging secara perlahan hingga empuk dan gurih berkaramel.`,
      matchedRecipe: rendang,
      suggestions: ['Buka Resep Rendang Daging Sapi', 'Potongan daging mana yang paling empuk?', 'Berapa lama merebus kaldu sapi?']
    }
  }

  // 4. Questions about fast / quick cooking (< 15 or 20 minutes)
  if (q.includes('cepat') || q.includes('praktis') || q.includes('15') || q.includes('20') || q.includes('kilat')) {
    return {
      text: `Butuh hidangan kilat yang tetap lezat dan bernutrisi? Ini 3 rekomendasi tercepat di CookBook:\n\n` +
        `⏱️ **Spaghetti Creamy Carbonara** (25 Menit) - Saus keju parmesan dan kuning telur sutra tanpa perlu oven.\n` +
        `⏱️ **Nasi Goreng Resto Spesial** (20 Menit) - Solusi makan malam enak dengan bahan yang selalu ada di rumah.\n` +
        `⏱️ **Fluffy Banana Pancake** (25 Menit) - Sarapan manis lembut kesukaan anak-anak dan keluarga.\n\n` +
        `Mau coba yang mana sekarang?`,
      suggestions: ['Resep Spaghetti Carbonara', 'Resep Nasi Goreng Spesial', 'Resep Fluffy Banana Pancake']
    }
  }

  // 5. Questions about pasta / carbonara
  if (q.includes('pasta') || q.includes('carbonara') || q.includes('spaghetti')) {
    const carbonara = recipesData.find((r) => r.id === 'spaghetti-carbonara')
    return {
      text: `Kunci rahasia **Spaghetti Carbonara Authentic Italia** tanpa whipping cream:\n\n` +
        `1. **Saus dari Kuning Telur + Keju:** Kocok kuning telur bersama keju parmesan parut dan lada hitam tumbuk kasar.\n` +
        `2. **Gunakan Air Rebusan Pasta (*Pasta Water*):** Jangan buang air rebusan pasta! Air bertepung ini adalah rahasia emulsi saus yang kental mengkilap.\n` +
        `3. **Matikan Api Kompor:** Sebelum menuangkan campuran telur ke wajan, matikan api agar telur tidak menggumpal menjadi telur orak-arik.`,
      matchedRecipe: carbonara,
      suggestions: ['Buka Resep Spaghetti Carbonara', 'Pengganti keju parmesan', 'Tingkat kematangan al dente']
    }
  }

  // 6. Questions about food oversalting (keasinan / terlalu asin / pedas)
  if (q.includes('keasinan') || q.includes('terlalu asin') || q.includes('asin')) {
    return {
      text: `Jangan panik jika masakan keasinan! Berikut 4 cara cepat menyelamatkannya:\n\n` +
        `1. **Cemplungkan Kentang Mentah:** Kupas dan potong kentang mentah agak besar, masukkan ke masakan berkuah selama 10 menit. Kentang akan menyerap kelebihan garam lalu bisa diangkat.\n` +
        `2. **Tambahkan Sedikit Gula & Asam:** Kombinasi sedikit gula pasir dan perasan air jeruk nipis/lemon dapat menyeimbangkan rasa asin yang tajam.\n` +
        `3. **Encerkan dengan Santan atau Susu:** Jika masakan bersantan atau berkuah kental, tambahkan sedikit santan encer atau susu cair hangat.\n` +
        `4. **Perbanyak Sayuran atau Porsi Kuah:** Tambahkan potongan tahu, sawi, atau kaldu tawar tanpa garam.`,
      suggestions: ['Tips mengatasi masakan terlalu pedas', 'Cara mengukur takaran garam yang pas', 'Tanya tips dapur lainnya']
    }
  }

  // 7. General culinary assistant fallback
  return {
    text: `Halo! Saya **Chef AI CookBook**, asisten kuliner pribadi Anda 👨‍🍳✨\n\n` +
      `Saya bisa membantu Anda dengan:\n` +
      `• Memberikan **ide resep masakan** dari bahan apa saja yang ada di kulkas Anda.\n` +
      `• Memberikan **tips & teknik memasak** (agar daging empuk, masakan tidak amis, saus tidak menggumpal).\n` +
      `• Merekomendasikan menu masakan Nusantara, Western, Sarapan, dan Dessert dari katalog CookBook.\n\n` +
      `Coba tanyakan misalnya: *"Saya punya ayam dan wortel, enaknya masak apa?"* atau *"Gimana cara bikin soto kuah kuning gurih?"*`,
    suggestions: [
      'Punya telur dan nasi, masak apa?',
      'Rekomendasi resep masakan nusantara',
      'Cara membuat daging rendang empuk',
      'Ide sarapan lezat & cepat'
    ]
  }
}

// Call Google Gemini API if user has provided an API key
async function callGeminiApi(userPrompt: string, apiKey: string): Promise<string> {
  const systemInstruction =
    'Kamu adalah Chef AI dari aplikasi web CookBook, seorang koki profesional dan asisten dapur yang ramah, hangat, dan ahli dalam masakan Nusantara serta Internasional. ' +
    'Jawab pertanyaan pengguna dalam Bahasa Indonesia yang santun dan mudah dipahami oleh ibu rumah tangga atau pemula yang baru belajar memasak. ' +
    'Sertakan takaran bahan yang jelas, tips rahasia memasak, dan langkah-langkah yang rapi dengan bullet points.'

  // 1. Cari model yang tersedia untuk API Key ini secara dinamis (Auto-Detect)
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  const listRes = await fetch(listUrl)
  if (!listRes.ok) throw new Error('API Key kamu tidak valid atau belum diaktifkan.')
  
  const listData = await listRes.json()
  const availableModels = listData.models || []
  
  // 2. Kumpulkan daftar kandidat model yang valid (urutkan prioritas)
  const supported = availableModels
    .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m: any) => m.name.replace('models/', ''))
    .filter((name: string) => !name.includes('1.5') && !name.includes('2.5') && !name.includes('embedding'))

  // Susun daftar model untuk dicoba berurutan (utamakan gemini-3.6-flash)
  const candidateModels = Array.from(new Set(['gemini-3.6-flash', ...supported]))

  const genAI = new GoogleGenerativeAI(apiKey)
  const combinedPrompt = `${systemInstruction}\n\nPertanyaan pengguna: ${userPrompt}`

  let lastError: any = null

  // Coba model secara berurutan (failover otomatis jika satu model sedang 503 / high demand)
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(combinedPrompt)
      return result.response.text()
    } catch (err: any) {
      lastError = err
      console.warn(`Model ${modelName} terkendala:`, err?.message)
      // Jika overload / 503, beri jeda singkat lalu coba model berikutnya
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
  }

  throw new Error(lastError?.message || 'Server Gemini sedang mengalami lonjakan trafik (High Demand). Coba kirim ulang pesan dalam beberapa detik.')
}

// Main askChefAi function
export async function askChefAi(prompt: string): Promise<{ text: string; matchedRecipe?: Recipe; suggestions?: string[] }> {
  const apiKey = getStoredApiKey()
  const matchedRecipe = findMatchedCookbookRecipe(prompt)

  // If user provided a Gemini API Key, try calling Gemini first
  if (apiKey) {
    try {
      const geminiResponseText = await callGeminiApi(prompt, apiKey)
      return {
        text: geminiResponseText,
        matchedRecipe,
        suggestions: [
          'Jelaskan takaran bahan lebih detail',
          'Apa tips rahasianya agar tidak gagal?',
          'Rekomendasikan hidangan pendamping'
        ]
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local engine:', err?.message)
      // Fallback seamlessly to local intelligent engine
      const fallback = generateLocalChefResponse(prompt)
      return {
        ...fallback,
        text: `*(Koneksi Gemini dialihkan ke Asisten Lokal: ${err?.message || 'Cek API Key'})*\n\n${fallback.text}`
      }
    }
  }

  // Use built-in smart local culinary engine
  // Simulate natural assistant typing latency (350ms)
  await new Promise((resolve) => setTimeout(resolve, 350))
  return generateLocalChefResponse(prompt)
}
