"use strict";
function isIn(obj, key) { return (key in obj); }
exports.isIn = isIn;
function isDefined(thing) { return !(thing === undefined); }
exports.isDefined = isDefined;
function asString(it) { if (it['italics'] !== undefined)
    return it; return undefined; }
exports.asString = asString;
function asNumber(it) { if (it['toFixed'] !== undefined)
    return it; return undefined; }
exports.asNumber = asNumber;
function isItem(it) { return isDefined(it) && isIn(it, 'label') && isIn(it, 'start') && isIn(it, 'size'); }
exports.isItem = isItem;
function isPosition(it) { return isIn(it, 'x') && isIn(it, 'y') && isIn(it, 'width') && isIn(it, 'height'); }
exports.isPosition = isPosition;
function isContainer(it) { return isIn(it, 'label') && isIn(it, 'direction') && isIn(it, 'items') && isIn(it, 'margin'); }
exports.isContainer = isContainer;
function checkItem(item) { }
exports.checkItem = checkItem;
function checkContainer(container) { }
exports.checkContainer = checkContainer;
function newItem(label, start, is_a_container) {
    if (is_a_container === void 0) { is_a_container = null; }
    var realstart;
    if (asString(start))
        realstart = start;
    else
        realstart = start.toString() + "px";
    var new_item = { label: label, start: realstart, size: _newCoordinates() };
    if (exports.eh)
        checkItem(new_item);
    exports.items[label] = new_item;
    if (is_a_container)
        exports.items[label]['is_a_container'] = is_a_container;
    if (exports.eh)
        checkItem(exports.items[label]);
    return exports.items[label];
}
exports.newItem = newItem;
function newContainer(label, true_is_hor, items, margin) {
    if (margin === void 0) { margin = 4; }
    var new_container = {
        label: label,
        direction: true_is_hor,
        items: items,
        margin: margin
    };
    if (exports.eh)
        checkContainer(new_container);
    exports.containers[label] = new_container;
    return exports.containers[label];
}
exports.newContainer = newContainer;
function update(width, height, container, x_offset, y_offset, include_parents) {
    if (x_offset === void 0) { x_offset = 0; }
    if (y_offset === void 0) { y_offset = 0; }
    if (include_parents === void 0) { include_parents = false; }
    return _Private._updateRecursive(width, height, container, x_offset, y_offset, include_parents);
}
exports.update = update;
exports.containers = {};
exports.items = {};
exports.eh = false; // errorHandling
exports.marginDefault = 0;
exports.magrinLast = 0;
function HC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = exports.marginDefault; }
    return newContainer("_" + id, true, arrayOfItems, margin);
}
exports.HC = HC;
function VC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = exports.marginDefault; }
    return newContainer("_" + id, false, arrayOfItems, margin);
}
exports.VC = VC;
function I(id, start, container) {
    if (container === void 0) { container = undefined; }
    return newItem(id, start, container);
}
exports.I = I;
function HI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, true, arrayOfItems));
}
exports.HI = HI;
function VI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, false, arrayOfItems));
}
exports.VI = VI;
function V(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
exports.V = V;
function H(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
exports.H = H;
function v(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
exports.v = v;
function h(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
exports.h = h;
function HVC(id, field2, field3, arrayOfItems, Droot2, D2) {
    if (field3 === void 0) { field3 = undefined; }
    var margin;
    var start;
    var newarrayOfItems;
    if (asNumber(field2)) {
        margin = asNumber(field2);
        if (isDefined(field3) && isItem(field3)) {
            arrayOfItems.unshift(field3);
            return Droot2(id, margin, arrayOfItems);
        }
        else
            throw "error";
    }
    else if (asString(field2)) {
        start = field2;
        if (asNumber(field3)) {
            margin = asNumber(field3);
            return D2(id, start, margin, arrayOfItems);
        }
        else if (isItem(field3)) {
            return D2(id, start, undefined, [field3].concat(arrayOfItems));
        }
        else
            throw "error";
    }
    else if (isItem(field2)) {
        newarrayOfItems = [field2];
        if (isItem(field3))
            newarrayOfItems.push(field3);
        else if (isDefined(field3))
            throw "Unexpected";
        return Droot2(id, undefined, newarrayOfItems.concat(arrayOfItems));
    }
}
exports.HVC = HVC;
function _newCoordinates(width, height, x, y, label) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = 0; }
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (label === void 0) { label = null; }
    var return_object = { x: x, y: y, width: width, height: height };
    if (label)
        return_object['label'] = label;
    return return_object;
}
exports._newCoordinates = _newCoordinates;
var _Private = (function () {
    function _Private() {
    }
    _Private._updateRecursive = function (width, height, container, x_offset, y_offset, include_parents) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        if (include_parents === void 0) { include_parents = false; }
        var fixed = _Private._fixed(container, width, height);
        var ReturnObject = {};
        _Private._percent(container, width, height, fixed);
        _Private._fill(container, x_offset, y_offset);
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var this_item = _a[_i];
            var width_1 = this_item.size.width + container.margin * 2;
            var height_1 = this_item.size.height + container.margin * 2;
            var x = this_item.size.x - container.margin;
            var y = this_item.size.y - container.margin;
            if ('is_a_container' in this_item) {
                if (include_parents)
                    ReturnObject[this_item.label] = this_item.size;
                var temp = _Private._updateRecursive(width_1, height_1, this_item.is_a_container, x, y);
                for (var attrname in temp)
                    ReturnObject[attrname] = temp[attrname];
            }
            ReturnObject[this_item.label] = this_item.size;
        }
        return ReturnObject;
    };
    _Private._fixed = function (container, width, height) {
        var NOT_DEFINED = -999;
        var fixed = 0;
        var new_size = NOT_DEFINED;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (each_item.start.slice(-2) === "px")
                new_size = parseInt(each_item.start.slice(0, -2));
            if (new_size !== NOT_DEFINED) {
                fixed = fixed + new_size;
                if (!container.direction) {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = new_size;
                }
                else {
                    each_item.size.width = new_size;
                    each_item.size.height = height - container.margin * 2;
                }
                new_size = NOT_DEFINED;
            }
        }
        return fixed;
    };
    _Private._percent = function (container, width, height, fixed) {
        var pixels_left_for_percent;
        var max = (container.direction) ? width : height;
        var new_percent_total;
        pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
                var new_percent = parseInt(each_item.start.slice(0, -1));
                if (container.direction) {
                    each_item.size.width = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                    each_item.size.height = height - container.margin * 2;
                }
                else {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                }
            }
        }
    };
    _Private._fill = function (container, x_offset, y_offset) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        var margin = container.margin;
        var sum = margin;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (container.direction) {
                each_item.size.x = x_offset + sum;
                sum = sum + each_item.size.width + margin;
                each_item.size.y = y_offset + margin;
            }
            else {
                each_item.size.x = x_offset + margin;
                each_item.size.y = y_offset + sum;
                sum = sum + each_item.size.height + margin;
            }
        }
    };
    return _Private;
}());
exports._Private = _Private;
exports.DivIdsVisible = [];
exports.DivIdsInvisible = [];
exports.resizeCallbackThrottle = 0;
function el(id) { return document.getElementById(id); }
exports.el = el;
function startHandler() {
    checkWinWH();
    window.onresize = window_resize;
}
exports.startHandler = startHandler;
function stopHandler() {
    window.onresize = function () {
    };
}
exports.stopHandler = stopHandler;
function window_resize(e) {
    window.clearTimeout(exports.callbackThrottleId);
    exports.callbackThrottleId = window.setTimeout(checkWinWH, exports.resizeCallbackThrottle);
}
exports.window_resize = window_resize;
function manageAdd(containerLabel, max_width, max_height) {
    if (max_width === void 0) { max_width = undefined; }
    if (max_height === void 0) { max_height = undefined; }
    exports.ManageArray.push([containerLabel, max_width, max_height]);
    return [containerLabel, max_width, max_height];
}
exports.manageAdd = manageAdd;
function use(ContainerId) {
    if (ContainerId[0] !== '_')
        ContainerId = '_' + ContainerId;
    if (ContainerId in exports.containers) {
        exports.CurrentContainer = exports.containers[ContainerId];
        ShowAndHide();
        checkWinWH();
    }
    else
        console.log("Container: " + ContainerId.slice(1) + " not Found");
}
exports.use = use;
function manageSet(obj) {
    if (obj === void 0) { obj = undefined; }
    if (obj === undefined)
        exports.ManageCurrent = undefined;
    else
        exports.ManageCurrent = obj;
    checkWinWH();
}
exports.manageSet = manageSet;
function checkWinWH() {
    if (document.body && document.body.offsetWidth) {
        exports.winW = document.body.offsetWidth;
        exports.winH = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
        exports.winW = document.documentElement.offsetWidth;
        exports.winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        exports.winW = window.innerWidth;
        exports.winH = window.innerHeight;
    }
    checkManage([exports.winW, exports.winH]);
    resize_callback([exports.winW, exports.winH]);
}
exports.checkWinWH = checkWinWH;
function checkManage(obj) {
    var CurrentWidth = obj[0];
    var CurrentHeight = obj[1];
    var UseThisManage;
    if (exports.ManageArray !== undefined) {
        for (var _i = 0, ManageArray_1 = exports.ManageArray; _i < ManageArray_1.length; _i++) {
            var ThisManage = ManageArray_1[_i];
            UseThisManage = true;
            if (ThisManage[1] !== undefined)
                UseThisManage = (CurrentWidth <= ThisManage[1]);
            if (UseThisManage)
                if (ThisManage[2] !== undefined)
                    UseThisManage = (CurrentHeight <= ThisManage[2]);
            if (UseThisManage)
                if (ThisManage[0] !== exports.CurrentContainer.label) {
                    use(ThisManage[0]);
                    break;
                }
        }
    }
}
exports.checkManage = checkManage;
function px(p, key) { return p[key].toString() + "px"; }
exports.px = px;
function resize_callback(length_width) {
    exports.CurrentSize = { length: length_width[0], width: length_width[1] };
    var Coordinates = update(length_width[0], length_width[1], exports.CurrentContainer);
    var El;
    for (var id in Coordinates) {
        var p = Coordinates[id];
        El = el(id);
        if (El !== null) {
            El.style.left = px(p, 'x');
            El.style.top = px(p, 'y');
            El.style.width = px(p, 'width');
            El.style.height = px(p, 'height');
        }
    }
    if (exports.callback !== undefined)
        exports.callback(Coordinates);
}
exports.resize_callback = resize_callback;
function ShowAndHide() {
    for (var _i = 0, DivIdsVisible_1 = exports.DivIdsVisible; _i < DivIdsVisible_1.length; _i++) {
        var ItemId = DivIdsVisible_1[_i];
        smallit(el(ItemId), "visible");
    }
    for (var _a = 0, DivIdsInvisible_1 = exports.DivIdsInvisible; _a < DivIdsInvisible_1.length; _a++) {
        var ItemId = DivIdsInvisible_1[_a];
        smallit(el(ItemId), "hidden");
    }
}
exports.ShowAndHide = ShowAndHide;
function smallit(e, visibility) {
    e.style.visibility = visibility;
    e.style.left = "1px";
    e.style.top = "1px";
    e.style.width = "1px";
    e.style.height = "1px";
}
exports.smallit = smallit;
function starts() {
    var ret_dict = {};
    for (var _i = 0, _a = directive('[start]', ["id", "start", "contains"]); _i < _a.length; _i++) {
        var each = _a[_i];
        ret_dict[each['id']] = each;
        each['el'].style.position = "fixed";
    }
    return ret_dict;
}
exports.starts = starts;
function liefs() {
    var ret_dict = {};
    for (var _i = 0, _a = directive('liefs', ["margin", "callback", "contains", "vertical", "id"]); _i < _a.length; _i++) {
        var each = _a[_i];
        if (exports.topDirective === undefined)
            exports.topDirective = each;
        ret_dict[each['id']] = each;
    }
    return ret_dict;
}
exports.liefs = liefs;
function BuildContainers() {
    var Starts = starts();
    exports.DivIdsVisible = [];
    exports.DivIdsInvisible = [];
    for (var key in Starts)
        if (Starts[key].tagname !== 'liefs')
            exports.DivIdsInvisible.push(Starts[key].id);
    var temp = liefs();
    if (exports.topDirective)
        return BuildContainersRecursive(exports.marginDefault, exports.topDirective, temp);
    return undefined;
}
exports.BuildContainers = BuildContainers;
function BuildContainersRecursive(current_margin, liefDirective, liefDirectivesObjectOf) {
    var index;
    var ItemList = [];
    var thisStart;
    var dictStart = starts();
    var ret_;
    var true_is_hor = false;
    if (liefDirective.vertical !== undefined)
        true_is_hor = true;
    if ('margin' in liefDirective)
        current_margin = liefDirective.margin;
    for (var _i = 0, _a = liefDirective.contains.split("|"); _i < _a.length; _i++) {
        var LiefItemId = _a[_i];
        var new_item = void 0;
        if (!(LiefItemId in dictStart))
            throw LiefItemId + " Either Missing, or 'start' attribute missing";
        thisStart = dictStart[LiefItemId];
        index = exports.DivIdsInvisible.indexOf(thisStart.id);
        if (index > -1) {
            exports.DivIdsInvisible.splice(index, 1);
            exports.DivIdsVisible.push(LiefItemId);
        }
        if (thisStart.contains === null)
            new_item = newItem(LiefItemId, thisStart.start);
        else
            new_item = newItem(LiefItemId, thisStart.start, BuildContainersRecursive(current_margin, liefDirectivesObjectOf[LiefItemId], liefDirectivesObjectOf));
        exports.items[LiefItemId] = new_item;
        ItemList.push(new_item);
    }
    exports.containers[liefDirective.id] = newContainer(liefDirective.id, true_is_hor, ItemList, current_margin);
    return exports.containers[liefDirective.id];
}
exports.BuildContainersRecursive = BuildContainersRecursive;
function Objectassign(obj) {
    var ro = {};
    for (var key in obj)
        ro[key] = obj[key];
    return ro;
}
exports.Objectassign = Objectassign;
function directive(querrySelectorAll, attributesList) {
    var returnArray = [];
    var Obj;
    var NodeList = document.querySelectorAll(querrySelectorAll);
    for (var i = 0; i < NodeList.length; i++) {
        Obj = { el: NodeList[i], tagname: NodeList[i].tagName };
        for (var _i = 0, attributesList_1 = attributesList; _i < attributesList_1.length; _i++) {
            var eachAttribute = attributesList_1[_i];
            if (NodeList[i].getAttribute(eachAttribute) === undefined) {
                Obj[eachAttribute] = undefined;
                if (NodeList[i].id !== undefined)
                    for (var each in document.querySelectorAll("[" + eachAttribute + "]"))
                        if (each['id'] !== undefined)
                            if (each['id'] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        }
        returnArray.push(Objectassign(Obj));
    }
    return returnArray;
}
exports.directive = directive;
function directiveSetStyles(el, stylesObject) {
    for (var key in stylesObject)
        el['style'][key] = stylesObject[key];
}
exports.directiveSetStyles = directiveSetStyles;
function start() {
    var temp = BuildContainers();
    if (temp) {
        use(temp.label);
        startHandler();
    }
}
exports.start = start;
