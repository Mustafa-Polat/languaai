// Rusça gramer dersleri. Anlatımlar, örnekler, diyaloglar ve alıştırmalar özgündür.
// Konu sırası için learnrussian.github.io'nun ders listesi referans alınmıştır; sitenin
// içeriği RT'ye ait olduğundan metin, görsel veya ses kopyalanmaz, yalnızca bağlantı verilir.
//
// Vurgu işareti (U+0301) yalnızca kelime listesinde kullanılır; seslendirmeden önce silinir.
// Alıştırma türleri: mc (çoktan seçmeli), fill (boşluk), order (kelime sıralama)

import { shuffle } from "./srs";

const v = (ru, tr) => ({ ru, tr });
const x = (ru, tr) => ({ ru, tr });

export const RU_LESSONS = [
  {
    id: "ru01",
    title: "Знакомство",
    tr: "Selamlaşma, tanışma ve meslekler",
    source: "https://learnrussian.github.io/lessons/greeting-first-simple-phrases-professions/",
    goals: ["Selam vermek ve vedalaşmak", "Kendini ve mesleğini tanıtmak", "ты ve вы arasındaki farkı bilmek"],
    vocab: [
      v("приве́т", "selam"), v("здра́вствуйте", "merhaba (resmî)"), v("до свида́ния", "hoşça kal(ın)"),
      v("спаси́бо", "teşekkürler"), v("пожа́луйста", "lütfen; rica ederim"), v("да", "evet"), v("нет", "hayır"),
      v("меня́ зову́т", "benim adım"), v("врач", "doktor"), v("инжене́р", "mühendis"),
      v("студе́нт", "öğrenci (erkek)"), v("студе́нтка", "öğrenci (kadın)"), v("учи́тель", "öğretmen"),
      v("по́вар", "aşçı"),
    ],
    grammar: [
      {
        title: "Şahıs zamirleri",
        body: "Rusçada altı temel şahıs ve üçüncü tekilde üç cinsiyet vardır. 'ты' samimi 'sen'dir; 'вы' hem 'siz' (çoğul) hem de tek kişiye resmî hitaptır.",
        tables: [
          { head: "Tekil", rows: [["я", "ben"], ["ты", "sen"], ["он", "o (eril)"], ["она́", "o (dişil)"], ["оно́", "o (nötr)"]] },
          { head: "Çoğul", rows: [["мы", "biz"], ["вы", "siz"], ["они́", "onlar"]] },
        ],
      },
      {
        title: "Şimdiki zamanda 'olmak' yok",
        body: "'Ben mühendisim' derken fiil kullanılmaz: Я инженер. İki isim yan yana geldiğinde yazıda çoğunlukla tire konur: Анна — врач. Soru cümlesinde sıra değişmez, yalnızca sorulan kelimede ses yükselir: Вы врач? (Doktor musunuz?) Olumsuzluk için 'не' kullanılır: Я не врач.",
        tables: [
          { head: "Kalıp", rows: [["Я повар.", "Aşçıyım."], ["Ты повар?", "Aşçı mısın?"], ["Он не повар.", "O aşçı değil."]] },
        ],
      },
      {
        title: "Adını söylemek",
        body: "'Меня зовут …' kelimesi kelimesine 'beni … diye çağırırlar' demektir. Soru sorarken zamir değişir. Tanıştıktan sonra 'Очень приятно' (Memnun oldum) denir.",
        tables: [
          { head: "Soru ve cevap", rows: [["Как тебя зовут?", "Adın ne?"], ["Как вас зовут?", "Adınız ne?"], ["Меня зовут Али.", "Adım Ali."]] },
        ],
      },
    ],
    examples: [
      x("Привет! Как дела?", "Selam! Nasılsın?"),
      x("Здравствуйте! Меня зовут Анна.", "Merhaba! Benim adım Anna."),
      x("Я инженер, а она врач.", "Ben mühendisim, o ise doktor."),
      x("Вы учитель? Нет, я не учитель.", "Öğretmen misiniz? Hayır, öğretmen değilim."),
      x("Спасибо! Пожалуйста.", "Teşekkürler! Rica ederim."),
    ],
    dialog: {
      title: "Tanışma",
      lines: [
        { who: "A", ru: "Здравствуйте! Как вас зовут?", tr: "Merhaba! Adınız ne?" },
        { who: "B", ru: "Меня зовут Ольга. А вас?", tr: "Adım Olga. Ya sizin?" },
        { who: "A", ru: "Меня зовут Мустафа. Очень приятно.", tr: "Adım Mustafa. Memnun oldum." },
        { who: "B", ru: "Вы студент?", tr: "Öğrenci misiniz?" },
        { who: "A", ru: "Нет, я инженер.", tr: "Hayır, mühendisim." },
      ],
    },
    exercises: [
      { t: "mc", q: "Tanımadığın yetişkin birine nasıl selam verirsin?", opts: ["Привет!", "Здравствуйте!", "Спасибо!", "До свидания!"], a: 1 },
      { t: "mc", q: "'Öğretmen misiniz?' hangisi?", opts: ["Вы учитель?", "Ты учитель.", "Он учитель?", "Я учитель."], a: 0 },
      { t: "mc", q: "Анна — ___. (öğrenci)", opts: ["студент", "студентка", "учитель", "повар"], a: 1 },
      { t: "fill", q: "Меня ___ Иван. (Adım İvan.)", a: ["зовут"] },
      { t: "fill", q: "___ инженер. (Ben mühendisim.)", a: ["я"] },
      { t: "fill", q: "Он ___ врач. (O doktor değil.)", a: ["не"] },
      { t: "fill", q: "Это Мария. ___ повар. (o)", a: ["она"] },
      { t: "order", words: ["Как", "вас", "зовут"], a: "Как вас зовут" },
      { t: "order", words: ["Нет", "я", "не", "врач"], a: "Нет я не врач" },
    ],
    speak: [
      { task: "Selam ver, adını ve mesleğini söyle.", model: "Здравствуйте! Меня зовут Али. Я инженер." },
      { task: "Samimi bir şekilde birinin adını sor.", model: "Привет! Как тебя зовут?" },
    ],
  },
  {
    id: "ru02",
    title: "Кто это? Что это?",
    tr: "Bu kim, bu ne? İsimlerin cinsiyeti",
    source: "https://learnrussian.github.io/lessons/nouns-their-gender/",
    goals: ["кто ve что ile soru sormak", "İsmin cinsiyetini sonundan tanımak", "İsmin yerine он / она / оно kullanmak"],
    vocab: [
      v("дом", "ev"), v("стол", "masa"), v("телефо́н", "telefon"), v("музе́й", "müze"),
      v("кни́га", "kitap"), v("маши́на", "araba"), v("ку́хня", "mutfak"), v("окно́", "pencere"),
      v("молоко́", "süt"), v("мо́ре", "deniz"), v("слова́рь", "sözlük"), v("тетра́дь", "defter"),
      v("брат", "erkek kardeş"), v("сестра́", "kız kardeş"),
    ],
    grammar: [
      {
        title: "кто mi, что mu?",
        body: "İnsanlar ve hayvanlar için 'Кто это?', nesneler için 'Что это?' sorulur. 'Это' hem 'bu' hem 'şu' anlamında kullanılır ve cinsiyete göre değişmez.",
        tables: [
          { head: "Örnek", rows: [["Кто это?", "Это брат."], ["Что это?", "Это окно."]] },
        ],
      },
      {
        title: "Cinsiyet sondan anlaşılır",
        body: "Her ismin bir cinsiyeti vardır ve çoğunlukla son harfinden anlaşılır. -ь ile bitenler eril de dişil de olabilir; bunları kelimeyle birlikte ezberlemek gerekir: словарь (eril), тетрадь (dişil). Anlamı erkek olan 'папа' ve 'дедушка' -а ile bitse de erildir.",
        tables: [
          { head: "Eril (он)", rows: [["ünsüz", "стол"], ["-й", "музей"], ["-ь", "словарь"]] },
          { head: "Dişil (она)", rows: [["-а", "книга"], ["-я", "кухня"], ["-ь", "тетрадь"]] },
          { head: "Nötr (оно)", rows: [["-о", "окно"], ["-е", "море"]] },
        ],
      },
      {
        title: "он, она, оно: nesneler için de",
        body: "Rusçada nesnenin yerine de cinsiyetine uyan zamir gelir. 'Где книга?' sorusunun cevabı 'Вот она' olur (İşte o).",
        tables: [
          { head: "Soru → cevap", rows: [["Где дом?", "Вот он."], ["Где машина?", "Вот она."], ["Где молоко?", "Вот оно."]] },
        ],
      },
    ],
    examples: [
      x("Что это? Это словарь.", "Bu ne? Bu bir sözlük."),
      x("Кто это? Это моя сестра.", "Bu kim? Bu benim kız kardeşim."),
      x("Это дом. Он большой.", "Bu bir ev. O büyük."),
      x("Где телефон? Вот он.", "Telefon nerede? İşte burada."),
      x("Это окно или дверь?", "Bu pencere mi, kapı mı?"),
    ],
    dialog: {
      title: "Odada",
      lines: [
        { who: "A", ru: "Что это?", tr: "Bu ne?" },
        { who: "B", ru: "Это книга.", tr: "Bu bir kitap." },
        { who: "A", ru: "А где словарь?", tr: "Peki sözlük nerede?" },
        { who: "B", ru: "Вот он, на столе.", tr: "İşte, masanın üstünde." },
        { who: "A", ru: "А кто это?", tr: "Peki bu kim?" },
        { who: "B", ru: "Это мой брат.", tr: "Bu benim erkek kardeşim." },
      ],
    },
    exercises: [
      { t: "mc", q: "Hangisi eril?", opts: ["книга", "окно", "музей", "кухня"], a: 2 },
      { t: "mc", q: "Hangisi dişil?", opts: ["стол", "машина", "море", "дом"], a: 1 },
      { t: "mc", q: "Hangisi nötr?", opts: ["молоко", "сестра", "телефон", "брат"], a: 0 },
      { t: "mc", q: "'сестра' için hangi soru sorulur?", opts: ["Что это?", "Кто это?", "Где это?", "Как это?"], a: 1 },
      { t: "fill", q: "Где машина? Вот ___.", a: ["она"] },
      { t: "fill", q: "Где окно? Вот ___.", a: ["оно"] },
      { t: "fill", q: "Где словарь? Вот ___.", a: ["он"] },
      { t: "fill", q: "___ это? Это стол.", a: ["что"] },
      { t: "order", words: ["Вот", "он", "на", "столе"], a: "Вот он на столе" },
    ],
    speak: [
      { task: "Etrafındaki bir nesneyi gösterip ne olduğunu söyle.", model: "Это телефон." },
      { task: "Arabanın nerede olduğunu sor ve 'İşte burada' de.", model: "Где машина? Вот она." },
    ],
  },
  {
    id: "ru03",
    title: "Откуда вы?",
    tr: "İlk fiiller, milliyet ve 'Nerelisin?'",
    source: "https://learnrussian.github.io/lessons/first-verbs-nationality/",
    goals: ["Fiilleri şimdiki zamanda çekmek", "Hangi dilleri konuştuğunu söylemek", "Nereli olduğunu sormak ve söylemek"],
    vocab: [
      v("чита́ть", "okumak"), v("знать", "bilmek"), v("рабо́тать", "çalışmak"), v("понима́ть", "anlamak"),
      v("говори́ть", "konuşmak"), v("жить", "yaşamak"), v("отку́да", "nereden"), v("по-ру́сски", "Rusça (olarak)"),
      v("по-туре́цки", "Türkçe (olarak)"), v("ту́рок", "Türk (erkek)"), v("турча́нка", "Türk (kadın)"),
      v("ру́сский", "Rus (erkek)"), v("ру́сская", "Rus (kadın)"), v("немно́го", "biraz"),
    ],
    grammar: [
      {
        title: "1. çekim: читать",
        body: "-ть atılır ve ekler gelir. знать, работать ve понимать aynı şekilde çekilir.",
        tables: [
          { head: "читать", rows: [["я", "читаю"], ["ты", "читаешь"], ["он/она", "читает"], ["мы", "читаем"], ["вы", "читаете"], ["они", "читают"]] },
        ],
      },
      {
        title: "2. çekim: говорить ve düzensiz жить",
        body: "говорить fiilinde ekler -ю, -ишь, -ит, -им, -ите, -ят olur. жить fiilinde kök 'жив-' haline gelir. Dil söylerken 'по-русски', 'по-турецки' kullanılır.",
        tables: [
          { head: "говорить", rows: [["я", "говорю"], ["ты", "говоришь"], ["он/она", "говорит"], ["мы", "говорим"], ["вы", "говорите"], ["они", "говорят"]] },
          { head: "жить", rows: [["я", "живу"], ["ты", "живёшь"], ["он/она", "живёт"], ["мы", "живём"], ["вы", "живёте"], ["они", "живут"]] },
        ],
      },
      {
        title: "Откуда? — из + tamlayan hâli",
        body: "'Nereden' sorusuna 'из' ile cevap verilir ve yer adı tamlayan (родительный) hâline girer. Ünsüzle biten isim -а alır; -а ile biten -ы, -ия ile biten -ии olur.",
        tables: [
          { head: "из + yer", rows: [["Стамбул", "из Стамбула"], ["Анкара", "из Анкары"], ["Турция", "из Турции"], ["Россия", "из России"]] },
        ],
      },
    ],
    examples: [
      x("Откуда вы? Я из Турции.", "Nerelisiniz? Türkiye'denim."),
      x("Я турок, а Ольга русская.", "Ben Türk'üm, Olga ise Rus."),
      x("Вы говорите по-русски?", "Rusça konuşuyor musunuz?"),
      x("Я немного говорю по-русски.", "Biraz Rusça konuşuyorum."),
      x("Мы живём в Анталье.", "Antalya'da yaşıyoruz."),
      x("Я не понимаю.", "Anlamıyorum."),
    ],
    dialog: {
      title: "Nerelisin?",
      lines: [
        { who: "A", ru: "Откуда ты?", tr: "Nerelisin?" },
        { who: "B", ru: "Я из Турции. А ты?", tr: "Türkiye'denim. Ya sen?" },
        { who: "A", ru: "Я из России. Ты говоришь по-русски?", tr: "Ben Rusya'danım. Rusça konuşuyor musun?" },
        { who: "B", ru: "Немного. Я читаю и понимаю.", tr: "Biraz. Okuyorum ve anlıyorum." },
      ],
    },
    exercises: [
      { t: "mc", q: "Я ___ по-русски. (konuşmak)", opts: ["говорю", "говорит", "говоришь", "говорят"], a: 0 },
      { t: "mc", q: "Они ___ книгу. (okumak)", opts: ["читает", "читаем", "читают", "читаю"], a: 2 },
      { t: "mc", q: "Я из ___. (Rusya)", opts: ["Россия", "России", "Россию", "Россией"], a: 1 },
      { t: "fill", q: "Ты ___ по-турецки? (понимать)", a: ["понимаешь"] },
      { t: "fill", q: "Она ___ в банке. (работать)", a: ["работает"] },
      { t: "fill", q: "Мы ___ в Москве. (жить)", a: ["живём"] },
      { t: "fill", q: "Он из ___. (Стамбул)", a: ["Стамбула"] },
      { t: "order", words: ["Вы", "говорите", "по-русски"], a: "Вы говорите по-русски" },
      { t: "order", words: ["Я", "не", "знаю"], a: "Я не знаю" },
    ],
    speak: [
      { task: "Nereli olduğunu ve nerede yaşadığını söyle.", model: "Я из Турции. Я живу в Анталье." },
      { task: "Birine Rusça konuşup konuşmadığını resmî olarak sor.", model: "Вы говорите по-русски?" },
    ],
  },
  {
    id: "ru04",
    title: "Чей это?",
    tr: "İyelik zamirleri ve sorular",
    source: "https://learnrussian.github.io/lessons/possessive-pronouns-questions/",
    goals: ["мой, твой, наш, ваш kullanmak", "его, её, их'in değişmediğini bilmek", "'Kimin?' sorusunu sormak"],
    vocab: [
      v("па́спорт", "pasaport"), v("биле́т", "bilet"), v("су́мка", "çanta"), v("ключ", "anahtar"),
      v("письмо́", "mektup"), v("ме́сто", "yer, koltuk"), v("друг", "arkadaş (erkek)"),
      v("подру́га", "arkadaş (kadın)"), v("семья́", "aile"), v("роди́тели", "anne baba"),
      v("и́мя", "ad"), v("фами́лия", "soyadı"), v("а́дрес", "adres"), v("ве́щи", "eşyalar"),
    ],
    grammar: [
      {
        title: "İyelik zamiri isme uyar",
        body: "Zamirin biçimini sahibin değil, sahip olunan şeyin cinsiyeti ve sayısı belirler. Bir kadın da 'мой паспорт' der, bir erkek de 'моя сумка' der. имя -я ile bitse de nötrdür: моё имя.",
        tables: [
          { head: "benim / senin", rows: [["eril", "мой / твой"], ["dişil", "моя / твоя"], ["nötr", "моё / твоё"], ["çoğul", "мои / твои"]] },
          { head: "bizim / sizin", rows: [["eril", "наш / ваш"], ["dişil", "наша / ваша"], ["nötr", "наше / ваше"], ["çoğul", "наши / ваши"]] },
        ],
      },
      {
        title: "его, её, их değişmez",
        body: "Üçüncü şahıs iyelikleri sahibe göre seçilir ve isme göre biçim değiştirmez: его сумка (onun, erkek), её билет (onun, kadın), их дом (onların).",
        tables: [
          { head: "Sahip", rows: [["он", "его"], ["она", "её"], ["они", "их"]] },
        ],
      },
      {
        title: "Чей? Чья? Чьё? Чьи?",
        body: "'Kimin?' sorusu da isme uyar.",
        tables: [
          { head: "Soru", rows: [["eril", "Чей это ключ?"], ["dişil", "Чья это сумка?"], ["nötr", "Чьё это место?"], ["çoğul", "Чьи это вещи?"]] },
        ],
      },
    ],
    examples: [
      x("Это мой паспорт.", "Bu benim pasaportum."),
      x("Где твоя сумка?", "Çantan nerede?"),
      x("Это ваше место?", "Bu sizin yeriniz mi?"),
      x("Чьи это ключи? Это наши ключи.", "Bu anahtarlar kimin? Bunlar bizim anahtarlarımız."),
      x("Это Иван, а это его семья.", "Bu İvan, bu da onun ailesi."),
    ],
    dialog: {
      title: "Kayıp çanta",
      lines: [
        { who: "A", ru: "Извините, чья это сумка?", tr: "Affedersiniz, bu çanta kimin?" },
        { who: "B", ru: "Это моя сумка. Спасибо!", tr: "Bu benim çantam. Teşekkürler!" },
        { who: "A", ru: "А это ваш билет?", tr: "Peki bu sizin biletiniz mi?" },
        { who: "B", ru: "Нет, не мой. Это её билет.", tr: "Hayır, benim değil. Bu onun (kadın) bileti." },
      ],
    },
    exercises: [
      { t: "mc", q: "___ паспорт (benim)", opts: ["мой", "моя", "моё", "мои"], a: 0 },
      { t: "mc", q: "___ семья (bizim)", opts: ["наш", "наша", "наше", "наши"], a: 1 },
      { t: "mc", q: "___ это письмо?", opts: ["Чей", "Чья", "Чьё", "Чьи"], a: 2 },
      { t: "mc", q: "Это Анна, а это ___ брат.", opts: ["его", "её", "их", "моя"], a: 1 },
      { t: "fill", q: "Это ___ имя. (benim)", a: ["моё"] },
      { t: "fill", q: "Где ___ ключи? (senin)", a: ["твои"] },
      { t: "fill", q: "Это ___ место? (sizin)", a: ["ваше"] },
      { t: "fill", q: "___ это сумка? (kimin)", a: ["чья"] },
      { t: "order", words: ["Это", "не", "мой", "билет"], a: "Это не мой билет" },
    ],
    speak: [
      { task: "Bir eşyanı göster ve senin olduğunu söyle.", model: "Это мой телефон." },
      { task: "Çantanın kimin olduğunu sor.", model: "Чья это сумка?" },
    ],
  },
  {
    id: "ru05",
    title: "Где? Когда?",
    tr: "Yer ve zaman: в ve на",
    source: "https://learnrussian.github.io/lessons/speaking-places-time-prepositions/",
    goals: ["'Nerede?' sorusuna в / на ile cevap vermek", "Edat hâli (предложный) eklerini kullanmak", "Gün, ay ve saat söylemek"],
    vocab: [
      v("шко́ла", "okul"), v("о́фис", "ofis"), v("магази́н", "mağaza"), v("рабо́та", "iş"),
      v("парк", "park"), v("вокза́л", "gar"), v("у́лица", "sokak"), v("апте́ка", "eczane"),
      v("где", "nerede"), v("когда́", "ne zaman"), v("понеде́льник", "pazartesi"), v("суббо́та", "cumartesi"),
      v("янва́рь", "ocak ayı"), v("неде́ля", "hafta"),
    ],
    grammar: [
      {
        title: "Где? в / на + edat hâli",
        body: "'в' içinde olmayı, 'на' üstünde olmayı anlatır. Bazı yerler ve etkinlikler kalıp olarak 'на' alır: на работе, на вокзале, на улице, на уроке. İsmin sonu çoğunlukla -е olur; -ия ile bitenler -ии alır.",
        tables: [
          { head: "в", rows: [["школа", "в школе"], ["парк", "в парке"], ["офис", "в офисе"], ["Россия", "в России"]] },
          { head: "на", rows: [["стол", "на столе"], ["работа", "на работе"], ["вокзал", "на вокзале"], ["улица", "на улице"]] },
        ],
      },
      {
        title: "Когда? gün ve saat",
        body: "Gün ve saat söylerken 'в' kullanılır, ancak burada belirtme hâli gelir. Eril günler değişmez, -а ile biten günler -у olur.",
        tables: [
          { head: "Gün", rows: [["понедельник", "в понедельник"], ["вторник", "во вторник"], ["среда", "в среду"], ["суббота", "в субботу"]] },
          { head: "Saat", rows: [["1:00", "в час"], ["2:00", "в два часа"], ["5:00", "в пять часов"]] },
        ],
      },
      {
        title: "Когда? ay, yıl ve hafta",
        body: "Ay ve yıl için 'в' + edat hâli, hafta için 'на' + edat hâli kullanılır.",
        tables: [
          { head: "Kalıp", rows: [["январь", "в январе"], ["май", "в мае"], ["год", "в этом году"], ["неделя", "на этой неделе"]] },
        ],
      },
    ],
    examples: [
      x("Где ты? Я на работе.", "Neredesin? İşteyim."),
      x("Книга на столе, а паспорт в сумке.", "Kitap masanın üstünde, pasaport ise çantanın içinde."),
      x("Мы гуляем в парке.", "Parkta yürüyüş yapıyoruz."),
      x("В субботу я не работаю.", "Cumartesi çalışmıyorum."),
      x("Урок в пять часов.", "Ders saat beşte."),
      x("В январе в Москве холодно.", "Ocakta Moskova'da hava soğuktur."),
    ],
    dialog: {
      title: "Ne zaman buluşalım?",
      lines: [
        { who: "A", ru: "Где ты сейчас?", tr: "Şu an neredesin?" },
        { who: "B", ru: "Я в офисе. А ты?", tr: "Ofisteyim. Ya sen?" },
        { who: "A", ru: "Я на вокзале. Когда ты не работаешь?", tr: "Gardayım. Ne zaman çalışmıyorsun?" },
        { who: "B", ru: "В субботу.", tr: "Cumartesi." },
        { who: "A", ru: "Отлично! В субботу в два часа в парке.", tr: "Harika! Cumartesi saat ikide parkta." },
      ],
    },
    exercises: [
      { t: "mc", q: "Я ___ работе.", opts: ["в", "на", "из", "по"], a: 1 },
      { t: "mc", q: "Паспорт ___ сумке. (içinde)", opts: ["в", "на", "из", "а"], a: 0 },
      { t: "mc", q: "'Çarşamba günü' hangisi?", opts: ["в среда", "в среде", "в среду", "на среду"], a: 2 },
      { t: "fill", q: "Дети в ___. (школа)", a: ["школе"] },
      { t: "fill", q: "Мой друг живёт в ___. (Россия)", a: ["России"] },
      { t: "fill", q: "Телефон на ___. (стол)", a: ["столе"] },
      { t: "fill", q: "Я работаю в ___. (суббота)", a: ["субботу"] },
      { t: "fill", q: "Мой экзамен в ___. (май)", a: ["мае"] },
      { t: "order", words: ["Урок", "в", "пять", "часов"], a: "Урок в пять часов" },
    ],
    speak: [
      { task: "Şu an nerede olduğunu söyle.", model: "Я в офисе." },
      { task: "Pazartesi saat ikide ders olduğunu söyle.", model: "В понедельник в два часа урок." },
    ],
  },
];

export const stripStress = (s) => s.replace(/́/g, "");

// Bir ders için pratik soruları: elle yazılanların tamamı + kelimelerden üretilen birkaç soru
export function buildRuPractice(lesson, vocabCount = 3) {
  const items = [...lesson.exercises];
  shuffle(lesson.vocab).slice(0, vocabCount).forEach((e) => {
    const wrong = shuffle(lesson.vocab.filter((o) => o.tr !== e.tr)).slice(0, 3).map((o) => o.tr);
    const opts = shuffle([...wrong, e.tr]);
    items.push({ t: "mc", q: "'" + e.ru + "' ne demek?", opts, a: opts.indexOf(e.tr) });
  });
  return shuffle(items);
}
