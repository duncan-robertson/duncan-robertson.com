import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const MIN_BUY_IN = 10;
const INIT_MONEY = 1000;
enum State {
    BUY = "BUY",
    SET = "SET",
    PLAY = "PLAY",
    WIN = "WIN",
    LOSE = "LOSE",
}

@Component({
    selector: 'gambling',
    templateUrl: './gambling.component.html',
    styleUrls: ['./gambling.component.css']
})
export class GamblingComponent implements OnInit {
    private overBidValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        if (control.value > this.money) {
            return {overBid: {value: control.value}}
        } else {
            return null;
        }
    }

    private onBetChange = (): void => {
        this.displayBetErrors = false;
        window.clearTimeout(this.betChangeTimeout);
        this.betChangeTimeout = window.setTimeout(() => {this.displayBetErrors = true}, 1000);
    }

    state: State = State.BUY;
    money: number = INIT_MONEY;
    bet: number;
    payout: number;
    point: number;
    die1: number;
    die2: number;
    betForm = new FormGroup({
        betControl: new FormControl('', this.betControlValidations)
    });
    displayBetErrors: boolean = false;
    processing: boolean = false;

    private betChangeTimeout: number;

    get betControlValidations(): ValidatorFn[] {
        return [
            Validators.required,
            Validators.min(MIN_BUY_IN),
            Validators.pattern(/[1-9][\d]*/),
            this.overBidValidator,
        ]
    }
    get betControl() { return this.betForm.get('betControl') as FormControl; }

    public ngOnInit(): void {
        this.state = State.BUY;
        this.money = INIT_MONEY;
        this.betControl.valueChanges.subscribe(this.onBetChange);
    }

    public onBet(event: Event): void {
        event.preventDefault();
        let bet;
        try {
            bet = parseInt(this.betControl.value);
        } catch (e) {
            return;
        }
        let validBuy = (
            this.state == State.BUY && 
            bet >= MIN_BUY_IN &&
            this.money - bet >= 0
        );
        
        if (validBuy) {
            this.bet = bet;
            this.money -= bet;
            this.state = State.SET
        }
    }

    public async onRollSet(): Promise<void>{
        if (!this.processing && this.state == State.SET) {
            this.processing = true;
            
            await this.delayRoll();
            
            this.die1 = this.rollDie();
            this.die2 = this.rollDie();

            let total = this.die1 + this.die2;
            let pass = (
                total == 7 ||
                total == 11
            );
            let crapOut = (
                total == 2 ||
                total == 3 ||
                total == 12
            );
            if (pass) {
                this.payout = this.bet * 2
                this.money += this.payout;
                this.state = State.WIN;
            } else if (crapOut) {
                this.state = State.LOSE;
            } else {
                this.point = total;
                this.state = State.PLAY;
            }

            this.processing = false;
        }
    }

    public async onRollPlay(): Promise<void> {
        if (!this.processing && this.state == State.PLAY) {
            this.processing = true;

            await this.delayRoll();

            this.die1 = this.rollDie();
            this.die2 = this.rollDie();

            let total = this.die1 + this.die2;

            if (total == this.point) {
                this.payout = this.bet * 2
                this.money += this.payout;
                this.state = State.WIN;
            } else if (total == 7) {
                this.state = State.LOSE;
            }

            this.processing = false;
        }
    }

    public playAgain(): void {
        if (this.state == State.WIN || this.state == State.LOSE) {
            this.state = State.BUY;
            this.bet = 0;
            this.payout = 0;
            this.betForm.reset();
            this.die1 = 0;
            this.die2 = 0;
        }
    }

    private rollDie(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    private async delayRoll(): Promise<void> {
        return new Promise(resolve => {
            var numRolls = 10;
            
            let fakeRoll = () => {
                if (numRolls > 0) {
                    numRolls--;
                    this.die1 = this.rollDie();
                    this.die2 = this.rollDie();
                    window.setTimeout(fakeRoll, 100);
                } else {
                    resolve();
                }
            };
            
            fakeRoll();
        });
    }
}