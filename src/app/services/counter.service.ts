import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";

const GET_PATH = '/api/counter';
const UPDATE_PATH = '/api/counter/update';

type CounterResponse = {
    counter: number
};

enum UpdateTypes {
    ADD = "ADD",
    SUB = "SUB",
}

const INCREMENT_REQUEST = {
    operation: UpdateTypes.ADD
};

const DECREMENT_REQUEST = {
    operation: UpdateTypes.SUB
};

@Injectable()
export class CounterService {
    constructor(private httpClient: HttpClient) {}

    public getCounter(): Observable<CounterResponse> {
        return this.httpClient.get<CounterResponse>(GET_PATH)
        .pipe(
            shareReplay()
        );
    }

    public incrementCounter(): Observable<CounterResponse> {
        return this.httpClient.put<CounterResponse>(UPDATE_PATH, INCREMENT_REQUEST)
        .pipe(
            shareReplay()
        );
    }

    public decrementCounter(): Observable<CounterResponse> {
        return this.httpClient.put<CounterResponse>(UPDATE_PATH, DECREMENT_REQUEST)
        .pipe(
            shareReplay()
        );
    }
}