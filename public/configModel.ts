class Config{
    private _theme: string;
    private _stay_on_top: boolean;
    private _main_width: number;
    private _main_height: number;
    private _tray: boolean;
    private _tray_width: number;
    private _tray_height: number;
    private _ua_tray: string;

    constructor(){
        this._theme = "system";
        this._stay_on_top = false;
        this._main_width = 1080;
        this._main_height = 768;
        this._tray = false;
        this._tray_width = 400;
        this._tray_height = 600;
        this._ua_tray = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";
    }

    // load
    loadConfig(config: Config){
        this._theme = config.theme;
        this._stay_on_top = config.stay_on_top;
        this._main_width = config.main_width;
        this._main_height = config.main_height;
        this._tray = config.tray;
        this._tray_width = config.tray_width;
        this._tray_height = config.tray_height;
        this._ua_tray = config.ua_tray;
    }

    get theme(): string {
        return this._theme;
    }

    set theme(value: string) {
        this._theme = value;
    }

    get stay_on_top(): boolean {
        return this._stay_on_top;
    }

    set stay_on_top(value: boolean) {
        this._stay_on_top = value;
    }

    get main_width(): number {
        return this._main_width;
    }

    set main_width(value: number) {
        this._main_width = value;
    }

    get main_height(): number {
        return this._main_height;
    }

    set main_height(value: number) {
        this._main_height = value;
    }

    get tray(): boolean {
        return this._tray;
    }

    set tray(value: boolean) {
        this._tray = value;
    }

    get tray_width(): number {
        return this._tray_width;
    }

    set tray_width(value: number) {
        this._tray_width = value;
    }

    get tray_height(): number {
        return this._tray_height;
    }

    set tray_height(value: number) {
        this._tray_height = value;
    }

    get ua_tray(): string {
        return this._ua_tray;
    }

    set ua_tray(value: string) {
        this._ua_tray = value;
    }
}

export default Config;