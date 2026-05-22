'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Lang } from '@/lib/i18n';

interface Props { onDone: () => void; }

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English',     flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'zh', label: '繁體中文', flag: '\u{1F1F9}\u{1F1FC}' },
  { code: 'sc', label: '简体中文', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ja', label: '日本語',   flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', label: '한국어',   flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'es', label: 'Español',  flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'pt', label: 'Português', flag: '\u{1F1E7}\u{1F1F7}' },
];

type SlideContent = {
  icon: string;
  title: string;
  body: string;
  hint?: string;
};

const SLIDES: Record<Lang, SlideContent[]> = {
  zh: [
    {
      icon: '\u{1F9EE}',
      title: '歡迎使用 TipSplit USA',
      body: '第一名的小費計算 App，專為在美國消費的你設計。先選擇你的語言！',
      hint: '上方選擇語言',
    },
    {
      icon: '\u{1F4B5}',
      title: '輸入帳單金額',
      body: '點擊數字鍵盤輸入金額。支援「税前金額」與「税內金額」切換，自動算出小費。',
      hint: '右上角切換开關',
    },
    {
      icon: '\u{1F37D}️',
      title: '選擇消費場景',
      body: '餐廳、外帶、酒吧、計程車…每個場景自動推薦最佳小費比率。點 ⓘ 看小費文化教學卡。',
      hint: '支援 7 個常見場景',
    },
    {
      icon: '\u{1F9FE}',
      title: '靈活分帳',
      body: '「平均分帳」一鍵搞定；「品項拆帳」可指定誰吃什麼。含酒水對不喝酒者自動排除。',
      hint: '振動反饋 + 詳細收据',
    },
    {
      icon: '\u{1F4CB}',
      title: '歷史記錄 & 旅遊模式',
      body: '每筆帳單自動儲存，最近 20 筆隨時查閱。建立旅行群組，統計整趟小費支出。',
      hint: '結帳頁點右上角「歷史」',
    },
  ],
  en: [
    {
      icon: '\u{1F9EE}',
      title: 'Welcome to TipSplit USA',
      body: 'The smartest tip calculator for spending in the US. Start by choosing your language!',
      hint: 'Select language above',
    },
    {
      icon: '\u{1F4B5}',
      title: 'Enter Your Bill',
      body: 'Tap the number pad to enter your bill. Toggle between pre-tax and tax-inclusive amounts — tip auto-calculates.',
      hint: 'Top-right toggle switch',
    },
    {
      icon: '\u{1F37D}️',
      title: 'Pick Your Scenario',
      body: 'Restaurant, takeout, bar, taxi... each scenario suggests the right tip range. Tap ⓘ for a cultural guide.',
      hint: '7 common scenarios supported',
    },
    {
      icon: '\u{1F9FE}',
      title: 'Split the Bill',
      body: 'Even split in one tap, or itemized split where you assign each dish. Alcohol items auto-exclude non-drinkers.',
      hint: 'Haptic feedback + detailed receipt',
    },
    {
      icon: '\u{1F4CB}',
      title: 'History & Trip Mode',
      body: 'Every bill saves automatically — browse your last 20. Group bills into a trip to track total spending.',
      hint: 'Tap \u{1F4CB} History on the summary page',
    },
  ],
  ja: [
    {
      icon: '\u{1F9EE}',
      title: 'TipSplit USA へようこそ',
      body: 'アメリカでの消費に最適なチップ計算アプリです。まず言語を選んでください！',
      hint: '上のボタンで言語選択',
    },
    {
      icon: '\u{1F4B5}',
      title: '請求書の金額を入力',
      body: 'テンキーパッドで金額を入力。税抜き・税込みの切り替えで自動計算。',
      hint: '右上のトグルスイッチ',
    },
    {
      icon: '\u{1F37D}️',
      title: 'シナリオを選択',
      body: 'レストラン、テイクアウト、バー、タクシー…各シナリオに最適なチップ率を提案。ⓘボタンでチップ文化ガイドを表示。',
      hint: '7種類のシナリオ対応',
    },
    {
      icon: '\u{1F9FE}',
      title: '杯割り機能',
      body: '均等割りはワンタップ。品目別割りで誰が何を食べたか指定可能。お酒を飲まない人はアルコール品目から自動除外。',
      hint: '振動フィードバック対応',
    },
    {
      icon: '\u{1F4CB}',
      title: '履歴 & 旅行モード',
      body: '会計は自動保存（最新20件）。旅行グループを作って合計支出を管理。',
      hint: '会計ページ右上「履歴」ボタン',
    },
  ],
  ko: [
    {
      icon: '\u{1F9EE}',
      title: 'TipSplit USA에 오신 것을 환영합니다',
      body: '미국 소비에 최적화된 팔 계산기입니다. 먼저 언어를 선택하세요!',
      hint: '위에서 언어 선택',
    },
    {
      icon: '\u{1F4B5}',
      title: '구만 금액 입력',
      body: '숫자 패드로 금액을 입력하세요. 세전/세후 전환 스위치로 자동 계산됩니다.',
      hint: '우측 상단 토글 스위치',
    },
    {
      icon: '\u{1F37D}️',
      title: '시나리오 선택',
      body: '레스토랑, 테이크아웃, 바, 택시… 각 시나리오에 맞는 팔 비율 자동 추천. ⓘ 버튼으로 팔 문화 가이드 확인.',
      hint: '7가지 시나리오 지원',
    },
    {
      icon: '\u{1F9FE}',
      title: '유연한 정산 분담',
      body: '균등 분담는 원터치로, 품목별 분담로 누가 뭐를 먹었는지 지정 가능. 주류 항목은 마시지 않는 사람에게서 자동 제외.',
      hint: '진동 피드백 + 상세 영수증',
    },
    {
      icon: '\u{1F4CB}',
      title: '기록 & 여행 모드',
      body: '모든 청구서는 자동 저장(최대 20건). 여행 그룹을 만들어 전체 지출을 관리하세요.',
      hint: '정산 페이지 우측 상단 \u{1F4CB} 기록',
    },
  ],
  es: [
    {
      icon: '\u{1F9EE}',
      title: 'Bienvenido a TipSplit USA',
      body: 'La calculadora de propinas más inteligente para gastar en EE.UU. Primero, elige tu idioma.',
      hint: 'Selecciona idioma arriba',
    },
    {
      icon: '\u{1F4B5}',
      title: 'Ingresa tu cuenta',
      body: 'Usa el teclado numérico para ingresar el monto. Cambia entre precio antes/después de impuestos fácilmente.',
      hint: 'Interruptor en la esquina superior derecha',
    },
    {
      icon: '\u{1F37D}️',
      title: 'Elige el escenario',
      body: 'Restaurante, para llevar, bar, taxi… cada escenario sugiere el porcentaje correcto. Toca ⓘ para la guía cultural.',
      hint: '7 escenarios comunes soportados',
    },
    {
      icon: '\u{1F9FE}',
      title: 'Divide la cuenta',
      body: 'División equitativa con un toque, o itemizada para asignar cada plato. Las bebidas alcohólicas excluyen a quien no bebe.',
      hint: 'Feedback háptico + recibo detallado',
    },
    {
      icon: '\u{1F4CB}',
      title: 'Historial & Modo viaje',
      body: 'Cada cuenta se guarda automáticamente (hasta 20). Agrupa cuentas en un viaje para ver el gasto total.',
      hint: 'Toca \u{1F4CB} Historial en el resumen',
    },
  ],
  sc: [
    {
      icon: '\u{1F9EE}',
      title: '欢迎使用 TipSplit USA',
      body: '第一名的小费计算 App，专为在美国消费的你设计。先选择你的语言！',
      hint: '上方选择语言',
    },
    {
      icon: '\u{1F4B5}',
      title: '输入账单金额',
      body: '点击数字键盘输入金额。支持「税前金额」与「税内金额」切换，自动算出小费。',
      hint: '右上角切换开关',
    },
    {
      icon: '\u{1F37D}\uFE0F',
      title: '选择消费场景',
      body: '餐厅、外带、酒吧、出租车…每个场景自动推荐最佳小费比率。点 ⓘ 看小费文化教学卡。',
      hint: '支持 7 个常见场景',
    },
    {
      icon: '\u{1F9FE}',
      title: '灵活分账',
      body: '「平均分摊」一键搞定；「品项拆账」可指定谁吃什么。含酒水对不喝酒者自动排除。',
      hint: '震动反馈 + 详细收据',
    },
    {
      icon: '\u{1F4CB}',
      title: '历史记录 & 旅游模式',
      body: '每笔账单自动保存，最近 20 笔随时查阅。建立旅行群组，统计整趟小费支出。',
      hint: '结账页点右上角「历史」',
    },
  ],
  pt: [
    {
      icon: '\u{1F9EE}',
      title: 'Bem-vindo ao TipSplit USA',
      body: 'A calculadora de gorjetas mais inteligente para gastar nos EUA. Primeiro, escolha seu idioma.',
      hint: 'Selecione idioma acima',
    },
    {
      icon: '\u{1F4B5}',
      title: 'Insira o valor da conta',
      body: 'Use o teclado numérico para inserir o valor. Alterne entre preço com/sem impostos facilmente.',
      hint: 'Interruptor no canto superior direito',
    },
    {
      icon: '\u{1F37D}️',
      title: 'Escolha o cenário',
      body: 'Restaurante, delivery, bar, táxi… cada cenário sugere a porcentagem certa. Toque ⓘ para o guia cultural.',
      hint: '7 cenários comuns suportados',
    },
    {
      icon: '\u{1F9FE}',
      title: 'Divida a conta',
      body: 'Divisão igualitária com um toque, ou por item para atribuir cada prato. Bebidas alcoólicas excluem quem não bebe.',
      hint: 'Feedback háptico + recibo detalhado',
    },
    {
      icon: '\u{1F4CB}',
      title: 'Histórico & Modo viagem',
      body: 'Cada conta é salva automaticamente (até 20). Agrupe contas em uma viagem para ver o gasto total.',
      hint: 'Toque \u{1F4CB} Histórico no resumo',
    },
  ],
};

