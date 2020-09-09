"use strict";

let components = [];
let componentsElements = [];

const ewmport = (component) => {
  if (component.substr("-4") != ".iew") component += ".iew";
  components.push(component);
};

const Iew = (options) => {
  _init(options);
  console.log("IEW: Initialized");
};

const _init = (options) => {
  let app = document.querySelector(options.el);
  const createState = (stateObj) => {
    return new Proxy(stateObj, {
      set(target, prop, val) {
        target[prop] = val;
        render();
        return true;
      },
    });
  };

  const render = () => {
    app = document.querySelector(options.el);

    setBindings(app, state);
    setEventBindings(app, options.methods, state);
    setIfs(app, state);
  };

  const state = createState(options.data);
  const listeners = app.querySelectorAll("[ew-model]");

  listeners.forEach((el) => {
    const name = el.getAttribute("ew-model");
    el.addEventListener("change", (e) => (state[name] = el.value));
    el.addEventListener("input", (e) => (state[name] = el.value));
  });

  const ewmports = () => {
    for (let i = 0; i < components.length; i++) {
      readIEW(components[i], (res) => {
        let html = stringToHTML(res);

        let title = html.querySelector("title");
        let content = html.querySelector("content");
        let script = html.querySelector("script");
        let componentExport = eval(script.innerHTML);

        let i = 0;
        Array.from(app.getElementsByTagName(title.innerText)).forEach((el) => {
          html = stringToHTML(res);

          title = html.querySelector("title");
          content = html.querySelector("content");
          script = html.querySelector("script");
          componentExport = eval(script.innerHTML);

          el.id = i++;
          let willReplace = content.querySelector("div");
          el.replaceWith(willReplace);

          componentsElements.push({
            title: title,
            element: willReplace,
            script: componentExport,
          });
        });

        if (options.data.components != typeof Array)
          options.data.components = [];
        options.data.components = componentsElements;

        let a = 0;
        componentsElements.forEach((el) => {
          setBindings(el.element, state.components[a].script.data);
          setEventBindings(
            el.element,
            el.script,
            state.components[a].script.data
          );
          a++;
        });
        render();
      });
    }
  };

  const setEventBindings = (parentDOM, script, state) => {
    const eventBindings = Array.from(
      parentDOM.querySelectorAll("[ew-onclick]")
    ).map((e) => e.getAttribute("ew-onclick"));

    eventBindings.forEach((binding) => {
      parentDOM
        .querySelector(`[ew-onclick=${binding}]`)
        .addEventListener("click", () => {
          if (script.data != null) {
            script.methods.data = script.data;

            script.methods[binding]();
            script.data = script.methods.data;
            delete script.methods.data;
          }

          setBindings(parentDOM, state);
        });
    });
  };

  ewmports();
  render();
  options.created();
};

const setBindings = (parentDOM, state) => {
  const bindings = Array.from(
    parentDOM.querySelectorAll("[ew-bind]")
  ).map((e) => e.getAttribute("ew-bind"));

  bindings.forEach((binding) => {
    if (state[binding] != null) {
      const ewBind = parentDOM.querySelector(`[ew-bind=${binding}]`);
      const ewModel = parentDOM.querySelector(`[ew-model=${binding}]`);

      if (ewBind != null) ewBind.innerHTML = state[binding];

      if (ewModel != null) ewModel.value = state[binding];
    }
  });
};

const setIfs = (parentDOM, state) => {
  const bindings = Array.from(parentDOM.querySelectorAll("[ew-if]"));
  console.log("bindings", bindings);

  bindings.forEach((e) => {
    const isTrue = e.getAttribute("ew-if") == true;

    let isFounded = false;
    ifs.forEach((ifEl) => {
      if (ifEl.element == e) {
        isFounded = true;
        return (ifEl.isTrue = isTrue);
      }
    });

    if (!isFounded) ifs.push({ element: e, isTrue: isTrue });

    if (!isTrue) {
      // e.hidden = true;
    }
  });
};

const setComponentBindings = () => {
  const bindings = Array.from(
    el.element.querySelectorAll("[ew-bind]")
  ).map((e) => e.getAttribute("ew-bind"));
  bindings.forEach((binding) => {
    if (state.components[i].script.data[binding] != null) {
      const ewBindEl = el.element.querySelector(`[ew-bind=${binding}]`);
      const ewModelEl = el.element.querySelector(`[ew-model=${binding}]`);

      if (ewBindEl != null)
        ewBindEl.innerHTML = state.components[i].script.data[binding];

      if (ewModelEl != null)
        ewModelEl.value = state.components[i].script.data[binding];
    }
  });
};

const readIEW = (path, cb) => {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.responseType = "blob";
  xhr.onload = function (e) {
    if (this.status == 200) {
      var file = new File([this.response], "temp");
      var fileReader = new FileReader();
      fileReader.addEventListener("load", function () {
        cb(fileReader.result);
      });
      fileReader.readAsText(file);
    }
  };
  xhr.send();
};

const stringToHTML = function (str) {
  const dom = document.createElement("div");
  dom.innerHTML = str;
  return dom;
};
