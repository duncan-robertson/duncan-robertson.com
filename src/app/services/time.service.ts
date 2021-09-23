import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, share } from 'rxjs';

@Injectable()
export class TimeService {
    constructor(private httpClient: HttpClient) {}

    public makeCall(): Observable<any> {
        return this.httpClient.get<any>('/time.json')
        .pipe(
            share()
        );
    }
}