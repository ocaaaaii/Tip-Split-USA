'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Lang } from '@/lib/i18n';

interface Props { onDone: () => void; }

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English',    flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'zh', label: '繁體中文',   flag: '\u{1F1F9}\u{1F1FC}' },
  { code: 'sc', label: '简体中文',   flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ja', label: '日本語',     flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', label: '한국어',     flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'es', label: 'Español',    flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'pt', label: 'Português',  flag: '\u{1F1E7}\u{1F1F7}' },
];

type SlideContent = {
  icon: string;
  title: string;
  body: string;
  hint?: string;
  isSupport?: boolean;
};

const SLIDES: Record<Lang, SlideContent[]> = {
  en: [
    { icon: '\u{1F9EE}', title: 'Welcome to TipSplit USA', body: 'The smartest tip calculator for dining in the US. Start by choosing your language!', hint: 'Select language above' },
    { icon: '\u{1F4B5}', title: 'Enter Your Bill', body: 'Tap the number pad to enter your bill. Toggle between pre-tax and tax-inclusive amounts — tip auto-calculates.', hint: 'Top-right toggle switch' },
    { icon: '\u{1F37D}️', title: 'Pick Your Scenario', body: 'Restaurant, takeout, bar, taxi… each scenario suggests the right tip range. Tap ⓘ for a tip culture guide.', hint: '7 common scenarios supported' },
    { icon: '\u{1F9FE}', title: 'Split the Bill', body: 'Even split in one tap, or itemized split where you assign each dish. Alcohol items auto-exclude non-drinkers.', hint: 'Haptic feedback + detailed receipt' },
    { icon: '\u{1F4CB}', title: 'History & Trip Mode', body: 'Every bill saves automatically — browse your last 20. Group bills into a trip to track total spending.', hint: 'Tap History on the summary page' },
    { icon: '\u{1F4CD}', title: 'GPS Tax Detection', body: 'The app detects your location and sets the correct state & city tax rate automatically. Tap the Tax button at the top to pick a city or enter a custom rate.', hint: 'County-level rates supported' },
    { icon: '\u{1F4F1}', title: 'Share & Add to Home Screen', body: 'Share split results as an image to LINE, IG, or WhatsApp. Add TipSplit to your home screen for instant access — no app store, works offline too.', hint: 'No download needed' },
    { icon: '☕', title: 'Enjoying TipSplit?', body: 'TipSplit is 100% free — no ads, no data collection. If it saved you from an awkward bill moment, buy us a coffee!', isSupport: true },
  ],
  zh: [
    { icon: '\u{1F9EE}', title: '歡迎使用 TipSplit USA', body: '第一名的小費計算 App，專為在美國消費的你設計。先選擇你的語言！', hint: '上方選擇語言' },
    { icon: '\u{1F4B5}', title: '輸入帳單金額', body: '點擊數字鍵盤輸入金額。支援「稅前金額」與「稅內金額」切換，自動算出小費。', hint: '右上角切換開關' },
    { icon: '\u{1F37D}️', title: '選擇消費場景', body: '餐廳、外帶、酒吧、計程車…每個場景自動推薦最佳小費比率。點 ⓘ 看小費文化教學卡。', hint: '支援 7 個常見場景' },
    { icon: '\u{1F9FE}', title: '靈活分帳', body: '「平均分帳」一鍵搞定；「品項拆帳」可指定誰吃什麼。含酒水對不喝酒者自動排除。', hint: '振動反饋 + 詳細收據' },
    { icon: '\u{1F4CB}', title: '歷史記錄 & 旅遊模式', body: '每筆帳單自動儲存，最近 20 筆隨時查閱。建立旅行群組，統計整趟小費支出。', hint: '結帳頁點右上角「歷史」' },
    { icon: '\u{1F4CD}', title: 'GPS 自動偵測稅率', body: 'App 會自動抓取你所在的州市稅率，免手動查詢。點上方的「Tax %」按鈕可手動選擇城市，或輸入自訂稅率。', hint: '支援縣市級稅率，含 Alameda County' },
    { icon: '\u{1F4F1}', title: '截圖分享 & 加到主畫面', body: '分帳結果可一鍵截圖，分享到 LINE、IG、WhatsApp。把 TipSplit 加到手機主畫面，像 App 一樣快速開啟，支援離線使用。', hint: '不需下載，直接加到主畫面' },
    { icon: '☕', title: '覺得好用嗎？', body: 'TipSplit 完全免費，沒有廣告，不蒐集資料。如果它幫你省下了尷尬的結帳時刻，請我們喝杯咖啡吧 ☺', isSupport: true },
  ],
  sc: [
    { icon: '\u{1F9EE}', title: '欢迎使用 TipSplit USA', body: '第一名的小费计算 App，专为在美国消费的你设计。先选择你的语言！', hint: '上方选择语言' },
    { icon: '\u{1F4B5}', title: '输入账单金额', body: '点击数字键盘输入金额。支持「税前金额」与「税内金额」切换，自动算出小费。', hint: '右上角切换开关' },
    { icon: '\u{1F37D}️', title: '选择消费场景', body: '餐厅、外带、酒吧、出租车…每个场景自动推荐最佳小费比率。点 ⓘ 看小费文化教学卡。', hint: '支持 7 个常见场景' },
    { icon: '\u{1F9FE}', title: '灵活分账', body: '「平均分摊」一键搞定；「品项拆账」可指定谁吃什么。含酒水对不喝酒者自动排除。', hint: '震动反馈 + 详细收据' },
    { icon: '\u{1F4CB}', title: '历史记录 & 旅游模式', body: '每笔账单自动保存，最近 20 笔随时查阅。建立旅行群组，统计整趟小费支出。', hint: '结账页点右上角「历史」' },
    { icon: '\u{1F4CD}', title: 'GPS 自动检测税率', body: 'App 会自动抓取你所在的州市税率，免手动查询。点上方的「Tax %」按钮可手动选择城市，或输入自定义税率。', hint: '支持县市级税率，含 Alameda County' },
    { icon: '\u{1F4F1}', title: '截图分享 & 加到主页面', body: '分账结果可一键截图，分享到 LINE、IG、WhatsApp。把 TipSplit 加到手机主页面，像 App 一样快速打开，支持离线使用。', hint: '不需下载，直接加到主页面' },
    { icon: '☕', title: '觉得好用吗？', body: 'TipSplit 完全免费，没有广告，不收集数据。如果它帮你省下了尴尬的结账时刻，请我们喝杯咖啡吧 ☺', isSupport: true },
  ],
  ja: [
    { icon: '\u{1F9EE}', title: 'TipSplit USA へようこそ', body: 'アメリカでの食事に最適なチップ計算アプリです。まず言語を選んでください！', hint: '上のボタンで言語選択' },
    { icon: '\u{1F4B5}', title: '請求金額を入力', body: 'テンキーで金額を入力。税抜き・税込み切り替えで自動計算します。', hint: '右上のトグルスイッチ' },
    { icon: '\u{1F37D}️', title: 'シナリオを選択', body: 'レストラン、テイクアウト、バー、タクシー…各シナリオに最適なチップ率を提案。ⓘ でチップ文化ガイドを表示。', hint: '7種類のシナリオ対応' },
    { icon: '\u{1F9FE}', title: '割り勘機能', body: '均等割りはワンタップ。品目別割りで誰が何を食べたか指定可能。お酒を飲まない人はアルコール品目から自動除外。', hint: '振動フィードバック対応' },
    { icon: '\u{1F4CB}', title: '履歴 & 旅行モード', body: '会計は自動保存（最新20件）。旅行グループを作って合計支出を管理。', hint: '会計ページ右上「履歴」ボタン' },
    { icon: '\u{1F4CD}', title: 'GPS税率自動検出', body: 'アプリが現在地を検出し、州・市の税率を自動設定します。上部の「Tax」ボタンで手動選択や独自税率の入力も可能。', hint: '郡レベルの税率に対応' },
    { icon: '\u{1F4F1}', title: '画像シェア & ホーム画面追加', body: '割り勘結果を画像としてLINEやInstagramにシェア。ホーム画面に追加すればアプリのように素早く開け、オフラインでも使えます。', hint: 'ダウンロード不要' },
    { icon: '☕', title: 'TipSplitはいかがですか？', body: '完全無料、広告なし、データ収集なし。役に立ったら、コーヒーをおごってください ☺', isSupport: true },
  ],
  ko: [
    { icon: '\u{1F9EE}', title: 'TipSplit USA에 오신 것을 환영합니다', body: '미국 식사에 최적화된 팁 계산기입니다. 먼저 언어를 선택하세요！', hint: '위에서 언어 선택' },
    { icon: '\u{1F4B5}', title: '금액 입력', body: '숫자 패드로 금액을 입력하세요. 세전/세후 전환 스위치로 자동 계산됩니다.', hint: '우측 상단 토글 스위치' },
    { icon: '\u{1F37D}️', title: '시나리오 선택', body: '레스토랑, 테이크아웃, 바, 택시… 각 시나리오에 맞는 팁 비율 자동 추천. ⓘ 버튼으로 팁 문화 가이드 확인.', hint: '7가지 시나리오 지원' },
    { icon: '\u{1F9FE}', title: '유연한 정산', body: '균등 분담는 원터치로, 품목별 분담로 누가 뭐를 먹었는지 지정 가능. 주류 항목은 마시지 않는 사람에게서 자동 제외.', hint: '진동 피드백 + 상세 영수증' },
    { icon: '\u{1F4CB}', title: '기록 & 여행 모드', body: '모든 청구서는 자동 저장(최대 20건). 여행 그룹을 만들어 전체 지출을 관리하세요.', hint: '정산 페이지 우측 상단 기록' },
    { icon: '\u{1F4CD}', title: 'GPS 세율 자동 감지', body: '앱이 위치를 감지하여 주·도시의 세율을 자동으로 설정합니다. 상단의 Tax 버튼으로 수동 선택이나 직접 입력도 가능합니다.', hint: '카운티 수준 세율 지원' },
    { icon: '\u{1F4F1}', title: '이미지 공유 & 홈 화면 추가', body: '정산 결과를 이미지로 LINE, IG, WhatsApp에 공유하세요. 홈 화면에 추가하면 앱처럼 빠르게 열 수 있고 오프라인도 지원합니다.', hint: '다운로드 불필요' },
    { icon: '☕', title: 'TipSplit이 도움이 됐나요？', body: '완전 무료, 광고 없음, 데이터 수집 없음. 도움이 됐다면 커피 한 잔 사주세요 ☺', isSupport: true },
  ],
  es: [
    { icon: '\u{1F9EE}', title: 'Bienvenido a TipSplit USA', body: 'La calculadora de propinas más inteligente para comer en EE.UU. Primero, elige tu idioma.', hint: 'Selecciona idioma arriba' },
    { icon: '\u{1F4B5}', title: 'Ingresa tu cuenta', body: 'Usa el teclado para ingresar el monto. Cambia entre precio antes/después de impuestos — la propina se calcula sola.', hint: 'Interruptor en la esquina superior derecha' },
    { icon: '\u{1F37D}️', title: 'Elige el escenario', body: 'Restaurante, para llevar, bar, taxi… cada escenario sugiere el porcentaje correcto. Toca ⓘ para la guía cultural.', hint: '7 escenarios comunes' },
    { icon: '\u{1F9FE}', title: 'Divide la cuenta', body: 'División equitativa con un toque, o por item para asignar cada plato. Las bebidas alcohólicas excluyen a quien no bebe.', hint: 'Feedback háptico + recibo detallado' },
    { icon: '\u{1F4CB}', title: 'Historial & Modo viaje', body: 'Cada cuenta se guarda automáticamente (hasta 20). Agrupa cuentas en un viaje para ver el gasto total.', hint: 'Toca Historial en el resumen' },
    { icon: '\u{1F4CD}', title: 'Detección de impuesto por GPS', body: 'La app detecta tu ubicación y configura la tasa de impuesto correcta. Toca el botón Tax arriba para elegir ciudad o ingresar una tasa personalizada.', hint: 'Tasas a nivel de condado' },
    { icon: '\u{1F4F1}', title: 'Compartir & Pantalla de inicio', body: 'Comparte los resultados como imagen en LINE, IG o WhatsApp. Añade TipSplit a tu pantalla de inicio — sin app store, funciona sin conexión.', hint: 'Sin descarga' },
    { icon: '☕', title: '¿Te gustó TipSplit?', body: 'TipSplit es 100% gratis, sin anuncios ni recopilación de datos. Si te salvó de un momento incómodo, ¡invítanos un café! ☺', isSupport: true },
  ],
  pt: [
    { icon: '\u{1F9EE}', title: 'Bem-vindo ao TipSplit USA', body: 'A calculadora de gorjetas mais inteligente para comer nos EUA. Primeiro, escolha seu idioma.', hint: 'Selecione idioma acima' },
    { icon: '\u{1F4B5}', title: 'Insira o valor da conta', body: 'Use o teclado para inserir o valor. Alterne entre preço com/sem impostos — a gorjeta calcula automaticamente.', hint: 'Interruptor no canto superior direito' },
    { icon: '\u{1F37D}️', title: 'Escolha o cenário', body: 'Restaurante, delivery, bar, táxi… cada cenário sugere a porcentagem certa. Toque ⓘ para o guia cultural.', hint: '7 cenários comuns' },
    { icon: '\u{1F9FE}', title: 'Divida a conta', body: 'Divisão igualitária com um toque, ou por item para atribuir cada prato. Bebidas alcoólicas excluem quem não bebe.', hint: 'Feedback háptico + recibo detalhado' },
    { icon: '\u{1F4CB}', title: 'Histórico & Modo viagem', body: 'Cada conta é salva automaticamente (até 20). Agrupe contas em uma viagem para ver o gasto total.', hint: 'Toque Histórico no resumo' },
    { icon: '\u{1F4CD}', title: 'Detecção de imposto por GPS', body: 'O app detecta sua localização e define a taxa de imposto correta. Toque no botão Tax acima para escolher cidade ou inserir taxa personalizada.', hint: 'Taxas a nível de condado' },
    { icon: '\u{1F4F1}', title: 'Compartilhar & Tela inicial', body: 'Compartilhe os resultados como imagem no LINE, IG ou WhatsApp. Adicione ao início para acesso instantâneo, sem app store, funciona offline.', hint: 'Sem download' },
    { icon: '☕', title: 'Gostou do TipSplit?', body: 'TipSplit é 100% gratuito, sem anúncios e sem coleta de dados. Se te salvou de um momento constrangedor, nos pague um café! ☺', isSupport: true },
  ],
};

