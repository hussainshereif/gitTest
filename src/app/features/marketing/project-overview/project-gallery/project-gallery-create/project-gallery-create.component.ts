import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { HelperService } from "../../../../../../app/commonservice/common/helper.service";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-gallery-create",
  templateUrl: "./project-gallery-create.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class GalleryCreateComponent implements OnInit {
  addFormImage: FormGroup;
  addFormVideo: FormGroup;
  bgValidation = { valid: true, insize: true };
  bodyFormdata: FormData = new FormData();
  defCaptions: any;
  file_number: number;
  fileName: any;
  fileUrl: any;
  filtereddefCaptions: any[];
  isBig: boolean;
  isImage: number[] = [];
  selectedtab: string;
  shownList = [
    { Value: "1", Text: "Construction Progress", selected: false },
    { Value: "2", Text: "Gallery", selected: false },
  ];

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GalleryCreateComponent>,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.selectedtab = "gtab1";
    this.addFormImage = this.createImageFormGroup();
    this.addFormVideo = this.createVideoormGroup();
    if (this.data.gallery) this.getEditData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addImageDetails(): void {
    this.addFormData(this.addFormImage);
  }

  public addVideoDetails(): void {
    this.addFormData(this.addFormVideo);
  }

  public filterData(event: any): void {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.defCaptions.length; i++) {
      let country = this.defCaptions[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filtereddefCaptions = filtered;
  }

  public onShowInChange(e): void {
    this.getCaptions(e);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public uploadFile(fileInput: any = null): void {
    let file = fileInput.target.files[0].name.split(".").pop();
    this.fileUrl = fileInput.target.files[0];
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.bgValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        if (this.bodyFormdata.has("file")) this.bodyFormdata.delete("file");
        this.bodyFormdata.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this.fileName = fileInput.target.files[0].name;
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.bgValidation = message;
            if (this.bgValidation.insize == false) {
              this.isBig = true;
            }
          });
      }
      this.isBig = false;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  public onSubmit(formData, id): void {
    if (id) {
      this.apiService
        .postDataMultipartRaw("sales/projectGallery/update/" + id, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          this.showAlerMessage("Gallery updated successfully!!");
        });
    } else {
      this.apiService
        .postDataMultipartRaw("sales/projectGallery", formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          this.showAlerMessage("Gallery saved successfully!!");
        }),
        (err) => {};
    }
  }

  private addFormData(form): void {
    form.value.submitted = 1;
    if (form.invalid) return;
    let formData: FormData = new FormData();
    formData.append("projectId", this.data.projectId);
    formData.append("tagLine", form.value.tagLine);
    if (
      form.value.caption == "" ||
      form.value.caption == null ||
      form.value.caption == "undefined"
    ) {
      formData.append("caption", "");
    } else {
      formData.append("caption", form.value.caption);
    }
    if (form.value.showIn == "1") {
      formData.append("galleryType", "Construction Progress");
    } else {
      formData.append("galleryType", "Gallery");
    }
    if (this.selectedtab == "gtab2") {
      formData.append("url", form.value.videoUrl);
    } else {
      if (this.bodyFormdata.has("file"))
        formData.append("file", this.bodyFormdata.get("file"));
    }
    this.onSubmit(formData, form.value.id);
  }

  private imagesController(fileparam, fileurl): void {
    if (fileurl) this[fileparam] = fileurl.split("/").pop();
    if (this.bodyFormdata.has(fileparam)) {
      this.bodyFormdata.append(fileparam, this.bodyFormdata.get(fileparam));
    } else {
      if (this[fileparam] != undefined) {
        this.helperService.urlToFile(fileurl).then((res) => {
          this.bodyFormdata.append(fileparam, res, res.name);
        });
      }
    }
  }

  private getEditData() {
    if (this.data.gallery.urlType == "VIDEO") {
      this.selectedtab = "gtab2";
      this.addFormVideo.patchValue(this.data.gallery);
      this.addFormVideo.patchValue({
        showIn:
          this.data.gallery.galleryType == "CONSTRUCTION_PROGRESS" ? 1 : 2,
        videoUrl: this.data.gallery.url,
      });
      this.getCaptions(this.addFormVideo.value.showIn);
    } else {
      this.selectedtab = "gtab1";
      this.addFormImage.patchValue(this.data.gallery);
      this.addFormImage.patchValue({
        showIn:
          this.data.gallery.galleryType == "CONSTRUCTION_PROGRESS" ? 1 : 2,
      });
      this.imagesController("file", this.data.gallery.url);
      this.fileName = this.data.gallery.fileName;
      this.getCaptions(this.addFormImage.value.showIn);
    }
  }

  private getCaptions(showInData): void {
    var galleryType = showInData == "1" ? "Construction Progress" : "Gallery";
    let data = {
      projectId: this.data.projectId,
      galleryType: galleryType,
    };
    this.apiService
      .getDataInputValue("user/projectGallery/captions", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.defCaptions = resp;
      });
  }

  private showAlerMessage(msg): void {
    AlertComponent.showAlert(this.dialog, "", msg).subscribe((result) => {
      this.dialogRef.close();
    });
  }

  createImageFormGroup() {
    return this.formBuilder.group({
      id: [""],
      tagLine: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      caption: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      showIn: ["", [Validators.required]],
      galleryType: [""],
      submitted: [""],
    });
  }

  createVideoormGroup() {
    return this.formBuilder.group({
      id: [""],
      videoUrl: [
        "",
        [
          Validators.required,
          Validators.pattern("^(https?://)?(www.youtube.com|youtu.?be)/.+$"),
        ],
      ],
      tagLine: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      caption: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      showIn: ["", [Validators.required]],
      galleryType: [""],
      submitted: [""],
    });
  }
}
