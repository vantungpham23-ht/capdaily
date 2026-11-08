import { Category, LocalizedSlot } from '@/types';

/**
 * Short, trend-first caption bank.
 *
 * A caption is assembled as:   hook [+ tail] [+ trend word]  + emoji
 *
 * Everything is intentionally SHORT (roughly 3-9 words) because that is what
 * performs on Instagram / TikTok right now: a punchy one-liner, a trend word,
 * and an emoji. Long paragraphs get scrolled past.
 *
 * Each slot carries 3 languages:
 *   - sk.text : Slovak caption (published)
 *   - en.text : English caption (published)
 *   - *.vi    : Vietnamese translation (display only, never copied)
 *
 * The hook x tail combination gives |hooks| x |tails| distinct captions per
 * category and language, which is what powers the "no repeat for 30 days"
 * guarantee.
 */
export interface SlotBank {
  hooks: LocalizedSlot[];
  tails: LocalizedSlot[];
}

/** Helper: build a fully trilingual slot. */
function t(sk: string, en: string, vi: string): LocalizedSlot {
  return { sk: { text: sk, vi }, en: { text: en, vi } };
}

/**
 * Generic call-to-action tails shared by every category.
 * Category-specific tails are defined per category below and merged in.
 */
const SHARED_TAILS: LocalizedSlot[] = [
  t('☝️ link v bio', '☝️ link in bio', 'link trong bio'),
  t('pozrite sa', 'look at this', 'nhìn nè'),
  t('obľúbené?', 'a favourite?', 'yêu thích?'),
  t('tag niekoho, kto to potrebuje', 'tag someone who needs this', 'tag người cần nè'),
  t('v dnešnej postave', 'in today\u2019s mood', 'đúng tâm trạng hôm nay'),
  t('neprezdím', 'not skipping this', 'không bỏ qua được'),
  t('nechajte to tak', 'keep it', 'giữ lại nha'),
  t('niečo pre vás', 'something for you', 'một món cho các bạn'),
  t('kde to vzniklo', 'where it started', 'nơi bắt nguồn'),
];

