import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  private authStatusSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSubscription = this.authService.gethAuthStatusListener().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    })
  }
}