const START_BTN: Record<Lang, string> = {
  zh: '開始使用 →', sc: '开始使用 →', en: 'Get Started →',
  ja: '始める →', ko: '시작하기 →', es: 'Comenzar →', pt: 'Começar →',
};
const NEXT_BTN: Record<Lang, string> = {
  zh: '下一步', sc: '下一步', en: 'Next', ja: '次へ', ko: '다음', es: 'Siguiente', pt: 'Próximo',
};
const SKIP_BTN: Record<Lang, string> = {
  zh: '跳過', sc: '跳过', en: 'Skip', ja: 'スキップ', ko: '건너뛰기', es: 'Omitir', pt: 'Pular',
};
const KOFI_BTN: Record<Lang, string> = {
  zh: '☕ 請我們喝咖啡', sc: '☕ 请我们喝咖啡', en: '☕ Buy us a coffee',
  ja: '☕ コーヒーをおごる', ko: '☕ 커피 사주기', es: '☕ Invítanos un café', pt: '☕ Nos pague um café',
};

export default function OnboardingModal({ onDone }: Props) {
  const { lang, setLang } = useAppStore();
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const slides = SLIDES[lang];
  const isLast = step === slides.length - 1;
  const isFirst = step === 0;
  const slide = slides[step];

  const go = (nextStep: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setStep(nextStep); setTransitioning(false); }, 200);
  };

  const handleLangSelect = (code: Lang) => { setLang(code); setStep(0); };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'var(--cream-bg)' }}>
      {/* Language picker */}
      <div className="flex justify-center gap-1.5 px-4 pt-4 pb-2 flex-wrap">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLangSelect(l.code)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              background: lang === l.code ? 'var(--accent-warm)' : 'var(--cream-card)',
              color: lang === l.code ? 'white' : 'var(--mocha-mid)',
              border: lang === l.code ? '1.5px solid var(--accent-warm)' : '1.5px solid var(--cream-border)',
            }}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Slide area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div
          className="w-full max-w-[420px]"
          style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.2s ease', textAlign: 'center' }}
        >
          {/* Icon */}
          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cream-card) 0%, var(--cream-bg) 100%)',
              border: '2px solid var(--cream-border)',
              boxShadow: '0 4px 20px rgba(61,29,10,0.10)',
              fontSize: 42,
            }}
          >
            {slide.icon}
          </div>

          {/* Step */}
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mocha-light)', marginBottom: 8 }}>
            {step + 1} / {slides.length}
          </p>

          {/* Title */}
          <h2 style={{
            fontSize: 24, fontWeight: 700, color: 'var(--mocha-dark)', lineHeight: 1.25,
            fontFamily: 'var(--font-playfair, Georgia, serif)', marginBottom: 14,
          }}>
            {slide.title}
          </h2>

          {/* Body */}
          <p style={{ fontSize: 15, color: 'var(--mocha-mid)', lineHeight: 1.7, marginBottom: 20 }}>
            {slide.body}
          </p>

          {/* Hint chip OR Ko-fi support block */}
          {slide.isSupport ? (
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://ko-fi.com/tipsplit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #FF5E5B 0%, #FF8C42 100%)' }}
              >
                {KOFI_BTN[lang]}
              </a>
              <p style={{ fontSize: 10, color: 'var(--mocha-light)', opacity: 0.55 }}>
                ko-fi.com/tipsplit
              </p>
            </div>
          ) : slide.hint ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(104,141,165,0.15)', border: '1px solid rgba(104,141,165,0.35)' }}
            >
              <span style={{ fontSize: 12 }}>{'\u{1F4A1}'}</span>
              <span style={{ fontSize: 12, color: 'var(--accent-warm)', fontWeight: 600 }}>{slide.hint}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i === step ? 'var(--accent-warm)' : 'var(--cream-border)',
              transition: 'all 0.25s ease', border: 'none', cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-10 flex gap-3 max-w-[420px] mx-auto w-full">
        {!isFirst ? (
          <button
            onClick={() => go(step - 1)}
            className="px-4 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all"
            style={{ background: 'var(--cream-card)', border: '1.5px solid var(--cream-border)', color: 'var(--mocha-mid)', minWidth: 52 }}
          >
            ←
          </button>
        ) : (
          <button
            onClick={onDone}
            className="px-4 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all"
            style={{ background: 'var(--cream-bg)', border: '1.5px solid var(--mocha-light)', color: 'var(--mocha-dark)', minWidth: 52 }}
          >
            {SKIP_BTN[lang]}
          </button>
        )}

        <button
          onClick={isLast ? onDone : () => go(step + 1)}
          className="flex-1 py-3.5 rounded-xl font-bold text-white text-base active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, var(--accent-warm) 0%, #5A7A92 100%)' }}
        >
          {isLast ? START_BTN[lang] : NEXT_BTN[lang]}
        </button>
      </div>
    </div>
  );
}
