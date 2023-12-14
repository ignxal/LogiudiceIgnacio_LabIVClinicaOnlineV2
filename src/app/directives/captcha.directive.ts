import {
  Directive,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { CaptchaService } from '../services/captcha.service';
import { LoaderService } from '../services/loader.service';

@Directive({
  selector: '[appCaptcha]',
})
export class CaptchaDirective {
  @Output() captcha = new EventEmitter<String>();
  @Output() captchaResult = new EventEmitter<boolean>();
  @Input() requestCaptcha: boolean = false;
  @Input() enteredCaptcha: string;

  theCatpcha: any;

  constructor(
    private captchaService: CaptchaService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    this.loaderService.show();
    this.captchaService.getOne().subscribe({
      next: (x) => {
        this.theCatpcha = x[0].value;
        this.captcha.emit(x[0].img);
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  validateCaptcha() {
    this.captchaResult.emit(
      this.enteredCaptcha.toLowerCase() === this.theCatpcha.toLowerCase()
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes ||
      (!changes['requestCaptcha'] && !changes['enteredCaptcha']) ||
      !this.theCatpcha
    ) {
      return;
    }

    if (changes['requestCaptcha']) {
      this.createCaptcha();
    }

    if (changes['enteredCaptcha']) {
      this.validateCaptcha();
    }
  }
}
