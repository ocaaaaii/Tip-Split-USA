'use client';

import { useAppStore } from '@/store/useAppStore';
import type { Scenario } from '@/store/useAppStore';
import type { Lang } from '@/lib/i18n';

interface Props { scenario: Scenario; onClose: () => void; }

type LangContent = { range: string; rule: string; tips: string[]; skip: string };

const CONTENT: Record<Scenario, { icon: string } & Record<Lang, LangContent>> = {
  restaurant: {
    icon: '\u{1F37D}️',
    zh: {
      range: '午餐 15–20% · 晚餐 20%+ · 高級餐廳 25–30%',
      rule: '這是美國文化中最強烈的小費場合。服務生底薪極低（$2–5/hr），小費是主要收入。加州雖保障最低薪資 $18–20，但全美各地仍普遍期待小費。',
      tips: [
        '6 人以上請先看帳單是否已有 Auto-Gratuity（18%）；10–20 人甚至高達 25–30%',
        '小費以稅前金額計算才正確，稅後算是多付給你',
        '刷卡小費可能被統一分配（Tip Pool）或被老闆扣留；給現金更能確保直接到服務生手上',
        '服務差也建議至少給 15%——有問題找經理才有效',
        '高級餐廳服務好？25–30% 才是行情',
      ],
      skip: '不適合跳過。',
    },
    sc: {
      range: '18 – 22%',
      rule: '這是美國文化中最強烈的小费場合。服務生的薪水很低（通常只有 $2–5/hr），小费是主要收入来源。',
      tips: [
        '6人以上请先看账单底部是否已有 Auto-Gratuity（通常 18%）',
        '税前計算小费才是正确做法，幫你省錢',
        '服務差也建議至少给 15%，有問題找經理反映更有效',
        '如果觉得服務特別好，可以多给到 25%',
      ],
      skip: '不適合跳过。',
    },
    en: {
      range: 'Lunch 15–20% · Dinner 20%+ · Fine dining 25–30%',
      rule: 'Restaurant tipping is the strongest US custom. Servers earn $2–5/hr base wage — tips are their main income. California guarantees ~$18–20/hr minimum, but tipping is still expected everywhere.',
      tips: [
        'For 6+ guests check the bill for Auto-Gratuity (18–20%); 10–20 people may see 25–30%',
        'Tip on pre-tax subtotal — calculating on post-tax is debated but costs you more',
        'Card tip may go into a Tip Pool (shared) or get skimmed by the house; cash tip goes directly to your server',
        'Even bad service warrants 15% — complain to the manager for real impact',
        'Great service at a fine-dining restaurant? 25–30%+ is the norm',
      ],
      skip: 'Not appropriate to skip.',
    },
    ja: {
      range: '18 – 22%',
      rule: 'レストランはチップ文化が最も強い場所。サーバーの時給は$2–5/hrと低く、チップが主な収入です。',
      tips: [
        '6名以上の場合、明細書に Auto-Gratuity（18%）が含まれていないか確認',
        '税引き小計に対してチップを計算するのが正しい',
        '悪いサービスでも 15%は渡すべき—不満はマネージャーに博すべき',
        'サービスが素晴らしかったら 25%以上も喜ばれる',
      ],
      skip: 'スキップは適切ではありません。',
    },
    ko: {
      range: '18 – 22%',
      rule: "레스토랑은 미국에서 팔 문화가 가장 강한 곳입니다. 서버의 시급은 $2–5/hr로 낮습니다.",
      tips: [
        '6명 이상 시 Auto-Gratuity(18%)가 포함되어 있는지 확인',
        '세금 전 금액에 팔을 계산해야 절약',
        '불량한 서비스도 15%는 주어야 함 — 불만은 매니저에게',
        '서비스가 훌륭하면 25% 이상도 좋아요',
      ],
      skip: '스킵은 적절하지 않습니다.',
    },
    es: {
      range: '18 – 22%',
      rule: 'Los restaurantes tienen la cultura de propinas más fuerte en EE.UU. Los meseros ganan $2–5/hora y dependen de las propinas.',
      tips: [
        'Para 6+ personas, verifica si ya hay Auto-Gratuity en la cuenta (generalmente 18%)',
        'Calcula la propina sobre el subtotal antes de impuestos para ahorrar',
        'Incluso con mal servicio, deja 15% — queja con el gerente en cambio',
        '¿Servicio excelente? 25%+ siempre es bienvenido',
      ],
      skip: 'No es apropiado omitir la propina.',
    },
    pt: {
      range: '18 – 22%',
      rule: 'Restaurantes têm a cultura de gorjeta mais forte nos EUA. Garçons ganham $2–5/hora e dependem das gorjetas.',
      tips: [
        'Para 6+ pessoas, verifique se há Auto-Gratuity na conta (geralmente 18%)',
        'Calcule a gorjeta sobre o subtotal antes dos impostos para economizar',
        'Mesmo com mau serviço, deixe 15% — reclame ao gerente',
        'Serviço excelente? 25%+ é sempre apreciado',
      ],
      skip: 'Não é apropriado omitir a gorjeta.',
    },
  },
  takeout: {
    icon: '\u{1F961}',
    zh: { range: '0 – 10%', rule: '疫情後 Square / iPad 結帳系統在快餐店、咖啡廳幾乎全面普及，強制彈出小費畫面讓你不好意思不按。但你完全有權按 0% 或直接 Skip，不需要有罪惡感。', tips: ["連鎖快餐店（McDonald's、Chipotle）：不需要給", '獨立外帶店：常客可給 $1–2', '數位 kiosk 的 Skip 通常在角落', '自取餐完全不需要給'], skip: '可以跳過，不要有罪惡感。' },
    sc: { range: '0 – 10%', rule: '疫情后 Square / iPad 结账系统在快餐店、咖啡厅几乎全面普及，强制弹出小费画面让你不好意思不按。但你完全有权按 0% 或直接 Skip，不需要有罪恶感。', tips: ["連鎖快餐店（McDonald's、Chipotle）：不需要给", '獨立外帶店：常客可给 $1–2', '數位 kiosk 的 Skip 通常在角落', '自取餐完全不需要给'], skip: '可以跳过，不要有罪惡感。' },
    en: { range: '0 – 10%', rule: 'Post-COVID, Square/iPad payment terminals at fast food and coffee shops routinely pop up tip screens — making you feel awkward. You are absolutely free to press 0% or Skip. No guilt needed.', tips: ["Chain fast food (McDonald's, Chipotle): no tip needed — servers here often earn full minimum wage", "Independent takeout: $1–2 is friendly if you're a regular", 'The Skip button is usually small — look in the corners', 'If you pick up yourself, no tip expected'], skip: 'Perfectly fine to skip.' },
    ja: { range: '0 – 10%', rule: 'テイクアウトのチップは任意です。デジタル画面で求められても、0%またはSkipで構いません。', tips: ['チェーン店（マクドナルド等）はチップ不要', '個人店は常連なら$1–2が親切', 'Skipボタンは小さく樹行に表示されることが多い', '自分で取りに行く場合は不要'], skip: 'スキップして問題ありません。' },
    ko: { range: '0 – 10%', rule: '테이크아웃 팔은 완전히 선택입니다. 디지털 화면에서 0% 또는 Skip을 눌러도 됩니다.', tips: ['체인 패스트푸드: 팔 불필요', '소규모 식당: 상시 방문한다면 $1–2', 'Skip 버튼은 보통 구석에 작게 되어 있음', '직접 가져가는 경우 팔 불필요'], skip: '스킵해도 괴찮습니다.' },
    es: { range: '0 – 10%', rule: 'La propina en comida para llevar es completamente opcional. Si una pantalla digital pide propina, puedes presionar 0% o Skip.', tips: ["Cadenas de comida rápida (McDonald's, Chipotle): sin propina", 'Restaurante independiente: $1–2 si eres cliente habitual', 'El botón Skip suele estar en una esquina pequeña', 'Si recoges tú mismo, no se espera propina'], skip: 'Está perfectamente bien omitir la propina.' },
    pt: { range: '0 – 10%', rule: 'Gorjeta em pedidos para viagem é completamente opcional. Pode pressionar 0% ou Skip na tela digital sem problema.', tips: ["Redes de fast food (McDonald's, Chipotle): sem gorjeta", 'Restaurante independente: $1–2 se for cliente habitual', 'O botão Skip costuma ser pequeno e na corner', 'Se buscar você mesmo, não é esperada gorjeta'], skip: 'É perfeitamente aceitável omitir.' },
  },
  bar: {
    icon: '\u{1F379}',
    zh: { range: '$1–2 / 杯，或 Tab 結帳 15–20%', rule: '酒吧有兩種情境：開 Tab（記帳）或單杯付款。邏輯不同，不要搞混。', tips: ['單點現付：問酒 $1，調酒 $2（不需要按百分比）', '開 Tab：離場前一次結清，給 15–20%', '酒吧服務生也依賴小費為生', '多給一點是打好關係的方式'], skip: '不建議跳過，尤其是開 Tab 的情況。' },
    sc: { range: '$1–2 / 杯，或 Tab 结账 15–20%', rule: '酒吧有兩種情境：开 Tab（記账）或单杯付款。邏輯不同，不要搞混。', tips: ['单点現付：問酒 $1，調酒 $2（不需要按百分比）', '开 Tab：離場前一次结清，给 15–20%', '酒吧服務生也依賴小费為生', '多给一点是打好關係的方式'], skip: '不建議跳过，尤其是开 Tab 的情況。' },
    en: { range: '$1–2 / drink, or 15–20% for tabs', rule: 'Bars have two modes: pay-per-drink or running a tab. The tipping logic differs for each.', tips: ['Pay per drink: $1 for beer, $2 for cocktails (not percentage-based)', 'Running a tab: settle at the end and tip 15–20%', 'Bartenders rely heavily on tips — be generous', 'Building rapport? A little extra goes a long way'], skip: 'Not recommended, especially for tabs.' },
    ja: { range: '$1–2 / 杯、またはタブの 15–20%', rule: 'バーは1杯ずつ支払うか、タブを開いて最後に一括払うかの2モードがあります。', tips: ['1杯ずつ：ビール$1、カクテル$2（パーセンテージ不要）', 'タブの場合：最後に 15–20% を渡す', 'バーテンダーはチップ依存度が高い—悪げさづに', '常連客なら太った您唄も広かれる'], skip: '特にタブの時はスキップ不可。' },
    ko: { range: '$1–2 / 잔, 또는 탭 정산 15–20%', rule: '바는 잌재마다 결제하거나 탭을 열고 마지막에 정산하는 두 가지 방식이 있습니다.', tips: ['잌마다 결제: 맥주 $1, 칵테일 $2', '탭: 마지막에 15–20% 정산', '바텐더도 팔에 의존 — 너그럽게', '어차피 자주 가에요? 조금 더 주면 좋어해요'], skip: '탭의 경우 스킵하지 세요.' },
    es: { range: '$1–2 / bebida, o 15–20% si hay cuenta', rule: 'Los bares tienen dos modos: pagar por bebida o abrir una cuenta (tab) y pagar al final.', tips: ['Por bebida: $1 cerveza, $2 cóctel (sin porcentaje)', 'Con cuenta (tab): propina 15–20% al final', 'Los bartenders dependen mucho de las propinas', 'Ser generoso construye buena relación con el bartender'], skip: 'No recomendado, especialmente con cuenta abierta.' },
    pt: { range: '$1–2 / drinque, ou 15–20% na conta', rule: 'Bares têm dois modos: pagar por drinque ou abrir uma conta (tab) e pagar no final.', tips: ['Por drinque: $1 cerveja, $2 drink (sem percentual)', 'Com conta: gorjeta de 15–20% no final', 'Bartenders dependem muito de gorjetas', 'Ser generoso cria boa relação com o barman'], skip: 'Não recomendado, especialmente com conta aberta.' },
  },
  taxi: {
    icon: '\u{1F696}',
    zh: { range: '$2 – $5 / 趣（現金最佳）', rule: '傳統計程車和 Rideshare（Uber/Lyft）略有不同。現金小費對司機最有幫助。', tips: ['短程（$10以內）：$2 現金', '長程（機場接送等）：$3–5 或車費的 15%', 'Uber/Lyft：App 內給小費更安全', '司機幫你搞行李：額外多給 $1/件', '車況整潔、准時、服務好：多給一點'], skip: '可以跳過但不禮貌，尤其是長程。' },
    sc: { range: '$2 – $5 / 趣（現金最佳）', rule: '传統計程車和 Rideshare（Uber/Lyft）略有不同。現金小费對司機最有幫助。', tips: ['短程（$10以內）：$2 現金', '長程（機場接送等）：$3–5 或車费的 15%', 'Uber/Lyft：App 內给小费更安全', '司機幫你搞行李：額外多给 $1/件', '車況整潔、准時、服務好：多给一点'], skip: '可以跳过但不禮貌，尤其是長程。' },
    en: { range: '$2 – $5 / ride (cash preferred)', rule: 'Traditional taxis and rideshare (Uber/Lyft) work slightly differently. Cash tips are most valuable to drivers.', tips: ['Short ride (under $10): $2 cash', 'Long ride (airport, etc.): $3–5 or 15% of fare', 'Uber/Lyft: in-app tip is safer than cash', 'Driver helps with luggage: extra $1 per bag', 'Clean car, punctual, friendly? Tip more'], skip: 'Skipping is impolite for longer rides.' },
    ja: { range: '$2 – $5 / 乗車（現金歓迎）', rule: '従来のタクシーとUber/Lyftは少し異なります。現金チップが最も喜ばれます。', tips: ['短距離（$10未満）：$2現金', '長距離（空港等）：$3–5または運購の15%', 'Uber/Lyft：アプリ内チップが安全', '荷物を手伝ってもらったら+$1/個', 'サービスが良ければ少し多めに'], skip: '長距離の場合はスキップ不可。' },
    ko: { range: '$2 – $5 / 승차 (현금 선호)', rule: '일반 택시와 Uber/Lyft는 약간 다릅니다. 현금 팔이 운전자에게 가장 유용합니다.', tips: ['단거리 ($10 이하): $2 현금', '장거리 (공항 등): $3–5 또는 요금의 15%', 'Uber/Lyft: 앱 내 팔이 안전', '짐 도움 받으면 미당 $1 추가', '서비스 좋으면 더 주세요'], skip: '장거리는 스킵하는 것이 불손합니다.' },
    es: { range: '$2 – $5 / viaje (efectivo preferido)', rule: 'Los taxis tradicionales y el rideshare (Uber/Lyft) funcionan diferente. Las propinas en efectivo son más útiles para los conductores.', tips: ['Viaje corto (menos de $10): $2 en efectivo', 'Viaje largo (aeropuerto, etc.): $3–5 o 15% del costo', 'Uber/Lyft: propina en la app es más segura', 'Conductor ayuda con equipaje: $1 extra por pieza', 'Auto limpio, puntual y amable? Propina más'], skip: 'Omitir es descortés en viajes largos.' },
    pt: { range: '$2 – $5 / corrida (preferência por dinheiro)', rule: 'Táxis tradicionais e rideshare (Uber/Lyft) funcionam de forma diferente. Gorjetas em dinheiro são mais úteis para os motoristas.', tips: ['Corrida curta (menos de $10): $2 em dinheiro', 'Corrida longa (aeroporto, etc.): $3–5 ou 15%', 'Uber/Lyft: gorjeta no app é mais segura', 'Motorista ajuda com bagagem: $1 extra por peça', 'Serviço excelente? Dê mais'], skip: 'Omitir é indelicado em corridas longas.' },
  },
  hotel: {
    icon: '\u{1F6CF}️',
    zh: { range: '$1 – $5 / 天（每天早上留）', rule: '飯店清潔工每天都可能換人，不要把小費留到退房時才給。', tips: ['每天早上在枚頭旁或桌上留 $1–5（標記清潔"Housekeeping"）', '住宿越高級、房間越大，給多一點（$3–5）', '行李員幫你搞行李：$1–2 / 件', '門儛幫你叫車：$1–2', '送餐到房間：確認帳單是否已含服務費'], skip: '清潔工非常辛苦，請盡量每天留。' },
    sc: { range: '$1 – $5 / 天（每天早上留）', rule: '饭店清潔工每天都可能換人，不要把小费留到退房時才给。', tips: ['每天早上在枚頭旁或桌上留 $1–5（標記清潔"Housekeeping"）', '住宿越高級、房間越大，给多一点（$3–5）', '行李员幫你搞行李：$1–2 / 件', '門儛幫你叫車：$1–2', '送餐到房間：确認账单是否已含服務费'], skip: '清潔工非常辛苦，请盡量每天留。' },
    en: { range: '$1 – $5 / day (leave each morning)', rule: "Hotel housekeeping changes daily — don't save all tips until checkout, as a different person may have cleaned your room each day.", tips: ['Leave $1–5 on the pillow or desk each morning, labeled "Housekeeping"', 'Upscale hotel or large room: $3–5 per night', 'Bellhop for luggage: $1–2 per bag', 'Doorman calling a cab: $1–2', 'Room service: bill often includes a service charge — check before double-tipping'], skip: 'Please leave something — housekeeping works very hard.' },
    ja: { range: '$1 – $5 / 泳（毎朝置いておく）', rule: 'ホテルの清潔財毎日変わる可能性あり。チェックアウト時までまとめて渡さないで。', tips: ['毎朝枱の上またはテーブルに$1–5（「Housekeeping」とメモ）', '高級ホテル・広い部屋: $3–5', 'ベルボーイ: $1–2/個', 'ドアマンに車を呼んでもらった場合: $1–2', 'ルームサービス: 明細書にサービス料が含まれているか確認'], skip: '清潔財の仕事は大変です—少しでも置いてあげて。' },
    ko: { range: '$1 – $5 / 일 (매일 아침 두기)', rule: '호텔 청소부는 매일 바뀌다. 체크아웃 때까지 기다리지 말고 매일 아침 두세요.', tips: ['매일 침개 위나 책상에 $1–5 ("Housekeeping" 메모 함께)', '고급 호텔이나 넓은 방: $3–5', '침소사향: $1–2/개', '도어맨이 택시 불러즐 때: $1–2', '룸 서비스: 계산서에 서비스 차지 포함 여부 확인'], skip: '청소부는 먹고얬요. 조금이라도 두세요.' },
    es: { range: '$1 – $5 / noche (dejar cada mañana)', rule: 'La limpieza del hotel puede cambiar cada día. No guardes las propinas hasta el check-out.', tips: ['Deja $1–5 en la almohada o escritorio cada mañana, con nota "Housekeeping"', 'Hotel de lujo o habitación grande: $3–5', 'Botones con equipaje: $1–2 por pieza', 'Portero que llama taxi: $1–2', 'Room service: verifica si ya incluye cargo por servicio'], skip: 'Por favor deja algo — el personal de limpieza trabaja muy duro.' },
    pt: { range: '$1 – $5 / noite (deixar toda manhã)', rule: 'A limpeza do hotel pode mudar todos os dias. Não guarde gorjetas para o check-out.', tips: ['Deixe $1–5 no travesseiro ou escrivaninha toda manhã, com bilhete "Housekeeping"', 'Hotel de luxo ou quarto grande: $3–5', 'Carregador de bagagem: $1–2 por peça', 'Porteiro chamando táxi: $1–2', 'Room service: veja se a conta já inclui taxa de serviço'], skip: 'Por favor deixe algo — a limpeza trabalha muito.' },
  },
  salon: {
    icon: '\u{1F485}',
    zh: { range: '15 – 20%', rule: '美髪、美甲等個人護理服務，小費慣例和餐廳差不多。重要：小費給提供服務的人，不是老闆。', tips: ['美髪：剪髪 $5–10，燳染 15–20%', '美甲：$3–5 或 20%，美甲師通常薪水很低', '如果老闆親自服務你，可以給也可以不給', '現金直接給服務人員，確保到他們手上'], skip: '不建議跳過，服務人員薪水普遍偏低。' },
    sc: { range: '15 – 20%', rule: '美髪、美甲等個人護理服務，小费慣例和餐厅差不多。重要：小费给提供服務的人，不是老闆。', tips: ['美髪：剪髪 $5–10，燳染 15–20%', '美甲：$3–5 或 20%，美甲師通常薪水很低', '如果老闆親自服務你，可以给也可以不给', '現金直接给服務人员，确保到他們手上'], skip: '不建議跳过，服務人员薪水普遍偏低。' },
    en: { range: '15 – 20%', rule: 'Personal care services follow similar customs to restaurants. Key: tip the person who served you, not the owner. Card tips sometimes go into a pool or get deducted — cash is safer.', tips: ['Haircut: $5–10 flat, or 15–20% for color/treatment', 'Nail tech: $3–5 or 20% — wages are often very low', 'If the owner serves you, tipping is optional (they keep profits)', 'Cash directly to your stylist ensures they receive it fully'], skip: 'Not recommended — wages are typically low.' },
    ja: { range: '15 – 20%', rule: '美容院やネイルサロンはレストランに迊い慣例があります。オーナーでなく、担当者に渡しましょう。', tips: ['カット: $5–10、カラー/トリートメント: 15–20%', 'ネイリスト: $3–5または20%（質金が低い）', 'オーナーが担当ならチップは任意', '現金で直接渡すと確実に歌圓に渡る'], skip: '給不のは遷潑。質金が低いです。' },
    ko: { range: '15 – 20%', rule: '미용실과 네일샵은 레스토랑과 비슷한 관행입니다. 오너가 아닌 서비스제공자에게 팔을 주세요.', tips: ['커트: $5–10, 컬러/트리트먼트: 15–20%', '네일: $3–5 또는 20% (임금이 낙음)', '오너가 직접 서비스하면 팔은 선택', '현금으로 직접 주면 확실히 전달됨'], skip: '임금이 낙아서 비추천 스킵.' },
    es: { range: '15 – 20%', rule: 'Los salones de belleza y uñas siguen costumbres similares a los restaurantes. Da la propina a quien te atendió, no al dueño.', tips: ['Corte de pelo: $5–10, color/tratamiento: 15–20%', 'Técnica de uñas: $3–5 o 20% — los salarios son muy bajos', 'Si el dueño te atiente, la propina es opcional', 'Efectivo directamente al estilista es lo mejor'], skip: 'No recomendado — los salarios suelen ser bajos.' },
    pt: { range: '15 – 20%', rule: 'Salões de beleza e manicure seguem costumes similares aos restaurantes. Dê a gorjeta a quem te atendeu, não ao dono.', tips: ['Corte: $5–10, coloração/tratamento: 15–20%', 'Manicure: $3–5 ou 20% — salários são muito baixos', 'Se o dono atender, gorjeta é opcional', 'Dinheiro diretamente ao profissional garante que receba tudo'], skip: 'Não recomendado — os salários são geralmente baixos.' },
  },
  delivery: {
    icon: '\u{1F4E6}',
    zh: { range: '$3 – $5 最低，惡劣天氣多給', rule: '外送司機的接單决策受小費影響很大。給太少，你的訂單可能在隊列中等很久。', tips: ['最低底線：$3–5，無論訂單多小', '距離遠或訂單大：10–15%', '下雨、大雪等惡劣天氣：$5–10', 'App 通常讓你在收到後修改小費，服務好可以事後多給', '部分 App（DoorDash）會把小費計入保底薪資，不一定全進司機口袋'], skip: '跳過小費可能導致訂單沒人接或送餐超慢。' },
    sc: { range: '$3 – $5 最低，惡劣天氣多给', rule: '外送司機的接单决策受小费影響很大。给太少，你的訂单可能在隊列中等很久。', tips: ['最低底線：$3–5，無論訂单多小', '距離遠或訂单大：10–15%', '下雨、大雪等惡劣天氣：$5–10', 'App 通常讓你在收到後修改小费，服務好可以事後多给', '部分 App（DoorDash）會把小费計入保底薪資，不一定全進司機口袋'], skip: '跳过小费可能導致訂单沒人接或送餐超慢。' },
    en: { range: '$3 – $5 minimum; tip more in bad weather', rule: 'Delivery drivers decide whether to accept orders partly based on tip. Low tips mean your order may sit unaccepted for a long time.', tips: ['Minimum: $3–5 regardless of order size', 'Long distance or large order: 10–15%', "Rain, snow, extreme weather: $5–10 — they're risking for you", 'Some apps let you adjust tip after delivery — increase for great service', 'Some apps (DoorDash) count tips toward base pay — not always extra income'], skip: 'Skipping may result in no driver accepting or very long waits.' },
    ja: { range: '$3 – $5最低、悪天候は増額を', rule: '配達ドライバーはチップを見て注文を受けるか決めます。少ないと注文が攻E置されることも。', tips: ['最低 $3–5（注文の大小に関わらず）', '長距離・大きな注文: 10–15%', '雨・雪・悪天候: $5–10', 'アプリは配達後にチップ変更できることが多い', 'DoorDash等はチップが保証薪に充当される場合もある'], skip: 'スキップすると注文が攻e置されるかも。' },
    ko: { range: '$3 – $5 최소; 악쿼 날씨는 더', rule: '배달 기사는 팔 금액에 따라 주문 수락 여부를 결정합니다. 팔이 적으면 주문이 방치될 수 있습니다.', tips: ['최소 $3–5 (주문 크기 무관)', '장거리 또는 대량 주문: 10–15%', '비/눈/악쿼 날씨: $5–10', '앛 분은 배달 후 팔 변경 가능', 'DoorDash등은 팔이 기본급에 포함될 수도 있음'], skip: '스킵 시 배달 기사가 없거나 매우 늘어날 수 있음.' },
    es: { range: '$3 – $5 mínimo; más en mal tiempo', rule: 'Los repartidores deciden aceptar pedidos en parte según la propina. Poca propina = pedido sin aceptar por mucho tiempo.', tips: ['Mínimo $3–5 sin importar el tamaño del pedido', 'Distancia larga o pedido grande: 10–15%', 'Lluvia, nieve, mal tiempo: $5–10', 'Algunas apps permiten ajustar propina después de la entrega', 'DoorDash puede contar propina como parte del salario base'], skip: 'Omitir puede resultar en que nadie acepte o demoras largas.' },
    pt: { range: '$3 – $5 mínimo; mais no mau tempo', rule: 'Os entregadores decidem aceitar pedidos com base na gorjeta. Gorjeta baixa pode fazer o pedido ficar sem ninguém.', tips: ['Mínimo $3–5 independente do tamanho', 'Distância longa ou pedido grande: 10–15%', 'Chuva, neve, mau tempo: $5–10', 'Alguns apps permitem ajustar gorjeta após entrega', 'DoorDash pode incluir gorjeta no salário base'], skip: 'Omitir pode resultar em ninguém aceitar ou longas esperas.' },
  },
};