export const CAPTION_SLOTS: Record<Category, SlotBank> = {
  /* ------------------------------------------------------------------ */
  /* NAILS                                                              */
  /* ------------------------------------------------------------------ */
  nails: {
    hooks: [
      t('nechty ako z Pinterestu', 'nails straight out of Pinterest', 'móng tay lấy từ Pinterest'),
      t('glam, ktorý uvidíš všade', 'glam you will see everywhere', 'vẻ glam thấy ở khắp nơi'),
      t('french tips, ale jemnejšie', 'french tips but softer', 'kiểu Pháp nhưng nhẹ hơn'),
      t('obľúbenec tohto týždňa', 'the favourite of this week', 'món được yêu thích tuần này'),
      t('short & sweet', 'short & sweet', 'ngắn và ngọt'),
      t('tri týždne a stále perfekt', 'three weeks and still perfect', 'ba tuần rồi vẫn hoàn hảo'),
      t('chrome energy', 'chrome energy', 'vibe chrome'),
      t('chcem všetky', 'I want them all', 'tôi muốn có tất cả'),
      t('tento lak si zoberiem domov', 'taking this polish home', 'màu này tôi sẽ mang về nhà'),
      t('main character nechty', 'main character nails', 'móng main character'),
      t('zlatý hodiny, ale pre nechty', 'golden hour but for nails', 'giờ vàng nhưng cho móng tay'),
      t('moje obľúbené combo', 'my favourite combo', 'combo yêu thích của tôi'),
      t('hot girl, cool nails', 'hot girl, cool nails', 'xinh đẹp, móng vẫn cool'),
      t('nechty, ktoré chcem vidieť znova', 'nails I want to see again', 'móng muốn được nhìn lần nữa'),
      t('mäkké ružové, tvrdý charakter', 'soft pink, hard character', 'hồng nhạt, tính cách mạnh'),
      t('nehybám sa, kým sa nechci', 'not moving, not caring', 'không nhúc nhích, không quan tâm'),
      t('tipy, na ktoré ste čakali', 'the tips you waited for', 'mẹo mà bạn đã chờ đợi'),
      t('výnimočný deň, výnimočné nechty', 'extraordinary day, extraordinary nails', 'ngày đặc biệt, móng đặc biệt'),
      t('self care, ale viditeľne', 'self care, but make it visible', 'chăm sóc bản thân, nhưng thấy được'),
      t('naked, ale nie nud', 'naked, but not nude', 'nude nhưng không trần'),
      t('lesklé, nie lesklé', 'shiny, not shiny', 'bóng mà không bóng'),
      t('obľúbené nechty, opäť', 'favourite nails, again', 'móng yêu thích, lần nữa'),
      t('čo sa hodí, to sa nosí', 'what fits, gets worn', 'đẹp là mặc'),
      t('nechty do práce aj na párty', 'nails for work and for parties', 'móng cho công việc lẫn tiệc'),
      t('black never disappoints', 'black never disappoints', 'đen không bao giờ thất vọng'),
      t('jeden nádych, dva nechty', 'one breath, two nails', 'một hơi thở, hai móng'),
      t('môj kyslík', 'my oxygen', 'oxy của tôi'),
      t('takto vyzerá spokojnosť', 'this is what contentment looks like', 'đây là hạnh phúc'),
      t('som v tom, nechajte ma', 'I am in it, leave me alone', 'tôi đang chìm trong đó, đừng làm phiền'),
      t('toto si nechám', 'keeping these', 'cái này tôi giữ lại'),
      t('menej je viac', 'less is more', 'ít hơn là nhiều hơn'),
      t('perfect nie je náhoda', 'perfect is not an accident', 'hoàn hảo không phải ngẫu nhiên'),
      t('nechty, ktoré sa páčia aj mne', 'nails I actually like', 'móng tôi thực sự thích'),
      t('takto to má byť', 'this is how it should be', 'đáng lẽ phải thế này'),
      t('body but for your hands', 'body but for your hands', 'body nhưng cho đôi tay'),
      t('mám prsty, mám nechty', 'I have fingers, I have nails', 'có ngón, có móng'),
      t('nechty vo výške luxusu', 'nails at luxury level', 'móng ở tầm cao cấp'),
      t('kde su tie nechty', 'where are those nails', 'mấy cái móng đó rồi'),
      t('môj obľúbený rozmer', 'my favourite size', 'kích cỡ yêu thích'),
      t('krátke, ostré, drahé', 'short, sharp, expensive', 'ngắn, sắc, đắt'),
      t('len vtedy, keď je toto', 'only when it is this', 'chỉ khi là thế này'),
      t('nechty ako výraz', 'nails as a statement', 'móng tay như một tuyên bố'),
      t('happy friday, krásne nechty', 'happy friday, pretty nails', 'thứ sáu vui, móng đẹp'),
    ],
    tails: [
      t('recept DM', 'DM for the polish', 'nhắn để xin màu'),
      t('objednajte si termín', 'book your slot', 'đặt lịch nha'),
      t('spýtaj sa', 'just ask', 'cứ hỏi'),
      ...SHARED_TAILS,
    ],
  },

  /* ------------------------------------------------------------------ */
  /* HAIR MEN                                                            */
  /* ------------------------------------------------------------------ */
  'hair-men': {
    hooks: [
      t('strih, ktorý zmení všetko', 'the cut that changes everything', 'kiểu cắt thay đổi tất cả'),
      t('fade season', 'fade season', 'mùa fade'),
      t('barber magic', 'barber magic', 'phép thuật của barber'),
      t('dneska iný človek', 'different person today', 'hôm nay là người khác'),
      t('ostré a čisté', 'sharp and clean', 'sắc và gọn'),
      t('textúra, ktorá drží', 'texture that holds', 'kết cấu giữ dáng'),
      t('buzz a be cool', 'buzz and be cool', 'buzz và tỏa sáng'),
      t('mullet is back', 'the mullet is back', 'mullet đã quay lại'),
      t('undercut energy', 'undercut energy', 'vibe undercut'),
      t('som v tom', 'I am in it', 'tôi đang chơi'),
      t('moje vlasy, moje pravidlá', 'my hair, my rules', 'tóc tôi, luật của tôi'),
      t('strih bez diskusie', 'no debate, just the cut', 'không bàn, cứ cắt'),
      t('pánsky fresh', 'men look fresh', 'đàn ông trông mới'),
      t('takto to vyzerá lepšie', 'this is how it looks better', 'thế này đẹp hơn'),
      t('kompletná zmena', 'complete change', 'thay đổi hoàn toàn'),
      t('nechajte ma takto', 'leave me like this', 'cứ để tôi thế này'),
      t('tri týždne dobreho vzhľadu', 'three weeks of looking good', 'ba tuần đẹp trai'),
      t('strih, ktorý sedí', 'a cut that fits', 'kiểu cắt vừa khít'),
      t('žiadne kompromisy', 'no compromises', 'không thỏa hiệp'),
      t('páni idú do remake', 'men are getting a remake', 'đàn ông đi làm mới'),
      t('svieži štýl', 'fresh style', 'phong cách mới'),
      t('menej, ale lepšie', 'less but better', 'ít mà hơn'),
      t('budúci ty, teraz', 'future me, now', 'tương lai của tôi, ngay bây giờ'),
      t('dobre padnúce vlasy', 'hair that fits', 'tóc hợp'),
      t('nový strih, nový štýl', 'new cut, new style', 'cắt mới, phong cách mới'),
      t('ostré hrany mäkké farby', 'sharp edges, soft tones', 'góc sắc, tông mềm'),
      t('toto je môj sign', 'this is my signature', 'đây là đặc trưng của tôi'),
      t('vlasy, ktoré držia', 'hair that holds its shape', 'tóc giữ dáng'),
      t('dnes som extra', 'extra today', 'hôm nay tôi extra'),
      t('komfort verzus štýl', 'comfort meets style', 'thoải mái gặp phong cách'),
      t('pánska elegance, žiadne starosti', 'menswear, no worries', 'phong cách nam, không lo'),
      t('svieži výraz', 'fresh expression', 'biểu cảm mới'),
      t('strih na mieru', 'cut to measure', 'cắt theo đo'),
      t('konečne som spokojný', 'finally happy with it', 'cuối cùng tôi hài lòng'),
      t('wow factor, ale tichý', 'wow factor, quietly', 'gây ấn tượng, nhưng tinh tế'),
      t('najviac mu hovoria vlasy', 'your hair says the most', 'tóc nói nhiều nhất'),
      t('takto sa cítim', 'this is how I feel', 'tôi cảm thấy thế này'),
      t('denný upgrade', 'daily upgrade', 'nâng cấp mỗi ngày'),
      t('kto hovorí, že nie', 'who says no', 'ai nói không'),
      t('výraz, ktorý budeš cítiť', 'a look you will feel', 'vẻ ngoài bạn sẽ cảm nhận'),
      t('konečne niečo iné', 'finally something different', 'cuối cùng khác đi một chút'),
      t('zlaté pravidlo', 'the golden rule', 'quy tắc vàng'),
      t('toto musím povedať', 'had to share this', 'phải chia sẻ đi'),
    ],
    tails: [
      t('recept DM', 'DM for details', 'nhắn để xin chi tiết'),
      t('objednajte si čas', 'book your time', 'đặt lịch nha'),
      t('koho zvoniem', 'who do I call', 'gọi ai đây'),
      ...SHARED_TAILS,
    ],
  },

  /* ------------------------------------------------------------------ */
  /* HAIR WOMEN                                                          */
  /* ------------------------------------------------------------------ */
  'hair-women': {
    hooks: [
      t('vlasy hovoria, nechajte ich', 'let the hair do the talking', 'để mái tóc nói thay'),
      t('balayage, ktoré svieti', 'balayage that glows', 'balayage tỏa sáng'),
      t('wolf cut, ale jemnejšie', 'wolf cut but softer', 'wolf cut nhưng nhẹ hơn'),
      t('dneska vlásen', 'hair goals today', 'hôm nay tóc đẹp trai'),
      t('lesklé, zdravé, štíhlé', 'shiny, healthy, sleek', 'bóng, khỏe, mượt'),
      t('môj obľúbený look', 'my signature look', 'vẻ ngoài đặc trưng của tôi'),
      t('raz, dva, zmenené', 'one, two, transformed', 'một, hai, biến đổi'),
      t('zlatý hodiny, ale pre vlasy', 'golden hour but for hair', 'giờ vàng nhưng cho tóc'),
      t('nový strih, nová energia', 'new cut, new energy', 'cắt mới, năng lượng mới'),
      t('vlnky, ktoré neposlúchajú', 'waves that do not listen', 'sóng không nghe lời'),
      t('konečne som spokojná', 'finally happy with it', 'cuối cùng tôi hài lòng'),
      t('moja hair era', 'my hair era', 'era tóc của tôi'),
      t('len pre seba', 'just for me', 'chỉ cho bản thân'),
      t('takto to má byť', 'this is how it should be', 'đáng lẽ phải thế này'),
      t('niekto sa spýtal', 'someone asked', 'có người hỏi'),
      t('chcem si to nechať', 'keeping this one', 'cái này tôi giữ lại'),
      t('textúra, ktorá žije', 'texture with life', 'kết cấu sống động'),
      t('menej je viac', 'less is more', 'ít hơn là nhiều hơn'),
      t('údržba, ktorá nezaberie', 'maintenance that takes no time', 'chăm sóc tốn ít thời gian'),
      t('strih, ktorý rastie s vami', 'a cut that grows out with you', 'kiểu cắt đẹp khi tóc dài lên'),
      t('fringe, ktoré funguje', 'a fringe that actually works', 'tóc mái thực sự hợp'),
      t('svieži, čistý, môj', 'fresh, clean, mine', 'mới, sạch, của tôi'),
      t('môj hrejšok', 'my armour', 'giáp của tôi'),
      t('takto sa cítim', 'this is how I feel', 'tôi cảm thấy thế này'),
      t('kde su tie vlasy', 'where did those curls go', 'mấy cái tóc xoăn đó rồi'),
      t('nový look, nový vibe', 'new look, new vibe', 'look mới, vibe mới'),
      t('long hair energy', 'long hair energy', 'vibe tóc dài'),
      t('dokonalé odtieňe', 'perfect tones', 'tông màu hoàn hảo'),
      t('kto hovorí, že nie', 'who says no', 'ai nói không'),
      t('môj každodenný reboot', 'my daily reboot', 'khởi động lại mỗi ngày'),
      t('dneska som iná', 'a different me today', 'hôm nay tôi khác'),
      t('takto vyzerá dobrý deň', 'this is what a good day looks like', 'đây là ngày đẹp'),
      t('konečne', 'finally', 'cuối cùng'),
      t('wow, len takto', 'wow, just like this', 'wow, đúng kiểu này'),
      t('skutočný self care', 'actual self care', 'self care thật sự'),
      t('toto musím povedať', 'had to share this', 'phải chia sẻ đi'),
      t('moja zlatá formula', 'my golden formula', 'công thức vàng của tôi'),
      t('strih, ktorý vám sedí', 'a cut that suits you', 'kiểu cắt hợp với bạn'),
      t('menej stresu, viac vlasov', 'less stress, more hair', 'ít stress, nhiều tóc'),
      t('svieža energia', 'fresh energy', 'năng lượng mới'),
      t('ideálny sprievodca', 'the perfect guide', 'người dẫn đường hoàn hảo'),
      t('nikto to nevymyslel', 'nobody invented this', 'không ai nghĩ ra'),
    ],
    tails: [
      t('recept DM', 'DM for the recipe', 'nhắn để xin công thức'),
      t('objednajte si čas', 'book your slot', 'đặt lịch nha'),
      t('koho zvoniem', 'who do I call', 'gọi ai đây'),
      ...SHARED_TAILS,
    ],
  },

  /* ------------------------------------------------------------------ */
  /* RESTAURANT                                                          */
  /* ------------------------------------------------------------------ */
  restaurant: {
    hooks: [
      t('dneska varíme s láskou', 'cooking with love today', 'hôm nay nấu với tình yêu'),
      t('domáca kuchyňa, otvorená kuchyňa', 'home cooking, open kitchen', 'bếp nhà, bếp mở'),
      t('to tu smrdí fantasticky', 'this smells incredible', 'mùi này thơm phức'),
      t('príďte na chvíľu pre seba', 'come for a moment for yourself', 'đến dành chút cho mình'),
      t('dnešné menu hovorí', 'today\u2019s menu is talking', 'menu hôm nay đang nói'),
      t('čerstvé, lokálne, sezónne', 'fresh, local, seasonal', 'tươi, địa phương, theo mùa'),
      t('všetko doma', 'everything homemade', 'tất cả tự làm'),
      t('chutný zážitok', 'a tasty experience', 'một trải nghiệm thơm ngon'),
      t('od farmy na stôl', 'from the farm to the table', 'từ nông trại đến bàn ăn'),
      t('recepty po generácie', 'family recipes', 'công thức truyền thống'),
      t('najviac obľúbené', 'the most ordered', 'món được gọi nhiều nhất'),
      t('dneska odporúčame', 'today\u2019s recommendation', 'hôm nay chúng tôi đề xuất'),
      t('príďte ochutnať', 'come and taste', 'mời đến nếm thử'),
      t('všetko pripravené denne', 'made fresh daily', 'làm mới mỗi ngày'),
      t('comfort food, ale level', 'comfort food, but elevated', 'món comfort, nhưng nâng cao'),
      t('kde vám chodíte na večeru', 'where do you go for dinner', 'bạn đi ăn tối ở đâu'),
      t('takto to vyzerá sviatok', 'this is what a celebration looks like', 'đây là dịp ăn mừng'),
      t('chutí, ktoré zostáva', 'a flavour that lingers', 'hương vị còn lại'),
      t('nový týžden, nové chute', 'new week, new flavours', 'tuần mới, hương vị mới'),
      t('zelenina, ale vôňa', 'vegetables, but make it flavourful', 'rau củ, nhưng đầy hương vị'),
      t('domáce jedlo, úprimne', 'homemade food, honestly', 'đồ ăn nhà, thật lòng'),
      t('neskôr, to si chcem zopakovať', 'I will order this again', 'tôi sẽ gọi món này lại'),
      t('sladké rozhodnutie', 'a sweet decision', 'quyết định ngọt'),
      t('otvoríme vám dvere', 'doors open, come in', 'cửa mở, mời vào'),
      t('každý deň má iný príbeh', 'every day is a new story', 'mỗi ngày một câu chuyện'),
      t('kvalita, ktorá chuť zistí', 'quality you can taste', 'chất lượng cảm nhận được'),
      t('niečo pre vegetariánov', 'something for the vegetarians', 'có món cho người ăn chay'),
      t('voda, chlieb, chuť', 'water, bread, taste', 'nước, bánh mì, hương vị'),
      t('najlepšie menu dne', 'best menu of the day', 'menu ngon nhất hôm nay'),
      t('sedíme vonku', 'we are outside today', 'hôm nay ngồi ngoài trời'),
      t('kuchyňa otvorená pre vás', 'the kitchen is open for you', 'bếp mở cho bạn'),
      t('dneska bez chytania', 'no phones at the table today', 'hôm nay không cầm điện thoại'),
      t('kde to varíme', 'where we cook', 'nơi chúng tôi nấu'),
      t('na stole každý deň', 'on the table every day', 'trên bàn mỗi ngày'),
      t('malé menu, veľká chuť', 'small menu, big flavour', 'menu nhỏ, hương vị lớn'),
      t('všetko pripravené zo srdca', 'everything made from the heart', 'mọi món đều chuẩn bị từ trái tim'),
      t('toto je náš recept', 'this is our recipe', 'đây là công thức của chúng tôi'),
      t('nenechajte si ujsť', 'do not miss this', 'đừng bỏ lỡ'),
      t('chutný dnes', 'tasty today', 'ngon đây'),
    ],
    tails: [
      t('☝️ rezervujte stôl', '☝️ book a table', 'đặt bàn nha'),
      t('recept DM', 'DM for the recipe', 'nhắn để xin công thức'),
      t('kde to varíme', 'where we cook', 'nơi chúng tôi nấu'),
      ...SHARED_TAILS,
    ],
  },

  /* ------------------------------------------------------------------ */
  /* EYELASH                                                             */
  /* ------------------------------------------------------------------ */
  eyelash: {
    hooks: [
      t('oči, ktoré nepotrebujú filter', 'eyes that need no filter', 'đôi mắt không cần filter'),
      t('mihalnice, ktoré neukážu', 'lashes that hide nothing', 'lông mi không giấu gì'),
      t('doll eye, ale natural', 'doll eye but natural', 'doll eye nhưng tự nhiên'),
      t('výraz, ktorý drží celý deň', 'a look that lasts all day', 'vẻ ngoài bền cả ngày'),
      t('len sa mi otvorili oči', 'they opened my eyes', 'mở toang mắt tôi'),
      t('mihalnice ako z reklámky', 'lashes from a fairytale', 'lông mi như trong truyện'),
      t('bezbolestné, ale wow', 'painless, but wow', 'không đau, nhưng ấn tượng'),
      t('cat eye energy', 'cat eye energy', 'vibe mắt mèo'),
      t('prirodzene, ale výrazne', 'natural but bold', 'tự nhiên mà nổi bật'),
      t('to som si dala spraviť', 'got these done', 'cái này tôi làm rồi nha'),
      t('zrkadlo sa nemôže nemilovať', 'the mirror loves it', 'gương không thể không yêu'),
      t('wow, len takto', 'wow, just like this', 'wow, đúng kiểu này'),
      t('mihalnice z bavlny, ale takto', 'lashes from cotton, but like this', 'lông mi từ bông, nhưng thế này'),
      t('raz a done', 'one and done', 'một lần là xong'),
      t('dneska som iná osoba', 'a different person today', 'hôm nay tôi là người khác'),
      t('mihalnice hovoria, nechajte ich', 'let the lashes do the talking', 'để lông mi nói thay'),
      t('krajina, ktorá nepotrebuje pečiatku', 'a look that needs no stamp', 'vẻ ngoài không cần con dấu'),
      t('volume, ktoré drží', 'volume that holds', 'volume giữ dáng'),
      t('odlišujúci detail', 'the finishing detail', 'chi tiết phân biệt'),
      t('dneska si zaslúžim', 'I deserve this today', 'hôm nay tôi xứng đáng'),
      t('svieže, ľahké, prirodzené', 'fresh, light, natural', 'mới, nhẹ, tự nhiên'),
      t('každé oko má svoje', 'every eye has its own', 'mỗi đôi mắt có kiểu riêng'),
      t('mihalnice, ktoré sa páčia aj mne', 'lashes I actually like', 'lông mi tôi thực sự thích'),
      t('toto musím povedať', 'had to share this', 'phải chia sẻ đi'),
      t('trend, ktorý zostáva', 'a trend that stays', 'xu hướng bền lâu'),
      t('môj každodenný upgrade', 'my daily upgrade', 'nâng cấp mỗi ngày'),
      t('kde su tie mihalnice', 'where did those lashes go', 'mấy cái lông mi đó rồi'),
      t('takto to chcem mať', 'this is what I want', 'tôi muốn thế này'),
      t('pol hodiny, obrovský rozdiel', 'half an hour, huge difference', 'nửa tiếng, khác biệt lớn'),
      t('spokojná, viac nechcem', 'happy, do not want more', 'hài lòng, không cần thêm'),
      t('mihalnice, ktoré nechávajú stopy', 'lashes that leave an impression', 'lông mi để lại ấn tượng'),
      t('každý deň iný vibe', 'a different vibe every day', 'mỗi ngày một vibe'),
      t('menej je viac', 'less is more', 'ít hơn là nhiều hơn'),
      t('niečo pre vás', 'something for you', 'một món cho các bạn'),
      t('kto hovorí, že nie', 'who says no', 'ai nói không'),
      t('krása začína tu', 'beauty starts here', 'vẻ đẹp bắt đầu từ đây'),
      t('len jedna vec', 'just one thing', 'chỉ một điều'),
      t('wow moment', 'a wow moment', 'khoảnh khắc ấn tượng'),
      t('perfektný detail', 'the perfect detail', 'chi tiết hoàn hảo'),
      t('nový obraz', 'new look, new energy', 'diện mạo mới'),
      t('takto to vyzerá dobrý deň', 'this is what a good day looks like', 'đây là ngày đẹp'),
    ],
    tails: [
      t('recept DM', 'DM for details', 'nhắn để xin chi tiết'),
      t('objednajte si konzultáciu', 'book a consultation', 'đặt lịch tư vấn'),
      t('koho zvoniem', 'who do I call', 'gọi ai đây'),
      ...SHARED_TAILS,
    ],
  },
};

