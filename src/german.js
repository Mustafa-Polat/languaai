// Almanca A1 müfredatı (Modül 1-3). Konu sırası ve kelime çekirdeği bir ders kitabının
// içindekiler yapısından esinlenmiştir; açıklamalar, örnek cümleler ve alıştırmalar özgündür.
//
// Kelime alanları: art (der/die/das), de (kelime), pl (çoğul), fem (dişil meslek biçimi), tr (Türkçe)

const w = (art, de, tr, pl, fem) => ({ art, de, tr, pl: pl || null, fem: fem || null });
const v = (de, tr) => ({ art: null, de, tr, pl: null, fem: null });

const NUMS_1_20 = [
  ["eins", "1"], ["zwei", "2"], ["drei", "3"], ["vier", "4"], ["fünf", "5"], ["sechs", "6"],
  ["sieben", "7"], ["acht", "8"], ["neun", "9"], ["zehn", "10"], ["elf", "11"], ["zwölf", "12"],
  ["dreizehn", "13"], ["vierzehn", "14"], ["fünfzehn", "15"], ["sechzehn", "16"],
  ["siebzehn", "17"], ["achtzehn", "18"], ["neunzehn", "19"], ["zwanzig", "20"],
].map(([d, t]) => v(d, t));

export const DE_MODULES = [
  {
    id: "M1",
    title: "Informationen zur Person",
    tr: "Kişisel bilgiler",
    lessons: [
      {
        id: "m1a",
        title: "Hallo!",
        tr: "Selamlaşma ve tanışma",
        goals: ["Selamlaşmak ve vedalaşmak", "Kendini tanıtmak", "Nasıl olduğunu sormak"],
        vocab: [
          v("Hallo", "merhaba"), v("Guten Morgen", "günaydın"), v("Guten Tag", "iyi günler"),
          v("Guten Abend", "iyi akşamlar"), v("Gute Nacht", "iyi geceler"), v("Tschüs", "hoşça kal"),
          v("Auf Wiedersehen", "görüşmek üzere (resmi veda)"), v("Bis bald", "yakında görüşürüz"),
          v("Bis später", "sonra görüşürüz"), v("Danke", "teşekkürler"), v("Servus", "selam (günlük)"), v("Hi", "selam (günlük)"), v("Wie geht's?", "nasılsın?"),
          v("prima", "harika"), v("gut", "iyi"), v("schlecht", "kötü"), v("sehr", "çok"),
          v("heißen", "adı olmak"), v("sein", "olmak"),
        ],
        grammar: [
          {
            title: "sein (olmak) ve heißen (adı olmak)",
            body: "Almanca'da cümlede fiil her zaman ikinci sırada durur. 'Sie' (büyük harfle) resmi hitaptır, tek kişiye de 'siz' derken kullanılır.",
            tables: [
              { head: "sein", rows: [["ich", "bin"], ["du", "bist"], ["er/sie/es", "ist"], ["wir", "sind"], ["ihr", "seid"], ["sie/Sie", "sind"]] },
              { head: "heißen", rows: [["ich", "heiße"], ["du", "heißt"], ["er/sie/es", "heißt"], ["wir", "heißen"], ["ihr", "heißt"], ["sie/Sie", "heißen"]] },
            ],
          },
        ],
        examples: [
          { de: "Hallo, ich heiße Ali. Und du?", tr: "Merhaba, adım Ali. Ya sen?" },
          { de: "Wie heißen Sie?", tr: "Adınız nedir? (resmi)" },
          { de: "Ich bin Deniz.", tr: "Ben Deniz'im." },
          { de: "Wie geht es dir? – Danke, sehr gut!", tr: "Nasılsın? – Teşekkürler, çok iyiyim!" },
        ],
        exercises: [
          { t: "mc", q: "Sabah biriyle karşılaştığında ne dersin?", opts: ["Gute Nacht", "Guten Morgen", "Guten Abend", "Tschüs"], a: 1 },
          { t: "mc", q: "'Auf Wiedersehen' ne anlama gelir?", opts: ["Teşekkürler", "Günaydın", "Görüşmek üzere", "Merhaba"], a: 2 },
          { t: "mc", q: "Akşam yatmadan önce ne denir?", opts: ["Gute Nacht", "Guten Tag", "Hallo", "Danke"], a: 0 },
          { t: "fill", q: "Ich ___ Deniz. (sein)", a: ["bin"] },
          { t: "fill", q: "Du ___ Anna. (sein)", a: ["bist"] },
          { t: "fill", q: "Wie ___ du? (heißen)", a: ["heißt", "heisst"] },
          { t: "fill", q: "Er ___ Metin. (heißen)", a: ["heißt", "heisst"] },
          { t: "fill", q: "Sie (onlar) ___ Freunde. (sein)", a: ["sind"] },
          { t: "order", words: ["Wie", "heißt", "du"], a: "Wie heißt du" },
          { t: "order", words: ["Mir", "geht", "es", "gut"], a: "Mir geht es gut" },
        ],
      },
      {
        id: "m1b",
        title: "Wo wohnst du?",
        tr: "Nerede yaşıyorsun? (alfabe, sayılar, adres)",
        goals: ["Harf harf söylemek (hecelemek)", "1-20 arası sayılar", "Telefon numarası ve adres vermek", "Evet/hayır soruları"],
        vocab: [
          v("null", "0"),
          ...NUMS_1_20,
          v("wohnen", "ikamet etmek"), v("buchstabieren", "hecelemek"),
          w("die", "Telefonnummer", "telefon numarası", "Telefonnummern"),
          w("die", "Adresse", "adres", "Adressen"), w("die", "Postleitzahl", "posta kodu", "Postleitzahlen"),
          v("Wie alt bist du?", "kaç yaşındasın?"), v("Wo wohnst du?", "nerede oturuyorsun?"),
        ],
        grammar: [
          {
            title: "wohnen ve W-Fragen",
            body: "Düzenli fiiller kökün sonuna kişi ekini alır. Soru kelimeleri: Wer (kim), Wie (nasıl), Wo (nerede). Evet/hayır sorularında fiil cümlenin başına gelir. Olumsuzluk 'nicht' ile yapılır.",
            tables: [
              { head: "wohnen", rows: [["ich", "wohne"], ["du", "wohnst"], ["er/sie/es", "wohnt"], ["wir", "wohnen"], ["ihr", "wohnt"], ["sie/Sie", "wohnen"]] },
            ],
          },
          {
            title: "Alfabe ve özel harfler",
            body: "26 harfin yanında ä, ö, ü (Umlaut) ve ß (es-tset) vardır. Alman alfabesinde J 'yot', V 'fau', W 've', Y 'üpsilon', Z 'tset' diye okunur. Ad ve soyadı hecelerken bu harf isimleri kullanılır.",
            tables: [],
          },
        ],
        examples: [
          { de: "Wohnst du in Berlin? – Ja, ich wohne in Berlin.", tr: "Berlin'de mi oturuyorsun? – Evet, Berlin'de oturuyorum." },
          { de: "Nein, ich wohne nicht in Hamburg.", tr: "Hayır, Hamburg'da oturmuyorum." },
          { de: "Ich bin siebzehn Jahre alt.", tr: "On yedi yaşındayım." },
          { de: "Meine Telefonnummer ist null-fünf-drei-drei...", tr: "Telefon numaram sıfır-beş-üç-üç..." },
        ],
        exercises: [
          { t: "mc", q: "'dreizehn' hangi sayı?", opts: ["3", "13", "30", "31"], a: 1 },
          { t: "mc", q: "'sechzehn' hangi sayı?", opts: ["6", "60", "16", "26"], a: 2 },
          { t: "mc", q: "'Wie alt bist du?' sorusu neyi sorar?", opts: ["Adını", "Yaşını", "Adresini", "Nereli olduğunu"], a: 1 },
          { t: "fill", q: "7 = ___", a: ["sieben"] },
          { t: "fill", q: "12 = ___", a: ["zwölf", "zwoelf"] },
          { t: "fill", q: "Wo ___ du? (wohnen)", a: ["wohnst"] },
          { t: "fill", q: "Er ___ in Izmir. (wohnen)", a: ["wohnt"] },
          { t: "fill", q: "Nein, ich wohne ___ in Berlin. (olumsuz)", a: ["nicht"] },
          { t: "order", words: ["Wohnst", "du", "in", "Izmir"], a: "Wohnst du in Izmir" },
          { t: "order", words: ["Ich", "bin", "siebzehn", "Jahre", "alt"], a: "Ich bin siebzehn Jahre alt" },
        ],
      },
      {
        id: "m1c",
        title: "Woher kommst du?",
        tr: "Nerelisin? (ülkeler, milliyetler, diller)",
        goals: ["Nereli olduğunu söylemek", "Milliyet ve dil adları", "kommen ve sprechen fiilleri"],
        vocab: [
          v("Deutschland", "Almanya"), v("Türkiye", "Türkiye"), w("die", "Schweiz", "İsviçre"),
          v("Spanien", "İspanya"), v("Italien", "İtalya"), v("Frankreich", "Fransa"),
          v("Russland", "Rusya"), v("Japan", "Japonya"),
          w("der", "Türke", "Türk (erkek)"), w("die", "Türkin", "Türk (kadın)"),
          w("der", "Deutsche", "Alman (erkek)"), w("die", "Deutsche", "Alman (kadın)"),
          w("der", "Italiener", "İtalyan (erkek)"), w("die", "Italienerin", "İtalyan (kadın)"),
          w("der", "Spanier", "İspanyol (erkek)"), w("die", "Spanierin", "İspanyol (kadın)"),
          w("der", "Schweizer", "İsviçreli (erkek)"), w("die", "Schweizerin", "İsviçreli (kadın)"),
          v("Türkisch", "Türkçe"), v("Deutsch", "Almanca"), v("Englisch", "İngilizce"),
          v("Spanisch", "İspanyolca"), v("Französisch", "Fransızca"),
          v("woher", "nereden"), v("kommen", "gelmek"), v("sprechen", "konuşmak"), v("aus", "-den/-dan"),
        ],
        grammar: [
          {
            title: "kommen ve sprechen",
            body: "'sprechen' fiilinde du ve er/sie/es için kök ünlüsü e → i olur. 'Woher kommst du?' sorusuna 'Ich komme aus ...' ile cevap verilir. Birkaç ülke artikelle kullanılır: aus der Schweiz.",
            tables: [
              { head: "kommen", rows: [["ich", "komme"], ["du", "kommst"], ["er/sie/es", "kommt"], ["wir", "kommen"], ["ihr", "kommt"], ["sie/Sie", "kommen"]] },
              { head: "sprechen", rows: [["ich", "spreche"], ["du", "sprichst"], ["er/sie/es", "spricht"], ["wir", "sprechen"], ["ihr", "sprecht"], ["sie/Sie", "sprechen"]] },
            ],
          },
        ],
        examples: [
          { de: "Woher kommst du? – Ich komme aus Türkiye.", tr: "Nerelisin? – Türkiye'denim." },
          { de: "Sie kommt aus Italien. Sie ist Italienerin.", tr: "O İtalya'dan geliyor. O İtalyan." },
          { de: "Er spricht Deutsch und Französisch.", tr: "O Almanca ve Fransızca konuşuyor." },
          { de: "Nora kommt aus der Schweiz.", tr: "Nora İsviçre'den geliyor." },
        ],
        exercises: [
          { t: "mc", q: "'Woher kommst du?' sorusu neyi sorar?", opts: ["Nerede oturuyorsun?", "Nereden geliyorsun?", "Kaç yaşındasın?", "Adın ne?"], a: 1 },
          { t: "mc", q: "Luca İtalya'dan geliyor. Luca ne olur?", opts: ["Spanier", "Türke", "Italiener", "Schweizer"], a: 2 },
          { t: "fill", q: "Ich ___ aus Türkiye. (kommen)", a: ["komme"] },
          { t: "fill", q: "Du ___ gut Englisch. (sprechen)", a: ["sprichst"] },
          { t: "fill", q: "Er ___ Deutsch. (sprechen)", a: ["spricht"] },
          { t: "fill", q: "Wir ___ aus Japan. (kommen)", a: ["kommen"] },
          { t: "fill", q: "Ana kommt aus Spanien. Sie spricht ___.", a: ["Spanisch"] },
          { t: "order", words: ["Woher", "kommst", "du"], a: "Woher kommst du" },
          { t: "order", words: ["Sie", "kommt", "aus", "Frankreich"], a: "Sie kommt aus Frankreich" },
          { t: "order", words: ["Er", "spricht", "Türkisch", "und", "Deutsch"], a: "Er spricht Türkisch und Deutsch" },
        ],
      },
    ],
  },
  {
    id: "M2",
    title: "Die Schule",
    tr: "Okul",
    lessons: [
      {
        id: "m2a",
        title: "Meine Schulsachen",
        tr: "Okul eşyaları ve artikeller",
        goals: ["Okul eşyalarını adlandırmak", "der / die / das ve çoğul", "ein / kein", "mein / meine"],
        vocab: [
          w("der", "Bleistift", "kurşun kalem", "Bleistifte"), w("der", "Minenstift", "uçlu kalem", "Minenstifte"),
          w("der", "Spitzer", "kalemtıraş", "Spitzer"), w("das", "Lineal", "cetvel", "Lineale"),
          w("der", "Marker", "işaretleme kalemi", "Marker"), w("der", "Zirkel", "pergel", "Zirkel"),
          w("der", "Kugelschreiber", "tükenmez kalem", "Kugelschreiber"), w("der", "Buntstift", "boya kalemi", "Buntstifte"),
          w("der", "Füller", "dolma kalem", "Füller"), w("die", "Schere", "makas", "Scheren"),
          w("der", "Radiergummi", "silgi", "Radiergummis"), w("das", "Heft", "defter", "Hefte"),
          w("das", "Wörterbuch", "sözlük", "Wörterbücher"), w("das", "Buch", "kitap", "Bücher"),
          w("das", "Mäppchen", "kalem kutusu", "Mäppchen"), w("die", "Schultasche", "okul çantası", "Schultaschen"),
        ],
        grammar: [
          {
            title: "Artikel: der, die, das",
            body: "Her ismin bir cinsiyeti vardır: der (eril), die (dişil), das (nötr). Çoğulda hepsi 'die' olur. İsmi her zaman artikeliyle birlikte öğren. 'Was ist das?' sorusuna 'Das ist ein/eine ...' diye cevap verilir; olumsuzda 'kein/keine' kullanılır.",
            tables: [
              { head: "ein / kein", rows: [["der", "ein / kein Spitzer"], ["die", "eine / keine Schere"], ["das", "ein / kein Heft"], ["die (Pl.)", "– / keine Hefte"]] },
              { head: "mein / dein / sein / ihr", rows: [["ich", "mein (der, das) · meine (die)"], ["du", "dein · deine"], ["er/es", "sein · seine"], ["sie", "ihr · ihre"]] },
            ],
          },
        ],
        examples: [
          { de: "Was ist das? – Das ist eine Schere.", tr: "Bu nedir? – Bu bir makas." },
          { de: "Ist das ein Wörterbuch? – Nein, das ist kein Wörterbuch.", tr: "Bu bir sözlük mü? – Hayır, bu sözlük değil." },
          { de: "Mein Heft ist neu.", tr: "Defterim yeni." },
          { de: "Meine Schere ist alt.", tr: "Makasım eski." },
        ],
        exercises: [
          { t: "fill", q: "Das ist ___ Schere. (ein/eine)", a: ["eine"] },
          { t: "fill", q: "Das ist ___ Lineal. (ein/eine)", a: ["ein"] },
          { t: "fill", q: "Das ist ___ Buch. (olumsuz: kein/keine)", a: ["kein"] },
          { t: "fill", q: "___ Schultasche ist grün. (ich)", a: ["Meine"] },
          { t: "fill", q: "___ Heft ist blau. (du)", a: ["Dein"] },
          { t: "mc", q: "Çoğul halinde artikel hangisidir?", opts: ["der", "die", "das", "ein"], a: 1 },
          { t: "order", words: ["Das", "ist", "ein", "Spitzer"], a: "Das ist ein Spitzer" },
          { t: "order", words: ["Mein", "Heft", "ist", "neu"], a: "Mein Heft ist neu" },
        ],
      },
      {
        id: "m2a2",
        title: "Meine Klasse und Farben",
        tr: "Sınıf eşyaları ve renkler",
        goals: ["Sınıftaki eşyaları adlandırmak", "Renkleri söylemek", "Sıfatlarla tanımlamak"],
        vocab: [
          w("die", "Uhr", "saat", "Uhren"), w("der", "Globus", "küre", "Globusse"), w("der", "Stuhl", "sandalye", "Stühle"),
          w("die", "Kreide", "tebeşir"), w("die", "Tür", "kapı", "Türen"), w("der", "Tafelwischer", "tahta silgisi", "Tafelwischer"),
          w("der", "Bücherschrank", "kitaplık", "Bücherschränke"), w("der", "Tisch", "masa", "Tische"),
          w("der", "Papierkorb", "çöp sepeti", "Papierkörbe"), w("der", "Computer", "bilgisayar", "Computer"),
          w("die", "Landkarte", "harita", "Landkarten"), w("das", "Bild", "resim", "Bilder"),
          w("die", "Pinnwand", "pano", "Pinnwände"), w("die", "Tafel", "tahta", "Tafeln"),
          v("rot", "kırmızı"), v("blau", "mavi"), v("grün", "yeşil"), v("gelb", "sarı"), v("weiß", "beyaz"),
          v("schwarz", "siyah"), v("orange", "turuncu"), v("lila", "mor"), v("braun", "kahverengi"),
          v("grau", "gri"), v("rosa", "pembe"), v("beige", "bej"), v("neu", "yeni"), v("alt", "eski"),
          v("groß", "büyük"), v("klein", "küçük"), v("dick", "kalın"), v("dünn", "ince"),
        ],
        grammar: [
          {
            title: "Sıfat cümlenin sonunda",
            body: "'sein' fiilinden sonra gelen sıfat çekim almaz: 'Mein Mäppchen ist rot und klein.' Sıfatlar 'und' (ve), 'aber' (ama) ile bağlanır.",
            tables: [],
          },
        ],
        examples: [
          { de: "Mein Heft ist gelb und dünn.", tr: "Defterim sarı ve ince." },
          { de: "Die Tafel ist grün.", tr: "Tahta yeşil." },
          { de: "Ist dein Spitzer neu? – Nein, mein Spitzer ist alt.", tr: "Kalemtıraşın yeni mi? – Hayır, benim kalemtıraşım eski." },
        ],
        exercises: [
          { t: "mc", q: "'gelb' hangi renk?", opts: ["Kırmızı", "Sarı", "Mavi", "Yeşil"], a: 1 },
          { t: "mc", q: "'schwarz' hangi renk?", opts: ["Beyaz", "Gri", "Siyah", "Kahverengi"], a: 2 },
          { t: "mc", q: "'dünn' ne demek?", opts: ["Kalın", "Eski", "Küçük", "İnce"], a: 3 },
          { t: "fill", q: "'Mor' renginin Almancası: ___", a: ["lila"] },
          { t: "fill", q: "Mein Mäppchen ___ klein. (sein)", a: ["ist"] },
          { t: "fill", q: "Die Schere ___ orange. (sein)", a: ["ist"] },
          { t: "order", words: ["Mein", "Heft", "ist", "gelb"], a: "Mein Heft ist gelb" },
          { t: "order", words: ["Die", "Tafel", "ist", "grün"], a: "Die Tafel ist grün" },
        ],
      },
      {
        id: "m2b",
        title: "Mein Stundenplan",
        tr: "Ders programım (dersler, günler, görüşler)",
        goals: ["Ders adları", "Haftanın günleri ve 'am'", "haben, mögen, finden", "Fikir belirtmek"],
        vocab: [
          v("Deutsch", "Almanca (ders)"), v("Englisch", "İngilizce (ders)"), v("Mathematik", "matematik"),
          v("Physik", "fizik"), v("Chemie", "kimya"), v("Biologie", "biyoloji"), v("Geschichte", "tarih"),
          v("Erdkunde", "coğrafya"), v("Informatik", "bilişim"), v("Religion", "din dersi"),
          v("Musik", "müzik"), v("Kunst", "sanat / resim"), v("Sport", "beden eğitimi"),
          w("der", "Stundenplan", "ders programı", "Stundenpläne"),
          w("der", "Montag", "pazartesi"), w("der", "Dienstag", "salı"), w("der", "Mittwoch", "çarşamba"),
          w("der", "Donnerstag", "perşembe"), w("der", "Freitag", "cuma"),
          w("der", "Samstag", "cumartesi"), w("der", "Sonntag", "pazar"),
          v("haben", "sahip olmak"), v("mögen", "sevmek"), v("finden", "bulmak / (fikir olarak) bulmak"),
          v("lustig", "eğlenceli"), v("langweilig", "sıkıcı"), v("wichtig", "önemli"),
          v("interessant", "ilginç"), v("spannend", "heyecan verici"), v("leicht", "kolay"), v("schwer", "zor"),
          v("toll", "harika / çok güzel"), v("uninteressant", "ilginç olmayan"), v("unwichtig", "önemsiz"), v("nett", "sevimli / nazik"),
          w("das", "Lieblingsfach", "en sevilen ders", "Lieblingsfächer"),
        ],
        grammar: [
          {
            title: "haben, mögen, finden",
            body: "'Wann?' (ne zaman) sorusuna gün için 'am' + gün ile cevap verilir: am Montag. 'Ich finde Chemie spannend' = 'Bence kimya heyecan verici.' 'mögen' fiilinde ich ve er/sie/es aynıdır: mag.",
            tables: [
              { head: "haben", rows: [["ich", "habe"], ["du", "hast"], ["er/sie/es", "hat"], ["wir", "haben"], ["ihr", "habt"], ["sie/Sie", "haben"]] },
              { head: "mögen", rows: [["ich", "mag"], ["du", "magst"], ["er/sie/es", "mag"], ["wir", "mögen"], ["ihr", "mögt"], ["sie/Sie", "mögen"]] },
              { head: "finden", rows: [["ich", "finde"], ["du", "findest"], ["er/sie/es", "findet"], ["wir", "finden"], ["ihr", "findet"], ["sie/Sie", "finden"]] },
            ],
          },
        ],
        examples: [
          { de: "Wann hast du Informatik? – Ich habe am Dienstag Informatik.", tr: "Bilişim dersin ne zaman? – Salı günü bilişimim var." },
          { de: "Ich mag Musik sehr.", tr: "Müziği çok severim." },
          { de: "Ich finde Mathe leicht und Chemie spannend.", tr: "Bence matematik kolay, kimya heyecan verici." },
          { de: "Am Wochenende habe ich keine Schule.", tr: "Hafta sonu okulum yok." },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ am Montag Deutsch. (haben)", a: ["habe"] },
          { t: "fill", q: "Du ___ Mathe. (mögen)", a: ["magst"] },
          { t: "fill", q: "Er ___ Mathe leicht. (finden)", a: ["findet"] },
          { t: "fill", q: "Wann hast du Sport? – ___ Freitag.", a: ["Am", "am"] },
          { t: "fill", q: "Wir ___ heute Chemie. (haben)", a: ["haben"] },
          { t: "mc", q: "Hafta sonu günleri hangileri?", opts: ["Montag und Dienstag", "Samstag und Sonntag", "Mittwoch und Freitag", "Dienstag und Samstag"], a: 1 },
          { t: "mc", q: "'langweilig' ne demek?", opts: ["Eğlenceli", "Önemli", "Sıkıcı", "Kolay"], a: 2 },
          { t: "order", words: ["Ich", "habe", "am", "Freitag", "Sport"], a: "Ich habe am Freitag Sport" },
          { t: "order", words: ["Wann", "hast", "du", "Deutsch"], a: "Wann hast du Deutsch" },
        ],
      },
      {
        id: "m2c",
        title: "Die Schulaktivitäten",
        tr: "Okul etkinlikleri ve emirler",
        goals: ["Hobi ve etkinlikleri anlatmak", "'gern' ile sevdiğini söylemek", "Emir kipi (du için)"],
        vocab: [
          v("spielen", "oynamak / çalmak"), v("lernen", "öğrenmek / çalışmak"), v("hören", "dinlemek / duymak"),
          v("machen", "yapmak"), v("singen", "şarkı söylemek"), v("malen", "boyamak / resim yapmak"),
          v("zeichnen", "çizmek"), v("schwimmen", "yüzmek"), v("turnen", "jimnastik yapmak"),
          v("lesen", "okumak"), v("eislaufen", "buz pateni yapmak"), v("gern", "severek / hoşlanarak"),
          v("Hausaufgaben machen", "ödev yapmak"), v("Gitarre spielen", "gitar çalmak"),
          v("Schach spielen", "satranç oynamak"), v("Tennis spielen", "tenis oynamak"), v("Computerspiele spielen", "bilgisayar oyunu oynamak"), v("Musik hören", "müzik dinlemek"),
          v("Englisch lernen", "İngilizce öğrenmek"),
          v("Steh auf!", "kalk!"), v("Komm!", "gel!"), v("Geh!", "git!"), v("Lies!", "oku!"), v("Schreib!", "yaz!"), v("Sei leise!", "sessiz ol!"),
        ],
        grammar: [
          {
            title: "Düzenli fiiller ve 'gern'",
            body: "Düzenli fiiller kökün sonuna ekleri alır (spielen → ich spiele, du spielst, er spielt). 'gern' fiilden sonra gelir: 'Ich spiele gern Gitarre.' Olumsuzda 'nicht gern' denir. 'lesen' fiilinde du liest, er liest (e → ie).",
            tables: [
              { head: "spielen", rows: [["ich", "spiele"], ["du", "spielst"], ["er/sie/es", "spielt"], ["wir", "spielen"], ["ihr", "spielt"], ["sie/Sie", "spielen"]] },
            ],
          },
          {
            title: "Emir kipi (du)",
            body: "'du' için emir, fiil kökünden oluşur ve cümle fiille başlar: kommen → Komm!, gehen → Geh!, schreiben → Schreib!. 'lesen' düzensizdir: Lies!. 'sein' için: Sei leise!",
            tables: [],
          },
        ],
        examples: [
          { de: "Was machst du gern? – Ich singe gern.", tr: "Ne yapmaktan hoşlanırsın? – Şarkı söylemeyi severim." },
          { de: "Kerem spielt gern Fußball.", tr: "Kerem futbol oynamayı sever." },
          { de: "Ich mache nicht gern Hausaufgaben.", tr: "Ödev yapmayı sevmem." },
          { de: "Lies das Buch!", tr: "Kitabı oku!" },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ gern Gitarre. (spielen)", a: ["spiele"] },
          { t: "fill", q: "Kerem ___ gern Fußball. (spielen)", a: ["spielt"] },
          { t: "fill", q: "Du ___ gern. (singen)", a: ["singst"] },
          { t: "fill", q: "Er ___ gern Bücher. (lesen)", a: ["liest"] },
          { t: "fill", q: "Wir ___ gern. (schwimmen)", a: ["schwimmen"] },
          { t: "mc", q: "'Lies!' ne demek?", opts: ["Yaz!", "Oku!", "Gel!", "Git!"], a: 1 },
          { t: "mc", q: "'Sei leise!' ne demek?", opts: ["Kalk!", "Dinle!", "Sessiz ol!", "Gel!"], a: 2 },
          { t: "order", words: ["Ich", "singe", "gern"], a: "Ich singe gern" },
          { t: "order", words: ["Was", "machst", "du", "gern"], a: "Was machst du gern" },
        ],
      },
    ],
  },
  {
    id: "M3",
    title: "Die Gesellschaft",
    tr: "Toplum (aile, meslekler, dış görünüş)",
    lessons: [
      {
        id: "m3a",
        title: "Die Familie",
        tr: "Aile",
        goals: ["Aile üyelerini anlatmak", "haben + Akkusativ", "Genitiv -s", "20-100 arası sayılar", "unser, euer, ihr"],
        vocab: [
          w("der", "Vater", "baba", "Väter"), w("die", "Mutter", "anne", "Mütter"),
          w("der", "Bruder", "erkek kardeş / abi", "Brüder"), w("die", "Schwester", "kız kardeş / abla", "Schwestern"),
          w("der", "Sohn", "oğul", "Söhne"), w("die", "Tochter", "kız evlat", "Töchter"),
          w("der", "Großvater", "büyükbaba", "Großväter"), w("die", "Großmutter", "büyükanne", "Großmütter"),
          w("die", "Eltern", "anne baba"), w("die", "Geschwister", "kardeşler"),
          w("die", "Großeltern", "büyükanne ve büyükbaba"), w("das", "Kind", "çocuk", "Kinder"),
          w("der", "Onkel", "amca / dayı", "Onkel"), w("die", "Tante", "teyze / hala", "Tanten"),
          w("der", "Cousin", "kuzen (erkek)", "Cousins"), w("die", "Cousine", "kuzen (kız)", "Cousinen"),
          w("der", "Neffe", "yeğen (erkek)", "Neffen"), w("die", "Nichte", "yeğen (kız)", "Nichten"),
          w("der", "Enkel", "torun", "Enkel"),
          v("zwanzig", "20"), v("dreißig", "30"), v("vierzig", "40"), v("fünfzig", "50"), v("sechzig", "60"),
          v("siebzig", "70"), v("achtzig", "80"), v("neunzig", "90"), v("hundert", "100"),
        ],
        grammar: [
          {
            title: "haben + Akkusativ",
            body: "'haben' fiilinin nesnesi Akkusativ halindedir. Sadece eril (der) isimlerde belirsiz artikel değişir: ein → einen, kein → keinen. Dişil, nötr ve çoğulda değişmez.",
            tables: [
              { head: "Akkusativ", rows: [["der", "Ich habe einen / keinen Bruder."], ["die", "Ich habe eine / keine Schwester."], ["das", "Ich habe ein / kein Kind."], ["die (Pl.)", "Ich habe keine Geschwister."]] },
            ],
          },
          {
            title: "Genitiv -s ve çoğul iyelik",
            body: "Kişi adlarında sahiplik için isme -s eklenir: Elifs Eltern (Elif'in anne babası). Çoğul sahip: wir → unser/unsere, ihr → euer/eure, sie → ihr/ihre, Sie → Ihr/Ihre. Sayılarda birler önce söylenir: 23 = dreiundzwanzig (üç-ve-yirmi).",
            tables: [
              { head: "Possessiv (Plural)", rows: [["wir", "unser · unsere"], ["ihr", "euer · eure"], ["sie", "ihr · ihre"], ["Sie", "Ihr · Ihre"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich habe einen Bruder und eine Schwester.", tr: "Bir erkek kardeşim ve bir kız kardeşim var." },
          { de: "Elifs Eltern wohnen in Izmir.", tr: "Elif'in anne babası İzmir'de oturuyor." },
          { de: "Unsere Großeltern sind fünfundsiebzig Jahre alt.", tr: "Büyükanne ve büyükbabamız yetmiş beş yaşında." },
          { de: "Habt ihr Geschwister?", tr: "Kardeşleriniz var mı?" },
        ],
        exercises: [
          { t: "fill", q: "Ich habe ___ Bruder. (ein)", a: ["einen"] },
          { t: "fill", q: "Ich habe ___ Schwester. (eine/einen)", a: ["eine"] },
          { t: "fill", q: "Ich habe ___ Kind. (olumsuz)", a: ["kein"] },
          { t: "fill", q: "Das ist die Mutter von Elif: ___ Mutter. (Genitiv)", a: ["Elifs"] },
          { t: "fill", q: "Wir haben Eltern: ___ Eltern. (wir)", a: ["unsere", "Unsere"] },
          { t: "fill", q: "Habt ihr ___ Großeltern? (ihr)", a: ["eure"] },
          { t: "fill", q: "45 = ___", a: ["fünfundvierzig", "fuenfundvierzig"] },
          { t: "mc", q: "'dreiunddreißig' hangi sayı?", opts: ["23", "33", "43", "30"], a: 1 },
          { t: "order", words: ["Ich", "habe", "einen", "Bruder"], a: "Ich habe einen Bruder" },
          { t: "order", words: ["Mein", "Vater", "ist", "Lehrer"], a: "Mein Vater ist Lehrer" },
        ],
      },
      {
        id: "m3b",
        title: "Die Berufe",
        tr: "Meslekler",
        goals: ["Meslekleri adlandırmak (erkek/kadın biçimi)", "Meslek ve iş yerini anlatmak"],
        vocab: [
          w("der", "Arzt", "doktor", "Ärzte", "Ärztin"), w("der", "Lehrer", "öğretmen", "Lehrer", "Lehrerin"),
          w("der", "Koch", "aşçı", "Köche", "Köchin"), w("der", "Bäcker", "fırıncı", "Bäcker", "Bäckerin"),
          w("der", "Friseur", "kuaför", "Friseure", "Friseurin"), w("der", "Verkäufer", "satıcı", "Verkäufer", "Verkäuferin"),
          w("der", "Kellner", "garson", "Kellner", "Kellnerin"), w("der", "Mechaniker", "tamirci", "Mechaniker", "Mechanikerin"),
          w("der", "Ingenieur", "mühendis", "Ingenieure", "Ingenieurin"), w("der", "Architekt", "mimar", "Architekten", "Architektin"),
          w("der", "Journalist", "gazeteci", "Journalisten", "Journalistin"), w("der", "Tierarzt", "veteriner", "Tierärzte", "Tierärztin"),
          w("der", "Pilot", "pilot", "Piloten", "Pilotin"), w("der", "Sänger", "şarkıcı", "Sänger", "Sängerin"),
          w("der", "Apotheker", "eczacı", "Apotheker", "Apothekerin"),
          w("der", "Anwalt", "avukat", "Anwälte", "Anwältin"), w("der", "Gärtner", "bahçıvan", "Gärtner", "Gärtnerin"),
          w("der", "Maler", "ressam / boyacı", "Maler", "Malerin"), w("der", "Schauspieler", "oyuncu", "Schauspieler", "Schauspielerin"),
          w("der", "Krankenpfleger", "hemşire (erkek)", "Krankenpfleger", "Krankenpflegerin"), w("der", "Student", "üniversite öğrencisi", "Studenten", "Studentin"),
          w("die", "Sekretärin", "sekreter (kadın)", "Sekretärinnen"),
          w("die", "Apotheke", "eczane", "Apotheken"), w("die", "Schule", "okul", "Schulen"),
          w("die", "Küche", "mutfak", "Küchen"), w("das", "Restaurant", "restoran", "Restaurants"),
          w("die", "Feuerwehr", "itfaiye"), w("die", "Firma", "şirket", "Firmen"),
          w("die", "Arbeitsstelle", "iş yeri", "Arbeitsstellen"),
          v("arbeiten", "çalışmak"), v("backen", "fırında pişirmek"), v("kochen", "pişirmek"),
          v("fliegen", "uçmak"), v("untersuchen", "muayene etmek"), v("verkaufen", "satmak"),
          v("unterrichten", "ders vermek"),
        ],
        grammar: [
          {
            title: "Meslekler: erkek ve kadın biçimi",
            body: "Mesleği söylerken artikel kullanılmaz: 'Ich bin Lehrer.', 'Sie ist Ärztin.' Kadın biçimi genelde -in eklenerek yapılır (Koch → Köchin); bazen ünlü de değişir (Arzt → Ärztin). Sorusu: 'Was bist du von Beruf?'. Kökü -t / -d ile biten fiillerde araya e girer: er arbeitet.",
            tables: [],
          },
        ],
        examples: [
          { de: "Was ist dein Vater von Beruf? – Er ist Architekt.", tr: "Baban ne iş yapıyor? – Mimar." },
          { de: "Meine Mutter ist Ärztin. Sie untersucht Patienten.", tr: "Annem doktor. Hastaları muayene ediyor." },
          { de: "Ich bin Kellner und arbeite im Restaurant.", tr: "Garsonum ve restoranda çalışıyorum." },
        ],
        exercises: [
          { t: "fill", q: "Meine Mutter ist Ärztin. Mein Vater ist ___. (erkek)", a: ["Arzt"] },
          { t: "fill", q: "Sie ist ___. (Lehrer → kadın)", a: ["Lehrerin"] },
          { t: "fill", q: "Er ___ in einer Apotheke. (arbeiten)", a: ["arbeitet"] },
          { t: "fill", q: "Die Frau ist ___. (Koch → kadın)", a: ["Köchin", "Koechin"] },
          { t: "mc", q: "'Ich backe Brot und Kuchen.' Bu kim?", opts: ["Bäcker", "Pilot", "Friseur", "Arzt"], a: 0 },
          { t: "mc", q: "'Ich verkaufe Medikamente.' Nerede çalışıyor?", opts: ["Schule", "Apotheke", "Küche", "Feuerwehr"], a: 1 },
          { t: "order", words: ["Was", "ist", "dein", "Vater", "von", "Beruf"], a: "Was ist dein Vater von Beruf" },
          { t: "order", words: ["Ich", "arbeite", "in", "der", "Schule"], a: "Ich arbeite in der Schule" },
        ],
      },
      {
        id: "m3c",
        title: "Das Aussehen",
        tr: "Dış görünüş",
        goals: ["Vücut bölümleri", "Dış görünüşü anlatmak", "tragen fiili", "sein / ihr iyelik zamirleri"],
        vocab: [
          w("der", "Kopf", "baş", "Köpfe"), w("das", "Gesicht", "yüz", "Gesichter"), w("die", "Haare", "saç"),
          w("das", "Auge", "göz", "Augen"), w("das", "Ohr", "kulak", "Ohren"), w("die", "Nase", "burun", "Nasen"),
          w("der", "Mund", "ağız", "Münder"), w("die", "Lippe", "dudak", "Lippen"), w("der", "Hals", "boyun", "Hälse"),
          w("der", "Arm", "kol", "Arme"), w("das", "Bein", "bacak", "Beine"),
          v("groß", "uzun / büyük"), v("klein", "kısa / küçük"), v("schlank", "ince yapılı"),
          v("dick", "şişman"), v("dünn", "zayıf"), v("lang", "uzun"), v("kurz", "kısa"),
          v("lockig", "kıvırcık"), v("glatt", "düz"), v("blond", "sarı (saç)"),
          v("oval", "oval"), v("rund", "yuvarlak"), v("eckig", "köşeli"), v("schmal", "dar / ince"),
          v("breit", "geniş"), v("spitz", "sivri"), v("mittelgroß", "orta boylu"),
          v("tragen", "taşımak / giymek"), v("aussehen", "görünmek"),
        ],
        grammar: [
          {
            title: "tragen ve iyelik zamirleri (sein / ihr)",
            body: "'tragen' fiilinde du ve er/sie/es için a → ä olur. Sahibi erkekse sein/seine, kadınsa ihr/ihre kullanılır: 'Seine Haare sind blond.' (onun, erkek) / 'Ihre Augen sind grün.' (onun, kadın). 'Wie sieht er aus?' = 'Nasıl görünüyor?'",
            tables: [
              { head: "tragen", rows: [["ich", "trage"], ["du", "trägst"], ["er/sie/es", "trägt"], ["wir", "tragen"], ["ihr", "tragt"], ["sie/Sie", "tragen"]] },
            ],
          },
        ],
        examples: [
          { de: "Er ist groß und schlank. Seine Haare sind kurz.", tr: "O uzun ve ince yapılı. Saçları kısa." },
          { de: "Sie hat lange, lockige Haare. Ihre Augen sind blau.", tr: "Onun uzun, kıvırcık saçları var. Gözleri mavi." },
          { de: "Selin trägt eine Brille.", tr: "Selin gözlük takıyor." },
          { de: "Wie sieht deine Schwester aus?", tr: "Kız kardeşin nasıl görünüyor?" },
        ],
        exercises: [
          { t: "fill", q: "Sie ___ ein Kopftuch. (tragen)", a: ["trägt", "traegt"] },
          { t: "fill", q: "Du ___ eine Jacke. (tragen)", a: ["trägst", "traegst"] },
          { t: "fill", q: "Das ist Ali. ___ Augen sind braun. (er)", a: ["Seine"] },
          { t: "fill", q: "Das ist Lena. ___ Haare sind blond. (sie)", a: ["Ihre"] },
          { t: "mc", q: "'lockig' ne demek?", opts: ["Düz", "Kıvırcık", "Kısa", "Uzun"], a: 1 },
          { t: "mc", q: "'das Ohr' hangi vücut bölümü?", opts: ["Göz", "Burun", "Kulak", "Ağız"], a: 2 },
          { t: "order", words: ["Seine", "Haare", "sind", "kurz"], a: "Seine Haare sind kurz" },
          { t: "order", words: ["Ihre", "Augen", "sind", "grün"], a: "Ihre Augen sind grün" },
          { t: "order", words: ["Er", "ist", "groß", "und", "schlank"], a: "Er ist groß und schlank" },
        ],
      },
    ],
  },
  {
    id: "M4",
    title: "Tägliches Leben",
    tr: "Günlük hayat",
    lessons: [
      {
        id: "m4a",
        title: "Wie spät ist es?",
        tr: "Saat ve günün bölümleri",
        goals: ["Saati söylemek (resmi ve günlük konuşma)", "Günün bölümlerini adlandırmak", "'um' ile saat belirtmek"],
        vocab: [
          w("die", "Uhrzeit", "saat (zaman)", "Uhrzeiten"), w("die", "Stunde", "saat (süre) / ders saati", "Stunden"),
          w("die", "Minute", "dakika", "Minuten"),
          v("Wie spät ist es?", "saat kaç?"), v("Wie viel Uhr ist es?", "saat kaç?"), v("Um wie viel Uhr?", "saat kaçta?"),
          v("Viertel nach", "çeyrek geçe"), v("Viertel vor", "çeyrek kala"), v("halb", "yarım (halb fünf = 4:30)"),
          v("nach", "geçe"), v("vor", "kala"), v("offiziell", "resmi"), v("inoffiziell", "günlük konuşma"),
          w("der", "Morgen", "sabah"), w("der", "Vormittag", "öğleden önce"), w("der", "Mittag", "öğle"),
          w("der", "Nachmittag", "öğleden sonra"), w("der", "Abend", "akşam"), w("die", "Nacht", "gece", "Nächte"),
          v("morgens", "sabahları"), v("vormittags", "öğleden önceleri"), v("mittags", "öğle vakti"),
          v("nachmittags", "öğleden sonraları"), v("abends", "akşamları"), v("nachts", "geceleri"),
          v("früh", "erken"), v("spät", "geç"), v("pünktlich", "dakik / zamanında"),
        ],
        grammar: [
          {
            title: "Saati söylemek: resmi ve günlük",
            body: "Resmi dilde saat ve dakika sayı olarak okunur (24 saat sistemi). Günlük konuşmada 'vor' (kala), 'nach' (geçe), 'Viertel' (çeyrek) ve 'halb' kullanılır. Dikkat: 'halb' bir sonraki saate göre söylenir, yani halb acht = 07:30.",
            tables: [
              { head: "Resmi", rows: [["07:15", "sieben Uhr fünfzehn"], ["16:40", "sechzehn Uhr vierzig"], ["20:05", "zwanzig Uhr fünf"]] },
              { head: "Günlük", rows: [["07:15", "Viertel nach sieben"], ["07:30", "halb acht"], ["07:45", "Viertel vor acht"], ["07:50", "zehn vor acht"], ["07:25", "fünf vor halb acht"], ["07:35", "fünf nach halb acht"]] },
            ],
          },
          {
            title: "Saat kaçta? um + saat",
            body: "'Um wie viel Uhr?' sorusuna 'um' ile cevap verilir. Her gün tekrar eden zamanlar için -s ile biten zarflar kullanılır: morgens, mittags, abends. Bunların yanında 'am Morgen' gibi biçimler de vardır; gece için 'in der Nacht' denir.",
            tables: [
              { head: "Günün bölümleri", rows: [["am Morgen", "morgens"], ["am Vormittag", "vormittags"], ["am Mittag", "mittags"], ["am Nachmittag", "nachmittags"], ["am Abend", "abends"], ["in der Nacht", "nachts"]] },
            ],
          },
        ],
        examples: [
          { de: "Wie spät ist es? – Es ist Viertel nach drei.", tr: "Saat kaç? – Üçü çeyrek geçiyor." },
          { de: "Es ist zehn Uhr dreißig. Es ist halb elf.", tr: "Saat 10:30. (resmi ve günlük söyleniş)" },
          { de: "Der Film beginnt um zwanzig Uhr.", tr: "Film saat yirmide başlıyor." },
          { de: "Um wie viel Uhr isst du zu Mittag? – Um halb eins.", tr: "Öğle yemeğini saat kaçta yersin? – On iki buçukta." },
        ],
        exercises: [
          { t: "mc", q: "'Es ist halb neun.' Saat kaç?", opts: ["9:30", "8:30", "8:45", "9:15"], a: 1 },
          { t: "mc", q: "'Viertel vor sechs' kaç?", opts: ["6:15", "5:45", "5:15", "6:45"], a: 1 },
          { t: "mc", q: "'Um wie viel Uhr?' sorusu neyi sorar?", opts: ["Saat kaç?", "Saat kaçta?", "Kaç dakika?", "Hangi gün?"], a: 1 },
          { t: "mc", q: "'abends' ne demek?", opts: ["sabahları", "öğle vakti", "akşamları", "geceleri"], a: 2 },
          { t: "fill", q: "07:00 (resmi) = sieben ___", a: ["Uhr"] },
          { t: "fill", q: "Es ist zwanzig ___ fünf. (16:40)", a: ["vor"] },
          { t: "fill", q: "08:15 (günlük) = ___ nach acht", a: ["Viertel"] },
          { t: "fill", q: "Ich stehe ___ sieben Uhr auf. (saat kaçta)", a: ["um"] },
          { t: "fill", q: "'Sabahları' = ___", a: ["morgens"] },
          { t: "fill", q: "09:30 (günlük) = ___ zehn", a: ["halb"] },
          { t: "order", words: ["Es", "ist", "Viertel", "vor", "drei"], a: "Es ist Viertel vor drei" },
          { t: "order", words: ["Der", "Unterricht", "beginnt", "um", "acht", "Uhr"], a: "Der Unterricht beginnt um acht Uhr" },
          { t: "order", words: ["Wie", "spät", "ist", "es"], a: "Wie spät ist es" },
        ],
      },
      {
        id: "m4b",
        title: "Was machen sie?",
        tr: "Günlük fiiller: essen, trinken, fahren, schlafen",
        goals: ["Günlük eylemleri anlatmak", "Kök ünlüsü değişen fiiller", "Öğün fiilleri"],
        vocab: [
          v("essen", "yemek yemek"), v("trinken", "içmek"), v("fahren", "gitmek (araçla) / sürmek"),
          v("lesen", "okumak"), v("schlafen", "uyumak"), v("gehen", "gitmek (yürüyerek)"),
          w("das", "Auto", "araba", "Autos"), w("das", "Sandwich", "sandviç", "Sandwiches"),
          w("der", "Kaffee", "kahve"), w("das", "Wasser", "su"), w("der", "Bus", "otobüs", "Busse"),
          w("der", "Zug", "tren", "Züge"), w("das", "Fahrrad", "bisiklet", "Fahrräder"),
          v("zu Mittag essen", "öğle yemeği yemek"), v("zu Abend essen", "akşam yemeği yemek"),
          v("gern", "severek / hoşlanarak"), v("bis", "-e kadar"),
        ],
        grammar: [
          {
            title: "essen, fahren, schlafen",
            body: "Bazı fiillerde kök ünlüsü du ve er/sie/es için değişir: essen (e → i), lesen (e → ie), fahren (a → ä), schlafen (a → ä). 'trinken' ise düzenli çekimlenir: ich trinke, du trinkst, er trinkt.",
            tables: [
              { head: "essen", rows: [["ich", "esse"], ["du", "isst"], ["er/sie/es", "isst"], ["wir", "essen"], ["ihr", "esst"], ["sie/Sie", "essen"]] },
              { head: "fahren", rows: [["ich", "fahre"], ["du", "fährst"], ["er/sie/es", "fährt"], ["wir", "fahren"], ["ihr", "fahrt"], ["sie/Sie", "fahren"]] },
              { head: "schlafen", rows: [["ich", "schlafe"], ["du", "schläfst"], ["er/sie/es", "schläft"], ["wir", "schlafen"], ["ihr", "schlaft"], ["sie/Sie", "schlafen"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich esse mittags einen Apfel.", tr: "Öğlenleri bir elma yerim." },
          { de: "Du isst gern Suppe.", tr: "Çorba yemeyi seversin." },
          { de: "Er fährt mit dem Bus nach Hause.", tr: "O otobüsle eve gidiyor." },
          { de: "Sie schläft bis sieben Uhr.", tr: "O saat yediye kadar uyuyor." },
          { de: "Wir trinken abends Tee.", tr: "Akşamları çay içeriz." },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ einen Apfel. (essen)", a: ["esse"] },
          { t: "fill", q: "Du ___ eine Suppe. (essen)", a: ["isst"] },
          { t: "fill", q: "Er ___ Tee. (trinken)", a: ["trinkt"] },
          { t: "fill", q: "Sie ___ nach Hause. (fahren)", a: ["fährt", "faehrt"] },
          { t: "fill", q: "Du ___ sehr lange. (schlafen)", a: ["schläfst", "schlaefst"] },
          { t: "fill", q: "Er ___ ein Buch. (lesen)", a: ["liest"] },
          { t: "fill", q: "Wir ___ gern Brot. (essen)", a: ["essen"] },
          { t: "mc", q: "'fahren' fiilinde du için doğru biçim hangisi?", opts: ["fahrst", "fährst", "fahrt", "fährt"], a: 1 },
          { t: "mc", q: "'Ich ___ gern Pizza.' Hangisi doğru?", opts: ["isst", "esse", "esst", "essen"], a: 1 },
          { t: "order", words: ["Ich", "trinke", "gern", "Tee"], a: "Ich trinke gern Tee" },
          { t: "order", words: ["Er", "isst", "ein", "Sandwich"], a: "Er isst ein Sandwich" },
          { t: "order", words: ["Sie", "schläft", "bis", "acht", "Uhr"], a: "Sie schläft bis acht Uhr" },
        ],
      },
      {
        id: "m4c",
        title: "Mein Tagesablauf",
        tr: "Günlük rutin ve ayrılabilir fiiller",
        goals: ["Günlük rutini anlatmak", "Ayrılabilir fiilleri kullanmak", "Wohin? ile yön bildirmek"],
        vocab: [
          v("aufstehen", "kalkmak"), v("aufwachen", "uyanmak"), v("frühstücken", "kahvaltı etmek"),
          v("anziehen", "giymek"), v("anfangen", "başlamak"), v("ankommen", "varmak"),
          v("anrufen", "telefon etmek"), v("fernsehen", "televizyon izlemek"), v("einkaufen", "alışveriş yapmak"),
          v("aufräumen", "toplamak / düzenlemek"), v("Zähne putzen", "diş fırçalamak"),
          v("ins Bett gehen", "yatmaya gitmek"), v("nach Hause kommen", "eve gelmek"),
          w("das", "Kino", "sinema", "Kinos"), w("das", "Bett", "yatak", "Betten"), w("das", "Zimmer", "oda", "Zimmer"),
          w("das", "Wochenende", "hafta sonu", "Wochenenden"),
          v("Wohin?", "nereye?"), v("zu Hause", "evde"), v("nach Hause", "eve"),
          v("zuerst", "önce"), v("dann", "sonra"), v("danach", "ondan sonra"),
          v("samstags", "cumartesi günleri"), v("sonntags", "pazar günleri"),
        ],
        grammar: [
          {
            title: "Ayrılabilir fiiller",
            body: "Bazı fiillerin ön eki (auf-, an-, fern-, ein-, mit-, zu-) cümlede fiilden ayrılır ve cümlenin sonuna gider. Çekimli fiil ikinci sırada kalır. Mastarda (sözlükte) fiil tek parçadır: aufstehen, ama 'Ich stehe um sieben Uhr auf.'",
            tables: [
              { head: "aufstehen", rows: [["ich", "stehe ... auf"], ["du", "stehst ... auf"], ["er/sie/es", "steht ... auf"], ["wir", "stehen ... auf"], ["ihr", "steht ... auf"], ["sie/Sie", "stehen ... auf"]] },
              { head: "anrufen", rows: [["ich", "rufe ... an"], ["du", "rufst ... an"], ["er/sie/es", "ruft ... an"]] },
            ],
          },
          {
            title: "Wohin? (nereye?)",
            body: "'gehen' ve 'kommen' fiilleriyle gidilen yer sorulurken 'Wohin?' kullanılır. Okul için 'in die Schule', sinema için 'ins (in das) Kino', ev için artikelsiz 'nach Hause' denir.",
            tables: [
              { head: "Wohin?", rows: [["in die Schule", "okula"], ["ins Kino", "sinemaya"], ["nach Hause", "eve"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich wache um sechs Uhr auf.", tr: "Saat altıda uyanıyorum." },
          { de: "Dann ziehe ich meine Jacke an.", tr: "Sonra montumu giyiyorum." },
          { de: "Der Unterricht fängt um acht Uhr an.", tr: "Ders saat sekizde başlıyor." },
          { de: "Abends rufe ich meine Oma an.", tr: "Akşamları büyükannemi arıyorum." },
          { de: "Am Samstag gehe ich ins Kino.", tr: "Cumartesi sinemaya gidiyorum." },
          { de: "Ich komme um drei Uhr nach Hause.", tr: "Saat üçte eve geliyorum." },
        ],
        exercises: [
          { t: "fill", q: "Ich stehe um sieben Uhr ___. (aufstehen)", a: ["auf"] },
          { t: "fill", q: "Er ___ um sechs Uhr auf. (aufstehen)", a: ["steht"] },
          { t: "fill", q: "Der Film fängt um acht Uhr ___. (anfangen)", a: ["an"] },
          { t: "fill", q: "Sie ruft ihre Freundin ___. (anrufen)", a: ["an"] },
          { t: "fill", q: "Wir sehen abends ___. (fernsehen)", a: ["fern"] },
          { t: "fill", q: "Ich kaufe am Samstag ___. (einkaufen)", a: ["ein"] },
          { t: "fill", q: "Wohin gehst du? – Ich gehe ___ Hause.", a: ["nach"] },
          { t: "fill", q: "Wir gehen ___ Kino. (in + das)", a: ["ins"] },
          { t: "mc", q: "'Wohin?' sorusu neyi sorar?", opts: ["Nereye?", "Nerede?", "Ne zaman?", "Kim?"], a: 0 },
          { t: "mc", q: "'zuerst' ne demek?", opts: ["Sonra", "Önce", "Hiç", "Bazen"], a: 1 },
          { t: "order", words: ["Ich", "stehe", "um", "sechs", "Uhr", "auf"], a: "Ich stehe um sechs Uhr auf" },
          { t: "order", words: ["Wir", "gehen", "ins", "Kino"], a: "Wir gehen ins Kino" },
          { t: "order", words: ["Er", "ruft", "seinen", "Freund", "an"], a: "Er ruft seinen Freund an" },
          { t: "order", words: ["Sie", "kommt", "um", "fünf", "Uhr", "nach", "Hause"], a: "Sie kommt um fünf Uhr nach Hause" },
        ],
      },
      {
        id: "m4d",
        title: "Ich muss ...",
        tr: "müssen ve hafta sonu planları",
        goals: ["Zorunluluk bildirmek (müssen)", "Davet etmek ve cevap vermek", "Hafta sonu planlarını anlatmak"],
        vocab: [
          v("müssen", "zorunda olmak"), v("Zeit haben", "zamanı olmak"), v("leider", "maalesef"),
          v("treffen", "buluşmak"), v("dauern", "sürmek"), v("schaffen", "yetiştirmek / başarmak"),
          v("mitkommen", "birlikte gelmek"), v("Na gut", "peki, tamam"),
          w("der", "Film", "film", "Filme"), w("der", "Kurs", "kurs", "Kurse"), w("der", "Besuch", "ziyaret / misafir"),
          w("der", "Freund", "arkadaş (erkek)", "Freunde", "Freundin"),
          v("aber", "ama"), v("auch", "de / da"), v("schon", "zaten / bile"),
        ],
        grammar: [
          {
            title: "Modal fiil: müssen",
            body: "'müssen' (zorunda olmak) çekimli halde cümlede ikinci sırada durur, asıl fiil mastar olarak cümlenin sonuna gider. Ayrılabilir fiiller de mastarda tek parça olur: 'Ich muss früh aufstehen.' 'ich' ve 'er/sie/es' için biçim aynıdır: muss.",
            tables: [
              { head: "müssen", rows: [["ich", "muss"], ["du", "musst"], ["er/sie/es", "muss"], ["wir", "müssen"], ["ihr", "müsst"], ["sie/Sie", "müssen"]] },
            ],
          },
        ],
        examples: [
          { de: "Am Samstag muss ich Mathe lernen.", tr: "Cumartesi matematik çalışmak zorundayım." },
          { de: "Kommst du mit ins Kino? – Leider nicht, ich muss mein Zimmer aufräumen.", tr: "Sinemaya geliyor musun? – Maalesef hayır, odamı toplamak zorundayım." },
          { de: "Wir müssen um acht Uhr in der Schule sein.", tr: "Saat sekizde okulda olmak zorundayız." },
          { de: "Der Kurs dauert zwei Stunden.", tr: "Kurs iki saat sürüyor." },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ morgen früh aufstehen. (müssen)", a: ["muss"] },
          { t: "fill", q: "Du ___ Mathe lernen. (müssen)", a: ["musst"] },
          { t: "fill", q: "Sie (tek kişi) ___ ihr Zimmer aufräumen. (müssen)", a: ["muss"] },
          { t: "fill", q: "Wir ___ um acht Uhr in die Schule gehen. (müssen)", a: ["müssen", "muessen"] },
          { t: "fill", q: "Ihr ___ pünktlich sein. (müssen)", a: ["müsst", "muesst"] },
          { t: "mc", q: "'Ich ___ lernen.' Hangisi doğru?", opts: ["muss", "musst", "müsst", "müssen"], a: 0 },
          { t: "mc", q: "'leider' ne demek?", opts: ["Tabii ki", "Maalesef", "Belki", "Sonra"], a: 1 },
          { t: "order", words: ["Ich", "muss", "Hausaufgaben", "machen"], a: "Ich muss Hausaufgaben machen" },
          { t: "order", words: ["Am", "Samstag", "muss", "ich", "lernen"], a: "Am Samstag muss ich lernen" },
          { t: "order", words: ["Er", "muss", "früh", "aufstehen"], a: "Er muss früh aufstehen" },
        ],
      },
      {
        id: "m4e",
        title: "Im Café",
        tr: "Kafede sipariş",
        goals: ["Yiyecek ve içecek adları", "möchten ile sipariş vermek", "mit / ohne / oder"],
        vocab: [
          w("das", "Café", "kafe", "Cafés"), w("die", "Speisekarte", "menü", "Speisekarten"),
          w("das", "Getränk", "içecek", "Getränke"), w("das", "Gericht", "yemek (tabak)", "Gerichte"),
          w("die", "Suppe", "çorba", "Suppen"), w("das", "Schnitzel", "şnitzel", "Schnitzel"),
          w("die", "Pommes", "patates kızartması"), w("das", "Steak", "biftek", "Steaks"),
          w("der", "Reis", "pirinç"), w("der", "Salat", "salata", "Salate"), w("das", "Dessert", "tatlı", "Desserts"),
          w("der", "Kuchen", "pasta / kek", "Kuchen"), w("der", "Tee", "çay"), w("der", "Saft", "meyve suyu", "Säfte"),
          w("die", "Limonade", "limonata", "Limonaden"), w("das", "Mineralwasser", "maden suyu"),
          w("das", "Glas", "bardak", "Gläser"), w("die", "Tasse", "fincan", "Tassen"),
          w("der", "Zucker", "şeker"), w("die", "Milch", "süt"), w("die", "Rechnung", "hesap", "Rechnungen"),
          v("möchten", "istemek (nazik)"), v("bestellen", "sipariş vermek"), v("nehmen", "almak"), v("zahlen", "ödemek"),
          v("mit", "-li / ile"), v("ohne", "-siz"), v("oder", "veya"), v("lecker", "lezzetli"),
          v("Bitte schön", "buyurun"), v("Guten Appetit!", "afiyet olsun"), v("Was darf es sein?", "ne arzu edersiniz?"),
        ],
        grammar: [
          {
            title: "möchten ve nehmen",
            body: "'Ich möchte ...' sipariş vermenin nazik yoludur. Eril isimlerde Modül 3'teki gibi Akkusativ kullanılır: ich möchte einen Tee (der), eine Suppe (die), ein Eis (das). Fiil ikinci sırada, istenen şey ise genelde sonda durur.",
            tables: [
              { head: "möchten", rows: [["ich", "möchte"], ["du", "möchtest"], ["er/sie/es", "möchte"], ["wir", "möchten"], ["ihr", "möchtet"], ["sie/Sie", "möchten"]] },
              { head: "nehmen", rows: [["ich", "nehme"], ["du", "nimmst"], ["er/sie/es", "nimmt"], ["wir", "nehmen"], ["ihr", "nehmt"], ["sie/Sie", "nehmen"]] },
            ],
          },
          {
            title: "mit, ohne, oder",
            body: "'mit' (-li) ve 'ohne' (-siz) sonrasında genellikle artikel kullanılmaz: mit Zucker, ohne Milch. 'oder' iki seçeneği bağlar: Tee oder Kaffee?",
            tables: [],
          },
        ],
        examples: [
          { de: "Ich möchte einen Tee mit Zitrone.", tr: "Limonlu bir çay istiyorum." },
          { de: "Möchtest du eine Suppe oder einen Salat?", tr: "Çorba mı yoksa salata mı istersin?" },
          { de: "Er trinkt seinen Kaffee ohne Zucker.", tr: "O kahvesini şekersiz içiyor." },
          { de: "Wir möchten bitte zahlen.", tr: "Hesabı istiyoruz lütfen." },
          { de: "Möchten Sie noch etwas trinken?", tr: "Başka bir şey içmek ister misiniz?" },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ einen Tee. (möchten)", a: ["möchte", "moechte"] },
          { t: "fill", q: "Du ___ eine Suppe. (möchten)", a: ["möchtest", "moechtest"] },
          { t: "fill", q: "Wir ___ bestellen. (möchten)", a: ["möchten", "moechten"] },
          { t: "fill", q: "Ich möchte einen Kaffee ___ Zucker. (-siz)", a: ["ohne"] },
          { t: "fill", q: "Tee ___ Kaffee? (veya)", a: ["oder"] },
          { t: "fill", q: "Ich möchte ___ Limonade. (ein/eine/einen)", a: ["eine"] },
          { t: "fill", q: "Ich möchte ___ Tee. (ein/eine/einen)", a: ["einen"] },
          { t: "fill", q: "Ich möchte ___ Steak. (ein/eine/einen)", a: ["ein"] },
          { t: "mc", q: "Garsona hesabı istemek için ne dersin?", opts: ["Wir möchten zahlen, bitte.", "Wir möchten kochen, bitte.", "Wir möchten lesen, bitte.", "Wir möchten schlafen, bitte."], a: 0 },
          { t: "mc", q: "'Guten Appetit!' ne zaman söylenir?", opts: ["Yemek servis edilirken", "Vedalaşırken", "Selamlaşırken", "Teşekkür ederken"], a: 0 },
          { t: "order", words: ["Ich", "möchte", "einen", "Tee", "ohne", "Zucker"], a: "Ich möchte einen Tee ohne Zucker" },
          { t: "order", words: ["Was", "möchten", "Sie", "trinken"], a: "Was möchten Sie trinken" },
          { t: "order", words: ["Möchtest", "du", "Tee", "oder", "Kaffee"], a: "Möchtest du Tee oder Kaffee" },
        ],
      },
    ],
  },
  {
    id: "M5",
    title: "Essen und Trinken",
    tr: "Yeme içme",
    lessons: [
      {
        id: "m5a",
        title: "Obst und Gemüse",
        tr: "Meyve, sebze ve çoğul",
        goals: ["Meyve ve sebze adları (tekil / çoğul)", "Sevdiğini söylemek: mögen ve gern", "kein / keine ile olumsuzluk"],
        vocab: [
          w("das", "Obst", "meyve (genel)"), w("das", "Gemüse", "sebze (genel)"),
          w("die", "Gurke", "salatalık", "Gurken"), w("die", "Orange", "portakal", "Orangen"),
          w("die", "Kartoffel", "patates", "Kartoffeln"), w("die", "Bohne", "fasulye", "Bohnen"),
          w("der", "Blumenkohl", "karnabahar"), w("die", "Zwiebel", "soğan", "Zwiebeln"),
          w("der", "Apfel", "elma", "Äpfel"), w("die", "Aprikose", "kayısı", "Aprikosen"),
          w("die", "Birne", "armut", "Birnen"), w("die", "Wassermelone", "karpuz", "Wassermelonen"),
          w("die", "Erbse", "bezelye", "Erbsen"), w("die", "Tomate", "domates", "Tomaten"),
          w("die", "Kirsche", "kiraz", "Kirschen"), w("die", "Aubergine", "patlıcan", "Auberginen"),
          w("die", "Banane", "muz", "Bananen"), w("die", "Erdbeere", "çilek", "Erdbeeren"),
          w("die", "Traube", "üzüm (tane)", "Trauben"), w("der", "Brokkoli", "brokoli"),
          w("das", "Fleisch", "et"), w("der", "Fisch", "balık", "Fische"), w("das", "Ei", "yumurta", "Eier"),
        ],
        grammar: [
          {
            title: "Çoğul: meyve ve sebzeler",
            body: "Çoğulda artikel her zaman 'die' olur. Meyve-sebze adlarının çoğu -n veya -en alır. Bazılarında ünlü değişir: Apfel → Äpfel. Çoğulda 'ein' kullanılmaz; olumsuzda 'keine' kullanılır: Das sind keine Birnen.",
            tables: [
              { head: "Çoğul", rows: [["die Banane", "die Bananen"], ["die Tomate", "die Tomaten"], ["die Kartoffel", "die Kartoffeln"], ["der Apfel", "die Äpfel"], ["die Erdbeere", "die Erdbeeren"]] },
            ],
          },
          {
            title: "mögen ve gern",
            body: "Sevdiğin şeyi iki yolla söyleyebilirsin: 'Ich mag Bananen.' veya 'Ich esse gern Bananen.' Olumsuzda 'Ich mag keine Bananen.' veya 'Ich esse nicht gern Fisch.' 'aber' (ama) iki cümleyi karşılaştırmak için kullanılır.",
            tables: [
              { head: "mögen", rows: [["ich", "mag"], ["du", "magst"], ["er/sie/es", "mag"], ["wir", "mögen"], ["ihr", "mögt"], ["sie/Sie", "mögen"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich esse gern Erdbeeren, aber keine Kirschen.", tr: "Çilek yemeyi severim ama kiraz yemem." },
          { de: "Magst du Auberginen? – Nein, ich mag keine Auberginen.", tr: "Patlıcanı sever misin? – Hayır, patlıcan sevmem." },
          { de: "Das sind Tomaten. Das ist eine Gurke.", tr: "Bunlar domates. Bu bir salatalık." },
          { de: "Was isst du gern? – Ich esse gern Obst.", tr: "Ne yemeyi seversin? – Meyve yemeyi severim." },
        ],
        exercises: [
          { t: "fill", q: "die Banane → die ___", a: ["Bananen"] },
          { t: "fill", q: "der Apfel → die ___", a: ["Äpfel", "Aepfel"] },
          { t: "fill", q: "die Tomate → die ___", a: ["Tomaten"] },
          { t: "fill", q: "die Kartoffel → die ___", a: ["Kartoffeln"] },
          { t: "fill", q: "Ich ___ Erdbeeren. (mögen)", a: ["mag"] },
          { t: "fill", q: "Du ___ keine Zwiebeln. (mögen)", a: ["magst"] },
          { t: "fill", q: "Wir ___ Birnen. (mögen)", a: ["mögen", "moegen"] },
          { t: "fill", q: "Ich mag ___ Bohnen. (olumsuz)", a: ["keine"] },
          { t: "fill", q: "Ich esse nicht ___ Fisch. (severek)", a: ["gern"] },
          { t: "mc", q: "Hangisi sebzedir?", opts: ["die Kirsche", "die Gurke", "die Birne", "die Banane"], a: 1 },
          { t: "mc", q: "Hangisi meyvedir?", opts: ["die Zwiebel", "die Erbse", "die Wassermelone", "die Bohne"], a: 2 },
          { t: "order", words: ["Ich", "esse", "gern", "Äpfel"], a: "Ich esse gern Äpfel" },
          { t: "order", words: ["Ich", "mag", "keine", "Zwiebeln"], a: "Ich mag keine Zwiebeln" },
        ],
      },
      {
        id: "m5b",
        title: "Was essen Sie wann?",
        tr: "Öğünler ve yemek alışkanlıkları",
        goals: ["Öğün adları", "zum Frühstück / zu Mittag / zu Abend", "Alışkanlıkları anlatmak"],
        vocab: [
          w("das", "Frühstück", "kahvaltı", "Frühstücke"), w("das", "Mittagessen", "öğle yemeği", "Mittagessen"),
          w("das", "Abendessen", "akşam yemeği", "Abendessen"),
          w("das", "Brot", "ekmek", "Brote"), w("das", "Brötchen", "küçük ekmek", "Brötchen"),
          w("das", "Butterbrot", "tereyağlı ekmek", "Butterbrote"), w("die", "Marmelade", "reçel", "Marmeladen"),
          w("der", "Käse", "peynir"), w("der", "Honig", "bal"), w("die", "Wurst", "sosis / sucuk", "Würste"),
          w("das", "Müsli", "müsli"), w("das", "Hähnchen", "tavuk", "Hähnchen"), w("der", "Joghurt", "yoğurt"),
          v("gesund", "sağlıklı"), v("ungesund", "sağlıksız"),
          v("zum Frühstück", "kahvaltıda"), v("zu Mittag", "öğle yemeğinde"), v("zu Abend", "akşam yemeğinde"),
        ],
        grammar: [
          {
            title: "Öğünler: zum Frühstück, zu Mittag, zu Abend",
            body: "'Ne zaman? Hangi öğünde?' için 'zu' kullanılır. 'das Frühstück' ile 'zum Frühstück' (zu + dem) denir. Öğle ve akşam yemeği için artikelsiz 'zu Mittag' ve 'zu Abend' kullanılır. Günün bölümleri (morgens, mittags, abends) de aynı fikri verir.",
            tables: [
              { head: "Öğünler", rows: [["das Frühstück", "zum Frühstück"], ["das Mittagessen", "zu Mittag"], ["das Abendessen", "zu Abend"]] },
            ],
          },
        ],
        examples: [
          { de: "Zum Frühstück esse ich Brot mit Käse und Honig.", tr: "Kahvaltıda bal ve peynirli ekmek yerim." },
          { de: "Mittags esse ich gern Suppe.", tr: "Öğlenleri çorba yemeyi severim." },
          { de: "Zu Abend trinke ich Tee.", tr: "Akşam yemeğinde çay içerim." },
          { de: "Was isst du zum Frühstück? – Ein Ei und ein Brötchen.", tr: "Kahvaltıda ne yersin? – Bir yumurta ve bir sandviç ekmeği." },
        ],
        exercises: [
          { t: "fill", q: "___ Frühstück esse ich Brot. (kahvaltıda)", a: ["Zum"] },
          { t: "fill", q: "Zu ___ esse ich Suppe. (öğle)", a: ["Mittag"] },
          { t: "fill", q: "Was trinkst du ___ Frühstück?", a: ["zum"] },
          { t: "fill", q: "Zu ___ esse ich nur Salat. (akşam)", a: ["Abend"] },
          { t: "mc", q: "'gesund' ne demek?", opts: ["Lezzetli", "Sağlıklı", "Taze", "Pahalı"], a: 1 },
          { t: "mc", q: "'Das Butterbrot' nedir?", opts: ["Tereyağlı ekmek", "Çorba", "Süt", "Kuru fasulye"], a: 0 },
          { t: "order", words: ["Zum", "Frühstück", "trinke", "ich", "Tee"], a: "Zum Frühstück trinke ich Tee" },
          { t: "order", words: ["Ich", "esse", "mittags", "gern", "Suppe"], a: "Ich esse mittags gern Suppe" },
          { t: "order", words: ["Was", "isst", "du", "zu", "Abend"], a: "Was isst du zu Abend" },
        ],
      },
      {
        id: "m5c",
        title: "Mengen und Preise",
        tr: "Miktar ve fiyatlar",
        goals: ["Miktar belirtmek", "Fiyat söylemek ve sormak", "Alışverişte konuşmak"],
        vocab: [
          w("das", "Kilo", "kilo"), w("das", "Pfund", "500 gram (yarım kilo)", "Pfunde"), w("das", "Gramm", "gram"),
          w("das", "Stück", "adet / parça", "Stücke"), w("die", "Packung", "paket", "Packungen"),
          w("die", "Dose", "teneke kutu / konserve", "Dosen"), w("die", "Flasche", "şişe", "Flaschen"),
          w("das", "Bund", "demet", "Bunde"), w("der", "Euro", "euro", "Euros"), w("der", "Cent", "sent", "Cents"),
          w("der", "Preis", "fiyat", "Preise"), w("das", "Angebot", "kampanya / teklif", "Angebote"),
          v("kosten", "fiyatı olmak"), v("kaufen", "satın almak"), v("frisch", "taze"),
          v("billig", "ucuz"), v("teuer", "pahalı"), v("insgesamt", "toplam"),
          v("Wie viel kostet das?", "bu ne kadar?"), v("Sonst noch etwas?", "başka bir şey?"),
          v("Ist das alles?", "hepsi bu mu?"), v("Das ist alles.", "hepsi bu."),
        ],
        grammar: [
          {
            title: "Fiyatlar",
            body: "Euro ve cent arası okunurken 'Komma' söylenmez: 2,20 € = zwei Euro zwanzig. Tek bir şey için 'kostet', birden fazla şey için 'kosten' kullanılır: Wie viel kostet das Brot? Wie viel kosten die Tomaten?",
            tables: [
              { head: "Fiyat söyleme", rows: [["1,00 €", "ein Euro"], ["2,20 €", "zwei Euro zwanzig"], ["3,50 €", "drei Euro fünfzig"], ["0,65 €", "fünfundsechzig Cent"]] },
            ],
          },
          {
            title: "Miktar belirtmek",
            body: "Miktar kelimelerinden sonra artikel kullanılmaz. Kilo ve Gramm çoğulda eklenmez: zwei Kilo Äpfel, hundert Gramm Käse. Diğer kaplar çoğul olur: zwei Flaschen Wasser, drei Dosen Mais.",
            tables: [
              { head: "Miktarlar", rows: [["1 kg", "ein Kilo"], ["500 g", "ein Pfund"], ["100 g", "hundert Gramm"], ["1 demet", "ein Bund"], ["2 şişe", "zwei Flaschen"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich möchte bitte ein Kilo Äpfel und eine Flasche Wasser.", tr: "Bir kilo elma ve bir şişe su istiyorum lütfen." },
          { de: "Wie viel kosten die Bananen? – Sie kosten 1 Euro 80.", tr: "Muzlar ne kadar? – 1 euro 80 cent." },
          { de: "Zwei Packungen Reis, bitte.", tr: "İki paket pirinç lütfen." },
          { de: "Insgesamt kostet das sieben Euro fünfzig.", tr: "Toplam yedi euro elli cent." },
        ],
        exercises: [
          { t: "fill", q: "2,50 € = zwei Euro ___", a: ["fünfzig", "fuenfzig"] },
          { t: "fill", q: "0,90 € = neunzig ___", a: ["Cent"] },
          { t: "fill", q: "Ich möchte ein ___ Äpfel. (1 kg)", a: ["Kilo"] },
          { t: "fill", q: "Eine ___ Wasser, bitte. (şişe)", a: ["Flasche"] },
          { t: "fill", q: "Wie viel ___ die Tomaten? (kosten)", a: ["kosten"] },
          { t: "fill", q: "Wie viel ___ das Brot? (kosten)", a: ["kostet"] },
          { t: "mc", q: "Ein Pfund kaç gramdır?", opts: ["100 g", "250 g", "500 g", "1000 g"], a: 2 },
          { t: "mc", q: "'Sonst noch etwas?' ne demek?", opts: ["Başka bir şey?", "Ne kadar?", "Hepsi bu", "Taze mi?"], a: 0 },
          { t: "mc", q: "'billig' ne demek?", opts: ["Pahalı", "Ucuz", "Taze", "Büyük"], a: 1 },
          { t: "order", words: ["Wie", "viel", "kostet", "das", "Brot"], a: "Wie viel kostet das Brot" },
          { t: "order", words: ["Ich", "möchte", "ein", "Kilo", "Tomaten"], a: "Ich möchte ein Kilo Tomaten" },
        ],
      },
      {
        id: "m5d",
        title: "Die Einkaufsliste",
        tr: "Alışveriş listesi: brauchen, haben, kein",
        goals: ["Neye ihtiyacın olduğunu söylemek", "Evde ne olmadığını belirtmek", "Alışveriş listesi yazmak"],
        vocab: [
          v("brauchen", "ihtiyacı olmak"), v("schreiben", "yazmak"), v("kochen", "pişirmek"),
          w("die", "Einkaufsliste", "alışveriş listesi", "Einkaufslisten"),
          w("das", "Lebensmittel", "gıda maddesi", "Lebensmittel"), w("das", "Hackfleisch", "kıyma"),
          w("das", "Olivenöl", "zeytinyağı"), w("die", "Olive", "zeytin", "Oliven"),
          w("die", "Nudel", "makarna (tek tane)", "Nudeln"), w("das", "Mehl", "un"),
          v("genug", "yeterli"), v("noch", "daha / hâlâ"), v("also", "yani / o halde"), v("genau", "tam öyle"),
          v("Haben wir ...?", "elimizde ... var mı?"), v("Wir brauchen ...", "bize ... lazım"),
        ],
        grammar: [
          {
            title: "brauchen ve kein-",
            body: "'brauchen' (ihtiyacı olmak) düzenli bir fiildir ve 'haben' gibi Akkusativ alır. Olumsuz için 'kein' kullanılır: eril isimde keinen, dişilde keine, nötrde kein, çoğulda keine. Örnek: Wir haben keinen Reis, keine Milch, kein Brot, keine Eier.",
            tables: [
              { head: "brauchen", rows: [["ich", "brauche"], ["du", "brauchst"], ["er/sie/es", "braucht"], ["wir", "brauchen"], ["ihr", "braucht"], ["sie/Sie", "brauchen"]] },
              { head: "kein- (Akkusativ)", rows: [["der", "keinen Reis"], ["die", "keine Milch"], ["das", "kein Brot"], ["die (Pl.)", "keine Eier"]] },
            ],
          },
        ],
        examples: [
          { de: "Wir brauchen ein Kilo Tomaten und zehn Eier.", tr: "Bize bir kilo domates ve on yumurta lazım." },
          { de: "Haben wir noch Käse? – Nein, wir haben keinen Käse.", tr: "Hâlâ peynirimiz var mı? – Hayır, peynirimiz yok." },
          { de: "Wir haben kein Brot und keine Milch.", tr: "Ekmeğimiz ve sütümüz yok." },
          { de: "Ich schreibe eine Einkaufsliste.", tr: "Bir alışveriş listesi yazıyorum." },
        ],
        exercises: [
          { t: "fill", q: "Wir brauchen ___ Reis. (olumsuz, der)", a: ["keinen"] },
          { t: "fill", q: "Wir haben ___ Milch. (olumsuz, die)", a: ["keine"] },
          { t: "fill", q: "Wir haben ___ Brot. (olumsuz, das)", a: ["kein"] },
          { t: "fill", q: "Wir haben ___ Eier. (olumsuz, çoğul)", a: ["keine"] },
          { t: "fill", q: "Ich ___ ein Kilo Äpfel. (brauchen)", a: ["brauche"] },
          { t: "fill", q: "Du ___ zehn Eier. (brauchen)", a: ["brauchst"] },
          { t: "mc", q: "'Haben wir noch Milch?' sorusunun olumsuz cevabı hangisi?", opts: ["Nein, wir haben keine Milch.", "Nein, wir haben kein Milch.", "Nein, wir haben keinen Milch.", "Nein, wir haben nicht Milch."], a: 0 },
          { t: "order", words: ["Wir", "brauchen", "ein", "Kilo", "Käse"], a: "Wir brauchen ein Kilo Käse" },
          { t: "order", words: ["Haben", "wir", "noch", "Milch"], a: "Haben wir noch Milch" },
          { t: "order", words: ["Wir", "haben", "kein", "Brot"], a: "Wir haben kein Brot" },
        ],
      },
      {
        id: "m5e",
        title: "Rezepte",
        tr: "Tarifler ve mutfak fiilleri",
        goals: ["Malzemeleri saymak", "Mutfak fiillerini kullanmak", "Bir tarifi adım adım anlatmak"],
        vocab: [
          w("das", "Rezept", "tarif", "Rezepte"), w("die", "Zutat", "malzeme", "Zutaten"),
          w("das", "Salz", "tuz"), w("die", "Butter", "tereyağı"), w("die", "Prise", "tutam", "Prisen"),
          w("der", "Esslöffel", "yemek kaşığı", "Esslöffel"), w("der", "Teelöffel", "çay kaşığı", "Teelöffel"),
          w("die", "Schüssel", "kase", "Schüsseln"), w("die", "Pfanne", "tava", "Pfannen"),
          w("der", "Topf", "tencere", "Töpfe"), w("der", "Herd", "ocak", "Herde"), w("der", "Teig", "hamur"),
          w("der", "Pfannkuchen", "krep / pankek", "Pfannkuchen"),
          v("mischen", "karıştırmak"), v("rühren", "(kaşıkla) karıştırmak"), v("schneiden", "kesmek"),
          v("schälen", "soymak"), v("servieren", "servis etmek"), v("backen", "fırında pişirmek"),
          v("zugeben", "eklemek"), v("einschalten", "açmak (cihaz)"), v("vorbereiten", "hazırlamak"), v("geben", "vermek / koymak"),
          v("zuerst", "önce"), v("dann", "sonra"), v("danach", "ondan sonra"), v("zum Schluss", "en sonunda"),
        ],
        grammar: [
          {
            title: "Bir tarifi anlatmak",
            body: "Tarifi 'ich' ile anlatırken sırayı 'zuerst, dann, danach, zum Schluss' ile veririz. Bu kelimeler cümlenin başına gelince fiil yine ikinci sırada kalır ve özne fiilden sonra gelir: 'Dann gebe ich Mehl in die Schüssel.' Ayrılabilir fiiller (zugeben, einschalten, vorbereiten) ön ekini cümle sonuna bırakır.",
            tables: [
              { head: "Sıralama", rows: [["zuerst", "önce"], ["dann", "sonra"], ["danach", "ondan sonra"], ["zum Schluss", "en sonunda"]] },
              { head: "geben", rows: [["ich", "gebe"], ["du", "gibst"], ["er/sie/es", "gibt"], ["wir", "geben"], ["ihr", "gebt"], ["sie/Sie", "geben"]] },
            ],
          },
        ],
        examples: [
          { de: "Zuerst gebe ich das Mehl in eine Schüssel.", tr: "Önce unu bir kaseye koyuyorum." },
          { de: "Dann schneide ich die Zwiebel.", tr: "Sonra soğanı doğruyorum." },
          { de: "Danach rühre ich den Teig.", tr: "Ardından hamuru karıştırıyorum." },
          { de: "Zum Schluss serviere ich den Pfannkuchen mit Honig.", tr: "En sonunda pankeki balla servis ediyorum." },
        ],
        exercises: [
          { t: "mc", q: "'schälen' ne demek?", opts: ["Kesmek", "Soymak", "Karıştırmak", "Servis etmek"], a: 1 },
          { t: "mc", q: "'zum Schluss' ne demek?", opts: ["En sonunda", "Önce", "Sonra", "Bazen"], a: 0 },
          { t: "fill", q: "Zuerst ___ ich die Zwiebel. (schneiden)", a: ["schneide"] },
          { t: "fill", q: "Dann ___ ich den Teig. (rühren)", a: ["rühre", "ruehre"] },
          { t: "fill", q: "Ich gebe Salz ___. (zugeben)", a: ["zu"] },
          { t: "fill", q: "Ich schalte den Herd ___. (einschalten)", a: ["ein"] },
          { t: "fill", q: "___ Schluss serviere ich den Salat.", a: ["Zum"] },
          { t: "fill", q: "Ich ___ die Butter in die Pfanne. (geben)", a: ["gebe"] },
          { t: "order", words: ["Zuerst", "schäle", "ich", "die", "Kartoffeln"], a: "Zuerst schäle ich die Kartoffeln" },
          { t: "order", words: ["Dann", "gebe", "ich", "Mehl", "in", "die", "Schüssel"], a: "Dann gebe ich Mehl in die Schüssel" },
          { t: "order", words: ["Danach", "koche", "ich", "die", "Suppe"], a: "Danach koche ich die Suppe" },
        ],
      },
    ],
  },
];

// ---- Yardımcılar ----

export const displayWord = (e) => (e.art ? e.art + " " + e.de : e.de) + (e.fem ? " / die " + e.fem : "");
export const wordKey = (e) => (e.art ? e.art + " " + e.de : e.de);

// Mevcut flashcard / quiz / liste ekranlarının kullandığı biçim: { word, turkish, example, level, lang }
export const DE_LIBRARY = Object.fromEntries(
  DE_MODULES.map((m) => [
    m.id,
    m.lessons.flatMap((l) =>
      l.vocab.map((e) => ({ word: wordKey(e), turkish: e.tr, example: "", level: m.id, lang: "de", lesson: l.id }))
    ),
  ])
);

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Bir ders için pratik soruları: elle yazılanlar + kelimelerden otomatik üretilenler
export function buildPractice(lesson, count = 12) {
  const items = [...lesson.exercises];
  // Aynı yazılışın farklı artikelleri olan kelimeler (der/die Deutsche gibi) belirsiz olur, atla
  const nouns = lesson.vocab.filter((e) => e.art && lesson.vocab.filter((o) => o.de === e.de).length === 1);
  shuffle(nouns).slice(0, 4).forEach((e) => {
    items.push({ t: "article", q: e.de, a: e.art, tr: e.tr });
  });
  shuffle(lesson.vocab.filter((e) => e.pl)).slice(0, 2).forEach((e) => {
    items.push({ t: "fill", q: "Çoğul: die ___ (" + e.art + " " + e.de + ")", a: [e.pl] });
  });
  const pool = lesson.vocab;
  shuffle(pool).slice(0, 4).forEach((e) => {
    const wrong = [...new Set(shuffle(pool.filter((o) => o.tr !== e.tr)).map((o) => o.tr))].slice(0, 3);
    const opts = shuffle([...wrong, e.tr]);
    items.push({ t: "mc", q: "'" + displayWord(e) + "' ne demek?", opts, a: opts.indexOf(e.tr) });
  });
  return shuffle(items).slice(0, count);
}
