// Modül 6: Wohnen (Goethe A1 "Wohnen" konusu). Metinler özgündür; kelime seçimi Goethe-Zertifikat A1
// kelime listesindeki konu başlıklarına göre yapılmıştır.
//
// Ek alanlar (isteğe bağlı): dialog = { title, lines: [{ who: "A" | "B", de, tr }] }
//                            speak  = [{ task, model }]  (konuşma görevleri)

const w = (art, de, tr, pl, fem) => ({ art, de, tr, pl: pl || null, fem: fem || null });
const v = (de, tr) => ({ art: null, de, tr, pl: null, fem: null });

export const M6 = {
  id: "M6",
  title: "Wohnen",
  tr: "Evim ve çevrem",
  lessons: [
    {
      id: "m6a",
      title: "Mein Zuhause",
      tr: "Evim: odalar ve eşyalar",
      goals: ["Evi ve odaları anlatmak", "Kaç odası olduğunu söylemek", "'es gibt' ile evde ne olduğunu söylemek"],
      vocab: [
        w("das", "Haus", "ev (müstakil)", "Häuser"), w("die", "Wohnung", "daire", "Wohnungen"),
        w("das", "Wohnzimmer", "oturma odası", "Wohnzimmer"),
        w("das", "Schlafzimmer", "yatak odası", "Schlafzimmer"), w("das", "Bad", "banyo", "Bäder"), w("die", "Toilette", "tuvalet", "Toiletten"),
        w("der", "Balkon", "balkon", "Balkone"), w("der", "Garten", "bahçe", "Gärten"),
        w("das", "Fenster", "pencere", "Fenster"), w("die", "Lampe", "lamba", "Lampen"), w("das", "Sofa", "koltuk, kanepe", "Sofas"), w("der", "Kühlschrank", "buzdolabı", "Kühlschränke"),
        v("gemütlich", "rahat, sıcak (ortam)"), v("duschen", "duş almak"),
      ],
      grammar: [
        {
          title: "es gibt + Akkusativ",
          body: "'Es gibt' bir şeyin var olduğunu söyler ve Türkçedeki 'var' gibi kullanılır. Ardından gelen isim Akkusativ'dedir: eril isimlerde ein → einen, kein → keinen. 'Es gibt' hem tekil hem çoğulla aynı kalır.",
          tables: [
            { head: "Es gibt ...", rows: [["der", "Es gibt einen Balkon."], ["die", "Es gibt eine Küche."], ["das", "Es gibt ein Bad."], ["Pl.", "Es gibt zwei Zimmer."]] },
          ],
        },
        {
          title: "haben ile oda sayısı",
          body: "Evi anlatırken 'Die Wohnung hat ... Zimmer' kalıbı kullanılır. Soru: 'Wie viele Zimmer hat die Wohnung?' (Daire kaç odalı?)",
          tables: [],
        },
      ],
      examples: [
        { de: "Wir wohnen in einer Wohnung. Sie hat drei Zimmer.", tr: "Bir dairede oturuyoruz. Üç odası var." },
        { de: "Im Wohnzimmer gibt es ein Sofa und eine Lampe.", tr: "Oturma odasında bir koltuk ve bir lamba var." },
        { de: "Meine Küche ist klein, aber sehr gemütlich.", tr: "Mutfağım küçük ama çok sıcak." },
        { de: "Hast du einen Garten? – Nein, aber wir haben einen Balkon.", tr: "Bahçen var mı? – Hayır, ama balkonumuz var." },
      ],
      exercises: [
        { t: "mc", q: "Yemek pişirilen oda hangisi?", opts: ["das Bad", "die Küche", "das Schlafzimmer", "der Balkon"], a: 1 },
        { t: "mc", q: "'das Wohnzimmer' ne demek?", opts: ["Yatak odası", "Mutfak", "Oturma odası", "Banyo"], a: 2 },
        { t: "mc", q: "'Wie viele Zimmer hat die Wohnung?' neyi sorar?", opts: ["Dairenin fiyatını", "Kaç odası olduğunu", "Nerede olduğunu", "Kaç katlı olduğunu"], a: 1 },
        { t: "fill", q: "Es gibt ___ Balkon. (der Balkon, ein)", a: ["einen"] },
        { t: "fill", q: "Es gibt ___ Küche. (die Küche, ein)", a: ["eine"] },
        { t: "fill", q: "Es gibt ___ Bad. (das Bad, ein)", a: ["ein"] },
        { t: "fill", q: "Die Wohnung ___ drei Zimmer. (haben)", a: ["hat"] },
        { t: "fill", q: "Wir haben ___ Garten. (olumsuz, der Garten)", a: ["keinen"] },
        { t: "order", words: ["Die", "Wohnung", "hat", "vier", "Zimmer"], a: "Die Wohnung hat vier Zimmer" },
        { t: "order", words: ["Es", "gibt", "einen", "Balkon"], a: "Es gibt einen Balkon" },
      ],
      dialog: {
        title: "Lena zeigt ihre Wohnung",
        lines: [
          { who: "A", de: "Hallo Lena, wo wohnst du?", tr: "Merhaba Lena, nerede oturuyorsun?" },
          { who: "B", de: "Ich wohne in einer Wohnung in Berlin.", tr: "Berlin'de bir dairede oturuyorum." },
          { who: "A", de: "Wie viele Zimmer hat die Wohnung?", tr: "Daire kaç odalı?" },
          { who: "B", de: "Sie hat drei Zimmer, eine Küche und ein Bad.", tr: "Üç oda, bir mutfak ve bir banyosu var." },
          { who: "A", de: "Hast du einen Balkon?", tr: "Balkonun var mı?" },
          { who: "B", de: "Ja, aber ich habe keinen Garten.", tr: "Evet, ama bahçem yok." },
        ],
      },
      speak: [
        { task: "Evini anlat: kaç odası var, mutfak ve banyo var mı?", model: "Ich wohne in einer Wohnung. Sie hat vier Zimmer, eine Küche und ein Bad. Wir haben auch einen Balkon." },
        { task: "Karşındakine sor: Bahçen var mı?", model: "Hast du einen Garten?" },
      ],
    },
    {
      id: "m6b",
      title: "Wo ist ...?",
      tr: "Eşyalar nerede? (yer bildiren edatlar)",
      goals: ["Bir şeyin yerini sormak ve söylemek", "in, auf, an, neben, unter, vor, hinter, zwischen", "Wo? sorusunda Dativ kullanmak"],
      vocab: [
        v("in", "içinde"), v("auf", "üstünde"), v("an", "yanında, -e bitişik"), v("neben", "yanında"),
        v("unter", "altında"), v("über", "üstünde (havada)"), v("hinter", "arkasında"),
        v("zwischen", "arasında"),
        v("liegen", "(yatay) durmak"), v("stehen", "(dik) durmak"), v("hängen", "asılı durmak"),
        w("der", "Schrank", "dolap", "Schränke"), w("der", "Teppich", "halı", "Teppiche"),
        w("das", "Regal", "raf", "Regale"), w("die", "Wand", "duvar", "Wände"),
        w("der", "Schlüssel", "anahtar", "Schlüssel"), w("der", "Flur", "koridor", "Flure"),
        w("der", "Fernseher", "televizyon", "Fernseher"),
      ],
      grammar: [
        {
          title: "Wo? sorusu ve Dativ",
          body: "Bir şeyin nerede olduğunu söylerken (Wo?) yer edatlarından sonra Dativ gelir. Belirli artikel: der → dem, die → der, das → dem, çoğul die → den. 'in dem' çoğunlukla 'im', 'an dem' ise 'am' olur.",
          tables: [
            { head: "Dativ (Wo?)", rows: [["der Tisch", "auf dem Tisch"], ["die Wand", "an der Wand"], ["das Regal", "im Regal (in dem)"], ["die Betten", "auf den Betten"]] },
          ],
        },
        {
          title: "er / sie / es ile cevap vermek",
          body: "'Wo ist der Schlüssel?' sorusuna eşyanın artikeline göre cevap verilir: der → er, die → sie, das → es. Örnek: 'Er liegt auf dem Tisch.'",
          tables: [
            { head: "Cevap", rows: [["der Schlüssel", "Er liegt ..."], ["die Lampe", "Sie steht ..."], ["das Handy", "Es liegt ..."]] },
          ],
        },
      ],
      examples: [
        { de: "Das Handy liegt auf dem Tisch.", tr: "Cep telefonu masanın üstünde." },
        { de: "Die Lampe steht neben dem Bett.", tr: "Lamba yatağın yanında duruyor." },
        { de: "Das Poster hängt an der Wand.", tr: "Poster duvarda asılı." },
        { de: "Wo ist der Schlüssel? – Er ist in der Tasche.", tr: "Anahtar nerede? – Çantanın içinde." },
        { de: "Der Teppich liegt vor dem Sofa.", tr: "Halı koltuğun önünde." },
      ],
      exercises: [
        { t: "mc", q: "'unter' ne demek?", opts: ["üstünde", "altında", "arkasında", "arasında"], a: 1 },
        { t: "mc", q: "'hinter' ne demek?", opts: ["önünde", "yanında", "arkasında", "içinde"], a: 2 },
        { t: "mc", q: "Wo? sorusunda yer edatlarından sonra hangi hal gelir?", opts: ["Nominativ", "Dativ", "Genitiv", "Hiçbiri"], a: 1 },
        { t: "fill", q: "Das Buch liegt auf ___ Tisch. (der Tisch)", a: ["dem"] },
        { t: "fill", q: "Die Lampe steht neben ___ Sofa. (das Sofa)", a: ["dem"] },
        { t: "fill", q: "Das Poster hängt an ___ Wand. (die Wand)", a: ["der"] },
        { t: "fill", q: "Ich bin in ___ Küche. (die Küche)", a: ["der"] },
        { t: "fill", q: "Wir sind ___ Garten. (in dem → tek kelime)", a: ["im"] },
        { t: "fill", q: "Wo ist die Lampe? – ___ steht neben dem Bett.", a: ["sie"] },
        { t: "order", words: ["Der", "Schlüssel", "liegt", "auf", "dem", "Tisch"], a: "Der Schlüssel liegt auf dem Tisch" },
        { t: "order", words: ["Wo", "ist", "mein", "Handy"], a: "Wo ist mein Handy" },
      ],
      dialog: {
        title: "Wo ist mein Handy?",
        lines: [
          { who: "A", de: "Entschuldigung, wo ist mein Handy?", tr: "Pardon, cep telefonum nerede?" },
          { who: "B", de: "Es liegt auf dem Tisch, neben der Lampe.", tr: "Masanın üstünde, lambanın yanında." },
          { who: "A", de: "Danke! Und wo ist mein Rucksack?", tr: "Teşekkürler! Peki sırt çantam nerede?" },
          { who: "B", de: "Er steht im Flur, vor der Tür.", tr: "Koridorda, kapının önünde." },
          { who: "A", de: "Super. Und der Schlüssel?", tr: "Harika. Ya anahtar?" },
          { who: "B", de: "Er ist in deiner Tasche.", tr: "Çantanın içinde." },
        ],
      },
      speak: [
        { task: "Bir eşyanın nerede olduğunu sor.", model: "Entschuldigung, wo ist mein Schlüssel?" },
        { task: "Odandaki bir eşyanın yerini söyle (örnek: kitap, raf).", model: "Mein Buch steht im Regal, neben dem Fernseher." },
      ],
    },
    {
      id: "m6c",
      title: "Menschen und Tiere",
      tr: "İnsanlar, evcil hayvanlar ve karakter",
      goals: ["İnsanları ve hayvanları adlandırmak", "Çoğul biçimlerini tanımak", "Birinin nasıl biri olduğunu söylemek"],
      vocab: [
        w("der", "Mann", "adam, erkek", "Männer"), w("die", "Frau", "kadın; hanım", "Frauen"),
        w("das", "Mädchen", "kız çocuğu", "Mädchen"), w("der", "Junge", "erkek çocuğu", "Jungen"),
        w("das", "Baby", "bebek", "Babys"), w("die", "Freundin", "kız arkadaş", "Freundinnen"),
        w("der", "Herr", "bay", "Herren"), w("die", "Leute", "insanlar"),
        w("das", "Haustier", "evcil hayvan", "Haustiere"), w("das", "Tier", "hayvan", "Tiere"),
        w("der", "Hund", "köpek", "Hunde"), w("die", "Katze", "kedi", "Katzen"),
        w("das", "Pferd", "at", "Pferde"), w("der", "Vogel", "kuş", "Vögel"),
        v("freundlich", "güler yüzlü"), v("sympathisch", "sempatik, sevimli"),
        v("süß", "tatlı, sevimli"), v("lieb", "sevimli, uslu"),
      ],
      grammar: [
        {
          title: "Çoğul biçimleri",
          body: "Almanca'da çoğul tek bir kurala bağlı değildir; ismi çoğuluyla birlikte öğren. Sık görülen kalıplar: -e (Hund → Hunde), ¨-e (Vogel → Vögel), ¨-er (Mann → Männer), -n/-en (Katze → Katzen), -s (Baby → Babys) ve değişmeyenler (Mädchen → Mädchen). Çoğulda artikel her zaman 'die'dir.",
          tables: [
            { head: "Örnekler", rows: [["der Hund", "die Hunde"], ["die Katze", "die Katzen"], ["der Mann", "die Männer"], ["das Baby", "die Babys"], ["das Mädchen", "die Mädchen"]] },
          ],
        },
        {
          title: "Birini tanımlamak: sein + sıfat",
          body: "Sıfat cümlenin sonunda ve değişmeden kalır: 'Er ist nett.', 'Sie ist sehr sympathisch.' 'sehr' (çok) sıfatın önüne gelir.",
          tables: [],
        },
      ],
      examples: [
        { de: "Mein Hund heißt Max. Er ist sehr freundlich.", tr: "Köpeğimin adı Max. Çok güler yüzlü." },
        { de: "Wir haben zwei Katzen. Sie sind süß.", tr: "İki kedimiz var. Çok tatlılar." },
        { de: "Das Mädchen und der Junge spielen im Garten.", tr: "Kız ve oğlan bahçede oynuyor." },
        { de: "Frau Weber ist sehr sympathisch.", tr: "Bayan Weber çok sempatik." },
        { de: "Viele Leute haben ein Haustier.", tr: "Birçok insanın evcil hayvanı var." },
      ],
      exercises: [
        { t: "mc", q: "'das Haustier' ne demek?", opts: ["Vahşi hayvan", "Evcil hayvan", "Çiftlik", "Kuş"], a: 1 },
        { t: "mc", q: "'lustig' ne demek?", opts: ["Üzgün", "Sıkıcı", "Komik, eğlenceli", "Büyük"], a: 2 },
        { t: "fill", q: "Çoğul: die ___ (der Hund)", a: ["hunde"] },
        { t: "fill", q: "Çoğul: die ___ (die Katze)", a: ["katzen"] },
        { t: "fill", q: "Çoğul: die ___ (der Mann)", a: ["männer", "maenner"] },
        { t: "fill", q: "Çoğul: die ___ (das Mädchen)", a: ["mädchen", "maedchen"] },
        { t: "fill", q: "Ich habe ___ Hund. (der Hund, ein)", a: ["einen"] },
        { t: "fill", q: "Meine Katze ___ sehr süß. (sein)", a: ["ist"] },
        { t: "order", words: ["Mein", "Hund", "ist", "sehr", "lieb"], a: "Mein Hund ist sehr lieb" },
        { t: "order", words: ["Wir", "haben", "zwei", "Katzen"], a: "Wir haben zwei Katzen" },
      ],
      dialog: {
        title: "Hast du ein Haustier?",
        lines: [
          { who: "A", de: "Hast du ein Haustier?", tr: "Evcil hayvanın var mı?" },
          { who: "B", de: "Ja, ich habe einen Hund. Er heißt Bruno.", tr: "Evet, bir köpeğim var. Adı Bruno." },
          { who: "A", de: "Wie alt ist er?", tr: "Kaç yaşında?" },
          { who: "B", de: "Er ist zwei Jahre alt. Und du?", tr: "İki yaşında. Ya sen?" },
          { who: "A", de: "Ich habe eine Katze. Sie ist ganz lieb.", tr: "Benim bir kedim var. Çok uslu." },
          { who: "B", de: "Wie heißt sie?", tr: "Adı ne?" },
          { who: "A", de: "Sie heißt Mimi.", tr: "Adı Mimi." },
        ],
      },
      speak: [
        { task: "Evcil hayvanın olduğunu (ya da isteyeceğin hayvanı) söyle ve adını/özelliğini ekle.", model: "Ich habe eine Katze. Sie heißt Mimi und sie ist sehr süß." },
        { task: "Arkadaşını tanıt: adı ve nasıl biri olduğu.", model: "Das ist meine Freundin Anna. Sie ist sehr nett und lustig." },
      ],
    },
  ],
};
