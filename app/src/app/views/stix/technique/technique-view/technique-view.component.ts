import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Tactic } from 'src/app/classes/stix/tactic';

@Component({
  selector: 'app-technique-view',
  templateUrl: './technique-view.component.html',
  styleUrls: ['./technique-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit {

    public editing: boolean = false;

    public get technique(): Technique { return this.config.object as Technique; }

    constructor(private router: Router, private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.router.events.subscribe(event => { 
            if (event instanceof NavigationEnd) { 
                // trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = true;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        })

        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    
        console.log(this.technique);

    }

    ngOnDestroy() {
        // this.router.events.unsubscribe();
    }

}
