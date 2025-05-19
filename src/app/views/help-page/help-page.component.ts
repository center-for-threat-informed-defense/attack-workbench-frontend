import { ViewportScroller } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parser } from 'marked';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

const isAbsolute = new RegExp('(?:^[a-z][a-z0-9+.-]*:|\/\/)', 'i');

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HelpPageComponent implements OnInit, OnDestroy {
  private listenObj: any;
  @ViewChild('markdownElement', { static: false })
  private markdownElement: MarkdownComponent;
  public headingAnchors: MarkdownHeadingAnchor[] = [];

  constructor(
    private markdownService: MarkdownService,
    private router: Router,
    private renderer: Renderer2,
    public route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // extend default markdown renderer with additional bells and whistles
    // add anchor link to headers rendered HTML
    // const self = this;
    this.markdownService.renderer.heading = ({ tokens, depth }) => {
      const text = Parser.parseInline(tokens);
      const escapedText = '_' + text.toLowerCase().replace(/[^\w]+/g, '-');
      if (depth != 1)
        this.headingAnchors.push({
          level: depth,
          anchor: escapedText,
          label: text.replace('&amp;', '&').replace('&#39;', "'"),
        });
      return `<h${depth} class="${escapedText}">${text}</h${depth}>`;
    };

    // remove .md from the end of the link if it's an absolute link to this project
    this.markdownService.renderer.link = ({ href, tokens }) => {
      const text = Parser.parseInline(tokens);
      if (href.startsWith('/') && href.endsWith('.md'))
        href = href.split('.md')[0];
      return `<a href="${href}">${text}</a>`;
    };
  }
  // from https://github.com/jfcere/ngx-markdown/issues/125#issuecomment-518025821
  public onMarkdownLoad(e) {
    // hijack clicks on links to use router navigation
    if (this.markdownElement) {
      this.listenObj = this.renderer.listen(
        this.markdownElement.element.nativeElement,
        'click',
        (e: Event) => {
          if (e.target && (e.target as any).tagName === 'A') {
            const el = e.target as HTMLElement;
            const linkURL = el.getAttribute && el.getAttribute('href');
            if (linkURL && !isAbsolute.test(linkURL)) {
              e.preventDefault();
              this.router.navigate([linkURL]);
            }
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.listenObj) {
      this.listenObj();
    }
  }

  public scrollTo(anchor) {
    const element = document.querySelector('.' + anchor);
    if (element)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
  }
}

interface MarkdownHeadingAnchor {
  level: number;
  anchor: string;
  label: string;
}