const HEADER_LABEL: Record<Lang, string> = {
  zh: '小費文化教學',
  sc: '小费文化教学',
  en: 'Tip Culture Guide',
  ja: 'チップ文化ガイド',
  ko: '팔 문화 가이드',
  es: 'Guía de Propinas',
  pt: 'Guia de Gorjetas',
};
const TIPS_LABEL: Record<Lang, string> = {
  zh: '實用技巧', sc: '实用技巧', en: 'Practical Tips', ja: '実用的なヒント',
  ko: '실용 팁', es: 'Consejos prácticos', pt: 'Dicas práticas',
};
const SKIP_LABEL: Record<Lang, string> = {
  zh: '跳過小費？', sc: '跳过小费？', en: 'Skipping?', ja: 'スキップする場合？',
  ko: '스킵하려면?', es: '¿Omitir propina?', pt: 'Omitir gorjeta?',
};

export default function TipCultureModal({ scenario, onClose }: Props) {
  const { lang } = useAppStore();
  const c = CONTENT[scenario];
  const text: LangContent = c[lang] ?? c.en;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(30,14,5,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] mx-auto animate-slide-up"
        style={{ background: '#F7EED8', borderRadius: '1.5rem 1.5rem 0 0', maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D4B880' }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid #D4B880' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A07858', marginBottom: 2 }}>
                {HEADER_LABEL[lang]}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#3D1D0A', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                {text.range}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDE0C0', border: '1px solid #D4B880', color: '#6B3A20', fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          <div style={{ background: 'rgba(104,141,165,0.12)', borderRadius: 12, padding: '12px 14px', borderLeft: '3px solid #688DA5' }}>
            <p style={{ fontSize: 13, color: '#3D1D0A', lineHeight: 1.6 }}>{text.rule}</p>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B3A20', marginBottom: 8 }}>
              {TIPS_LABEL[lang]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {text.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#688DA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: '#3D1D0A', lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(196,88,26,0.08)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14 }}>{String.fromCodePoint(0x1F4A1)}</span>
            <p style={{ fontSize: 12, color: '#6B3A20', lineHeight: 1.5 }}>
              <strong>{SKIP_LABEL[lang]}</strong>{' '}{text.skip}
            </p>
          </div>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
