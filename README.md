# iew.js
Small front-end javascript library that is similar to vue. Currently it supports bindings, models, onclick event and components. Just 4KB.

## Initialize
End of the body, initialize the iew with script tag:

```
let app = Iew({
        el: "#app",
        data: {
          name: "Aşkın Kadir",
        },
        created() {
          console.log("Hello World");
        },
      });
```

In data, just add your variables which changes.

To Binding just add "ew-bind" attribute to your element.

```
<input type="text" ew-model="name" />
<span ew-bind="name" style="margin-left: 1rem"></span>
```

It will update every input changes.

## Components

You must import your components to your main page file. To do that before initializing Iew, run ewmport() function with path. For example: ewmport("./src/components/text"). Your component must be ".iew" file.

```
ewmport("./src/components/text");

let app = Iew({
  el: "#app",
    data: {
      name: "test",
    },
    created() {
      console.log("hello world");
    },
});
```

In html: 
```<text></text>```

text.iew file:
```
<title>text</title>

<content>
  <div>
    <label ew-bind="count"></label>
    <button ew-onclick="increment">increment</button>
  </div>
</content>

<script>
  ({
    data: {
      count: 0
    },
    methods: {
      increment() {
        this.data.count++;
      }
    }
  })

</script>
```

- In title, you have to type name of your component. It will be used when calling it in html (```<<text></text>```<). 
- In content you have to add your html content. It must include <div></div> first.
- In script tag, you have to add your iew scripts there.

## TODO
- ew-if attribute (```<div ew-if="true"></div>```)
- ew-for attribute (```<div ew-for="todo in todos"></div>```)
- Components attributes, properties
- Components in components
