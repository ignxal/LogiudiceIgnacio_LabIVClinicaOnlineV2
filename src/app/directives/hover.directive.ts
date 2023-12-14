import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHover]',
})
export class HoverDirective {
  constructor(private el: ElementRef) {}

  @Input() defaultColor = 'rgb(38, 42, 43)';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.defaultColor || 'lightgrey');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
