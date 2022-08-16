import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  public contentTypeList = [
    { Value: "IMAGE", Text: "Image", selected: true },
    { Value: "Video", Text: "Video", selected: false },
    { Value: "PDF", Text: "PDF", selected: false },
    { Value: "WEBSITE", Text: "Link", selected: false },
  ];
  public imageType = [".jpg", ".jpeg", ".png"];
  public pfdType = [".pdf"];
  public videoType = [".mp4", ".x-m4v"];

  uploadType: string[];

  public formatDate(date: string | number | Date, format: string): string {
    return formatDate(date, format, "en-IN");
  }

  public getFileName(filePath): string {
    let path = filePath?.split("/");
    let fileName = path[path.length - 1];
    return fileName;
  }

  public onContentTypeChange(e): string[] {
    switch (e) {
      case "PDF":
        this.uploadType = this.pfdType;
        break;
      case "Image":
        this.uploadType = this.imageType;
        break;
      default:
        this.uploadType = this.videoType;
        break;
    }
    return this.uploadType;
  }

  public getFormData(formData, addForm, bodyFormdata): FormData {
    if (addForm.value.id) formData.append("id", addForm.value.id);
    formData.append("title", addForm.value.title);
    formData.append("description", addForm.value.description);
    formData.append("contentType", addForm.value.contentType);
    if (addForm.value.contentType == "WEBSITE")
      formData.append("link", addForm.value.link);
    if (bodyFormdata.has("content"))
      formData.append("content", bodyFormdata.get("content"));
    if (bodyFormdata.has("thumbnailImage")) {
      formData.append("thumbnailImage", bodyFormdata.get("thumbnailImage"));
    }
    return formData;
  }
  async urlToFile(url: any) {
    let fileName = url.split("/").pop();
    let typeName = "image/" + url.split(".").pop();
    let fetchUrl = await fetch(url);
    let content = await fetchUrl.blob();
    let fileInput = new File([content], fileName, {
      type: typeName,
      lastModified: Date.now(),
    });
    return fileInput;
  }
}
