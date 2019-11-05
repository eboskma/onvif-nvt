const Soap = require("../utils/soap");
const Util = require("../utils/util");

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/img/ONVIF-Imaging-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver20/imaging/wsdl/imaging.wsdl}<br>
 * </p>
 */
class Imaging {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.defaultVideoSourceToken = null;

    this.namespaceAttributes = [
      'xmlns:tns1="http://www.onvif.org/ver10/topics"',
      'xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"'
    ];
  }

  /**
   * Call this function directly after instantiating an Imaging object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  setDefaultVideoSourceToken(videoSourceToken) {
    this.defaultVideoSourceToken = videoSourceToken;
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
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
        if ((errMsg = Util.isInvalidValue(callback, "function"))) {
          reject(
            new Error(
              `The "callback" argument for ${methodName} is invalid:` + errMsg
            )
          );
          return;
        }
      }
      if (typeof methodName === "undefined" || methodName === null) {
        reject(
          new Error('The "methodName" argument for buildRequest is required.')
        );
        return;
      } else {
        if ((errMsg = Util.isInvalidValue(methodName, "string"))) {
          reject(
            new Error(
              'The "methodName" argument for buildRequest is invalid:' + errMsg
            )
          );
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

      this.soap
        .makeRequest("imaging", this.serviceAddress, methodName, soapEnvelope)
        .then(results => {
          resolve(results);
        })
        .catch(error => {
          reject(error);
        });
    });

    if (Util.isValidCallback(callback)) {
      promise
        .then(results => {
          callback(null, results);
        })
        .catch(error => {
          callback(error);
        });
    } else {
      return promise;
    }
  }

  // ---------------------------------------------
  // Access Control API
  // ---------------------------------------------

  getImagingSettings(videoSourceToken, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;
    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;

    return this.buildRequest('GetImagingSettings', soapBody, callback);
  }

  setImagingSettings(videoSourceToken, settings, callback) {
    // return new Promise((resolve, reject) => {
    //   reject(new Error("Not implemented"));
    // });

    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;

    let errMsg = ''
    if (typeof callback !== 'undefined' && callback !== null) {
      if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
        reject(new Error('The "callback" argument for setImagingSettings is invalid:' + errMsg))
        return
      }
    }
    if ((errMsg = Util.isInvalidValue(videoSourceToken, 'string'))) {
      reject(new Error('The "videoSourceToken" argument for setImagingSettings is invalid: ' + errMsg))
      return
    }
    if (settings) {
      if ((errMsg = Util.isInvalidValue(settings, 'object'))) {
        reject(new Error('The "settings" argument for setImagingSettings is invalid: ' + errMsg))
        return
      }
    }

    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    soapBody += '<timg:ImagingSettings>';
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
    soapBody += '</timg:ImagingSettings>';

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

  /**
   * The Move command moves the focus lens in an absolute, a relative or in a continuous manner from
   * its current position. The speed argument is optional for absolute and relative control, but
   * required for continuous. If no speed argument is used, the default speed is used. Focus adjustments
   * through this operation will turn off the autofocus. A device with support for remote focus control
   * should support absolute, relative or continuous control through the Move operation. The supported
   * MoveOpions are signalled via the GetMoveOptions command. At least one focus control capability is
   * required for this operation to be functional.<br>
   * The move operation contains the following commands:<br>
   * Absolute – Requires position parameter and optionally takes a speed argument. A unitless type is used by default for focus positioning and speed. Optionally, if supported, the position may be requested in m-1 units.<br>
   * Relative – Requires distance parameter and optionally takes a speed argument. Negative distance means negative direction.<br>
   * Continuous – Requires a speed argument. Negative speed argument means negative direction.<br>
   * @param {string=} videoSourceToken If no videoSourceToken is provided, then the defaultVideoSourceToken will be used.
   * @param {object} focus One of PanTilt (x,y) or Zoom (z), or both, is required.
   * @param {float=} focus.position Perform an Absolute focus to this position
   * @param {float=} focus.distance Perform a Relative focus for this distance.
   * @param {float=} focus.speed Focus at this speed.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @example
   * const OnvifManager = require('onvif-nvt')
   * OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
   *   .then(results => {
   *     let camera = results
   *     if (camera.imaging) { // Focus is supported on this device
   *       let focus = { speed: 1 }
   *       camera.imaging.move(null, focus)
   *         .then(() => {
   *           setTimeout(() => {
   *             camera.imaging.stop()
   *           }, 5000) // stop the camera after 5 seconds
   *         })
   *     }
   *   })
   */
  move(videoSourceToken, focus, callback) {
    videoSourceToken = videoSourceToken || this.defaultVideoSourceToken;

    let errMsg = ''
    if (typeof callback !== 'undefined' && callback !== null) {
      if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
        reject(new Error('The "callback" argument for move is invalid:' + errMsg))
        return
      }
    }
    if ((errMsg = Util.isInvalidValue(videoSourceToken, 'string'))) {
      reject(new Error('The "videoSourceToken" argument for move is invalid: ' + errMsg))
      return
    }
    if (focus) {
      if ((errMsg = Util.isInvalidValue(focus, 'object'))) {
        reject(new Error('The "focus" argument for move is invalid: ' + errMsg))
        return
      }
    }

    let soapBody = `<timg:VideoSourceToken>${videoSourceToken}</timg:VideoSourceToken>`;
    soapBody += '<timg:Focus>';
    if (focus.position) {
      soapBody += '<tt:Absolute>'
      soapBody += `<tt:Position>${focus.position}</tt:Position>`;
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Absolute>'
    } else if (focus.distance) {
      soapBody += '<tt:Relative>'
      soapBody += `<tt:Distance>${focus.distance}</tt:Distance>`;
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Relative>'
    } else {
      soapBody += '<tt:Continuous>'
      soapBody += `<tt:Speed>${focus.speed}</tt:Speed>`;
      soapBody += '</tt:Continuous>'
    }
    soapBody += '</timg:Focus>';

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
