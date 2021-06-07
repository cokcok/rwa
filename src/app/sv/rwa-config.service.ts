import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {data, data_detail} from '../models/data_model';
import { FeedBack } from '../models/feedback';
import {employee} from '../models/signin_model';

import { AlertController, LoadingController,NavController } from '@ionic/angular';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
@Injectable({
  providedIn: 'root'
})
export class RwaConfigService {
  public ip:string = "https://appcen01.rubber.co.th/ws_rwa/";
  //public ip: string = "https://www.rubber.co.th/gir/sc/";
  idleState = 'Not started.';timedOut = false;lastPing?: Date = null;
  constructor(private http: HttpClient,private loadingController: LoadingController,private alertCtrl: AlertController,private idle: Idle, private keepalive: Keepalive,private navCtrl: NavController) { }

  async loadingAlert(dur:number) {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'กรุณารอสักครู่ กำลังโหลดข้อมูล...',
      duration: dur
    });
    return await loading.present();

   // return loading;
  }

  async ChkformAlert(text:string){
    const alert = await this.alertCtrl.create({
      message: text,
      buttons: ['ตกลง']
      });
      return await alert.present();
  }

  chkidle(){
    //console.log('aaa');
    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      //this.ChkformAlert('session_timeout');
    });
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.resetidle();
      console.log(this.idleState);
      //this.navCtrl.navigateForward('/rwa01');
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
    this.timedOut = false;

  }

  stopidle(){
    this.idle.timeout();
  }

  getIPAddress()
  {
    return this.http.get("https://api.ipify.org/?format=json");
  }


  signin(vdata:any, token?): Observable<employee> {
    const header = { 'Content-Type': 'application/json' };
    //const apiUrl = this.ip + 'rwa_web.php';
    const apiUrl = this.ip + 'rwa01.php';
    // let dept_id = null;
    // if(typeof vdata.dept.dept_id !== undefined){
    //   dept_id = vdata.dept.dept_id;
    // }
    // console.log(dept_id);
    let data = {
      'server_time': vdata.server_time,
      'username': vdata.username,
      'password': vdata.password,
      'check_type' : vdata.check_type.id,
      'dept_id' : vdata.dept.dept_id ,
      'type_sql': 'login',
      //'token': token,
    }
    return this.http.post<employee>(apiUrl, data, { headers: header });
  }

  getdept(): Observable<data> {
    const header = { 'Content-Type': 'application/json' };
    //const apiUrl = this.ip + 'rwa_web.php';
    const apiUrl = this.ip + 'getdept.php';
    let data;
    data = {
      'type_sql': 'read',

    }
    return this.http.post<data>(apiUrl, data, { headers: header });
  }


  crudrwa(vdata: any, type: string, cause?): Observable<FeedBack> {
    const header = { 'Content-Type': 'application/json' };
    const apiUrl = this.ip + 'rwa01.php';
    let data = {
      'empcode': vdata.empcode,
      'logtime': vdata.logtime,
      'nodeid': vdata.nodeid,
      'checktype': vdata.checktype,
      'dept_id': vdata.dept_id,
      'lat_wgs84': vdata.lat_wgs84,
      'lon_wgs84': vdata.lon_wgs84,
      'ip_address': vdata.ip_address,
      'browser': vdata.deviecinfo.browser,
      'browser_version': vdata.deviecinfo.browser_version,
      'device': vdata.deviecinfo.device,
      'devicetype': vdata.deviecinfo.devicetype,
      'orientation': vdata.deviecinfo.orientation,
      'os': vdata.deviecinfo.os,
      'os_version': vdata.deviecinfo.os_version,
      'useragent': vdata.deviecinfo.userAgent,
      'km':vdata.km,
      'wifiip': vdata.wifiip,
      'wifisubnet':vdata.wifisubnet,
      'carrierip':vdata.carrierip,
      'carriersubnet':vdata.carriersubnet,
      'problem_cause':vdata.problem_cause,
      'type_sql': 'insert',
    }


    return this.http.post<FeedBack>(apiUrl, data, { headers: header });
  }
}
