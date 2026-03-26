export interface SentinelConfig {
  /** Directory to watch for incoming task files */
  inbox: string;
  /** Directory to write results to */
  outbox: string;
  /** Working directory for Claude sessions */
  workdir: string;
  /** Session persistence — reuse sessions across restarts */
  sessionId?: string;
  /** Claude model to use */
  model?: string;
  /** Permission mode for Claude CLI */
  permissionMode?: "default" | "plan" | "bypassPermissions" | "auto";
  /** Max budget per task in USD */
  maxBudgetPerTask?: number;
  /** System prompt prepended to every task */
  systemPrompt?: string;
  /** Notification targets */
  notify?: NotifyConfig;
  /** Log file path */
  logFile?: string;
  /** Max parallel sessions (default 1 = sequential) */
  maxConcurrency?: number;
  /** Telegram bridge — two-way remote control */
  telegram?: TelegramBridgeConfig;
}

export interface TelegramBridgeConfig {
  /** Telegram bot token from @BotFather */
  botToken: string;
  /** Allowed chat IDs — only these chats can send tasks (security) */
  allowedChatIds: string[];
  /** Poll interval in seconds (default 2) */
  pollInterval?: number;
}

export interface NotifyConfig {
  /** Write results to outbox directory */
  file?: boolean;
  /** Print to stdout */
  stdout?: boolean;
  /** Telegram bot token + chat ID */
  telegram?: {
    botToken: string;
    chatId: string;
  };
  /** Webhook URL to POST results to */
  webhook?: string;
}

export interface Task {
  id: string;
  source: string;
  prompt: string;
  filepath?: string;
  createdAt: Date;
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
  error?: string;
  duration?: number;
}

export interface SessionState {
  sessionId: string;
  startedAt: Date;
  tasksCompleted: number;
  lastTaskAt?: Date;
}
