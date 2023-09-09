(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto); // 复制数组原始的方法, newArrayProto.__proto__ === Array.prototype

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 重写7个能修改原数组的方法

  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      console.log("修改数组的方法被调用");
      var observeArray = this.__ob__.observeArray; // this.__ob__ = class Observer {}

      // todos...
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 调用数组原始的方法, this指向调用该方法的数组

      // 借助Observer类身上的observeArray方法对数组修改的新值进行数据监视
      switch (method) {
        case 'push':
        case 'unshift':
          observeArray(args);
          break;
        case 'splice':
          observeArray(args.splice(2));
      }
      this.__ob__.dep.notify(); // 通知页面进行更新
      return result;
    };
  });

  /*  观察者模式：
      给模板中的属性增加一个收集器：dep
      将页面渲染逻辑封装在watcher中(vm._update(vm._render()))
      让dep记住这个watcher, 当属性变化时找到该属性的dep中存放的对应watcher, 调用渲染方法即可
  */

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = []; // subs用于存放该属性对应的watcher(一个属性可能在n个视图中使用, 每个视图有自己的watcher)
    }
    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher); // 将该属性对应的watcher存放在dep里面的subs中
      }
    }, {
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this); // this指向当前的属性的dep, 将该dep与watcher双向记录
      }
    }, {
      key: "notify",
      value: function notify() {
        // 通知watcher更新的方法
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer$1 = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // data.__ob__ = this, 给无论是数组还是对象的data添加__ob__属性, 可以通过查找data身上是否有__ob__属性, 判断数据是否已经被监视过
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false // 在对对象进行遍历的时候(this.walk), 会遍历__ob__属性, __ob__属性指向Observer类，类里面又有__ob__属性，会造成无限循环，应设置__ob__属性为不可遍历
      });

      this.dep = new Dep(); // 给所有对象/数组属性添加dep, 如果后续数组长度发生变化, 或对象有新增属性, 可以收集依赖并更新

      if (Array.isArray(data)) {
        // 对数组进行数据监视非常耗费性能(在数组较长的情况下), 而且一般不通过索引值修改数组，因此不对数组进行数据监视
        this.observeArray(data); // 如果数组内有对象，对数组内的对象添加数据监视
        data.__proto__ = newArrayProto; // 重写数组的7个方法，使得调用这几个方法修改数组时能被监控到
        // data.__ob__ = this // this指向Observer类(其中包含有observeArray(data)方法)，给data添加__ob__属性并指向Observer类，在data调用数组的修改方法时，能够访问到Observer类上的observeArray(data)方法，从而给新修改的值添加数据监视
      } else {
        this.walk(data); // 调用类身上的walk()方法对data的各属性进行遍历，变成响应式数据
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // Object.keys(data)返回data身上所有的属性名组成的数组
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]); // 使用defineReactive()方法对属性值进行响应式处理，返回的是一个重新定义的data, 性能差
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        }); // 若数组内部具有对象，还需要对该对象进行数据监视
      }
    }]);
    return Observer;
  }();
  function dependArray(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].__ob__ && array[i].__ob__.dep.depend();
      if (Array.isArray(array[i])) {
        dependArray(array[i]);
      }
    }
  }
  function defineReactive(target, key, value) {
    if (_typeof(value) === 'object') observe(value);
    var childOb = observe(value); // 使用递归对data进行深度的数据劫持, childOb上面有dep属性可用于依赖收集
    var dep = new Dep(); // 给所有属性添加dep
    // Object.defineProperty()只能劫持对象现有的属性，对新增以及删除的属性，需要借助$set, $delete等api
    Object.defineProperty(target, key, {
      // closure
      get: function get() {
        // console.log("属性值调用getter读取了")
        if (Dep.target && !childOb) {
          dep.depend(); // watcher与普通属性的dep双向收集
        } else if (Dep.target && childOb) {
          childOb.dep.depend(); // 让数组和对象本身也实现依赖收集, 之所以不用dep.depend()而是用了childOb.dep.depend(), 是因为数组更新时, 调用的是__ob__.dep.notify(), 是在new Observer的时候生成的那个dep; dep.depend()是在defineReactive()函数里let dep = new Dep()生成的dep, watcher必须记住前者而不是后者(源码这里没有这个!childOb的判断, 会造成数组和对象的重复依赖收集, 做了优化)

          if (Array.isArray(value)) {
            dependArray(value); // 如果数组里面还嵌套着数组, 需要继续对嵌套数组做依赖收集工作
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(value); // 如果用户修改的值是一个对象，需要继续进行数据劫持
        // console.log("属性值调用setter修改了")
        value = newValue;
        dep.notify();
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data.__ob__ !== undefined) return; // 递归的baseCase

    return new Observer$1(data); // 如果一个实例被劫持过，就不需要再被劫持了。可借助Observer类定义响应式数据，通过判断是不是该类的实例来判断是否被劫持过
    // const newData = new Observer(data)
    // console.log(newData === data)
  }

  function set(target, key, value) {
    // 通过索引修改数组的项, 通过splice方法实现
    if (Array.isArray(target) && typeof key === 'number') {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, value);
      return value;
    }
    // 已经有的属性, 直接修改即可
    if (key in target && !(key in Object.prototype)) {
      target[key] = value;
      return value;
    }
    var observer = target.__ob__;
    // 被新增属性的对象没有__ob__, 不是响应式数据, 不需要做响应式处理
    if (!observer) {
      target[key] = value;
      return value;
    }
    defineReactive(observer.value, key, value); // 对新增属性进行响应式处理
    observer.dep.notify(); // 通知视图更新
    return value;
  }
  function del(target, key) {
    // 通过索引删除数组的项, 通过splice方法实现
    if (Array.isArray(target) && typeof key === 'number') {
      target.splice(key, 1);
      return;
    }
    var observer = target.__ob__;
    // target没有key属性, 不需要删除
    if (!target[key]) {
      return;
    }
    delete target[key];
    // 被删除的不是响应式数据, 直接返回即可
    if (!observer) {
      return;
    }
    // 通知页面更新
    observer.dep.notify();
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, updateFnOrWatchExp, options, cb) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.renderWatcher = options; // options为true则为渲染watcher

      if (typeof updateFnOrWatchExp === 'function') {
        // 渲染watcher是更新页面的方法, 计算属性watcher是计算计算属性值的方法, 用户自定义watcher是用户传入vm.$watch()中的返回被观测对象的方法
        this.getter = updateFnOrWatchExp; // getter表明调用该函数会发生取值的操作
      } else {
        // 用户自定义watcher中用户传入的被监测对象名
        this.getter = function () {
          return vm[updateFnOrWatchExp];
        };
      }
      this.depId = new Set(); // 借助set实现dep去重
      this.deps = []; // watcher也需要收集dep, 用于处理计算属性和清理等的工作
      this.vm = vm;
      this.lazy = options.lazy; // lazy属性用于控制初次加载是否要立即渲染页面(对于渲染watcher, 需要去渲染; 对于计算属性watcher, 应当是dirty属性为真才去渲染)
      this.dirty = this.lazy; // dirty属性用于控制是否去调用getter()更新计算属性(dirty为真说明计算属性应当发生了改变, 即计算属性所依赖的属性发生了变化。如果同一个计算属性在页面上出现多次, 只需要计算一次值即可, 之后就应当将dirty变为false)
      this.user = options.user; //是否为用户自定义watcher
      this.cb = cb; // 用户自定义watcher中被监测对象发生变化后执行的回调
      this.value = this.lazy ? undefined : this.get(); // 初次渲染页面调用this.get()方法, 或用户自定义watcher取得被监测对象的当前值
    }
    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // watcher与dep相互收集的方法
        var id = dep.id;
        if (!this.depId.has(id)) {
          // 如果同一个属性在当前组件中用到了多次, watcher只需要记录一次dep即可, 需要进行去重操作
          this.depId.add(id);
          this.deps.push(dep); // watcher收集dep
          dep.addSub(this); // dep收集watcher
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get(); // 将计算属性的计算结果value挂在watcher上, 方便去取值
        this.dirty = false; // 计算属性值已经得到了, 数据不需要更新, dirty设置为false
      }
    }, {
      key: "get",
      value: function get() {
        // Dep.target = this // this指向Watcher的实例, Dep类的静态属性target指向watcher的实例, 是为了让dep能够记录下对应的watcher
        // this.getter() // 渲染视图的方法, 会去vm上取值, 调用属性的get方法, 可在属性的get方法中添加该watcher
        // Dep.target = null // 在视图渲染完毕, dep记录下当前对应的watcher后, 需要将Dep.target复原(如果在模板范围外读取属性, 不应当记录在dep中, 且此时的watcher应该为null)

        /* 针对computed重写get方法： 
        计算属性本身需要有一个watcher, 用于收集计算属性所依赖的那些属性的dep, 才能实现计算属性的更新。
        计算属性的watcher应该被包含在当前组件的渲染watcher之中, 在属性触发get之后能够先被计算属性watcher捕获, 再被渲染watcher捕获从而更新页面。
        计算属性所依赖的属性需要同时记住计算属性watcher以及组件的渲染watcher, 因此需要维护一个栈, 存放watcher
         */

        /* 计算属性中的watcher：
        组件初次渲染时, 调用mountComponent()方法创建了渲染watcher, 渲染watcher在创建时调用了本方法(第一次调用), 将渲染watcher自身添加到stack中, 并将Dep.target指向该watcher, 此时stack = [Watcher: {renderWatcher: true, ...}]。
        执行到pushTarget(this)之后, 接下来执行this.getter(), 对渲染watcher来说就是渲染页面的方法, 渲染过程中发现页面上用到了计算属性, 调用计算属性的createComputedGetter方法, 在里面调用evaluate()方法, evaluate()方法再次调用到本方法(第二次调用), 将计算属性watcher推入stack中, 并将Dep.target指向此渲染watcher, 此时stack = [Watcher: {renderWatcher: true, ...}， Watcher: {renderWatcher: {lazy: true}, ...}]
        同时第二次调用pushTarget(this)之后, 接下来执行this.getter(), 对计算属性watcher来说是计算计算属性值的方法, 需要去读取计算属性所依赖的属性, 于是就调用这些属性的get()方法(Object.defineProperty()), 因为存在Dep.target, 所以这些属性的dep收集到了当前的Dep.target, 也就是计算属性watcher。
        计算属性值得到后, 第二次调用的get()走到了popTarget(), 于是stack中的计算属性watcher被清除, Dep.target重新指向渲染watcher。接下来回到createComputedGetter, 在createComputedGetter中继续调用Dep.target(计算属性watcher)身上的depend方法, 让计算属性所依赖的属性记住渲染watcher, 这样这些属性同时记住了渲染watcher与计算属性watcher, 可以实现计算属性更新与页面更新。
        */

        // debugger
        pushTarget(this); // 将当前watcher推入栈中, 并将Dep.target指向当前的watcher
        var value = this.getter.call(this.vm); // 对于计算属性watcher, getter()就是用户传入的getter
        popTarget(); // 当前的watcher出栈, 并将Dep.target指向上一个入栈的watcher
        return value;
      }
    }, {
      key: "depend",
      value: function depend() {
        // depend()方法让watcher中记录的那些dep, 再记录watcher(记住计算属性watcher, 也记住渲染watcher)
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true; // 如果是计算属性, 依赖的属性变化了, dirty应当为true
        } else {
          queueWatcher(this); // 同一个属性有可能更新多次(比如vm.age = 19; vm.age = 20; vm.age = 21), 或者有多个组件都会要更新, 希望能够在多次调用update()后, 最终更新视图的该组件watcher只执行一次(即每个组件run()方法只调用一次)
        }
      }
    }, {
      key: "run",
      value: function run() {
        // this.get() // 渲染watcher更新页面
        var oldValue = this.value;
        var newValue = this.get();
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }]);
    return Watcher;
  }();
  var queue = [];
  var has = {};
  var pending = false;
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0); // 复制一份queue
    queue = [];
    has = {};
    pending = false; // 先将pending调整为false, 如果在更新的过程中又遇到新的watcher, 可以继续执行更新操作
    flushQueue.forEach(function (watcher) {
      return watcher.run();
    }); // 真正执行更新
  }

  function queueWatcher(watcher) {
    // 同一个属性可能被更新了多次(比如vm.age = 19; vm.age = 20; vm.age = 21), 借助对象进行watcher的去重, 由于更新是异步操作(修改属性的操作完成后才应该更新), 所以只会取最新的更新值
    var id = watcher.id;
    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;
      // console.log(queue)
    }

    // 防抖操作, 被更新的组件可能有多个, 希望多次调用update()后, 最终更新视图的watcher只执行一次
    if (!pending) {
      pending = true;
      nextTick(flushSchedulerQueue);
    }
  }
  var callbacks = [];
  var waiting = false;
  var timerFunc; // timerFunc方法实现异步调用函数
  if (Promise) {
    // Promise是微任务, 执行优先级在宏任务之后, 应该优先把timerFunc设置为Promise形式
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    // MutationObserver是H5的api
    var Observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    Observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    // 仅IE支持
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else if (setTimeout) {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }
  function flushCallbacks() {
    // flushCallbacks()方法用于调用callbacks队列中所有的更新回调函数, 实现更新操作
    var flushCb = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    flushCb.forEach(function (cb) {
      return cb();
    });
  }

  // 更新是异步操作, 需要借助nextTick方法进行异步调用flushSchedulerQueue()方法, 实现异步更新
  function nextTick(cb) {
    callbacks.push(cb);
    // 防抖操作, 如果nextTick被调用多次, 应该先将所有的回调函数放在一个队列中, 最后统一执行
    if (!waiting) {
      timerFunc(flushCallbacks);
      waiting = true;
    }
  }

  function initState(vm) {
    var options = vm.$options; // 重新从vm身上获取用户传入的options

    if (options.data) {
      initData(vm); // 如果用户传入的配置项有data，则调用initData方法进行数据的响应式处理
    }

    if (options.computed) {
      initComputed(vm); // 如果用户传入的配置项有computed, 则调用initComputed方法实现计算属性
    }

    if (options.watch) {
      initWatch(vm);
    }
    if (options.props) {
      initProps(vm);
    }
    if (options.methods) {
      initMethods(vm, options.methods);
    }
  }
  function proxy(target, key, name) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[name][key];
      },
      set: function set(newValue) {
        target[name][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; // 重新从vm身上获取到data属性
    data = typeof data === "function" ? data.call(vm) : data; // data可能是对象或函数
    // console.log(data)
    observe(data); // 调用observe方法对data进行响应式处理
    vm._data = data; // 将vm.$options上面的data赋给vm._data

    for (var key in data) {
      proxy(vm, key, '_data'); // 将vm._data中的数据代理到vm中，可以不用通过vm._data.xxx来访问数据
    }
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {}; // vm._computedWatchers存放着所有计算属性的计算属性watcher({lazy: true})

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, {
        lazy: true
      }); // lazy属性表明该watcher经过new之后不会调用更新页面的方法, 并将该watcher存放在vm的_computedWatchers中

      defineComputed(vm, key, userDef); // defineComputed()方法用于实现计算属性
    }
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;
    for (var key in watch) {
      // 循环用户传入的被监测属性
      var handler = watch[key];
      if (typeof handler === 'string') {
        // 如果watch中写的是一个字符串, 会去methods中找同名的方法, 该属性变化后执行methods中对应的方法
        createWatcher(vm, key, vm[handler]);
      } else if (Array.isArray(handler)) {
        // 如果被监测属性后面写的是一个数组, 则属性变化后执行数组中的所有回调
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        // watch中写的是函数, 在属性变化后直接调用
        createWatcher(vm, key, handler);
      }
    }
  }
  function initProps(vm) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    Object.keys(propsData).forEach(function (key) {
      defineReactive(props, key, propsData[key]);
      if (!(key in vm)) {
        proxy(vm, key, '_props');
      }
    });
  }
  function initMethods(vm, methods) {
    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? function () {} : methods[key].bind(vm);
    }
  }
  var target;
  function add(event, fn) {
    target.$on(event, fn);
  }
  function remove(event, fn) {
    target.$off(event, fn);
  }
  function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = resolveScopedSlots(options._renderChildren);
    /* vm.$scopedSlots = parentVnode
        ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots)
        : emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    // @ts-expect-error
    vm._c = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    // @ts-expect-error
    vm.$createElement = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, true); };
    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data; */
    /* istanbul ignore else */
    /* {
        defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, function () {
            !isUpdatingChildComponent && warn$2("$attrs is readonly.", vm);
        }, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
            !isUpdatingChildComponent && warn$2("$listeners is readonly.", vm);
        }, true);
    } */
  }

  function resolveSlots(children, context) {
    if (!children || !children.length) {
      return {};
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
        var name_1 = data.slot;
        var slot = slots[name_1] || (slots[name_1] = []);
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots["default"] || (slots["default"] = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    /* for (var name_2 in slots) {
        if (slots[name_2].every(isWhitespace)) {
            delete slots[name_2];
        }
    } */
    return slots;
  }
  function resolveScopedSlots(children) {
    if (!children || !children.length) {
      return {};
    }
    var scopedSlots = {};
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var data = child.data;
      if (data && data.scopedSlots != null) {
        var slot = data.scopedSlots;
        scopedSlots = _objectSpread2(_objectSpread2({}, scopedSlots), slot);
      }
    }
    return scopedSlots;
  }
  function initEvents(vm) {
    vm._events = Object.create(null);
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }
  function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove);
    target = undefined;
  }
  function updateListeners(on, oldOn, add, remove) {
    var name, cur, old;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      if (old === undefined) {
        if (cur.fns === undefined) {
          cur = on[name];
        }
        add(name, cur);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (on[name] === undefined) {
        remove(name, oldOn[name]);
      }
    }
  }
  function createWatcher(vm, target, cb) {
    // 无论watch有几种形式, 最终都转化为vm.$watch, 去构建用户自定义watcher
    vm.$watch(target, cb);
  }
  function defineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    var setter = typeof userDef === 'function' ? function () {} : userDef.set;

    // 计算属性本质是一个响应式的属性, 利用Object.defineProperty()实现
    Object.defineProperty(target, key, {
      get: createComputedGetter(key),
      set: setter
    });
  }
  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key]; // 获取对应计算属性的计算属性watcher({lazy: true})
      // debugger
      if (watcher.dirty) {
        // 如果watcher的dirty属性为真, 则计算属性所依赖的属性发生了变化, 计算属性需要去更新(如果同一个计算属性在组件中使用多次, 则第一次计算时dirty为真, 计算完成后dirty改为假, 只要依赖的属性不更新, 那么后面的相同计算属性就不用再求值)
        watcher.evaluate(); // 调用evaluate()方法进行计算属性的求值, 并将该计算属性的dirty改为假
      }

      if (Dep.target) {
        watcher.depend(); // 此时计算属性watcher已经出栈, 再让计算属性所依赖的属性的dep记录下渲染watcher
      }
      // console.log(watcher)

      return watcher.value;
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  function parseHTML(htmlText) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var currentNode; // currentNode指针指向栈中的最后一个节点
    var root; // AST语法树的根节点

    // createASTNode方法返回一个AST语法树节点
    function createASTNode(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        attrs: attrs,
        parent: null,
        children: []
      };
    }

    /* function createASTElement(ASTNode) {
        return {
            type: 1,
            tag: ASTNode.tag,
            attrsList: ASTNode.attrs,
            parent: ASTNode.parent,
            children: ASTNode.children
        }
    } */

    // advance方法用来对HTML的文本进行截取, 将解析后的标签去除
    function advance(n) {
      htmlText = htmlText.substring(n);
    }

    // start方法用来创建开始标签对应的AST语法树节点
    function start(tag, attrs) {
      var startNode = createASTNode(tag, attrs);

      // 如果指针非空, 则存在父节点
      if (currentNode) {
        startNode.parent = currentNode; // 当前节点的parent指向父节点
        currentNode.children.push(startNode); // 在父节点的children属性中加入当前节点
        if (tag !== 'input') currentNode = startNode; // 当前节点作为父节点
      }

      // 不存在父节点的情况, 即初次调用该方法
      if (!root) {
        root = startNode; // 当前节点作为根节点
        currentNode = root; // 当前节点作为父节点
      }
      /* startNode.el = createASTElement(startNode)
      console.log(startNode) */
    }

    // text方法用来创建文本对应的AST语法树节点
    function text(_char) {
      _char = _char.replace(/\s/g, ''); // 删去文本中的空格

      // 对父节点的children属性添加该文本
      currentNode.children.push({
        type: TEXT_TYPE,
        text: _char,
        parent: currentNode
      });
    }

    // end方法用来处理结束标签
    function end(name) {
      currentNode = currentNode.parent; // 父节点指针指向当前节点的父节点
    }

    // parseStartTag方法用来读取开始标签的标签名, 标签属性
    function parseStartTag() {
      var tagStart = htmlText.match(startTagOpen); // 当前HTML文本是否匹配开始标签
      var tagAttrs, tagEnd;
      if (tagStart) {
        // 将当前开始标签的标签名保存在match中
        var match = {
          tagName: tagStart[1],
          attrs: []
        };
        advance(tagStart[0].length); // 删去HTML文本中的当前开始标签的标签名

        // 没有匹配上结束标签且匹配上了标签属性, 开始解析标签属性
        while (!(tagEnd = htmlText.match(startTagClose)) && (tagAttrs = htmlText.match(attribute) || htmlText.match(dynamicArgAttribute))) {
          if (tagAttrs) {
            match.attrs.push({
              name: tagAttrs[1],
              value: tagAttrs[3] || tagAttrs[4] || tagAttrs[5] || true
            }); // 若存在标签属性, 则将标签属性写入match中
            advance(tagAttrs[0].length); // 删去HTML文本中的当前标签属性
          }
        }

        // 匹配上了结束标签
        if (tagEnd) {
          advance(tagEnd[0].length); // 删去HTML文本中的当前结束标签
        }
        // console.log(match)
        return match; // 将解析完的开始标签对象match返回
      }

      // 未匹配上开始标签
      return false;
    }

    // 该循环将HTML文本进行截取, 分解为开始标签, 标签体以及结束标签, 并调用相应的处理方法形成AST语法树
    while (htmlText) {
      // debugger
      htmlText = htmlText.trim(); // 清除HTML文本中的所有开始结束位置的空格和换行符
      var textEnd = htmlText.indexOf('<');
      if (textEnd === 0) {
        // 当前HTML文本的开始是一个标签

        var startTagMatch = parseStartTag(); // 匹配开始标签, 如果匹配到, 调用start方法去处理
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = htmlText.match(endTag); // 匹配结束标签, 如果匹配到, 调用end方法去处理
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      if (textEnd > 0) {
        // 当前HTML文本的开始不是标签, 应为标签体
        var _char2 = htmlText.substring(0, textEnd); // 将不是标签的这段HTML截取出来

        if (_char2) {
          // 调用text方法处理标签体
          advance(textEnd);
          text(_char2);
          continue;
        }
        break;
      }
    }
    return root;
  }

  function compileToFunction(template) {
    // parseHTML方法用来将HTML文本转换成AST语法树
    var ast = parseHTML(template);
    var astCode = codeGenerator(ast);
    console.log(astCode);
    astCode = "with(this){return ".concat(astCode, "}");
    return new Function(astCode);
  }

  // attrsGenerator()函数用来生成标签属性的字符串函数
  function attrsGenerator(attrs) {
    var bindRE = /^:|^v-bind:/;
    var onRE = /^@|^v-on:/;
    var attrString = '{';
    var _loop = function _loop() {
      var attrValue = attrs[i].value;
      if (attrs[i].name === 'v-if') ;
      if (attrs[i].name === 'style') {
        var styleAttrValue = '';
        attrs[i].value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            name = _item$split2[0],
            value = _item$split2[1];
          var styleString = "\"".concat(name.trim(), "\": \"").concat(value.trim(), "\", ");
          styleAttrValue += styleString;
        });
        attrValue = "{".concat(styleAttrValue.slice(0, styleAttrValue.length - 2), "}");
        attrString += "".concat(attrs[i].name, ": ").concat(attrValue, ", ");
      } else if (bindRE.test(attrs[i].name)) {
        attrString += "\"".concat(attrs[i].name.replace(bindRE, ''), "\": ").concat(attrValue, ", ");
      } else if (onRE.test(attrs[i].name)) {
        if (/=>/.test(attrValue)) {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, ''), "\": function($event){return (").concat(attrValue, ").apply(null, arguments)}}, ");
        } else if (/\(/.test(attrValue)) {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, ''), "\": function($event){return ").concat(attrValue, "}}, ");
        } else if (/\.prevent/.test(attrValue)) {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, '').replace(/\.prevent/, ''), "\": function($event){$event.preventDefault();return ").concat(attrValue, "}}, ");
        } else if (/\.stop/.test(attrValue)) {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, '').replace(/\.stop/, ''), "\": function($event){$event.stopPropagation();return ").concat(attrValue, "}}, ");
        } else if (/\.native/.test(attrValue)) {
          attrString += "nativeOn: {\"".concat(attrs[i].name.replace(onRE, '').replace(/\.native/, ''), "\": function($event){return ").concat(attrValue, "}}, ");
        } else if (/\.enter/.test(attrValue)) {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, '').replace(/\.enter/, ''), "\": function($event) {if ($event.type.indexOf('key') !== 13) return null;return (").concat(attrValue, ").apply(null, arguments)}}, ");
        } else {
          attrString += "on: {\"".concat(attrs[i].name.replace(onRE, ''), "\": ").concat(attrValue, "}, ");
        }
      } else if (attrs[i].name === 'v-show') {
        attrString += "directives: [{name: \"show\", rawName: \"v-show\", value: (".concat(attrValue, "), expression: \"").concat(attrValue, "\"}], ");
      } else if (attrs[i].name === 'v-slot') {
        attrString += "slot: '".concat(attrValue, "', ");
      } else {
        attrValue = "\"".concat(attrValue, "\"");
        attrString += "".concat(attrs[i].name, ": ").concat(attrValue, ", ");
      }
      // attrString += `${attrs[i].name}: ${attrValue}, `
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return attrString.slice(0, attrString.length - 2) + '}';
  }
  function codeGenerator(ast) {
    var attrs = ast.attrs;
    var hasDirective = false;
    if (ast.attrs) {
      var _loop2 = function _loop2(i) {
        var attrValue = attrs[i].value;
        // console.log(attrs[i].name, /v-/.test(attrs[i].name) && ['v-on', 'v-bind', 'v-slot', 'v-show'].every(attr => attrs[i].name.indexOf(attr) < 0))
        if (attrs[i].name === 'v-if') {
          hasDirective = true;
          attrs.splice(i, 1);
          return {
            v: "(".concat(attrValue, ") ? _c('").concat(ast.tag, "', ").concat(attrs.length ? attrsGenerator(attrs) : null).concat(ast.children ? ", ".concat(childrenGenerator(ast.children)) : '', ") : _e()")
          };
        } else if (attrs[i].name === 'v-for') {
          var iterable, iterator;
          hasDirective = true;
          attrs.splice(i, 1);
          if (/\sin\s/.test(attrValue)) {
            var _attrValue$split = attrValue.split(' in ');
            var _attrValue$split2 = _slicedToArray(_attrValue$split, 2);
            iterator = _attrValue$split2[0];
            iterable = _attrValue$split2[1];
          } else if (/\sof\s/.test(attrValue)) {
            var _attrValue$split3 = attrValue.split(' of ');
            var _attrValue$split4 = _slicedToArray(_attrValue$split3, 2);
            iterator = _attrValue$split4[0];
            iterable = _attrValue$split4[1];
          }
          return {
            v: "_l((".concat(iterable, "), function").concat(iterator, "{return _c('").concat(ast.tag, "', ").concat(attrs.length ? attrsGenerator(attrs) : null).concat(ast.children ? ", ".concat(childrenGenerator(ast.children)) : '', ")})")
          };
        } else if (attrs[i].name === 'v-model') {
          if (ast.tag === 'input') {
            var type = attrs.filter(function (attr) {
              return attr.name === 'type';
            })[0].value || 'text';
            if (type === 'text') {
              return {
                v: "_c('input', {directives: [{name: \"model\", rawName: \"v-model\", value: (".concat(attrValue, "), expression: \"").concat(attrValue, "\"}], attrs: {type: 'text'}, on:{\"input\":function($event){").concat(attrValue, " = $event.target.value}}})")
              };
            } else if (type === 'checkbox') {
              return {
                v: "_c('input', {directives: [{name: \"model\", rawName: \"v-model\", value: (".concat(attrValue, "), expression: \"").concat(attrValue, "\"}], attrs: {type: 'checkbox'}, on: {\"change\": function ($event) {var $$a = ").concat(attrValue, ",$$el = $event.target,$$c = $$el.checked ? (true) : (false);if (Array.isArray($$a)) {var $$v = null,$$i = _i($$a, $$v);if ($$el.checked) {$$i < 0 && (").concat(attrValue, " = $$a.concat([$$v]))} else {$$i > -1 && (").concat(attrValue, " = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))}} else {").concat(attrValue, " = $$c}}}})")
              };
            }
          } else {
            return {
              v: "_c('".concat(ast.tag, "', {model: { value: (").concat(attrValue, "), callback: function ($$v) {").concat(attrValue, " = $$v},expression: \"").concat(attrValue, "\"}})")
            };
          }
        } else if (/v-/.test(attrs[i].name) && ['v-on', 'v-bind', 'v-slot', 'v-show'].every(function (attr) {
          return attrs[i].name.indexOf(attr) < 0;
        })) {
          var _attrs$i$name$split = attrs[i].name.split(':'),
            _attrs$i$name$split2 = _slicedToArray(_attrs$i$name$split, 2),
            name = _attrs$i$name$split2[0],
            arg = _attrs$i$name$split2[1];
          return {
            v: "_c('".concat(ast.tag, "', {directives: [{name: \"").concat(name.replace('v-', ''), "\",rawName: \"").concat(attrs[i].name, "\",value: (").concat(attrValue, "),expression: \"").concat(attrValue, "\"").concat(arg ? ",arg: \"".concat(arg, "\"") : "", "}]})")
          };
        } else if (attrs[i].name === 'slot-scope') {
          attrs.splice(i, 1);
          var slotName = 'default';
          for (var _i = 0; _i < attrs.length; _i++) {
            if (attrs[_i].name === 'slot') {
              slotName = attrs[_i].value;
              attrs.splice(_i, 1);
              break;
            }
          }
          return {
            v: "_c('".concat(ast.tag, "', {scopedSlots: _u([{key: \"").concat(slotName, "\", fn: function (").concat(attrValue, ") {return ").concat(codeGenerator(ast), "}}])})")
          };
        }
      };
      for (var i = 0; i < attrs.length; i++) {
        var _ret = _loop2(i);
        if (_typeof(_ret) === "object") return _ret.v;
      }
      if (!hasDirective) {
        return "_c('".concat(ast.tag, "', ").concat(attrs.length ? attrsGenerator(attrs) : null).concat(ast.children ? ", ".concat(childrenGenerator(ast.children)) : '', ")");
      }
    } else {
      return "_c('".concat(ast.tag, "', ").concat(ast.children ? ", ".concat(childrenGenerator(ast.children)) : '', ")");
    }
  }

  // _c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello" + _s(hobbys))), _c('span', {on: {"click": function($event){return (() => cb(5)).apply(null, arguments)}}, ref: "age"}, _v(_s(age))), _c('mycomponent', {a: "1", b: "2", "c": age, on: {"myevent": cb}, ref: "mycomponent"}, ))
  // _c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello" + _s(hobbys))), (age) ? _c('span', {on: {"click": function($event){return (() => cb(5)).apply(null, arguments)}}, ref: "age"}, _v(_s(age))) : _e(), _c('mycomponent', {a: "1", b: "2", "c": age, on: {"myevent": cb}, ref: "mycomponent"}, ))

  // childrenGenerator()函数用来生成子标签的字符串函数
  function childrenGenerator(children) {
    var childrenArr = [];
    children.map(function (child) {
      childrenArr.push(genChild(child));
    });
    return "[".concat(childrenArr.join(', '), "]");
    // return children.map(child => genChild(child)).join(', ')
  }

  function genChild(child) {
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // defaultTagRE正则用来匹配{{ 插值 }} 语法
    if (child.type === 1 && child.tag !== 'slot') {
      return codeGenerator(child); // 如果是普通节点, 直接调用codeGenerator()生成字符串函数
    } else if (child.tag === 'slot') {
      var name = 'default';
      var props = [];
      child.attrs.forEach(function (attr) {
        if (attr.name === 'name') {
          name = attr.value;
        } else if (/^:|^v-bind:/.test(attr.name)) {
          props.push("\"".concat(attr.name.replace(/^:|^v-bind:/, ''), "\": ").concat(attr.value));
        }
      });
      if (!props.length) {
        return "_t('".concat(name, "')");
      } else {
        return "_t('".concat(name, "', {").concat(props.join(', '), "})");
      }
    } else {
      // 文本节点
      if (!defaultTagRE.test(child.text)) {
        // 没有匹配到插值语法, 直接将文本转化为 _v(文本)
        return "_v('".concat(child.text, "')");
      }
      defaultTagRE.lastIndex = 0; // 带有g的正则表达式, lastIndex属性需要置0
      var tokens = [];
      var match;
      var lastIndex = 0;
      while (match = defaultTagRE.exec(child.text)) {
        var index = match.index; // index等于当前匹配到插值的位置

        if (index > lastIndex) {
          // index大于上次匹配到插值的位置, 说明两个插值之间存在文本, 需要将这段文本插入到tokens里面
          tokens.push("\"".concat(match.input.slice(lastIndex, index).trim(), "\""));
        }
        tokens.push("_s(".concat(match[1], ")")); // 将插值里面的内容包上_s(插值)插入到tokens

        lastIndex = defaultTagRE.lastIndex;
        // console.log(match, index, lastIndex)
      }

      if (lastIndex < child.text.length) {
        // 最后一次匹配到插值的位置小于文本长度, 说明后面还有文本, 需要继续将文本插入tokens
        tokens.push("\"".concat(child.text.slice(lastIndex, child.text.length), "\""));
      }
      // console.log(tokens)
      return "_v(".concat(tokens.join(' + '), ")");
    }
  }

  /* 
  codeGenerator()方法用来将AST语法树转化为字符串函数：
  例：
  <div id="root">
      <div id = "app" style = "background-color: #ccc; color: red">
          {{name}} Hello {{name}} Hello
      </div>
      <span>{{age}}</span>
  </div>
  上述DOM的AST转化为：
  _c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello")), _c('span', null, _v(_s(age))))
   */

  /* function codeGenerator(ast) {
      return (
          `_c('${ast.tag}', ${ast.attrs.length ? attrsGenerator(ast.attrs) : null}${ast.children ? `, ${childrenGenerator(ast.children)}` : ''})`
      )
  } */

  function patch(oldValue, newValue) {
    // patch方法接收两个参数, oldValue为虚拟DOM（初次挂载情况）或者更新前的真实DOM（更新DOM情况）, 对真实DOM做初次挂载或更新
    if (!oldValue) {
      // 组件的挂载
      return createElement(newValue); // 返回vm.$el, 此时vm.$el就是组件渲染的结果
    }

    var isRealElement = oldValue.nodeType; // 判断是否为真实DOM

    if (isRealElement) {
      // oldValue为真实DOM, 进行更新
      var newElement = createElement(newValue);
      var parentElement = oldValue.parentNode;
      parentElement.insertBefore(newElement, oldValue.nextSibling);
      parentElement.removeChild(oldValue);
      return newElement;
    } else {
      // oldValue为虚拟DOM, 利用diff算法进行比较
      return patchVnode(oldValue, newValue);
    }
  }
  function patchVnode(oldVnode, newVnode) {
    // 虚拟DOM的Diff算法
    if (!isSameVnode(oldVnode, newVnode)) {
      // 两个虚拟DOM标签名或者key不同, 即不是相同节点, 直接替换
      var _el = createElement(newVnode);
      oldVnode.el.parentNode.replaceChild(_el, oldVnode.el);
      return _el;
    }
    var el = newVnode.el = oldVnode.el; // 是相同节点, 则复用老节点元素 

    if (oldVnode._isComponent) updateComponent(oldVnode, newVnode);
    if (!oldVnode.tag) {
      // 是文本节点, 比较文本的内容
      if (newVnode.text != oldVnode.text) {
        el.textContent = newVnode.text;
      }
    }

    // 接下来需要对比标签属性
    patchProps(el, oldVnode, newVnode);

    // 接下来需要对比子节点
    patchChildren(el, oldVnode.children || [], newVnode.children || []);
    return el;
  }
  function patchProps(el, oldVnode, newVnode) {
    var oldProps = oldVnode.data || {};
    var newProps = newVnode.data || {};
    var oldStyle = oldProps.style || {};
    var newStyle = newProps.style || {};
    for (var key in oldStyle) {
      // 老节点中有新节点没有的样式, 将老节点中的该样式删除
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    }
    for (var _key in oldProps) {
      // 老节点中有新节点没有的标签属性, 将老节点中的该标签属性删除
      if (!newProps[_key] && _key !== 'on') {
        el.removeAttribute(_key);
      }
    }
    for (var _key2 in newProps) {
      // 新老节点都有的属性, 循环更新节点属性
      if (_key2 === 'attrs') {
        Object.keys(newProps.attrs).forEach(function (attrName) {
          return el.setAttribute(attrName, newProps.attrs[attrName]);
        });
      } else if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'on') ; else if (_key2 === 'ref') ; else if (_key2 === 'props') {
        oldProps.props = newProps.props;
      } else if (_key2 === 'hook') ; else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
    if (newVnode.directives) {
      newVnode.directives.forEach(function (directive) {
        if (directive.name === 'show') {
          el.removeAttribute('style');
          // console.log(typeof directive.value, `display: ${directive.value ? 'block' : 'none'}`)
          el.setAttribute('style', "display: ".concat(directive.value ? 'block' : 'none'));
        } else if (directive.name === 'model') {
          if (el.nodeName === 'INPUT') {
            if (newVnode.data.attrs.type === 'text') {
              newVnode.el.value = directive.value;
            } else if (newVnode.data.attrs.type === 'checkbox') {
              newVnode.el.checked = directive.value;
            }
          }
        } else {
          console.log(newVnode);
          Object.keys(newVnode.vm.$options.directives).forEach(function (key) {
            if (key === directive.name) {
              var directiveMatch = newVnode.vm.$options.directives[key];
              if (directiveMatch) directiveMatch.update(newVnode.el, directive);
            }
          });
        }
      });
    }
    return el;
  }
  function patchChildren(el, oldChildren, newChildren) {
    if (oldChildren.length && newChildren.length) {
      // 新老节点中都有子元素, 进行完整的对比
      updateChildren(el, oldChildren, newChildren);
    } else if (!oldChildren.length) {
      // 老节点没有子元素, 则将新节点所有子元素挂在el上
      newChildren.forEach(function (child) {
        el.appendChild(createElement(child));
        /* const childElement = createElement(child)
        el.appendChild(childElement)
        console.log(child) */
      });
    } else if (!newChildren.length) {
      // 新节点没有子元素, 则将el中所有子元素删除
      el.innerHTML = '';
    }
    return el;
  }
  function updateChildren(el, oldChildren, newChildren) {
    // 采用双指针, 同级比对子节点
    var oldChildrenStartIndex = 0;
    var newChildrenStartIndex = 0;
    var oldChildrenEndIndex = oldChildren.length - 1;
    var newChildrenEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[oldChildrenStartIndex];
    var newStartVnode = newChildren[newChildrenStartIndex];
    var oldEndVnode = oldChildren[oldChildrenEndIndex];
    var newEndVnode = newChildren[newChildrenEndIndex];
    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (child, index) {
        return map[child.key] = index;
      });
      return map;
    }
    var map = makeIndexByKey(oldChildren);

    // if (oldChildrenEndIndex === 0 && newChildrenEndIndex === 0) patchVnode(oldStartVnode, newStartVnode)

    while (oldChildrenStartIndex !== oldChildrenEndIndex || newChildrenStartIndex !== newChildrenEndIndex) {
      // 如果新旧子节点有一方的头指针与尾指针重合, 说明对比已经结束
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldChildrenStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[__oldChildrenEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果新旧节点中的头节点相同, 从头开始对比(这样比较对数组尾部操作(push, pop等)效率较高)
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldChildrenStartIndex]; // 每次比对后, 新旧节点的头指针向后移动到下一个节点
        newStartVnode = newChildren[++newChildrenStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 如果新旧节点中的尾节点相同, 从后面开始对比(这样比较对数组头部操作(shift, unshift等)效率较高)
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldChildrenEndIndex];
        newEndVnode = newChildren[--newChildrenEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 新的头节点与旧的尾节点相同, 进行交叉对比(这样比较对数组的排序操作(reverse, sort等)效率较高)
        patchVnode(oldEndVnode, newStartVnode);
        el.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldChildrenEndIndex];
        newStartVnode = newChildren[++newChildrenStartIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 旧的头节点与新的尾节点相同, 进行交叉对比(这样比较对数组的排序操作(reverse, sort等)效率较高)
        patchVnode(oldStartVnode, newEndVnode);
        el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldChildrenStartIndex];
        newEndVnode = newChildren[--newChildrenEndIndex];
      } else {
        // 新旧节点的头尾都不相同, 想要尽量复用节点, 进行乱序对比
        var moveIndex = map[newStartVnode.key];
        if (moveIndex != undefined) {
          var moveVnode = oldChildren[moveIndex];
          el.insertBefore(moveVnode.el, oldStartVnode.el);
          oldChildren[moveIndex] = undefined;
          patch(moveVnode, newStartVnode);
        } else {
          el.insertBefore(createElement(newStartVnode).el, oldStartVnode.el);
        }
        newStartVnode = newChildren[++newChildrenStartIndex];
      }
    }
    patchVnode(oldStartVnode, newStartVnode); // 如果children只有一项的情况/双指针重合但双指针所指的节点还没有比对

    if (oldChildrenStartIndex < oldChildrenEndIndex) {
      // 对比结束后旧节点中还有子节点的情况, 说明删除了部分旧节点, 应当把这些剩余的子节点删除
      for (var index = oldChildrenStartIndex; index <= oldChildrenEndIndex; index++) {
        var _childEl = oldChildren[index].el;
        el.removeChild(_childEl);
      }
    }
    if (newChildrenStartIndex < newChildrenEndIndex) {
      // 对比结束后新节点中还有子节点的情况, 说明增加了新节点, 应当把这些子节点挂在el上
      for (var _index = newChildrenStartIndex; _index <= newChildrenEndIndex; _index++) {
        // el.appendChild(createElement(newChildren[index]))
        var anchor = newChildren[newChildrenEndIndex + 1] ? newChildren[newChildrenEndIndex + 1].el : null; // 新节点有可能向前或者向后插入, 经过比对后如果新节点的尾指针后面没有元素, 说明是向后插入；如果后面有元素, 说明是向前插入
        el.insertBefore(childEl, anchor); // 如果anchor是null, 默认是appendChild
      }
    }
  }

  function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    /* var prevVNode = vm.$vnode
    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode // update vm's placeholder node without re-render
    if (vm._vnode) {
        // update child tree's parent
        vm._vnode.parent = parentVnode
    }
    vm.$options._renderChildren = renderChildren
    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    var attrs = parentVnode.data.attrs || emptyObject;
    if (vm._attrsProxy) {
        // force update if attrs are accessed and has changed since it may be
        // passed to a child component.
        if (syncSetupProxy(vm._attrsProxy, attrs, (prevVNode.data && prevVNode.data.attrs) || emptyObject, vm, '$attrs')) {
            needsForceUpdate = true;
        }
    } */
    var attrs = parentVnode.data.attrs || {};
    vm.$attrs = attrs;
    vm.$options._renderChildren = renderChildren;
    var needsForceUpdate = !!(renderChildren ||
    // has new static slots
    vm.$options._renderChildren ||
    // has old static slots
    hasDynamicScopedSlot);
    /* // update listeners
    listeners = listeners || emptyObject;
    var prevListeners = vm.$options._parentListeners;
    if (vm._listenersProxy) {
        syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, '$listeners');
    }
    vm.$listeners = vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, prevListeners); */
    // update props
    if (propsData && vm.$options.props) {
      var props = vm._props;
      Object.keys(propsData).forEach(function (key) {
        props[key] = propsData[key];
      });
      vm.$options.propsData = propsData;
    }
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm._watcher.update();
    }
  }
  function createComponent(vnode) {
    // createComponent()方法判断虚拟DOM是否为组件节点, 如果是组件节点, 再调用其_init()方法
    var i = vnode.data;
    if ((i = i.hook) && (i = i._init)) {
      // 组件节点的vnode中的data具有hook属性, 先将i赋值为vnode.data.hook, 再将i赋值为vnode.data.hook._init
      i(vnode);
    }
    if (vnode.componentInstance) {
      return true;
    }
  }
  function updateComponent(oldVnode, newVnode) {
    var i = newVnode.data;
    if (i && (i = i.hook) && (i = i.prepatch)) {
      i(oldVnode, newVnode);
    }
  }
  function createElement(vnode) {
    // createElement()方法将虚拟DOM转换为真实DOM
    var vm = vnode.vm,
      tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text,
      directives = vnode.directives;
    if (typeof tag === 'string') {
      // 普通节点
      // debugger
      if (createComponent(vnode)) {
        // 组件节点
        return vnode.componentInstance.$el;
      }
      vnode.el = document.createElement(tag);
      for (var key in data) {
        if (key === 'attrs') {
          Object.keys(data.attrs).forEach(function (attrName) {
            return vnode.el.setAttribute(attrName, data.attrs[attrName]);
          });
        } else if (key === 'style') {
          var styleString = '';
          for (var styleKey in data.style) {
            styleString += "".concat(styleKey, ": ").concat(data.style[styleKey], "; ");
          }
          vnode.el.setAttribute('style', styleString.slice(0, -2));
        } else if (key === 'on') {
          Object.keys(data.on).forEach(function (handlerName) {
            vnode.el.addEventListener(handlerName, data.on[handlerName]);
          });
        } else if (key === 'ref') {
          vm.$refs[data.ref] = vnode.el;
        } else {
          vnode.el.setAttribute(key, data[key]);
        }
      }
      if (children.length) {
        children.forEach(function (item) {
          if (item._isVList) {
            item.forEach(function (vlistItem) {
              var childElement = createElement(vlistItem);
              vnode.el.appendChild(childElement);
              if (item.directives) {
                item.directives.forEach(function (directive) {
                  Object.keys(vm.$options.directives).forEach(function (key) {
                    if (key === directive.name) {
                      var directiveMatch = vm.$options.directives[key];
                      if (directiveMatch) {
                        vm.$options.insertedDirectivesToResolve = vm.$options.insertedDirectivesToResolve || {};
                        vm.$options.insertedDirectivesToResolve[key] = {
                          element: childElement,
                          binding: directive
                        };
                      }
                    }
                  });
                });
              }
            });
          } else {
            var childElement = createElement(item);
            vnode.el.appendChild(childElement);
            if (item.directives) {
              item.directives.forEach(function (directive) {
                Object.keys(vm.$options.directives).forEach(function (key) {
                  if (key === directive.name) {
                    var directiveMatch = vm.$options.directives[key];
                    if (directiveMatch) {
                      vm.$options.insertedDirectivesToResolve = vm.$options.insertedDirectivesToResolve || {};
                      vm.$options.insertedDirectivesToResolve[key] = {
                        element: childElement,
                        binding: directive
                      };
                    }
                  }
                });
              });
            }
          }
        });
      }
    } else {
      // 真实节点
      vnode.el = document.createTextNode(text);
    }
    if (directives) {
      directives.forEach(function (directive) {
        if (directive.name === 'show') {
          vnode.el.setAttribute('style', "display: ".concat(directive.value ? 'block' : 'none'));
        } else if (directive.name === 'model') {
          if (vnode.el.nodeName === 'INPUT') {
            if (vnode.data.attrs.type === 'text') {
              vnode.el.value = directive.value;
            } else if (vnode.data.attrs.type === 'checkbox') {
              vnode.el.checked = directive.value;
            }
          }
        } else {
          Object.keys(vm.$options.directives).forEach(function (key) {
            if (key === directive.name) {
              var directiveMatch = vm.$options.directives[key];
              if (directiveMatch) directiveMatch.bind(vnode.el, directive);
            }
          });
        }
      });
    }
    return vnode.el;
  }

  function createElementVNode(vm, tag, data) {
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    // createElementVNode()方法生成普通节点的虚拟DOM
    if (data == null) data = {};
    var key = data.key;
    if (key !== undefined) delete data.key;
    var directives = data.directives;
    if (directives) delete data.directives;
    if (Array.isArray(children[0])) children = children[0];
    if (isReservedTag(tag)) {
      // HTML节点
      return vnode(vm, tag, key, data, children, null, undefined, false, directives);
    } else {
      // 组件节点
      var Ctor = vm.$options.components[tag]; // Ctor是组件的构造函数, 是在vm.$options.components的原型链上找到的
      // console.log(vm.$options.components.__proto__)
      return createComponentVnode(vm, tag, key, data, children, Ctor, directives);
    }
  }
  function createTextVNode(vm, text) {
    // createTextVNode()方法生成文本节点的虚拟DOM
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function createEmptyVNode() {
    var text = '';
    return vnode(undefined, undefined, undefined, undefined, undefined, text);
  }
  function createComponentVnode(vm, tag, key, data, children, Ctor, directives) {
    // createComponentVnode()方法生成组件的虚拟DOM
    // Ctor = typeof Ctor === 'object' ? vm.__proto__.constructor.extend(Ctor) : Ctor
    // console.log(vm.__proto__.constructor = vm.$options._base) // 可以不用通过vm.$options._base拿到Vue构造函数上的静态方法
    if (_typeof(Ctor) === 'object') {
      Ctor = vm.$options._base.extend(Ctor);
    }
    var propsData = extractPropsFromVNodeData(data, Ctor);
    var listeners = data.on;
    data.on = data.nativeOn;
    var ref = data.ref;
    delete data.ref;
    if (data.model) transformModel(Ctor.options, data);
    data.hook = {
      // 标识该虚拟DOM是组件节点, 同时保存其挂载方法
      _init: function _init(vnode) {
        var instance = vnode.componentInstance = new vnode.componentOptions.Ctor(vnode); // 获取该节点的构造函数Ctor随后实例化, 并将该组件实例挂在vnode.componentInstance上
        if (vnode.directives) instance.directives = vnode.directives;
        callHook(vnode.componentInstance, 'beforeMount');
        instance.$mount(); // 调用组件实例的$mount()方法 -> 调用mountComponent()方法, instance上会增加$el
        callHook(vnode.componentInstance, 'mounted');
        if (instance.directives) {
          instance.directives.forEach(function (directive) {
            if (directive.name === 'show') {
              console.log(instance);
              instance.$el.setAttribute('style', "display: ".concat(directive.value ? 'block' : 'none'));
            }
          });
        }
      },
      prepatch: function prepatch(oldVnode, vnode) {
        var options = vnode.componentOptions;
        var child = vnode.componentInstance = oldVnode.componentInstance;
        updateChildComponent(child, options.propsData,
        // updated props
        options.listeners,
        // updated listeners
        vnode,
        // new parent vnode
        options.children // new children
        );
      }
    };

    return vnode(vm, tag, key, data, undefined, null, {
      Ctor: Ctor,
      propsData: propsData,
      listeners: listeners,
      ref: ref,
      children: children
    }, true, directives);
  }
  function vnode(vm, tag, key, data, children, text, componentOptions, _isComponent, directives) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text,
      componentOptions: componentOptions,
      _isComponent: _isComponent,
      directives: directives
    };
  }
  function isReservedTag(tag) {
    // 判断节点是否是组件节点
    return ['a', 'div', 'p', 'span', 'button', 'ul', 'li', 'html', 'body', 'head', 'link', 'meta', 'style', 'title', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'section', 'dd', 'dl', 'dt', 'img', 'input', 'checkbox'].includes(tag);
  }
  function isSameVnode(vnode1, vnode2) {
    // 比较两个虚拟DOM是否相同：1、标签名是否相同；2、标签的key是否相同
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }
  function extractPropsFromVNodeData(data, Ctor) {
    var propOptions = Ctor.options.props;
    if (!propOptions) return;
    var res = {};
    for (var key in propOptions) {
      checkProp(res, data, propOptions[key]);
    }
    return res;
  }
  function checkProp(res, data, key) {
    if (!data.props) data.props = {};
    if (data[key] !== undefined) {
      res[key] = data[key];
      data.props[key] = data[key];
      delete data[key];
    } else {
      delete data.props[key];
    }
  }
  function transformModel(options, data) {
    var prop = options.model && options.model.prop || 'value';
    var event = options.model && options.model.event || 'input';
    (data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  // initLifeCycle()方法用来给Vue添加_c, _v, _s, _render, _update方法
  function initLifeCycle(Vue) {
    Vue.prototype._c = function () {
      // _c()方法调用createElementVNode()将AST语法树中的普通节点转换为虚拟DOM
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      // _v()方法调用createTextVNode()将AST语法树中的文本节点转换为虚拟DOM
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      // _s()方法将插值语法转换为值
      if (_typeof(value) == 'object') return value;
      // return JSON.stringify(value)
      return value;
    };
    Vue.prototype._e = function () {
      return createEmptyVNode();
    };
    Vue.prototype._l = function (val, render) {
      var children = [];
      if (Array.isArray(val) || typeof val === 'string') {
        for (var _i = 0; _i < val.length; _i++) {
          children.push(render(val[_i], _i));
          children._isVList = true;
        }
      } else if (typeof val === 'number') {
        for (i = 0; i < val; i++) {
          children[i] = render(i + 1, i);
        }
      } else if (_typeof(val) === 'object') {
        keys = Object.keys(val);
        for (i = 0; i < keys.length; i++) {
          key = keys[i];
          children[i] = render(val[key], key, i);
        }
      }
      return children;
    };
    Vue.prototype._t = function (name, props) {
      var scopedSlotFn = this.$scopedSlots[name];
      var nodes;
      if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        nodes = scopedSlotFn(props);
        if (nodes) {
          var _nodes = nodes,
            vm = _nodes.vm,
            tag = _nodes.tag,
            data = _nodes.data,
            children = _nodes.children;
          return createElementVNode(vm, tag, data, children);
        }
      } else {
        nodes = this.$slots[name];
        if (nodes) {
          var _nodes$ = nodes[0],
            _vm = _nodes$.vm,
            _tag = _nodes$.tag,
            _data = _nodes$.data,
            _children = _nodes$.children;
          return createElementVNode(_vm, _tag, _data, _children);
        } else {
          return createEmptyVNode();
        }
      }
    };
    Vue.prototype._u = function (fns, res) {
      res = res || {};
      for (var _i2 = 0; _i2 < fns.length; _i2++) {
        var slot = fns[_i2];
        if (slot) {
          res[slot.key] = slot.fn;
        }
      }
      return res;
    };
    Vue.prototype._render = function () {
      // _render()方法用来调用compileToFunction()生成的render方法（被挂在vm.$options上）, 返回相应的虚拟DOM
      var vm = this;
      return vm.$options.render.call(vm);
    };
    Vue.prototype._update = function (vnode) {
      // _update()方法接收虚拟DOM, 调用patch()方法实现初次挂载真实DOM或更新真实DOM
      var vm = this;
      var el = vm.$el;
      var preNode = vm._vnode; // 将更新前的虚拟DOM保存在实例的_vnode中
      vm._vnode = vnode; // 将实例上的_vnode更新, 以便下一次更新时拿到当前的虚拟DOM

      if (preNode) {
        // 更新前有虚拟DOM, 不是初次渲染, 走更新流程
        vm.$el = patch(preNode, vnode);
      } else {
        // 更新前没有虚拟DOM, 是初次渲染, 走初次渲染流程
        vm.$el = patch(el, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    // mountComponent()方法将el挂载在vm上, 再调用vm上的_render()方法生成el的虚拟DOM, 再对虚拟DOM调用vm身上的_update()方法挂载或更新真实DOM
    vm.$el = el;

    // 重新渲染页面的方法
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    vm._watcher = new Watcher(vm, updateComponent, true); // 渲染页面的逻辑封装在watcher中
    // console.log(watcher)
  }

  function callHook(vm, hook) {
    // 调用生命周期函数的方法
    var handlers = vm.$options[hook];
    if (handlers) handlers.forEach(function (handler) {
      return handler.call(vm);
    });
  }

  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      // 此方法用来把vm.$options中的生命周期函数与mixin中的生命周期函数合并
      // 第一次调用：p: {}, c: hook: function() {}, 结果处理为：{hook: [f]}
      // 第二次调用：p: {hook: [f]},  c: hook: function() {}, 结果处理为：{hook: [f, f]}
      if (c) {
        if (p) {
          return p.concat(c); // 父子对象中都有该生命周期函数, 那么将二者合并
        } else {
          return [c]; // 只有子对象有该生命周期函数, 将该生命周期函数套一层数组返回, 以便以后追加
        }
      } else {
        // 能够调用到mergeField()方法, 则p或c至少有一个有该生命周期函数, 这里只能是父对象中有。那么父对象中的该生命周期函数已被维护成数组, 直接返回即可
        return p;
      }
    };
  });
  strats.components = function (parentVal, childVal) {
    // strats.components方法将全局组件(Vue.components)与组件内部定义的局部组件(vm.components)进行合并
    var res = Object.create(parentVal);
    for (var key in childVal) {
      res[key] = childVal[key];
    }
    return res;
  };
  function mergeOptions(parent, child) {
    // mergeOptions()方法用于合并对象属性
    var options = {};
    for (var key in parent) {
      // 遍历父对象中的属性添加到options中
      mergeField(key);
    }
    for (var _key in child) {
      // 遍历子对象中的属性, 如果父对象中没有, 就添加到options中(父对象中有的情况下的处理逻辑在遍历父对象时的mergeField()方法里)
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    function mergeField(key) {
      // 策略模式, 简化多轮的if else判断, 将判断条件写在strats中
      if (strats[key]) {
        // 如果是生命周期函数等情况, 需要维护成一个队列, 需要时一并调用
        options[key] = strats[key](parent[key], child[key]); // 此为strats中函数的调用, strats中的函数是用来合并参数的函数
      } else {
        // 如果不是策略中的情况, 优先采用子对象
        options[key] = child[key] || parent[key];
      }
    }
    return options;
  }

  function initMixin(Vue) {
    // console.log('@initMixin方法用于给Vue添加_init方法')
    Vue.prototype._init = function (options) {
      var vm = this; // 原型中this指向实例
      // 是否是组件
      if (options && options._isComponent) {
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(this.constructor.options, options); // 给vm添加$options属性, 将用户的选项和定义的全局指令(this.constructor指向Vue/Sub(对子组件来说)构造函数, 上面的静态属性Vue.options中包含全局指令等), 过滤器都放在$options中}
      }

      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initState(vm); // 给vm添加data, methods, computed等等属性
      callHook(vm, 'created');
      if (options.el) {
        callHook(vm, 'beforeMount');
        vm.$mount(options.el);
        callHook(vm, 'mounted');
        if (vm.$options.insertedDirectivesToResolve) {
          Object.keys(vm.$options.insertedDirectivesToResolve).forEach(function (key) {
            var directive = vm.$options.insertedDirectivesToResolve[key];
            var insertedFn = vm.$options.directives[key].inserted;
            insertedFn.call(vm, directive.element, directive.binding);
          });
          delete vm.$options.insertedDirectivesToResolve;
        }
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      var element = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        // 没有render函数的情况下
        var template; // 选择template
        if (!ops.template && element) {
          // 没写template, 有element, 模板采用element
          template = element.outerHTML;
        } else {
          // 有template, 模板采用template
          template = ops.template;
        }
        if (template) {
          // 没写render, 有了上面的模板的情况下, 利用自己的render方法, 将模板编译
          var render = compileToFunction(template);
          ops.render = render; // 给vm.$options补充render方法
        }
      }

      mountComponent(vm, element); // mountComponent方法将模板编译为虚拟DOM, 转换为真实DOM挂在element上, 或者将旧的真实DOM进行更新
    };

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
      }
      return vm;
    };
    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm;
      }
      if (isArray(event)) {
        for (var _i = 0; _i < event.length; _i++) {
          vm.$off(event[_i], fn);
        }
        return vm;
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm;
      }
      if (!fn) {
        vm._events[event] = null;
        return vm;
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return vm;
    };
    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      if (cbs) {
        cbs.forEach(function (cb) {
          return cb.call.apply(cb, [vm].concat(_toConsumableArray(args)));
        });
      }
      return vm;
    };
    Vue.prototype.$refs = {};
  }
  function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function (expOrFn, cb) {
      return new Watcher(this, expOrFn, {
        user: true
      }, cb);
    };
  }
  function initInternalComponent(vm, options) {
    vm.$options = Object.create(vm.constructor.options);
    console.log(vm, options.componentOptions);
    /* var opts = (vm.$options = Object.create(vm.constructor.options));
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    var vnodeComponentOptions = parentVnode.componentOptions; */
    vm.$options.beforeCreate = vm.constructor.options.beforeCreate;
    vm.$options.propsData = options.componentOptions.propsData;
    vm.$options._parentListeners = options.componentOptions.listeners;
    vm.$options._renderChildren = options.componentOptions.children;
    if (options.componentOptions.ref) vm.$refs[options.componentOptions.ref] = vm;
    /* opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;
    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
    } */
  }

  function initGlobalAPI(Vue) {
    // Vue.prototype里面的是原型方法(vm能访问到的), Vue里面的是静态属性/方法, 可以全局访问(保存在Vue构造函数里, 通过Vue.xxx访问)
    Vue.options = {
      _base: Vue // 将当前Vue构造函数保存在Vue.options._base中, 通过继承Vue的Sub构造函数new出来的实例子组件可以通过此来拿到Vue构造函数上的静态方法(Sub未继承Vue的静态方法)
    };

    Vue.mixin = function (mixin) {
      // mixin方法用于将用户的选项(vm.$options)和全局的options(Vue.options)进行合并
      this.options = mergeOptions(this.options, mixin);
      return this; // this指向Vue构造函数, 返回this可以实现链式调用
    };

    Vue.extend = function (options) {
      // extend()方法返回一个构造函数, 用于创建子组件。创建一个组件, 就是new一个Sub实例
      function Sub() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this._init(options); // 默认对子组件采用初始化操作, 此处的options是new Sub(options)中的options
      }

      Sub.prototype = Object.create(Vue.prototype); // Sub.prototype.__proto__ = Vue.prototype
      Sub.prototype.constructor = Sub; // Sub的构造函数指向自身, 上面两条语句实现了继承
      // console.log(Sub.prototype, Vue.prototype)
      Sub.options = mergeOptions(Vue.options, options); // 将自身的options(Vue.extend(options)中传入的options)和全局的options(Vue.options)进行合并(Vue.options中包含_base, 全局components, directives等)

      /* 注：为什么组件中data必须是一个函数？
          因为每一次创建新组件时, 都要去new Sub(), 所有的Sub实例都是Sub构造函数实例化产生的, 共用静态属性Sub.options。
          在这个过程中调用_init()方法, 会对从Vue.extend(options)传入的options(其中包含data)进行mergeOptions(), 合并到Sub.options上。如果data是一个对象, 就是共享的。
          如果用Sub.options.data()取得数据, 那么得到的数据就是非共享的, 在一个组件内修改, 不会影响到其它的组件。
      */

      /* 组件的挂载流程:
          注册全局组件需要调用Vue.components()方法, Vue.components()方法内部调用Vue.extend()方法得到组件的Sub构造函数, 并将其保存在全局的Vue.options.components上。
          在解析模板(vm.$mount(el) -> mountComponent(vm, element) -> vm._render() -> _c() -> createElementVNode())时, 如果遇到了组件标签, 会从vm.$options.components上面找到该组件的Sub构造函数(从Vue.options上面合并而来), 并调用createComponentVnode()方法去生成虚拟DOM。
          在createComponentVnode()方法中, 会将其虚拟DOM上的data属性增加一个hook, 用于保存其挂载方法_init()。
          随后在虚拟DOM转化为真实DOM(vm._update(vm._render()) -> patch()), 即调用patch()方法时, 内部会调用createElement()方法, 内部再调用cerateComponent()方法。
          开始组件的初始化。cerateComponent()内部拿到_init()方法并调用, 此时会将Sub构造函数实例化, 并将实例挂在虚拟DOM的componentInstance上, 随后调用该实例的$mount()方法。
          调用$mount()方法时不传参数, 就拿到vm.$options上的模板进行编译(vm是Sub实例, 即vnode.componentInstance), 再内部调用mountComponent()方法, 进行渲染, 添加watcher, 并将真实DOM挂在vm.$el(即Sub实例的$el, vnode.componentInstance.$el)上
          此时vnode.componentInstance.$el上就有了真实DOM, createElement()方法就返回这个真实DOM, patch()方法同样返回这个真实DOM, 回到了vm._update()。随后创建父元素, 在父元素中插入子组件的真实DOM。
      */
      return Sub;
    };
    Vue.options.components = {}; // 全局指令, 用于保存全局组件的Sub构造函数

    Vue.components = function (id, defination) {
      // Vue.components方法用于定义全局组件
      defination = typeof defination === 'function' ? defination : Vue.extend(defination); // defination有可能是函数或对象, 如果是函数, 说明用户已经调用了Vue.extend()方法
      Vue.options.components[id] = defination;
    };
    Vue.use = function (plugin) {
      var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
      if (installedPlugins.indexOf(plugin) > -1) {
        return this;
      }
      // additional parameters
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 1, this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this;
    };
    Vue.directive = function (id, definition) {
      Vue.options.directives = Vue.options.directives || {};
      if (!definition) {
        return this.options['directives'][id];
      } else {
        if (typeof definition === 'function') {
          definition = {
            bind: definition,
            update: definition
          };
        }
        this.options['directives'][id] = definition;
        return definition;
      }
    };
    Vue.set = set;
    Vue["delete"] = del;
  }

  function Vue(options) {
    // console.log('@Vue_init')
    this._init(options); // 调用Vue身上的_init方法(由ininMixin()方法添加到Vue上面)进行初始化
  }

  initMixin(Vue); // initMixin方法用于给Vue添加_init
  initLifeCycle(Vue);
  initGlobalAPI(Vue);
  initStateMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
