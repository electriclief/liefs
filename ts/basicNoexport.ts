function isIn(obj:any, key:string):boolean{return (key in obj)}
function isDefined(thing:any){ return !(thing === undefined)}
function asString(it:any):string{if (it['italics'] !== undefined)return <string>it;return undefined;}
function asNumber(it:any):number {if (it['toFixed'] !== undefined)return <number>it;return undefined;}
interface Item {
    label: string;
    start: string,
    size: Position,
    is_a_container?: Container,
    el?:Element}
function isItem(it:any):boolean{return isDefined(it) && isIn(it,'label') && isIn(it,'start') && isIn(it,'size');}
interface ItemObject {
    [index: string]: Item}
interface Position {
    label?: string,
    x: number,
    y: number,
    width: number,
    height: number,}
function isPosition(it:any){return isIn(it,'x') && isIn(it,'y') && isIn(it,'width') && isIn(it,'height');}
interface CoordObject {
    [index: string]: Position}
interface Container {
    label: string,
    direction: boolean, // 0 is horizontal, 1 is vertical
    items: Item[],
    margin: number,
    size?: Position,
    el?:Element,}
function isContainer(it:any){return isIn(it,'label') && isIn(it,'direction') && isIn(it,'items') && isIn(it,'margin');}
interface ContainerObject {
    [index: string]: Container}
function checkItem(item:Item){}
function checkContainer(container:Container) {}
function newItem(label: string, start: string|number, is_a_container: Container = null): Item {
    let realstart: string;
    if (asString(start)) realstart = <string>start;
    else realstart = (<number>start).toString()+"px";

    let new_item: Item = {label: label, start: realstart, size: _newCoordinates()};
    if (eh) checkItem(new_item);
    items[label] = new_item;
    if (is_a_container) items[label]['is_a_container'] = is_a_container;
    if (eh) checkItem(items[label]);
    return items[label];
}
function newContainer(label: string, true_is_hor: boolean, items: Item[], margin: number = 4): Container {
    let new_container = {
        label: label,
        direction: true_is_hor, // true is horizontal, false is vertical
        items: items,
        margin: margin
    };
    if (eh) checkContainer(new_container);
    containers[label] = new_container;
    return containers[label];
}
function update(width: number, height: number, container: Container,
                       x_offset: number = 0, y_offset: number = 0, include_parents: boolean = false):CoordObject {
    return _Private._updateRecursive(width, height, container, x_offset, y_offset, include_parents);
}
let containers: ContainerObject = {};
let items: ItemObject = {};
let eh:boolean = false; // errorHandling
let marginDefault:number = 0;
let magrinLast:number = 0;

function HC(id:string, margin:number = marginDefault, arrayOfItems: Array<Item>):Container{
    return newContainer("_"+id, true, arrayOfItems ,margin);}
function VC(id:string, margin:number = marginDefault, arrayOfItems: Array<Item>):Container{
    return newContainer("_"+id, false, arrayOfItems, margin);}
function I(id:string,start:string, container:Container = undefined):Item {
    return newItem(id,start,container)}
function HI(id:string, start:string, margin:number, arrayOfItems:Array<Item>):Item {
    return I(id, start, newContainer("_"+id, true, arrayOfItems));}
function VI(id:string, start:string, margin:number, arrayOfItems:Array<Item>):Item {
    return I(id, start, newContainer("_"+id, false, arrayOfItems));}
function V(id:string,
                  field2:number|string|Item,
                  field3:number|Item = undefined,
                  ...arrayOfItems: Array<Item>):Container {
    return <Container>HVC(id, field2, field3, arrayOfItems,VC, VI );}
function H(id:string,
                  field2:number|string|Item,
                  field3:number|Item = undefined,
                  ...arrayOfItems: Array<Item>):Container {
    return <Container>HVC(id, field2, field3, arrayOfItems,HC, HI );}
function v(id:string,
                  field2:number|string|Item,
                  field3:number|Item = undefined,
                  ...arrayOfItems: Array<Item>):Item {
    return <Item>HVC(id, field2, field3, arrayOfItems,VC, VI );}
