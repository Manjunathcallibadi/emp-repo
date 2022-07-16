import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  empData:any;

  getEmployeeUrl = "http://dummy.restapiexample.com/api/v1/employees";

  constructor(private http:HttpClient) {
     this.loadEmployeeData();
   }

  loadEmployeeData(){
    this.http.get(this.getEmployeeUrl).subscribe(res =>{
      this.empData = res;
      const jsonEmpObj =  JSON.stringify(this.empData.data);
      localStorage.setItem("empData",jsonEmpObj);
    },error =>{
      console.log(error);
    });
  }

  getEmployeeData(){
    let data = localStorage.getItem('empData');
    return data;
  }
 
}
