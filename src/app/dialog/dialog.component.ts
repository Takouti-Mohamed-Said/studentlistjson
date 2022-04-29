import { Component, Inject, OnInit } from '@angular/core';

import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  startDate = new Date(1980, 0, 1);
  gender!: string;
  studentForm !: FormGroup;
  actionBtn : string ="save";

  constructor(private formBuilder : FormBuilder ,
    private api : ApiService ,
    @Inject(MAT_DIALOG_DATA) public editData :any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      fName : ['',Validators.required],
      lName : ['',Validators.required],
      email : ['',Validators.required],
      bDay : ['',Validators.required],
      address : ['',Validators.required],
      tel : ['',Validators.required],
      city : ['',Validators.required],
      codepostal : ['',Validators.required],
      gender : ['',Validators.required],
    });

    if(this.editData){

      this.actionBtn="update";
      this.studentForm.controls['fName'].setValue(this.editData.fName);
      this.studentForm.controls['lName'].setValue(this.editData.lName);
      this.studentForm.controls['email'].setValue(this.editData.email);
      this.studentForm.controls['bDay'].setValue(this.editData.bDay);
      this.studentForm.controls['address'].setValue(this.editData.address);
      this.studentForm.controls['tel'].setValue(this.editData.tel);
      this.studentForm.controls['city'].setValue(this.editData.city);
      this.studentForm.controls['codepostal'].setValue(this.editData.codepostal);
      this.studentForm.controls['gender'].setValue(this.editData.gender);
    }
  }

  matcher = new MyErrorStateMatcher();
  genders: string[] = ['Male', 'Female','Animal'];
  addStudent(){
    console.log("from addStudent function");
    if(!this.editData){
      if(this.studentForm.valid){
        this.api.postStudent(this.studentForm.value)
        .subscribe({
          next:(res)=>{
            alert("Student added successfully")
           this.studentForm.reset();
           this.dialogRef.close('save');
          },
          error:()=>{
            alert('error while adding the student');
          }
        })
      }
    }else{
    this.updateStudent();
    }
  }
  updateStudent(){
    this.api.putStudent(this.studentForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert('Student updated Successfully')
        this.studentForm.reset();
        this.dialogRef.close('update');

      },
      error:()=>{
        alert('Error while updating the record §§')
      }
    })
  }
}
