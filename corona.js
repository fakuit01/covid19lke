let param = args.widgetParameter

class CoronaWidget {

  constructor() {
    //this.apiUrl = (dateformat) => "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D${dateformat}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true"
    //this.apiUrl1 ="https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D20210126&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&outSR=102100&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true" 
    //this.apiUrl2 ="https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D20210127&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&outSR=102100&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true" 


    // https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,last_update,cases,cases7_per_100k&inSR=4326&spatialRel=esriSpatialRelWithin&returnGeometry=false&outSR=4326&f=json


    //https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/inzidenz_pro_woche/FeatureServer/0/query?where=1%3D1&outFields=datum,FID,inzidenz&inSR=4326&spatialRel=esriSpatialRelWithin&returnGeometry=false&outSR=4326&f=json"

    //this.urlInsidenz = "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/ArcGIS/rest/services/kreise_inzidenz_utm/FeatureServer/0/query?where=1%3D1&outFields=LANGNAME,Beschriftu,FID,inzidenz&inSR=4326&spatialRel=esriSpatialRelWithin&returnGeometry=false&outSR=4326&f=json"

    this.cities = {
      'Aichtal': 0,
      'Aichwald': 1,
      'Altbach': 2,
      'Altdorf': 3,
      'Altenriet': 4,
      'Baltmannsweiler': 5,
      'Bempflingen': 6,
      'Beuren': 7,
      'Bissingen an der Teck': 8,
      'Deizisau': 9,
      'Denkendorf': 10,
      'Dettingen unter Teck': 11,
      'Erkenbrechtsweiler': 12,
      'Esslingen am Neckar': 13,
      'Filderstadt': 14,
      'Frickenhausen': 15,
      'Großbettlingen': 16,
      'Hochdorf': 17,
      'Holzmaden': 18,
      'Kirchheim unter Teck': 19,
      'Kohlberg': 20,
      'Köngen': 21,
      'Leinfelden-Echterdingen': 22,
      'Lenningen': 23,
      'Lichtenwald': 24,
      'Neckartailfingen': 25,
      'Neckartenzlingen': 26,
      'Neidlingen': 27,
      'Neuffen': 28,
      'Neuhausen auf den Fildern': 29,
      'Notzingen': 30,
      'Nürtingen': 31,
      'Oberboihingen': 32,
      'Ohmden': 33,
      'Ostfildern': 34,
      'Owen': 35,
      'Plochingen': 36,
      'Reichenbach an der Fils': 37,
      'Schlaitdorf': 38,
      'Unterensingen': 39,
      'Weilheim an der Teck': 40,
      'Wendlingen am Neckar': 41,
      'Wernau': 42,
      'Wolfschlugen': 43,
    };
  }

  async run() {
    let widget = await this.createWidget()
    if (!config.runsInWidget) {
      await widget.presentSmall()
    }
    Script.setWidget(widget)
    Script.complete()
  }

  async createWidget() {

    var d = new Date();
    
    d.setDate(d.getDate() - 1);
    var hours = d.getHours().toString();
    if (hours.toString().length == 1) {
      hours = '0' + hours;
    }
    var minute = d.getMinutes().toString();
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    var lastupDated = hours + ":" + minute
    var day = (d.getDate() - 1);
    var month = (d.getMonth() + 1).toString();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    var year = d.getFullYear().toString();
    var dateformat = year + month + day.toString();
    let data2 = await this.getData1(dateformat)

    let list = new ListWidget()
    list.backgroundColor = Color.dynamic(Color.white(), Color.black())
    list.setPadding(0, 0, 0, 0)
    let textStack = list.addStack()
    textStack.setPadding(4, 4, 4, 4)
    textStack.layoutVertically()
    textStack.topAlignContent()

    if (data2.error) {//gestern
      day = (d.getDate() - 2);
      dateformat = year + month + (day).toString();
      data2 = await this.getData1(dateformat)
      if (data2.error) {//vorgestern
        day -= 1
        dateformat = year + month + day.toString();
        data2 = await this.getData1(dateformat)
        if (data2.error) {//vorvorgestern
          day = (d.getDate() - 3);
          dateformat = year + month + day.toString();
          data2 = await this.getData1(dateformat)
          if (data2.error) {
            let errorText = textStack.addText(data2.error.toUpperCase())
            textStack.setPadding(14, 14, 14, 14)
            errorText.font = Font.mediumSystemFont(13)
          } else {
            await this.setText(textStack, data2, list);
          }
        } else {
          await this.setText(textStack, data2, list);
        }
      } else {
        await this.setText(textStack, data2, list);
      }
    } else {
      await this.setText(textStack, data2, list)
    }




    return list
  }






