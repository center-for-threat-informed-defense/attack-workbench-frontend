import { Component, OnInit, ViewEncapsulation, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

const isAbsolute = new RegExp('(?:^[a-z][a-z0-9+.-]*:|\/\/)', 'i');

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpPageComponent implements OnInit {
    private listenObj: any;
    @ViewChild('markdownElement', {static: false})
    private markdownElement: MarkdownComponent;

    constructor(private markdownService: MarkdownService, 
                private router: Router, 
                private renderer: Renderer2,
                public route: ActivatedRoute) {} 

    ngOnInit() {
        // extend default markdown renderer with additional bells and whistles
        // add anchor link to headers rendered HTML
        // this.markdownService.renderer.heading = (text: string, level: number) => {
        //     const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        //     return '<h' + level + '>' +
        //                 '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
        //                     '<span class="header-link"></span>' +
        //                 '</a>' + text +
        //            '</h' + level + '>';
        // }
        
        // remove .md from the end of the link if it's an absolute link to this project
        this.markdownService.renderer.link = (href: string, title: string, text: string) => {
            if (href.startsWith("/") && href.endsWith(".md")) href = href.split(".md")[0]
            return `<a href="${href}">${text}</a>`
        }
    }
    // from https://github.com/jfcere/ngx-markdown/issues/125#issuecomment-518025821
    public onMarkdownLoad(e) {
        // hijack clicks on links to use router navigation
        if (this.markdownElement) {
            this.listenObj = this.renderer.listen(this.markdownElement.element.nativeElement, 'click', (e: Event) => {
                if (e.target && (e.target as any).tagName === 'A') {
                    const el = (e.target as HTMLElement);
                    const linkURL = el.getAttribute && el.getAttribute('href');
                    if (linkURL && !isAbsolute.test(linkURL)) {
                        e.preventDefault()
                        this.router.navigate([linkURL]);
                    }
                }
            })
        }
    }

    ngOnDestroy(): void {
        if (this.listenObj) { 
            this.listenObj();
        }
    }

}
