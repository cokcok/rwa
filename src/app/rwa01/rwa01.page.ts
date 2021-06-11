import { Component, OnInit } from '@angular/core';
import { MenuController, NavController,AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray  } from '@angular/forms';

import { Subscription } from 'rxjs';
import { RwaConfigService } from '../sv/rwa-config.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import * as moment_ from 'moment';
import 'moment/locale/th';
const moment = moment_;
import { IonicSelectableComponent } from 'ionic-selectable';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
@Component({
  selector: 'app-rwa01',
  templateUrl: './rwa01.page.html',
  styleUrls: ['./rwa01.page.scss'],
})
export class Rwa01Page implements OnInit {
  ionicForm: FormGroup; sub: Subscription;
  isSubmitted = false; vlat: any; vlon: any; vplf: any; vdevice: any;
  versionNumber: string | number;checktype:any;
  vip:any;vip2:any; deviceInfo:any; ipAddress:string;vkm:any;
  emp_code:string;emp_name:string;dept_name:string;dept_id:number;img:string;
  datagps =[];timein:string;timeout:string;
  gpsplacelon:any; gpsplacelat:any;
  portControl_checktype: FormControl; ports_checktype: any;
  portControl_dept: FormControl; ports_dept: any;
  wifiip:any; wifisubnet:any;carrierip:any;carriersubnet:any;
  idleState = 'Not started.';timedOutidle = false;lastPing?: Date = null;
  setkm:number = 0.100;
  dontchkgps = ['2','3'];
  constructor(public formBuilder: FormBuilder, public menuCtrl: MenuController, private navCtrl: NavController, private geolocation: Geolocation, public configSv: RwaConfigService,  public plf: Platform, private deviceService: DeviceDetectorService,private idle: Idle, private keepalive: Keepalive,private iab: InAppBrowser,private networkInterface: NetworkInterface,
    private alertCtrl: AlertController) {
    this.chkidle();
  }

