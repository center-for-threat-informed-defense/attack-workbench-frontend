import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpPageComponent implements OnInit {

    constructor(private markdownService: MarkdownService, public route: ActivatedRoute) {}

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
    }

}
