import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { Router, Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdButton } from '@angular2-material/button';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { AboutComponent } from './+about';
import { GroupsComponent } from './+groups';
import { GoalsComponent } from './+goals';
import { BenefitsComponent } from './+benefits';
import { ConductComponent } from './+conduct';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { GroupEventsComponent } from './+group-events';
import { GroupEventsService } from './group-events.service';

@Component({
  moduleId: module.id,
  selector: 'nexus-app',
  templateUrl: 'nexus.component.html',
  styleUrls: ['nexus.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MdButton,
    MdIcon,
    MD_SIDENAV_DIRECTIVES,
    MdToolbar,
    MD_LIST_DIRECTIVES
  ],
  providers: [
    ROUTER_PROVIDERS,
    JSONP_PROVIDERS,
    HTTP_PROVIDERS,
    MdIconRegistry,
    GroupEventsService
  ]
})
@Routes([
  {path: '#!/about', component: AboutComponent},
  {path: '#!/groups', component: GroupsComponent},
  {path: '#!/goals', component: GoalsComponent},
  {path: '#!/benefits', component: BenefitsComponent},
  {path: '#!/conduct', component: ConductComponent},
  {path: '#!/group_events', component: GroupEventsComponent}
])
export class NexusAppComponent implements OnInit {
  title = 'Nexus';

  constructor(mdIconRegistry: MdIconRegistry, private router: Router, public af: AngularFire) {}

  ngOnInit() {
    if (window.location.hash === '') {
      this.router.navigate(['#!/about']);
    } else {
      this.router.navigate([window.location.hash]);
    }
  }

  login() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    }).then((authData) => {
      console.log(authData);

      // adding the authData to Firebase
      const itemObservable = this.af.database.list('/users');
      console.log(itemObservable);
      itemObservable.push({ provider: authData.auth['provider'],
        image: authData.google['profileImageURL'],
        name: authData.google['displayName'],
        token : authData.google['accessToken'] });
    });
  }

}
