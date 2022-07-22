import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    templateUrl: 'toolbar.component.html'
})
export class ToolbarComponent {

    @Input()
    title: string;

    @Input()
    showNotificationsButton: boolean;

    @Input()
    showBackButton: boolean;

    constructor(private router: Router) {

    }

    goToNotifications() {
        this.router.navigate(['/notifications']);
    }
}
