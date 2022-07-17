import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  empData:any;

  getEmployeeUrl = "http://dummy.restapiexample.com/api/v1/employees";

  constructor(private http:HttpClient) { }

  loadEmployeeData(){
   return this.http.get(this.getEmployeeUrl);
  }

  getEmployeeData(){
    let data = localStorage.getItem('empData');
    return data;
  }
  updateEmployeeData(stringEmpObj:any){
    localStorage.setItem("empData",stringEmpObj);
  }
}
// local storage limited to handle only string key/value pairs.
// you can do like below using JSON.stringify and while getting value JSON.parse