const START_BTN: Record<Lang, string> = {
  zh: '開始使用 →',
  sc: '开始使用 →',
  en: 'Get Started →',
  ja: '始める →',
  ko: '시작하기 →',
  es: 'Comenzar →',
  pt: 'Começar →',
};

const NEXT_BTN: Record<Lang, string> = {
  zh: '下一步', sc: '下一步', en: 'Next', ja: '次へ', ko: '다음', es: 'Siguiente', pt: 'Próximo',
};
const SKIP_BTN: Record<Lang, string> = {
  zh: '跳過', sc: '跳过', en: 'Skip', ja: 'スキップ', ko: '건너뛰기', es: 'Omitir', pt: 'Pular',
};

export default function OnboardingModal({ onDone }: Props) {
  const { lang, setLang } = useAppStore();
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const slides = SLIDES[lang];
  const isLast = step === slides.length - 1;
  const isFirst = step === 0;

  const go = (nextStep: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setStep(nextStep); setTransitioning(false); }, 200);
  };

  const handleLangSelect = (code: Lang) => { setLang(code); setStep(0); };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#EDE0C0' }}>
      {/* Top bar: language picker */}
      <div className="flex justify-center gap-1.5 pt-safe px-4 pt-4 pb-2 flex-wrap">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLangSelect(l.code)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              background: lang === l.code ? '#688DA5' : '#F7EED8',
              color: lang === l.code ? 'white' : '#6B3A20',
              border: lang === l.code ? '1.5px solid #688DA5' : '1.5px solid #D4B880',
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
            className="mx-auto mb-6 flex items-center justify-center"
            style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F7EED8 0%, #EDE0C0 100%)',
              border: '2px solid #D4B880',
              boxShadow: '0 4px 20px rgba(61,29,10,0.12)',
              fontSize: 46,
            }}
          >
            {slides[step].icon}
          </div>

          {/* Step number */}
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07858', marginBottom: 8 }}>
            {step + 1} / {slides.length}
          </p>

          {/* Title */}
          <h2 style={{
            fontSize: 26, fontWeight: 700, color: '#3D1D0A', lineHeight: 1.25,
            fontFamily: 'var(--font-playfair, Georgia, serif)', marginBottom: 16,
          }}>
            {slides[step].title}
          </h2>

          {/* Body */}
          <p style={{ fontSize: 15, color: '#6B3A20', lineHeight: 1.7, marginBottom: 20 }}>
            {slides[step].body}
          </p>

          {/* Hint chip */}
          {slides[step].hint && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(104,141,165,0.15)', border: '1px solid rgba(104,141,165,0.35)' }}
            >
              <span style={{ fontSize: 12 }}>{String.fromCodePoint(0x1F4A1)}</span>
              <span style={{ fontSize: 12, color: '#688DA5', fontWeight: 600 }}>{slides[step].hint}</span>
            </div>
          )}
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
              background: i === step ? '#688DA5' : '#D4B880',
              transition: 'all 0.25s ease',
              border: 'none', cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="px-6 pb-10 flex gap-3 max-w-[420px] mx-auto w-full">
        {!isFirst ? (
          <button
            onClick={() => go(step - 1)}
            className="px-4 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all"
            style={{ background: '#F7EED8', border: '1.5px solid #D4B880', color: '#6B3A20', minWidth: 72 }}
          >
            ←
          </button>
        ) : (
          <button
            onClick={onDone}
            className="px-4 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all"
            style={{ background: '#F7EED8', border: '1.5px solid #D4B880', color: '#A07858', minWidth: 72 }}
          >
            {SKIP_BTN[lang]}
          </button>
        )}

        <button
          onClick={isLast ? onDone : () => go(step + 1)}
          className="flex-1 py-3.5 rounded-xl font-bold text-white text-base active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
        >
          {isLast ? START_BTN[lang] : NEXT_BTN[lang]}
        </button>
      </div>
    </div>
  );
}
