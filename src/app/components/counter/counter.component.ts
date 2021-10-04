import { Component, OnInit } from "@angular/core";
import { CounterService } from "../../services/counter.service";

const STORAGE_KEY = 'counter';

@Component({
    selector: 'counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
    value: number;
    loading: boolean = true;
    cooldown: boolean = false;
    private cooldownTimeout;

    private get savedCounter(): number {
        let counter: number;
        try {
            let sessionData = sessionStorage.getItem(STORAGE_KEY);
            counter = parseInt(sessionData)
        } catch (e) {
            counter = 0;
        }

        return counter;
    }

    private set savedCounter(counter: number) {
        sessionStorage.setItem(STORAGE_KEY, counter.toString());
    }

    private counterObserver = {
        next: response => {
            this.cooldown = false;
            this.value = response.counter;
            this.loading = false;
            this.savedCounter = this.value;
        },
        error: (e) => {
            if (e.status == 403) {
                this.cooldown = true;
                window.clearTimeout(this.cooldownTimeout);
                this.cooldownTimeout = window.setTimeout(() => {
                    this.counterService.getCounter().subscribe(this.counterObserver);
                });
            } else {
                this.loading = false;
            }
            this.value = this.savedCounter;
            console.error(e);
        }
    }

    constructor(private counterService: CounterService) {}
    
    public ngOnInit(): void {
        this.counterService.getCounter()
        .subscribe(this.counterObserver);
    }

    public increment(): void {
        if (this.loading) return;

        this.loading = true;
        this.counterService.incrementCounter()
        .subscribe(this.counterObserver);
    }

    public decrement(): void {
        if (this.loading) return;

        this.loading = true;
        this.counterService.decrementCounter()
        .subscribe(this.counterObserver);
    }
}