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
          v("Bis später", "sonra görüşürüz"), v("Danke", "teşekkürler"), v("Wie geht's?", "nasılsın?"),
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
          { de: "Ich bin Mert.", tr: "Ben Mert'im." },
          { de: "Wie geht es dir? – Danke, sehr gut!", tr: "Nasılsın? – Teşekkürler, çok iyiyim!" },
        ],
        exercises: [
          { t: "mc", q: "Sabah biriyle karşılaştığında ne dersin?", opts: ["Gute Nacht", "Guten Morgen", "Guten Abend", "Tschüs"], a: 1 },
          { t: "mc", q: "'Auf Wiedersehen' ne anlama gelir?", opts: ["Teşekkürler", "Günaydın", "Görüşmek üzere", "Merhaba"], a: 2 },
          { t: "mc", q: "Akşam yatmadan önce ne denir?", opts: ["Gute Nacht", "Guten Tag", "Hallo", "Danke"], a: 0 },
          { t: "fill", q: "Ich ___ Mert. (sein)", a: ["bin"] },
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
          { t: "fill", q: "Er ___ in Stuttgart. (wohnen)", a: ["wohnt"] },
          { t: "fill", q: "Nein, ich wohne ___ in Berlin. (olumsuz)", a: ["nicht"] },
          { t: "order", words: ["Wohnst", "du", "in", "Stuttgart"], a: "Wohnst du in Stuttgart" },
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
          { de: "Sie kommt aus Spanien. Sie ist Spanierin.", tr: "O İspanya'dan geliyor. O İspanyol." },
          { de: "Er spricht Deutsch und Französisch.", tr: "O Almanca ve Fransızca konuşuyor." },
          { de: "Matteo kommt aus der Schweiz.", tr: "Matteo İsviçre'den geliyor." },
        ],
        exercises: [
          { t: "mc", q: "'Woher kommst du?' sorusu neyi sorar?", opts: ["Nerede oturuyorsun?", "Nereden geliyorsun?", "Kaç yaşındasın?", "Adın ne?"], a: 1 },
          { t: "mc", q: "Pedro İtalya'dan geliyor. Pedro ne olur?", opts: ["Spanier", "Türke", "Italiener", "Schweizer"], a: 2 },
          { t: "fill", q: "Ich ___ aus Türkiye. (kommen)", a: ["komme"] },
          { t: "fill", q: "Du ___ gut Englisch. (sprechen)", a: ["sprichst"] },
          { t: "fill", q: "Er ___ Deutsch. (sprechen)", a: ["spricht"] },
          { t: "fill", q: "Wir ___ aus Japan. (kommen)", a: ["kommen"] },
          { t: "fill", q: "Martina kommt aus Spanien. Sie spricht ___.", a: ["Spanisch"] },
          { t: "order", words: ["Woher", "kommst", "du"], a: "Woher kommst du" },
          { t: "order", words: ["Sie", "kommt", "aus", "Spanien"], a: "Sie kommt aus Spanien" },
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
          { de: "Meine Schultasche ist alt.", tr: "Okul çantam eski." },
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
          v("grau", "gri"), v("rosa", "pembe"), v("neu", "yeni"), v("alt", "eski"),
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
          { de: "Mein Buch ist gelb und dick.", tr: "Kitabım sarı ve kalın." },
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
          { t: "order", words: ["Mein", "Buch", "ist", "gelb"], a: "Mein Buch ist gelb" },
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
          { de: "Ich mag Geschichte sehr.", tr: "Tarihi çok severim." },
          { de: "Ich finde Physik schwer.", tr: "Bence fizik zor." },
          { de: "Am Wochenende habe ich keine Schule.", tr: "Hafta sonu okulum yok." },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ am Montag Deutsch. (haben)", a: ["habe"] },
          { t: "fill", q: "Du ___ Mathe. (mögen)", a: ["magst"] },
          { t: "fill", q: "Er ___ Physik schwer. (finden)", a: ["findet"] },
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
          v("Schach spielen", "satranç oynamak"), v("Musik hören", "müzik dinlemek"),
          v("Englisch lernen", "İngilizce öğrenmek"),
          v("Komm!", "gel!"), v("Geh!", "git!"), v("Lies!", "oku!"), v("Schreib!", "yaz!"), v("Sei leise!", "sessiz ol!"),
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
          { de: "Mete spielt gern Schach.", tr: "Mete satranç oynamayı sever." },
          { de: "Ich mache nicht gern Hausaufgaben.", tr: "Ödev yapmayı sevmem." },
          { de: "Lies das Buch!", tr: "Kitabı oku!" },
        ],
        exercises: [
          { t: "fill", q: "Ich ___ gern Gitarre. (spielen)", a: ["spiele"] },
          { t: "fill", q: "Mete ___ gern Schach. (spielen)", a: ["spielt"] },
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
            body: "Kişi adlarında sahiplik için isme -s eklenir: Pauls Eltern (Paul'ün anne babası). Çoğul sahip: wir → unser/unsere, ihr → euer/eure, sie → ihr/ihre, Sie → Ihr/Ihre. Sayılarda birler önce söylenir: 23 = dreiundzwanzig (üç-ve-yirmi).",
            tables: [
              { head: "Possessiv (Plural)", rows: [["wir", "unser · unsere"], ["ihr", "euer · eure"], ["sie", "ihr · ihre"], ["Sie", "Ihr · Ihre"]] },
            ],
          },
        ],
        examples: [
          { de: "Ich habe einen Bruder und eine Schwester.", tr: "Bir erkek kardeşim ve bir kız kardeşim var." },
          { de: "Pauls Eltern wohnen in Düsseldorf.", tr: "Paul'ün anne babası Düsseldorf'ta oturuyor." },
          { de: "Unsere Großeltern sind fünfundsiebzig Jahre alt.", tr: "Büyükanne ve büyükbabamız yetmiş beş yaşında." },
          { de: "Habt ihr Geschwister?", tr: "Kardeşleriniz var mı?" },
        ],
        exercises: [
          { t: "fill", q: "Ich habe ___ Bruder. (ein)", a: ["einen"] },
          { t: "fill", q: "Ich habe ___ Schwester. (eine/einen)", a: ["eine"] },
          { t: "fill", q: "Ich habe ___ Kind. (olumsuz)", a: ["kein"] },
          { t: "fill", q: "Das ist die Mutter von Sofia: ___ Mutter. (Genitiv)", a: ["Sofias"] },
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
          { de: "Meryem trägt ein Kopftuch.", tr: "Meryem başörtüsü takıyor." },
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
