import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Profile, ProfileData, ProfileType } from '../../shared-modules/app-common/profile/profile';
import { ActivatedRoute } from '@angular/router';
import { FrontNavigationService } from '../../shared-modules/service/front-navigation.service';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import {
  InstructorFindOneDefaultResponse,
  InstructorService,
  StudentFindOneDefaultResponse,
  StudentService,
} from '../../core/data-services';

@Component({
  selector: 'app-profile-page',
  imports: [Profile],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  userData: WritableSignal<ProfileData | null> = signal(null);
  userType: WritableSignal<ProfileType | null> = signal(null);

  route = inject(ActivatedRoute);
  frontNavigationService = inject(FrontNavigationService);
  frontAuthService = inject(FrontAuthService);
  studentService = inject(StudentService);
  instructorService = inject(InstructorService);

  userId: string | number | null = null;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      try {
        //TODO: get role based on userId
        const userRole = Roles.STUDENT;
        this.getData(userRole, this.userId);
      } catch {
        this.frontNavigationService.navigate('/not-found');
      }
    } else {
      const userRole = this.frontAuthService.tokenPersonalizedData?.role;

      const isStudent = userRole === Roles.STUDENT;
      const isInstructor = userRole === Roles.INSTRUCTOR;
      const isManager = userRole === Roles.MANAGER;
      const isAdmin = userRole === Roles.ADMIN;

      if (!userRole || (!isStudent && !isInstructor && !isManager && !isAdmin)) {
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
          next: (result) =>
            this.handleProfile<StudentFindOneDefaultResponse>(result, Roles.STUDENT),
          error: () => this.frontNavigationService.navigate('/not-found'),
        });
        break;
      case Roles.INSTRUCTOR:
        this.instructorService.instructorFindOne({ id: userId }).subscribe({
          next: (result) =>
            this.handleProfile<InstructorFindOneDefaultResponse>(result, Roles.INSTRUCTOR),
          error: () => this.frontNavigationService.navigate('/not-found'),
        });
        break;
      default:
        //TODO Get user
        // this.userService.userFindOne({ id: userId }).subscribe({
        //   next: (result) =>
        //     this.handleProfile<UserFindOneDefaultResponse>(result, role),
        //   error: () => this.frontNavigationService.navigate('/not-found'),
        // });
        break;
    }
  }

  private handleProfile<T extends StudentFindOneDefaultResponse | InstructorFindOneDefaultResponse>(
    result: T,
    role: ProfileType,
  ) {
    const student = result as StudentFindOneDefaultResponse;
    const instructor = result as InstructorFindOneDefaultResponse;
    // const user = result as InstructorFindOneDefaultResponse;

    // TODO Remove
    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    const data = result.data as any;

    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */

    this.userData.set({
      firstname: data?.user?.last_name,
      lastname: data?.user?.first_name,
      email: data?.user?.email,
      phone: data?.user?.phone,
      birthday: data?.user?.birthday,
      campus: data?.user?.campus_id,

      ...(role === Roles.STUDENT && {
        program: String(student.data?.program_id),
        enrollmentYear: student.data?.enrollment_year,
        emergency_phone: student.data?.emergency_phone,
        emergency_contact: student.data?.emergency_contact,
        address: student.data?.address,
        city: student.data?.city,
        zipCode: student.data?.zip_code,
      }),

      ...(role === Roles.INSTRUCTOR && {
        department: String(instructor.data?.department_id),
        hire_date: instructor.data?.hire_date,
        specialization: String(instructor.data?.specialization_id),
      }),
    });

    this.userType.set(role);
  }
}
