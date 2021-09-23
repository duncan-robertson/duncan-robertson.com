import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
    selector: 'i18n',
    template: '{{value}}',
    styles: [':host{display: inline;}']
})
export class I18nComponent implements OnInit {
    @Input() key: string;
    public value;

    constructor(private i18nService: I18nService) {}

    public ngOnInit(): void {
        this.i18nService.get(this.key).subscribe(value => this.value = value);
    }
}