/**
 * Hashtag pools, split by tag language so we can control the mix.
 * English tags reach a broader audience on Instagram/TikTok, so they are
 * always the majority; local-language tags add local reach.
 */
export const HASHTAGS_LIBRARY: Record<Category, { en: string[]; sk: string[] }> = {
  nails: {
    en: ['#nails', '#nailart', '#manicure', '#beauty', '#naildesign', '#nailsofinstagram', '#nailstagram', '#nailswag', '#nailpolish', '#nailpro', '#nailjunkie', '#naildaily', '#nailaddict', '#nailstyle', '#glam', '#frenchtips', '#gelnails', '#shortnails', '#nailinspo', '#selfcare'],
    sk: ['#nechty', '#manikura', '#lakovanie', '#krasa', '#salonkrasy', '#nechtyzmadrymi', '#krasanails', '#naildesignsk', '#slovaknails', '#slovenskakrasa', '#starostlivost'],
  },
  'hair-men': {
    en: ['#menshair', '#haircut', '#mensstyle', '#barber', '#fade', '#hairstyle', '#gentleman', '#barbershop', '#sharpcut', '#mensgrooming', '#beards', '#barberlife', '#undercut', '#buzzcut', '#malegrooming', '#menshaircut', '#fadehaircut', '#barberstyle', '#grooming', '#beardstyle'],
    sk: ['#vlasy', '#panskystrih', '#kader', '#barberstrih', '#modnystrih', '#muzkystyl', '#vlasytendencia', '#kvalitnystrih', '#stylmuzа', '#krasavlasy'],
  },
  'hair-women': {
    en: ['#hair', '#hairstyle', '#hairgoals', '#haircut', '#balayage', '#haircolor', '#hairstylist', '#hairdo', '#hairlove', '#hairinspo', '#hairfashion', '#beautyhair', '#straighthair', '#curlyhair', '#longhair', '#hairtransformation', '#blowout', '#haircare', '#hairtrend', '#hairinspiration'],
    sk: ['#vlasy', '#uces', '#krasa', '#salon', '#vlasovystrih', '#farbenievlasov', '#balayagesk', '#trendyucesy', '#hairgoals', '#zenskeevlasy'],
  },
  restaurant: {
    en: ['#foodie', '#foodporn', '#restaurant', '#yummy', '#instafood', '#foodstagram', '#foodlover', '#delicious', '#foodblogger', '#foodphotography', '#tasty', '#eeeeeats', '#foodgasm', '#dinner', '#lunch', '#gastronomy', '#hometaste', '#chefskiss', '#foodgoals', '#goodfood'],
    sk: ['#jedlo', '#restauracia', '#chutna', '#varenie', '#domace', '#gastronomia', '#jedloupoluti', '#slovenskejedla', '#dobrijedlo', '#chefkuchar'],
  },
  eyelash: {
    en: ['#lashes', '#eyelash', '#lashextensions', '#lashgoals', '#beauty', '#makeup', '#lashiie', '#lashed', '#eyelashes', '#lashartist', '#volumelashes', '#naturallashes', '#dramaticlashes', '#dramatic', '#wispy', '#lashlift', '#lashesforall', '#eyelashartist', '#lashqueen', '#flutter'],
    sk: ['#mihalnice', '#nokie', '#krasa', '#makeupartist', '#mihalnicestudio', '#nastiekavanie', '#mihalnicetrendy', '#krasnokie', '#lashtrend', '#okrasnokie'],
  },
};

