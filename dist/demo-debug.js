define("../dist/demo-debug", [ "$-debug", "crossjs/class/0.0.2/class-debug", "crossjs/util/0.0.1/util-debug", "crossjs/class/0.0.2/super-debug" ], function(require, exports, module) {
    /**
 * Demo
 * @module Demo
 */
    "use strict";
    var $ = require("$-debug"), Class = require("crossjs/class/0.0.2/class-debug");
    var Person = new Class({
        __construct: function(name, gender) {
            this.name = name;
            this.gender = gender;
        },
        getName: function() {
            return this.name;
        },
        getGender: function() {
            return this.gender;
        },
        showInfo: function() {
            $("<p/>").text(this.getName() + ", " + this.getGender()).appendTo("body");
        }
    });
    var Student = new Class(Person, {
        __construct: function(name, gender, schoolName) {
            this.schoolName = schoolName;
        },
        getSchoolName: function() {
            return this.schoolName;
        },
        showInfo: function() {
            $("<p/>").text(this.getName() + ", " + this.getGender() + ", from " + this.getSchoolName()).appendTo("body");
        }
    });
    var studentOne = new Student("Tom", "Boy", "YiZhong"), studentTwo = new Student("Marry", "Girl", "ErZhong");
    studentOne.showInfo();
    studentTwo.showInfo();
});

define("crossjs/class/0.0.2/class-debug", [ "$-debug", "crossjs/util/0.0.1/util-debug", "./super-debug" ], function(require, exports, module) {
    /**
 * 类
 * @module Class
 */
    "use strict";
    var $ = require("$-debug"), Util = require("crossjs/util/0.0.1/util-debug"), Super = require("./super-debug");
    /**
 * 标准类
 * @class Class
 * @extends Super
 * @param {Function} [Brood] 将要继承的父类（只继承其原型方法）
 * @param {Object} [Proto] 将要扩展的实例方法集
 * @return {function}
 * @constructor
 */
    var Class = function() {
        var args = arguments, Dummy, Brood, Proto, classPlugins = {};
        switch (args.length) {
          case 2:
            if (typeof args[0] === "function") {
                Brood = args[0];
            }
            if ($.isPlainObject(args[1])) {
                Proto = args[1];
            }
            break;

          case 1:
            if (typeof args[0] === "function") {
                Brood = args[0];
            } else if ($.isPlainObject(args[0])) {
                Proto = args[0];
            }
            break;
        }
        Dummy = function() {
            var args = Array.prototype.slice.call(arguments, 0), callparent = function(ctx, obj, prop) {
                if (obj && obj.hasOwnProperty(prop)) {
                    // 递归执行callparent
                    callparent(ctx, obj.constructor.uber, prop);
                    obj[prop].apply(ctx, args);
                }
            };
            // call parents' __construct
            // `Child's uber linked to Parent's prototype`
            callparent(this, Dummy.uber, "__construct");
            // call __construct
            if (typeof this.__construct === "function") {
                this.__construct.apply(this, args);
            }
            // load __plugins
            $.each(classPlugins, $.proxy(function(n, func) {
                func.apply(this, args);
            }, this));
        };
        /**
   * 为当前类添加插件
   * @method addPlugins
   * @static
   * @param  {Object} plugins 插件
   * @return {Function} 当前类
   */
        Dummy.addPlugins = function(plugins) {
            $.extend(classPlugins, plugins);
            return Dummy;
        };
        // make sure Classes inherited from Super or Super's sub-classes
        if (typeof Brood === "undefined") {
            Brood = Super;
        } else if (!$.isPlainObject(Brood.uber) || Brood.uber._Super !== Util.guid) {
            Super.inherit(Brood, Super);
        }
        Super.inherit(Dummy, Brood);
        if (typeof Proto !== "undefined") {
            $.extend(Dummy.prototype, Proto);
        }
        return Dummy;
    };
    return Class;
});

