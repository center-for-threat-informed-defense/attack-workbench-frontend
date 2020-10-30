import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getCookie, setCookie, hasCookie } from "./util/cookies";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    //drawer container to resize when contents change size
    @ViewChild(MatDrawerContainer, {static: true}) private container: MatDrawerContainer;
    //elements for scroll behavior
    @ViewChild("header", {static: false, read: ElementRef}) private header: ElementRef;
    @ViewChild("scrollRef", {static: false, read: ElementRef}) private scrollRef: ElementRef;

    constructor(private overlayContainer: OverlayContainer) {
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
        this.scrollRef.nativeElement.addEventListener('scroll', (e) => this.scrollEvent(e), true);
    }
    ngOnDestroy() { 
        this.scrollRef.nativeElement.removeEventListener('scroll', (e) => this.scrollEvent(e), true);
    }

    public hiddenHeaderPX: number = 0; //number of px of the header which is hidden
    // when a scroll happens
    private scrollEvent($event): void {
        let headerHeight = this.header.nativeElement.offsetHeight;
        // constrain amount of hidden to bounds, round up because decimal scroll causes flicker
        this.hiddenHeaderPX = Math.floor(Math.min(Math.max(0, this.scrollRef.nativeElement.scrollTop/2), headerHeight)); 
    }
    // scroll to the top of the main content
    public scrollToTop(): void {
        this.scrollRef.nativeElement.scroll({top: 0, behavior: "smooth"});
    }

    // when the drawer resizes
    public resizeDrawers(): void {
        console.log("resizing drawer")
        this.container.updateContentMargins();
    }
}
