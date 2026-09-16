import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * UserList.
 * While `isLoading`, render 6 skeleton rows that occupy the same height as a
 * real row, hidden from screen readers, inside a region that announces the
 * loading state. The shimmer must respect prefers-reduced-motion (CSS).
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./UserList.style.css'],
  template: `
    <!-- Your code here. -->
    <p *ngIf="isLoading">Loading…</p>
    <ul class="user-list" *ngIf="!isLoading">
      <li class="user-card" *ngFor="let u of users">{{ u.name }}</li>
    </ul>
  `,
})
export default class UserListComponent {
  @Input() users: Array<{ id: string; name: string }> = [];
  @Input() isLoading = false;
}
