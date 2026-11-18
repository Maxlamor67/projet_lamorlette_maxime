import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightPollution]',
  standalone: true
})
export class HighlightPollutionDirective implements OnChanges {
  @Input('appHighlightPollution') level = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const colors: Record<string, string> = {
      'Faible': 'lightgreen',
      'Modérée': 'yellow',
      'Élevée': 'orange',
      'Dangereuse': 'red'
    };

    const backgroundColor = colors[this.level] ?? 'transparent';
    this.renderer.setStyle(this.el.nativeElement, 'background-color', backgroundColor);
    this.renderer.setStyle(this.el.nativeElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '8px');
  }
}
