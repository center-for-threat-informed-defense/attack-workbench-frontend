import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { logger } from '../../utils/logger';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(
    private angularTitleService: Title,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    //subscribe to router events and update the title
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      )
      .subscribe((event) => this.setTitle(event['title']));
  }

  public setTitle(newTitle?: string, autocase = true) {
    logger.log('Setting page title to', newTitle);
    if (newTitle && autocase)
      newTitle = newTitle.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    if (!newTitle) newTitle = 'ATT&CK Workbench';
    else newTitle = newTitle + ' | ATT&CK Workbench';
    // titlecase the title
    this.angularTitleService.setTitle(newTitle);
  }
}
