import colors from "colors"

enum LogLevel {
    Normal,
    Warnning,
    Error,
    None
}
interface LogChannel {
    log(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;

}

class Logger {
    public logLevel: LogLevel;
    public logChannel: LogChannel;
    constructor(logLevel: LogLevel = LogLevel.Normal, logChannel: LogChannel = console) {
        this.logLevel = logLevel;
        this.logChannel = logChannel;
    }
    log(...info: any[]) {
        if (this.logLevel <= LogLevel.Normal) {
            colors.enable();
            this.logChannel.log("[normal]".rainbow, ...info);
            colors.disable();
        }
    }
    warn(...info: any[]) {
        if (this.logLevel <= LogLevel.Warnning) {
            colors.enable();
            this.logChannel.warn("[warn]".yellow, ...info);
            colors.disable();
        }
    }
    error(...info: any[]) {
        if (this.logLevel <= LogLevel.Error) {
            colors.enable();
            this.logChannel.error("[error]".red, ...info);
            colors.disable();
        }
    }
    logTo(logChannel: LogChannel) {
        this.logChannel = logChannel;
    }
}

class NullLogChannel {
    public log(...data: any[]): void { }
    public warn(...data: any[]): void { }
    public error(...data: any[]): void { }
}
export const nullLogChannel = new NullLogChannel();

// TODO! logLevel 从打包工具中的参数去取 生产模式下设置为Error 
export default new Logger(LogLevel.Normal)