import { Component, HostBinding, OnInit } from '@angular/core';
import { I18nService } from './services/i18n.service';

const DARK_MODE_KEY = 'dark';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @HostBinding('class.dark') darkMode;

    githubLink: string;
    githubLinkText: string;
    tech3: string[];

    constructor(private i18nService: I18nService) {}

    public ngOnInit(): void {
        this.i18nService.get('githubLink').subscribe(value => this.githubLink = value);
        this.i18nService.get('githubLinkText').subscribe(value => this.githubLinkText = value);
        this.i18nService.get('tech3').subscribe(value => this.tech3 = value);

        this.darkMode = this.storedDark;
    }

    public toggleDark(): void {
        this.darkMode = !this.darkMode;
        this.storedDark = this.darkMode;
    }

    private get storedDark(): boolean {
        let storageItem: any = localStorage.getItem(DARK_MODE_KEY);
        if (storageItem == undefined) {
            storageItem = false;
        } else {
            try {
                storageItem = JSON.parse(storageItem);
            } catch {
                storageItem = false;
            }
        }

        if (storageItem !== true && storageItem !== false) {
            storageItem = false;
        }

        localStorage.setItem(DARK_MODE_KEY, JSON.stringify(storageItem));

        return storageItem as boolean;
    }

    private set storedDark(val: boolean) {
        localStorage.setItem(DARK_MODE_KEY, JSON.stringify(val))
    }
}