(function (t) {
  t.extend(t.fn, {
    validate: function (e) {
      if (this.length) {
        var i = t.data(this[0], "validator");
        return (
          i ||
          (this.attr("novalidate", "novalidate"),
          (i = new t.validator(e, this[0])),
          t.data(this[0], "validator", i),
          i.settings.onsubmit &&
            (this.validateDelegate(":submit", "click", function (e) {
              i.settings.submitHandler && (i.submitButton = e.target),
                t(e.target).hasClass("cancel") && (i.cancelSubmit = !0),
                void 0 !== t(e.target).attr("formnovalidate") &&
                  (i.cancelSubmit = !0);
            }),
            this.submit(function (e) {
              function n() {
                var n;
                return (
                  !i.settings.submitHandler ||
                  (i.submitButton &&
                    (n = t("<input type='hidden'/>")
                      .attr("name", i.submitButton.name)
                      .val(t(i.submitButton).val())
                      .appendTo(i.currentForm)),
                  i.settings.submitHandler.call(i, i.currentForm, e),
                  i.submitButton && n.remove(),
                  !1)
                );
              }
              return (
                i.settings.debug && e.preventDefault(),
                i.cancelSubmit
                  ? ((i.cancelSubmit = !1), n())
                  : i.form()
                  ? i.pendingRequest
                    ? ((i.formSubmitted = !0), !1)
                    : n()
                  : (i.focusInvalid(), !1)
              );
            })),
          i)
        );
      }
      e &&
        e.debug &&
        window.console &&
        console.warn("Nothing selected, can't validate, returning nothing.");
    },
    valid: function () {
      if (t(this[0]).is("form")) return this.validate().form();
      var e = !0,
        i = t(this[0].form).validate();
      return (
        this.each(function () {
          e = e && i.element(this);
        }),
        e
      );
    },
    removeAttrs: function (e) {
      var i = {},
        n = this;
      return (
        t.each(e.split(/\s/), function (t, e) {
          (i[e] = n.attr(e)), n.removeAttr(e);
        }),
        i
      );
    },
    rules: function (e, i) {
      var n = this[0];
      if (e) {
        var o = t.data(n.form, "validator").settings,
          s = o.rules,
          r = t.validator.staticRules(n);
        switch (e) {
          case "add":
            t.extend(r, t.validator.normalizeRule(i)),
              delete r.messages,
              (s[n.name] = r),
              i.messages &&
                (o.messages[n.name] = t.extend(o.messages[n.name], i.messages));
            break;
          case "remove":
            if (!i) return delete s[n.name], r;
            var a = {};
            return (
              t.each(i.split(/\s/), function (t, e) {
                (a[e] = r[e]), delete r[e];
              }),
              a
            );
        }
      }
      var l = t.validator.normalizeRules(
        t.extend(
          {},
          t.validator.classRules(n),
          t.validator.attributeRules(n),
          t.validator.dataRules(n),
          t.validator.staticRules(n)
        ),
        n
      );
      if (l.required) {
        var c = l.required;
        delete l.required, (l = t.extend({ required: c }, l));
      }
      return l;
    },
  }),
    t.extend(t.expr[":"], {
      blank: function (e) {
        return !t.trim("" + t(e).val());
      },
      filled: function (e) {
        return !!t.trim("" + t(e).val());
      },
      unchecked: function (e) {
        return !t(e).prop("checked");
      },
    }),
    (t.validator = function (e, i) {
      (this.settings = t.extend(!0, {}, t.validator.defaults, e)),
        (this.currentForm = i),
        this.init();
    }),
    (t.validator.format = function (e, i) {
      return 1 === arguments.length
        ? function () {
            var i = t.makeArray(arguments);
            return i.unshift(e), t.validator.format.apply(this, i);
          }
        : (arguments.length > 2 &&
            i.constructor !== Array &&
            (i = t.makeArray(arguments).slice(1)),
          i.constructor !== Array && (i = [i]),
          t.each(i, function (t, i) {
            e = e.replace(RegExp("\\{" + t + "\\}", "g"), function () {
              return i;
            });
          }),
          e);
    }),
    t.extend(t.validator, {
      defaults: {
        messages: {},
        groups: {},
        rules: {},
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusInvalid: !0,
        errorContainer: t([]),
        errorLabelContainer: t([]),
        onsubmit: !0,
        ignore: ":hidden",
        ignoreTitle: !1,
        onfocusin: function (t) {
          (this.lastActive = t),
            this.settings.focusCleanup &&
              !this.blockFocusCleanup &&
              (this.settings.unhighlight &&
                this.settings.unhighlight.call(
                  this,
                  t,
                  this.settings.errorClass,
                  this.settings.validClass
                ),
              this.addWrapper(this.errorsFor(t)).hide());
        },
        onfocusout: function (t) {
          this.checkable(t) ||
            (!(t.name in this.submitted) && this.optional(t)) ||
            this.element(t);
        },
        onkeyup: function (t, e) {
          (9 !== e.which || "" !== this.elementValue(t)) &&
            (t.name in this.submitted || t === this.lastElement) &&
            this.element(t);
        },
        onclick: function (t) {
          t.name in this.submitted
            ? this.element(t)
            : t.parentNode.name in this.submitted && this.element(t.parentNode);
        },
        highlight: function (e, i, n) {
          "radio" === e.type
            ? this.findByName(e.name).addClass(i).removeClass(n)
            : t(e).addClass(i).removeClass(n);
        },
        unhighlight: function (e, i, n) {
          "radio" === e.type
            ? this.findByName(e.name).removeClass(i).addClass(n)
            : t(e).removeClass(i).addClass(n);
        },
      },
      setDefaults: function (e) {
        t.extend(t.validator.defaults, e);
      },
      messages: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        maxlength: t.validator.format(
          "Please enter no more than {0} characters."
        ),
        minlength: t.validator.format("Please enter at least {0} characters."),
        rangelength: t.validator.format(
          "Please enter a value between {0} and {1} characters long."
        ),
        range: t.validator.format("Please enter a value between {0} and {1}."),
        max: t.validator.format(
          "Please enter a value less than or equal to {0}."
        ),
        min: t.validator.format(
          "Please enter a value greater than or equal to {0}."
        ),
      },
      autoCreateRanges: !1,
      prototype: {
        init: function () {
          function e(e) {
            var i = t.data(this[0].form, "validator"),
              n = "on" + e.type.replace(/^validate/, "");
            i.settings[n] && i.settings[n].call(i, this[0], e);
          }
          (this.labelContainer = t(this.settings.errorLabelContainer)),
            (this.errorContext =
              (this.labelContainer.length && this.labelContainer) ||
              t(this.currentForm)),
            (this.containers = t(this.settings.errorContainer).add(
              this.settings.errorLabelContainer
            )),
            (this.submitted = {}),
            (this.valueCache = {}),
            (this.pendingRequest = 0),
            (this.pending = {}),
            (this.invalid = {}),
            this.reset();
          var i = (this.groups = {});
          t.each(this.settings.groups, function (e, n) {
            "string" == typeof n && (n = n.split(/\s/)),
              t.each(n, function (t, n) {
                i[n] = e;
              });
          });
          var n = this.settings.rules;
          t.each(n, function (e, i) {
            n[e] = t.validator.normalizeRule(i);
          }),
            t(this.currentForm)
              .validateDelegate(
                ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ",
                "focusin focusout keyup",
                e
              )
              .validateDelegate(
                "[type='radio'], [type='checkbox'], select, option",
                "click",
                e
              ),
            this.settings.invalidHandler &&
              t(this.currentForm).bind(
                "invalid-form.validate",
                this.settings.invalidHandler
              );
        },
        form: function () {
          return (
            this.checkForm(),
            t.extend(this.submitted, this.errorMap),
            (this.invalid = t.extend({}, this.errorMap)),
            this.valid() ||
              t(this.currentForm).triggerHandler("invalid-form", [this]),
            this.showErrors(),
            this.valid()
          );
        },
        checkForm: function () {
          this.prepareForm();
          for (
            var t = 0, e = (this.currentElements = this.elements());
            e[t];
            t++
          )
            this.check(e[t]);
          return this.valid();
        },
        element: function (e) {
          (e = this.validationTargetFor(this.clean(e))),
            (this.lastElement = e),
            this.prepareElement(e),
            (this.currentElements = t(e));
          var i = !1 !== this.check(e);
          return (
            i ? delete this.invalid[e.name] : (this.invalid[e.name] = !0),
            this.numberOfInvalids() ||
              (this.toHide = this.toHide.add(this.containers)),
            this.showErrors(),
            i
          );
        },
        showErrors: function (e) {
          if (e) {
            for (var i in (t.extend(this.errorMap, e),
            (this.errorList = []),
            e))
              this.errorList.push({
                message: e[i],
                element: this.findByName(i)[0],
              });
            this.successList = t.grep(this.successList, function (t) {
              return !(t.name in e);
            });
          }
          this.settings.showErrors
            ? this.settings.showErrors.call(this, this.errorMap, this.errorList)
            : this.defaultShowErrors();
        },
        resetForm: function () {
          t.fn.resetForm && t(this.currentForm).resetForm(),
            (this.submitted = {}),
            (this.lastElement = null),
            this.prepareForm(),
            this.hideErrors(),
            this.elements()
              .removeClass(this.settings.errorClass)
              .removeData("previousValue");
        },
        numberOfInvalids: function () {
          return this.objectLength(this.invalid);
        },
        objectLength: function (t) {
          var e = 0;
          for (var i in t) e++;
          return e;
        },
        hideErrors: function () {
          this.addWrapper(this.toHide).hide();
        },
        valid: function () {
          return 0 === this.size();
        },
        size: function () {
          return this.errorList.length;
        },
        focusInvalid: function () {
          if (this.settings.focusInvalid)
            try {
              t(
                this.findLastActive() ||
                  (this.errorList.length && this.errorList[0].element) ||
                  []
              )
                .filter(":visible")
                .focus()
                .trigger("focusin");
            } catch (t) {}
        },
        findLastActive: function () {
          var e = this.lastActive;
          return (
            e &&
            1 ===
              t.grep(this.errorList, function (t) {
                return t.element.name === e.name;
              }).length &&
            e
          );
        },
        elements: function () {
          var e = this,
            i = {};
          return t(this.currentForm)
            .find("input, select, textarea")
            .not(":submit, :reset, :image, [disabled]")
            .not(this.settings.ignore)
            .filter(function () {
              return (
                !this.name &&
                  e.settings.debug &&
                  window.console &&
                  console.error("%o has no name assigned", this),
                !(this.name in i || !e.objectLength(t(this).rules())) &&
                  ((i[this.name] = !0), !0)
              );
            });
        },
        clean: function (e) {
          return t(e)[0];
        },
        errors: function () {
          var e = this.settings.errorClass.replace(" ", ".");
          return t(this.settings.errorElement + "." + e, this.errorContext);
        },
        reset: function () {
          (this.successList = []),
            (this.errorList = []),
            (this.errorMap = {}),
            (this.toShow = t([])),
            (this.toHide = t([])),
            (this.currentElements = t([]));
        },
        prepareForm: function () {
          this.reset(), (this.toHide = this.errors().add(this.containers));
        },
        prepareElement: function (t) {
          this.reset(), (this.toHide = this.errorsFor(t));
        },
        elementValue: function (e) {
          var i = t(e).attr("type"),
            n = t(e).val();
          return "radio" === i || "checkbox" === i
            ? t("input[name='" + t(e).attr("name") + "']:checked").val()
            : "string" == typeof n
            ? n.replace(/\r/g, "")
            : n;
        },
        check: function (e) {
          e = this.validationTargetFor(this.clean(e));
          var i,
            n = t(e).rules(),
            o = !1,
            s = this.elementValue(e);
          for (var r in n) {
            var a = { method: r, parameters: n[r] };
            try {
              if (
                "dependency-mismatch" ===
                (i = t.validator.methods[r].call(this, s, e, a.parameters))
              ) {
                o = !0;
                continue;
              }
              if (((o = !1), "pending" === i))
                return void (this.toHide = this.toHide.not(this.errorsFor(e)));
              if (!i) return this.formatAndAdd(e, a), !1;
            } catch (t) {
              throw (
                (this.settings.debug &&
                  window.console &&
                  console.log(
                    "Exception occurred when checking element " +
                      e.id +
                      ", check the '" +
                      a.method +
                      "' method.",
                    t
                  ),
                t)
              );
            }
          }
          return o
            ? void 0
            : (this.objectLength(n) && this.successList.push(e), !0);
        },
        customDataMessage: function (e, i) {
          return (
            t(e).data("msg-" + i.toLowerCase()) ||
            (e.attributes && t(e).attr("data-msg-" + i.toLowerCase()))
          );
        },
        customMessage: function (t, e) {
          var i = this.settings.messages[t];
          return i && (i.constructor === String ? i : i[e]);
        },
        findDefined: function () {
          for (var t = 0; arguments.length > t; t++)
            if (void 0 !== arguments[t]) return arguments[t];
        },
        defaultMessage: function (e, i) {
          return this.findDefined(
            this.customMessage(e.name, i),
            this.customDataMessage(e, i),
            (!this.settings.ignoreTitle && e.title) || void 0,
            t.validator.messages[i],
            "<strong>Warning: No message defined for " + e.name + "</strong>"
          );
        },
        formatAndAdd: function (e, i) {
          var n = this.defaultMessage(e, i.method),
            o = /\$?\{(\d+)\}/g;
          "function" == typeof n
            ? (n = n.call(this, i.parameters, e))
            : o.test(n) &&
              (n = t.validator.format(n.replace(o, "{$1}"), i.parameters)),
            this.errorList.push({ message: n, element: e }),
            (this.errorMap[e.name] = n),
            (this.submitted[e.name] = n);
        },
        addWrapper: function (t) {
          return (
            this.settings.wrapper &&
              (t = t.add(t.parent(this.settings.wrapper))),
            t
          );
        },
        defaultShowErrors: function () {
          var t, e;
          for (t = 0; this.errorList[t]; t++) {
            var i = this.errorList[t];
            this.settings.highlight &&
              this.settings.highlight.call(
                this,
                i.element,
                this.settings.errorClass,
                this.settings.validClass
              ),
              this.showLabel(i.element, i.message);
          }
          if (
            (this.errorList.length &&
              (this.toShow = this.toShow.add(this.containers)),
            this.settings.success)
          )
            for (t = 0; this.successList[t]; t++)
              this.showLabel(this.successList[t]);
          if (this.settings.unhighlight)
            for (t = 0, e = this.validElements(); e[t]; t++)
              this.settings.unhighlight.call(
                this,
                e[t],
                this.settings.errorClass,
                this.settings.validClass
              );
          (this.toHide = this.toHide.not(this.toShow)),
            this.hideErrors(),
            this.addWrapper(this.toShow).show();
        },
        validElements: function () {
          return this.currentElements.not(this.invalidElements());
        },
        invalidElements: function () {
          return t(this.errorList).map(function () {
            return this.element;
          });
        },
        showLabel: function (e, i) {
          var n = this.errorsFor(e);
          n.length
            ? (n
                .removeClass(this.settings.validClass)
                .addClass(this.settings.errorClass),
              n.html(i))
            : ((n = t("<" + this.settings.errorElement + ">")
                .attr("for", this.idOrName(e))
                .addClass(this.settings.errorClass)
                .html(i || "")),
              this.settings.wrapper &&
                (n = n
                  .hide()
                  .show()
                  .wrap("<" + this.settings.wrapper + "/>")
                  .parent()),
              this.labelContainer.append(n).length ||
                (this.settings.errorPlacement
                  ? this.settings.errorPlacement(n, t(e))
                  : n.insertAfter(e))),
            !i &&
              this.settings.success &&
              (n.text(""),
              "string" == typeof this.settings.success
                ? n.addClass(this.settings.success)
                : this.settings.success(n, e)),
            (this.toShow = this.toShow.add(n));
        },
        errorsFor: function (e) {
          var i = this.idOrName(e);
          return this.errors().filter(function () {
            return t(this).attr("for") === i;
          });
        },
        idOrName: function (t) {
          return (
            this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name)
          );
        },
        validationTargetFor: function (t) {
          return (
            this.checkable(t) &&
              (t = this.findByName(t.name).not(this.settings.ignore)[0]),
            t
          );
        },
        checkable: function (t) {
          return /radio|checkbox/i.test(t.type);
        },
        findByName: function (e) {
          return t(this.currentForm).find("[name='" + e + "']");
        },
        getLength: function (e, i) {
          switch (i.nodeName.toLowerCase()) {
            case "select":
              return t("option:selected", i).length;
            case "input":
              if (this.checkable(i))
                return this.findByName(i.name).filter(":checked").length;
          }
          return e.length;
        },
        depend: function (t, e) {
          return (
            !this.dependTypes[typeof t] || this.dependTypes[typeof t](t, e)
          );
        },
        dependTypes: {
          boolean: function (t) {
            return t;
          },
          string: function (e, i) {
            return !!t(e, i.form).length;
          },
          function: function (t, e) {
            return t(e);
          },
        },
        optional: function (e) {
          var i = this.elementValue(e);
          return (
            !t.validator.methods.required.call(this, i, e) &&
            "dependency-mismatch"
          );
        },
        startRequest: function (t) {
          this.pending[t.name] ||
            (this.pendingRequest++, (this.pending[t.name] = !0));
        },
        stopRequest: function (e, i) {
          this.pendingRequest--,
            0 > this.pendingRequest && (this.pendingRequest = 0),
            delete this.pending[e.name],
            i && 0 === this.pendingRequest && this.formSubmitted && this.form()
              ? (t(this.currentForm).submit(), (this.formSubmitted = !1))
              : !i &&
                0 === this.pendingRequest &&
                this.formSubmitted &&
                (t(this.currentForm).triggerHandler("invalid-form", [this]),
                (this.formSubmitted = !1));
        },
        previousValue: function (e) {
          return (
            t.data(e, "previousValue") ||
            t.data(e, "previousValue", {
              old: null,
              valid: !0,
              message: this.defaultMessage(e, "remote"),
            })
          );
        },
      },
      classRuleSettings: {
        required: { required: !0 },
        email: { email: !0 },
        url: { url: !0 },
        date: { date: !0 },
        dateISO: { dateISO: !0 },
        number: { number: !0 },
        digits: { digits: !0 },
        creditcard: { creditcard: !0 },
      },
      addClassRules: function (e, i) {
        e.constructor === String
          ? (this.classRuleSettings[e] = i)
          : t.extend(this.classRuleSettings, e);
      },
      classRules: function (e) {
        var i = {},
          n = t(e).attr("class");
        return (
          n &&
            t.each(n.split(" "), function () {
              this in t.validator.classRuleSettings &&
                t.extend(i, t.validator.classRuleSettings[this]);
            }),
          i
        );
      },
      attributeRules: function (e) {
        var i = {},
          n = t(e),
          o = n[0].getAttribute("type");
        for (var s in t.validator.methods) {
          var r;
          "required" === s
            ? ("" === (r = n.get(0).getAttribute(s)) && (r = !0), (r = !!r))
            : (r = n.attr(s)),
            /min|max/.test(s) &&
              (null === o || /number|range|text/.test(o)) &&
              (r = Number(r)),
            r ? (i[s] = r) : o === s && "range" !== o && (i[s] = !0);
        }
        return (
          i.maxlength &&
            /-1|2147483647|524288/.test(i.maxlength) &&
            delete i.maxlength,
          i
        );
      },
      dataRules: function (e) {
        var i,
          n,
          o = {},
          s = t(e);
        for (i in t.validator.methods)
          void 0 !== (n = s.data("rule-" + i.toLowerCase())) && (o[i] = n);
        return o;
      },
      staticRules: function (e) {
        var i = {},
          n = t.data(e.form, "validator");
        return (
          n.settings.rules &&
            (i = t.validator.normalizeRule(n.settings.rules[e.name]) || {}),
          i
        );
      },
      normalizeRules: function (e, i) {
        return (
          t.each(e, function (n, o) {
            if (!1 !== o) {
              if (o.param || o.depends) {
                var s = !0;
                switch (typeof o.depends) {
                  case "string":
                    s = !!t(o.depends, i.form).length;
                    break;
                  case "function":
                    s = o.depends.call(i, i);
                }
                s ? (e[n] = void 0 === o.param || o.param) : delete e[n];
              }
            } else delete e[n];
          }),
          t.each(e, function (n, o) {
            e[n] = t.isFunction(o) ? o(i) : o;
          }),
          t.each(["minlength", "maxlength"], function () {
            e[this] && (e[this] = Number(e[this]));
          }),
          t.each(["rangelength", "range"], function () {
            var i;
            e[this] &&
              (t.isArray(e[this])
                ? (e[this] = [Number(e[this][0]), Number(e[this][1])])
                : "string" == typeof e[this] &&
                  ((i = e[this].split(/[\s,]+/)),
                  (e[this] = [Number(i[0]), Number(i[1])])));
          }),
          t.validator.autoCreateRanges &&
            (e.min &&
              e.max &&
              ((e.range = [e.min, e.max]), delete e.min, delete e.max),
            e.minlength &&
              e.maxlength &&
              ((e.rangelength = [e.minlength, e.maxlength]),
              delete e.minlength,
              delete e.maxlength)),
          e
        );
      },
      normalizeRule: function (e) {
        if ("string" == typeof e) {
          var i = {};
          t.each(e.split(/\s/), function () {
            i[this] = !0;
          }),
            (e = i);
        }
        return e;
      },
      addMethod: function (e, i, n) {
        (t.validator.methods[e] = i),
          (t.validator.messages[e] =
            void 0 !== n ? n : t.validator.messages[e]),
          3 > i.length &&
            t.validator.addClassRules(e, t.validator.normalizeRule(e));
      },
      methods: {
        required: function (e, i, n) {
          if (!this.depend(n, i)) return "dependency-mismatch";
          if ("select" === i.nodeName.toLowerCase()) {
            var o = t(i).val();
            return o && o.length > 0;
          }
          return this.checkable(i)
            ? this.getLength(e, i) > 0
            : t.trim(e).length > 0;
        },
        email: function (t, e) {
          return (
            this.optional(e) ||
            /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
              t
            )
          );
        },
        url: function (t, e) {
          return (
            this.optional(e) ||
            /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(
              t
            )
          );
        },
        date: function (t, e) {
          return this.optional(e) || !/Invalid|NaN/.test("" + new Date(t));
        },
        dateISO: function (t, e) {
          return (
            this.optional(e) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t)
          );
        },
        number: function (t, e) {
          return (
            this.optional(e) ||
            /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
          );
        },
        digits: function (t, e) {
          return this.optional(e) || /^\d+$/.test(t);
        },
        creditcard: function (t, e) {
          if (this.optional(e)) return "dependency-mismatch";
          if (/[^0-9 \-]+/.test(t)) return !1;
          for (
            var i = 0, n = 0, o = !1, s = (t = t.replace(/\D/g, "")).length - 1;
            s >= 0;
            s--
          ) {
            var r = t.charAt(s);
            (n = parseInt(r, 10)),
              o && (n *= 2) > 9 && (n -= 9),
              (i += n),
              (o = !o);
          }
          return 0 == i % 10;
        },
        minlength: function (e, i, n) {
          var o = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
          return this.optional(i) || o >= n;
        },
        maxlength: function (e, i, n) {
          var o = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
          return this.optional(i) || n >= o;
        },
        rangelength: function (e, i, n) {
          var o = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
          return this.optional(i) || (o >= n[0] && n[1] >= o);
        },
        min: function (t, e, i) {
          return this.optional(e) || t >= i;
        },
        max: function (t, e, i) {
          return this.optional(e) || i >= t;
        },
        range: function (t, e, i) {
          return this.optional(e) || (t >= i[0] && i[1] >= t);
        },
        equalTo: function (e, i, n) {
          var o = t(n);
          return (
            this.settings.onfocusout &&
              o
                .unbind(".validate-equalTo")
                .bind("blur.validate-equalTo", function () {
                  t(i).valid();
                }),
            e === o.val()
          );
        },
        remote: function (e, i, n) {
          if (this.optional(i)) return "dependency-mismatch";
          var o = this.previousValue(i);
          if (
            (this.settings.messages[i.name] ||
              (this.settings.messages[i.name] = {}),
            (o.originalMessage = this.settings.messages[i.name].remote),
            (this.settings.messages[i.name].remote = o.message),
            (n = ("string" == typeof n && { url: n }) || n),
            o.old === e)
          )
            return o.valid;
          o.old = e;
          var s = this;
          this.startRequest(i);
          var r = {};
          return (
            (r[i.name] = e),
            t.ajax(
              t.extend(
                !0,
                {
                  url: n,
                  mode: "abort",
                  port: "validate" + i.name,
                  dataType: "json",
                  data: r,
                  success: function (n) {
                    s.settings.messages[i.name].remote = o.originalMessage;
                    var r = !0 === n || "true" === n;
                    if (r) {
                      var a = s.formSubmitted;
                      s.prepareElement(i),
                        (s.formSubmitted = a),
                        s.successList.push(i),
                        delete s.invalid[i.name],
                        s.showErrors();
                    } else {
                      var l = {},
                        c = n || s.defaultMessage(i, "remote");
                      (l[i.name] = o.message = t.isFunction(c) ? c(e) : c),
                        (s.invalid[i.name] = !0),
                        s.showErrors(l);
                    }
                    (o.valid = r), s.stopRequest(i, r);
                  },
                },
                n
              )
            ),
            "pending"
          );
        },
      },
    }),
    (t.format = t.validator.format);
})(jQuery),
  (function (t) {
    var e = {};
    if (t.ajaxPrefilter)
      t.ajaxPrefilter(function (t, i, n) {
        var o = t.port;
        "abort" === t.mode && (e[o] && e[o].abort(), (e[o] = n));
      });
    else {
      var i = t.ajax;
      t.ajax = function (n) {
        var o = ("mode" in n ? n : t.ajaxSettings).mode,
          s = ("port" in n ? n : t.ajaxSettings).port;
        return "abort" === o
          ? (e[s] && e[s].abort(), (e[s] = i.apply(this, arguments)), e[s])
          : i.apply(this, arguments);
      };
    }
  })(jQuery),
  (function (t) {
    t.extend(t.fn, {
      validateDelegate: function (e, i, n) {
        return this.bind(i, function (i) {
          var o = t(i.target);
          return o.is(e) ? n.apply(o, arguments) : void 0;
        });
      },
    });
  })(jQuery),
  (function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = e())
      : "function" == typeof define && define.amd
      ? define(e)
      : (t.ES6Promise = e());
  })(this, function () {
    "use strict";
    function t(t) {
      return "function" == typeof t;
    }
    function e() {
      var t = setTimeout;
      return function () {
        return t(i, 1);
      };
    }
    function i() {
      for (var t = 0; t < g; t += 2) {
        (0, S[t])(S[t + 1]), (S[t] = void 0), (S[t + 1] = void 0);
      }
      g = 0;
    }
    function n(t, e) {
      var i = this,
        n = new this.constructor(s);
      void 0 === n[k] && f(n);
      var o = i._state;
      if (o) {
        var r = arguments[o - 1];
        _(function () {
          return p(o, n, r, i._result);
        });
      } else h(i, n, t, e);
      return n;
    }
    function o(t) {
      if (t && "object" == typeof t && t.constructor === this) return t;
      var e = new this(s);
      return a(e, t), e;
    }
    function s() {}
    function r(e, i, s) {
      i.constructor === e.constructor && s === n && i.constructor.resolve === o
        ? (function (t, e) {
            e._state === A
              ? c(t, e._result)
              : e._state === E
              ? u(t, e._result)
              : h(
                  e,
                  void 0,
                  function (e) {
                    return a(t, e);
                  },
                  function (e) {
                    return u(t, e);
                  }
                );
          })(e, i)
        : void 0 === s
        ? c(e, i)
        : t(s)
        ? (function (t, e, i) {
            _(function (t) {
              var n = !1,
                o = (function (t, e, i, n) {
                  try {
                    t.call(e, i, n);
                  } catch (t) {
                    return t;
                  }
                })(
                  i,
                  e,
                  function (i) {
                    n || ((n = !0), e !== i ? a(t, i) : c(t, i));
                  },
                  function (e) {
                    n || ((n = !0), u(t, e));
                  },
                  t._label
                );
              !n && o && ((n = !0), u(t, o));
            }, t);
          })(e, i, s)
        : c(e, i);
    }
    function a(t, e) {
      if (t === e)
        u(t, new TypeError("You cannot resolve a promise with itself"));
      else if (
        (function (t) {
          var e = typeof t;
          return null !== t && ("object" === e || "function" === e);
        })(e)
      ) {
        var i = void 0;
        try {
          i = e.then;
        } catch (e) {
          return void u(t, e);
        }
        r(t, e, i);
      } else c(t, e);
    }
    function l(t) {
      t._onerror && t._onerror(t._result), d(t);
    }
    function c(t, e) {
      t._state === P &&
        ((t._result = e),
        (t._state = A),
        0 !== t._subscribers.length && _(d, t));
    }
    function u(t, e) {
      t._state === P && ((t._state = E), (t._result = e), _(l, t));
    }
    function h(t, e, i, n) {
      var o = t._subscribers,
        s = o.length;
      (t._onerror = null),
        (o[s] = e),
        (o[s + A] = i),
        (o[s + E] = n),
        0 === s && t._state && _(d, t);
    }
    function d(t) {
      var e = t._subscribers,
        i = t._state;
      if (0 !== e.length) {
        for (
          var n = void 0, o = void 0, s = t._result, r = 0;
          r < e.length;
          r += 3
        )
          (n = e[r]), (o = e[r + i]), n ? p(i, n, o, s) : o(s);
        t._subscribers.length = 0;
      }
    }
    function p(e, i, n, o) {
      var s = t(n),
        r = void 0,
        l = void 0,
        h = !0;
      if (s) {
        try {
          r = n(o);
        } catch (t) {
          (h = !1), (l = t);
        }
        if (i === r)
          return void u(
            i,
            new TypeError(
              "A promises callback cannot return that same promise."
            )
          );
      } else r = o;
      i._state !== P ||
        (s && h
          ? a(i, r)
          : !1 === h
          ? u(i, l)
          : e === A
          ? c(i, r)
          : e === E && u(i, r));
    }
    function f(t) {
      (t[k] = O++),
        (t._state = void 0),
        (t._result = void 0),
        (t._subscribers = []);
    }
    var m = Array.isArray
        ? Array.isArray
        : function (t) {
            return "[object Array]" === Object.prototype.toString.call(t);
          },
      g = 0,
      v = void 0,
      y = void 0,
      _ = function (t, e) {
        (S[g] = t), (S[g + 1] = e), 2 === (g += 2) && (y ? y(i) : C());
      },
      b = "undefined" != typeof window ? window : void 0,
      w = b || {},
      x = w.MutationObserver || w.WebKitMutationObserver,
      T =
        "undefined" == typeof self &&
        "undefined" != typeof process &&
        "[object process]" === {}.toString.call(process),
      $ =
        "undefined" != typeof Uint8ClampedArray &&
        "undefined" != typeof importScripts &&
        "undefined" != typeof MessageChannel,
      S = new Array(1e3),
      C = void 0;
    C = T
      ? function () {
          return process.nextTick(i);
        }
      : x
      ? (function () {
          var t = 0,
            e = new x(i),
            n = document.createTextNode("");
          return (
            e.observe(n, { characterData: !0 }),
            function () {
              n.data = t = ++t % 2;
            }
          );
        })()
      : $
      ? (function () {
          var t = new MessageChannel();
          return (
            (t.port1.onmessage = i),
            function () {
              return t.port2.postMessage(0);
            }
          );
        })()
      : void 0 === b && "function" == typeof require
      ? (function () {
          try {
            var t = Function("return this")().require("vertx");
            return void 0 !== (v = t.runOnLoop || t.runOnContext)
              ? function () {
                  v(i);
                }
              : e();
          } catch (t) {
            return e();
          }
        })()
      : e();
    var k = Math.random().toString(36).substring(2),
      P = void 0,
      A = 1,
      E = 2,
      O = 0,
      F = (function () {
        function t(t, e) {
          (this._instanceConstructor = t),
            (this.promise = new t(s)),
            this.promise[k] || f(this.promise),
            m(e)
              ? ((this.length = e.length),
                (this._remaining = e.length),
                (this._result = new Array(this.length)),
                0 === this.length
                  ? c(this.promise, this._result)
                  : ((this.length = this.length || 0),
                    this._enumerate(e),
                    0 === this._remaining && c(this.promise, this._result)))
              : u(
                  this.promise,
                  new Error("Array Methods must be provided an Array")
                );
        }
        return (
          (t.prototype._enumerate = function (t) {
            for (var e = 0; this._state === P && e < t.length; e++)
              this._eachEntry(t[e], e);
          }),
          (t.prototype._eachEntry = function (t, e) {
            var i = this._instanceConstructor,
              a = i.resolve;
            if (a === o) {
              var l = void 0,
                c = void 0,
                h = !1;
              try {
                l = t.then;
              } catch (t) {
                (h = !0), (c = t);
              }
              if (l === n && t._state !== P)
                this._settledAt(t._state, e, t._result);
              else if ("function" != typeof l)
                this._remaining--, (this._result[e] = t);
              else if (i === z) {
                var d = new i(s);
                h ? u(d, c) : r(d, t, l), this._willSettleAt(d, e);
              } else
                this._willSettleAt(
                  new i(function (e) {
                    return e(t);
                  }),
                  e
                );
            } else this._willSettleAt(a(t), e);
          }),
          (t.prototype._settledAt = function (t, e, i) {
            var n = this.promise;
            n._state === P &&
              (this._remaining--, t === E ? u(n, i) : (this._result[e] = i)),
              0 === this._remaining && c(n, this._result);
          }),
          (t.prototype._willSettleAt = function (t, e) {
            var i = this;
            h(
              t,
              void 0,
              function (t) {
                return i._settledAt(A, e, t);
              },
              function (t) {
                return i._settledAt(E, e, t);
              }
            );
          }),
          t
        );
      })(),
      z = (function () {
        function e(t) {
          (this[k] = O++),
            (this._result = this._state = void 0),
            (this._subscribers = []),
            s !== t &&
              ("function" != typeof t &&
                (function () {
                  throw new TypeError(
                    "You must pass a resolver function as the first argument to the promise constructor"
                  );
                })(),
              this instanceof e
                ? (function (t, e) {
                    try {
                      e(
                        function (e) {
                          a(t, e);
                        },
                        function (e) {
                          u(t, e);
                        }
                      );
                    } catch (e) {
                      u(t, e);
                    }
                  })(this, t)
                : (function () {
                    throw new TypeError(
                      "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
                    );
                  })());
        }
        return (
          (e.prototype.catch = function (t) {
            return this.then(null, t);
          }),
          (e.prototype.finally = function (e) {
            var i = this,
              n = i.constructor;
            return t(e)
              ? i.then(
                  function (t) {
                    return n.resolve(e()).then(function () {
                      return t;
                    });
                  },
                  function (t) {
                    return n.resolve(e()).then(function () {
                      throw t;
                    });
                  }
                )
              : i.then(e, e);
          }),
          e
        );
      })();
    return (
      (z.prototype.then = n),
      (z.all = function (t) {
        return new F(this, t).promise;
      }),
      (z.race = function (t) {
        var e = this;
        return new e(
          m(t)
            ? function (i, n) {
                for (var o = t.length, s = 0; s < o; s++)
                  e.resolve(t[s]).then(i, n);
              }
            : function (t, e) {
                return e(new TypeError("You must pass an array to race."));
              }
        );
      }),
      (z.resolve = o),
      (z.reject = function (t) {
        var e = new this(s);
        return u(e, t), e;
      }),
      (z._setScheduler = function (t) {
        y = t;
      }),
      (z._setAsap = function (t) {
        _ = t;
      }),
      (z._asap = _),
      (z.polyfill = function () {
        var t = void 0;
        if ("undefined" != typeof global) t = global;
        else if ("undefined" != typeof self) t = self;
        else
          try {
            t = Function("return this")();
          } catch (t) {
            throw new Error(
              "polyfill failed because global object is unavailable in this environment"
            );
          }
        var e = t.Promise;
        if (e) {
          var i = null;
          try {
            i = Object.prototype.toString.call(e.resolve());
          } catch (t) {}
          if ("[object Promise]" === i && !e.cast) return;
        }
        t.Promise = z;
      }),
      (z.Promise = z),
      z.polyfill(),
      z
    );
  }),
  (function () {
    var t;
    function e(t) {
      var e = 0;
      return function () {
        return e < t.length ? { done: !1, value: t[e++] } : { done: !0 };
      };
    }
    var i =
        "function" == typeof Object.defineProperties
          ? Object.defineProperty
          : function (t, e, i) {
              t != Array.prototype && t != Object.prototype && (t[e] = i.value);
            },
      n =
        "undefined" != typeof window && window === this
          ? this
          : "undefined" != typeof global && null != global
          ? global
          : this;
    function o() {
      (o = function () {}), n.Symbol || (n.Symbol = a);
    }
    function s(t, e) {
      (this.s = t),
        i(this, "description", { configurable: !0, writable: !0, value: e });
    }
    s.prototype.toString = function () {
      return this.s;
    };
    var r,
      a = (function () {
        var t = 0;
        return function e(i) {
          if (this instanceof e)
            throw new TypeError("Symbol is not a constructor");
          return new s("jscomp_symbol_" + (i || "") + "_" + t++, i);
        };
      })();
    function l() {
      o();
      var t = n.Symbol.iterator;
      t || (t = n.Symbol.iterator = n.Symbol("Symbol.iterator")),
        "function" != typeof Array.prototype[t] &&
          i(Array.prototype, t, {
            configurable: !0,
            writable: !0,
            value: function () {
              return (
                (t = e(this)),
                l(),
                ((t = { next: t })[n.Symbol.iterator] = function () {
                  return this;
                }),
                t
              );
              var t;
            },
          }),
        (l = function () {});
    }
    function c(t) {
      var i =
        "undefined" != typeof Symbol && Symbol.iterator && t[Symbol.iterator];
      return i ? i.call(t) : { next: e(t) };
    }
    if ("function" == typeof Object.setPrototypeOf) r = Object.setPrototypeOf;
    else {
      var u;
      t: {
        var h = {};
        try {
          (h.__proto__ = { v: !0 }), (u = h.v);
          break t;
        } catch (t) {}
        u = !1;
      }
      r = u
        ? function (t, e) {
            if (((t.__proto__ = e), t.__proto__ !== e))
              throw new TypeError(t + " is not extensible");
            return t;
          }
        : null;
    }
    var d = r;
    function p() {
      (this.h = !1),
        (this.c = null),
        (this.o = void 0),
        (this.b = 1),
        (this.m = this.w = 0),
        (this.g = null);
    }
    function f(t) {
      if (t.h) throw new TypeError("Generator is already running");
      t.h = !0;
    }
    function m(t, e, i) {
      return (t.b = i), { value: e };
    }
    function g(t) {
      for (var e in ((this.C = t), (this.l = []), t)) this.l.push(e);
      this.l.reverse();
    }
    function v(t) {
      (this.a = new p()), (this.D = t);
    }
    function y(t, e, i, n) {
      try {
        var o = e.call(t.a.c, i);
        if (!(o instanceof Object))
          throw new TypeError("Iterator result " + o + " is not an object");
        if (!o.done) return (t.a.h = !1), o;
        var s = o.value;
      } catch (e) {
        return (t.a.c = null), t.a.j(e), _(t);
      }
      return (t.a.c = null), n.call(t.a, s), _(t);
    }
    function _(t) {
      for (; t.a.b; )
        try {
          var e = t.D(t.a);
          if (e) return (t.a.h = !1), { value: e.value, done: !1 };
        } catch (e) {
          (t.a.o = void 0), t.a.j(e);
        }
      if (((t.a.h = !1), t.a.g)) {
        if (((e = t.a.g), (t.a.g = null), e.B)) throw e.A;
        return { value: e.return, done: !0 };
      }
      return { value: void 0, done: !0 };
    }
    function b(t) {
      (this.next = function (e) {
        return t.i(e);
      }),
        (this.throw = function (e) {
          return t.j(e);
        }),
        (this.return = function (e) {
          return (function (t, e) {
            f(t.a);
            var i = t.a.c;
            return i
              ? y(
                  t,
                  "return" in i
                    ? i.return
                    : function (t) {
                        return { value: t, done: !0 };
                      },
                  e,
                  t.a.return
                )
              : (t.a.return(e), _(t));
          })(t, e);
        }),
        l(),
        (this[Symbol.iterator] = function () {
          return this;
        });
    }
    function w(t, e) {
      var i = new b(new v(e));
      return d && d(i, t.prototype), i;
    }
    if (
      ((p.prototype.i = function (t) {
        this.o = t;
      }),
      (p.prototype.j = function (t) {
        (this.g = { A: t, B: !0 }), (this.b = this.w || this.m);
      }),
      (p.prototype.return = function (t) {
        (this.g = { return: t }), (this.b = this.m);
      }),
      (v.prototype.i = function (t) {
        return (
          f(this.a),
          this.a.c
            ? y(this, this.a.c.next, t, this.a.i)
            : (this.a.i(t), _(this))
        );
      }),
      (v.prototype.j = function (t) {
        return (
          f(this.a),
          this.a.c
            ? y(this, this.a.c.throw, t, this.a.i)
            : (this.a.j(t), _(this))
        );
      }),
      "undefined" != typeof Blob &&
        ("undefined" == typeof FormData || !FormData.prototype.keys))
    ) {
      var x = function (t, e) {
          for (var i = 0; i < t.length; i++) e(t[i]);
        },
        T = function (t, e, i) {
          return e instanceof Blob
            ? [
                String(t),
                e,
                void 0 !== i
                  ? i + ""
                  : "string" == typeof e.name
                  ? e.name
                  : "blob",
              ]
            : [String(t), String(e)];
        },
        $ = function (t, e) {
          if (t.length < e)
            throw new TypeError(
              e + " argument required, but only " + t.length + " present."
            );
        },
        S = function (t) {
          var e = c(t);
          return (
            (t = e.next().value),
            (e = e.next().value),
            t instanceof Blob &&
              (t = new File([t], e, {
                type: t.type,
                lastModified: t.lastModified,
              })),
            t
          );
        },
        C =
          "object" == typeof window
            ? window
            : "object" == typeof self
            ? self
            : this,
        k = C.FormData,
        P = C.XMLHttpRequest && C.XMLHttpRequest.prototype.send,
        A = C.Request && C.fetch,
        E = C.navigator && C.navigator.sendBeacon;
      o();
      var O = C.Symbol && Symbol.toStringTag;
      O &&
        (Blob.prototype[O] || (Blob.prototype[O] = "Blob"),
        "File" in C && !File.prototype[O] && (File.prototype[O] = "File"));
      try {
        new File([], "");
      } catch (t) {
        C.File = function (t, e, i) {
          return (
            (t = new Blob(t, i)),
            (i =
              i && void 0 !== i.lastModified
                ? new Date(i.lastModified)
                : new Date()),
            Object.defineProperties(t, {
              name: { value: e },
              lastModifiedDate: { value: i },
              lastModified: { value: +i },
              toString: {
                value: function () {
                  return "[object File]";
                },
              },
            }),
            O && Object.defineProperty(t, O, { value: "File" }),
            t
          );
        };
      }
      o(), l();
      var F = function (t) {
        if (((this.f = Object.create(null)), !t)) return this;
        var e = this;
        x(t.elements, function (t) {
          if (
            t.name &&
            !t.disabled &&
            "submit" !== t.type &&
            "button" !== t.type
          )
            if ("file" === t.type) {
              var i =
                t.files && t.files.length
                  ? t.files
                  : [new File([], "", { type: "application/octet-stream" })];
              x(i, function (i) {
                e.append(t.name, i);
              });
            } else
              "select-multiple" === t.type || "select-one" === t.type
                ? x(t.options, function (i) {
                    !i.disabled && i.selected && e.append(t.name, i.value);
                  })
                : "checkbox" === t.type || "radio" === t.type
                ? t.checked && e.append(t.name, t.value)
                : ((i =
                    "textarea" === t.type
                      ? t.value.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")
                      : t.value),
                  e.append(t.name, i));
        });
      };
      if (
        (((t = F.prototype).append = function (t, e, i) {
          $(arguments, 2);
          var n = c(T.apply(null, arguments));
          (t = n.next().value),
            (e = n.next().value),
            (i = n.next().value),
            (n = this.f)[t] || (n[t] = []),
            n[t].push([e, i]);
        }),
        (t.delete = function (t) {
          $(arguments, 1), delete this.f[String(t)];
        }),
        (t.entries = function t() {
          var e,
            i,
            n,
            o,
            s,
            r,
            a = this;
          return w(t, function (t) {
            switch (t.b) {
              case 1:
                (e = a.f), (n = new g(e));
              case 2:
                var l;
                t: {
                  for (l = n; 0 < l.l.length; ) {
                    var u = l.l.pop();
                    if (u in l.C) {
                      l = u;
                      break t;
                    }
                  }
                  l = null;
                }
                if (null == (i = l)) {
                  t.b = 0;
                  break;
                }
                (o = c(e[i])), (s = o.next());
              case 5:
                if (s.done) {
                  t.b = 2;
                  break;
                }
                return (r = s.value), m(t, [i, S(r)], 6);
              case 6:
                (s = o.next()), (t.b = 5);
            }
          });
        }),
        (t.forEach = function (t, e) {
          $(arguments, 1);
          for (var i = c(this), n = i.next(); !n.done; n = i.next()) {
            var o = c(n.value);
            (n = o.next().value), (o = o.next().value), t.call(e, o, n, this);
          }
        }),
        (t.get = function (t) {
          $(arguments, 1);
          var e = this.f;
          return e[(t = String(t))] ? S(e[t][0]) : null;
        }),
        (t.getAll = function (t) {
          return $(arguments, 1), (this.f[String(t)] || []).map(S);
        }),
        (t.has = function (t) {
          return $(arguments, 1), String(t) in this.f;
        }),
        (t.keys = function t() {
          var e,
            i,
            n,
            o,
            s = this;
          return w(t, function (t) {
            if ((1 == t.b && ((e = c(s)), (i = e.next())), 3 != t.b))
              return i.done
                ? void (t.b = 0)
                : ((n = i.value), (o = c(n)), m(t, o.next().value, 3));
            (i = e.next()), (t.b = 2);
          });
        }),
        (t.set = function (t, e, i) {
          $(arguments, 2);
          var n = T.apply(null, arguments);
          this.f[n[0]] = [[n[1], n[2]]];
        }),
        (t.values = function t() {
          var e,
            i,
            n,
            o,
            s = this;
          return w(t, function (t) {
            if ((1 == t.b && ((e = c(s)), (i = e.next())), 3 != t.b))
              return i.done
                ? void (t.b = 0)
                : ((n = i.value), (o = c(n)).next(), m(t, o.next().value, 3));
            (i = e.next()), (t.b = 2);
          });
        }),
        (F.prototype._asNative = function () {
          for (
            var t = new k(), e = c(this), i = e.next();
            !i.done;
            i = e.next()
          ) {
            var n = c(i.value);
            (i = n.next().value), (n = n.next().value), t.append(i, n);
          }
          return t;
        }),
        (F.prototype._blob = function () {
          for (
            var t = "----formdata-polyfill-" + Math.random(),
              e = [],
              i = c(this),
              n = i.next();
            !n.done;
            n = i.next()
          ) {
            var o = c(n.value);
            (n = o.next().value),
              (o = o.next().value),
              e.push("--" + t + "\r\n"),
              o instanceof Blob
                ? e.push(
                    'Content-Disposition: form-data; name="' +
                      n +
                      '"; filename="' +
                      o.name +
                      '"\r\n',
                    "Content-Type: " +
                      (o.type || "application/octet-stream") +
                      "\r\n\r\n",
                    o,
                    "\r\n"
                  )
                : e.push(
                    'Content-Disposition: form-data; name="' +
                      n +
                      '"\r\n\r\n' +
                      o +
                      "\r\n"
                  );
          }
          return (
            e.push("--" + t + "--"),
            new Blob(e, { type: "multipart/form-data; boundary=" + t })
          );
        }),
        (F.prototype[Symbol.iterator] = function () {
          return this.entries();
        }),
        (F.prototype.toString = function () {
          return "[object FormData]";
        }),
        O && (F.prototype[O] = "FormData"),
        P)
      ) {
        var z = C.XMLHttpRequest.prototype.setRequestHeader;
        (C.XMLHttpRequest.prototype.setRequestHeader = function (t, e) {
          z.call(this, t, e),
            "content-type" === t.toLowerCase() && (this.u = !0);
        }),
          (C.XMLHttpRequest.prototype.send = function (t) {
            t instanceof F
              ? ((t = t._blob()),
                this.u || this.setRequestHeader("Content-Type", t.type),
                P.call(this, t))
              : P.call(this, t);
          });
      }
      if (A) {
        var M = C.fetch;
        C.fetch = function (t, e) {
          return (
            e && e.body && e.body instanceof F && (e.body = e.body._blob()),
            M.call(this, t, e)
          );
        };
      }
      E &&
        (C.navigator.sendBeacon = function (t, e) {
          return e instanceof F && (e = e._asNative()), E.call(this, t, e);
        }),
        (C.FormData = F);
    }
  })(),
  (Number.prototype.isBetween = function (t, e) {
    return (
      void 0 !== t && void 0 !== e && this.valueOf() >= t && this.valueOf() <= e
    );
  }),
  $(document).ready(function () {
    ($.checkSiteRTLDirection = function () {
      var t = $("html").attr("dir");
      return "rtl" == (void 0 !== t ? t.toLocaleLowerCase() : "");
    }),
      ($.extractValueFromStr = function (t, e) {
        if ("" !== t && void 0 !== t) {
          var i = t.match(new RegExp(e + "=([^&]*)"));
          return i && i[1];
        }
        return "";
      }),
      ($.getQueryString = function (t) {
        for (
          var e = window.location.href
              .slice(window.location.href.indexOf("?") + 1)
              .split("&"),
            i = 0;
          i < e.length;
          i++
        ) {
          var n = e[i].split("=");
          if (n[0].toLocaleLowerCase() == t.toLocaleLowerCase()) return n[1];
        }
      }),
      ($.fn.replaceClass = function (t, e) {
        return $(this).removeClass(t).addClass(e);
      }),
      ($.dispatchEvent = function (t) {
        var e;
        "function" == typeof Event
          ? (e = new Event(t))
          : (e = document.createEvent("Event")).initEvent(t, !0, !0),
          document.dispatchEvent(e);
      }),
      $.validator &&
        (($.validator.methods.pattern = function (t, e) {
          var i = $(e).data("relatedInput"),
            n = $(e).attr("pattern");
          if (i && ($(i).is(":checked") || $(i).val())) {
            var o = new RegExp(n);
            let t = (e.value || "").trim().replace(" ", "");
            if (t) return o.test(t);
          }
          return !0;
        }),
        ($.validator.methods.phone = function (t, e) {
          var i = $(e).data("relatedInput");
          if (i && ($(i).is(":checked") || $(i).val())) {
            var n = new RegExp("[0-9]");
            return (
              e.value.length <= 15 && e.value.length >= 9 && n.test(e.value)
            );
          }
          return this.optional(e);
        }));
  }),
  $(document).ready(function () {
    var t = $.checkSiteRTLDirection();
    $.validator &&
      ($.extend($.validator, {
        required: "This fields is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        contenttype: "File type should be {0}",
        filesize: "File size should not exceed {0} byte",
        recaptcha: "Please check captcha again",
        extension: "Please attach file with corresponding extenion",
        accept: "Please enter a value with a valid extension.",
        maxlength: jQuery.validator.format(
          "Please enter no more than {0} characters."
        ),
        minlength: jQuery.validator.format(
          "Please enter at least {0} characters."
        ),
        rangelength: jQuery.validator.format(
          "Please enter a value between {0} and {1} characters long."
        ),
        range: jQuery.validator.format(
          "Please enter a value between {0} and {1}."
        ),
        max: jQuery.validator.format(
          "Please enter a value less than or equal to {0}."
        ),
        min: jQuery.validator.format(
          "Please enter a value greater than or equal to {0}."
        ),
      }),
      t &&
        $.extend($.validator.messages, {
          required: "هذا الحقل إلزامي",
          remote: "يرجى تصحيح هذا الحقل للمتابعة",
          email: "يرجى إدخال عنوان بريد إلكتروني صحيح",
          url: "رجاء إدخال عنوان موقع إلكتروني صحيح",
          date: "رجاء إدخال تاريخ صحيح",
          dateISO: "رجاء إدخال تاريخ صحيح (ISO)",
          number: "رجاء إدخال عدد بطريقة صحيحة",
          digits: "رجاء إدخال أرقام فقط",
          creditcard: "رجاء إدخال رقم بطاقة ائتمان صحيح",
          equalTo: "رجاء إدخال نفس القيمة",
          contenttype: " يجب أن يكون الملف من نوع {0} ",
          filesize: "يجب أن لا يتعدي حجم الملف {0} بايت",
          recaptcha: "من فضلك قم بتآكيد كود التحقق",
          extension: "رجاء إدخال ملف بامتداد موافق عليه",
          accept: "رجاء إدخال ملف بامتداد موافق عليه",
          maxlength: $.validator.format("الحد الأقصى لعدد الحروف هو {0}"),
          minlength: $.validator.format("الحد الأدنى لعدد الحروف هو {0}"),
          rangelength: $.validator.format(
            "عدد الحروف يجب أن يكون بين {0} و {1}"
          ),
          range: $.validator.format("رجاء إدخال عدد قيمته بين {0} و {1}"),
          max: $.validator.format("رجاء إدخال عدد أقل من أو يساوي {0}"),
          min: $.validator.format("رجاء إدخال عدد أكبر من أو يساوي {0}"),
        }));
  }),
  (function (t) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "undefined" != typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (t) {
    "use strict";
    var e = window.Slick || {};
    ((e = (function () {
      var e = 0;
      return function (i, n) {
        var o,
          s = this;
        (s.defaults = {
          accessibility: !0,
          adaptiveHeight: !1,
          appendArrows: t(i),
          appendDots: t(i),
          arrows: !0,
          asNavFor: null,
          prevArrow:
            '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
          nextArrow:
            '<button class="slick-next" aria-label="Next" type="button">Next</button>',
          autoplay: !1,
          autoplaySpeed: 3e3,
          centerMode: !1,
          centerPadding: "50px",
          cssEase: "ease",
          customPaging: function (e, i) {
            return t('<button type="button" />').text(i + 1);
          },
          dots: !1,
          dotsClass: "slick-dots",
          draggable: !0,
          easing: "linear",
          edgeFriction: 0.35,
          fade: !1,
          focusOnSelect: !1,
          focusOnChange: !1,
          infinite: !0,
          initialSlide: 0,
          lazyLoad: "ondemand",
          mobileFirst: !1,
          pauseOnHover: !0,
          pauseOnFocus: !0,
          pauseOnDotsHover: !1,
          respondTo: "window",
          responsive: null,
          rows: 1,
          rtl: !1,
          slide: "",
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 4,
          speed: 500,
          swipe: !0,
          swipeToSlide: !1,
          touchMove: !0,
          touchThreshold: 5,
          useCSS: !0,
          useTransform: !0,
          variableWidth: !1,
          vertical: !1,
          verticalSwiping: !1,
          waitForAnimate: !0,
          zIndex: 1e3,
        }),
          (s.initials = {
            animating: !1,
            dragging: !1,
            autoPlayTimer: null,
            currentDirection: 0,
            currentLeft: null,
            currentSlide: 0,
            direction: 1,
            $dots: null,
            listWidth: null,
            listHeight: null,
            loadIndex: 0,
            $nextArrow: null,
            $prevArrow: null,
            scrolling: !1,
            slideCount: null,
            slideWidth: null,
            $slideTrack: null,
            $slides: null,
            sliding: !1,
            slideOffset: 0,
            swipeLeft: null,
            swiping: !1,
            $list: null,
            touchObject: {},
            transformsEnabled: !1,
            unslicked: !1,
          }),
          t.extend(s, s.initials),
          (s.activeBreakpoint = null),
          (s.animType = null),
          (s.animProp = null),
          (s.breakpoints = []),
          (s.breakpointSettings = []),
          (s.cssTransitions = !1),
          (s.focussed = !1),
          (s.interrupted = !1),
          (s.hidden = "hidden"),
          (s.paused = !0),
          (s.positionProp = null),
          (s.respondTo = null),
          (s.rowCount = 1),
          (s.shouldClick = !0),
          (s.$slider = t(i)),
          (s.$slidesCache = null),
          (s.transformType = null),
          (s.transitionType = null),
          (s.visibilityChange = "visibilitychange"),
          (s.windowWidth = 0),
          (s.windowTimer = null),
          (o = t(i).data("slick") || {}),
          (s.options = t.extend({}, s.defaults, n, o)),
          (s.currentSlide = s.options.initialSlide),
          (s.originalSettings = s.options),
          void 0 !== document.mozHidden
            ? ((s.hidden = "mozHidden"),
              (s.visibilityChange = "mozvisibilitychange"))
            : void 0 !== document.webkitHidden &&
              ((s.hidden = "webkitHidden"),
              (s.visibilityChange = "webkitvisibilitychange")),
          (s.autoPlay = t.proxy(s.autoPlay, s)),
          (s.autoPlayClear = t.proxy(s.autoPlayClear, s)),
          (s.autoPlayIterator = t.proxy(s.autoPlayIterator, s)),
          (s.changeSlide = t.proxy(s.changeSlide, s)),
          (s.clickHandler = t.proxy(s.clickHandler, s)),
          (s.selectHandler = t.proxy(s.selectHandler, s)),
          (s.setPosition = t.proxy(s.setPosition, s)),
          (s.swipeHandler = t.proxy(s.swipeHandler, s)),
          (s.dragHandler = t.proxy(s.dragHandler, s)),
          (s.keyHandler = t.proxy(s.keyHandler, s)),
          (s.instanceUid = e++),
          (s.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
          s.registerBreakpoints(),
          s.init(!0);
      };
    })()).prototype.activateADA = function () {
      this.$slideTrack
        .find(".slick-active")
        .attr({ "aria-hidden": "false" })
        .find("a, input, button, select")
        .attr({ tabindex: "0" });
    }),
      (e.prototype.addSlide = e.prototype.slickAdd =
        function (e, i, n) {
          var o = this;
          if ("boolean" == typeof i) (n = i), (i = null);
          else if (i < 0 || i >= o.slideCount) return !1;
          o.unload(),
            "number" == typeof i
              ? 0 === i && 0 === o.$slides.length
                ? t(e).appendTo(o.$slideTrack)
                : n
                ? t(e).insertBefore(o.$slides.eq(i))
                : t(e).insertAfter(o.$slides.eq(i))
              : !0 === n
              ? t(e).prependTo(o.$slideTrack)
              : t(e).appendTo(o.$slideTrack),
            (o.$slides = o.$slideTrack.children(this.options.slide)),
            o.$slideTrack.children(this.options.slide).detach(),
            o.$slideTrack.append(o.$slides),
            o.$slides.each(function (e, i) {
              t(i).attr("data-slick-index", e);
            }),
            (o.$slidesCache = o.$slides),
            o.reinit();
        }),
      (e.prototype.animateHeight = function () {
        var t = this;
        if (
          1 === t.options.slidesToShow &&
          !0 === t.options.adaptiveHeight &&
          !1 === t.options.vertical
        ) {
          var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
          t.$list.animate({ height: e }, t.options.speed);
        }
      }),
      (e.prototype.animateSlide = function (e, i) {
        var n = {},
          o = this;
        o.animateHeight(),
          !0 === o.options.rtl && !1 === o.options.vertical && (e = -e),
          !1 === o.transformsEnabled
            ? !1 === o.options.vertical
              ? o.$slideTrack.animate(
                  { left: e },
                  o.options.speed,
                  o.options.easing,
                  i
                )
              : o.$slideTrack.animate(
                  { top: e },
                  o.options.speed,
                  o.options.easing,
                  i
                )
            : !1 === o.cssTransitions
            ? (!0 === o.options.rtl && (o.currentLeft = -o.currentLeft),
              t({ animStart: o.currentLeft }).animate(
                { animStart: e },
                {
                  duration: o.options.speed,
                  easing: o.options.easing,
                  step: function (t) {
                    (t = Math.ceil(t)),
                      !1 === o.options.vertical
                        ? ((n[o.animType] = "translate(" + t + "px, 0px)"),
                          o.$slideTrack.css(n))
                        : ((n[o.animType] = "translate(0px," + t + "px)"),
                          o.$slideTrack.css(n));
                  },
                  complete: function () {
                    i && i.call();
                  },
                }
              ))
            : (o.applyTransition(),
              (e = Math.ceil(e)),
              !1 === o.options.vertical
                ? (n[o.animType] = "translate3d(" + e + "px, 0px, 0px)")
                : (n[o.animType] = "translate3d(0px," + e + "px, 0px)"),
              o.$slideTrack.css(n),
              i &&
                setTimeout(function () {
                  o.disableTransition(), i.call();
                }, o.options.speed));
      }),
      (e.prototype.getNavTarget = function () {
        var e = this.options.asNavFor;
        return e && null !== e && (e = t(e).not(this.$slider)), e;
      }),
      (e.prototype.asNavFor = function (e) {
        var i = this.getNavTarget();
        null !== i &&
          "object" == typeof i &&
          i.each(function () {
            var i = t(this).slick("getSlick");
            i.unslicked || i.slideHandler(e, !0);
          });
      }),
      (e.prototype.applyTransition = function (t) {
        var e = this,
          i = {};
        !1 === e.options.fade
          ? (i[e.transitionType] =
              e.transformType +
              " " +
              e.options.speed +
              "ms " +
              e.options.cssEase)
          : (i[e.transitionType] =
              "opacity " + e.options.speed + "ms " + e.options.cssEase),
          !1 === e.options.fade ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i);
      }),
      (e.prototype.autoPlay = function () {
        var t = this;
        t.autoPlayClear(),
          t.slideCount > t.options.slidesToShow &&
            (t.autoPlayTimer = setInterval(
              t.autoPlayIterator,
              t.options.autoplaySpeed
            ));
      }),
      (e.prototype.autoPlayClear = function () {
        this.autoPlayTimer && clearInterval(this.autoPlayTimer);
      }),
      (e.prototype.autoPlayIterator = function () {
        var t = this,
          e = t.currentSlide + t.options.slidesToScroll;
        t.paused ||
          t.interrupted ||
          t.focussed ||
          (!1 === t.options.infinite &&
            (1 === t.direction && t.currentSlide + 1 === t.slideCount - 1
              ? (t.direction = 0)
              : 0 === t.direction &&
                ((e = t.currentSlide - t.options.slidesToScroll),
                t.currentSlide - 1 == 0 && (t.direction = 1))),
          t.slideHandler(e));
      }),
      (e.prototype.buildArrows = function () {
        var e = this;
        !0 === e.options.arrows &&
          ((e.$prevArrow = t(e.options.prevArrow).addClass("slick-arrow")),
          (e.$nextArrow = t(e.options.nextArrow).addClass("slick-arrow")),
          e.slideCount > e.options.slidesToShow
            ? (e.$prevArrow
                .removeClass("slick-hidden")
                .removeAttr("aria-hidden tabindex"),
              e.$nextArrow
                .removeClass("slick-hidden")
                .removeAttr("aria-hidden tabindex"),
              e.htmlExpr.test(e.options.prevArrow) &&
                e.$prevArrow.prependTo(e.options.appendArrows),
              e.htmlExpr.test(e.options.nextArrow) &&
                e.$nextArrow.appendTo(e.options.appendArrows),
              !0 !== e.options.infinite &&
                e.$prevArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"))
            : e.$prevArrow
                .add(e.$nextArrow)
                .addClass("slick-hidden")
                .attr({ "aria-disabled": "true", tabindex: "-1" }));
      }),
      (e.prototype.buildDots = function () {
        var e,
          i,
          n = this;
        if (!0 === n.options.dots && n.slideCount > n.options.slidesToShow) {
          for (
            n.$slider.addClass("slick-dotted"),
              i = t("<ul />").addClass(n.options.dotsClass),
              e = 0;
            e <= n.getDotCount();
            e += 1
          )
            i.append(
              t("<li />").append(n.options.customPaging.call(this, n, e))
            );
          (n.$dots = i.appendTo(n.options.appendDots)),
            n.$dots.find("li").first().addClass("slick-active");
        }
      }),
      (e.prototype.buildOut = function () {
        var e = this;
        (e.$slides = e.$slider
          .children(e.options.slide + ":not(.slick-cloned)")
          .addClass("slick-slide")),
          (e.slideCount = e.$slides.length),
          e.$slides.each(function (e, i) {
            t(i)
              .attr("data-slick-index", e)
              .data("originalStyling", t(i).attr("style") || "");
          }),
          e.$slider.addClass("slick-slider"),
          (e.$slideTrack =
            0 === e.slideCount
              ? t('<div class="slick-track"/>').appendTo(e.$slider)
              : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
          (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
          e.$slideTrack.css("opacity", 0),
          (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) ||
            (e.options.slidesToScroll = 1),
          t("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
          e.setupInfinite(),
          e.buildArrows(),
          e.buildDots(),
          e.updateDots(),
          e.setSlideClasses(
            "number" == typeof e.currentSlide ? e.currentSlide : 0
          ),
          !0 === e.options.draggable && e.$list.addClass("draggable");
      }),
      (e.prototype.buildRows = function () {
        var t,
          e,
          i,
          n,
          o,
          s,
          r,
          a = this;
        if (
          ((n = document.createDocumentFragment()),
          (s = a.$slider.children()),
          a.options.rows > 0)
        ) {
          for (
            r = a.options.slidesPerRow * a.options.rows,
              o = Math.ceil(s.length / r),
              t = 0;
            t < o;
            t++
          ) {
            var l = document.createElement("div");
            for (e = 0; e < a.options.rows; e++) {
              var c = document.createElement("div");
              for (i = 0; i < a.options.slidesPerRow; i++) {
                var u = t * r + (e * a.options.slidesPerRow + i);
                s.get(u) && c.appendChild(s.get(u));
              }
              l.appendChild(c);
            }
            n.appendChild(l);
          }
          a.$slider.empty().append(n),
            a.$slider
              .children()
              .children()
              .children()
              .css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block",
              });
        }
      }),
      (e.prototype.checkResponsive = function (e, i) {
        var n,
          o,
          s,
          r = this,
          a = !1,
          l = r.$slider.width(),
          c = window.innerWidth || t(window).width();
        if (
          ("window" === r.respondTo
            ? (s = c)
            : "slider" === r.respondTo
            ? (s = l)
            : "min" === r.respondTo && (s = Math.min(c, l)),
          r.options.responsive &&
            r.options.responsive.length &&
            null !== r.options.responsive)
        ) {
          for (n in ((o = null), r.breakpoints))
            r.breakpoints.hasOwnProperty(n) &&
              (!1 === r.originalSettings.mobileFirst
                ? s < r.breakpoints[n] && (o = r.breakpoints[n])
                : s > r.breakpoints[n] && (o = r.breakpoints[n]));
          null !== o
            ? null !== r.activeBreakpoint
              ? (o !== r.activeBreakpoint || i) &&
                ((r.activeBreakpoint = o),
                "unslick" === r.breakpointSettings[o]
                  ? r.unslick(o)
                  : ((r.options = t.extend(
                      {},
                      r.originalSettings,
                      r.breakpointSettings[o]
                    )),
                    !0 === e && (r.currentSlide = r.options.initialSlide),
                    r.refresh(e)),
                (a = o))
              : ((r.activeBreakpoint = o),
                "unslick" === r.breakpointSettings[o]
                  ? r.unslick(o)
                  : ((r.options = t.extend(
                      {},
                      r.originalSettings,
                      r.breakpointSettings[o]
                    )),
                    !0 === e && (r.currentSlide = r.options.initialSlide),
                    r.refresh(e)),
                (a = o))
            : null !== r.activeBreakpoint &&
              ((r.activeBreakpoint = null),
              (r.options = r.originalSettings),
              !0 === e && (r.currentSlide = r.options.initialSlide),
              r.refresh(e),
              (a = o)),
            e || !1 === a || r.$slider.trigger("breakpoint", [r, a]);
        }
      }),
      (e.prototype.changeSlide = function (e, i) {
        var n,
          o,
          s = this,
          r = t(e.currentTarget);
        switch (
          (r.is("a") && e.preventDefault(),
          r.is("li") || (r = r.closest("li")),
          (n =
            s.slideCount % s.options.slidesToScroll != 0
              ? 0
              : (s.slideCount - s.currentSlide) % s.options.slidesToScroll),
          e.data.message)
        ) {
          case "previous":
            (o =
              0 === n ? s.options.slidesToScroll : s.options.slidesToShow - n),
              s.slideCount > s.options.slidesToShow &&
                s.slideHandler(s.currentSlide - o, !1, i);
            break;
          case "next":
            (o = 0 === n ? s.options.slidesToScroll : n),
              s.slideCount > s.options.slidesToShow &&
                s.slideHandler(s.currentSlide + o, !1, i);
            break;
          case "index":
            var a =
              0 === e.data.index
                ? 0
                : e.data.index || r.index() * s.options.slidesToScroll;
            s.slideHandler(s.checkNavigable(a), !1, i),
              r.children().trigger("focus");
            break;
          default:
            return;
        }
      }),
      (e.prototype.checkNavigable = function (t) {
        var e, i;
        if (((i = 0), t > (e = this.getNavigableIndexes())[e.length - 1]))
          t = e[e.length - 1];
        else
          for (var n in e) {
            if (t < e[n]) {
              t = i;
              break;
            }
            i = e[n];
          }
        return t;
      }),
      (e.prototype.cleanUpEvents = function () {
        var e = this;
        e.options.dots &&
          null !== e.$dots &&
          (t("li", e.$dots)
            .off("click.slick", e.changeSlide)
            .off("mouseenter.slick", t.proxy(e.interrupt, e, !0))
            .off("mouseleave.slick", t.proxy(e.interrupt, e, !1)),
          !0 === e.options.accessibility &&
            e.$dots.off("keydown.slick", e.keyHandler)),
          e.$slider.off("focus.slick blur.slick"),
          !0 === e.options.arrows &&
            e.slideCount > e.options.slidesToShow &&
            (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
            e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
            !0 === e.options.accessibility &&
              (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
              e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
          e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
          e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
          e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
          e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
          e.$list.off("click.slick", e.clickHandler),
          t(document).off(e.visibilityChange, e.visibility),
          e.cleanUpSlideEvents(),
          !0 === e.options.accessibility &&
            e.$list.off("keydown.slick", e.keyHandler),
          !0 === e.options.focusOnSelect &&
            t(e.$slideTrack).children().off("click.slick", e.selectHandler),
          t(window).off(
            "orientationchange.slick.slick-" + e.instanceUid,
            e.orientationChange
          ),
          t(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
          t("[draggable!=true]", e.$slideTrack).off(
            "dragstart",
            e.preventDefault
          ),
          t(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
      }),
      (e.prototype.cleanUpSlideEvents = function () {
        var e = this;
        e.$list.off("mouseenter.slick", t.proxy(e.interrupt, e, !0)),
          e.$list.off("mouseleave.slick", t.proxy(e.interrupt, e, !1));
      }),
      (e.prototype.cleanUpRows = function () {
        var t,
          e = this;
        e.options.rows > 0 &&
          ((t = e.$slides.children().children()), e.$slider.empty().append(t));
      }),
      (e.prototype.clickHandler = function (t) {
        !1 === this.shouldClick &&
          (t.stopImmediatePropagation(),
          t.stopPropagation(),
          t.preventDefault());
      }),
      (e.prototype.destroy = function (e) {
        var i = this;
        i.autoPlayClear(),
          (i.touchObject = {}),
          i.cleanUpEvents(),
          t(".slick-cloned", i.$slider).detach(),
          i.$dots && i.$dots.remove(),
          i.$prevArrow &&
            i.$prevArrow.length &&
            (i.$prevArrow
              .removeClass("slick-disabled slick-arrow slick-hidden")
              .removeAttr("aria-hidden aria-disabled tabindex")
              .css("display", ""),
            i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()),
          i.$nextArrow &&
            i.$nextArrow.length &&
            (i.$nextArrow
              .removeClass("slick-disabled slick-arrow slick-hidden")
              .removeAttr("aria-hidden aria-disabled tabindex")
              .css("display", ""),
            i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()),
          i.$slides &&
            (i.$slides
              .removeClass(
                "slick-slide slick-active slick-center slick-visible slick-current"
              )
              .removeAttr("aria-hidden")
              .removeAttr("data-slick-index")
              .each(function () {
                t(this).attr("style", t(this).data("originalStyling"));
              }),
            i.$slideTrack.children(this.options.slide).detach(),
            i.$slideTrack.detach(),
            i.$list.detach(),
            i.$slider.append(i.$slides)),
          i.cleanUpRows(),
          i.$slider.removeClass("slick-slider"),
          i.$slider.removeClass("slick-initialized"),
          i.$slider.removeClass("slick-dotted"),
          (i.unslicked = !0),
          e || i.$slider.trigger("destroy", [i]);
      }),
      (e.prototype.disableTransition = function (t) {
        var e = this,
          i = {};
        (i[e.transitionType] = ""),
          !1 === e.options.fade ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i);
      }),
      (e.prototype.fadeSlide = function (t, e) {
        var i = this;
        !1 === i.cssTransitions
          ? (i.$slides.eq(t).css({ zIndex: i.options.zIndex }),
            i.$slides
              .eq(t)
              .animate({ opacity: 1 }, i.options.speed, i.options.easing, e))
          : (i.applyTransition(t),
            i.$slides.eq(t).css({ opacity: 1, zIndex: i.options.zIndex }),
            e &&
              setTimeout(function () {
                i.disableTransition(t), e.call();
              }, i.options.speed));
      }),
      (e.prototype.fadeSlideOut = function (t) {
        var e = this;
        !1 === e.cssTransitions
          ? e.$slides
              .eq(t)
              .animate(
                { opacity: 0, zIndex: e.options.zIndex - 2 },
                e.options.speed,
                e.options.easing
              )
          : (e.applyTransition(t),
            e.$slides.eq(t).css({ opacity: 0, zIndex: e.options.zIndex - 2 }));
      }),
      (e.prototype.filterSlides = e.prototype.slickFilter =
        function (t) {
          var e = this;
          null !== t &&
            ((e.$slidesCache = e.$slides),
            e.unload(),
            e.$slideTrack.children(this.options.slide).detach(),
            e.$slidesCache.filter(t).appendTo(e.$slideTrack),
            e.reinit());
        }),
      (e.prototype.focusHandler = function () {
        var e = this;
        e.$slider
          .off("focus.slick blur.slick")
          .on("focus.slick", "*", function (i) {
            var n = t(this);
            setTimeout(function () {
              e.options.pauseOnFocus &&
                n.is(":focus") &&
                ((e.focussed = !0), e.autoPlay());
            }, 0);
          })
          .on("blur.slick", "*", function (i) {
            t(this);
            e.options.pauseOnFocus && ((e.focussed = !1), e.autoPlay());
          });
      }),
      (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
        function () {
          return this.currentSlide;
        }),
      (e.prototype.getDotCount = function () {
        var t = this,
          e = 0,
          i = 0,
          n = 0;
        if (!0 === t.options.infinite)
          if (t.slideCount <= t.options.slidesToShow) ++n;
          else
            for (; e < t.slideCount; )
              ++n,
                (e = i + t.options.slidesToScroll),
                (i +=
                  t.options.slidesToScroll <= t.options.slidesToShow
                    ? t.options.slidesToScroll
                    : t.options.slidesToShow);
        else if (!0 === t.options.centerMode) n = t.slideCount;
        else if (t.options.asNavFor)
          for (; e < t.slideCount; )
            ++n,
              (e = i + t.options.slidesToScroll),
              (i +=
                t.options.slidesToScroll <= t.options.slidesToShow
                  ? t.options.slidesToScroll
                  : t.options.slidesToShow);
        else
          n =
            1 +
            Math.ceil(
              (t.slideCount - t.options.slidesToShow) / t.options.slidesToScroll
            );
        return n - 1;
      }),
      (e.prototype.getLeft = function (t) {
        var e,
          i,
          n,
          o,
          s = this,
          r = 0;
        return (
          (s.slideOffset = 0),
          (i = s.$slides.first().outerHeight(!0)),
          !0 === s.options.infinite
            ? (s.slideCount > s.options.slidesToShow &&
                ((s.slideOffset = s.slideWidth * s.options.slidesToShow * -1),
                (o = -1),
                !0 === s.options.vertical &&
                  !0 === s.options.centerMode &&
                  (2 === s.options.slidesToShow
                    ? (o = -1.5)
                    : 1 === s.options.slidesToShow && (o = -2)),
                (r = i * s.options.slidesToShow * o)),
              s.slideCount % s.options.slidesToScroll != 0 &&
                t + s.options.slidesToScroll > s.slideCount &&
                s.slideCount > s.options.slidesToShow &&
                (t > s.slideCount
                  ? ((s.slideOffset =
                      (s.options.slidesToShow - (t - s.slideCount)) *
                      s.slideWidth *
                      -1),
                    (r =
                      (s.options.slidesToShow - (t - s.slideCount)) * i * -1))
                  : ((s.slideOffset =
                      (s.slideCount % s.options.slidesToScroll) *
                      s.slideWidth *
                      -1),
                    (r = (s.slideCount % s.options.slidesToScroll) * i * -1))))
            : t + s.options.slidesToShow > s.slideCount &&
              ((s.slideOffset =
                (t + s.options.slidesToShow - s.slideCount) * s.slideWidth),
              (r = (t + s.options.slidesToShow - s.slideCount) * i)),
          s.slideCount <= s.options.slidesToShow &&
            ((s.slideOffset = 0), (r = 0)),
          !0 === s.options.centerMode && s.slideCount <= s.options.slidesToShow
            ? (s.slideOffset =
                (s.slideWidth * Math.floor(s.options.slidesToShow)) / 2 -
                (s.slideWidth * s.slideCount) / 2)
            : !0 === s.options.centerMode && !0 === s.options.infinite
            ? (s.slideOffset +=
                s.slideWidth * Math.floor(s.options.slidesToShow / 2) -
                s.slideWidth)
            : !0 === s.options.centerMode &&
              ((s.slideOffset = 0),
              (s.slideOffset +=
                s.slideWidth * Math.floor(s.options.slidesToShow / 2))),
          (e =
            !1 === s.options.vertical
              ? t * s.slideWidth * -1 + s.slideOffset
              : t * i * -1 + r),
          !0 === s.options.variableWidth &&
            ((n =
              s.slideCount <= s.options.slidesToShow ||
              !1 === s.options.infinite
                ? s.$slideTrack.children(".slick-slide").eq(t)
                : s.$slideTrack
                    .children(".slick-slide")
                    .eq(t + s.options.slidesToShow)),
            (e =
              !0 === s.options.rtl
                ? n[0]
                  ? -1 * (s.$slideTrack.width() - n[0].offsetLeft - n.width())
                  : 0
                : n[0]
                ? -1 * n[0].offsetLeft
                : 0),
            !0 === s.options.centerMode &&
              ((n =
                s.slideCount <= s.options.slidesToShow ||
                !1 === s.options.infinite
                  ? s.$slideTrack.children(".slick-slide").eq(t)
                  : s.$slideTrack
                      .children(".slick-slide")
                      .eq(t + s.options.slidesToShow + 1)),
              (e =
                !0 === s.options.rtl
                  ? n[0]
                    ? -1 * (s.$slideTrack.width() - n[0].offsetLeft - n.width())
                    : 0
                  : n[0]
                  ? -1 * n[0].offsetLeft
                  : 0),
              (e += (s.$list.width() - n.outerWidth()) / 2))),
          e
        );
      }),
      (e.prototype.getOption = e.prototype.slickGetOption =
        function (t) {
          return this.options[t];
        }),
      (e.prototype.getNavigableIndexes = function () {
        var t,
          e = this,
          i = 0,
          n = 0,
          o = [];
        for (
          !1 === e.options.infinite
            ? (t = e.slideCount)
            : ((i = -1 * e.options.slidesToScroll),
              (n = -1 * e.options.slidesToScroll),
              (t = 2 * e.slideCount));
          i < t;

        )
          o.push(i),
            (i = n + e.options.slidesToScroll),
            (n +=
              e.options.slidesToScroll <= e.options.slidesToShow
                ? e.options.slidesToScroll
                : e.options.slidesToShow);
        return o;
      }),
      (e.prototype.getSlick = function () {
        return this;
      }),
      (e.prototype.getSlideCount = function () {
        var e,
          i,
          n,
          o = this;
        return (
          (n =
            !0 === o.options.centerMode ? Math.floor(o.$list.width() / 2) : 0),
          (i = -1 * o.swipeLeft + n),
          !0 === o.options.swipeToSlide
            ? (o.$slideTrack.find(".slick-slide").each(function (n, s) {
                var r, a;
                if (
                  ((r = t(s).outerWidth()),
                  (a = s.offsetLeft),
                  !0 !== o.options.centerMode && (a += r / 2),
                  i < a + r)
                )
                  return (e = s), !1;
              }),
              Math.abs(t(e).attr("data-slick-index") - o.currentSlide) || 1)
            : o.options.slidesToScroll
        );
      }),
      (e.prototype.goTo = e.prototype.slickGoTo =
        function (t, e) {
          this.changeSlide(
            { data: { message: "index", index: parseInt(t) } },
            e
          );
        }),
      (e.prototype.init = function (e) {
        var i = this;
        t(i.$slider).hasClass("slick-initialized") ||
          (t(i.$slider).addClass("slick-initialized"),
          i.buildRows(),
          i.buildOut(),
          i.setProps(),
          i.startLoad(),
          i.loadSlider(),
          i.initializeEvents(),
          i.updateArrows(),
          i.updateDots(),
          i.checkResponsive(!0),
          i.focusHandler()),
          e && i.$slider.trigger("init", [i]),
          !0 === i.options.accessibility && i.initADA(),
          i.options.autoplay && ((i.paused = !1), i.autoPlay());
      }),
      (e.prototype.initADA = function () {
        var e = this,
          i = Math.ceil(e.slideCount / e.options.slidesToShow),
          n = e.getNavigableIndexes().filter(function (t) {
            return t >= 0 && t < e.slideCount;
          });
        e.$slides
          .add(e.$slideTrack.find(".slick-cloned"))
          .attr({ "aria-hidden": "true", tabindex: "-1" })
          .find("a, input, button, select")
          .attr({ tabindex: "-1" }),
          null !== e.$dots &&
            (e.$slides
              .not(e.$slideTrack.find(".slick-cloned"))
              .each(function (i) {
                var o = n.indexOf(i);
                if (
                  (t(this).attr({
                    role: "tabpanel",
                    id: "slick-slide" + e.instanceUid + i,
                    tabindex: -1,
                  }),
                  -1 !== o)
                ) {
                  var s = "slick-slide-control" + e.instanceUid + o;
                  t("#" + s).length && t(this).attr({ "aria-describedby": s });
                }
              }),
            e.$dots
              .attr("role", "tablist")
              .find("li")
              .each(function (o) {
                var s = n[o];
                t(this).attr({ role: "presentation" }),
                  t(this)
                    .find("button")
                    .first()
                    .attr({
                      role: "tab",
                      id: "slick-slide-control" + e.instanceUid + o,
                      "aria-controls": "slick-slide" + e.instanceUid + s,
                      "aria-label": o + 1 + " of " + i,
                      "aria-selected": null,
                      tabindex: "-1",
                    });
              })
              .eq(e.currentSlide)
              .find("button")
              .attr({ "aria-selected": "true", tabindex: "0" })
              .end());
        for (var o = e.currentSlide, s = o + e.options.slidesToShow; o < s; o++)
          e.options.focusOnChange
            ? e.$slides.eq(o).attr({ tabindex: "0" })
            : e.$slides.eq(o).removeAttr("tabindex");
        e.activateADA();
      }),
      (e.prototype.initArrowEvents = function () {
        var t = this;
        !0 === t.options.arrows &&
          t.slideCount > t.options.slidesToShow &&
          (t.$prevArrow
            .off("click.slick")
            .on("click.slick", { message: "previous" }, t.changeSlide),
          t.$nextArrow
            .off("click.slick")
            .on("click.slick", { message: "next" }, t.changeSlide),
          !0 === t.options.accessibility &&
            (t.$prevArrow.on("keydown.slick", t.keyHandler),
            t.$nextArrow.on("keydown.slick", t.keyHandler)));
      }),
      (e.prototype.initDotEvents = function () {
        var e = this;
        !0 === e.options.dots &&
          e.slideCount > e.options.slidesToShow &&
          (t("li", e.$dots).on(
            "click.slick",
            { message: "index" },
            e.changeSlide
          ),
          !0 === e.options.accessibility &&
            e.$dots.on("keydown.slick", e.keyHandler)),
          !0 === e.options.dots &&
            !0 === e.options.pauseOnDotsHover &&
            e.slideCount > e.options.slidesToShow &&
            t("li", e.$dots)
              .on("mouseenter.slick", t.proxy(e.interrupt, e, !0))
              .on("mouseleave.slick", t.proxy(e.interrupt, e, !1));
      }),
      (e.prototype.initSlideEvents = function () {
        var e = this;
        e.options.pauseOnHover &&
          (e.$list.on("mouseenter.slick", t.proxy(e.interrupt, e, !0)),
          e.$list.on("mouseleave.slick", t.proxy(e.interrupt, e, !1)));
      }),
      (e.prototype.initializeEvents = function () {
        var e = this;
        e.initArrowEvents(),
          e.initDotEvents(),
          e.initSlideEvents(),
          e.$list.on(
            "touchstart.slick mousedown.slick",
            { action: "start" },
            e.swipeHandler
          ),
          e.$list.on(
            "touchmove.slick mousemove.slick",
            { action: "move" },
            e.swipeHandler
          ),
          e.$list.on(
            "touchend.slick mouseup.slick",
            { action: "end" },
            e.swipeHandler
          ),
          e.$list.on(
            "touchcancel.slick mouseleave.slick",
            { action: "end" },
            e.swipeHandler
          ),
          e.$list.on("click.slick", e.clickHandler),
          t(document).on(e.visibilityChange, t.proxy(e.visibility, e)),
          !0 === e.options.accessibility &&
            e.$list.on("keydown.slick", e.keyHandler),
          !0 === e.options.focusOnSelect &&
            t(e.$slideTrack).children().on("click.slick", e.selectHandler),
          t(window).on(
            "orientationchange.slick.slick-" + e.instanceUid,
            t.proxy(e.orientationChange, e)
          ),
          t(window).on(
            "resize.slick.slick-" + e.instanceUid,
            t.proxy(e.resize, e)
          ),
          t("[draggable!=true]", e.$slideTrack).on(
            "dragstart",
            e.preventDefault
          ),
          t(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
          t(e.setPosition);
      }),
      (e.prototype.initUI = function () {
        var t = this;
        !0 === t.options.arrows &&
          t.slideCount > t.options.slidesToShow &&
          (t.$prevArrow.show(), t.$nextArrow.show()),
          !0 === t.options.dots &&
            t.slideCount > t.options.slidesToShow &&
            t.$dots.show();
      }),
      (e.prototype.keyHandler = function (t) {
        var e = this;
        t.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
          (37 === t.keyCode && !0 === e.options.accessibility
            ? e.changeSlide({
                data: { message: !0 === e.options.rtl ? "next" : "previous" },
              })
            : 39 === t.keyCode &&
              !0 === e.options.accessibility &&
              e.changeSlide({
                data: { message: !0 === e.options.rtl ? "previous" : "next" },
              }));
      }),
      (e.prototype.lazyLoad = function () {
        var e,
          i,
          n,
          o = this;
        function s(e) {
          t("img[data-lazy]", e).each(function () {
            var e = t(this),
              i = t(this).attr("data-lazy"),
              n = t(this).attr("data-srcset"),
              s = t(this).attr("data-sizes") || o.$slider.attr("data-sizes"),
              r = document.createElement("img");
            (r.onload = function () {
              e.animate({ opacity: 0 }, 100, function () {
                n && (e.attr("srcset", n), s && e.attr("sizes", s)),
                  e.attr("src", i).animate({ opacity: 1 }, 200, function () {
                    e.removeAttr(
                      "data-lazy data-srcset data-sizes"
                    ).removeClass("slick-loading");
                  }),
                  o.$slider.trigger("lazyLoaded", [o, e, i]);
              });
            }),
              (r.onerror = function () {
                e
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading")
                  .addClass("slick-lazyload-error"),
                  o.$slider.trigger("lazyLoadError", [o, e, i]);
              }),
              (r.src = i);
          });
        }
        if (
          (!0 === o.options.centerMode
            ? !0 === o.options.infinite
              ? (n =
                  (i = o.currentSlide + (o.options.slidesToShow / 2 + 1)) +
                  o.options.slidesToShow +
                  2)
              : ((i = Math.max(
                  0,
                  o.currentSlide - (o.options.slidesToShow / 2 + 1)
                )),
                (n = o.options.slidesToShow / 2 + 1 + 2 + o.currentSlide))
            : ((i = o.options.infinite
                ? o.options.slidesToShow + o.currentSlide
                : o.currentSlide),
              (n = Math.ceil(i + o.options.slidesToShow)),
              !0 === o.options.fade &&
                (i > 0 && i--, n <= o.slideCount && n++)),
          (e = o.$slider.find(".slick-slide").slice(i, n)),
          "anticipated" === o.options.lazyLoad)
        )
          for (
            var r = i - 1, a = n, l = o.$slider.find(".slick-slide"), c = 0;
            c < o.options.slidesToScroll;
            c++
          )
            r < 0 && (r = o.slideCount - 1),
              (e = (e = e.add(l.eq(r))).add(l.eq(a))),
              r--,
              a++;
        s(e),
          o.slideCount <= o.options.slidesToShow
            ? s(o.$slider.find(".slick-slide"))
            : o.currentSlide >= o.slideCount - o.options.slidesToShow
            ? s(
                o.$slider.find(".slick-cloned").slice(0, o.options.slidesToShow)
              )
            : 0 === o.currentSlide &&
              s(
                o.$slider
                  .find(".slick-cloned")
                  .slice(-1 * o.options.slidesToShow)
              );
      }),
      (e.prototype.loadSlider = function () {
        var t = this;
        t.setPosition(),
          t.$slideTrack.css({ opacity: 1 }),
          t.$slider.removeClass("slick-loading"),
          t.initUI(),
          "progressive" === t.options.lazyLoad && t.progressiveLazyLoad();
      }),
      (e.prototype.next = e.prototype.slickNext =
        function () {
          this.changeSlide({ data: { message: "next" } });
        }),
      (e.prototype.orientationChange = function () {
        this.checkResponsive(), this.setPosition();
      }),
      (e.prototype.pause = e.prototype.slickPause =
        function () {
          this.autoPlayClear(), (this.paused = !0);
        }),
      (e.prototype.play = e.prototype.slickPlay =
        function () {
          var t = this;
          t.autoPlay(),
            (t.options.autoplay = !0),
            (t.paused = !1),
            (t.focussed = !1),
            (t.interrupted = !1);
        }),
      (e.prototype.postSlide = function (e) {
        var i = this;
        i.unslicked ||
          (i.$slider.trigger("afterChange", [i, e]),
          (i.animating = !1),
          i.slideCount > i.options.slidesToShow && i.setPosition(),
          (i.swipeLeft = null),
          i.options.autoplay && i.autoPlay(),
          !0 === i.options.accessibility &&
            (i.initADA(),
            i.options.focusOnChange &&
              t(i.$slides.get(i.currentSlide)).attr("tabindex", 0).focus()));
      }),
      (e.prototype.prev = e.prototype.slickPrev =
        function () {
          this.changeSlide({ data: { message: "previous" } });
        }),
      (e.prototype.preventDefault = function (t) {
        t.preventDefault();
      }),
      (e.prototype.progressiveLazyLoad = function (e) {
        e = e || 1;
        var i,
          n,
          o,
          s,
          r,
          a = this,
          l = t("img[data-lazy]", a.$slider);
        l.length
          ? ((i = l.first()),
            (n = i.attr("data-lazy")),
            (o = i.attr("data-srcset")),
            (s = i.attr("data-sizes") || a.$slider.attr("data-sizes")),
            ((r = document.createElement("img")).onload = function () {
              o && (i.attr("srcset", o), s && i.attr("sizes", s)),
                i
                  .attr("src", n)
                  .removeAttr("data-lazy data-srcset data-sizes")
                  .removeClass("slick-loading"),
                !0 === a.options.adaptiveHeight && a.setPosition(),
                a.$slider.trigger("lazyLoaded", [a, i, n]),
                a.progressiveLazyLoad();
            }),
            (r.onerror = function () {
              e < 3
                ? setTimeout(function () {
                    a.progressiveLazyLoad(e + 1);
                  }, 500)
                : (i
                    .removeAttr("data-lazy")
                    .removeClass("slick-loading")
                    .addClass("slick-lazyload-error"),
                  a.$slider.trigger("lazyLoadError", [a, i, n]),
                  a.progressiveLazyLoad());
            }),
            (r.src = n))
          : a.$slider.trigger("allImagesLoaded", [a]);
      }),
      (e.prototype.refresh = function (e) {
        var i,
          n,
          o = this;
        (n = o.slideCount - o.options.slidesToShow),
          !o.options.infinite && o.currentSlide > n && (o.currentSlide = n),
          o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0),
          (i = o.currentSlide),
          o.destroy(!0),
          t.extend(o, o.initials, { currentSlide: i }),
          o.init(),
          e || o.changeSlide({ data: { message: "index", index: i } }, !1);
      }),
      (e.prototype.registerBreakpoints = function () {
        var e,
          i,
          n,
          o = this,
          s = o.options.responsive || null;
        if ("array" === t.type(s) && s.length) {
          for (e in ((o.respondTo = o.options.respondTo || "window"), s))
            if (((n = o.breakpoints.length - 1), s.hasOwnProperty(e))) {
              for (i = s[e].breakpoint; n >= 0; )
                o.breakpoints[n] &&
                  o.breakpoints[n] === i &&
                  o.breakpoints.splice(n, 1),
                  n--;
              o.breakpoints.push(i), (o.breakpointSettings[i] = s[e].settings);
            }
          o.breakpoints.sort(function (t, e) {
            return o.options.mobileFirst ? t - e : e - t;
          });
        }
      }),
      (e.prototype.reinit = function () {
        var e = this;
        (e.$slides = e.$slideTrack
          .children(e.options.slide)
          .addClass("slick-slide")),
          (e.slideCount = e.$slides.length),
          e.currentSlide >= e.slideCount &&
            0 !== e.currentSlide &&
            (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
          e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
          e.registerBreakpoints(),
          e.setProps(),
          e.setupInfinite(),
          e.buildArrows(),
          e.updateArrows(),
          e.initArrowEvents(),
          e.buildDots(),
          e.updateDots(),
          e.initDotEvents(),
          e.cleanUpSlideEvents(),
          e.initSlideEvents(),
          e.checkResponsive(!1, !0),
          !0 === e.options.focusOnSelect &&
            t(e.$slideTrack).children().on("click.slick", e.selectHandler),
          e.setSlideClasses(
            "number" == typeof e.currentSlide ? e.currentSlide : 0
          ),
          e.setPosition(),
          e.focusHandler(),
          (e.paused = !e.options.autoplay),
          e.autoPlay(),
          e.$slider.trigger("reInit", [e]);
      }),
      (e.prototype.resize = function () {
        var e = this;
        t(window).width() !== e.windowWidth &&
          (clearTimeout(e.windowDelay),
          (e.windowDelay = window.setTimeout(function () {
            (e.windowWidth = t(window).width()),
              e.checkResponsive(),
              e.unslicked || e.setPosition();
          }, 50)));
      }),
      (e.prototype.removeSlide = e.prototype.slickRemove =
        function (t, e, i) {
          var n = this;
          if (
            ((t =
              "boolean" == typeof t
                ? !0 === (e = t)
                  ? 0
                  : n.slideCount - 1
                : !0 === e
                ? --t
                : t),
            n.slideCount < 1 || t < 0 || t > n.slideCount - 1)
          )
            return !1;
          n.unload(),
            !0 === i
              ? n.$slideTrack.children().remove()
              : n.$slideTrack.children(this.options.slide).eq(t).remove(),
            (n.$slides = n.$slideTrack.children(this.options.slide)),
            n.$slideTrack.children(this.options.slide).detach(),
            n.$slideTrack.append(n.$slides),
            (n.$slidesCache = n.$slides),
            n.reinit();
        }),
      (e.prototype.setCSS = function (t) {
        var e,
          i,
          n = this,
          o = {};
        !0 === n.options.rtl && (t = -t),
          (e = "left" == n.positionProp ? Math.ceil(t) + "px" : "0px"),
          (i = "top" == n.positionProp ? Math.ceil(t) + "px" : "0px"),
          (o[n.positionProp] = t),
          !1 === n.transformsEnabled
            ? n.$slideTrack.css(o)
            : ((o = {}),
              !1 === n.cssTransitions
                ? ((o[n.animType] = "translate(" + e + ", " + i + ")"),
                  n.$slideTrack.css(o))
                : ((o[n.animType] = "translate3d(" + e + ", " + i + ", 0px)"),
                  n.$slideTrack.css(o)));
      }),
      (e.prototype.setDimensions = function () {
        var t = this;
        !1 === t.options.vertical
          ? !0 === t.options.centerMode &&
            t.$list.css({ padding: "0px " + t.options.centerPadding })
          : (t.$list.height(
              t.$slides.first().outerHeight(!0) * t.options.slidesToShow
            ),
            !0 === t.options.centerMode &&
              t.$list.css({ padding: t.options.centerPadding + " 0px" })),
          (t.listWidth = t.$list.width()),
          (t.listHeight = t.$list.height()),
          !1 === t.options.vertical && !1 === t.options.variableWidth
            ? ((t.slideWidth = Math.ceil(t.listWidth / t.options.slidesToShow)),
              t.$slideTrack.width(
                Math.ceil(
                  t.slideWidth * t.$slideTrack.children(".slick-slide").length
                )
              ))
            : !0 === t.options.variableWidth
            ? t.$slideTrack.width(5e3 * t.slideCount)
            : ((t.slideWidth = Math.ceil(t.listWidth)),
              t.$slideTrack.height(
                Math.ceil(
                  t.$slides.first().outerHeight(!0) *
                    t.$slideTrack.children(".slick-slide").length
                )
              ));
        var e = t.$slides.first().outerWidth(!0) - t.$slides.first().width();
        !1 === t.options.variableWidth &&
          t.$slideTrack.children(".slick-slide").width(t.slideWidth - e);
      }),
      (e.prototype.setFade = function () {
        var e,
          i = this;
        i.$slides.each(function (n, o) {
          (e = i.slideWidth * n * -1),
            !0 === i.options.rtl
              ? t(o).css({
                  position: "relative",
                  right: e,
                  top: 0,
                  zIndex: i.options.zIndex - 2,
                  opacity: 0,
                })
              : t(o).css({
                  position: "relative",
                  left: e,
                  top: 0,
                  zIndex: i.options.zIndex - 2,
                  opacity: 0,
                });
        }),
          i.$slides
            .eq(i.currentSlide)
            .css({ zIndex: i.options.zIndex - 1, opacity: 1 });
      }),
      (e.prototype.setHeight = function () {
        var t = this;
        if (
          1 === t.options.slidesToShow &&
          !0 === t.options.adaptiveHeight &&
          !1 === t.options.vertical
        ) {
          var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
          t.$list.css("height", e);
        }
      }),
      (e.prototype.setOption = e.prototype.slickSetOption =
        function () {
          var e,
            i,
            n,
            o,
            s,
            r = this,
            a = !1;
          if (
            ("object" === t.type(arguments[0])
              ? ((n = arguments[0]), (a = arguments[1]), (s = "multiple"))
              : "string" === t.type(arguments[0]) &&
                ((n = arguments[0]),
                (o = arguments[1]),
                (a = arguments[2]),
                "responsive" === arguments[0] &&
                "array" === t.type(arguments[1])
                  ? (s = "responsive")
                  : void 0 !== arguments[1] && (s = "single")),
            "single" === s)
          )
            r.options[n] = o;
          else if ("multiple" === s)
            t.each(n, function (t, e) {
              r.options[t] = e;
            });
          else if ("responsive" === s)
            for (i in o)
              if ("array" !== t.type(r.options.responsive))
                r.options.responsive = [o[i]];
              else {
                for (e = r.options.responsive.length - 1; e >= 0; )
                  r.options.responsive[e].breakpoint === o[i].breakpoint &&
                    r.options.responsive.splice(e, 1),
                    e--;
                r.options.responsive.push(o[i]);
              }
          a && (r.unload(), r.reinit());
        }),
      (e.prototype.setPosition = function () {
        var t = this;
        t.setDimensions(),
          t.setHeight(),
          !1 === t.options.fade
            ? t.setCSS(t.getLeft(t.currentSlide))
            : t.setFade(),
          t.$slider.trigger("setPosition", [t]);
      }),
      (e.prototype.setProps = function () {
        var t = this,
          e = document.body.style;
        (t.positionProp = !0 === t.options.vertical ? "top" : "left"),
          "top" === t.positionProp
            ? t.$slider.addClass("slick-vertical")
            : t.$slider.removeClass("slick-vertical"),
          (void 0 === e.WebkitTransition &&
            void 0 === e.MozTransition &&
            void 0 === e.msTransition) ||
            (!0 === t.options.useCSS && (t.cssTransitions = !0)),
          t.options.fade &&
            ("number" == typeof t.options.zIndex
              ? t.options.zIndex < 3 && (t.options.zIndex = 3)
              : (t.options.zIndex = t.defaults.zIndex)),
          void 0 !== e.OTransform &&
            ((t.animType = "OTransform"),
            (t.transformType = "-o-transform"),
            (t.transitionType = "OTransition"),
            void 0 === e.perspectiveProperty &&
              void 0 === e.webkitPerspective &&
              (t.animType = !1)),
          void 0 !== e.MozTransform &&
            ((t.animType = "MozTransform"),
            (t.transformType = "-moz-transform"),
            (t.transitionType = "MozTransition"),
            void 0 === e.perspectiveProperty &&
              void 0 === e.MozPerspective &&
              (t.animType = !1)),
          void 0 !== e.webkitTransform &&
            ((t.animType = "webkitTransform"),
            (t.transformType = "-webkit-transform"),
            (t.transitionType = "webkitTransition"),
            void 0 === e.perspectiveProperty &&
              void 0 === e.webkitPerspective &&
              (t.animType = !1)),
          void 0 !== e.msTransform &&
            ((t.animType = "msTransform"),
            (t.transformType = "-ms-transform"),
            (t.transitionType = "msTransition"),
            void 0 === e.msTransform && (t.animType = !1)),
          void 0 !== e.transform &&
            !1 !== t.animType &&
            ((t.animType = "transform"),
            (t.transformType = "transform"),
            (t.transitionType = "transition")),
          (t.transformsEnabled =
            t.options.useTransform && null !== t.animType && !1 !== t.animType);
      }),
      (e.prototype.setSlideClasses = function (t) {
        var e,
          i,
          n,
          o,
          s = this;
        if (
          ((i = s.$slider
            .find(".slick-slide")
            .removeClass("slick-active slick-center slick-current")
            .attr("aria-hidden", "true")),
          s.$slides.eq(t).addClass("slick-current"),
          !0 === s.options.centerMode)
        ) {
          var r = s.options.slidesToShow % 2 == 0 ? 1 : 0;
          (e = Math.floor(s.options.slidesToShow / 2)),
            !0 === s.options.infinite &&
              (t >= e && t <= s.slideCount - 1 - e
                ? s.$slides
                    .slice(t - e + r, t + e + 1)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")
                : ((n = s.options.slidesToShow + t),
                  i
                    .slice(n - e + 1 + r, n + e + 2)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")),
              0 === t
                ? i
                    .eq(i.length - 1 - s.options.slidesToShow)
                    .addClass("slick-center")
                : t === s.slideCount - 1 &&
                  i.eq(s.options.slidesToShow).addClass("slick-center")),
            s.$slides.eq(t).addClass("slick-center");
        } else
          t >= 0 && t <= s.slideCount - s.options.slidesToShow
            ? s.$slides
                .slice(t, t + s.options.slidesToShow)
                .addClass("slick-active")
                .attr("aria-hidden", "false")
            : i.length <= s.options.slidesToShow
            ? i.addClass("slick-active").attr("aria-hidden", "false")
            : ((o = s.slideCount % s.options.slidesToShow),
              (n = !0 === s.options.infinite ? s.options.slidesToShow + t : t),
              s.options.slidesToShow == s.options.slidesToScroll &&
              s.slideCount - t < s.options.slidesToShow
                ? i
                    .slice(n - (s.options.slidesToShow - o), n + o)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")
                : i
                    .slice(n, n + s.options.slidesToShow)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false"));
        ("ondemand" !== s.options.lazyLoad &&
          "anticipated" !== s.options.lazyLoad) ||
          s.lazyLoad();
      }),
      (e.prototype.setupInfinite = function () {
        var e,
          i,
          n,
          o = this;
        if (
          (!0 === o.options.fade && (o.options.centerMode = !1),
          !0 === o.options.infinite &&
            !1 === o.options.fade &&
            ((i = null), o.slideCount > o.options.slidesToShow))
        ) {
          for (
            n =
              !0 === o.options.centerMode
                ? o.options.slidesToShow + 1
                : o.options.slidesToShow,
              e = o.slideCount;
            e > o.slideCount - n;
            e -= 1
          )
            (i = e - 1),
              t(o.$slides[i])
                .clone(!0)
                .attr("id", "")
                .attr("data-slick-index", i - o.slideCount)
                .prependTo(o.$slideTrack)
                .addClass("slick-cloned");
          for (e = 0; e < n + o.slideCount; e += 1)
            (i = e),
              t(o.$slides[i])
                .clone(!0)
                .attr("id", "")
                .attr("data-slick-index", i + o.slideCount)
                .appendTo(o.$slideTrack)
                .addClass("slick-cloned");
          o.$slideTrack
            .find(".slick-cloned")
            .find("[id]")
            .each(function () {
              t(this).attr("id", "");
            });
        }
      }),
      (e.prototype.interrupt = function (t) {
        t || this.autoPlay(), (this.interrupted = t);
      }),
      (e.prototype.selectHandler = function (e) {
        var i = this,
          n = t(e.target).is(".slick-slide")
            ? t(e.target)
            : t(e.target).parents(".slick-slide"),
          o = parseInt(n.attr("data-slick-index"));
        o || (o = 0),
          i.slideCount <= i.options.slidesToShow
            ? i.slideHandler(o, !1, !0)
            : i.slideHandler(o);
      }),
      (e.prototype.slideHandler = function (t, e, i) {
        var n,
          o,
          s,
          r,
          a,
          l,
          c = this;
        if (
          ((e = e || !1),
          !(
            (!0 === c.animating && !0 === c.options.waitForAnimate) ||
            (!0 === c.options.fade && c.currentSlide === t)
          ))
        )
          if (
            (!1 === e && c.asNavFor(t),
            (n = t),
            (a = c.getLeft(n)),
            (r = c.getLeft(c.currentSlide)),
            (c.currentLeft = null === c.swipeLeft ? r : c.swipeLeft),
            !1 === c.options.infinite &&
              !1 === c.options.centerMode &&
              (t < 0 || t > c.getDotCount() * c.options.slidesToScroll))
          )
            !1 === c.options.fade &&
              ((n = c.currentSlide),
              !0 !== i && c.slideCount > c.options.slidesToShow
                ? c.animateSlide(r, function () {
                    c.postSlide(n);
                  })
                : c.postSlide(n));
          else if (
            !1 === c.options.infinite &&
            !0 === c.options.centerMode &&
            (t < 0 || t > c.slideCount - c.options.slidesToScroll)
          )
            !1 === c.options.fade &&
              ((n = c.currentSlide),
              !0 !== i && c.slideCount > c.options.slidesToShow
                ? c.animateSlide(r, function () {
                    c.postSlide(n);
                  })
                : c.postSlide(n));
          else {
            if (
              (c.options.autoplay && clearInterval(c.autoPlayTimer),
              (o =
                n < 0
                  ? c.slideCount % c.options.slidesToScroll != 0
                    ? c.slideCount - (c.slideCount % c.options.slidesToScroll)
                    : c.slideCount + n
                  : n >= c.slideCount
                  ? c.slideCount % c.options.slidesToScroll != 0
                    ? 0
                    : n - c.slideCount
                  : n),
              (c.animating = !0),
              c.$slider.trigger("beforeChange", [c, c.currentSlide, o]),
              (s = c.currentSlide),
              (c.currentSlide = o),
              c.setSlideClasses(c.currentSlide),
              c.options.asNavFor &&
                (l = (l = c.getNavTarget()).slick("getSlick")).slideCount <=
                  l.options.slidesToShow &&
                l.setSlideClasses(c.currentSlide),
              c.updateDots(),
              c.updateArrows(),
              !0 === c.options.fade)
            )
              return (
                !0 !== i
                  ? (c.fadeSlideOut(s),
                    c.fadeSlide(o, function () {
                      c.postSlide(o);
                    }))
                  : c.postSlide(o),
                void c.animateHeight()
              );
            !0 !== i && c.slideCount > c.options.slidesToShow
              ? c.animateSlide(a, function () {
                  c.postSlide(o);
                })
              : c.postSlide(o);
          }
      }),
      (e.prototype.startLoad = function () {
        var t = this;
        !0 === t.options.arrows &&
          t.slideCount > t.options.slidesToShow &&
          (t.$prevArrow.hide(), t.$nextArrow.hide()),
          !0 === t.options.dots &&
            t.slideCount > t.options.slidesToShow &&
            t.$dots.hide(),
          t.$slider.addClass("slick-loading");
      }),
      (e.prototype.swipeDirection = function () {
        var t,
          e,
          i,
          n,
          o = this;
        return (
          (t = o.touchObject.startX - o.touchObject.curX),
          (e = o.touchObject.startY - o.touchObject.curY),
          (i = Math.atan2(e, t)),
          (n = Math.round((180 * i) / Math.PI)) < 0 && (n = 360 - Math.abs(n)),
          n <= 45 && n >= 0
            ? !1 === o.options.rtl
              ? "left"
              : "right"
            : n <= 360 && n >= 315
            ? !1 === o.options.rtl
              ? "left"
              : "right"
            : n >= 135 && n <= 225
            ? !1 === o.options.rtl
              ? "right"
              : "left"
            : !0 === o.options.verticalSwiping
            ? n >= 35 && n <= 135
              ? "down"
              : "up"
            : "vertical"
        );
      }),
      (e.prototype.swipeEnd = function (t) {
        var e,
          i,
          n = this;
        if (((n.dragging = !1), (n.swiping = !1), n.scrolling))
          return (n.scrolling = !1), !1;
        if (
          ((n.interrupted = !1),
          (n.shouldClick = !(n.touchObject.swipeLength > 10)),
          void 0 === n.touchObject.curX)
        )
          return !1;
        if (
          (!0 === n.touchObject.edgeHit &&
            n.$slider.trigger("edge", [n, n.swipeDirection()]),
          n.touchObject.swipeLength >= n.touchObject.minSwipe)
        ) {
          switch ((i = n.swipeDirection())) {
            case "left":
            case "down":
              (e = n.options.swipeToSlide
                ? n.checkNavigable(n.currentSlide + n.getSlideCount())
                : n.currentSlide + n.getSlideCount()),
                (n.currentDirection = 0);
              break;
            case "right":
            case "up":
              (e = n.options.swipeToSlide
                ? n.checkNavigable(n.currentSlide - n.getSlideCount())
                : n.currentSlide - n.getSlideCount()),
                (n.currentDirection = 1);
          }
          "vertical" != i &&
            (n.slideHandler(e),
            (n.touchObject = {}),
            n.$slider.trigger("swipe", [n, i]));
        } else
          n.touchObject.startX !== n.touchObject.curX &&
            (n.slideHandler(n.currentSlide), (n.touchObject = {}));
      }),
      (e.prototype.swipeHandler = function (t) {
        var e = this;
        if (
          !(
            !1 === e.options.swipe ||
            ("ontouchend" in document && !1 === e.options.swipe) ||
            (!1 === e.options.draggable && -1 !== t.type.indexOf("mouse"))
          )
        )
          switch (
            ((e.touchObject.fingerCount =
              t.originalEvent && void 0 !== t.originalEvent.touches
                ? t.originalEvent.touches.length
                : 1),
            (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
            !0 === e.options.verticalSwiping &&
              (e.touchObject.minSwipe =
                e.listHeight / e.options.touchThreshold),
            t.data.action)
          ) {
            case "start":
              e.swipeStart(t);
              break;
            case "move":
              e.swipeMove(t);
              break;
            case "end":
              e.swipeEnd(t);
          }
      }),
      (e.prototype.swipeMove = function (t) {
        var e,
          i,
          n,
          o,
          s,
          r,
          a = this;
        return (
          (s = void 0 !== t.originalEvent ? t.originalEvent.touches : null),
          !(!a.dragging || a.scrolling || (s && 1 !== s.length)) &&
            ((e = a.getLeft(a.currentSlide)),
            (a.touchObject.curX = void 0 !== s ? s[0].pageX : t.clientX),
            (a.touchObject.curY = void 0 !== s ? s[0].pageY : t.clientY),
            (a.touchObject.swipeLength = Math.round(
              Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))
            )),
            (r = Math.round(
              Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))
            )),
            !a.options.verticalSwiping && !a.swiping && r > 4
              ? ((a.scrolling = !0), !1)
              : (!0 === a.options.verticalSwiping &&
                  (a.touchObject.swipeLength = r),
                (i = a.swipeDirection()),
                void 0 !== t.originalEvent &&
                  a.touchObject.swipeLength > 4 &&
                  ((a.swiping = !0), t.preventDefault()),
                (o =
                  (!1 === a.options.rtl ? 1 : -1) *
                  (a.touchObject.curX > a.touchObject.startX ? 1 : -1)),
                !0 === a.options.verticalSwiping &&
                  (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1),
                (n = a.touchObject.swipeLength),
                (a.touchObject.edgeHit = !1),
                !1 === a.options.infinite &&
                  ((0 === a.currentSlide && "right" === i) ||
                    (a.currentSlide >= a.getDotCount() && "left" === i)) &&
                  ((n = a.touchObject.swipeLength * a.options.edgeFriction),
                  (a.touchObject.edgeHit = !0)),
                !1 === a.options.vertical
                  ? (a.swipeLeft = e + n * o)
                  : (a.swipeLeft =
                      e + n * (a.$list.height() / a.listWidth) * o),
                !0 === a.options.verticalSwiping && (a.swipeLeft = e + n * o),
                !0 !== a.options.fade &&
                  !1 !== a.options.touchMove &&
                  (!0 === a.animating
                    ? ((a.swipeLeft = null), !1)
                    : void a.setCSS(a.swipeLeft))))
        );
      }),
      (e.prototype.swipeStart = function (t) {
        var e,
          i = this;
        if (
          ((i.interrupted = !0),
          1 !== i.touchObject.fingerCount ||
            i.slideCount <= i.options.slidesToShow)
        )
          return (i.touchObject = {}), !1;
        void 0 !== t.originalEvent &&
          void 0 !== t.originalEvent.touches &&
          (e = t.originalEvent.touches[0]),
          (i.touchObject.startX = i.touchObject.curX =
            void 0 !== e ? e.pageX : t.clientX),
          (i.touchObject.startY = i.touchObject.curY =
            void 0 !== e ? e.pageY : t.clientY),
          (i.dragging = !0);
      }),
      (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
        function () {
          var t = this;
          null !== t.$slidesCache &&
            (t.unload(),
            t.$slideTrack.children(this.options.slide).detach(),
            t.$slidesCache.appendTo(t.$slideTrack),
            t.reinit());
        }),
      (e.prototype.unload = function () {
        var e = this;
        t(".slick-cloned", e.$slider).remove(),
          e.$dots && e.$dots.remove(),
          e.$prevArrow &&
            e.htmlExpr.test(e.options.prevArrow) &&
            e.$prevArrow.remove(),
          e.$nextArrow &&
            e.htmlExpr.test(e.options.nextArrow) &&
            e.$nextArrow.remove(),
          e.$slides
            .removeClass("slick-slide slick-active slick-visible slick-current")
            .attr("aria-hidden", "true")
            .css("width", "");
      }),
      (e.prototype.unslick = function (t) {
        var e = this;
        e.$slider.trigger("unslick", [e, t]), e.destroy();
      }),
      (e.prototype.updateArrows = function () {
        var t = this;
        Math.floor(t.options.slidesToShow / 2),
          !0 === t.options.arrows &&
            t.slideCount > t.options.slidesToShow &&
            !t.options.infinite &&
            (t.$prevArrow
              .removeClass("slick-disabled")
              .attr("aria-disabled", "false"),
            t.$nextArrow
              .removeClass("slick-disabled")
              .attr("aria-disabled", "false"),
            0 === t.currentSlide
              ? (t.$prevArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"),
                t.$nextArrow
                  .removeClass("slick-disabled")
                  .attr("aria-disabled", "false"))
              : t.currentSlide >= t.slideCount - t.options.slidesToShow &&
                !1 === t.options.centerMode
              ? (t.$nextArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"),
                t.$prevArrow
                  .removeClass("slick-disabled")
                  .attr("aria-disabled", "false"))
              : t.currentSlide >= t.slideCount - 1 &&
                !0 === t.options.centerMode &&
                (t.$nextArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"),
                t.$prevArrow
                  .removeClass("slick-disabled")
                  .attr("aria-disabled", "false")));
      }),
      (e.prototype.updateDots = function () {
        var t = this;
        null !== t.$dots &&
          (t.$dots.find("li").removeClass("slick-active").end(),
          t.$dots
            .find("li")
            .eq(Math.floor(t.currentSlide / t.options.slidesToScroll))
            .addClass("slick-active"));
      }),
      (e.prototype.visibility = function () {
        var t = this;
        t.options.autoplay &&
          (document[t.hidden] ? (t.interrupted = !0) : (t.interrupted = !1));
      }),
      (t.fn.slick = function () {
        var t,
          i,
          n = this,
          o = arguments[0],
          s = Array.prototype.slice.call(arguments, 1),
          r = n.length;
        for (t = 0; t < r; t++)
          if (
            ("object" == typeof o || void 0 === o
              ? (n[t].slick = new e(n[t], o))
              : (i = n[t].slick[o].apply(n[t].slick, s)),
            void 0 !== i)
          )
            return i;
        return n;
      });
  }),
  (function (t, e, i, n) {
    function o(e, i) {
      (this.settings = null),
        (this.options = t.extend({}, o.Defaults, i)),
        (this.$element = t(e)),
        (this._handlers = {}),
        (this._plugins = {}),
        (this._supress = {}),
        (this._current = null),
        (this._speed = null),
        (this._coordinates = []),
        (this._breakpoint = null),
        (this._width = null),
        (this._items = []),
        (this._clones = []),
        (this._mergers = []),
        (this._widths = []),
        (this._invalidated = {}),
        (this._pipe = []),
        (this._drag = {
          time: null,
          target: null,
          pointer: null,
          stage: { start: null, current: null },
          direction: null,
        }),
        (this._states = {
          current: {},
          tags: {
            initializing: ["busy"],
            animating: ["busy"],
            dragging: ["interacting"],
          },
        }),
        t.each(
          ["onResize", "onThrottledResize"],
          t.proxy(function (e, i) {
            this._handlers[i] = t.proxy(this[i], this);
          }, this)
        ),
        t.each(
          o.Plugins,
          t.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this);
          }, this)
        ),
        t.each(
          o.Workers,
          t.proxy(function (e, i) {
            this._pipe.push({ filter: i.filter, run: t.proxy(i.run, this) });
          }, this)
        ),
        this.setup(),
        this.initialize();
    }
    (o.Defaults = {
      items: 3,
      loop: !1,
      center: !1,
      rewind: !1,
      checkVisibility: !0,
      mouseDrag: !0,
      touchDrag: !0,
      pullDrag: !0,
      freeDrag: !1,
      margin: 0,
      stagePadding: 0,
      merge: !1,
      mergeFit: !0,
      autoWidth: !1,
      startPosition: 0,
      rtl: !1,
      smartSpeed: 250,
      fluidSpeed: !1,
      dragEndSpeed: !1,
      responsive: {},
      responsiveRefreshRate: 200,
      responsiveBaseElement: e,
      fallbackEasing: "swing",
      slideTransition: "",
      info: !1,
      nestedItemSelector: !1,
      itemElement: "div",
      stageElement: "div",
      refreshClass: "owl-refresh",
      loadedClass: "owl-loaded",
      loadingClass: "owl-loading",
      rtlClass: "owl-rtl",
      responsiveClass: "owl-responsive",
      dragClass: "owl-drag",
      itemClass: "owl-item",
      stageClass: "owl-stage",
      stageOuterClass: "owl-stage-outer",
      grabClass: "owl-grab",
    }),
      (o.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
      (o.Type = { Event: "event", State: "state" }),
      (o.Plugins = {}),
      (o.Workers = [
        {
          filter: ["width", "settings"],
          run: function () {
            this._width = this.$element.width();
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            t.current =
              this._items && this._items[this.relative(this._current)];
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            this.$stage.children(".cloned").remove();
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e = this.settings.margin || "",
              i = !this.settings.autoWidth,
              n = this.settings.rtl,
              o = {
                width: "auto",
                "margin-left": n ? e : "",
                "margin-right": n ? "" : e,
              };
            !i && this.$stage.children().css(o), (t.css = o);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e =
                (this.width() / this.settings.items).toFixed(3) -
                this.settings.margin,
              i = null,
              n = this._items.length,
              o = !this.settings.autoWidth,
              s = [];
            for (t.items = { merge: !1, width: e }; n--; )
              (i = this._mergers[n]),
                (i =
                  (this.settings.mergeFit &&
                    Math.min(i, this.settings.items)) ||
                  i),
                (t.items.merge = i > 1 || t.items.merge),
                (s[n] = o ? e * i : this._items[n].width());
            this._widths = s;
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            var e = [],
              i = this._items,
              n = this.settings,
              o = Math.max(2 * n.items, 4),
              s = 2 * Math.ceil(i.length / 2),
              r = n.loop && i.length ? (n.rewind ? o : Math.max(o, s)) : 0,
              a = "",
              l = "";
            for (r /= 2; r > 0; )
              e.push(this.normalize(e.length / 2, !0)),
                (a += i[e[e.length - 1]][0].outerHTML),
                e.push(this.normalize(i.length - 1 - (e.length - 1) / 2, !0)),
                (l = i[e[e.length - 1]][0].outerHTML + l),
                (r -= 1);
            (this._clones = e),
              t(a).addClass("cloned").appendTo(this.$stage),
              t(l).addClass("cloned").prependTo(this.$stage);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            for (
              var t = this.settings.rtl ? 1 : -1,
                e = this._clones.length + this._items.length,
                i = -1,
                n = 0,
                o = 0,
                s = [];
              ++i < e;

            )
              (n = s[i - 1] || 0),
                (o = this._widths[this.relative(i)] + this.settings.margin),
                s.push(n + o * t);
            this._coordinates = s;
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            var t = this.settings.stagePadding,
              e = this._coordinates,
              i = {
                width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                "padding-left": t || "",
                "padding-right": t || "",
              };
            this.$stage.css(i);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e = this._coordinates.length,
              i = !this.settings.autoWidth,
              n = this.$stage.children();
            if (i && t.items.merge)
              for (; e--; )
                (t.css.width = this._widths[this.relative(e)]),
                  n.eq(e).css(t.css);
            else i && ((t.css.width = t.items.width), n.css(t.css));
          },
        },
        {
          filter: ["items"],
          run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style");
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            (t.current = t.current
              ? this.$stage.children().index(t.current)
              : 0),
              (t.current = Math.max(
                this.minimum(),
                Math.min(this.maximum(), t.current)
              )),
              this.reset(t.current);
          },
        },
        {
          filter: ["position"],
          run: function () {
            this.animate(this.coordinates(this._current));
          },
        },
        {
          filter: ["width", "position", "items", "settings"],
          run: function () {
            var t,
              e,
              i,
              n,
              o = this.settings.rtl ? 1 : -1,
              s = 2 * this.settings.stagePadding,
              r = this.coordinates(this.current()) + s,
              a = r + this.width() * o,
              l = [];
            for (i = 0, n = this._coordinates.length; i < n; i++)
              (t = this._coordinates[i - 1] || 0),
                (e = Math.abs(this._coordinates[i]) + s * o),
                ((this.op(t, "<=", r) && this.op(t, ">", a)) ||
                  (this.op(e, "<", r) && this.op(e, ">", a))) &&
                  l.push(i);
            this.$stage.children(".active").removeClass("active"),
              this.$stage
                .children(":eq(" + l.join("), :eq(") + ")")
                .addClass("active"),
              this.$stage.children(".center").removeClass("center"),
              this.settings.center &&
                this.$stage.children().eq(this.current()).addClass("center");
          },
        },
      ]),
      (o.prototype.initializeStage = function () {
        (this.$stage = this.$element.find("." + this.settings.stageClass)),
          this.$stage.length ||
            (this.$element.addClass(this.options.loadingClass),
            (this.$stage = t("<" + this.settings.stageElement + ">", {
              class: this.settings.stageClass,
            }).wrap(t("<div/>", { class: this.settings.stageOuterClass }))),
            this.$element.append(this.$stage.parent()));
      }),
      (o.prototype.initializeItems = function () {
        var e = this.$element.find(".owl-item");
        if (e.length)
          return (
            (this._items = e.get().map(function (e) {
              return t(e);
            })),
            (this._mergers = this._items.map(function () {
              return 1;
            })),
            void this.refresh()
          );
        this.replace(this.$element.children().not(this.$stage.parent())),
          this.isVisible() ? this.refresh() : this.invalidate("width"),
          this.$element
            .removeClass(this.options.loadingClass)
            .addClass(this.options.loadedClass);
      }),
      (o.prototype.initialize = function () {
        var t, e, i;
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading")) &&
          ((t = this.$element.find("img")),
          (e = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : n),
          (i = this.$element.children(e).width()),
          t.length && i <= 0 && this.preloadAutoWidthImages(t));
        this.initializeStage(),
          this.initializeItems(),
          this.registerEventHandlers(),
          this.leave("initializing"),
          this.trigger("initialized");
      }),
      (o.prototype.isVisible = function () {
        return !this.settings.checkVisibility || this.$element.is(":visible");
      }),
      (o.prototype.setup = function () {
        var e = this.viewport(),
          i = this.options.responsive,
          n = -1,
          o = null;
        i
          ? (t.each(i, function (t) {
              t <= e && t > n && (n = Number(t));
            }),
            "function" ==
              typeof (o = t.extend({}, this.options, i[n])).stagePadding &&
              (o.stagePadding = o.stagePadding()),
            delete o.responsive,
            o.responsiveClass &&
              this.$element.attr(
                "class",
                this.$element
                  .attr("class")
                  .replace(
                    new RegExp(
                      "(" + this.options.responsiveClass + "-)\\S+\\s",
                      "g"
                    ),
                    "$1" + n
                  )
              ))
          : (o = t.extend({}, this.options)),
          this.trigger("change", { property: { name: "settings", value: o } }),
          (this._breakpoint = n),
          (this.settings = o),
          this.invalidate("settings"),
          this.trigger("changed", {
            property: { name: "settings", value: this.settings },
          });
      }),
      (o.prototype.optionsLogic = function () {
        this.settings.autoWidth &&
          ((this.settings.stagePadding = !1), (this.settings.merge = !1));
      }),
      (o.prototype.prepare = function (e) {
        var i = this.trigger("prepare", { content: e });
        return (
          i.data ||
            (i.data = t("<" + this.settings.itemElement + "/>")
              .addClass(this.options.itemClass)
              .append(e)),
          this.trigger("prepared", { content: i.data }),
          i.data
        );
      }),
      (o.prototype.update = function () {
        for (
          var e = 0,
            i = this._pipe.length,
            n = t.proxy(function (t) {
              return this[t];
            }, this._invalidated),
            o = {};
          e < i;

        )
          (this._invalidated.all ||
            t.grep(this._pipe[e].filter, n).length > 0) &&
            this._pipe[e].run(o),
            e++;
        (this._invalidated = {}), !this.is("valid") && this.enter("valid");
      }),
      (o.prototype.width = function (t) {
        switch ((t = t || o.Width.Default)) {
          case o.Width.Inner:
          case o.Width.Outer:
            return this._width;
          default:
            return (
              this._width -
              2 * this.settings.stagePadding +
              this.settings.margin
            );
        }
      }),
      (o.prototype.refresh = function () {
        this.enter("refreshing"),
          this.trigger("refresh"),
          this.setup(),
          this.optionsLogic(),
          this.$element.addClass(this.options.refreshClass),
          this.update(),
          this.$element.removeClass(this.options.refreshClass),
          this.leave("refreshing"),
          this.trigger("refreshed");
      }),
      (o.prototype.onThrottledResize = function () {
        e.clearTimeout(this.resizeTimer),
          (this.resizeTimer = e.setTimeout(
            this._handlers.onResize,
            this.settings.responsiveRefreshRate
          ));
      }),
      (o.prototype.onResize = function () {
        return (
          !!this._items.length &&
          this._width !== this.$element.width() &&
          !!this.isVisible() &&
          (this.enter("resizing"),
          this.trigger("resize").isDefaultPrevented()
            ? (this.leave("resizing"), !1)
            : (this.invalidate("width"),
              this.refresh(),
              this.leave("resizing"),
              void this.trigger("resized")))
        );
      }),
      (o.prototype.registerEventHandlers = function () {
        t.support.transition &&
          this.$stage.on(
            t.support.transition.end + ".owl.core",
            t.proxy(this.onTransitionEnd, this)
          ),
          !1 !== this.settings.responsive &&
            this.on(e, "resize", this._handlers.onThrottledResize),
          this.settings.mouseDrag &&
            (this.$element.addClass(this.options.dragClass),
            this.$stage.on(
              "mousedown.owl.core",
              t.proxy(this.onDragStart, this)
            ),
            this.$stage.on(
              "dragstart.owl.core selectstart.owl.core",
              function () {
                return !1;
              }
            )),
          this.settings.touchDrag &&
            (this.$stage.on(
              "touchstart.owl.core",
              t.proxy(this.onDragStart, this)
            ),
            this.$stage.on(
              "touchcancel.owl.core",
              t.proxy(this.onDragEnd, this)
            ));
      }),
      (o.prototype.onDragStart = function (e) {
        var n = null;
        3 !== e.which &&
          (t.support.transform
            ? (n = {
                x: (n = this.$stage
                  .css("transform")
                  .replace(/.*\(|\)| /g, "")
                  .split(","))[16 === n.length ? 12 : 4],
                y: n[16 === n.length ? 13 : 5],
              })
            : ((n = this.$stage.position()),
              (n = {
                x: this.settings.rtl
                  ? n.left +
                    this.$stage.width() -
                    this.width() +
                    this.settings.margin
                  : n.left,
                y: n.top,
              })),
          this.is("animating") &&
            (t.support.transform ? this.animate(n.x) : this.$stage.stop(),
            this.invalidate("position")),
          this.$element.toggleClass(
            this.options.grabClass,
            "mousedown" === e.type
          ),
          this.speed(0),
          (this._drag.time = new Date().getTime()),
          (this._drag.target = t(e.target)),
          (this._drag.stage.start = n),
          (this._drag.stage.current = n),
          (this._drag.pointer = this.pointer(e)),
          t(i).on(
            "mouseup.owl.core touchend.owl.core",
            t.proxy(this.onDragEnd, this)
          ),
          t(i).one(
            "mousemove.owl.core touchmove.owl.core",
            t.proxy(function (e) {
              var n = this.difference(this._drag.pointer, this.pointer(e));
              t(i).on(
                "mousemove.owl.core touchmove.owl.core",
                t.proxy(this.onDragMove, this)
              ),
                (Math.abs(n.x) < Math.abs(n.y) && this.is("valid")) ||
                  (e.preventDefault(),
                  this.enter("dragging"),
                  this.trigger("drag"));
            }, this)
          ));
      }),
      (o.prototype.onDragMove = function (t) {
        var e = null,
          i = null,
          n = null,
          o = this.difference(this._drag.pointer, this.pointer(t)),
          s = this.difference(this._drag.stage.start, o);
        this.is("dragging") &&
          (t.preventDefault(),
          this.settings.loop
            ? ((e = this.coordinates(this.minimum())),
              (i = this.coordinates(this.maximum() + 1) - e),
              (s.x = ((((s.x - e) % i) + i) % i) + e))
            : ((e = this.settings.rtl
                ? this.coordinates(this.maximum())
                : this.coordinates(this.minimum())),
              (i = this.settings.rtl
                ? this.coordinates(this.minimum())
                : this.coordinates(this.maximum())),
              (n = this.settings.pullDrag ? (-1 * o.x) / 5 : 0),
              (s.x = Math.max(Math.min(s.x, e + n), i + n))),
          (this._drag.stage.current = s),
          this.animate(s.x));
      }),
      (o.prototype.onDragEnd = function (e) {
        var n = this.difference(this._drag.pointer, this.pointer(e)),
          o = this._drag.stage.current,
          s = (n.x > 0) ^ this.settings.rtl ? "left" : "right";
        t(i).off(".owl.core"),
          this.$element.removeClass(this.options.grabClass),
          ((0 !== n.x && this.is("dragging")) || !this.is("valid")) &&
            (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
            this.current(
              this.closest(o.x, 0 !== n.x ? s : this._drag.direction)
            ),
            this.invalidate("position"),
            this.update(),
            (this._drag.direction = s),
            (Math.abs(n.x) > 3 ||
              new Date().getTime() - this._drag.time > 300) &&
              this._drag.target.one("click.owl.core", function () {
                return !1;
              })),
          this.is("dragging") &&
            (this.leave("dragging"), this.trigger("dragged"));
      }),
      (o.prototype.closest = function (e, i) {
        var o = -1,
          s = this.width(),
          r = this.coordinates();
        return (
          this.settings.freeDrag ||
            t.each(
              r,
              t.proxy(function (t, a) {
                return (
                  "left" === i && e > a - 30 && e < a + 30
                    ? (o = t)
                    : "right" === i && e > a - s - 30 && e < a - s + 30
                    ? (o = t + 1)
                    : this.op(e, "<", a) &&
                      this.op(e, ">", r[t + 1] !== n ? r[t + 1] : a - s) &&
                      (o = "left" === i ? t + 1 : t),
                  -1 === o
                );
              }, this)
            ),
          this.settings.loop ||
            (this.op(e, ">", r[this.minimum()])
              ? (o = e = this.minimum())
              : this.op(e, "<", r[this.maximum()]) && (o = e = this.maximum())),
          o
        );
      }),
      (o.prototype.animate = function (e) {
        var i = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(),
          i && (this.enter("animating"), this.trigger("translate")),
          t.support.transform3d && t.support.transition
            ? this.$stage.css({
                transform: "translate3d(" + e + "px,0px,0px)",
                transition:
                  this.speed() / 1e3 +
                  "s" +
                  (this.settings.slideTransition
                    ? " " + this.settings.slideTransition
                    : ""),
              })
            : i
            ? this.$stage.animate(
                { left: e + "px" },
                this.speed(),
                this.settings.fallbackEasing,
                t.proxy(this.onTransitionEnd, this)
              )
            : this.$stage.css({ left: e + "px" });
      }),
      (o.prototype.is = function (t) {
        return this._states.current[t] && this._states.current[t] > 0;
      }),
      (o.prototype.current = function (t) {
        if (t === n) return this._current;
        if (0 === this._items.length) return n;
        if (((t = this.normalize(t)), this._current !== t)) {
          var e = this.trigger("change", {
            property: { name: "position", value: t },
          });
          e.data !== n && (t = this.normalize(e.data)),
            (this._current = t),
            this.invalidate("position"),
            this.trigger("changed", {
              property: { name: "position", value: this._current },
            });
        }
        return this._current;
      }),
      (o.prototype.invalidate = function (e) {
        return (
          "string" === t.type(e) &&
            ((this._invalidated[e] = !0),
            this.is("valid") && this.leave("valid")),
          t.map(this._invalidated, function (t, e) {
            return e;
          })
        );
      }),
      (o.prototype.reset = function (t) {
        (t = this.normalize(t)) !== n &&
          ((this._speed = 0),
          (this._current = t),
          this.suppress(["translate", "translated"]),
          this.animate(this.coordinates(t)),
          this.release(["translate", "translated"]));
      }),
      (o.prototype.normalize = function (t, e) {
        var i = this._items.length,
          o = e ? 0 : this._clones.length;
        return (
          !this.isNumeric(t) || i < 1
            ? (t = n)
            : (t < 0 || t >= i + o) &&
              (t = ((((t - o / 2) % i) + i) % i) + o / 2),
          t
        );
      }),
      (o.prototype.relative = function (t) {
        return (t -= this._clones.length / 2), this.normalize(t, !0);
      }),
      (o.prototype.maximum = function (t) {
        var e,
          i,
          n,
          o = this.settings,
          s = this._coordinates.length;
        if (o.loop) s = this._clones.length / 2 + this._items.length - 1;
        else if (o.autoWidth || o.merge) {
          if ((e = this._items.length))
            for (
              i = this._items[--e].width(), n = this.$element.width();
              e-- &&
              !((i += this._items[e].width() + this.settings.margin) > n);

            );
          s = e + 1;
        } else
          s = o.center ? this._items.length - 1 : this._items.length - o.items;
        return t && (s -= this._clones.length / 2), Math.max(s, 0);
      }),
      (o.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2;
      }),
      (o.prototype.items = function (t) {
        return t === n
          ? this._items.slice()
          : ((t = this.normalize(t, !0)), this._items[t]);
      }),
      (o.prototype.mergers = function (t) {
        return t === n
          ? this._mergers.slice()
          : ((t = this.normalize(t, !0)), this._mergers[t]);
      }),
      (o.prototype.clones = function (e) {
        var i = this._clones.length / 2,
          o = i + this._items.length,
          s = function (t) {
            return t % 2 == 0 ? o + t / 2 : i - (t + 1) / 2;
          };
        return e === n
          ? t.map(this._clones, function (t, e) {
              return s(e);
            })
          : t.map(this._clones, function (t, i) {
              return t === e ? s(i) : null;
            });
      }),
      (o.prototype.speed = function (t) {
        return t !== n && (this._speed = t), this._speed;
      }),
      (o.prototype.coordinates = function (e) {
        var i,
          o = 1,
          s = e - 1;
        return e === n
          ? t.map(
              this._coordinates,
              t.proxy(function (t, e) {
                return this.coordinates(e);
              }, this)
            )
          : (this.settings.center
              ? (this.settings.rtl && ((o = -1), (s = e + 1)),
                (i = this._coordinates[e]),
                (i +=
                  ((this.width() - i + (this._coordinates[s] || 0)) / 2) * o))
              : (i = this._coordinates[s] || 0),
            (i = Math.ceil(i)));
      }),
      (o.prototype.duration = function (t, e, i) {
        return 0 === i
          ? 0
          : Math.min(Math.max(Math.abs(e - t), 1), 6) *
              Math.abs(i || this.settings.smartSpeed);
      }),
      (o.prototype.to = function (t, e) {
        var i = this.current(),
          n = null,
          o = t - this.relative(i),
          s = (o > 0) - (o < 0),
          r = this._items.length,
          a = this.minimum(),
          l = this.maximum();
        this.settings.loop
          ? (!this.settings.rewind && Math.abs(o) > r / 2 && (o += -1 * s * r),
            (n = (((((t = i + o) - a) % r) + r) % r) + a) !== t &&
              n - o <= l &&
              n - o > 0 &&
              ((i = n - o), (t = n), this.reset(i)))
          : this.settings.rewind
          ? (t = ((t % (l += 1)) + l) % l)
          : (t = Math.max(a, Math.min(l, t))),
          this.speed(this.duration(i, t, e)),
          this.current(t),
          this.isVisible() && this.update();
      }),
      (o.prototype.next = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) + 1, t);
      }),
      (o.prototype.prev = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) - 1, t);
      }),
      (o.prototype.onTransitionEnd = function (t) {
        if (
          t !== n &&
          (t.stopPropagation(),
          (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))
        )
          return !1;
        this.leave("animating"), this.trigger("translated");
      }),
      (o.prototype.viewport = function () {
        var n;
        return (
          this.options.responsiveBaseElement !== e
            ? (n = t(this.options.responsiveBaseElement).width())
            : e.innerWidth
            ? (n = e.innerWidth)
            : i.documentElement && i.documentElement.clientWidth
            ? (n = i.documentElement.clientWidth)
            : console.warn("Can not detect viewport width."),
          n
        );
      }),
      (o.prototype.replace = function (e) {
        this.$stage.empty(),
          (this._items = []),
          e && (e = e instanceof jQuery ? e : t(e)),
          this.settings.nestedItemSelector &&
            (e = e.find("." + this.settings.nestedItemSelector)),
          e
            .filter(function () {
              return 1 === this.nodeType;
            })
            .each(
              t.proxy(function (t, e) {
                (e = this.prepare(e)),
                  this.$stage.append(e),
                  this._items.push(e),
                  this._mergers.push(
                    1 *
                      e
                        .find("[data-merge]")
                        .addBack("[data-merge]")
                        .attr("data-merge") || 1
                  );
              }, this)
            ),
          this.reset(
            this.isNumeric(this.settings.startPosition)
              ? this.settings.startPosition
              : 0
          ),
          this.invalidate("items");
      }),
      (o.prototype.add = function (e, i) {
        var o = this.relative(this._current);
        (i = i === n ? this._items.length : this.normalize(i, !0)),
          (e = e instanceof jQuery ? e : t(e)),
          this.trigger("add", { content: e, position: i }),
          (e = this.prepare(e)),
          0 === this._items.length || i === this._items.length
            ? (0 === this._items.length && this.$stage.append(e),
              0 !== this._items.length && this._items[i - 1].after(e),
              this._items.push(e),
              this._mergers.push(
                1 *
                  e
                    .find("[data-merge]")
                    .addBack("[data-merge]")
                    .attr("data-merge") || 1
              ))
            : (this._items[i].before(e),
              this._items.splice(i, 0, e),
              this._mergers.splice(
                i,
                0,
                1 *
                  e
                    .find("[data-merge]")
                    .addBack("[data-merge]")
                    .attr("data-merge") || 1
              )),
          this._items[o] && this.reset(this._items[o].index()),
          this.invalidate("items"),
          this.trigger("added", { content: e, position: i });
      }),
      (o.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== n &&
          (this.trigger("remove", { content: this._items[t], position: t }),
          this._items[t].remove(),
          this._items.splice(t, 1),
          this._mergers.splice(t, 1),
          this.invalidate("items"),
          this.trigger("removed", { content: null, position: t }));
      }),
      (o.prototype.preloadAutoWidthImages = function (e) {
        e.each(
          t.proxy(function (e, i) {
            this.enter("pre-loading"),
              (i = t(i)),
              t(new Image())
                .one(
                  "load",
                  t.proxy(function (t) {
                    i.attr("src", t.target.src),
                      i.css("opacity", 1),
                      this.leave("pre-loading"),
                      !this.is("pre-loading") &&
                        !this.is("initializing") &&
                        this.refresh();
                  }, this)
                )
                .attr(
                  "src",
                  i.attr("src") ||
                    i.attr("data-src") ||
                    i.attr("data-src-retina")
                );
          }, this)
        );
      }),
      (o.prototype.destroy = function () {
        for (var n in (this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        t(i).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (e.clearTimeout(this.resizeTimer),
          this.off(e, "resize", this._handlers.onThrottledResize)),
        this._plugins))
          this._plugins[n].destroy();
        this.$stage.children(".cloned").remove(),
          this.$stage.unwrap(),
          this.$stage.children().contents().unwrap(),
          this.$stage.children().unwrap(),
          this.$stage.remove(),
          this.$element
            .removeClass(this.options.refreshClass)
            .removeClass(this.options.loadingClass)
            .removeClass(this.options.loadedClass)
            .removeClass(this.options.rtlClass)
            .removeClass(this.options.dragClass)
            .removeClass(this.options.grabClass)
            .attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                  ""
                )
            )
            .removeData("owl.carousel");
      }),
      (o.prototype.op = function (t, e, i) {
        var n = this.settings.rtl;
        switch (e) {
          case "<":
            return n ? t > i : t < i;
          case ">":
            return n ? t < i : t > i;
          case ">=":
            return n ? t <= i : t >= i;
          case "<=":
            return n ? t >= i : t <= i;
        }
      }),
      (o.prototype.on = function (t, e, i, n) {
        t.addEventListener
          ? t.addEventListener(e, i, n)
          : t.attachEvent && t.attachEvent("on" + e, i);
      }),
      (o.prototype.off = function (t, e, i, n) {
        t.removeEventListener
          ? t.removeEventListener(e, i, n)
          : t.detachEvent && t.detachEvent("on" + e, i);
      }),
      (o.prototype.trigger = function (e, i, n, s, r) {
        var a = { item: { count: this._items.length, index: this.current() } },
          l = t.camelCase(
            t
              .grep(["on", e, n], function (t) {
                return t;
              })
              .join("-")
              .toLowerCase()
          ),
          c = t.Event(
            [e, "owl", n || "carousel"].join(".").toLowerCase(),
            t.extend({ relatedTarget: this }, a, i)
          );
        return (
          this._supress[e] ||
            (t.each(this._plugins, function (t, e) {
              e.onTrigger && e.onTrigger(c);
            }),
            this.register({ type: o.Type.Event, name: e }),
            this.$element.trigger(c),
            this.settings &&
              "function" == typeof this.settings[l] &&
              this.settings[l].call(this, c)),
          c
        );
      }),
      (o.prototype.enter = function (e) {
        t.each(
          [e].concat(this._states.tags[e] || []),
          t.proxy(function (t, e) {
            this._states.current[e] === n && (this._states.current[e] = 0),
              this._states.current[e]++;
          }, this)
        );
      }),
      (o.prototype.leave = function (e) {
        t.each(
          [e].concat(this._states.tags[e] || []),
          t.proxy(function (t, e) {
            this._states.current[e]--;
          }, this)
        );
      }),
      (o.prototype.register = function (e) {
        if (e.type === o.Type.Event) {
          if (
            (t.event.special[e.name] || (t.event.special[e.name] = {}),
            !t.event.special[e.name].owl)
          ) {
            var i = t.event.special[e.name]._default;
            (t.event.special[e.name]._default = function (t) {
              return !i ||
                !i.apply ||
                (t.namespace && -1 !== t.namespace.indexOf("owl"))
                ? t.namespace && t.namespace.indexOf("owl") > -1
                : i.apply(this, arguments);
            }),
              (t.event.special[e.name].owl = !0);
          }
        } else
          e.type === o.Type.State &&
            (this._states.tags[e.name]
              ? (this._states.tags[e.name] = this._states.tags[e.name].concat(
                  e.tags
                ))
              : (this._states.tags[e.name] = e.tags),
            (this._states.tags[e.name] = t.grep(
              this._states.tags[e.name],
              t.proxy(function (i, n) {
                return t.inArray(i, this._states.tags[e.name]) === n;
              }, this)
            )));
      }),
      (o.prototype.suppress = function (e) {
        t.each(
          e,
          t.proxy(function (t, e) {
            this._supress[e] = !0;
          }, this)
        );
      }),
      (o.prototype.release = function (e) {
        t.each(
          e,
          t.proxy(function (t, e) {
            delete this._supress[e];
          }, this)
        );
      }),
      (o.prototype.pointer = function (t) {
        var i = { x: null, y: null };
        return (
          (t =
            (t = t.originalEvent || t || e.event).touches && t.touches.length
              ? t.touches[0]
              : t.changedTouches && t.changedTouches.length
              ? t.changedTouches[0]
              : t).pageX
            ? ((i.x = t.pageX), (i.y = t.pageY))
            : ((i.x = t.clientX), (i.y = t.clientY)),
          i
        );
      }),
      (o.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t));
      }),
      (o.prototype.difference = function (t, e) {
        return { x: t.x - e.x, y: t.y - e.y };
      }),
      (t.fn.owlCarousel = function (e) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
          var n = t(this),
            s = n.data("owl.carousel");
          s ||
            ((s = new o(this, "object" == typeof e && e)),
            n.data("owl.carousel", s),
            t.each(
              [
                "next",
                "prev",
                "to",
                "destroy",
                "refresh",
                "replace",
                "add",
                "remove",
              ],
              function (e, i) {
                s.register({ type: o.Type.Event, name: i }),
                  s.$element.on(
                    i + ".owl.carousel.core",
                    t.proxy(function (t) {
                      t.namespace &&
                        t.relatedTarget !== this &&
                        (this.suppress([i]),
                        s[i].apply(this, [].slice.call(arguments, 1)),
                        this.release([i]));
                    }, s)
                  );
              }
            )),
            "string" == typeof e && "_" !== e.charAt(0) && s[e].apply(s, i);
        });
      }),
      (t.fn.owlCarousel.Constructor = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (e) {
      (this._core = e),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": t.proxy(function (t) {
            t.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (o.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (o.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = e.setInterval(
            t.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (o.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (o.prototype.destroy = function () {
        var t, i;
        for (t in (e.clearInterval(this._interval), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (i in Object.getOwnPropertyNames(this))
          "function" != typeof this[i] && (this[i] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.AutoRefresh = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (e) {
      (this._core = e),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            t.proxy(function (e) {
              if (
                e.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((e.property && "position" == e.property.name) ||
                  "initialized" == e.type)
              ) {
                var i = this._core.settings,
                  n = (i.center && Math.ceil(i.items / 2)) || i.items,
                  o = (i.center && -1 * n) || 0,
                  s =
                    (e.property && void 0 !== e.property.value
                      ? e.property.value
                      : this._core.current()) + o,
                  r = this._core.clones().length,
                  a = t.proxy(function (t, e) {
                    this.load(e);
                  }, this);
                for (
                  i.lazyLoadEager > 0 &&
                  ((n += i.lazyLoadEager),
                  i.loop && ((s -= i.lazyLoadEager), n++));
                  o++ < n;

                )
                  this.load(r / 2 + this._core.relative(s)),
                    r && t.each(this._core.clones(this._core.relative(s)), a),
                    s++;
              }
            }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (o.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (o.prototype.load = function (i) {
        var n = this._core.$stage.children().eq(i),
          o = n && n.find(".owl-lazy");
        !o ||
          t.inArray(n.get(0), this._loaded) > -1 ||
          (o.each(
            t.proxy(function (i, n) {
              var o,
                s = t(n),
                r =
                  (e.devicePixelRatio > 1 && s.attr("data-src-retina")) ||
                  s.attr("data-src") ||
                  s.attr("data-srcset");
              this._core.trigger("load", { element: s, url: r }, "lazy"),
                s.is("img")
                  ? s
                      .one(
                        "load.owl.lazy",
                        t.proxy(function () {
                          s.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: s, url: r },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", r)
                  : s.is("source")
                  ? s
                      .one(
                        "load.owl.lazy",
                        t.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: s, url: r },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", r)
                  : (((o = new Image()).onload = t.proxy(function () {
                      s.css({
                        "background-image": 'url("' + r + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: s, url: r },
                          "lazy"
                        );
                    }, this)),
                    (o.src = r));
            }, this)
          ),
          this._loaded.push(n.get(0)));
      }),
      (o.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Lazy = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (i) {
      (this._core = i),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": t.proxy(function (
            t
          ) {
            t.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.settings.autoHeight &&
              "position" === t.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": t.proxy(function (t) {
            t.namespace &&
              this._core.settings.autoHeight &&
              t.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var n = this;
      t(e).on("load", function () {
        n._core.settings.autoHeight && n.update();
      }),
        t(e).resize(function () {
          n._core.settings.autoHeight &&
            (null != n._intervalId && clearTimeout(n._intervalId),
            (n._intervalId = setTimeout(function () {
              n.update();
            }, 250)));
        });
    };
    (o.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (o.prototype.update = function () {
        var e = this._core._current,
          i = e + this._core.settings.items,
          n = this._core.settings.lazyLoad,
          o = this._core.$stage.children().toArray().slice(e, i),
          s = [],
          r = 0;
        t.each(o, function (e, i) {
          s.push(t(i).height());
        }),
          (r = Math.max.apply(null, s)) <= 1 &&
            n &&
            this._previousHeight &&
            (r = this._previousHeight),
          (this._previousHeight = r),
          this._core.$stage
            .parent()
            .height(r)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (o.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.AutoHeight = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (e) {
      (this._core = e),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              t.preventDefault();
          }, this),
          "refreshed.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              "position" === t.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": t.proxy(function (e) {
            if (e.namespace) {
              var i = t(e.content).find(".owl-video");
              i.length &&
                (i.css("display", "none"), this.fetch(i, t(e.content)));
            }
          }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          t.proxy(function (t) {
            this.play(t);
          }, this)
        );
    };
    (o.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (o.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id")
            ? "vimeo"
            : t.attr("data-vzaar-id")
            ? "vzaar"
            : "youtube",
          n =
            t.attr("data-vimeo-id") ||
            t.attr("data-youtube-id") ||
            t.attr("data-vzaar-id"),
          o = t.attr("data-width") || this._core.settings.videoWidth,
          s = t.attr("data-height") || this._core.settings.videoHeight,
          r = t.attr("href");
        if (!r) throw new Error("Missing video URL.");
        if (
          (n = r.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          ))[3].indexOf("youtu") > -1
        )
          i = "youtube";
        else if (n[3].indexOf("vimeo") > -1) i = "vimeo";
        else {
          if (!(n[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          i = "vzaar";
        }
        (n = n[6]),
          (this._videos[r] = { type: i, id: n, width: o, height: s }),
          e.attr("data-video", r),
          this.thumbnail(t, this._videos[r]);
      }),
      (o.prototype.thumbnail = function (e, i) {
        var n,
          o,
          s =
            i.width && i.height
              ? "width:" + i.width + "px;height:" + i.height + "px;"
              : "",
          r = e.find("img"),
          a = "src",
          l = "",
          c = this._core.settings,
          u = function (i) {
            '<div class="owl-video-play-icon"></div>',
              (n = c.lazyLoad
                ? t("<div/>", { class: "owl-video-tn " + l, srcType: i })
                : t("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + i + ")",
                  })),
              e.after(n),
              e.after('<div class="owl-video-play-icon"></div>');
          };
        if (
          (e.wrap(t("<div/>", { class: "owl-video-wrapper", style: s })),
          this._core.settings.lazyLoad && ((a = "data-src"), (l = "owl-lazy")),
          r.length)
        )
          return u(r.attr(a)), r.remove(), !1;
        "youtube" === i.type
          ? ((o = "//img.youtube.com/vi/" + i.id + "/hqdefault.jpg"), u(o))
          : "vimeo" === i.type
          ? t.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + i.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (t) {
                (o = t[0].thumbnail_large), u(o);
              },
            })
          : "vzaar" === i.type &&
            t.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + i.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (t) {
                (o = t.framegrab_url), u(o);
              },
            });
      }),
      (o.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (o.prototype.play = function (e) {
        var i,
          n = t(e.target).closest("." + this._core.settings.itemClass),
          o = this._videos[n.attr("data-video")],
          s = o.width || "100%",
          r = o.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (n = this._core.items(this._core.relative(n.index()))),
          this._core.reset(n.index()),
          (i = t(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )).attr("height", r),
          i.attr("width", s),
          "youtube" === o.type
            ? i.attr(
                "src",
                "//www.youtube.com/embed/" +
                  o.id +
                  "?autoplay=1&rel=0&v=" +
                  o.id
              )
            : "vimeo" === o.type
            ? i.attr("src", "//player.vimeo.com/video/" + o.id + "?autoplay=1")
            : "vzaar" === o.type &&
              i.attr(
                "src",
                "//view.vzaar.com/" + o.id + "/player?autoplay=true"
              ),
          t(i)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(n.find(".owl-video")),
          (this._playing = n.addClass("owl-video-playing")));
      }),
      (o.prototype.isInFullScreen = function () {
        var e =
          i.fullscreenElement ||
          i.mozFullScreenElement ||
          i.webkitFullscreenElement;
        return e && t(e).parent().hasClass("owl-video-frame");
      }),
      (o.prototype.destroy = function () {
        var t, e;
        for (t in (this._core.$element.off("click.owl.video"), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Video = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (e) {
      (this.core = e),
        (this.core.options = t.extend({}, o.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = n),
        (this.next = n),
        (this.handlers = {
          "change.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              "position" == t.property.name &&
              ((this.previous = this.core.current()),
              (this.next = t.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            t.proxy(function (t) {
              t.namespace && (this.swapping = "translated" == t.type);
            }, this),
          "translate.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (o.Defaults = { animateOut: !1, animateIn: !1 }),
      (o.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          t.support.animation &&
          t.support.transition
        ) {
          this.core.speed(0);
          var e,
            i = t.proxy(this.clear, this),
            n = this.core.$stage.children().eq(this.previous),
            o = this.core.$stage.children().eq(this.next),
            s = this.core.settings.animateIn,
            r = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (r &&
              ((e =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              n
                .one(t.support.animation.end, i)
                .css({ left: e + "px" })
                .addClass("animated owl-animated-out")
                .addClass(r)),
            s &&
              o
                .one(t.support.animation.end, i)
                .addClass("animated owl-animated-in")
                .addClass(s));
        }
      }),
      (o.prototype.clear = function (e) {
        t(e.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (o.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Animate = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var o = function (e) {
      (this._core = e),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": t.proxy(function (t) {
            t.namespace && "settings" === t.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : t.namespace &&
                "position" === t.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": t.proxy(function (t) {
            t.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": t.proxy(function (t, e, i) {
            t.namespace && this.play(e, i);
          }, this),
          "stop.owl.autoplay": t.proxy(function (t) {
            t.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": t.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": t.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": t.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": t.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = t.extend({}, o.Defaults, this._core.options));
    };
    (o.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (o.prototype._next = function (n) {
        (this._call = e.setTimeout(
          t.proxy(this._next, this, n),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            i.hidden ||
            this._core.next(n || this._core.settings.autoplaySpeed);
      }),
      (o.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (o.prototype.play = function (i, n) {
        var o;
        this._core.is("rotating") || this._core.enter("rotating"),
          (i = i || this._core.settings.autoplayTimeout),
          (o = Math.min(this._time % (this._timeout || i), i)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : e.clearTimeout(this._call),
          (this._time += (this.read() % i) - o),
          (this._timeout = i),
          (this._call = e.setTimeout(t.proxy(this._next, this, n), i - o));
      }),
      (o.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          e.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (o.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          e.clearTimeout(this._call));
      }),
      (o.prototype.destroy = function () {
        var t, e;
        for (t in (this.stop(), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.autoplay = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    "use strict";
    var o = function (e) {
      (this._core = e),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": t.proxy(function (e) {
            e.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  t(e.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(t.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(t.position, 1);
          }, this),
          "changed.owl.carousel": t.proxy(function (t) {
            t.namespace && "position" == t.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": t.proxy(function (t) {
            t.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (o.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="Previous">&#x2039;</span>',
        '<span aria-label="Next">&#x203a;</span>',
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (o.prototype.initialize = function () {
        var e,
          i = this._core.settings;
        for (e in ((this._controls.$relative = (
          i.navContainer
            ? t(i.navContainer)
            : t("<div>").addClass(i.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
        (this._controls.$previous = t("<" + i.navElement + ">")
          .addClass(i.navClass[0])
          .html(i.navText[0])
          .prependTo(this._controls.$relative)
          .on(
            "click",
            t.proxy(function (t) {
              this.prev(i.navSpeed);
            }, this)
          )),
        (this._controls.$next = t("<" + i.navElement + ">")
          .addClass(i.navClass[1])
          .html(i.navText[1])
          .appendTo(this._controls.$relative)
          .on(
            "click",
            t.proxy(function (t) {
              this.next(i.navSpeed);
            }, this)
          )),
        i.dotsData ||
          (this._templates = [
            t('<button role="button">')
              .addClass(i.dotClass)
              .append(t("<span>"))
              .prop("outerHTML"),
          ]),
        (this._controls.$absolute = (
          i.dotsContainer
            ? t(i.dotsContainer)
            : t("<div>").addClass(i.dotsClass).appendTo(this.$element)
        ).addClass("disabled")),
        this._controls.$absolute.on(
          "click",
          "button",
          t.proxy(function (e) {
            var n = t(e.target).parent().is(this._controls.$absolute)
              ? t(e.target).index()
              : t(e.target).parent().index();
            e.preventDefault(), this.to(n, i.dotsSpeed);
          }, this)
        ),
        this._overrides))
          this._core[e] = t.proxy(this[e], this);
      }),
      (o.prototype.destroy = function () {
        var t, e, i, n, o;
        for (t in ((o = this._core.settings), this._handlers))
          this.$element.off(t, this._handlers[t]);
        for (e in this._controls)
          "$relative" === e && o.navContainer
            ? this._controls[e].html("")
            : this._controls[e].remove();
        for (n in this.overides) this._core[n] = this._overrides[n];
        for (i in Object.getOwnPropertyNames(this))
          "function" != typeof this[i] && (this[i] = null);
      }),
      (o.prototype.update = function () {
        var t,
          e,
          i = this._core.clones().length / 2,
          n = i + this._core.items().length,
          o = this._core.maximum(!0),
          s = this._core.settings,
          r = s.center || s.autoWidth || s.dotsData ? 1 : s.dotsEach || s.items;
        if (
          ("page" !== s.slideBy && (s.slideBy = Math.min(s.slideBy, s.items)),
          s.dots || "page" == s.slideBy)
        )
          for (this._pages = [], t = i, e = 0, 0; t < n; t++) {
            if (e >= r || 0 === e) {
              if (
                (this._pages.push({
                  start: Math.min(o, t - i),
                  end: t - i + r - 1,
                }),
                Math.min(o, t - i) === o)
              )
                break;
              (e = 0), 0;
            }
            e += this._core.mergers(this._core.relative(t));
          }
      }),
      (o.prototype.draw = function () {
        var e,
          i = this._core.settings,
          n = this._core.items().length <= i.items,
          o = this._core.relative(this._core.current()),
          s = i.loop || i.rewind;
        this._controls.$relative.toggleClass("disabled", !i.nav || n),
          i.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !s && o <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !s && o >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !i.dots || n),
          i.dots &&
            ((e =
              this._pages.length - this._controls.$absolute.children().length),
            i.dotsData && 0 !== e
              ? this._controls.$absolute.html(this._templates.join(""))
              : e > 0
              ? this._controls.$absolute.append(
                  new Array(e + 1).join(this._templates[0])
                )
              : e < 0 && this._controls.$absolute.children().slice(e).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(t.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (o.prototype.onTrigger = function (e) {
        var i = this._core.settings;
        e.page = {
          index: t.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            i &&
            (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items),
        };
      }),
      (o.prototype.current = function () {
        var e = this._core.relative(this._core.current());
        return t
          .grep(
            this._pages,
            t.proxy(function (t, i) {
              return t.start <= e && t.end >= e;
            }, this)
          )
          .pop();
      }),
      (o.prototype.getPosition = function (e) {
        var i,
          n,
          o = this._core.settings;
        return (
          "page" == o.slideBy
            ? ((i = t.inArray(this.current(), this._pages)),
              (n = this._pages.length),
              e ? ++i : --i,
              (i = this._pages[((i % n) + n) % n].start))
            : ((i = this._core.relative(this._core.current())),
              (n = this._core.items().length),
              e ? (i += o.slideBy) : (i -= o.slideBy)),
          i
        );
      }),
      (o.prototype.next = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e);
      }),
      (o.prototype.prev = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e);
      }),
      (o.prototype.to = function (e, i, n) {
        var o;
        !n && this._pages.length
          ? ((o = this._pages.length),
            t.proxy(this._overrides.to, this._core)(
              this._pages[((e % o) + o) % o].start,
              i
            ))
          : t.proxy(this._overrides.to, this._core)(e, i);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Navigation = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    "use strict";
    var o = function (i) {
      (this._core = i),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": t.proxy(function (i) {
            i.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              t(e).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": t.proxy(function (e) {
            if (e.namespace) {
              var i = t(e.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!i) return;
              this._hashes[i] = e.content;
            }
          }, this),
          "changed.owl.carousel": t.proxy(function (i) {
            if (i.namespace && "position" === i.property.name) {
              var n = this._core.items(
                  this._core.relative(this._core.current())
                ),
                o = t
                  .map(this._hashes, function (t, e) {
                    return t === n ? e : null;
                  })
                  .join();
              if (!o || e.location.hash.slice(1) === o) return;
              e.location.hash = o;
            }
          }, this),
        }),
        (this._core.options = t.extend({}, o.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        t(e).on(
          "hashchange.owl.navigation",
          t.proxy(function (t) {
            var i = e.location.hash.substring(1),
              n = this._core.$stage.children(),
              o = this._hashes[i] && n.index(this._hashes[i]);
            void 0 !== o &&
              o !== this._core.current() &&
              this._core.to(this._core.relative(o), !1, !0);
          }, this)
        );
    };
    (o.Defaults = { URLhashListener: !1 }),
      (o.prototype.destroy = function () {
        var i, n;
        for (i in (t(e).off("hashchange.owl.navigation"), this._handlers))
          this._core.$element.off(i, this._handlers[i]);
        for (n in Object.getOwnPropertyNames(this))
          "function" != typeof this[n] && (this[n] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Hash = o);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    function o(e, i) {
      var o = !1,
        s = e.charAt(0).toUpperCase() + e.slice(1);
      return (
        t.each((e + " " + a.join(s + " ") + s).split(" "), function (t, e) {
          if (r[e] !== n) return (o = !i || e), !1;
        }),
        o
      );
    }
    function s(t) {
      return o(t, !0);
    }
    var r = t("<support>").get(0).style,
      a = "Webkit Moz O ms".split(" "),
      l = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      c = function () {
        return !!o("transform");
      },
      u = function () {
        return !!o("perspective");
      },
      h = function () {
        return !!o("animation");
      };
    (function () {
      return !!o("transition");
    })() &&
      ((t.support.transition = new String(s("transition"))),
      (t.support.transition.end = l.transition.end[t.support.transition])),
      h() &&
        ((t.support.animation = new String(s("animation"))),
        (t.support.animation.end = l.animation.end[t.support.animation])),
      c() &&
        ((t.support.transform = new String(s("transform"))),
        (t.support.transform3d = u()));
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
          return e(t, i);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("jquery")))
      : (t.jQueryBridget = e(t, t.jQuery));
  })(window, function (t, e) {
    "use strict";
    function i(i, s, a) {
      (a = a || e || t.jQuery) &&
        (s.prototype.option ||
          (s.prototype.option = function (t) {
            a.isPlainObject(t) &&
              (this.options = a.extend(!0, this.options, t));
          }),
        (a.fn[i] = function (t) {
          return "string" == typeof t
            ? (function (t, e, n) {
                var o,
                  s = "$()." + i + '("' + e + '")';
                return (
                  t.each(function (t, l) {
                    var c = a.data(l, i);
                    if (c) {
                      var u = c[e];
                      if (u && "_" != e.charAt(0)) {
                        var h = u.apply(c, n);
                        o = void 0 === o ? h : o;
                      } else r(s + " is not a valid method");
                    } else r(i + " not initialized. Cannot call methods, i.e. " + s);
                  }),
                  void 0 !== o ? o : t
                );
              })(this, t, o.call(arguments, 1))
            : ((function (t, e) {
                t.each(function (t, n) {
                  var o = a.data(n, i);
                  o
                    ? (o.option(e), o._init())
                    : ((o = new s(n, e)), a.data(n, i, o));
                });
              })(this, t),
              this);
        }),
        n(a));
    }
    function n(t) {
      !t || (t && t.bridget) || (t.bridget = i);
    }
    var o = Array.prototype.slice,
      s = t.console,
      r =
        void 0 === s
          ? function () {}
          : function (t) {
              s.error(t);
            };
    return n(e || t.jQuery), i;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            n = (i[t] = i[t] || []);
          return -1 == n.indexOf(e) && n.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var n = i.indexOf(e);
          return -1 != n && i.splice(n, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var n = 0,
            o = i[n];
          e = e || [];
          for (var s = this._onceEvents && this._onceEvents[t]; o; ) {
            var r = s && s[o];
            r && (this.off(t, o), delete s[o]),
              o.apply(this, e),
              (o = i[(n += r ? 0 : 1)]);
          }
          return this;
        }
      }),
      t
    );
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("get-size/get-size", [], function () {
          return e();
        })
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    "use strict";
    function t(t) {
      var e = parseFloat(t);
      return -1 == t.indexOf("%") && !isNaN(e) && e;
    }
    function e(t) {
      var e = getComputedStyle(t);
      return (
        e ||
          s(
            "Style returned " +
              e +
              ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"
          ),
        e
      );
    }
    function i() {
      if (!l) {
        l = !0;
        var i = document.createElement("div");
        (i.style.width = "200px"),
          (i.style.padding = "1px 2px 3px 4px"),
          (i.style.borderStyle = "solid"),
          (i.style.borderWidth = "1px 2px 3px 4px"),
          (i.style.boxSizing = "border-box");
        var s = document.body || document.documentElement;
        s.appendChild(i);
        var r = e(i);
        (n.isBoxSizeOuter = o = 200 == t(r.width)), s.removeChild(i);
      }
    }
    function n(n) {
      if (
        (i(),
        "string" == typeof n && (n = document.querySelector(n)),
        n && "object" == typeof n && n.nodeType)
      ) {
        var s = e(n);
        if ("none" == s.display)
          return (function () {
            for (
              var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0,
                },
                e = 0;
              e < a;
              e++
            )
              t[r[e]] = 0;
            return t;
          })();
        var l = {};
        (l.width = n.offsetWidth), (l.height = n.offsetHeight);
        for (
          var c = (l.isBorderBox = "border-box" == s.boxSizing), u = 0;
          u < a;
          u++
        ) {
          var h = r[u],
            d = s[h],
            p = parseFloat(d);
          l[h] = isNaN(p) ? 0 : p;
        }
        var f = l.paddingLeft + l.paddingRight,
          m = l.paddingTop + l.paddingBottom,
          g = l.marginLeft + l.marginRight,
          v = l.marginTop + l.marginBottom,
          y = l.borderLeftWidth + l.borderRightWidth,
          _ = l.borderTopWidth + l.borderBottomWidth,
          b = c && o,
          w = t(s.width);
        !1 !== w && (l.width = w + (b ? 0 : f + y));
        var x = t(s.height);
        return (
          !1 !== x && (l.height = x + (b ? 0 : m + _)),
          (l.innerWidth = l.width - (f + y)),
          (l.innerHeight = l.height - (m + _)),
          (l.outerWidth = l.width + g),
          (l.outerHeight = l.height + v),
          l
        );
      }
    }
    var o,
      s =
        "undefined" == typeof console
          ? function () {}
          : function (t) {
              console.error(t);
            },
      r = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      a = r.length,
      l = !1;
    return n;
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("desandro-matches-selector/matches-selector", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    "use strict";
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return "matches";
      if (t.matchesSelector) return "matchesSelector";
      for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
        var n = e[i] + "MatchesSelector";
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "fizzy-ui-utils/utils",
          ["desandro-matches-selector/matches-selector"],
          function (i) {
            return e(t, i);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("desandro-matches-selector")))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {
        extend: function (t, e) {
          for (var i in e) t[i] = e[i];
          return t;
        },
        modulo: function (t, e) {
          return ((t % e) + e) % e;
        },
        makeArray: function (t) {
          var e = [];
          if (Array.isArray(t)) e = t;
          else if (t && "object" == typeof t && "number" == typeof t.length)
            for (var i = 0; i < t.length; i++) e.push(t[i]);
          else e.push(t);
          return e;
        },
        removeFrom: function (t, e) {
          var i = t.indexOf(e);
          -1 != i && t.splice(i, 1);
        },
        getParent: function (t, i) {
          for (; t.parentNode && t != document.body; )
            if (((t = t.parentNode), e(t, i))) return t;
        },
        getQueryElement: function (t) {
          return "string" == typeof t ? document.querySelector(t) : t;
        },
        handleEvent: function (t) {
          var e = "on" + t.type;
          this[e] && this[e](t);
        },
        filterFindElements: function (t, n) {
          t = i.makeArray(t);
          var o = [];
          return (
            t.forEach(function (t) {
              if (t instanceof HTMLElement) {
                if (!n) return void o.push(t);
                e(t, n) && o.push(t);
                for (var i = t.querySelectorAll(n), s = 0; s < i.length; s++)
                  o.push(i[s]);
              }
            }),
            o
          );
        },
        debounceMethod: function (t, e, i) {
          var n = t.prototype[e],
            o = e + "Timeout";
          t.prototype[e] = function () {
            var t = this[o];
            t && clearTimeout(t);
            var e = arguments,
              s = this;
            this[o] = setTimeout(function () {
              n.apply(s, e), delete s[o];
            }, i || 100);
          };
        },
        docReady: function (t) {
          var e = document.readyState;
          "complete" == e || "interactive" == e
            ? setTimeout(t)
            : document.addEventListener("DOMContentLoaded", t);
        },
        toDashed: function (t) {
          return t
            .replace(/(.)([A-Z])/g, function (t, e, i) {
              return e + "-" + i;
            })
            .toLowerCase();
        },
      },
      n = t.console;
    return (
      (i.htmlInit = function (e, o) {
        i.docReady(function () {
          var s = i.toDashed(o),
            r = "data-" + s,
            a = document.querySelectorAll("[" + r + "]"),
            l = document.querySelectorAll(".js-" + s),
            c = i.makeArray(a).concat(i.makeArray(l)),
            u = r + "-options",
            h = t.jQuery;
          c.forEach(function (t) {
            var i,
              s = t.getAttribute(r) || t.getAttribute(u);
            try {
              i = s && JSON.parse(s);
            } catch (e) {
              return void (
                n &&
                n.error("Error parsing " + r + " on " + t.className + ": " + e)
              );
            }
            var a = new e(t, i);
            h && h.data(t, o, a);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          ["ev-emitter/ev-emitter", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("ev-emitter"), require("get-size")))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    "use strict";
    function i(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = { x: 0, y: 0 }),
        this._create());
    }
    var n = document.documentElement.style,
      o = "string" == typeof n.transition ? "transition" : "WebkitTransition",
      s = "string" == typeof n.transform ? "transform" : "WebkitTransform",
      r = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend",
      }[o],
      a = {
        transform: s,
        transition: o,
        transitionDuration: o + "Duration",
        transitionProperty: o + "Property",
        transitionDelay: o + "Delay",
      },
      l = (i.prototype = Object.create(t.prototype));
    (l.constructor = i),
      (l._create = function () {
        (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
          this.css({ position: "absolute" });
      }),
      (l.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (l.getSize = function () {
        this.size = e(this.element);
      }),
      (l.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
          e[a[i] || i] = t[i];
        }
      }),
      (l.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = this.layout._getOption("originLeft"),
          i = this.layout._getOption("originTop"),
          n = t[e ? "left" : "right"],
          o = t[i ? "top" : "bottom"],
          s = this.layout.size,
          r =
            -1 != n.indexOf("%")
              ? (parseFloat(n) / 100) * s.width
              : parseInt(n, 10),
          a =
            -1 != o.indexOf("%")
              ? (parseFloat(o) / 100) * s.height
              : parseInt(o, 10);
        (r = isNaN(r) ? 0 : r),
          (a = isNaN(a) ? 0 : a),
          (r -= e ? s.paddingLeft : s.paddingRight),
          (a -= i ? s.paddingTop : s.paddingBottom),
          (this.position.x = r),
          (this.position.y = a);
      }),
      (l.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = this.layout._getOption("originLeft"),
          n = this.layout._getOption("originTop"),
          o = i ? "paddingLeft" : "paddingRight",
          s = i ? "left" : "right",
          r = i ? "right" : "left",
          a = this.position.x + t[o];
        (e[s] = this.getXValue(a)), (e[r] = "");
        var l = n ? "paddingTop" : "paddingBottom",
          c = n ? "top" : "bottom",
          u = n ? "bottom" : "top",
          h = this.position.y + t[l];
        (e[c] = this.getYValue(h)),
          (e[u] = ""),
          this.css(e),
          this.emitEvent("layout", [this]);
      }),
      (l.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + "%"
          : t + "px";
      }),
      (l.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + "%"
          : t + "px";
      }),
      (l._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          n = this.position.y,
          o = parseInt(t, 10),
          s = parseInt(e, 10),
          r = o === this.position.x && s === this.position.y;
        if ((this.setPosition(t, e), !r || this.isTransitioning)) {
          var a = t - i,
            l = e - n,
            c = {};
          (c.transform = this.getTranslate(a, l)),
            this.transition({
              to: c,
              onTransitionEnd: { transform: this.layoutPosition },
              isCleaning: !0,
            });
        } else this.layoutPosition();
      }),
      (l.getTranslate = function (t, e) {
        return (
          "translate3d(" +
          (t = this.layout._getOption("originLeft") ? t : -t) +
          "px, " +
          (e = this.layout._getOption("originTop") ? e : -e) +
          "px, 0)"
        );
      }),
      (l.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (l.moveTo = l._transitionTo),
      (l.setPosition = function (t, e) {
        (this.position.x = parseInt(t, 10)),
          (this.position.y = parseInt(e, 10));
      }),
      (l._nonTransition = function (t) {
        for (var e in (this.css(t.to),
        t.isCleaning && this._removeStyles(t.to),
        t.onTransitionEnd))
          t.onTransitionEnd[e].call(this);
      }),
      (l.transition = function (t) {
        if (parseFloat(this.layout.options.transitionDuration)) {
          var e = this._transn;
          for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
          for (i in t.to)
            (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
          if (t.from) {
            this.css(t.from);
            this.element.offsetHeight;
            null;
          }
          this.enableTransition(t.to),
            this.css(t.to),
            (this.isTransitioning = !0);
        } else this._nonTransition(t);
      });
    var c =
      "opacity," +
      (function (t) {
        return t.replace(/([A-Z])/g, function (t) {
          return "-" + t.toLowerCase();
        });
      })(s);
    (l.enableTransition = function () {
      if (!this.isTransitioning) {
        var t = this.layout.options.transitionDuration;
        (t = "number" == typeof t ? t + "ms" : t),
          this.css({
            transitionProperty: c,
            transitionDuration: t,
            transitionDelay: this.staggerDelay || 0,
          }),
          this.element.addEventListener(r, this, !1);
      }
    }),
      (l.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (l.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var u = { "-webkit-transform": "transform" };
    (l.ontransitionend = function (t) {
      if (t.target === this.element) {
        var e = this._transn,
          i = u[t.propertyName] || t.propertyName;
        if (
          (delete e.ingProperties[i],
          (function (t) {
            for (var e in t) return !1;
            return !0;
          })(e.ingProperties) && this.disableTransition(),
          i in e.clean &&
            ((this.element.style[t.propertyName] = ""), delete e.clean[i]),
          i in e.onEnd)
        )
          e.onEnd[i].call(this), delete e.onEnd[i];
        this.emitEvent("transitionEnd", [this]);
      }
    }),
      (l.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(r, this, !1),
          (this.isTransitioning = !1);
      }),
      (l._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e);
      });
    var h = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: "",
    };
    return (
      (l.removeTransitionStyles = function () {
        this.css(h);
      }),
      (l.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
      }),
      (l.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({ display: "" }),
          this.emitEvent("remove", [this]);
      }),
      (l.remove = function () {
        return o && parseFloat(this.layout.options.transitionDuration)
          ? (this.once("transitionEnd", function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (l.reveal = function () {
        delete this.isHidden, this.css({ display: "" });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty("visibleStyle")] =
          this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (l.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal");
      }),
      (l.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i;
      }),
      (l.hide = function () {
        (this.isHidden = !0), this.css({ display: "" });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty("hiddenStyle")] =
          this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (l.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({ display: "none" }), this.emitEvent("hide"));
      }),
      (l.destroy = function () {
        this.css({
          position: "",
          left: "",
          right: "",
          top: "",
          bottom: "",
          transition: "",
          transform: "",
        });
      }),
      i
    );
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./item",
          ],
          function (i, n, o, s) {
            return e(t, i, n, o, s);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("ev-emitter"),
          require("get-size"),
          require("fizzy-ui-utils"),
          require("./item")
        ))
      : (t.Outlayer = e(
          t,
          t.EvEmitter,
          t.getSize,
          t.fizzyUIUtils,
          t.Outlayer.Item
        ));
  })(window, function (t, e, i, n, o) {
    "use strict";
    function s(t, e) {
      var i = n.getQueryElement(t);
      if (i) {
        (this.element = i),
          l && (this.$element = l(this.element)),
          (this.options = n.extend({}, this.constructor.defaults)),
          this.option(e);
        var o = ++u;
        (this.element.outlayerGUID = o),
          (h[o] = this),
          this._create(),
          this._getOption("initLayout") && this.layout();
      } else a && a.error("Bad element for " + this.constructor.namespace + ": " + (i || t));
    }
    function r(t) {
      function e() {
        t.apply(this, arguments);
      }
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        e
      );
    }
    var a = t.console,
      l = t.jQuery,
      c = function () {},
      u = 0,
      h = {};
    (s.namespace = "outlayer"),
      (s.Item = o),
      (s.defaults = {
        containerStyle: { position: "relative" },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
        visibleStyle: { opacity: 1, transform: "scale(1)" },
      });
    var d = s.prototype;
    n.extend(d, e.prototype),
      (d.option = function (t) {
        n.extend(this.options, t);
      }),
      (d._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer",
      }),
      (d._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          n.extend(this.element.style, this.options.containerStyle),
          this._getOption("resize") && this.bindResize();
      }),
      (d.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (d._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            n = [],
            o = 0;
          o < e.length;
          o++
        ) {
          var s = new i(e[o], this);
          n.push(s);
        }
        return n;
      }),
      (d._filterFindItemElements = function (t) {
        return n.filterFindElements(t, this.options.itemSelector);
      }),
      (d.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (d.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
      }),
      (d._init = d.layout),
      (d._resetLayout = function () {
        this.getSize();
      }),
      (d.getSize = function () {
        this.size = i(this.element);
      }),
      (d._getMeasurement = function (t, e) {
        var n,
          o = this.options[t];
        o
          ? ("string" == typeof o
              ? (n = this.element.querySelector(o))
              : o instanceof HTMLElement && (n = o),
            (this[t] = n ? i(n)[e] : o))
          : (this[t] = 0);
      }),
      (d.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (d._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (d._layoutItems = function (t, e) {
        if ((this._emitCompleteOnItems("layout", t), t && t.length)) {
          var i = [];
          t.forEach(function (t) {
            var n = this._getItemLayoutPosition(t);
            (n.item = t), (n.isInstant = e || t.isLayoutInstant), i.push(n);
          }, this),
            this._processLayoutQueue(i);
        }
      }),
      (d._getItemLayoutPosition = function () {
        return { x: 0, y: 0 };
      }),
      (d._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (d.updateStagger = function () {
        var t = this.options.stagger;
        return null == t
          ? void (this.stagger = 0)
          : ((this.stagger = (function (t) {
              if ("number" == typeof t) return t;
              var e = t.match(/(^\d*\.?\d*)(\w*)/),
                i = e && e[1],
                n = e && e[2];
              return i.length ? (i = parseFloat(i)) * (p[n] || 1) : 0;
            })(t)),
            this.stagger);
      }),
      (d._positionItem = function (t, e, i, n, o) {
        n ? t.goTo(e, i) : (t.stagger(o * this.stagger), t.moveTo(e, i));
      }),
      (d._postLayout = function () {
        this.resizeContainer();
      }),
      (d.resizeContainer = function () {
        if (this._getOption("resizeContainer")) {
          var t = this._getContainerSize();
          t &&
            (this._setContainerMeasure(t.width, !0),
            this._setContainerMeasure(t.height, !1));
        }
      }),
      (d._getContainerSize = c),
      (d._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
          var i = this.size;
          i.isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
            (t = Math.max(t, 0)),
            (this.element.style[e ? "width" : "height"] = t + "px");
        }
      }),
      (d._emitCompleteOnItems = function (t, e) {
        function i() {
          o.dispatchEvent(t + "Complete", null, [e]);
        }
        function n() {
          ++r == s && i();
        }
        var o = this,
          s = e.length;
        if (e && s) {
          var r = 0;
          e.forEach(function (e) {
            e.once(t, n);
          });
        } else i();
      }),
      (d.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, n), l))
          if (((this.$element = this.$element || l(this.element)), e)) {
            var o = l.Event(e);
            (o.type = t), this.$element.trigger(o, i);
          } else this.$element.trigger(t, i);
      }),
      (d.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
      }),
      (d.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
      }),
      (d.stamp = function (t) {
        (t = this._find(t)) &&
          ((this.stamps = this.stamps.concat(t)), t.forEach(this.ignore, this));
      }),
      (d.unstamp = function (t) {
        (t = this._find(t)) &&
          t.forEach(function (t) {
            n.removeFrom(this.stamps, t), this.unignore(t);
          }, this);
      }),
      (d._find = function (t) {
        if (t)
          return (
            "string" == typeof t && (t = this.element.querySelectorAll(t)),
            n.makeArray(t)
          );
      }),
      (d._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (d._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (d._manageStamp = c),
      (d._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          n = this._boundingRect,
          o = i(t);
        return {
          left: e.left - n.left - o.marginLeft,
          top: e.top - n.top - o.marginTop,
          right: n.right - e.right - o.marginRight,
          bottom: n.bottom - e.bottom - o.marginBottom,
        };
      }),
      (d.handleEvent = n.handleEvent),
      (d.bindResize = function () {
        t.addEventListener("resize", this), (this.isResizeBound = !0);
      }),
      (d.unbindResize = function () {
        t.removeEventListener("resize", this), (this.isResizeBound = !1);
      }),
      (d.onresize = function () {
        this.resize();
      }),
      n.debounceMethod(s, "onresize", 100),
      (d.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (d.needsResizeLayout = function () {
        var t = i(this.element);
        return this.size && t && t.innerWidth !== this.size.innerWidth;
      }),
      (d.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
      }),
      (d.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
      }),
      (d.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          var i = this.items.slice(0);
          (this.items = e.concat(i)),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i);
        }
      }),
      (d.reveal = function (t) {
        if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.reveal();
          });
        }
      }),
      (d.hide = function (t) {
        if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.hide();
          });
        }
      }),
      (d.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e);
      }),
      (d.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e);
      }),
      (d.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (d.getItems = function (t) {
        t = n.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (d.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e),
          e &&
            e.length &&
            e.forEach(function (t) {
              t.remove(), n.removeFrom(this.items, t);
            }, this);
      }),
      (d.destroy = function () {
        var t = this.element.style;
        (t.height = ""),
          (t.position = ""),
          (t.width = ""),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        var e = this.element.outlayerGUID;
        delete h[e],
          delete this.element.outlayerGUID,
          l && l.removeData(this.element, this.constructor.namespace);
      }),
      (s.data = function (t) {
        var e = (t = n.getQueryElement(t)) && t.outlayerGUID;
        return e && h[e];
      }),
      (s.create = function (t, e) {
        var i = r(s);
        return (
          (i.defaults = n.extend({}, s.defaults)),
          n.extend(i.defaults, e),
          (i.compatOptions = n.extend({}, s.compatOptions)),
          (i.namespace = t),
          (i.data = s.data),
          (i.Item = r(o)),
          n.htmlInit(i, t),
          l && l.bridget && l.bridget(t, i),
          i
        );
      });
    var p = { ms: 1, s: 1e3 };
    return (s.Item = o), s;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope/js/item", ["outlayer/outlayer"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer")))
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window, function (t) {
    "use strict";
    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      n = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), n.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData["original-order"] = this.id),
            (this.sortData.random = Math.random());
          var t = this.layout.options.getSortData,
            e = this.layout._sorters;
          for (var i in t) {
            var n = e[i];
            this.sortData[i] = n(this.element, this);
          }
        }
      });
    var o = i.destroy;
    return (
      (i.destroy = function () {
        o.apply(this, arguments), this.css({ display: "" });
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("get-size"), require("outlayer")))
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (t, e) {
    "use strict";
    function i(t) {
      (this.isotope = t),
        t &&
          ((this.options = t.options[this.namespace]),
          (this.element = t.element),
          (this.items = t.filteredItems),
          (this.size = t.size));
    }
    var n = i.prototype;
    return (
      [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption",
      ].forEach(function (t) {
        n[t] = function () {
          return e.prototype[t].apply(this.isotope, arguments);
        };
      }),
      (n.needsVerticalResizeLayout = function () {
        var e = t(this.isotope.element);
        return (
          this.isotope.size &&
          e &&
          e.innerHeight != this.isotope.size.innerHeight
        );
      }),
      (n._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments);
      }),
      (n.getColumnWidth = function () {
        this.getSegmentSize("column", "Width");
      }),
      (n.getRowHeight = function () {
        this.getSegmentSize("row", "Height");
      }),
      (n.getSegmentSize = function (t, e) {
        var i = t + e,
          n = "outer" + e;
        if ((this._getMeasurement(i, n), !this[i])) {
          var o = this.getFirstItemSize();
          this[i] = (o && o[n]) || this.isotope.size["inner" + e];
        }
      }),
      (n.getFirstItemSize = function () {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
      }),
      (n.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments);
      }),
      (n.getSize = function () {
        this.isotope.getSize(), (this.size = this.isotope.size);
      }),
      (i.modes = {}),
      (i.create = function (t, e) {
        function o() {
          i.apply(this, arguments);
        }
        return (
          (o.prototype = Object.create(n)),
          (o.prototype.constructor = o),
          e && (o.options = e),
          (o.prototype.namespace = t),
          (i.modes[t] = o),
          o
        );
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer"), require("get-size")))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var n = i.prototype;
    return (
      (n._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (n.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var t = this.items[0],
            i = t && t.element;
          this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        var n = (this.columnWidth += this.gutter),
          o = this.containerWidth + this.gutter,
          s = o / n,
          r = n - (o % n);
        (s = Math[r && r < 1 ? "round" : "floor"](s)),
          (this.cols = Math.max(s, 1));
      }),
      (n.getContainerWidth = function () {
        var t = this._getOption("fitWidth")
            ? this.element.parentNode
            : this.element,
          i = e(t);
        this.containerWidth = i && i.innerWidth;
      }),
      (n._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
          i = Math[e && e < 1 ? "round" : "ceil"](
            t.size.outerWidth / this.columnWidth
          );
        i = Math.min(i, this.cols);
        for (
          var n = this[
              this.options.horizontalOrder
                ? "_getHorizontalColPosition"
                : "_getTopColPosition"
            ](i, t),
            o = { x: this.columnWidth * n.col, y: n.y },
            s = n.y + t.size.outerHeight,
            r = i + n.col,
            a = n.col;
          a < r;
          a++
        )
          this.colYs[a] = s;
        return o;
      }),
      (n._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          i = Math.min.apply(Math, e);
        return { col: e.indexOf(i), y: i };
      }),
      (n._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; n < i; n++)
          e[n] = this._getColGroupY(n, t);
        return e;
      }),
      (n._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
      }),
      (n._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols;
        i = t > 1 && i + t > this.cols ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = n ? i + t : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, t) }
        );
      }),
      (n._manageStamp = function (t) {
        var i = e(t),
          n = this._getElementOffset(t),
          o = this._getOption("originLeft") ? n.left : n.right,
          s = o + i.outerWidth,
          r = Math.floor(o / this.columnWidth);
        r = Math.max(0, r);
        var a = Math.floor(s / this.columnWidth);
        (a -= s % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
        for (
          var l =
              (this._getOption("originTop") ? n.top : n.bottom) + i.outerHeight,
            c = r;
          c <= a;
          c++
        )
          this.colYs[c] = Math.max(l, this.colYs[c]);
      }),
      (n._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = { height: this.maxY };
        return (
          this._getOption("fitWidth") &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (n._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (n.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope/js/layout-modes/masonry",
          ["../layout-mode", "masonry/masonry"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          require("../layout-mode"),
          require("masonry-layout")
        ))
      : e(t.Isotope.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    "use strict";
    var i = t.create("masonry"),
      n = i.prototype,
      o = { _getElementOffset: !0, layout: !0, _getMeasurement: !0 };
    for (var s in e.prototype) o[s] || (n[s] = e.prototype[s]);
    var r = n.measureColumns;
    n.measureColumns = function () {
      (this.items = this.isotope.filteredItems), r.call(this);
    };
    var a = n._getOption;
    return (
      (n._getOption = function (t) {
        return "fitWidth" == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : a.apply(this.isotope, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : "object" == typeof exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("fitRows"),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement("gutter", "outerWidth");
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        var n = { x: this.x, y: this.y };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          n
        );
      }),
      (i._getContainerSize = function () {
        return { height: this.maxY };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("vertical", { horizontalAlignment: 0 }),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        this.y = 0;
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotope.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (this.y += t.size.outerHeight), { x: e, y: i };
      }),
      (i._getContainerSize = function () {
        return { height: this.y };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope/js/item",
            "isotope/js/layout-mode",
            "isotope/js/layout-modes/masonry",
            "isotope/js/layout-modes/fit-rows",
            "isotope/js/layout-modes/vertical",
          ],
          function (i, n, o, s, r, a) {
            return e(t, i, n, o, s, r, a);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("outlayer"),
          require("get-size"),
          require("desandro-matches-selector"),
          require("fizzy-ui-utils"),
          require("isotope/js/item"),
          require("isotope/js/layout-mode"),
          require("isotope/js/layout-modes/masonry"),
          require("isotope/js/layout-modes/fit-rows"),
          require("isotope/js/layout-modes/vertical")
        ))
      : (t.Isotope = e(
          t,
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.fizzyUIUtils,
          t.Isotope.Item,
          t.Isotope.LayoutMode
        ));
  })(window, function (t, e, i, n, o, s, r) {
    var a = t.jQuery,
      l = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      c = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
    (c.Item = s), (c.LayoutMode = r);
    var u = c.prototype;
    (u._create = function () {
      for (var t in ((this.itemGUID = 0),
      (this._sorters = {}),
      this._getSorters(),
      e.prototype._create.call(this),
      (this.modes = {}),
      (this.filteredItems = this.items),
      (this.sortHistory = ["original-order"]),
      r.modes))
        this._initLayoutMode(t);
    }),
      (u.reloadItems = function () {
        (this.itemGUID = 0), e.prototype.reloadItems.call(this);
      }),
      (u._itemize = function () {
        for (
          var t = e.prototype._itemize.apply(this, arguments), i = 0;
          i < t.length;
          i++
        ) {
          t[i].id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
      }),
      (u._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? o.extend(e.options, i) : i),
          (this.modes[t] = new e(this));
      }),
      (u.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout")
          ? void this.arrange()
          : void this._layout();
      }),
      (u._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(this.filteredItems, t),
          (this._isLayoutInited = !0);
      }),
      (u.arrange = function (t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        (this.filteredItems = e.matches),
          this._bindArrangeComplete(),
          this._isInstant
            ? this._noTransition(this._hideReveal, [e])
            : this._hideReveal(e),
          this._sort(),
          this._layout();
      }),
      (u._init = u.arrange),
      (u._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
      }),
      (u._getIsInstant = function () {
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        return (this._isInstant = e), e;
      }),
      (u._bindArrangeComplete = function () {
        function t() {
          e &&
            i &&
            n &&
            o.dispatchEvent("arrangeComplete", null, [o.filteredItems]);
        }
        var e,
          i,
          n,
          o = this;
        this.once("layoutComplete", function () {
          (e = !0), t();
        }),
          this.once("hideComplete", function () {
            (i = !0), t();
          }),
          this.once("revealComplete", function () {
            (n = !0), t();
          });
      }),
      (u._filter = function (t) {
        var e = this.options.filter;
        e = e || "*";
        for (
          var i = [], n = [], o = [], s = this._getFilterTest(e), r = 0;
          r < t.length;
          r++
        ) {
          var a = t[r];
          if (!a.isIgnored) {
            var l = s(a);
            l && i.push(a),
              l && a.isHidden ? n.push(a) : l || a.isHidden || o.push(a);
          }
        }
        return { matches: i, needReveal: n, needHide: o };
      }),
      (u._getFilterTest = function (t) {
        return a && this.options.isJQueryFiltering
          ? function (e) {
              return a(e.element).is(t);
            }
          : "function" == typeof t
          ? function (e) {
              return t(e.element);
            }
          : function (e) {
              return n(e.element, t);
            };
      }),
      (u.updateSortData = function (t) {
        var e;
        t ? ((t = o.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
          this._getSorters(),
          this._updateItemsSortData(e);
      }),
      (u._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
          var i = t[e];
          this._sorters[e] = h(i);
        }
      }),
      (u._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
          t[i].updateSortData();
        }
      });
    var h = (function () {
      return function (t) {
        if ("string" != typeof t) return t;
        var e = l(t).split(" "),
          i = e[0],
          n = i.match(/^\[(.+)\]$/),
          o = (function (t, e) {
            return t
              ? function (e) {
                  return e.getAttribute(t);
                }
              : function (t) {
                  var i = t.querySelector(e);
                  return i && i.textContent;
                };
          })(n && n[1], i),
          s = c.sortDataParsers[e[1]];
        return s
          ? function (t) {
              return t && s(o(t));
            }
          : function (t) {
              return t && o(t);
            };
      };
    })();
    (c.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (u._sort = function () {
        if (this.options.sortBy) {
          var t = o.makeArray(this.options.sortBy);
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory));
          var e = (function (t, e) {
            return function (i, n) {
              for (var o = 0; o < t.length; o++) {
                var s = t[o],
                  r = i.sortData[s],
                  a = n.sortData[s];
                if (r > a || r < a)
                  return (
                    (r > a ? 1 : -1) * ((void 0 !== e[s] ? e[s] : e) ? 1 : -1)
                  );
              }
              return 0;
            };
          })(this.sortHistory, this.options.sortAscending);
          this.filteredItems.sort(e);
        }
      }),
      (u._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++)
          if (t[e] != this.sortHistory[e]) return !1;
        return !0;
      }),
      (u._mode = function () {
        var t = this.options.layoutMode,
          e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return (e.options = this.options[t]), e;
      }),
      (u._resetLayout = function () {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout();
      }),
      (u._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t);
      }),
      (u._manageStamp = function (t) {
        this._mode()._manageStamp(t);
      }),
      (u._getContainerSize = function () {
        return this._mode()._getContainerSize();
      }),
      (u.needsResizeLayout = function () {
        return this._mode().needsResizeLayout();
      }),
      (u.appended = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i = this._filterRevealAdded(e);
          this.filteredItems = this.filteredItems.concat(i);
        }
      }),
      (u.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          this._resetLayout(), this._manageStamps();
          var i = this._filterRevealAdded(e);
          this.layoutItems(this.filteredItems),
            (this.filteredItems = i.concat(this.filteredItems)),
            (this.items = e.concat(this.items));
        }
      }),
      (u._filterRevealAdded = function (t) {
        var e = this._filter(t);
        return (
          this.hide(e.needHide),
          this.reveal(e.matches),
          this.layoutItems(e.matches, !0),
          e.matches
        );
      }),
      (u.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i,
            n,
            o = e.length;
          for (i = 0; i < o; i++)
            (n = e[i]), this.element.appendChild(n.element);
          var s = this._filter(e).matches;
          for (i = 0; i < o; i++) e[i].isLayoutInstant = !0;
          for (this.arrange(), i = 0; i < o; i++) delete e[i].isLayoutInstant;
          this.reveal(s);
        }
      });
    var d = u.remove;
    return (
      (u.remove = function (t) {
        t = o.makeArray(t);
        var e = this.getItems(t);
        d.call(this, t);
        for (var i = e && e.length, n = 0; i && n < i; n++) {
          var s = e[n];
          o.removeFrom(this.filteredItems, s);
        }
      }),
      (u.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
          this.items[t].sortData.random = Math.random();
        }
        (this.options.sortBy = "random"), this._sort(), this._layout();
      }),
      (u._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var n = t.apply(this, e);
        return (this.options.transitionDuration = i), n;
      }),
      (u.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
          return t.element;
        });
      }),
      c
    );
  }),
  (function (t, e, i, n) {
    var o = t(e);
    (t.fn.lazyload = function (s) {
      function r() {
        var e = 0;
        l.each(function () {
          var i = t(this);
          if (!c.skip_invisible || i.is(":visible"))
            if (t.abovethetop(this, c) || t.leftofbegin(this, c));
            else if (t.belowthefold(this, c) || t.rightoffold(this, c)) {
              if (++e > c.failure_limit) return !1;
            } else i.trigger("appear"), (e = 0);
        });
      }
      var a,
        l = this,
        c = {
          threshold: 0,
          failure_limit: 0,
          event: "scroll",
          effect: "show",
          container: e,
          data_attribute: "original",
          skip_invisible: !0,
          appear: null,
          load: null,
          placeholder:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",
        };
      return (
        s &&
          (n !== s.failurelimit &&
            ((s.failure_limit = s.failurelimit), delete s.failurelimit),
          n !== s.effectspeed &&
            ((s.effect_speed = s.effectspeed), delete s.effectspeed),
          t.extend(c, s)),
        (a = c.container === n || c.container === e ? o : t(c.container)),
        0 === c.event.indexOf("scroll") &&
          a.bind(c.event, function () {
            return r();
          }),
        this.each(function () {
          var e = this,
            i = t(e);
          (e.loaded = !1),
            (i.attr("src") === n || !1 === i.attr("src")) &&
              i.is("img") &&
              i.attr("src", c.placeholder),
            i.one("appear", function () {
              if (!this.loaded) {
                if (c.appear) {
                  var n = l.length;
                  c.appear.call(e, n, c);
                }
                t("<img />")
                  .bind("load", function () {
                    var n = i.attr("data-" + c.data_attribute);
                    i.hide(),
                      i.is("img")
                        ? i.attr("src", n)
                        : i.css("background-image", "url('" + n + "')"),
                      i[c.effect](c.effect_speed),
                      (e.loaded = !0);
                    var o = t.grep(l, function (t) {
                      return !t.loaded;
                    });
                    if (((l = t(o)), c.load)) {
                      var s = l.length;
                      c.load.call(e, s, c);
                    }
                  })
                  .attr("src", i.attr("data-" + c.data_attribute));
              }
            }),
            0 !== c.event.indexOf("scroll") &&
              i.bind(c.event, function () {
                e.loaded || i.trigger("appear");
              });
        }),
        o.bind("resize", function () {
          r();
        }),
        /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) &&
          o.bind("pageshow", function (e) {
            e.originalEvent &&
              e.originalEvent.persisted &&
              l.each(function () {
                t(this).trigger("appear");
              });
          }),
        t(i).ready(function () {
          r();
        }),
        this
      );
    }),
      (t.belowthefold = function (i, s) {
        return (
          (s.container === n || s.container === e
            ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop()
            : t(s.container).offset().top + t(s.container).height()) <=
          t(i).offset().top - s.threshold
        );
      }),
      (t.rightoffold = function (i, s) {
        return (
          (s.container === n || s.container === e
            ? o.width() + o.scrollLeft()
            : t(s.container).offset().left + t(s.container).width()) <=
          t(i).offset().left - s.threshold
        );
      }),
      (t.abovethetop = function (i, s) {
        return (
          (s.container === n || s.container === e
            ? o.scrollTop()
            : t(s.container).offset().top) >=
          t(i).offset().top + s.threshold + t(i).height()
        );
      }),
      (t.leftofbegin = function (i, s) {
        return (
          (s.container === n || s.container === e
            ? o.scrollLeft()
            : t(s.container).offset().left) >=
          t(i).offset().left + s.threshold + t(i).width()
        );
      }),
      (t.inviewport = function (e, i) {
        return !(
          t.rightoffold(e, i) ||
          t.leftofbegin(e, i) ||
          t.belowthefold(e, i) ||
          t.abovethetop(e, i)
        );
      }),
      t.extend(t.expr[":"], {
        "below-the-fold": function (e) {
          return t.belowthefold(e, { threshold: 0 });
        },
        "above-the-top": function (e) {
          return !t.belowthefold(e, { threshold: 0 });
        },
        "right-of-screen": function (e) {
          return t.rightoffold(e, { threshold: 0 });
        },
        "left-of-screen": function (e) {
          return !t.rightoffold(e, { threshold: 0 });
        },
        "in-viewport": function (e) {
          return t.inviewport(e, { threshold: 0 });
        },
        "above-the-fold": function (e) {
          return !t.belowthefold(e, { threshold: 0 });
        },
        "right-of-fold": function (e) {
          return t.rightoffold(e, { threshold: 0 });
        },
        "left-of-fold": function (e) {
          return !t.rightoffold(e, { threshold: 0 });
        },
      });
  })(jQuery, window, document),
  (function (t, e, i, n) {
    "use strict";
    function o(t, e) {
      var n,
        o,
        s,
        r = [],
        a = 0;
      (t && t.isDefaultPrevented()) ||
        (t.preventDefault(),
        (e = e || {}),
        t && t.data && (e = p(t.data.options, e)),
        (n = e.$target || i(t.currentTarget).trigger("blur")),
        ((s = i.fancybox.getInstance()) && s.$trigger && s.$trigger.is(n)) ||
          (e.selector
            ? (r = i(e.selector))
            : (o = n.attr("data-fancybox") || "")
            ? (r = (r = t.data ? t.data.items : []).length
                ? r.filter('[data-fancybox="' + o + '"]')
                : i('[data-fancybox="' + o + '"]'))
            : (r = [n]),
          (a = i(r).index(n)) < 0 && (a = 0),
          ((s = i.fancybox.open(r, e, a)).$trigger = n)));
    }
    if (((t.console = t.console || { info: function (t) {} }), i)) {
      if (i.fn.fancybox)
        return void console.info("fancyBox already initialized");
      var s = {
          closeExisting: !1,
          loop: !1,
          gutter: 50,
          keyboard: !0,
          preventCaptionOverlap: !0,
          arrows: !0,
          infobar: !0,
          smallBtn: "auto",
          toolbar: "auto",
          buttons: ["zoom", "slideShow", "thumbs", "close"],
          idleTime: 3,
          protect: !1,
          modal: !1,
          image: { preload: !1 },
          ajax: { settings: { data: { fancybox: !0 } } },
          iframe: {
            tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
            preload: !0,
            css: {},
            attr: { scrolling: "auto" },
          },
          video: {
            tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',
            format: "",
            autoStart: !0,
          },
          defaultType: "image",
          animationEffect: "zoom",
          animationDuration: 366,
          zoomOpacity: "auto",
          transitionEffect: "fade",
          transitionDuration: 366,
          slideClass: "",
          baseClass: "",
          baseTpl:
            '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>',
          spinnerTpl: '<div class="fancybox-loading"></div>',
          errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
          btnTpl: {
            download:
              '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',
            zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',
            close:
              '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',
            arrowLeft:
              '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',
            arrowRight:
              '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',
            smallBtn:
              '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>',
          },
          parentEl: "body",
          hideScrollbar: !0,
          autoFocus: !0,
          backFocus: !0,
          trapFocus: !0,
          fullScreen: { autoStart: !1 },
          touch: { vertical: !0, momentum: !0 },
          hash: null,
          media: {},
          slideShow: { autoStart: !1, speed: 3e3 },
          thumbs: {
            autoStart: !1,
            hideOnClose: !0,
            parentEl: ".fancybox-container",
            axis: "y",
          },
          wheel: "auto",
          onInit: i.noop,
          beforeLoad: i.noop,
          afterLoad: i.noop,
          beforeShow: i.noop,
          afterShow: i.noop,
          beforeClose: i.noop,
          afterClose: i.noop,
          onActivate: i.noop,
          onDeactivate: i.noop,
          clickContent: function (t, e) {
            return "image" === t.type && "zoom";
          },
          clickSlide: "close",
          clickOutside: "close",
          dblclickContent: !1,
          dblclickSlide: !1,
          dblclickOutside: !1,
          mobile: {
            preventCaptionOverlap: !1,
            idleTime: !1,
            clickContent: function (t, e) {
              return "image" === t.type && "toggleControls";
            },
            clickSlide: function (t, e) {
              return "image" === t.type ? "toggleControls" : "close";
            },
            dblclickContent: function (t, e) {
              return "image" === t.type && "zoom";
            },
            dblclickSlide: function (t, e) {
              return "image" === t.type && "zoom";
            },
          },
          lang: "en",
          i18n: {
            en: {
              CLOSE: "Close",
              NEXT: "Next",
              PREV: "Previous",
              ERROR:
                "The requested content cannot be loaded. <br/> Please try again later.",
              PLAY_START: "Start slideshow",
              PLAY_STOP: "Pause slideshow",
              FULL_SCREEN: "Full screen",
              THUMBS: "Thumbnails",
              DOWNLOAD: "Download",
              SHARE: "Share",
              ZOOM: "Zoom",
            },
            de: {
              CLOSE: "Schlie&szlig;en",
              NEXT: "Weiter",
              PREV: "Zur&uuml;ck",
              ERROR:
                "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
              PLAY_START: "Diaschau starten",
              PLAY_STOP: "Diaschau beenden",
              FULL_SCREEN: "Vollbild",
              THUMBS: "Vorschaubilder",
              DOWNLOAD: "Herunterladen",
              SHARE: "Teilen",
              ZOOM: "Vergr&ouml;&szlig;ern",
            },
          },
        },
        r = i(t),
        a = i(e),
        l = 0,
        c =
          t.requestAnimationFrame ||
          t.webkitRequestAnimationFrame ||
          t.mozRequestAnimationFrame ||
          t.oRequestAnimationFrame ||
          function (e) {
            return t.setTimeout(e, 1e3 / 60);
          },
        u =
          t.cancelAnimationFrame ||
          t.webkitCancelAnimationFrame ||
          t.mozCancelAnimationFrame ||
          t.oCancelAnimationFrame ||
          function (e) {
            t.clearTimeout(e);
          },
        h = (function () {
          var t,
            i = e.createElement("fakeelement"),
            n = {
              transition: "transitionend",
              OTransition: "oTransitionEnd",
              MozTransition: "transitionend",
              WebkitTransition: "webkitTransitionEnd",
            };
          for (t in n) if (void 0 !== i.style[t]) return n[t];
          return "transitionend";
        })(),
        d = function (t) {
          return t && t.length && t[0].offsetHeight;
        },
        p = function (t, e) {
          var n = i.extend(!0, {}, t, e);
          return (
            i.each(e, function (t, e) {
              i.isArray(e) && (n[t] = e);
            }),
            n
          );
        },
        f = function (t) {
          var n, o;
          return (
            !(!t || t.ownerDocument !== e) &&
            (i(".fancybox-container").css("pointer-events", "none"),
            (n = {
              x: t.getBoundingClientRect().left + t.offsetWidth / 2,
              y: t.getBoundingClientRect().top + t.offsetHeight / 2,
            }),
            (o = e.elementFromPoint(n.x, n.y) === t),
            i(".fancybox-container").css("pointer-events", ""),
            o)
          );
        },
        m = function (t, e, n) {
          var o = this;
          (o.opts = p({ index: n }, i.fancybox.defaults)),
            i.isPlainObject(e) && (o.opts = p(o.opts, e)),
            i.fancybox.isMobile && (o.opts = p(o.opts, o.opts.mobile)),
            (o.id = o.opts.id || ++l),
            (o.currIndex = parseInt(o.opts.index, 10) || 0),
            (o.prevIndex = null),
            (o.prevPos = null),
            (o.currPos = 0),
            (o.firstRun = !0),
            (o.group = []),
            (o.slides = {}),
            o.addContent(t),
            o.group.length && o.init();
        };
      i.extend(m.prototype, {
        init: function () {
          var n,
            o,
            s = this,
            r = s.group[s.currIndex].opts;
          r.closeExisting && i.fancybox.close(!0),
            i("body").addClass("fancybox-active"),
            !i.fancybox.getInstance() &&
              !1 !== r.hideScrollbar &&
              !i.fancybox.isMobile &&
              e.body.scrollHeight > t.innerHeight &&
              (i("head").append(
                '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' +
                  (t.innerWidth - e.documentElement.clientWidth) +
                  "px;}</style>"
              ),
              i("body").addClass("compensate-for-scrollbar")),
            (o = ""),
            i.each(r.buttons, function (t, e) {
              o += r.btnTpl[e] || "";
            }),
            (n = i(
              s.translate(
                s,
                r.baseTpl
                  .replace("{{buttons}}", o)
                  .replace(
                    "{{arrows}}",
                    r.btnTpl.arrowLeft + r.btnTpl.arrowRight
                  )
              )
            )
              .attr("id", "fancybox-container-" + s.id)
              .addClass(r.baseClass)
              .data("FancyBox", s)
              .appendTo(r.parentEl)),
            (s.$refs = { container: n }),
            [
              "bg",
              "inner",
              "infobar",
              "toolbar",
              "stage",
              "caption",
              "navigation",
            ].forEach(function (t) {
              s.$refs[t] = n.find(".fancybox-" + t);
            }),
            s.trigger("onInit"),
            s.activate(),
            s.jumpTo(s.currIndex);
        },
        translate: function (t, e) {
          var i = t.opts.i18n[t.opts.lang] || t.opts.i18n.en;
          return e.replace(/\{\{(\w+)\}\}/g, function (t, e) {
            return void 0 === i[e] ? t : i[e];
          });
        },
        addContent: function (t) {
          var e,
            n = this,
            o = i.makeArray(t);
          i.each(o, function (t, e) {
            var o,
              s,
              r,
              a,
              l,
              c = {},
              u = {};
            i.isPlainObject(e)
              ? ((c = e), (u = e.opts || e))
              : "object" === i.type(e) && i(e).length
              ? ((u = (o = i(e)).data() || {}),
                ((u = i.extend(!0, {}, u, u.options)).$orig = o),
                (c.src = n.opts.src || u.src || o.attr("href")),
                c.type || c.src || ((c.type = "inline"), (c.src = e)))
              : (c = { type: "html", src: e + "" }),
              (c.opts = i.extend(!0, {}, n.opts, u)),
              i.isArray(u.buttons) && (c.opts.buttons = u.buttons),
              i.fancybox.isMobile &&
                c.opts.mobile &&
                (c.opts = p(c.opts, c.opts.mobile)),
              (s = c.type || c.opts.type),
              (a = c.src || ""),
              !s &&
                a &&
                ((r = a.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))
                  ? ((s = "video"),
                    c.opts.video.format ||
                      (c.opts.video.format =
                        "video/" + ("ogv" === r[1] ? "ogg" : r[1])))
                  : a.match(
                      /(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i
                    )
                  ? (s = "image")
                  : a.match(/\.(pdf)((\?|#).*)?$/i)
                  ? ((s = "iframe"),
                    (c = i.extend(!0, c, {
                      contentType: "pdf",
                      opts: { iframe: { preload: !1 } },
                    })))
                  : "#" === a.charAt(0) && (s = "inline")),
              s ? (c.type = s) : n.trigger("objectNeedsType", c),
              c.contentType ||
                (c.contentType =
                  i.inArray(c.type, ["html", "inline", "ajax"]) > -1
                    ? "html"
                    : c.type),
              (c.index = n.group.length),
              "auto" == c.opts.smallBtn &&
                (c.opts.smallBtn =
                  i.inArray(c.type, ["html", "inline", "ajax"]) > -1),
              "auto" === c.opts.toolbar && (c.opts.toolbar = !c.opts.smallBtn),
              (c.$thumb = c.opts.$thumb || null),
              c.opts.$trigger &&
                c.index === n.opts.index &&
                ((c.$thumb = c.opts.$trigger.find("img:first")),
                c.$thumb.length && (c.opts.$orig = c.opts.$trigger)),
              (c.$thumb && c.$thumb.length) ||
                !c.opts.$orig ||
                (c.$thumb = c.opts.$orig.find("img:first")),
              c.$thumb && !c.$thumb.length && (c.$thumb = null),
              (c.thumb = c.opts.thumb || (c.$thumb ? c.$thumb[0].src : null)),
              "function" === i.type(c.opts.caption) &&
                (c.opts.caption = c.opts.caption.apply(e, [n, c])),
              "function" === i.type(n.opts.caption) &&
                (c.opts.caption = n.opts.caption.apply(e, [n, c])),
              c.opts.caption instanceof i ||
                (c.opts.caption =
                  void 0 === c.opts.caption ? "" : c.opts.caption + ""),
              "ajax" === c.type &&
                (l = a.split(/\s+/, 2)).length > 1 &&
                ((c.src = l.shift()), (c.opts.filter = l.shift())),
              c.opts.modal &&
                (c.opts = i.extend(!0, c.opts, {
                  trapFocus: !0,
                  infobar: 0,
                  toolbar: 0,
                  smallBtn: 0,
                  keyboard: 0,
                  slideShow: 0,
                  fullScreen: 0,
                  thumbs: 0,
                  touch: 0,
                  clickContent: !1,
                  clickSlide: !1,
                  clickOutside: !1,
                  dblclickContent: !1,
                  dblclickSlide: !1,
                  dblclickOutside: !1,
                })),
              n.group.push(c);
          }),
            Object.keys(n.slides).length &&
              (n.updateControls(),
              (e = n.Thumbs) && e.isActive && (e.create(), e.focus()));
        },
        addEvents: function () {
          var e = this;
          e.removeEvents(),
            e.$refs.container
              .on("click.fb-close", "[data-fancybox-close]", function (t) {
                t.stopPropagation(), t.preventDefault(), e.close(t);
              })
              .on(
                "touchstart.fb-prev click.fb-prev",
                "[data-fancybox-prev]",
                function (t) {
                  t.stopPropagation(), t.preventDefault(), e.previous();
                }
              )
              .on(
                "touchstart.fb-next click.fb-next",
                "[data-fancybox-next]",
                function (t) {
                  t.stopPropagation(), t.preventDefault(), e.next();
                }
              )
              .on("click.fb", "[data-fancybox-zoom]", function (t) {
                e[e.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
              }),
            r.on("orientationchange.fb resize.fb", function (t) {
              t && t.originalEvent && "resize" === t.originalEvent.type
                ? (e.requestId && u(e.requestId),
                  (e.requestId = c(function () {
                    e.update(t);
                  })))
                : (e.current &&
                    "iframe" === e.current.type &&
                    e.$refs.stage.hide(),
                  setTimeout(
                    function () {
                      e.$refs.stage.show(), e.update(t);
                    },
                    i.fancybox.isMobile ? 600 : 250
                  ));
            }),
            a.on("keydown.fb", function (t) {
              var n = (i.fancybox ? i.fancybox.getInstance() : null).current,
                o = t.keyCode || t.which;
              if (9 != o)
                return !n.opts.keyboard ||
                  t.ctrlKey ||
                  t.altKey ||
                  t.shiftKey ||
                  i(t.target).is("input,textarea,video,audio,select")
                  ? void 0
                  : 8 === o || 27 === o
                  ? (t.preventDefault(), void e.close(t))
                  : 37 === o || 38 === o
                  ? (t.preventDefault(), void e.previous())
                  : 39 === o || 40 === o
                  ? (t.preventDefault(), void e.next())
                  : void e.trigger("afterKeydown", t, o);
              n.opts.trapFocus && e.focus(t);
            }),
            e.group[e.currIndex].opts.idleTime &&
              ((e.idleSecondsCounter = 0),
              a.on(
                "mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",
                function (t) {
                  (e.idleSecondsCounter = 0),
                    e.isIdle && e.showControls(),
                    (e.isIdle = !1);
                }
              ),
              (e.idleInterval = t.setInterval(function () {
                ++e.idleSecondsCounter >= e.group[e.currIndex].opts.idleTime &&
                  !e.isDragging &&
                  ((e.isIdle = !0),
                  (e.idleSecondsCounter = 0),
                  e.hideControls());
              }, 1e3)));
        },
        removeEvents: function () {
          var e = this;
          r.off("orientationchange.fb resize.fb"),
            a.off("keydown.fb .fb-idle"),
            this.$refs.container.off(".fb-close .fb-prev .fb-next"),
            e.idleInterval &&
              (t.clearInterval(e.idleInterval), (e.idleInterval = null));
        },
        previous: function (t) {
          return this.jumpTo(this.currPos - 1, t);
        },
        next: function (t) {
          return this.jumpTo(this.currPos + 1, t);
        },
        jumpTo: function (t, e) {
          var n,
            o,
            s,
            r,
            a,
            l,
            c,
            u,
            h,
            p = this,
            f = p.group.length;
          if (!(p.isDragging || p.isClosing || (p.isAnimating && p.firstRun))) {
            if (
              ((t = parseInt(t, 10)),
              !(s = p.current ? p.current.opts.loop : p.opts.loop) &&
                (t < 0 || t >= f))
            )
              return !1;
            if (
              ((n = p.firstRun = !Object.keys(p.slides).length),
              (a = p.current),
              (p.prevIndex = p.currIndex),
              (p.prevPos = p.currPos),
              (r = p.createSlide(t)),
              f > 1 &&
                ((s || r.index < f - 1) && p.createSlide(t + 1),
                (s || r.index > 0) && p.createSlide(t - 1)),
              (p.current = r),
              (p.currIndex = r.index),
              (p.currPos = r.pos),
              p.trigger("beforeShow", n),
              p.updateControls(),
              (r.forcedDuration = void 0),
              i.isNumeric(e)
                ? (r.forcedDuration = e)
                : (e = r.opts[n ? "animationDuration" : "transitionDuration"]),
              (e = parseInt(e, 10)),
              (o = p.isMoved(r)),
              r.$slide.addClass("fancybox-slide--current"),
              n)
            )
              return (
                r.opts.animationEffect &&
                  e &&
                  p.$refs.container.css("transition-duration", e + "ms"),
                p.$refs.container.addClass("fancybox-is-open").trigger("focus"),
                p.loadSlide(r),
                void p.preload("image")
              );
            (l = i.fancybox.getTranslate(a.$slide)),
              (c = i.fancybox.getTranslate(p.$refs.stage)),
              i.each(p.slides, function (t, e) {
                i.fancybox.stop(e.$slide, !0);
              }),
              a.pos !== r.pos && (a.isComplete = !1),
              a.$slide.removeClass(
                "fancybox-slide--complete fancybox-slide--current"
              ),
              o
                ? ((h = l.left - (a.pos * l.width + a.pos * a.opts.gutter)),
                  i.each(p.slides, function (t, n) {
                    n.$slide
                      .removeClass("fancybox-animated")
                      .removeClass(function (t, e) {
                        return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(
                          " "
                        );
                      });
                    var o = n.pos * l.width + n.pos * n.opts.gutter;
                    i.fancybox.setTranslate(n.$slide, {
                      top: 0,
                      left: o - c.left + h,
                    }),
                      n.pos !== r.pos &&
                        n.$slide.addClass(
                          "fancybox-slide--" +
                            (n.pos > r.pos ? "next" : "previous")
                        ),
                      d(n.$slide),
                      i.fancybox.animate(
                        n.$slide,
                        {
                          top: 0,
                          left:
                            (n.pos - r.pos) * l.width +
                            (n.pos - r.pos) * n.opts.gutter,
                        },
                        e,
                        function () {
                          n.$slide
                            .css({ transform: "", opacity: "" })
                            .removeClass(
                              "fancybox-slide--next fancybox-slide--previous"
                            ),
                            n.pos === p.currPos && p.complete();
                        }
                      );
                  }))
                : e &&
                  r.opts.transitionEffect &&
                  ((u =
                    "fancybox-animated fancybox-fx-" + r.opts.transitionEffect),
                  a.$slide.addClass(
                    "fancybox-slide--" + (a.pos > r.pos ? "next" : "previous")
                  ),
                  i.fancybox.animate(
                    a.$slide,
                    u,
                    e,
                    function () {
                      a.$slide
                        .removeClass(u)
                        .removeClass(
                          "fancybox-slide--next fancybox-slide--previous"
                        );
                    },
                    !1
                  )),
              r.isLoaded ? p.revealContent(r) : p.loadSlide(r),
              p.preload("image");
          }
        },
        createSlide: function (t) {
          var e,
            n,
            o = this;
          return (
            (n = (n = t % o.group.length) < 0 ? o.group.length + n : n),
            !o.slides[t] &&
              o.group[n] &&
              ((e = i('<div class="fancybox-slide"></div>').appendTo(
                o.$refs.stage
              )),
              (o.slides[t] = i.extend(!0, {}, o.group[n], {
                pos: t,
                $slide: e,
                isLoaded: !1,
              })),
              o.updateSlide(o.slides[t])),
            o.slides[t]
          );
        },
        scaleToActual: function (t, e, n) {
          var o,
            s,
            r,
            a,
            l,
            c = this,
            u = c.current,
            h = u.$content,
            d = i.fancybox.getTranslate(u.$slide).width,
            p = i.fancybox.getTranslate(u.$slide).height,
            f = u.width,
            m = u.height;
          c.isAnimating ||
            c.isMoved() ||
            !h ||
            "image" != u.type ||
            !u.isLoaded ||
            u.hasError ||
            ((c.isAnimating = !0),
            i.fancybox.stop(h),
            (t = void 0 === t ? 0.5 * d : t),
            (e = void 0 === e ? 0.5 * p : e),
            ((o = i.fancybox.getTranslate(h)).top -= i.fancybox.getTranslate(
              u.$slide
            ).top),
            (o.left -= i.fancybox.getTranslate(u.$slide).left),
            (a = f / o.width),
            (l = m / o.height),
            (s = 0.5 * d - 0.5 * f),
            (r = 0.5 * p - 0.5 * m),
            f > d &&
              ((s = o.left * a - (t * a - t)) > 0 && (s = 0),
              s < d - f && (s = d - f)),
            m > p &&
              ((r = o.top * l - (e * l - e)) > 0 && (r = 0),
              r < p - m && (r = p - m)),
            c.updateCursor(f, m),
            i.fancybox.animate(
              h,
              { top: r, left: s, scaleX: a, scaleY: l },
              n || 366,
              function () {
                c.isAnimating = !1;
              }
            ),
            c.SlideShow && c.SlideShow.isActive && c.SlideShow.stop());
        },
        scaleToFit: function (t) {
          var e,
            n = this,
            o = n.current,
            s = o.$content;
          n.isAnimating ||
            n.isMoved() ||
            !s ||
            "image" != o.type ||
            !o.isLoaded ||
            o.hasError ||
            ((n.isAnimating = !0),
            i.fancybox.stop(s),
            (e = n.getFitPos(o)),
            n.updateCursor(e.width, e.height),
            i.fancybox.animate(
              s,
              {
                top: e.top,
                left: e.left,
                scaleX: e.width / s.width(),
                scaleY: e.height / s.height(),
              },
              t || 366,
              function () {
                n.isAnimating = !1;
              }
            ));
        },
        getFitPos: function (t) {
          var e,
            n,
            o,
            s,
            r = t.$content,
            a = t.$slide,
            l = t.width || t.opts.width,
            c = t.height || t.opts.height,
            u = {};
          return (
            !!(t.isLoaded && r && r.length) &&
            ((e = i.fancybox.getTranslate(this.$refs.stage).width),
            (n = i.fancybox.getTranslate(this.$refs.stage).height),
            (e -=
              parseFloat(a.css("paddingLeft")) +
              parseFloat(a.css("paddingRight")) +
              parseFloat(r.css("marginLeft")) +
              parseFloat(r.css("marginRight"))),
            (n -=
              parseFloat(a.css("paddingTop")) +
              parseFloat(a.css("paddingBottom")) +
              parseFloat(r.css("marginTop")) +
              parseFloat(r.css("marginBottom"))),
            (l && c) || ((l = e), (c = n)),
            (l *= o = Math.min(1, e / l, n / c)) > e - 0.5 && (l = e),
            (c *= o) > n - 0.5 && (c = n),
            "image" === t.type
              ? ((u.top =
                  Math.floor(0.5 * (n - c)) + parseFloat(a.css("paddingTop"))),
                (u.left =
                  Math.floor(0.5 * (e - l)) + parseFloat(a.css("paddingLeft"))))
              : "video" === t.contentType &&
                (c >
                l /
                  (s =
                    t.opts.width && t.opts.height
                      ? l / c
                      : t.opts.ratio || 16 / 9)
                  ? (c = l / s)
                  : l > c * s && (l = c * s)),
            (u.width = l),
            (u.height = c),
            u)
          );
        },
        update: function (t) {
          var e = this;
          i.each(e.slides, function (i, n) {
            e.updateSlide(n, t);
          });
        },
        updateSlide: function (t, e) {
          var n = this,
            o = t && t.$content,
            s = t.width || t.opts.width,
            r = t.height || t.opts.height,
            a = t.$slide;
          n.adjustCaption(t),
            o &&
              (s || r || "video" === t.contentType) &&
              !t.hasError &&
              (i.fancybox.stop(o),
              i.fancybox.setTranslate(o, n.getFitPos(t)),
              t.pos === n.currPos && ((n.isAnimating = !1), n.updateCursor())),
            n.adjustLayout(t),
            a.length &&
              (a.trigger("refresh"),
              t.pos === n.currPos &&
                n.$refs.toolbar
                  .add(n.$refs.navigation.find(".fancybox-button--arrow_right"))
                  .toggleClass(
                    "compensate-for-scrollbar",
                    a.get(0).scrollHeight > a.get(0).clientHeight
                  )),
            n.trigger("onUpdate", t, e);
        },
        centerSlide: function (t) {
          var e = this,
            n = e.current,
            o = n.$slide;
          !e.isClosing &&
            n &&
            (o.siblings().css({ transform: "", opacity: "" }),
            o
              .parent()
              .children()
              .removeClass("fancybox-slide--previous fancybox-slide--next"),
            i.fancybox.animate(
              o,
              { top: 0, left: 0, opacity: 1 },
              void 0 === t ? 0 : t,
              function () {
                o.css({ transform: "", opacity: "" }),
                  n.isComplete || e.complete();
              },
              !1
            ));
        },
        isMoved: function (t) {
          var e,
            n,
            o = t || this.current;
          return (
            !!o &&
            ((n = i.fancybox.getTranslate(this.$refs.stage)),
            (e = i.fancybox.getTranslate(o.$slide)),
            !o.$slide.hasClass("fancybox-animated") &&
              (Math.abs(e.top - n.top) > 0.5 ||
                Math.abs(e.left - n.left) > 0.5))
          );
        },
        updateCursor: function (t, e) {
          var n,
            o,
            s = this,
            r = s.current,
            a = s.$refs.container;
          r &&
            !s.isClosing &&
            s.Guestures &&
            (a.removeClass(
              "fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"
            ),
            (o = !!(n = s.canPan(t, e)) || s.isZoomable()),
            a.toggleClass("fancybox-is-zoomable", o),
            i("[data-fancybox-zoom]").prop("disabled", !o),
            n
              ? a.addClass("fancybox-can-pan")
              : o &&
                ("zoom" === r.opts.clickContent ||
                  (i.isFunction(r.opts.clickContent) &&
                    "zoom" == r.opts.clickContent(r)))
              ? a.addClass("fancybox-can-zoomIn")
              : r.opts.touch &&
                (r.opts.touch.vertical || s.group.length > 1) &&
                "video" !== r.contentType &&
                a.addClass("fancybox-can-swipe"));
        },
        isZoomable: function () {
          var t,
            e = this,
            i = e.current;
          if (i && !e.isClosing && "image" === i.type && !i.hasError) {
            if (!i.isLoaded) return !0;
            if (
              (t = e.getFitPos(i)) &&
              (i.width > t.width || i.height > t.height)
            )
              return !0;
          }
          return !1;
        },
        isScaledDown: function (t, e) {
          var n = !1,
            o = this.current,
            s = o.$content;
          return (
            void 0 !== t && void 0 !== e
              ? (n = t < o.width && e < o.height)
              : s &&
                (n =
                  (n = i.fancybox.getTranslate(s)).width < o.width &&
                  n.height < o.height),
            n
          );
        },
        canPan: function (t, e) {
          var n = this.current,
            o = null,
            s = !1;
          return (
            "image" === n.type &&
              (n.isComplete || (t && e)) &&
              !n.hasError &&
              ((s = this.getFitPos(n)),
              void 0 !== t && void 0 !== e
                ? (o = { width: t, height: e })
                : n.isComplete && (o = i.fancybox.getTranslate(n.$content)),
              o &&
                s &&
                (s =
                  Math.abs(o.width - s.width) > 1.5 ||
                  Math.abs(o.height - s.height) > 1.5)),
            s
          );
        },
        loadSlide: function (t) {
          var e,
            n,
            o,
            s = this;
          if (!t.isLoading && !t.isLoaded) {
            if (((t.isLoading = !0), !1 === s.trigger("beforeLoad", t)))
              return (t.isLoading = !1), !1;
            switch (
              ((e = t.type),
              (n = t.$slide)
                .off("refresh")
                .trigger("onReset")
                .addClass(t.opts.slideClass),
              e)
            ) {
              case "image":
                s.setImage(t);
                break;
              case "iframe":
                s.setIframe(t);
                break;
              case "html":
                s.setContent(t, t.src || t.content);
                break;
              case "video":
                s.setContent(
                  t,
                  t.opts.video.tpl
                    .replace(/\{\{src\}\}/gi, t.src)
                    .replace(
                      "{{format}}",
                      t.opts.videoFormat || t.opts.video.format || ""
                    )
                    .replace("{{poster}}", t.thumb || "")
                );
                break;
              case "inline":
                i(t.src).length ? s.setContent(t, i(t.src)) : s.setError(t);
                break;
              case "ajax":
                s.showLoading(t),
                  (o = i.ajax(
                    i.extend({}, t.opts.ajax.settings, {
                      url: t.src,
                      success: function (e, i) {
                        "success" === i && s.setContent(t, e);
                      },
                      error: function (e, i) {
                        e && "abort" !== i && s.setError(t);
                      },
                    })
                  )),
                  n.one("onReset", function () {
                    o.abort();
                  });
                break;
              default:
                s.setError(t);
            }
            return !0;
          }
        },
        setImage: function (t) {
          var n,
            o = this;
          setTimeout(function () {
            var e = t.$image;
            o.isClosing ||
              !t.isLoading ||
              (e && e.length && e[0].complete) ||
              t.hasError ||
              o.showLoading(t);
          }, 50),
            o.checkSrcset(t),
            (t.$content = i('<div class="fancybox-content"></div>')
              .addClass("fancybox-is-hidden")
              .appendTo(t.$slide.addClass("fancybox-slide--image"))),
            !1 !== t.opts.preload &&
              t.opts.width &&
              t.opts.height &&
              t.thumb &&
              ((t.width = t.opts.width),
              (t.height = t.opts.height),
              ((n = e.createElement("img")).onerror = function () {
                i(this).remove(), (t.$ghost = null);
              }),
              (n.onload = function () {
                o.afterLoad(t);
              }),
              (t.$ghost = i(n)
                .addClass("fancybox-image")
                .appendTo(t.$content)
                .attr("src", t.thumb))),
            o.setBigImage(t);
        },
        checkSrcset: function (e) {
          var i,
            n,
            o,
            s,
            r = e.opts.srcset || e.opts.image.srcset;
          if (r) {
            (o = t.devicePixelRatio || 1),
              (s = t.innerWidth * o),
              (n = r.split(",").map(function (t) {
                var e = {};
                return (
                  t
                    .trim()
                    .split(/\s+/)
                    .forEach(function (t, i) {
                      var n = parseInt(t.substring(0, t.length - 1), 10);
                      if (0 === i) return (e.url = t);
                      n && ((e.value = n), (e.postfix = t[t.length - 1]));
                    }),
                  e
                );
              })).sort(function (t, e) {
                return t.value - e.value;
              });
            for (var a = 0; a < n.length; a++) {
              var l = n[a];
              if (
                ("w" === l.postfix && l.value >= s) ||
                ("x" === l.postfix && l.value >= o)
              ) {
                i = l;
                break;
              }
            }
            !i && n.length && (i = n[n.length - 1]),
              i &&
                ((e.src = i.url),
                e.width &&
                  e.height &&
                  "w" == i.postfix &&
                  ((e.height = (e.width / e.height) * i.value),
                  (e.width = i.value)),
                (e.opts.srcset = r));
          }
        },
        setBigImage: function (t) {
          var n = this,
            o = e.createElement("img"),
            s = i(o);
          (t.$image = s
            .one("error", function () {
              n.setError(t);
            })
            .one("load", function () {
              var e;
              t.$ghost ||
                (n.resolveImageSlideSize(
                  t,
                  this.naturalWidth,
                  this.naturalHeight
                ),
                n.afterLoad(t)),
                n.isClosing ||
                  (t.opts.srcset &&
                    (((e = t.opts.sizes) && "auto" !== e) ||
                      (e =
                        (t.width / t.height > 1 && r.width() / r.height() > 1
                          ? "100"
                          : Math.round((t.width / t.height) * 100)) + "vw"),
                    s.attr("sizes", e).attr("srcset", t.opts.srcset)),
                  t.$ghost &&
                    setTimeout(function () {
                      t.$ghost && !n.isClosing && t.$ghost.hide();
                    }, Math.min(300, Math.max(1e3, t.height / 1600))),
                  n.hideLoading(t));
            })
            .addClass("fancybox-image")
            .attr("src", t.src)
            .appendTo(t.$content)),
            (o.complete || "complete" == o.readyState) &&
            s.naturalWidth &&
            s.naturalHeight
              ? s.trigger("load")
              : o.error && s.trigger("error");
        },
        resolveImageSlideSize: function (t, e, i) {
          var n = parseInt(t.opts.width, 10),
            o = parseInt(t.opts.height, 10);
          (t.width = e),
            (t.height = i),
            n > 0 && ((t.width = n), (t.height = Math.floor((n * i) / e))),
            o > 0 && ((t.width = Math.floor((o * e) / i)), (t.height = o));
        },
        setIframe: function (t) {
          var e,
            n = this,
            o = t.opts.iframe,
            s = t.$slide;
          (t.$content = i(
            '<div class="fancybox-content' +
              (o.preload ? " fancybox-is-hidden" : "") +
              '"></div>'
          )
            .css(o.css)
            .appendTo(s)),
            s.addClass("fancybox-slide--" + t.contentType),
            (t.$iframe = e =
              i(o.tpl.replace(/\{rnd\}/g, new Date().getTime()))
                .attr(o.attr)
                .appendTo(t.$content)),
            o.preload
              ? (n.showLoading(t),
                e.on("load.fb error.fb", function (e) {
                  (this.isReady = 1),
                    t.$slide.trigger("refresh"),
                    n.afterLoad(t);
                }),
                s.on("refresh.fb", function () {
                  var i,
                    n = t.$content,
                    r = o.css.width,
                    a = o.css.height;
                  if (1 === e[0].isReady) {
                    try {
                      i = e.contents().find("body");
                    } catch (t) {}
                    i &&
                      i.length &&
                      i.children().length &&
                      (s.css("overflow", "visible"),
                      n.css({
                        width: "100%",
                        "max-width": "100%",
                        height: "9999px",
                      }),
                      void 0 === r &&
                        (r = Math.ceil(
                          Math.max(i[0].clientWidth, i.outerWidth(!0))
                        )),
                      n.css("width", r || "").css("max-width", ""),
                      void 0 === a &&
                        (a = Math.ceil(
                          Math.max(i[0].clientHeight, i.outerHeight(!0))
                        )),
                      n.css("height", a || ""),
                      s.css("overflow", "auto")),
                      n.removeClass("fancybox-is-hidden");
                  }
                }))
              : n.afterLoad(t),
            e.attr("src", t.src),
            s.one("onReset", function () {
              try {
                i(this)
                  .find("iframe")
                  .hide()
                  .unbind()
                  .attr("src", "//about:blank");
              } catch (t) {}
              i(this).off("refresh.fb").empty(),
                (t.isLoaded = !1),
                (t.isRevealed = !1);
            });
        },
        setContent: function (t, e) {
          var n = this;
          n.isClosing ||
            (n.hideLoading(t),
            t.$content && i.fancybox.stop(t.$content),
            t.$slide.empty(),
            (function (t) {
              return t && t.hasOwnProperty && t instanceof i;
            })(e) && e.parent().length
              ? ((e.hasClass("fancybox-content") ||
                  e.parent().hasClass("fancybox-content")) &&
                  e.parents(".fancybox-slide").trigger("onReset"),
                (t.$placeholder = i("<div>").hide().insertAfter(e)),
                e.css("display", "inline-block"))
              : t.hasError ||
                ("string" === i.type(e) &&
                  (e = i("<div>").append(i.trim(e)).contents()),
                t.opts.filter && (e = i("<div>").html(e).find(t.opts.filter))),
            t.$slide.one("onReset", function () {
              i(this).find("video,audio").trigger("pause"),
                t.$placeholder &&
                  (t.$placeholder
                    .after(e.removeClass("fancybox-content").hide())
                    .remove(),
                  (t.$placeholder = null)),
                t.$smallBtn && (t.$smallBtn.remove(), (t.$smallBtn = null)),
                t.hasError ||
                  (i(this).empty(), (t.isLoaded = !1), (t.isRevealed = !1));
            }),
            i(e).appendTo(t.$slide),
            i(e).is("video,audio") &&
              (i(e).addClass("fancybox-video"),
              i(e).wrap("<div></div>"),
              (t.contentType = "video"),
              (t.opts.width = t.opts.width || i(e).attr("width")),
              (t.opts.height = t.opts.height || i(e).attr("height"))),
            (t.$content = t.$slide
              .children()
              .filter("div,form,main,video,audio,article,.fancybox-content")
              .first()),
            t.$content.siblings().hide(),
            t.$content.length ||
              (t.$content = t.$slide
                .wrapInner("<div></div>")
                .children()
                .first()),
            t.$content.addClass("fancybox-content"),
            t.$slide.addClass("fancybox-slide--" + t.contentType),
            n.afterLoad(t));
        },
        setError: function (t) {
          (t.hasError = !0),
            t.$slide
              .trigger("onReset")
              .removeClass("fancybox-slide--" + t.contentType)
              .addClass("fancybox-slide--error"),
            (t.contentType = "html"),
            this.setContent(t, this.translate(t, t.opts.errorTpl)),
            t.pos === this.currPos && (this.isAnimating = !1);
        },
        showLoading: function (t) {
          var e = this;
          (t = t || e.current) &&
            !t.$spinner &&
            (t.$spinner = i(e.translate(e, e.opts.spinnerTpl))
              .appendTo(t.$slide)
              .hide()
              .fadeIn("fast"));
        },
        hideLoading: function (t) {
          (t = t || this.current) &&
            t.$spinner &&
            (t.$spinner.stop().remove(), delete t.$spinner);
        },
        afterLoad: function (t) {
          var e = this;
          e.isClosing ||
            ((t.isLoading = !1),
            (t.isLoaded = !0),
            e.trigger("afterLoad", t),
            e.hideLoading(t),
            !t.opts.smallBtn ||
              (t.$smallBtn && t.$smallBtn.length) ||
              (t.$smallBtn = i(e.translate(t, t.opts.btnTpl.smallBtn)).appendTo(
                t.$content
              )),
            t.opts.protect &&
              t.$content &&
              !t.hasError &&
              (t.$content.on("contextmenu.fb", function (t) {
                return 2 == t.button && t.preventDefault(), !0;
              }),
              "image" === t.type &&
                i('<div class="fancybox-spaceball"></div>').appendTo(
                  t.$content
                )),
            e.adjustCaption(t),
            e.adjustLayout(t),
            t.pos === e.currPos && e.updateCursor(),
            e.revealContent(t));
        },
        adjustCaption: function (t) {
          var e,
            i = this,
            n = t || i.current,
            o = n.opts.caption,
            s = n.opts.preventCaptionOverlap,
            r = i.$refs.caption,
            a = !1;
          r.toggleClass("fancybox-caption--separate", s),
            s &&
              o &&
              o.length &&
              (n.pos !== i.currPos
                ? ((e = r.clone().appendTo(r.parent()))
                    .children()
                    .eq(0)
                    .empty()
                    .html(o),
                  (a = e.outerHeight(!0)),
                  e.empty().remove())
                : i.$caption && (a = i.$caption.outerHeight(!0)),
              n.$slide.css("padding-bottom", a || ""));
        },
        adjustLayout: function (t) {
          var e,
            i,
            n,
            o,
            s = t || this.current;
          s.isLoaded &&
            !0 !== s.opts.disableLayoutFix &&
            (s.$content.css("margin-bottom", ""),
            s.$content.outerHeight() > s.$slide.height() + 0.5 &&
              ((n = s.$slide[0].style["padding-bottom"]),
              (o = s.$slide.css("padding-bottom")),
              parseFloat(o) > 0 &&
                ((e = s.$slide[0].scrollHeight),
                s.$slide.css("padding-bottom", 0),
                Math.abs(e - s.$slide[0].scrollHeight) < 1 && (i = o),
                s.$slide.css("padding-bottom", n))),
            s.$content.css("margin-bottom", i));
        },
        revealContent: function (t) {
          var e,
            n,
            o,
            s,
            r = this,
            a = t.$slide,
            l = !1,
            c = !1,
            u = r.isMoved(t),
            h = t.isRevealed;
          return (
            (t.isRevealed = !0),
            (e = t.opts[r.firstRun ? "animationEffect" : "transitionEffect"]),
            (o =
              t.opts[r.firstRun ? "animationDuration" : "transitionDuration"]),
            (o = parseInt(
              void 0 === t.forcedDuration ? o : t.forcedDuration,
              10
            )),
            (!u && t.pos === r.currPos && o) || (e = !1),
            "zoom" === e &&
              (t.pos === r.currPos &&
              o &&
              "image" === t.type &&
              !t.hasError &&
              (c = r.getThumbPos(t))
                ? (l = r.getFitPos(t))
                : (e = "fade")),
            "zoom" === e
              ? ((r.isAnimating = !0),
                (l.scaleX = l.width / c.width),
                (l.scaleY = l.height / c.height),
                "auto" == (s = t.opts.zoomOpacity) &&
                  (s = Math.abs(t.width / t.height - c.width / c.height) > 0.1),
                s && ((c.opacity = 0.1), (l.opacity = 1)),
                i.fancybox.setTranslate(
                  t.$content.removeClass("fancybox-is-hidden"),
                  c
                ),
                d(t.$content),
                void i.fancybox.animate(t.$content, l, o, function () {
                  (r.isAnimating = !1), r.complete();
                }))
              : (r.updateSlide(t),
                e
                  ? (i.fancybox.stop(a),
                    (n =
                      "fancybox-slide--" +
                      (t.pos >= r.prevPos ? "next" : "previous") +
                      " fancybox-animated fancybox-fx-" +
                      e),
                    a.addClass(n).removeClass("fancybox-slide--current"),
                    t.$content.removeClass("fancybox-is-hidden"),
                    d(a),
                    "image" !== t.type && t.$content.hide().show(0),
                    void i.fancybox.animate(
                      a,
                      "fancybox-slide--current",
                      o,
                      function () {
                        a.removeClass(n).css({ transform: "", opacity: "" }),
                          t.pos === r.currPos && r.complete();
                      },
                      !0
                    ))
                  : (t.$content.removeClass("fancybox-is-hidden"),
                    h ||
                      !u ||
                      "image" !== t.type ||
                      t.hasError ||
                      t.$content.hide().fadeIn("fast"),
                    void (t.pos === r.currPos && r.complete())))
          );
        },
        getThumbPos: function (t) {
          var e,
            n,
            o,
            s,
            r,
            a = !1,
            l = t.$thumb;
          return (
            !(!l || !f(l[0])) &&
            ((e = i.fancybox.getTranslate(l)),
            (n = parseFloat(l.css("border-top-width") || 0)),
            (o = parseFloat(l.css("border-right-width") || 0)),
            (s = parseFloat(l.css("border-bottom-width") || 0)),
            (r = parseFloat(l.css("border-left-width") || 0)),
            (a = {
              top: e.top + n,
              left: e.left + r,
              width: e.width - o - r,
              height: e.height - n - s,
              scaleX: 1,
              scaleY: 1,
            }),
            e.width > 0 && e.height > 0 && a)
          );
        },
        complete: function () {
          var t,
            e = this,
            n = e.current,
            o = {};
          !e.isMoved() &&
            n.isLoaded &&
            (n.isComplete ||
              ((n.isComplete = !0),
              n.$slide.siblings().trigger("onReset"),
              e.preload("inline"),
              d(n.$slide),
              n.$slide.addClass("fancybox-slide--complete"),
              i.each(e.slides, function (t, n) {
                n.pos >= e.currPos - 1 && n.pos <= e.currPos + 1
                  ? (o[n.pos] = n)
                  : n && (i.fancybox.stop(n.$slide), n.$slide.off().remove());
              }),
              (e.slides = o)),
            (e.isAnimating = !1),
            e.updateCursor(),
            e.trigger("afterShow"),
            n.opts.video.autoStart &&
              n.$slide
                .find("video,audio")
                .filter(":visible:first")
                .trigger("play")
                .one("ended", function () {
                  Document.exitFullscreen
                    ? Document.exitFullscreen()
                    : this.webkitExitFullscreen && this.webkitExitFullscreen(),
                    e.next();
                }),
            n.opts.autoFocus &&
              "html" === n.contentType &&
              ((t = n.$content.find("input[autofocus]:enabled:visible:first"))
                .length
                ? t.trigger("focus")
                : e.focus(null, !0)),
            n.$slide.scrollTop(0).scrollLeft(0));
        },
        preload: function (t) {
          var e,
            i,
            n = this;
          n.group.length < 2 ||
            ((i = n.slides[n.currPos + 1]),
            (e = n.slides[n.currPos - 1]) && e.type === t && n.loadSlide(e),
            i && i.type === t && n.loadSlide(i));
        },
        focus: function (t, n) {
          var o,
            s,
            r = this,
            a = [
              "a[href]",
              "area[href]",
              'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
              "select:not([disabled]):not([aria-hidden])",
              "textarea:not([disabled]):not([aria-hidden])",
              "button:not([disabled]):not([aria-hidden])",
              "iframe",
              "object",
              "embed",
              "video",
              "audio",
              "[contenteditable]",
              '[tabindex]:not([tabindex^="-"])',
            ].join(",");
          r.isClosing ||
            ((o = (o =
              !t && r.current && r.current.isComplete
                ? r.current.$slide.find(
                    "*:visible" + (n ? ":not(.fancybox-close-small)" : "")
                  )
                : r.$refs.container.find("*:visible"))
              .filter(a)
              .filter(function () {
                return (
                  "hidden" !== i(this).css("visibility") &&
                  !i(this).hasClass("disabled")
                );
              })).length
              ? ((s = o.index(e.activeElement)),
                t && t.shiftKey
                  ? (s < 0 || 0 == s) &&
                    (t.preventDefault(), o.eq(o.length - 1).trigger("focus"))
                  : (s < 0 || s == o.length - 1) &&
                    (t && t.preventDefault(), o.eq(0).trigger("focus")))
              : r.$refs.container.trigger("focus"));
        },
        activate: function () {
          var t = this;
          i(".fancybox-container").each(function () {
            var e = i(this).data("FancyBox");
            e &&
              e.id !== t.id &&
              !e.isClosing &&
              (e.trigger("onDeactivate"), e.removeEvents(), (e.isVisible = !1));
          }),
            (t.isVisible = !0),
            (t.current || t.isIdle) && (t.update(), t.updateControls()),
            t.trigger("onActivate"),
            t.addEvents();
        },
        close: function (t, e) {
          var n,
            o,
            s,
            r,
            a,
            l,
            u,
            h = this,
            p = h.current,
            f = function () {
              h.cleanUp(t);
            };
          return !(
            h.isClosing ||
            ((h.isClosing = !0),
            !1 === h.trigger("beforeClose", t)
              ? ((h.isClosing = !1),
                c(function () {
                  h.update();
                }),
                1)
              : (h.removeEvents(),
                (s = p.$content),
                (n = p.opts.animationEffect),
                (o = i.isNumeric(e) ? e : n ? p.opts.animationDuration : 0),
                p.$slide.removeClass(
                  "fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"
                ),
                !0 !== t ? i.fancybox.stop(p.$slide) : (n = !1),
                p.$slide.siblings().trigger("onReset").remove(),
                o &&
                  h.$refs.container
                    .removeClass("fancybox-is-open")
                    .addClass("fancybox-is-closing")
                    .css("transition-duration", o + "ms"),
                h.hideLoading(p),
                h.hideControls(!0),
                h.updateCursor(),
                "zoom" !== n ||
                  (s &&
                    o &&
                    "image" === p.type &&
                    !h.isMoved() &&
                    !p.hasError &&
                    (u = h.getThumbPos(p))) ||
                  (n = "fade"),
                "zoom" === n
                  ? (i.fancybox.stop(s),
                    (r = i.fancybox.getTranslate(s)),
                    (l = {
                      top: r.top,
                      left: r.left,
                      scaleX: r.width / u.width,
                      scaleY: r.height / u.height,
                      width: u.width,
                      height: u.height,
                    }),
                    (a = p.opts.zoomOpacity),
                    "auto" == a &&
                      (a =
                        Math.abs(p.width / p.height - u.width / u.height) >
                        0.1),
                    a && (u.opacity = 0),
                    i.fancybox.setTranslate(s, l),
                    d(s),
                    i.fancybox.animate(s, u, o, f),
                    0)
                  : (n && o
                      ? i.fancybox.animate(
                          p.$slide
                            .addClass("fancybox-slide--previous")
                            .removeClass("fancybox-slide--current"),
                          "fancybox-animated fancybox-fx-" + n,
                          o,
                          f
                        )
                      : !0 === t
                      ? setTimeout(f, o)
                      : f(),
                    0)))
          );
        },
        cleanUp: function (e) {
          var n,
            o,
            s,
            r = this,
            a = r.current.opts.$orig;
          r.current.$slide.trigger("onReset"),
            r.$refs.container.empty().remove(),
            r.trigger("afterClose", e),
            r.current.opts.backFocus &&
              ((a && a.length && a.is(":visible")) || (a = r.$trigger),
              a &&
                a.length &&
                ((o = t.scrollX),
                (s = t.scrollY),
                a.trigger("focus"),
                i("html, body").scrollTop(s).scrollLeft(o))),
            (r.current = null),
            (n = i.fancybox.getInstance())
              ? n.activate()
              : (i("body").removeClass(
                  "fancybox-active compensate-for-scrollbar"
                ),
                i("#fancybox-style-noscroll").remove());
        },
        trigger: function (t, e) {
          var n,
            o = Array.prototype.slice.call(arguments, 1),
            s = this,
            r = e && e.opts ? e : s.current;
          if (
            (r ? o.unshift(r) : (r = s),
            o.unshift(s),
            i.isFunction(r.opts[t]) && (n = r.opts[t].apply(r, o)),
            !1 === n)
          )
            return n;
          "afterClose" !== t && s.$refs
            ? s.$refs.container.trigger(t + ".fb", o)
            : a.trigger(t + ".fb", o);
        },
        updateControls: function () {
          var t = this,
            n = t.current,
            o = n.index,
            s = t.$refs.container,
            r = t.$refs.caption,
            a = n.opts.caption;
          n.$slide.trigger("refresh"),
            a && a.length
              ? ((t.$caption = r), r.children().eq(0).html(a))
              : (t.$caption = null),
            t.hasHiddenControls || t.isIdle || t.showControls(),
            s.find("[data-fancybox-count]").html(t.group.length),
            s.find("[data-fancybox-index]").html(o + 1),
            s
              .find("[data-fancybox-prev]")
              .prop("disabled", !n.opts.loop && o <= 0),
            s
              .find("[data-fancybox-next]")
              .prop("disabled", !n.opts.loop && o >= t.group.length - 1),
            "image" === n.type
              ? s
                  .find("[data-fancybox-zoom]")
                  .show()
                  .end()
                  .find("[data-fancybox-download]")
                  .attr("href", n.opts.image.src || n.src)
                  .show()
              : n.opts.toolbar &&
                s.find("[data-fancybox-download],[data-fancybox-zoom]").hide(),
            i(e.activeElement).is(":hidden,[disabled]") &&
              t.$refs.container.trigger("focus");
        },
        hideControls: function (t) {
          var e = ["infobar", "toolbar", "nav"];
          (!t && this.current.opts.preventCaptionOverlap) || e.push("caption"),
            this.$refs.container.removeClass(
              e
                .map(function (t) {
                  return "fancybox-show-" + t;
                })
                .join(" ")
            ),
            (this.hasHiddenControls = !0);
        },
        showControls: function () {
          var t = this,
            e = t.current ? t.current.opts : t.opts,
            i = t.$refs.container;
          (t.hasHiddenControls = !1),
            (t.idleSecondsCounter = 0),
            i
              .toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons))
              .toggleClass(
                "fancybox-show-infobar",
                !!(e.infobar && t.group.length > 1)
              )
              .toggleClass("fancybox-show-caption", !!t.$caption)
              .toggleClass(
                "fancybox-show-nav",
                !!(e.arrows && t.group.length > 1)
              )
              .toggleClass("fancybox-is-modal", !!e.modal);
        },
        toggleControls: function () {
          this.hasHiddenControls ? this.showControls() : this.hideControls();
        },
      }),
        (i.fancybox = {
          version: "3.5.7",
          defaults: s,
          getInstance: function (t) {
            var e = i(
                '.fancybox-container:not(".fancybox-is-closing"):last'
              ).data("FancyBox"),
              n = Array.prototype.slice.call(arguments, 1);
            return (
              e instanceof m &&
              ("string" === i.type(t)
                ? e[t].apply(e, n)
                : "function" === i.type(t) && t.apply(e, n),
              e)
            );
          },
          open: function (t, e, i) {
            return new m(t, e, i);
          },
          close: function (t) {
            var e = this.getInstance();
            e && (e.close(), !0 === t && this.close(t));
          },
          destroy: function () {
            this.close(!0), a.add("body").off("click.fb-start", "**");
          },
          isMobile:
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ),
          use3d: (function () {
            var i = e.createElement("div");
            return (
              t.getComputedStyle &&
              t.getComputedStyle(i) &&
              t.getComputedStyle(i).getPropertyValue("transform") &&
              !(e.documentMode && e.documentMode < 11)
            );
          })(),
          getTranslate: function (t) {
            var e;
            return (
              !(!t || !t.length) && {
                top: (e = t[0].getBoundingClientRect()).top || 0,
                left: e.left || 0,
                width: e.width,
                height: e.height,
                opacity: parseFloat(t.css("opacity")),
              }
            );
          },
          setTranslate: function (t, e) {
            var i = "",
              n = {};
            if (t && e)
              return (
                (void 0 === e.left && void 0 === e.top) ||
                  ((i =
                    (void 0 === e.left ? t.position().left : e.left) +
                    "px, " +
                    (void 0 === e.top ? t.position().top : e.top) +
                    "px"),
                  (i = this.use3d
                    ? "translate3d(" + i + ", 0px)"
                    : "translate(" + i + ")")),
                void 0 !== e.scaleX && void 0 !== e.scaleY
                  ? (i += " scale(" + e.scaleX + ", " + e.scaleY + ")")
                  : void 0 !== e.scaleX && (i += " scaleX(" + e.scaleX + ")"),
                i.length && (n.transform = i),
                void 0 !== e.opacity && (n.opacity = e.opacity),
                void 0 !== e.width && (n.width = e.width),
                void 0 !== e.height && (n.height = e.height),
                t.css(n)
              );
          },
          animate: function (t, e, n, o, s) {
            var r,
              a = this;
            i.isFunction(n) && ((o = n), (n = null)),
              a.stop(t),
              (r = a.getTranslate(t)),
              t.on(h, function (l) {
                (!l ||
                  !l.originalEvent ||
                  (t.is(l.originalEvent.target) &&
                    "z-index" != l.originalEvent.propertyName)) &&
                  (a.stop(t),
                  i.isNumeric(n) && t.css("transition-duration", ""),
                  i.isPlainObject(e)
                    ? void 0 !== e.scaleX &&
                      void 0 !== e.scaleY &&
                      a.setTranslate(t, {
                        top: e.top,
                        left: e.left,
                        width: r.width * e.scaleX,
                        height: r.height * e.scaleY,
                        scaleX: 1,
                        scaleY: 1,
                      })
                    : !0 !== s && t.removeClass(e),
                  i.isFunction(o) && o(l));
              }),
              i.isNumeric(n) && t.css("transition-duration", n + "ms"),
              i.isPlainObject(e)
                ? (void 0 !== e.scaleX &&
                    void 0 !== e.scaleY &&
                    (delete e.width,
                    delete e.height,
                    t.parent().hasClass("fancybox-slide--image") &&
                      t.parent().addClass("fancybox-is-scaling")),
                  i.fancybox.setTranslate(t, e))
                : t.addClass(e),
              t.data(
                "timer",
                setTimeout(function () {
                  t.trigger(h);
                }, n + 33)
              );
          },
          stop: function (t, e) {
            t &&
              t.length &&
              (clearTimeout(t.data("timer")),
              e && t.trigger(h),
              t.off(h).css("transition-duration", ""),
              t.parent().removeClass("fancybox-is-scaling"));
          },
        }),
        (i.fn.fancybox = function (t) {
          var e;
          return (
            (e = (t = t || {}).selector || !1)
              ? i("body")
                  .off("click.fb-start", e)
                  .on("click.fb-start", e, { options: t }, o)
              : this.off("click.fb-start").on(
                  "click.fb-start",
                  { items: this, options: t },
                  o
                ),
            this
          );
        }),
        a.on("click.fb-start", "[data-fancybox]", o),
        a.on("click.fb-start", "[data-fancybox-trigger]", function (t) {
          i('[data-fancybox="' + i(this).attr("data-fancybox-trigger") + '"]')
            .eq(i(this).attr("data-fancybox-index") || 0)
            .trigger("click.fb-start", { $trigger: i(this) });
        }),
        (function () {
          var t = null;
          a.on(
            "mousedown mouseup focus blur",
            ".fancybox-button",
            function (e) {
              switch (e.type) {
                case "mousedown":
                  t = i(this);
                  break;
                case "mouseup":
                  t = null;
                  break;
                case "focusin":
                  i(".fancybox-button").removeClass("fancybox-focus"),
                    i(this).is(t) ||
                      i(this).is("[disabled]") ||
                      i(this).addClass("fancybox-focus");
                  break;
                case "focusout":
                  i(".fancybox-button").removeClass("fancybox-focus");
              }
            }
          );
        })();
    }
  })(window, document, jQuery),
  (function (t) {
    "use strict";
    var e = {
        youtube: {
          matcher:
            /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
          params: {
            autoplay: 1,
            autohide: 1,
            fs: 1,
            rel: 0,
            hd: 1,
            wmode: "transparent",
            enablejsapi: 1,
            html5: 1,
          },
          paramPlace: 8,
          type: "iframe",
          url: "https://www.youtube-nocookie.com/embed/$4",
          thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg",
        },
        vimeo: {
          matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
          params: {
            autoplay: 1,
            hd: 1,
            show_title: 1,
            show_byline: 1,
            show_portrait: 0,
            fullscreen: 1,
          },
          paramPlace: 3,
          type: "iframe",
          url: "//player.vimeo.com/video/$2",
        },
        instagram: {
          matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
          type: "image",
          url: "//$1/p/$2/media/?size=l",
        },
        gmap_place: {
          matcher:
            /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
          type: "iframe",
          url: function (t) {
            return (
              "//maps.google." +
              t[2] +
              "/?ll=" +
              (t[9]
                ? t[9] +
                  "&z=" +
                  Math.floor(t[10]) +
                  (t[12] ? t[12].replace(/^\//, "&") : "")
                : t[12] + ""
              ).replace(/\?/, "&") +
              "&output=" +
              (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
            );
          },
        },
        gmap_search: {
          matcher:
            /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
          type: "iframe",
          url: function (t) {
            return (
              "//maps.google." +
              t[2] +
              "/maps?q=" +
              t[5].replace("query=", "q=").replace("api=1", "") +
              "&output=embed"
            );
          },
        },
      },
      i = function (e, i, n) {
        if (e)
          return (
            (n = n || ""),
            "object" === t.type(n) && (n = t.param(n, !0)),
            t.each(i, function (t, i) {
              e = e.replace("$" + t, i || "");
            }),
            n.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + n),
            e
          );
      };
    t(document).on("objectNeedsType.fb", function (n, o, s) {
      var r,
        a,
        l,
        c,
        u,
        h,
        d,
        p = s.src || "",
        f = !1;
      (r = t.extend(!0, {}, e, s.opts.media)),
        t.each(r, function (e, n) {
          if ((l = p.match(n.matcher))) {
            if (
              ((f = n.type), (d = e), (h = {}), n.paramPlace && l[n.paramPlace])
            ) {
              "?" == (u = l[n.paramPlace])[0] && (u = u.substring(1)),
                (u = u.split("&"));
              for (var o = 0; o < u.length; ++o) {
                var r = u[o].split("=", 2);
                2 == r.length &&
                  (h[r[0]] = decodeURIComponent(r[1].replace(/\+/g, " ")));
              }
            }
            return (
              (c = t.extend(!0, {}, n.params, s.opts[e], h)),
              (p =
                "function" === t.type(n.url)
                  ? n.url.call(this, l, c, s)
                  : i(n.url, l, c)),
              (a =
                "function" === t.type(n.thumb)
                  ? n.thumb.call(this, l, c, s)
                  : i(n.thumb, l)),
              "youtube" === e
                ? (p = p.replace(/&t=((\d+)m)?(\d+)s/, function (t, e, i, n) {
                    return (
                      "&start=" +
                      ((i ? 60 * parseInt(i, 10) : 0) + parseInt(n, 10))
                    );
                  }))
                : "vimeo" === e && (p = p.replace("&%23", "#")),
              !1
            );
          }
        }),
        f
          ? (s.opts.thumb ||
              (s.opts.$thumb && s.opts.$thumb.length) ||
              (s.opts.thumb = a),
            "iframe" === f &&
              (s.opts = t.extend(!0, s.opts, {
                iframe: { preload: !1, attr: { scrolling: "no" } },
              })),
            t.extend(s, {
              type: f,
              src: p,
              origSrc: s.src,
              contentSource: d,
              contentType:
                "image" === f
                  ? "image"
                  : "gmap_place" == d || "gmap_search" == d
                  ? "map"
                  : "video",
            }))
          : p && (s.type = s.opts.defaultType);
    });
    var n = {
      youtube: {
        src: "https://www.youtube.com/iframe_api",
        class: "YT",
        loading: !1,
        loaded: !1,
      },
      vimeo: {
        src: "https://player.vimeo.com/api/player.js",
        class: "Vimeo",
        loading: !1,
        loaded: !1,
      },
      load: function (t) {
        var e,
          i = this;
        this[t].loaded
          ? setTimeout(function () {
              i.done(t);
            })
          : this[t].loading ||
            ((this[t].loading = !0),
            ((e = document.createElement("script")).type = "text/javascript"),
            (e.src = this[t].src),
            "youtube" === t
              ? (window.onYouTubeIframeAPIReady = function () {
                  (i[t].loaded = !0), i.done(t);
                })
              : (e.onload = function () {
                  (i[t].loaded = !0), i.done(t);
                }),
            document.body.appendChild(e));
      },
      done: function (e) {
        var i, n;
        "youtube" === e && delete window.onYouTubeIframeAPIReady,
          (i = t.fancybox.getInstance()) &&
            ((n = i.current.$content.find("iframe")),
            "youtube" === e && void 0 !== YT && YT
              ? new YT.Player(n.attr("id"), {
                  events: {
                    onStateChange: function (t) {
                      0 == t.data && i.next();
                    },
                  },
                })
              : "vimeo" === e &&
                void 0 !== Vimeo &&
                Vimeo &&
                new Vimeo.Player(n).on("ended", function () {
                  i.next();
                }));
      },
    };
    t(document).on({
      "afterShow.fb": function (t, e, i) {
        e.group.length > 1 &&
          ("youtube" === i.contentSource || "vimeo" === i.contentSource) &&
          n.load(i.contentSource);
      },
    });
  })(jQuery),
  (function (t, e, i) {
    "use strict";
    var n =
        t.requestAnimationFrame ||
        t.webkitRequestAnimationFrame ||
        t.mozRequestAnimationFrame ||
        t.oRequestAnimationFrame ||
        function (e) {
          return t.setTimeout(e, 1e3 / 60);
        },
      o =
        t.cancelAnimationFrame ||
        t.webkitCancelAnimationFrame ||
        t.mozCancelAnimationFrame ||
        t.oCancelAnimationFrame ||
        function (e) {
          t.clearTimeout(e);
        },
      s = function (e) {
        var i = [];
        for (var n in (e =
          (e = e.originalEvent || e || t.e).touches && e.touches.length
            ? e.touches
            : e.changedTouches && e.changedTouches.length
            ? e.changedTouches
            : [e]))
          e[n].pageX
            ? i.push({ x: e[n].pageX, y: e[n].pageY })
            : e[n].clientX && i.push({ x: e[n].clientX, y: e[n].clientY });
        return i;
      },
      r = function (t, e, i) {
        return e && t
          ? "x" === i
            ? t.x - e.x
            : "y" === i
            ? t.y - e.y
            : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
          : 0;
      },
      a = function (t) {
        if (
          t.is(
            'a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe'
          ) ||
          i.isFunction(t.get(0).onclick) ||
          t.data("selectable")
        )
          return !0;
        for (var e = 0, n = t[0].attributes, o = n.length; e < o; e++)
          if ("data-fancybox-" === n[e].nodeName.substr(0, 14)) return !0;
        return !1;
      },
      l = function (e) {
        var i = t.getComputedStyle(e)["overflow-y"],
          n = t.getComputedStyle(e)["overflow-x"],
          o =
            ("scroll" === i || "auto" === i) && e.scrollHeight > e.clientHeight,
          s = ("scroll" === n || "auto" === n) && e.scrollWidth > e.clientWidth;
        return o || s;
      },
      c = function (t) {
        for (
          var e = !1;
          !(e = l(t.get(0))) &&
          (t = t.parent()).length &&
          !t.hasClass("fancybox-stage") &&
          !t.is("body");

        );
        return e;
      },
      u = function (t) {
        var e = this;
        (e.instance = t),
          (e.$bg = t.$refs.bg),
          (e.$stage = t.$refs.stage),
          (e.$container = t.$refs.container),
          e.destroy(),
          e.$container.on(
            "touchstart.fb.touch mousedown.fb.touch",
            i.proxy(e, "ontouchstart")
          );
      };
    (u.prototype.destroy = function () {
      var t = this;
      t.$container.off(".fb.touch"),
        i(e).off(".fb.touch"),
        t.requestId && (o(t.requestId), (t.requestId = null)),
        t.tapped && (clearTimeout(t.tapped), (t.tapped = null));
    }),
      (u.prototype.ontouchstart = function (n) {
        var o = this,
          l = i(n.target),
          u = o.instance,
          h = u.current,
          d = h.$slide,
          p = h.$content,
          f = "touchstart" == n.type;
        if (
          (f && o.$container.off("mousedown.fb.touch"),
          (!n.originalEvent || 2 != n.originalEvent.button) &&
            d.length &&
            l.length &&
            !a(l) &&
            !a(l.parent()) &&
            (l.is("img") ||
              !(n.originalEvent.clientX > l[0].clientWidth + l.offset().left)))
        ) {
          if (!h || u.isAnimating || h.$slide.hasClass("fancybox-animated"))
            return n.stopPropagation(), void n.preventDefault();
          (o.realPoints = o.startPoints = s(n)),
            o.startPoints.length &&
              (h.touch && n.stopPropagation(),
              (o.startEvent = n),
              (o.canTap = !0),
              (o.$target = l),
              (o.$content = p),
              (o.opts = h.opts.touch),
              (o.isPanning = !1),
              (o.isSwiping = !1),
              (o.isZooming = !1),
              (o.isScrolling = !1),
              (o.canPan = u.canPan()),
              (o.startTime = new Date().getTime()),
              (o.distanceX = o.distanceY = o.distance = 0),
              (o.canvasWidth = Math.round(d[0].clientWidth)),
              (o.canvasHeight = Math.round(d[0].clientHeight)),
              (o.contentLastPos = null),
              (o.contentStartPos = i.fancybox.getTranslate(o.$content) || {
                top: 0,
                left: 0,
              }),
              (o.sliderStartPos = i.fancybox.getTranslate(d)),
              (o.stagePos = i.fancybox.getTranslate(u.$refs.stage)),
              (o.sliderStartPos.top -= o.stagePos.top),
              (o.sliderStartPos.left -= o.stagePos.left),
              (o.contentStartPos.top -= o.stagePos.top),
              (o.contentStartPos.left -= o.stagePos.left),
              i(e)
                .off(".fb.touch")
                .on(
                  f
                    ? "touchend.fb.touch touchcancel.fb.touch"
                    : "mouseup.fb.touch mouseleave.fb.touch",
                  i.proxy(o, "ontouchend")
                )
                .on(
                  f ? "touchmove.fb.touch" : "mousemove.fb.touch",
                  i.proxy(o, "ontouchmove")
                ),
              i.fancybox.isMobile &&
                e.addEventListener("scroll", o.onscroll, !0),
              (((o.opts || o.canPan) &&
                (l.is(o.$stage) || o.$stage.find(l).length)) ||
                (l.is(".fancybox-image") && n.preventDefault(),
                i.fancybox.isMobile &&
                  l.parents(".fancybox-caption").length)) &&
                ((o.isScrollable = c(l) || c(l.parent())),
                (i.fancybox.isMobile && o.isScrollable) || n.preventDefault(),
                (1 === o.startPoints.length || h.hasError) &&
                  (o.canPan
                    ? (i.fancybox.stop(o.$content), (o.isPanning = !0))
                    : (o.isSwiping = !0),
                  o.$container.addClass("fancybox-is-grabbing")),
                2 === o.startPoints.length &&
                  "image" === h.type &&
                  (h.isLoaded || h.$ghost) &&
                  ((o.canTap = !1),
                  (o.isSwiping = !1),
                  (o.isPanning = !1),
                  (o.isZooming = !0),
                  i.fancybox.stop(o.$content),
                  (o.centerPointStartX =
                    0.5 * (o.startPoints[0].x + o.startPoints[1].x) -
                    i(t).scrollLeft()),
                  (o.centerPointStartY =
                    0.5 * (o.startPoints[0].y + o.startPoints[1].y) -
                    i(t).scrollTop()),
                  (o.percentageOfImageAtPinchPointX =
                    (o.centerPointStartX - o.contentStartPos.left) /
                    o.contentStartPos.width),
                  (o.percentageOfImageAtPinchPointY =
                    (o.centerPointStartY - o.contentStartPos.top) /
                    o.contentStartPos.height),
                  (o.startDistanceBetweenFingers = r(
                    o.startPoints[0],
                    o.startPoints[1]
                  )))));
        }
      }),
      (u.prototype.onscroll = function (t) {
        (this.isScrolling = !0),
          e.removeEventListener("scroll", this.onscroll, !0);
      }),
      (u.prototype.ontouchmove = function (t) {
        var e = this;
        return void 0 !== t.originalEvent.buttons &&
          0 === t.originalEvent.buttons
          ? void e.ontouchend(t)
          : e.isScrolling
          ? void (e.canTap = !1)
          : ((e.newPoints = s(t)),
            void (
              (e.opts || e.canPan) &&
              e.newPoints.length &&
              e.newPoints.length &&
              ((e.isSwiping && !0 === e.isSwiping) || t.preventDefault(),
              (e.distanceX = r(e.newPoints[0], e.startPoints[0], "x")),
              (e.distanceY = r(e.newPoints[0], e.startPoints[0], "y")),
              (e.distance = r(e.newPoints[0], e.startPoints[0])),
              e.distance > 0 &&
                (e.isSwiping
                  ? e.onSwipe(t)
                  : e.isPanning
                  ? e.onPan()
                  : e.isZooming && e.onZoom()))
            ));
      }),
      (u.prototype.onSwipe = function (e) {
        var s,
          r = this,
          a = r.instance,
          l = r.isSwiping,
          c = r.sliderStartPos.left || 0;
        if (!0 !== l)
          "x" == l &&
            (r.distanceX > 0 &&
            (r.instance.group.length < 2 ||
              (0 === r.instance.current.index && !r.instance.current.opts.loop))
              ? (c += Math.pow(r.distanceX, 0.8))
              : r.distanceX < 0 &&
                (r.instance.group.length < 2 ||
                  (r.instance.current.index === r.instance.group.length - 1 &&
                    !r.instance.current.opts.loop))
              ? (c -= Math.pow(-r.distanceX, 0.8))
              : (c += r.distanceX)),
            (r.sliderLastPos = {
              top: "x" == l ? 0 : r.sliderStartPos.top + r.distanceY,
              left: c,
            }),
            r.requestId && (o(r.requestId), (r.requestId = null)),
            (r.requestId = n(function () {
              r.sliderLastPos &&
                (i.each(r.instance.slides, function (t, e) {
                  var n = e.pos - r.instance.currPos;
                  i.fancybox.setTranslate(e.$slide, {
                    top: r.sliderLastPos.top,
                    left:
                      r.sliderLastPos.left +
                      n * r.canvasWidth +
                      n * e.opts.gutter,
                  });
                }),
                r.$container.addClass("fancybox-is-sliding"));
            }));
        else if (Math.abs(r.distance) > 10) {
          if (
            ((r.canTap = !1),
            a.group.length < 2 && r.opts.vertical
              ? (r.isSwiping = "y")
              : a.isDragging ||
                !1 === r.opts.vertical ||
                ("auto" === r.opts.vertical && i(t).width() > 800)
              ? (r.isSwiping = "x")
              : ((s = Math.abs(
                  (180 * Math.atan2(r.distanceY, r.distanceX)) / Math.PI
                )),
                (r.isSwiping = s > 45 && s < 135 ? "y" : "x")),
            "y" === r.isSwiping && i.fancybox.isMobile && r.isScrollable)
          )
            return void (r.isScrolling = !0);
          (a.isDragging = r.isSwiping),
            (r.startPoints = r.newPoints),
            i.each(a.slides, function (t, e) {
              var n, o;
              i.fancybox.stop(e.$slide),
                (n = i.fancybox.getTranslate(e.$slide)),
                (o = i.fancybox.getTranslate(a.$refs.stage)),
                e.$slide
                  .css({
                    transform: "",
                    opacity: "",
                    "transition-duration": "",
                  })
                  .removeClass("fancybox-animated")
                  .removeClass(function (t, e) {
                    return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
                  }),
                e.pos === a.current.pos &&
                  ((r.sliderStartPos.top = n.top - o.top),
                  (r.sliderStartPos.left = n.left - o.left)),
                i.fancybox.setTranslate(e.$slide, {
                  top: n.top - o.top,
                  left: n.left - o.left,
                });
            }),
            a.SlideShow && a.SlideShow.isActive && a.SlideShow.stop();
        }
      }),
      (u.prototype.onPan = function () {
        var t = this;
        r(t.newPoints[0], t.realPoints[0]) < (i.fancybox.isMobile ? 10 : 5)
          ? (t.startPoints = t.newPoints)
          : ((t.canTap = !1),
            (t.contentLastPos = t.limitMovement()),
            t.requestId && o(t.requestId),
            (t.requestId = n(function () {
              i.fancybox.setTranslate(t.$content, t.contentLastPos);
            })));
      }),
      (u.prototype.limitMovement = function () {
        var t,
          e,
          i,
          n,
          o,
          s,
          r = this,
          a = r.canvasWidth,
          l = r.canvasHeight,
          c = r.distanceX,
          u = r.distanceY,
          h = r.contentStartPos,
          d = h.left,
          p = h.top,
          f = h.width,
          m = h.height;
        return (
          (o = f > a ? d + c : d),
          (s = p + u),
          (t = Math.max(0, 0.5 * a - 0.5 * f)),
          (e = Math.max(0, 0.5 * l - 0.5 * m)),
          (i = Math.min(a - f, 0.5 * a - 0.5 * f)),
          (n = Math.min(l - m, 0.5 * l - 0.5 * m)),
          c > 0 && o > t && (o = t - 1 + Math.pow(-t + d + c, 0.8) || 0),
          c < 0 && o < i && (o = i + 1 - Math.pow(i - d - c, 0.8) || 0),
          u > 0 && s > e && (s = e - 1 + Math.pow(-e + p + u, 0.8) || 0),
          u < 0 && s < n && (s = n + 1 - Math.pow(n - p - u, 0.8) || 0),
          { top: s, left: o }
        );
      }),
      (u.prototype.limitPosition = function (t, e, i, n) {
        var o = this.canvasWidth,
          s = this.canvasHeight;
        return (
          i > o
            ? (t = (t = t > 0 ? 0 : t) < o - i ? o - i : t)
            : (t = Math.max(0, o / 2 - i / 2)),
          n > s
            ? (e = (e = e > 0 ? 0 : e) < s - n ? s - n : e)
            : (e = Math.max(0, s / 2 - n / 2)),
          { top: e, left: t }
        );
      }),
      (u.prototype.onZoom = function () {
        var e = this,
          s = e.contentStartPos,
          a = s.width,
          l = s.height,
          c = s.left,
          u = s.top,
          h = r(e.newPoints[0], e.newPoints[1]) / e.startDistanceBetweenFingers,
          d = Math.floor(a * h),
          p = Math.floor(l * h),
          f = (a - d) * e.percentageOfImageAtPinchPointX,
          m = (l - p) * e.percentageOfImageAtPinchPointY,
          g = (e.newPoints[0].x + e.newPoints[1].x) / 2 - i(t).scrollLeft(),
          v = (e.newPoints[0].y + e.newPoints[1].y) / 2 - i(t).scrollTop(),
          y = g - e.centerPointStartX,
          _ = {
            top: u + (m + (v - e.centerPointStartY)),
            left: c + (f + y),
            scaleX: h,
            scaleY: h,
          };
        (e.canTap = !1),
          (e.newWidth = d),
          (e.newHeight = p),
          (e.contentLastPos = _),
          e.requestId && o(e.requestId),
          (e.requestId = n(function () {
            i.fancybox.setTranslate(e.$content, e.contentLastPos);
          }));
      }),
      (u.prototype.ontouchend = function (t) {
        var n = this,
          r = n.isSwiping,
          a = n.isPanning,
          l = n.isZooming,
          c = n.isScrolling;
        if (
          ((n.endPoints = s(t)),
          (n.dMs = Math.max(new Date().getTime() - n.startTime, 1)),
          n.$container.removeClass("fancybox-is-grabbing"),
          i(e).off(".fb.touch"),
          e.removeEventListener("scroll", n.onscroll, !0),
          n.requestId && (o(n.requestId), (n.requestId = null)),
          (n.isSwiping = !1),
          (n.isPanning = !1),
          (n.isZooming = !1),
          (n.isScrolling = !1),
          (n.instance.isDragging = !1),
          n.canTap)
        )
          return n.onTap(t);
        (n.speed = 100),
          (n.velocityX = (n.distanceX / n.dMs) * 0.5),
          (n.velocityY = (n.distanceY / n.dMs) * 0.5),
          a ? n.endPanning() : l ? n.endZooming() : n.endSwiping(r, c);
      }),
      (u.prototype.endSwiping = function (t, e) {
        var n = this,
          o = !1,
          s = n.instance.group.length,
          r = Math.abs(n.distanceX),
          a = "x" == t && s > 1 && ((n.dMs > 130 && r > 10) || r > 50);
        (n.sliderLastPos = null),
          "y" == t && !e && Math.abs(n.distanceY) > 50
            ? (i.fancybox.animate(
                n.instance.current.$slide,
                {
                  top: n.sliderStartPos.top + n.distanceY + 150 * n.velocityY,
                  opacity: 0,
                },
                200
              ),
              (o = n.instance.close(!0, 250)))
            : a && n.distanceX > 0
            ? (o = n.instance.previous(300))
            : a && n.distanceX < 0 && (o = n.instance.next(300)),
          !1 !== o || ("x" != t && "y" != t) || n.instance.centerSlide(200),
          n.$container.removeClass("fancybox-is-sliding");
      }),
      (u.prototype.endPanning = function () {
        var t,
          e,
          n,
          o = this;
        o.contentLastPos &&
          (!1 === o.opts.momentum || o.dMs > 350
            ? ((t = o.contentLastPos.left), (e = o.contentLastPos.top))
            : ((t = o.contentLastPos.left + 500 * o.velocityX),
              (e = o.contentLastPos.top + 500 * o.velocityY)),
          ((n = o.limitPosition(
            t,
            e,
            o.contentStartPos.width,
            o.contentStartPos.height
          )).width = o.contentStartPos.width),
          (n.height = o.contentStartPos.height),
          i.fancybox.animate(o.$content, n, 366));
      }),
      (u.prototype.endZooming = function () {
        var t,
          e,
          n,
          o,
          s = this,
          r = s.instance.current,
          a = s.newWidth,
          l = s.newHeight;
        s.contentLastPos &&
          ((t = s.contentLastPos.left),
          (o = {
            top: (e = s.contentLastPos.top),
            left: t,
            width: a,
            height: l,
            scaleX: 1,
            scaleY: 1,
          }),
          i.fancybox.setTranslate(s.$content, o),
          a < s.canvasWidth && l < s.canvasHeight
            ? s.instance.scaleToFit(150)
            : a > r.width || l > r.height
            ? s.instance.scaleToActual(
                s.centerPointStartX,
                s.centerPointStartY,
                150
              )
            : ((n = s.limitPosition(t, e, a, l)),
              i.fancybox.animate(s.$content, n, 150)));
      }),
      (u.prototype.onTap = function (e) {
        var n,
          o = this,
          r = i(e.target),
          a = o.instance,
          l = a.current,
          c = (e && s(e)) || o.startPoints,
          u = c[0] ? c[0].x - i(t).scrollLeft() - o.stagePos.left : 0,
          h = c[0] ? c[0].y - i(t).scrollTop() - o.stagePos.top : 0,
          d = function (t) {
            var n = l.opts[t];
            if ((i.isFunction(n) && (n = n.apply(a, [l, e])), n))
              switch (n) {
                case "close":
                  a.close(o.startEvent);
                  break;
                case "toggleControls":
                  a.toggleControls();
                  break;
                case "next":
                  a.next();
                  break;
                case "nextOrClose":
                  a.group.length > 1 ? a.next() : a.close(o.startEvent);
                  break;
                case "zoom":
                  "image" == l.type &&
                    (l.isLoaded || l.$ghost) &&
                    (a.canPan()
                      ? a.scaleToFit()
                      : a.isScaledDown()
                      ? a.scaleToActual(u, h)
                      : a.group.length < 2 && a.close(o.startEvent));
              }
          };
        if (
          (!e.originalEvent || 2 != e.originalEvent.button) &&
          (r.is("img") || !(u > r[0].clientWidth + r.offset().left))
        ) {
          if (
            r.is(
              ".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"
            )
          )
            n = "Outside";
          else if (r.is(".fancybox-slide")) n = "Slide";
          else {
            if (
              !a.current.$content ||
              !a.current.$content.find(r).addBack().filter(r).length
            )
              return;
            n = "Content";
          }
          if (o.tapped) {
            if (
              (clearTimeout(o.tapped),
              (o.tapped = null),
              Math.abs(u - o.tapX) > 50 || Math.abs(h - o.tapY) > 50)
            )
              return this;
            d("dblclick" + n);
          } else
            (o.tapX = u),
              (o.tapY = h),
              l.opts["dblclick" + n] &&
              l.opts["dblclick" + n] !== l.opts["click" + n]
                ? (o.tapped = setTimeout(function () {
                    (o.tapped = null), a.isAnimating || d("click" + n);
                  }, 500))
                : d("click" + n);
          return this;
        }
      }),
      i(e)
        .on("onActivate.fb", function (t, e) {
          e && !e.Guestures && (e.Guestures = new u(e));
        })
        .on("beforeClose.fb", function (t, e) {
          e && e.Guestures && e.Guestures.destroy();
        });
  })(window, document, jQuery),
  (function (t, e) {
    "use strict";
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        slideShow:
          '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>',
      },
      slideShow: { autoStart: !1, speed: 3e3, progress: !0 },
    });
    var i = function (t) {
      (this.instance = t), this.init();
    };
    e.extend(i.prototype, {
      timer: null,
      isActive: !1,
      $button: null,
      init: function () {
        var t = this,
          i = t.instance,
          n = i.group[i.currIndex].opts.slideShow;
        (t.$button = i.$refs.toolbar
          .find("[data-fancybox-play]")
          .on("click", function () {
            t.toggle();
          })),
          i.group.length < 2 || !n
            ? t.$button.hide()
            : n.progress &&
              (t.$progress = e(
                '<div class="fancybox-progress"></div>'
              ).appendTo(i.$refs.inner));
      },
      set: function (t) {
        var i = this,
          n = i.instance,
          o = n.current;
        o && (!0 === t || o.opts.loop || n.currIndex < n.group.length - 1)
          ? i.isActive &&
            "video" !== o.contentType &&
            (i.$progress &&
              e.fancybox.animate(
                i.$progress.show(),
                { scaleX: 1 },
                o.opts.slideShow.speed
              ),
            (i.timer = setTimeout(function () {
              n.current.opts.loop || n.current.index != n.group.length - 1
                ? n.next()
                : n.jumpTo(0);
            }, o.opts.slideShow.speed)))
          : (i.stop(), (n.idleSecondsCounter = 0), n.showControls());
      },
      clear: function () {
        var t = this;
        clearTimeout(t.timer),
          (t.timer = null),
          t.$progress && t.$progress.removeAttr("style").hide();
      },
      start: function () {
        var t = this,
          e = t.instance.current;
        e &&
          (t.$button
            .attr(
              "title",
              (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_STOP
            )
            .removeClass("fancybox-button--play")
            .addClass("fancybox-button--pause"),
          (t.isActive = !0),
          e.isComplete && t.set(!0),
          t.instance.trigger("onSlideShowChange", !0));
      },
      stop: function () {
        var t = this,
          e = t.instance.current;
        t.clear(),
          t.$button
            .attr(
              "title",
              (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_START
            )
            .removeClass("fancybox-button--pause")
            .addClass("fancybox-button--play"),
          (t.isActive = !1),
          t.instance.trigger("onSlideShowChange", !1),
          t.$progress && t.$progress.removeAttr("style").hide();
      },
      toggle: function () {
        var t = this;
        t.isActive ? t.stop() : t.start();
      },
    }),
      e(t).on({
        "onInit.fb": function (t, e) {
          e && !e.SlideShow && (e.SlideShow = new i(e));
        },
        "beforeShow.fb": function (t, e, i, n) {
          var o = e && e.SlideShow;
          n
            ? o && i.opts.slideShow.autoStart && o.start()
            : o && o.isActive && o.clear();
        },
        "afterShow.fb": function (t, e, i) {
          var n = e && e.SlideShow;
          n && n.isActive && n.set();
        },
        "afterKeydown.fb": function (i, n, o, s, r) {
          var a = n && n.SlideShow;
          !a ||
            !o.opts.slideShow ||
            (80 !== r && 32 !== r) ||
            e(t.activeElement).is("button,a,input") ||
            (s.preventDefault(), a.toggle());
        },
        "beforeClose.fb onDeactivate.fb": function (t, e) {
          var i = e && e.SlideShow;
          i && i.stop();
        },
      }),
      e(t).on("visibilitychange", function () {
        var i = e.fancybox.getInstance(),
          n = i && i.SlideShow;
        n && n.isActive && (t.hidden ? n.clear() : n.set());
      });
  })(document, jQuery),
  (function (t, e) {
    "use strict";
    var i = (function () {
      for (
        var e = [
            [
              "requestFullscreen",
              "exitFullscreen",
              "fullscreenElement",
              "fullscreenEnabled",
              "fullscreenchange",
              "fullscreenerror",
            ],
            [
              "webkitRequestFullscreen",
              "webkitExitFullscreen",
              "webkitFullscreenElement",
              "webkitFullscreenEnabled",
              "webkitfullscreenchange",
              "webkitfullscreenerror",
            ],
            [
              "webkitRequestFullScreen",
              "webkitCancelFullScreen",
              "webkitCurrentFullScreenElement",
              "webkitCancelFullScreen",
              "webkitfullscreenchange",
              "webkitfullscreenerror",
            ],
            [
              "mozRequestFullScreen",
              "mozCancelFullScreen",
              "mozFullScreenElement",
              "mozFullScreenEnabled",
              "mozfullscreenchange",
              "mozfullscreenerror",
            ],
            [
              "msRequestFullscreen",
              "msExitFullscreen",
              "msFullscreenElement",
              "msFullscreenEnabled",
              "MSFullscreenChange",
              "MSFullscreenError",
            ],
          ],
          i = {},
          n = 0;
        n < e.length;
        n++
      ) {
        var o = e[n];
        if (o && o[1] in t) {
          for (var s = 0; s < o.length; s++) i[e[0][s]] = o[s];
          return i;
        }
      }
      return !1;
    })();
    if (i) {
      var n = {
        request: function (e) {
          (e = e || t.documentElement)[i.requestFullscreen](
            e.ALLOW_KEYBOARD_INPUT
          );
        },
        exit: function () {
          t[i.exitFullscreen]();
        },
        toggle: function (e) {
          (e = e || t.documentElement),
            this.isFullscreen() ? this.exit() : this.request(e);
        },
        isFullscreen: function () {
          return Boolean(t[i.fullscreenElement]);
        },
        enabled: function () {
          return Boolean(t[i.fullscreenEnabled]);
        },
      };
      e.extend(!0, e.fancybox.defaults, {
        btnTpl: {
          fullScreen:
            '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>',
        },
        fullScreen: { autoStart: !1 },
      }),
        e(t).on(i.fullscreenchange, function () {
          var t = n.isFullscreen(),
            i = e.fancybox.getInstance();
          i &&
            (i.current &&
              "image" === i.current.type &&
              i.isAnimating &&
              ((i.isAnimating = !1),
              i.update(!0, !0, 0),
              i.isComplete || i.complete()),
            i.trigger("onFullscreenChange", t),
            i.$refs.container.toggleClass("fancybox-is-fullscreen", t),
            i.$refs.toolbar
              .find("[data-fancybox-fullscreen]")
              .toggleClass("fancybox-button--fsenter", !t)
              .toggleClass("fancybox-button--fsexit", t));
        });
    }
    e(t).on({
      "onInit.fb": function (t, e) {
        i
          ? e && e.group[e.currIndex].opts.fullScreen
            ? (e.$refs.container.on(
                "click.fb-fullscreen",
                "[data-fancybox-fullscreen]",
                function (t) {
                  t.stopPropagation(), t.preventDefault(), n.toggle();
                }
              ),
              e.opts.fullScreen &&
                !0 === e.opts.fullScreen.autoStart &&
                n.request(),
              (e.FullScreen = n))
            : e && e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()
          : e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();
      },
      "afterKeydown.fb": function (t, e, i, n, o) {
        e &&
          e.FullScreen &&
          70 === o &&
          (n.preventDefault(), e.FullScreen.toggle());
      },
      "beforeClose.fb": function (t, e) {
        e &&
          e.FullScreen &&
          e.$refs.container.hasClass("fancybox-is-fullscreen") &&
          n.exit();
      },
    });
  })(document, jQuery),
  (function (t, e) {
    "use strict";
    var i = "fancybox-thumbs";
    e.fancybox.defaults = e.extend(
      !0,
      {
        btnTpl: {
          thumbs:
            '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>',
        },
        thumbs: {
          autoStart: !1,
          hideOnClose: !0,
          parentEl: ".fancybox-container",
          axis: "y",
        },
      },
      e.fancybox.defaults
    );
    var n = function (t) {
      this.init(t);
    };
    e.extend(n.prototype, {
      $button: null,
      $grid: null,
      $list: null,
      isVisible: !1,
      isActive: !1,
      init: function (t) {
        var e = this,
          i = t.group,
          n = 0;
        (e.instance = t),
          (e.opts = i[t.currIndex].opts.thumbs),
          (t.Thumbs = e),
          (e.$button = t.$refs.toolbar.find("[data-fancybox-thumbs]"));
        for (
          var o = 0, s = i.length;
          o < s && (i[o].thumb && n++, !(n > 1));
          o++
        );
        n > 1 && e.opts
          ? (e.$button.removeAttr("style").on("click", function () {
              e.toggle();
            }),
            (e.isActive = !0))
          : e.$button.hide();
      },
      create: function () {
        var t,
          n = this,
          o = n.instance,
          s = n.opts.parentEl,
          r = [];
        n.$grid ||
          ((n.$grid = e(
            '<div class="' + i + " " + i + "-" + n.opts.axis + '"></div>'
          ).appendTo(o.$refs.container.find(s).addBack().filter(s))),
          n.$grid.on("click", "a", function () {
            o.jumpTo(e(this).attr("data-index"));
          })),
          n.$list ||
            (n.$list = e('<div class="' + i + '__list">').appendTo(n.$grid)),
          e.each(o.group, function (e, i) {
            (t = i.thumb) || "image" !== i.type || (t = i.src),
              r.push(
                '<a href="javascript:;" tabindex="0" data-index="' +
                  e +
                  '"' +
                  (t && t.length
                    ? ' style="background-image:url(' + t + ')"'
                    : 'class="fancybox-thumbs-missing"') +
                  "></a>"
              );
          }),
          (n.$list[0].innerHTML = r.join("")),
          "x" === n.opts.axis &&
            n.$list.width(
              parseInt(n.$grid.css("padding-right"), 10) +
                o.group.length * n.$list.children().eq(0).outerWidth(!0)
            );
      },
      focus: function (t) {
        var e,
          i,
          n = this,
          o = n.$list,
          s = n.$grid;
        n.instance.current &&
          ((i = (e = o
            .children()
            .removeClass("fancybox-thumbs-active")
            .filter('[data-index="' + n.instance.current.index + '"]')
            .addClass("fancybox-thumbs-active")).position()),
          "y" === n.opts.axis &&
          (i.top < 0 || i.top > o.height() - e.outerHeight())
            ? o.stop().animate({ scrollTop: o.scrollTop() + i.top }, t)
            : "x" === n.opts.axis &&
              (i.left < s.scrollLeft() ||
                i.left > s.scrollLeft() + (s.width() - e.outerWidth())) &&
              o.parent().stop().animate({ scrollLeft: i.left }, t));
      },
      update: function () {
        var t = this;
        t.instance.$refs.container.toggleClass(
          "fancybox-show-thumbs",
          this.isVisible
        ),
          t.isVisible
            ? (t.$grid || t.create(),
              t.instance.trigger("onThumbsShow"),
              t.focus(0))
            : t.$grid && t.instance.trigger("onThumbsHide"),
          t.instance.update();
      },
      hide: function () {
        (this.isVisible = !1), this.update();
      },
      show: function () {
        (this.isVisible = !0), this.update();
      },
      toggle: function () {
        (this.isVisible = !this.isVisible), this.update();
      },
    }),
      e(t).on({
        "onInit.fb": function (t, e) {
          var i;
          e &&
            !e.Thumbs &&
            (i = new n(e)).isActive &&
            !0 === i.opts.autoStart &&
            i.show();
        },
        "beforeShow.fb": function (t, e, i, n) {
          var o = e && e.Thumbs;
          o && o.isVisible && o.focus(n ? 0 : 250);
        },
        "afterKeydown.fb": function (t, e, i, n, o) {
          var s = e && e.Thumbs;
          s && s.isActive && 71 === o && (n.preventDefault(), s.toggle());
        },
        "beforeClose.fb": function (t, e) {
          var i = e && e.Thumbs;
          i && i.isVisible && !1 !== i.opts.hideOnClose && i.$grid.hide();
        },
      });
  })(document, jQuery),
  (function (t, e) {
    "use strict";
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        share:
          '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>',
      },
      share: {
        url: function (t, e) {
          return (
            (!t.currentHash &&
              "inline" !== e.type &&
              "html" !== e.type &&
              (e.origSrc || e.src)) ||
            window.location
          );
        },
        tpl: '<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>',
      },
    }),
      e(t).on("click", "[data-fancybox-share]", function () {
        var t,
          i,
          n = e.fancybox.getInstance(),
          o = n.current || null;
        o &&
          ("function" === e.type(o.opts.share.url) &&
            (t = o.opts.share.url.apply(o, [n, o])),
          (i = o.opts.share.tpl
            .replace(
              /\{\{media\}\}/g,
              "image" === o.type ? encodeURIComponent(o.src) : ""
            )
            .replace(/\{\{url\}\}/g, encodeURIComponent(t))
            .replace(
              /\{\{url_raw\}\}/g,
              (function (t) {
                var e = {
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                  "/": "&#x2F;",
                  "`": "&#x60;",
                  "=": "&#x3D;",
                };
                return String(t).replace(/[&<>"'`=\/]/g, function (t) {
                  return e[t];
                });
              })(t)
            )
            .replace(
              /\{\{descr\}\}/g,
              n.$caption ? encodeURIComponent(n.$caption.text()) : ""
            )),
          e.fancybox.open({
            src: n.translate(n, i),
            type: "html",
            opts: {
              touch: !1,
              animationEffect: !1,
              afterLoad: function (t, e) {
                n.$refs.container.one("beforeClose.fb", function () {
                  t.close(null, 0);
                }),
                  e.$content.find(".fancybox-share__button").click(function () {
                    return (
                      window.open(this.href, "Share", "width=550, height=450"),
                      !1
                    );
                  });
              },
              mobile: { autoFocus: !1 },
            },
          }));
      });
  })(document, jQuery),
  (function (t, e, i) {
    "use strict";
    function n() {
      var e = t.location.hash.substr(1),
        i = e.split("-"),
        n =
          (i.length > 1 &&
            /^\+?\d+$/.test(i[i.length - 1]) &&
            parseInt(i.pop(-1), 10)) ||
          1;
      return { hash: e, index: n < 1 ? 1 : n, gallery: i.join("-") };
    }
    function o(t) {
      "" !== t.gallery &&
        i("[data-fancybox='" + i.escapeSelector(t.gallery) + "']")
          .eq(t.index - 1)
          .focus()
          .trigger("click.fb-start");
    }
    function s(t) {
      var e, i;
      return (
        !!t &&
        "" !==
          (i =
            (e = t.current ? t.current.opts : t.opts).hash ||
            (e.$orig
              ? e.$orig.data("fancybox") || e.$orig.data("fancybox-trigger")
              : "")) &&
        i
      );
    }
    i.escapeSelector ||
      (i.escapeSelector = function (t) {
        return (t + "").replace(
          /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
          function (t, e) {
            return e
              ? "\0" === t
                ? "�"
                : t.slice(0, -1) +
                  "\\" +
                  t.charCodeAt(t.length - 1).toString(16) +
                  " "
              : "\\" + t;
          }
        );
      }),
      i(function () {
        !1 !== i.fancybox.defaults.hash &&
          (i(e).on({
            "onInit.fb": function (t, e) {
              var i, o;
              !1 !== e.group[e.currIndex].opts.hash &&
                ((i = n()),
                (o = s(e)) &&
                  i.gallery &&
                  o == i.gallery &&
                  (e.currIndex = i.index - 1));
            },
            "beforeShow.fb": function (i, n, o, r) {
              var a;
              o &&
                !1 !== o.opts.hash &&
                (a = s(n)) &&
                ((n.currentHash =
                  a + (n.group.length > 1 ? "-" + (o.index + 1) : "")),
                t.location.hash !== "#" + n.currentHash &&
                  (r && !n.origHash && (n.origHash = t.location.hash),
                  n.hashTimer && clearTimeout(n.hashTimer),
                  (n.hashTimer = setTimeout(function () {
                    "replaceState" in t.history
                      ? (t.history[r ? "pushState" : "replaceState"](
                          {},
                          e.title,
                          t.location.pathname +
                            t.location.search +
                            "#" +
                            n.currentHash
                        ),
                        r && (n.hasCreatedHistory = !0))
                      : (t.location.hash = n.currentHash),
                      (n.hashTimer = null);
                  }, 300))));
            },
            "beforeClose.fb": function (i, n, o) {
              o &&
                !1 !== o.opts.hash &&
                (clearTimeout(n.hashTimer),
                n.currentHash && n.hasCreatedHistory
                  ? t.history.back()
                  : n.currentHash &&
                    ("replaceState" in t.history
                      ? t.history.replaceState(
                          {},
                          e.title,
                          t.location.pathname +
                            t.location.search +
                            (n.origHash || "")
                        )
                      : (t.location.hash = n.origHash)),
                (n.currentHash = null));
            },
          }),
          i(t).on("hashchange.fb", function () {
            var t = n(),
              e = null;
            i.each(i(".fancybox-container").get().reverse(), function (t, n) {
              var o = i(n).data("FancyBox");
              if (o && o.currentHash) return (e = o), !1;
            }),
              e
                ? e.currentHash === t.gallery + "-" + t.index ||
                  (1 === t.index && e.currentHash == t.gallery) ||
                  ((e.currentHash = null), e.close())
                : "" !== t.gallery && o(t);
          }),
          setTimeout(function () {
            i.fancybox.getInstance() || o(n());
          }, 50));
      });
  })(window, document, jQuery),
  (function (t, e) {
    "use strict";
    var i = new Date().getTime();
    e(t).on({
      "onInit.fb": function (t, e, n) {
        e.$refs.stage.on(
          "mousewheel DOMMouseScroll wheel MozMousePixelScroll",
          function (t) {
            var n = e.current,
              o = new Date().getTime();
            e.group.length < 2 ||
              !1 === n.opts.wheel ||
              ("auto" === n.opts.wheel && "image" !== n.type) ||
              (t.preventDefault(),
              t.stopPropagation(),
              n.$slide.hasClass("fancybox-animated") ||
                ((t = t.originalEvent || t),
                o - i < 250 ||
                  ((i = o),
                  e[
                    (-t.deltaY || -t.deltaX || t.wheelDelta || -t.detail) < 0
                      ? "next"
                      : "previous"
                  ]())));
          }
        );
      },
    });
  })(document, jQuery),
  (function (t, e) {
    var i = (function (t, e) {
      "use strict";
      var i, n;
      if (
        ((function () {
          var e,
            i = {
              lazyClass: "lazyload",
              loadedClass: "lazyloaded",
              loadingClass: "lazyloading",
              preloadClass: "lazypreload",
              errorClass: "lazyerror",
              autosizesClass: "lazyautosizes",
              srcAttr: "data-src",
              srcsetAttr: "data-srcset",
              sizesAttr: "data-sizes",
              minSize: 40,
              customMedia: {},
              init: !0,
              expFactor: 1.5,
              hFac: 0.8,
              loadMode: 2,
              loadHidden: !0,
              ricTimeout: 0,
              throttleDelay: 125,
            };
          for (e in ((n = t.lazySizesConfig || t.lazysizesConfig || {}), i))
            e in n || (n[e] = i[e]);
        })(),
        !e || !e.getElementsByClassName)
      )
        return { init: function () {}, cfg: n, noSupport: !0 };
      var o = e.documentElement,
        s = t.Date,
        r = t.HTMLPictureElement,
        a = "addEventListener",
        l = "getAttribute",
        c = t[a],
        u = t.setTimeout,
        h = t.requestAnimationFrame || u,
        d = t.requestIdleCallback,
        p = /^picture$/i,
        f = ["load", "error", "lazyincluded", "_lazyloaded"],
        m = {},
        g = Array.prototype.forEach,
        v = function (t, e) {
          return (
            m[e] || (m[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")),
            m[e].test(t[l]("class") || "") && m[e]
          );
        },
        y = function (t, e) {
          v(t, e) ||
            t.setAttribute("class", (t[l]("class") || "").trim() + " " + e);
        },
        _ = function (t, e) {
          var i;
          (i = v(t, e)) &&
            t.setAttribute("class", (t[l]("class") || "").replace(i, " "));
        },
        b = function (t, e, i) {
          var n = i ? a : "removeEventListener";
          i && b(t, e),
            f.forEach(function (i) {
              t[n](i, e);
            });
        },
        w = function (t, n, o, s, r) {
          var a = e.createEvent("Event");
          return (
            o || (o = {}),
            (o.instance = i),
            a.initEvent(n, !s, !r),
            (a.detail = o),
            t.dispatchEvent(a),
            a
          );
        },
        x = function (e, i) {
          var o;
          !r && (o = t.picturefill || n.pf)
            ? (i && i.src && !e[l]("srcset") && e.setAttribute("srcset", i.src),
              o({ reevaluate: !0, elements: [e] }))
            : i && i.src && (e.src = i.src);
        },
        T = function (t, e) {
          return (getComputedStyle(t, null) || {})[e];
        },
        $ = function (t, e, i) {
          for (
            i = i || t.offsetWidth;
            i < n.minSize && e && !t._lazysizesWidth;

          )
            (i = e.offsetWidth), (e = e.parentNode);
          return i;
        },
        S = (function () {
          var t,
            i,
            n = [],
            o = [],
            s = n,
            r = function () {
              var e = s;
              for (s = n.length ? o : n, t = !0, i = !1; e.length; )
                e.shift()();
              t = !1;
            },
            a = function (n, o) {
              t && !o
                ? n.apply(this, arguments)
                : (s.push(n), i || ((i = !0), (e.hidden ? u : h)(r)));
            };
          return (a._lsFlush = r), a;
        })(),
        C = function (t, e) {
          return e
            ? function () {
                S(t);
              }
            : function () {
                var e = this,
                  i = arguments;
                S(function () {
                  t.apply(e, i);
                });
              };
        },
        k = function (t) {
          var e,
            i = 0,
            o = n.throttleDelay,
            r = n.ricTimeout,
            a = function () {
              (e = !1), (i = s.now()), t();
            },
            l =
              d && r > 49
                ? function () {
                    d(a, { timeout: r }),
                      r !== n.ricTimeout && (r = n.ricTimeout);
                  }
                : C(function () {
                    u(a);
                  }, !0);
          return function (t) {
            var n;
            (t = !0 === t) && (r = 33),
              e ||
                ((e = !0),
                (n = o - (s.now() - i)) < 0 && (n = 0),
                t || n < 9 ? l() : u(l, n));
          };
        },
        P = function (t) {
          var e,
            i,
            n = function () {
              (e = null), t();
            },
            o = function () {
              var t = s.now() - i;
              t < 99 ? u(o, 99 - t) : (d || n)(n);
            };
          return function () {
            (i = s.now()), e || (e = u(o, 99));
          };
        },
        A = (function () {
          var r,
            h,
            d,
            f,
            m,
            $,
            A,
            O,
            F,
            z,
            M,
            L,
            D = /^img$/i,
            R = /^iframe$/i,
            I = "onscroll" in t && !/(gle|ing)bot/.test(navigator.userAgent),
            j = 0,
            H = 0,
            N = -1,
            B = function (t) {
              H--, (!t || H < 0 || !t.target) && (H = 0);
            },
            W = function (t) {
              return (
                null == L && (L = "hidden" == T(e.body, "visibility")),
                L ||
                  ("hidden" != T(t.parentNode, "visibility") &&
                    "hidden" != T(t, "visibility"))
              );
            },
            q = function (t, i) {
              var n,
                s = t,
                r = W(t);
              for (
                O -= i, M += i, F -= i, z += i;
                r && (s = s.offsetParent) && s != e.body && s != o;

              )
                (r = (T(s, "opacity") || 1) > 0) &&
                  "visible" != T(s, "overflow") &&
                  ((n = s.getBoundingClientRect()),
                  (r =
                    z > n.left &&
                    F < n.right &&
                    M > n.top - 1 &&
                    O < n.bottom + 1));
              return r;
            },
            X = function () {
              var t,
                s,
                a,
                c,
                u,
                d,
                p,
                m,
                g,
                v,
                y,
                _,
                b = i.elements;
              if ((f = n.loadMode) && H < 8 && (t = b.length)) {
                for (s = 0, N++; s < t; s++)
                  if (b[s] && !b[s]._lazyRace)
                    if (!I || (i.prematureUnveil && i.prematureUnveil(b[s])))
                      K(b[s]);
                    else if (
                      (((m = b[s][l]("data-expand")) && (d = 1 * m)) || (d = j),
                      v ||
                        ((v =
                          !n.expand || n.expand < 1
                            ? o.clientHeight > 500 && o.clientWidth > 500
                              ? 500
                              : 370
                            : n.expand),
                        (i._defEx = v),
                        (y = v * n.expFactor),
                        (_ = n.hFac),
                        (L = null),
                        j < y && H < 1 && N > 2 && f > 2 && !e.hidden
                          ? ((j = y), (N = 0))
                          : (j = f > 1 && N > 1 && H < 6 ? v : 0)),
                      g !== d &&
                        (($ = innerWidth + d * _),
                        (A = innerHeight + d),
                        (p = -1 * d),
                        (g = d)),
                      (a = b[s].getBoundingClientRect()),
                      (M = a.bottom) >= p &&
                        (O = a.top) <= A &&
                        (z = a.right) >= p * _ &&
                        (F = a.left) <= $ &&
                        (M || z || F || O) &&
                        (n.loadHidden || W(b[s])) &&
                        ((h && H < 3 && !m && (f < 3 || N < 4)) || q(b[s], d)))
                    ) {
                      if ((K(b[s]), (u = !0), H > 9)) break;
                    } else
                      !u &&
                        h &&
                        !c &&
                        H < 4 &&
                        N < 4 &&
                        f > 2 &&
                        (r[0] || n.preloadAfterLoad) &&
                        (r[0] ||
                          (!m &&
                            (M ||
                              z ||
                              F ||
                              O ||
                              "auto" != b[s][l](n.sizesAttr)))) &&
                        (c = r[0] || b[s]);
                c && !u && K(c);
              }
            },
            V = k(X),
            Y = function (t) {
              var e = t.target;
              e._lazyCache
                ? delete e._lazyCache
                : (B(t),
                  y(e, n.loadedClass),
                  _(e, n.loadingClass),
                  b(e, Q),
                  w(e, "lazyloaded"));
            },
            U = C(Y),
            Q = function (t) {
              U({ target: t.target });
            },
            G = function (t) {
              var e,
                i = t[l](n.srcsetAttr);
              (e = n.customMedia[t[l]("data-media") || t[l]("media")]) &&
                t.setAttribute("media", e),
                i && t.setAttribute("srcset", i);
            },
            Z = C(function (t, e, i, o, s) {
              var r, a, c, h, f, m;
              (f = w(t, "lazybeforeunveil", e)).defaultPrevented ||
                (o && (i ? y(t, n.autosizesClass) : t.setAttribute("sizes", o)),
                (a = t[l](n.srcsetAttr)),
                (r = t[l](n.srcAttr)),
                s && ((c = t.parentNode), (h = c && p.test(c.nodeName || ""))),
                (m = e.firesLoad || ("src" in t && (a || r || h))),
                (f = { target: t }),
                y(t, n.loadingClass),
                m && (clearTimeout(d), (d = u(B, 2500)), b(t, Q, !0)),
                h && g.call(c.getElementsByTagName("source"), G),
                a
                  ? t.setAttribute("srcset", a)
                  : r &&
                    !h &&
                    (R.test(t.nodeName)
                      ? (function (t, e) {
                          try {
                            t.contentWindow.location.replace(e);
                          } catch (i) {
                            t.src = e;
                          }
                        })(t, r)
                      : (t.src = r)),
                s && (a || h) && x(t, { src: r })),
                t._lazyRace && delete t._lazyRace,
                _(t, n.lazyClass),
                S(function () {
                  var e = t.complete && t.naturalWidth > 1;
                  (m && !e) ||
                    (e && y(t, "ls-is-cached"),
                    Y(f),
                    (t._lazyCache = !0),
                    u(function () {
                      "_lazyCache" in t && delete t._lazyCache;
                    }, 9)),
                    "lazy" == t.loading && H--;
                }, !0);
            }),
            K = function (t) {
              if (!t._lazyRace) {
                var e,
                  i = D.test(t.nodeName),
                  o = i && (t[l](n.sizesAttr) || t[l]("sizes")),
                  s = "auto" == o;
                ((!s && h) ||
                  !i ||
                  (!t[l]("src") && !t.srcset) ||
                  t.complete ||
                  v(t, n.errorClass) ||
                  !v(t, n.lazyClass)) &&
                  ((e = w(t, "lazyunveilread").detail),
                  s && E.updateElem(t, !0, t.offsetWidth),
                  (t._lazyRace = !0),
                  H++,
                  Z(t, e, s, o, i));
              }
            },
            J = P(function () {
              (n.loadMode = 3), V();
            }),
            tt = function () {
              3 == n.loadMode && (n.loadMode = 2), J();
            },
            et = function () {
              if (!h) {
                if (s.now() - m < 999) return void u(et, 999);
                (h = !0), (n.loadMode = 3), V(), c("scroll", tt, !0);
              }
            };
          return {
            _: function () {
              (m = s.now()),
                (i.elements = e.getElementsByClassName(n.lazyClass)),
                (r = e.getElementsByClassName(
                  n.lazyClass + " " + n.preloadClass
                )),
                c("scroll", V, !0),
                c("resize", V, !0),
                t.MutationObserver
                  ? new MutationObserver(V).observe(o, {
                      childList: !0,
                      subtree: !0,
                      attributes: !0,
                    })
                  : (o[a]("DOMNodeInserted", V, !0),
                    o[a]("DOMAttrModified", V, !0),
                    setInterval(V, 999)),
                c("hashchange", V, !0),
                [
                  "focus",
                  "mouseover",
                  "click",
                  "load",
                  "transitionend",
                  "animationend",
                ].forEach(function (t) {
                  e[a](t, V, !0);
                }),
                /d$|^c/.test(e.readyState)
                  ? et()
                  : (c("load", et), e[a]("DOMContentLoaded", V), u(et, 2e4)),
                i.elements.length ? (X(), S._lsFlush()) : V();
            },
            checkElems: V,
            unveil: K,
            _aLSL: tt,
          };
        })(),
        E = (function () {
          var t,
            i = C(function (t, e, i, n) {
              var o, s, r;
              if (
                ((t._lazysizesWidth = n),
                (n += "px"),
                t.setAttribute("sizes", n),
                p.test(e.nodeName || ""))
              )
                for (
                  o = e.getElementsByTagName("source"), s = 0, r = o.length;
                  s < r;
                  s++
                )
                  o[s].setAttribute("sizes", n);
              i.detail.dataAttr || x(t, i.detail);
            }),
            o = function (t, e, n) {
              var o,
                s = t.parentNode;
              s &&
                ((n = $(t, s, n)),
                (o = w(t, "lazybeforesizes", { width: n, dataAttr: !!e }))
                  .defaultPrevented ||
                  ((n = o.detail.width) &&
                    n !== t._lazysizesWidth &&
                    i(t, s, o, n)));
            },
            s = P(function () {
              var e,
                i = t.length;
              if (i) for (e = 0; e < i; e++) o(t[e]);
            });
          return {
            _: function () {
              (t = e.getElementsByClassName(n.autosizesClass)), c("resize", s);
            },
            checkElems: s,
            updateElem: o,
          };
        })(),
        O = function () {
          !O.i && e.getElementsByClassName && ((O.i = !0), E._(), A._());
        };
      return (
        u(function () {
          n.init && O();
        }),
        (i = {
          cfg: n,
          autoSizer: E,
          loader: A,
          init: O,
          uP: x,
          aC: y,
          rC: _,
          hC: v,
          fire: w,
          gW: $,
          rAF: S,
        })
      );
    })(t, t.document);
    (t.lazySizes = i),
      "object" == typeof module && module.exports && (module.exports = i);
  })("undefined" != typeof window ? window : {}),
  (function (t, e) {
    "object" == typeof exports && "object" == typeof module
      ? (module.exports = e())
      : "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof exports
      ? (exports.Scrollbar = e())
      : (t.Scrollbar = e());
  })(window, function () {
    return (function (t) {
      var e = {};
      function i(n) {
        if (e[n]) return e[n].exports;
        var o = (e[n] = { i: n, l: !1, exports: {} });
        return t[n].call(o.exports, o, o.exports, i), (o.l = !0), o.exports;
      }
      return (
        (i.m = t),
        (i.c = e),
        (i.d = function (t, e, n) {
          i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
        }),
        (i.r = function (t) {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (i.t = function (t, e) {
          if ((1 & e && (t = i(t)), 8 & e)) return t;
          if (4 & e && "object" == typeof t && t && t.__esModule) return t;
          var n = Object.create(null);
          if (
            (i.r(n),
            Object.defineProperty(n, "default", { enumerable: !0, value: t }),
            2 & e && "string" != typeof t)
          )
            for (var o in t)
              i.d(
                n,
                o,
                function (e) {
                  return t[e];
                }.bind(null, o)
              );
          return n;
        }),
        (i.n = function (t) {
          var e =
            t && t.__esModule
              ? function () {
                  return t.default;
                }
              : function () {
                  return t;
                };
          return i.d(e, "a", e), e;
        }),
        (i.o = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (i.p = ""),
        i((i.s = 58))
      );
    })([
      function (t, e, i) {
        var n = i(25)("wks"),
          o = i(16),
          s = i(2).Symbol,
          r = "function" == typeof s;
        (t.exports = function (t) {
          return n[t] || (n[t] = (r && s[t]) || (r ? s : o)("Symbol." + t));
        }).store = n;
      },
      function (t, e) {
        t.exports = function (t) {
          return "object" == typeof t ? null !== t : "function" == typeof t;
        };
      },
      function (t, e) {
        var i = (t.exports =
          "undefined" != typeof window && window.Math == Math
            ? window
            : "undefined" != typeof self && self.Math == Math
            ? self
            : Function("return this")());
        "number" == typeof __g && (__g = i);
      },
      function (t, e) {
        var i = (t.exports = { version: "2.6.5" });
        "number" == typeof __e && (__e = i);
      },
      function (t, e, i) {
        var n = i(2),
          o = i(3),
          s = i(11),
          r = i(5),
          a = i(10),
          l = function (t, e, i) {
            var c,
              u,
              h,
              d,
              p = t & l.F,
              f = t & l.G,
              m = t & l.S,
              g = t & l.P,
              v = t & l.B,
              y = f ? n : m ? n[e] || (n[e] = {}) : (n[e] || {}).prototype,
              _ = f ? o : o[e] || (o[e] = {}),
              b = _.prototype || (_.prototype = {});
            for (c in (f && (i = e), i))
              (h = ((u = !p && y && void 0 !== y[c]) ? y : i)[c]),
                (d =
                  v && u
                    ? a(h, n)
                    : g && "function" == typeof h
                    ? a(Function.call, h)
                    : h),
                y && r(y, c, h, t & l.U),
                _[c] != h && s(_, c, d),
                g && b[c] != h && (b[c] = h);
          };
        (n.core = o),
          (l.F = 1),
          (l.G = 2),
          (l.S = 4),
          (l.P = 8),
          (l.B = 16),
          (l.W = 32),
          (l.U = 64),
          (l.R = 128),
          (t.exports = l);
      },
      function (t, e, i) {
        var n = i(2),
          o = i(11),
          s = i(9),
          r = i(16)("src"),
          a = i(60),
          l = ("" + a).split("toString");
        (i(3).inspectSource = function (t) {
          return a.call(t);
        }),
          (t.exports = function (t, e, i, a) {
            var c = "function" == typeof i;
            c && (s(i, "name") || o(i, "name", e)),
              t[e] !== i &&
                (c &&
                  (s(i, r) || o(i, r, t[e] ? "" + t[e] : l.join(String(e)))),
                t === n
                  ? (t[e] = i)
                  : a
                  ? t[e]
                    ? (t[e] = i)
                    : o(t, e, i)
                  : (delete t[e], o(t, e, i)));
          })(Function.prototype, "toString", function () {
            return ("function" == typeof this && this[r]) || a.call(this);
          });
      },
      function (t, e, i) {
        var n = i(7),
          o = i(41),
          s = i(43),
          r = Object.defineProperty;
        e.f = i(8)
          ? Object.defineProperty
          : function (t, e, i) {
              if ((n(t), (e = s(e, !0)), n(i), o))
                try {
                  return r(t, e, i);
                } catch (t) {}
              if ("get" in i || "set" in i)
                throw TypeError("Accessors not supported!");
              return "value" in i && (t[e] = i.value), t;
            };
      },
      function (t, e, i) {
        var n = i(1);
        t.exports = function (t) {
          if (!n(t)) throw TypeError(t + " is not an object!");
          return t;
        };
      },
      function (t, e, i) {
        t.exports = !i(13)(function () {
          return (
            7 !=
            Object.defineProperty({}, "a", {
              get: function () {
                return 7;
              },
            }).a
          );
        });
      },
      function (t, e) {
        var i = {}.hasOwnProperty;
        t.exports = function (t, e) {
          return i.call(t, e);
        };
      },
      function (t, e, i) {
        var n = i(44);
        t.exports = function (t, e, i) {
          if ((n(t), void 0 === e)) return t;
          switch (i) {
            case 1:
              return function (i) {
                return t.call(e, i);
              };
            case 2:
              return function (i, n) {
                return t.call(e, i, n);
              };
            case 3:
              return function (i, n, o) {
                return t.call(e, i, n, o);
              };
          }
          return function () {
            return t.apply(e, arguments);
          };
        };
      },
      function (t, e, i) {
        var n = i(6),
          o = i(17);
        t.exports = i(8)
          ? function (t, e, i) {
              return n.f(t, e, o(1, i));
            }
          : function (t, e, i) {
              return (t[e] = i), t;
            };
      },
      function (t, e, i) {
        var n = i(1);
        t.exports = function (t, e) {
          if (!n(t) || t._t !== e)
            throw TypeError("Incompatible receiver, " + e + " required!");
          return t;
        };
      },
      function (t, e) {
        t.exports = function (t) {
          try {
            return !!t();
          } catch (t) {
            return !0;
          }
        };
      },
      function (t, e) {
        t.exports = {};
      },
      function (t, e, i) {
        var n = i(10),
          o = i(49),
          s = i(50),
          r = i(7),
          a = i(19),
          l = i(51),
          c = {},
          u = {};
        ((e = t.exports =
          function (t, e, i, h, d) {
            var p,
              f,
              m,
              g,
              v = d
                ? function () {
                    return t;
                  }
                : l(t),
              y = n(i, h, e ? 2 : 1),
              _ = 0;
            if ("function" != typeof v)
              throw TypeError(t + " is not iterable!");
            if (s(v)) {
              for (p = a(t.length); p > _; _++)
                if (
                  (g = e ? y(r((f = t[_]))[0], f[1]) : y(t[_])) === c ||
                  g === u
                )
                  return g;
            } else
              for (m = v.call(t); !(f = m.next()).done; )
                if ((g = o(m, y, f.value, e)) === c || g === u) return g;
          }).BREAK = c),
          (e.RETURN = u);
      },
      function (t, e) {
        var i = 0,
          n = Math.random();
        t.exports = function (t) {
          return "Symbol(".concat(
            void 0 === t ? "" : t,
            ")_",
            (++i + n).toString(36)
          );
        };
      },
      function (t, e) {
        t.exports = function (t, e) {
          return {
            enumerable: !(1 & t),
            configurable: !(2 & t),
            writable: !(4 & t),
            value: e,
          };
        };
      },
      function (t, e, i) {
        var n = i(31),
          o = i(28);
        t.exports = function (t) {
          return n(o(t));
        };
      },
      function (t, e, i) {
        var n = i(27),
          o = Math.min;
        t.exports = function (t) {
          return t > 0 ? o(n(t), 9007199254740991) : 0;
        };
      },
      function (t, e, i) {
        var n = i(28);
        t.exports = function (t) {
          return Object(n(t));
        };
      },
      function (t, e, i) {
        var n = i(16)("meta"),
          o = i(1),
          s = i(9),
          r = i(6).f,
          a = 0,
          l =
            Object.isExtensible ||
            function () {
              return !0;
            },
          c = !i(13)(function () {
            return l(Object.preventExtensions({}));
          }),
          u = function (t) {
            r(t, n, { value: { i: "O" + ++a, w: {} } });
          },
          h = (t.exports = {
            KEY: n,
            NEED: !1,
            fastKey: function (t, e) {
              if (!o(t))
                return "symbol" == typeof t
                  ? t
                  : ("string" == typeof t ? "S" : "P") + t;
              if (!s(t, n)) {
                if (!l(t)) return "F";
                if (!e) return "E";
                u(t);
              }
              return t[n].i;
            },
            getWeak: function (t, e) {
              if (!s(t, n)) {
                if (!l(t)) return !0;
                if (!e) return !1;
                u(t);
              }
              return t[n].w;
            },
            onFreeze: function (t) {
              return c && h.NEED && l(t) && !s(t, n) && u(t), t;
            },
          });
      },
      function (t, e, i) {
        "use strict";
        var n = i(23),
          o = {};
        (o[i(0)("toStringTag")] = "z"),
          o + "" != "[object z]" &&
            i(5)(
              Object.prototype,
              "toString",
              function () {
                return "[object " + n(this) + "]";
              },
              !0
            );
      },
      function (t, e, i) {
        var n = i(24),
          o = i(0)("toStringTag"),
          s =
            "Arguments" ==
            n(
              (function () {
                return arguments;
              })()
            );
        t.exports = function (t) {
          var e, i, r;
          return void 0 === t
            ? "Undefined"
            : null === t
            ? "Null"
            : "string" ==
              typeof (i = (function (t, e) {
                try {
                  return t[e];
                } catch (t) {}
              })((e = Object(t)), o))
            ? i
            : s
            ? n(e)
            : "Object" == (r = n(e)) && "function" == typeof e.callee
            ? "Arguments"
            : r;
        };
      },
      function (t, e) {
        var i = {}.toString;
        t.exports = function (t) {
          return i.call(t).slice(8, -1);
        };
      },
      function (t, e, i) {
        var n = i(3),
          o = i(2),
          s = o["__core-js_shared__"] || (o["__core-js_shared__"] = {});
        (t.exports = function (t, e) {
          return s[t] || (s[t] = void 0 !== e ? e : {});
        })("versions", []).push({
          version: n.version,
          mode: i(40) ? "pure" : "global",
          copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
        });
      },
      function (t, e, i) {
        "use strict";
        var n = i(61)(!0);
        i(29)(
          String,
          "String",
          function (t) {
            (this._t = String(t)), (this._i = 0);
          },
          function () {
            var t,
              e = this._t,
              i = this._i;
            return i >= e.length
              ? { value: void 0, done: !0 }
              : ((t = n(e, i)), (this._i += t.length), { value: t, done: !1 });
          }
        );
      },
      function (t, e) {
        var i = Math.ceil,
          n = Math.floor;
        t.exports = function (t) {
          return isNaN((t = +t)) ? 0 : (t > 0 ? n : i)(t);
        };
      },
      function (t, e) {
        t.exports = function (t) {
          if (null == t) throw TypeError("Can't call method on  " + t);
          return t;
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(40),
          o = i(4),
          s = i(5),
          r = i(11),
          a = i(14),
          l = i(62),
          c = i(33),
          u = i(68),
          h = i(0)("iterator"),
          d = !([].keys && "next" in [].keys()),
          p = function () {
            return this;
          };
        t.exports = function (t, e, i, f, m, g, v) {
          l(i, e, f);
          var y,
            _,
            b,
            w = function (t) {
              if (!d && t in S) return S[t];
              switch (t) {
                case "keys":
                case "values":
                  return function () {
                    return new i(this, t);
                  };
              }
              return function () {
                return new i(this, t);
              };
            },
            x = e + " Iterator",
            T = "values" == m,
            $ = !1,
            S = t.prototype,
            C = S[h] || S["@@iterator"] || (m && S[m]),
            k = C || w(m),
            P = m ? (T ? w("entries") : k) : void 0,
            A = ("Array" == e && S.entries) || C;
          if (
            (A &&
              (b = u(A.call(new t()))) !== Object.prototype &&
              b.next &&
              (c(b, x, !0), n || "function" == typeof b[h] || r(b, h, p)),
            T &&
              C &&
              "values" !== C.name &&
              (($ = !0),
              (k = function () {
                return C.call(this);
              })),
            (n && !v) || (!d && !$ && S[h]) || r(S, h, k),
            (a[e] = k),
            (a[x] = p),
            m)
          )
            if (
              ((y = {
                values: T ? k : w("values"),
                keys: g ? k : w("keys"),
                entries: P,
              }),
              v)
            )
              for (_ in y) _ in S || s(S, _, y[_]);
            else o(o.P + o.F * (d || $), e, y);
          return y;
        };
      },
      function (t, e, i) {
        var n = i(64),
          o = i(46);
        t.exports =
          Object.keys ||
          function (t) {
            return n(t, o);
          };
      },
      function (t, e, i) {
        var n = i(24);
        t.exports = Object("z").propertyIsEnumerable(0)
          ? Object
          : function (t) {
              return "String" == n(t) ? t.split("") : Object(t);
            };
      },
      function (t, e, i) {
        var n = i(25)("keys"),
          o = i(16);
        t.exports = function (t) {
          return n[t] || (n[t] = o(t));
        };
      },
      function (t, e, i) {
        var n = i(6).f,
          o = i(9),
          s = i(0)("toStringTag");
        t.exports = function (t, e, i) {
          t &&
            !o((t = i ? t : t.prototype), s) &&
            n(t, s, { configurable: !0, value: e });
        };
      },
      function (t, e, i) {
        for (
          var n = i(69),
            o = i(30),
            s = i(5),
            r = i(2),
            a = i(11),
            l = i(14),
            c = i(0),
            u = c("iterator"),
            h = c("toStringTag"),
            d = l.Array,
            p = {
              CSSRuleList: !0,
              CSSStyleDeclaration: !1,
              CSSValueList: !1,
              ClientRectList: !1,
              DOMRectList: !1,
              DOMStringList: !1,
              DOMTokenList: !0,
              DataTransferItemList: !1,
              FileList: !1,
              HTMLAllCollection: !1,
              HTMLCollection: !1,
              HTMLFormElement: !1,
              HTMLSelectElement: !1,
              MediaList: !0,
              MimeTypeArray: !1,
              NamedNodeMap: !1,
              NodeList: !0,
              PaintRequestList: !1,
              Plugin: !1,
              PluginArray: !1,
              SVGLengthList: !1,
              SVGNumberList: !1,
              SVGPathSegList: !1,
              SVGPointList: !1,
              SVGStringList: !1,
              SVGTransformList: !1,
              SourceBufferList: !1,
              StyleSheetList: !0,
              TextTrackCueList: !1,
              TextTrackList: !1,
              TouchList: !1,
            },
            f = o(p),
            m = 0;
          m < f.length;
          m++
        ) {
          var g,
            v = f[m],
            y = p[v],
            _ = r[v],
            b = _ && _.prototype;
          if (b && (b[u] || a(b, u, d), b[h] || a(b, h, v), (l[v] = d), y))
            for (g in n) b[g] || s(b, g, n[g], !0);
        }
      },
      function (t, e, i) {
        var n = i(5);
        t.exports = function (t, e, i) {
          for (var o in e) n(t, o, e[o], i);
          return t;
        };
      },
      function (t, e) {
        t.exports = function (t, e, i, n) {
          if (!(t instanceof e) || (void 0 !== n && n in t))
            throw TypeError(i + ": incorrect invocation!");
          return t;
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(2),
          o = i(4),
          s = i(5),
          r = i(35),
          a = i(21),
          l = i(15),
          c = i(36),
          u = i(1),
          h = i(13),
          d = i(52),
          p = i(33),
          f = i(73);
        t.exports = function (t, e, i, m, g, v) {
          var y = n[t],
            _ = y,
            b = g ? "set" : "add",
            w = _ && _.prototype,
            x = {},
            T = function (t) {
              var e = w[t];
              s(
                w,
                t,
                "delete" == t
                  ? function (t) {
                      return !(v && !u(t)) && e.call(this, 0 === t ? 0 : t);
                    }
                  : "has" == t
                  ? function (t) {
                      return !(v && !u(t)) && e.call(this, 0 === t ? 0 : t);
                    }
                  : "get" == t
                  ? function (t) {
                      return v && !u(t)
                        ? void 0
                        : e.call(this, 0 === t ? 0 : t);
                    }
                  : "add" == t
                  ? function (t) {
                      return e.call(this, 0 === t ? 0 : t), this;
                    }
                  : function (t, i) {
                      return e.call(this, 0 === t ? 0 : t, i), this;
                    }
              );
            };
          if (
            "function" == typeof _ &&
            (v ||
              (w.forEach &&
                !h(function () {
                  new _().entries().next();
                })))
          ) {
            var $ = new _(),
              S = $[b](v ? {} : -0, 1) != $,
              C = h(function () {
                $.has(1);
              }),
              k = d(function (t) {
                new _(t);
              }),
              P =
                !v &&
                h(function () {
                  for (var t = new _(), e = 5; e--; ) t[b](e, e);
                  return !t.has(-0);
                });
            k ||
              (((_ = e(function (e, i) {
                c(e, _, t);
                var n = f(new y(), e, _);
                return null != i && l(i, g, n[b], n), n;
              })).prototype = w),
              (w.constructor = _)),
              (C || P) && (T("delete"), T("has"), g && T("get")),
              (P || S) && T(b),
              v && w.clear && delete w.clear;
          } else
            (_ = m.getConstructor(e, t, g, b)),
              r(_.prototype, i),
              (a.NEED = !0);
          return (
            p(_, t),
            (x[t] = _),
            o(o.G + o.W + o.F * (_ != y), x),
            v || m.setStrong(_, t, g),
            _
          );
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(4);
        t.exports = function (t) {
          n(n.S, t, {
            of: function () {
              for (var t = arguments.length, e = new Array(t); t--; )
                e[t] = arguments[t];
              return new this(e);
            },
          });
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(4),
          o = i(44),
          s = i(10),
          r = i(15);
        t.exports = function (t) {
          n(n.S, t, {
            from: function (t) {
              var e,
                i,
                n,
                a,
                l = arguments[1];
              return (
                o(this),
                (e = void 0 !== l) && o(l),
                null == t
                  ? new this()
                  : ((i = []),
                    e
                      ? ((n = 0),
                        (a = s(l, arguments[2], 2)),
                        r(t, !1, function (t) {
                          i.push(a(t, n++));
                        }))
                      : r(t, !1, i.push, i),
                    new this(i))
              );
            },
          });
        };
      },
      function (t, e) {
        t.exports = !1;
      },
      function (t, e, i) {
        t.exports =
          !i(8) &&
          !i(13)(function () {
            return (
              7 !=
              Object.defineProperty(i(42)("div"), "a", {
                get: function () {
                  return 7;
                },
              }).a
            );
          });
      },
      function (t, e, i) {
        var n = i(1),
          o = i(2).document,
          s = n(o) && n(o.createElement);
        t.exports = function (t) {
          return s ? o.createElement(t) : {};
        };
      },
      function (t, e, i) {
        var n = i(1);
        t.exports = function (t, e) {
          if (!n(t)) return t;
          var i, o;
          if (e && "function" == typeof (i = t.toString) && !n((o = i.call(t))))
            return o;
          if ("function" == typeof (i = t.valueOf) && !n((o = i.call(t))))
            return o;
          if (
            !e &&
            "function" == typeof (i = t.toString) &&
            !n((o = i.call(t)))
          )
            return o;
          throw TypeError("Can't convert object to primitive value");
        };
      },
      function (t, e) {
        t.exports = function (t) {
          if ("function" != typeof t)
            throw TypeError(t + " is not a function!");
          return t;
        };
      },
      function (t, e, i) {
        var n = i(7),
          o = i(63),
          s = i(46),
          r = i(32)("IE_PROTO"),
          a = function () {},
          l = function () {
            var t,
              e = i(42)("iframe"),
              n = s.length;
            for (
              e.style.display = "none",
                i(67).appendChild(e),
                e.src = "javascript:",
                (t = e.contentWindow.document).open(),
                t.write("<script>document.F=Object</script>"),
                t.close(),
                l = t.F;
              n--;

            )
              delete l.prototype[s[n]];
            return l();
          };
        t.exports =
          Object.create ||
          function (t, e) {
            var i;
            return (
              null !== t
                ? ((a.prototype = n(t)),
                  (i = new a()),
                  (a.prototype = null),
                  (i[r] = t))
                : (i = l()),
              void 0 === e ? i : o(i, e)
            );
          };
      },
      function (t, e) {
        t.exports =
          "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
            ","
          );
      },
      function (t, e) {
        t.exports = function (t, e) {
          return { value: e, done: !!t };
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(6).f,
          o = i(45),
          s = i(35),
          r = i(10),
          a = i(36),
          l = i(15),
          c = i(29),
          u = i(47),
          h = i(72),
          d = i(8),
          p = i(21).fastKey,
          f = i(12),
          m = d ? "_s" : "size",
          g = function (t, e) {
            var i,
              n = p(e);
            if ("F" !== n) return t._i[n];
            for (i = t._f; i; i = i.n) if (i.k == e) return i;
          };
        t.exports = {
          getConstructor: function (t, e, i, c) {
            var u = t(function (t, n) {
              a(t, u, e, "_i"),
                (t._t = e),
                (t._i = o(null)),
                (t._f = void 0),
                (t._l = void 0),
                (t[m] = 0),
                null != n && l(n, i, t[c], t);
            });
            return (
              s(u.prototype, {
                clear: function () {
                  for (var t = f(this, e), i = t._i, n = t._f; n; n = n.n)
                    (n.r = !0), n.p && (n.p = n.p.n = void 0), delete i[n.i];
                  (t._f = t._l = void 0), (t[m] = 0);
                },
                delete: function (t) {
                  var i = f(this, e),
                    n = g(i, t);
                  if (n) {
                    var o = n.n,
                      s = n.p;
                    delete i._i[n.i],
                      (n.r = !0),
                      s && (s.n = o),
                      o && (o.p = s),
                      i._f == n && (i._f = o),
                      i._l == n && (i._l = s),
                      i[m]--;
                  }
                  return !!n;
                },
                forEach: function (t) {
                  f(this, e);
                  for (
                    var i,
                      n = r(t, arguments.length > 1 ? arguments[1] : void 0, 3);
                    (i = i ? i.n : this._f);

                  )
                    for (n(i.v, i.k, this); i && i.r; ) i = i.p;
                },
                has: function (t) {
                  return !!g(f(this, e), t);
                },
              }),
              d &&
                n(u.prototype, "size", {
                  get: function () {
                    return f(this, e)[m];
                  },
                }),
              u
            );
          },
          def: function (t, e, i) {
            var n,
              o,
              s = g(t, e);
            return (
              s
                ? (s.v = i)
                : ((t._l = s =
                    {
                      i: (o = p(e, !0)),
                      k: e,
                      v: i,
                      p: (n = t._l),
                      n: void 0,
                      r: !1,
                    }),
                  t._f || (t._f = s),
                  n && (n.n = s),
                  t[m]++,
                  "F" !== o && (t._i[o] = s)),
              t
            );
          },
          getEntry: g,
          setStrong: function (t, e, i) {
            c(
              t,
              e,
              function (t, i) {
                (this._t = f(t, e)), (this._k = i), (this._l = void 0);
              },
              function () {
                for (var t = this._k, e = this._l; e && e.r; ) e = e.p;
                return this._t && (this._l = e = e ? e.n : this._t._f)
                  ? u(0, "keys" == t ? e.k : "values" == t ? e.v : [e.k, e.v])
                  : ((this._t = void 0), u(1));
              },
              i ? "entries" : "values",
              !i,
              !0
            ),
              h(e);
          },
        };
      },
      function (t, e, i) {
        var n = i(7);
        t.exports = function (t, e, i, o) {
          try {
            return o ? e(n(i)[0], i[1]) : e(i);
          } catch (e) {
            var s = t.return;
            throw (void 0 !== s && n(s.call(t)), e);
          }
        };
      },
      function (t, e, i) {
        var n = i(14),
          o = i(0)("iterator"),
          s = Array.prototype;
        t.exports = function (t) {
          return void 0 !== t && (n.Array === t || s[o] === t);
        };
      },
      function (t, e, i) {
        var n = i(23),
          o = i(0)("iterator"),
          s = i(14);
        t.exports = i(3).getIteratorMethod = function (t) {
          if (null != t) return t[o] || t["@@iterator"] || s[n(t)];
        };
      },
      function (t, e, i) {
        var n = i(0)("iterator"),
          o = !1;
        try {
          var s = [7][n]();
          (s.return = function () {
            o = !0;
          }),
            Array.from(s, function () {
              throw 2;
            });
        } catch (t) {}
        t.exports = function (t, e) {
          if (!e && !o) return !1;
          var i = !1;
          try {
            var s = [7],
              r = s[n]();
            (r.next = function () {
              return { done: (i = !0) };
            }),
              (s[n] = function () {
                return r;
              }),
              t(s);
          } catch (t) {}
          return i;
        };
      },
      function (t, e) {
        e.f = {}.propertyIsEnumerable;
      },
      function (t, e, i) {
        var n = i(23),
          o = i(77);
        t.exports = function (t) {
          return function () {
            if (n(this) != t) throw TypeError(t + "#toJSON isn't generic");
            return o(this);
          };
        };
      },
      function (t, e, i) {
        var n = i(10),
          o = i(31),
          s = i(20),
          r = i(19),
          a = i(87);
        t.exports = function (t, e) {
          var i = 1 == t,
            l = 2 == t,
            c = 3 == t,
            u = 4 == t,
            h = 6 == t,
            d = 5 == t || h,
            p = e || a;
          return function (e, a, f) {
            for (
              var m,
                g,
                v = s(e),
                y = o(v),
                _ = n(a, f, 3),
                b = r(y.length),
                w = 0,
                x = i ? p(e, b) : l ? p(e, 0) : void 0;
              b > w;
              w++
            )
              if ((d || w in y) && ((g = _((m = y[w]), w, v)), t))
                if (i) x[w] = g;
                else if (g)
                  switch (t) {
                    case 3:
                      return !0;
                    case 5:
                      return m;
                    case 6:
                      return w;
                    case 2:
                      x.push(m);
                  }
                else if (u) return !1;
            return h ? -1 : c || u ? u : x;
          };
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(30),
          o = i(90),
          s = i(53),
          r = i(20),
          a = i(31),
          l = Object.assign;
        t.exports =
          !l ||
          i(13)(function () {
            var t = {},
              e = {},
              i = Symbol(),
              n = "abcdefghijklmnopqrst";
            return (
              (t[i] = 7),
              n.split("").forEach(function (t) {
                e[t] = t;
              }),
              7 != l({}, t)[i] || Object.keys(l({}, e)).join("") != n
            );
          })
            ? function (t, e) {
                for (
                  var i = r(t), l = arguments.length, c = 1, u = o.f, h = s.f;
                  l > c;

                )
                  for (
                    var d,
                      p = a(arguments[c++]),
                      f = u ? n(p).concat(u(p)) : n(p),
                      m = f.length,
                      g = 0;
                    m > g;

                  )
                    h.call(p, (d = f[g++])) && (i[d] = p[d]);
                return i;
              }
            : l;
      },
      function (t, e, i) {
        "use strict";
        (function (t) {
          var i = "object" == typeof t && t && t.Object === Object && t;
          e.a = i;
        }).call(this, i(99));
      },
      function (t, e, i) {
        t.exports = i(100);
      },
      function (t, e, i) {
        i(22), i(26), i(34), i(71), i(76), i(78), i(79), (t.exports = i(3).Map);
      },
      function (t, e, i) {
        t.exports = i(25)("native-function-to-string", Function.toString);
      },
      function (t, e, i) {
        var n = i(27),
          o = i(28);
        t.exports = function (t) {
          return function (e, i) {
            var s,
              r,
              a = String(o(e)),
              l = n(i),
              c = a.length;
            return l < 0 || l >= c
              ? t
                ? ""
                : void 0
              : (s = a.charCodeAt(l)) < 55296 ||
                s > 56319 ||
                l + 1 === c ||
                (r = a.charCodeAt(l + 1)) < 56320 ||
                r > 57343
              ? t
                ? a.charAt(l)
                : s
              : t
              ? a.slice(l, l + 2)
              : r - 56320 + ((s - 55296) << 10) + 65536;
          };
        };
      },
      function (t, e, i) {
        "use strict";
        var n = i(45),
          o = i(17),
          s = i(33),
          r = {};
        i(11)(r, i(0)("iterator"), function () {
          return this;
        }),
          (t.exports = function (t, e, i) {
            (t.prototype = n(r, { next: o(1, i) })), s(t, e + " Iterator");
          });
      },
      function (t, e, i) {
        var n = i(6),
          o = i(7),
          s = i(30);
        t.exports = i(8)
          ? Object.defineProperties
          : function (t, e) {
              o(t);
              for (var i, r = s(e), a = r.length, l = 0; a > l; )
                n.f(t, (i = r[l++]), e[i]);
              return t;
            };
      },
      function (t, e, i) {
        var n = i(9),
          o = i(18),
          s = i(65)(!1),
          r = i(32)("IE_PROTO");
        t.exports = function (t, e) {
          var i,
            a = o(t),
            l = 0,
            c = [];
          for (i in a) i != r && n(a, i) && c.push(i);
          for (; e.length > l; ) n(a, (i = e[l++])) && (~s(c, i) || c.push(i));
          return c;
        };
      },
      function (t, e, i) {
        var n = i(18),
          o = i(19),
          s = i(66);
        t.exports = function (t) {
          return function (e, i, r) {
            var a,
              l = n(e),
              c = o(l.length),
              u = s(r, c);
            if (t && i != i) {
              for (; c > u; ) if ((a = l[u++]) != a) return !0;
            } else
              for (; c > u; u++)
                if ((t || u in l) && l[u] === i) return t || u || 0;
            return !t && -1;
          };
        };
      },
      function (t, e, i) {
        var n = i(27),
          o = Math.max,
          s = Math.min;
        t.exports = function (t, e) {
          return (t = n(t)) < 0 ? o(t + e, 0) : s(t, e);
        };
      },
      function (t, e, i) {
        var n = i(2).document;
        t.exports = n && n.documentElement;
      },
      function (t, e, i) {
        var n = i(9),
          o = i(20),
          s = i(32)("IE_PROTO"),
          r = Object.prototype;
        t.exports =
          Object.getPrototypeOf ||
          function (t) {
            return (
              (t = o(t)),
              n(t, s)
                ? t[s]
                : "function" == typeof t.constructor &&
                  t instanceof t.constructor
                ? t.constructor.prototype
                : t instanceof Object
                ? r
                : null
            );
          };
      },
      function (t, e, i) {
        "use strict";
        var n = i(70),
          o = i(47),
          s = i(14),
          r = i(18);
        (t.exports = i(29)(
          Array,
          "Array",
          function (t, e) {
            (this._t = r(t)), (this._i = 0), (this._k = e);
          },
          function () {
            var t = this._t,
              e = this._k,
              i = this._i++;
            return !t || i >= t.length
              ? ((this._t = void 0), o(1))
              : o(0, "keys" == e ? i : "values" == e ? t[i] : [i, t[i]]);
          },
          "values"
        )),
          (s.Arguments = s.Array),
          n("keys"),
          n("values"),
          n("entries");
      },
      function (t, e, i) {
        var n = i(0)("unscopables"),
          o = Array.prototype;
        null == o[n] && i(11)(o, n, {}),
          (t.exports = function (t) {
            o[n][t] = !0;
          });
      },
      function (t, e, i) {
        "use strict";
        var n = i(48),
          o = i(12);
        t.exports = i(37)(
          "Map",
          function (t) {
            return function () {
              return t(this, arguments.length > 0 ? arguments[0] : void 0);
            };
          },
          {
            get: function (t) {
              var e = n.getEntry(o(this, "Map"), t);
              return e && e.v;
            },
            set: function (t, e) {
              return n.def(o(this, "Map"), 0 === t ? 0 : t, e);
            },
          },
          n,
          !0
        );
      },
      function (t, e, i) {
        "use strict";
        var n = i(2),
          o = i(6),
          s = i(8),
          r = i(0)("species");
        t.exports = function (t) {
          var e = n[t];
          s &&
            e &&
            !e[r] &&
            o.f(e, r, {
              configurable: !0,
              get: function () {
                return this;
              },
            });
        };
      },
      function (t, e, i) {
        var n = i(1),
          o = i(74).set;
        t.exports = function (t, e, i) {
          var s,
            r = e.constructor;
          return (
            r !== i &&
              "function" == typeof r &&
              (s = r.prototype) !== i.prototype &&
              n(s) &&
              o &&
              o(t, s),
            t
          );
        };
      },
      function (t, e, i) {
        var n = i(1),
          o = i(7),
          s = function (t, e) {
            if ((o(t), !n(e) && null !== e))
              throw TypeError(e + ": can't set as prototype!");
          };
        t.exports = {
          set:
            Object.setPrototypeOf ||
            ("__proto__" in {}
              ? (function (t, e, n) {
                  try {
                    (n = i(10)(
                      Function.call,
                      i(75).f(Object.prototype, "__proto__").set,
                      2
                    ))(t, []),
                      (e = !(t instanceof Array));
                  } catch (t) {
                    e = !0;
                  }
                  return function (t, i) {
                    return s(t, i), e ? (t.__proto__ = i) : n(t, i), t;
                  };
                })({}, !1)
              : void 0),
          check: s,
        };
      },
      function (t, e, i) {
        var n = i(53),
          o = i(17),
          s = i(18),
          r = i(43),
          a = i(9),
          l = i(41),
          c = Object.getOwnPropertyDescriptor;
        e.f = i(8)
          ? c
          : function (t, e) {
              if (((t = s(t)), (e = r(e, !0)), l))
                try {
                  return c(t, e);
                } catch (t) {}
              if (a(t, e)) return o(!n.f.call(t, e), t[e]);
            };
      },
      function (t, e, i) {
        var n = i(4);
        n(n.P + n.R, "Map", { toJSON: i(54)("Map") });
      },
      function (t, e, i) {
        var n = i(15);
        t.exports = function (t, e) {
          var i = [];
          return n(t, !1, i.push, i, e), i;
        };
      },
      function (t, e, i) {
        i(38)("Map");
      },
      function (t, e, i) {
        i(39)("Map");
      },
      function (t, e, i) {
        i(22), i(26), i(34), i(81), i(82), i(83), i(84), (t.exports = i(3).Set);
      },
      function (t, e, i) {
        "use strict";
        var n = i(48),
          o = i(12);
        t.exports = i(37)(
          "Set",
          function (t) {
            return function () {
              return t(this, arguments.length > 0 ? arguments[0] : void 0);
            };
          },
          {
            add: function (t) {
              return n.def(o(this, "Set"), (t = 0 === t ? 0 : t), t);
            },
          },
          n
        );
      },
      function (t, e, i) {
        var n = i(4);
        n(n.P + n.R, "Set", { toJSON: i(54)("Set") });
      },
      function (t, e, i) {
        i(38)("Set");
      },
      function (t, e, i) {
        i(39)("Set");
      },
      function (t, e, i) {
        i(22), i(34), i(86), i(92), i(93), (t.exports = i(3).WeakMap);
      },
      function (t, e, i) {
        "use strict";
        var n,
          o = i(2),
          s = i(55)(0),
          r = i(5),
          a = i(21),
          l = i(56),
          c = i(91),
          u = i(1),
          h = i(12),
          d = i(12),
          p = !o.ActiveXObject && "ActiveXObject" in o,
          f = a.getWeak,
          m = Object.isExtensible,
          g = c.ufstore,
          v = function (t) {
            return function () {
              return t(this, arguments.length > 0 ? arguments[0] : void 0);
            };
          },
          y = {
            get: function (t) {
              if (u(t)) {
                var e = f(t);
                return !0 === e
                  ? g(h(this, "WeakMap")).get(t)
                  : e
                  ? e[this._i]
                  : void 0;
              }
            },
            set: function (t, e) {
              return c.def(h(this, "WeakMap"), t, e);
            },
          },
          _ = (t.exports = i(37)("WeakMap", v, y, c, !0, !0));
        d &&
          p &&
          (l((n = c.getConstructor(v, "WeakMap")).prototype, y),
          (a.NEED = !0),
          s(["delete", "has", "get", "set"], function (t) {
            var e = _.prototype,
              i = e[t];
            r(e, t, function (e, o) {
              if (u(e) && !m(e)) {
                this._f || (this._f = new n());
                var s = this._f[t](e, o);
                return "set" == t ? this : s;
              }
              return i.call(this, e, o);
            });
          }));
      },
      function (t, e, i) {
        var n = i(88);
        t.exports = function (t, e) {
          return new (n(t))(e);
        };
      },
      function (t, e, i) {
        var n = i(1),
          o = i(89),
          s = i(0)("species");
        t.exports = function (t) {
          var e;
          return (
            o(t) &&
              ("function" != typeof (e = t.constructor) ||
                (e !== Array && !o(e.prototype)) ||
                (e = void 0),
              n(e) && null === (e = e[s]) && (e = void 0)),
            void 0 === e ? Array : e
          );
        };
      },
      function (t, e, i) {
        var n = i(24);
        t.exports =
          Array.isArray ||
          function (t) {
            return "Array" == n(t);
          };
      },
      function (t, e) {
        e.f = Object.getOwnPropertySymbols;
      },
      function (t, e, i) {
        "use strict";
        var n = i(35),
          o = i(21).getWeak,
          s = i(7),
          r = i(1),
          a = i(36),
          l = i(15),
          c = i(55),
          u = i(9),
          h = i(12),
          d = c(5),
          p = c(6),
          f = 0,
          m = function (t) {
            return t._l || (t._l = new g());
          },
          g = function () {
            this.a = [];
          },
          v = function (t, e) {
            return d(t.a, function (t) {
              return t[0] === e;
            });
          };
        (g.prototype = {
          get: function (t) {
            var e = v(this, t);
            if (e) return e[1];
          },
          has: function (t) {
            return !!v(this, t);
          },
          set: function (t, e) {
            var i = v(this, t);
            i ? (i[1] = e) : this.a.push([t, e]);
          },
          delete: function (t) {
            var e = p(this.a, function (e) {
              return e[0] === t;
            });
            return ~e && this.a.splice(e, 1), !!~e;
          },
        }),
          (t.exports = {
            getConstructor: function (t, e, i, s) {
              var c = t(function (t, n) {
                a(t, c, e, "_i"),
                  (t._t = e),
                  (t._i = f++),
                  (t._l = void 0),
                  null != n && l(n, i, t[s], t);
              });
              return (
                n(c.prototype, {
                  delete: function (t) {
                    if (!r(t)) return !1;
                    var i = o(t);
                    return !0 === i
                      ? m(h(this, e)).delete(t)
                      : i && u(i, this._i) && delete i[this._i];
                  },
                  has: function (t) {
                    if (!r(t)) return !1;
                    var i = o(t);
                    return !0 === i ? m(h(this, e)).has(t) : i && u(i, this._i);
                  },
                }),
                c
              );
            },
            def: function (t, e, i) {
              var n = o(s(e), !0);
              return !0 === n ? m(t).set(e, i) : (n[t._i] = i), t;
            },
            ufstore: m,
          });
      },
      function (t, e, i) {
        i(38)("WeakMap");
      },
      function (t, e, i) {
        i(39)("WeakMap");
      },
      function (t, e, i) {
        i(26), i(95), (t.exports = i(3).Array.from);
      },
      function (t, e, i) {
        "use strict";
        var n = i(10),
          o = i(4),
          s = i(20),
          r = i(49),
          a = i(50),
          l = i(19),
          c = i(96),
          u = i(51);
        o(
          o.S +
            o.F *
              !i(52)(function (t) {
                Array.from(t);
              }),
          "Array",
          {
            from: function (t) {
              var e,
                i,
                o,
                h,
                d = s(t),
                p = "function" == typeof this ? this : Array,
                f = arguments.length,
                m = f > 1 ? arguments[1] : void 0,
                g = void 0 !== m,
                v = 0,
                y = u(d);
              if (
                (g && (m = n(m, f > 2 ? arguments[2] : void 0, 2)),
                null == y || (p == Array && a(y)))
              )
                for (i = new p((e = l(d.length))); e > v; v++)
                  c(i, v, g ? m(d[v], v) : d[v]);
              else
                for (h = y.call(d), i = new p(); !(o = h.next()).done; v++)
                  c(i, v, g ? r(h, m, [o.value, v], !0) : o.value);
              return (i.length = v), i;
            },
          }
        );
      },
      function (t, e, i) {
        "use strict";
        var n = i(6),
          o = i(17);
        t.exports = function (t, e, i) {
          e in t ? n.f(t, e, o(0, i)) : (t[e] = i);
        };
      },
      function (t, e, i) {
        i(98), (t.exports = i(3).Object.assign);
      },
      function (t, e, i) {
        var n = i(4);
        n(n.S + n.F, "Object", { assign: i(56) });
      },
      function (t, e) {
        var i;
        i = (function () {
          return this;
        })();
        try {
          i = i || new Function("return this")();
        } catch (t) {
          "object" == typeof window && (i = window);
        }
        t.exports = i;
      },
      function (t, e, i) {
        "use strict";
        i.r(e);
        var n = {};
        i.r(n),
          i.d(n, "keyboardHandler", function () {
            return et;
          }),
          i.d(n, "mouseHandler", function () {
            return it;
          }),
          i.d(n, "resizeHandler", function () {
            return nt;
          }),
          i.d(n, "selectHandler", function () {
            return ot;
          }),
          i.d(n, "touchHandler", function () {
            return st;
          }),
          i.d(n, "wheelHandler", function () {
            return rt;
          });
        var o = function (t, e) {
            return (o =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          },
          s = function () {
            return (s =
              Object.assign ||
              function (t) {
                for (var e, i = 1, n = arguments.length; i < n; i++)
                  for (var o in (e = arguments[i]))
                    Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t;
              }).apply(this, arguments);
          };
        function r(t, e, i, n) {
          var o,
            s = arguments.length,
            r =
              s < 3
                ? e
                : null === n
                ? (n = Object.getOwnPropertyDescriptor(e, i))
                : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            r = Reflect.decorate(t, e, i, n);
          else
            for (var a = t.length - 1; a >= 0; a--)
              (o = t[a]) &&
                (r = (s < 3 ? o(r) : s > 3 ? o(e, i, r) : o(e, i)) || r);
          return s > 3 && r && Object.defineProperty(e, i, r), r;
        }
        i(59), i(80), i(85), i(94), i(97);
        var a = function (t) {
            var e = typeof t;
            return null != t && ("object" == e || "function" == e);
          },
          l = i(57),
          c = "object" == typeof self && self && self.Object === Object && self,
          u = l.a || c || Function("return this")(),
          h = u.Symbol,
          d = Object.prototype,
          p = d.hasOwnProperty,
          f = d.toString,
          m = h ? h.toStringTag : void 0,
          g = Object.prototype.toString,
          v = h ? h.toStringTag : void 0,
          y = /^\s+|\s+$/g,
          _ = /^[-+]0x[0-9a-f]+$/i,
          b = /^0b[01]+$/i,
          w = /^0o[0-7]+$/i,
          x = parseInt,
          T = function (t) {
            if ("number" == typeof t) return t;
            if (
              (function (t) {
                return (
                  "symbol" == typeof t ||
                  ((function (t) {
                    return null != t && "object" == typeof t;
                  })(t) &&
                    "[object Symbol]" ==
                      (function (t) {
                        return null == t
                          ? void 0 === t
                            ? "[object Undefined]"
                            : "[object Null]"
                          : v && v in Object(t)
                          ? (function (t) {
                              var e = p.call(t, m),
                                i = t[m];
                              try {
                                t[m] = void 0;
                                var n = !0;
                              } catch (t) {}
                              var o = f.call(t);
                              return n && (e ? (t[m] = i) : delete t[m]), o;
                            })(t)
                          : (function (t) {
                              return g.call(t);
                            })(t);
                      })(t))
                );
              })(t)
            )
              return NaN;
            if (a(t)) {
              var e = "function" == typeof t.valueOf ? t.valueOf() : t;
              t = a(e) ? e + "" : e;
            }
            if ("string" != typeof t) return 0 === t ? t : +t;
            t = t.replace(y, "");
            var i = b.test(t);
            return i || w.test(t)
              ? x(t.slice(2), i ? 2 : 8)
              : _.test(t)
              ? NaN
              : +t;
          },
          $ = function (t, e, i) {
            return (
              void 0 === i && ((i = e), (e = void 0)),
              void 0 !== i && (i = (i = T(i)) == i ? i : 0),
              void 0 !== e && (e = (e = T(e)) == e ? e : 0),
              (function (t, e, i) {
                return (
                  t == t &&
                    (void 0 !== i && (t = t <= i ? t : i),
                    void 0 !== e && (t = t >= e ? t : e)),
                  t
                );
              })(T(t), e, i)
            );
          };
        function S(t, e) {
          return (
            void 0 === t && (t = -1 / 0),
            void 0 === e && (e = 1 / 0),
            function (i, n) {
              var o = "_" + n;
              Object.defineProperty(i, n, {
                get: function () {
                  return this[o];
                },
                set: function (i) {
                  Object.defineProperty(this, o, {
                    value: $(i, t, e),
                    enumerable: !1,
                    writable: !0,
                    configurable: !0,
                  });
                },
                enumerable: !0,
                configurable: !0,
              });
            }
          );
        }
        function C(t, e) {
          var i = "_" + e;
          Object.defineProperty(t, e, {
            get: function () {
              return this[i];
            },
            set: function (t) {
              Object.defineProperty(this, i, {
                value: !!t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              });
            },
            enumerable: !0,
            configurable: !0,
          });
        }
        var k = function () {
            return u.Date.now();
          },
          P = Math.max,
          A = Math.min,
          E = function (t, e, i) {
            var n,
              o,
              s,
              r,
              l,
              c,
              u = 0,
              h = !1,
              d = !1,
              p = !0;
            if ("function" != typeof t)
              throw new TypeError("Expected a function");
            function f(e) {
              var i = n,
                s = o;
              return (n = o = void 0), (u = e), (r = t.apply(s, i));
            }
            function m(t) {
              var i = t - c;
              return void 0 === c || i >= e || i < 0 || (d && t - u >= s);
            }
            function g() {
              var t = k();
              if (m(t)) return v(t);
              l = setTimeout(
                g,
                (function (t) {
                  var i = e - (t - c);
                  return d ? A(i, s - (t - u)) : i;
                })(t)
              );
            }
            function v(t) {
              return (l = void 0), p && n ? f(t) : ((n = o = void 0), r);
            }
            function y() {
              var t = k(),
                i = m(t);
              if (((n = arguments), (o = this), (c = t), i)) {
                if (void 0 === l)
                  return (function (t) {
                    return (u = t), (l = setTimeout(g, e)), h ? f(t) : r;
                  })(c);
                if (d) return (l = setTimeout(g, e)), f(c);
              }
              return void 0 === l && (l = setTimeout(g, e)), r;
            }
            return (
              (e = T(e) || 0),
              a(i) &&
                ((h = !!i.leading),
                (s = (d = "maxWait" in i) ? P(T(i.maxWait) || 0, e) : s),
                (p = "trailing" in i ? !!i.trailing : p)),
              (y.cancel = function () {
                void 0 !== l && clearTimeout(l),
                  (u = 0),
                  (n = c = o = l = void 0);
              }),
              (y.flush = function () {
                return void 0 === l ? r : v(k());
              }),
              y
            );
          };
        function O() {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return function (e, i, n) {
            var o = n.value;
            return {
              get: function () {
                return (
                  this.hasOwnProperty(i) ||
                    Object.defineProperty(this, i, {
                      value: E.apply(void 0, [o].concat(t)),
                    }),
                  this[i]
                );
              },
            };
          };
        }
        var F,
          z = (function () {
            function t(t) {
              var e = this;
              void 0 === t && (t = {}),
                (this.damping = 0.1),
                (this.thumbMinSize = 20),
                (this.renderByPixels = !0),
                (this.alwaysShowTracks = !1),
                (this.continuousScrolling = !0),
                (this.delegateTo = null),
                (this.plugins = {}),
                Object.keys(t).forEach(function (i) {
                  e[i] = t[i];
                });
            }
            return (
              Object.defineProperty(t.prototype, "wheelEventTarget", {
                get: function () {
                  return this.delegateTo;
                },
                set: function (t) {
                  console.warn(
                    "[smooth-scrollbar]: `options.wheelEventTarget` is deprecated and will be removed in the future, use `options.delegateTo` instead."
                  ),
                    (this.delegateTo = t);
                },
                enumerable: !0,
                configurable: !0,
              }),
              r([S(0, 1)], t.prototype, "damping", void 0),
              r([S(0, 1 / 0)], t.prototype, "thumbMinSize", void 0),
              r([C], t.prototype, "renderByPixels", void 0),
              r([C], t.prototype, "alwaysShowTracks", void 0),
              r([C], t.prototype, "continuousScrolling", void 0),
              t
            );
          })(),
          M = new WeakMap();
        function L() {
          if (void 0 !== F) return F;
          var t = !1;
          try {
            var e = function () {},
              i = Object.defineProperty({}, "passive", {
                get: function () {
                  t = !0;
                },
              });
            window.addEventListener("testPassive", e, i),
              window.removeEventListener("testPassive", e, i);
          } catch (t) {}
          return (F = !!t && { passive: !1 });
        }
        function D(t) {
          var e = M.get(t) || [];
          return (
            M.set(t, e),
            function (t, i, n) {
              function o(t) {
                t.defaultPrevented || n(t);
              }
              i.split(/\s+/g).forEach(function (i) {
                e.push({ elem: t, eventName: i, handler: o }),
                  t.addEventListener(i, o, L());
              });
            }
          );
        }
        function R(t) {
          var e = (function (t) {
            return t.touches ? t.touches[t.touches.length - 1] : t;
          })(t);
          return { x: e.clientX, y: e.clientY };
        }
        function I(t, e) {
          return (
            void 0 === e && (e = []),
            e.some(function (e) {
              return t === e;
            })
          );
        }
        var j = ["webkit", "moz", "ms", "o"],
          H = new RegExp("^-(?!(?:" + j.join("|") + ")-)");
        function N(t, e) {
          (e = (function (t) {
            var e = {};
            return (
              Object.keys(t).forEach(function (i) {
                if (H.test(i)) {
                  var n = t[i];
                  (i = i.replace(/^-/, "")),
                    (e[i] = n),
                    j.forEach(function (t) {
                      e["-" + t + "-" + i] = n;
                    });
                } else e[i] = t[i];
              }),
              e
            );
          })(e)),
            Object.keys(e).forEach(function (i) {
              var n = i.replace(/^-/, "").replace(/-([a-z])/g, function (t, e) {
                return e.toUpperCase();
              });
              t.style[n] = e[i];
            });
        }
        var B,
          W = (function () {
            function t(t) {
              (this.updateTime = Date.now()),
                (this.delta = { x: 0, y: 0 }),
                (this.velocity = { x: 0, y: 0 }),
                (this.lastPosition = { x: 0, y: 0 }),
                (this.lastPosition = R(t));
            }
            return (
              (t.prototype.update = function (t) {
                var e = this.velocity,
                  i = this.updateTime,
                  n = this.lastPosition,
                  o = Date.now(),
                  s = R(t),
                  r = { x: -(s.x - n.x), y: -(s.y - n.y) },
                  a = o - i || 16,
                  l = (r.x / a) * 16,
                  c = (r.y / a) * 16;
                (e.x = 0.9 * l + 0.1 * e.x),
                  (e.y = 0.9 * c + 0.1 * e.y),
                  (this.delta = r),
                  (this.updateTime = o),
                  (this.lastPosition = s);
              }),
              t
            );
          })(),
          q = (function () {
            function t() {
              this._touchList = {};
            }
            return (
              Object.defineProperty(t.prototype, "_primitiveValue", {
                get: function () {
                  return { x: 0, y: 0 };
                },
                enumerable: !0,
                configurable: !0,
              }),
              (t.prototype.isActive = function () {
                return void 0 !== this._activeTouchID;
              }),
              (t.prototype.getDelta = function () {
                var t = this._getActiveTracker();
                return t ? s({}, t.delta) : this._primitiveValue;
              }),
              (t.prototype.getVelocity = function () {
                var t = this._getActiveTracker();
                return t ? s({}, t.velocity) : this._primitiveValue;
              }),
              (t.prototype.track = function (t) {
                var e = this,
                  i = t.targetTouches;
                return (
                  Array.from(i).forEach(function (t) {
                    e._add(t);
                  }),
                  this._touchList
                );
              }),
              (t.prototype.update = function (t) {
                var e = this,
                  i = t.touches,
                  n = t.changedTouches;
                return (
                  Array.from(i).forEach(function (t) {
                    e._renew(t);
                  }),
                  this._setActiveID(n),
                  this._touchList
                );
              }),
              (t.prototype.release = function (t) {
                var e = this;
                delete this._activeTouchID,
                  Array.from(t.changedTouches).forEach(function (t) {
                    e._delete(t);
                  });
              }),
              (t.prototype._add = function (t) {
                if (!this._has(t)) {
                  var e = new W(t);
                  this._touchList[t.identifier] = e;
                }
              }),
              (t.prototype._renew = function (t) {
                this._has(t) && this._touchList[t.identifier].update(t);
              }),
              (t.prototype._delete = function (t) {
                delete this._touchList[t.identifier];
              }),
              (t.prototype._has = function (t) {
                return this._touchList.hasOwnProperty(t.identifier);
              }),
              (t.prototype._setActiveID = function (t) {
                this._activeTouchID = t[t.length - 1].identifier;
              }),
              (t.prototype._getActiveTracker = function () {
                return this._touchList[this._activeTouchID];
              }),
              t
            );
          })();
        !(function (t) {
          (t.X = "x"), (t.Y = "y");
        })(B || (B = {}));
        var X = (function () {
            function t(t, e) {
              void 0 === e && (e = 0),
                (this._direction = t),
                (this._minSize = e),
                (this.element = document.createElement("div")),
                (this.displaySize = 0),
                (this.realSize = 0),
                (this.offset = 0),
                (this.element.className =
                  "scrollbar-thumb scrollbar-thumb-" + t);
            }
            return (
              (t.prototype.attachTo = function (t) {
                t.appendChild(this.element);
              }),
              (t.prototype.update = function (t, e, i) {
                (this.realSize = Math.min(e / i, 1) * e),
                  (this.displaySize = Math.max(this.realSize, this._minSize)),
                  (this.offset =
                    (t / i) * (e + (this.realSize - this.displaySize))),
                  N(this.element, this._getStyle());
              }),
              (t.prototype._getStyle = function () {
                switch (this._direction) {
                  case B.X:
                    return {
                      width: this.displaySize + "px",
                      "-transform": "translate3d(" + this.offset + "px, 0, 0)",
                    };
                  case B.Y:
                    return {
                      height: this.displaySize + "px",
                      "-transform": "translate3d(0, " + this.offset + "px, 0)",
                    };
                  default:
                    return null;
                }
              }),
              t
            );
          })(),
          V = (function () {
            function t(t, e) {
              void 0 === e && (e = 0),
                (this.element = document.createElement("div")),
                (this._isShown = !1),
                (this.element.className =
                  "scrollbar-track scrollbar-track-" + t),
                (this.thumb = new X(t, e)),
                this.thumb.attachTo(this.element);
            }
            return (
              (t.prototype.attachTo = function (t) {
                t.appendChild(this.element);
              }),
              (t.prototype.show = function () {
                this._isShown ||
                  ((this._isShown = !0), this.element.classList.add("show"));
              }),
              (t.prototype.hide = function () {
                this._isShown &&
                  ((this._isShown = !1), this.element.classList.remove("show"));
              }),
              (t.prototype.update = function (t, e, i) {
                N(this.element, { display: i <= e ? "none" : "block" }),
                  this.thumb.update(t, e, i);
              }),
              t
            );
          })(),
          Y = (function () {
            function t(t) {
              this._scrollbar = t;
              var e = t.options.thumbMinSize;
              (this.xAxis = new V(B.X, e)),
                (this.yAxis = new V(B.Y, e)),
                this.xAxis.attachTo(t.containerEl),
                this.yAxis.attachTo(t.containerEl),
                t.options.alwaysShowTracks &&
                  (this.xAxis.show(), this.yAxis.show());
            }
            return (
              (t.prototype.update = function () {
                var t = this._scrollbar,
                  e = t.size,
                  i = t.offset;
                this.xAxis.update(i.x, e.container.width, e.content.width),
                  this.yAxis.update(i.y, e.container.height, e.content.height);
              }),
              (t.prototype.autoHideOnIdle = function () {
                this._scrollbar.options.alwaysShowTracks ||
                  (this.xAxis.hide(), this.yAxis.hide());
              }),
              r([O(300)], t.prototype, "autoHideOnIdle", null),
              t
            );
          })(),
          U = new WeakMap();
        function Q(t) {
          return Math.pow(t - 1, 3) + 1;
        }
        var G,
          Z,
          K,
          J = (function () {
            function t(t, e) {
              var i = this.constructor;
              (this.scrollbar = t),
                (this.name = i.pluginName),
                (this.options = s({}, i.defaultOptions, e));
            }
            return (
              (t.prototype.onInit = function () {}),
              (t.prototype.onDestory = function () {}),
              (t.prototype.onUpdate = function () {}),
              (t.prototype.onRender = function (t) {}),
              (t.prototype.transformDelta = function (t, e) {
                return s({}, t);
              }),
              (t.pluginName = ""),
              (t.defaultOptions = {}),
              t
            );
          })(),
          tt = { order: new Set(), constructors: {} };
        function et(t) {
          var e = D(t),
            i = t.containerEl;
          e(i, "keydown", function (e) {
            var n = document.activeElement;
            if (
              (n === i || i.contains(n)) &&
              !(function (t) {
                return (
                  ("INPUT" === t.tagName || "TEXTAREA" === t.tagName) &&
                  !t.disabled
                );
              })(n)
            ) {
              var o = (function (t, e) {
                var i = t.size,
                  n = t.limit,
                  o = t.offset;
                switch (e) {
                  case G.TAB:
                    return (function (t) {
                      requestAnimationFrame(function () {
                        t.scrollIntoView(document.activeElement, {
                          offsetTop: t.size.container.height / 2,
                          onlyScrollIfNeeded: !0,
                        });
                      });
                    })(t);
                  case G.SPACE:
                    return [0, 200];
                  case G.PAGE_UP:
                    return [0, 40 - i.container.height];
                  case G.PAGE_DOWN:
                    return [0, i.container.height - 40];
                  case G.END:
                    return [0, n.y - o.y];
                  case G.HOME:
                    return [0, -o.y];
                  case G.LEFT:
                    return [-40, 0];
                  case G.UP:
                    return [0, -40];
                  case G.RIGHT:
                    return [40, 0];
                  case G.DOWN:
                    return [0, 40];
                  default:
                    return null;
                }
              })(t, e.keyCode || e.which);
              if (o) {
                var s = o[0],
                  r = o[1];
                t.addTransformableMomentum(s, r, e, function (i) {
                  i
                    ? e.preventDefault()
                    : (t.containerEl.blur(),
                      t.parent && t.parent.containerEl.focus());
                });
              }
            }
          });
        }
        function it(t) {
          var e,
            i,
            n,
            o,
            s,
            r = D(t),
            a = t.containerEl,
            l = t.track,
            c = l.xAxis,
            u = l.yAxis;
          function h(e, i) {
            var n = t.size;
            return e === Z.X
              ? (i /
                  (n.container.width +
                    (c.thumb.realSize - c.thumb.displaySize))) *
                  n.content.width
              : e === Z.Y
              ? (i /
                  (n.container.height +
                    (u.thumb.realSize - u.thumb.displaySize))) *
                n.content.height
              : 0;
          }
          function d(t) {
            return I(t, [c.element, c.thumb.element])
              ? Z.X
              : I(t, [u.element, u.thumb.element])
              ? Z.Y
              : void 0;
          }
          r(a, "click", function (e) {
            if (!i && I(e.target, [c.element, u.element])) {
              var n = e.target,
                o = d(n),
                s = n.getBoundingClientRect(),
                r = R(e),
                a = t.offset,
                l = t.limit;
              if (o === Z.X) {
                var p = r.x - s.left - c.thumb.displaySize / 2;
                t.setMomentum($(h(o, p) - a.x, -a.x, l.x - a.x), 0);
              }
              o === Z.Y &&
                ((p = r.y - s.top - u.thumb.displaySize / 2),
                t.setMomentum(0, $(h(o, p) - a.y, -a.y, l.y - a.y)));
            }
          }),
            r(a, "mousedown", function (i) {
              if (I(i.target, [c.thumb.element, u.thumb.element])) {
                e = !0;
                var r = i.target,
                  l = R(i),
                  h = r.getBoundingClientRect();
                (o = d(r)),
                  (n = { x: l.x - h.left, y: l.y - h.top }),
                  (s = a.getBoundingClientRect()),
                  N(t.containerEl, { "-user-select": "none" });
              }
            }),
            r(window, "mousemove", function (r) {
              if (e) {
                i = !0;
                var a = t.offset,
                  l = R(r);
                if (o === Z.X) {
                  var c = l.x - n.x - s.left;
                  t.setPosition(h(o, c), a.y);
                }
                o === Z.Y &&
                  ((c = l.y - n.y - s.top), t.setPosition(a.x, h(o, c)));
              }
            }),
            r(window, "mouseup blur", function () {
              (e = i = !1), N(t.containerEl, { "-user-select": "" });
            });
        }
        function nt(t) {
          D(t)(window, "resize", E(t.update.bind(t), 300));
        }
        function ot(t) {
          var e,
            i = D(t),
            n = t.containerEl,
            o = t.contentEl,
            s = t.offset,
            r = t.limit,
            a = !1;
          i(window, "mousemove", function (i) {
            a &&
              (cancelAnimationFrame(e),
              (function i(n) {
                var o = n.x,
                  a = n.y;
                (o || a) &&
                  (t.setMomentum(
                    $(s.x + o, 0, r.x) - s.x,
                    $(s.y + a, 0, r.y) - s.y
                  ),
                  (e = requestAnimationFrame(function () {
                    i({ x: o, y: a });
                  })));
              })(
                (function (t, e) {
                  var i = t.bounding,
                    n = i.top,
                    o = i.right,
                    s = i.bottom,
                    r = i.left,
                    a = R(e),
                    l = a.x,
                    c = a.y,
                    u = { x: 0, y: 0 };
                  return 0 === l && 0 === c
                    ? u
                    : (l > o - 20
                        ? (u.x = l - o + 20)
                        : l < r + 20 && (u.x = l - r - 20),
                      c > s - 20
                        ? (u.y = c - s + 20)
                        : c < n + 20 && (u.y = c - n - 20),
                      (u.x *= 2),
                      (u.y *= 2),
                      u);
                })(t, i)
              ));
          }),
            i(o, "selectstart", function (t) {
              t.stopPropagation(), cancelAnimationFrame(e), (a = !0);
            }),
            i(window, "mouseup blur", function () {
              cancelAnimationFrame(e), (a = !1);
            }),
            i(n, "scroll", function (t) {
              t.preventDefault(), (n.scrollTop = n.scrollLeft = 0);
            });
        }
        function st(t) {
          var e,
            i = /Android/.test(navigator.userAgent) ? 3 : 2,
            n = t.options.delegateTo || t.containerEl,
            o = new q(),
            s = D(t),
            r = 0;
          s(n, "touchstart", function (i) {
            o.track(i),
              t.setMomentum(0, 0),
              0 === r &&
                ((e = t.options.damping),
                (t.options.damping = Math.max(e, 0.5))),
              r++;
          }),
            s(n, "touchmove", function (e) {
              if (!K || K === t) {
                o.update(e);
                var i = o.getDelta(),
                  n = i.x,
                  s = i.y;
                t.addTransformableMomentum(n, s, e, function (i) {
                  i && (e.preventDefault(), (K = t));
                });
              }
            }),
            s(n, "touchcancel touchend", function (n) {
              var s = o.getVelocity(),
                a = { x: 0, y: 0 };
              Object.keys(s).forEach(function (t) {
                var n = s[t] / e;
                a[t] = Math.abs(n) < 50 ? 0 : n * i;
              }),
                t.addTransformableMomentum(a.x, a.y, n),
                0 == --r && (t.options.damping = e),
                o.release(n),
                (K = null);
            });
        }
        function rt(t) {
          D(t)(
            t.options.delegateTo || t.containerEl,
            "onwheel" in window ||
              document.implementation.hasFeature("Events.wheel", "3.0")
              ? "wheel"
              : "mousewheel",
            function (e) {
              var i = (function (t) {
                  if ("deltaX" in t) {
                    var e = ct(t.deltaMode);
                    return {
                      x: (t.deltaX / at.STANDARD) * e,
                      y: (t.deltaY / at.STANDARD) * e,
                    };
                  }
                  return "wheelDeltaX" in t
                    ? {
                        x: t.wheelDeltaX / at.OTHERS,
                        y: t.wheelDeltaY / at.OTHERS,
                      }
                    : { x: 0, y: t.wheelDelta / at.OTHERS };
                })(e),
                n = i.x,
                o = i.y;
              t.addTransformableMomentum(n, o, e, function (t) {
                t && e.preventDefault();
              });
            }
          );
        }
        !(function (t) {
          (t[(t.TAB = 9)] = "TAB"),
            (t[(t.SPACE = 32)] = "SPACE"),
            (t[(t.PAGE_UP = 33)] = "PAGE_UP"),
            (t[(t.PAGE_DOWN = 34)] = "PAGE_DOWN"),
            (t[(t.END = 35)] = "END"),
            (t[(t.HOME = 36)] = "HOME"),
            (t[(t.LEFT = 37)] = "LEFT"),
            (t[(t.UP = 38)] = "UP"),
            (t[(t.RIGHT = 39)] = "RIGHT"),
            (t[(t.DOWN = 40)] = "DOWN");
        })(G || (G = {})),
          (function (t) {
            (t[(t.X = 0)] = "X"), (t[(t.Y = 1)] = "Y");
          })(Z || (Z = {}));
        var at = { STANDARD: 1, OTHERS: -3 },
          lt = [1, 28, 500],
          ct = function (t) {
            return lt[t] || lt[0];
          },
          ut = new Map(),
          ht = (function () {
            function t(t, e) {
              var i = this;
              (this.offset = { x: 0, y: 0 }),
                (this.limit = { x: 1 / 0, y: 1 / 0 }),
                (this.bounding = { top: 0, right: 0, bottom: 0, left: 0 }),
                (this._plugins = []),
                (this._momentum = { x: 0, y: 0 }),
                (this._listeners = new Set()),
                (this.containerEl = t);
              var n = (this.contentEl = document.createElement("div"));
              (this.options = new z(e)),
                t.setAttribute("data-scrollbar", "true"),
                t.setAttribute("tabindex", "-1"),
                N(t, { overflow: "hidden", outline: "none" }),
                window.navigator.msPointerEnabled &&
                  (t.style.msTouchAction = "none"),
                (n.className = "scroll-content"),
                Array.from(t.childNodes).forEach(function (t) {
                  n.appendChild(t);
                }),
                t.appendChild(n),
                (this.track = new Y(this)),
                (this.size = this.getSize()),
                (this._plugins = (function (t, e) {
                  return Array.from(tt.order)
                    .filter(function (t) {
                      return !1 !== e[t];
                    })
                    .map(function (i) {
                      var n = new (0, tt.constructors[i])(t, e[i]);
                      return (e[i] = n.options), n;
                    });
                })(this, this.options.plugins));
              var o = t.scrollLeft,
                s = t.scrollTop;
              (t.scrollLeft = t.scrollTop = 0),
                this.setPosition(o, s, { withoutCallbacks: !0 });
              var r = window,
                a =
                  r.MutationObserver ||
                  r.WebKitMutationObserver ||
                  r.MozMutationObserver;
              "function" == typeof a &&
                ((this._observer = new a(function () {
                  i.update();
                })),
                this._observer.observe(n, { subtree: !0, childList: !0 })),
                ut.set(t, this),
                requestAnimationFrame(function () {
                  i._init();
                });
            }
            return (
              Object.defineProperty(t.prototype, "parent", {
                get: function () {
                  for (var t = this.containerEl.parentElement; t; ) {
                    var e = ut.get(t);
                    if (e) return e;
                    t = t.parentElement;
                  }
                  return null;
                },
                enumerable: !0,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "scrollTop", {
                get: function () {
                  return this.offset.y;
                },
                set: function (t) {
                  this.setPosition(this.scrollLeft, t);
                },
                enumerable: !0,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "scrollLeft", {
                get: function () {
                  return this.offset.x;
                },
                set: function (t) {
                  this.setPosition(t, this.scrollTop);
                },
                enumerable: !0,
                configurable: !0,
              }),
              (t.prototype.getSize = function () {
                return (
                  (t = this.containerEl),
                  (e = this.contentEl),
                  {
                    container: { width: t.clientWidth, height: t.clientHeight },
                    content: {
                      width: e.offsetWidth - e.clientWidth + e.scrollWidth,
                      height: e.offsetHeight - e.clientHeight + e.scrollHeight,
                    },
                  }
                );
                var t, e;
              }),
              (t.prototype.update = function () {
                var t, e, i, n, o;
                (e = (t = this).getSize()),
                  (i = {
                    x: Math.max(e.content.width - e.container.width, 0),
                    y: Math.max(e.content.height - e.container.height, 0),
                  }),
                  (n = t.containerEl.getBoundingClientRect()),
                  (o = {
                    top: Math.max(n.top, 0),
                    right: Math.min(n.right, window.innerWidth),
                    bottom: Math.min(n.bottom, window.innerHeight),
                    left: Math.max(n.left, 0),
                  }),
                  (t.size = e),
                  (t.limit = i),
                  (t.bounding = o),
                  t.track.update(),
                  t.setPosition(),
                  this._plugins.forEach(function (t) {
                    t.onUpdate();
                  });
              }),
              (t.prototype.isVisible = function (t) {
                return (function (t, e) {
                  var i = t.bounding,
                    n = e.getBoundingClientRect(),
                    o = Math.max(i.top, n.top),
                    s = Math.max(i.left, n.left),
                    r = Math.min(i.right, n.right);
                  return o < Math.min(i.bottom, n.bottom) && s < r;
                })(this, t);
              }),
              (t.prototype.setPosition = function (t, e, i) {
                var n = this;
                void 0 === t && (t = this.offset.x),
                  void 0 === e && (e = this.offset.y),
                  void 0 === i && (i = {});
                var o = (function (t, e, i) {
                  var n = t.options,
                    o = t.offset,
                    r = t.limit,
                    a = t.track,
                    l = t.contentEl;
                  return (
                    n.renderByPixels &&
                      ((e = Math.round(e)), (i = Math.round(i))),
                    (e = $(e, 0, r.x)),
                    (i = $(i, 0, r.y)),
                    e !== o.x && a.xAxis.show(),
                    i !== o.y && a.yAxis.show(),
                    n.alwaysShowTracks || a.autoHideOnIdle(),
                    e === o.x && i === o.y
                      ? null
                      : ((o.x = e),
                        (o.y = i),
                        N(l, {
                          "-transform":
                            "translate3d(" + -e + "px, " + -i + "px, 0)",
                        }),
                        a.update(),
                        { offset: s({}, o), limit: s({}, r) })
                  );
                })(this, t, e);
                o &&
                  !i.withoutCallbacks &&
                  this._listeners.forEach(function (t) {
                    t.call(n, o);
                  });
              }),
              (t.prototype.scrollTo = function (t, e, i, n) {
                void 0 === t && (t = this.offset.x),
                  void 0 === e && (e = this.offset.y),
                  void 0 === i && (i = 0),
                  void 0 === n && (n = {}),
                  (function (t, e, i, n, o) {
                    void 0 === n && (n = 0);
                    var s = void 0 === o ? {} : o,
                      r = s.easing,
                      a = void 0 === r ? Q : r,
                      l = s.callback,
                      c = t.options,
                      u = t.offset,
                      h = t.limit;
                    c.renderByPixels &&
                      ((e = Math.round(e)), (i = Math.round(i)));
                    var d = u.x,
                      p = u.y,
                      f = $(e, 0, h.x) - d,
                      m = $(i, 0, h.y) - p,
                      g = Date.now();
                    cancelAnimationFrame(U.get(t)),
                      (function e() {
                        var i = Date.now() - g,
                          o = n ? a(Math.min(i / n, 1)) : 1;
                        if ((t.setPosition(d + f * o, p + m * o), i >= n))
                          "function" == typeof l && l.call(t);
                        else {
                          var s = requestAnimationFrame(e);
                          U.set(t, s);
                        }
                      })();
                  })(this, t, e, i, n);
              }),
              (t.prototype.scrollIntoView = function (t, e) {
                void 0 === e && (e = {}),
                  (function (t, e, i) {
                    var n = void 0 === i ? {} : i,
                      o = n.alignToTop,
                      s = void 0 === o || o,
                      r = n.onlyScrollIfNeeded,
                      a = void 0 !== r && r,
                      l = n.offsetTop,
                      c = void 0 === l ? 0 : l,
                      u = n.offsetLeft,
                      h = void 0 === u ? 0 : u,
                      d = n.offsetBottom,
                      p = void 0 === d ? 0 : d,
                      f = t.containerEl,
                      m = t.bounding,
                      g = t.offset,
                      v = t.limit;
                    if (e && f.contains(e)) {
                      var y = e.getBoundingClientRect();
                      if (!a || !t.isVisible(e)) {
                        var _ = s ? y.top - m.top - c : y.bottom - m.bottom + p;
                        t.setMomentum(
                          y.left - m.left - h,
                          $(_, -g.y, v.y - g.y)
                        );
                      }
                    }
                  })(this, t, e);
              }),
              (t.prototype.addListener = function (t) {
                if ("function" != typeof t)
                  throw new TypeError(
                    "[smooth-scrollbar] scrolling listener should be a function"
                  );
                this._listeners.add(t);
              }),
              (t.prototype.removeListener = function (t) {
                this._listeners.delete(t);
              }),
              (t.prototype.addTransformableMomentum = function (t, e, i, n) {
                this._updateDebounced();
                var o = this._plugins.reduce(
                    function (t, e) {
                      return e.transformDelta(t, i) || t;
                    },
                    { x: t, y: e }
                  ),
                  s = !this._shouldPropagateMomentum(o.x, o.y);
                s && this.addMomentum(o.x, o.y), n && n.call(this, s);
              }),
              (t.prototype.addMomentum = function (t, e) {
                this.setMomentum(this._momentum.x + t, this._momentum.y + e);
              }),
              (t.prototype.setMomentum = function (t, e) {
                0 === this.limit.x && (t = 0),
                  0 === this.limit.y && (e = 0),
                  this.options.renderByPixels &&
                    ((t = Math.round(t)), (e = Math.round(e))),
                  (this._momentum.x = t),
                  (this._momentum.y = e);
              }),
              (t.prototype.updatePluginOptions = function (t, e) {
                this._plugins.forEach(function (i) {
                  i.name === t && Object.assign(i.options, e);
                });
              }),
              (t.prototype.destroy = function () {
                var t = this.containerEl,
                  e = this.contentEl;
                !(function (t) {
                  var e = M.get(t);
                  e &&
                    (e.forEach(function (t) {
                      var e = t.elem,
                        i = t.eventName,
                        n = t.handler;
                      e.removeEventListener(i, n, L());
                    }),
                    M.delete(t));
                })(this),
                  this._listeners.clear(),
                  this.setMomentum(0, 0),
                  cancelAnimationFrame(this._renderID),
                  this._observer && this._observer.disconnect(),
                  ut.delete(this.containerEl);
                for (var i = Array.from(e.childNodes); t.firstChild; )
                  t.removeChild(t.firstChild);
                i.forEach(function (e) {
                  t.appendChild(e);
                }),
                  N(t, { overflow: "" }),
                  (t.scrollTop = this.scrollTop),
                  (t.scrollLeft = this.scrollLeft),
                  this._plugins.forEach(function (t) {
                    t.onDestory();
                  }),
                  (this._plugins.length = 0);
              }),
              (t.prototype._init = function () {
                var t = this;
                this.update(),
                  Object.keys(n).forEach(function (e) {
                    n[e](t);
                  }),
                  this._plugins.forEach(function (t) {
                    t.onInit();
                  }),
                  this._render();
              }),
              (t.prototype._updateDebounced = function () {
                this.update();
              }),
              (t.prototype._shouldPropagateMomentum = function (t, e) {
                void 0 === t && (t = 0), void 0 === e && (e = 0);
                var i = this.options,
                  n = this.offset,
                  o = this.limit;
                if (!i.continuousScrolling) return !1;
                0 === o.x && 0 === o.y && this._updateDebounced();
                var s = $(t + n.x, 0, o.x),
                  r = $(e + n.y, 0, o.y),
                  a = !0;
                return (
                  (a = (a = a && s === n.x) && r === n.y) &&
                  (n.x === o.x || 0 === n.x || n.y === o.y || 0 === n.y)
                );
              }),
              (t.prototype._render = function () {
                var t = this._momentum;
                if (t.x || t.y) {
                  var e = this._nextTick("x"),
                    i = this._nextTick("y");
                  (t.x = e.momentum),
                    (t.y = i.momentum),
                    this.setPosition(e.position, i.position);
                }
                var n = s({}, this._momentum);
                this._plugins.forEach(function (t) {
                  t.onRender(n);
                }),
                  (this._renderID = requestAnimationFrame(
                    this._render.bind(this)
                  ));
              }),
              (t.prototype._nextTick = function (t) {
                var e = this.options,
                  i = this.offset,
                  n = this._momentum,
                  o = i[t],
                  s = n[t];
                if (Math.abs(s) <= 0.1) return { momentum: 0, position: o + s };
                var r = s * (1 - e.damping);
                return (
                  e.renderByPixels && (r |= 0),
                  { momentum: r, position: o + s - r }
                );
              }),
              r(
                [O(100, { leading: !0 })],
                t.prototype,
                "_updateDebounced",
                null
              ),
              t
            );
          })(),
          dt = "",
          pt = "smooth-scrollbar-style",
          ft = !1;
        function mt() {
          if (!ft && "undefined" != typeof window) {
            var t = document.createElement("style");
            (t.id = pt),
              (t.textContent = dt),
              document.head && document.head.appendChild(t),
              (ft = !0);
          }
        }
        i.d(e, "ScrollbarPlugin", function () {
          return J;
        });
        var gt = (function (t) {
          function e() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            (function (t, e) {
              function i() {
                this.constructor = t;
              }
              o(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            })(e, t),
            (e.init = function (t, e) {
              if (!t || 1 !== t.nodeType)
                throw new TypeError(
                  "expect element to be DOM Element, but got " + t
                );
              return mt(), ut.has(t) ? ut.get(t) : new ht(t, e);
            }),
            (e.initAll = function (t) {
              return Array.from(
                document.querySelectorAll("[data-scrollbar]"),
                function (i) {
                  return e.init(i, t);
                }
              );
            }),
            (e.has = function (t) {
              return ut.has(t);
            }),
            (e.get = function (t) {
              return ut.get(t);
            }),
            (e.getAll = function () {
              return Array.from(ut.values());
            }),
            (e.destroy = function (t) {
              var e = ut.get(t);
              e && e.destroy();
            }),
            (e.destroyAll = function () {
              ut.forEach(function (t) {
                t.destroy();
              });
            }),
            (e.use = function () {
              for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e];
              return function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                  t[e] = arguments[e];
                t.forEach(function (t) {
                  var e = t.pluginName;
                  if (!e) throw new TypeError("plugin name is required");
                  tt.order.add(e), (tt.constructors[e] = t);
                });
              }.apply(void 0, t);
            }),
            (e.attachStyle = function () {
              return mt();
            }),
            (e.detachStyle = function () {
              return (function () {
                if (ft && "undefined" != typeof window) {
                  var t = document.getElementById(pt);
                  t && t.parentNode && (t.parentNode.removeChild(t), (ft = !1));
                }
              })();
            }),
            (e.version = "8.4.0"),
            (e.ScrollbarPlugin = J),
            e
          );
        })(ht);
        e.default = gt;
      },
    ]).default;
  }),
  $(document).ready(function () {
    document.addEventListener("load-recaptcha", function () {
      "undefined" == typeof grecaptcha &&
        ($("body").append(
          '<script>var onloadCallback = function() {var event;if (typeof(Event) === "function") {event = new Event("grecaptcha-loaded");} else {event = document.createEvent("Event");event.initEvent("grecaptcha-loaded", true, true);};document.dispatchEvent(event);};</script>'
        ),
        "en" == $("html").attr("lang").toLowerCase()
          ? $("body").append(
              '<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=en" async defer ></script>'
            )
          : $("body").append(
              '<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=ar" async defer ></script>'
            ));
    });
  }),
  $(document).ready(function () {
    if ($.fn.fancybox) {
      var t = $("[data-fancy]"),
        e = $.checkSiteRTLDirection(),
        i =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
      t.each(function (t, n) {
        var o = $(n).data("thumbs-position") || "bottom",
          s = $(n).data("thumbs-autostart"),
          r =
            $(n).data().hasOwnProperty("disableArrows") &&
            $(n).data("disableArrows"),
          a = $(n).data("prev-icon") || "icon-chevron-left",
          l = $(n).data("next-icon") || "icon-chevron-right",
          c = $(n).data("fancybox-info-extras");
        $(n).fancybox({
          touch: !1,
          thumbs: {
            autoStart: s || "" === s,
            hideOnClose: !0,
            axis: i ? "x" : "y",
          },
          helpers: { thumbs: { position: o } },
          btnTpl: r
            ? {}
            : {
                arrowLeft:
                  "<button data-fancybox-" +
                  (e ? "next" : "prev") +
                  '="true" class="fancybox-button fancybox-button--arrow_left" title="{{' +
                  e
                    ? "NEXT"
                    : 'PREV}}"><i class="' + (e ? l : a) + '"> </i></button>',
                arrowRight:
                  "<button data-fancybox-" +
                  (e ? "prev" : "next") +
                  ' class="fancybox-button fancybox-button--arrow_right" title="{{' +
                  e
                    ? "PREV"
                    : 'NEXT }}"><i class="' + (e ? a : l) + '"> </i></button>',
              },
          beforeShow: function () {
            c &&
              ($(".fancybox-infobar").empty(),
              $(c).clone().show().appendTo($(".fancybox-infobar")));
          },
          keys: {
            next: { 10000: "left" },
            prev: { 10000: "right" },
            close: null,
          },
          lang: e ? "ar" : "en",
          i18n: {
            en: {
              CLOSE: "Close",
              NEXT: "Next",
              PREV: "Previous",
              ERROR:
                "The requested content cannot be loaded. <br/> Please try again later.",
              PLAY_START: "Start slideshow",
              PLAY_STOP: "Pause slideshow",
              FULL_SCREEN: "Full screen",
              THUMBS: "Thumbnails",
              DOWNLOAD: "Download",
              SHARE: "Share",
              ZOOM: "Zoom",
            },
            ar: {
              CLOSE: "إغلاق",
              NEXT: "التالي",
              PREV: "السابق",
              ERROR:
                "لا يمكن تحميل المحتوي المطلوب. <br/> الرجاء المحاولة لاحقا.",
              PLAY_START: "بدأ العرض التفاعلي",
              PLAY_STOP: "تعطيل مؤقت ",
              FULL_SCREEN: "ملء الشاشة",
              THUMBS: "صورة مصغرة",
              DOWNLOAD: "تحميل",
              SHARE: "مشاركة",
              ZOOM: "تكبير",
            },
          },
        });
      }),
        ($.dialog = function (t) {
          (t = $.extend(
            !0,
            {
              title: "",
              message: "",
              dialogClass: "",
              dialogTitleClass: "",
              dialogMessageClass: "",
              dialogFooterClass: "",
              dialogHeaderClass: "",
              dialogCancelButtonClass: "",
              dialogOkButtonClass: "",
              dialogBaseTemplateClass: "",
              closeButton: "",
              okButton: e ? "حسنا" : "Ok",
              cancelButton: "",
              callback: $.noop,
            },
            t || {}
          )),
            $.fancybox.open({
              type: "html",
              src:
                '<div class="dialog-component ' +
                t.dialogClass +
                '">' +
                (t.title
                  ? '<header class="dialog-component__header ' +
                    t.dialogHeaderClass +
                    '"><h4 class="' +
                    t.dialogTitleClass +
                    '">' +
                    t.title +
                    "</h4></header>"
                  : "") +
                (t.closeButton
                  ? '<i class="dialog-component__close ' +
                    t.closeButton +
                    '" data-fancybox-close data-value="0"></i>'
                  : "") +
                (t.message
                  ? '<div class="dialog-component__message ' +
                    t.dialogMessageClass +
                    '">' +
                    t.message +
                    "</div>"
                  : "") +
                '<div class="dialog-component__footer ' +
                t.dialogFooterClass +
                '">' +
                (t.cancelButton
                  ? '<button class="dialog-component__footer__button button ' +
                    t.dialogCancelButtonClass +
                    '" data-value="0" data-fancybox-close>' +
                    t.cancelButton +
                    "</button>"
                  : "") +
                (t.okButton
                  ? '<button class="button ' +
                    t.dialogOkButtonClass +
                    '" data-value="1" data-fancybox-close class="btn">' +
                    t.okButton +
                    "</button>"
                  : "") +
                "</div></div>",
              opts: {
                animationDuration: 350,
                animationEffect: "material",
                modal: !0,
                baseTpl:
                  '<div class="fancybox-container fc-container ' +
                  t.dialogBaseTemplateClass +
                  '" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-stage"></div></div></div>',
                afterClose: function (e, i, n) {
                  var o = n ? n.target || n.currentTarget : null,
                    s = o ? $(o).data("value") : 0;
                  t.callback(s);
                },
              },
              btnTpl: { close: "" },
              touch: !1,
            });
        }),
        $(".dialog-component--auto").length &&
          $.fancybox.open({
            src: ".dialog-component--auto",
            type: "inline",
            touch: !1,
            btnTpl: { close: "" },
            smallBtn: !1,
          });
    }
  });
var trackChange = null,
  pageDelayed = 3e3;
function googleTranslateElementInit() {
  var t = $("#google_translate_element_1"),
    e = $("#google_translate_element_2"),
    i = "google_translate_element_1",
    n = !1;
  !t.length && e.length && ((t = e), (i = "google_translate_element_2")),
    t.length &&
      (new google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "af,am,az,be,bg,bn,bs,ca,ceb,co,cs,cy,da,de,el,eo,es,et,eu,fa,fi,fr,fy,ga,gd,gl,gu,ha,haw,hi,hmn,hr,ht,hu,hy,id,ig,is,it,iw,ja,jv,ka,kk,km,kn,ko,ku,ky,la,lb,lo,lt,lv,mg,mi,mk,ml,mn,mr,ms,mt,my,ne,nl,no,ny,pa,pl,ps,pt,ro,ru,sd,si,sk,sl,sm,sn,so,sq,sr,su,sv,sw,ta,te,tg,th,tl,tr,uk,ur,uz,vi,xh,yi,yo,zh-CN,zh-TW,zu",
          layout: google.translate.TranslateElement.InlineLayout.VERTICAL,
        },
        i
      ),
      setTimeout(function () {
        (select = t.find("select")),
          e.html(t.clone()),
          e.find("select").val(select.val()),
          t.find("select").on("change", function (t) {
            return 0 == n && e.find("select").val($(this).val()), !0;
          }),
          e.find("select").on("change", function (e) {
            n ||
              ((n = !0),
              t.find("select").val($(this).val()),
              trackChange(),
              setTimeout(function () {
                n = !1;
              }, 1e3));
          });
      }, pageDelayed));
}
function removeAlert(t) {
  $(t).parent().remove();
}
function initLoader() {
  var t = document.querySelectorAll(".ex-loader"),
    e = document.querySelectorAll(".on-page-editor").length;
  t &&
    !e &&
    ($("body").addClass("overflow-hidden"),
    [].map.call(t, function (t) {
      $(t).addClass("ex-loader--initialized");
      var e = t.dataset.animationType ? t.dataset.animationType : "delayed",
        i = t.dataset.animationDuration ? t.dataset.animationDuration : "200",
        n = t.dataset.svgUrl ? t.dataset.svgUrl : "";
      n
        ? $.ajax({ method: "GET", url: n, dataType: "html", data: {} }).done(
            function (n) {
              $(t).find(".ex-loader__loader").remove(),
                $(t).prepend(n),
                _initSvgAnimation(t.querySelector("svg"), e, i);
            }
          )
        : _initSvgAnimation(t.querySelector("svg"), e, i);
    }));
}
function _initSvgAnimation(t, e, i) {
  if (t)
    new Vivus(
      t,
      {
        type: e,
        duration: i,
        start: "autostart",
        animTimingFunction: Vivus.EASE,
      },
      function (t) {
        t.play("end" === t.getStatus() ? -1 : 1);
      }
    );
}
function loadHandler() {
  setTimeout(_removeLoader, 2e3);
}
function _removeLoader() {
  $("body").removeClass("overflow-hidden"),
    $(".ex-loader--initialized").fadeOut(500, function () {
      $(".ex-loader").remove();
    });
}
(Element.prototype._addEventListener = Element.prototype.addEventListener),
  (Element.prototype.addEventListener = function (t, e, i) {
    (reset = !1),
      "change" == t && ((trackChange = e), (reset = !0)),
      null == i && (i = !1),
      this._addEventListener(t, e, i),
      this.eventListenerList || (this.eventListenerList = {}),
      this.eventListenerList[t] || (this.eventListenerList[t] = []),
      this.eventListenerList[t].push({ listener: e, useCapture: i }),
      reset &&
        (Element.prototype.addEventListener =
          Element.prototype._addEventListener);
  }),
  $(document).ready(function () {
    var t = $("#google_translate_element_1"),
      e = $("#google_translate_element_2");
    (t.length || e.length) &&
      $("[data-settings]").on("click", function () {
        ("undefined" != typeof google &&
          void 0 !== google.translate &&
          void 0 !== google.translate.TranslateElement) ||
          $("body").append(
            '<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>'
          );
      });
  }),
  $(document).ready(function () {
    if ($.fn.isotope) {
      var t,
        e =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ),
        i = $.checkSiteRTLDirection();
      $("[data-media-grid]").each(function (n, o) {
        if ($(o).data("media-grid") || "" == $(o).data("media-grid")) {
          $.guid++;
          var s = $(o).data("selector") || "",
            r = $(o).data("gutter") || "",
            a = $(o).data("active-filter") || "",
            l = $("[data-filter]");
          (s = s && -1 == s.indexOf(".") && -1 == s.indexOf("#") ? "." + s : s),
            (r =
              r && -1 == r.indexOf(".") && -1 == r.indexOf("#") ? "." + r : r);
          var c = $(o).data("active-filter-class") || "isotope-active",
            u = $(o).data("fancybox-mode"),
            h = $(o).data("fancybox-thumbs-position"),
            d = $(o).data("fancybox-thumbs-autostart"),
            p = $(o).data("fancybox-enabled"),
            f = "icon-chevron-left",
            m = "icon-chevron-right";
          function g() {
            $.fn.fancybox &&
              p &&
              $().fancybox({
                baseClass: h ? "fancybox-" + h : "",
                selector: s + " a:not(.fancybox-disabled)",
                thumbs: {
                  hideOnClose: !0,
                  autoStart: d,
                  axis: e && "bottom" == h ? "x" : "y",
                  defaults: { width: 50, height: 50, position: h },
                },
                helpers: {
                  thumbs: {
                    position: h,
                    source: function (t) {
                      return href;
                    },
                  },
                },
                btnTpl: {
                  arrowLeft:
                    "<button data-fancybox-" +
                    (i ? "next" : "prev") +
                    '="true" class="fancybox-button fancybox-button--arrow_left" title="{{' +
                    (i ? "NEXT" : "PREV") +
                    '}}"><i class="' +
                    f +
                    '"> </i></button>',
                  arrowRight:
                    "<button data-fancybox-" +
                    (i ? "prev" : "next") +
                    ' class="fancybox-button fancybox-button--arrow_right" title="{{' +
                    (i ? "PREV" : "NEXT") +
                    '}}"><i class="' +
                    m +
                    '"> </i></button>',
                },
                beforeShow: function (t, e) {},
                keys: {
                  next: {
                    10000: "left",
                    10000: "up",
                    10000: "left",
                    10000: "up",
                  },
                  prev: {
                    10000: "right",
                    10000: "down",
                    10000: "right",
                    10000: "down",
                  },
                  close: null,
                },
                lang: i ? "ar" : "en",
                i18n: {
                  en: {
                    CLOSE: "Close",
                    NEXT: "Next",
                    PREV: "Previous",
                    ERROR:
                      "The requested content cannot be loaded. <br/> Please try again later.",
                    PLAY_START: "Start slideshow",
                    PLAY_STOP: "Pause slideshow",
                    FULL_SCREEN: "Full screen",
                    THUMBS: "Thumbnails",
                    DOWNLOAD: "Download",
                    SHARE: "Share",
                    ZOOM: "Zoom",
                  },
                  ar: {
                    CLOSE: "إغلاق",
                    NEXT: "التالي",
                    PREV: "السابق",
                    ERROR:
                      "لا يمكن تحميل المحتوي المطلوب. <br/> الرجاء المحاولة لاحقا.",
                    PLAY_START: "بدأ العرض التفاعلي",
                    PLAY_STOP: "تعطيل مؤقت ",
                    FULL_SCREEN: "ملء الشاشة",
                    THUMBS: "صورة مصغرة",
                    DOWNLOAD: "تحميل",
                    SHARE: "مشاركة",
                    ZOOM: "تكبير",
                  },
                },
              });
          }
          (d = d || "" === d),
            (p = p || "" === p) &&
              "seperate" == u &&
              l.each(function () {
                var t = $(this).attr("data-filter");
                if ("*" != t) {
                  var e = $(t).children("a");
                  e.each(function (i, n) {
                    $(n).attr("rel") ||
                      $(e).attr("rel", "fancy-" + t.replace(".", ""));
                  });
                }
              }),
            g(),
            i &&
              ($.fn.isotope.prototype._positionAbs = function (t, e) {
                return { right: t, top: e };
              }),
            (t = $(o).isotope({
              itemSelector: s || "[data-media-grid] > *",
              percentPosition: !0,
              masonry: { columnWidth: s || "[data-media-grid] > *", gutter: r },
              isOriginLeft: !i,
              filter: a,
            })).isotope("on", "arrangeComplete", function (t) {
              g();
            }),
            l.each(function (e, i) {
              $(i).on("click", function () {
                $("." + c).removeClass(c), $(this).addClass(c);
                var e = $(this).attr("data-filter");
                if (p && "seperate" == u) {
                  var i = $(s).children("a");
                  i.removeClass("fancybox-disabled"),
                    l.each(function () {
                      e != $(this).attr("data-filter") &&
                        "*" != e &&
                        (i = $(s + ':not("' + e + '")').children("a")),
                        i && i.length && i.addClass("fancybox-disabled");
                    });
                }
                if (
                  ("*" == e && i.removeClass("fancybox-disabled"),
                  0 !== $("iframe").length)
                )
                  for (let t = 0; t < $("iframe").length; t++)
                    $("iframe")[t].contentWindow.postMessage(
                      '{"event":"command","func":"pauseVideo","args":""}',
                      "*"
                    );
                $(s).parent().find(e).length
                  ? $(".ex-media-grid__message").hide()
                  : $(".ex-media-grid__message").show(),
                  t.isotope({ filter: e });
              });
            });
          setTimeout(function () {
            t.isotope("layout"), t.data("isotope").arrange();
          }, 2e3),
            "function" == typeof Event
              ? (v = new Event("grid-loaded"))
              : (v = document.createEvent("Event")).initEvent(
                  "grid-loaded",
                  !0,
                  !0
                ),
            document.dispatchEvent(v);
        }
        var v;
      }),
        $(window).scroll(function () {
          $("[data-media-grid]").each(function (t, e) {
            $(e).data("isotope") && $(e).data("isotope").layout();
          });
        });
    }
  }),
  $(document).ready(function () {
    $.fn.owlCarousel &&
      $("[data-carousel]").each(function (t, e) {
        var i = $(e).data("items-lg") || 3,
          n = $(e).children(),
          o = $(e).data("items-md") || 2,
          s = $(e).data("items-sm") || 1,
          r = $(e).data("items-xs") || 1,
          a = !!$(e).data("nav"),
          l = $(e).data("nav-prev-icon") || "icon-left-arrow",
          c = $(e).data("nav-next-icon") || "icon-right-arrow",
          u = $(e).data("margin") || 10,
          h = !!$(e).data("dots"),
          d = $(e).data("autoplay") || !0,
          p = $(e).data("autoplayTimeout") || 4e3,
          f = $(e).data("autoplayHoverPause") || !1,
          m = $(e).data("autoHeight"),
          g = $(e).data("loop") || !1;
        $(e).owlCarousel({
          margin: u,
          nav: a,
          autoHeight: !!m,
          navText: a && [
            '<i class="' + l + '" aria-hidden="true"></i>',
            '<i class="' + c + '" aria-hidden="true"></i>',
          ],
          rtl: $.checkSiteRTLDirection(),
          dots: h,
          autoplay: d,
          autoplayTimeout: p,
          autoplayHoverPause: f,
          loop: g,
          stagePadding: 0,
          responsive: {
            0: { items: n.length > r ? r : n.length, nav: !0 },
            480: { items: n.length > s ? s : n.length, nav: !1 },
            768: { items: n.length > o ? o : n.length, nav: !0, loop: g },
            1000: { items: n.length > i ? i : n.length, nav: !0, loop: g },
          },
        });
      });
  }),
  $(document).ready(function () {
    function t() {
      var t = $(window).scrollTop();
      $(".ex-announcement").outerHeight(),
        $(".ex-header__wrapper").outerHeight();
      t >=
      (($.extractValueFromStr &&
        $.extractValueFromStr(
          $("meta[name='scrolling']").attr("content"),
          "scroll-after"
        )) ||
        5)
        ? $("body").addClass("scrolled")
        : $("body").removeClass("scrolled");
    }
    window.navigator.userAgent.indexOf("MSIE ") < 0 &&
      !navigator.userAgent.match(/Trident.*rv\:11\./) &&
      !/Edge/.test(navigator.userAgent) &&
      "undefined" != typeof Scrollbar &&
      Scrollbar.initAll(),
      $(window).scroll(function () {
        t();
      }),
      t();
  }),
  $(document).ready(function () {
    var t = $(".on-page-editor").length;
    if ($.fn.slick) {
      var e = $("[data-slick]"),
        i = !0;
      e.each(function (e, n) {
        if (
          ((i = null == $(n).data("slick-editor") || $(n).data("slick-editor")),
          !t || (i && t))
        ) {
          var o = $.checkSiteRTLDirection(),
            s = $(n).hasClass("slick-initialized")
              ? $(n).slick("getSlick").slideCount
              : $(n).children().length,
            r = $(n).data("slidestoshow") || 1,
            a = $(n).data("slides-lg") || 3,
            l = $(n).data("slides-md") || 2,
            c = $(n).data("slides-sm") || 1,
            u = $(n).data("slides-xs") || 1,
            h = ($(n).children(), $(n).data("rowstoshow") || 1),
            d = $(n).data("rows-lg") || h,
            p = $(n).data("rows-md") || h,
            f = $(n).data("rows-sm") || h,
            m = $(n).data("rows-xs") || h,
            g = ($(n).children(), $(n).data("enablearrows") || !1),
            v = $(n).data("enablearrowslg") || g,
            y = $(n).data("enablearrowsmd") || g,
            _ = $(n).data("enablearrowssm") || g,
            b = $(n).data("enablearrowsxs") || g,
            w = $(n).data("dots") || !1,
            x = $(n).data("dots-lg") || w,
            T = $(n).data("dots-md") || w,
            S = $(n).data("dots-sm") || w,
            C = $(n).data("dots-xs") || w,
            k =
              !$(n).data().hasOwnProperty("infinite") || $(n).data("infinite"),
            P = $(n).data("infinite-lg") || k,
            A = $(n).data("infinite-md") || k,
            E = $(n).data("infinite-sm") || k,
            O = $(n).data("infinite-xs") || k,
            F = $(n).data().hasOwnProperty("initialslide")
              ? $(n).data("initialslide")
              : 0,
            z = $(n).data("initialslide-lg") || F,
            M = $(n).data("initialslide-md") || F,
            L = $(n).data("initialslide-sm") || F,
            D = $(n).data("initialslide-xs") || F,
            R = $(n).data("speed") || 1e3,
            I = $(n).data("autoplayspeed") || 5e3,
            j = !(
              !$(n).data().hasOwnProperty("autoplay") ||
              "" == $(n).data("autoplay") ||
              !$(n).data("autoplay") ||
              t
            ),
            H = $(n).data("slides-to-scroll") || 1,
            N = $(n).data("adaptive-height") || !1,
            B = $(n).parent().find("[aria-label='prev']").length
              ? $(n).parent().find("[aria-label='prev']")
              : "." + $(n).data("prev-arrow"),
            W = $(n).parent().find("[aria-label='next']").length
              ? $(n).parent().find("[aria-label='next']")
              : "." + $(n).data("next-arrow"),
            q = !!$(n).data("pause-dots-hover"),
            X = $(n).data("fade") || !1,
            V = $(n).data("asnavfor"),
            Y = $(n).data("focusonselect"),
            U = $(n).data("centerpadding-lg"),
            Q = $(n).data("centerpadding-md"),
            G = $(n).data("centerpadding-sm"),
            Z = $(n).data("centerpadding-xs"),
            K = $(n).data("lazyload");
          function J(t) {
            var e = $(t).find(".slick-item"),
              i = e
                .sort(function (t, e) {
                  return $(t).height() > $(e).height()
                    ? 1
                    : $(t).height() < $(e).height()
                    ? -1
                    : 0;
                })
                .slice(-1),
              n = $(i).height();
            e.css("height", n + "px"),
              $(t)
                .find(".slick-item--maxHeight")
                .css(
                  "maxHeight",
                  "calc(" +
                    n +
                    "px - (" +
                    e.css("border-bottom-width") +
                    " + " +
                    e.css("border-top-width") +
                    "))"
                ),
              $(t)
                .find(".slick-item--minHeight")
                .css(
                  "minHeight",
                  "calc(" +
                    n +
                    "px - (" +
                    e.css("border-bottom-width") +
                    " + " +
                    e.css("border-top-width") +
                    "))"
                ),
              $(t)
                .find(".slick-item--height")
                .css(
                  "height",
                  "calc(" +
                    n +
                    "px - (" +
                    e.css("border-bottom-width") +
                    " + " +
                    e.css("border-top-width") +
                    "))"
                );
          }
          ("ondemand" != K && "progressive" != K) ||
            $(n)
              .find("div[data-src]")
              .each(function () {
                $(this).append(
                  "<div class='image'><img data-lazy='" +
                    $(this).attr("data-src") +
                    "'/></div>"
                );
              }),
            $(n).on("init , setPosition", function (t, e, i) {
              var n = $(this).parents(".section").find(".slick-arrow");
              n.hasClass("slick-hidden")
                ? $(".slick-hidden")
                    .parent()
                    .attr("style", "display: none !important")
                    .siblings("hr")
                    .attr("style", "display: none !important")
                : n
                    .parent()
                    .removeAttr("style")
                    .siblings("hr")
                    .removeAttr("style");
            }),
            $(n).on("init", function () {
              $(this).find(".truncate").length || J(n);
            }),
            $(window).on("truncate-done", function () {
              J(n);
            }),
            $(n)
              .not(".slick-initialized")
              .slick({
                dots: w,
                arrows: g,
                infinite: !t && k,
                fade: X,
                speed: R,
                autoplaySpeed: I,
                pauseOnDotsHover: q,
                slidesToShow: r,
                rows: h,
                autoplay: j,
                asNavFor: V,
                focusOnSelect: Y,
                adaptiveHeight: N,
                prevArrow: o ? W : B,
                nextArrow: o ? B : W,
                rtl: o,
                lazyLoad: K,
                initialSlide: F,
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: s > a ? a : s,
                      slidesToScroll: H,
                      infinite: !t && P,
                      dots: x,
                      arrows: v,
                      rows: d,
                      initialSlide: z,
                      prevArrow: o ? W : B,
                      nextArrow: o ? B : W,
                      centerMode: !!U,
                      centerPadding: U && (o ? "0 0 " + U : U + " 0 0"),
                    },
                  },
                  {
                    breakpoint: 845,
                    settings: {
                      slidesToShow: s > l ? l : s,
                      slidesToScroll: H,
                      infinite: !t && A,
                      dots: T,
                      arrows: y,
                      rows: p,
                      initialSlide: M,
                      prevArrow: o ? W : B,
                      nextArrow: o ? B : W,
                      centerMode: !!Q,
                      centerPadding: Q && (o ? "0 0 " + Q : Q + " 0 0"),
                    },
                  },
                  {
                    breakpoint: 425,
                    settings: {
                      slidesToShow: s > c ? c : s,
                      slidesToScroll: H,
                      infinite: !t && E,
                      dots: S,
                      arrows: _,
                      rows: f,
                      initialSlide: L,
                      prevArrow: o ? W : B,
                      nextArrow: o ? B : W,
                      centerMode: !!G,
                      centerPadding: G && (o ? "0 0 " + G : G + " 0 0"),
                    },
                  },
                  {
                    breakpoint: 520,
                    settings: {
                      slidesToShow: s > c ? c : s,
                      slidesToScroll: H,
                      infinite: !t && E,
                      dots: S,
                      arrows: _,
                      rows: f,
                      initialSlide: L,
                      prevArrow: o ? W : B,
                      nextArrow: o ? B : W,
                      centerMode: !!G,
                      centerPadding: G && (o ? "0 0 " + G : G + " 0 0"),
                    },
                  },
                  {
                    breakpoint: 0,
                    settings: {
                      slidesToShow: s > u ? u : s,
                      slidesToScroll: H,
                      infinite: !t && O,
                      dots: C,
                      arrows: b,
                      rows: m,
                      initialSlide: D,
                      prevArrow: o ? W : B,
                      nextArrow: o ? B : W,
                      centerMode: !!Z,
                      centerPadding: Z && (o ? "0 0 " + Z : Z + " 0 0"),
                    },
                  },
                ],
              });
        }
      });
    }
  }),
  $(document).ready(function () {
    var t = $(".on-page-editor").length;
    function e(e) {
      var i = $(".truncate");
      e && (i = $(e).find(".truncate")),
        i.each(function () {
          (!t || (t && !$(this).hasClass("truncateless-on-editor"))) &&
            $(this).truncate();
        }),
        $(window).trigger("truncate-done");
    }
    ($.fn.truncate = function () {
      var t = (function (t) {
        var e = 1;
        if ($(t).is('[class*="truncate-"]'))
          for (
            var i = $(t).attr("class").split(" "), n = 0;
            n < i.length;
            n++
          ) {
            const t = i[n];
            if (-1 != t.indexOf("truncate-")) {
              e = t.split("truncate-")[1];
              break;
            }
          }
        return parseInt(e);
      })(this);
      t = void 0 !== t ? t : 1;
      var e = $(this).css("line-height").replace("px", "");
      "normal" == e && (e = $(this).css("font-size").replace("px", "")),
        this.attr("title") && this.text(this.attr("title"));
      var i = Math.ceil(t * e);
      if (this.height() > i) {
        this.attr("title") || this.attr("title", this.html());
        var n = this.attr("title").split(" "),
          o = "",
          s = "";
        this.text("");
        for (var r = 0; r < n.length; r++) {
          if (this.height() > i) {
            this.html(s.trim() + "&hellip; ");
            break;
          }
          (s = o), (o += n[r] + " "), this.html(o.trim() + "&hellip;");
        }
        this.height() > i && this.html(s.trim() + "&hellip; ");
      }
      return this;
    }),
      "undefined" != typeof XA &&
        XA.component.search.vent &&
        XA.component.search.vent.on("results-loaded", function () {
          e(), console.log("1inu");
        }),
      $(window).on("run-truncate", function (t, i) {
        e(i), console.log("2inu");
      }),
      window.addEventListener("DOMContentLoaded", function () {
        e(), console.log("domcontentLoaded");
      }),
      $(window).on("load", function () {
        setTimeout(function () {
          e(), console.log("3inu");
        }, 700);
      });
  }),
  $(document).ready(function () {
    $('div[data-lazyload="true"]')
      .find("div[data-src]")
      .each(function () {
        $(this).each(function () {
          $(this).append(
            "<img class='lazyload' data-src='" +
              $(this).attr("data-src") +
              "'/>"
          );
        });
      });
  }),
  (Number.prototype.isBetween = function (t, e) {
    return (
      void 0 !== t && void 0 !== e && this.valueOf() >= t && this.valueOf() <= e
    );
  }),
  $(document).ready(function () {
    ($.getQueryString = function (t) {
      for (
        var e = window.location.href
            .slice(window.location.href.indexOf("?") + 1)
            .split("&"),
          i = 0;
        i < e.length;
        i++
      ) {
        var n = e[i].split("=");
        if (n[0].toLocaleLowerCase() == t.toLocaleLowerCase()) return n[1];
      }
    }),
      ($.getQueryString = function (t) {
        for (
          var e = window.location.href
              .slice(window.location.href.indexOf("?") + 1)
              .split("&"),
            i = 0;
          i < e.length;
          i++
        ) {
          var n = e[i].split("=");
          if (n[0].toLocaleLowerCase() == t.toLocaleLowerCase()) return n[1];
        }
      }),
      ($.fn.replaceClass = function (t, e) {
        return $(this).removeClass(t).addClass(e);
      }),
      $.validator &&
        (($.validator.methods.pattern = function (t, e) {
          var i = $(e).data("relatedInput"),
            n = $(e).attr("pattern");
          if (i && ($(i).is(":checked") || $(i).val())) {
            var o = new RegExp(n);
            let t = (e.value || "").trim().replace(" ", "");
            if (t) return o.test(t);
          }
          return !0;
        }),
        ($.validator.methods.phone = function (t, e) {
          var i = $(e).data("relatedInput");
          if (i && ($(i).is(":checked") || $(i).val())) {
            var n = new RegExp("[0-9]");
            return (
              e.value.length <= 15 && e.value.length >= 9 && n.test(e.value)
            );
          }
          return this.optional(e);
        }));
  }),
  String.prototype.startsWith ||
    Object.defineProperty(String.prototype, "startsWith", {
      value: function (t, e) {
        var i = e > 0 ? 0 | e : 0;
        return this.substring(i, i + t.length) === t;
      },
    }),
  $(document).ready(function () {
    var t = $.checkSiteRTLDirection(),
      e = t ? "ك.ب" : "kb";
    function i() {
      $(".size.field-size").each(function () {
        -1 == $(this).text().indexOf(e) &&
          (0 != Math.round($(this).text() / 1024)
            ? $(this).text(Math.round($(this).text() / 1024) + " " + e)
            : 0 == Math.round($(this).text() / 1024) &&
              $(this).text(
                parseFloat($(this).text()).toFixed(2) + " " + fileSizeBytelabel
              ));
      });
    }
    (fileSizeBytelabel = t ? "ب" : "b"),
      i(),
      "undefined" != typeof XA &&
        XA.component.search.vent &&
        XA.component.search.vent.on("results-loaded", function () {
          i();
        });
    let n = $(".go-to-top");
    if (n.length) {
      let t = n.data("showafter") || 400;
      $(window).scroll(function () {
        $(".on-page-editor").length ||
          ($(window).scrollTop() > t ? n.show(500) : n.hide(500));
      }),
        n.on("click", function () {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
  }),
  $("[data-auto-close]").each(function () {
    var t = $(this),
      e = $(this).data("auto-close");
    setTimeout(function () {
      t.remove();
    }, e);
  }),
  $(document).ready(function () {
    var t = ".ex-image-highlights__slides",
      e = $(t) && $(t).data("slick") && $(t).slick("getSlick");
    if (
      $(".ex-image-highlights").length &&
      !$(".ex-image-highlights").hasClass(
        ".ex-image-highlights".replace(".", "") + "-v2"
      )
    ) {
      var i = !!(
          $(t).data() &&
          $(t).data().hasOwnProperty("autoplay") &&
          "" != $(t).data("autoplay") &&
          $(t).data("autoplay")
        ),
        n = $(t).data("infinite") || !0,
        o = $(t).data("enablearrows"),
        s = $(t).data("autoplayspeed") || 5e3,
        r = $(".ex-header").height(),
        a = $(".ex-image-highlights__navigation .slide-progress__current"),
        l = $(".ex-image-highlights__navigation .slide-progress__count"),
        c = $(".ex-image-highlights__navigation .slide-progress__bar__line");
      function u(t, e) {
        e && (a.html(e), l.text(t));
      }
      function h() {
        c.animate({ width: "100%" }, s, function () {});
      }
      if (
        (o &&
          $(".ex-image-highlights__navigation .arrows").attr(
            "style",
            "opacity: 1"
          ),
        e && i && e.$slides.length > 1)
      ) {
        if (
          ($(".ex-image-highlights__navigation .slide-progress").attr(
            "style",
            "opacity: 1"
          ),
          $(t).data().hasOwnProperty("progress") &&
            ($(t).data("progress") || "" == $(t).data("progress")))
        ) {
          var d = e.slideCount;
          f = e.currentSlide + 1;
          $(t).on("init beforeChange", function (t, e) {
            var i = e.slideCount,
              n = e.currentSlide + 1;
            u(i, n);
          });
        }
        if (
          $(t).data().hasOwnProperty("loader") &&
          ($(t).data("loader") || "" == $(t).data("loader"))
        ) {
          d = e.slideCount;
          var p,
            f = e.currentSlide + 1;
          function m() {
            if ((g(), 0, !1, !n && p))
              return $(c).parent().hide(), $(a).hide(), void $(l).hide();
            h(), d == e.currentSlide + 1 && (p = !0);
          }
          function g() {
            c.stop(!0), c.css({ width: "0%" });
          }
          u(d, f),
            $(t).on({
              mouseenter: function () {
                !0, c.stop(!0);
              },
              mouseleave: function () {
                !1, h();
              },
            }),
            m(),
            $(t).on("afterChange", function (t, e) {
              u(e.slideCount, e.currentSlide + 1), g(), m();
            });
        }
        ($(t).data().hasOwnProperty("loader") &&
          ($(t).data("loader") || "" == $(t).data("loader"))) ||
          ($(t).data().hasOwnProperty("progress") &&
            ($(t).data("progress") || "" == $(t).data("progress"))) ||
          $(c).parent().hide();
      }
      $(".highlights-scroll-down").click(function () {
        "undefined" != typeof Scrollbar &&
        Scrollbar.get(document.querySelector("body"))
          ? Scrollbar.get(document.querySelector("body")).scrollTo(
              0,
              $(t).height() - $headerHeight,
              500
            )
          : $("html, body").animate(
              { scrollTop: $(t).height() - (r - 25) },
              500
            );
      });
    }
    function v(t) {
      $(".ex-header").length &&
        ($(".ex-image-highlights-v2").animate({ paddingTop: t + "px" }, 800),
        $(".ex-inner-header").animate({ marginTop: t - 109 + "px" }, 800));
    }
    $(window).on("resize", function () {
      v(
        ($(".ex-announcement").outerHeight() || 0) +
          ($(".ex-header__wrapper").outerHeight() || 0)
      );
    }),
      $(window).on("announcement-closing", function () {
        v($(".ex-header__wrapper").outerHeight() || 0);
      }),
      $(window).on("window-zoom-changed", function () {
        e && $(t).slick("resize");
      }),
      setTimeout(function () {
        v(
          ($(".ex-announcement").outerHeight() || 0) +
            ($(".ex-header__wrapper").outerHeight() || 0)
        );
      }, 2e3);
  }),
  (XA.component.languageSelector = (function (t) {
    var e = {};
    function i(t) {
      return "flags-" + t.data("country-code");
    }
    return (
      (e.initInstance = function (e) {
        var n, o, s, r, a;
        (n = t(e)),
          (o = n.find(".language-selector-select-item")),
          (s = n.find(".language-selector-item-container")),
          (r = s.find(".language-selector-item")),
          (a = i(o)),
          o.find(">a").addClass(a),
          s.find(".language-selector-item").each(function () {
            (a = i(t(this))), t(this).find(">a").addClass(a);
          }),
          o.on("click", function () {
            s.slideToggle();
          }),
          r.on("click", function () {
            var e = t(this).find("a").attr("href");
            window.location.href = e;
          });
      }),
      (e.init = function () {
        t(".language-selector:not(.initialized)").each(function () {
          e.initInstance(this), t(this).addClass("initialized");
        });
      }),
      e
    );
  })(jQuery, document)),
  XA.register("language-selector", XA.component.languageSelector),
  $(document).ready(function () {
    var t = "contrast-wrapper__btn--active";
    if (localStorage) {
      let e = localStorage.getItem("contrast");
      e &&
        ($("html").addClass(e + "-contrast"),
        $("[data-contrast]").each(function () {
          $(this).removeClass(t).removeClass($(this).data("activeclass"));
        }),
        $("[data-contrast='" + e + "']").each(function () {
          $(this).toggleClass($(this).data("activeclass") || t);
        }));
    }
    $("[data-contrast]").click(function () {
      if (!$(this).hasClass(t)) {
        $("[data-contrast]").each(function () {
          $(this).removeClass(t).removeClass($(this).data("activeclass"));
        });
        var e = $(this).data("contrast").trim();
        $("[data-contrast='" + e + "']").each(function () {
          $(this).toggleClass($(this).data("activeclass") || t);
        }),
          $("html").removeClass("high-contrast"),
          $("html").removeClass("color-contrast"),
          localStorage && localStorage.setItem("contrast", e),
          $("html").addClass(e + "-contrast");
      }
      $(window).trigger("window-contrast-changed");
    }),
      $("[data-zoom]").click(function () {
        var t = $(this).data("zoom"),
          e = parseInt($(document.body).attr("data-current-zoom") || 0),
          i = "textsettings-wrapper__btn--active",
          n = $(this).data("activeclass");
        ($(document.body).hasClass("zoom-" + t + "-x2") &&
          $(document.body).hasClass("zoom-" + t + "-x2")) ||
          ($(document.body).removeClass(
            "zoom-origin-x0 zoom-in-x1 zoom-in-x2 zoom-out-x1 zoom-out-x2"
          ),
          "in" == t
            ? ++e < 0 && (t = "out")
            : "out" == t
            ? --e > 0 && (t = "in")
            : ((t = "origin"), (e = 0)),
          $(document.body)
            .attr("data-current-zoom", e)
            .addClass(
              "zoom-" + (Math.abs(e) ? t : "origin") + "-x" + Math.abs(e)
            ),
          0 == e && (t = "origin"),
          $("." + (n || i)).removeClass(n || i),
          $('[data-zoom="' + t + '"]').toggleClass(n || i)),
          $(window).trigger("window-zoom-changed");
      });
  }),
  $(document).ready(function () {
    var t = $("#sidebar");
    t.addClass("expanding-navigation");
    var e = t.find(".submenu");
    e.each(function () {
      var t = $(this).find("> ul"),
        e = $(this).find("> .navigation-title");
      $("<i>", {
        class: "icon-chevron-down expand-icon font-weight-bold",
        click: function (e) {
          e.preventDefault();
          var i = $(this).parents("ul.expanded-menu");
          i.each(function (t, e) {
            $(e).outerHeight();
          }),
            $(".expanded-menu")
              .not(t)
              .not($(this).parents("ul"))
              .removeClass("expanded-menu")
              .height("0px"),
            $(".toggled")
              .not(this)
              .not($(this).parents(".toggled"))
              .removeClass("toggled"),
            $(this).toggleClass("toggled");
          var n = $(this).closest(".submenu").find("> ul > li"),
            o = 0;
          if (
            (n.each(function (t, e) {
              o += $(e).outerHeight();
            }),
            t.hasClass("expanded-menu"))
          ) {
            if ((t.removeClass("expanded-menu").height("0px"), i.length)) {
              var s = (n = $(i).find("> li")).first();
              o = n.length * s.outerHeight();
              i.height(o + "px");
            }
          } else t.addClass("expanded-menu").height(o + "px");
          i.length && i.height(o + s.outerHeight() + "px");
        },
      }).prependTo(e);
    }),
      e.append();
  }),
  $(document).ready(function () {
    function t() {
      var t =
          ($(".ex-announcement").outerHeight() || 0) +
          ($(".ex-header__wrapper").outerHeight() || 0),
        e = $(window).scrollTop(),
        i =
          ($.extractValueFromStr &&
            $.extractValueFromStr(
              $("meta[name='scrolling']").attr("content"),
              "scroll-after"
            )) ||
          5;
      e < t + i && $(".ex-header").removeAttr("style"),
        e >= t + i && $(".ex-header").css({ height: "0" }),
        e >= t + i &&
          $(".ex-header").css({ height: t + "px", position: "fixed" }),
        $("body").hasClass("scrolled")
          ? $(".ex-header__left-section")
              .find(".ex-header__left-section__logo-menu")
              .addClass("d-flex")
          : $(".ex-header__left-section")
              .find(".ex-header__left-section__logo-menu")
              .removeClass("d-flex");
    }
    $(".ex-image-highlights").hasClass(
      ".ex-image-highlights".replace(".", "") + "-v2"
    ) && $("body").addClass("secondary-highlight"),
      $(window).scroll(function () {
        t();
      }),
      t();
  }),
  $(document).ready(function () {
    let t =
      /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) && window.matchMedia("(orientation: portrait)").matches;
    var e = $.checkSiteRTLDirection(),
      i = window.location.pathname,
      n = ".ex-header__right-section__upper-navigation-menu li";
    $(n + " a").each(function (t, e) {
      $(e).attr("href") == i && $(e).closest("li").addClass("current");
    });
    var o = $(".navigation-marker"),
      s = $(n + ".current");
    s.length &&
      (s.addClass("active-nav"),
      o.css({
        left: s.position().left,
        width: s.outerWidth(),
        display: "block",
      })),
      "undefined" != typeof Modernizr && Modernizr.csstransitions
        ? ($(n).mouseover(function () {
            var t = $(this),
              e = t.position().left,
              i = t.outerWidth();
            (amount = 0 == e ? 0 : e),
              $(".active-nav").removeClass("active-nav"),
              t.addClass("active-nav"),
              o.css({ left: amount, width: i, display: "block" });
          }),
          $(n)
            .parent()
            .mouseleave(function () {
              $(".active-nav").removeClass("active-nav"),
                s.length
                  ? (s.addClass("active-nav"),
                    o.css({ left: s.position().left, width: s.outerWidth() }))
                  : o.css({ display: "none" });
            }))
        : ($(n).mouseover(function () {
            var t = $(this),
              e = t.position().left,
              i = t.outerWidth();
            (amount = 0 == e ? 0 : e),
              $(".active-nav").removeClass("active-nav"),
              t.addClass("active-nav"),
              o.stop().animate({ left: amount, width: i }, 300),
              o.css({ display: "block" });
          }),
          $(n)
            .parent()
            .mouseleave(function () {
              $(".active-nav").removeClass("active-nav"),
                s.length
                  ? (s.addClass("active-nav"),
                    o
                      .stop()
                      .animate(
                        { left: s.position().left, width: s.outerWidth() },
                        300
                      ))
                  : o.css({ display: "none" });
            })),
      $("#sidebarCollapse , .overlay").on("click", function () {
        $(".ex-header__right-section__search-dismiss").click(),
          $("#sidebar").toggleClass("sidemenu--active"),
          $("#sidebarCollapse .menu-icon").toggleClass("menu-icon--active"),
          $(".overlay").toggleClass("overlay--active"),
          $(".collapse.in").toggle("slide"),
          $("#sidebarCollapse .menu-icon").toggleClass("is-active");
      }),
      $(".ex-header__right-section__search-icon").on("click", function () {
        $(".search-box").addClass("search-box--active"),
          $(".ex-header__left-section").css("z-index", "0"),
          $(".ex-header__right-section__search-dismiss").show(),
          $(".ex-header__right-section__search-icon").hide();
      }),
      $(".ex-header__right-section__search-dismiss").on("click", function () {
        $(".search-box").removeClass("search-box--active"),
          $(".ex-header__left-section").css("z-index", "90"),
          $(".ex-header__right-section__search-dismiss").hide(),
          $(".ex-header__right-section__search-icon").show();
      }),
      $("[data-settings]").on("click", function () {
        function i() {
          $(".ex-header__right-section__search-dismiss").click(),
            $("#sidebarCollapse .menu-icon--active").parent().click();
        }
        $(".ex-header__right-section__icon-wrp__overlay").hide(),
          $(".settings-wrp").hasClass("settings-wrp--active")
            ? (e
                ? $(".settings-wrp")
                    .css({ right: "auto" })
                    .animate(
                      {
                        left:
                          "-" + (t ? "100%" : $(".settings-wrp").outerWidth()),
                      },
                      500,
                      i
                    )
                    .removeClass("settings-wrp--active")
                    .hide()
                : $(".settings-wrp")
                    .css({ left: "auto" })
                    .animate(
                      {
                        right:
                          "-" + (t ? "100%" : $(".settings-wrp").outerWidth()),
                      },
                      500,
                      i
                    )
                    .removeClass("settings-wrp--active")
                    .hide(),
              $(".ex-header__right-section__icon-wrp__overlay").hide())
            : (e
                ? $(".settings-wrp")
                    .show()
                    .css({ right: "auto" })
                    .animate({ left: 0 }, 500, i)
                    .addClass("settings-wrp--active")
                : $(".settings-wrp")
                    .show()
                    .css({ left: "auto" })
                    .animate({ right: 0 }, 500, i)
                    .addClass("settings-wrp--active"),
              $(".ex-header__right-section__icon-wrp__overlay").show());
      });
  }),
  $(document).ready(function () {
    var t = $.checkSiteRTLDirection(),
      e = $(".page-breadcrumb-v2 ol"),
      i = e.find("a"),
      n = $("<div class='bredcrumb-dropdown position-absolute mt-1'/>");
    function o() {
      var t = $("<div class='dropdown-menu' />");
      return n.empty(), n.append(t), t;
    }
    function s() {
      $(".page-breadcrumb-v2 .bredcrumb-dropdown").replaceWith(e);
      var s = $(".breadcrumb-toggler--dots");
      if ($(window).width() < 767)
        ($select = o()),
          i.each(function () {
            if ($(this)[0] !== i.last()[0]) {
              var t = $("<a />");
              t.attr("href", $(this).attr("href")).html($(this).html()),
                t.attr("class", "dropdown-item"),
                $select.append(t),
                $select.append($("<div class='dropdown-divider'></div>"));
            }
          }),
          s.remove(),
          n.removeClass("position-absolute"),
          $(e).replaceWith(n);
      else if ($(window).width() < 992 && i.length > 4) {
        ($select = o()), s.addClass("d-md-inline-block");
        for (var r = 1; r < i.length - 2; r++) {
          var a = i[r],
            l = $("<a />");
          l.attr("href", $(a).attr("href")).html($(a).html()),
            l.attr("class", "dropdown-item"),
            $select.append(l),
            $select.append($("<div class='dropdown-divider'></div>")),
            $(a).parents("li").remove();
        }
        s.insertAfter($(e).children().first()),
          t ? n.css({ right: "-35px" }) : n.css({ left: "-35px" }),
          s.append(n);
      } else
        s.removeClass("d-md-inline-block"),
          $(".page-breadcrumb-v2 .bredcrumb-dropdown").length > 0 &&
            $(".page-breadcrumb-v2 .bredcrumb-dropdown").replaceWith(e);
    }
    s(),
      $(window).resize(function () {
        s();
      }),
      $(document).mouseup(function (t) {
        var e = $(".dropdown-menu");
        e.hasClass("show") &&
          !e.is(t.target) &&
          (0 === e.has(t.target).length) &
            !$(t.target).hasClass("breadcrumb-toggler") &&
          $(".dropdown-menu").toggleClass("show");
      }),
      $(".breadcrumb-toggler").on("click", function () {
        $(".dropdown-menu").toggleClass("show");
      });
  }),
  $(document).ready(function () {
    var t;
    $(".ex-footer-v2")
      .find(".accordion__item")
      .on("click", function () {
        var e = $(this).find("ul").parent();
        !t && (t = $(this).outerHeight()),
          $(".accordion__item--opened").animate(
            { height: t },
            300,
            function () {
              $(this).toggleClass("accordion__item--opened");
            }
          ),
          $(this).hasClass("accordion__item--opened") ||
            $(this).animate(
              { height: e.outerHeight() + $(this).outerHeight() },
              300,
              function () {
                $(this).toggleClass("accordion__item--opened");
              }
            );
      });
  }),
  $(document).ready(function () {
    var t = $.checkSiteRTLDirection(),
      e = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      i = $(".ex-leftnav"),
      n = $(".ex-leftnav nav");
    function o(e) {
      var i = e.prevAll(),
        o = (e.nextAll(), 0);
      i.map(function (t, e) {
        return $(e).width();
      });
      i.each(function () {
        o += $(this).width();
      }),
        t ? n.scrollLeft(-(o - 50)) : n.scrollLeft(o - 50);
    }
    $(".ex-leftnav").removeClass("col-12"), e && o(n.find(".active"));
    var s = $('a[href*="#"]').not('[href="#"]').not('[href="#0"]');
    s.first().parents("li").addClass("active"),
      s.length &&
        !e &&
        (i.addClass("position-absolute"),
        $(window).scroll(function () {
          var t = $(".ex-header").outerHeight(),
            e =
              $("html, body").scrollTop() - $(".column-splitter").offset().top,
            n = e + t;
          i.height() + n > $(".column-splitter").height() ||
            (e > -t ? i.css({ top: n }) : i.css({ top: 0 }));
        })),
      s.click(function (t) {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var e = $(this.hash);
          if (
            (e = e.length ? e : $("[name=" + this.hash.slice(1) + "]")).length
          ) {
            var i = $(".ex-header").height();
            t.preventDefault(),
              $("html, body").animate(
                { scrollTop: e.offset().top - i },
                500,
                function () {
                  var t = $(e);
                  if ((t.focus(), t.is(":focus"))) return !1;
                }
              ),
              $(this)
                .parents("li")
                .addClass("active")
                .siblings()
                .removeClass("active"),
              o($(this).parents("li"));
          }
        }
      });
  }),
  $(window).scroll(function () {
    var t = $(".breadcrumb").innerHeight(),
      e = $(".innerpage-headerbg").innerHeight(),
      i = $("main").innerHeight();
    if (window.innerWidth >= 1024) {
      var n = $(".ex-leftnav").height(),
        o = i - (n = parseInt(n) + 220),
        s = $(window).scrollTop() + t;
      (t = parseInt(t) + 150),
        $(window).scrollTop() >= t
          ? ($("ex-leftnav").addClass("stickynav_fixed"),
            $(".ex-leftnav--fixed .ex-leftnav").css("top", e))
          : ($(".ex-leftnav--fixed .ex-leftnav").removeAttr("style"),
            $("ex-leftnav").removeClass("ex-leftnav--fixed")),
        s >= o
          ? $("ex-leftnav").addClass("ex-leftnav--fixedbottom")
          : $("ex-leftnav").removeClass("ex-leftnav--fixedbottom");
    }
    if (window.innerWidth <= 992) {
      var r = $(".innerpage-headerbg").innerHeight();
      console.log("brkpoint " + r),
        window.innerWidth <= 767 && (r = parseInt(r) - 25),
        $(window).scrollTop() >= r
          ? $(".ex-leftnav ").addClass("ex-leftnav--fixedtop")
          : $(".ex-leftnav ").removeClass("ex-leftnav--fixedtop");
    }
  }),
  (function () {
    "use strict";
    function t(t) {
      if (void 0 === t)
        throw new Error(
          'Pathformer [constructor]: "element" parameter is required'
        );
      if (t.constructor === String && !(t = document.getElementById(t)))
        throw new Error(
          'Pathformer [constructor]: "element" parameter is not related to an existing ID'
        );
      if (
        !(
          t instanceof window.SVGElement ||
          t instanceof window.SVGGElement ||
          /^svg$/i.test(t.nodeName)
        )
      )
        throw new Error(
          'Pathformer [constructor]: "element" parameter must be a string or a SVGelement'
        );
      (this.el = t), this.scan(t);
    }
    var e, i, n, o;
    function s(t, i, n) {
      e(),
        (this.isReady = !1),
        this.setElement(t, i),
        this.setOptions(i),
        this.setCallback(n),
        this.isReady && this.init();
    }
    (t.prototype.TYPES = [
      "line",
      "ellipse",
      "circle",
      "polygon",
      "polyline",
      "rect",
    ]),
      (t.prototype.ATTR_WATCH = [
        "cx",
        "cy",
        "points",
        "r",
        "rx",
        "ry",
        "x",
        "x1",
        "x2",
        "y",
        "y1",
        "y2",
      ]),
      (t.prototype.scan = function (t) {
        for (
          var e, i, n, o = t.querySelectorAll(this.TYPES.join(",")), s = 0;
          s < o.length;
          s++
        )
          (i = (0, this[(e = o[s]).tagName.toLowerCase() + "ToPath"])(
            this.parseAttr(e.attributes)
          )),
            (n = this.pathMaker(e, i)),
            e.parentNode.replaceChild(n, e);
      }),
      (t.prototype.lineToPath = function (t) {
        var e = {},
          i = t.x1 || 0,
          n = t.y1 || 0,
          o = t.x2 || 0,
          s = t.y2 || 0;
        return (e.d = "M" + i + "," + n + "L" + o + "," + s), e;
      }),
      (t.prototype.rectToPath = function (t) {
        var e = {},
          i = parseFloat(t.x) || 0,
          n = parseFloat(t.y) || 0,
          o = parseFloat(t.width) || 0,
          s = parseFloat(t.height) || 0;
        if (t.rx || t.ry) {
          var r = parseInt(t.rx, 10) || -1,
            a = parseInt(t.ry, 10) || -1;
          (r = Math.min(Math.max(r < 0 ? a : r, 0), o / 2)),
            (a = Math.min(Math.max(a < 0 ? r : a, 0), s / 2)),
            (e.d =
              "M " +
              (i + r) +
              "," +
              n +
              " L " +
              (i + o - r) +
              "," +
              n +
              " A " +
              r +
              "," +
              a +
              ",0,0,1," +
              (i + o) +
              "," +
              (n + a) +
              " L " +
              (i + o) +
              "," +
              (n + s - a) +
              " A " +
              r +
              "," +
              a +
              ",0,0,1," +
              (i + o - r) +
              "," +
              (n + s) +
              " L " +
              (i + r) +
              "," +
              (n + s) +
              " A " +
              r +
              "," +
              a +
              ",0,0,1," +
              i +
              "," +
              (n + s - a) +
              " L " +
              i +
              "," +
              (n + a) +
              " A " +
              r +
              "," +
              a +
              ",0,0,1," +
              (i + r) +
              "," +
              n);
        } else
          e.d =
            "M" +
            i +
            " " +
            n +
            " L" +
            (i + o) +
            " " +
            n +
            " L" +
            (i + o) +
            " " +
            (n + s) +
            " L" +
            i +
            " " +
            (n + s) +
            " Z";
        return e;
      }),
      (t.prototype.polylineToPath = function (t) {
        var e,
          i,
          n = {},
          o = t.points.trim().split(" ");
        if (-1 === t.points.indexOf(",")) {
          var s = [];
          for (e = 0; e < o.length; e += 2) s.push(o[e] + "," + o[e + 1]);
          o = s;
        }
        for (i = "M" + o[0], e = 1; e < o.length; e++)
          -1 !== o[e].indexOf(",") && (i += "L" + o[e]);
        return (n.d = i), n;
      }),
      (t.prototype.polygonToPath = function (e) {
        var i = t.prototype.polylineToPath(e);
        return (i.d += "Z"), i;
      }),
      (t.prototype.ellipseToPath = function (t) {
        var e = {},
          i = parseFloat(t.rx) || 0,
          n = parseFloat(t.ry) || 0,
          o = parseFloat(t.cx) || 0,
          s = parseFloat(t.cy) || 0,
          r = o - i,
          a = s,
          l = parseFloat(o) + parseFloat(i),
          c = s;
        return (
          (e.d =
            "M" +
            r +
            "," +
            a +
            "A" +
            i +
            "," +
            n +
            " 0,1,1 " +
            l +
            "," +
            c +
            "A" +
            i +
            "," +
            n +
            " 0,1,1 " +
            r +
            "," +
            c),
          e
        );
      }),
      (t.prototype.circleToPath = function (t) {
        var e = {},
          i = parseFloat(t.r) || 0,
          n = parseFloat(t.cx) || 0,
          o = parseFloat(t.cy) || 0,
          s = n - i,
          r = o,
          a = parseFloat(n) + parseFloat(i),
          l = o;
        return (
          (e.d =
            "M" +
            s +
            "," +
            r +
            "A" +
            i +
            "," +
            i +
            " 0,1,1 " +
            a +
            "," +
            l +
            "A" +
            i +
            "," +
            i +
            " 0,1,1 " +
            s +
            "," +
            l),
          e
        );
      }),
      (t.prototype.pathMaker = function (t, e) {
        var i,
          n,
          o = document.createElementNS("http://www.w3.org/2000/svg", "path");
        for (i = 0; i < t.attributes.length; i++)
          (n = t.attributes[i]),
            -1 === this.ATTR_WATCH.indexOf(n.name) &&
              o.setAttribute(n.name, n.value);
        for (i in e) o.setAttribute(i, e[i]);
        return o;
      }),
      (t.prototype.parseAttr = function (t) {
        for (var e, i = {}, n = 0; n < t.length; n++) {
          if (
            ((e = t[n]),
            -1 !== this.ATTR_WATCH.indexOf(e.name) &&
              -1 !== e.value.indexOf("%"))
          )
            throw new Error(
              "Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into 'path' tags. Please use 'viewBox'."
            );
          i[e.name] = e.value;
        }
        return i;
      }),
      (s.LINEAR = function (t) {
        return t;
      }),
      (s.EASE = function (t) {
        return -Math.cos(t * Math.PI) / 2 + 0.5;
      }),
      (s.EASE_OUT = function (t) {
        return 1 - Math.pow(1 - t, 3);
      }),
      (s.EASE_IN = function (t) {
        return Math.pow(t, 3);
      }),
      (s.EASE_OUT_BOUNCE = function (t) {
        var e = 1 - Math.cos(t * (0.5 * Math.PI)),
          i = Math.pow(e, 1.5),
          n = Math.pow(1 - t, 2);
        return 1 - n + (1 - Math.abs(Math.cos(i * (2.5 * Math.PI)))) * n;
      }),
      (s.prototype.setElement = function (t, e) {
        var i, n;
        if (void 0 === t)
          throw new Error(
            'Vivus [constructor]: "element" parameter is required'
          );
        if (t.constructor === String && !(t = document.getElementById(t)))
          throw new Error(
            'Vivus [constructor]: "element" parameter is not related to an existing ID'
          );
        if (((this.parentEl = t), e && e.file)) {
          (n = this),
            (i = function () {
              var t = document.createElement("div");
              t.innerHTML = this.responseText;
              var i = t.querySelector("svg");
              if (!i)
                throw new Error(
                  "Vivus [load]: Cannot find the SVG in the loaded file : " +
                    e.file
                );
              (n.el = i),
                n.el.setAttribute("width", "100%"),
                n.el.setAttribute("height", "100%"),
                n.parentEl.appendChild(n.el),
                (n.isReady = !0),
                n.init(),
                (n = null);
            });
          var o = new window.XMLHttpRequest();
          return (
            o.addEventListener("load", i), o.open("GET", e.file), void o.send()
          );
        }
        switch (t.constructor) {
          case window.SVGSVGElement:
          case window.SVGElement:
          case window.SVGGElement:
            (this.el = t), (this.isReady = !0);
            break;
          case window.HTMLObjectElement:
            (n = this),
              (i = function (e) {
                if (!n.isReady) {
                  if (
                    ((n.el =
                      t.contentDocument &&
                      t.contentDocument.querySelector("svg")),
                    !n.el && e)
                  )
                    throw new Error(
                      "Vivus [constructor]: object loaded does not contain any SVG"
                    );
                  n.el &&
                    (t.getAttribute("built-by-vivus") &&
                      (n.parentEl.insertBefore(n.el, t),
                      n.parentEl.removeChild(t),
                      n.el.setAttribute("width", "100%"),
                      n.el.setAttribute("height", "100%")),
                    (n.isReady = !0),
                    n.init(),
                    (n = null));
                }
              })() || t.addEventListener("load", i);
            break;
          default:
            throw new Error(
              'Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)'
            );
        }
      }),
      (s.prototype.setOptions = function (t) {
        var e = [
            "delayed",
            "sync",
            "async",
            "nsync",
            "oneByOne",
            "scenario",
            "scenario-sync",
          ],
          i = ["inViewport", "manual", "autostart"];
        if (void 0 !== t && t.constructor !== Object)
          throw new Error(
            'Vivus [constructor]: "options" parameter must be an object'
          );
        if ((t = t || {}).type && -1 === e.indexOf(t.type))
          throw new Error(
            "Vivus [constructor]: " +
              t.type +
              " is not an existing animation `type`"
          );
        if (
          ((this.type = t.type || e[0]), t.start && -1 === i.indexOf(t.start))
        )
          throw new Error(
            "Vivus [constructor]: " +
              t.start +
              " is not an existing `start` option"
          );
        if (
          ((this.start = t.start || i[0]),
          (this.isIE =
            -1 !== window.navigator.userAgent.indexOf("MSIE") ||
            -1 !== window.navigator.userAgent.indexOf("Trident/") ||
            -1 !== window.navigator.userAgent.indexOf("Edge/")),
          (this.duration = o(t.duration, 120)),
          (this.delay = o(t.delay, null)),
          (this.dashGap = o(t.dashGap, 1)),
          (this.forceRender = t.hasOwnProperty("forceRender")
            ? !!t.forceRender
            : this.isIE),
          (this.reverseStack = !!t.reverseStack),
          (this.selfDestroy = !!t.selfDestroy),
          (this.onReady = t.onReady),
          (this.map = []),
          (this.frameLength =
            this.currentFrame =
            this.delayUnit =
            this.speed =
            this.handle =
              null),
          (this.ignoreInvisible =
            !!t.hasOwnProperty("ignoreInvisible") && !!t.ignoreInvisible),
          (this.animTimingFunction = t.animTimingFunction || s.LINEAR),
          (this.pathTimingFunction = t.pathTimingFunction || s.LINEAR),
          this.delay >= this.duration)
        )
          throw new Error(
            "Vivus [constructor]: delay must be shorter than duration"
          );
      }),
      (s.prototype.setCallback = function (t) {
        if (t && t.constructor !== Function)
          throw new Error(
            'Vivus [constructor]: "callback" parameter must be a function'
          );
        this.callback = t || function () {};
      }),
      (s.prototype.mapping = function () {
        var t, e, i, n, s, r, a, l;
        for (
          l = r = a = 0, e = this.el.querySelectorAll("path"), t = 0;
          t < e.length;
          t++
        )
          (i = e[t]),
            this.isInvisible(i) ||
              ((s = { el: i, length: Math.ceil(i.getTotalLength()) }),
              isNaN(s.length)
                ? window.console &&
                  console.warn &&
                  console.warn(
                    "Vivus [mapping]: cannot retrieve a path element length",
                    i
                  )
                : (this.map.push(s),
                  (i.style.strokeDasharray =
                    s.length + " " + (s.length + 2 * this.dashGap)),
                  (i.style.strokeDashoffset = s.length + this.dashGap),
                  (s.length += this.dashGap),
                  (r += s.length),
                  this.renderPath(t)));
        for (
          r = 0 === r ? 1 : r,
            this.delay = null === this.delay ? this.duration / 3 : this.delay,
            this.delayUnit = this.delay / (1 < e.length ? e.length - 1 : 1),
            this.reverseStack && this.map.reverse(),
            t = 0;
          t < this.map.length;
          t++
        ) {
          switch (((s = this.map[t]), this.type)) {
            case "delayed":
              (s.startAt = this.delayUnit * t),
                (s.duration = this.duration - this.delay);
              break;
            case "oneByOne":
              (s.startAt = (a / r) * this.duration),
                (s.duration = (s.length / r) * this.duration);
              break;
            case "sync":
            case "async":
            case "nsync":
              (s.startAt = 0), (s.duration = this.duration);
              break;
            case "scenario-sync":
              (i = s.el),
                (n = this.parseAttr(i)),
                (s.startAt = l + (o(n["data-delay"], this.delayUnit) || 0)),
                (s.duration = o(n["data-duration"], this.duration)),
                (l =
                  void 0 !== n["data-async"]
                    ? s.startAt
                    : s.startAt + s.duration),
                (this.frameLength = Math.max(
                  this.frameLength,
                  s.startAt + s.duration
                ));
              break;
            case "scenario":
              (i = s.el),
                (n = this.parseAttr(i)),
                (s.startAt = o(n["data-start"], this.delayUnit) || 0),
                (s.duration = o(n["data-duration"], this.duration)),
                (this.frameLength = Math.max(
                  this.frameLength,
                  s.startAt + s.duration
                ));
          }
          (a += s.length),
            (this.frameLength = this.frameLength || this.duration);
        }
      }),
      (s.prototype.drawer = function () {
        var t = this;
        if (((this.currentFrame += this.speed), this.currentFrame <= 0))
          this.stop(), this.reset();
        else {
          if (!(this.currentFrame >= this.frameLength))
            return (
              this.trace(),
              void (this.handle = i(function () {
                t.drawer();
              }))
            );
          this.stop(),
            (this.currentFrame = this.frameLength),
            this.trace(),
            this.selfDestroy && this.destroy();
        }
        this.callback(this),
          this.instanceCallback &&
            (this.instanceCallback(this), (this.instanceCallback = null));
      }),
      (s.prototype.trace = function () {
        var t, e, i, n;
        for (
          n =
            this.animTimingFunction(this.currentFrame / this.frameLength) *
            this.frameLength,
            t = 0;
          t < this.map.length;
          t++
        )
          (e = (n - (i = this.map[t]).startAt) / i.duration),
            (e = this.pathTimingFunction(Math.max(0, Math.min(1, e)))),
            i.progress !== e &&
              ((i.progress = e),
              (i.el.style.strokeDashoffset = Math.floor(i.length * (1 - e))),
              this.renderPath(t));
      }),
      (s.prototype.renderPath = function (t) {
        if (this.forceRender && this.map && this.map[t]) {
          var e = this.map[t],
            i = e.el.cloneNode(!0);
          e.el.parentNode.replaceChild(i, e.el), (e.el = i);
        }
      }),
      (s.prototype.init = function () {
        (this.frameLength = 0),
          (this.currentFrame = 0),
          (this.map = []),
          new t(this.el),
          this.mapping(),
          this.starter(),
          this.onReady && this.onReady(this);
      }),
      (s.prototype.starter = function () {
        switch (this.start) {
          case "manual":
            return;
          case "autostart":
            this.play();
            break;
          case "inViewport":
            var t = this,
              e = function () {
                t.isInViewport(t.parentEl, 1) &&
                  (t.play(), window.removeEventListener("scroll", e));
              };
            window.addEventListener("scroll", e), e();
        }
      }),
      (s.prototype.getStatus = function () {
        return 0 === this.currentFrame
          ? "start"
          : this.currentFrame === this.frameLength
          ? "end"
          : "progress";
      }),
      (s.prototype.reset = function () {
        return this.setFrameProgress(0);
      }),
      (s.prototype.finish = function () {
        return this.setFrameProgress(1);
      }),
      (s.prototype.setFrameProgress = function (t) {
        return (
          (t = Math.min(1, Math.max(0, t))),
          (this.currentFrame = Math.round(this.frameLength * t)),
          this.trace(),
          this
        );
      }),
      (s.prototype.play = function (t, e) {
        if (((this.instanceCallback = null), t && "function" == typeof t))
          (this.instanceCallback = t), (t = null);
        else if (t && "number" != typeof t)
          throw new Error("Vivus [play]: invalid speed");
        return (
          e &&
            "function" == typeof e &&
            !this.instanceCallback &&
            (this.instanceCallback = e),
          (this.speed = t || 1),
          this.handle || this.drawer(),
          this
        );
      }),
      (s.prototype.stop = function () {
        return this.handle && (n(this.handle), (this.handle = null)), this;
      }),
      (s.prototype.destroy = function () {
        var t, e;
        for (this.stop(), t = 0; t < this.map.length; t++)
          ((e = this.map[t]).el.style.strokeDashoffset = null),
            (e.el.style.strokeDasharray = null),
            this.renderPath(t);
      }),
      (s.prototype.isInvisible = function (t) {
        var e,
          i = t.getAttribute("data-ignore");
        return null !== i
          ? "false" !== i
          : !!this.ignoreInvisible &&
              !(e = t.getBoundingClientRect()).width &&
              !e.height;
      }),
      (s.prototype.parseAttr = function (t) {
        var e,
          i = {};
        if (t && t.attributes)
          for (var n = 0; n < t.attributes.length; n++)
            i[(e = t.attributes[n]).name] = e.value;
        return i;
      }),
      (s.prototype.isInViewport = function (t, e) {
        var i = this.scrollY(),
          n = i + this.getViewportH(),
          o = t.getBoundingClientRect(),
          s = o.height,
          r = i + o.top;
        return r + s * (e = e || 0) <= n && i <= r + s;
      }),
      (s.prototype.getViewportH = function () {
        var t = this.docElem.clientHeight,
          e = window.innerHeight;
        return t < e ? e : t;
      }),
      (s.prototype.scrollY = function () {
        return window.pageYOffset || this.docElem.scrollTop;
      }),
      (e = function () {
        s.prototype.docElem ||
          ((s.prototype.docElem = window.document.documentElement),
          (i =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (t) {
              return window.setTimeout(t, 1e3 / 60);
            }),
          (n =
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function (t) {
              return window.clearTimeout(t);
            }));
      }),
      (o = function (t, e) {
        var i = parseInt(t, 10);
        return 0 <= i ? i : e;
      }),
      "function" == typeof define && define.amd
        ? define([], function () {
            return s;
          })
        : "object" == typeof exports
        ? (module.exports = s)
        : (window.Vivus = s);
  })(),
  $(window).on("load", loadHandler),
  $().ready(function () {
    initLoader();
  }),
  (function (t) {
    function e(t, e, i) {
      (t.rules[e] = i), t.message && (t.messages[e] = t.message);
    }
    function i(t) {
      return t.replace(/([!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
    }
    function n(t) {
      return t.substr(0, t.lastIndexOf(".") + 1);
    }
    function o(t, e) {
      return 0 === t.indexOf("*.") && (t = t.replace("*.", e)), t;
    }
    function s(e, n) {
      var o = t(this).find("[data-valmsg-for='" + i(n[0].name) + "']"),
        s = o.attr("data-valmsg-replace"),
        r = s ? !1 !== t.parseJSON(s) : null;
      o
        .removeClass("field-validation-valid")
        .addClass("field-validation-error"),
        e.data("unobtrusiveContainer", o),
        r
          ? (o.empty(), e.removeClass("input-validation-error").appendTo(o))
          : e.hide();
    }
    function r(e) {
      var i = t(this),
        n = "__jquery_unobtrusive_validation_form_reset";
      if (!i.data(n)) {
        i.data(n, !0);
        try {
          i.data("validator").resetForm();
        } finally {
          i.removeData(n);
        }
        i
          .find(".validation-summary-errors")
          .addClass("validation-summary-valid")
          .removeClass("validation-summary-errors"),
          i
            .find(".field-validation-error")
            .addClass("field-validation-valid")
            .removeClass("field-validation-error")
            .removeData("unobtrusiveContainer")
            .find(">*")
            .removeData("unobtrusiveContainer");
      }
    }
    function a(e) {
      var i = t(e),
        n = i.data(u),
        o = t.proxy(r, e),
        a = c.unobtrusive.options || {},
        l = function (i, n) {
          var o = a[i];
          o && t.isFunction(o) && o.apply(e, n);
        };
      return (
        n ||
          ((n = {
            options: {
              errorClass: a.errorClass || "input-validation-error",
              errorElement: a.errorElement || "span",
              errorPlacement: function () {
                s.apply(e, arguments), l("errorPlacement", arguments);
              },
              invalidHandler: function () {
                (function (e, i) {
                  var n = t(this).find("[data-valmsg-summary=true]"),
                    o = n.find("ul");
                  o &&
                    o.length &&
                    i.errorList.length &&
                    (o.empty(),
                    n
                      .addClass("validation-summary-errors")
                      .removeClass("validation-summary-valid"),
                    t.each(i.errorList, function () {
                      t("<li />").html(this.message).appendTo(o);
                    }));
                }).apply(e, arguments),
                  l("invalidHandler", arguments);
              },
              messages: {},
              rules: {},
              success: function () {
                (function (e) {
                  var i = e.data("unobtrusiveContainer");
                  if (i) {
                    var n = i.attr("data-valmsg-replace"),
                      o = n ? t.parseJSON(n) : null;
                    i
                      .addClass("field-validation-valid")
                      .removeClass("field-validation-error"),
                      e.removeData("unobtrusiveContainer"),
                      o && i.empty();
                  }
                }).apply(e, arguments),
                  l("success", arguments);
              },
            },
            attachValidation: function () {
              i.off("reset." + u, o)
                .on("reset." + u, o)
                .validate(this.options);
            },
            validate: function () {
              return i.validate(), i.valid();
            },
          }),
          i.data(u, n)),
        n
      );
    }
    var l,
      c = t.validator,
      u = "unobtrusiveValidation";
    (c.unobtrusive = {
      adapters: [],
      parseElement: function (e, i) {
        var n,
          o,
          s,
          r = t(e),
          l = r.parents("form")[0];
        l &&
          (((n = a(l)).options.rules[e.name] = o = {}),
          (n.options.messages[e.name] = s = {}),
          t.each(this.adapters, function () {
            var i = "data-val-" + this.name,
              n = r.attr(i),
              a = {};
            void 0 !== n &&
              ((i += "-"),
              t.each(this.params, function () {
                a[this] = r.attr(i + this);
              }),
              this.adapt({
                element: e,
                form: l,
                message: n,
                params: a,
                rules: o,
                messages: s,
              }));
          }),
          t.extend(o, { __dummy__: !0 }),
          i || n.attachValidation());
      },
      parse: function (e) {
        var i = t(e),
          n = i
            .parents()
            .addBack()
            .filter("form")
            .add(i.find("form"))
            .has("[data-val=true]");
        i.find("[data-val=true]").each(function () {
          c.unobtrusive.parseElement(this, !0);
        }),
          n.each(function () {
            var t = a(this);
            t && t.attachValidation();
          });
      },
    }),
      ((l = c.unobtrusive.adapters).add = function (t, e, i) {
        return (
          i || ((i = e), (e = [])),
          this.push({ name: t, params: e, adapt: i }),
          this
        );
      }),
      (l.addBool = function (t, i) {
        return this.add(t, function (n) {
          e(n, i || t, !0);
        });
      }),
      (l.addMinMax = function (t, i, n, o, s, r) {
        return this.add(t, [s || "min", r || "max"], function (t) {
          var s = t.params.min,
            r = t.params.max;
          s && r ? e(t, o, [s, r]) : s ? e(t, i, s) : r && e(t, n, r);
        });
      }),
      (l.addSingleVal = function (t, i, n) {
        return this.add(t, [i || "val"], function (o) {
          e(o, n || t, o.params[i]);
        });
      }),
      c.addMethod("__dummy__", function (t, e, i) {
        return !0;
      }),
      c.addMethod("regex", function (t, e, i) {
        var n;
        return (
          !!this.optional(e) ||
          ((n = new RegExp(i).exec(t)) &&
            0 === n.index &&
            n[0].length === t.length)
        );
      }),
      c.addMethod("nonalphamin", function (t, e, i) {
        var n;
        return i && (n = (n = t.match(/\W/g)) && n.length >= i), n;
      }),
      c.methods.extension
        ? (l.addSingleVal("accept", "mimtype"),
          l.addSingleVal("extension", "extension"))
        : l.addSingleVal("extension", "extension", "accept"),
      l.addSingleVal("regex", "pattern"),
      l
        .addBool("creditcard")
        .addBool("date")
        .addBool("digits")
        .addBool("email")
        .addBool("number")
        .addBool("url"),
      l
        .addMinMax("length", "minlength", "maxlength", "rangelength")
        .addMinMax("range", "min", "max", "range"),
      l
        .addMinMax("minlength", "minlength")
        .addMinMax("maxlength", "minlength", "maxlength"),
      l.add("equalto", ["other"], function (s) {
        var r = n(s.element.name),
          a = o(s.params.other, r);
        e(
          s,
          "equalTo",
          t(s.form)
            .find(":input")
            .filter("[name='" + i(a) + "']")[0]
        );
      }),
      l.add("required", function (t) {
        ("INPUT" !== t.element.tagName.toUpperCase() ||
          "CHECKBOX" !== t.element.type.toUpperCase()) &&
          e(t, "required", !0);
      }),
      l.add("remote", ["url", "type", "additionalfields"], function (s) {
        var r = { url: s.params.url, type: s.params.type || "GET", data: {} },
          a = n(s.element.name);
        t.each(
          (function (t) {
            return t.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
          })(s.params.additionalfields || s.element.name),
          function (e, n) {
            var l = o(n, a);
            r.data[l] = function () {
              var e = t(s.form)
                .find(":input")
                .filter("[name='" + i(l) + "']");
              return e.is(":checkbox")
                ? e.filter(":checked").val() || e.filter(":hidden").val() || ""
                : e.is(":radio")
                ? e.filter(":checked").val() || ""
                : e.val();
            };
          }
        ),
          e(s, "remote", r);
      }),
      l.add("password", ["min", "nonalphamin", "regex"], function (t) {
        t.params.min && e(t, "minlength", t.params.min),
          t.params.nonalphamin && e(t, "nonalphamin", t.params.nonalphamin),
          t.params.regex && e(t, "regex", t.params.regex);
      }),
      t(function () {
        c.unobtrusive.parse(document);
      });
  })(jQuery),
  (function (t) {
    var e = t.validator.unobtrusive.adapters;
    (e.fxbAddNumberVal = function (t, e, i) {
      (e = e || "val"),
        (i = i || t),
        this.add(t, [e], function (t) {
          var n = t.params[e];
          (!n && 0 !== n) || isNaN(n) || (t.rules[i] = Number(n)),
            t.message && (t.messages[i] = t.message);
        });
    }),
      (e.fxbAddMinMax = function (t, e, i, n, o) {
        (n = n || "min"),
          (o = o || "max"),
          this.add(t, [n, o], function (t) {
            t.params[n] &&
              t.params[o] &&
              (t.rules.hasOwnProperty(e) ||
                (t.message && (t.messages[e] = t.message)),
              t.rules.hasOwnProperty(i) ||
                (t.message && (t.messages[i] = t.message)));
          });
      }),
      e.addBool("ischecked", "required"),
      t.validator.addMethod("daterange", function (t, e, i) {
        return this.optional(e) || (t >= i.min && t <= i.max);
      }),
      e.add("daterange", ["min", "max"], function (t) {
        var e = { min: t.params.min, max: t.params.max };
        (t.rules.daterange = e), (t.messages.daterange = t.message);
      }),
      e.fxbAddNumberVal("min"),
      e.fxbAddNumberVal("max"),
      e.fxbAddNumberVal("step"),
      e.fxbAddMinMax("range", "min", "max"),
      e.fxbAddMinMax("length", "minlength", "maxlength"),
      e.fxbAddMinMax("daterange", "min", "max");
  })(jQuery),
  (function (t) {
    function e(t, e) {
      return (
        -1 !== t.toLowerCase().indexOf(e.toLowerCase(), t.length - e.length)
      );
    }
    function i(t) {
      var i = t.name;
      if (!e(i, "value")) {
        var n = i.toLowerCase().indexOf("fields[");
        return i.substring(0, n + "fields[".length + 3) + "Value";
      }
      return i;
    }
    function n(e) {
      var i;
      if ("checkbox" === e.type || "radio" === e.type) {
        var n = t(e)
          .closest("form")
          .find("input[name='" + e.name + "']");
        n.length > 1
          ? ((i = []),
            (n = n.not(":not(:checked)")),
            t.each(n, function () {
              i.push(t(this).val());
            }))
          : (i = e.checked ? "1" : "0");
      } else i = t(e).val();
      return (
        i &&
          "[object Array]" === Object.prototype.toString.call(i) &&
          (i = i.join(",")),
        i
      );
    }
    (t.fxbFormTracker = function (e, i) {
      (this.el = e),
        (this.$el = t(e)),
        (this.options = t.extend({}, t.fxbFormTracker.defaultOptions, i)),
        this.init();
    }),
      (t.fxbFormTracker.parse = function (e) {
        t(e).track_fxbForms();
      }),
      t.extend(t.fxbFormTracker, {
        defaultOptions: {
          formId: null,
          sessionId: null,
          fieldId: null,
          fieldValue: null,
          duration: null,
        },
        prototype: {
          init: function () {
            (this.options.duration = 0),
              (this.options.formId = this.$el.attr("data-sc-fxb"));
          },
          startTracking: function () {
            var t, e, i;
            this.options.sessionId =
              ((i =
                (e = (t = this.$el)[0].id).slice(
                  0,
                  -(e.length - e.lastIndexOf("_") - 1)
                ) + "FormSessionId"),
              t.find("input[type='hidden'][id=\"" + i + '"]').val());
            var n = this,
              o = this.$el.find("input:not([type='submit']), select, textarea"),
              s = o.filter(
                "[data-sc-tracking='True'], [data-sc-tracking='true']"
              );
            s.length &&
              (o.not(s).bind("focus", function () {
                n.onFocusField(this);
              }),
              s
                .bind("focus", function () {
                  n.onFocusField(this, !0);
                })
                .bind("blur change", function () {
                  n.onBlurField(this);
                }));
          },
          onFocusField: function (e, o) {
            if (o) {
              var s = i(e);
              this.options.fieldId !== s &&
                ((this.options.fieldId = s),
                (this.options.duration = t.now()),
                (this.options.fieldValue = n(e)));
            } else this.options.fieldId = "";
          },
          onBlurField: function (o) {
            var s,
              r,
              a,
              l = i(o),
              c = t.now();
            if (!e(l, "value")) {
              var u =
                ((s = this.$el),
                (a =
                  (r = l).slice(0, -(r.length - r.lastIndexOf(".") - 1)) +
                  "Value"),
                s.find('input[name="' + a + '"]')[0]);
              if (!u) return;
              o = u;
            }
            var h = this.options.duration
                ? Math.round((c - this.options.duration) / 1e3)
                : 0,
              d = n(o),
              p = this.options.fieldId !== l;
            if (
              (p &&
                ((this.options.fieldId = l),
                (this.options.duration = t.now()),
                (h = 0)),
              p || this.options.fieldValue !== d)
            ) {
              this.options.fieldValue = d;
              var f = t(o).attr("data-sc-field-name"),
                m = this.buildEvent(
                  l,
                  f,
                  "2ca692cb-bdb2-4c9d-a3b5-917b3656c46a",
                  h
                ),
                g = this.$el.data("validator"),
                v = [];
              g &&
                !g.element(o) &&
                (v = this.checkClientValidation(o, f, g, h)),
                this.trackEvents(t.merge([m], v));
            }
          },
          buildEvent: function (e, i, n, o) {
            var s = e.slice(0, -5) + "ItemId";
            return (
              (e = t('input[name="' + s + '"]').val()),
              {
                formId: this.options.formId,
                sessionId: this.options.sessionId,
                eventId: n,
                fieldId: e,
                duration: o,
                fieldName: i,
              }
            );
          },
          checkClientValidation: function (e, i, n, o) {
            var s = this,
              r = [];
            return (
              t.each(n.errorMap, function (t) {
                if (t === e.name) {
                  var n = s.buildEvent(
                    t,
                    i,
                    "ea27aca5-432f-424a-b000-26ba5f8ae60a",
                    o
                  );
                  r.push(n);
                }
              }),
              r
            );
          },
          trackEvents: function (e) {
            t.ajax({
              type: "POST",
              url: "/fieldtracking/register",
              data: JSON.stringify(e),
              dataType: "json",
              contentType: "application/json",
            });
          },
        },
      }),
      (t.fn.track_fxbForms = function (e) {
        return this.each(function () {
          var i = t.data(this, "fxbForms.tracking");
          i
            ? i.startTracking()
            : ((i = new t.fxbFormTracker(this, e)),
              t.data(this, "fxbForms.tracking", i),
              i.startTracking());
        });
      }),
      t(document).ready(function () {
        t("form[data-sc-fxb]").track_fxbForms();
      });
  })(jQuery),
  $.validator.setDefaults({ ignore: ":hidden:not(.fxt-captcha)" });
var reCaptchaArray = [];
$.validator.unobtrusive.adapters.add("recaptcha", function (t) {
  (t.rules.recaptcha = !0), t.message && (t.messages.recaptcha = t.message);
}),
  $.validator.addMethod("recaptcha", function (t, e, i) {
    return !0;
  });
var dropdownElemnt,
  i,
  j,
  selElmnt,
  a,
  b,
  c,
  dropzone,
  recaptchasRendered = !1,
  loadReCaptchas = function () {
    if (!recaptchasRendered) {
      recaptchasRendered = !0;
      for (var t = 0; t < reCaptchaArray.length; t++) reCaptchaArray[t]();
    }
  };
function getDays(t) {
  var e = new Date();
  return Math.floor((e - new Date(t)) / 864e5);
}
function getYears(t) {
  var e = new Date(),
    i = e.getFullYear() - new Date(t).getFullYear(),
    n = e;
  return n.setFullYear(n.getFullYear() - i), new Date(t) > n && i--, i;
}
function getMonths(t) {
  var e = new Date(),
    i = new Date(t);
  return 12 * (e.getFullYear() - i.getFullYear()) + e.getMonth() - i.getMonth();
}
$.validator.unobtrusive.adapters.addSingleVal(
  "contenttype",
  "allowedcontenttypes"
),
  $.validator.addMethod("contenttype", function (t, e, i) {
    if (!this.optional(e))
      for (var n = 0; n < e.files.length; n++)
        if (i.indexOf(e.files[n].type) < 0) return !1;
    return !0;
  }),
  $.validator.unobtrusive.adapters.addSingleVal("filesize", "maxfilesize"),
  $.validator.addMethod("filesize", function (t, e, i) {
    if (!this.optional(e))
      for (var n = 0; n < e.files.length; n++)
        if (e.files[n].size > i) return !1;
    return !0;
  }),
  $.validator.unobtrusive.adapters.add(
    "timespan",
    ["min", "max", "unit"],
    function (t) {
      (t.rules.timespan = [t.params.min, t.params.max, t.params.unit]),
        (t.messages.timespan = t.message);
    }
  ),
  $.validator.addMethod("timespan", function (t, e, i) {
    if (!this.optional(e)) {
      var n = i[2],
        o = i[0],
        s = i[1],
        r = 0;
      switch (n) {
        case "days":
          r = getDays(t);
          break;
        case "months":
          r = getMonths(t);
          break;
        case "years":
          r = getYears(t);
      }
      var a = !0;
      return (
        void 0 !== o && r < o && (a = !1), void 0 !== s && r > s && (a = !1), a
      );
    }
    return !0;
  }),
  (function (t) {
    (t.fxbConditions = function (e, i) {
      (this.el = e),
        (this.$el = t(e)),
        (this.options = t.extend({}, t.fxbConditions.defaultOptions, i));
    }),
      t.extend(t.fxbConditions, {
        defaultOptions: { fieldConditions: [], animate: !0 },
        helpers: {
          normalize: function (t, e) {
            return null == t ? "" : e ? String(t) : String(t).toLowerCase();
          },
          toNumber: function (t) {
            return (t = Number(t)), isNaN(t) ? void 0 : t;
          },
          indexOf: function (t, e, i, n) {
            return (
              (t = this.normalize(t, n)),
              (e = this.normalize(e, n)),
              t.indexOf(e, i)
            );
          },
          endsWith: function (t, e, i) {
            (t = this.normalize(t, i)), (e = this.normalize(e, i));
            var n = t.length - e.length;
            return n >= 0 && t.substring(n) === e;
          },
        },
        actions: {
          show: function (t) {
            this.loaded && this.options.animate ? t.slideDown() : t.show(),
              this.setRequired(t);
          },
          hide: function (t) {
            this.loaded && this.options.animate
              ? t.is(":visible") && t.slideUp()
              : t.hide(),
              this.setRequired(t);
          },
          enable: function (t) {
            t.is("input,select,textarea,button") &&
              (t.prop("disabled", !1), this.setRequired(t));
          },
          disable: function (t) {
            t.is("input,select,textarea,button") &&
              (t.prop("disabled", !0), this.setRequired(t));
          },
          "go to page": function (e, i, n) {
            e.each(
              function (e, o) {
                if (
                  o.name &&
                  o.name.length &&
                  t(o).is("input[type='submit'], button[type='submit']")
                ) {
                  var s = this.$el.find(
                    '[name="' + o.name + '"][data-sc-next-page]'
                  );
                  if (!s.length) {
                    if (n && i.value) {
                      var r = this.$el.find('[name="' + o.name + '"]');
                      t("<input>")
                        .attr({
                          type: "hidden",
                          name: o.name,
                          value: i.value,
                          "data-sc-next-page": "",
                        })
                        .insertAfter(r.last());
                    }
                    return;
                  }
                  var a = i.value;
                  if (!n) {
                    a = s.data("sc-next-page");
                    for (var l = this.executedActions.length - 1; l >= 0; l--) {
                      var c = this.executedActions[l];
                      if (
                        c.fieldId === i.fieldId &&
                        c.conditionsResult &&
                        "go to page" === c.actionType.toLowerCase()
                      ) {
                        a = c.value;
                        break;
                      }
                    }
                  }
                  s.val(a), s.prop("disabled", !a);
                }
              }.bind(this)
            );
          },
          actionLinks: {
            show: "hide",
            enable: "disable",
            "go to page": "go to page",
          },
          addAction: function (t, e, i, n) {
            if (t && t.length) {
              if (((this[(t = t.toLowerCase())] = e), 2 === arguments.length))
                return;
              i && i.length
                ? ((i = i.toLowerCase()),
                  (this.actionLinks[t] = i),
                  arguments.length > 3 && (this[i] = n))
                : delete this.actionLinks[t];
            }
          },
          getAction: function (t, e) {
            if (t && t.length) {
              if (((t = t.toLowerCase()), e)) return this[t];
              if (this.actionLinks.hasOwnProperty(t))
                return this[this.actionLinks[t]];
              for (var i in this.actionLinks)
                if (
                  this.actionLinks.hasOwnProperty(i) &&
                  this.actionLinks[i] === t
                )
                  return this[i];
            }
            return this[t];
          },
        },
        operators: {
          contains: function (e, i) {
            return t.fxbConditions.helpers.indexOf(i, e) >= 0;
          },
          "does not contain": function (e, i) {
            return -1 === t.fxbConditions.helpers.indexOf(i, e);
          },
          "starts with": function (e, i) {
            return 0 === t.fxbConditions.helpers.indexOf(i, e);
          },
          "does not start with": function (e, i) {
            return 0 !== t.fxbConditions.helpers.indexOf(i, e);
          },
          "ends with": function (e, i) {
            return t.fxbConditions.helpers.endsWith(i, e);
          },
          "does not end with": function (e, i) {
            return !t.fxbConditions.helpers.endsWith(i, e);
          },
          "is equal to": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)) === e)
            )
              return !0;
            if (e.length) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" == typeof o && n === o;
              }
            }
            return !1;
          },
          "is not equal to": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)) === e)
            )
              return !1;
            if (e.length) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" != typeof o || n !== o;
              }
            }
            return !0;
          },
          "is greater than": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)),
              e.length)
            ) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" == typeof o && o > n;
              }
            }
            return i > e;
          },
          "is greater than or equal to": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)) === e)
            )
              return !0;
            if (e.length) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" == typeof o && o >= n;
              }
            }
            return i >= e;
          },
          "is less than": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)),
              e.length)
            ) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" == typeof o && o < n;
              }
            }
            return i < e;
          },
          "is less than or equal to": function (e, i) {
            if (
              ((e = t.fxbConditions.helpers.normalize(e)),
              (i = t.fxbConditions.helpers.normalize(i)) === e)
            )
              return !0;
            if (e.length) {
              var n = t.fxbConditions.helpers.toNumber(e);
              if ("number" == typeof n) {
                var o = t.fxbConditions.helpers.toNumber(i);
                return "number" == typeof o && o <= n;
              }
            }
            return i <= e;
          },
          addOperator: function (t, e) {
            t && t.length && (this[t.toLowerCase()] = e);
          },
          getOperator: function (t) {
            return t && t.length ? this[t.toLowerCase()] : null;
          },
        },
        prototype: {
          initConditions: function (e) {
            if (
              ((this.options = t.extend(!0, this.options || {}, e)),
              this.options.fieldConditions)
            ) {
              var i = [];
              this.options.fieldConditions.forEach(
                function (e) {
                  e &&
                    e.conditions &&
                    e.conditions.forEach(
                      function (e) {
                        if (e.fieldId && -1 === i.indexOf(e.fieldId)) {
                          i.push(e.fieldId);
                          var n = this.$el
                            .find('[data-sc-field-key="' + e.fieldId + '"]')
                            .filter(function () {
                              return t.fxbConditions.helpers.endsWith(
                                this.name,
                                "value"
                              );
                            });
                          n.length &&
                            n.on("change", this.applyConditions.bind(this));
                        }
                      }.bind(this)
                    );
                }.bind(this)
              ),
                this.applyConditions(),
                (this.loaded = !0);
            }
          },
          applyConditions: function () {
            this.options.fieldConditions &&
              ((this.executedActions = []),
              this.options.fieldConditions.forEach(
                function (t) {
                  if (t && t.actions && t.actions.length) {
                    var e = this.evaluateConditions(t);
                    t.actions.forEach(
                      function (t) {
                        this.executeAction(t, e);
                      }.bind(this)
                    );
                  }
                }.bind(this)
              ));
          },
          setRequired: function (e) {
            e.each(
              function (e, i) {
                var n = t(i);
                if (n.is("input:not([type='submit']), select, textarea")) {
                  var o = i.name;
                  if (!t.fxbConditions.helpers.endsWith(o, "value")) return;
                  o =
                    o.slice(0, -(o.length - o.lastIndexOf(".") - 1)) +
                    "Required";
                  var s = this.$el.find(
                      '[name="' + o + '"][data-sc-conditions-required]'
                    ),
                    r =
                      n.is(":hidden") ||
                      "hidden" === n.css("visibility") ||
                      i.disabled;
                  if (!s.length) {
                    if (r) {
                      var a = this.$el.find('[name="' + i.name + '"]');
                      t("<input>")
                        .attr({
                          type: "hidden",
                          name: o,
                          value: !1,
                          "data-sc-conditions-required": "",
                        })
                        .insertAfter(a.last());
                    }
                    return;
                  }
                  s.val(!1), s.prop("disabled", !r);
                } else
                  this.setRequired(
                    n.find("input:not([type='submit']), select, textarea")
                  );
              }.bind(this)
            );
          },
          executeAction: function (e, i) {
            if (e && e.fieldId && e.actionType) {
              var n = this.$el.find('[data-sc-field-key="' + e.fieldId + '"]');
              if (n.length) {
                var o = t.fxbConditions.actions.getAction(e.actionType, i);
                if (o && "function" == typeof o) {
                  o.call(this, n, e, i);
                  var s = t.extend(!0, e, { conditionsResult: i });
                  this.executedActions.push(s);
                }
              }
            }
          },
          evaluateConditions: function (t) {
            if (!t || !t.conditions) return !0;
            switch ((t.matchType || "").toLowerCase()) {
              case "all":
                return t.conditions.every(this.isConditionSatisfied.bind(this));
              case "any":
              default:
                return t.conditions.some(this.isConditionSatisfied.bind(this));
            }
          },
          getValueList: function (e) {
            var i,
              n = this.$el
                .find('[data-sc-field-key="' + e + '"]')
                .filter(function () {
                  return t.fxbConditions.helpers.endsWith(this.name, "value");
                }),
              o = n.filter(function (t, e) {
                return "checkbox" === e.type || "radio" === e.type;
              });
            return (
              o.length
                ? o.length > 1
                  ? (i = o
                      .filter(":checked")
                      .map(function () {
                        return t(this).val();
                      })
                      .get()).length || i.push("")
                  : (i = [o[0].checked ? "true" : "false"])
                : (i = [n.val()]),
              i
            );
          },
          isConditionSatisfied: function (e) {
            if (e && e.operator) {
              var i = t.fxbConditions.operators.getOperator(e.operator);
              if (i && "function" == typeof i) {
                var n = this.getValueList(e.fieldId);
                return "is not equal to" === e.operator
                  ? n.every(i.bind(this, e.value))
                  : n.some(i.bind(this, e.value));
              }
            }
            return !1;
          },
        },
      }),
      (t.fn.init_fxbConditions = function (e) {
        return this.each(function () {
          var i = t.data(this, "fxbForms.conditions");
          i
            ? i.initConditions(e)
            : ((i = new t.fxbConditions(this, e)),
              t.data(this, "fxbForms.conditions", i),
              i.initConditions());
        });
      });
  })(jQuery),
  $(document).ready(function () {
    ($.fn.initCustomDropdown = function () {
      for (i = 0; i < this.length; i++) {
        (selElmnt = this[i].getElementsByTagName("select")[0]),
          (a = document.createElement("div")).setAttribute(
            "class",
            "custom-dropdown"
          );
        var t = selElmnt.options[selElmnt.selectedIndex];
        for (
          a.innerHTML = t.innerHTML,
            t && a.classList.add("custom-dropdown-hasvalue"),
            selElmnt.parentNode.insertBefore(a, selElmnt),
            (b = document.createElement("div")).setAttribute(
              "class",
              "custom-dropdown-items custom-dropdown-items--hidden"
            ),
            j = 1;
          j < selElmnt.length;
          j++
        )
          ((c = document.createElement("div")).innerHTML =
            selElmnt.options[j].innerHTML),
            selElmnt.options[j].disabled &&
              c.setAttribute("class", "custom-dropdown-disabled-item"),
            c.addEventListener("click", function (t) {
              var e, i, n, o, s, r;
              for (
                o =
                  this.parentNode.parentNode.getElementsByTagName("select")[0],
                  s = this.parentNode.previousSibling,
                  r = !1,
                  i = 0;
                i < o.length;
                i++
              )
                if (o.options[i].innerHTML == this.innerHTML) {
                  for (
                    r = !0,
                      o.selectedIndex = i,
                      s.innerHTML = this.innerHTML,
                      e = this.parentNode.getElementsByClassName(
                        "custom-dropdown-selected-item"
                      ),
                      n = 0;
                    n < e.length;
                    n++
                  )
                    e[n].removeAttribute("class");
                  this.setAttribute("class", "custom-dropdown-selected-item");
                  break;
                }
              if (
                (r
                  ? (s.classList.add("custom-dropdown-hasvalue"),
                    this.parentNode.parentNode.classList.add(
                      "ex-sitecore-form__input--custom-dropdown--value"
                    ))
                  : (s.classList.remove("custom-dropdown-hasvalue"),
                    this.parentNode.parentNode.classList.remove(
                      "ex-sitecore-form__input--custom-dropdown--value"
                    )),
                s.click(),
                "createEvent" in document)
              ) {
                var a = document.createEvent("HTMLEvents");
                a.initEvent("change", !1, !0), o.dispatchEvent(a);
              } else o.fireEvent("onchange");
            }),
            b.appendChild(c);
        selElmnt.parentNode.insertBefore(b, selElmnt),
          a.addEventListener("click", function (t) {
            t.stopPropagation(),
              e(this),
              this.nextSibling.classList.toggle(
                "custom-dropdown-items--hidden"
              ),
              this.classList.toggle("select-arrow-active");
          });
      }
      function e(t) {
        var e,
          i,
          n,
          o = [];
        for (
          e = document.getElementsByClassName("custom-dropdown-items"),
            i = document.getElementsByClassName("custom-dropdown"),
            n = 0;
          n < i.length;
          n++
        )
          t == i[n] ? o.push(n) : i[n].classList.remove("select-arrow-active");
        for (n = 0; n < e.length; n++)
          o.indexOf(n) && e[n].classList.add("custom-dropdown-items--hidden");
      }
      return document.addEventListener("click", e), this;
    }),
      $(".ex-sitecore-form__input--custom-dropdown").initCustomDropdown();
  }),
  (function (t) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (t) {
    "use strict";
    var e,
      i = {
        errorElement: "span",
        errorClass: "input-error",
        inputWrapper: ".input-box",
        validClass: "input-success",
        errorBlock: ".error-block",
        validCssClass: "is-valid",
        invalidCssClass: "is-invalid",
        captchaWrapper: ".captcha-wrapper",
        captchaTheme: "light",
        onValidateError: jQuery.noop(),
        onCaptchaValidate: jQuery.noop(),
        onInit: jQuery.noop(),
        beforeSend: jQuery.noop(),
        afterSend: jQuery.noop(),
        sending: jQuery.noop(),
        onSendSuccess: jQuery.noop(),
        onSendError: jQuery.noop(),
        dialogDismissed: jQuery.noop(),
      };
    function n(n, o) {
      (e = this),
        (this.$window = t(window)),
        (this.$document = t(document)),
        (this.$form = t(n)),
        (this.options = t.extend({}, i, o)),
        (this.onInit = this.options.onInit || jQuery.noop()),
        (this.sending = this.options.sending || jQuery.noop()),
        (this.beforeSend = this.options.beforeSend || jQuery.noop()),
        (this.afterSend = this.options.afterSend || jQuery.noop()),
        (this.onSendSuccess = this.options.onSendSuccess || jQuery.noop()),
        (this.onSendError = this.options.onSendError || jQuery.noop()),
        (this.onCaptchaValidate =
          this.options.onCaptchaValidate || jQuery.noop()),
        (this.dialogDismissed = this.options.dialogDismissed || jQuery.noop()),
        this.init();
    }
    return (
      (n.prototype.showError = function (e) {
        return t(e)
          .parents(this.options.inputWrapper)
          .replaceClass(
            this.options.validCssClass,
            this.options.invalidCssClass
          );
      }),
      (n.prototype.showSuccess = function (e) {
        return t(e)
          .parents(this.options.inputWrapper)
          .replaceClass(
            this.options.invalidCssClass,
            this.options.validCssClass
          );
      }),
      (n.prototype.replaceClass = function (e, i) {
        return t(element).removeClass(e).addClass(i);
      }),
      (n.prototype.init = function () {
        this.placeCaptcha(),
          null != jQuery.fn.validate
            ? this.initValidate()
            : this.$form.on("submit", function (t) {
                t.preventDefault(), e.submit();
              }),
          null != jQuery.fn.validate && this.resetForm(),
          this.onInit && "function" == typeof this.onInit && this.onInit();
      }),
      (n.prototype.placeCaptcha = function () {
        document.addEventListener("grecaptcha-loaded", function () {
          if (e.$form.find(e.options.captchaWrapper).length) {
            e.captchaWrapper = e.$form.find(e.options.captchaWrapper);
            var i = e.captchaWrapper.data("name"),
              n = e.captchaWrapper.data("sitekey"),
              o = e.captchaWrapper.data("size"),
              s = t.guid++;
            (e.captchaMsg = e.captchaWrapper.data("msgRequired")),
              (e.captchaID = "captcha-div-" + s),
              (e.captchaInputID = "captcha-input-" + s),
              t("<div/>", { id: e.captchaID }).appendTo(e.captchaWrapper),
              (e.captchaInput = t("<input />", {
                name: i,
                type: "hidden",
                id: e.captchaInputID,
              })),
              e.captchaInput.appendTo(e.captchaWrapper),
              t("<div/>", {
                class: e.options.errorBlock.replace(".", "") + " my-2",
              }).appendTo(e.captchaWrapper),
              (e.captchaWidget = grecaptcha.render(e.captchaID, {
                sitekey: n,
                callback: e.captchaCallback,
                theme: e.options.captchaTheme,
                size: o,
              })),
              t.dispatchEvent("captcha-widget-loaded");
          }
        });
      }),
      (n.prototype.getCaptcha = function () {
        return this.captchaWidget;
      }),
      (n.prototype.hasCaptcha = function () {
        return e.$form.find(e.options.captchaWrapper).length > 0;
      }),
      (n.prototype.resetCaptcha = function () {
        e.hasCaptcha() &&
          (grecaptcha.reset(e.getCaptcha()), e.captchaInput.val(""));
      }),
      (n.prototype.getCaptchaID = function () {
        return this.captchaID;
      }),
      (n.prototype.captchaCallback = function (t) {
        return (
          e.captchaInput.val(t),
          e.onCaptchaValidate(t) ? e.send() : jQuery.noop()
        );
      }),
      (n.prototype.initValidate = function () {
        this.$form.validate({
          lang: t.checkSiteRTLDirection() ? "ar" : "en",
          errorElement: this.options.errorElement,
          errorClass: this.options.errorClass,
          validClass: this.options.validClass,
          ignore: ".validation-ignore",
          errorPlacement: function (t, i) {
            t.appendTo(
              i.parents(e.options.inputWrapper).find(e.options.errorBlock)
            ),
              e.showError(i);
          },
          onfocusout: function (i) {
            t(i).valid() ? e.showSuccess(i) : e.showError(i);
          },
          onkeyup: function (i) {
            t(i).valid() ? e.showSuccess(i) : e.showError(i);
          },
          success: function (t) {
            e.showSuccess(t);
          },
          submitHandler: function () {
            e.submit();
          },
        });
      }),
      (n.prototype.resetForm = function () {
        e.$form.on("reset", function () {
          e.$form.find("[data-toggler]").prop("checked", !1).change(),
            e.$form
              .find(".is-valid , .is-invalid")
              .removeClass("is-valid")
              .removeClass("is-invalid"),
            e.$form.data("validator").resetForm();
        });
      }),
      (n.prototype.getFormData = function () {
        var e = new FormData(),
          i = this.$form.find("[name]");
        for (var n in (((i = i.toArray().reduce(function (t, e) {
          return (t[e.name] = (t[e.name] || []).concat(e)), t;
        }, {})).pageurl = [{ value: location.href }]),
        i)) {
          var o = i[n],
            s = "";
          if (o[0] && "checkbox" != o[0].type && "radio" != o[0].type)
            o.length > 0 && (s = o[0].value);
          else {
            var r = o.filter(function (e) {
              return t(e).is(":checked");
            });
            r.length &&
              (1 == o.length
                ? (s = t(o[0]).is(":checked"))
                : o.length > 1 &&
                  (s =
                    "radio" == o[0].type
                      ? r.find(function (e) {
                          return t(e).is(":checked");
                        }).value
                      : r.map(function (t) {
                          return t.value;
                        })));
          }
          !e.get(n) && (null != s) & ("" != s) && e.append(n, s);
        }
        return e;
      }),
      (n.prototype.submit = function () {
        var i = e.captchaInput.val();
        e.hasCaptcha() && !i
          ? (document.addEventListener("captcha-widget-loaded", function () {
              grecaptcha.execute(e.getCaptcha());
            }),
            t.dispatchEvent("load-recaptcha"))
          : e.send();
      }),
      (n.prototype.send = function () {
        e.beforeSend && "function" == typeof e.beforeSend && e.beforeSend();
        try {
          var i = e.$form.attr("action");
          t.ajax({
            processData: !1,
            contentType: !1,
            type: "POST",
            url: i,
            data: e.getFormData(),
            success: function (t) {
              t
                ? e.onSendSuccess(t)
                : e.onSendError(new Error("Failed to get response")),
                e.afterSend &&
                  "function" == typeof e.afterSend &&
                  e.afterSend(),
                e.resetCaptcha();
            },
            error: function (t) {
              e.afterSend && "function" == typeof e.afterSend && e.afterSend(),
                e.onSendError(t),
                e.resetCaptcha();
            },
          }),
            e.sending && "function" == typeof e.sending && e.sending();
        } catch (t) {
          e.onSendError &&
            "function" == typeof e.onSendError &&
            (e.onSendError(t), e.resetCaptcha());
        }
      }),
      (t.fn.FormPlugin = function (e) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
          var o = t(this),
            s = o.data("FormPlugin");
          if (!s) {
            var r = new n(this, e);
            o.data("FormPlugin", (s = r));
          }
          "string" == typeof e && s[e].apply(s, i);
        });
      }),
      "Error Initializing happiness requester"
    );
  }),
  $(document).ready(function () {
    $.checkSiteRTLDirection = function () {};
    let t = $(".ex-download-form").find("form"),
      e = t.find('[type="submit"]'),
      i = null;
    function n() {
      t.valid() && i ? e.prop("disabled", !1) : e.prop("disabled", "disabled");
    }
    function o() {
      e.addClass("button--loader");
    }
    t.FormPlugin({
      errorBlock: ".field-validation-error",
      errorClass: "input-validation-error",
      inputWrapper: ".ex-sitecore-form__input",
      captchaWrapper: ".captcha-wrapper",
      onInit: function () {
        $(".ex-sitecore-form__input").on("blur keyup", function () {
          n();
        });
      },
      beforeSend: function () {},
      onCaptchaValidate: function (t) {
        return (i = t), n(), !1;
      },
      onSendSuccess: function (i) {
        $("#submit").click(function (t) {
          var e = $("#submit").attr("data-ds"),
            i = $("#submit").attr("data-currentPage"),
            n = $("#name").val(),
            o = $("#email").val();
          $("#name").val(), $("#email").val();
          $.ajax({
            type: "GET",
            url: "/api/DownloadForm/DownloadFormData",
            data: { userName: n, userEmail: o, ds: e, currentPage: i },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (t) {
              console.log("OnClickSuccess"),
                console.log(t),
                1 == t
                  ? ($("#downloadButtonSection").show(),
                    $("#downloadForm").hide())
                  : ($("#downloadButtonSection").hide(),
                    $("#downloadForm").show());
            },
            error: function () {
              alert("error");
            },
          });
        }),
          i && i.status ? (e.addClass("button--loader"), $(t).remove()) : o();
      },
      onSendError: function (t) {
        console.log(t), o();
      },
    }).data("FormPlugin");
  }),
  $(document).ready(function () {
    $(".ex-sitecore-form__input--datepicker")
      .find("input[type='text']")
      .attr("autocomplete", "off")
      .datepicker();
  }),
  $(document).ready(function () {
    var t = $.checkSiteRTLDirection(),
      e = ".ex-sitecore-form__input--file";
    function i(t) {
      if (
        (function (t) {
          if (t) {
            var i = 0;
            return (
              $(e)
                .find("input[type='file']")
                .each(function () {
                  var e = this.files;
                  if (e)
                    for (var n = 0; n < e.length; n++)
                      t.name == e[n].name && i++;
                }),
              1 == i
            );
          }
          return !1;
        })(t)
      ) {
        $(t.previewTemplate).find(".dz-image img").attr("src", ""),
          $(t.previewTemplate)
            .find("[data-dz-name]")
            .html(t.name.substring(0, 20) + "...");
        var i = t.name.toLowerCase().split(".").pop();
        $(t.previewTemplate).find(".dz-ext-overlay").remove();
        var n = $("<div/>", { class: "dz-ext-overlay dz-ext-overlay--" + i });
        if (
          (n.append(
            "<i class='" +
              (function (t) {
                let e = {
                  doc: "icon-office-file-doc",
                  docx: "icon-office-file-doc",
                  rtf: "icon-office-file-doc",
                  pdf: "icon-office-file-pdf",
                  xlsx: "icon-office-file-xls",
                  xlx: "icon-office-file-xls",
                  zip: "icon-file-zip",
                  rar: "icon-file-rar",
                  ppsx: "icon-office-file-ppt",
                  pptx: "icon-office-file-ppt",
                  txt: "icon-office-file-txt",
                  png: "icon-picture-sun",
                  jpg: "icon-picture-sun",
                  jpeg: "icon-picture-sun",
                  any: "icon-file-empty",
                };
                return e[t] || e.any;
              })(i) +
              "'></i>"
          ),
          "png" == i || "jpg" == i || "jpeg" == i || "gif" == i)
        ) {
          var o = new FileReader();
          (o.onload = function (e) {
            $(t.previewTemplate)
              .find(".dz-image img")
              .attr("src", e.target.result);
          }),
            o.readAsDataURL(t);
        }
        return (
          $(t.previewTemplate).append(n),
          $(t.previewTemplate).find(".dz-ext").html(i.toUpperCase()),
          $(t.previewTemplate)
            .find("[data-dz-size]")
            .html(
              "<strong>" +
                parseFloat(t.size / 1048576).toFixed(2) +
                " </strong>"
            ),
          $(t.previewTemplate)
            .find(".dz-remove")
            .on("click", function () {
              let t = $(this).closest(".dz-preview");
              t.siblings("input[type='file']").val("").change(), t.remove();
            }),
          !0
        );
      }
      return !1;
    }
    $(e).each(function (e, n) {
      var o = $(n).find(".input-file-trigger");
      $(n).closest("form");
      $(o).each(function (e, o) {
        var s = $(n).find(".preview-template").find(".dz-preview").clone(),
          r = $(o).find("input[type='file']").first();
        $(o).find(".input-file-trigger__label").attr("for", $(r).attr("id")),
          $(r).on("change", function (e) {
            $(this).siblings(".dz-preview").remove();
            let n = this.files;
            if (n && n.length)
              for (let e = 0; e < n.length; e++) {
                if (((n[e].previewTemplate = s), i(n[e])))
                  $(o).append(n[e].previewTemplate);
                else {
                  $(r).val("");
                  var a = $(this)
                    .siblings(
                      ".field-validation-valid , .field-validation-error"
                    )
                    .replaceClass(
                      "field-validation-valid",
                      "field-validation-error"
                    );
                  $("<span></span>")
                    .text(
                      t ? "اسم الملف موجود مسبقا" : "The file name is exists"
                    )
                    .appendTo(a);
                }
              }
            else $(this).siblings(".field-validation-error").empty();
          });
      });
    });
  }),
  $(document).ready(function () {
    $.fn.clearValidation = function () {
      var t = $(this).validate();
      $("[name]", this).each(function () {
        t.successList.push(this), t.showErrors();
      }),
        t.resetForm(),
        $(this).trigger("reset");
    };
    var t = function (t) {
      if ($(t).length) {
        var e =
            $(t)
              .parent()
              .find("#maximum")
              .text()
              .replace(/[^\w\s]/gi, "")
              .trim() || 200,
          i = $(t).val().length,
          n = $(t).parent().find("#current");
        $(n).text(i),
          i >= e ? $(n).addClass("exceeded") : $(n).removeClass("exceeded");
      }
    };
    $(".ex-sitecore-form textarea").keyup(function () {
      t($(this));
    }),
      t($(".ex-sitecore-form textarea"));
    let e = $("[data-toggler]");
    if (e.length) {
      var i = function (t) {
        let e = $(t).data("toggler"),
          i = $(t).is(":checked");
        $(t).data().hasOwnProperty("value") &&
          (i = "show" == $(t).data("value")),
          i
            ? $(e).removeClass(
                "visually-hidden ex-sitecore-form__input--hidden"
              )
            : $(e).addClass("visually-hidden ex-sitecore-form__input--hidden");
      };
      e.each(function (t, e) {
        $(e).on("change", function () {
          i(e);
        }),
          $(e).is(":checked") && i(e);
      });
    }
    $(".ex-sitecore-form__input--tel input").on("keyup", function () {
      var t =
        ($(this)
          .closest(".ex-sitecore-form__input--tel")
          .find("select")
          .val() || "") + " ";
      t.trim() && this.value.substring(0, t.length) != t && $(this).val(t);
    }),
      $(".ex-sitecore-form__input--tel select").on("change", function () {
        $(this)
          .closest(".ex-sitecore-form__input--tel")
          .find("input")
          .val(this.value + " ");
      }),
      $(".sitecore-form , .sitecore-form form")
        .find("[type='submit']")
        .each(function () {
          $(this).removeClass("button--disabled");
        }),
      $(".sitecore-form , .sitecore-form form").on("submit", function (t) {
        let e = $(this).data("validator");
        (e && e.errorList && e.errorList.length) ||
          $(this).find("input[type='submit']").addClass("button--disabled");
      }),
      $(
        ".ex-sitecore-form__input__checkbox--sitecore input[type='checkbox']"
      ).each(function (t, e) {
        if (e.id) {
          let t = $(e).parent().parent();
          $("<label for='" + e.id + "'></label>").insertAfter(e),
            t.find("> label").attr("for", e.id),
            t.find("> .field-validation-valid").appendTo(t);
        }
      }),
      $(".ex-sitecore-form__input--radiositecore").each(function () {
        var t = $(".ex-sitecore-form__input__radiobox label");
        t.on("click", function () {
          var t = $(this).closest(".ex-sitecore-form__input--radiositecore"),
            e = $(this).data("value");
          $(t)
            .find("input[type='radio']")
            .each(function () {
              $(this).val().toString().trim().toLocaleLowerCase() ==
                e.toString().toLocaleLowerCase() && $(this).click();
            });
        }),
          t.first().click();
      }),
      $(".sitecore-sxa-form__clear").on("click", function (t) {
        t.preventDefault(), t.stopPropagation();
        var e = $(this).closest("form");
        e.find(".input-file-trigger .dz-preview").remove(),
          e.clearValidation(),
          "undefined" != typeof grecaptcha &&
            (grecaptcha.reset(), $(e).find(".fxt-captcha").val(""));
      }),
      $(".sitecore-form , .sitecore-form form").each(function (t, e) {
        if ($(this).data("validator")) {
          let t = $(this).data("validator").settings;
          function i(t) {
            let e = $(t).data("validation-toggle"),
              i = $(e).find(".input-field");
            "show" == $(t).data("value")
              ? i.removeClass("validation-ignore")
              : (i
                  .addClass("validation-ignore")
                  .removeClass("input-validation-error"),
                i.siblings(".field-validation-error").empty()),
              i.val("");
          }
          t && (t.ignore = t.ignore + " , .validation-ignore"),
            $(this)
              .find("[data-validation-toggle]")
              .on("change", function () {
                i(this);
              }),
            $(this)
              .find("[data-validation-toggle]:checked")
              .each(function (t, e) {
                i(e);
              });
        }
      }),
      $(".validation-summary-errors").text().trim() ||
        $(".validation-summary-errors").remove();
  }),
  $(document).ready(function () {
    var t = "ar-AE" == $("html").attr("lang");
    $(".event-checkStartDate").each(function () {
      if (t) {
        var e = $(".event-checkStartDate").text(),
          i = $(".event-checkEndDate").text();
        if (e && i) {
          var n = e.split("/"),
            o = n[0],
            s = n[1],
            r = n[2].split(" "),
            a = r[0],
            l = r[1],
            c = r[2],
            u = "";
          "م" == c ? (u = "PM") : "ص" == c && (u = "AM");
          var h = new Date(s + "/" + o + "/" + a + " " + l + " " + u),
            d = new Date(h.getFullYear(), h.getMonth(), h.getDate()),
            p = i.split("/"),
            f = (p[0], p[1], p[2].split(" ")),
            m = (f[0], f[1], f[2]);
          "م" == m ? "PM" : "ص" == m && "AM";
          (h = new Date($(".event-checkStartDate").text())),
            (d = new Date(h.getFullYear(), h.getMonth(), h.getDate()));
          var g = new Date($(".event-checkEndDate").text()),
            v = new Date(g.getFullYear(), g.getMonth(), g.getDate()),
            y = new Date();
          d > (_ = new Date(y.getFullYear(), y.getMonth(), y.getDate()))
            ? $(".eventDateStatus").text("القادم")
            : d < _ && v >= _
            ? $(".eventDateStatus").text("جارى")
            : d.getTime() == _.getTime() && v > _
            ? $(".eventDateStatus").text("جارى")
            : d.getTime() == _.getTime() && v.getTime() == _.getTime()
            ? $(".eventDateStatus").text("اليوم")
            : $(".eventDateStatus").text("السابق");
        }
      } else {
        var _;
        (h = new Date($(".event-checkStartDate").text())),
          (d = new Date(h.getFullYear(), h.getMonth(), h.getDate())),
          (g = new Date($(".event-checkEndDate").text())),
          (v = new Date(g.getFullYear(), g.getMonth(), g.getDate())),
          (y = new Date());
        d > (_ = new Date(y.getFullYear(), y.getMonth(), y.getDate()))
          ? $(".eventDateStatus").text("UPCOMING")
          : d < _ && v >= _
          ? $(".eventDateStatus").text("ONGOING")
          : d.getTime() == _.getTime() && v > _
          ? $(".eventDateStatus").text("ONGOING")
          : d.getTime() == _.getTime() && v.getTime() == _.getTime()
          ? $(".eventDateStatus").text("TODAY")
          : $(".eventDateStatus").text("PAST");
      }
    });
  }),
  $(document).ready(function () {
    $(".ex-sxa-components table").length &&
      $(".ex-sxa-components table").wrap(
        "<div class='table-responsive'></div>"
      ),
      $.fn.fancybox &&
        $(
          ".ex-sxa-components img.fancy-image , .ex-sxa-components .fancy-image img"
        ).each(function (t, e) {
          let i = $(e).clone();
          i.hide().insertAfter($(e)),
            $(i).fancybox({
              touch: !1,
              afterLoad: function () {
                $(".fancybox-content").css({
                  background: "transparent",
                  padding: "0px",
                });
              },
              afterShow: function () {
                $(".fancybox-close-small").css({
                  margin: "0 11px",
                  color: "#ccc",
                  position: "fixed",
                });
              },
              onInit: function () {},
              afterClose: function () {},
            }),
            $(e).on("click", function () {
              $(i).click();
            });
        });
  }),
  $(".facet-date-range").on("click", function () {
    $(document).ajaxComplete(function () {
      $(".ex-sxa-filter").length >= 1 &&
        ($(".ex-sxa-filter").addClass("ex-sxa-filter-active"),
        $(".ex-sxa-filter__input .bottom-remove-filter button").on(
          "click",
          function () {
            setTimeout(function () {
              $(".ex-sxa-filter").removeClass("ex-sxa-filter-active");
            }, 600);
          }
        ));
    });
  }),
  "undefined" != typeof XA &&
    ((XA.component.search.results.count = (function (t, e) {
      var i = {},
        n = !1,
        o = Backbone.View.extend({
          initialize: function () {
            this.$el.data();
            var t = this.$el.find(".results-count"),
              e = this;
            if (
              ((this.resultsCountText = t.html()),
              window.location.href.startsWith("file://"))
            )
              return (
                t.html(
                  e.resultsCountText.replace(
                    "{count}",
                    "<span class='font-weight-bold'>1</span>"
                  )
                ),
                void e.$el.find(".results-count").show()
              );
            XA.component.search.vent.on("results-loaded", function (i) {
              var n = i.dataCount,
                o = 0;
              o =
                null == i.offset || 0 == i.offset
                  ? i.data.length
                  : i.data.length + i.offset;
              var s = e.resultsCountText.replace(
                "{size}",
                "<span class='font-weight-bold'>" + o + "</span>"
              );
              (s = s.replace(
                "{count}",
                "<span class='font-weight-bold'>" + n + "</span>"
              )),
                t.html(s),
                i.dataCount > 0
                  ? e.$el.find(".results-count").show()
                  : e.$el.find(".results-count").hide();
            });
          },
        });
      return (
        (i.init = function () {
          if (!t("body").hasClass("on-page-editor") && !n) {
            var e = t(".search-results-count");
            _.each(e, function (e) {
              new o({ el: t(e) });
            }),
              (n = !0);
          }
        }),
        i
      );
    })(jQuery, document)),
    XA.register("searchResultsCount", XA.component.search.results.count)),
  $(document).ready(function () {
    $(".search-box-button , .search-box-button-with-redirect")
      .addClass("icon-search")
      .removeClass("icon icon-searchv2")
      .text(""),
      $("body").click(function (t) {
        $(t.target).closest(".search-box-input.tt-input").length ||
          $(".tt-menu.tt-open").css("display", "none");
      }),
      $(".search-box-input.tt-input").click(function (t) {
        0 != $(".tt-menu").find(".tt-dataset.tt-dataset-1").children().length &&
          $(".tt-menu.tt-open").css("display", "block");
      });
  }),
  $(document).ready(function () {
    var t = $("html").attr("lang").toLowerCase(),
      e = "ar-ae" == t ? "ar" : "he-il" == t ? "ar" : "en";
    let i = {
      en: {
        emotions: { title: "How was your experience?" },
        success: {
          title: "Thank you!",
          description:
            "We really appreciate your feedback and we'll use it to improve your experience",
        },
        error: {
          title: "Sorry, something went wrong!",
          description:
            "We could not record your responses at this time. Please try again later.",
        },
        rate: {
          title: "Rate your experience",
          buttons: { submit: "Submit", back: "Back", cancel: "Cancel" },
          rates: {
            ease: "Ease of use",
            quality: "Quality of information",
            performance: "Overall website performance",
          },
          comment: {
            label: "Add comment (optional)",
            placeholder: "We'd love to hear from you",
          },
        },
        feedback: "Feedback",
        chatbot: "Virtual Assistant",
      },
      "ar-ae": {
        emotions: { title: "كيف كانت تجربتك" },
        success: {
          title: "شكرا جزيلا!",
          description: "نحن نقدر حقًا تعليقاتك وسنستخدمها لتحسين تجربتك",
        },
        error: {
          title: "عذرا، هناك خطأ ما!",
          description:
            "لم نتمكن من تسجيل ردودك في هذا الوقت. الرجاء معاودة المحاولة في وقت لاحق.",
        },
        rate: {
          title: "قيم تجربتك",
          buttons: { submit: "إرسال", back: "عودة", cancel: "إلغاء" },
          rates: {
            ease: "سهولة الاستعمال",
            quality: "جودة المعلومات",
            performance: "الأداء العام للموقع",
          },
          comment: {
            label: "أضف تعليق (اختياري)",
            placeholder: "نحب أن نسمع منك",
          },
        },
        feedback: "ردود الفعل",
        chatbot: "مساعد افتراضي",
      },
      "he-il": {
        emotions: { title: "איך הייתה החוויה שלך?" },
        success: {
          title: "תודה!",
          description:
            "אנו מאוד מעריכים את המשוב שלך ונשתמש בו כדי לשפר את החוויה שלך",
        },
        error: {
          title: "מצטערים, משהו השתבש!",
          description:
            "לא הצלחנו להקליט את תשובותיך בשלב זה. בבקשה נסה שוב מאוחר יותר.",
        },
        rate: {
          title: "דרג את החוויה שלך",
          buttons: { submit: "שלח", back: "חזור", cancel: "לְבַטֵל" },
          rates: {
            ease: "קלות שימוש",
            quality: "איכות המידע",
            performance: "ביצועי אתרים כלליים",
          },
          comment: {
            label: "הוסף תגובה (אופציונלי)",
            placeholder: "נשמח לשמוע ממך",
          },
        },
        feedback: "מָשׁוֹב",
        chatbot: "עוזר וירטואלי",
      },
      "de-de": {
        emotions: { title: "Hoe was je ervaring?" },
        success: {
          title: "Dank je!",
          description:
            "We stellen uw feedback zeer op prijs en zullen deze gebruiken om uw ervaring te verbeteren",
        },
        error: {
          title: "Sorry, er ging iets mis!",
          description:
            "We kunnen uw reacties op dit moment niet opnemen. Probeer het later opnieuw.",
        },
        rate: {
          title: "Beoordeel uw ervaring",
          buttons: { submit: "Verzenden", back: "Terug", cancel: "annuleren" },
          rates: {
            ease: "Makkelijk te gebruiken",
            quality: "Kwaliteit van informatie",
            performance: "Algemene websiteprestaties",
          },
          comment: {
            label: "Reactie toevoegen (optioneel)",
            placeholder: "We zouden graag van je horen",
          },
        },
        feedback: "Feedback",
        chatbot: "Virtuele assistent",
      },
      "es-es": {
        emotions: { title: "¿Cómo fue tu experiencia?" },
        success: {
          title: "¡Gracias!",
          description:
            "Realmente apreciamos sus comentarios y los usaremos para mejorar su experiencia",
        },
        error: {
          title: "¡Perdón, algo salió mal!",
          description:
            "No pudimos registrar sus respuestas en este momento. Por favor, inténtelo de nuevo más tarde.",
        },
        rate: {
          title: "Califica tu experiencia",
          buttons: { submit: "Enviar", back: "atrás", cancel: "Cancelar" },
          rates: {
            ease: "Facilidad de uso",
            quality: "Calidad de la información",
            performance: "Rendimiento general del sitio web",
          },
          comment: {
            label: "Agregar comentario (opcional)",
            placeholder: "Nos encantaría saber de ti",
          },
        },
        feedback: "Realimentación",
        chatbot: "Asistente virtual",
      },
      "fr-fr": {
        emotions: { title: "Comment était ton expérience?" },
        success: {
          title: "Merci!",
          description:
            "Nous apprécions vraiment vos commentaires et nous les utiliserons pour améliorer votre expérience",
        },
        error: {
          title: "Désolé, quelque chose s'est mal passé!",
          description:
            "Nous n'avons pas pu enregistrer vos réponses pour le moment. Veuillez réessayer plus tard.",
        },
        rate: {
          title: "Évaluez votre expérience",
          buttons: { submit: "Soumettre", back: "Arrière", cancel: "Annuler" },
          rates: {
            ease: "Facilité d'utilisation",
            quality: "Qualité de l'information",
            performance: "Performance globale du site Web",
          },
          comment: {
            label: "Ajouter un commentaire (facultatif)",
            placeholder: "Nous aimerions recevoir de vos nouvelles",
          },
        },
        feedback: "Retour d'information",
        chatbot: "Assistant virtuel",
      },
      "hi-in": {
        emotions: { title: "आपका अनुभव कैसा रहा?" },
        success: {
          title: "धन्यवाद!",
          description:
            "हम वास्तव में आपकी प्रतिक्रिया की सराहना करते हैं और हम इसका उपयोग आपके अनुभव को बेहतर बनाने के लिए करेंगे",
        },
        error: {
          title: "क्षमा करें, कुछ गलत हो गया!",
          description:
            "हम इस समय आपकी प्रतिक्रियाओं को रिकॉर्ड नहीं कर सके। बाद में पुन: प्रयास करें।",
        },
        rate: {
          title: "अपने अनुभव को रेट करें",
          buttons: { submit: "प्रस्तुत", back: "वापस", cancel: "रद्द करना" },
          rates: {
            ease: "उपयोग में आसानी",
            quality: "जानकारी की गुणवत्ता",
            performance: "कुल मिलाकर वेबसाइट प्रदर्शन",
          },
          comment: {
            label: "टिप्पणी जोड़ें (वैकल्पिक)",
            placeholder: "हमे आपसे सुनने में ख़ुशी होगी",
          },
        },
        feedback: "प्रतिपुष्टि",
        chatbot: "आभासी सहायक",
      },
      "zh-cn": {
        emotions: { title: "您的经历如何？" },
        success: {
          title: "谢谢！",
          description: "非常感谢您的反馈，我们将用它来改善您的体验",
        },
        error: {
          title: "抱歉，出了一些问题！",
          description: "我们目前无法记录您的回复。请稍后再试。",
        },
        rate: {
          title: "评价您的经验",
          buttons: { submit: "提交", back: "背部", cancel: "取消" },
          rates: {
            ease: "便于使用",
            quality: "信息质量",
            performance: "网站整体表现",
          },
          comment: {
            label: "添加评论（可选）",
            placeholder: "我们很乐意听取您的意见",
          },
        },
        feedback: "反馈",
        chatbot: "虚拟助手",
      },
    };
    if ("undefined" != typeof GlobalCsatFeedbackJS) {
      var n = new GlobalCsatFeedbackJS({
        onSubmit: function (t, e) {
          console.log(t, e);
          try {
            $.post("/searchresults/pub/adfeedback/feedbacks", {
              surveyType: "general",
              smileyType: t,
              comments: e.comment,
              ratings: {
                ease: e.ease,
                quality: e.quality,
                performance: e.performance,
              },
              pageUrl: window.location.href,
            }).done(function (t) {
              console.log(t);
            });
          } catch (t) {
            console.log(t);
          }
        },
        setLocale: function (t) {
          n.setLocale(t, i[t]);
        },
        locale: e,
      });
      n.init(), n.setLocale(e, i[t]);
    }
  }),
  $(document).ready(function () {
    function t() {
      $(".section--bg-effect").each(function () {
        let t = $(this).parent(),
          e = t.find(".section--bg-effect-item")[0];
        if (e) {
          let i = $(e).offset().top + $(e).outerHeight() - $(t).offset().top;
          $(this).height(i);
        }
      });
    }
    $(".ex-parallax--animation, .section--animation").mousemove(function (t) {
      $(this).find("> div").addClass("sliding-div"),
        (function (t, e, i) {
          var n = $(".ex-parallax--animation, .section--animation"),
            o = t.pageX - n.offset().left,
            s = t.pageY - n.offset().top;
          TweenMax.to(e, 1, {
            x: ((o - n.width() / 2) / n.width()) * i,
            y: ((s - n.height() / 2) / n.height()) * i,
          });
        })(t, ".sliding-div", -100);
    }),
      t(),
      $(window).resize(t);
  });
var _gsScope =
  "undefined" != typeof module && module.exports && "undefined" != typeof global
    ? global
    : this || window;
function activateAccordion() {
  var t = $("[data-accordion]"),
    e =
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      $.checkSiteRTLDirection(),
      "ex-accordion__item"),
    i = e + "--expanded";
  $(".ex-header").height();
  t.each(function (t, n) {
    var o = "accordion-" + $.guid++;
    $(n).data().hasOwnProperty("item") &&
      ((e = $(n).data("item")), (i = e + "--expanded"));
    let s = $(n).find("." + e);
    if (
      ($(n).data().hasOwnProperty("self") && $(n).data("self") && (s = $(n)),
      s.length)
    ) {
      var r =
          $(n).data().hasOwnProperty("showFirst") || $(n).data("show-first"),
        a =
          ($(n).data().hasOwnProperty("singleOpen") || $(n).data("single-open"),
          $(n).data("active-class") || "");
      $(n).attr("id", o),
        $(n)
          .find(".accordion-trigger__collapse , .accordion-trigger--collapse")
          .unbind("click"),
        $(n)
          .find(".accordion-trigger__collapse , .accordion-trigger--collapse")
          .on("click", function (t) {
            var n = $(t.target).parents("." + e),
              o = n.find("." + e + "__content");
            o.is(":visible") &&
              (n.removeClass(i).removeClass(a), o.slideUp(500));
          }),
        $(n)
          .find(".accordion-trigger__expand , .accordion-trigger--expand")
          .unbind("click"),
        $(n)
          .find(".accordion-trigger__expand , .accordion-trigger--expand")
          .on("click", function (t) {
            var n = $(t.target).parents("." + e),
              o = n.find("." + e + "__content");
            o.is(":visible") ||
              ($("." + e)
                .removeClass(i)
                .removeClass(a)
                .find("." + e + "__content")
                .slideUp(500),
              n.addClass(i).addClass(a),
              o.slideDown(500)),
              $.fn.truncate &&
                $(t.target)
                  .parents("." + e)
                  .find(".truncate")
                  .each(function () {
                    $(this).truncate();
                  });
          }),
        r &&
          s
            .first()
            .find("." + e + "__content")
            .slideDown(500),
        s.each(function (t, e) {
          var i = $(e).find(".documents-count"),
            n = i.text();
          i.text(n.replace("#{count}", $(e).find(".ex-icon-card").length));
        }),
        r && s.first().find("[data-toggle]").first().click(),
        location &&
          location.hash &&
          $(location.hash).find("[data-toggle]").first().click();
    }
  });
}
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  "use strict";
  var t, e, i, n, o, s, r, a, l, c, u, h, d, p, f, m;
  _gsScope._gsDefine(
    "TweenMax",
    ["core.Animation", "core.SimpleTimeline", "TweenLite"],
    function (t, e, i) {
      var n = function (t) {
          var e,
            i = [],
            n = t.length;
          for (e = 0; e !== n; i.push(t[e++]));
          return i;
        },
        o = function (t, e, i) {
          var n,
            o,
            s = t.cycle;
          for (n in s)
            (o = s[n]),
              (t[n] = "function" == typeof o ? o(i, e[i]) : o[i % o.length]);
          delete t.cycle;
        },
        s = function (t, e, n) {
          i.call(this, t, e, n),
            (this._cycle = 0),
            (this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase),
            (this._repeat = this.vars.repeat || 0),
            (this._repeatDelay = this.vars.repeatDelay || 0),
            (this._dirty = !0),
            (this.render = s.prototype.render);
        },
        r = 1e-10,
        a = i._internals,
        l = a.isSelector,
        c = a.isArray,
        u = (s.prototype = i.to({}, 0.1, {})),
        h = [];
      (s.version = "1.20.2"),
        (u.constructor = s),
        (u.kill()._gc = !1),
        (s.killTweensOf = s.killDelayedCallsTo = i.killTweensOf),
        (s.getTweensOf = i.getTweensOf),
        (s.lagSmoothing = i.lagSmoothing),
        (s.ticker = i.ticker),
        (s.render = i.render),
        (u.invalidate = function () {
          return (
            (this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase),
            (this._repeat = this.vars.repeat || 0),
            (this._repeatDelay = this.vars.repeatDelay || 0),
            (this._yoyoEase = null),
            this._uncache(!0),
            i.prototype.invalidate.call(this)
          );
        }),
        (u.updateTo = function (t, e) {
          var n,
            o = this.ratio,
            s = this.vars.immediateRender || t.immediateRender;
          for (n in (e &&
            this._startTime < this._timeline._time &&
            ((this._startTime = this._timeline._time),
            this._uncache(!1),
            this._gc
              ? this._enabled(!0, !1)
              : this._timeline.insert(this, this._startTime - this._delay)),
          t))
            this.vars[n] = t[n];
          if (this._initted || s)
            if (e) (this._initted = !1), s && this.render(0, !0, !0);
            else if (
              (this._gc && this._enabled(!0, !1),
              this._notifyPluginsOfEnabled &&
                this._firstPT &&
                i._onPluginEvent("_onDisable", this),
              this._time / this._duration > 0.998)
            ) {
              var r = this._totalTime;
              this.render(0, !0, !1),
                (this._initted = !1),
                this.render(r, !0, !1);
            } else if (
              ((this._initted = !1), this._init(), this._time > 0 || s)
            )
              for (var a, l = 1 / (1 - o), c = this._firstPT; c; )
                (a = c.s + c.c), (c.c *= l), (c.s = a - c.c), (c = c._next);
          return this;
        }),
        (u.render = function (t, e, n) {
          this._initted ||
            (0 === this._duration && this.vars.repeat && this.invalidate());
          var o,
            s,
            l,
            c,
            u,
            h,
            d,
            p,
            f,
            m = this._dirty ? this.totalDuration() : this._totalDuration,
            g = this._time,
            v = this._totalTime,
            y = this._cycle,
            _ = this._duration,
            b = this._rawPrevTime;
          if (
            (t >= m - 1e-7 && t >= 0
              ? ((this._totalTime = m),
                (this._cycle = this._repeat),
                this._yoyo && 0 != (1 & this._cycle)
                  ? ((this._time = 0),
                    (this.ratio = this._ease._calcEnd
                      ? this._ease.getRatio(0)
                      : 0))
                  : ((this._time = _),
                    (this.ratio = this._ease._calcEnd
                      ? this._ease.getRatio(1)
                      : 1)),
                this._reversed ||
                  ((o = !0),
                  (s = "onComplete"),
                  (n = n || this._timeline.autoRemoveChildren)),
                0 === _ &&
                  (this._initted || !this.vars.lazy || n) &&
                  (this._startTime === this._timeline._duration && (t = 0),
                  (0 > b ||
                    (0 >= t && t >= -1e-7) ||
                    (b === r && "isPause" !== this.data)) &&
                    b !== t &&
                    ((n = !0), b > r && (s = "onReverseComplete")),
                  (this._rawPrevTime = p = !e || t || b === t ? t : r)))
              : 1e-7 > t
              ? ((this._totalTime = this._time = this._cycle = 0),
                (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0),
                (0 !== v || (0 === _ && b > 0)) &&
                  ((s = "onReverseComplete"), (o = this._reversed)),
                0 > t &&
                  ((this._active = !1),
                  0 === _ &&
                    (this._initted || !this.vars.lazy || n) &&
                    (b >= 0 && (n = !0),
                    (this._rawPrevTime = p = !e || t || b === t ? t : r))),
                this._initted || (n = !0))
              : ((this._totalTime = this._time = t),
                0 !== this._repeat &&
                  ((c = _ + this._repeatDelay),
                  (this._cycle = (this._totalTime / c) >> 0),
                  0 !== this._cycle &&
                    this._cycle === this._totalTime / c &&
                    t >= v &&
                    this._cycle--,
                  (this._time = this._totalTime - this._cycle * c),
                  this._yoyo &&
                    0 != (1 & this._cycle) &&
                    ((this._time = _ - this._time),
                    (f = this._yoyoEase || this.vars.yoyoEase) &&
                      (this._yoyoEase ||
                        (!0 !== f || this._initted
                          ? (this._yoyoEase = f =
                              !0 === f
                                ? this._ease
                                : f instanceof Ease
                                ? f
                                : Ease.map[f])
                          : ((f = this.vars.ease),
                            (this._yoyoEase = f =
                              f
                                ? f instanceof Ease
                                  ? f
                                  : "function" == typeof f
                                  ? new Ease(f, this.vars.easeParams)
                                  : Ease.map[f] || i.defaultEase
                                : i.defaultEase))),
                      (this.ratio = f
                        ? 1 - f.getRatio((_ - this._time) / _)
                        : 0))),
                  this._time > _
                    ? (this._time = _)
                    : this._time < 0 && (this._time = 0)),
                this._easeType && !f
                  ? ((u = this._time / _),
                    (1 === (h = this._easeType) || (3 === h && u >= 0.5)) &&
                      (u = 1 - u),
                    3 === h && (u *= 2),
                    1 === (d = this._easePower)
                      ? (u *= u)
                      : 2 === d
                      ? (u *= u * u)
                      : 3 === d
                      ? (u *= u * u * u)
                      : 4 === d && (u *= u * u * u * u),
                    1 === h
                      ? (this.ratio = 1 - u)
                      : 2 === h
                      ? (this.ratio = u)
                      : this._time / _ < 0.5
                      ? (this.ratio = u / 2)
                      : (this.ratio = 1 - u / 2))
                  : f || (this.ratio = this._ease.getRatio(this._time / _))),
            g !== this._time || n || y !== this._cycle)
          ) {
            if (!this._initted) {
              if ((this._init(), !this._initted || this._gc)) return;
              if (
                !n &&
                this._firstPT &&
                ((!1 !== this.vars.lazy && this._duration) ||
                  (this.vars.lazy && !this._duration))
              )
                return (
                  (this._time = g),
                  (this._totalTime = v),
                  (this._rawPrevTime = b),
                  (this._cycle = y),
                  a.lazyTweens.push(this),
                  void (this._lazy = [t, e])
                );
              !this._time || o || f
                ? o &&
                  this._ease._calcEnd &&
                  !f &&
                  (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                : (this.ratio = this._ease.getRatio(this._time / _));
            }
            for (
              !1 !== this._lazy && (this._lazy = !1),
                this._active ||
                  (!this._paused &&
                    this._time !== g &&
                    t >= 0 &&
                    (this._active = !0)),
                0 === v &&
                  (2 === this._initted && t > 0 && this._init(),
                  this._startAt &&
                    (t >= 0
                      ? this._startAt.render(t, e, n)
                      : s || (s = "_dummyGS")),
                  this.vars.onStart &&
                    (0 !== this._totalTime || 0 === _) &&
                    (e || this._callback("onStart"))),
                l = this._firstPT;
              l;

            )
              l.f
                ? l.t[l.p](l.c * this.ratio + l.s)
                : (l.t[l.p] = l.c * this.ratio + l.s),
                (l = l._next);
            this._onUpdate &&
              (0 > t &&
                this._startAt &&
                this._startTime &&
                this._startAt.render(t, e, n),
              e ||
                ((this._totalTime !== v || s) && this._callback("onUpdate"))),
              this._cycle !== y &&
                (e ||
                  this._gc ||
                  (this.vars.onRepeat && this._callback("onRepeat"))),
              s &&
                (!this._gc || n) &&
                (0 > t &&
                  this._startAt &&
                  !this._onUpdate &&
                  this._startTime &&
                  this._startAt.render(t, e, n),
                o &&
                  (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                  (this._active = !1)),
                !e && this.vars[s] && this._callback(s),
                0 === _ &&
                  this._rawPrevTime === r &&
                  p !== r &&
                  (this._rawPrevTime = 0));
          } else
            v !== this._totalTime &&
              this._onUpdate &&
              (e || this._callback("onUpdate"));
        }),
        (s.to = function (t, e, i) {
          return new s(t, e, i);
        }),
        (s.from = function (t, e, i) {
          return (
            (i.runBackwards = !0),
            (i.immediateRender = 0 != i.immediateRender),
            new s(t, e, i)
          );
        }),
        (s.fromTo = function (t, e, i, n) {
          return (
            (n.startAt = i),
            (n.immediateRender =
              0 != n.immediateRender && 0 != i.immediateRender),
            new s(t, e, n)
          );
        }),
        (s.staggerTo = s.allTo =
          function (t, e, r, a, u, d, p) {
            a = a || 0;
            var f,
              m,
              g,
              v,
              y = 0,
              _ = [],
              b = function () {
                r.onComplete &&
                  r.onComplete.apply(r.onCompleteScope || this, arguments),
                  u.apply(p || r.callbackScope || this, d || h);
              },
              w = r.cycle,
              x = r.startAt && r.startAt.cycle;
            for (
              c(t) ||
                ("string" == typeof t && (t = i.selector(t) || t),
                l(t) && (t = n(t))),
                t = t || [],
                0 > a && ((t = n(t)).reverse(), (a *= -1)),
                f = t.length - 1,
                g = 0;
              f >= g;
              g++
            ) {
              for (v in ((m = {}), r)) m[v] = r[v];
              if (
                (w &&
                  (o(m, t, g),
                  null != m.duration && ((e = m.duration), delete m.duration)),
                x)
              ) {
                for (v in ((x = m.startAt = {}), r.startAt))
                  x[v] = r.startAt[v];
                o(m.startAt, t, g);
              }
              (m.delay = y + (m.delay || 0)),
                g === f && u && (m.onComplete = b),
                (_[g] = new s(t[g], e, m)),
                (y += a);
            }
            return _;
          }),
        (s.staggerFrom = s.allFrom =
          function (t, e, i, n, o, r, a) {
            return (
              (i.runBackwards = !0),
              (i.immediateRender = 0 != i.immediateRender),
              s.staggerTo(t, e, i, n, o, r, a)
            );
          }),
        (s.staggerFromTo = s.allFromTo =
          function (t, e, i, n, o, r, a, l) {
            return (
              (n.startAt = i),
              (n.immediateRender =
                0 != n.immediateRender && 0 != i.immediateRender),
              s.staggerTo(t, e, n, o, r, a, l)
            );
          }),
        (s.delayedCall = function (t, e, i, n, o) {
          return new s(e, 0, {
            delay: t,
            onComplete: e,
            onCompleteParams: i,
            callbackScope: n,
            onReverseComplete: e,
            onReverseCompleteParams: i,
            immediateRender: !1,
            useFrames: o,
            overwrite: 0,
          });
        }),
        (s.set = function (t, e) {
          return new s(t, 0, e);
        }),
        (s.isTweening = function (t) {
          return i.getTweensOf(t, !0).length > 0;
        });
      var d = function (t, e) {
          for (var n = [], o = 0, s = t._first; s; )
            s instanceof i
              ? (n[o++] = s)
              : (e && (n[o++] = s), (o = (n = n.concat(d(s, e))).length)),
              (s = s._next);
          return n;
        },
        p = (s.getAllTweens = function (e) {
          return d(t._rootTimeline, e).concat(d(t._rootFramesTimeline, e));
        });
      (s.killAll = function (t, i, n, o) {
        null == i && (i = !0), null == n && (n = !0);
        var s,
          r,
          a,
          l = p(0 != o),
          c = l.length,
          u = i && n && o;
        for (a = 0; c > a; a++)
          (r = l[a]),
            (u ||
              r instanceof e ||
              ((s = r.target === r.vars.onComplete) && n) ||
              (i && !s)) &&
              (t
                ? r.totalTime(r._reversed ? 0 : r.totalDuration())
                : r._enabled(!1, !1));
      }),
        (s.killChildTweensOf = function (t, e) {
          if (null != t) {
            var o,
              r,
              u,
              h,
              d,
              p = a.tweenLookup;
            if (
              ("string" == typeof t && (t = i.selector(t) || t),
              l(t) && (t = n(t)),
              c(t))
            )
              for (h = t.length; --h > -1; ) s.killChildTweensOf(t[h], e);
            else {
              for (u in ((o = []), p))
                for (r = p[u].target.parentNode; r; )
                  r === t && (o = o.concat(p[u].tweens)), (r = r.parentNode);
              for (d = o.length, h = 0; d > h; h++)
                e && o[h].totalTime(o[h].totalDuration()),
                  o[h]._enabled(!1, !1);
            }
          }
        });
      var f = function (t, i, n, o) {
        (i = !1 !== i), (n = !1 !== n);
        for (
          var s, r, a = p((o = !1 !== o)), l = i && n && o, c = a.length;
          --c > -1;

        )
          (r = a[c]),
            (l ||
              r instanceof e ||
              ((s = r.target === r.vars.onComplete) && n) ||
              (i && !s)) &&
              r.paused(t);
      };
      return (
        (s.pauseAll = function (t, e, i) {
          f(!0, t, e, i);
        }),
        (s.resumeAll = function (t, e, i) {
          f(!1, t, e, i);
        }),
        (s.globalTimeScale = function (e) {
          var n = t._rootTimeline,
            o = i.ticker.time;
          return arguments.length
            ? ((e = e || r),
              (n._startTime = o - ((o - n._startTime) * n._timeScale) / e),
              (n = t._rootFramesTimeline),
              (o = i.ticker.frame),
              (n._startTime = o - ((o - n._startTime) * n._timeScale) / e),
              (n._timeScale = t._rootTimeline._timeScale = e),
              e)
            : n._timeScale;
        }),
        (u.progress = function (t, e) {
          return arguments.length
            ? this.totalTime(
                this.duration() *
                  (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) +
                  this._cycle * (this._duration + this._repeatDelay),
                e
              )
            : this._time / this.duration();
        }),
        (u.totalProgress = function (t, e) {
          return arguments.length
            ? this.totalTime(this.totalDuration() * t, e)
            : this._totalTime / this.totalDuration();
        }),
        (u.time = function (t, e) {
          return arguments.length
            ? (this._dirty && this.totalDuration(),
              t > this._duration && (t = this._duration),
              this._yoyo && 0 != (1 & this._cycle)
                ? (t =
                    this._duration -
                    t +
                    this._cycle * (this._duration + this._repeatDelay))
                : 0 !== this._repeat &&
                  (t += this._cycle * (this._duration + this._repeatDelay)),
              this.totalTime(t, e))
            : this._time;
        }),
        (u.duration = function (e) {
          return arguments.length
            ? t.prototype.duration.call(this, e)
            : this._duration;
        }),
        (u.totalDuration = function (t) {
          return arguments.length
            ? -1 === this._repeat
              ? this
              : this.duration(
                  (t - this._repeat * this._repeatDelay) / (this._repeat + 1)
                )
            : (this._dirty &&
                ((this._totalDuration =
                  -1 === this._repeat
                    ? 999999999999
                    : this._duration * (this._repeat + 1) +
                      this._repeatDelay * this._repeat),
                (this._dirty = !1)),
              this._totalDuration);
        }),
        (u.repeat = function (t) {
          return arguments.length
            ? ((this._repeat = t), this._uncache(!0))
            : this._repeat;
        }),
        (u.repeatDelay = function (t) {
          return arguments.length
            ? ((this._repeatDelay = t), this._uncache(!0))
            : this._repeatDelay;
        }),
        (u.yoyo = function (t) {
          return arguments.length ? ((this._yoyo = t), this) : this._yoyo;
        }),
        s
      );
    },
    !0
  ),
    _gsScope._gsDefine(
      "TimelineLite",
      ["core.Animation", "core.SimpleTimeline", "TweenLite"],
      function (t, e, i) {
        var n = function (t) {
            e.call(this, t),
              (this._labels = {}),
              (this.autoRemoveChildren = !0 === this.vars.autoRemoveChildren),
              (this.smoothChildTiming = !0 === this.vars.smoothChildTiming),
              (this._sortChildren = !0),
              (this._onUpdate = this.vars.onUpdate);
            var i,
              n,
              o = this.vars;
            for (n in o)
              (i = o[n]),
                l(i) &&
                  -1 !== i.join("").indexOf("{self}") &&
                  (o[n] = this._swapSelfInParams(i));
            l(o.tweens) && this.add(o.tweens, 0, o.align, o.stagger);
          },
          o = 1e-10,
          s = i._internals,
          r = (n._internals = {}),
          a = s.isSelector,
          l = s.isArray,
          c = s.lazyTweens,
          u = s.lazyRender,
          h = _gsScope._gsDefine.globals,
          d = function (t) {
            var e,
              i = {};
            for (e in t) i[e] = t[e];
            return i;
          },
          p = function (t, e, i) {
            var n,
              o,
              s = t.cycle;
            for (n in s)
              (o = s[n]),
                (t[n] = "function" == typeof o ? o(i, e[i]) : o[i % o.length]);
            delete t.cycle;
          },
          f = (r.pauseCallback = function () {}),
          m = function (t) {
            var e,
              i = [],
              n = t.length;
            for (e = 0; e !== n; i.push(t[e++]));
            return i;
          },
          g = (n.prototype = new e());
        return (
          (n.version = "1.20.2"),
          (g.constructor = n),
          (g.kill()._gc = g._forcingPlayhead = g._hasPause = !1),
          (g.to = function (t, e, n, o) {
            var s = (n.repeat && h.TweenMax) || i;
            return e ? this.add(new s(t, e, n), o) : this.set(t, n, o);
          }),
          (g.from = function (t, e, n, o) {
            return this.add(((n.repeat && h.TweenMax) || i).from(t, e, n), o);
          }),
          (g.fromTo = function (t, e, n, o, s) {
            var r = (o.repeat && h.TweenMax) || i;
            return e ? this.add(r.fromTo(t, e, n, o), s) : this.set(t, o, s);
          }),
          (g.staggerTo = function (t, e, o, s, r, l, c, u) {
            var h,
              f,
              g = new n({
                onComplete: l,
                onCompleteParams: c,
                callbackScope: u,
                smoothChildTiming: this.smoothChildTiming,
              }),
              v = o.cycle;
            for (
              "string" == typeof t && (t = i.selector(t) || t),
                a((t = t || [])) && (t = m(t)),
                0 > (s = s || 0) && ((t = m(t)).reverse(), (s *= -1)),
                f = 0;
              f < t.length;
              f++
            )
              (h = d(o)).startAt &&
                ((h.startAt = d(h.startAt)),
                h.startAt.cycle && p(h.startAt, t, f)),
                v &&
                  (p(h, t, f),
                  null != h.duration && ((e = h.duration), delete h.duration)),
                g.to(t[f], e, h, f * s);
            return this.add(g, r);
          }),
          (g.staggerFrom = function (t, e, i, n, o, s, r, a) {
            return (
              (i.immediateRender = 0 != i.immediateRender),
              (i.runBackwards = !0),
              this.staggerTo(t, e, i, n, o, s, r, a)
            );
          }),
          (g.staggerFromTo = function (t, e, i, n, o, s, r, a, l) {
            return (
              (n.startAt = i),
              (n.immediateRender =
                0 != n.immediateRender && 0 != i.immediateRender),
              this.staggerTo(t, e, n, o, s, r, a, l)
            );
          }),
          (g.call = function (t, e, n, o) {
            return this.add(i.delayedCall(0, t, e, n), o);
          }),
          (g.set = function (t, e, n) {
            return (
              (n = this._parseTimeOrLabel(n, 0, !0)),
              null == e.immediateRender &&
                (e.immediateRender = n === this._time && !this._paused),
              this.add(new i(t, 0, e), n)
            );
          }),
          (n.exportRoot = function (t, e) {
            null == (t = t || {}).smoothChildTiming &&
              (t.smoothChildTiming = !0);
            var o,
              s,
              r = new n(t),
              a = r._timeline;
            for (
              null == e && (e = !0),
                a._remove(r, !0),
                r._startTime = 0,
                r._rawPrevTime = r._time = r._totalTime = a._time,
                o = a._first;
              o;

            )
              (s = o._next),
                (e && o instanceof i && o.target === o.vars.onComplete) ||
                  r.add(o, o._startTime - o._delay),
                (o = s);
            return a.add(r, 0), r;
          }),
          (g.add = function (o, s, r, a) {
            var c, u, h, d, p, f;
            if (
              ("number" != typeof s &&
                (s = this._parseTimeOrLabel(s, 0, !0, o)),
              !(o instanceof t))
            ) {
              if (o instanceof Array || (o && o.push && l(o))) {
                for (
                  r = r || "normal", a = a || 0, c = s, u = o.length, h = 0;
                  u > h;
                  h++
                )
                  l((d = o[h])) && (d = new n({ tweens: d })),
                    this.add(d, c),
                    "string" != typeof d &&
                      "function" != typeof d &&
                      ("sequence" === r
                        ? (c = d._startTime + d.totalDuration() / d._timeScale)
                        : "start" === r && (d._startTime -= d.delay())),
                    (c += a);
                return this._uncache(!0);
              }
              if ("string" == typeof o) return this.addLabel(o, s);
              if ("function" != typeof o)
                throw (
                  "Cannot add " +
                  o +
                  " into the timeline; it is not a tween, timeline, function, or string."
                );
              o = i.delayedCall(0, o);
            }
            if (
              (e.prototype.add.call(this, o, s),
              o._time &&
                o.render(
                  (this.rawTime() - o._startTime) * o._timeScale,
                  !1,
                  !1
                ),
              (this._gc || this._time === this._duration) &&
                !this._paused &&
                this._duration < this.duration())
            )
              for (f = (p = this).rawTime() > o._startTime; p._timeline; )
                f && p._timeline.smoothChildTiming
                  ? p.totalTime(p._totalTime, !0)
                  : p._gc && p._enabled(!0, !1),
                  (p = p._timeline);
            return this;
          }),
          (g.remove = function (e) {
            if (e instanceof t) {
              this._remove(e, !1);
              var i = (e._timeline = e.vars.useFrames
                ? t._rootFramesTimeline
                : t._rootTimeline);
              return (
                (e._startTime =
                  (e._paused ? e._pauseTime : i._time) -
                  (e._reversed
                    ? e.totalDuration() - e._totalTime
                    : e._totalTime) /
                    e._timeScale),
                this
              );
            }
            if (e instanceof Array || (e && e.push && l(e))) {
              for (var n = e.length; --n > -1; ) this.remove(e[n]);
              return this;
            }
            return "string" == typeof e
              ? this.removeLabel(e)
              : this.kill(null, e);
          }),
          (g._remove = function (t, i) {
            return (
              e.prototype._remove.call(this, t, i),
              this._last
                ? this._time > this.duration() &&
                  ((this._time = this._duration),
                  (this._totalTime = this._totalDuration))
                : (this._time =
                    this._totalTime =
                    this._duration =
                    this._totalDuration =
                      0),
              this
            );
          }),
          (g.append = function (t, e) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t));
          }),
          (g.insert = g.insertMultiple =
            function (t, e, i, n) {
              return this.add(t, e || 0, i, n);
            }),
          (g.appendMultiple = function (t, e, i, n) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, n);
          }),
          (g.addLabel = function (t, e) {
            return (this._labels[t] = this._parseTimeOrLabel(e)), this;
          }),
          (g.addPause = function (t, e, n, o) {
            var s = i.delayedCall(0, f, n, o || this);
            return (
              (s.vars.onComplete = s.vars.onReverseComplete = e),
              (s.data = "isPause"),
              (this._hasPause = !0),
              this.add(s, t)
            );
          }),
          (g.removeLabel = function (t) {
            return delete this._labels[t], this;
          }),
          (g.getLabelTime = function (t) {
            return null != this._labels[t] ? this._labels[t] : -1;
          }),
          (g._parseTimeOrLabel = function (e, i, n, o) {
            var s, r;
            if (o instanceof t && o.timeline === this) this.remove(o);
            else if (o && (o instanceof Array || (o.push && l(o))))
              for (r = o.length; --r > -1; )
                o[r] instanceof t &&
                  o[r].timeline === this &&
                  this.remove(o[r]);
            if (
              ((s =
                this.duration() > 99999999999
                  ? this.recent().endTime(!1)
                  : this._duration),
              "string" == typeof i)
            )
              return this._parseTimeOrLabel(
                i,
                n && "number" == typeof e && null == this._labels[i]
                  ? e - s
                  : 0,
                n
              );
            if (
              ((i = i || 0),
              "string" != typeof e || (!isNaN(e) && null == this._labels[e]))
            )
              null == e && (e = s);
            else {
              if (-1 === (r = e.indexOf("=")))
                return null == this._labels[e]
                  ? n
                    ? (this._labels[e] = s + i)
                    : i
                  : this._labels[e] + i;
              (i =
                parseInt(e.charAt(r - 1) + "1", 10) * Number(e.substr(r + 1))),
                (e =
                  r > 1 ? this._parseTimeOrLabel(e.substr(0, r - 1), 0, n) : s);
            }
            return Number(e) + i;
          }),
          (g.seek = function (t, e) {
            return this.totalTime(
              "number" == typeof t ? t : this._parseTimeOrLabel(t),
              !1 !== e
            );
          }),
          (g.stop = function () {
            return this.paused(!0);
          }),
          (g.gotoAndPlay = function (t, e) {
            return this.play(t, e);
          }),
          (g.gotoAndStop = function (t, e) {
            return this.pause(t, e);
          }),
          (g.render = function (t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n,
              s,
              r,
              a,
              l,
              h,
              d,
              p = this._dirty ? this.totalDuration() : this._totalDuration,
              f = this._time,
              m = this._startTime,
              g = this._timeScale,
              v = this._paused;
            if (t >= p - 1e-7 && t >= 0)
              (this._totalTime = this._time = p),
                this._reversed ||
                  this._hasPausedChild() ||
                  ((s = !0),
                  (a = "onComplete"),
                  (l = !!this._timeline.autoRemoveChildren),
                  0 === this._duration &&
                    ((0 >= t && t >= -1e-7) ||
                      this._rawPrevTime < 0 ||
                      this._rawPrevTime === o) &&
                    this._rawPrevTime !== t &&
                    this._first &&
                    ((l = !0),
                    this._rawPrevTime > o && (a = "onReverseComplete"))),
                (this._rawPrevTime =
                  this._duration || !e || t || this._rawPrevTime === t ? t : o),
                (t = p + 1e-4);
            else if (1e-7 > t)
              if (
                ((this._totalTime = this._time = 0),
                (0 !== f ||
                  (0 === this._duration &&
                    this._rawPrevTime !== o &&
                    (this._rawPrevTime > 0 ||
                      (0 > t && this._rawPrevTime >= 0)))) &&
                  ((a = "onReverseComplete"), (s = this._reversed)),
                0 > t)
              )
                (this._active = !1),
                  this._timeline.autoRemoveChildren && this._reversed
                    ? ((l = s = !0), (a = "onReverseComplete"))
                    : this._rawPrevTime >= 0 && this._first && (l = !0),
                  (this._rawPrevTime = t);
              else {
                if (
                  ((this._rawPrevTime =
                    this._duration || !e || t || this._rawPrevTime === t
                      ? t
                      : o),
                  0 === t && s)
                )
                  for (n = this._first; n && 0 === n._startTime; )
                    n._duration || (s = !1), (n = n._next);
                (t = 0), this._initted || (l = !0);
              }
            else {
              if (this._hasPause && !this._forcingPlayhead && !e) {
                if (t >= f)
                  for (n = this._first; n && n._startTime <= t && !h; )
                    n._duration ||
                      "isPause" !== n.data ||
                      n.ratio ||
                      (0 === n._startTime && 0 === this._rawPrevTime) ||
                      (h = n),
                      (n = n._next);
                else
                  for (n = this._last; n && n._startTime >= t && !h; )
                    n._duration ||
                      ("isPause" === n.data && n._rawPrevTime > 0 && (h = n)),
                      (n = n._prev);
                h &&
                  ((this._time = t = h._startTime),
                  (this._totalTime =
                    t +
                    this._cycle * (this._totalDuration + this._repeatDelay)));
              }
              this._totalTime = this._time = this._rawPrevTime = t;
            }
            if ((this._time !== f && this._first) || i || l || h) {
              if (
                (this._initted || (this._initted = !0),
                this._active ||
                  (!this._paused &&
                    this._time !== f &&
                    t > 0 &&
                    (this._active = !0)),
                0 === f &&
                  this.vars.onStart &&
                  ((0 === this._time && this._duration) ||
                    e ||
                    this._callback("onStart")),
                (d = this._time) >= f)
              )
                for (
                  n = this._first;
                  n &&
                  ((r = n._next), d === this._time && (!this._paused || v));

                )
                  (n._active || (n._startTime <= d && !n._paused && !n._gc)) &&
                    (h === n && this.pause(),
                    n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i)),
                    (n = r);
              else
                for (
                  n = this._last;
                  n &&
                  ((r = n._prev), d === this._time && (!this._paused || v));

                ) {
                  if (
                    n._active ||
                    (n._startTime <= f && !n._paused && !n._gc)
                  ) {
                    if (h === n) {
                      for (h = n._prev; h && h.endTime() > this._time; )
                        h.render(
                          h._reversed
                            ? h.totalDuration() -
                                (t - h._startTime) * h._timeScale
                            : (t - h._startTime) * h._timeScale,
                          e,
                          i
                        ),
                          (h = h._prev);
                      (h = null), this.pause();
                    }
                    n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i);
                  }
                  n = r;
                }
              this._onUpdate &&
                (e || (c.length && u(), this._callback("onUpdate"))),
                a &&
                  (this._gc ||
                    ((m === this._startTime || g !== this._timeScale) &&
                      (0 === this._time || p >= this.totalDuration()) &&
                      (s &&
                        (c.length && u(),
                        this._timeline.autoRemoveChildren &&
                          this._enabled(!1, !1),
                        (this._active = !1)),
                      !e && this.vars[a] && this._callback(a))));
            }
          }),
          (g._hasPausedChild = function () {
            for (var t = this._first; t; ) {
              if (t._paused || (t instanceof n && t._hasPausedChild()))
                return !0;
              t = t._next;
            }
            return !1;
          }),
          (g.getChildren = function (t, e, n, o) {
            o = o || -9999999999;
            for (var s = [], r = this._first, a = 0; r; )
              r._startTime < o ||
                (r instanceof i
                  ? !1 !== e && (s[a++] = r)
                  : (!1 !== n && (s[a++] = r),
                    !1 !== t &&
                      (a = (s = s.concat(r.getChildren(!0, e, n))).length))),
                (r = r._next);
            return s;
          }),
          (g.getTweensOf = function (t, e) {
            var n,
              o,
              s = this._gc,
              r = [],
              a = 0;
            for (
              s && this._enabled(!0, !0), o = (n = i.getTweensOf(t)).length;
              --o > -1;

            )
              (n[o].timeline === this || (e && this._contains(n[o]))) &&
                (r[a++] = n[o]);
            return s && this._enabled(!1, !0), r;
          }),
          (g.recent = function () {
            return this._recent;
          }),
          (g._contains = function (t) {
            for (var e = t.timeline; e; ) {
              if (e === this) return !0;
              e = e.timeline;
            }
            return !1;
          }),
          (g.shiftChildren = function (t, e, i) {
            i = i || 0;
            for (var n, o = this._first, s = this._labels; o; )
              o._startTime >= i && (o._startTime += t), (o = o._next);
            if (e) for (n in s) s[n] >= i && (s[n] += t);
            return this._uncache(!0);
          }),
          (g._kill = function (t, e) {
            if (!t && !e) return this._enabled(!1, !1);
            for (
              var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1),
                n = i.length,
                o = !1;
              --n > -1;

            )
              i[n]._kill(t, e) && (o = !0);
            return o;
          }),
          (g.clear = function (t) {
            var e = this.getChildren(!1, !0, !0),
              i = e.length;
            for (this._time = this._totalTime = 0; --i > -1; )
              e[i]._enabled(!1, !1);
            return !1 !== t && (this._labels = {}), this._uncache(!0);
          }),
          (g.invalidate = function () {
            for (var e = this._first; e; ) e.invalidate(), (e = e._next);
            return t.prototype.invalidate.call(this);
          }),
          (g._enabled = function (t, i) {
            if (t === this._gc)
              for (var n = this._first; n; ) n._enabled(t, !0), (n = n._next);
            return e.prototype._enabled.call(this, t, i);
          }),
          (g.totalTime = function (e, i, n) {
            this._forcingPlayhead = !0;
            var o = t.prototype.totalTime.apply(this, arguments);
            return (this._forcingPlayhead = !1), o;
          }),
          (g.duration = function (t) {
            return arguments.length
              ? (0 !== this.duration() &&
                  0 !== t &&
                  this.timeScale(this._duration / t),
                this)
              : (this._dirty && this.totalDuration(), this._duration);
          }),
          (g.totalDuration = function (t) {
            if (!arguments.length) {
              if (this._dirty) {
                for (var e, i, n = 0, o = this._last, s = 999999999999; o; )
                  (e = o._prev),
                    o._dirty && o.totalDuration(),
                    o._startTime > s && this._sortChildren && !o._paused
                      ? this.add(o, o._startTime - o._delay)
                      : (s = o._startTime),
                    o._startTime < 0 &&
                      !o._paused &&
                      ((n -= o._startTime),
                      this._timeline.smoothChildTiming &&
                        (this._startTime += o._startTime / this._timeScale),
                      this.shiftChildren(-o._startTime, !1, -9999999999),
                      (s = 0)),
                    (i = o._startTime + o._totalDuration / o._timeScale) > n &&
                      (n = i),
                    (o = e);
                (this._duration = this._totalDuration = n), (this._dirty = !1);
              }
              return this._totalDuration;
            }
            return t && this.totalDuration()
              ? this.timeScale(this._totalDuration / t)
              : this;
          }),
          (g.paused = function (e) {
            if (!e)
              for (var i = this._first, n = this._time; i; )
                i._startTime === n &&
                  "isPause" === i.data &&
                  (i._rawPrevTime = 0),
                  (i = i._next);
            return t.prototype.paused.apply(this, arguments);
          }),
          (g.usesFrames = function () {
            for (var e = this._timeline; e._timeline; ) e = e._timeline;
            return e === t._rootFramesTimeline;
          }),
          (g.rawTime = function (t) {
            return t &&
              (this._paused ||
                (this._repeat && this.time() > 0 && this.totalProgress() < 1))
              ? this._totalTime % (this._duration + this._repeatDelay)
              : this._paused
              ? this._totalTime
              : (this._timeline.rawTime(t) - this._startTime) * this._timeScale;
          }),
          n
        );
      },
      !0
    ),
    _gsScope._gsDefine(
      "TimelineMax",
      ["TimelineLite", "TweenLite", "easing.Ease"],
      function (t, e, i) {
        var n = function (e) {
            t.call(this, e),
              (this._repeat = this.vars.repeat || 0),
              (this._repeatDelay = this.vars.repeatDelay || 0),
              (this._cycle = 0),
              (this._yoyo = !0 === this.vars.yoyo),
              (this._dirty = !0);
          },
          o = 1e-10,
          s = e._internals,
          r = s.lazyTweens,
          a = s.lazyRender,
          l = _gsScope._gsDefine.globals,
          c = new i(null, null, 1, 0),
          u = (n.prototype = new t());
        return (
          (u.constructor = n),
          (u.kill()._gc = !1),
          (n.version = "1.20.2"),
          (u.invalidate = function () {
            return (
              (this._yoyo = !0 === this.vars.yoyo),
              (this._repeat = this.vars.repeat || 0),
              (this._repeatDelay = this.vars.repeatDelay || 0),
              this._uncache(!0),
              t.prototype.invalidate.call(this)
            );
          }),
          (u.addCallback = function (t, i, n, o) {
            return this.add(e.delayedCall(0, t, n, o), i);
          }),
          (u.removeCallback = function (t, e) {
            if (t)
              if (null == e) this._kill(null, t);
              else
                for (
                  var i = this.getTweensOf(t, !1),
                    n = i.length,
                    o = this._parseTimeOrLabel(e);
                  --n > -1;

                )
                  i[n]._startTime === o && i[n]._enabled(!1, !1);
            return this;
          }),
          (u.removePause = function (e) {
            return this.removeCallback(t._internals.pauseCallback, e);
          }),
          (u.tweenTo = function (t, i) {
            i = i || {};
            var n,
              o,
              s,
              r = {
                ease: c,
                useFrames: this.usesFrames(),
                immediateRender: !1,
              },
              a = (i.repeat && l.TweenMax) || e;
            for (o in i) r[o] = i[o];
            return (
              (r.time = this._parseTimeOrLabel(t)),
              (n =
                Math.abs(Number(r.time) - this._time) / this._timeScale ||
                0.001),
              (s = new a(this, n, r)),
              (r.onStart = function () {
                s.target.paused(!0),
                  s.vars.time !== s.target.time() &&
                    n === s.duration() &&
                    s.duration(
                      Math.abs(s.vars.time - s.target.time()) /
                        s.target._timeScale
                    ),
                  i.onStart &&
                    i.onStart.apply(
                      i.onStartScope || i.callbackScope || s,
                      i.onStartParams || []
                    );
              }),
              s
            );
          }),
          (u.tweenFromTo = function (t, e, i) {
            (i = i || {}),
              (t = this._parseTimeOrLabel(t)),
              (i.startAt = {
                onComplete: this.seek,
                onCompleteParams: [t],
                callbackScope: this,
              }),
              (i.immediateRender = !1 !== i.immediateRender);
            var n = this.tweenTo(e, i);
            return n.duration(
              Math.abs(n.vars.time - t) / this._timeScale || 0.001
            );
          }),
          (u.render = function (t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n,
              s,
              l,
              c,
              u,
              h,
              d,
              p,
              f = this._dirty ? this.totalDuration() : this._totalDuration,
              m = this._duration,
              g = this._time,
              v = this._totalTime,
              y = this._startTime,
              _ = this._timeScale,
              b = this._rawPrevTime,
              w = this._paused,
              x = this._cycle;
            if (t >= f - 1e-7 && t >= 0)
              this._locked ||
                ((this._totalTime = f), (this._cycle = this._repeat)),
                this._reversed ||
                  this._hasPausedChild() ||
                  ((s = !0),
                  (c = "onComplete"),
                  (u = !!this._timeline.autoRemoveChildren),
                  0 === this._duration &&
                    ((0 >= t && t >= -1e-7) || 0 > b || b === o) &&
                    b !== t &&
                    this._first &&
                    ((u = !0), b > o && (c = "onReverseComplete"))),
                (this._rawPrevTime =
                  this._duration || !e || t || this._rawPrevTime === t ? t : o),
                this._yoyo && 0 != (1 & this._cycle)
                  ? (this._time = t = 0)
                  : ((this._time = m), (t = m + 1e-4));
            else if (1e-7 > t)
              if (
                (this._locked || (this._totalTime = this._cycle = 0),
                (this._time = 0),
                (0 !== g ||
                  (0 === m &&
                    b !== o &&
                    (b > 0 || (0 > t && b >= 0)) &&
                    !this._locked)) &&
                  ((c = "onReverseComplete"), (s = this._reversed)),
                0 > t)
              )
                (this._active = !1),
                  this._timeline.autoRemoveChildren && this._reversed
                    ? ((u = s = !0), (c = "onReverseComplete"))
                    : b >= 0 && this._first && (u = !0),
                  (this._rawPrevTime = t);
              else {
                if (
                  ((this._rawPrevTime =
                    m || !e || t || this._rawPrevTime === t ? t : o),
                  0 === t && s)
                )
                  for (n = this._first; n && 0 === n._startTime; )
                    n._duration || (s = !1), (n = n._next);
                (t = 0), this._initted || (u = !0);
              }
            else if (
              (0 === m && 0 > b && (u = !0),
              (this._time = this._rawPrevTime = t),
              this._locked ||
                ((this._totalTime = t),
                0 !== this._repeat &&
                  ((h = m + this._repeatDelay),
                  (this._cycle = (this._totalTime / h) >> 0),
                  0 !== this._cycle &&
                    this._cycle === this._totalTime / h &&
                    t >= v &&
                    this._cycle--,
                  (this._time = this._totalTime - this._cycle * h),
                  this._yoyo &&
                    0 != (1 & this._cycle) &&
                    (this._time = m - this._time),
                  this._time > m
                    ? ((this._time = m), (t = m + 1e-4))
                    : this._time < 0
                    ? (this._time = t = 0)
                    : (t = this._time))),
              this._hasPause && !this._forcingPlayhead && !e)
            ) {
              if ((t = this._time) >= g || (this._repeat && x !== this._cycle))
                for (n = this._first; n && n._startTime <= t && !d; )
                  n._duration ||
                    "isPause" !== n.data ||
                    n.ratio ||
                    (0 === n._startTime && 0 === this._rawPrevTime) ||
                    (d = n),
                    (n = n._next);
              else
                for (n = this._last; n && n._startTime >= t && !d; )
                  n._duration ||
                    ("isPause" === n.data && n._rawPrevTime > 0 && (d = n)),
                    (n = n._prev);
              d &&
                d._startTime < m &&
                ((this._time = t = d._startTime),
                (this._totalTime =
                  t + this._cycle * (this._totalDuration + this._repeatDelay)));
            }
            if (this._cycle !== x && !this._locked) {
              var T = this._yoyo && 0 != (1 & x),
                $ = T === (this._yoyo && 0 != (1 & this._cycle)),
                S = this._totalTime,
                C = this._cycle,
                k = this._rawPrevTime,
                P = this._time;
              if (
                ((this._totalTime = x * m),
                this._cycle < x ? (T = !T) : (this._totalTime += m),
                (this._time = g),
                (this._rawPrevTime = 0 === m ? b - 1e-4 : b),
                (this._cycle = x),
                (this._locked = !0),
                (g = T ? 0 : m),
                this.render(g, e, 0 === m),
                e ||
                  this._gc ||
                  (this.vars.onRepeat &&
                    ((this._cycle = C),
                    (this._locked = !1),
                    this._callback("onRepeat"))),
                g !== this._time)
              )
                return;
              if (
                ($ &&
                  ((this._cycle = x),
                  (this._locked = !0),
                  (g = T ? m + 1e-4 : -1e-4),
                  this.render(g, !0, !1)),
                (this._locked = !1),
                this._paused && !w)
              )
                return;
              (this._time = P),
                (this._totalTime = S),
                (this._cycle = C),
                (this._rawPrevTime = k);
            }
            if ((this._time !== g && this._first) || i || u || d) {
              if (
                (this._initted || (this._initted = !0),
                this._active ||
                  (!this._paused &&
                    this._totalTime !== v &&
                    t > 0 &&
                    (this._active = !0)),
                0 === v &&
                  this.vars.onStart &&
                  ((0 === this._totalTime && this._totalDuration) ||
                    e ||
                    this._callback("onStart")),
                (p = this._time) >= g)
              )
                for (
                  n = this._first;
                  n &&
                  ((l = n._next), p === this._time && (!this._paused || w));

                )
                  (n._active ||
                    (n._startTime <= this._time && !n._paused && !n._gc)) &&
                    (d === n && this.pause(),
                    n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i)),
                    (n = l);
              else
                for (
                  n = this._last;
                  n &&
                  ((l = n._prev), p === this._time && (!this._paused || w));

                ) {
                  if (
                    n._active ||
                    (n._startTime <= g && !n._paused && !n._gc)
                  ) {
                    if (d === n) {
                      for (d = n._prev; d && d.endTime() > this._time; )
                        d.render(
                          d._reversed
                            ? d.totalDuration() -
                                (t - d._startTime) * d._timeScale
                            : (t - d._startTime) * d._timeScale,
                          e,
                          i
                        ),
                          (d = d._prev);
                      (d = null), this.pause();
                    }
                    n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i);
                  }
                  n = l;
                }
              this._onUpdate &&
                (e || (r.length && a(), this._callback("onUpdate"))),
                c &&
                  (this._locked ||
                    this._gc ||
                    ((y === this._startTime || _ !== this._timeScale) &&
                      (0 === this._time || f >= this.totalDuration()) &&
                      (s &&
                        (r.length && a(),
                        this._timeline.autoRemoveChildren &&
                          this._enabled(!1, !1),
                        (this._active = !1)),
                      !e && this.vars[c] && this._callback(c))));
            } else
              v !== this._totalTime &&
                this._onUpdate &&
                (e || this._callback("onUpdate"));
          }),
          (u.getActive = function (t, e, i) {
            null == t && (t = !0), null == e && (e = !0), null == i && (i = !1);
            var n,
              o,
              s = [],
              r = this.getChildren(t, e, i),
              a = 0,
              l = r.length;
            for (n = 0; l > n; n++) (o = r[n]).isActive() && (s[a++] = o);
            return s;
          }),
          (u.getLabelAfter = function (t) {
            t || (0 !== t && (t = this._time));
            var e,
              i = this.getLabelsArray(),
              n = i.length;
            for (e = 0; n > e; e++) if (i[e].time > t) return i[e].name;
            return null;
          }),
          (u.getLabelBefore = function (t) {
            null == t && (t = this._time);
            for (var e = this.getLabelsArray(), i = e.length; --i > -1; )
              if (e[i].time < t) return e[i].name;
            return null;
          }),
          (u.getLabelsArray = function () {
            var t,
              e = [],
              i = 0;
            for (t in this._labels) e[i++] = { time: this._labels[t], name: t };
            return (
              e.sort(function (t, e) {
                return t.time - e.time;
              }),
              e
            );
          }),
          (u.invalidate = function () {
            return (this._locked = !1), t.prototype.invalidate.call(this);
          }),
          (u.progress = function (t, e) {
            return arguments.length
              ? this.totalTime(
                  this.duration() *
                    (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) +
                    this._cycle * (this._duration + this._repeatDelay),
                  e
                )
              : this._time / this.duration() || 0;
          }),
          (u.totalProgress = function (t, e) {
            return arguments.length
              ? this.totalTime(this.totalDuration() * t, e)
              : this._totalTime / this.totalDuration() || 0;
          }),
          (u.totalDuration = function (e) {
            return arguments.length
              ? -1 !== this._repeat && e
                ? this.timeScale(this.totalDuration() / e)
                : this
              : (this._dirty &&
                  (t.prototype.totalDuration.call(this),
                  (this._totalDuration =
                    -1 === this._repeat
                      ? 999999999999
                      : this._duration * (this._repeat + 1) +
                        this._repeatDelay * this._repeat)),
                this._totalDuration);
          }),
          (u.time = function (t, e) {
            return arguments.length
              ? (this._dirty && this.totalDuration(),
                t > this._duration && (t = this._duration),
                this._yoyo && 0 != (1 & this._cycle)
                  ? (t =
                      this._duration -
                      t +
                      this._cycle * (this._duration + this._repeatDelay))
                  : 0 !== this._repeat &&
                    (t += this._cycle * (this._duration + this._repeatDelay)),
                this.totalTime(t, e))
              : this._time;
          }),
          (u.repeat = function (t) {
            return arguments.length
              ? ((this._repeat = t), this._uncache(!0))
              : this._repeat;
          }),
          (u.repeatDelay = function (t) {
            return arguments.length
              ? ((this._repeatDelay = t), this._uncache(!0))
              : this._repeatDelay;
          }),
          (u.yoyo = function (t) {
            return arguments.length ? ((this._yoyo = t), this) : this._yoyo;
          }),
          (u.currentLabel = function (t) {
            return arguments.length
              ? this.seek(t, !0)
              : this.getLabelBefore(this._time + 1e-8);
          }),
          n
        );
      },
      !0
    ),
    (t = 180 / Math.PI),
    (e = []),
    (i = []),
    (n = []),
    (o = {}),
    (s = _gsScope._gsDefine.globals),
    (r = function (t, e, i, n) {
      i === n && (i = n - (n - e) / 1e6),
        t === e && (e = t + (i - t) / 1e6),
        (this.a = t),
        (this.b = e),
        (this.c = i),
        (this.d = n),
        (this.da = n - t),
        (this.ca = i - t),
        (this.ba = e - t);
    }),
    (a = function (t, e, i, n) {
      var o = { a: t },
        s = {},
        r = {},
        a = { c: n },
        l = (t + e) / 2,
        c = (e + i) / 2,
        u = (i + n) / 2,
        h = (l + c) / 2,
        d = (c + u) / 2,
        p = (d - h) / 8;
      return (
        (o.b = l + (t - l) / 4),
        (s.b = h + p),
        (o.c = s.a = (o.b + s.b) / 2),
        (s.c = r.a = (h + d) / 2),
        (r.b = d - p),
        (a.b = u + (n - u) / 4),
        (r.c = a.a = (r.b + a.b) / 2),
        [o, s, r, a]
      );
    }),
    (l = function (t, o, s, r, l) {
      var c,
        u,
        h,
        d,
        p,
        f,
        m,
        g,
        v,
        y,
        _,
        b,
        w,
        x = t.length - 1,
        T = 0,
        $ = t[0].a;
      for (c = 0; x > c; c++)
        (u = (p = t[T]).a),
          (h = p.d),
          (d = t[T + 1].d),
          l
            ? ((_ = e[c]),
              (w = (((b = i[c]) + _) * o * 0.25) / (r ? 0.5 : n[c] || 0.5)),
              (g =
                h -
                ((f = h - (h - u) * (r ? 0.5 * o : 0 !== _ ? w / _ : 0)) +
                  ((((m = h + (d - h) * (r ? 0.5 * o : 0 !== b ? w / b : 0)) -
                    f) *
                    ((3 * _) / (_ + b) + 0.5)) /
                    4 || 0))))
            : (g =
                h -
                ((f = h - (h - u) * o * 0.5) + (m = h + (d - h) * o * 0.5)) /
                  2),
          (f += g),
          (m += g),
          (p.c = v = f),
          (p.b = 0 !== c ? $ : ($ = p.a + 0.6 * (p.c - p.a))),
          (p.da = h - u),
          (p.ca = v - u),
          (p.ba = $ - u),
          s
            ? ((y = a(u, $, v, h)),
              t.splice(T, 1, y[0], y[1], y[2], y[3]),
              (T += 4))
            : T++,
          ($ = m);
      ((p = t[T]).b = $),
        (p.c = $ + 0.4 * (p.d - $)),
        (p.da = p.d - p.a),
        (p.ca = p.c - p.a),
        (p.ba = $ - p.a),
        s &&
          ((y = a(p.a, $, p.c, p.d)), t.splice(T, 1, y[0], y[1], y[2], y[3]));
    }),
    (c = function (t, n, o, s) {
      var a,
        l,
        c,
        u,
        h,
        d,
        p = [];
      if (s)
        for (l = (t = [s].concat(t)).length; --l > -1; )
          "string" == typeof (d = t[l][n]) &&
            "=" === d.charAt(1) &&
            (t[l][n] = s[n] + Number(d.charAt(0) + d.substr(2)));
      if (0 > (a = t.length - 2))
        return (p[0] = new r(t[0][n], 0, 0, t[0][n])), p;
      for (l = 0; a > l; l++)
        (c = t[l][n]),
          (u = t[l + 1][n]),
          (p[l] = new r(c, 0, 0, u)),
          o &&
            ((h = t[l + 2][n]),
            (e[l] = (e[l] || 0) + (u - c) * (u - c)),
            (i[l] = (i[l] || 0) + (h - u) * (h - u)));
      return (p[l] = new r(t[l][n], 0, 0, t[l + 1][n])), p;
    }),
    (u = function (t, s, r, a, u, h) {
      var d,
        p,
        f,
        m,
        g,
        v,
        y,
        _,
        b = {},
        w = [],
        x = h || t[0];
      for (p in ((u =
        "string" == typeof u
          ? "," + u + ","
          : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,"),
      null == s && (s = 1),
      t[0]))
        w.push(p);
      if (t.length > 1) {
        for (_ = t[t.length - 1], y = !0, d = w.length; --d > -1; )
          if (((p = w[d]), Math.abs(x[p] - _[p]) > 0.05)) {
            y = !1;
            break;
          }
        y &&
          ((t = t.concat()),
          h && t.unshift(h),
          t.push(t[1]),
          (h = t[t.length - 3]));
      }
      for (e.length = i.length = n.length = 0, d = w.length; --d > -1; )
        (p = w[d]),
          (o[p] = -1 !== u.indexOf("," + p + ",")),
          (b[p] = c(t, p, o[p], h));
      for (d = e.length; --d > -1; )
        (e[d] = Math.sqrt(e[d])), (i[d] = Math.sqrt(i[d]));
      if (!a) {
        for (d = w.length; --d > -1; )
          if (o[p])
            for (v = (f = b[w[d]]).length - 1, m = 0; v > m; m++)
              (g = f[m + 1].da / i[m] + f[m].da / e[m] || 0),
                (n[m] = (n[m] || 0) + g * g);
        for (d = n.length; --d > -1; ) n[d] = Math.sqrt(n[d]);
      }
      for (d = w.length, m = r ? 4 : 1; --d > -1; )
        (f = b[(p = w[d])]),
          l(f, s, r, a, o[p]),
          y && (f.splice(0, m), f.splice(f.length - m, m));
      return b;
    }),
    (h = function (t, e, i) {
      var n,
        o,
        s,
        a,
        l,
        c,
        u,
        h,
        d,
        p,
        f,
        m = {},
        g = "cubic" === (e = e || "soft") ? 3 : 2,
        v = "soft" === e,
        y = [];
      if ((v && i && (t = [i].concat(t)), null == t || t.length < g + 1))
        throw "invalid Bezier data";
      for (d in t[0]) y.push(d);
      for (c = y.length; --c > -1; ) {
        for (m[(d = y[c])] = l = [], p = 0, h = t.length, u = 0; h > u; u++)
          (n =
            null == i
              ? t[u][d]
              : "string" == typeof (f = t[u][d]) && "=" === f.charAt(1)
              ? i[d] + Number(f.charAt(0) + f.substr(2))
              : Number(f)),
            v && u > 1 && h - 1 > u && (l[p++] = (n + l[p - 2]) / 2),
            (l[p++] = n);
        for (h = p - g + 1, p = 0, u = 0; h > u; u += g)
          (n = l[u]),
            (o = l[u + 1]),
            (s = l[u + 2]),
            (a = 2 === g ? 0 : l[u + 3]),
            (l[p++] = f =
              3 === g
                ? new r(n, o, s, a)
                : new r(n, (2 * o + n) / 3, (2 * o + s) / 3, s));
        l.length = p;
      }
      return m;
    }),
    (d = function (t, e, i) {
      for (
        var n, o, s, r, a, l, c, u, h, d, p, f = 1 / i, m = t.length;
        --m > -1;

      )
        for (
          s = (d = t[m]).a,
            r = d.d - s,
            a = d.c - s,
            l = d.b - s,
            n = o = 0,
            u = 1;
          i >= u;
          u++
        )
          (n =
            o -
            (o =
              ((c = f * u) * c * r + 3 * (h = 1 - c) * (c * a + h * l)) * c)),
            (e[(p = m * i + u - 1)] = (e[p] || 0) + n * n);
    }),
    (p = function (t, e) {
      var i,
        n,
        o,
        s,
        r = [],
        a = [],
        l = 0,
        c = 0,
        u = (e = e >> 0 || 6) - 1,
        h = [],
        p = [];
      for (i in t) d(t[i], r, e);
      for (o = r.length, n = 0; o > n; n++)
        (l += Math.sqrt(r[n])),
          (p[(s = n % e)] = l),
          s === u &&
            ((c += l),
            (h[(s = (n / e) >> 0)] = p),
            (a[s] = c),
            (l = 0),
            (p = []));
      return { length: c, lengths: a, segments: h };
    }),
    (f = _gsScope._gsDefine.plugin({
      propName: "bezier",
      priority: -1,
      version: "1.3.8",
      API: 2,
      global: !0,
      init: function (t, e, i) {
        (this._target = t),
          e instanceof Array && (e = { values: e }),
          (this._func = {}),
          (this._mod = {}),
          (this._props = []),
          (this._timeRes =
            null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10));
        var n,
          o,
          s,
          r,
          a,
          l = e.values || [],
          c = {},
          d = l[0],
          f = e.autoRotate || i.vars.orientToBezier;
        for (n in ((this._autoRotate = f
          ? f instanceof Array
            ? f
            : [["x", "y", "rotation", !0 === f ? 0 : Number(f) || 0]]
          : null),
        d))
          this._props.push(n);
        for (s = this._props.length; --s > -1; )
          (n = this._props[s]),
            this._overwriteProps.push(n),
            (o = this._func[n] = "function" == typeof t[n]),
            (c[n] = o
              ? t[
                  n.indexOf("set") ||
                  "function" != typeof t["get" + n.substr(3)]
                    ? n
                    : "get" + n.substr(3)
                ]()
              : parseFloat(t[n])),
            a || (c[n] !== l[0][n] && (a = c));
        if (
          ((this._beziers =
            "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type
              ? u(
                  l,
                  isNaN(e.curviness) ? 1 : e.curviness,
                  !1,
                  "thruBasic" === e.type,
                  e.correlate,
                  a
                )
              : h(l, e.type, c)),
          (this._segCount = this._beziers[n].length),
          this._timeRes)
        ) {
          var m = p(this._beziers, this._timeRes);
          (this._length = m.length),
            (this._lengths = m.lengths),
            (this._segments = m.segments),
            (this._l1 = this._li = this._s1 = this._si = 0),
            (this._l2 = this._lengths[0]),
            (this._curSeg = this._segments[0]),
            (this._s2 = this._curSeg[0]),
            (this._prec = 1 / this._curSeg.length);
        }
        if ((f = this._autoRotate))
          for (
            this._initialRotations = [],
              f[0] instanceof Array || (this._autoRotate = f = [f]),
              s = f.length;
            --s > -1;

          ) {
            for (r = 0; 3 > r; r++)
              (n = f[s][r]),
                (this._func[n] =
                  "function" == typeof t[n] &&
                  t[
                    n.indexOf("set") ||
                    "function" != typeof t["get" + n.substr(3)]
                      ? n
                      : "get" + n.substr(3)
                  ]);
            (n = f[s][2]),
              (this._initialRotations[s] =
                (this._func[n]
                  ? this._func[n].call(this._target)
                  : this._target[n]) || 0),
              this._overwriteProps.push(n);
          }
        return (this._startRatio = i.vars.runBackwards ? 1 : 0), !0;
      },
      set: function (e) {
        var i,
          n,
          o,
          s,
          r,
          a,
          l,
          c,
          u,
          h,
          d = this._segCount,
          p = this._func,
          f = this._target,
          m = e !== this._startRatio;
        if (this._timeRes) {
          if (
            ((u = this._lengths),
            (h = this._curSeg),
            (e *= this._length),
            (o = this._li),
            e > this._l2 && d - 1 > o)
          ) {
            for (c = d - 1; c > o && (this._l2 = u[++o]) <= e; );
            (this._l1 = u[o - 1]),
              (this._li = o),
              (this._curSeg = h = this._segments[o]),
              (this._s2 = h[(this._s1 = this._si = 0)]);
          } else if (e < this._l1 && o > 0) {
            for (; o > 0 && (this._l1 = u[--o]) >= e; );
            0 === o && e < this._l1 ? (this._l1 = 0) : o++,
              (this._l2 = u[o]),
              (this._li = o),
              (this._curSeg = h = this._segments[o]),
              (this._s1 = h[(this._si = h.length - 1) - 1] || 0),
              (this._s2 = h[this._si]);
          }
          if (
            ((i = o),
            (e -= this._l1),
            (o = this._si),
            e > this._s2 && o < h.length - 1)
          ) {
            for (c = h.length - 1; c > o && (this._s2 = h[++o]) <= e; );
            (this._s1 = h[o - 1]), (this._si = o);
          } else if (e < this._s1 && o > 0) {
            for (; o > 0 && (this._s1 = h[--o]) >= e; );
            0 === o && e < this._s1 ? (this._s1 = 0) : o++,
              (this._s2 = h[o]),
              (this._si = o);
          }
          a = (o + (e - this._s1) / (this._s2 - this._s1)) * this._prec || 0;
        } else
          a =
            (e - (i = 0 > e ? 0 : e >= 1 ? d - 1 : (d * e) >> 0) * (1 / d)) * d;
        for (n = 1 - a, o = this._props.length; --o > -1; )
          (s = this._props[o]),
            (l =
              (a * a * (r = this._beziers[s][i]).da +
                3 * n * (a * r.ca + n * r.ba)) *
                a +
              r.a),
            this._mod[s] && (l = this._mod[s](l, f)),
            p[s] ? f[s](l) : (f[s] = l);
        if (this._autoRotate) {
          var g,
            v,
            y,
            _,
            b,
            w,
            x,
            T = this._autoRotate;
          for (o = T.length; --o > -1; )
            (s = T[o][2]),
              (w = T[o][3] || 0),
              (x = !0 === T[o][4] ? 1 : t),
              (r = this._beziers[T[o][0]]),
              (g = this._beziers[T[o][1]]),
              r &&
                g &&
                ((r = r[i]),
                (g = g[i]),
                (v = r.a + (r.b - r.a) * a),
                (v += ((_ = r.b + (r.c - r.b) * a) - v) * a),
                (_ += (r.c + (r.d - r.c) * a - _) * a),
                (y = g.a + (g.b - g.a) * a),
                (y += ((b = g.b + (g.c - g.b) * a) - y) * a),
                (b += (g.c + (g.d - g.c) * a - b) * a),
                (l = m
                  ? Math.atan2(b - y, _ - v) * x + w
                  : this._initialRotations[o]),
                this._mod[s] && (l = this._mod[s](l, f)),
                p[s] ? f[s](l) : (f[s] = l));
        }
      },
    })),
    (m = f.prototype),
    (f.bezierThrough = u),
    (f.cubicToQuadratic = a),
    (f._autoCSS = !0),
    (f.quadraticToCubic = function (t, e, i) {
      return new r(t, (2 * e + t) / 3, (2 * e + i) / 3, i);
    }),
    (f._cssRegister = function () {
      var t = s.CSSPlugin;
      if (t) {
        var e = t._internals,
          i = e._parseToProxy,
          n = e._setPluginRatio,
          o = e.CSSPropTween;
        e._registerComplexSpecialProp("bezier", {
          parser: function (t, e, s, r, a, l) {
            e instanceof Array && (e = { values: e }), (l = new f());
            var c,
              u,
              h,
              d = e.values,
              p = d.length - 1,
              m = [],
              g = {};
            if (0 > p) return a;
            for (c = 0; p >= c; c++)
              (h = i(t, d[c], r, a, l, p !== c)), (m[c] = h.end);
            for (u in e) g[u] = e[u];
            return (
              (g.values = m),
              ((a = new o(t, "bezier", 0, 0, h.pt, 2)).data = h),
              (a.plugin = l),
              (a.setRatio = n),
              0 === g.autoRotate && (g.autoRotate = !0),
              !g.autoRotate ||
                g.autoRotate instanceof Array ||
                ((c = !0 === g.autoRotate ? 0 : Number(g.autoRotate)),
                (g.autoRotate =
                  null != h.end.left
                    ? [["left", "top", "rotation", c, !1]]
                    : null != h.end.x && [["x", "y", "rotation", c, !1]])),
              g.autoRotate &&
                (r._transform || r._enableTransforms(!1),
                (h.autoRotate = r._target._gsTransform),
                (h.proxy.rotation = h.autoRotate.rotation || 0),
                r._overwriteProps.push("rotation")),
              l._onInitTween(h.proxy, g, r._tween),
              a
            );
          },
        });
      }
    }),
    (m._mod = function (t) {
      for (var e, i = this._overwriteProps, n = i.length; --n > -1; )
        (e = t[i[n]]) && "function" == typeof e && (this._mod[i[n]] = e);
    }),
    (m._kill = function (t) {
      var e,
        i,
        n = this._props;
      for (e in this._beziers)
        if (e in t)
          for (
            delete this._beziers[e], delete this._func[e], i = n.length;
            --i > -1;

          )
            n[i] === e && n.splice(i, 1);
      if ((n = this._autoRotate))
        for (i = n.length; --i > -1; ) t[n[i][2]] && n.splice(i, 1);
      return this._super._kill.call(this, t);
    }),
    _gsScope._gsDefine(
      "plugins.CSSPlugin",
      ["plugins.TweenPlugin", "TweenLite"],
      function (t, e) {
        var i,
          n,
          o,
          s,
          r = function () {
            t.call(this, "css"),
              (this._overwriteProps.length = 0),
              (this.setRatio = r.prototype.setRatio);
          },
          a = _gsScope._gsDefine.globals,
          l = {},
          c = (r.prototype = new t("css"));
        (c.constructor = r),
          (r.version = "1.20.0"),
          (r.API = 2),
          (r.defaultTransformPerspective = 0),
          (r.defaultSkewType = "compensated"),
          (r.defaultSmoothOrigin = !0),
          (c = "px"),
          (r.suffixMap = {
            top: c,
            right: c,
            bottom: c,
            left: c,
            width: c,
            height: c,
            fontSize: c,
            padding: c,
            margin: c,
            perspective: c,
            lineHeight: "",
          });
        var u,
          h,
          d,
          p,
          f,
          m,
          g,
          v,
          y = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
          _ = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
          b = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
          w = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
          x = /(?:\d|\-|\+|=|#|\.)*/g,
          T = /opacity *= *([^)]*)/i,
          $ = /opacity:([^;]*)/i,
          S = /alpha\(opacity *=.+?\)/i,
          C = /^(rgb|hsl)/,
          k = /([A-Z])/g,
          P = /-([a-z])/gi,
          A = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
          E = function (t, e) {
            return e.toUpperCase();
          },
          O = /(?:Left|Right|Width)/i,
          F = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
          z = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
          M = /,(?=[^\)]*(?:\(|$))/gi,
          L = /[\s,\(]/i,
          D = Math.PI / 180,
          R = 180 / Math.PI,
          I = {},
          j = { style: {} },
          H = _gsScope.document || {
            createElement: function () {
              return j;
            },
          },
          N = function (t, e) {
            return H.createElementNS
              ? H.createElementNS(e || "http://www.w3.org/1999/xhtml", t)
              : H.createElement(t);
          },
          B = N("div"),
          W = N("img"),
          q = (r._internals = { _specialProps: l }),
          X = (_gsScope.navigator || {}).userAgent || "",
          V = (function () {
            var t = X.indexOf("Android"),
              e = N("a");
            return (
              (d =
                -1 !== X.indexOf("Safari") &&
                -1 === X.indexOf("Chrome") &&
                (-1 === t || parseFloat(X.substr(t + 8, 2)) > 3)),
              (f = d && parseFloat(X.substr(X.indexOf("Version/") + 8, 2)) < 6),
              (p = -1 !== X.indexOf("Firefox")),
              (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(X) ||
                /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(X)) &&
                (m = parseFloat(RegExp.$1)),
              !!e &&
                ((e.style.cssText = "top:1px;opacity:.55;"),
                /^0.55/.test(e.style.opacity))
            );
          })(),
          Y = function (t) {
            return T.test(
              "string" == typeof t
                ? t
                : (t.currentStyle ? t.currentStyle.filter : t.style.filter) ||
                    ""
            )
              ? parseFloat(RegExp.$1) / 100
              : 1;
          },
          U = function (t) {
            _gsScope.console && console.log(t);
          },
          Q = "",
          G = "",
          Z = function (t, e) {
            var i,
              n,
              o = (e = e || B).style;
            if (void 0 !== o[t]) return t;
            for (
              t = t.charAt(0).toUpperCase() + t.substr(1),
                i = ["O", "Moz", "ms", "Ms", "Webkit"],
                n = 5;
              --n > -1 && void 0 === o[i[n] + t];

            );
            return n >= 0
              ? ((Q = "-" + (G = 3 === n ? "ms" : i[n]).toLowerCase() + "-"),
                G + t)
              : null;
          },
          K = H.defaultView ? H.defaultView.getComputedStyle : function () {},
          J = (r.getStyle = function (t, e, i, n, o) {
            var s;
            return V || "opacity" !== e
              ? (!n && t.style[e]
                  ? (s = t.style[e])
                  : (i = i || K(t))
                  ? (s =
                      i[e] ||
                      i.getPropertyValue(e) ||
                      i.getPropertyValue(e.replace(k, "-$1").toLowerCase()))
                  : t.currentStyle && (s = t.currentStyle[e]),
                null == o ||
                (s && "none" !== s && "auto" !== s && "auto auto" !== s)
                  ? s
                  : o)
              : Y(t);
          }),
          tt = (q.convertToPixels = function (t, i, n, o, s) {
            if ("px" === o || (!o && "lineHeight" !== i)) return n;
            if ("auto" === o || !n) return 0;
            var a,
              l,
              c,
              u = O.test(i),
              h = t,
              d = B.style,
              p = 0 > n,
              f = 1 === n;
            if ((p && (n = -n), f && (n *= 100), "lineHeight" !== i || o))
              if ("%" === o && -1 !== i.indexOf("border"))
                a = (n / 100) * (u ? t.clientWidth : t.clientHeight);
              else {
                if (
                  ((d.cssText =
                    "border:0 solid red;position:" +
                    J(t, "position") +
                    ";line-height:0;"),
                  "%" !== o &&
                    h.appendChild &&
                    "v" !== o.charAt(0) &&
                    "rem" !== o)
                )
                  d[u ? "borderLeftWidth" : "borderTopWidth"] = n + o;
                else {
                  if (
                    ((h = t.parentNode || H.body),
                    -1 !== J(h, "display").indexOf("flex") &&
                      (d.position = "absolute"),
                    (l = h._gsCache),
                    (c = e.ticker.frame),
                    l && u && l.time === c)
                  )
                    return (l.width * n) / 100;
                  d[u ? "width" : "height"] = n + o;
                }
                h.appendChild(B),
                  (a = parseFloat(B[u ? "offsetWidth" : "offsetHeight"])),
                  h.removeChild(B),
                  u &&
                    "%" === o &&
                    !1 !== r.cacheWidths &&
                    (((l = h._gsCache = h._gsCache || {}).time = c),
                    (l.width = (a / n) * 100)),
                  0 !== a || s || (a = tt(t, i, n, o, !0));
              }
            else
              (l = K(t).lineHeight),
                (t.style.lineHeight = n),
                (a = parseFloat(K(t).lineHeight)),
                (t.style.lineHeight = l);
            return f && (a /= 100), p ? -a : a;
          }),
          et = (q.calculateOffset = function (t, e, i) {
            if ("absolute" !== J(t, "position", i)) return 0;
            var n = "left" === e ? "Left" : "Top",
              o = J(t, "margin" + n, i);
            return (
              t["offset" + n] - (tt(t, e, parseFloat(o), o.replace(x, "")) || 0)
            );
          }),
          it = function (t, e) {
            var i,
              n,
              o,
              s = {};
            if ((e = e || K(t, null)))
              if ((i = e.length))
                for (; --i > -1; )
                  (-1 === (o = e[i]).indexOf("-transform") || At === o) &&
                    (s[o.replace(P, E)] = e.getPropertyValue(o));
              else
                for (i in e)
                  (-1 === i.indexOf("Transform") || Pt === i) && (s[i] = e[i]);
            else if ((e = t.currentStyle || t.style))
              for (i in e)
                "string" == typeof i &&
                  void 0 === s[i] &&
                  (s[i.replace(P, E)] = e[i]);
            return (
              V || (s.opacity = Y(t)),
              (n = Bt(t, e, !1)),
              (s.rotation = n.rotation),
              (s.skewX = n.skewX),
              (s.scaleX = n.scaleX),
              (s.scaleY = n.scaleY),
              (s.x = n.x),
              (s.y = n.y),
              Ot &&
                ((s.z = n.z),
                (s.rotationX = n.rotationX),
                (s.rotationY = n.rotationY),
                (s.scaleZ = n.scaleZ)),
              s.filters && delete s.filters,
              s
            );
          },
          nt = function (t, e, i, n, o) {
            var s,
              r,
              a,
              l = {},
              c = t.style;
            for (r in i)
              "cssText" !== r &&
                "length" !== r &&
                isNaN(r) &&
                (e[r] !== (s = i[r]) || (o && o[r])) &&
                -1 === r.indexOf("Origin") &&
                ("number" == typeof s || "string" == typeof s) &&
                ((l[r] =
                  "auto" !== s || ("left" !== r && "top" !== r)
                    ? ("" !== s && "auto" !== s && "none" !== s) ||
                      "string" != typeof e[r] ||
                      "" === e[r].replace(w, "")
                      ? s
                      : 0
                    : et(t, r)),
                void 0 !== c[r] && (a = new yt(c, r, c[r], a)));
            if (n) for (r in n) "className" !== r && (l[r] = n[r]);
            return { difs: l, firstMPT: a };
          },
          ot = { width: ["Left", "Right"], height: ["Top", "Bottom"] },
          st = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
          rt = function (t, e, i) {
            if ("svg" === (t.nodeName + "").toLowerCase())
              return (i || K(t))[e] || 0;
            if (t.getCTM && jt(t)) return t.getBBox()[e] || 0;
            var n = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
              o = ot[e],
              s = o.length;
            for (i = i || K(t, null); --s > -1; )
              (n -= parseFloat(J(t, "padding" + o[s], i, !0)) || 0),
                (n -= parseFloat(J(t, "border" + o[s] + "Width", i, !0)) || 0);
            return n;
          },
          at = function (t, e) {
            if ("contain" === t || "auto" === t || "auto auto" === t)
              return t + " ";
            (null == t || "" === t) && (t = "0 0");
            var i,
              n = t.split(" "),
              o =
                -1 !== t.indexOf("left")
                  ? "0%"
                  : -1 !== t.indexOf("right")
                  ? "100%"
                  : n[0],
              s =
                -1 !== t.indexOf("top")
                  ? "0%"
                  : -1 !== t.indexOf("bottom")
                  ? "100%"
                  : n[1];
            if (n.length > 3 && !e) {
              for (
                n = t.split(", ").join(",").split(","), t = [], i = 0;
                i < n.length;
                i++
              )
                t.push(at(n[i]));
              return t.join(",");
            }
            return (
              null == s
                ? (s = "center" === o ? "50%" : "0")
                : "center" === s && (s = "50%"),
              ("center" === o ||
                (isNaN(parseFloat(o)) && -1 === (o + "").indexOf("="))) &&
                (o = "50%"),
              (t = o + " " + s + (n.length > 2 ? " " + n[2] : "")),
              e &&
                ((e.oxp = -1 !== o.indexOf("%")),
                (e.oyp = -1 !== s.indexOf("%")),
                (e.oxr = "=" === o.charAt(1)),
                (e.oyr = "=" === s.charAt(1)),
                (e.ox = parseFloat(o.replace(w, ""))),
                (e.oy = parseFloat(s.replace(w, ""))),
                (e.v = t)),
              e || t
            );
          },
          lt = function (t, e) {
            return (
              "function" == typeof t && (t = t(v, g)),
              "string" == typeof t && "=" === t.charAt(1)
                ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2))
                : parseFloat(t) - parseFloat(e) || 0
            );
          },
          ct = function (t, e) {
            return (
              "function" == typeof t && (t = t(v, g)),
              null == t
                ? e
                : "string" == typeof t && "=" === t.charAt(1)
                ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e
                : parseFloat(t) || 0
            );
          },
          ut = function (t, e, i, n) {
            var o, s, r, a, l;
            return (
              "function" == typeof t && (t = t(v, g)),
              null == t
                ? (a = e)
                : "number" == typeof t
                ? (a = t)
                : ((o = 360),
                  (s = t.split("_")),
                  (r =
                    ((l = "=" === t.charAt(1))
                      ? parseInt(t.charAt(0) + "1", 10) *
                        parseFloat(s[0].substr(2))
                      : parseFloat(s[0])) *
                      (-1 === t.indexOf("rad") ? 1 : R) -
                    (l ? 0 : e)),
                  s.length &&
                    (n && (n[i] = e + r),
                    -1 !== t.indexOf("short") &&
                      (r %= o) !== r % 180 &&
                      (r = 0 > r ? r + o : r - o),
                    -1 !== t.indexOf("_cw") && 0 > r
                      ? (r = ((r + 9999999999 * o) % o) - ((r / o) | 0) * o)
                      : -1 !== t.indexOf("ccw") &&
                        r > 0 &&
                        (r = ((r - 9999999999 * o) % o) - ((r / o) | 0) * o)),
                  (a = e + r)),
              1e-6 > a && a > -1e-6 && (a = 0),
              a
            );
          },
          ht = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0],
          },
          dt = function (t, e, i) {
            return (
              (255 *
                (1 > 6 * (t = 0 > t ? t + 1 : t > 1 ? t - 1 : t)
                  ? e + (i - e) * t * 6
                  : 0.5 > t
                  ? i
                  : 2 > 3 * t
                  ? e + (i - e) * (2 / 3 - t) * 6
                  : e) +
                0.5) |
              0
            );
          },
          pt = (r.parseColor = function (t, e) {
            var i, n, o, s, r, a, l, c, u, h, d;
            if (t)
              if ("number" == typeof t) i = [t >> 16, (t >> 8) & 255, 255 & t];
              else {
                if (
                  ("," === t.charAt(t.length - 1) &&
                    (t = t.substr(0, t.length - 1)),
                  ht[t])
                )
                  i = ht[t];
                else if ("#" === t.charAt(0))
                  4 === t.length &&
                    ((n = t.charAt(1)),
                    (o = t.charAt(2)),
                    (s = t.charAt(3)),
                    (t = "#" + n + n + o + o + s + s)),
                    (i = [
                      (t = parseInt(t.substr(1), 16)) >> 16,
                      (t >> 8) & 255,
                      255 & t,
                    ]);
                else if ("hsl" === t.substr(0, 3))
                  if (((i = d = t.match(y)), e)) {
                    if (-1 !== t.indexOf("=")) return t.match(_);
                  } else
                    (r = (Number(i[0]) % 360) / 360),
                      (a = Number(i[1]) / 100),
                      (n =
                        2 * (l = Number(i[2]) / 100) -
                        (o = 0.5 >= l ? l * (a + 1) : l + a - l * a)),
                      i.length > 3 && (i[3] = Number(t[3])),
                      (i[0] = dt(r + 1 / 3, n, o)),
                      (i[1] = dt(r, n, o)),
                      (i[2] = dt(r - 1 / 3, n, o));
                else i = t.match(y) || ht.transparent;
                (i[0] = Number(i[0])),
                  (i[1] = Number(i[1])),
                  (i[2] = Number(i[2])),
                  i.length > 3 && (i[3] = Number(i[3]));
              }
            else i = ht.black;
            return (
              e &&
                !d &&
                ((n = i[0] / 255),
                (o = i[1] / 255),
                (s = i[2] / 255),
                (l = ((c = Math.max(n, o, s)) + (u = Math.min(n, o, s))) / 2),
                c === u
                  ? (r = a = 0)
                  : ((h = c - u),
                    (a = l > 0.5 ? h / (2 - c - u) : h / (c + u)),
                    (r =
                      c === n
                        ? (o - s) / h + (s > o ? 6 : 0)
                        : c === o
                        ? (s - n) / h + 2
                        : (n - o) / h + 4),
                    (r *= 60)),
                (i[0] = (r + 0.5) | 0),
                (i[1] = (100 * a + 0.5) | 0),
                (i[2] = (100 * l + 0.5) | 0)),
              i
            );
          }),
          ft = function (t, e) {
            var i,
              n,
              o,
              s = t.match(mt) || [],
              r = 0,
              a = "";
            if (!s.length) return t;
            for (i = 0; i < s.length; i++)
              (n = s[i]),
                (r += (o = t.substr(r, t.indexOf(n, r) - r)).length + n.length),
                3 === (n = pt(n, e)).length && n.push(1),
                (a +=
                  o +
                  (e
                    ? "hsla(" + n[0] + "," + n[1] + "%," + n[2] + "%," + n[3]
                    : "rgba(" + n.join(",")) +
                  ")");
            return a + t.substr(r);
          },
          mt =
            "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
        for (c in ht) mt += "|" + c + "\\b";
        (mt = new RegExp(mt + ")", "gi")),
          (r.colorStringFilter = function (t) {
            var e,
              i = t[0] + " " + t[1];
            mt.test(i) &&
              ((e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla(")),
              (t[0] = ft(t[0], e)),
              (t[1] = ft(t[1], e))),
              (mt.lastIndex = 0);
          }),
          e.defaultStringFilter ||
            (e.defaultStringFilter = r.colorStringFilter);
        var gt = function (t, e, i, n) {
            if (null == t)
              return function (t) {
                return t;
              };
            var o,
              s = e ? (t.match(mt) || [""])[0] : "",
              r = t.split(s).join("").match(b) || [],
              a = t.substr(0, t.indexOf(r[0])),
              l = ")" === t.charAt(t.length - 1) ? ")" : "",
              c = -1 !== t.indexOf(" ") ? " " : ",",
              u = r.length,
              h = u > 0 ? r[0].replace(y, "") : "";
            return u
              ? (o = e
                  ? function (t) {
                      var e, d, p, f;
                      if ("number" == typeof t) t += h;
                      else if (n && M.test(t)) {
                        for (
                          f = t.replace(M, "|").split("|"), p = 0;
                          p < f.length;
                          p++
                        )
                          f[p] = o(f[p]);
                        return f.join(",");
                      }
                      if (
                        ((e = (t.match(mt) || [s])[0]),
                        (p = (d = t.split(e).join("").match(b) || []).length),
                        u > p--)
                      )
                        for (; ++p < u; )
                          d[p] = i ? d[((p - 1) / 2) | 0] : r[p];
                      return (
                        a +
                        d.join(c) +
                        c +
                        e +
                        l +
                        (-1 !== t.indexOf("inset") ? " inset" : "")
                      );
                    }
                  : function (t) {
                      var e, s, d;
                      if ("number" == typeof t) t += h;
                      else if (n && M.test(t)) {
                        for (
                          s = t.replace(M, "|").split("|"), d = 0;
                          d < s.length;
                          d++
                        )
                          s[d] = o(s[d]);
                        return s.join(",");
                      }
                      if (((d = (e = t.match(b) || []).length), u > d--))
                        for (; ++d < u; )
                          e[d] = i ? e[((d - 1) / 2) | 0] : r[d];
                      return a + e.join(c) + l;
                    })
              : function (t) {
                  return t;
                };
          },
          vt = function (t) {
            return (
              (t = t.split(",")),
              function (e, i, n, o, s, r, a) {
                var l,
                  c = (i + "").split(" ");
                for (a = {}, l = 0; 4 > l; l++)
                  a[t[l]] = c[l] = c[l] || c[((l - 1) / 2) >> 0];
                return o.parse(e, a, s, r);
              }
            );
          },
          yt =
            ((q._setPluginRatio = function (t) {
              this.plugin.setRatio(t);
              for (
                var e, i, n, o, s, r = this.data, a = r.proxy, l = r.firstMPT;
                l;

              )
                (e = a[l.v]),
                  l.r ? (e = Math.round(e)) : 1e-6 > e && e > -1e-6 && (e = 0),
                  (l.t[l.p] = e),
                  (l = l._next);
              if (
                (r.autoRotate &&
                  (r.autoRotate.rotation = r.mod
                    ? r.mod(a.rotation, this.t)
                    : a.rotation),
                1 === t || 0 === t)
              )
                for (l = r.firstMPT, s = 1 === t ? "e" : "b"; l; ) {
                  if ((i = l.t).type) {
                    if (1 === i.type) {
                      for (o = i.xs0 + i.s + i.xs1, n = 1; n < i.l; n++)
                        o += i["xn" + n] + i["xs" + (n + 1)];
                      i[s] = o;
                    }
                  } else i[s] = i.s + i.xs0;
                  l = l._next;
                }
            }),
            function (t, e, i, n, o) {
              (this.t = t),
                (this.p = e),
                (this.v = i),
                (this.r = o),
                n && ((n._prev = this), (this._next = n));
            }),
          _t =
            ((q._parseToProxy = function (t, e, i, n, o, s) {
              var r,
                a,
                l,
                c,
                u,
                h = n,
                d = {},
                p = {},
                f = i._transform,
                m = I;
              for (
                i._transform = null,
                  I = e,
                  n = u = i.parse(t, e, n, o),
                  I = m,
                  s &&
                    ((i._transform = f),
                    h && ((h._prev = null), h._prev && (h._prev._next = null)));
                n && n !== h;

              ) {
                if (
                  n.type <= 1 &&
                  ((p[(a = n.p)] = n.s + n.c),
                  (d[a] = n.s),
                  s || ((c = new yt(n, "s", a, c, n.r)), (n.c = 0)),
                  1 === n.type)
                )
                  for (r = n.l; --r > 0; )
                    (l = "xn" + r),
                      (p[(a = n.p + "_" + l)] = n.data[l]),
                      (d[a] = n[l]),
                      s || (c = new yt(n, l, a, c, n.rxp[l]));
                n = n._next;
              }
              return { proxy: d, end: p, firstMPT: c, pt: u };
            }),
            (q.CSSPropTween = function (t, e, n, o, r, a, l, c, u, h, d) {
              (this.t = t),
                (this.p = e),
                (this.s = n),
                (this.c = o),
                (this.n = l || e),
                t instanceof _t || s.push(this.n),
                (this.r = c),
                (this.type = a || 0),
                u && ((this.pr = u), (i = !0)),
                (this.b = void 0 === h ? n : h),
                (this.e = void 0 === d ? n + o : d),
                r && ((this._next = r), (r._prev = this));
            })),
          bt = function (t, e, i, n, o, s) {
            var r = new _t(t, e, i, n - i, o, -1, s);
            return (r.b = i), (r.e = r.xs0 = n), r;
          },
          wt = (r.parseComplex = function (t, e, i, n, o, s, a, l, c, h) {
            (i = i || s || ""),
              "function" == typeof n && (n = n(v, g)),
              (a = new _t(t, e, 0, 0, a, h ? 2 : 1, null, !1, l, i, n)),
              (n += ""),
              o &&
                mt.test(n + i) &&
                ((n = [i, n]), r.colorStringFilter(n), (i = n[0]), (n = n[1]));
            var d,
              p,
              f,
              m,
              b,
              w,
              x,
              T,
              $,
              S,
              C,
              k,
              P,
              A = i.split(", ").join(",").split(" "),
              E = n.split(", ").join(",").split(" "),
              O = A.length,
              F = !1 !== u;
            for (
              (-1 !== n.indexOf(",") || -1 !== i.indexOf(",")) &&
                ((A = A.join(" ").replace(M, ", ").split(" ")),
                (E = E.join(" ").replace(M, ", ").split(" ")),
                (O = A.length)),
                O !== E.length && (O = (A = (s || "").split(" ")).length),
                a.plugin = c,
                a.setRatio = h,
                mt.lastIndex = 0,
                d = 0;
              O > d;
              d++
            )
              if (((m = A[d]), (b = E[d]), (T = parseFloat(m)) || 0 === T))
                a.appendXtra(
                  "",
                  T,
                  lt(b, T),
                  b.replace(_, ""),
                  F && -1 !== b.indexOf("px"),
                  !0
                );
              else if (o && mt.test(m))
                (k = ")" + ((k = b.indexOf(")") + 1) ? b.substr(k) : "")),
                  (P = -1 !== b.indexOf("hsl") && V),
                  (S = b),
                  (m = pt(m, P)),
                  (b = pt(b, P)),
                  ($ = m.length + b.length > 6) && !V && 0 === b[3]
                    ? ((a["xs" + a.l] += a.l ? " transparent" : "transparent"),
                      (a.e = a.e.split(E[d]).join("transparent")))
                    : (V || ($ = !1),
                      P
                        ? a
                            .appendXtra(
                              S.substr(0, S.indexOf("hsl")) +
                                ($ ? "hsla(" : "hsl("),
                              m[0],
                              lt(b[0], m[0]),
                              ",",
                              !1,
                              !0
                            )
                            .appendXtra("", m[1], lt(b[1], m[1]), "%,", !1)
                            .appendXtra(
                              "",
                              m[2],
                              lt(b[2], m[2]),
                              $ ? "%," : "%" + k,
                              !1
                            )
                        : a
                            .appendXtra(
                              S.substr(0, S.indexOf("rgb")) +
                                ($ ? "rgba(" : "rgb("),
                              m[0],
                              b[0] - m[0],
                              ",",
                              !0,
                              !0
                            )
                            .appendXtra("", m[1], b[1] - m[1], ",", !0)
                            .appendXtra("", m[2], b[2] - m[2], $ ? "," : k, !0),
                      $ &&
                        ((m = m.length < 4 ? 1 : m[3]),
                        a.appendXtra(
                          "",
                          m,
                          (b.length < 4 ? 1 : b[3]) - m,
                          k,
                          !1
                        ))),
                  (mt.lastIndex = 0);
              else if ((w = m.match(y))) {
                if (!(x = b.match(_)) || x.length !== w.length) return a;
                for (f = 0, p = 0; p < w.length; p++)
                  (C = w[p]),
                    (S = m.indexOf(C, f)),
                    a.appendXtra(
                      m.substr(f, S - f),
                      Number(C),
                      lt(x[p], C),
                      "",
                      F && "px" === m.substr(S + C.length, 2),
                      0 === p
                    ),
                    (f = S + C.length);
                a["xs" + a.l] += m.substr(f);
              } else a["xs" + a.l] += a.l || a["xs" + a.l] ? " " + b : b;
            if (-1 !== n.indexOf("=") && a.data) {
              for (k = a.xs0 + a.data.s, d = 1; d < a.l; d++)
                k += a["xs" + d] + a.data["xn" + d];
              a.e = k + a["xs" + d];
            }
            return a.l || ((a.type = -1), (a.xs0 = a.e)), a.xfirst || a;
          }),
          xt = 9;
        for ((c = _t.prototype).l = c.pr = 0; --xt > 0; )
          (c["xn" + xt] = 0), (c["xs" + xt] = "");
        (c.xs0 = ""),
          (c._next =
            c._prev =
            c.xfirst =
            c.data =
            c.plugin =
            c.setRatio =
            c.rxp =
              null),
          (c.appendXtra = function (t, e, i, n, o, s) {
            var r = this,
              a = r.l;
            return (
              (r["xs" + a] += s && (a || r["xs" + a]) ? " " + t : t || ""),
              i || 0 === a || r.plugin
                ? (r.l++,
                  (r.type = r.setRatio ? 2 : 1),
                  (r["xs" + r.l] = n || ""),
                  a > 0
                    ? ((r.data["xn" + a] = e + i),
                      (r.rxp["xn" + a] = o),
                      (r["xn" + a] = e),
                      r.plugin ||
                        ((r.xfirst = new _t(
                          r,
                          "xn" + a,
                          e,
                          i,
                          r.xfirst || r,
                          0,
                          r.n,
                          o,
                          r.pr
                        )),
                        (r.xfirst.xs0 = 0)),
                      r)
                    : ((r.data = { s: e + i }),
                      (r.rxp = {}),
                      (r.s = e),
                      (r.c = i),
                      (r.r = o),
                      r))
                : ((r["xs" + a] += e + (n || "")), r)
            );
          });
        var Tt = function (t, e) {
            (e = e || {}),
              (this.p = (e.prefix && Z(t)) || t),
              (l[t] = l[this.p] = this),
              (this.format =
                e.formatter ||
                gt(e.defaultValue, e.color, e.collapsible, e.multi)),
              e.parser && (this.parse = e.parser),
              (this.clrs = e.color),
              (this.multi = e.multi),
              (this.keyword = e.keyword),
              (this.dflt = e.defaultValue),
              (this.pr = e.priority || 0);
          },
          $t = (q._registerComplexSpecialProp = function (t, e, i) {
            "object" != typeof e && (e = { parser: i });
            var n,
              o = t.split(","),
              s = e.defaultValue;
            for (i = i || [s], n = 0; n < o.length; n++)
              (e.prefix = 0 === n && e.prefix),
                (e.defaultValue = i[n] || s),
                new Tt(o[n], e);
          }),
          St = (q._registerPluginProp = function (t) {
            if (!l[t]) {
              var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
              $t(t, {
                parser: function (t, i, n, o, s, r, c) {
                  var u = a.com.greensock.plugins[e];
                  return u
                    ? (u._cssRegister(), l[n].parse(t, i, n, o, s, r, c))
                    : (U("Error: " + e + " js file not loaded."), s);
                },
              });
            }
          });
        ((c = Tt.prototype).parseComplex = function (t, e, i, n, o, s) {
          var r,
            a,
            l,
            c,
            u,
            h,
            d = this.keyword;
          if (
            (this.multi &&
              (M.test(i) || M.test(e)
                ? ((a = e.replace(M, "|").split("|")),
                  (l = i.replace(M, "|").split("|")))
                : d && ((a = [e]), (l = [i]))),
            l)
          ) {
            for (
              c = l.length > a.length ? l.length : a.length, r = 0;
              c > r;
              r++
            )
              (e = a[r] = a[r] || this.dflt),
                (i = l[r] = l[r] || this.dflt),
                d &&
                  (u = e.indexOf(d)) !== (h = i.indexOf(d)) &&
                  (-1 === h
                    ? (a[r] = a[r].split(d).join(""))
                    : -1 === u && (a[r] += " " + d));
            (e = a.join(", ")), (i = l.join(", "));
          }
          return wt(t, this.p, e, i, this.clrs, this.dflt, n, this.pr, o, s);
        }),
          (c.parse = function (t, e, i, n, s, r, a) {
            return this.parseComplex(
              t.style,
              this.format(J(t, this.p, o, !1, this.dflt)),
              this.format(e),
              s,
              r
            );
          }),
          (r.registerSpecialProp = function (t, e, i) {
            $t(t, {
              parser: function (t, n, o, s, r, a, l) {
                var c = new _t(t, o, 0, 0, r, 2, o, !1, i);
                return (c.plugin = a), (c.setRatio = e(t, n, s._tween, o)), c;
              },
              priority: i,
            });
          }),
          (r.useSVGTransformAttr = !0);
        var Ct,
          kt =
            "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(
              ","
            ),
          Pt = Z("transform"),
          At = Q + "transform",
          Et = Z("transformOrigin"),
          Ot = null !== Z("perspective"),
          Ft = (q.Transform = function () {
            (this.perspective = parseFloat(r.defaultTransformPerspective) || 0),
              (this.force3D =
                !(!1 === r.defaultForce3D || !Ot) &&
                (r.defaultForce3D || "auto"));
          }),
          zt = _gsScope.SVGElement,
          Mt = function (t, e, i) {
            var n,
              o = H.createElementNS("http://www.w3.org/2000/svg", t),
              s = /([a-z])([A-Z])/g;
            for (n in i)
              o.setAttributeNS(null, n.replace(s, "$1-$2").toLowerCase(), i[n]);
            return e.appendChild(o), o;
          },
          Lt = H.documentElement || {},
          Dt = (function () {
            var t,
              e,
              i,
              n = m || (/Android/i.test(X) && !_gsScope.chrome);
            return (
              H.createElementNS &&
                !n &&
                ((t = Mt("svg", Lt)),
                (i = (e = Mt("rect", t, {
                  width: 100,
                  height: 50,
                  x: 100,
                })).getBoundingClientRect().width),
                (e.style[Et] = "50% 50%"),
                (e.style[Pt] = "scaleX(0.5)"),
                (n = i === e.getBoundingClientRect().width && !(p && Ot)),
                Lt.removeChild(t)),
              n
            );
          })(),
          Rt = function (t, e, i, n, o, s) {
            var a,
              l,
              c,
              u,
              h,
              d,
              p,
              f,
              m,
              g,
              v,
              y,
              _,
              b,
              w = t._gsTransform,
              x = Nt(t, !0);
            w && ((_ = w.xOrigin), (b = w.yOrigin)),
              (!n || (a = n.split(" ")).length < 2) &&
                (0 === (p = t.getBBox()).x &&
                  0 === p.y &&
                  p.width + p.height === 0 &&
                  (p = {
                    x:
                      parseFloat(
                        t.hasAttribute("x")
                          ? t.getAttribute("x")
                          : t.hasAttribute("cx")
                          ? t.getAttribute("cx")
                          : 0
                      ) || 0,
                    y:
                      parseFloat(
                        t.hasAttribute("y")
                          ? t.getAttribute("y")
                          : t.hasAttribute("cy")
                          ? t.getAttribute("cy")
                          : 0
                      ) || 0,
                    width: 0,
                    height: 0,
                  }),
                (a = [
                  (-1 !== (e = at(e).split(" "))[0].indexOf("%")
                    ? (parseFloat(e[0]) / 100) * p.width
                    : parseFloat(e[0])) + p.x,
                  (-1 !== e[1].indexOf("%")
                    ? (parseFloat(e[1]) / 100) * p.height
                    : parseFloat(e[1])) + p.y,
                ])),
              (i.xOrigin = u = parseFloat(a[0])),
              (i.yOrigin = h = parseFloat(a[1])),
              n &&
                x !== Ht &&
                ((d = x[0]),
                (p = x[1]),
                (f = x[2]),
                (m = x[3]),
                (g = x[4]),
                (v = x[5]),
                (y = d * m - p * f) &&
                  ((l = u * (m / y) + h * (-f / y) + (f * v - m * g) / y),
                  (c = u * (-p / y) + h * (d / y) - (d * v - p * g) / y),
                  (u = i.xOrigin = a[0] = l),
                  (h = i.yOrigin = a[1] = c))),
              w &&
                (s &&
                  ((i.xOffset = w.xOffset), (i.yOffset = w.yOffset), (w = i)),
                o || (!1 !== o && !1 !== r.defaultSmoothOrigin)
                  ? ((l = u - _),
                    (c = h - b),
                    (w.xOffset += l * x[0] + c * x[2] - l),
                    (w.yOffset += l * x[1] + c * x[3] - c))
                  : (w.xOffset = w.yOffset = 0)),
              s || t.setAttribute("data-svg-origin", a.join(" "));
          },
          It = function (t) {
            var e,
              i = N(
                "svg",
                this.ownerSVGElement.getAttribute("xmlns") ||
                  "http://www.w3.org/2000/svg"
              ),
              n = this.parentNode,
              o = this.nextSibling,
              s = this.style.cssText;
            if (
              (Lt.appendChild(i),
              i.appendChild(this),
              (this.style.display = "block"),
              t)
            )
              try {
                (e = this.getBBox()),
                  (this._originalGetBBox = this.getBBox),
                  (this.getBBox = It);
              } catch (t) {}
            else this._originalGetBBox && (e = this._originalGetBBox());
            return (
              o ? n.insertBefore(this, o) : n.appendChild(this),
              Lt.removeChild(i),
              (this.style.cssText = s),
              e
            );
          },
          jt = function (t) {
            return !(
              !(
                zt &&
                t.getCTM &&
                (function (t) {
                  try {
                    return t.getBBox();
                  } catch (e) {
                    return It.call(t, !0);
                  }
                })(t)
              ) ||
              (t.parentNode && !t.ownerSVGElement)
            );
          },
          Ht = [1, 0, 0, 1, 0, 0],
          Nt = function (t, e) {
            var i,
              n,
              o,
              s,
              r,
              a,
              l = t._gsTransform || new Ft(),
              c = t.style;
            if (
              (Pt
                ? (n = J(t, At, null, !0))
                : t.currentStyle &&
                  (n =
                    (n = t.currentStyle.filter.match(F)) && 4 === n.length
                      ? [
                          n[0].substr(4),
                          Number(n[2].substr(4)),
                          Number(n[1].substr(4)),
                          n[3].substr(4),
                          l.x || 0,
                          l.y || 0,
                        ].join(",")
                      : ""),
              (i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n),
              !Pt ||
                (!(a = "none" === K(t).display) && t.parentNode) ||
                (a && ((s = c.display), (c.display = "block")),
                t.parentNode || ((r = 1), Lt.appendChild(t)),
                (i =
                  !(n = J(t, At, null, !0)) ||
                  "none" === n ||
                  "matrix(1, 0, 0, 1, 0, 0)" === n),
                s ? (c.display = s) : a && Vt(c, "display"),
                r && Lt.removeChild(t)),
              (l.svg || (t.getCTM && jt(t))) &&
                (i &&
                  -1 !== (c[Pt] + "").indexOf("matrix") &&
                  ((n = c[Pt]), (i = 0)),
                (o = t.getAttribute("transform")),
                i &&
                  o &&
                  (-1 !== o.indexOf("matrix")
                    ? ((n = o), (i = 0))
                    : -1 !== o.indexOf("translate") &&
                      ((n =
                        "matrix(1,0,0,1," +
                        o.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") +
                        ")"),
                      (i = 0)))),
              i)
            )
              return Ht;
            for (o = (n || "").match(y) || [], xt = o.length; --xt > -1; )
              (s = Number(o[xt])),
                (o[xt] = (r = s - (s |= 0))
                  ? ((1e5 * r + (0 > r ? -0.5 : 0.5)) | 0) / 1e5 + s
                  : s);
            return e && o.length > 6
              ? [o[0], o[1], o[4], o[5], o[12], o[13]]
              : o;
          },
          Bt = (q.getTransform = function (t, i, n, o) {
            if (t._gsTransform && n && !o) return t._gsTransform;
            var s,
              a,
              l,
              c,
              u,
              h,
              d = (n && t._gsTransform) || new Ft(),
              p = d.scaleX < 0,
              f = 2e-5,
              m = 1e5,
              g =
                (Ot &&
                  (parseFloat(J(t, Et, i, !1, "0 0 0").split(" ")[2]) ||
                    d.zOrigin)) ||
                0,
              v = parseFloat(r.defaultTransformPerspective) || 0;
            if (
              ((d.svg = !(!t.getCTM || !jt(t))),
              d.svg &&
                (Rt(
                  t,
                  J(t, Et, i, !1, "50% 50%") + "",
                  d,
                  t.getAttribute("data-svg-origin")
                ),
                (Ct = r.useSVGTransformAttr || Dt)),
              (s = Nt(t)) !== Ht)
            ) {
              if (16 === s.length) {
                var y,
                  _,
                  b,
                  w,
                  x,
                  T = s[0],
                  $ = s[1],
                  S = s[2],
                  C = s[3],
                  k = s[4],
                  P = s[5],
                  A = s[6],
                  E = s[7],
                  O = s[8],
                  F = s[9],
                  z = s[10],
                  M = s[12],
                  L = s[13],
                  D = s[14],
                  I = s[11],
                  j = Math.atan2(A, z);
                d.zOrigin &&
                  ((M = O * (D = -d.zOrigin) - s[12]),
                  (L = F * D - s[13]),
                  (D = z * D + d.zOrigin - s[14])),
                  (d.rotationX = j * R),
                  j &&
                    ((y = k * (w = Math.cos(-j)) + O * (x = Math.sin(-j))),
                    (_ = P * w + F * x),
                    (b = A * w + z * x),
                    (O = k * -x + O * w),
                    (F = P * -x + F * w),
                    (z = A * -x + z * w),
                    (I = E * -x + I * w),
                    (k = y),
                    (P = _),
                    (A = b)),
                  (j = Math.atan2(-S, z)),
                  (d.rotationY = j * R),
                  j &&
                    ((_ = $ * (w = Math.cos(-j)) - F * (x = Math.sin(-j))),
                    (b = S * w - z * x),
                    (F = $ * x + F * w),
                    (z = S * x + z * w),
                    (I = C * x + I * w),
                    (T = y = T * w - O * x),
                    ($ = _),
                    (S = b)),
                  (j = Math.atan2($, T)),
                  (d.rotation = j * R),
                  j &&
                    ((y = T * (w = Math.cos(j)) + $ * (x = Math.sin(j))),
                    (_ = k * w + P * x),
                    (b = O * w + F * x),
                    ($ = $ * w - T * x),
                    (P = P * w - k * x),
                    (F = F * w - O * x),
                    (T = y),
                    (k = _),
                    (O = b)),
                  d.rotationX &&
                    Math.abs(d.rotationX) + Math.abs(d.rotation) > 359.9 &&
                    ((d.rotationX = d.rotation = 0),
                    (d.rotationY = 180 - d.rotationY)),
                  (j = Math.atan2(k, P)),
                  (d.scaleX =
                    ((Math.sqrt(T * T + $ * $ + S * S) * m + 0.5) | 0) / m),
                  (d.scaleY = ((Math.sqrt(P * P + A * A) * m + 0.5) | 0) / m),
                  (d.scaleZ =
                    ((Math.sqrt(O * O + F * F + z * z) * m + 0.5) | 0) / m),
                  (T /= d.scaleX),
                  (k /= d.scaleY),
                  ($ /= d.scaleX),
                  (P /= d.scaleY),
                  Math.abs(j) > f
                    ? ((d.skewX = j * R),
                      (k = 0),
                      "simple" !== d.skewType && (d.scaleY *= 1 / Math.cos(j)))
                    : (d.skewX = 0),
                  (d.perspective = I ? 1 / (0 > I ? -I : I) : 0),
                  (d.x = M),
                  (d.y = L),
                  (d.z = D),
                  d.svg &&
                    ((d.x -= d.xOrigin - (d.xOrigin * T - d.yOrigin * k)),
                    (d.y -= d.yOrigin - (d.yOrigin * $ - d.xOrigin * P)));
              } else if (
                !Ot ||
                o ||
                !s.length ||
                d.x !== s[4] ||
                d.y !== s[5] ||
                (!d.rotationX && !d.rotationY)
              ) {
                var H = s.length >= 6,
                  N = H ? s[0] : 1,
                  B = s[1] || 0,
                  W = s[2] || 0,
                  q = H ? s[3] : 1;
                (d.x = s[4] || 0),
                  (d.y = s[5] || 0),
                  (l = Math.sqrt(N * N + B * B)),
                  (c = Math.sqrt(q * q + W * W)),
                  (u = N || B ? Math.atan2(B, N) * R : d.rotation || 0),
                  (h = W || q ? Math.atan2(W, q) * R + u : d.skewX || 0),
                  (d.scaleX = l),
                  (d.scaleY = c),
                  (d.rotation = u),
                  (d.skewX = h),
                  Ot &&
                    ((d.rotationX = d.rotationY = d.z = 0),
                    (d.perspective = v),
                    (d.scaleZ = 1)),
                  d.svg &&
                    ((d.x -= d.xOrigin - (d.xOrigin * N + d.yOrigin * W)),
                    (d.y -= d.yOrigin - (d.xOrigin * B + d.yOrigin * q)));
              }
              for (a in (Math.abs(d.skewX) > 90 &&
                Math.abs(d.skewX) < 270 &&
                (p
                  ? ((d.scaleX *= -1),
                    (d.skewX += d.rotation <= 0 ? 180 : -180),
                    (d.rotation += d.rotation <= 0 ? 180 : -180))
                  : ((d.scaleY *= -1), (d.skewX += d.skewX <= 0 ? 180 : -180))),
              (d.zOrigin = g),
              d))
                d[a] < f && d[a] > -f && (d[a] = 0);
            }
            return (
              n &&
                ((t._gsTransform = d),
                d.svg &&
                  (Ct && t.style[Pt]
                    ? e.delayedCall(0.001, function () {
                        Vt(t.style, Pt);
                      })
                    : !Ct &&
                      t.getAttribute("transform") &&
                      e.delayedCall(0.001, function () {
                        t.removeAttribute("transform");
                      }))),
              d
            );
          }),
          Wt = function (t) {
            var e,
              i,
              n = this.data,
              o = -n.rotation * D,
              s = o + n.skewX * D,
              r = 1e5,
              a = ((Math.cos(o) * n.scaleX * r) | 0) / r,
              l = ((Math.sin(o) * n.scaleX * r) | 0) / r,
              c = ((Math.sin(s) * -n.scaleY * r) | 0) / r,
              u = ((Math.cos(s) * n.scaleY * r) | 0) / r,
              h = this.t.style,
              d = this.t.currentStyle;
            if (d) {
              (i = l), (l = -c), (c = -i), (e = d.filter), (h.filter = "");
              var p,
                f,
                g = this.t.offsetWidth,
                v = this.t.offsetHeight,
                y = "absolute" !== d.position,
                _ =
                  "progid:DXImageTransform.Microsoft.Matrix(M11=" +
                  a +
                  ", M12=" +
                  l +
                  ", M21=" +
                  c +
                  ", M22=" +
                  u,
                b = n.x + (g * n.xPercent) / 100,
                w = n.y + (v * n.yPercent) / 100;
              if (
                (null != n.ox &&
                  ((b +=
                    (p = (n.oxp ? g * n.ox * 0.01 : n.ox) - g / 2) -
                    (p * a +
                      (f = (n.oyp ? v * n.oy * 0.01 : n.oy) - v / 2) * l)),
                  (w += f - (p * c + f * u))),
                y
                  ? (_ +=
                      ", Dx=" +
                      ((p = g / 2) - (p * a + (f = v / 2) * l) + b) +
                      ", Dy=" +
                      (f - (p * c + f * u) + w) +
                      ")")
                  : (_ += ", sizingMethod='auto expand')"),
                -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(")
                  ? (h.filter = e.replace(z, _))
                  : (h.filter = _ + " " + e),
                (0 === t || 1 === t) &&
                  1 === a &&
                  0 === l &&
                  0 === c &&
                  1 === u &&
                  ((y && -1 === _.indexOf("Dx=0, Dy=0")) ||
                    (T.test(e) && 100 !== parseFloat(RegExp.$1)) ||
                    (-1 === e.indexOf(e.indexOf("Alpha")) &&
                      h.removeAttribute("filter"))),
                !y)
              ) {
                var $,
                  S,
                  C,
                  k = 8 > m ? 1 : -1;
                for (
                  p = n.ieOffsetX || 0,
                    f = n.ieOffsetY || 0,
                    n.ieOffsetX = Math.round(
                      (g - ((0 > a ? -a : a) * g + (0 > l ? -l : l) * v)) / 2 +
                        b
                    ),
                    n.ieOffsetY = Math.round(
                      (v - ((0 > u ? -u : u) * v + (0 > c ? -c : c) * g)) / 2 +
                        w
                    ),
                    xt = 0;
                  4 > xt;
                  xt++
                )
                  (C =
                    (i =
                      -1 !== ($ = d[(S = st[xt])]).indexOf("px")
                        ? parseFloat($)
                        : tt(this.t, S, parseFloat($), $.replace(x, "")) ||
                          0) !== n[S]
                      ? 2 > xt
                        ? -n.ieOffsetX
                        : -n.ieOffsetY
                      : 2 > xt
                      ? p - n.ieOffsetX
                      : f - n.ieOffsetY),
                    (h[S] =
                      (n[S] = Math.round(
                        i - C * (0 === xt || 2 === xt ? 1 : k)
                      )) + "px");
              }
            }
          },
          qt =
            (q.set3DTransformRatio =
            q.setTransformRatio =
              function (t) {
                var e,
                  i,
                  n,
                  o,
                  s,
                  r,
                  a,
                  l,
                  c,
                  u,
                  h,
                  d,
                  f,
                  m,
                  g,
                  v,
                  y,
                  _,
                  b,
                  w,
                  x,
                  T,
                  $,
                  S = this.data,
                  C = this.t.style,
                  k = S.rotation,
                  P = S.rotationX,
                  A = S.rotationY,
                  E = S.scaleX,
                  O = S.scaleY,
                  F = S.scaleZ,
                  z = S.x,
                  M = S.y,
                  L = S.z,
                  R = S.svg,
                  I = S.perspective,
                  j = S.force3D,
                  H = S.skewY,
                  N = S.skewX;
                if (
                  (H && ((N += H), (k += H)),
                  !(
                    (((1 !== t && 0 !== t) ||
                      "auto" !== j ||
                      (this.tween._totalTime !== this.tween._totalDuration &&
                        this.tween._totalTime)) &&
                      j) ||
                    L ||
                    I ||
                    A ||
                    P ||
                    1 !== F
                  ) ||
                    (Ct && R) ||
                    !Ot)
                )
                  k || N || R
                    ? ((k *= D),
                      (T = N * D),
                      ($ = 1e5),
                      (i = Math.cos(k) * E),
                      (s = Math.sin(k) * E),
                      (n = Math.sin(k - T) * -O),
                      (r = Math.cos(k - T) * O),
                      T &&
                        "simple" === S.skewType &&
                        ((e = Math.tan(T - H * D)),
                        (n *= e = Math.sqrt(1 + e * e)),
                        (r *= e),
                        H &&
                          ((e = Math.tan(H * D)),
                          (i *= e = Math.sqrt(1 + e * e)),
                          (s *= e))),
                      R &&
                        ((z +=
                          S.xOrigin -
                          (S.xOrigin * i + S.yOrigin * n) +
                          S.xOffset),
                        (M +=
                          S.yOrigin -
                          (S.xOrigin * s + S.yOrigin * r) +
                          S.yOffset),
                        Ct &&
                          (S.xPercent || S.yPercent) &&
                          ((g = this.t.getBBox()),
                          (z += 0.01 * S.xPercent * g.width),
                          (M += 0.01 * S.yPercent * g.height)),
                        (g = 1e-6) > z && z > -g && (z = 0),
                        g > M && M > -g && (M = 0)),
                      (b =
                        ((i * $) | 0) / $ +
                        "," +
                        ((s * $) | 0) / $ +
                        "," +
                        ((n * $) | 0) / $ +
                        "," +
                        ((r * $) | 0) / $ +
                        "," +
                        z +
                        "," +
                        M +
                        ")"),
                      R && Ct
                        ? this.t.setAttribute("transform", "matrix(" + b)
                        : (C[Pt] =
                            (S.xPercent || S.yPercent
                              ? "translate(" +
                                S.xPercent +
                                "%," +
                                S.yPercent +
                                "%) matrix("
                              : "matrix(") + b))
                    : (C[Pt] =
                        (S.xPercent || S.yPercent
                          ? "translate(" +
                            S.xPercent +
                            "%," +
                            S.yPercent +
                            "%) matrix("
                          : "matrix(") +
                        E +
                        ",0,0," +
                        O +
                        "," +
                        z +
                        "," +
                        M +
                        ")");
                else {
                  if (
                    (p &&
                      ((g = 1e-4) > E && E > -g && (E = F = 2e-5),
                      g > O && O > -g && (O = F = 2e-5),
                      !I || S.z || S.rotationX || S.rotationY || (I = 0)),
                    k || N)
                  )
                    (k *= D),
                      (v = i = Math.cos(k)),
                      (y = s = Math.sin(k)),
                      N &&
                        ((k -= N * D),
                        (v = Math.cos(k)),
                        (y = Math.sin(k)),
                        "simple" === S.skewType &&
                          ((e = Math.tan((N - H) * D)),
                          (v *= e = Math.sqrt(1 + e * e)),
                          (y *= e),
                          S.skewY &&
                            ((e = Math.tan(H * D)),
                            (i *= e = Math.sqrt(1 + e * e)),
                            (s *= e)))),
                      (n = -y),
                      (r = v);
                  else {
                    if (!(A || P || 1 !== F || I || R))
                      return void (C[Pt] =
                        (S.xPercent || S.yPercent
                          ? "translate(" +
                            S.xPercent +
                            "%," +
                            S.yPercent +
                            "%) translate3d("
                          : "translate3d(") +
                        z +
                        "px," +
                        M +
                        "px," +
                        L +
                        "px)" +
                        (1 !== E || 1 !== O
                          ? " scale(" + E + "," + O + ")"
                          : ""));
                    (i = r = 1), (n = s = 0);
                  }
                  (u = 1),
                    (o = a = l = c = h = d = 0),
                    (f = I ? -1 / I : 0),
                    (m = S.zOrigin),
                    (g = 1e-6),
                    (w = ","),
                    (x = "0"),
                    (k = A * D) &&
                      ((v = Math.cos(k)),
                      (l = -(y = Math.sin(k))),
                      (h = f * -y),
                      (o = i * y),
                      (a = s * y),
                      (u = v),
                      (f *= v),
                      (i *= v),
                      (s *= v)),
                    (k = P * D) &&
                      ((e = n * (v = Math.cos(k)) + o * (y = Math.sin(k))),
                      (_ = r * v + a * y),
                      (c = u * y),
                      (d = f * y),
                      (o = n * -y + o * v),
                      (a = r * -y + a * v),
                      (u *= v),
                      (f *= v),
                      (n = e),
                      (r = _)),
                    1 !== F && ((o *= F), (a *= F), (u *= F), (f *= F)),
                    1 !== O && ((n *= O), (r *= O), (c *= O), (d *= O)),
                    1 !== E && ((i *= E), (s *= E), (l *= E), (h *= E)),
                    (m || R) &&
                      (m && ((z += o * -m), (M += a * -m), (L += u * -m + m)),
                      R &&
                        ((z +=
                          S.xOrigin -
                          (S.xOrigin * i + S.yOrigin * n) +
                          S.xOffset),
                        (M +=
                          S.yOrigin -
                          (S.xOrigin * s + S.yOrigin * r) +
                          S.yOffset)),
                      g > z && z > -g && (z = x),
                      g > M && M > -g && (M = x),
                      g > L && L > -g && (L = 0)),
                    (b =
                      S.xPercent || S.yPercent
                        ? "translate(" +
                          S.xPercent +
                          "%," +
                          S.yPercent +
                          "%) matrix3d("
                        : "matrix3d("),
                    (b +=
                      (g > i && i > -g ? x : i) +
                      w +
                      (g > s && s > -g ? x : s) +
                      w +
                      (g > l && l > -g ? x : l)),
                    (b +=
                      w +
                      (g > h && h > -g ? x : h) +
                      w +
                      (g > n && n > -g ? x : n) +
                      w +
                      (g > r && r > -g ? x : r)),
                    P || A || 1 !== F
                      ? ((b +=
                          w +
                          (g > c && c > -g ? x : c) +
                          w +
                          (g > d && d > -g ? x : d) +
                          w +
                          (g > o && o > -g ? x : o)),
                        (b +=
                          w +
                          (g > a && a > -g ? x : a) +
                          w +
                          (g > u && u > -g ? x : u) +
                          w +
                          (g > f && f > -g ? x : f) +
                          w))
                      : (b += ",0,0,0,0,1,0,"),
                    (b += z + w + M + w + L + w + (I ? 1 + -L / I : 1) + ")"),
                    (C[Pt] = b);
                }
              });
        ((c = Ft.prototype).x =
          c.y =
          c.z =
          c.skewX =
          c.skewY =
          c.rotation =
          c.rotationX =
          c.rotationY =
          c.zOrigin =
          c.xPercent =
          c.yPercent =
          c.xOffset =
          c.yOffset =
            0),
          (c.scaleX = c.scaleY = c.scaleZ = 1),
          $t(
            "transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",
            {
              parser: function (t, e, i, n, s, a, l) {
                if (n._lastParsedTransform === l) return s;
                n._lastParsedTransform = l;
                var c,
                  u = l.scale && "function" == typeof l.scale ? l.scale : 0;
                "function" == typeof l[i] && ((c = l[i]), (l[i] = e)),
                  u && (l.scale = u(v, t));
                var h,
                  d,
                  p,
                  f,
                  m,
                  y,
                  _,
                  b,
                  w,
                  x = t._gsTransform,
                  T = t.style,
                  $ = kt.length,
                  S = l,
                  C = {},
                  k = "transformOrigin",
                  P = Bt(t, o, !0, S.parseTransform),
                  A =
                    S.transform &&
                    ("function" == typeof S.transform
                      ? S.transform(v, g)
                      : S.transform);
                if (
                  ((P.skewType = S.skewType || P.skewType || r.defaultSkewType),
                  (n._transform = P),
                  A && "string" == typeof A && Pt)
                )
                  ((d = B.style)[Pt] = A),
                    (d.display = "block"),
                    (d.position = "absolute"),
                    H.body.appendChild(B),
                    (h = Bt(B, null, !1)),
                    "simple" === P.skewType &&
                      (h.scaleY *= Math.cos(h.skewX * D)),
                    P.svg &&
                      ((y = P.xOrigin),
                      (_ = P.yOrigin),
                      (h.x -= P.xOffset),
                      (h.y -= P.yOffset),
                      (S.transformOrigin || S.svgOrigin) &&
                        ((A = {}),
                        Rt(
                          t,
                          at(S.transformOrigin),
                          A,
                          S.svgOrigin,
                          S.smoothOrigin,
                          !0
                        ),
                        (y = A.xOrigin),
                        (_ = A.yOrigin),
                        (h.x -= A.xOffset - P.xOffset),
                        (h.y -= A.yOffset - P.yOffset)),
                      (y || _) &&
                        ((b = Nt(B, !0)),
                        (h.x -= y - (y * b[0] + _ * b[2])),
                        (h.y -= _ - (y * b[1] + _ * b[3])))),
                    H.body.removeChild(B),
                    h.perspective || (h.perspective = P.perspective),
                    null != S.xPercent &&
                      (h.xPercent = ct(S.xPercent, P.xPercent)),
                    null != S.yPercent &&
                      (h.yPercent = ct(S.yPercent, P.yPercent));
                else if ("object" == typeof S) {
                  if (
                    ((h = {
                      scaleX: ct(
                        null != S.scaleX ? S.scaleX : S.scale,
                        P.scaleX
                      ),
                      scaleY: ct(
                        null != S.scaleY ? S.scaleY : S.scale,
                        P.scaleY
                      ),
                      scaleZ: ct(S.scaleZ, P.scaleZ),
                      x: ct(S.x, P.x),
                      y: ct(S.y, P.y),
                      z: ct(S.z, P.z),
                      xPercent: ct(S.xPercent, P.xPercent),
                      yPercent: ct(S.yPercent, P.yPercent),
                      perspective: ct(S.transformPerspective, P.perspective),
                    }),
                    null != (m = S.directionalRotation))
                  )
                    if ("object" == typeof m) for (d in m) S[d] = m[d];
                    else S.rotation = m;
                  "string" == typeof S.x &&
                    -1 !== S.x.indexOf("%") &&
                    ((h.x = 0), (h.xPercent = ct(S.x, P.xPercent))),
                    "string" == typeof S.y &&
                      -1 !== S.y.indexOf("%") &&
                      ((h.y = 0), (h.yPercent = ct(S.y, P.yPercent))),
                    (h.rotation = ut(
                      "rotation" in S
                        ? S.rotation
                        : "shortRotation" in S
                        ? S.shortRotation + "_short"
                        : "rotationZ" in S
                        ? S.rotationZ
                        : P.rotation,
                      P.rotation,
                      "rotation",
                      C
                    )),
                    Ot &&
                      ((h.rotationX = ut(
                        "rotationX" in S
                          ? S.rotationX
                          : "shortRotationX" in S
                          ? S.shortRotationX + "_short"
                          : P.rotationX || 0,
                        P.rotationX,
                        "rotationX",
                        C
                      )),
                      (h.rotationY = ut(
                        "rotationY" in S
                          ? S.rotationY
                          : "shortRotationY" in S
                          ? S.shortRotationY + "_short"
                          : P.rotationY || 0,
                        P.rotationY,
                        "rotationY",
                        C
                      ))),
                    (h.skewX = ut(S.skewX, P.skewX)),
                    (h.skewY = ut(S.skewY, P.skewY));
                }
                for (
                  Ot &&
                    null != S.force3D &&
                    ((P.force3D = S.force3D), (f = !0)),
                    (p =
                      P.force3D ||
                      P.z ||
                      P.rotationX ||
                      P.rotationY ||
                      h.z ||
                      h.rotationX ||
                      h.rotationY ||
                      h.perspective) ||
                      null == S.scale ||
                      (h.scaleZ = 1);
                  --$ > -1;

                )
                  ((A = h[(w = kt[$])] - P[w]) > 1e-6 ||
                    -1e-6 > A ||
                    null != S[w] ||
                    null != I[w]) &&
                    ((f = !0),
                    (s = new _t(P, w, P[w], A, s)),
                    w in C && (s.e = C[w]),
                    (s.xs0 = 0),
                    (s.plugin = a),
                    n._overwriteProps.push(s.n));
                return (
                  (A = S.transformOrigin),
                  P.svg &&
                    (A || S.svgOrigin) &&
                    ((y = P.xOffset),
                    (_ = P.yOffset),
                    Rt(t, at(A), h, S.svgOrigin, S.smoothOrigin),
                    (s = bt(
                      P,
                      "xOrigin",
                      (x ? P : h).xOrigin,
                      h.xOrigin,
                      s,
                      k
                    )),
                    (s = bt(
                      P,
                      "yOrigin",
                      (x ? P : h).yOrigin,
                      h.yOrigin,
                      s,
                      k
                    )),
                    (y !== P.xOffset || _ !== P.yOffset) &&
                      ((s = bt(
                        P,
                        "xOffset",
                        x ? y : P.xOffset,
                        P.xOffset,
                        s,
                        k
                      )),
                      (s = bt(
                        P,
                        "yOffset",
                        x ? _ : P.yOffset,
                        P.yOffset,
                        s,
                        k
                      ))),
                    (A = "0px 0px")),
                  (A || (Ot && p && P.zOrigin)) &&
                    (Pt
                      ? ((f = !0),
                        (w = Et),
                        (A = (A || J(t, w, o, !1, "50% 50%")) + ""),
                        ((s = new _t(T, w, 0, 0, s, -1, k)).b = T[w]),
                        (s.plugin = a),
                        Ot
                          ? ((d = P.zOrigin),
                            (A = A.split(" ")),
                            (P.zOrigin =
                              (A.length > 2 && (0 === d || "0px" !== A[2])
                                ? parseFloat(A[2])
                                : d) || 0),
                            (s.xs0 = s.e =
                              A[0] + " " + (A[1] || "50%") + " 0px"),
                            ((s = new _t(P, "zOrigin", 0, 0, s, -1, s.n)).b =
                              d),
                            (s.xs0 = s.e = P.zOrigin))
                          : (s.xs0 = s.e = A))
                      : at(A + "", P)),
                  f &&
                    (n._transformType =
                      (P.svg && Ct) || (!p && 3 !== this._transformType)
                        ? 2
                        : 3),
                  c && (l[i] = c),
                  u && (l.scale = u),
                  s
                );
              },
              prefix: !0,
            }
          ),
          $t("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset",
          }),
          $t("borderRadius", {
            defaultValue: "0px",
            parser: function (t, e, i, s, r, a) {
              e = this.format(e);
              var l,
                c,
                u,
                h,
                d,
                p,
                f,
                m,
                g,
                v,
                y,
                _,
                b,
                w,
                x,
                T,
                $ = [
                  "borderTopLeftRadius",
                  "borderTopRightRadius",
                  "borderBottomRightRadius",
                  "borderBottomLeftRadius",
                ],
                S = t.style;
              for (
                g = parseFloat(t.offsetWidth),
                  v = parseFloat(t.offsetHeight),
                  l = e.split(" "),
                  c = 0;
                c < $.length;
                c++
              )
                this.p.indexOf("border") && ($[c] = Z($[c])),
                  -1 !== (d = h = J(t, $[c], o, !1, "0px")).indexOf(" ") &&
                    ((h = d.split(" ")), (d = h[0]), (h = h[1])),
                  (p = u = l[c]),
                  (f = parseFloat(d)),
                  (_ = d.substr((f + "").length)),
                  (b = "=" === p.charAt(1))
                    ? ((m = parseInt(p.charAt(0) + "1", 10)),
                      (p = p.substr(2)),
                      (m *= parseFloat(p)),
                      (y = p.substr((m + "").length - (0 > m ? 1 : 0)) || ""))
                    : ((m = parseFloat(p)), (y = p.substr((m + "").length))),
                  "" === y && (y = n[i] || _),
                  y !== _ &&
                    ((w = tt(t, "borderLeft", f, _)),
                    (x = tt(t, "borderTop", f, _)),
                    "%" === y
                      ? ((d = (w / g) * 100 + "%"), (h = (x / v) * 100 + "%"))
                      : "em" === y
                      ? ((d = w / (T = tt(t, "borderLeft", 1, "em")) + "em"),
                        (h = x / T + "em"))
                      : ((d = w + "px"), (h = x + "px")),
                    b &&
                      ((p = parseFloat(d) + m + y),
                      (u = parseFloat(h) + m + y))),
                  (r = wt(S, $[c], d + " " + h, p + " " + u, !1, "0px", r));
              return r;
            },
            prefix: !0,
            formatter: gt("0px 0px 0px 0px", !1, !0),
          }),
          $t(
            "borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius",
            {
              defaultValue: "0px",
              parser: function (t, e, i, n, s, r) {
                return wt(
                  t.style,
                  i,
                  this.format(J(t, i, o, !1, "0px 0px")),
                  this.format(e),
                  !1,
                  "0px",
                  s
                );
              },
              prefix: !0,
              formatter: gt("0px 0px", !1, !0),
            }
          ),
          $t("backgroundPosition", {
            defaultValue: "0 0",
            parser: function (t, e, i, n, s, r) {
              var a,
                l,
                c,
                u,
                h,
                d,
                p = "background-position",
                f = o || K(t, null),
                g = this.format(
                  (f
                    ? m
                      ? f.getPropertyValue(p + "-x") +
                        " " +
                        f.getPropertyValue(p + "-y")
                      : f.getPropertyValue(p)
                    : t.currentStyle.backgroundPositionX +
                      " " +
                      t.currentStyle.backgroundPositionY) || "0 0"
                ),
                v = this.format(e);
              if (
                (-1 !== g.indexOf("%")) != (-1 !== v.indexOf("%")) &&
                v.split(",").length < 2 &&
                (d = J(t, "backgroundImage").replace(A, "")) &&
                "none" !== d
              ) {
                for (
                  a = g.split(" "),
                    l = v.split(" "),
                    W.setAttribute("src", d),
                    c = 2;
                  --c > -1;

                )
                  (u = -1 !== (g = a[c]).indexOf("%")) !==
                    (-1 !== l[c].indexOf("%")) &&
                    ((h =
                      0 === c
                        ? t.offsetWidth - W.width
                        : t.offsetHeight - W.height),
                    (a[c] = u
                      ? (parseFloat(g) / 100) * h + "px"
                      : (parseFloat(g) / h) * 100 + "%"));
                g = a.join(" ");
              }
              return this.parseComplex(t.style, g, v, s, r);
            },
            formatter: at,
          }),
          $t("backgroundSize", {
            defaultValue: "0 0",
            formatter: function (t) {
              return at(-1 === (t += "").indexOf(" ") ? t + " " + t : t);
            },
          }),
          $t("perspective", { defaultValue: "0px", prefix: !0 }),
          $t("perspectiveOrigin", { defaultValue: "50% 50%", prefix: !0 }),
          $t("transformStyle", { prefix: !0 }),
          $t("backfaceVisibility", { prefix: !0 }),
          $t("userSelect", { prefix: !0 }),
          $t("margin", {
            parser: vt("marginTop,marginRight,marginBottom,marginLeft"),
          }),
          $t("padding", {
            parser: vt("paddingTop,paddingRight,paddingBottom,paddingLeft"),
          }),
          $t("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function (t, e, i, n, s, r) {
              var a, l, c;
              return (
                9 > m
                  ? ((l = t.currentStyle),
                    (c = 8 > m ? " " : ","),
                    (a =
                      "rect(" +
                      l.clipTop +
                      c +
                      l.clipRight +
                      c +
                      l.clipBottom +
                      c +
                      l.clipLeft +
                      ")"),
                    (e = this.format(e).split(",").join(c)))
                  : ((a = this.format(J(t, this.p, o, !1, this.dflt))),
                    (e = this.format(e))),
                this.parseComplex(t.style, a, e, s, r)
              );
            },
          }),
          $t("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0,
          }),
          $t("autoRound,strictUnits", {
            parser: function (t, e, i, n, o) {
              return o;
            },
          }),
          $t("border", {
            defaultValue: "0px solid #000",
            parser: function (t, e, i, n, s, r) {
              var a = J(t, "borderTopWidth", o, !1, "0px"),
                l = this.format(e).split(" "),
                c = l[0].replace(x, "");
              return (
                "px" !== c &&
                  (a = parseFloat(a) / tt(t, "borderTopWidth", 1, c) + c),
                this.parseComplex(
                  t.style,
                  this.format(
                    a +
                      " " +
                      J(t, "borderTopStyle", o, !1, "solid") +
                      " " +
                      J(t, "borderTopColor", o, !1, "#000")
                  ),
                  l.join(" "),
                  s,
                  r
                )
              );
            },
            color: !0,
            formatter: function (t) {
              var e = t.split(" ");
              return (
                e[0] +
                " " +
                (e[1] || "solid") +
                " " +
                (t.match(mt) || ["#000"])[0]
              );
            },
          }),
          $t("borderWidth", {
            parser: vt(
              "borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth"
            ),
          }),
          $t("float,cssFloat,styleFloat", {
            parser: function (t, e, i, n, o, s) {
              var r = t.style,
                a = "cssFloat" in r ? "cssFloat" : "styleFloat";
              return new _t(r, a, 0, 0, o, -1, i, !1, 0, r[a], e);
            },
          });
        var Xt = function (t) {
          var e,
            i = this.t,
            n = i.filter || J(this.data, "filter") || "",
            o = (this.s + this.c * t) | 0;
          100 === o &&
            (-1 === n.indexOf("atrix(") &&
            -1 === n.indexOf("radient(") &&
            -1 === n.indexOf("oader(")
              ? (i.removeAttribute("filter"), (e = !J(this.data, "filter")))
              : ((i.filter = n.replace(S, "")), (e = !0))),
            e ||
              (this.xn1 && (i.filter = n = n || "alpha(opacity=" + o + ")"),
              -1 === n.indexOf("pacity")
                ? (0 === o && this.xn1) ||
                  (i.filter = n + " alpha(opacity=" + o + ")")
                : (i.filter = n.replace(T, "opacity=" + o)));
        };
        $t("opacity,alpha,autoAlpha", {
          defaultValue: "1",
          parser: function (t, e, i, n, s, r) {
            var a = parseFloat(J(t, "opacity", o, !1, "1")),
              l = t.style,
              c = "autoAlpha" === i;
            return (
              "string" == typeof e &&
                "=" === e.charAt(1) &&
                (e =
                  ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + a),
              c &&
                1 === a &&
                "hidden" === J(t, "visibility", o) &&
                0 !== e &&
                (a = 0),
              V
                ? (s = new _t(l, "opacity", a, e - a, s))
                : (((s = new _t(l, "opacity", 100 * a, 100 * (e - a), s)).xn1 =
                    c ? 1 : 0),
                  (l.zoom = 1),
                  (s.type = 2),
                  (s.b = "alpha(opacity=" + s.s + ")"),
                  (s.e = "alpha(opacity=" + (s.s + s.c) + ")"),
                  (s.data = t),
                  (s.plugin = r),
                  (s.setRatio = Xt)),
              c &&
                (((s = new _t(
                  l,
                  "visibility",
                  0,
                  0,
                  s,
                  -1,
                  null,
                  !1,
                  0,
                  0 !== a ? "inherit" : "hidden",
                  0 === e ? "hidden" : "inherit"
                )).xs0 = "inherit"),
                n._overwriteProps.push(s.n),
                n._overwriteProps.push(i)),
              s
            );
          },
        });
        var Vt = function (t, e) {
            e &&
              (t.removeProperty
                ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) &&
                    (e = "-" + e),
                  t.removeProperty(e.replace(k, "-$1").toLowerCase()))
                : t.removeAttribute(e));
          },
          Yt = function (t) {
            if (((this.t._gsClassPT = this), 1 === t || 0 === t)) {
              this.t.setAttribute("class", 0 === t ? this.b : this.e);
              for (var e = this.data, i = this.t.style; e; )
                e.v ? (i[e.p] = e.v) : Vt(i, e.p), (e = e._next);
              1 === t &&
                this.t._gsClassPT === this &&
                (this.t._gsClassPT = null);
            } else
              this.t.getAttribute("class") !== this.e &&
                this.t.setAttribute("class", this.e);
          };
        $t("className", {
          parser: function (t, e, n, s, r, a, l) {
            var c,
              u,
              h,
              d,
              p,
              f = t.getAttribute("class") || "",
              m = t.style.cssText;
            if (
              (((r = s._classNamePT = new _t(t, n, 0, 0, r, 2)).setRatio = Yt),
              (r.pr = -11),
              (i = !0),
              (r.b = f),
              (u = it(t, o)),
              (h = t._gsClassPT))
            ) {
              for (d = {}, p = h.data; p; ) (d[p.p] = 1), (p = p._next);
              h.setRatio(1);
            }
            return (
              (t._gsClassPT = r),
              (r.e =
                "=" !== e.charAt(1)
                  ? e
                  : f.replace(
                      new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"),
                      ""
                    ) + ("+" === e.charAt(0) ? " " + e.substr(2) : "")),
              t.setAttribute("class", r.e),
              (c = nt(t, u, it(t), l, d)),
              t.setAttribute("class", f),
              (r.data = c.firstMPT),
              (t.style.cssText = m),
              (r.xfirst = s.parse(t, c.difs, r, a))
            );
          },
        });
        var Ut = function (t) {
          if (
            (1 === t || 0 === t) &&
            this.data._totalTime === this.data._totalDuration &&
            "isFromStart" !== this.data.data
          ) {
            var e,
              i,
              n,
              o,
              s,
              r = this.t.style,
              a = l.transform.parse;
            if ("all" === this.e) (r.cssText = ""), (o = !0);
            else
              for (
                n = (e = this.e.split(" ").join("").split(",")).length;
                --n > -1;

              )
                (i = e[n]),
                  l[i] &&
                    (l[i].parse === a
                      ? (o = !0)
                      : (i = "transformOrigin" === i ? Et : l[i].p)),
                  Vt(r, i);
            o &&
              (Vt(r, Pt),
              (s = this.t._gsTransform) &&
                (s.svg &&
                  (this.t.removeAttribute("data-svg-origin"),
                  this.t.removeAttribute("transform")),
                delete this.t._gsTransform));
          }
        };
        for (
          $t("clearProps", {
            parser: function (t, e, n, o, s) {
              return (
                ((s = new _t(t, n, 0, 0, s, 2)).setRatio = Ut),
                (s.e = e),
                (s.pr = -10),
                (s.data = o._tween),
                (i = !0),
                s
              );
            },
          }),
            c = "bezier,throwProps,physicsProps,physics2D".split(","),
            xt = c.length;
          xt--;

        )
          St(c[xt]);
        ((c = r.prototype)._firstPT =
          c._lastParsedTransform =
          c._transform =
            null),
          (c._onInitTween = function (t, e, a, c) {
            if (!t.nodeType) return !1;
            (this._target = g = t),
              (this._tween = a),
              (this._vars = e),
              (v = c),
              (u = e.autoRound),
              (i = !1),
              (n = e.suffixMap || r.suffixMap),
              (o = K(t, "")),
              (s = this._overwriteProps);
            var p,
              m,
              y,
              _,
              b,
              w,
              x,
              T,
              S,
              C = t.style;
            if (
              (h &&
                "" === C.zIndex &&
                ("auto" === (p = J(t, "zIndex", o)) || "" === p) &&
                this._addLazySet(C, "zIndex", 0),
              "string" == typeof e &&
                ((_ = C.cssText),
                (p = it(t, o)),
                (C.cssText = _ + ";" + e),
                (p = nt(t, p, it(t)).difs),
                !V && $.test(e) && (p.opacity = parseFloat(RegExp.$1)),
                (e = p),
                (C.cssText = _)),
              e.className
                ? (this._firstPT = m =
                    l.className.parse(
                      t,
                      e.className,
                      "className",
                      this,
                      null,
                      null,
                      e
                    ))
                : (this._firstPT = m = this.parse(t, e, null)),
              this._transformType)
            ) {
              for (
                S = 3 === this._transformType,
                  Pt
                    ? d &&
                      ((h = !0),
                      "" === C.zIndex &&
                        ("auto" === (x = J(t, "zIndex", o)) || "" === x) &&
                        this._addLazySet(C, "zIndex", 0),
                      f &&
                        this._addLazySet(
                          C,
                          "WebkitBackfaceVisibility",
                          this._vars.WebkitBackfaceVisibility ||
                            (S ? "visible" : "hidden")
                        ))
                    : (C.zoom = 1),
                  y = m;
                y && y._next;

              )
                y = y._next;
              (T = new _t(t, "transform", 0, 0, null, 2)),
                this._linkCSSP(T, null, y),
                (T.setRatio = Pt ? qt : Wt),
                (T.data = this._transform || Bt(t, o, !0)),
                (T.tween = a),
                (T.pr = -1),
                s.pop();
            }
            if (i) {
              for (; m; ) {
                for (w = m._next, y = _; y && y.pr > m.pr; ) y = y._next;
                (m._prev = y ? y._prev : b) ? (m._prev._next = m) : (_ = m),
                  (m._next = y) ? (y._prev = m) : (b = m),
                  (m = w);
              }
              this._firstPT = _;
            }
            return !0;
          }),
          (c.parse = function (t, e, i, s) {
            var r,
              a,
              c,
              h,
              d,
              p,
              f,
              m,
              y,
              _,
              b = t.style;
            for (r in e) {
              if (
                ("function" == typeof (p = e[r]) && (p = p(v, g)), (a = l[r]))
              )
                i = a.parse(t, p, r, this, i, s, e);
              else {
                if ("--" === r.substr(0, 2)) {
                  this._tween._propLookup[r] = this._addTween.call(
                    this._tween,
                    t.style,
                    "setProperty",
                    K(t).getPropertyValue(r) + "",
                    p + "",
                    r,
                    !1,
                    r
                  );
                  continue;
                }
                (d = J(t, r, o) + ""),
                  (y = "string" == typeof p),
                  "color" === r ||
                  "fill" === r ||
                  "stroke" === r ||
                  -1 !== r.indexOf("Color") ||
                  (y && C.test(p))
                    ? (y ||
                        (p =
                          ((p = pt(p)).length > 3 ? "rgba(" : "rgb(") +
                          p.join(",") +
                          ")"),
                      (i = wt(b, r, d, p, !0, "transparent", i, 0, s)))
                    : y && L.test(p)
                    ? (i = wt(b, r, d, p, !0, null, i, 0, s))
                    : ((f =
                        (c = parseFloat(d)) || 0 === c
                          ? d.substr((c + "").length)
                          : ""),
                      ("" === d || "auto" === d) &&
                        ("width" === r || "height" === r
                          ? ((c = rt(t, r, o)), (f = "px"))
                          : "left" === r || "top" === r
                          ? ((c = et(t, r, o)), (f = "px"))
                          : ((c = "opacity" !== r ? 0 : 1), (f = ""))),
                      (_ = y && "=" === p.charAt(1))
                        ? ((h = parseInt(p.charAt(0) + "1", 10)),
                          (p = p.substr(2)),
                          (h *= parseFloat(p)),
                          (m = p.replace(x, "")))
                        : ((h = parseFloat(p)),
                          (m = y ? p.replace(x, "") : "")),
                      "" === m && (m = r in n ? n[r] : f),
                      (p = h || 0 === h ? (_ ? h + c : h) + m : e[r]),
                      f !== m &&
                        ("" !== m || "lineHeight" === r) &&
                        (h || 0 === h) &&
                        c &&
                        ((c = tt(t, r, c, f)),
                        "%" === m
                          ? ((c /= tt(t, r, 100, "%") / 100),
                            !0 !== e.strictUnits && (d = c + "%"))
                          : "em" === m ||
                            "rem" === m ||
                            "vw" === m ||
                            "vh" === m
                          ? (c /= tt(t, r, 1, m))
                          : "px" !== m && ((h = tt(t, r, h, m)), (m = "px")),
                        _ && (h || 0 === h) && (p = h + c + m)),
                      _ && (h += c),
                      (!c && 0 !== c) || (!h && 0 !== h)
                        ? void 0 !== b[r] &&
                          (p || (p + "" != "NaN" && null != p))
                          ? ((i = new _t(
                              b,
                              r,
                              h || c || 0,
                              0,
                              i,
                              -1,
                              r,
                              !1,
                              0,
                              d,
                              p
                            )).xs0 =
                              "none" !== p ||
                              ("display" !== r && -1 === r.indexOf("Style"))
                                ? p
                                : d)
                          : U("invalid " + r + " tween value: " + e[r])
                        : ((i = new _t(
                            b,
                            r,
                            c,
                            h - c,
                            i,
                            0,
                            r,
                            !1 !== u && ("px" === m || "zIndex" === r),
                            0,
                            d,
                            p
                          )).xs0 = m));
              }
              s && i && !i.plugin && (i.plugin = s);
            }
            return i;
          }),
          (c.setRatio = function (t) {
            var e,
              i,
              n,
              o = this._firstPT;
            if (
              1 !== t ||
              (this._tween._time !== this._tween._duration &&
                0 !== this._tween._time)
            )
              if (
                t ||
                (this._tween._time !== this._tween._duration &&
                  0 !== this._tween._time) ||
                -1e-6 === this._tween._rawPrevTime
              )
                for (; o; ) {
                  if (
                    ((e = o.c * t + o.s),
                    o.r
                      ? (e = Math.round(e))
                      : 1e-6 > e && e > -1e-6 && (e = 0),
                    o.type)
                  )
                    if (1 === o.type)
                      if (2 === (n = o.l))
                        o.t[o.p] = o.xs0 + e + o.xs1 + o.xn1 + o.xs2;
                      else if (3 === n)
                        o.t[o.p] =
                          o.xs0 + e + o.xs1 + o.xn1 + o.xs2 + o.xn2 + o.xs3;
                      else if (4 === n)
                        o.t[o.p] =
                          o.xs0 +
                          e +
                          o.xs1 +
                          o.xn1 +
                          o.xs2 +
                          o.xn2 +
                          o.xs3 +
                          o.xn3 +
                          o.xs4;
                      else if (5 === n)
                        o.t[o.p] =
                          o.xs0 +
                          e +
                          o.xs1 +
                          o.xn1 +
                          o.xs2 +
                          o.xn2 +
                          o.xs3 +
                          o.xn3 +
                          o.xs4 +
                          o.xn4 +
                          o.xs5;
                      else {
                        for (i = o.xs0 + e + o.xs1, n = 1; n < o.l; n++)
                          i += o["xn" + n] + o["xs" + (n + 1)];
                        o.t[o.p] = i;
                      }
                    else
                      -1 === o.type
                        ? (o.t[o.p] = o.xs0)
                        : o.setRatio && o.setRatio(t);
                  else o.t[o.p] = e + o.xs0;
                  o = o._next;
                }
              else
                for (; o; )
                  2 !== o.type ? (o.t[o.p] = o.b) : o.setRatio(t),
                    (o = o._next);
            else
              for (; o; ) {
                if (2 !== o.type)
                  if (o.r && -1 !== o.type)
                    if (((e = Math.round(o.s + o.c)), o.type)) {
                      if (1 === o.type) {
                        for (
                          n = o.l, i = o.xs0 + e + o.xs1, n = 1;
                          n < o.l;
                          n++
                        )
                          i += o["xn" + n] + o["xs" + (n + 1)];
                        o.t[o.p] = i;
                      }
                    } else o.t[o.p] = e + o.xs0;
                  else o.t[o.p] = o.e;
                else o.setRatio(t);
                o = o._next;
              }
          }),
          (c._enableTransforms = function (t) {
            (this._transform = this._transform || Bt(this._target, o, !0)),
              (this._transformType =
                (this._transform.svg && Ct) || (!t && 3 !== this._transformType)
                  ? 2
                  : 3);
          });
        var Qt = function (t) {
          (this.t[this.p] = this.e),
            this.data._linkCSSP(this, this._next, null, !0);
        };
        (c._addLazySet = function (t, e, i) {
          var n = (this._firstPT = new _t(t, e, 0, 0, this._firstPT, 2));
          (n.e = i), (n.setRatio = Qt), (n.data = this);
        }),
          (c._linkCSSP = function (t, e, i, n) {
            return (
              t &&
                (e && (e._prev = t),
                t._next && (t._next._prev = t._prev),
                t._prev
                  ? (t._prev._next = t._next)
                  : this._firstPT === t &&
                    ((this._firstPT = t._next), (n = !0)),
                i
                  ? (i._next = t)
                  : n || null !== this._firstPT || (this._firstPT = t),
                (t._next = e),
                (t._prev = i)),
              t
            );
          }),
          (c._mod = function (t) {
            for (var e = this._firstPT; e; )
              "function" == typeof t[e.p] && t[e.p] === Math.round && (e.r = 1),
                (e = e._next);
          }),
          (c._kill = function (e) {
            var i,
              n,
              o,
              s = e;
            if (e.autoAlpha || e.alpha) {
              for (n in ((s = {}), e)) s[n] = e[n];
              (s.opacity = 1), s.autoAlpha && (s.visibility = 1);
            }
            for (
              e.className &&
                (i = this._classNamePT) &&
                ((o = i.xfirst) && o._prev
                  ? this._linkCSSP(o._prev, i._next, o._prev._prev)
                  : o === this._firstPT && (this._firstPT = i._next),
                i._next && this._linkCSSP(i._next, i._next._next, o._prev),
                (this._classNamePT = null)),
                i = this._firstPT;
              i;

            )
              i.plugin &&
                i.plugin !== n &&
                i.plugin._kill &&
                (i.plugin._kill(e), (n = i.plugin)),
                (i = i._next);
            return t.prototype._kill.call(this, s);
          });
        var Gt = function (t, e, i) {
          var n, o, s, r;
          if (t.slice) for (o = t.length; --o > -1; ) Gt(t[o], e, i);
          else
            for (o = (n = t.childNodes).length; --o > -1; )
              (r = (s = n[o]).type),
                s.style && (e.push(it(s)), i && i.push(s)),
                (1 !== r && 9 !== r && 11 !== r) ||
                  !s.childNodes.length ||
                  Gt(s, e, i);
        };
        return (
          (r.cascadeTo = function (t, i, n) {
            var o,
              s,
              r,
              a,
              l = e.to(t, i, n),
              c = [l],
              u = [],
              h = [],
              d = [],
              p = e._internals.reservedProps;
            for (
              t = l._targets || l.target,
                Gt(t, u, d),
                l.render(i, !0, !0),
                Gt(t, h),
                l.render(0, !0, !0),
                l._enabled(!0),
                o = d.length;
              --o > -1;

            )
              if ((s = nt(d[o], u[o], h[o])).firstMPT) {
                for (r in ((s = s.difs), n)) p[r] && (s[r] = n[r]);
                for (r in ((a = {}), s)) a[r] = u[o][r];
                c.push(e.fromTo(d[o], i, a, s));
              }
            return c;
          }),
          t.activate([r]),
          r
        );
      },
      !0
    ),
    (function () {
      var t = _gsScope._gsDefine.plugin({
          propName: "roundProps",
          version: "1.6.0",
          priority: -1,
          API: 2,
          init: function (t, e, i) {
            return (this._tween = i), !0;
          },
        }),
        e = function (t) {
          for (; t; ) t.f || t.blob || (t.m = Math.round), (t = t._next);
        },
        i = t.prototype;
      (i._onInitAllProps = function () {
        for (
          var t,
            i,
            n,
            o = this._tween,
            s = o.vars.roundProps.join
              ? o.vars.roundProps
              : o.vars.roundProps.split(","),
            r = s.length,
            a = {},
            l = o._propLookup.roundProps;
          --r > -1;

        )
          a[s[r]] = Math.round;
        for (r = s.length; --r > -1; )
          for (t = s[r], i = o._firstPT; i; )
            (n = i._next),
              i.pg
                ? i.t._mod(a)
                : i.n === t &&
                  (2 === i.f && i.t
                    ? e(i.t._firstPT)
                    : (this._add(i.t, t, i.s, i.c),
                      n && (n._prev = i._prev),
                      i._prev
                        ? (i._prev._next = n)
                        : o._firstPT === i && (o._firstPT = n),
                      (i._next = i._prev = null),
                      (o._propLookup[t] = l))),
              (i = n);
        return !1;
      }),
        (i._add = function (t, e, i, n) {
          this._addTween(t, e, i, i + n, e, Math.round),
            this._overwriteProps.push(e);
        });
    })(),
    _gsScope._gsDefine.plugin({
      propName: "attr",
      API: 2,
      version: "0.6.1",
      init: function (t, e, i, n) {
        var o, s;
        if ("function" != typeof t.setAttribute) return !1;
        for (o in e)
          "function" == typeof (s = e[o]) && (s = s(n, t)),
            this._addTween(
              t,
              "setAttribute",
              t.getAttribute(o) + "",
              s + "",
              o,
              !1,
              o
            ),
            this._overwriteProps.push(o);
        return !0;
      },
    }),
    (_gsScope._gsDefine.plugin({
      propName: "directionalRotation",
      version: "0.3.1",
      API: 2,
      init: function (t, e, i, n) {
        "object" != typeof e && (e = { rotation: e }), (this.finals = {});
        var o,
          s,
          r,
          a,
          l,
          c,
          u = !0 === e.useRadians ? 2 * Math.PI : 360;
        for (o in e)
          "useRadians" !== o &&
            ("function" == typeof (a = e[o]) && (a = a(n, t)),
            (s = (c = (a + "").split("_"))[0]),
            (r = parseFloat(
              "function" != typeof t[o]
                ? t[o]
                : t[
                    o.indexOf("set") ||
                    "function" != typeof t["get" + o.substr(3)]
                      ? o
                      : "get" + o.substr(3)
                  ]()
            )),
            (l =
              (a = this.finals[o] =
                "string" == typeof s && "=" === s.charAt(1)
                  ? r + parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))
                  : Number(s) || 0) - r),
            c.length &&
              (-1 !== (s = c.join("_")).indexOf("short") &&
                (l %= u) !== l % (u / 2) &&
                (l = 0 > l ? l + u : l - u),
              -1 !== s.indexOf("_cw") && 0 > l
                ? (l = ((l + 9999999999 * u) % u) - ((l / u) | 0) * u)
                : -1 !== s.indexOf("ccw") &&
                  l > 0 &&
                  (l = ((l - 9999999999 * u) % u) - ((l / u) | 0) * u)),
            (l > 1e-6 || -1e-6 > l) &&
              (this._addTween(t, o, r, r + l, o),
              this._overwriteProps.push(o)));
        return !0;
      },
      set: function (t) {
        var e;
        if (1 !== t) this._super.setRatio.call(this, t);
        else
          for (e = this._firstPT; e; )
            e.f ? e.t[e.p](this.finals[e.p]) : (e.t[e.p] = this.finals[e.p]),
              (e = e._next);
      },
    })._autoCSS = !0),
    _gsScope._gsDefine(
      "easing.Back",
      ["easing.Ease"],
      function (t) {
        var e,
          i,
          n,
          o = _gsScope.GreenSockGlobals || _gsScope,
          s = o.com.greensock,
          r = 2 * Math.PI,
          a = Math.PI / 2,
          l = s._class,
          c = function (e, i) {
            var n = l("easing." + e, function () {}, !0),
              o = (n.prototype = new t());
            return (o.constructor = n), (o.getRatio = i), n;
          },
          u = t.register || function () {},
          h = function (t, e, i, n, o) {
            var s = l(
              "easing." + t,
              { easeOut: new e(), easeIn: new i(), easeInOut: new n() },
              !0
            );
            return u(s, t), s;
          },
          d = function (t, e, i) {
            (this.t = t),
              (this.v = e),
              i &&
                ((this.next = i),
                (i.prev = this),
                (this.c = i.v - e),
                (this.gap = i.t - t));
          },
          p = function (e, i) {
            var n = l(
                "easing." + e,
                function (t) {
                  (this._p1 = t || 0 === t ? t : 1.70158),
                    (this._p2 = 1.525 * this._p1);
                },
                !0
              ),
              o = (n.prototype = new t());
            return (
              (o.constructor = n),
              (o.getRatio = i),
              (o.config = function (t) {
                return new n(t);
              }),
              n
            );
          },
          f = h(
            "Back",
            p("BackOut", function (t) {
              return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1;
            }),
            p("BackIn", function (t) {
              return t * t * ((this._p1 + 1) * t - this._p1);
            }),
            p("BackInOut", function (t) {
              return (t *= 2) < 1
                ? 0.5 * t * t * ((this._p2 + 1) * t - this._p2)
                : 0.5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2);
            })
          ),
          m = l(
            "easing.SlowMo",
            function (t, e, i) {
              (e = e || 0 === e ? e : 0.7),
                null == t ? (t = 0.7) : t > 1 && (t = 1),
                (this._p = 1 !== t ? e : 0),
                (this._p1 = (1 - t) / 2),
                (this._p2 = t),
                (this._p3 = this._p1 + this._p2),
                (this._calcEnd = !0 === i);
            },
            !0
          ),
          g = (m.prototype = new t());
        return (
          (g.constructor = m),
          (g.getRatio = function (t) {
            var e = t + (0.5 - t) * this._p;
            return t < this._p1
              ? this._calcEnd
                ? 1 - (t = 1 - t / this._p1) * t
                : e - (t = 1 - t / this._p1) * t * t * t * e
              : t > this._p3
              ? this._calcEnd
                ? 1 - (t = (t - this._p3) / this._p1) * t
                : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t
              : this._calcEnd
              ? 1
              : e;
          }),
          (m.ease = new m(0.7, 0.7)),
          (g.config = m.config =
            function (t, e, i) {
              return new m(t, e, i);
            }),
          ((g = (e = l(
            "easing.SteppedEase",
            function (t, e) {
              (t = t || 1),
                (this._p1 = 1 / t),
                (this._p2 = t + (e ? 0 : 1)),
                (this._p3 = e ? 1 : 0);
            },
            !0
          )).prototype =
            new t()).constructor = e),
          (g.getRatio = function (t) {
            return (
              0 > t ? (t = 0) : t >= 1 && (t = 0.999999999),
              (((this._p2 * t) | 0) + this._p3) * this._p1
            );
          }),
          (g.config = e.config =
            function (t, i) {
              return new e(t, i);
            }),
          (i = l(
            "easing.RoughEase",
            function (e) {
              for (
                var i,
                  n,
                  o,
                  s,
                  r,
                  a,
                  l = (e = e || {}).taper || "none",
                  c = [],
                  u = 0,
                  h = 0 | (e.points || 20),
                  p = h,
                  f = !1 !== e.randomize,
                  m = !0 === e.clamp,
                  g = e.template instanceof t ? e.template : null,
                  v = "number" == typeof e.strength ? 0.4 * e.strength : 0.4;
                --p > -1;

              )
                (i = f ? Math.random() : (1 / h) * p),
                  (n = g ? g.getRatio(i) : i),
                  "none" === l
                    ? (o = v)
                    : "out" === l
                    ? (o = (s = 1 - i) * s * v)
                    : "in" === l
                    ? (o = i * i * v)
                    : 0.5 > i
                    ? (o = (s = 2 * i) * s * 0.5 * v)
                    : (o = (s = 2 * (1 - i)) * s * 0.5 * v),
                  f
                    ? (n += Math.random() * o - 0.5 * o)
                    : p % 2
                    ? (n += 0.5 * o)
                    : (n -= 0.5 * o),
                  m && (n > 1 ? (n = 1) : 0 > n && (n = 0)),
                  (c[u++] = { x: i, y: n });
              for (
                c.sort(function (t, e) {
                  return t.x - e.x;
                }),
                  a = new d(1, 1, null),
                  p = h;
                --p > -1;

              )
                (r = c[p]), (a = new d(r.x, r.y, a));
              this._prev = new d(0, 0, 0 !== a.t ? a : a.next);
            },
            !0
          )),
          ((g = i.prototype = new t()).constructor = i),
          (g.getRatio = function (t) {
            var e = this._prev;
            if (t > e.t) {
              for (; e.next && t >= e.t; ) e = e.next;
              e = e.prev;
            } else for (; e.prev && t <= e.t; ) e = e.prev;
            return (this._prev = e), e.v + ((t - e.t) / e.gap) * e.c;
          }),
          (g.config = function (t) {
            return new i(t);
          }),
          (i.ease = new i()),
          h(
            "Bounce",
            c("BounceOut", function (t) {
              return 1 / 2.75 > t
                ? 7.5625 * t * t
                : 2 / 2.75 > t
                ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                : 2.5 / 2.75 > t
                ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }),
            c("BounceIn", function (t) {
              return (t = 1 - t) < 1 / 2.75
                ? 1 - 7.5625 * t * t
                : 2 / 2.75 > t
                ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + 0.75)
                : 2.5 / 2.75 > t
                ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375)
                : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }),
            c("BounceInOut", function (t) {
              var e = 0.5 > t;
              return (
                (t =
                  1 / 2.75 > (t = e ? 1 - 2 * t : 2 * t - 1)
                    ? 7.5625 * t * t
                    : 2 / 2.75 > t
                    ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                    : 2.5 / 2.75 > t
                    ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                    : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375),
                e ? 0.5 * (1 - t) : 0.5 * t + 0.5
              );
            })
          ),
          h(
            "Circ",
            c("CircOut", function (t) {
              return Math.sqrt(1 - (t -= 1) * t);
            }),
            c("CircIn", function (t) {
              return -(Math.sqrt(1 - t * t) - 1);
            }),
            c("CircInOut", function (t) {
              return (t *= 2) < 1
                ? -0.5 * (Math.sqrt(1 - t * t) - 1)
                : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
            })
          ),
          h(
            "Elastic",
            (n = function (e, i, n) {
              var o = l(
                  "easing." + e,
                  function (t, e) {
                    (this._p1 = t >= 1 ? t : 1),
                      (this._p2 = (e || n) / (1 > t ? t : 1)),
                      (this._p3 =
                        (this._p2 / r) * (Math.asin(1 / this._p1) || 0)),
                      (this._p2 = r / this._p2);
                  },
                  !0
                ),
                s = (o.prototype = new t());
              return (
                (s.constructor = o),
                (s.getRatio = i),
                (s.config = function (t, e) {
                  return new o(t, e);
                }),
                o
              );
            })(
              "ElasticOut",
              function (t) {
                return (
                  this._p1 *
                    Math.pow(2, -10 * t) *
                    Math.sin((t - this._p3) * this._p2) +
                  1
                );
              },
              0.3
            ),
            n(
              "ElasticIn",
              function (t) {
                return (
                  -this._p1 *
                  Math.pow(2, 10 * (t -= 1)) *
                  Math.sin((t - this._p3) * this._p2)
                );
              },
              0.3
            ),
            n(
              "ElasticInOut",
              function (t) {
                return (t *= 2) < 1
                  ? this._p1 *
                      Math.pow(2, 10 * (t -= 1)) *
                      Math.sin((t - this._p3) * this._p2) *
                      -0.5
                  : this._p1 *
                      Math.pow(2, -10 * (t -= 1)) *
                      Math.sin((t - this._p3) * this._p2) *
                      0.5 +
                      1;
              },
              0.45
            )
          ),
          h(
            "Expo",
            c("ExpoOut", function (t) {
              return 1 - Math.pow(2, -10 * t);
            }),
            c("ExpoIn", function (t) {
              return Math.pow(2, 10 * (t - 1)) - 0.001;
            }),
            c("ExpoInOut", function (t) {
              return (t *= 2) < 1
                ? 0.5 * Math.pow(2, 10 * (t - 1))
                : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
            })
          ),
          h(
            "Sine",
            c("SineOut", function (t) {
              return Math.sin(t * a);
            }),
            c("SineIn", function (t) {
              return 1 - Math.cos(t * a);
            }),
            c("SineInOut", function (t) {
              return -0.5 * (Math.cos(Math.PI * t) - 1);
            })
          ),
          l(
            "easing.EaseLookup",
            {
              find: function (e) {
                return t.map[e];
              },
            },
            !0
          ),
          u(o.SlowMo, "SlowMo", "ease,"),
          u(i, "RoughEase", "ease,"),
          u(e, "SteppedEase", "ease,"),
          f
        );
      },
      !0
    );
}),
  _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
  (function (t, e) {
    "use strict";
    var i = {},
      n = t.document,
      o = (t.GreenSockGlobals = t.GreenSockGlobals || t);
    if (!o.TweenLite) {
      var s,
        r,
        a,
        l,
        c,
        u = function (t) {
          var e,
            i = t.split("."),
            n = o;
          for (e = 0; e < i.length; e++) n[i[e]] = n = n[i[e]] || {};
          return n;
        },
        h = u("com.greensock"),
        d = 1e-10,
        p = function (t) {
          var e,
            i = [],
            n = t.length;
          for (e = 0; e !== n; i.push(t[e++]));
          return i;
        },
        f = function () {},
        m = (function () {
          var t = Object.prototype.toString,
            e = t.call([]);
          return function (i) {
            return (
              null != i &&
              (i instanceof Array ||
                ("object" == typeof i && !!i.push && t.call(i) === e))
            );
          };
        })(),
        g = {},
        v = function (n, s, r, a) {
          (this.sc = g[n] ? g[n].sc : []),
            (g[n] = this),
            (this.gsClass = null),
            (this.func = r);
          var l = [];
          (this.check = function (c) {
            for (var h, d, p, f, m = s.length, y = m; --m > -1; )
              (h = g[s[m]] || new v(s[m], [])).gsClass
                ? ((l[m] = h.gsClass), y--)
                : c && h.sc.push(this);
            if (0 === y && r) {
              if (
                ((p = (d = ("com.greensock." + n).split(".")).pop()),
                (f = u(d.join("."))[p] = this.gsClass = r.apply(r, l)),
                a)
              )
                if (
                  ((o[p] = i[p] = f),
                  "undefined" != typeof module && module.exports)
                )
                  if (n === e)
                    for (m in ((module.exports = i[e] = f), i)) f[m] = i[m];
                  else i[e] && (i[e][p] = f);
                else
                  "function" == typeof define &&
                    define.amd &&
                    define(
                      (t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") +
                        n.split(".").pop(),
                      [],
                      function () {
                        return f;
                      }
                    );
              for (m = 0; m < this.sc.length; m++) this.sc[m].check();
            }
          }),
            this.check(!0);
        },
        y = (t._gsDefine = function (t, e, i, n) {
          return new v(t, e, i, n);
        }),
        _ = (h._class = function (t, e, i) {
          return (
            (e = e || function () {}),
            y(
              t,
              [],
              function () {
                return e;
              },
              i
            ),
            e
          );
        });
      y.globals = o;
      var b = [0, 0, 1, 1],
        w = _(
          "easing.Ease",
          function (t, e, i, n) {
            (this._func = t),
              (this._type = i || 0),
              (this._power = n || 0),
              (this._params = e ? b.concat(e) : b);
          },
          !0
        ),
        x = (w.map = {}),
        T = (w.register = function (t, e, i, n) {
          for (
            var o,
              s,
              r,
              a,
              l = e.split(","),
              c = l.length,
              u = (i || "easeIn,easeOut,easeInOut").split(",");
            --c > -1;

          )
            for (
              s = l[c],
                o = n ? _("easing." + s, null, !0) : h.easing[s] || {},
                r = u.length;
              --r > -1;

            )
              (a = u[r]),
                (x[s + "." + a] =
                  x[a + s] =
                  o[a] =
                    t.getRatio ? t : t[a] || new t());
        });
      for (
        (a = w.prototype)._calcEnd = !1,
          a.getRatio = function (t) {
            if (this._func)
              return (
                (this._params[0] = t), this._func.apply(null, this._params)
              );
            var e = this._type,
              i = this._power,
              n = 1 === e ? 1 - t : 2 === e ? t : 0.5 > t ? 2 * t : 2 * (1 - t);
            return (
              1 === i
                ? (n *= n)
                : 2 === i
                ? (n *= n * n)
                : 3 === i
                ? (n *= n * n * n)
                : 4 === i && (n *= n * n * n * n),
              1 === e ? 1 - n : 2 === e ? n : 0.5 > t ? n / 2 : 1 - n / 2
            );
          },
          r = (s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"]).length;
        --r > -1;

      )
        (a = s[r] + ",Power" + r),
          T(new w(null, null, 1, r), a, "easeOut", !0),
          T(
            new w(null, null, 2, r),
            a,
            "easeIn" + (0 === r ? ",easeNone" : "")
          ),
          T(new w(null, null, 3, r), a, "easeInOut");
      (x.linear = h.easing.Linear.easeIn), (x.swing = h.easing.Quad.easeInOut);
      var $ = _("events.EventDispatcher", function (t) {
        (this._listeners = {}), (this._eventTarget = t || this);
      });
      ((a = $.prototype).addEventListener = function (t, e, i, n, o) {
        o = o || 0;
        var s,
          r,
          a = this._listeners[t],
          u = 0;
        for (
          this !== l || c || l.wake(),
            null == a && (this._listeners[t] = a = []),
            r = a.length;
          --r > -1;

        )
          (s = a[r]).c === e && s.s === i
            ? a.splice(r, 1)
            : 0 === u && s.pr < o && (u = r + 1);
        a.splice(u, 0, { c: e, s: i, up: n, pr: o });
      }),
        (a.removeEventListener = function (t, e) {
          var i,
            n = this._listeners[t];
          if (n)
            for (i = n.length; --i > -1; )
              if (n[i].c === e) return void n.splice(i, 1);
        }),
        (a.dispatchEvent = function (t) {
          var e,
            i,
            n,
            o = this._listeners[t];
          if (o)
            for (
              (e = o.length) > 1 && (o = o.slice(0)), i = this._eventTarget;
              --e > -1;

            )
              (n = o[e]) &&
                (n.up
                  ? n.c.call(n.s || i, { type: t, target: i })
                  : n.c.call(n.s || i));
        });
      var S = t.requestAnimationFrame,
        C = t.cancelAnimationFrame,
        k =
          Date.now ||
          function () {
            return new Date().getTime();
          },
        P = k();
      for (r = (s = ["ms", "moz", "webkit", "o"]).length; --r > -1 && !S; )
        (S = t[s[r] + "RequestAnimationFrame"]),
          (C =
            t[s[r] + "CancelAnimationFrame"] ||
            t[s[r] + "CancelRequestAnimationFrame"]);
      _("Ticker", function (t, e) {
        var i,
          o,
          s,
          r,
          a,
          u = this,
          h = k(),
          p = !(!1 === e || !S) && "auto",
          m = 500,
          g = 33,
          v = function (t) {
            var e,
              n,
              l = k() - P;
            l > m && (h += l - g),
              (P += l),
              (u.time = (P - h) / 1e3),
              (e = u.time - a),
              (!i || e > 0 || !0 === t) &&
                (u.frame++, (a += e + (e >= r ? 0.004 : r - e)), (n = !0)),
              !0 !== t && (s = o(v)),
              n && u.dispatchEvent("tick");
          };
        $.call(u),
          (u.time = u.frame = 0),
          (u.tick = function () {
            v(!0);
          }),
          (u.lagSmoothing = function (t, e) {
            (m = t || 1 / d), (g = Math.min(e, m, 0));
          }),
          (u.sleep = function () {
            null != s &&
              (p && C ? C(s) : clearTimeout(s),
              (o = f),
              (s = null),
              u === l && (c = !1));
          }),
          (u.wake = function (t) {
            null !== s
              ? u.sleep()
              : t
              ? (h += -P + (P = k()))
              : u.frame > 10 && (P = k() - m + 5),
              (o =
                0 === i
                  ? f
                  : p && S
                  ? S
                  : function (t) {
                      return setTimeout(t, (1e3 * (a - u.time) + 1) | 0);
                    }),
              u === l && (c = !0),
              v(2);
          }),
          (u.fps = function (t) {
            return arguments.length
              ? ((r = 1 / ((i = t) || 60)), (a = this.time + r), void u.wake())
              : i;
          }),
          (u.useRAF = function (t) {
            return arguments.length ? (u.sleep(), (p = t), void u.fps(i)) : p;
          }),
          u.fps(t),
          setTimeout(function () {
            "auto" === p &&
              u.frame < 5 &&
              "hidden" !== n.visibilityState &&
              u.useRAF(!1);
          }, 1500);
      }),
        ((a = h.Ticker.prototype = new h.events.EventDispatcher()).constructor =
          h.Ticker);
      var A = _("core.Animation", function (t, e) {
        if (
          ((this.vars = e = e || {}),
          (this._duration = this._totalDuration = t || 0),
          (this._delay = Number(e.delay) || 0),
          (this._timeScale = 1),
          (this._active = !0 === e.immediateRender),
          (this.data = e.data),
          (this._reversed = !0 === e.reversed),
          U)
        ) {
          c || l.wake();
          var i = this.vars.useFrames ? Y : U;
          i.add(this, i._time), this.vars.paused && this.paused(!0);
        }
      });
      (l = A.ticker = new h.Ticker()),
        ((a = A.prototype)._dirty = a._gc = a._initted = a._paused = !1),
        (a._totalTime = a._time = 0),
        (a._rawPrevTime = -1),
        (a._next = a._last = a._onUpdate = a._timeline = a.timeline = null),
        (a._paused = !1);
      var E = function () {
        c && k() - P > 2e3 && "hidden" !== n.visibilityState && l.wake();
        var t = setTimeout(E, 2e3);
        t.unref && t.unref();
      };
      E(),
        (a.play = function (t, e) {
          return null != t && this.seek(t, e), this.reversed(!1).paused(!1);
        }),
        (a.pause = function (t, e) {
          return null != t && this.seek(t, e), this.paused(!0);
        }),
        (a.resume = function (t, e) {
          return null != t && this.seek(t, e), this.paused(!1);
        }),
        (a.seek = function (t, e) {
          return this.totalTime(Number(t), !1 !== e);
        }),
        (a.restart = function (t, e) {
          return this.reversed(!1)
            .paused(!1)
            .totalTime(t ? -this._delay : 0, !1 !== e, !0);
        }),
        (a.reverse = function (t, e) {
          return (
            null != t && this.seek(t || this.totalDuration(), e),
            this.reversed(!0).paused(!1)
          );
        }),
        (a.render = function (t, e, i) {}),
        (a.invalidate = function () {
          return (
            (this._time = this._totalTime = 0),
            (this._initted = this._gc = !1),
            (this._rawPrevTime = -1),
            (this._gc || !this.timeline) && this._enabled(!0),
            this
          );
        }),
        (a.isActive = function () {
          var t,
            e = this._timeline,
            i = this._startTime;
          return (
            !e ||
            (!this._gc &&
              !this._paused &&
              e.isActive() &&
              (t = e.rawTime(!0)) >= i &&
              t < i + this.totalDuration() / this._timeScale - 1e-7)
          );
        }),
        (a._enabled = function (t, e) {
          return (
            c || l.wake(),
            (this._gc = !t),
            (this._active = this.isActive()),
            !0 !== e &&
              (t && !this.timeline
                ? this._timeline.add(this, this._startTime - this._delay)
                : !t && this.timeline && this._timeline._remove(this, !0)),
            !1
          );
        }),
        (a._kill = function (t, e) {
          return this._enabled(!1, !1);
        }),
        (a.kill = function (t, e) {
          return this._kill(t, e), this;
        }),
        (a._uncache = function (t) {
          for (var e = t ? this : this.timeline; e; )
            (e._dirty = !0), (e = e.timeline);
          return this;
        }),
        (a._swapSelfInParams = function (t) {
          for (var e = t.length, i = t.concat(); --e > -1; )
            "{self}" === t[e] && (i[e] = this);
          return i;
        }),
        (a._callback = function (t) {
          var e = this.vars,
            i = e[t],
            n = e[t + "Params"],
            o = e[t + "Scope"] || e.callbackScope || this;
          switch (n ? n.length : 0) {
            case 0:
              i.call(o);
              break;
            case 1:
              i.call(o, n[0]);
              break;
            case 2:
              i.call(o, n[0], n[1]);
              break;
            default:
              i.apply(o, n);
          }
        }),
        (a.eventCallback = function (t, e, i, n) {
          if ("on" === (t || "").substr(0, 2)) {
            var o = this.vars;
            if (1 === arguments.length) return o[t];
            null == e
              ? delete o[t]
              : ((o[t] = e),
                (o[t + "Params"] =
                  m(i) && -1 !== i.join("").indexOf("{self}")
                    ? this._swapSelfInParams(i)
                    : i),
                (o[t + "Scope"] = n)),
              "onUpdate" === t && (this._onUpdate = e);
          }
          return this;
        }),
        (a.delay = function (t) {
          return arguments.length
            ? (this._timeline.smoothChildTiming &&
                this.startTime(this._startTime + t - this._delay),
              (this._delay = t),
              this)
            : this._delay;
        }),
        (a.duration = function (t) {
          return arguments.length
            ? ((this._duration = this._totalDuration = t),
              this._uncache(!0),
              this._timeline.smoothChildTiming &&
                this._time > 0 &&
                this._time < this._duration &&
                0 !== t &&
                this.totalTime(this._totalTime * (t / this._duration), !0),
              this)
            : ((this._dirty = !1), this._duration);
        }),
        (a.totalDuration = function (t) {
          return (
            (this._dirty = !1),
            arguments.length ? this.duration(t) : this._totalDuration
          );
        }),
        (a.time = function (t, e) {
          return arguments.length
            ? (this._dirty && this.totalDuration(),
              this.totalTime(t > this._duration ? this._duration : t, e))
            : this._time;
        }),
        (a.totalTime = function (t, e, i) {
          if ((c || l.wake(), !arguments.length)) return this._totalTime;
          if (this._timeline) {
            if (
              (0 > t && !i && (t += this.totalDuration()),
              this._timeline.smoothChildTiming)
            ) {
              this._dirty && this.totalDuration();
              var n = this._totalDuration,
                o = this._timeline;
              if (
                (t > n && !i && (t = n),
                (this._startTime =
                  (this._paused ? this._pauseTime : o._time) -
                  (this._reversed ? n - t : t) / this._timeScale),
                o._dirty || this._uncache(!1),
                o._timeline)
              )
                for (; o._timeline; )
                  o._timeline._time !==
                    (o._startTime + o._totalTime) / o._timeScale &&
                    o.totalTime(o._totalTime, !0),
                    (o = o._timeline);
            }
            this._gc && this._enabled(!0, !1),
              (this._totalTime !== t || 0 === this._duration) &&
                (M.length && G(), this.render(t, e, !1), M.length && G());
          }
          return this;
        }),
        (a.progress = a.totalProgress =
          function (t, e) {
            var i = this.duration();
            return arguments.length
              ? this.totalTime(i * t, e)
              : i
              ? this._time / i
              : this.ratio;
          }),
        (a.startTime = function (t) {
          return arguments.length
            ? (t !== this._startTime &&
                ((this._startTime = t),
                this.timeline &&
                  this.timeline._sortChildren &&
                  this.timeline.add(this, t - this._delay)),
              this)
            : this._startTime;
        }),
        (a.endTime = function (t) {
          return (
            this._startTime +
            (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
          );
        }),
        (a.timeScale = function (t) {
          if (!arguments.length) return this._timeScale;
          if (
            ((t = t || d), this._timeline && this._timeline.smoothChildTiming)
          ) {
            var e = this._pauseTime,
              i = e || 0 === e ? e : this._timeline.totalTime();
            this._startTime = i - ((i - this._startTime) * this._timeScale) / t;
          }
          return (this._timeScale = t), this._uncache(!1);
        }),
        (a.reversed = function (t) {
          return arguments.length
            ? (t != this._reversed &&
                ((this._reversed = t),
                this.totalTime(
                  this._timeline && !this._timeline.smoothChildTiming
                    ? this.totalDuration() - this._totalTime
                    : this._totalTime,
                  !0
                )),
              this)
            : this._reversed;
        }),
        (a.paused = function (t) {
          if (!arguments.length) return this._paused;
          var e,
            i,
            n = this._timeline;
          return (
            t != this._paused &&
              n &&
              (c || t || l.wake(),
              (i = (e = n.rawTime()) - this._pauseTime),
              !t &&
                n.smoothChildTiming &&
                ((this._startTime += i), this._uncache(!1)),
              (this._pauseTime = t ? e : null),
              (this._paused = t),
              (this._active = this.isActive()),
              !t &&
                0 !== i &&
                this._initted &&
                this.duration() &&
                ((e = n.smoothChildTiming
                  ? this._totalTime
                  : (e - this._startTime) / this._timeScale),
                this.render(e, e === this._totalTime, !0))),
            this._gc && !t && this._enabled(!0, !1),
            this
          );
        });
      var O = _("core.SimpleTimeline", function (t) {
        A.call(this, 0, t),
          (this.autoRemoveChildren = this.smoothChildTiming = !0);
      });
      ((a = O.prototype = new A()).constructor = O),
        (a.kill()._gc = !1),
        (a._first = a._last = a._recent = null),
        (a._sortChildren = !1),
        (a.add = a.insert =
          function (t, e, i, n) {
            var o, s;
            if (
              ((t._startTime = Number(e || 0) + t._delay),
              t._paused &&
                this !== t._timeline &&
                (t._pauseTime =
                  t._startTime +
                  (this.rawTime() - t._startTime) / t._timeScale),
              t.timeline && t.timeline._remove(t, !0),
              (t.timeline = t._timeline = this),
              t._gc && t._enabled(!0, !0),
              (o = this._last),
              this._sortChildren)
            )
              for (s = t._startTime; o && o._startTime > s; ) o = o._prev;
            return (
              o
                ? ((t._next = o._next), (o._next = t))
                : ((t._next = this._first), (this._first = t)),
              t._next ? (t._next._prev = t) : (this._last = t),
              (t._prev = o),
              (this._recent = t),
              this._timeline && this._uncache(!0),
              this
            );
          }),
        (a._remove = function (t, e) {
          return (
            t.timeline === this &&
              (e || t._enabled(!1, !0),
              t._prev
                ? (t._prev._next = t._next)
                : this._first === t && (this._first = t._next),
              t._next
                ? (t._next._prev = t._prev)
                : this._last === t && (this._last = t._prev),
              (t._next = t._prev = t.timeline = null),
              t === this._recent && (this._recent = this._last),
              this._timeline && this._uncache(!0)),
            this
          );
        }),
        (a.render = function (t, e, i) {
          var n,
            o = this._first;
          for (this._totalTime = this._time = this._rawPrevTime = t; o; )
            (n = o._next),
              (o._active || (t >= o._startTime && !o._paused && !o._gc)) &&
                (o._reversed
                  ? o.render(
                      (o._dirty ? o.totalDuration() : o._totalDuration) -
                        (t - o._startTime) * o._timeScale,
                      e,
                      i
                    )
                  : o.render((t - o._startTime) * o._timeScale, e, i)),
              (o = n);
        }),
        (a.rawTime = function () {
          return c || l.wake(), this._totalTime;
        });
      var F = _(
          "TweenLite",
          function (e, i, n) {
            if (
              (A.call(this, i, n),
              (this.render = F.prototype.render),
              null == e)
            )
              throw "Cannot tween a null target.";
            this.target = e = "string" != typeof e ? e : F.selector(e) || e;
            var o,
              s,
              r,
              a =
                e.jquery ||
                (e.length &&
                  e !== t &&
                  e[0] &&
                  (e[0] === t || (e[0].nodeType && e[0].style && !e.nodeType))),
              l = this.vars.overwrite;
            if (
              ((this._overwrite = l =
                null == l
                  ? V[F.defaultOverwrite]
                  : "number" == typeof l
                  ? l >> 0
                  : V[l]),
              (a || e instanceof Array || (e.push && m(e))) &&
                "number" != typeof e[0])
            )
              for (
                this._targets = r = p(e),
                  this._propLookup = [],
                  this._siblings = [],
                  o = 0;
                o < r.length;
                o++
              )
                (s = r[o])
                  ? "string" != typeof s
                    ? s.length &&
                      s !== t &&
                      s[0] &&
                      (s[0] === t ||
                        (s[0].nodeType && s[0].style && !s.nodeType))
                      ? (r.splice(o--, 1), (this._targets = r = r.concat(p(s))))
                      : ((this._siblings[o] = Z(s, this, !1)),
                        1 === l &&
                          this._siblings[o].length > 1 &&
                          J(s, this, null, 1, this._siblings[o]))
                    : "string" == typeof (s = r[o--] = F.selector(s)) &&
                      r.splice(o + 1, 1)
                  : r.splice(o--, 1);
            else
              (this._propLookup = {}),
                (this._siblings = Z(e, this, !1)),
                1 === l &&
                  this._siblings.length > 1 &&
                  J(e, this, null, 1, this._siblings);
            (this.vars.immediateRender ||
              (0 === i &&
                0 === this._delay &&
                !1 !== this.vars.immediateRender)) &&
              ((this._time = -d), this.render(Math.min(0, -this._delay)));
          },
          !0
        ),
        z = function (e) {
          return (
            e &&
            e.length &&
            e !== t &&
            e[0] &&
            (e[0] === t || (e[0].nodeType && e[0].style && !e.nodeType))
          );
        };
      ((a = F.prototype = new A()).constructor = F),
        (a.kill()._gc = !1),
        (a.ratio = 0),
        (a._firstPT = a._targets = a._overwrittenProps = a._startAt = null),
        (a._notifyPluginsOfEnabled = a._lazy = !1),
        (F.version = "1.20.2"),
        (F.defaultEase = a._ease = new w(null, null, 1, 1)),
        (F.defaultOverwrite = "auto"),
        (F.ticker = l),
        (F.autoSleep = 120),
        (F.lagSmoothing = function (t, e) {
          l.lagSmoothing(t, e);
        }),
        (F.selector =
          t.$ ||
          t.jQuery ||
          function (e) {
            var i = t.$ || t.jQuery;
            return i
              ? ((F.selector = i), i(e))
              : void 0 === n
              ? e
              : n.querySelectorAll
              ? n.querySelectorAll(e)
              : n.getElementById("#" === e.charAt(0) ? e.substr(1) : e);
          });
      var M = [],
        L = {},
        D = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        R = /[\+-]=-?[\.\d]/,
        I = function (t) {
          for (var e, i = this._firstPT; i; )
            (e = i.blob
              ? 1 === t && this.end
                ? this.end
                : t
                ? this.join("")
                : this.start
              : i.c * t + i.s),
              i.m
                ? (e = i.m(e, this._target || i.t))
                : 1e-6 > e && e > -1e-6 && !i.blob && (e = 0),
              i.f ? (i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e)) : (i.t[i.p] = e),
              (i = i._next);
        },
        j = function (t, e, i, n) {
          var o,
            s,
            r,
            a,
            l,
            c,
            u,
            h = [],
            d = 0,
            p = "",
            f = 0;
          for (
            h.start = t,
              h.end = e,
              t = h[0] = t + "",
              e = h[1] = e + "",
              i && (i(h), (t = h[0]), (e = h[1])),
              h.length = 0,
              o = t.match(D) || [],
              s = e.match(D) || [],
              n &&
                ((n._next = null), (n.blob = 1), (h._firstPT = h._applyPT = n)),
              l = s.length,
              a = 0;
            l > a;
            a++
          )
            (u = s[a]),
              (p += (c = e.substr(d, e.indexOf(u, d) - d)) || !a ? c : ","),
              (d += c.length),
              f ? (f = (f + 1) % 5) : "rgba(" === c.substr(-5) && (f = 1),
              u === o[a] || o.length <= a
                ? (p += u)
                : (p && (h.push(p), (p = "")),
                  (r = parseFloat(o[a])),
                  h.push(r),
                  (h._firstPT = {
                    _next: h._firstPT,
                    t: h,
                    p: h.length - 1,
                    s: r,
                    c:
                      ("=" === u.charAt(1)
                        ? parseInt(u.charAt(0) + "1", 10) *
                          parseFloat(u.substr(2))
                        : parseFloat(u) - r) || 0,
                    f: 0,
                    m: f && 4 > f ? Math.round : 0,
                  })),
              (d += u.length);
          return (
            (p += e.substr(d)) && h.push(p),
            (h.setRatio = I),
            R.test(e) && (h.end = 0),
            h
          );
        },
        H = function (t, e, i, n, o, s, r, a, l) {
          "function" == typeof n && (n = n(l || 0, t));
          var c = typeof t[e],
            u =
              "function" !== c
                ? ""
                : e.indexOf("set") ||
                  "function" != typeof t["get" + e.substr(3)]
                ? e
                : "get" + e.substr(3),
            h = "get" !== i ? i : u ? (r ? t[u](r) : t[u]()) : t[e],
            d = "string" == typeof n && "=" === n.charAt(1),
            p = {
              t: t,
              p: e,
              s: h,
              f: "function" === c,
              pg: 0,
              n: o || e,
              m: s ? ("function" == typeof s ? s : Math.round) : 0,
              pr: 0,
              c: d
                ? parseInt(n.charAt(0) + "1", 10) * parseFloat(n.substr(2))
                : parseFloat(n) - h || 0,
            };
          return (
            ("number" != typeof h || ("number" != typeof n && !d)) &&
              (r ||
              isNaN(h) ||
              (!d && isNaN(n)) ||
              "boolean" == typeof h ||
              "boolean" == typeof n
                ? ((p.fp = r),
                  (p = {
                    t: j(
                      h,
                      d ? parseFloat(p.s) + p.c : n,
                      a || F.defaultStringFilter,
                      p
                    ),
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 2,
                    pg: 0,
                    n: o || e,
                    pr: 0,
                    m: 0,
                  }))
                : ((p.s = parseFloat(h)),
                  d || (p.c = parseFloat(n) - p.s || 0))),
            p.c
              ? ((p._next = this._firstPT) && (p._next._prev = p),
                (this._firstPT = p),
                p)
              : void 0
          );
        },
        N = (F._internals = {
          isArray: m,
          isSelector: z,
          lazyTweens: M,
          blobDif: j,
        }),
        B = (F._plugins = {}),
        W = (N.tweenLookup = {}),
        q = 0,
        X = (N.reservedProps = {
          ease: 1,
          delay: 1,
          overwrite: 1,
          onComplete: 1,
          onCompleteParams: 1,
          onCompleteScope: 1,
          useFrames: 1,
          runBackwards: 1,
          startAt: 1,
          onUpdate: 1,
          onUpdateParams: 1,
          onUpdateScope: 1,
          onStart: 1,
          onStartParams: 1,
          onStartScope: 1,
          onReverseComplete: 1,
          onReverseCompleteParams: 1,
          onReverseCompleteScope: 1,
          onRepeat: 1,
          onRepeatParams: 1,
          onRepeatScope: 1,
          easeParams: 1,
          yoyo: 1,
          immediateRender: 1,
          repeat: 1,
          repeatDelay: 1,
          data: 1,
          paused: 1,
          reversed: 1,
          autoCSS: 1,
          lazy: 1,
          onOverwrite: 1,
          callbackScope: 1,
          stringFilter: 1,
          id: 1,
          yoyoEase: 1,
        }),
        V = {
          none: 0,
          all: 1,
          auto: 2,
          concurrent: 3,
          allOnStart: 4,
          preexisting: 5,
          true: 1,
          false: 0,
        },
        Y = (A._rootFramesTimeline = new O()),
        U = (A._rootTimeline = new O()),
        Q = 30,
        G = (N.lazyRender = function () {
          var t,
            e = M.length;
          for (L = {}; --e > -1; )
            (t = M[e]) &&
              !1 !== t._lazy &&
              (t.render(t._lazy[0], t._lazy[1], !0), (t._lazy = !1));
          M.length = 0;
        });
      (U._startTime = l.time),
        (Y._startTime = l.frame),
        (U._active = Y._active = !0),
        setTimeout(G, 1),
        (A._updateRoot = F.render =
          function () {
            var t, e, i;
            if (
              (M.length && G(),
              U.render((l.time - U._startTime) * U._timeScale, !1, !1),
              Y.render((l.frame - Y._startTime) * Y._timeScale, !1, !1),
              M.length && G(),
              l.frame >= Q)
            ) {
              for (i in ((Q = l.frame + (parseInt(F.autoSleep, 10) || 120)),
              W)) {
                for (t = (e = W[i].tweens).length; --t > -1; )
                  e[t]._gc && e.splice(t, 1);
                0 === e.length && delete W[i];
              }
              if (
                (!(i = U._first) || i._paused) &&
                F.autoSleep &&
                !Y._first &&
                1 === l._listeners.tick.length
              ) {
                for (; i && i._paused; ) i = i._next;
                i || l.sleep();
              }
            }
          }),
        l.addEventListener("tick", A._updateRoot);
      var Z = function (t, e, i) {
          var n,
            o,
            s = t._gsTweenID;
          if (
            (W[s || (t._gsTweenID = s = "t" + q++)] ||
              (W[s] = { target: t, tweens: [] }),
            e && (((n = W[s].tweens)[(o = n.length)] = e), i))
          )
            for (; --o > -1; ) n[o] === e && n.splice(o, 1);
          return W[s].tweens;
        },
        K = function (t, e, i, n) {
          var o,
            s,
            r = t.vars.onOverwrite;
          return (
            r && (o = r(t, e, i, n)),
            (r = F.onOverwrite) && (s = r(t, e, i, n)),
            !1 !== o && !1 !== s
          );
        },
        J = function (t, e, i, n, o) {
          var s, r, a, l;
          if (1 === n || n >= 4) {
            for (l = o.length, s = 0; l > s; s++)
              if ((a = o[s]) !== e) a._gc || (a._kill(null, t, e) && (r = !0));
              else if (5 === n) break;
            return r;
          }
          var c,
            u = e._startTime + d,
            h = [],
            p = 0,
            f = 0 === e._duration;
          for (s = o.length; --s > -1; )
            (a = o[s]) === e ||
              a._gc ||
              a._paused ||
              (a._timeline !== e._timeline
                ? ((c = c || tt(e, 0, f)), 0 === tt(a, c, f) && (h[p++] = a))
                : a._startTime <= u &&
                  a._startTime + a.totalDuration() / a._timeScale > u &&
                  (((f || !a._initted) && u - a._startTime <= 2e-10) ||
                    (h[p++] = a)));
          for (s = p; --s > -1; )
            if (
              ((a = h[s]),
              2 === n && a._kill(i, t, e) && (r = !0),
              2 !== n || (!a._firstPT && a._initted))
            ) {
              if (2 !== n && !K(a, e)) continue;
              a._enabled(!1, !1) && (r = !0);
            }
          return r;
        },
        tt = function (t, e, i) {
          for (
            var n = t._timeline, o = n._timeScale, s = t._startTime;
            n._timeline;

          ) {
            if (((s += n._startTime), (o *= n._timeScale), n._paused))
              return -100;
            n = n._timeline;
          }
          return (s /= o) > e
            ? s - e
            : (i && s === e) || (!t._initted && 2 * d > s - e)
            ? d
            : (s += t.totalDuration() / t._timeScale / o) > e + d
            ? 0
            : s - e - d;
        };
      (a._init = function () {
        var t,
          e,
          i,
          n,
          o,
          s,
          r = this.vars,
          a = this._overwrittenProps,
          l = this._duration,
          c = !!r.immediateRender,
          u = r.ease;
        if (r.startAt) {
          for (n in (this._startAt &&
            (this._startAt.render(-1, !0), this._startAt.kill()),
          (o = {}),
          r.startAt))
            o[n] = r.startAt[n];
          if (
            ((o.overwrite = !1),
            (o.immediateRender = !0),
            (o.lazy = c && !1 !== r.lazy),
            (o.startAt = o.delay = null),
            (o.onUpdate = r.onUpdate),
            (o.onUpdateScope = r.onUpdateScope || r.callbackScope || this),
            (this._startAt = F.to(this.target, 0, o)),
            c)
          )
            if (this._time > 0) this._startAt = null;
            else if (0 !== l) return;
        } else if (r.runBackwards && 0 !== l)
          if (this._startAt)
            this._startAt.render(-1, !0),
              this._startAt.kill(),
              (this._startAt = null);
          else {
            for (n in (0 !== this._time && (c = !1), (i = {}), r))
              (X[n] && "autoCSS" !== n) || (i[n] = r[n]);
            if (
              ((i.overwrite = 0),
              (i.data = "isFromStart"),
              (i.lazy = c && !1 !== r.lazy),
              (i.immediateRender = c),
              (this._startAt = F.to(this.target, 0, i)),
              c)
            ) {
              if (0 === this._time) return;
            } else
              this._startAt._init(),
                this._startAt._enabled(!1),
                this.vars.immediateRender && (this._startAt = null);
          }
        if (
          ((this._ease = u =
            u
              ? u instanceof w
                ? u
                : "function" == typeof u
                ? new w(u, r.easeParams)
                : x[u] || F.defaultEase
              : F.defaultEase),
          r.easeParams instanceof Array &&
            u.config &&
            (this._ease = u.config.apply(u, r.easeParams)),
          (this._easeType = this._ease._type),
          (this._easePower = this._ease._power),
          (this._firstPT = null),
          this._targets)
        )
          for (s = this._targets.length, t = 0; s > t; t++)
            this._initProps(
              this._targets[t],
              (this._propLookup[t] = {}),
              this._siblings[t],
              a ? a[t] : null,
              t
            ) && (e = !0);
        else
          e = this._initProps(
            this.target,
            this._propLookup,
            this._siblings,
            a,
            0
          );
        if (
          (e && F._onPluginEvent("_onInitAllProps", this),
          a &&
            (this._firstPT ||
              ("function" != typeof this.target && this._enabled(!1, !1))),
          r.runBackwards)
        )
          for (i = this._firstPT; i; )
            (i.s += i.c), (i.c = -i.c), (i = i._next);
        (this._onUpdate = r.onUpdate), (this._initted = !0);
      }),
        (a._initProps = function (e, i, n, o, s) {
          var r, a, l, c, u, h;
          if (null == e) return !1;
          for (r in (L[e._gsTweenID] && G(),
          this.vars.css ||
            (e.style &&
              e !== t &&
              e.nodeType &&
              B.css &&
              !1 !== this.vars.autoCSS &&
              (function (t, e) {
                var i,
                  n = {};
                for (i in t)
                  X[i] ||
                    (i in e &&
                      "transform" !== i &&
                      "x" !== i &&
                      "y" !== i &&
                      "width" !== i &&
                      "height" !== i &&
                      "className" !== i &&
                      "border" !== i) ||
                    !(!B[i] || (B[i] && B[i]._autoCSS)) ||
                    ((n[i] = t[i]), delete t[i]);
                t.css = n;
              })(this.vars, e)),
          this.vars))
            if (((h = this.vars[r]), X[r]))
              h &&
                (h instanceof Array || (h.push && m(h))) &&
                -1 !== h.join("").indexOf("{self}") &&
                (this.vars[r] = h = this._swapSelfInParams(h, this));
            else if (
              B[r] &&
              (c = new B[r]())._onInitTween(e, this.vars[r], this, s)
            ) {
              for (
                this._firstPT = u =
                  {
                    _next: this._firstPT,
                    t: c,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 1,
                    n: r,
                    pg: 1,
                    pr: c._priority,
                    m: 0,
                  },
                  a = c._overwriteProps.length;
                --a > -1;

              )
                i[c._overwriteProps[a]] = this._firstPT;
              (c._priority || c._onInitAllProps) && (l = !0),
                (c._onDisable || c._onEnable) &&
                  (this._notifyPluginsOfEnabled = !0),
                u._next && (u._next._prev = u);
            } else
              i[r] = H.call(
                this,
                e,
                r,
                "get",
                h,
                r,
                0,
                null,
                this.vars.stringFilter,
                s
              );
          return o && this._kill(o, e)
            ? this._initProps(e, i, n, o, s)
            : this._overwrite > 1 &&
              this._firstPT &&
              n.length > 1 &&
              J(e, this, i, this._overwrite, n)
            ? (this._kill(i, e), this._initProps(e, i, n, o, s))
            : (this._firstPT &&
                ((!1 !== this.vars.lazy && this._duration) ||
                  (this.vars.lazy && !this._duration)) &&
                (L[e._gsTweenID] = !0),
              l);
        }),
        (a.render = function (t, e, i) {
          var n,
            o,
            s,
            r,
            a = this._time,
            l = this._duration,
            c = this._rawPrevTime;
          if (t >= l - 1e-7 && t >= 0)
            (this._totalTime = this._time = l),
              (this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
              this._reversed ||
                ((n = !0),
                (o = "onComplete"),
                (i = i || this._timeline.autoRemoveChildren)),
              0 === l &&
                (this._initted || !this.vars.lazy || i) &&
                (this._startTime === this._timeline._duration && (t = 0),
                (0 > c ||
                  (0 >= t && t >= -1e-7) ||
                  (c === d && "isPause" !== this.data)) &&
                  c !== t &&
                  ((i = !0), c > d && (o = "onReverseComplete")),
                (this._rawPrevTime = r = !e || t || c === t ? t : d));
          else if (1e-7 > t)
            (this._totalTime = this._time = 0),
              (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0),
              (0 !== a || (0 === l && c > 0)) &&
                ((o = "onReverseComplete"), (n = this._reversed)),
              0 > t &&
                ((this._active = !1),
                0 === l &&
                  (this._initted || !this.vars.lazy || i) &&
                  (c >= 0 && (c !== d || "isPause" !== this.data) && (i = !0),
                  (this._rawPrevTime = r = !e || t || c === t ? t : d))),
              (!this._initted || (this._startAt && this._startAt.progress())) &&
                (i = !0);
          else if (((this._totalTime = this._time = t), this._easeType)) {
            var u = t / l,
              h = this._easeType,
              p = this._easePower;
            (1 === h || (3 === h && u >= 0.5)) && (u = 1 - u),
              3 === h && (u *= 2),
              1 === p
                ? (u *= u)
                : 2 === p
                ? (u *= u * u)
                : 3 === p
                ? (u *= u * u * u)
                : 4 === p && (u *= u * u * u * u),
              (this.ratio =
                1 === h
                  ? 1 - u
                  : 2 === h
                  ? u
                  : 0.5 > t / l
                  ? u / 2
                  : 1 - u / 2);
          } else this.ratio = this._ease.getRatio(t / l);
          if (this._time !== a || i) {
            if (!this._initted) {
              if ((this._init(), !this._initted || this._gc)) return;
              if (
                !i &&
                this._firstPT &&
                ((!1 !== this.vars.lazy && this._duration) ||
                  (this.vars.lazy && !this._duration))
              )
                return (
                  (this._time = this._totalTime = a),
                  (this._rawPrevTime = c),
                  M.push(this),
                  void (this._lazy = [t, e])
                );
              this._time && !n
                ? (this.ratio = this._ease.getRatio(this._time / l))
                : n &&
                  this._ease._calcEnd &&
                  (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
            }
            for (
              !1 !== this._lazy && (this._lazy = !1),
                this._active ||
                  (!this._paused &&
                    this._time !== a &&
                    t >= 0 &&
                    (this._active = !0)),
                0 === a &&
                  (this._startAt &&
                    (t >= 0
                      ? this._startAt.render(t, e, i)
                      : o || (o = "_dummyGS")),
                  this.vars.onStart &&
                    (0 !== this._time || 0 === l) &&
                    (e || this._callback("onStart"))),
                s = this._firstPT;
              s;

            )
              s.f
                ? s.t[s.p](s.c * this.ratio + s.s)
                : (s.t[s.p] = s.c * this.ratio + s.s),
                (s = s._next);
            this._onUpdate &&
              (0 > t &&
                this._startAt &&
                -1e-4 !== t &&
                this._startAt.render(t, e, i),
              e ||
                ((this._time !== a || n || i) && this._callback("onUpdate"))),
              o &&
                (!this._gc || i) &&
                (0 > t &&
                  this._startAt &&
                  !this._onUpdate &&
                  -1e-4 !== t &&
                  this._startAt.render(t, e, i),
                n &&
                  (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                  (this._active = !1)),
                !e && this.vars[o] && this._callback(o),
                0 === l &&
                  this._rawPrevTime === d &&
                  r !== d &&
                  (this._rawPrevTime = 0));
          }
        }),
        (a._kill = function (t, e, i) {
          if (
            ("all" === t && (t = null),
            null == t && (null == e || e === this.target))
          )
            return (this._lazy = !1), this._enabled(!1, !1);
          e =
            "string" != typeof e
              ? e || this._targets || this.target
              : F.selector(e) || e;
          var n,
            o,
            s,
            r,
            a,
            l,
            c,
            u,
            h,
            d =
              i &&
              this._time &&
              i._startTime === this._startTime &&
              this._timeline === i._timeline;
          if ((m(e) || z(e)) && "number" != typeof e[0])
            for (n = e.length; --n > -1; ) this._kill(t, e[n], i) && (l = !0);
          else {
            if (this._targets) {
              for (n = this._targets.length; --n > -1; )
                if (e === this._targets[n]) {
                  (a = this._propLookup[n] || {}),
                    (this._overwrittenProps = this._overwrittenProps || []),
                    (o = this._overwrittenProps[n] =
                      t ? this._overwrittenProps[n] || {} : "all");
                  break;
                }
            } else {
              if (e !== this.target) return !1;
              (a = this._propLookup),
                (o = this._overwrittenProps =
                  t ? this._overwrittenProps || {} : "all");
            }
            if (a) {
              if (
                ((c = t || a),
                (u =
                  t !== o &&
                  "all" !== o &&
                  t !== a &&
                  ("object" != typeof t || !t._tempKill)),
                i && (F.onOverwrite || this.vars.onOverwrite))
              ) {
                for (s in c) a[s] && (h || (h = []), h.push(s));
                if ((h || !t) && !K(this, i, e, h)) return !1;
              }
              for (s in c)
                (r = a[s]) &&
                  (d && (r.f ? r.t[r.p](r.s) : (r.t[r.p] = r.s), (l = !0)),
                  r.pg && r.t._kill(c) && (l = !0),
                  (r.pg && 0 !== r.t._overwriteProps.length) ||
                    (r._prev
                      ? (r._prev._next = r._next)
                      : r === this._firstPT && (this._firstPT = r._next),
                    r._next && (r._next._prev = r._prev),
                    (r._next = r._prev = null)),
                  delete a[s]),
                  u && (o[s] = 1);
              !this._firstPT && this._initted && this._enabled(!1, !1);
            }
          }
          return l;
        }),
        (a.invalidate = function () {
          return (
            this._notifyPluginsOfEnabled &&
              F._onPluginEvent("_onDisable", this),
            (this._firstPT =
              this._overwrittenProps =
              this._startAt =
              this._onUpdate =
                null),
            (this._notifyPluginsOfEnabled = this._active = this._lazy = !1),
            (this._propLookup = this._targets ? {} : []),
            A.prototype.invalidate.call(this),
            this.vars.immediateRender &&
              ((this._time = -d), this.render(Math.min(0, -this._delay))),
            this
          );
        }),
        (a._enabled = function (t, e) {
          if ((c || l.wake(), t && this._gc)) {
            var i,
              n = this._targets;
            if (n)
              for (i = n.length; --i > -1; )
                this._siblings[i] = Z(n[i], this, !0);
            else this._siblings = Z(this.target, this, !0);
          }
          return (
            A.prototype._enabled.call(this, t, e),
            !(!this._notifyPluginsOfEnabled || !this._firstPT) &&
              F._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
          );
        }),
        (F.to = function (t, e, i) {
          return new F(t, e, i);
        }),
        (F.from = function (t, e, i) {
          return (
            (i.runBackwards = !0),
            (i.immediateRender = 0 != i.immediateRender),
            new F(t, e, i)
          );
        }),
        (F.fromTo = function (t, e, i, n) {
          return (
            (n.startAt = i),
            (n.immediateRender =
              0 != n.immediateRender && 0 != i.immediateRender),
            new F(t, e, n)
          );
        }),
        (F.delayedCall = function (t, e, i, n, o) {
          return new F(e, 0, {
            delay: t,
            onComplete: e,
            onCompleteParams: i,
            callbackScope: n,
            onReverseComplete: e,
            onReverseCompleteParams: i,
            immediateRender: !1,
            lazy: !1,
            useFrames: o,
            overwrite: 0,
          });
        }),
        (F.set = function (t, e) {
          return new F(t, 0, e);
        }),
        (F.getTweensOf = function (t, e) {
          if (null == t) return [];
          var i, n, o, s;
          if (
            ((t = "string" != typeof t ? t : F.selector(t) || t),
            (m(t) || z(t)) && "number" != typeof t[0])
          ) {
            for (i = t.length, n = []; --i > -1; )
              n = n.concat(F.getTweensOf(t[i], e));
            for (i = n.length; --i > -1; )
              for (s = n[i], o = i; --o > -1; ) s === n[o] && n.splice(i, 1);
          } else if (t._gsTweenID)
            for (i = (n = Z(t).concat()).length; --i > -1; )
              (n[i]._gc || (e && !n[i].isActive())) && n.splice(i, 1);
          return n || [];
        }),
        (F.killTweensOf = F.killDelayedCallsTo =
          function (t, e, i) {
            "object" == typeof e && ((i = e), (e = !1));
            for (var n = F.getTweensOf(t, e), o = n.length; --o > -1; )
              n[o]._kill(i, t);
          });
      var et = _(
        "plugins.TweenPlugin",
        function (t, e) {
          (this._overwriteProps = (t || "").split(",")),
            (this._propName = this._overwriteProps[0]),
            (this._priority = e || 0),
            (this._super = et.prototype);
        },
        !0
      );
      if (
        ((a = et.prototype),
        (et.version = "1.19.0"),
        (et.API = 2),
        (a._firstPT = null),
        (a._addTween = H),
        (a.setRatio = I),
        (a._kill = function (t) {
          var e,
            i = this._overwriteProps,
            n = this._firstPT;
          if (null != t[this._propName]) this._overwriteProps = [];
          else for (e = i.length; --e > -1; ) null != t[i[e]] && i.splice(e, 1);
          for (; n; )
            null != t[n.n] &&
              (n._next && (n._next._prev = n._prev),
              n._prev
                ? ((n._prev._next = n._next), (n._prev = null))
                : this._firstPT === n && (this._firstPT = n._next)),
              (n = n._next);
          return !1;
        }),
        (a._mod = a._roundProps =
          function (t) {
            for (var e, i = this._firstPT; i; )
              (e =
                t[this._propName] ||
                (null != i.n && t[i.n.split(this._propName + "_").join("")])) &&
                "function" == typeof e &&
                (2 === i.f ? (i.t._applyPT.m = e) : (i.m = e)),
                (i = i._next);
          }),
        (F._onPluginEvent = function (t, e) {
          var i,
            n,
            o,
            s,
            r,
            a = e._firstPT;
          if ("_onInitAllProps" === t) {
            for (; a; ) {
              for (r = a._next, n = o; n && n.pr > a.pr; ) n = n._next;
              (a._prev = n ? n._prev : s) ? (a._prev._next = a) : (o = a),
                (a._next = n) ? (n._prev = a) : (s = a),
                (a = r);
            }
            a = e._firstPT = o;
          }
          for (; a; )
            a.pg && "function" == typeof a.t[t] && a.t[t]() && (i = !0),
              (a = a._next);
          return i;
        }),
        (et.activate = function (t) {
          for (var e = t.length; --e > -1; )
            t[e].API === et.API && (B[new t[e]()._propName] = t[e]);
          return !0;
        }),
        (y.plugin = function (t) {
          if (!(t && t.propName && t.init && t.API))
            throw "illegal plugin definition.";
          var e,
            i = t.propName,
            n = t.priority || 0,
            o = t.overwriteProps,
            s = {
              init: "_onInitTween",
              set: "setRatio",
              kill: "_kill",
              round: "_mod",
              mod: "_mod",
              initAll: "_onInitAllProps",
            },
            r = _(
              "plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin",
              function () {
                et.call(this, i, n), (this._overwriteProps = o || []);
              },
              !0 === t.global
            ),
            a = (r.prototype = new et(i));
          for (e in ((a.constructor = r), (r.API = t.API), s))
            "function" == typeof t[e] && (a[s[e]] = t[e]);
          return (r.version = t.version), et.activate([r]), r;
        }),
        (s = t._gsQueue))
      ) {
        for (r = 0; r < s.length; r++) s[r]();
        for (a in g)
          g[a].func ||
            t.console.log("GSAP encountered missing dependency: " + a);
      }
      c = !1;
    }
  })(
    "undefined" != typeof module &&
      module.exports &&
      "undefined" != typeof global
      ? global
      : this || window,
    "TweenMax"
  ),
  $("document").ready(function () {
    $(".ex-publications-v2-card--dropdown").click(function (t) {
      $(this).hasClass("active")
        ? ($(".ex-publications-v2-card--dropdown").removeClass("active"),
          $(".ex-publications-v2-card--dropdown--list").slideUp(100))
        : ($(".ex-publications-v2-card--dropdown").removeClass("active"),
          $(".ex-publications-v2-card--dropdown--list").slideUp(100),
          $(this).addClass("active"),
          $(".active .ex-publications-v2-card--dropdown--list").slideDown(100));
    }),
      $(document).on("click", function (t) {
        0 ===
          $(t.target).parents(".ex-publications-v2-card--dropdown").length &&
          ($(".ex-publications-v2-card--dropdown--list").slideUp(100),
          $(".ex-publications-v2-card--dropdown").removeClass("active"));
      });
  }),
  $(document).ready(function () {
    "undefined" != typeof XA &&
      XA.component.search.vent &&
      XA.component.search.vent.on("results-loaded", function () {
        activateAccordion();
      }),
      activateAccordion();
  });
var announcement = (function () {
  var t = function () {
      var t = document.querySelectorAll("header .TPN-announcement");
      t &&
        [].map.call(t, function (t) {
          "closed" == e() && t.parentNode.removeChild(t);
        });
    },
    e = function () {
      var t = JSON.parse(
          document
            .querySelector("[tpn-announcement]")
            .getAttribute("tpn-announcement")
        ),
        e = o(t.name);
      return "" != e && e == t.ID ? "closed" : "open";
    },
    i = function () {
      var t = document.querySelectorAll("header .TPN-announcement"),
        e = document.body;
      t &&
        [].map.call(t, function (t) {
          t.querySelector("[TPN-announce-close]").onclick = function (i) {
            i.preventDefault();
            var o = JSON.parse(
              document
                .querySelector("[tpn-announcement]")
                .getAttribute("tpn-announcement")
            );
            n(o.name, o.ID, o.date), t.classList.add("remove");
            var s = setInterval(function () {
              t.parentNode.removeChild(t);
            }, 900);
            clearInterval(s),
              e.classList.remove("TPN-announcement-inner"),
              $(e).css("padding-top", 0),
              $(".tpn-sitecore-form").length > 0 &&
                (screen.width < 992
                  ? $(e).css("padding-top", "50px")
                  : $(e).css("padding-top", "70px"));
          };
        });
    },
    n = function (t, e, i) {
      var n = "";
      if (i) {
        var o = new Date();
        o.setTime(o.getTime() + 24 * i * 60 * 60 * 1e3),
          (n = "expires=" + o.toGMTString());
      }
      document.cookie = t + "=" + e + ";" + n + "; path=/";
    },
    o = function (t) {
      for (
        var e = t + "=", i = document.cookie.split(";"), n = 0;
        n < i.length;
        n++
      ) {
        for (var o = i[n]; " " == o.charAt(0); ) o = o.substring(1);
        if (0 == o.indexOf(e)) return o.substring(e.length, o.length);
      }
      return "";
    },
    s = function () {
      var t = document.querySelectorAll("header .TPN-announcement"),
        e = document.querySelectorAll(".mobile-banner");
      setTimeout(function () {
        $(e).is(":visible") &&
          $("body.TPN-inner-page").css("margin-top", $(e).outerHeight());
      }, 500);
      var i = document.body;
      t.length > 0
        ? setTimeout(function () {
            i.classList.contains("TPN-inner-page") &&
            !window.location.href.toString().includes("SC-CSAT")
              ? (i.classList.add("TPN-announcement-inner"),
                $(i).css("padding-top", $(t).outerHeight() + 70))
              : window.location.href.toString().includes("SC-CSAT")
              ? (i.classList.add("TPN-announcement-inner"),
                $(i).css("padding-top", $(t).outerHeight()))
              : (i.classList.remove("TPN-announcement-inner"),
                $(i).css("padding-top", "0"));
          }, 2e3)
        : $(".tpn-sitecore-form").length > 0 &&
          (screen.width < 992
            ? $(i).css("padding-top", "50px")
            : $(i).css("padding-top", "70px"));
    };
  return {
    init: function () {
      t(), i(), s();
    },
  };
})();
jQuery().ready(function () {
  announcement.init();
}),
  $(document).ready(function () {
    $(".ex-img-card-v2").hover(function () {
      $(this)
        .find(".imgcard-title")
        .each(function () {
          $(this).truncate();
        });
    });
  });
