import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Profile, ProfileData } from '../../shared-modules/app-common/profile/profile';
import { ActivatedRoute } from '@angular/router';
import { FrontNavigationService } from '../../shared-modules/service/front-navigation.service';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import {
  InstructorFindOneDefaultResponse,
  InstructorResponseDto,
  InstructorService,
  StudentFindOneDefaultResponse,
  StudentResponseDto,
  StudentService,
  UserFindOneDefaultResponse,
  UserResponseDto,
  UserRoleService,
  UserService,
} from '../../core/data-services';

type ProfileResponse =
  | UserFindOneDefaultResponse
  | StudentFindOneDefaultResponse
  | InstructorFindOneDefaultResponse;

@Component({
  selector: 'app-profile-page',
  imports: [Profile],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  userData: WritableSignal<ProfileData | null> = signal(null);
  userType: WritableSignal<Roles | null> = signal(null);

  route = inject(ActivatedRoute);
  frontNavigationService = inject(FrontNavigationService);
  frontAuthService = inject(FrontAuthService);
  userRoleService = inject(UserRoleService);
  userService = inject(UserService);
  studentService = inject(StudentService);
  instructorService = inject(InstructorService);

  userId: string | number | null = null;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.userRoleService.userRoleGetUserRole({ id: this.userId }).subscribe({
        next: (result) => {
          const userRole = result?.data?.name as Roles;
          this.getData(userRole, this.userId as string);
        },
        error: () => {
          this.frontNavigationService.navigate('/not-found');
        },
      });
    } else {
      const userRole = this.frontAuthService.tokenPersonalizedData?.role;

      const isStudent = userRole === Roles.STUDENT;
      const isInstructor = userRole === Roles.INSTRUCTOR;
      const isManagement = userRole === Roles.MANAGEMENT;
      const isAdmin = userRole === Roles.ADMIN;

      if (!userRole || (!isStudent && !isInstructor && !isManagement && !isAdmin)) {
        this.frontNavigationService.navigate('/not-found');
        return;
      }

      const userId = this.frontAuthService.userId ?? '';

      this.getData(userRole, userId);
    }
  }

  private getData(role: Roles, userId: string) {
    switch (role) {
      case Roles.STUDENT:
        this.studentService.studentFindOne({ id: userId }).subscribe({
          next: (result) => this.handleProfile(result, Roles.STUDENT),
          error: () => this.frontNavigationService.navigate('/not-found'),
        });
        break;
      case Roles.INSTRUCTOR:
        this.instructorService.instructorFindOne({ id: userId }).subscribe({
          next: (result) => this.handleProfile(result, Roles.INSTRUCTOR),
          error: () => this.frontNavigationService.navigate('/not-found'),
        });
        break;
      default:
        this.userService.userFindOne({ id: userId }).subscribe({
          next: (result) => this.handleProfile(result, role),
          error: () => this.frontNavigationService.navigate('/not-found'),
        });
        break;
    }
  }

  private extractUser(
    data: UserResponseDto | StudentResponseDto | InstructorResponseDto,
  ): UserResponseDto {
    if ('user' in data) {
      return data.user;
    }
    return data;
  }

  private handleProfile(result: ProfileResponse, role: Roles) {
    const data = result.data;

    if (!data) {
      this.frontNavigationService.navigate('/not-found');
      return;
    }

    const user = this.extractUser(data);
    const student = data as StudentResponseDto;
    const instructor = data as InstructorResponseDto;

    this.userData.set({
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      campus: user.campus.name,

      ...(role === Roles.STUDENT && {
        program: String(student.program.name),
        enrollmentYear: student.enrollment_year,
        emergency_phone: student.emergency_phone,
        emergency_contact: student.emergency_contact,
        address: student.address,
        city: student.city,
        zipCode: student.zip_code,
      }),

      ...(role === Roles.INSTRUCTOR && {
        department: String(instructor.department.name),
        hire_date: instructor.hire_date,
        specialization: String(instructor.specialization.name),
      }),
    });

    this.userType.set(role);
  }
}
