import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('employee-management-system-frontend');

  ngOnInit(): void {
    this.injectBadge();
  }

  private injectBadge(): void {
    const host = environment.urlMaps[window.location.hostname];

    // Hostname not in the map — no badge for this domain
    if (!host) return;

    const script = document.createElement('script');
    script.src = `${host}/badge.js`;
    script.setAttribute('data-host', host);
    script.setAttribute('data-position', '60');
    script.setAttribute('data-type', 'regular');
    script.setAttribute('data-theme', 'light');
    document.body.appendChild(script);
  }
}
