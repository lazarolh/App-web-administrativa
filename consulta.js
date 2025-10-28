function ConsultaSQL(query,DB){
  
  Logger.log(query);
  var Metodo = "GetConsulta" + (DB == "Kinetic" ? "Kinetic" : "");
  var WebService = "MultiplesConsultas/Consultas.asmx?op=";
  var RutaWS = PRODUCTIVE == false ? "Test-" + WebService : WebService;
  Logger.log(Metodo);
  Logger.log(RutaWS);
   var soapIn = XmlService.parse('<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"></soap12:Envelope>');
  var soapEnv = soapIn.getRootElement();
  var soapNS = soapEnv.getNamespace("soap12");
  var apiNS = XmlService.getNamespace("http://CMA-MultiplesConsultas/");
  var soapBody = XmlService.createElement("Body", soapNS);
  //var Consulta = XmlService.createElement("GetConsulta", apiNS);
  var Consulta = XmlService.createElement(Metodo, apiNS);
  var Query = XmlService.createElement("Query",apiNS).setText(query);
  Consulta.addContent(Query);
  soapBody.addContent(Consulta);
  soapEnv.addContent(soapBody);
 
try{ 
  var options =
    {
            "method" : "post",
            "contentType" : "text/xml; charset=utf-8",
            "payload" : XmlService.getRawFormat().format(soapIn), 
            "muteHttpExceptions" : true
    };
    
  var res = DBMan.getWSConnection();
  var soapCall= UrlFetchApp.fetch("http://"+ res.primary +":" + res.port +"/"+RutaWS+Metodo, options); 
  /*var cRate =  XmlService.parse(soapCall.getContentText()).getRootElement().getChild("Body", soapNS).getChild("GetConsultaResponse", apiNS).getChild("GetConsultaResult", apiNS).getDescendants();*/
  var cRate =  XmlService.parse(soapCall.getContentText()).getRootElement().getChild("Body", soapNS).getChild(Metodo+"Response", apiNS).getChild(Metodo+"Result", apiNS).getDescendants();
  var res = JSON.parse(cRate);
  Logger.log(res);
  return res;
  }catch(error){
    Logger.log('Hubo un error mientras se ejecutaba el web service. Descripción: ' + error);
    throw error;
  }
}


function ConsultaInsertUpdate(query){
  var Metodo = "GetInsertarActualizarRegistro" + (DB == "Kinetic" ? "Kinetic" : "");
  var WebService = "MultiplesConsultas/Consultas.asmx?op=";
  var RutaWS = PRODUCTIVE == false ? "Test-" + WebService : WebService;
  var soapIn = XmlService.parse('<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"></soap12:Envelope>');
  var soapEnv = soapIn.getRootElement();
  var soapNS = soapEnv.getNamespace("soap12");
  var apiNS = XmlService.getNamespace("http://CMA-MultiplesConsultas/");
  var soapBody = XmlService.createElement("Body", soapNS);
  var Consulta = XmlService.createElement(Metodo, apiNS);
  var Query = XmlService.createElement("Query",apiNS).setText(query);
  Consulta.addContent(Query);
  soapBody.addContent(Consulta);
  soapEnv.addContent(soapBody);

try{ 
  var options =
  {
    "method" : "post",
    "contentType" : "text/xml; charset=utf-8",
    "payload" : XmlService.getRawFormat().format(soapIn), 
    "muteHttpExceptions" : true
  };
 
  var res = DBMan.getWSConnection();
  var soapCall= UrlFetchApp.fetch("http://"+ res.primary +":" + res.port +"/"+RutaWS+Metodo, options); 
  Logger.log(soapCall);
  var cRate =  XmlService.parse(soapCall.getContentText()).getRootElement().getChild("Body", soapNS).getChild(Metodo+"Response", apiNS).getChild(Metodo+"Result", apiNS).getValue();
  Logger.log(cRate);
  return cRate;
  }catch(error){
    Logger.log('Hubo un error mientras se ejecutaba el web service. Descripción: ' + error);
    throw error;
  }
}
