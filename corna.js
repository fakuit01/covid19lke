
let param = args.widgetParameter

class CoronaWidget {

  constructor() {
    //this.apiUrl = (dateformat) => "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D${dateformat}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true"
    //this.apiUrl1 ="https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D20210126&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&outSR=102100&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true" 
    //this.apiUrl2 ="https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D20210127&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&outSR=102100&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true" 

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
    let data = await this.getData()

    let list = new ListWidget()
    list.backgroundColor = Color.dynamic(Color.white(), Color.black())
    list.setPadding(0, 0, 0, 0)
    let textStack = list.addStack()
    textStack.setPadding(4, 8, 0, 8)
    textStack.layoutVertically()
    textStack.topAlignContent()
       
    if(data.error) {
      let errorText = textStack.addText(data.error.toUpperCase())
      textStack.setPadding(14, 14, 14, 14)
      errorText.font = Font.mediumSystemFont(13)
    } else {
      list.refreshAfterDate = new Date(Date.now() + 60*60*1000)


    let headerText = textStack.addText("Coronazahlen \n" + data.cityName.toUpperCase())
    headerText.textColor = Color.green()
    headerText.font = Font.mediumSystemFont(12)

    let text1 = textStack.addText("Infizierte: " + data.infectedPersons)
    text1.textColor = Color.dynamic(Color.black(), Color.white())
    text1.font = Font.mediumSystemFont(10)

    let text2 = textStack.addText("Neuinfizierte: " + data.inf_neu)
    text2.textColor = Color.dynamic(Color.black(), Color.white())
    text2.font = Font.mediumSystemFont(10)

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

    let test7 = textStack.addText("Einwohner: " + data.residents)//+"\nDatum: "+ data.datum)
    test7.textColor = Color.white()
    test7.font = Font.mediumSystemFont(8)

//Was ist das?
/*
    let test6 = textStack.addText("gen: " + data.gen)
    test6.textColor = Color.white()
    test6.font = Font.mediumSystemFont(10)
    */
    }
    return list
  }
  
  async getData() {
     try {
      var d = new Date();
      var day = (d.getDate()-1).toString();
      var month = (d.getMonth()+1).toString();
        if(month.toString().length == 1) {
             month = '0'+month;
        }
      var year = d.getFullYear().toString();
      var dateformat = year+month+day;
      let apiUrl = "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D"+dateformat+"&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true"

      const r = new Request(apiUrl)
      let resp = await r.loadJSON()
      let features = resp.features


      var attr = features[0].attributes
      let city = "Plochingen"
      city = param.toString()

      /*
      //var len = features.length;
      //console.log(len)
      //Not working
      for (e in resp.features){
        let x = e.attributes
        let nam = x.NAMGEM
        if (nam === city){
          console.log("drin")
        }
      }*/

      /*
      for (i = 0; i < len; i++) {
        console.log("hi")
        if (features[i].attributes.NAMGEM.toString() === city) {
          console.log("drin")
         }
       }
       */



      if (city in this.cities) {
        let number1 = this.cities[city]
        attr = features[number1].attributes
      }else{
        return { error: "Stadt nicht gefunden. Bitte Name bei Parametern ändern" };
      }


      let cityName = attr.NAMGEM
      let infectedPersons = attr.pers_qua.toString()
      let deaths = attr.tod_ins.toString()
      let residentsPercent = attr.per_qua_p.toString()
      let residents = attr.einw.toString()
      let infTotal = attr.inf_ges.toString()
      let inzidenz  = attr.inzidenz.toString().substr(0,4)
      let gen = attr.gen_p.toString()
      let proz_gem = attr.proz_gem.toString()
      let tod_neu = attr.tod_neu.toString()
      let inf_neu = attr.inf_neu.toString()
      let datum = attr.dat_zahl.toString()
      //console.log(cityName)
      return{
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
        deaths: deaths


      };
    } catch(e) {
      return { error: "Error getting data" };
    }
  }
  
  
}

await new CoronaWidget().run();