import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RwaConfigService } from '../sv/rwa-config.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment_ from 'moment';
import 'moment/locale/th';
const moment = moment_;

@Component({
  selector: 'app-rwa01',
  templateUrl: './rwa01.page.html',
  styleUrls: ['./rwa01.page.scss'],
})
export class Rwa01Page implements OnInit {
  ionicForm: FormGroup; sub: Subscription;
  isSubmitted = false; vlat: any; vlon: any; vplf: any; vdevice: any;
  versionNumber: string | number;
  vip:any;vip2:any; deviceInfo:any; ipAddress:string;
  emp_name:string;dept_name:string;dept_id:number;img:string;
  datagps =[];
  constructor(public formBuilder: FormBuilder, public menuCtrl: MenuController, private navCtrl: NavController, private geolocation: Geolocation, public configSv: RwaConfigService,  public plf: Platform, private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    this.vplf = this.plf.platforms();
    this.ionicForm = this.formBuilder.group({
      server_time: ["", [Validators.required]],
      username: ['2428', [Validators.required]],
      password: ['12022507', [Validators.required]],

    });
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.vlat = resp.coords.latitude;
      this.vlon = resp.coords.longitude;
      //console.log(resp,'eee');
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // console.log(data);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });


    setInterval(() => { this.GetDateTime() }, 1000);

    this.epicFunction();this.getIP();
  }

  GetDateTime() {
    this.ionicForm.controls["server_time"].setValue(moment().format('DD/MM/YYYY H:mm:ss'));
  }

  epicFunction() {
    //console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    //this.vdevice = this.deviceInfo;
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

  getIP()
  {
    this.configSv.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
    });
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      this.sub = this.configSv.signin(this.ionicForm.value).subscribe(
        (data) => {
          if (data !== null){
            //console.log(data);
            //let x = this.distance(105.262752,15.829187,105.380678,15.828063,'K')
            //let x = this.distance(51.525,7.4575,51.5175,7.4678,'K')
            let x = this.distance(this.vlat,this.vlon,51.5175,7.4678,'K')
           // console.log(x);
            //this.data = data['employee'][0]['emp_name'];
            this.emp_name = data['employee'][0]['emp_name'];
            this.dept_id = data['employee'][0]['dept_id'];
            this.dept_name = data['employee'][0]['dept_name'];
            this.img = "http://10.99.70.35:8080/"+ data['employee'][0]['emp_code'] +".jpg"
            this.datagps = data['employee'][0]['gps'];
            console.log(data);

          }
          else
          {
            setTimeout(() => {
            this.configSv.ChkformAlert('ไม่พบข้อมูล/รหัสผ่านไม่ถูกต้อง');
            }, 2100);
          }
        },(error) => {
          console.log(JSON.stringify(error));
          //loader.dismiss();
        }
        );
    }
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    const aux: any = document.getElementsByTagName('META');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < aux.length; i++) {
      if (aux[i].name === 'version') {
        this.versionNumber = aux[i].content;
      }
    }
    //this.configSv.stopidle();
  }


   distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

}
