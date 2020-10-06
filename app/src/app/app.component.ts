import { Component, ViewChild } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    //drawer container to resize when contents change size
    @ViewChild(MatDrawerContainer, {static: true}) container: MatDrawerContainer;
    constructor(private overlayContainer: OverlayContainer) {
        this.syncOverlayTheme();
    }
    private theme = "light";
    //toggle the current theme
    private toggleTheme() {
        this.theme = this.theme == "light"? "dark" : "light";
        this.syncOverlayTheme();
    }

    private syncOverlayTheme() {
        const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
        overlayContainerClasses.remove("dark", "light");
        overlayContainerClasses.add(this.theme);
    }


    resizeDrawers() {
        console.log("resizing drawer")
        this.container.updateContentMargins();
    }
}
