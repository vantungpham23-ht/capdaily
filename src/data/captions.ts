import { Category, LocalizedSlot } from '@/types';

/**
 * Slot-based caption templates.
 * A caption is assembled as:  opener + body + closer
 *
 * Each slot carries 3 languages:
 *   - sk.text : Slovak caption (published)
 *   - en.text : English caption (published)
 *   - *.vi    : Vietnamese translation (display only, never copied)
 *
 * Because the three slots are combined independently, every category yields
 * |openers| x |bodies| x |closers| distinct captions (thousands), which is
 * what makes the "no repeat for 30 days" guarantee possible.
 */
export interface SlotBank {
  openers: LocalizedSlot[];
  bodies: LocalizedSlot[];
  closers: LocalizedSlot[];
}

/** Helper: build a fully trilingual slot. */
function t(sk: string, en: string, vi: string): LocalizedSlot {
  return { sk: { text: sk, vi }, en: { text: en, vi } };
}

export const CAPTION_SLOTS: Record<Category, SlotBank> = {
  nails: {
    openers: [
      t('Dokonalé nechty = sebavedomý úsmev', 'Perfect nails, confident smile', 'Móng hoàn hảo, nụ cười tự tin'),
      t('Malé detaily, veľký rozdiel', 'Small details, big difference', 'Chi tiết nhỏ, khác biệt lớn'),
      t('Vaše nechty, naša vášeň', 'Your nails, our passion', 'Đôi móng của bạn, đam mê của chúng tôi'),
      t('Krása je v detailoch', 'Beauty lives in the details', 'Vẻ đẹp nằm ở những chi tiết'),
      t('Nechty, ktoré hovoria za vás', 'Nails that speak for you', 'Móng tay thay lời nói cho bạn'),
      t('Každý nechet je umelecké dielo', 'Every nail is a little masterpiece', 'Mỗi móng tay là một tác phẩm nghệ thuật'),
      t('Efektívny deň začína dokonalými nechtami', 'A productive day starts with perfect nails', 'Ngày hiệu quả bắt đầu bằng đôi móng hoàn hảo'),
      t('Luxusná starostlivosť o vaše nechty', 'Luxury care for your nails', 'Chăm sóc móng tay cao cấp'),
      t('Keď vám ukáže ruky, každý sa pozrie', 'When you show your hands, everyone looks', 'Khi bạn giơ tay, ai cũng phải nhìn'),
      t('Vaša krása, naša starostlivosť', 'Your beauty, our care', 'Vẻ đẹp của bạn, sự chăm sóc của chúng tôi'),
      t('Nechty, ktoré dodávajú sebavedomý', 'Nails that add confidence', 'Móng tay trao thêm sự tự tin'),
      t('Oproti včerajšiemu dňu, o dve ťažšie', 'Two shades bolder than yesterday', 'Rực hơn hôm qua hai sắc độ'),
    ],
    bodies: [
      t('Pravidelná starostlivosť = krásne nechty', 'Regular care = beautiful nails', 'Chăm sóc đều đặn = móng đẹp'),
      t('Nechty ako šperky na vašich rukách', 'Nails like jewellery on your hands', 'Móng tay như trang sức trên tay bạn'),
      t('Minimalizmus, ktorý zaujme', 'Minimalism that still gets noticed', 'Tối giản mà ấn tượng'),
      t('Hravá farebnosť na vašich nechtoch', 'Playful colour on your nails', 'Màu sắc vui nhộn trên móng tay'),
      t('Prirodzená krása vašich nechtov', 'The natural beauty of your nails', 'Vẻ đẹp tự nhiên của đôi móng'),
      t('Trend, ktorý nikdy nevyjde z módy', 'A trend that never goes out of style', 'Xu hướng không bao giờ lỗi mốt'),
      t('Francúzska manikúra - klasika stále živá', 'French manicure - a classic that stays alive', 'Kiểu Pháp - kinh điển không bao giờ cũ'),
      t('Odhaľte krásu vašich rúk', 'Reveal the beauty of your hands', 'Tôn lên vẻ đẹp đôi tay bạn'),
      t('Gélová manikúra = dlhotrvácna krása', 'Gel manicure = long-lasting beauty', 'Móng gel = vẻ đẹp bền lâu'),
      t('Nechty, ktoré rozdávajú úsmevy', 'Nails that hand out smiles', 'Móng tay trao nụ cười'),
      t('Tipy, ktoré udržia nechty zdravé', 'Tips that keep your nails healthy', 'Mẹo giữ móng tay của bạn khỏe đẹp'),
      t('Ochraňte prirodzenú krásu svojich nechtov', 'Protect the natural beauty of your nails', 'Bảo vệ vẻ đẹp tự nhiên của đôi móng'),
      t('Každý detail môže zmeniť celý dojem', 'Every detail can change the whole impression', 'Mỗi chi tiết có thể đổi cả ấn tượng'),
      t('Seasonálne farby, ktoré vám sednú', 'Seasonal shades that suit you', 'Màu theo mùa hợp với bạn'),
      t('Vyberte si štýl, ktorý vám vyhovuje', 'Pick the style that feels like you', 'Chọn phong cách thuộc về bạn'),
    ],
    closers: [
      t('Príďte sa poradiť', 'Come and get your consultation', 'Hãy đến để được tư vấn'),
      t('Vitaľame vás v našom salóne', 'We welcome you in our salon', 'Chúng tôi đón bạn tại salon'),
      t('Rezervujte si svoj termín', 'Book your slot', 'Hãy đặt lịch của bạn'),
      t('Vaša spokojnosť je našou prioritou', 'Your satisfaction is our priority', 'Sự hài lòng của bạn là ưu tiên'),
      t('Objednajte sa ešte dnes', 'Book today', 'Đặt lịch ngay hôm nay'),
      t('Tešíme sa na vás', 'We look forward to seeing you', 'Chúng tôi mong được gặp bạn'),
      t('Dohodnite si čas pre seba', 'Take a moment for yourself', 'Hẹn giờ cho chính bạn'),
      t('Zistite, čo vám najviac vyhovuje', 'Find what works best for you', 'Tìm điều hợp với bạn nhất'),
    ],
  },

  'hair-men': {
    openers: [
      t('Pánsky strih, ktorý zmení váš štýl', "A men's cut that changes your style", 'Kiểu tóc nam thay đổi phong cách của bạn'),
      t('Krátke vlasy, veľký dojem', 'Short hair, big impact', 'Tóc ngắn, ấn tượng lớn'),
      t('Profesionálny strih pre moderného muža', 'Professional cut for the modern man', 'Cắt tóc chuyên nghiệp cho quý ông hiện đại'),
      t('Shave, strih, nový ty', 'Shave, cut, new you', 'Cạo, cắt, phiên bản mới của bạn'),
      t('Mužnosť v každom vlase', 'Masculinity in every strand', 'Sự nam tính trong từng sợi tóc'),
      t('Klasický strih s moderným twistom', 'Classic cut with a modern twist', 'Kiểu cổ điển với nét hiện đại'),
      t('Vlasy, ktoré definujú váš štýl', 'Hair that defines your style', 'Tóc định nghĩa phong cách của bạn'),
      t('Od školského dvora po business meeting', 'From the schoolyard to the boardroom', 'Từ sân trường đến phòng họp'),
      t('Strih, ktorý sedí na 100%', 'A cut that fits you 100%', 'Kiểu tóc vừa khít 100%'),
      t('Pánska eleganc na dosah', 'Menswear elegance within reach', 'Lịch lãm đàn ông trong tầm tay'),
      t('Dobré vlasy hovoria za vás', 'Good hair does the talking', 'Mái tóc đẹp nói thay bạn'),
      t('Čas na refresh vášho vzhľadu', 'Time to refresh your look', 'Đã đến lúc làm mới diện mạo'),
      t('Strih podľa vás, presne tak', 'A cut that is yours, exactly', 'Kiểu cắt riêng của bạn, chính xác'),
    ],
    bodies: [
      t('Faded, tapered, whatever you need', 'Faded, tapered, whatever you need', 'Fade, taper, bất cứ gì bạn cần'),
      t('Fade haircut, confidence boost', 'Fade haircut, confidence boost', 'Cắt fade, tăng sự tự tin'),
      t('Vlasy ako z filmu', 'Hair straight out of a movie', 'Tóc như trong phim'),
      t('Sharp look for sharp guys', 'Sharp look for sharp guys', 'Vẻ ngoài sắc nét cho phái mạnh'),
      t('Minimalistický štýl pre mužov', 'Minimal style for men', 'Phong cách tối giản cho đàn ông'),
      t('Barber precision, every time', 'Barber precision, every time', 'Độ chính xác của barber, mỗi lần'),
      t('Moderný muž, moderný strih', 'Modern man, modern cut', 'Người đàn ông hiện đại, kiểu tóc hiện đại'),
      t('Strih, ktorý hovorí za vás', 'A cut that speaks for you', 'Kiểu tóc thay lời nói'),
      t('Buzz cut, clean vibes', 'Buzz cut, clean vibes', 'Cắt buzz, phong cách gọn gàng'),
      t('Undercut, statement look', 'Undercut, statement look', 'Undercut, phong cách ấn tượng'),
      t('Vlasy v kondícii = lepšia nálada', 'Good hair days, good mood days', 'Tóc khỏe đẹp = tâm trạng tốt hơn'),
      t('Mužský štýl, žiadne kompromisy', 'Mens style, zero compromises', 'Phong cách nam giới, không thỏa hiệp'),
      t('Textúra, ktorá drží tvar', 'Texture that holds the shape', 'Kết cấu giữ dáng hoàn hảo'),
      t('Údržba, ktorá nezaberie veľa času', 'Maintenance that takes no time', 'Cách chăm sóc tốn ít thời gian'),
      t('Stríh, ktorý rastie s vami', 'A cut that grows out with you', 'Kiểu cắt đẹp khi tóc dài lên'),
    ],
    closers: [
      t('Vitaľame vás v barber shope', 'Welcome to the barber shop', 'Chúng tôi đón bạn tại barber shop'),
      t('Rezervujte si čas', 'Book your time', 'Hãy đặt lịch'),
      t('Dohodnite si čas pre seba', 'Take a moment for yourself', 'Hẹn giờ cho chính bạn'),
      t('Tešíme sa na vás', 'We look forward to seeing you', 'Chúng tôi mong được gặp bạn'),
      t('Príďte relaxovať, my sa postaráme', 'Come relax, we handle the rest', 'Hãy đến thư giãn, chúng tôi lo phần còn lại'),
      t('Vaša objednávka je dôležitá', 'Your booking matters to us', 'Đơn đặt hàng của bạn là quan trọng'),
      t('Príďte a presvedčte sa', 'Come see for yourself', 'Hãy đến và tự kiểm chứng'),
    ],
  },

  'hair-women': {
    openers: [
      t('Nový účes = nová energia', 'New hair, new energy', 'Kiểu tóc mới = năng lượng mới'),
      t('Vlasy, ktoré menia celý look', 'Hair that changes the whole look', 'Tóc thay đổi toàn bộ diện mạo'),
      t('Profesionálna starostlivosť o vaše vlasy', 'Professional care for your hair', 'Chăm sóc tóc chuyên nghiệp'),
      t('Farbenie, ktoré vás transformuje', 'Colour that transforms you', 'Nhuộm tóc biến đổi bạn'),
      t('Strih, ktorý sedí vašej osobnosti', 'A cut that fits your personality', 'Kiểu cắt phù hợp cá tính bạn'),
      t('Zdravé vlasy = sebavedomý vzhľad', 'Healthy hair = confident look', 'Tóc khỏe = vẻ ngoài tự tin'),
      t('Od nudného k úžasnému', 'From plain to fabulous', 'Từ nhàm chán đến tuyệt vời'),
      t('Vlasy ako z reklamy', 'Hair straight out of a campaign', 'Tóc như trong quảng cáo'),
      t('Každý strih je nový začiatok', 'Every cut is a fresh start', 'Mỗi kiểu cắt là khởi đầu mới'),
      t('Účes, ktorý vám pristane', 'A hairstyle that suits you', 'Kiểu tóc hợp với bạn'),
      t('Dneska si zaslúžite byť úžasná', 'Today you deserve to look amazing', 'Hôm nay bạn xứng đáng được xinh đẹp'),
      t('Čas dať vlasom nový život', 'Time to give your hair a new life', 'Đã đến lúc cho mái tóc một cuộc đời mới'),
      t('Každý deň iný vibe, iné vlasy', 'A different vibe every day', 'Mỗi ngày một phong cách khác nhau'),
    ],
    bodies: [
      t('Krásne vlasy nepotrebujú veľa', 'Beautiful hair needs less than you think', 'Tóc đẹp không cần nhiều'),
      t('Minimalistická krása vašich vlasov', 'The minimalist beauty of your hair', 'Vẻ đẹp tối giản của mái tóc'),
      t('Trendové farby tejto sezóny', "This season's trend colours", 'Màu xu hướng mùa này'),
      t('Balayage, ktorý ohromí', 'Balayage that turns heads', 'Balayage ấn tượng'),
      t('Jemné vlny pre jemnú dušu', 'Soft waves for a soft soul', 'Sóng nhẹ cho tâm hồn nhẹ nhàng'),
      t('Rovné vlasy, čistá elegancia', 'Straight hair, pure elegance', 'Tóc thẳng, thanh lịch thuần khiết'),
      t('Kučery, ktoré definujú osobnosť', 'Curls that define your personality', 'Tóc xoăn định nghĩa cá tính bạn'),
      t('Dlhé vlasy, večná elegancia', 'Long hair, endless elegance', 'Tóc dài, thanh lịch vĩnh cửu'),
      t('Objem tam, kde ho potrebujete', 'Volume exactly where you need it', 'Tạo volume nơi bạn cần'),
      t('Ležérny štýl pre každý deň', 'Effortless style for every day', 'Phong cách casual mỗi ngày'),
      t('Večerný look pre špeciálne príležitosti', 'An evening look for special occasions', 'Diện tối cho dịp đặc biệt'),
      t('Blowout, ktorý vás zalúpi', 'A blowout worth melting for', 'Blowout khiến bạn mê mẩn'),
      t('Farbenie, ktoré rozhovorí', 'Colour that speaks volumes', 'Nhuộm tóc đầy ấn tượng'),
      t('Vlasová starostlivosť, ktorá vidno', 'Hair care you can actually see', 'Chăm sóc tóc thấy rõ kết quả'),
      t('Textúra, ktorú cítiť aj vidieť', 'Texture you can feel and see', 'Kết cấu vừa cảm được vừa thấy được'),
    ],
    closers: [
      t('Príďte si dať poradiť', 'Come get your consultation', 'Hãy đến để được tư vấn'),
      t('Rezervujte si svoj termín', 'Book your slot', 'Hãy đặt lịch của bạn'),
      t('Vitaľame vás u nás', 'We would love to see you', 'Chúng tôi rất muốn gặp bạn'),
      t('Tešíme sa na vás', 'We look forward to seeing you', 'Chúng tôi mong được gặp bạn'),
      t('Dohodnite si čas pre seba', 'Take a moment for yourself', 'Hẹn giờ cho chính bạn'),
      t('Vaša spokojnosť je našou prioritou', 'Your satisfaction is our priority', 'Sự hài lòng của bạn là ưu tiên'),
      t('Objednajte sa ešte dnes', 'Book today', 'Đặt lịch ngay hôm nay'),
      t('Povieme si, čo vám sedne najlepšie', 'We will find what suits you best', 'Chúng tôi sẽ tìm điều hợp với bạn nhất'),
    ],
  },

  restaurant: {
    openers: [
      t('Chuť, ktorá rozpráva príbeh', 'Flavour that tells a story', 'Hương vị kể câu chuyện'),
      t('Každé jedlo je zážitok', 'Every dish is an experience', 'Mỗi món ăn là một trải nghiệm'),
      t('Varíme s láskou, podávame s úsmevom', 'Cooked with love, served with a smile', 'Nấu với tình yêu, phục vụ với nụ cười'),
      t('Od farmy až na váš stôl', 'From the farm to your table', 'Từ nông trại đến bàn ăn của bạn'),
      t('Jedlo, ktoré si zamilujete', 'Food you will fall in love with', 'Món ăn bạn sẽ yêu thích'),
      t('Chuť, na ktorú sa nezabúda', 'A taste you will not forget', 'Hương vị không thể quên'),
      t('Rodinná atmosféra, profesionálna kuchyňa', 'Family atmosphere, professional kitchen', 'Không khí gia đình, bếp chuyên nghiệp'),
      t('Dneska vám chystáme niečo výnimočné', 'Today we prepared something special', 'Hôm nay chúng tôi chuẩn bị điều đặc biệt'),
      t('Vitaľame vás v našom podniku', 'Welcome to our restaurant', 'Chúng tôi đón bạn tại nhà hàng'),
      t('Miesto, kde sa rodia zážitky', 'A place where experiences are born', 'Nơi những trải nghiệm ra đời'),
      t('Každý deň má vlastný príbeh', 'Every day has its own story', 'Mỗi ngày có câu chuyện riêng'),
      t('Dobrá chuť začína dobrou náladou', 'Great taste starts with a good mood', 'Hương vị ngon bắt đầu từ tâm trạng tốt'),
      t('Príďte na chvíľu pre seba', 'Come for a moment for yourself', 'Hãy đến dành một chút cho chính mình'),
    ],
    bodies: [
      t('Kvalitné suroviny = skvelé jedlo', 'Quality ingredients = great food', 'Nguyên liệu chất lượng = món ngon'),
      t('Pozvite chuťové pohánky na cestu', 'Take your taste buds on a journey', 'Mời vị giác của bạn đi du lịch'),
      t('Jedlo ako umenie', 'Food as art', 'Ẩm thực như nghệ thuật'),
      t('Fajnšmekri si prídu na svoje', 'Food lovers will not be disappointed', 'Người sành ăn sẽ hài lòng'),
      t('Jednoduchá kuchyňa, výnimočná chuť', 'Simple cooking, exceptional taste', 'Nấu nướng đơn giản, hương vị đặc biệt'),
      t('Čerstvé suroviny každý deň', 'Fresh ingredients every day', 'Nguyên liệu tươi mỗi ngày'),
      t('Recepty odovzdávané generáciami', 'Recipes passed down through generations', 'Công thức truyền qua nhiều thế hệ'),
      t('Jedlo, ktoré spája ľudí', 'Food that brings people together', 'Món ăn kết nối mọi người'),
      t('Priestor pre každú príležitosť', 'A space for every occasion', 'Không gian cho mọi dịp'),
      t('Oslava chuti', 'A celebration of flavour', 'Kỷ niệm hương vị'),
      t('Vychutnajte si každé sústo', 'Savour every bite', 'Hãy tận hưởng từng miếng'),
      t('Každý detail môže zmeniť celý deň', 'Every detail can change the whole day', 'Mỗi chi tiết có thể đổi cả ngày'),
      t('Prirodzené chute bez kompromisov', 'Natural flavours without compromise', 'Hương vị tự nhiên, không thỏa hiệp'),
      t('Domáca atmosféra, moderný komfort', 'Homely atmosphere, modern comfort', 'Không khí gia đình, tiện nghi hiện đại'),
      t('Dôraz na chuť, ktorý zostáva', 'A focus on flavour that lingers', 'Tập trung vào hương vị còn lại'),
    ],
    closers: [
      t('Príďte ochutnať', 'Come and taste', 'Hãy đến nếm thử'),
      t('Rezervujte si stôl', 'Reserve your table', 'Hãy đặt bàn'),
      t('Tešíme sa na vás', 'We look forward to seeing you', 'Chúng tôi mong được gặp bạn'),
      t('Dohodnite si čas pre seba', 'Take a moment for yourself', 'Hẹn giờ cho chính bạn'),
      t('Uvidíme sa pri stole', 'See you at the table', 'Hẹn gặp bạn tại bàn ăn'),
      t('Vaša spokojnosť je našou prioritou', 'Your satisfaction is our priority', 'Sự hài lòng của bạn là ưu tiên'),
      t('Príďte s chuťou a náladou', 'Come hungry and happy', 'Hãy đến với khẩu vị và tâm trạng tốt'),
      t('Objednajte si miesto včas', 'Book your place in advance', 'Hãy đặt chỗ trước'),
    ],
  },

  eyelash: {
    openers: [
      t('Oči, ktoré oslnia každého', 'Eyes that stun everyone', 'Đôi mắt làm mọi người choáng ngợp'),
      t('Mihalnice, ktoré robia zázraky', 'Lashes that work magic', 'Lông mi tạo nên điều kỳ diệu'),
      t('Prirodzená krása vašich očí', 'The natural beauty of your eyes', 'Vẻ đẹp tự nhiên của đôi mắt'),
      t('Dokonalé mihalnice pre dokonalý pohľad', 'Perfect lashes for a perfect look', 'Lông mi hoàn hảo cho cái nhìn hoàn hảo'),
      t('Mihalnice, ktoré hovoria', 'Lashes that do the talking', 'Lông mi thay lời nói'),
      t('Očarujúce mihalnice na každý deň', 'Alluring lashes every single day', 'Lông mi quyến rũ mỗi ngày'),
      t('Krása začína od očí', 'Beauty starts with the eyes', 'Vẻ đẹp bắt đầu từ đôi mắt'),
      t('Mihalnice ako z rozprávky', 'Lashes straight from a fairy tale', 'Lông mi như trong cổ tích'),
      t('Luxusná starostlivosť o vaše mihalnice', 'Luxury care for your lashes', 'Chăm sóc lông mi cao cấp'),
      t('Dneska vám spravíme špecialitu', 'Today we have something special for you', 'Hôm nay chúng tôi có món đặc biệt cho bạn'),
      t('Vaše oči si zaslúžia to najlepšie', 'Your eyes deserve the very best', 'Đôi mắt bạn xứng đáng điều tốt nhất'),
      t('Jeden pohľad stačí', 'One look is all it takes', 'Chỉ một cái nhìn là đủ'),
      t('Mihalnice, ktoré zvýraznia vašu krásu', 'Lashes that highlight your beauty', 'Lông mi tôn lên vẻ đẹp của bạn'),
    ],
    bodies: [
      t('Odhaľte krásu vašich očí', 'Reveal the beauty of your eyes', 'Tôn lên vẻ đẹp đôi mắt bạn'),
      t('Prirodzené predĺženie, ohromujúci výsledok', 'Natural-looking extension, stunning result', 'Kéo dài tự nhiên, kết quả ấn tượng'),
      t('Mihalnice, ktoré si zamilujete', 'Lashes you will love', 'Lông mi bạn sẽ yêu thích'),
      t('Každý pohľad je umelecké dielo', 'Every glance is a work of art', 'Mỗi cái nhìn là tác phẩm nghệ thuật'),
      t('Minimalistická krása vašich očí', 'The minimalist beauty of your eyes', 'Vẻ đẹp tối giản của đôi mắt'),
      t('Trendové štýly mihalníc', 'Trending lash styles', 'Xu hướng lông mi mới'),
      t('Objem tam, kde je potrebný', 'Volume where it matters', 'Tạo volume đúng chỗ'),
      t('Jemné vlny pre prirodzený look', 'Soft waves for a natural look', 'Sóng nhẹ cho look tự nhiên'),
      t('Mihalnice pripravené na focenie', 'Lashes ready for the camera', 'Lông mi sẵn sàng chụp ảnh'),
      t('Od rannej kávy po večernú párty', 'From morning coffee to evening cocktails', 'Từ cà phê sáng đến tiệc tối'),
      t('Mihalnice, ktoré pretrvajú', 'Lashes that last', 'Lông mi bền lâu'),
      t('Bezbolestná krása', 'Painless beauty', 'Vẻ đẹp không đau'),
      t('Rýchle a efektívne', 'Quick and effective', 'Nhanh và hiệu quả'),
      t('Výsledok, ktorý vidíte hneď', 'A result you see right away', 'Kết quả bạn thấy ngay'),
      t('Starostlivosť, ktorá vidno na prvý pohľad', 'Care visible at first glance', 'Sự chăm sóc thấy ngay ở cái nhìn đầu tiên'),
    ],
    closers: [
      t('Príďte si vybrať svoj štýl', 'Come and pick your style', 'Hãy đến chọn phong cách của bạn'),
      t('Rezervujte si konzultáciu', 'Book a consultation', 'Hãy đặt lịch tư vấn'),
      t('Tešíme sa na vás', 'We look forward to seeing you', 'Chúng tôi mong được gặp bạn'),
      t('Vitaľame vás u nás', 'We would love to welcome you', 'Chúng tôi rất muốn đón bạn'),
      t('Dohodnite si čas pre seba', 'Take a moment for yourself', 'Hẹn giờ cho chính bạn'),
      t('Vaša spokojnosť je našou prioritou', 'Your satisfaction is our priority', 'Sự hài lòng của bạn là ưu tiên'),
      t('Objednajte sa ešte dnes', 'Book today', 'Đặt lịch ngay hôm nay'),
      t('Príďte a nechajte nás prekvapiť', 'Come and let us surprise you', 'Hãy đến và để chúng tôi làm bạn bất ngờ'),
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
    sk: ['#nechty', '#manikura', '#lakovanie', '#krasa', '#salonkrasy', '#nechtyzmadrymi', '#krasanails', '#naildesignsk', '#slovaknails', '#slovenskakrasa', '#starostlivosť'],
  },
  'hair-men': {
    en: ['#menshair', '#haircut', '#mensstyle', '#barber', '#fade', '#hairstyle', '#gentleman', '#barbershop', '#sharpcut', '#mensgrooming', '#beards', '#barberlife', '#undercut', '#buzzcut', '#malegrooming', '#menshaircut', '#fadehaircut', '#barberstyle', '#grooming', '#beardstyle'],
    sk: ['#vlasy', '#panskystrih', '#kader', '#barberstrih', '#modnystrih', '#mužskýštýl', '#vlasytendencia', '#kvalitnystrih', '#stylmuža', '#krasavlasy'],
  },
  'hair-women': {
    en: ['#hair', '#hairstyle', '#hairgoals', '#haircut', '#balayage', '#haircolor', '#hairstylist', '#hairdo', '#hairlove', '#hairinspo', '#hairfashion', '#beautyhair', '#straighthair', '#curlyhair', '#longhair', '#hairtransformation', '#blowout', '#haircare', '#hairtrend', '#hairinspiration'],
    sk: ['#vlasy', '#uces', '#krasa', '#salon', '#vlasovystrih', '#farbenievlasov', '#balayagesk', '#trendyucesy', '#hairgoals', '#ženskévlasy'],
  },
  restaurant: {
    en: ['#foodie', '#foodporn', '#restaurant', '#yummy', '#instafood', '#foodstagram', '#foodlover', '#delicious', '#foodblogger', '#foodphotography', '#tasty', '#eeeeeats', '#foodgasm', '#dinner', '#lunch', '#gastronomy', '#hometaste', '#chefskiss', '#foodgoals', '#goodfood'],
    sk: ['#jedlo', '#reštaurácia', '#chutna', '#varenie', '#domace', '#gastronomia', '#jedloupoľutí', '#slovenskájedlá', '#dobréjedlo', '#šéfkuchár'],
  },
  eyelash: {
    en: ['#lashes', '#eyelash', '#lashextensions', '#lashgoals', '#beauty', '#makeup', '#lashiie', '#lashed', '#eyelashes', '#lashartist', '#volumelashes', '#naturallashes', '#dramaticlashes', '#dramatic', '#wispy', '#lashlift', '#lashesforall', '#eyelashartist', '#lashqueen', '#flutter'],
    sk: ['#mihalnice', '#nokie', '#krasa', '#makeupartist', '#mihalnicestudio', '#nastiekavanie', '#mihalnicetrendy', '#krasnokie', '#lashtrend', '#okrasnokie'],
  },
};

/**
 * Trending topic bank. Topics rotate deterministically per day so the site
 * always feels "live" even without a backend API.
 */
export const TRENDING_BANK: Record<Category, string[]> = {
  nails: ['soft glam', 'chrome nails', 'french tips', 'minimalist', 'blush nails', 'buttercream nails', 'micro french', 'glazed donut', 'abstract art', 'mocha brown', 'short square', 'pearl detail', 'ombre', 'matte black'],
  'hair-men': ['fade', 'textured crop', 'undercut', 'slick back', 'modern pompadour', 'mullet revival', 'buzz cut', 'curtain fringe', 'taper fade', 'beard sculpting', 'shaggy layers', 'short crop', 'comb over', 'surfer cut'],
  'hair-women': ['wolf cut', 'balayage', 'curtain bangs', 'sleek bun', 'layers', 'bubble cut', 'honey blonde', 'shag cut', 'bixie cut', 'money piece', 'glass hair', 'beach waves', 'pixie cut', 'French bob'],
  restaurant: ['comfort food', 'brunch', 'local ingredients', 'seasonal menu', 'farm to table', 'slow food', 'street food', 'chef special', 'daily menu', 'homemade', 'family recipes', 'tasting menu', 'good food good mood', 'food worth sharing'],
  eyelash: ['cat eye', 'doll eye', 'wispy lashes', 'hybrid set', 'mega volume', 'cluster lashes', 'lash lift', 'spiky lashes', 'natural look', 'dramatic lashes', 'half lash', 'anime lashes', 'magnetic lashes', 'soft glam lashes'],
};

/**
 * Day-of-week flavour. One caption of the day receives this prefix, which makes
 * each weekday feel distinct instead of generic.
 */
export const WEEKLY_THEMES: Record<number, LocalizedSlot> = {
  0: t('Nový týžden, nové nápady', 'New week, new ideas', 'Tuần mới, ý tưởng mới'),
  1: t('Pondelkový štart vo veľkom štýle', 'Monday start in big style', 'Khởi đầu thứ Hai với phong cách lớn'),
  2: t('Utorok v znamení pohody', 'Tuesday all about comfort', 'Thứ Ba mang dấu ấn thoải mái'),
  3: t('Streda, kedy si zaslúžite krásu', 'Wednesday, when you deserve beauty', 'Thứ Tư, ngày bạn xứng đáng được xinh đẹp'),
  4: t('Piatok veľkých plánov', 'Friday and big plans', 'Thứ Sáu với những kế hoạch lớn'),
  5: t('Víkend v znamení relaxu', 'Weekend in relaxation mode', 'Cuối tuần thư giãn'),
  6: t('Nedeľa len pre seba', 'Sunday only for yourself', 'Chủ nhật chỉ dành cho bạn'),
};

/**
 * Seasonal / month-based accents, appended as a light touch on one caption.
 */
export const SEASONAL_ACCENTS: Record<number, LocalizedSlot> = {
  0: t('Nový rok, nový štýl', 'New year, new style', 'Năm mới, phong cách mới'),
  1: t('Valentínsky štýl', 'Valentine style', 'Phong cách Valentine'),
  2: t('Jarné farby a nový štýl', 'Spring colours, new style', 'Màu xuân và phong cách mới'),
  3: t('Veľkonočná elegance', 'Easter elegance', 'Vẻ đẹp Phục Sinh'),
  4: t('Májová energia', 'May energy', 'Năng lượng tháng Năm'),
  5: t('Letná pohoda', 'Summer ease', 'Không khí hè'),
  6: t('Prázdninová svoboda', 'Holiday freedom', 'Tự do mùa hè'),
  7: t('Slnečné leto', 'Sunny summer', 'Mùa hè nắng vàng'),
  8: t('Zlatý jeseň', 'Golden autumn', 'Mùa thu vàng'),
  9: t('Jesenná atmosféra', 'Autumn atmosphere', 'Không khí mùa thu'),
  10: t('Tekutý jeseň', 'Liquid autumn', 'Mùa thu se'),
  11: t('Sviatočné sviatky', 'Festive season', 'Mùa Giáng sinh'),
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