/**
 * Trending topic bank - short, punchy, currently popular styles.
 * Rotated deterministically per day so the site always feels "live".
 */
export const TRENDING_BANK: Record<Category, string[]> = {
  nails: ['soft glam', 'chrome nails', 'french tips', 'micro french', 'buttercream nails', 'blush nails', 'glazed donut', 'abstract art', 'mocha brown', 'short square', 'pearl detail', 'ombré', 'matte black', 'red theory'],
  'hair-men': ['fade', 'textured crop', 'undercut', 'slick back', 'pompadour', 'mullet', 'buzz cut', 'curtain fringe', 'taper fade', 'beard sculpting', 'shaggy layers', 'short crop', 'surfer cut', 'buzz cut'],
  'hair-women': ['wolf cut', 'balayage', 'curtain bangs', 'sleek bun', 'bixie cut', 'honey blonde', 'shag cut', 'money piece', 'glass hair', 'beach waves', 'pixie cut', 'French bob', 'bubble cut', 'layers'],
  restaurant: ['comfort food', 'brunch', 'farm to table', 'seasonal menu', 'slow food', 'street food', 'chef special', 'homemade', 'family recipes', 'tasting menu', 'good food good mood', 'food worth sharing', 'daily menu', 'local ingredients'],
  eyelash: ['cat eye', 'doll eye', 'wispy lashes', 'hybrid set', 'mega volume', 'cluster lashes', 'lash lift', 'spiky lashes', 'natural look', 'dramatic lashes', 'half lash', 'anime lashes', 'magnetic lashes', 'soft glam'],
};

