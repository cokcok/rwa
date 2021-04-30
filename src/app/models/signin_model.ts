export interface employee{
    emp_code:string,
    emp_name:string,
    dept_id:number,
    dept_name:string,
    timein:string,
    timeout:string,
    gps:gps[],
  }


  export interface gps{
    lon:string,
    lat:string,

  }
