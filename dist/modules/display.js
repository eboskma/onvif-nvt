const Soap = require('../utils/soap');

class Display {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tls="http://www.onvif.org/ver10/display/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
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

  getPaneConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getPaneConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setPaneConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setPaneConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createPaneConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deletePaneConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getLayout() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setLayout() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDisplayOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getServiceCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Display;