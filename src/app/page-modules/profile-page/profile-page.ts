import { Component, inject } from '@angular/core';
import { Profile, ProfileData, ProfileType } from '../../shared-modules/app-common/profile/profile';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../shared-modules/service/navigation.service';

@Component({
  selector: 'app-profile-page',
  imports: [Profile],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  userData!: ProfileData;
  userType!: ProfileType;

  route = inject(ActivatedRoute);
  navigationService = inject(NavigationService);

  ngOnInit() {
    let userId: string | number | null = this.route.snapshot.paramMap.get('id');

    if (userId) {
      try {
        userId = Number(userId);

        //TODO: Call query based on userId
      } catch (e) {
        this.navigationService.navigate('/not-found');
      }

      //TODO: Fetch specific user data from backend using userId and populate userData and userType
      this.userData = {
        firstname: 'Emma',
        lastname: 'Martin',
        email: 'emma.martin@school.com',
        phone: '+33 6 12 34 56 78',
        birthday: '2003-04-18',
        campus: 'Strasbourg',

        program: 'Computer Science',
        enrollmentYear: 2023,
        emergency_contact: 'Paul Martin',
        emergency_phone: '+33 6 98 76 54 32',
        address: '12 Rue des Fleurs',
        city: 'Schiltigheim',
        zipCode: '67300',
      };

      this.userType = 'student'; //TODO
    } else {
      //TODO: Fetch user data based on logged user
      this.userData = {
        firstname: 'Lucas',
        lastname: 'Bernard',
        email: 'lucas.bernard@school.com',
        phone: '+33 6 11 22 33 44',
        birthday: '1985-09-12',
        campus: 'Strasbourg',

        department: 'Computer Science',
        hire_date: '2018-09-01',
        specialization: 'Software Engineering',
      };

      this.userType = 'instructor'; //TODO
    }
  }
}
