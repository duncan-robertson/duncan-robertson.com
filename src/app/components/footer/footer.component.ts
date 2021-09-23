import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';

@Component({
    selector: 'my-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    currentYear;

    constructor(private timeService: TimeService) {}

    public ngOnInit(): void {
        this.timeService.makeCall().subscribe(time => {
            this.currentYear = (new Date(time.timestamp)).getFullYear();
        })
    }

}