function h(id:string,
                  field2:number|string|Item,
                  field3:number|Item = undefined,
                  ...arrayOfItems: Array<Item>):Item {
    return <Item>HVC(id, field2, field3, arrayOfItems,HC, HI );}
function HVC(id:string,
                    field2:number|string|Item,
                    field3:number|Item = undefined,
                    arrayOfItems: Array<Item>,
                    Droot2:Function,
                    D2:Function):Container|Item {
    let margin: number;
    let start: string;
    let newarrayOfItems:Array<Item>;

    if (asNumber(field2)) {                         // Hroot with margins only case possible
        margin = asNumber(field2);

        if (isDefined(field3) && isItem(field3)) {
            arrayOfItems.unshift(field3 as Item);
            return <Container>Droot2(id, margin, arrayOfItems);
        }
        else
            throw "error";
    }
    else if(asString(field2))                       // Must be H - then options...
    {
        start =(field2 as string);
        if(asNumber(field3)) {                      // H - c/w Margins
            margin = asNumber(field3);
            return <Item>D2(id,start,margin,arrayOfItems);
        }
        else if (isItem(field3)) {                  // H - no Margins
            return <Item>D2(id, start, undefined, [(field3 as Item)].concat(arrayOfItems));
        } else throw "error";
    }
    else if (isItem(field2)) {                      // Hroot with no Margins
        newarrayOfItems = [(field2 as Item)];
        if (isItem(field3))
            newarrayOfItems.push(field3 as Item);
        else if (isDefined(field3)) throw "Unexpected";
        return <Container>Droot2(id, undefined, newarrayOfItems.concat(arrayOfItems));
    }
}
function _newCoordinates(width: number = 0, height: number = 0, x: number = 0, y: number = 0, label: string = null): Position {
    let return_object: Position = <Position>{x: x, y: y, width: width, height: height};
    if (label) return_object['label'] = label;
    return return_object;}
