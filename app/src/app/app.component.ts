import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getCookie, setCookie, hasCookie } from "./util/cookies";
import { SidebarService } from './services/sidebar/sidebar.service';
import { TitleService } from './services/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    //drawer container to resize when contents change size
    @ViewChild(MatDrawerContainer, {static: true}) private container: MatDrawerContainer;
    //elements for scroll behavior
    @ViewChild("header", {static: false, read: ElementRef}) private header: ElementRef;
    @ViewChild("scrollRef", {static: false, read: ElementRef}) private scrollRef: ElementRef;

    
    constructor(private overlayContainer: OverlayContainer,
                private sidebarService: SidebarService,
                private titleService: TitleService) { //note: this isn't used directly, but it MUST be imported to work properly
        if (hasCookie("theme")) {
            this.setTheme(getCookie("theme"))
        } else {
            this.setTheme("light");
        }
    }

    public theme = "light";
    //toggle the current theme
    public toggleTheme() {
        this.setTheme(this.theme == "light"? "dark" : "light");
    }
    
    public setTheme(theme: string) {
        console.log("setting theme to", theme)
        this.theme = theme;
        const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
        overlayContainerClasses.remove("dark", "light");
        overlayContainerClasses.add(this.theme);
        setCookie("theme", theme, 30);
    }

    // header hiding with scroll
    ngAfterViewInit() {
        this.scrollRef.nativeElement.addEventListener('scroll', (e) => this.scrollEvent(), true);
    }
    ngOnDestroy() { 
        this.scrollRef.nativeElement.removeEventListener('scroll', (e) => this.scrollEvent(), true);
    }

    public hiddenHeaderPX: number = 0; //number of px of the header which is hidden
    // when a scroll happens
    private scrollEvent(): void {
        let headerHeight = this.header.nativeElement.offsetHeight;
        // constrain amount of hidden to bounds, round up because decimal scroll causes flicker
        this.hiddenHeaderPX = Math.floor(Math.min(Math.max(0, this.scrollRef.nativeElement.scrollTop/2), headerHeight)); 
    }
    // scroll to the top of the main content
    public scrollToTop(): void {
        this.scrollRef.nativeElement.scroll({top: 0, behavior: "smooth"});
    } 

    public get sidebarOpened() { return this.sidebarService.opened; }
}
