import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.css']
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLang = 'en';
  languages = ['en', 'es'];
  private langChangeSub?: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentLang = this.translate.getCurrentLang() || 'en';
    this.langChangeSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  useLanguage(language: string): void {
    if (language === this.currentLang) return;
    this.translate.use(language);
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }
}
