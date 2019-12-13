import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-error-component',
  templateUrl: './access-error.component.html'
})
export class AccessErrorComponent {
    constructor(private router: Router) {  }

    toLogin() {
        this.router.navigateByUrl('');
    }
}