define("crossjs/util/0.0.1/util-debug", [], function(require, exports, module) {
    /**
 * 基础库
 * @module Util
 */
    "use strict";
    /**
 * Util库
 * @class Util
 * @static
 */
    var Util = function() {};
    // Util.prototype.constructor = Util;
    /**
 * 生成一个新的GUID
 * @method Util.nuid
 * @return {String}
 */
    Util.nuid = function() {
        var id = Math.random().toString(36).substr(2);
        if (Util.nuid.ids[id]) {
            return Util.nuid();
        }
        Util.nuid.ids[id] = 1;
        return id;
    };
    Util.nuid.ids = {};
    /**
 * Util库的GUID
 * @property Util.guid
 */
    Util.guid = Util.nuid();
    /**
 * NOOP
 * @property Util.noop
 */
    Util.noop = function() {};
    /**
 * Encode HTML
 * @property Util.htmlencode
 */
    Util.htmlencode = function(value) {
        var replacements = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;"
        };
        return value.replace(/[<>&"']/g, function(character) {
            return replacements[character];
        });
    };
    /**
 * Decode HTML
 * @property Util.htmldecode
 */
    Util.htmldecode = function(value) {
        var replacements = {
            "&lt;": "<",
            "&gt;": ">",
            "&amp;": "&",
            "&quot;": '"',
            "&apos;": "'"
        };
        return value.replace(/&(?:lt|gt|amp|quot|apos);/g, function(character) {
            return replacements[character];
        });
    };
    // var epsEqu = (function () { // IIFE, keeps EPSILON private
    //     var EPSILON = Math.pow(2, -53);
    //     return function epsEqu(x, y) {
    //         return Math.abs(x - y) < EPSILON;
    //     };
    // })();
    return Util;
});

define("crossjs/class/0.0.2/super-debug", [ "$-debug", "crossjs/util/0.0.1/util-debug" ], function(require, exports, module) {
    /**
 * 类
 * @module Class
 */
    "use strict";
    var $ = require("$-debug"), Util = require("crossjs/util/0.0.1/util-debug");
    /**
 * 超类
 * 实现了事件订阅与类继承
 * @class Super
 * @constructor
 */
    var Super = function() {}, // Bridge for inherit
    Bridge = function() {};
    Super.uber = Super.prototype = {
        _Super: Util.guid,
        /**
   * 构造函数
   * @method __construct
   */
        __construct: function(options) {
            this.__eventList = {};
            // 增加订阅
            if ($.isPlainObject(options) && $.isPlainObject(options.on)) {
                this.on(options.on);
            }
        },
        /**
   * 绑定事件，暂不支持命名空间
   * @method on
   * @param {String} event 事件名
   * @param {Function} callback 绑定回调函数
   */
        on: function(event, callback) {
            var eventList = this.__eventList, obj = {};
            if ($.isPlainObject(event)) {
                obj = event;
            } else {
                obj[event] = callback;
            }
            $.each(obj, function(event, callback) {
                if (Object.prototype.hasOwnProperty.call(eventList, event) && eventList[event]) {
                    // 判断唯一性，避免多次订阅
                    if ($.inArray(callback, eventList[event]) === -1) {
                        eventList[event].push(callback);
                    }
                } else {
                    eventList[event] = [ callback ];
                }
            });
            return this;
        },
        /**
   * 解除绑定的事件
   * @param {String} event 事件名
   * @param {Function} callback 绑定回调函数
   * @method off
   */
        off: function(event, callback) {
            var eventList = this.__eventList;
            if (Object.prototype.hasOwnProperty.call(eventList, event)) {
                if (typeof callback === "function") {
                    $.each(eventList[event], function(i, n) {
                        if (n === callback) {
                            eventList[event].splice(i, 1);
                        }
                    });
                } else {
                    delete eventList[event];
                }
            }
            return this;
        },
        /**
   * 触发绑定的事件
   * @param {String} event 事件名
   * @method fire
   */
        fire: function(event) {
            var eventList = this.__eventList, args;
            if (Object.prototype.hasOwnProperty.call(eventList, event)) {
                args = [];
                if (arguments.length > 1) {
                    args = Array.prototype.slice.call(arguments, 1);
                }
                $.each(eventList[event], $.proxy(function(i, callback) {
                    callback.apply(this, args);
                }, this));
            }
            return this;
        },
        /**
   * 扩展实例方法，返回当前实例
   * @param {Object} obj1 实例方法集
   * @param {Object} [objN] 实例方法集
   * @return {object}
   * @method extend
   */
        extend: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(true, this);
            $.extend.apply(null, args);
            return this;
        }
    };
    /**
 * 类继承
 * @param {Function} Child 子类
 * @param {Function} Parent 父类
 * @method Super.inherit
 * @static
 */
    Super.inherit = function(Child, Parent) {
        // 不能使用`new Parent()`，因为可能引入非原型方法/属性
        Bridge.prototype = Parent.prototype;
        Child.prototype = new Bridge();
        Child.uber = Parent.prototype;
        Child.prototype.constructor = Child;
    };
    return Super;
});
