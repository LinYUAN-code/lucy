import colors from "colors"

enum LogLevel {
    Normal,
    Warnning,
    Error,
    None
}

class Logger {
    public logLevel: LogLevel;
    constructor(logLevel: LogLevel = LogLevel.Normal) {
        this.logLevel = logLevel;
    }
    log(...info: any[]) {
        if (this.logLevel <= LogLevel.Normal) {
            colors.enable();
            console.log("[normal]".rainbow, ...info);
            colors.disable();
        }
    }
    warn(...info: any[]) {
        if (this.logLevel <= LogLevel.Warnning) {
            colors.enable();
            console.warn("[warn]".yellow, ...info);
            colors.disable();
        }
    }
    error(...info: any[]) {
        if (this.logLevel <= LogLevel.Error) {
            colors.enable();
            console.error("[error]".red, ...info);
            colors.disable();
        }
    }
}

// TODO! logLevel 从打包工具中的参数去取 生产模式下设置为Error 
export default new Logger(LogLevel.Warnning)