  ngOnInit() {
    //this.vplf = this.plf.platforms();
    this.portControl_checktype = this.formBuilder.control("", Validators.required);
    this.portControl_dept = this.formBuilder.control("");
    this.ionicForm = this.formBuilder.group({
      server_time: ["", [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      check_type: this.portControl_checktype,
      dept: this.portControl_dept,
      problem_cause: [''],
    });

    //2428 12022507
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //   this.vlat = resp.coords.latitude;
    //   this.vlon = resp.coords.longitude;
    //   //console.log(resp,'eee');
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // console.log(data);
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    // });


    setInterval(() => { this.GetDateTime() }, 1000);

    this.epicFunction();this.getIP();this.loaddata_checktype();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loaddata_checktype(){
    this.ports_checktype = [
      {id: '0',type: 'จากสำนักงาน'},
      {id: '1',type: 'ไปช่วยปฏิบัติงาน'},
      {id: '2',type: 'ไม่มี Smart Phone/ปัญหาอื่นๆ'},
      {id: '3',type: 'WFH'},
    ];
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.emp_name = null;
    if(event.value.id == '1'){
      this.ionicForm.get('dept').setValidators(Validators.required);
    }else{
      this.ionicForm.get('dept').setValidators(null);
    }
    this.ionicForm.get('dept').updateValueAndValidity();
  }



  submitForm() {
    this.isSubmitted = true;
    //console.log(this.ionicForm.value);
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      this.emp_name = null;
      return false;
    } else {
      this.configSv.loadingAlert(2000);
      this.sub = this.configSv.signin(this.ionicForm.value).subscribe(
        (data) => {
          if (data !== null){
            //console.log(data);
            //this.vkm = this.distance(100.467836986014,13.7716049981198,100.472836986015,13.7716049981199,'K')
            //let x = this.distance(51.525,7.4575,51.5175,7.4678,'K')
            //let x = this.distance(this.vlat,this.vlon,51.5175,7.4678,'K')
            //console.log(x);
            //this.data = data['employee'][0]['emp_name'];
            //console.log(this.vlat,this.vlon)
            this.emp_code = data['employee'][0]['emp_code'];
            this.emp_name = data['employee'][0]['emp_name'];
            this.dept_id = data['employee'][0]['dept_id'];
            this.dept_name = data['employee'][0]['dept_name'];
            //this.img = "http://10.99.70.35:8080/"+ data['employee'][0]['emp_code'] +".jpg"
            this.img = data['employee'][0]['pic'];
            this.datagps = data['employee'][0]['gps'];
            this.timein = data['employee'][0]['timein'];
            this.timeout = data['employee'][0]['timeout'];
            this.checktype = this.ionicForm.controls.check_type.value.id;
            //this.ionicForm.controls["username"].setValue(null);
            //this.ionicForm.controls["password"].setValue(null);
            //this.isSubmitted = false;
           // console.log(this.datagps);
           if(this.datagps){
            this.gpsplacelat = data['employee'][0]['gps'][0]['lat'];
            this.gpsplacelon = data['employee'][0]['gps'][0]['lon'];
           }else{
            this.gpsplacelat = undefined; this.gpsplacelon = undefined;
           }
           this.GetGPS(this.gpsplacelat, this.gpsplacelon);
           // this.vkm = this.distance(data['employee'][0]['gps'][0]['lat'],data['employee'][0]['gps'][0]['lon'],this.vlat,this.vlon,'K' );
          }
          else
          {
            setTimeout(() => {
            this.configSv.ChkformAlert('ไม่พบข้อมูล/รหัสผ่านไม่ถูกต้อง');
            }, 2100);
          }
        },(error) => {
          console.log(JSON.stringify(error));
          setTimeout(() => {
            this.configSv.ChkformAlert('ตรวจสอบการเชื่อมต่อ vpn');
            }, 2100);
        }
        );
    }
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
    this.loaddept();
  }

  loaddept(){
    this.sub = this.configSv
    .getdept()
    .subscribe((data) => {
      if (data !== null) {
        this.ports_dept = data.data_detail.map((item) => Object.assign({}, item));
      }
    });
  }

  async Checkinout(type){
    //console.log(this.ionicForm.value);
    //console.log(this.vlat,this.vlon);
    if ( typeof this.vlat === "undefined"  ){
      this.configSv.ChkformAlert('ไม่สามาถบันทึกได้ กรุณาดึงพิกัดใหม่');
      return false;
    }
    let data = {
      empcode :this.emp_code,
      logtime : this.ionicForm.controls.server_time.value,
      nodeid : type,
      checktype : this.checktype,
      dept_id : this.dept_id,
      lat_wgs84: this.vlat,
      lon_wgs84: this.vlon,
      ip_address : this.ipAddress,
      deviecinfo : this.deviceInfo,
      km : this.vkm,
      wifiip: this.wifiip,
      wifisubnet:this.wifisubnet,
      carrierip:this.carrierip,
      carriersubnet:this.carriersubnet,
      problem_cause:this.ionicForm.controls.problem_cause.value,
    };
    //console.log(data);
    if( (type === 1 && this.timein !== null) || (type === 2 && this.timeout !== null)  ){
      const confirm =  await this.alertCtrl.create({
        header: 'คุณต้องการยืนยันการลงเวลาซ้ำอีกใช่ไหม ??',
        buttons: [{
          text: 'ยกเลิก',
          handler: (data: any) => {
             //console.log('cancel ',data);
          }
        },
        {
          text: 'ยืนยัน',
            handler: () => {
              this.sub = this.configSv.crudrwa(data,'insert').subscribe(
                (data) => {
                  if (data !== null){
                    this.configSv.ChkformAlert(data.message);
                    if(type === 1){
                      this.timein  = this.ionicForm.controls.server_time.value
                    }else if(type === 2){
                      this.timeout = this.ionicForm.controls.server_time.value
                    }
                  }
                },(error) => {
                  console.log(JSON.stringify(error));
                  //loader.dismiss();
                });
          }
        }]
      });
      confirm.present();
    }else{
      this.sub = this.configSv.crudrwa(data,'insert').subscribe(
        (data) => {
          if (data !== null){
            this.configSv.ChkformAlert(data.message);
            if(type === 1){
              this.timein  = this.ionicForm.controls.server_time.value
            }else if(type === 2){
              this.timeout = this.ionicForm.controls.server_time.value
            }
          }
        },(error) => {
          console.log(JSON.stringify(error));
          //loader.dismiss();
        });
    }



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
      return dist.toFixed(3);
    }
  }




  get errorControl() {
    return this.ionicForm.controls;
  }


  GetDateTime() {
    this.ionicForm.controls["server_time"].setValue(moment().format('DD/MM/YYYY H:mm:ss'));
  }

  GetGPS(plat,plon){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.vlat = resp.coords.latitude;
      this.vlon = resp.coords.longitude;
      this.vkm = this.distance(plat,plon,this.vlat,this.vlon,'K' );
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  epicFunction() {
    //console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // //this.vdevice = this.deviceInfo;
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

  getIP()
  {
    this.configSv.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
    });

    this.networkInterface.getWiFiIPAddress()
    .then((address) => {
      this.wifiip = address.ip;
      this.wifisubnet = address.subnet;
    })
    .catch(error => console.error(`Unable to get IP: ${error}`));

  this.networkInterface.getCarrierIPAddress()
    //.then(address => console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
    .then((address) => {
      this.carrierip = address.ip;
      this.carriersubnet = address.subnet;
    })
    .catch(error => console.error(`Unable to get IP: ${error}`));



  }


  chkidle(){
    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(120);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      //this.ChkformAlert('session_timeout');
    });
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOutidle = true;
      this.resetidle();
      //console.log(this.idleState);
      //this.navCtrl.navigateForward('/folder/:2');
    });
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      //this.ChkformAlert('session_timeout');
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.resetidle();
   }

  resetidle() {
    this.idle.watch();
    this.timedOutidle = false;
    this.emp_name = null;
  }

  stopidle(){
    this.idle.timeout();
  }

  openmanual(){
    let url = this.configSv.ip + 'doc/manual_rwa.pdf';
    const browser = this.iab.create(url).show();
  }

  openmanual1(){
    let url = 'http://appcen01.rubber.co.th/wfh/index1.php';
    const browser = this.iab.create(url).show();
  }

  GetGPSwork(lat,lon){
    let url = 'https://maps.google.com/?q='+ lat +','+ lon +'';
    const browser = this.iab.create(url).show();
  }
}