class _Private {
    public static _updateRecursive(width: number, height: number, container: Container,
                                   x_offset: number = 0, y_offset: number = 0, include_parents: boolean = false): CoordObject {
        let fixed: number = _Private._fixed(container, width, height);
        let ReturnObject: CoordObject = {};
        _Private._percent(container, width, height, fixed);
        _Private._fill(container, x_offset, y_offset);
        for (let this_item of container.items) {
            let width = this_item.size.width + container.margin * 2;
            let height = this_item.size.height + container.margin * 2;
            let x = this_item.size.x - container.margin;
            let y = this_item.size.y - container.margin;
            if ('is_a_container' in this_item) {
                if (include_parents)
                    ReturnObject[this_item.label] = this_item.size;
                let temp = _Private._updateRecursive(width, height, this_item.is_a_container, x, y);
                for (let attrname in temp)
                    ReturnObject[attrname] = temp[attrname];
            }
            ReturnObject[this_item.label] = this_item.size;
        }
        return ReturnObject;
    }
    private static _fixed(container: Container, width: number, height: number): number {
        let NOT_DEFINED: number = -999;
        let fixed: number = 0;
        let new_size: number = NOT_DEFINED;
        for (let each_item of container.items) {
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
                    each_item.size.height = height - container.margin * 2
                }
                new_size = NOT_DEFINED;
            }
        }
        return fixed;
    }
    private static _percent(container: Container, width: number, height: number, fixed: number): void {
        let pixels_left_for_percent: number;
        let max = (container.direction) ? width : height;
        let new_percent_total: number;
        pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
        for (let each_item of container.items)
            if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
                let new_percent = parseInt(each_item.start.slice(0, -1));
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
    private static _fill(container: Container, x_offset: number = 0, y_offset: number = 0): void {
        let margin = container.margin;
        let sum: number = margin;
        for (let each_item of container.items) {
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
    }
}
let ManageArray: Array<[string,number,number]>;
let ManageCurrent:[string,number,number]|undefined;
let winW: number;
let winH: number;
let CurrentContainer: Container;
let CurrentSize:{length:number,width:number};
let callback:Function;
let DivIdsVisible: Array<string> = [];
let DivIdsInvisible: Array<string> = [];
let callbackThrottleId:any;
let resizeCallbackThrottle: number = 0;
let topDirective:LiefDirective;
function el(id:string):HTMLElement {return document.getElementById(id)}
function startHandler() {
    checkWinWH();
    window.onresize = window_resize;
}
function stopHandler() {
    window.onresize = () => {
    }
}
function window_resize(e) {
    window.clearTimeout(callbackThrottleId);
    callbackThrottleId = window.setTimeout(checkWinWH, resizeCallbackThrottle);
}
function manageAdd( containerLabel:string,
                           max_width:number = undefined, max_height:number = undefined): [string,number,number] {
    ManageArray.push([containerLabel, max_width, max_height]);
    return [containerLabel, max_width, max_height];
}
function use(ContainerId: string):void {
    if (ContainerId[0] !== '_')
        ContainerId = '_' + ContainerId;
    if (ContainerId in containers) {
        CurrentContainer = containers[ContainerId];
        ShowAndHide();
        checkWinWH();
    } else console.log("Container: " + ContainerId.slice(1) + " not Found");
}
function manageSet(obj: [string,number,number]|undefined = undefined):void {
    if (obj === undefined)
        ManageCurrent = undefined;
    else
        ManageCurrent = obj;
    checkWinWH();
}
function checkWinWH():void {
    if (document.body && document.body.offsetWidth) {
        winW = document.body.offsetWidth;
        winH = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
        winW = document.documentElement.offsetWidth;
        winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }
    checkManage([winW, winH]);
    resize_callback([winW, winH]);
}
function checkManage(obj: Array<number>) {
    let CurrentWidth:number = obj[0];
    let CurrentHeight:number = obj[1];
    let UseThisManage: boolean;

    if (ManageArray !== undefined) {
        for (let ThisManage of ManageArray) {
            UseThisManage = true;
            if (ThisManage[1] !== undefined)
                UseThisManage = (CurrentWidth <= ThisManage[1]);
            if (UseThisManage)
                if (ThisManage[2] !== undefined)
                    UseThisManage = (CurrentHeight <= ThisManage[2]);
            if (UseThisManage)
                if (ThisManage[0] !== CurrentContainer.label) {
                    use(ThisManage[0]);
                    break;
                }
        }
    }
}
function px(p:Position,key:string):string {return p[key].toString()+"px";}
function resize_callback(length_width: [number,number]):void {
    CurrentSize = {length: length_width[0], width: length_width[1]};
    let Coordinates: CoordObject = update(length_width[0], length_width[1], CurrentContainer);
    let El:HTMLElement ;
    for (let id in Coordinates) {
        let p: Position = Coordinates[id];
        El = el(id);
        if (El !== null) {
            El.style.left = px(p, 'x');
            El.style.top = px(p, 'y');
            El.style.width = px(p, 'width');
            El.style.height = px(p, 'height');
        }
    }
    if (callback !== undefined)
        callback(Coordinates);
}
function ShowAndHide():void {
    for (let ItemId of DivIdsVisible)
        smallit(el(ItemId), "visible");
    for (let ItemId of DivIdsInvisible)
        smallit(el(ItemId), "hidden");
}
function smallit(e:HTMLElement, visibility:string):void {
    e.style.visibility = visibility;
    e.style.left = "1px";
    e.style.top = "1px";
    e.style.width = "1px";
    e.style.height = "1px";
}
interface StartDirective {
    id?: string,
    tagname?: string,
    start?: number|string,
    el?: Element,
    contains: string,
}
interface StartDirectivesObjectOf {
    [index: string]: StartDirective
}
interface LiefDirective {
    margin?: number;
    callback$?: string;
    contains?: string;
    vertical: boolean,
    id: string;
}
interface LiefDirectivesObjectOf {
    [index: string]: LiefDirective
}
function starts():StartDirectivesObjectOf {
    let ret_dict:StartDirectivesObjectOf = {};
    for (let each of directive('[start]',["id","start","contains"])) {
        ret_dict[each['id']] = <StartDirective>each;
        each['el'].style.position = "fixed";
    }
    return ret_dict;
}
function liefs():LiefDirectivesObjectOf {
    let ret_dict:LiefDirectivesObjectOf = {};
    for(let each of  directive('liefs',["margin","callback","contains","vertical","id"])) {
        if (topDirective === undefined)
            topDirective = <LiefDirective>each;
        ret_dict[each['id']] = <LiefDirective>each;
    }
    return ret_dict;
}
function BuildContainers(): Container {
    let Starts:StartDirectivesObjectOf = starts();
    DivIdsVisible = [];
    DivIdsInvisible = [];
    for (let key in Starts)
        if (Starts[key].tagname !== 'liefs')
            DivIdsInvisible.push(Starts[key].id);
    let temp = liefs();
    if (topDirective)
        return BuildContainersRecursive(marginDefault, topDirective, temp);
    return undefined;
}
function BuildContainersRecursive(current_margin: number,
                                         liefDirective:LiefDirective,
                                         liefDirectivesObjectOf:LiefDirectivesObjectOf): Container {

    let index: number;
    let ItemList: Array<Item> = [];
    let thisStart: StartDirective;
    let dictStart:StartDirectivesObjectOf = starts();
    let ret_: Container;
    let true_is_hor:boolean = false;

    if (liefDirective.vertical !== undefined)
        true_is_hor = true;

    if ('margin' in liefDirective)
        current_margin = liefDirective.margin;

    for (let LiefItemId of liefDirective.contains.split("|")) {
        let new_item: Item;
        if (!(LiefItemId in dictStart))
            throw LiefItemId + " Either Missing, or 'start' attribute missing";
        thisStart = dictStart[LiefItemId];

        index = DivIdsInvisible.indexOf(thisStart.id);
        if (index > -1) {
            DivIdsInvisible.splice(index, 1);
            DivIdsVisible.push(LiefItemId);
        }

        if (thisStart.contains === null)
            new_item = newItem(LiefItemId, thisStart.start);

        else
            new_item = newItem(LiefItemId, thisStart.start,
                BuildContainersRecursive(current_margin, liefDirectivesObjectOf[LiefItemId], liefDirectivesObjectOf));
        items[LiefItemId] = new_item;
        ItemList.push(new_item);
    }
    containers[liefDirective.id] = newContainer(liefDirective.id, true_is_hor, ItemList, current_margin);
    return containers[liefDirective.id];
}

interface Directive {
    el:Element,
    tagname:string,
}

function Objectassign(obj:Directive):{} {
    let ro={};
    for (let key in obj) ro[key] = obj[key];
    return ro;
}

function directive(querrySelectorAll: string, attributesList: Array<string>): Array<{}> {
    let returnArray:Array<{}> = [];
    let Obj:Directive;
    let NodeList = document.querySelectorAll(querrySelectorAll);
    for (let i = 0; i < NodeList.length; i++) {
        Obj = {el: NodeList[i], tagname:NodeList[i].tagName};
        for (let eachAttribute of attributesList)
            if (NodeList[i].getAttribute(eachAttribute) === undefined) {
                Obj[eachAttribute] = undefined;
                if(NodeList[i].id !== undefined)
                    for(let each in document.querySelectorAll("["+eachAttribute+"]"))
                        if (each['id'] !== undefined)
                            if (each['id'] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        returnArray.push( Objectassign(Obj) );
    }
    return returnArray;
}
function directiveSetStyles(el: HTMLElement, stylesObject: {}):void {
//    if ('nativeElement' in el)
//        for (let key in stylesObject)
//            el['nativeElement']['style'][key] = stylesObject[key];
//    else
    for (let key in stylesObject)
        el['style'][key] = stylesObject[key];
}
function start(){
    let temp = BuildContainers();
    if (temp){
        use(temp.label);
        startHandler();
    }
//var tree = I("Tree","100px");
//var main = I("Main","100%");
//var both = H("Both",tree,main);
//use("Both");
//startHandler();
//var out = update(1000,1000,both)

//console.log(containers);
//console.log(items);
//console.log(directive("#Main",["id"]));
}
