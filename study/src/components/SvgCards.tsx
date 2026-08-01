import React from "react";

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const SvgCard: React.FC<CardProps> = ({ title, className, children }) => (
  <div
    className={`my-6 rounded-xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--card)] to-[var(--bg)] p-4 ${className || ""}`}
  >
    {title && (
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amethyst-400" />
        <span className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
          {title}
        </span>
      </div>
    )}
    {children}
  </div>
);

export const ConceptDimensionsSvg: React.FC = () => (
  <SvgCard title="概念四维度模型">
    <svg viewBox="0 0 400 260" className="w-full h-auto">
      <defs>
        <linearGradient id="dim1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9D4EDD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="dim2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B9AAA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1B9AAA" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="dim3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4A261" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F4A261" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="dim4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="130" r="60" fill="url(#dim1)" stroke="#9D4EDD" strokeWidth="2" />
      <text x="200" y="125" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">内涵</text>
      <text x="200" y="145" textAnchor="middle" fill="#9D4EDD" fontSize="10">本质属性</text>

      <ellipse cx="200" cy="130" rx="140" ry="45" fill="none" stroke="#1B9AAA" strokeWidth="2" strokeDasharray="4 2" />
      <text x="200" y="80" textAnchor="middle" fill="#1B9AAA" fontSize="11" fontWeight="600">外延 · 实例范围</text>

      <line x1="60" y1="130" x2="340" y2="130" stroke="#F4A261" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="60" cy="130" r="4" fill="#F4A261" />
      <circle cx="340" cy="130" r="4" fill="#F4A261" />
      <text x="200" y="195" textAnchor="middle" fill="#F4A261" fontSize="11" fontWeight="600">边界 · 与其他概念的区分</text>

      <path d="M 200 20 L 260 70 L 140 70 Z" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
      <text x="200" y="45" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600">层次</text>

      <text x="200" y="240" textAnchor="middle" fill="#64748b" fontSize="10">
        概念 = 内涵 + 外延 + 边界 + 层次
      </text>
    </svg>
  </SvgCard>
);

export const ConceptAnalogySvg: React.FC = () => (
  <SvgCard title="生活类比映射">
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      <defs>
        <marker id="arrow1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#9D4EDD" />
        </marker>
      </defs>

      <rect x="20" y="40" width="120" height="120" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="80" y="65" textAnchor="middle" fill="#94a3b8" fontSize="11">生活概念</text>
      <circle cx="80" cy="95" r="18" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" />
      <text x="80" y="100" textAnchor="middle" fill="#c084fc" fontSize="13">🔧</text>
      <text x="80" y="130" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">工具</text>
      <text x="80" y="148" textAnchor="middle" fill="#64748b" fontSize="9">解决问题的手段</text>

      <path d="M 150 100 L 250 100" stroke="#9D4EDD" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrow1)" />
      <text x="200" y="88" textAnchor="middle" fill="#9D4EDD" fontSize="10" fontWeight="500">类比</text>

      <rect x="260" y="40" width="120" height="120" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="320" y="65" textAnchor="middle" fill="#94a3b8" fontSize="11">AI 概念</text>
      <circle cx="320" cy="95" r="18" fill="#1B9AAA" opacity="0.2" stroke="#1B9AAA" />
      <text x="320" y="100" textAnchor="middle" fill="#22d3ee" fontSize="13">⚙️</text>
      <text x="320" y="130" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">算法</text>
      <text x="320" y="148" textAnchor="middle" fill="#64748b" fontSize="9">计算的步骤</text>
    </svg>
  </SvgCard>
);

