import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

const DICT_PATH = '/assets/i18n/dict.en.json';

@Injectable()
export class I18nService {
    private dictObservable: Observable<any>;
    
    constructor(private httpClient: HttpClient) {}

    public get(key: string): Observable<any> {
        if (!this.dictObservable) this.dictObservable = this.fetchDictionary();

        return new Observable(subscriber => {
            this.dictObservable.subscribe(dict => {
                subscriber.next(dict[key]);
                subscriber.complete();
            })
        })
    }

    private fetchDictionary(): Observable<any> {
        return this.httpClient.get<any>(DICT_PATH)
        .pipe(
            shareReplay()
        );
    }
}