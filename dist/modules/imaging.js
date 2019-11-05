const Soap = require("../utils/soap");

const Util = require("../utils/util");

class Imaging {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.defaultVideoSourceToken = null;
    this.namespaceAttributes = ['xmlns:tns1="http://www.onvif.org/ver10/topics"', 'xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  setDefaultVideoSourceToken(videoSourceToken) {
    this.defaultVideoSourceToken = videoSourceToken;
  }

  createRequest(body) {
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    });
    return soapEnvelope;
  }

  buildRequest(methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = "";

      if (typeof callback !== "undefined" && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, "function")) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (typeof methodName === "undefined" || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'));
        return;
      } else {
        if (errMsg = Util.isInvalidValue(methodName, "string")) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg));
          return;
        }
      }

      let soapBody = "";

      if (typeof xml === "undefined" || xml === null || xml === "") {
        soapBody += `<timg:${methodName}/>`;
      } else {
        soapBody += `<timg:${methodName}>`;
        soapBody += xml;
        soapBody += `</timg:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody);
      console.log(soapEnvelope);
      this.soap.makeRequest("imaging", this.serviceAddress, methodName, soapEnvelope).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getImagingSettings(videoSourceToken, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    return this.buildRequest('GetImagingSettings', soapBody, callback);
  }

  setImagingSettings(videoSourceToken, settings, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let errMsg = '';

    if (typeof callback !== 'undefined' && callback !== null) {
      if (errMsg = Util.isInvalidValue(callback, 'function')) {
        reject(new Error('The "callback" argument for setImagingSettings is invalid:' + errMsg));
        return;
      }
    }

    if (errMsg = Util.isInvalidValue(videoSourceToken, 'string')) {
      reject(new Error('The "videoSourceToken" argument for setImagingSettings is invalid: ' + errMsg));
      return;
    }

    if (settings) {
      if (errMsg = Util.isInvalidValue(settings, 'object')) {
        reject(new Error('The "settings" argument for setImagingSettings is invalid: ' + errMsg));
        return;
      }
    }

    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    soapBody += '<tt:ImagingSettings>';

    if (settings.Brightness) {
      soapBody += `<tt:Brightness>${settings.Brightness}</tt:Brightness>`;
    }

    if (settings.ColorSaturation) {
      soapBody += `<tt:ColorSaturation>${settings.ColorSaturation}</tt:ColorSaturation>`;
    }

    if (settings.Contrast) {
      soapBody += `<tt:Contrast>${settings.Contrast}</tt:Contrast>`;
    }

    if (settings.Sharpness) {
      soapBody += `<tt:Sharpness>${settings.Sharpness}</tt:Sharpness>`;
    }

    if (settings.Focus) {
      const focus = settings.Focus;
      soapBody += '<tt:Focus>';

      if (focus.AutoFocusMode) {
        soapBody += `<tt:AutoFocusMode>${focus.AutoFocusMode}</tt:AutoFocusMode>`;
      }

      if (focus.DefaultSpeed) {
        soapBody += `<tt:DefaultSpeed>${focus.DefaultSpeed}</tt:DefaultSpeed>`;
      }

      if (focus.NearLimit) {
        soapBody += `<tt:NearLimit>${focus.NearLimit}</tt:NearLimit>`;
      }

      if (focus.FarLimit) {
        soapBody += `<tt:FarLimit>${focus.FarLimit}</tt:FarLimit>`;
      }

      soapBody += '</tt:Focus>';
    }

    soapBody += '</tt:ImagingSettings>';
    return this.buildRequest('SetImagingSettings', soapBody, callback);
  }

  getOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented"));
    });
  }

  getPresets() {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented"));
    });
  }

  getCurrentPreset(videoSourceToken, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    return this.buildRequest('GetCurrentPreset', soapBody, callback);
  }

  setCurrentPreset() {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented"));
    });
  }

  move(videoSourceToken, focus, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let errMsg = '';

    if (typeof callback !== 'undefined' && callback !== null) {
      if (errMsg = Util.isInvalidValue(callback, 'function')) {
        reject(new Error('The "callback" argument for move is invalid:' + errMsg));
        return;
      }
    }

    if (errMsg = Util.isInvalidValue(videoSourceToken, 'string')) {
      reject(new Error('The "videoSourceToken" argument for move is invalid: ' + errMsg));
      return;
    }

    if (focus) {
      if (errMsg = Util.isInvalidValue(focus, 'object')) {
        reject(new Error('The "focus" argument for move is invalid: ' + errMsg));
        return;
      }
    }

    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    soapBody += '<tt:Focus>';

    if (focus.position) {
      soapBody += '<tt:Absolute>';
      soapBody += `<tt:Position>${focus.position}</tt:Position>`;
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Absolute>';
    } else if (focus.distance) {
      soapBody += '<tt:Relative>';
      soapBody += `<tt:Distance>${focus.distance}</tt:Distance>`;
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Relative>';
    } else {
      soapBody += '<tt:Continuous>';
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Continuous>';
    }

    soapBody += '</tt:Focus>';
    return this.buildRequest('Move', soapBody, callback);
  }

  stop(videoSourceToken, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    return this.buildRequest('Stop', soapBody, callback);
  }

  getImagingStatus() {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented"));
    });
  }

  getCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented"));
    });
  }

}

module.exports = Imaging;