export const ConceptRelationsSvg: React.FC = () => (
  <SvgCard title="概念关系网络">
    <svg viewBox="0 0 400 220" className="w-full h-auto">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9D4EDD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line x1="200" y1="50" x2="100" y2="110" stroke="#475569" strokeWidth="1.5" />
      <line x1="200" y1="50" x2="300" y2="110" stroke="#475569" strokeWidth="1.5" />
      <line x1="100" y1="110" x2="70" y2="180" stroke="#475569" strokeWidth="1.5" />
      <line x1="100" y1="110" x2="140" y2="180" stroke="#475569" strokeWidth="1.5" />
      <line x1="300" y1="110" x2="270" y2="180" stroke="#475569" strokeWidth="1.5" />
      <line x1="300" y1="110" x2="340" y2="180" stroke="#475569" strokeWidth="1.5" />
      <line x1="100" y1="110" x2="300" y2="110" stroke="#F4A261" strokeWidth="1.5" strokeDasharray="4 2" />

      <circle cx="200" cy="50" r="28" fill="url(#nodeGlow)" />
      <circle cx="200" cy="50" r="20" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" strokeWidth="2" />
      <text x="200" y="55" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">根概念</text>

      <circle cx="100" cy="110" r="18" fill="#1B9AAA" opacity="0.2" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="100" y="114" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="500">子类A</text>

      <circle cx="300" cy="110" r="18" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="1.5" />
      <text x="300" y="114" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="500">子类B</text>

      <circle cx="70" cy="180" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
      <text x="70" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9">A1</text>

      <circle cx="140" cy="180" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
      <text x="140" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9">A2</text>

      <circle cx="270" cy="180" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
      <text x="270" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9">B1</text>

      <circle cx="340" cy="180" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
      <text x="340" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9">B2</text>

      <rect x="145" y="102" width="110" height="16" rx="8" fill="#F4A261" opacity="0.1" />
      <text x="200" y="113" textAnchor="middle" fill="#F4A261" fontSize="9">并列关系</text>

      <text x="200" y="210" textAnchor="middle" fill="#64748b" fontSize="9">
        包含关系（实线） · 并列关系（虚线）
      </text>
    </svg>
  </SvgCard>
);

export const ApplicationCasesSvg: React.FC = () => (
  <SvgCard title="四大应用领域">
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      <rect x="20" y="20" width="170" height="75" rx="10" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="105" y="45" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">💬 自然语言处理</text>
      <text x="105" y="65" textAnchor="middle" fill="#94a3b8" fontSize="10">文本理解 · 机器翻译</text>
      <text x="105" y="82" textAnchor="middle" fill="#64748b" fontSize="9">BERT · GPT · T5</text>

      <rect x="210" y="20" width="170" height="75" rx="10" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="295" y="45" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="600">👁️ 计算机视觉</text>
      <text x="295" y="65" textAnchor="middle" fill="#94a3b8" fontSize="10">图像识别 · 目标检测</text>
      <text x="295" y="82" textAnchor="middle" fill="#64748b" fontSize="9">ResNet · ViT · YOLO</text>

      <rect x="20" y="115" width="170" height="75" rx="10" fill="#0f172a" stroke="#F4A261" strokeWidth="1.5" />
      <text x="105" y="140" textAnchor="middle" fill="#fb923c" fontSize="12" fontWeight="600">🎯 推荐系统</text>
      <text x="105" y="160" textAnchor="middle" fill="#94a3b8" fontSize="10">个性化推荐 · 排序</text>
      <text x="105" y="177" textAnchor="middle" fill="#64748b" fontSize="9">协同过滤 · 深度学习</text>

      <rect x="210" y="115" width="170" height="75" rx="10" fill="#0f172a" stroke="#10B981" strokeWidth="1.5" />
      <text x="295" y="140" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600">🚗 自动驾驶</text>
      <text x="295" y="160" textAnchor="middle" fill="#94a3b8" fontSize="10">感知 · 决策 · 控制</text>
      <text x="295" y="177" textAnchor="middle" fill="#64748b" fontSize="9">Tesla · Waymo</text>
    </svg>
  </SvgCard>
);

