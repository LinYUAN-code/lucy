/*START.ONLYTEST*/
import colors from "colors"
/*END.ONLYTEST*/

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
            /*START.ONLYTEST*/
            colors.enable();
            /*END.ONLYTEST*/
            this.logChannel.log("[normal]"/*START.ONLYTEST*/.rainbow/*END.ONLYTEST*/, ...info);
            /*START.ONLYTEST*/
            colors.disable();
            /*END.ONLYTEST*/
        }
    }
    warn(...info: any[]) {
        if (this.logLevel <= LogLevel.Warnning) {
            /*START.ONLYTEST*/
            colors.enable();
            /*END.ONLYTEST*/
            this.logChannel.warn("[warn]"/*START.ONLYTEST*/.yellow/*END.ONLYTEST*/, ...info);
            /*START.ONLYTEST*/
            colors.disable();
            /*END.ONLYTEST*/

        }
    }
    error(...info: any[]) {
        if (this.logLevel <= LogLevel.Error) {
            /*START.ONLYTEST*/
            colors.enable();
            /*END.ONLYTEST*/
            this.logChannel.error("[error]"/*START.ONLYTEST*/.red/*END.ONLYTEST*/, ...info);
            /*START.ONLYTEST*/
            colors.disable();
            /*END.ONLYTEST*/
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

let logLevel_init = LogLevel.Normal
var __env__ = "";
switch (__env__) {
case "prod":
    logLevel_init = LogLevel.Error
}
export default new Logger(logLevel_init)