  async getData1(dateformat) {
    try {
// console.log(dateformat)

 var d = new Date();
    var hours = d.getHours().toString();
    if (hours.toString().length == 1) {
      hours = '0' + hours;
    }
    var minute = d.getMinutes().toString();
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    var lastupDated = hours + ":" + minute

      let apiUrl = "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D" + dateformat + "&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true"

      const r = new Request(apiUrl)
      let resp = await r.loadJSON()
      let features = resp.features

      var fidCity = ""
      var attr = features[0].attributes
      let city = "Plochingen"
//       console.log(param)
      if (param === null){}
      else{city = param.toString()}

if (city in this.cities) {
        let number1 = this.cities[city]
        attr = features[number1].attributes
      } else {
        return { error: "Stadt nicht gefunden. Bitte Name bei Parametern ändern" };
      }

      let cityName = attr.NAMGEM
      let infectedPersons = attr.pers_qua.toString()
      let deaths = attr.tod_ins.toString()
      let residentsPercent = attr.per_qua_p.toString()
      let residents = attr.einw.toString()
      let infTotal = attr.inf_ges.toString()
      let inzidenz = attr.inzidenz.toString().substr(0, 4)
      let gen = attr.gen_p.toString()
      let proz_gem = attr.proz_gem.toString()
      let tod_neu = attr.tod_neu.toString()
      let inf_neu = attr.inf_neu.toString()
      let datum = attr.dat_zahl.toString()
      let fid = attr.FID.toString()
      fidCity = fid
      
      let year = dateformat.substring(0, 4)
      let month = dateformat.substring(4, 6)
      let day = dateformat.substring(6, 8)
      let theDate= day+"."+month+"."+year
      return {
        cityName: cityName,
        infectedPersons: infectedPersons,
        residentsPercent: residentsPercent,
        infTotal: infTotal,
        inzidenz: inzidenz,
        gen: gen,
        residents: residents,
        proz_gem: proz_gem,
        tod_neu: tod_neu,
        inf_neu: inf_neu,
        datum: datum,
        lastupDated: lastupDated,
        dateformat: theDate,
        fid: fid,
        deaths: deaths
      }
    } catch (e) {
      return { error: "Error getting data" };
    }
  }

  async setText(textStack, data, list) {
//     console.log(data)
    list.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000)

    let headerText = textStack.addText("Coronastatistik von\n" + data.cityName)
    headerText.textColor = Color.green()
    headerText.font = Font.mediumSystemFont(12)

    let text1 = textStack.addText("Infizierte: " + data.infectedPersons)
    text1.textColor = Color.dynamic(Color.black(), Color.white())
    text1.font = Font.mediumSystemFont(10)
    let text2 = textStack.addText("Neuinfizierte: " + data.inf_neu)
    text2.textColor = Color.dynamic(Color.black(), Color.white())
    text2.font = Font.mediumSystemFont(10)
    if (data.inf_neu ==="0"){
   }else{
    text2.textColor= Color.red()
  }

    let text3 = textStack.addText("Bevölkerung Prozent: " + data.residentsPercent)
    text3.textColor = Color.dynamic(Color.black(), Color.white())
    text3.font = Font.mediumSystemFont(10)

    let text4 = textStack.addText("Infizierte gesamt: " + data.infTotal)
    text4.textColor = Color.dynamic(Color.black(), Color.white())
    text4.font = Font.mediumSystemFont(10)

    let text5 = textStack.addText("Tote: " + data.deaths)
    text5.textColor = Color.dynamic(Color.black(), Color.white())
    text5.font = Font.mediumSystemFont(10)

    let text6 = textStack.addText("Neue Tote: " + data.tod_neu)
    text6.textColor = Color.dynamic(Color.black(), Color.white())
    text6.font = Font.mediumSystemFont(10)
    if (data.tod_neu ==="0"){
   }else{
    text6.textColor= Color.red()
  }

    let test7 = textStack.addText("Einwohner: " + data.residents)//+"\nDatum: "+ data.datum)
    test7.textColor = Color.white()
    test7.font = Font.mediumSystemFont(8)

    let test8 = textStack.addText("Stand: "+ data.dateformat+"\nAktualisiert: Heute " + data.lastupDated)
    test8.textColor = Color.green()
    test8.font = Font.mediumSystemFont(6)
  }



}//eoc

await new CoronaWidget().run();