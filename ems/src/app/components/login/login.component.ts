import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg:any;
  empData:any;

  constructor(private fb: FormBuilder,private router:Router,private mainService:MainService) { 
    this.loginForm = fb.group({
      employee_id:['',Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login(){
    if(this.loginForm.get('employee_id')?.value == "MN123"){
         this.router.navigate(['home']);
    }else{
      this.errorMsg = "Please enter valid employee id"
    }
  }

}
