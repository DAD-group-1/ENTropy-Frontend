export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './instructor.service';
import { InstructorService } from './instructor.service';
export * from './student.service';
import { StudentService } from './student.service';
export const APIS = [AuthenticationService, InstructorService, StudentService];
