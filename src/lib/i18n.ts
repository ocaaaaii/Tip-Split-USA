// TipSplit USA — i18n Translation System
// Supports: zh-TW | en | ja | ko | es | pt-BR

export type Lang = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'pt';

export const translations = {
  nav: {
    calculator: { zh: '計算機', en: 'Calculator', ja: '計算機', ko: '계산기', es: 'Calculadora', pt: 'Calculadora' },
    split:      { zh: '分帳',  en: 'Split',      ja: '割り勘',  ko: '더치페이', es: 'Dividir',    pt: 'Dividir' },
    summary:    { zh: '總覽',  en: 'Summary',    ja: '明細',    ko: '요약',   es: 'Resumen',    pt: 'Resumo' },
  },

  topbar: {
    detectingLocation:   { zh: '偵測位置中...', en: 'Detecting location...', ja: '位置情報を取得中...', ko: '위치 감지 중...', es: 'Detectando ubicación...', pt: 'Detectando localização...' },
    locationUnavailable: { zh: '無法取得位置', en: 'Location unavailable',   ja: '位置情報が利用できません', ko: '위치를 사용할 수 없음', es: 'Ubicación no disponible', pt: 'Localização indisponível' },
    tapToSet:            { zh: '點此設定位置', en: 'Tap to set location',    ja: 'タップして位置を設定', ko: '탭하여 위치 설정', es: 'Toca para configurar', pt: 'Toque para definir' },
    locationOffline:     { zh: '位置（離線）', en: 'Location (offline)',    ja: '場所（オフライン）', ko: '위치 (오프라인)', es: 'Ubicación (sin conexión)', pt: 'Localização (offline)' },
    offlineMode:         { zh: '⚠️ 離線模式', en: '⚠️ Offline mode',      ja: '⚠️ オフラインモード', ko: '⚠️ 오프라인 모드', es: '⚠️ Sin conexión', pt: '⚠️ Modo offline' },
    tax:                 { zh: '稅', en: 'Tax', ja: '税', ko: '세금', es: 'Impuesto', pt: 'Imposto' },
  },

  calc: {
    billAmount:       { zh: '帳單金額', en: 'Bill Amount', ja: '請求金額', ko: '청구 금액', es: 'Monto de cuenta', pt: 'Valor da conta' },
    taxInclusive:     { zh: '含稅金額', en: 'Tax Inclusive', ja: '税込金額', ko: '세금 포함 금액', es: 'Con impuesto', pt: 'Com imposto' },
    preTax:           { zh: '稅前金額（推薦）', en: 'Pre-tax (Recommended)', ja: '税抜金額（推奨）', ko: '세전 금액 (추천)', es: 'Sin impuesto (recomendado)', pt: 'Sem imposto (recomendado)' },
    preTaxNote:       { zh: '稅前約', en: 'Pre-tax ≈', ja: '税抜 ≈', ko: '세전 ≈', es: 'Sin impuesto ≈', pt: 'Sem imposto ≈' },
    scenario:         { zh: '消費場景', en: 'Scenario', ja: '消費シーン', ko: '소비 상황', es: 'Escenario', pt: 'Cenário' },
    guests:           { zh: '用餐人數', en: 'Guests', ja: '人数', ko: '인원', es: 'Personas', pt: 'Pessoas' },
    tipRate:          { zh: '小費比率', en: 'Tip Rate', ja: 'チップ率', ko: '팁 비율', es: 'Propina', pt: 'Gorjeta' },
    skip:             { zh: 'Skip 0%', en: 'Skip 0%', ja: 'スキップ 0%', ko: '건너뛰기 0%', es: 'Omitir 0%', pt: 'Pular 0%' },
    customTip:        { zh: '✏️ 自訂 Custom', en: '✏️ Custom', ja: '✏️ カスタム', ko: '✏️ 직접 입력', es: '✏️ Personalizar', pt: '✏️ Personalizar' },
    customPlaceholder:{ zh: '輸入 % 數', en: 'Enter %', ja: '% を入力', ko: '% 입력', es: 'Ingresa %', pt: 'Digite %' },
    confirm:          { zh: '確認', en: 'OK', ja: '確認', ko: '확인', es: 'OK', pt: 'OK' },
    adjustTax:        { zh: '⚙️ 手動調整稅率 / 選擇城市', en: '⚙️ Adjust tax rate / city', ja: '⚙️ 税率を手動調整', ko: '⚙️ 세율 수동 조정', es: '⚙️ Ajustar tasa', pt: '⚙️ Ajustar taxa' },
    coinstarTip: {
      zh: '硬幣處理小妙招：去 Walmart 的 Coinstar 機器，兌換成 Amazon / Starbucks eGift Card 可免去 11.9% 的手續費！',
      en: 'Coin tip: At Walmart Coinstar, exchange coins for Amazon/Starbucks eGift Cards — no 11.9% fee!',
      ja: 'コイン節約術：WalmartのCoinstarでAmazon/StarbucksギフトカードにするとCoinstar手数料11.9%が無料！',
      ko: '동전 팁: Walmart Coinstar에서 동전을 Amazon/Starbucks 기프트카드로 교환하면 11.9% 수수료가 없어요!',
      es: 'Truco: En Coinstar de Walmart, cambia monedas por tarjetas de regalo Amazon/Starbucks sin comisión del 11.9%.',
      pt: 'Dica: No Coinstar do Walmart, troque moedas por cartões Amazon/Starbucks sem taxa de 11.9%!',
    },
    cashWarning: {
      zh: '💵 金額低於 $20？注意許多小店不接受 $100 大鈔！',
      en: "💵 Bill under $20? Many small shops don't accept $100 bills. Try large chains for change.",
      ja: '💵 $20以下？小さいお店は$100札を受け取らないことが多いです。Target等の大型チェーン店でお釣りをもらいましょう。',
      ko: '💵 $20 미만? 소규모 가게에서는 $100 지폐를 받지 않을 수 있어요. Target 등 대형 체인점을 이용하세요.',
      es: '💵 ¿Menos de $20? Muchos negocios no aceptan billetes de $100. Prueba tiendas grandes para cambio.',
      pt: '💵 Menos de $20? Muitos comércios não aceitam notas de $100. Experimente redes grandes para troco.',
    },
    selectTax:  { zh: '選擇稅率', en: 'Select Tax Rate', ja: '税率を選択', ko: '세율 선택', es: 'Seleccionar impuesto', pt: 'Selecionar imposto' },
    customRate: { zh: '自訂稅率', en: 'Custom Rate',     ja: 'カスタム税率', ko: '사용자 정의 세율', es: 'Tasa personalizada', pt: 'Taxa personalizada' },
    apply:      { zh: '套用', en: 'Apply', ja: '適用', ko: '적용', es: 'Aplicar', pt: 'Aplicar' },
  },

  scenarios: {
    restaurant: { zh: '餐廳內用', en: 'Dine-in',   ja: 'レストラン', ko: '레스토랑', es: 'Restaurante', pt: 'Restaurante' },
    takeout:    { zh: '外帶/快餐', en: 'Takeout',  ja: 'テイクアウト', ko: '테이크아웃', es: 'Para llevar', pt: 'Para viagem' },
    bar:        { zh: '酒吧', en: 'Bar',           ja: 'バー', ko: '바', es: 'Bar', pt: 'Bar' },
    taxi:       { zh: '計程車', en: 'Taxi',        ja: 'タクシー', ko: '택시', es: 'Taxi', pt: 'Táxi' },
    hotel:      { zh: '飯店清潔', en: 'Hotel',     ja: 'ホテル清掃', ko: '호텔 청소', es: 'Hotel', pt: 'Hotel' },
    salon:      { zh: '美髮/美甲', en: 'Salon',   ja: 'ヘアサロン', ko: '미용실/네일', es: 'Salón', pt: 'Salão' },
    delivery:   { zh: '外送', en: 'Delivery',      ja: 'デリバリー', ko: '배달', es: 'Delivery', pt: 'Entrega' },
  },

  tipRanges: {
    restaurant: { zh: '18–22%', en: '18–22%', ja: '18–22%', ko: '18–22%', es: '18–22%', pt: '18–22%' },
    takeout:    { zh: '0–10%', en: '0–10%', ja: '0–10%', ko: '0–10%', es: '0–10%', pt: '0–10%' },
    bar:        { zh: '$1–2/杯', en: '$1–2/drink', ja: '$1–2/杯', ko: '$1–2/잔', es: '$1–2/bebida', pt: '$1–2/drinque' },
    taxi:       { zh: '$2–5/趟', en: '$2–5/ride', ja: '$2–5/乗車', ko: '$2–5/회', es: '$2–5/viaje', pt: '$2–5/viagem' },
    hotel:      { zh: '$1–5/天', en: '$1–5/day', ja: '$1–5/日', ko: '$1–5/일', es: '$1–5/día', pt: '$1–5/dia' },
    salon:      { zh: '15–20%', en: '15–20%', ja: '15–20%', ko: '15–20%', es: '15–20%', pt: '15–20%' },
    delivery:   { zh: '$3–5 起', en: '$3–5 min', ja: '最低$3–5', ko: '최소 $3–5', es: 'mín. $3–5', pt: 'mín. $3–5' },
  },

  alerts: {
    restaurant: {
      zh: '⚠️ 6人以上請先確認帳單是否已含 Auto-Gratuity！',
      en: '⚠️ Party of 6+? Check if the bill already includes Auto-Gratuity!',
      ja: '⚠️ 6名以上は自動チップが含まれているか確認してください！',
      ko: '⚠️ 6인 이상은 자동 팁 포함 여부를 먼저 확인하세요!',
      es: '⚠️ ¿6 o más personas? ¡Verifica si ya incluye propina automática!',
      pt: '⚠️ 6 ou mais pessoas? Verifique se já inclui gorjeta automática!',
    },
    takeout: {
      zh: '💡 電子螢幕跳出小費？勇敢點 Custom 0% 或 Skip！',
      en: "💡 Kiosk showing tip screen? It's OK to tap Custom 0% or Skip!",
      ja: '💡 タブレットにチップ画面が出たら、0%またはスキップでOK！',
      ko: '💡 키오스크에서 팁 화면이 뜨면 0% 또는 건너뛰기를 눌러도 됩니다!',
      es: '💡 ¿Pantalla de propina? Está bien presionar 0% u Omitir.',
      pt: '💡 Tela de gorjeta? Pode pressionar 0% ou Pular sem problema.',
    },
    bar: {
      zh: '🍹 單點：$1/啤酒，$2/調酒；Tab 結帳走 15–20%',
      en: '🍹 Per drink: $1 beer, $2 cocktail. Running a tab? 15–20% at close.',
      ja: '🍹 単品：ビール$1、カクテル$2。タブ払いは15〜20%',
      ko: '🍹 단품: 맥주 $1, 칵테일 $2. 탭 계산은 15–20%',
      es: '🍹 Por bebida: $1 cerveza, $2 cóctel. ¿Cuenta abierta? 15–20%.',
      pt: '🍹 Por drinque: $1 cerveja, $2 drinque. Conta aberta? 15–20%.',
    },
    taxi: {
      zh: '🚖 建議每趟 $2–$5 現金小費',
      en: '🚖 Tip $2–$5 per ride (cash preferred)',
      ja: '🚖 1回$2〜$5の現金チップを推奨',
      ko: '🚖 1회 $2–$5 현금 팁 권장',
      es: '🚖 Propina de $2–$5 en efectivo por viaje',
      pt: '🚖 Gorjeta de $2–$5 em dinheiro por corrida',
    },
    hotel: {
      zh: '🛏️ 每天早上在枕頭旁留 $1–$5（每天清潔員不同）',
      en: '🛏️ Leave $1–$5 on the pillow each morning — housekeepers rotate daily.',
      ja: '🛏️ 毎朝枕元に$1〜$5を（担当者が毎日変わります）',
      ko: '🛏️ 매일 아침 베개 옆에 $1–$5 놓기 (담당자가 매일 바뀜)',
      es: '🛏️ Deja $1–$5 en la almohada cada mañana (el personal rota diario)',
      pt: '🛏️ Deixe $1–$5 no travesseiro toda manhã (o pessoal muda diariamente)',
    },
    salon: {
      zh: '💅 美髮美甲比照餐廳標準，建議 15–20%',
      en: '💅 Same as dining — 15–20% is standard for salons & nail bars.',
      ja: '💅 レストランと同様、15〜20%が標準',
      ko: '💅 레스토랑과 동일하게 15–20% 표준',
      es: '💅 Igual que restaurante: 15–20% es estándar para salones.',
      pt: '💅 Igual ao restaurante: 15–20% é padrão para salões.',
    },
    delivery: {
      zh: '📦 建議至少 $3–$5 底限，司機才容易接單！',
      en: '📦 Tip at least $3–$5 minimum — drivers are more likely to accept.',
      ja: '📦 最低$3〜$5以上のチップでドライバーが受けやすくなります！',
      ko: '📦 최소 $3–$5 이상 팁을 줘야 배달기사가 수락해요!',
      es: '📦 ¡Al menos $3–$5 mínimo para que el repartidor acepte!',
      pt: '📦 Pelo menos $3–$5 de gorjeta para o entregador aceitar!',
    },
    autoGratuity: {
      zh: '🚨 6人以上聚餐！請先翻到帳單底部確認是否已有「Auto-Gratuity」或「Service Charge」。如果有，請把小費設為 0%，避免重複付！',
      en: '🚨 Large party alert! Check the bottom of your bill for "Auto-Gratuity" or "Service Charge." If present, set tip to 0% to avoid double-tipping!',
      ja: '🚨 大人数注意！請求書の下部に"Auto-Gratuity"や"Service Charge"がないか確認。あればチップを0%に！',
      ko: '🚨 대규모 파티 주의! 청구서 하단에 "Auto-Gratuity" 또는 "Service Charge"가 있는지 확인하세요. 있다면 팁을 0%로 설정하세요!',
      es: '🚨 ¡Grupo grande! Revisa el fondo de tu cuenta por "Auto-Gratuity" o "Service Charge". Si existe, pon propina en 0%.',
      pt: '🚨 Grupo grande! Verifique no final da conta por "Auto-Gratuity" ou "Service Charge". Se houver, coloque gorjeta em 0%.',
    },
  },

  display: {
    subtotal:  { zh: '稅前 Subtotal', en: 'Subtotal',    ja: '小計',  ko: '소계',  es: 'Subtotal',  pt: 'Subtotal' },
    billAmount:{ zh: 'Bill Amount',   en: 'Bill Amount', ja: '請求金額', ko: '청구 금액', es: 'Monto', pt: 'Valor' },
    total:     { zh: 'Total',         en: 'Total',       ja: '合計',  ko: '합계',  es: 'Total',     pt: 'Total' },
    perPerson: { zh: '每人',          en: 'per person',  ja: '1人あたり', ko: '1인당', es: 'por persona', pt: 'por pessoa' },
    divPeople: { zh: '人',            en: 'people',      ja: '人',    ko: '명',    es: 'personas',  pt: 'pessoas' },
  },

  split: {
    title:      { zh: '分帳管理', en: 'Split Bill',     ja: '割り勘',  ko: '더치페이', es: 'Dividir cuenta', pt: 'Dividir conta' },
    billTotal:  { zh: '帳單總額', en: 'Bill Total',     ja: '請求合計', ko: '청구 합계', es: 'Total de cuenta', pt: 'Total da conta' },
    preTax:     { zh: '稅前',    en: 'Subtotal',        ja: '税抜',   ko: '세전',   es: 'Sin impuesto', pt: 'Sem imposto' },
    evenSplit:  { zh: '均等分帳', en: 'Even Split',     ja: '均等割り', ko: '균등 분할', es: 'División equitativa', pt: 'Divisão igualitária' },
    evenDesc:   { zh: 'Even Split', en: 'Split equally', ja: '均等に分ける', ko: '균등하게 나누기', es: 'Dividir por igual', pt: 'Dividir igualmente' },
    itemized:   { zh: '品項拆帳', en: 'Itemized Split', ja: '品目別',  ko: '품목별 분할', es: 'Por artículo', pt: 'Por item' },
    itemDesc:   { zh: 'Itemized Split', en: 'By what you ordered', ja: '注文ごとに分ける', ko: '주문한 것으로 나누기', es: 'Según lo pedido', pt: 'Pelo que pediu' },
    splitCount: { zh: '分帳人數', en: 'Number of people', ja: '分割人数', ko: '분할 인원', es: 'Número de personas', pt: 'Número de pessoas' },
    perPerson:  { zh: '每人應付', en: 'Each person pays', ja: '1人あたり', ko: '1인당 금액', es: 'Cada persona paga', pt: 'Cada pessoa paga' },
    owner:      { zh: '(付款人)', en: '(Payer)',          ja: '（支払者）', ko: '(결제자)', es: '(Pagador)', pt: '(Pagador)' },
    remainder:  { zh: '已自動將 $0.01 餘數調整至第一位付款人', en: 'A $0.01 rounding remainder was added to the first payer.',
                  ja: '$0.01の端数を最初の支払者に追加しました', ko: '$0.01 나머지를 첫 번째 결제자에게 추가했습니다',
                  es: 'Se añadió $0.01 al primer pagador.', pt: '$0.01 de arredondamento adicionado ao primeiro pagador.' },
    goSummary:  { zh: '查看結帳總覽 →', en: 'View Summary →', ja: '明細を見る →', ko: '요약 보기 →', es: 'Ver resumen →', pt: 'Ver resumo →' },
    goItemized: { zh: '前往品項拆帳頁面 →', en: 'Go to Itemized Split →', ja: '品目別割り勘へ →', ko: '품목별 분할로 이동 →', es: 'Ir a división por artículo →', pt: 'Ir para divisão por item →' },
    person:     { zh: '人', en: 'Person', ja: '人', ko: '명', es: 'Persona', pt: 'Pessoa' },
  },

  itemized: {
    title:          { zh: '品項拆帳', en: 'Itemized Split', ja: '品目別割り勘', ko: '품목별 분할', es: 'División por artículo', pt: 'Divisão por item' },
    restaurantName: { zh: '餐廳名稱（選填）', en: 'Restaurant name (optional)', ja: 'レストラン名（任意）', ko: '레스토랑 이름 (선택사항)', es: 'Nombre del restaurante (opcional)', pt: 'Nome do restaurante (opcional)' },
    scanReceipt:    { zh: '掃描收據（OCR）', en: 'Scan Receipt (OCR)', ja: 'レシートをスキャン（OCR）', ko: '영수증 스캔 (OCR)', es: 'Escanear recibo (OCR)', pt: 'Escanear recibo (OCR)' },
    takePhoto:      { zh: '📸 拍照 / 選取收據圖片', en: '📸 Take Photo / Upload Receipt', ja: '📸 写真を撮る / アップロード', ko: '📸 사진 찍기 / 영수증 업로드', es: '📸 Tomar foto / Subir recibo', pt: '📸 Tirar foto / Enviar recibo' },
    recognizing:    { zh: '🔍 辨識中... 請稍候', en: '🔍 Recognizing... please wait', ja: '🔍 認識中...', ko: '🔍 인식 중...', es: '🔍 Reconociendo...', pt: '🔍 Reconhecendo...' },
    manualEntry:    { zh: '或手動在下方新增品項', en: 'Or add items manually below', ja: 'または下記で手動追加', ko: '또는 아래에서 수동으로 추가', es: 'O agrega artículos manualmente', pt: 'Ou adicione itens manualmente' },
    ocrFailed:      { zh: 'OCR 無法識別品項，請手動輸入。', en: 'OCR could not detect items. Please add them manually.', ja: 'OCRで品目を認識できませんでした。手動で入力してください。', ko: 'OCR로 품목을 인식하지 못했습니다. 수동으로 입력하세요.', es: 'OCR no pudo detectar artículos. Por favor agrégalos manualmente.', pt: 'OCR não detectou itens. Por favor adicione manualmente.' },
    participants:   { zh: '👥 用餐夥伴', en: '👥 Participants', ja: '👥 参加者', ko: '👥 참가자', es: '👥 Participantes', pt: '👥 Participantes' },
    addPerson:      { zh: '加入夥伴名字', en: "Add person's name", ja: '参加者名を追加', ko: '참가자 이름 추가', es: 'Agregar nombre', pt: 'Adicionar nome' },
    items:          { zh: '🧾 品項清單', en: '🧾 Items', ja: '🧾 品目リスト', ko: '🧾 품목 목록', es: '🧾 Artículos', pt: '🧾 Itens' },
    noItems:        { zh: '尚無品項，請掃描收據或手動新增', en: 'No items yet — scan a receipt or add manually', ja: '品目がありません', ko: '품목이 없습니다', es: 'Sin artículos aún', pt: 'Sem itens ainda' },
    itemName:       { zh: '品項名稱', en: 'Item name', ja: '品目名', ko: '품목 이름', es: 'Nombre del artículo', pt: 'Nome do item' },
    shared:         { zh: '(共食)', en: '(shared)', ja: '（シェア）', ko: '(공유)', es: '(compartido)', pt: '(compartilhado)' },
    itemsSubtotal:  { zh: '品項小計', en: 'Items subtotal', ja: '品目小計', ko: '품목 소계', es: 'Subtotal artículos', pt: 'Subtotal itens' },
    assignTo:       { zh: '點選分配給：', en: 'Assign to:', ja: '割り当て先：', ko: '배정 대상:', es: 'Asignar a:', pt: 'Atribuir a:' },
    eachPays:       { zh: '每人', en: 'Each', ja: '各自', ko: '각자', es: 'Cada uno', pt: 'Cada um' },
    preview:        { zh: '💰 各人預覽', en: '💰 Per-person Preview', ja: '💰 個人別プレビュー', ko: '💰 개인별 미리보기', es: '💰 Vista previa por persona', pt: '💰 Prévia por pessoa' },
    food:           { zh: '餐', en: 'food', ja: '食事', ko: '음식', es: 'comida', pt: 'comida' },
    tax:            { zh: '稅', en: 'tax', ja: '税', ko: '세금', es: 'impuesto', pt: 'imposto' },
    tip:            { zh: '小費', en: 'tip', ja: 'チップ', ko: '팁', es: 'propina', pt: 'gorjeta' },
    confirmSummary: { zh: '確認並查看結帳總覽 →', en: 'Confirm & View Summary →', ja: '確認して明細を見る →', ko: '확인 및 요약 보기 →', es: 'Confirmar y ver resumen →', pt: 'Confirmar e ver resumo →' },
    unassigned:     { zh: '還有品項未分配', en: 'items unassigned', ja: '未割り当て品目あり', ko: '미배정 품목 있음', es: 'artículos sin asignar', pt: 'itens sem atribuição' },
    items_unit:     { zh: '項', en: '', ja: '件', ko: '개', es: '', pt: '' },
    unassignedAlert:{ zh: '還有 {n} 個品項尚未指派！請先完成分配。', en: '{n} item(s) still unassigned! Please assign all items first.',
                      ja: 'まだ{n}件未割り当てです！先に全品目を割り当ててください。', ko: '아직 {n}개 미배정! 모든 품목을 먼저 배정해주세요.',
                      es: '¡{n} artículo(s) sin asignar! Por favor asígnalos primero.', pt: '{n} item(ns) sem atribuição! Por favor atribua todos os itens primeiro.' },
  },

  summary: {
    title:      { zh: '結帳總覽', en: 'Bill Summary',   ja: '支払い明細', ko: '청구 요약', es: 'Resumen de cuenta', pt: 'Resumo da conta' },
    copyAll:    { zh: '📋 複製全部', en: '📋 Copy All',  ja: '📋 全てコピー', ko: '📋 전체 복사', es: '📋 Copiar todo', pt: '📋 Copiar tudo' },
    copied:     { zh: '✓ 已複製', en: '✓ Copied!',      ja: '✓ コピーしました', ko: '✓ 복사됨', es: '✓ ¡Copiado!', pt: '✓ Copiado!' },
    billTotal:  { zh: '帳單總額', en: 'Bill Total',      ja: '請求合計', ko: '청구 합계', es: 'Total de cuenta', pt: 'Total da conta' },
    copyDetail: { zh: '📋 複製此人明細', en: '📋 Copy Details', ja: '📋 詳細をコピー', ko: '📋 세부사항 복사', es: '📋 Copiar detalles', pt: '📋 Copiar detalhes' },
    share:      { zh: '📤 一鍵分享', en: '📤 Share',    ja: '📤 シェア', ko: '📤 공유', es: '📤 Compartir', pt: '📤 Compartilhar' },
    shareBtn:   { zh: '📱 分享', en: '📱 Share',         ja: '📱 シェア', ko: '📱 공유', es: '📱 Compartir', pt: '📱 Compartilhar' },
    iMessage:   { zh: '💬 iMessage', en: '💬 iMessage', ja: '💬 iMessage', ko: '💬 iMessage', es: '💬 iMessage', pt: '💬 iMessage' },
    venmo:      { zh: '💸 Venmo', en: '💸 Venmo',       ja: '💸 Venmo', ko: '💸 Venmo', es: '💸 Venmo', pt: '💸 Venmo' },
    copyText:   { zh: '📋 複製文字', en: '📋 Copy Text', ja: '📋 テキストをコピー', ko: '📋 텍스트 복사', es: '📋 Copiar texto', pt: '📋 Copiar texto' },
    preview:    { zh: '分享格式預覽：', en: 'Share preview:', ja: 'シェアプレビュー：', ko: '공유 미리보기:', es: 'Vista previa:', pt: 'Prévia de compartilhamento:' },
    restart:    { zh: '🔄 重新計算', en: '🔄 Start Over', ja: '🔄 最初からやり直す', ko: '🔄 처음부터 다시', es: '🔄 Empezar de nuevo', pt: '🔄 Recomeçar' },
    remainder:  { zh: '包含 +$0.01 餘數調整', en: 'Includes +$0.01 rounding', ja: '+$0.01の端数調整を含む', ko: '+$0.01 반올림 포함', es: 'Incluye ajuste de +$0.01', pt: 'Inclui ajuste de +$0.01' },
    propTax:    { zh: '比例稅金', en: 'Prop. tax', ja: '按分税金', ko: '비례 세금', es: 'Imp. proporcional', pt: 'Imposto proporcional' },
    propTip:    { zh: '比例小費', en: 'Prop. tip', ja: '按分チップ', ko: '비례 팁', es: 'Propina prop.', pt: 'Gorjeta proporcional' },
    evenFood:   { zh: '均分餐費', en: 'Food share',  ja: '食事按分', ko: '음식 분담', es: 'Comida compartida', pt: 'Comida compartilhada' },
    evenTax:    { zh: '均分稅金', en: 'Tax share',   ja: '税金按分', ko: '세금 분담', es: 'Impuesto compartido', pt: 'Imposto compartilhado' },
    evenTip:    { zh: '均分小費', en: 'Tip share',   ja: 'チップ按分', ko: '팁 분담', es: 'Propina compartida', pt: 'Gorjeta compartilhada' },
    shareMsg:   { zh: '🧾 TipSplit USA 幫我們算好囉！', en: '🧾 TipSplit USA sorted the bill!',
                  ja: '🧾 TipSplit USAで計算しました！', ko: '🧾 TipSplit USA로 계산했어요!',
                  es: '🧾 ¡TipSplit USA calculó la cuenta!', pt: '🧾 TipSplit USA calculou a conta!' },
    restaurant: { zh: '餐廳：', en: 'Restaurant: ', ja: 'レストラン：', ko: '레스토랑:', es: 'Restaurante:', pt: 'Restaurante:' },
    owes:       { zh: '應付：', en: 'owes: ',       ja: '支払額：', ko: '납부액:', es: 'debe:', pt: 'deve:' },
    date:       { zh: '日期：', en: 'Date: ',        ja: '日付：', ko: '날짜:', es: 'Fecha:', pt: 'Data:' },
  },
} as const;

export type TranslationKey = {
  zh: string; en: string; ja: string; ko: string; es: string; pt: string;
};

export function t(key: TranslationKey, lang: Lang): string {
  return key[lang] ?? key['en'];
}

export function tpl(key: TranslationKey, lang: Lang, vars: Record<string, string | number>): string {
  let str = t(key, lang);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v));
  }
  return str;
}
