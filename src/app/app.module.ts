import { NgModule } from '@angular/core';

//Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//Components
import { AppComponent } from './app.component';
import { I18nComponent } from './components/i18n/i18n.component';
import { FooterComponent } from './components/footer/footer.component';
import { GamblingComponent } from './components/gambling/gambling.component';
import { DiceComponent } from './components/gambling/dice/dice.component';
import { YoutubeQComponent } from './components/youtube-q/youtube-q.component';

//Services
import { TimeService } from './services/time.service';
import { I18nService } from './services/i18n.service';
import { PrefetchService } from './services/prefetch.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    declarations: [ AppComponent, I18nComponent, GamblingComponent, DiceComponent, YoutubeQComponent, FooterComponent],
    providers: [TimeService, I18nService, PrefetchService],
    bootstrap: [ AppComponent ]
})
export class AppModule {}