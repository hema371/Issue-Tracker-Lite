import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">📋 IssueTracker Lite</h1>
          <nav class="app-nav">
            <a routerLink="/issues" routerLinkActive="active">Issues</a>
          </nav>
        </div>
      </header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>&copy; 2025 IssueTracker Lite. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; display: flex; flex-direction: column; }
    .app-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
    .app-title { margin: 0; font-size: 1.8rem; }
    .app-nav { display: flex; gap: 2rem; }
    .app-nav a { color: white; text-decoration: none; font-weight: 500; padding: 0.5rem 0; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .app-nav a:hover, .app-nav a.active { border-bottom-color: white; }
    .app-content { flex: 1; }
    .app-footer { background: #333; color: white; text-align: center; padding: 1.5rem; margin-top: 2rem; }
    .app-footer p { margin: 0; }
    @media (max-width: 600px) {
      .header-content { flex-direction: column; gap: 1rem; align-items: start; }
      .app-title { font-size: 1.5rem; }
    }
  `]
})
export class AppComponent {
  title = 'IssueTracker Lite';
}