export const TimelineMilestonesSvg: React.FC = () => (
  <SvgCard title="AI 发展里程碑">
    <svg viewBox="0 0 400 220" className="w-full h-auto">
      <defs>
        <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9D4EDD" />
          <stop offset="50%" stopColor="#1B9AAA" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <line x1="40" y1="110" x2="360" y2="110" stroke="url(#timelineGrad)" strokeWidth="3" strokeLinecap="round" />

      <circle cx="70" cy="110" r="8" fill="#9D4EDD" />
      <circle cx="70" cy="110" r="14" fill="#9D4EDD" opacity="0.2" />
      <text x="70" y="80" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">1956</text>
      <text x="70" y="145" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="500">达特茅斯</text>
      <text x="70" y="158" textAnchor="middle" fill="#64748b" fontSize="8">AI 诞生</text>

      <circle cx="150" cy="110" r="8" fill="#7c3aed" />
      <circle cx="150" cy="110" r="14" fill="#7c3aed" opacity="0.2" />
      <text x="150" y="80" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold">1997</text>
      <text x="150" y="145" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="500">深蓝</text>
      <text x="150" y="158" textAnchor="middle" fill="#64748b" fontSize="8">战胜棋王</text>

      <circle cx="230" cy="110" r="8" fill="#1B9AAA" />
      <circle cx="230" cy="110" r="14" fill="#1B9AAA" opacity="0.2" />
      <text x="230" y="80" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">2012</text>
      <text x="230" y="145" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="500">AlexNet</text>
      <text x="230" y="158" textAnchor="middle" fill="#64748b" fontSize="8">深度崛起</text>

      <circle cx="310" cy="110" r="8" fill="#10B981" />
      <circle cx="310" cy="110" r="14" fill="#10B981" opacity="0.2" />
      <text x="310" y="80" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">2022</text>
      <text x="310" y="145" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="500">ChatGPT</text>
      <text x="310" y="158" textAnchor="middle" fill="#64748b" fontSize="8">大模型时代</text>

      <text x="200" y="200" textAnchor="middle" fill="#64748b" fontSize="10">
        从符号主义 → 连接主义 → 大模型，70 年螺旋上升
      </text>
    </svg>
  </SvgCard>
);

export const HistoryPioneersSvg: React.FC = () => (
  <SvgCard title="AI 先驱人物">
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      <circle cx="80" cy="65" r="28" fill="#9D4EDD" opacity="0.15" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="80" y="62" textAnchor="middle" fill="#c084fc" fontSize="16">🧠</text>
      <text x="80" y="90" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">图灵</text>
      <text x="80" y="108" textAnchor="middle" fill="#64748b" fontSize="9">计算理论之父</text>

      <circle cx="200" cy="65" r="28" fill="#1B9AAA" opacity="0.15" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="200" y="62" textAnchor="middle" fill="#22d3ee" fontSize="16">🎯</text>
      <text x="200" y="90" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">麦卡锡</text>
      <text x="200" y="108" textAnchor="middle" fill="#64748b" fontSize="9">AI 概念提出者</text>

      <circle cx="320" cy="65" r="28" fill="#F4A261" opacity="0.15" stroke="#F4A261" strokeWidth="1.5" />
      <text x="320" y="62" textAnchor="middle" fill="#fb923c" fontSize="16">🔬</text>
      <text x="320" y="90" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">明斯基</text>
      <text x="320" y="108" textAnchor="middle" fill="#64748b" fontSize="9">框架理论奠基</text>

      <text x="200" y="145" textAnchor="middle" fill="#64748b" fontSize="10">
        先驱们的思想，照亮了 AI 发展的道路
      </text>
    </svg>
  </SvgCard>
);

export const WinterPeriodSvg: React.FC = () => (
  <SvgCard title="AI 寒冬周期">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9D4EDD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d="M 20 120 Q 80 40, 140 80 T 260 70 T 380 50" fill="none" stroke="#9D4EDD" strokeWidth="2.5" />
      <path d="M 20 120 Q 80 40, 140 80 T 260 70 T 380 50 L 380 160 L 20 160 Z" fill="url(#waveGrad)" />

      <line x1="140" y1="80" x2="140" y2="160" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
      <line x1="260" y1="70" x2="260" y2="160" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />

      <text x="80" y="30" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">第一次浪潮</text>
      <text x="200" y="50" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">第二次浪潮</text>
      <text x="320" y="35" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">第三次浪潮</text>

      <rect x="155" y="135" width="50" height="20" rx="4" fill="#ef4444" opacity="0.2" />
      <text x="180" y="148" textAnchor="middle" fill="#f87171" fontSize="9">寒冬1</text>

      <rect x="275" y="125" width="50" height="20" rx="4" fill="#ef4444" opacity="0.2" />
      <text x="300" y="138" textAnchor="middle" fill="#f87171" fontSize="9">寒冬2</text>

      <text x="200" y="175" textAnchor="middle" fill="#64748b" fontSize="10">
        期望越高，失望越大 — 技术成熟度曲线
      </text>
    </svg>
  </SvgCard>
);

