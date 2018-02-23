class VisitSource {
    // safe max cookie expire date (32bit)
    cookieExpireDate: Date = new Date(0x7fffffff * 1e3);

    cookieDomain: string;
    cookieName: string;
    isSession: boolean;

    /**
     *
     * @param cookieName - cookie where session referrer is stored
     * @param cookieDomain - cookie domain parameter - for saving cookies
     * @param isSession - flag, based on value cookie is stored only for current session or lifetime
     */
    constructor (cookieName: string, cookieDomain: string, isSession: boolean = true) {
        this.cookieName = cookieName;
        this.cookieDomain = cookieDomain;
        this.isSession = isSession;
    }

    public checkAndStore(): void {
        if (this.getCookieValue(this.cookieName, this.getCookie()) === null) {
            this.store();
        }
    }

    public store(): void {
        var referrer: string = this.getReferrer(),
        cookieString: string;
        cookieString = this.cookieName + '=' + encodeURIComponent(referrer);
        cookieString += !this.isSession ? '; expires=' + this.cookieExpireDate.toUTCString() : '';
        cookieString += '; path=/; domain=' + this.cookieDomain;

        this.setCookie(cookieString);
    }

    public get(): string {
        return this.getCookieValue(this.cookieName, this.getCookie());
    }

    private getCookieValue(name, cookieString): string {
        var parts = ('; ' + cookieString).split('; ' + name + '=');
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    private getReferrer(): string {
        return document.referrer;
    }

    private setCookie(cookieString: string): void {
        document.cookie = cookieString;
    }

    private getCookie(): string {
        return document.cookie;
    }
}
