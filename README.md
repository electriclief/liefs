#Liefs Layout Manager (Dynamic)
For Web Pages (Typescript/Javascript)

![alt text](http://liefs.paperplane.io/images/liefslogo256.png "Liefs Layout MAnager")


###Note This project is in Alpha Stage - USE AT OWN RISK
Beta Scheduled for Feb1/2017
The Author has not fully tested this code.
(So far, So Good) - Still Not Fully Tested.
Also - NO debugging functios what-so-ever


###Super Fast Way To Understand this project:
[Click This Link, Resize Page A-LOT, then view source page](http://liefs.paperplane.io/html/examples/example_00.html)

Go One step further: The entire manager is tiny, For the power provided
Click to view all 23Kb of uncompressed code defining Liefs Layout Manager:
[http://liefs.paperplane.io/js/basic1.js](http://liefs.paperplane.io/js/basic1.js)

This project is hosted at:
[https://github.com/electriclief/liefs](https://github.com/electriclief/liefs)

Documentation and Examples: Self Hosting Github Website:
[http://liefs.paperplane.io/](http://liefs.paperplane.io/)

Define Web Pages By Items and Containers
- [x] Basic Module Up and Running
- [ ] Make Angular 2 Compatable
- [ ] Add dynamic "stretch" handlers

##Simple
[docs](http://liefs.paperplane.io/)
![alt text](https://github.com/electriclief/liefs/raw/master/images/core.png "Simple")

##Complex
[docs](http://liefs.paperplane.io/)
![alt text](http://leafdriving.kissr.com/images/Full002.jpg "Complex")

See Above Example Work, and how CRAZY easy it is to layout!
[above example Click This Link, Resize Page A-LOT, then view source page](http://liefs.paperplane.io/html/examples/example_0.html)

The "Try it out" on the right of THIS SCREEN ->
Copy/Paste This, and try it out!

```
var l=require("liefs-layout-manager/basic.js")
var I=l.I,V=l.V,h=l.h,v=l.v,update=l.update,items=l.items,containers=l.containers;
var o=V("Master Layout",
        h("fullhead", "100px",
                I("head1", "120px"),
                I("head2", "60%"),
                I("head3", "100px"),
                I("head4", "40%")
        ),
        h("menu_drop_arts_pic", "100%",
                I("menu", "100px"),
                v("drop_arts_pic", "100%",
                        I("dropdown", "80px"),
                        h("arts_pics", "100%",
                                I("article1", "30%"),
                                I("article2", "40%"),
                                I("article3", "30%"),
                                v("pics", "80px",
                                        I("pic1", "80px"),
                                        I("pic2", "80px"),
                                        I("hideme", "100%")
                                )
                        )
                )
        ),
        I("footer", "100px")
);
/* Too much output to see all at once  comment/uncomment below lines as required */

   JSON.stringify(update(1920,1080,o), undefined, 4);  // see liefs calculate each laout
// JSON.stringify(items, undefined, 4);                // liefs remembers all items 
// JSON.stringify(containers, undefined, 4);           // and containers
```








