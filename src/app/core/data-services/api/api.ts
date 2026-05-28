export * from './app.service';
import { AppService } from './app.service';
export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './instructor.service';
import { InstructorService } from './instructor.service';
export * from './student.service';
import { StudentService } from './student.service';
export const APIS = [AppService, AuthenticationService, InstructorService, StudentService];
