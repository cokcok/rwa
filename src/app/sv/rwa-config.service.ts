import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { data } from '../models/data_model';
import { FeedBack } from '../models/feedback';
import {employee} from '../models/signin_model';
import { AlertController, LoadingController,NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class RwaConfigService {
  public ip:string = "http://appcen01.rubber.co.th/ws_rwa/";
  constructor(private http: HttpClient,private loadingController: LoadingController,private alertCtrl: AlertController) { }

  async loadingAlert(dur:number) {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'กำลังโหลดข้อมูล...',
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

  signin(vdata:any, token?): Observable<employee> {
    const header = { 'Content-Type': 'application/json' };
    const apiUrl = this.ip + 'rwa01.php';
    let data;
    data = {
      'server_time': vdata.server_time,
      'username': vdata.username,
      'password': vdata.password,
      'type_sql': 'login',
      //'token': token,
    }
    return this.http.post<employee>(apiUrl, data, { headers: header });
  }

  getIPAddress()
  {
    return this.http.get("http://api.ipify.org/?format=json");
  }
}