export const ModelArchitectureSvg: React.FC = () => (
  <SvgCard title="神经网络层级结构">
    <svg viewBox="0 0 400 240" className="w-full h-auto">
      <defs>
        <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B9AAA" />
          <stop offset="100%" stopColor="#9D4EDD" />
        </linearGradient>
      </defs>

      <rect x="20" y="20" width="80" height="200" rx="8" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="60" y="45" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">输入层</text>
      <circle cx="45" cy="80" r="8" fill="#1B9AAA" opacity="0.4" stroke="#1B9AAA" />
      <circle cx="75" cy="80" r="8" fill="#1B9AAA" opacity="0.4" stroke="#1B9AAA" />
      <circle cx="45" cy="110" r="8" fill="#1B9AAA" opacity="0.4" stroke="#1B9AAA" />
      <circle cx="75" cy="110" r="8" fill="#1B9AAA" opacity="0.4" stroke="#1B9AAA" />
      <circle cx="60" cy="145" r="8" fill="#1B9AAA" opacity="0.4" stroke="#1B9AAA" />
      <text x="60" y="185" textAnchor="middle" fill="#64748b" fontSize="9">d_in 维</text>

      <path d="M 105 120 L 135 120" stroke="url(#layerGrad)" strokeWidth="2" markerEnd="url(#arrowModel)" />

      <rect x="140" y="20" width="80" height="200" rx="8" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="180" y="45" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">隐藏层</text>
      <circle cx="165" cy="75" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="195" cy="75" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="165" cy="105" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="195" cy="105" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="165" cy="135" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="195" cy="135" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <circle cx="180" cy="165" r="8" fill="#9D4EDD" opacity="0.4" stroke="#9D4EDD" />
      <text x="180" y="195" textAnchor="middle" fill="#64748b" fontSize="9">L 层 × d_hidden</text>

      <path d="M 225 120 L 255 120" stroke="url(#layerGrad)" strokeWidth="2" />

      <rect x="260" y="20" width="80" height="200" rx="8" fill="#0f172a" stroke="#10B981" strokeWidth="1.5" />
      <text x="300" y="45" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">输出层</text>
      <circle cx="285" cy="95" r="8" fill="#10B981" opacity="0.4" stroke="#10B981" />
      <circle cx="315" cy="95" r="8" fill="#10B981" opacity="0.4" stroke="#10B981" />
      <circle cx="300" cy="130" r="8" fill="#10B981" opacity="0.4" stroke="#10B981" />
      <text x="300" y="180" textAnchor="middle" fill="#64748b" fontSize="9">d_out 维</text>

      <defs>
        <marker id="arrowModel" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#9D4EDD" />
        </marker>
      </defs>
    </svg>
  </SvgCard>
);

export const ModelEvolutionSvg: React.FC = () => (
  <SvgCard title="模型演进路线">
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      <line x1="40" y1="80" x2="360" y2="80" stroke="#334155" strokeWidth="2" />

      <circle cx="70" cy="80" r="18" fill="#1B9AAA" opacity="0.2" stroke="#1B9AAA" strokeWidth="2" />
      <text x="70" y="85" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">感知机</text>
      <text x="70" y="115" textAnchor="middle" fill="#64748b" fontSize="9">1950s</text>

      <path d="M 95 80 L 125 80" stroke="#475569" strokeWidth="2" markerEnd="url(#evoArrow)" />

      <circle cx="150" cy="80" r="18" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" strokeWidth="2" />
      <text x="150" y="85" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">CNN</text>
      <text x="150" y="115" textAnchor="middle" fill="#64748b" fontSize="9">1990s</text>

      <path d="M 175 80 L 205 80" stroke="#475569" strokeWidth="2" markerEnd="url(#evoArrow)" />

      <circle cx="230" cy="80" r="18" fill="#F4A261" opacity="0.2" stroke="#F4A261" strokeWidth="2" />
      <text x="230" y="85" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold">RNN/LSTM</text>
      <text x="230" y="115" textAnchor="middle" fill="#64748b" fontSize="9">2000s</text>

      <path d="M 255 80 L 285 80" stroke="#475569" strokeWidth="2" markerEnd="url(#evoArrow)" />

      <circle cx="310" cy="80" r="18" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
      <text x="310" y="85" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Transformer</text>
      <text x="310" y="115" textAnchor="middle" fill="#64748b" fontSize="9">2017</text>

      <path d="M 335 80 L 365 80" stroke="#475569" strokeWidth="2" markerEnd="url(#evoArrow)" />

      <circle cx="380" cy="80" r="18" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2" />
      <text x="380" y="85" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">大模型</text>
      <text x="380" y="115" textAnchor="middle" fill="#64748b" fontSize="9">2020s</text>

      <defs>
        <marker id="evoArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#475569" />
        </marker>
      </defs>
    </svg>
  </SvgCard>
);

