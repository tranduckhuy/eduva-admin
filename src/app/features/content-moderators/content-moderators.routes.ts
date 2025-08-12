import { Routes } from '@angular/router';

export const contentModeratorsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./content-moderators.component').then(
        mod => mod.ContentModeratorsComponent
      ),
    data: {
      title: 'Danh sách kiểm duyệt viên',
      heading: 'Danh sách kiểm duyệt viên',
      breadcrumb: 'Danh sách kiểm duyệt viên',
    },
  },
  {
    path: ':contentModeratorId',
    loadComponent: () =>
      import('./content-moderator/content-moderator.component').then(
        mod => mod.ContentModeratorComponent
      ),
    data: {
      title: 'Chi tiết kiểm duyệt viên',
      heading: 'Chi tiết kiểm duyệt viên',
      breadcrumb: 'Chi tiết kiểm duyệt viên',
    },
  },
];
