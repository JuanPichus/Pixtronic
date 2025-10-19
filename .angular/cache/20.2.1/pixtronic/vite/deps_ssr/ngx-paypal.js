import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  CommonModule
} from "./chunk-JGIQ2ED6.js";
import "./chunk-43NSXP3D.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  ViewChild,
  require_cjs,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵinject,
  ɵɵloadQuery,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-LYGTDO7Q.js";
import {
  __toESM
} from "./chunk-6DU2HRTW.js";

// node_modules/ngx-paypal/fesm2015/ngx-paypal.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var _c0 = ["payPalButtonContainer"];
var ScriptService = class {
  constructor(zone) {
    this.zone = zone;
  }
  registerScript(url, globalVar, onReady) {
    const existingGlobalVar = window[globalVar];
    if (existingGlobalVar) {
      this.zone.run(() => {
        onReady(existingGlobalVar);
      });
      return;
    }
    const scriptElem = document.createElement("script");
    scriptElem.id = this.getElemId(globalVar);
    scriptElem.innerHTML = "";
    scriptElem.onload = () => {
      this.zone.run(() => {
        onReady(window[globalVar]);
      });
    };
    scriptElem.src = url;
    scriptElem.async = true;
    scriptElem.defer = true;
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  }
  cleanup(globalVar) {
    const scriptElem = document.getElementById(this.getElemId(globalVar));
    if (scriptElem) {
      scriptElem.remove();
    }
  }
  getElemId(globalVar) {
    return `ngx-paypal-script-elem-${globalVar}`;
  }
};
ScriptService.ɵfac = function ScriptService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ScriptService)(ɵɵinject(NgZone));
};
ScriptService.ɵprov = ɵɵdefineInjectable({
  token: ScriptService,
  factory: ScriptService.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScriptService, [{
    type: Injectable
  }], function() {
    return [{
      type: NgZone
    }];
  }, null);
})();
var PayPalScriptService = class {
  constructor(scriptService) {
    this.scriptService = scriptService;
    this.paypalWindowName = "paypal";
  }
  registerPayPalScript(config, onReady) {
    this.scriptService.registerScript(this.getUrlForConfig(config), this.paypalWindowName, onReady);
  }
  destroyPayPalScript() {
    this.scriptService.cleanup(this.paypalWindowName);
  }
  getUrlForConfig(config) {
    const params = [{
      name: "client-id",
      value: config.clientId
    }];
    if (config.locale) {
      params.push({
        name: "locale",
        value: config.locale
      });
    }
    if (config.currency) {
      params.push({
        name: "currency",
        value: config.currency
      });
    }
    if (config.commit) {
      params.push({
        name: "commit",
        value: config.commit
      });
    }
    if (config.vault) {
      params.push({
        name: "vault",
        value: config.vault
      });
    }
    if (config.intent) {
      params.push({
        name: "intent",
        value: config.intent
      });
    }
    if (config.funding) {
      params.push({
        name: "components",
        value: "buttons,funding-eligibility"
      });
    }
    if (config.extraParams) {
      params.push(...config.extraParams);
    }
    return `https://www.paypal.com/sdk/js${this.getQueryString(params)}`;
  }
  getQueryString(queryParams) {
    let queryString = "";
    for (let i = 0; i < queryParams.length; i++) {
      const queryParam = queryParams[i];
      if (i === 0) {
        queryString += "?";
      } else {
        queryString += "&";
      }
      queryString += `${queryParam.name}=${queryParam.value}`;
    }
    return queryString;
  }
};
PayPalScriptService.ɵfac = function PayPalScriptService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || PayPalScriptService)(ɵɵinject(ScriptService));
};
PayPalScriptService.ɵprov = ɵɵdefineInjectable({
  token: PayPalScriptService,
  factory: PayPalScriptService.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PayPalScriptService, [{
    type: Injectable
  }], function() {
    return [{
      type: ScriptService
    }];
  }, null);
})();
var NgxPaypalComponent = class {
  constructor(paypalScriptService, cdr, ngZone) {
    this.paypalScriptService = paypalScriptService;
    this.cdr = cdr;
    this.ngZone = ngZone;
    this.registerScript = true;
    this.scriptLoaded = new EventEmitter();
    this.ngUnsubscribe = new import_rxjs.Subject();
    this.initializePayPal = true;
  }
  set payPalButtonContainer(content) {
    this.payPalButtonContainerElem = content;
  }
  ngOnChanges(changes) {
    if (!this.payPalButtonContainerId) {
      this.payPalButtonContainerId = this.generateElementId();
    }
    const config = this.config;
    if (changes.config.isFirstChange()) {
      if (config && this.registerScript) {
        this.initPayPalScript(config, (payPal) => {
          this.payPal = payPal;
          this.doPayPalCheck();
        });
      }
    }
    if (!changes.config.isFirstChange()) {
      this.reinitialize(config);
    }
  }
  ngOnDestroy() {
    this.paypalScriptService.destroyPayPalScript();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngAfterViewInit() {
    this.doPayPalCheck();
  }
  customInit(payPal) {
    this.payPal = payPal;
    this.doPayPalCheck();
  }
  reinitialize(config) {
    this.config = config;
    this.payPal = void 0;
    this.paypalScriptService.destroyPayPalScript();
    this.payPalButtonContainerId = this.generateElementId();
    this.initializePayPal = true;
    if (this.payPalButtonContainerElem) {
      try {
        while (this.payPalButtonContainerElem.nativeElement.firstChild) {
          this.payPalButtonContainerElem.nativeElement.removeChild(this.payPalButtonContainerElem.nativeElement.firstChild);
        }
      } catch (error) {
        console.error(error);
      }
    }
    this.cdr.detectChanges();
    if (this.config) {
      if (!this.payPal) {
        this.initPayPalScript(this.config, (payPal) => {
          this.payPal = payPal;
          this.doPayPalCheck();
        });
      } else {
        this.doPayPalCheck();
      }
    }
  }
  doPayPalCheck() {
    if (this.initializePayPal && this.config && this.payPal && this.payPalButtonContainerElem) {
      if (this.payPalButtonContainerElem.nativeElement.id) {
        this.initializePayPal = false;
        this.initPayPal(this.config, this.payPal);
      }
    }
  }
  initPayPalScript(config, initPayPal) {
    var _a;
    this.paypalScriptService.registerPayPalScript({
      clientId: config.clientId,
      locale: (_a = config.advanced) === null || _a === void 0 ? void 0 : _a.locale,
      commit: config.advanced && config.advanced.commit ? config.advanced.commit : void 0,
      currency: config.currency,
      vault: config.vault,
      intent: config.intent,
      funding: config.fundingSource != void 0 || config.fundingSource != null ? true : false,
      extraParams: config.advanced && config.advanced.extraQueryParams ? config.advanced.extraQueryParams : []
    }, (paypal) => {
      this.scriptLoaded.next(paypal);
      initPayPal(paypal);
    });
  }
  generateElementId() {
    return `ngx-captcha-id-${this.generateGuid()}`;
  }
  initPayPal(config, paypal) {
    this.ngZone.runOutsideAngular(() => {
      var _a;
      const createOrder = (data, actions) => {
        return this.ngZone.run(() => {
          if (config.createOrderOnClient && config.createOrderOnServer) {
            throw Error(`Both 'createOrderOnClient' and 'createOrderOnServer' are defined.
                    Please choose one or the other.`);
          }
          if (!config.createOrderOnClient && !config.createOrderOnServer) {
            throw Error(`Neither 'createOrderOnClient' or 'createOrderOnServer' are defined.
                    Please define one of these to create order.`);
          }
          if (config.createOrderOnClient) {
            return actions.order.create(config.createOrderOnClient(data));
          }
          if (config.createOrderOnServer) {
            return config.createOrderOnServer(data);
          }
          throw Error(`Invalid state for 'createOrder'.`);
        });
      };
      const createSubscription = (data, actions) => {
        return this.ngZone.run(() => {
          if (config.createSubscriptionOnClient) {
            return actions.subscription.create(config.createSubscriptionOnClient(data));
          }
          return;
        });
      };
      const onShippingChange = (data, actions) => {
        return this.ngZone.run(() => {
          if (config.onShippingChange) {
            return config.onShippingChange(data, actions);
          }
        });
      };
      const buttonsConfig = Object.assign(Object.assign(Object.assign({
        style: config.style,
        fundingSource: void 0,
        onApprove: (data, actions) => {
          return this.ngZone.run(() => {
            if (config.onApprove) {
              config.onApprove(data, actions);
            }
            if (config.authorizeOnServer) {
              return config.authorizeOnServer(data, actions);
            }
            const onClientAuthorization = config.onClientAuthorization;
            if (onClientAuthorization) {
              actions.order.capture().then((details) => {
                this.ngZone.run(() => {
                  onClientAuthorization(details);
                });
              });
            }
          });
        },
        onError: (error) => {
          this.ngZone.run(() => {
            if (config.onError) {
              config.onError(error);
            }
          });
        },
        onCancel: (data, actions) => {
          this.ngZone.run(() => {
            if (config.onCancel) {
              config.onCancel(data, actions);
            }
          });
        },
        onClick: (data, actions) => {
          this.ngZone.run(() => {
            if (config.onClick) {
              config.onClick(data, actions);
            }
          });
        },
        onInit: (data, actions) => {
          this.ngZone.run(() => {
            if (config.onInit) {
              config.onInit(data, actions);
            }
          });
        }
      }, (config.createOrderOnClient || config.createOrderOnServer) && {
        createOrder
      }), config.createSubscriptionOnClient && {
        createSubscription
      }), config.onShippingChange && {
        onShippingChange
      });
      let fundSource = void 0;
      switch (config.fundingSource) {
        case "PAYPAL":
          fundSource = paypal.FUNDING.PAYPAL;
          break;
        case "CARD":
          fundSource = paypal.FUNDING.CARD;
          break;
        case "PAYLATER":
          fundSource = paypal.FUNDING.PAYLATER;
          break;
        case "CREDIT":
          fundSource = paypal.FUNDING.CREDIT;
          break;
        case "VENMO":
          fundSource = paypal.FUNDING.VENMO;
          break;
        default:
          break;
      }
      if (fundSource != void 0) {
        buttonsConfig.fundingSource = fundSource;
        if (config.fundingSource !== "PAYPAL") (_a = buttonsConfig.style) === null || _a === void 0 ? true : delete _a.color;
      }
      paypal.Buttons(buttonsConfig).render(`#${this.payPalButtonContainerId}`);
    });
  }
  generateGuid() {
    let d = (/* @__PURE__ */ new Date()).getTime(), d2 = performance && performance.now && performance.now() * 1e3 || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == "x" ? r : r & 7 | 8).toString(16);
    });
  }
};
NgxPaypalComponent.ɵfac = function NgxPaypalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxPaypalComponent)(ɵɵdirectiveInject(PayPalScriptService), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(NgZone));
};
NgxPaypalComponent.ɵcmp = ɵɵdefineComponent({
  type: NgxPaypalComponent,
  selectors: [["ngx-paypal"]],
  viewQuery: function NgxPaypalComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.payPalButtonContainer = _t.first);
    }
  },
  inputs: {
    config: "config",
    registerScript: "registerScript"
  },
  outputs: {
    scriptLoaded: "scriptLoaded"
  },
  standalone: false,
  features: [ɵɵNgOnChangesFeature],
  decls: 2,
  vars: 1,
  consts: [["payPalButtonContainer", ""], [3, "id"]],
  template: function NgxPaypalComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 1, 0);
    }
    if (rf & 2) {
      ɵɵproperty("id", ctx.payPalButtonContainerId);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxPaypalComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      selector: "ngx-paypal",
      template: `
    <div #payPalButtonContainer [id]="payPalButtonContainerId"></div>
  `
    }]
  }], function() {
    return [{
      type: PayPalScriptService
    }, {
      type: ChangeDetectorRef
    }, {
      type: NgZone
    }];
  }, {
    config: [{
      type: Input
    }],
    registerScript: [{
      type: Input
    }],
    scriptLoaded: [{
      type: Output
    }],
    payPalButtonContainer: [{
      type: ViewChild,
      args: ["payPalButtonContainer", {
        static: false
      }]
    }]
  });
})();
var NgxPayPalModule = class {
};
NgxPayPalModule.ɵfac = function NgxPayPalModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxPayPalModule)();
};
NgxPayPalModule.ɵmod = ɵɵdefineNgModule({
  type: NgxPayPalModule,
  declarations: [NgxPaypalComponent],
  imports: [CommonModule],
  exports: [NgxPaypalComponent]
});
NgxPayPalModule.ɵinj = ɵɵdefineInjector({
  providers: [ScriptService, PayPalScriptService],
  imports: [CommonModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxPayPalModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [NgxPaypalComponent],
      exports: [NgxPaypalComponent],
      providers: [ScriptService, PayPalScriptService]
    }]
  }], null, null);
})();
export {
  NgxPayPalModule,
  NgxPaypalComponent,
  PayPalScriptService
};
//# sourceMappingURL=ngx-paypal.js.map