export const KeyMechanismsSvg: React.FC = () => (
  <SvgCard title="三大核心机制">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <rect x="20" y="20" width="110" height="65" rx="10" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="75" y="45" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">🎯 注意力机制</text>
      <text x="75" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">动态关注重要信息</text>

      <rect x="145" y="20" width="110" height="65" rx="10" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="200" y="45" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">🔄 残差连接</text>
      <text x="200" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">缓解梯度消失</text>

      <rect x="270" y="20" width="110" height="65" rx="10" fill="#0f172a" stroke="#F4A261" strokeWidth="1.5" />
      <text x="325" y="45" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="600">📊 层归一化</text>
      <text x="325" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">稳定训练过程</text>

      <rect x="100" y="110" width="200" height="55" rx="10" fill="#0f172a" stroke="#10B981" strokeWidth="1.5" />
      <text x="200" y="135" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">⚡ 前馈网络 FFN</text>
      <text x="200" y="155" textAnchor="middle" fill="#94a3b8" fontSize="9">两层线性变换 + 激活函数</text>
    </svg>
  </SvgCard>
);

export const TrainingFlowSvg: React.FC = () => (
  <SvgCard title="训练流程循环">
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      <defs>
        <marker id="flowArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#9D4EDD" />
        </marker>
      </defs>

      <circle cx="200" cy="100" r="70" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5 3" />

      <rect x="160" y="15" width="80" height="35" rx="8" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" />
      <text x="200" y="37" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">前向传播</text>

      <rect x="305" y="80" width="80" height="35" rx="8" fill="#1B9AAA" opacity="0.2" stroke="#1B9AAA" />
      <text x="345" y="102" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">计算损失</text>

      <rect x="160" y="150" width="80" height="35" rx="8" fill="#F4A261" opacity="0.2" stroke="#F4A261" />
      <text x="200" y="172" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="600">反向传播</text>

      <rect x="15" y="80" width="80" height="35" rx="8" fill="#10B981" opacity="0.2" stroke="#10B981" />
      <text x="55" y="102" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">参数更新</text>

      <path d="M 240 45 Q 290 55, 305 90" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#flowArrow)" />
      <path d="M 345 120 Q 310 155, 250 165" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#flowArrow)" />
      <path d="M 160 165 Q 100 155, 95 120" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#flowArrow)" />
      <path d="M 95 85 Q 110 50, 160 40" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#flowArrow)" />

      <text x="200" y="105" textAnchor="middle" fill="#64748b" fontSize="10">迭代</text>
      <text x="200" y="120" textAnchor="middle" fill="#64748b" fontSize="9">直到收敛</text>
    </svg>
  </SvgCard>
);

export const ModelComparisonSvg: React.FC = () => (
  <SvgCard title="模型性能对比">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <line x1="50" y1="30" x2="50" y2="140" stroke="#334155" strokeWidth="1" />
      <line x1="50" y1="140" x2="370" y2="140" stroke="#334155" strokeWidth="1" />

      <text x="30" y="35" textAnchor="middle" fill="#64748b" fontSize="9">100%</text>
      <text x="30" y="70" textAnchor="middle" fill="#64748b" fontSize="9">75%</text>
      <text x="30" y="105" textAnchor="middle" fill="#64748b" fontSize="9">50%</text>
      <text x="30" y="140" textAnchor="middle" fill="#64748b" fontSize="9">0%</text>

      <rect x="80" y="70" width="45" height="70" rx="4" fill="#1B9AAA" opacity="0.6" />
      <text x="102" y="62" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="600">基础版</text>
      <text x="102" y="90" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">70%</text>

      <rect x="150" y="50" width="45" height="90" rx="4" fill="#9D4EDD" opacity="0.6" />
      <text x="172" y="42" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="600">加强版</text>
      <text x="172" y="70" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">85%</text>

      <rect x="220" y="35" width="45" height="105" rx="4" fill="#F4A261" opacity="0.6" />
      <text x="242" y="27" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="600">改进版</text>
      <text x="242" y="60" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">92%</text>

      <rect x="290" y="25" width="45" height="115" rx="4" fill="#10B981" opacity="0.6" />
      <text x="312" y="17" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="600">大模型</text>
      <text x="312" y="55" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">97%</text>

      <text x="210" y="165" textAnchor="middle" fill="#64748b" fontSize="10">
        准确率对比（越高越好）
      </text>
    </svg>
  </SvgCard>
);

