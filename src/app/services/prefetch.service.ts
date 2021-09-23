import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PrefetchService {
    loadedUrls: Array<string> = [];
    
    constructor(private httpClient: HttpClient) {}

    public load(url: string): void {
        if (!this.loadedUrls.includes(url)) {
            this.loadedUrls.push(url);
            this.httpClient.get(url);
        }
    }
}