
let param = args.widgetParameter

class CoronaWidget {

  constructor() {
    this.apiUrl = "https://services2.arcgis.com/mL26ZKdlhFJH9AoM/arcgis/rest/services/es_corona/FeatureServer/0/query?f=json&where=dat_text%3D20210125&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=NAMGEM%20asc&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true"
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

  async createWidget(items) {
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
    //textStack.addSpacer()


    let test1 = textStack.addText("Infizierte: " + data.infectedPersons)
    test1.textColor = Color.dynamic(Color.black(), Color.white())
    test1.font = Font.mediumSystemFont(10)

    let test5 = textStack.addText("Neuinfizierte: " + data.inf_neu)
    test5.textColor = Color.dynamic(Color.black(), Color.white())
    test5.font = Font.mediumSystemFont(10)

    let test3 = textStack.addText("Bevölkerung Prozent: " + data.residentsPercent)
    test3.textColor = Color.dynamic(Color.black(), Color.white())
    test3.font = Font.mediumSystemFont(10)

    let test4 = textStack.addText("Infizierte gesamt: " + data.infTotal)
    test4.textColor = Color.dynamic(Color.black(), Color.white())
    test4.font = Font.mediumSystemFont(10)

    let test2 = textStack.addText("Tote: " + data.deaths)
    test2.textColor = Color.dynamic(Color.black(), Color.white())
    test2.font = Font.mediumSystemFont(10)

    let test6 = textStack.addText("Neue Tote: " + data.tod_neu)
    test6.textColor = Color.dynamic(Color.black(), Color.white())
    test6.font = Font.mediumSystemFont(10)

    /*
    let test7 = textStack.addText("Einwohner: " + data.residents)
    test7.textColor = Color.white()
    test7.font = Font.mediumSystemFont(10)
    */
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
      const r = new Request(this.apiUrl)
      let resp = await r.loadJSON()
      let features = resp.features


      var attr = features[0].attributes
      let city = param.toString()

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
        deaths: deaths


      };




        //let currentData = await new Request(this.apiUrlDistricts.loadJSON())
        //let attr = currentData.features[0].attributes
        /*
       */

        //return {error: "Stadt nicht gefunden."};
    } catch(e) {
      return { error: "Error getting data" };
    }
  }
  
  
}

await new CoronaWidget().run();