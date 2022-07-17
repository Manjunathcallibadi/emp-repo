import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg:any;

  constructor(private fb: FormBuilder,private router:Router) { 
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