/**
 * Short weekly flavour. Injected as a tiny tag-like prefix on one caption
 * of the day, e.g. "monday mood ✨".
 */
export const WEEKLY_THEMES: Record<number, LocalizedSlot> = {
  0: t('nový týžden', 'new week', 'tuần mới'),
  1: t('pondelková energia', 'monday mood', 'thứ hai rộn ràng'),
  2: t('utorok vibe', 'tuesday vibe', 'thứ ba nhẹ nhàng'),
  3: t('streda, pol týždňa', 'midweek', 'giữa tuần'),
  4: t('piatok, big plans', 'friday plans', 'thứ sáu, kế hoạch lớn'),
  5: t('víkendový režim', 'weekend mode', 'chế độ cuối tuần'),
  6: t('nedeľa pre seba', 'sunday for me', 'chủ nhật cho mình'),
};

/**
 * Short seasonal accents, appended as a tiny suffix on one caption.
 */
export const SEASONAL_ACCENTS: Record<number, LocalizedSlot> = {
  0: t('nový rok vibe', 'new year vibe', 'vibe năm mới'),
  1: t('valentine mood', 'valentine mood', 'vibe Valentine'),
  2: t('jaro je tu', 'spring is here', 'mùa xuân đến rồi'),
  3: t('veľkonočná nálada', 'easter mood', 'không khí Phục Sinh'),
  4: t('májová energia', 'may energy', 'năng lượng tháng Năm'),
  5: t('letná pohoda', 'summer ease', 'không khí hè'),
  6: t('prázdninová svoboda', 'holiday freedom', 'tự do mùa hè'),
  7: t('slnečné leto', 'sunny summer', 'mùa hè nắng vàng'),
  8: t('zlatý jeseň', 'golden autumn', 'mùa thu vàng'),
  9: t('jesenná atmosféra', 'autumn mood', 'không khí mùa thu'),
  10: t('tekutý jeseň', 'liquid autumn', 'mùa thu se'),
  11: t('sviatky sú tu', 'festive season', 'mùa lễ hội'),
};

