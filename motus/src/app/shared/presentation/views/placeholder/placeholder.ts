import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder">
      <div class="placeholder-icon">🚧</div>
      <h2>En construcción</h2>
      <p>Esta sección estará disponible próximamente.</p>
    </div>
  `,
  styles: [`
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }
    .placeholder-icon { font-size: 4rem; margin-bottom: 1rem; }
    .placeholder h2 { margin: 0 0 0.5rem; color: #1a1a2e; }
    .placeholder p { color: #666; margin: 0; }
  `]
})
export class PlaceholderComponent {}
