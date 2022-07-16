import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



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

  empdata: any;
  empdataparsed: any;

  constructor(private mainService: MainService, public dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.getEmployeeData();
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
    
  }

  onSelectEdit(a:any){
  

  }

}
