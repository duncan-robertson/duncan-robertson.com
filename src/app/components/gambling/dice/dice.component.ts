import { Component, Input, OnInit } from "@angular/core";
import { PrefetchService } from "../../../services/prefetch.service";

@Component({
    selector: 'dice',
    templateUrl: './dice.component.html',
    styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit{
    @Input()
    val: number;

    private die1 = DIE1;
    private die2 = DIE2;
    private die3 = DIE3;
    private die4 = DIE4;
    private die5 = DIE5;
    private die6 = DIE6;

    constructor(private prefetchService: PrefetchService) {}

    public ngOnInit(): void {
        this.prefetchService.load(this.die1);
        this.prefetchService.load(this.die2);
        this.prefetchService.load(this.die3);
        this.prefetchService.load(this.die4);
        this.prefetchService.load(this.die5);
        this.prefetchService.load(this.die6);
    }
}