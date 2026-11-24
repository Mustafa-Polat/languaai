// Modül 8: Reisen und Verkehr (Goethe A1 "Reisen/Verkehr" konusu). Metinler özgündür.
//
// Ek alan: write = [{ task, model }]  (yazma görevleri; sınavın Schreiben bölümüne hazırlık)

const w = (art, de, tr, pl, fem) => ({ art, de, tr, pl: pl || null, fem: fem || null });
const v = (de, tr) => ({ art: null, de, tr, pl: null, fem: null });

export const M8 = {
  id: "M8",
  title: "Reisen und Verkehr",
  tr: "Ulaşım, yol tarifi ve seyahat",
  lessons: [
    {
      id: "m8a",
      title: "Verkehrsmittel",
      tr: "Ulaşım araçları: mit dem Bus, zu Fuß",
      goals: ["Ulaşım araçlarını adlandırmak", "mit + Dativ ile 'ile gitmek' demek", "Yolculuk süresini sormak ve söylemek"],
      vocab: [
        w("der", "Bahnhof", "tren garı", "Bahnhöfe"), w("der", "Bahnsteig", "peron", "Bahnsteige"),
        w("das", "Gleis", "hat, peron numarası", "Gleise"), w("die", "Haltestelle", "durak", "Haltestellen"),
        w("die", "U-Bahn", "metro", "U-Bahnen"), w("die", "Straßenbahn", "tramvay", "Straßenbahnen"),
        w("der", "Flughafen", "havalimanı", "Flughäfen"), w("das", "Flugzeug", "uçak", "Flugzeuge"),
        w("das", "Schiff", "gemi", "Schiffe"), w("das", "Taxi", "taksi", "Taxis"),
        w("die", "Fahrt", "yolculuk, sefer", "Fahrten"),
        v("abfahren", "(taşıt) hareket etmek"), v("einsteigen", "binmek"), v("aussteigen", "inmek"),
        v("umsteigen", "aktarma yapmak"), v("zu Fuß", "yürüyerek"),
      ],
      grammar: [
        {
          title: "mit + Dativ: hangi araçla?",
          body: "Bir araçla gittiğini söylerken 'mit' kullanılır ve ardından Dativ gelir: der → dem, die → der, das → dem, çoğul → den. 'Yürüyerek' için 'zu Fuß' denir ve artikel almaz. Soru: 'Wie kommst du zur Schule?' (Okula nasıl gidiyorsun?)",
          tables: [
            { head: "mit + Dativ", rows: [["der Bus", "mit dem Bus"], ["die U-Bahn", "mit der U-Bahn"], ["das Taxi", "mit dem Taxi"], ["zu Fuß", "(artikelsiz)"]] },
          ],
        },
        {
          title: "Ayrılabilir fiiller ve süre",
          body: "Taşıtla ilgili birçok fiil ayrılabilir: abfahren (Der Zug fährt um acht Uhr ab.), einsteigen, aussteigen, umsteigen (Wir steigen in Berlin um.). Ön ek cümle sonuna gider. Süre sormak için: 'Wie lange dauert die Fahrt?' – 'Die Fahrt dauert zehn Minuten.'",
          tables: [],
        },
      ],
      examples: [
        { de: "Ich fahre mit dem Bus zur Schule.", tr: "Okula otobüsle gidiyorum." },
        { de: "Wie kommst du zum Bahnhof? – Ich gehe zu Fuß.", tr: "Garınıza nasıl gidiyorsun? – Yürüyerek gidiyorum." },
        { de: "Der Zug fährt um acht Uhr ab.", tr: "Tren saat sekizde kalkıyor." },
        { de: "Wir steigen in Berlin um.", tr: "Berlin'de aktarma yapıyoruz." },
        { de: "Wie lange dauert die Fahrt? – Zehn Minuten.", tr: "Yolculuk ne kadar sürüyor? – On dakika." },
      ],
      exercises: [
        { t: "mc", q: "'der Flughafen' ne demek?", opts: ["Tren garı", "Havalimanı", "Liman", "Durak"], a: 1 },
        { t: "mc", q: "'zu Fuß' ne demek?", opts: ["Bisikletle", "Otobüsle", "Yürüyerek", "Taksiyle"], a: 2 },
        { t: "mc", q: "'umsteigen' ne demek?", opts: ["Binmek", "İnmek", "Aktarma yapmak", "Kalkmak"], a: 2 },
        { t: "fill", q: "Ich fahre mit ___ Bus. (der Bus)", a: ["dem"] },
        { t: "fill", q: "Sie fährt mit ___ U-Bahn. (die U-Bahn)", a: ["der"] },
        { t: "fill", q: "Wir fahren mit ___ Taxi. (das Taxi)", a: ["dem"] },
        { t: "fill", q: "Wir ___ in Berlin um. (umsteigen)", a: ["steigen"] },
        { t: "fill", q: "Der Zug fährt um acht Uhr ___. (abfahren)", a: ["ab"] },
        { t: "order", words: ["Ich", "fahre", "mit", "dem", "Bus", "zur", "Schule"], a: "Ich fahre mit dem Bus zur Schule" },
        { t: "order", words: ["Wie", "lange", "dauert", "die", "Fahrt"], a: "Wie lange dauert die Fahrt" },
      ],
      dialog: {
        title: "Wie kommst du zur Schule?",
        lines: [
          { who: "A", de: "Wie kommst du zur Schule, Ali?", tr: "Okula nasıl geliyorsun, Ali?" },
          { who: "B", de: "Ich fahre mit dem Bus. Und du?", tr: "Otobüsle geliyorum. Ya sen?" },
          { who: "A", de: "Ich nehme die U-Bahn. Die Haltestelle ist neben meinem Haus.", tr: "Ben metroya biniyorum. Durak evimin yanında." },
          { who: "B", de: "Wie lange dauert die Fahrt?", tr: "Yolculuk ne kadar sürüyor?" },
          { who: "A", de: "Nur zehn Minuten. Ich muss nicht umsteigen.", tr: "Sadece on dakika. Aktarma yapmam gerekmiyor." },
        ],
      },
      speak: [
        { task: "Okula / işe nasıl gittiğini anlat ve ne kadar sürdüğünü söyle.", model: "Ich fahre mit dem Bus zur Schule. Die Fahrt dauert zwanzig Minuten." },
        { task: "Birine nasıl geldiğini sor.", model: "Wie kommst du zum Bahnhof?" },
      ],
    },
    {
      id: "m8b",
      title: "Fahrkarten und Fahrpläne",
      tr: "Bilet almak ve tren saatleri",
      goals: ["Gişede bilet istemek", "Hareket saati, peron ve gecikmeyi anlamak", "'nach' ile gidilen yeri söylemek"],
      vocab: [
        w("die", "Fahrkarte", "bilet", "Fahrkarten"), w("der", "Fahrplan", "tarife, sefer saatleri", "Fahrpläne"),
        w("der", "Automat", "otomat, bilet makinesi", "Automaten"), w("das", "Gepäck", "bagaj"),
        w("der", "Koffer", "bavul", "Koffer"), w("die", "Abfahrt", "kalkış", "Abfahrten"),
        w("die", "Ankunft", "varış", "Ankünfte"), w("die", "Verspätung", "gecikme", "Verspätungen"),
        w("der", "Platz", "yer, koltuk; meydan", "Plätze"),
        v("einfach", "tek yön"), v("hin und zurück", "gidiş-dönüş"), v("nächste", "bir sonraki"),
        v("bezahlen", "ödemek"),
      ],
      grammar: [
        {
          title: "nach + şehir ve ülke",
          body: "Bir şehre ya da ülkeye giderken 'nach' kullanılır ve artikel yoktur: nach Berlin, nach Deutschland, nach Hause (eve). 'von ... nach ...' = ...'den ...'e.",
          tables: [
            { head: "nach", rows: [["Berlin", "nach Berlin"], ["Deutschland", "nach Deutschland"], ["Haus", "nach Hause"]] },
          ],
        },
        {
          title: "Bilet almak ve saatler",
          body: "Gişede: 'Einmal nach Berlin, bitte.' (Berlin'e bir bilet lütfen.), 'Einfach oder hin und zurück?', 'Was kostet das?'. Saat resmi şekilde söylenir: 14.35 = vierzehn Uhr fünfunddreißig. Peron için 'von Gleis 3'. 'nächste' (sonraki): der nächste Zug, die nächste U-Bahn, das nächste Taxi.",
          tables: [
            { head: "nächste", rows: [["der Zug", "der nächste Zug"], ["die U-Bahn", "die nächste U-Bahn"], ["das Taxi", "das nächste Taxi"]] },
          ],
        },
      ],
      examples: [
        { de: "Einmal nach Berlin, bitte.", tr: "Berlin'e bir bilet lütfen." },
        { de: "Wann fährt der nächste Zug nach München?", tr: "Münih'e bir sonraki tren ne zaman kalkıyor?" },
        { de: "Der Zug fährt um 14.35 Uhr von Gleis 3 ab.", tr: "Tren 14.35'te 3. perondan kalkıyor." },
        { de: "Der Zug hat zehn Minuten Verspätung.", tr: "Trenin on dakika gecikmesi var." },
        { de: "Einfach oder hin und zurück?", tr: "Tek yön mü, gidiş-dönüş mü?" },
      ],
      exercises: [
        { t: "mc", q: "'die Verspätung' ne demek?", opts: ["Kalkış", "Varış", "Gecikme", "Bavul"], a: 2 },
        { t: "mc", q: "'hin und zurück' ne demek?", opts: ["Tek yön", "Gidiş-dönüş", "Aktarmalı", "Ücretsiz"], a: 1 },
        { t: "mc", q: "Bilet gişesinde 'einfach' hangi anlama gelir?", opts: ["Kolay", "Tek yön", "Ucuz", "Hızlı"], a: 1 },
        { t: "fill", q: "Einmal ___ Hamburg, bitte.", a: ["nach"] },
        { t: "fill", q: "Wann fährt der ___ Zug? (bir sonraki)", a: ["nächste", "naechste"] },
        { t: "fill", q: "Der Zug fährt von ___ 3 ab. (peron/hat)", a: ["gleis"] },
        { t: "fill", q: "Was ___ die Fahrkarte? (kosten)", a: ["kostet"] },
        { t: "fill", q: "Ich fahre ___ Hause. (eve)", a: ["nach"] },
        { t: "order", words: ["Wann", "fährt", "der", "nächste", "Zug"], a: "Wann fährt der nächste Zug" },
        { t: "order", words: ["Ich", "möchte", "eine", "Fahrkarte", "nach", "Berlin"], a: "Ich möchte eine Fahrkarte nach Berlin" },
      ],
      dialog: {
        title: "Am Schalter",
        lines: [
          { who: "A", de: "Guten Tag. Ich möchte eine Fahrkarte nach Hamburg.", tr: "İyi günler. Hamburg'a bir bilet istiyorum." },
          { who: "B", de: "Einfach oder hin und zurück?", tr: "Tek yön mü, gidiş-dönüş mü?" },
          { who: "A", de: "Hin und zurück, bitte. Was kostet das?", tr: "Gidiş-dönüş lütfen. Ne kadar tutuyor?" },
          { who: "B", de: "Das macht 58 Euro.", tr: "58 euro tutuyor." },
          { who: "A", de: "Wann fährt der nächste Zug?", tr: "Bir sonraki tren ne zaman kalkıyor?" },
          { who: "B", de: "Um 10.20 Uhr, von Gleis 4.", tr: "10.20'de, 4. perondan." },
          { who: "A", de: "Danke schön!", tr: "Çok teşekkürler!" },
        ],
      },
      speak: [
        { task: "Gişede Hamburg'a gidiş-dönüş bilet iste.", model: "Guten Tag. Ich möchte eine Fahrkarte nach Hamburg, hin und zurück, bitte." },
        { task: "Bir sonraki trenin saatini sor.", model: "Wann fährt der nächste Zug nach München?" },
        { task: "Trenin gecikmeli olduğunu söyle.", model: "Der Zug hat zwanzig Minuten Verspätung." },
      ],
    },
    {
      id: "m8c",
      title: "Wie komme ich zum Bahnhof?",
      tr: "Yol tarifi sormak ve vermek",
      goals: ["Yol sormak", "Yol tarif etmek (links, rechts, geradeaus)", "Sie-Imperativ ile yönerge vermek", "zum / zur kullanmak"],
      vocab: [
        w("die", "Straße", "cadde, sokak", "Straßen"), w("die", "Ecke", "köşe", "Ecken"),
        w("die", "Kreuzung", "kavşak", "Kreuzungen"), w("die", "Ampel", "trafik ışığı", "Ampeln"),
        w("die", "Brücke", "köprü", "Brücken"), w("der", "Stadtplan", "şehir haritası", "Stadtpläne"),
        w("die", "Bank", "banka", "Banken"), w("die", "Post", "postane"),
        w("die", "Bibliothek", "kütüphane", "Bibliotheken"), w("der", "Supermarkt", "süpermarket", "Supermärkte"),
        w("der", "Markt", "pazar", "Märkte"), w("das", "Museum", "müze", "Museen"),
        w("die", "Kirche", "kilise", "Kirchen"), w("das", "Krankenhaus", "hastane", "Krankenhäuser"),
        w("das", "Schwimmbad", "yüzme havuzu", "Schwimmbäder"),
        v("links", "sol"), v("rechts", "sağ"), v("geradeaus", "dümdüz"),
        v("abbiegen", "dönmek (sağa/sola)"), v("weit", "uzak"), v("in der Nähe", "yakında"),
      ],
      grammar: [
        {
          title: "Yönerge: Sie-Imperativ",
          body: "Resmi yönerge için fiil mastar biçiminde ve cümlenin başında durur, hemen arkasından 'Sie' gelir: 'Gehen Sie geradeaus.', 'Nehmen Sie die zweite Straße rechts.' Ayrılabilir fiillerde ön ek cümle sonuna gider: 'Biegen Sie links ab.'",
          tables: [
            { head: "Yönergeler", rows: [["gehen", "Gehen Sie geradeaus."], ["nehmen", "Nehmen Sie die erste Straße links."], ["abbiegen", "Biegen Sie rechts ab."]] },
          ],
        },
        {
          title: "zum / zur: ...-e doğru",
          body: "'Wie komme ich zum Bahnhof?' sorusunda 'zu' + Dativ kullanılır. zu dem = zum (der, das), zu der = zur (die). 'bis zur Ampel' = ışığa kadar.",
          tables: [
            { head: "zu + Dativ", rows: [["der Bahnhof", "zum Bahnhof"], ["die Post", "zur Post"], ["das Museum", "zum Museum"]] },
          ],
        },
      ],
      examples: [
        { de: "Gehen Sie geradeaus und dann links.", tr: "Dümdüz gidin, sonra sola dönün." },
        { de: "Wie komme ich zum Bahnhof?", tr: "Gara nasıl giderim?" },
        { de: "Die Post ist neben der Bank.", tr: "Postane bankanın yanında." },
        { de: "Biegen Sie an der Ampel rechts ab.", tr: "Trafik ışığında sağa dönün." },
        { de: "Ist es weit? – Nein, nur fünf Minuten zu Fuß.", tr: "Uzak mı? – Hayır, yürüyerek sadece beş dakika." },
      ],
      exercises: [
        { t: "mc", q: "'links' ne demek?", opts: ["Sağ", "Sol", "Düz", "Geri"], a: 1 },
        { t: "mc", q: "'die Ampel' ne demek?", opts: ["Köşe", "Kavşak", "Trafik ışığı", "Köprü"], a: 2 },
        { t: "mc", q: "'in der Nähe' ne demek?", opts: ["Uzakta", "Yakında", "Karşıda", "Arkada"], a: 1 },
        { t: "fill", q: "Gehen Sie ___. (dümdüz)", a: ["geradeaus"] },
        { t: "fill", q: "Wie komme ich ___ Bahnhof? (zu dem → tek kelime)", a: ["zum"] },
        { t: "fill", q: "Wie komme ich ___ Post? (zu der → tek kelime)", a: ["zur"] },
        { t: "fill", q: "Biegen Sie an der Ampel links ___.", a: ["ab"] },
        { t: "fill", q: "___ Sie die zweite Straße rechts. (nehmen)", a: ["nehmen"] },
        { t: "order", words: ["Gehen", "Sie", "geradeaus", "bis", "zur", "Ampel"], a: "Gehen Sie geradeaus bis zur Ampel" },
        { t: "order", words: ["Wie", "komme", "ich", "zur", "Post"], a: "Wie komme ich zur Post" },
      ],
      dialog: {
        title: "Nach dem Weg fragen",
        lines: [
          { who: "A", de: "Entschuldigung, wie komme ich zum Bahnhof?", tr: "Affedersiniz, gara nasıl giderim?" },
          { who: "B", de: "Gehen Sie geradeaus bis zur Ampel. Dort biegen Sie links ab.", tr: "Trafik ışığına kadar dümdüz gidin. Orada sola dönün." },
          { who: "A", de: "Ist es weit?", tr: "Uzak mı?" },
          { who: "B", de: "Nein, nur fünf Minuten zu Fuß.", tr: "Hayır, yürüyerek sadece beş dakika." },
          { who: "A", de: "Vielen Dank!", tr: "Çok teşekkürler!" },
          { who: "B", de: "Gern geschehen.", tr: "Rica ederim." },
        ],
      },
      speak: [
        { task: "Bir yere nasıl gidileceğini sor (örnek: postane).", model: "Entschuldigung, wie komme ich zur Post?" },
        { task: "Yol tarif et: düz git, ışıkta sağa dön.", model: "Gehen Sie geradeaus und biegen Sie an der Ampel rechts ab." },
      ],
    },
    {
      id: "m8d",
      title: "Im Hotel",
      tr: "Otelde ve tatil kartpostalı",
      goals: ["Otelde oda istemek ve rezervasyon yapmak", "Fiyat ve gece sayısını söylemek", "Kartpostal ve kısa e-posta yazmak"],
      vocab: [
        w("das", "Hotel", "otel", "Hotels"), w("das", "Einzelzimmer", "tek kişilik oda", "Einzelzimmer"),
        w("das", "Doppelzimmer", "iki kişilik oda", "Doppelzimmer"), w("der", "Gast", "misafir", "Gäste"), w("die", "Person", "kişi", "Personen"),
        w("die", "Dusche", "duş", "Duschen"), w("das", "Meer", "deniz", "Meere"),
        w("die", "Postkarte", "kartpostal", "Postkarten"), w("der", "Gruß", "selam", "Grüße"),
        v("reservieren", "rezervasyon yaptırmak"), v("bleiben", "kalmak"), v("besuchen", "ziyaret etmek"),
        v("frei", "boş, müsait"), v("pro", "başına"), v("Viele Grüße", "sevgiler / saygılar (mektup sonu)"),
      ],
      grammar: [
        {
          title: "Otelde konuşmak",
          body: "Oda sormak için: 'Haben Sie ein Zimmer frei?' (Boş odanız var mı?). Rezervasyon: 'Ich möchte ein Doppelzimmer für drei Nächte reservieren.' Kaç kişilik: 'Für zwei Personen.' Fiyat: 'Das macht 95 Euro pro Nacht.' 'für' + Akkusativ: für drei Nächte, für zwei Personen. 'mit Frühstück' = kahvaltılı.",
          tables: [],
        },
        {
          title: "Kartpostal ve kısa e-posta",
          body: "Hitap: 'Liebe Anna,' (kadına) / 'Lieber Tom,' (erkeğe). Resmi yazıda: 'Guten Tag,' ya da 'Sehr geehrte Damen und Herren,'. Bitiş: 'Viele Grüße' ya da 'Bis bald'. Altına adını yaz. Kısa, düz cümleler yeterlidir; fiil ikinci sırada kalır.",
          tables: [
            { head: "Hitap ve bitiş", rows: [["arkadaşa", "Liebe Anna, ... Deine Mia"], ["erkek arkadaşa", "Lieber Tom, ... Dein Ali"], ["resmi", "Guten Tag, ... Viele Grüße, Ali Yılmaz"]] },
          ],
        },
      ],
      examples: [
        { de: "Haben Sie ein Zimmer frei?", tr: "Boş odanız var mı?" },
        { de: "Ich möchte ein Doppelzimmer für drei Nächte reservieren.", tr: "Üç gece için iki kişilik bir oda ayırtmak istiyorum." },
        { de: "Das Zimmer hat eine Dusche und kostet 95 Euro pro Nacht.", tr: "Odada duş var ve gecesi 95 euro." },
        { de: "Viele Grüße aus Antalya!", tr: "Antalya'dan sevgiler!" },
        { de: "Wir bleiben eine Woche am Meer.", tr: "Bir hafta denizin kıyısında kalıyoruz." },
      ],
      exercises: [
        { t: "mc", q: "'das Doppelzimmer' ne demek?", opts: ["Tek kişilik oda", "İki kişilik oda", "Banyo", "Resepsiyon"], a: 1 },
        { t: "mc", q: "'Haben Sie ein Zimmer frei?' ne anlama gelir?", opts: ["Oda ücretsiz mi?", "Boş odanız var mı?", "Odanız temiz mi?", "Odayı açar mısınız?"], a: 1 },
        { t: "mc", q: "Arkadaşına yazdığın kartpostalı nasıl bitirirsin?", opts: ["Sehr geehrte Damen und Herren", "Viele Grüße", "Guten Tag", "Entschuldigung"], a: 1 },
        { t: "fill", q: "Ich möchte ein Zimmer ___. (rezervasyon yaptırmak)", a: ["reservieren"] },
        { t: "fill", q: "Das Zimmer kostet 95 Euro ___ Nacht. (başına)", a: ["pro"] },
        { t: "fill", q: "Ein Doppelzimmer ___ drei Nächte, bitte. (için)", a: ["für", "fuer"] },
        { t: "fill", q: "___ Anna, viele Grüße aus Antalya! (Sevgili – kadına)", a: ["liebe"] },
        { t: "fill", q: "Haben Sie ein Zimmer ___? (boş)", a: ["frei"] },
        { t: "order", words: ["Haben", "Sie", "ein", "Zimmer", "frei"], a: "Haben Sie ein Zimmer frei" },
        { t: "order", words: ["Das", "macht", "neunzig", "Euro", "pro", "Nacht"], a: "Das macht neunzig Euro pro Nacht" },
      ],
      dialog: {
        title: "An der Rezeption",
        lines: [
          { who: "A", de: "Guten Abend. Haben Sie ein Zimmer frei?", tr: "İyi akşamlar. Boş odanız var mı?" },
          { who: "B", de: "Ja. Für wie viele Personen?", tr: "Evet. Kaç kişilik?" },
          { who: "A", de: "Für zwei Personen, für drei Nächte.", tr: "İki kişilik, üç gece için." },
          { who: "B", de: "Möchten Sie ein Doppelzimmer mit Frühstück?", tr: "Kahvaltılı bir iki kişilik oda ister misiniz?" },
          { who: "A", de: "Ja, bitte. Was kostet das?", tr: "Evet lütfen. Ne kadar tutuyor?" },
          { who: "B", de: "Das macht 95 Euro pro Nacht.", tr: "Gecesi 95 euro." },
          { who: "A", de: "Gut, ich nehme das Zimmer.", tr: "Tamam, odayı alıyorum." },
        ],
      },
      speak: [
        { task: "Resepsiyonda üç gece için iki kişilik oda iste.", model: "Guten Tag. Ich möchte ein Doppelzimmer für drei Nächte reservieren." },
        { task: "Fiyatı sor.", model: "Was kostet das Zimmer pro Nacht?" },
      ],
      write: [
        {
          task: "Tatilden bir arkadaşına kartpostal yaz (3–4 cümle: hava, otel, ne yapıyorsun).",
          model: "Liebe Anna,\nviele Grüße aus Antalya! Das Wetter ist schön und das Hotel ist gemütlich. Wir schwimmen jeden Tag im Meer.\nBis bald!\nDeine Mia",
        },
        {
          task: "Otele kısa bir e-posta yaz: üç gece için iki kişilik oda iste ve fiyatı sor.",
          model: "Guten Tag,\nich möchte ein Doppelzimmer für drei Nächte reservieren. Haben Sie ein Zimmer frei? Was kostet es mit Frühstück?\nVielen Dank und viele Grüße\nAli Yılmaz",
        },
      ],
    },
  ],
};
