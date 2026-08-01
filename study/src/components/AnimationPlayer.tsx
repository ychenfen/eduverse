import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnimationScene } from "@/types";

interface Props {
  scenes: AnimationScene[];
  totalMs?: number; // 可选，默认累加
  className?: string;
  compact?: boolean; // 迷你模式（卡片预览）
  onVoiceCommand?: (cmd: string) => void; // 语音命令回调（可选）
}

// 浏览器原生语音识别类型（补充缺失的 TS 类型）
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: {
      readonly isFinal: boolean;
      readonly length: number;
      [index: number]: { readonly transcript: string; readonly confidence?: number };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// 教学动画播放器 — 矢量动画序列 + 时间轴控件
export default function AnimationPlayer({ scenes, totalMs, className, compact = false }: Props) {
  const total = totalMs ?? scenes.reduce((s, sc) => s + sc.durationMs, 0);

  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceSupported] = useState(
    () => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const [voiceTip, setVoiceTip] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [ttsSupported] = useState(
    () => typeof window !== "undefined" && Boolean(window.speechSynthesis),
  );
  const lastSpokenSceneRef = useRef<number>(-1);

  // 当前分镜
  const currentSceneIdx = Math.max(
    0,
    scenes.findIndex((s) => elapsed >= s.startMs && elapsed < s.startMs + s.durationMs),
  );
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const sceneElapsed = elapsed - currentScene.startMs;
  const sceneProgress = Math.min(1, sceneElapsed / currentScene.durationMs);

  // 播放循环
  useEffect(() => {
    if (!playing) return;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      setElapsed((e) => {
        const next = e + dt;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, total]);

  const togglePlay = useCallback(() => {
    setElapsed((e) => (e >= total ? 0 : e));
    setPlaying((p) => !p);
  }, [total]);

  const restart = useCallback(() => {
    setElapsed(0);
    setPlaying(true);
    lastSpokenSceneRef.current = -1;
  }, []);

  const seekTo = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(total, ms));
      setElapsed(clamped);
      lastSpokenSceneRef.current = -1;
    },
    [total],
  );

  const jumpScene = useCallback(
    (delta: number) => {
      const nextIdx = Math.max(0, Math.min(scenes.length - 1, currentSceneIdx + delta));
      seekTo(scenes[nextIdx].startMs + 50);
    },
    [currentSceneIdx, scenes, seekTo],
  );

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // ===== 语音控制 =====
  // 解析并执行语音命令
  const handleVoiceCommand = (text: string) => {
    const t = text.replace(/[。，、\s]/g, "").toLowerCase();
    let cmd = "";

    if (/播放|开始|继续|start|play/.test(t)) {
      if (!playing) togglePlay();
      cmd = "播放";
    } else if (/暂停|停止|pause|stop/.test(t)) {
      if (playing) togglePlay();
      cmd = "暂停";
    } else if (/重新|从头|重播|重放|restart|replay/.test(t)) {
      restart();
      cmd = "重新播放";
    } else if (/上一|前一|上节|prev|back/.test(t)) {
      jumpScene(-1);
      cmd = "上一分镜";
    } else if (/下一|后一|下节|next|forward/.test(t)) {
      jumpScene(1);
      cmd = "下一分镜";
    } else {
      const m = t.match(/第([一二三四五六七八九十\d]+)[分镜段步]/);
      if (m) {
        const num = parseChineseNum(m[1]);
        if (num >= 1 && num <= scenes.length) {
          seekTo(scenes[num - 1].startMs + 50);
          cmd = `跳转到第${num}分镜`;
        }
      }
    }

    if (cmd) {
      setVoiceTip(`已识别：${cmd}`);
    } else {
      setVoiceTip(`未识别：${text.slice(0, 12)}…`);
    }
    setTimeout(() => setVoiceTip(null), 2500);
  };

  const parseChineseNum = (s: string): number => {
    const map: Record<string, number> = {
      一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
      "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    };
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    if (s === "十") return 10;
    if (s.length === 1) return map[s] || 0;
    if (s.startsWith("十")) return 10 + (map[s[1]] || 0);
    if (s.endsWith("十")) return (map[s[0]] || 0) * 10;
    return 0;
  };

  const toggleListening = useCallback(() => {
    if (!recogRef.current) return;
    if (listening) {
      recogRef.current.stop();
      setListening(false);
    } else {
      setVoiceTranscript("");
      try {
        recogRef.current.start();
        setListening(true);
      } catch {
        // already started
      }
    }
  }, [listening]);

  // 初始化语音识别（放最后，所有函数都已定义）
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      return;
    }
    const recog = new SR();
    recog.lang = "zh-CN";
    recog.continuous = false;
    recog.interimResults = true;

    recog.onresult = (event: SpeechRecognitionEventLike) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setVoiceTranscript(final || interim);
      if (final) {
        handleVoiceCommand(final.trim());
      }
    };

    recog.onend = () => {
      setListening(false);
    };

    recog.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") {
        setVoiceTip("麦克风权限被拒绝，请在浏览器设置中开启");
      } else if (e.error === "no-speech") {
        setVoiceTip("未检测到语音，请重试");
      }
      setTimeout(() => setVoiceTip(null), 3000);
    };

    recogRef.current = recog;

    return () => {
      try {
        recog.abort();
      } catch {
        // ignore
      }
      // 清理 TTS
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== TTS 字幕语音播报 =====
  useEffect(() => {
    if (!ttsEnabled || !ttsSupported) return;
    if (!window.speechSynthesis) return;

    // 分镜切换时播报字幕
    if (currentSceneIdx !== lastSpokenSceneRef.current) {
      lastSpokenSceneRef.current = currentSceneIdx;
      const text = currentScene.subtitle;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentSceneIdx, ttsEnabled, ttsSupported, currentScene.subtitle]);

  // 暂停或播放结束时停止 TTS
  useEffect(() => {
    if (!ttsSupported || !window.speechSynthesis) return;
    if (!playing && ttsEnabled) {
      window.speechSynthesis.cancel();
    }
  }, [playing, ttsEnabled, ttsSupported]);

  const toggleTts = useCallback(() => {
    if (!ttsSupported) return;
    setTtsEnabled((prev) => {
      if (prev && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  }, [ttsSupported]);

  // 迷你预览模式
  if (compact) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-chip bg-ink-950/80", className)}
        onClick={togglePlay}
      >
        <div
          className="aspect-[2/1] w-full"
          dangerouslySetInnerHTML={{ __html: currentScene.svg }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40 transition-opacity hover:bg-ink-950/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-azure-500 text-white shadow-glow">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-ink-950/95 to-transparent px-2 py-1.5">
          <span className="text-[10px] font-mono text-cyan-300">{fmt(elapsed)}</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-azure-500"
              style={{ width: `${(elapsed / total) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--fg-muted)]">{fmt(total)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-[var(--card-border)] bg-ink-950/80 shadow-float",
        className,
      )}
    >
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 items-center justify-center">
            <span className={cn("h-2 w-2 rounded-full", playing ? "animate-pulse bg-rose-500" : "bg-[var(--fg-muted)]")} />
          </span>
          <span className="text-xs font-medium text-[var(--fg-muted)]">
            矢量动画播放器 · {scenes.length} 分镜
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTts}
            disabled={!ttsSupported}
            title={ttsSupported ? "字幕语音播报（开启后分镜切换时朗读字幕）" : "当前浏览器不支持语音合成"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              ttsEnabled
                ? "bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/40"
                : "text-[var(--fg-muted)] hover:bg-ink-700/60 hover:text-[var(--fg)]",
              !ttsSupported && "cursor-not-allowed opacity-40",
            )}
          >
            {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={toggleListening}
            disabled={!voiceSupported}
            title={voiceSupported ? "语音控制（播放/暂停/上一分镜/下一分镜/重播/第X分镜）" : "当前浏览器不支持语音识别"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              listening
                ? "bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40 animate-pulse"
                : "text-[var(--fg-muted)] hover:bg-ink-700/60 hover:text-[var(--fg)]",
              !voiceSupported && "cursor-not-allowed opacity-40",
            )}
          >
            {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
          <span className="font-mono text-xs text-cyan-300">
            {currentSceneIdx + 1} / {scenes.length}
          </span>
        </div>
      </div>

      {/* 视频区域 */}
      <div className="relative aspect-[2/1] w-full bg-ink-950">
        {/* 语音提示气泡 */}
        <AnimatePresence>
          {(voiceTip || (listening && voiceTranscript)) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-1/2 top-3 z-20 -translate-x-1/2"
            >
              <div className="flex items-center gap-2 rounded-full bg-ink-900/90 px-3 py-1.5 shadow-lg ring-1 ring-[var(--card-border)] backdrop-blur">
                <Mic className="h-3 w-3 text-cyan-300" />
                <span className="text-xs text-[var(--fg)]">
                  {voiceTip || voiceTranscript}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div
              className="anim-stage h-full w-full"
              data-motion={currentScene.motion}
              data-progress={sceneProgress.toFixed(3)}
              dangerouslySetInnerHTML={{ __html: currentScene.svg }}
            />
          </motion.div>
        </AnimatePresence>

        {/* 中央播放按钮（暂停时） */}
        {!playing && elapsed < total && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-ink-950/30 transition-colors hover:bg-ink-950/10"
            aria-label="播放"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-azure-500 text-white shadow-glow transition-transform hover:scale-110">
              <Play className="h-7 w-7 translate-x-1" />
            </span>
          </button>
        )}

        {/* 播放结束遮罩 */}
        {elapsed >= total && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-950/70 backdrop-blur-sm">
            <span className="font-serif text-lg font-bold text-gradient">动画播放完成</span>
            <button
              onClick={restart}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-azure-500 px-5 py-2 text-sm font-medium text-white shadow-glow-azure transition-transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
              重新播放
            </button>
          </div>
        )}

        {/* 字幕 */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 text-center">
          <span className="rounded-chip bg-ink-950/85 px-3 py-1.5 text-xs leading-relaxed text-[var(--fg)] backdrop-blur">
            {currentScene.subtitle}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="px-4 pt-3">
        <div
          className="group relative h-1.5 cursor-pointer rounded-full bg-ink-700"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(ratio * total);
          }}
        >
          {/* 分镜分隔标记 */}
          {scenes.slice(1).map((s, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 bg-ink-500"
              style={{ left: `${(s.startMs / total) * 100}%` }}
            />
          ))}
          {/* 已播放进度 */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-400 via-azure-500 to-amethyst-500"
            style={{ width: `${(elapsed / total) * 100}%` }}
          />
          {/* 拖拽手柄 */}
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-glow transition-opacity group-hover:opacity-100"
            style={{ left: `${(elapsed / total) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)]">
          <span className="text-cyan-300">{fmt(elapsed)}</span>
          <span className="text-[var(--fg-muted)]">{currentScene.title}</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      {/* 控制栏 */}
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => jumpScene(-1)}
            disabled={currentSceneIdx === 0}
            className="rounded-full p-2 text-[var(--fg-muted)] transition-colors hover:bg-ink-700/60 hover:text-[var(--fg)] disabled:opacity-30"
            aria-label="上一分镜"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-azure-500 text-white shadow-glow transition-transform hover:scale-105"
            aria-label={playing ? "暂停" : "播放"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
          </button>
          <button
            onClick={() => jumpScene(1)}
            disabled={currentSceneIdx === scenes.length - 1}
            className="rounded-full p-2 text-[var(--fg-muted)] transition-colors hover:bg-ink-700/60 hover:text-[var(--fg)] disabled:opacity-30"
            aria-label="下一分镜"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={restart}
            className="rounded-full p-2 text-[var(--fg-muted)] transition-colors hover:bg-ink-700/60 hover:text-[var(--fg)]"
            aria-label="重播"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--fg-muted)]">
          {ttsEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[10px] text-cyan-300">字幕播报中</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span className="text-[10px]">矢量动画 · 点击喇叭开启播报</span>
            </>
          )}
        </div>
      </div>

      {/* 分镜导航条 */}
      <div className="flex gap-1.5 border-t border-[var(--card-border)] bg-ink-900/40 px-3 py-2">
        {scenes.map((s, i) => {
          const active = i === currentSceneIdx;
          const done = elapsed >= s.startMs + s.durationMs;
          return (
            <button
              key={s.index}
              onClick={() => seekTo(s.startMs + 50)}
              className={cn(
                "flex-1 rounded-chip px-2 py-1 text-[10px] transition-all",
                active
                  ? "bg-gradient-to-r from-cyan-500/30 to-azure-500/30 text-cyan-300 ring-1 ring-cyan-500/50"
                  : done
                    ? "bg-jade-500/10 text-jade-400 hover:bg-jade-500/20"
                    : "bg-ink-700/40 text-[var(--fg-muted)] hover:bg-ink-700/70",
              )}
              title={s.title}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono">#{s.index}</span>
                {done && !active && <span className="text-[9px]">✓</span>}
              </div>
              <div className="truncate text-[9px] opacity-80">{s.title.split(" · ")[1] || s.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
