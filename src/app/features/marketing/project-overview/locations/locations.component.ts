/// <reference types="googlemaps" />
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { ViewChild, ElementRef, NgZone } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { environment } from "../../../../../environments/environment";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { MouseEvent } from "@agm/core";
import { MapsAPILoader } from "@agm/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class LocationsComponent implements OnInit, OnDestroy {
  @ViewChild("search", { static: false }) public searchElement: ElementRef;
  @Input("projectId") projectId;

  accrdingImgUrl: string =
    window.location.origin +
    "/" +
    environment.CONTEXT_PATH +
    "assets/images_new/icons/accordin-collapse.svg";
  deleteImgUrl: string =
    window.location.origin +
    "/" +
    environment.CONTEXT_PATH +
    "assets/images_new/icons/trash-sm.svg";
  projectHighlightsList: any = [];
  projectAdditionalHighlights: any = [];
  protected map: any;
  LocationList = {
    locationId: 0,
    projectId: null,
    googleLocation: null,
    latitude: null,
    longitude: null,
  };
  lat: number = 51.678418;
  lng: number = 7.809007;

  highLightsList = {
    phId: 0,
    projectId: null,
    phStatus: null,
    projectHighlightsList: [
      {
        phId: 0,
        phName: null,
        phDescription: null,
        phTitle: null,
        phStatus: 1,
      },
    ],
    projectAdditionalHighlights: [
      {
        pahId: 0,
        projectId: null,
        pahTitle: null,
        pahDescription: null,
        pahStatus: 1,
      },
    ],
  };

  highLightsPhTitles = [
    "Railway Station",
    "Bus Depot",
    "Mall",
    "School",
    "Restaurants",
    "Medical Center",
    "Airport",
    "Commercial Hub",
  ];
  highLightsListArray: any = [];
  additionalHighLightsListArray: any = [];
  locationSubmit: boolean;
  projectName: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}
  // public latitude: number;
  // public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  ngOnInit() {
    this.locationSubmit = false;
    this.getLocationList();
    this.getHighlightList();
    this.getAdditionalHightLight();

    // this.mapsAPILoader.load().then(
    // () => {
    // let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });

    // autocomplete.addListener("place_changed", () => {
    // this.ngZone.run(() => {
    // let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    // if(place.geometry === undefined || place.geometry === null ){
    // return;
    // }
    // });
    // });
    // }
    // );

    //set current position
    //this.setCurrentPosition();

    //load Places Autocomplete
    //  this.mapsAPILoader.load().then(() => {
    //  let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
    //  //types: ["address"]
    //  });
    //  autocomplete.addListener("place_changed", () => {
    //  this.ngZone.run(() => {
    //  //get the place result
    //  let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //  //verify result
    //  if (place.geometry === undefined || place.geometry === null) {
    //  return;
    //  }

    //  //set latitude, longitude and zoom
    //  this.lat = place.geometry.location.lat();
    //  this.lng = place.geometry.location.lng();
    //  this.zoom = 12;

    //  this.markers.lat = place.geometry.location.lat();
    //  this.markers.lng = place.geometry.location.lng();

    //  this.LocationList.latitude = place.geometry.location.lat();
    //  this.LocationList.longitude = place.geometry.location.lng();
    //  });
    //  });
    //  });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  markers: marker = {
    lat: null,
    lng: null,
    label: "",
    draggable: true,
  };

  getLocationList() {
    let body = new URLSearchParams();
    body.append("projectId", this.projectId);
    // body.append('webOrMob',this.webOrMob);
    let data = {
      projectId: this.projectId,
    };

    this.apiService
      .getDataInputValue("user/projectLocation", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.LocationList = res;
        this.projectName = res.projectName;
        if (this.LocationList.latitude && this.LocationList.longitude) {
          this.markers = {
            lat: parseFloat(this.LocationList.latitude),
            lng: parseFloat(this.LocationList.longitude),
            draggable: true,
          };
          if (this.map) {
            this.map.setCenter({
              lat: parseFloat(this.LocationList.latitude),
              lng: parseFloat(this.LocationList.longitude),
            });
          }
        }
      });
  }

  getHighlightList() {
    let body = new URLSearchParams();
    body.append("projectId", this.projectId);
    // body.append('webOrMob',this.webOrMob);
    let data = {
      projectId: this.projectId,
      pageNumber: 0,
      pageSize: 100,
    };
    this.apiService
      .getDataInputValue("user/projectHighlight", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.highLightsList = res.content;
        this.projectHighlightsList = this.highLightsList;
        this.highLightsListArray = this.highLightsList;
        // this.additionalHighLightsListArray = this.highLightsList.projectAdditionalHighlights;
      });
  }
  getAdditionalHightLight() {
    let data = {
      projectId: this.projectId,
      pageNumber: 0,
      pageSize: 100,
    };
    this.apiService
      .getDataInputValue("user/projectAdditionalHighlight", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.additionalHighLightsListArray = res.content;
        this.projectAdditionalHighlights = this.additionalHighLightsListArray;
      });
  }
  addHighlights(phTitle) {
    var newHighlight = {
      id: 0,
      name: null,
      description: null,
      title: phTitle,
    };
    this.projectHighlightsList.push(newHighlight);
    this.highLightsListArray = this.projectHighlightsList;
  }

  RemoveHighlights(index, highlightItem) {
    if (highlightItem.id) {
      DeleteConfirmationComponent.showConfirmation(
        this.dialog,
        "Confirmation",
        "Are you sure you want to delete this highlight?",
        "Delete",
        "Cancel"
      ).subscribe((result) => {
        if (result.result) {
          let body = new URLSearchParams();
          body.append("id", highlightItem.id);
          this.apiService
            .postDataNotJSON(
              "sales/projectHighlight/delete?id=" + highlightItem.id,
              ""
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              // if (res["status"] == 1) {
              this.projectHighlightsList.splice(index, 1);
              AlertComponent.showAlert(
                this.dialog,
                "",
                "Highlights removed"
              ).subscribe((result) => {});
              // }
              this.getHighlightList();
            });
        }
      });
    } else {
      this.projectHighlightsList.splice(index, 1);
    }
  }

  addAdditionalHighlights() {
    var newAdditionalHighlight = {
      id: null,
      title: null,
      description: null,
    };
    this.projectAdditionalHighlights.push(newAdditionalHighlight);
    this.additionalHighLightsListArray = this.projectAdditionalHighlights;
  }

  RemoveAdditionalHighlights(index, highlightItem) {
    if (highlightItem.id) {
      DeleteConfirmationComponent.showConfirmation(
        this.dialog,
        "Confirmation",
        "Are you sure you want to delete this additional highlight?",
        "Delete",
        "Cancel"
      ).subscribe((result) => {
        if (result.result) {
          let body = new URLSearchParams();
          body.append("pahId", highlightItem.id);
          this.apiService
            .postDataNotJSON(
              "sales/projectAdditionalHighlight/delete?id=" + highlightItem.id,
              ""
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              // if (res["status"] == 1) {
              this.projectAdditionalHighlights.splice(index, 1);
              AlertComponent.showAlert(
                this.dialog,
                "",
                "Additional highlights removed"
              ).subscribe((result) => {});
              // }
              this.getAdditionalHightLight();
            });
        }
      });
    } else {
      this.projectAdditionalHighlights.splice(index, 1);
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }
  hideRow(title): boolean {
    return this.highLightsListArray.some((res) => res.title == title);
  }
  saveHighlights() {
    // this.locationSubmit = true;
    // let body = new URLSearchParams();
    // body.append('id', this.projectId);
    // // body.append('locationId', this.LocationList.locationId.toString());
    // body.append('latitude',this.LocationList.latitude);
    // body.append('longitude',this.LocationList.longitude);
    // body.append('googleLocation',this.LocationList.googleLocation);
    // body.append('projectName','test');
    let data = {
      googleLocation: this.LocationList.googleLocation,
      latitude: this.LocationList.latitude,
      longitude: this.LocationList.longitude,
      projectName: this.projectName,
    };
    this.apiService
      .postData(
        "sales/projectLocation/saveOrUpdate?projectId=" + this.projectId,
        data
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.projectHighlightsList.length > 0) {
          let postData = {
            projectHighlightses: this.projectHighlightsList,
          };
          this.apiService
            .postData(
              "sales/projectHighlight/saveAll?projectId=" + this.projectId,
              this.projectHighlightsList
            )
            .subscribe((res) => {
              // if (res["status"] == 1) {
              //AlertComponent.showAlert(this.dialog, "", "Location details saved successfully!!").subscribe(result => { });
              // this.tabId = 3;
              // this.getDownloads();
              // } else {
              //     AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
              // }
            });
        }
        if (this.projectAdditionalHighlights.length > 0) {
          let postData2 = {
            id: this.projectId,
            projectAdditionalHighlights: this.projectAdditionalHighlights,
          };

          this.apiService
            .postData(
              "sales/projectAdditionalHighlight/saveAll?projectId=" +
                this.projectId,
              this.projectAdditionalHighlights
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              // if (res["status"] == 1) {
              //AlertComponent.showAlert(this.dialog, "", "Location details saved successfully!!").subscribe(result => { });
              // this.tabId = 3;
              // this.getDownloads();
              // } else {
              //     AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
              // }
            });
        }
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Location details saved successfully!!"
        ).subscribe((result) => {});
        this.locationSubmit = false;
      });
  }
  mapReady(map) {
    this.map = map;
    if (this.LocationList.latitude && this.LocationList.longitude) {
      this.map.setCenter({
        lat: parseFloat(this.LocationList.latitude),
        lng: parseFloat(this.LocationList.longitude),
      });
    }
  }

  //(markerClick)="clickedMarker(markers.label, i)" --changed 107
  // clickedMarker(label: string, index: number) {
  clickedMarker(label: string) {}

  mapClicked($event: MouseEvent) {
    this.markers = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    };
    this.LocationList.latitude = $event.coords.lat;
    this.LocationList.longitude = $event.coords.lng;
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    if (this.map) {
      this.map.setCenter({ lat: $event.coords.lat, lng: $event.coords.lng });
    }
    this.LocationList.latitude = $event.coords.lat;
    this.LocationList.longitude = $event.coords.lng;
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
