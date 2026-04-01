import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app/state/index';
import { loadTodosRequest } from '../app/state/todo/todo.actions';
import LayoutComponent from '../ui/templates/Skeleton/Layout.component';
import SiteHeaderContainerComponent from '../containers/SiteHeaderContainer';
import TodoFiltersContainerComponent from '../containers/TodoFiltersContainer';
import TodoListContainerComponent from '../containers/TodoListContainer';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    LayoutComponent,
    SiteHeaderContainerComponent,
    TodoFiltersContainerComponent,
    TodoListContainerComponent,
  ],
  templateUrl: './HomePage.component.html',
})
export default class HomePageComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(loadTodosRequest());
  }
}
