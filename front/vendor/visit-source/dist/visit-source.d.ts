interface VisitSource {
    new(cookieName: string, cookieDomain: string, isSession?: boolean): VisitSource;
    checkAndStore(): void;
    store(): void;
    get(): string;
}