/** Icons per category, expanded for visual variety. */
export const ICON_BANK: Record<Category, { sk: string[]; en: string[] }> = {
  nails: {
    sk: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵'],
    en: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵', '💐', '🌷'],
  },
  'hair-men': {
    sk: ['💇', '✨', '😎', '🔥', '💪', '⭐', '💯', '👌', '🖤', '⚡', '🎯', '👑'],
    en: ['💇', '✨', '😎', '🔥', '💪', '⭐', '💯', '👌', '🖤', '⚡', '🎯', '👑'],
  },
  'hair-women': {
    sk: ['💇‍♀️', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '🌷', '💐'],
    en: ['💇‍♀️', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '👩‍🦰', '👩‍🦱', '💐'],
  },
  restaurant: {
    sk: ['🍽️', '🍴', '😋', '🤤', '🥂', '🍲', '🍰', '☕', '🍳', '🫕', '🥘', '🍱', '🧁', '🥗'],
    en: ['🍽️', '🍴', '😋', '🤤', '🥂', '🍲', '🍰', '☕', '🍳', '🫕', '🥘', '🍱', '🧁', '🥗'],
  },
  eyelash: {
    sk: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫'],
    en: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '🦋', '🌟'],
  },
};

/** Extra emoji used to decorate generated captions. */
export const DECOR_EMOJIS = ['✨', '🔥', '💫', '⭐', '💖', '🌸', '💕', '💯', '🎯', '😍', '🥰', '🤍', '🩷', '💜', '🩵', '💎', '👑', '🌟'];

export const ALL_CATEGORIES: Category[] = ['nails', 'hair-men', 'hair-women', 'restaurant', 'eyelash'];
