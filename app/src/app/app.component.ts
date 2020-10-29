import { Component, ViewChild } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getCookie, setCookie, hasCookie } from "./util/cookies";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    //drawer container to resize when contents change size
    @ViewChild(MatDrawerContainer, {static: true}) container: MatDrawerContainer;
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
    
    // public showSidebar: boolean = false;
    // public toggleSidebar() {
    //     this.
    // }

    resizeDrawers() {
        console.log("resizing drawer")
        this.container.updateContentMargins();
    }
}
