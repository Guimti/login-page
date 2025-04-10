import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CourseCreatorComponent } from '../../components/course-creator/course-creator.component';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  status: 'published' | 'draft' | 'archived';
  lessons: number;
  students: number;
  progress: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CourseCreatorComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  activeTab: 'all' | 'published' | 'drafts' | 'archived' = 'all';
  courses: Course[] = [
    {
      id: 1,
      title: 'Fundamentos de Marketing Digital',
      description: 'Aprenda os princípios básicos do marketing digital e como aplicá-los em seu negócio.',
      image: 'assets/images/marketing-digital.jpg',
      status: 'published',
      lessons: 12,
      students: 45,
      progress: 100
    },
    {
      id: 2,
      title: 'Desenvolvimento Web com React',
      description: 'Crie aplicações web modernas com React, a biblioteca JavaScript mais popular do mercado.',
      image: 'assets/images/react-dev.jpg',
      status: 'published',
      lessons: 24,
      students: 32,
      progress: 80
    },
    {
      id: 3,
      title: 'Fotografia para Iniciantes',
      description: 'Domine sua câmera e aprenda a tirar fotos impressionantes mesmo sem equipamentos profissionais.',
      image: 'assets/images/photography.jpg',
      status: 'published',
      lessons: 16,
      students: 28,
      progress: 60
    },
    {
      id: 4,
      title: 'Gestão Financeira para Pequenos Negócios',
      description: 'Aprenda a controlar as finanças do seu negócio e maximizar seus lucros.',
      image: 'assets/images/finance.jpg',
      status: 'published',
      lessons: 10,
      students: 15,
      progress: 40
    }
  ];

  stats = {
    totalCourses: 4,
    totalStudents: 120,
    totalRevenue: 3240.00,
    completionRate: 68
  };

  showCourseCreator = false;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('username') || '';
  }

  setActiveTab(tab: 'all' | 'published' | 'drafts' | 'archived') {
    this.activeTab = tab;
  }

  getFilteredCourses(): Course[] {
    if (this.activeTab === 'all') return this.courses;
    return this.courses.filter(course => {
      if (this.activeTab === 'published') return course.status === 'published';
      if (this.activeTab === 'drafts') return course.status === 'draft';
      return course.status === 'archived';
    });
  }

  logout() {
    this.loginService.logout();
  }

  editCourse(courseId: number) {
    console.log('Edit course:', courseId);
  }

  viewCourse(courseId: number) {
    console.log('View course:', courseId);
  }

  deleteCourse(courseId: number) {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      this.courses = this.courses.filter(course => course.id !== courseId);
      // TODO: Implement API call to delete course
    }
  }

  openCourseCreator(): void {
    this.showCourseCreator = true;
  }

  closeCourseCreator(): void {
    this.showCourseCreator = false;
  }
} 