export const ProblemDefinitionSvg: React.FC = () => (
  <SvgCard title="问题形式化定义">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <rect x="20" y="20" width="160" height="140" rx="10" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="100" y="45" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="600">📥 输入</text>
      <line x1="40" y1="60" x2="160" y2="60" stroke="#334155" strokeWidth="1" />
      <text x="100" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">状态空间 S</text>
      <text x="100" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10">动作空间 A</text>
      <text x="100" y="120" textAnchor="middle" fill="#94a3b8" fontSize="10">初始状态 s₀</text>
      <text x="100" y="140" textAnchor="middle" fill="#94a3b8" fontSize="10">目标状态 G</text>

      <path d="M 190 90 L 210 90" stroke="#9D4EDD" strokeWidth="2.5" markerEnd="url(#probArrow)" />
      <text x="200" y="75" textAnchor="middle" fill="#9D4EDD" fontSize="10" fontWeight="600">算法</text>

      <rect x="220" y="20" width="160" height="140" rx="10" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="300" y="45" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">📤 输出</text>
      <line x1="240" y1="60" x2="360" y2="60" stroke="#334155" strokeWidth="1" />
      <text x="300" y="85" textAnchor="middle" fill="#94a3b8" fontSize="10">动作序列</text>
      <text x="300" y="105" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">a₁, a₂, ..., aₙ</text>
      <text x="300" y="130" textAnchor="middle" fill="#94a3b8" fontSize="10">最小化代价 C(π)</text>

      <defs>
        <marker id="probArrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <polygon points="0 0, 10 4, 0 8" fill="#9D4EDD" />
        </marker>
      </defs>
    </svg>
  </SvgCard>
);

export const AlgorithmFlowchartSvg: React.FC = () => (
  <SvgCard title="算法执行流程">
    <svg viewBox="0 0 400 240" className="w-full h-auto">
      <defs>
        <marker id="fcArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>

      <ellipse cx="200" cy="25" rx="45" ry="18" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="200" y="30" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">开始</text>

      <line x1="200" y1="43" x2="200" y2="55" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#fcArrow)" />

      <rect x="140" y="55" width="120" height="35" rx="6" fill="#1B9AAA" opacity="0.2" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="200" y="77" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="500">初始化 frontier</text>

      <line x1="200" y1="90" x2="200" y2="102" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#fcArrow)" />

      <polygon points="200,102 150,135 200,168 250,135" fill="#F4A261" opacity="0.2" stroke="#F4A261" strokeWidth="1.5" />
      <text x="200" y="135" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="500">frontier</text>
      <text x="200" y="148" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="500">为空？</text>

      <line x1="250" y1="135" x2="320" y2="135" stroke="#64748b" strokeWidth="1.5" />
      <text x="285" y="128" textAnchor="middle" fill="#f87171" fontSize="9">是</text>

      <rect x="300" y="115" width="60" height="40" rx="6" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
      <text x="330" y="132" textAnchor="middle" fill="#f87171" fontSize="10">返回</text>
      <text x="330" y="146" textAnchor="middle" fill="#f87171" fontSize="10">失败</text>

      <line x1="200" y1="168" x2="200" y2="180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#fcArrow)" />
      <text x="210" y="178" textAnchor="start" fill="#34d399" fontSize="9">否</text>

      <rect x="140" y="180" width="120" height="35" rx="6" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="1.5" />
      <text x="200" y="202" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="500">选择 + 扩展节点</text>

      <path d="M 260 197 Q 310 197, 310 135" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x="325" y="170" textAnchor="middle" fill="#64748b" fontSize="9">循环</text>
    </svg>
  </SvgCard>
);

