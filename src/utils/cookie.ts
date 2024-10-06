export const useCookie = {
    set(name: string, value: string, config = {}) {
      var cfg = {
        expires: null,
        path: null,
        domain: null,
        secure: false,
        httpOnly: false,
        ...config,
      };
      var cookieStr = `${name}=${escape(value)}`;
      if (cfg.expires) {
        var exp = new Date();
        exp.setTime(exp.getTime() + parseInt(cfg.expires) * 1000);
        cookieStr += `;expires=${exp.toGMTString()}`;
      }
      if (cfg.path) {
        cookieStr += `;path=${cfg.path}`;
      }
      if (cfg.domain) {
        cookieStr += `;domain=${cfg.domain}`;
      }
      document.cookie = cookieStr;
    },
    get(name: string) {
      var arr = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]*)(;|$)")
      );
      if (arr != null) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    remove(name: string) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      document.cookie = `${name}=;expires=${exp.toGMTString()}`;
    },
  };