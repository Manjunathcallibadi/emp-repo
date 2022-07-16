import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'salary', 'age', 'actions'];
  dataSource = new MatTableDataSource();

  
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  empdata: any;
  empdataparsed: any;

  constructor(private mainService: MainService, public dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.getEmployeeData();
    this.dataSource.sort = this.sort;

    const sortState: Sort = {active: 'name', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  getEmployeeData(){
    //get data from local storage
    this.empdata = this.mainService.getEmployeeData();
    this.empdataparsed = JSON.parse(this.empdata);

    //assigned parsed data to table dataSource
    this.dataSource = new MatTableDataSource(this.empdataparsed);
    this.dataSource.paginator = this.tableOnePaginator;
  }


  add(){
    const dialogRef = this.dialog.open(DialogAddEmployeeDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getEmployeeData();
    });
  }

  onSelectEdit(a:any){
    const dialogRef = this.dialog.open(DialogEditEmployeeDialog, {
      width: '250px',
      data: a,
    });

    dialogRef.afterClosed().subscribe(result => {
     this.getEmployeeData();
    });

  }

}

// component for Adding new employee
@Component({
  selector: 'dialog-add-employee-dialog',
  templateUrl: 'dialog-add-employee-dialog.html',
})
export class DialogAddEmployeeDialog {
  addForm: FormGroup;
  empData: any;
  constructor(private fb: FormBuilder, private mainService: MainService,
    public dialogRef: MatDialogRef<DialogAddEmployeeDialog>,
    
  ) {
    this.addForm = fb.group({
      id:['',Validators.required],
      employee_name: ['', Validators.required],
      employee_salary: ['', Validators.required],
      employee_age: ['', Validators.required],
    });

  }

  save(){
    this.empData = this.mainService.getEmployeeData();
    let parsedData = JSON.parse(this.empData);
    this.addForm.controls['id'].setValue(parsedData.length + 1);
    parsedData.push(this.addForm.value);
    this.mainService.updateEmployeeData(JSON.stringify(parsedData));
    this.dialogRef.close();
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
})
export class DialogEditEmployeeDialog {
  editForm: FormGroup;
  empData: any;
  constructor(private fb: FormBuilder, private mainService: MainService,
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

  save() {
    console.log("Edited data====>", this.editForm.value);

    this.empData = this.mainService.getEmployeeData();
    let parsedData = JSON.parse(this.empData);
    console.log("local data", parsedData);

    for (let i = 0; i < parsedData.length; i++) {
      if (parsedData[i].id == this.editForm.get('id')?.value) {
        parsedData[i] = this.editForm.value;
      }
    }

    this.mainService.updateEmployeeData(JSON.stringify(parsedData));
    this.dialogRef.close();

    // localStorage.setItem('empData',JSON.stringify(parsedData));
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
