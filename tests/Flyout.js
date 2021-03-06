// Copyright (c) Microsoft Corp.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.

describe("Flyout control directive tests", function () {
    var testTimeout = 5000;

    var scope,
        compile;

    beforeEach(angular.mock.module("winjs"));
    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
    }));

    function initControl(markup) {
        var element = angular.element(markup)[0];
        document.body.appendChild(element);
        var compiledControl = compile(element)(scope)[0];
        scope.$digest();
        return compiledControl;
    }

    it("should initialize a simple Flyout control", function () {
        var compiledControl = initControl("<win-flyout></win-flyout>");

        expect(compiledControl.winControl).toBeDefined();
        expect(compiledControl.winControl instanceof WinJS.UI.Flyout);
        expect(compiledControl.className).toContain("win-flyout");
    });

    it("should use the alignment attribute", function () {
        var compiledControl = initControl("<win-flyout alignment=\"'left'\"></win-flyout>");
        expect(compiledControl.winControl.alignment).toEqual("left");
    });

    it("should use the disabled attribute", function () {
        var compiledControl = initControl("<win-flyout disabled='true'></win-flyout>");
        expect(compiledControl.winControl.disabled).toBeTruthy();
    });

    it("should use the placement attribute", function () {
        var compiledControl = initControl("<win-flyout placement=\"'right'\"></win-flyout>");
        expect(compiledControl.winControl.placement).toEqual("right");
    });

    it("should use the anchor attribute", function () {
        var anchorEl = document.createElement("div");
        anchorEl.className = "flyoutTestAnchorElement";
        document.body.appendChild(anchorEl);
        scope.flyoutAnchor = anchorEl;
        var compiledControl = initControl("<win-flyout anchor='flyoutAnchor'></win-flyout>");
        expect(compiledControl.winControl.anchor).toBe(anchorEl);
    });

    it("should use the onshow and onhide event handlers and hidden attribute", function () {
        var gotBeforeShowEvent = false,
            gotAfterShowEvent = false,
            gotBeforeHideEvent = false,
            gotAfterHideEvent = false;
        scope.beforeShowEventHandler = function (e) {
            gotBeforeShowEvent = true;
        };
        scope.afterShowEventHandler = function (e) {
            gotAfterShowEvent = true;
        };
        scope.beforeHideEventHandler = function (e) {
            gotBeforeHideEvent = true;
        };
        scope.afterHideEventHandler = function (e) {
            gotAfterHideEvent = true;
        };
        scope.flyoutHidden = true;
        var compiledControl = initControl("<win-flyout on-before-show='beforeShowEventHandler($event)' on-after-show='afterShowEventHandler($event)' " +
                                           "on-before-hide='beforeHideEventHandler($event)' on-after-hide='afterHideEventHandler($event)' hidden='flyoutHidden'></win-flyout>");
        runs(function () {
            compiledControl.winControl.show(document.body);
        });

        waitsFor(function () {
            return (gotBeforeShowEvent && gotAfterShowEvent);
        }, "the Flyout's before+aftershow events", testTimeout);

        runs(function () {
            expect(scope.flyoutHidden).toBeFalsy();
            scope.flyoutHidden = true;
            scope.$digest();
        });

        waitsFor(function () {
            return (gotBeforeHideEvent && gotAfterHideEvent);
        }, "the Flyout's before+afterhide events", testTimeout);

        runs(function () {
            expect(scope.flyoutHidden).toBeTruthy();
            expect(compiledControl.winControl.hidden).toBeTruthy();
        });
    });

    afterEach(function () {
        var controls = document.querySelectorAll(".win-flyout");
        for (var i = 0; i < controls.length; i++) {
            controls[i].parentNode.removeChild(controls[i]);
        }
        var anchors = document.querySelectorAll(".flyoutTestAnchorElement");
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].parentNode.removeChild(anchors[i]);
        }
    });
});
