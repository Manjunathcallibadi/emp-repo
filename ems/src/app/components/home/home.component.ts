import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'employee_name', 'employee_salary', 'employee_age', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;


  empdata: any;
  empdataparsed: any;
norecords:any;

  constructor(private mainService: MainService,private router:Router,public dialog: MatDialog) { }


  ngOnInit(): void {
    this.getEmployeeDetails();
  }


  getEmployeeDetails() {
    //get data from local storage
    this.empdata = this.mainService.getEmployeeData();
    this.empdataparsed = JSON.parse(this.empdata);
    if(this.empdataparsed == null){
      this.norecords = 0;
    }
    //assigned parsed data to table dataSource
    this.dataSource = new MatTableDataSource(this.empdataparsed);
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource.sort = this.sort;

  }


  // open dialog for adding new employee
  addEmployee() {
    // to open dialog
    const dialogRef = this.dialog.open(DialogAddEmployeeDialog, {
      width: '250px'
    });

    // toclose dialog
    dialogRef.afterClosed().subscribe(result => {
      this.getEmployeeDetails();
    });
  }

  // open dialog for editing employee
  onEdit(selectedEmployee: any) {

    const dialogRef = this.dialog.open(DialogEditEmployeeDialog, {
      width: '250px',
      data: selectedEmployee,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEmployeeDetails();
    });

  }

// to logout
  logout(){
    this.router.navigate(['login']);
  }

}

// component for Adding new employee
@Component({
  selector: 'dialog-add-employee-dialog',
  templateUrl: 'dialog-add-employee-dialog.html',
  styleUrls: ['./home.component.css']
})
export class DialogAddEmployeeDialog {
  addForm: FormGroup;
  empData: any;
  constructor(private fb: FormBuilder, private mainService: MainService,private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogAddEmployeeDialog>,

  ) {
    this.addForm = fb.group({
      id: ['', Validators.required],
      employee_name: ['', Validators.required],
      employee_salary: ['', Validators.required],
      employee_age: ['', Validators.required],
    });

  }

  // function to save new employee details
  saveEmployee() {
    // taking local storage data
    this.empData = this.mainService.getEmployeeData();
    let parsedData = JSON.parse(this.empData);

    // generating new id for new employee
    this.addForm.controls['id'].setValue(parsedData.length + 1);

    if(this.addForm.valid){

      parsedData.push(this.addForm.value);
      this.mainService.updateEmployeeData(JSON.stringify(parsedData));
      this.toastr.success('Employee added successfully!');
      this.dialogRef.close();
    }
  
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  id: string;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
}

// component for editing employee

@Component({
  selector: 'dialog-edit-employee-dialog',
  templateUrl: 'dialog-edit-employee-dialog.html',
  styleUrls: ['./home.component.css']
  
})
export class DialogEditEmployeeDialog {
  editForm: FormGroup;
  empData: any;
  constructor(private fb: FormBuilder, private mainService: MainService,private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogEditEmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.editForm = fb.group({
      id: [this.data.id],
      employee_name: [this.data.employee_name, Validators.required],
      employee_salary: [this.data.employee_salary, Validators.required],
      employee_age: [this.data.employee_age, Validators.required],

    });

  }

  // function for editing employee
  editEmployee() {
    if(this.editForm.valid){
      this.empData = this.mainService.getEmployeeData();
      let parsedData = JSON.parse(this.empData);
  
      for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id == this.editForm.get('id')?.value) {
          parsedData[i] = this.editForm.value;
        }
      }
  
      this.mainService.updateEmployeeData(JSON.stringify(parsedData));
      this.toastr.success('Employee edited successfully!');

      this.dialogRef.close();
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }
}
