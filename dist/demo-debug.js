define("../dist/demo-debug", [ "$-debug", "crossjs/class/0.1.0/class-debug", "crossjs/class/0.1.0/super-debug" ], function(require, exports, module) {
    /**
 * Demo
 * @module Demo
 */
    "use strict";
    var $ = require("$-debug"), Class = require("crossjs/class/0.1.0/class-debug");
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
