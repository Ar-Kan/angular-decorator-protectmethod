import { Injectable } from "@angular/core";

function evento_wrapper(motivo: boolean) {
  return function(
    target: SearchService,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let metodo_original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      target["opera_evento_pesquisa"](motivo);
      let result = metodo_original.apply(this, args);
      result.then(r => {
        target["opera_evento_pesquisa"](motivo);
      });
      return result;
    };
  };
}

function protectMethod(allowedCaller: string[]) {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      /**
       * callerName by Iris Li
       * https://gist.github.com/irisli/716b6dacd3f151ce2b7e
       */
      var stackTrace = new Error().stack; // Only tested in latest FF and Chrome
      var callerName = stackTrace.replace(/^Error\s+/, ""); // Sanitize Chrome
      callerName = callerName.split("\n")[1].trim(); // 1st item is this, 2nd item is caller
      callerName = callerName.replace(/^\s+at Object./, ""); // Sanitize Chrome
      callerName = callerName.replace(/ \(.+\)$/, ""); // Sanitize Chrome
      if (callerName.slice(0, 3) == "at ") callerName = callerName.slice(3); // Sanitize Chrome
      callerName = callerName.replace(/\@.+/, ""); // Sanitize Firefox

      const allowed = allowedCaller.filter(e => {
        return e === callerName;
      });
      if (!allowed.length) {
        console.warn(`Caller "${callerName}" should not call "${propertyKey}"`);
      }

      originalMethod.apply(this, args);
    };
  };
}

@Injectable()
export class SearchService {
  constructor() {}

  @protectMethod(["AppComponent.call_method"])
  @evento_wrapper(true)
  method_service(v) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("service called ", v);
        resolve(true);
      }, 1000);
    });
  }

  private opera_evento_pesquisa(t) {
    console.log('wrapper, ', t);
  }
}
