// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {User} from '../components/admin/calendar/User';
// import {Reservation} from '../components/admin/calendar/Reservation';
//
// @Injectable({providedIn: 'root'})
// export class UserService {
//   api = '/api/users/';
//
//   constructor(private http: HttpClient) {
//   }
//
//   getFilteredUsers(value?: string) {
//     if(value === '') {
//       return this.http.get<User[]>(this.api + 'getFilteredUsers');
//     }else {
//       return this.http.get<User[]>(this.api + 'getFilteredUsers/' + value);
//     }
//   }
//
//   updateReservation(userRequest: {
//     firstName: string;
//     lastName: string;
//     country: string;
//     phoneNumber: string;
//     reservations: Array<Reservation>;
//     city: string;
//     streetAddress: string | undefined;
//     carRegistration: string | undefined;
//     id: number;
//     email: string
//   }) {
//     return this.http.patch<User>(this.api + 'updateUser/' + userRequest.id, userRequest)
//
//   }
//
//   getAllUsers() {
//     return this.http.get<User[]>(this.api + 'getAll')
//   }
//   getUserById(id: number){
//     return this.http.get<User>(this.api + 'getUser/' + id.toString())
//   }
//
//   deleteUserById(id: number) {
//     return this.http.delete(this.api + 'delete/' + id.toString())
//   }
// }