export const ComplexityComparisonSvg: React.FC = () => (
  <SvgCard title="算法复杂度对比">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <rect x="20" y="15" width="85" height="150" rx="8" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
      <text x="62" y="38" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="600">DFS</text>
      <text x="62" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">时间 O(bᵐ)</text>
      <text x="62" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9">空间 O(bm)</text>
      <text x="62" y="115" textAnchor="middle" fill="#f87171" fontSize="10">❌ 不完备</text>
      <text x="62" y="135" textAnchor="middle" fill="#f87171" fontSize="10">❌ 非最优</text>

      <rect x="115" y="15" width="85" height="150" rx="8" fill="#0f172a" stroke="#F4A261" strokeWidth="1.5" />
      <text x="157" y="38" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="600">BFS</text>
      <text x="157" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">时间 O(bᵈ)</text>
      <text x="157" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9">空间 O(bᵈ)</text>
      <text x="157" y="115" textAnchor="middle" fill="#34d399" fontSize="10">✅ 完备</text>
      <text x="157" y="135" textAnchor="middle" fill="#34d399" fontSize="10">✅ 最优</text>

      <rect x="210" y="15" width="85" height="150" rx="8" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="252" y="38" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">UCS</text>
      <text x="252" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">代价一致</text>
      <text x="252" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9">按代价扩展</text>
      <text x="252" y="115" textAnchor="middle" fill="#34d399" fontSize="10">✅ 完备</text>
      <text x="252" y="135" textAnchor="middle" fill="#34d399" fontSize="10">✅ 最优</text>

      <rect x="305" y="15" width="85" height="150" rx="8" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="347" y="38" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">A*</text>
      <text x="347" y="65" textAnchor="middle" fill="#94a3b8" fontSize="9">启发式</text>
      <text x="347" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9">智能搜索</text>
      <text x="347" y="115" textAnchor="middle" fill="#34d399" fontSize="10">✅ 完备</text>
      <text x="347" y="135" textAnchor="middle" fill="#34d399" fontSize="10">✅ 最优</text>
    </svg>
  </SvgCard>
);

export const AdmissibleHeuristicSvg: React.FC = () => (
  <SvgCard title="可采纳启发式示意">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <circle cx="60" cy="90" r="20" fill="#9D4EDD" opacity="0.3" stroke="#9D4EDD" strokeWidth="2" />
      <text x="60" y="95" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">起点</text>

      <circle cx="340" cy="90" r="20" fill="#10B981" opacity="0.3" stroke="#10B981" strokeWidth="2" />
      <text x="340" y="95" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">目标</text>

      <path d="M 80 90 Q 180 30, 320 90" fill="none" stroke="#9D4EDD" strokeWidth="2.5" strokeDasharray="6 3" />
      <text x="200" y="45" textAnchor="middle" fill="#c084fc" fontSize="10">h(n) 估计值 ≤ 真实距离</text>

      <path d="M 80 90 Q 150 140, 200 90 Q 250 40, 320 90" fill="none" stroke="#1B9AAA" strokeWidth="2" />
      <text x="200" y="130" textAnchor="middle" fill="#22d3ee" fontSize="10">真实最优路径</text>

      <line x1="200" y1="60" x2="200" y2="105" stroke="#F4A261" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="215" y="85" textAnchor="start" fill="#fb923c" fontSize="9">h(n) ≤ h*(n)</text>

      <text x="200" y="165" textAnchor="middle" fill="#64748b" fontSize="10">
        可采纳 = 永远不高估到目标的代价
      </text>
    </svg>
  </SvgCard>
);

export const ApplicationScenariosSvg: React.FC = () => (
  <SvgCard title="四大经典应用">
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <rect x="20" y="15" width="170" height="65" rx="10" fill="#0f172a" stroke="#9D4EDD" strokeWidth="1.5" />
      <text x="105" y="40" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600">🧩 路径规划</text>
      <text x="105" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10">机器人导航 · 地图寻路</text>

      <rect x="210" y="15" width="170" height="65" rx="10" fill="#0f172a" stroke="#1B9AAA" strokeWidth="1.5" />
      <text x="295" y="40" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">♟️ 博弈对抗</text>
      <text x="295" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10">棋类 AI · 决策树搜索</text>

      <rect x="20" y="100" width="170" height="65" rx="10" fill="#0f172a" stroke="#F4A261" strokeWidth="1.5" />
      <text x="105" y="125" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="600">📦 调度优化</text>
      <text x="105" y="145" textAnchor="middle" fill="#94a3b8" fontSize="10">物流调度 · 作业排序</text>

      <rect x="210" y="100" width="170" height="65" rx="10" fill="#0f172a" stroke="#10B981" strokeWidth="1.5" />
      <text x="295" y="125" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">🗣️ NLP 解析</text>
      <text x="295" y="145" textAnchor="middle" fill="#94a3b8" fontSize="10">句法分析 · 机器翻译</text>
    </svg>
  </SvgCard>
);
