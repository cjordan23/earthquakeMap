! function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function (a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
}({
    1: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h;
        d = {
            accordions: null,
            el: null
        }, e = {
            toggleText: "Details",
            toggleElement: "span",
            content: "Contents",
            classes: "accordion-standard"
        }, f = "accordion-closed", g = "accordion-toggle", h = "accordion-content";
        var i = function (a) {
                for (var b = 1, c = arguments.length; c > b; b++) {
                    var d = arguments[b];
                    for (var e in d) a[e] = d[e]
                }
                return a
            },
            j = function (a) {
                var b = a.target;
                b.classList.contains(g) && b.parentElement.classList.toggle(f)
            },
            k = function (a) {
                var b, c, f, k;
                return b = {
                    addAccordion: null,
                    destroy: null
                }, c = function (a) {
                    var c, e;
                    if (k = i({}, d, a), f = k.el || document.createElement("section"), f.addEventListener("click", j), a.accordions)
                        for (e = a.accordions.length, c = 0; e > c; c++) b.addAccordion(a.accordions[c])
                }, b.addAccordion = function (a) {
                    var b, c, d;
                    a = i({}, e, a), b = document.createElement("section"), b.className = "accordion " + a.classes, c = document.createElement(a.toggleElement), c.className = g, c.innerHTML = a.toggleText, b.appendChild(c), d = document.createElement("div"), d.className = h, a.contentText ? d.innerHTML = a.contentText : "string" == typeof a.content ? d.innerHTML = a.content : d.appendChild(a.content), b.appendChild(d), f.appendChild(b)
                }, b.destroy = function () {
                    f.removeEventListener("click", j), f = null, k = null, b = null
                }, c(a), a = null, b
            };
        b.exports = k
    }, {}],
    2: [function (require, module, exports) {
        "use strict";
        L.Util.ajax = function (url, cb) {
            void 0 === window.XMLHttpRequest && (window.XMLHttpRequest = function () {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } catch (a) {
                    throw new Error("XMLHttpRequest is not supported")
                }
            });
            var response, request = new XMLHttpRequest;
            request.open("GET", url), request.onreadystatechange = function () {
                4 === request.readyState && 200 === request.status && (response = window.JSON ? JSON.parse(request.responseText) : eval("(" + request.responseText + ")"), cb(response))
            }, request.send()
        }, L.UtfGrid = L.Class.extend({
            includes: L.Mixin.Events,
            options: {
                subdomains: "abc",
                minZoom: 0,
                maxZoom: 12,
                tileSize: 256,
                resolution: 4,
                useJsonP: !0,
                pointerCursor: !0
            },
            _mouseOn: null,
            initialize: function (a, b) {
                L.Util.setOptions(this, b), this._url = a, this._cache = {};
                for (var c = 0; window["lu" + c];) c++;
                this._windowKey = "lu" + c, window[this._windowKey] = {};
                var d = this.options.subdomains;
                "string" == typeof this.options.subdomains && (this.options.subdomains = d.split(""))
            },
            onAdd: function (a) {
                this._map = a, this._container = this._map._container, this._update();
                var b = this._map.getZoom();
                b > this.options.maxZoom || b < this.options.minZoom || (a.on("click", this._click, this), a.on("mousemove", this._move, this), a.on("moveend", this._update, this))
            },
            onRemove: function () {
                var a = this._map;
                a.off("click", this._click, this), a.off("mousemove", this._move, this), a.off("moveend", this._update, this)
            },
            _click: function (a) {
                this.fire("click", this._objectForEvent(a))
            },
            _move: function (a) {
                var b = this._objectForEvent(a);
                b.data !== this._mouseOn ? (this._mouseOn && (this.fire("mouseout", {
                    latlng: a.latlng,
                    data: this._mouseOn
                }), this.options.pointerCursor && (this._container.style.cursor = "")), b.data && (this.fire("mouseover", b), this.options.pointerCursor && (this._container.style.cursor = "pointer")), this._mouseOn = b.data) : b.data && this.fire("mousemove", b)
            },
            _objectForEvent: function (a) {
                var b = this._map,
                    c = b.project(a.latlng),
                    d = this.options.tileSize,
                    e = this.options.resolution,
                    f = Math.floor(c.x / d),
                    g = Math.floor(c.y / d),
                    h = Math.floor((c.x - f * d) / e),
                    i = Math.floor((c.y - g * d) / e),
                    j = b.options.crs.scale(b.getZoom()) / d;
                f = (f + j) % j, g = (g + j) % j;
                var k = this._cache[b.getZoom() + "_" + f + "_" + g];
                if (!k) return {
                    latlng: a.latlng,
                    data: null
                };
                var l = this._utfDecode(k.grid[i].charCodeAt(h)),
                    m = k.keys[l],
                    n = k.data[m];
                return k.data.hasOwnProperty(m) || (n = null), {
                    latlng: a.latlng,
                    data: n
                }
            },
            _update: function () {
                var a = this._map.getPixelBounds(),
                    b = this._map.getZoom(),
                    c = this.options.tileSize;
                if (!(b > this.options.maxZoom || b < this.options.minZoom))
                    for (var d = new L.Point(Math.floor(a.min.x / c), Math.floor(a.min.y / c)), e = new L.Point(Math.floor(a.max.x / c), Math.floor(a.max.y / c)), f = this._map.options.crs.scale(b) / c, g = d.x; g <= e.x; g++)
                        for (var h = d.y; h <= e.y; h++) {
                            var i = (g + f) % f,
                                j = (h + f) % f,
                                k = b + "_" + i + "_" + j;
                            this._cache.hasOwnProperty(k) || (this._cache[k] = null, this.options.useJsonP ? this._loadTileP(b, i, j) : this._loadTile(b, i, j))
                        }
            },
            _loadTileP: function (a, b, c) {
                var d = document.getElementsByTagName("head")[0],
                    e = a + "_" + b + "_" + c,
                    f = "lu_" + e,
                    g = this._windowKey,
                    h = this,
                    i = L.Util.template(this._url, L.Util.extend({
                        s: L.TileLayer.prototype._getSubdomain.call(this, {
                            x: b,
                            y: c
                        }),
                        z: a,
                        x: b,
                        y: c,
                        cb: g + "." + f
                    }, this.options)),
                    j = document.createElement("script");
                j.setAttribute("type", "text/javascript"), j.setAttribute("src", i), window[g][f] = function (a) {
                    h._cache[e] = a, delete window[g][f], d.removeChild(j)
                }, d.appendChild(j)
            },
            _loadTile: function (a, b, c) {
                var d = L.Util.template(this._url, L.Util.extend({
                        s: L.TileLayer.prototype._getSubdomain.call(this, {
                            x: b,
                            y: c
                        }),
                        z: a,
                        x: b,
                        y: c
                    }, this.options)),
                    e = a + "_" + b + "_" + c,
                    f = this;
                L.Util.ajax(d, function (a) {
                    f._cache[e] = a
                })
            },
            _utfDecode: function (a) {
                return a >= 93 && a--, a >= 35 && a--, a - 32
            }
        }), L.utfGrid = function (a, b) {
            return new L.UtfGrid(a, b)
        }, module.exports = L.UtfGrid
    }, {}],
    3: [function (a, b, c) {
        "use strict";
        var d = L.Control.extend({
            options: {
                position: "bottomright",
                separator: " : ",
                emptyString: "Unavailable",
                lngFirst: !1,
                numDigits: 3,
                lngFormatter: function (a) {
                    return [Math.abs(a).toFixed(3), "&deg;", 0 > a ? "W" : "E"].join("")
                },
                latFormatter: function (a) {
                    return [Math.abs(a).toFixed(3), "&deg;", 0 > a ? "S" : "N"].join("")
                }
            },
            onAdd: function (a) {
                return this._container = L.DomUtil.create("div", "leaflet-control-background leaflet-control-mouseposition"), L.DomEvent.disableClickPropagation(this._container), a.on("mousemove", this._onMouseMove, this), this._container.innerHTML = this.options.emptyString, this._container
            },
            onRemove: function (a) {
                a.off("mousemove", this._onMouseMove)
            },
            _onMouseMove: function (a) {
                var b = L.Util.formatNum(a.latlng.lng, this.options.numDigits);
                b = b >= 0 ? (b + 180) % 360 - 180 : (b + 180 + 360 * Math.ceil(Math.abs(b + 180) / 360)) % 360 - 180;
                var c = L.Util.formatNum(a.latlng.lat, this.options.numDigits);
                this.options.lngFormatter && (b = this.options.lngFormatter(b)), this.options.latFormatter && (c = this.options.latFormatter(c));
                var d = this.options.lngFirst ? b + this.options.separator + c : c + this.options.separator + b;
                this._container.innerHTML = d
            }
        });
        L.Control.MousePosition = d, L.control.mousePosition = function (a) {
            return new d(a)
        }, b.exports = L.control.mousePosition
    }, {}],
    4: [function (a, b, c) {
        "use strict";
        var d = a("hazdev-webutils/src/util/Util"),
            e = "zoomto-control",
            f = {
                locations: [{
                    title: "U.S.",
                    id: "us",
                    bounds: [
                        [50, -125],
                        [24.6, -65]
                    ]
                }, {
                    title: "World",
                    id: "world",
                    bounds: [
                        [70, 20],
                        [-70, 380]
                    ]
                }],
                position: "topleft"
            },
            g = L.Control.extend({
                initialize: function (a) {
                    L.Util.setOptions(this, L.Util.extend({}, f, a))
                },
                _setZoom: function (a) {
                    var b, c, e, f;
                    for (e = (this.options || {}).locations || [], c = e.length, a = d.getEvent(a), f = a.target.value, b = 0; c > b; b++)
                        if (e[b].id === f) {
                            this._map.fitBounds(e[b].bounds);
                            break
                        } a.target.selectedIndex = 0
                },
                onAdd: function (a) {
                    var b, c, d, f, g, h;
                    for (f = (this.options || {}).locations || [], d = f.length, b = document.createElement("div"), b.classList.add(e), h = b.appendChild(document.createElement("select")), h.classList.add(e + "-list"), g = h.appendChild(document.createElement("option")), g.innerHTML = "Zoom to...", g.value = "jump", c = 0; d > c; c++) g = h.appendChild(document.createElement("option")), g.innerHTML = f[c].title, g.value = f[c].id;
                    return this._container = b, this._map = a, L.DomEvent.disableClickPropagation(b), L.DomEvent.on(h, "change", this._setZoom, this), b
                },
                onRemove: function () {
                    var a;
                    a = this._container.querySelector("." + e + "-list"), L.DomEvent.off(a, "change", this._setZoom), this._container = null, this._map = null
                }
            });
        L.Control.ZoomToControl = g, L.control.zoomToControl = function (a) {
            return new g(a)
        }, b.exports = L.control.zoomToControl
    }, {
        "hazdev-webutils/src/util/Util": 21
    }],
    5: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h = a("leaflet/layer/TileProvider"),
            i = a("hazdev-webutils/src/util/Util");
        d = "cartodb", f = "esri", g = {}, e = {
            provider: f
        }, g[d] = {
            url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
            options: {
                subdomains: "abcd",
                attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            }
        }, g[f] = {
            url: "https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg",
            options: {
                subdomains: ["server", "services"],
                attribution: "Sources: Esri, DeLorme, HERE, MapmyIndia,  &copy; OpenStreetMap contributors, and the GIS community"
            }
        };
        var j = function (a) {
            try {
                return h.create(g, i.extend({}, e, a))
            } catch (b) {
                return h.create(g, e)
            }
        };
        j.CARTODB = d, j.ESRI = f, b.exports = j
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/layer/TileProvider": 12
    }],
    6: [function (a, b, c) {
        "use strict";
        var d = a("hazdev-webutils/src/util/Util"),
            e = {
                legend: null
            },
            f = L.TileLayer.extend({
                initialize: function (a, b) {
                    b = d.extend({}, e, b), this._legends = b.legends || null, L.TileLayer.prototype.initialize.call(this, a, b)
                },
                getLegends: function () {
                    return this._legends
                }
            });
        L.LegendLayer = f, L.legendLayer = function (a, b) {
            return new L.LegendLayer(a, b)
        }, b.exports = L.legendLayer
    }, {
        "hazdev-webutils/src/util/Util": 21
    }],
    7: [function (a, b, c) {
        "use strict";
        var d = a("leaflet/UtfGrid"),
            e = a("hazdev-webutils/src/util/Util"),
            f = "leaflet-mouseover-tooltip";
        L.MouseOverLayer = L.LayerGroup.extend({
            _initialized: !1,
            initialize: function (a) {
                this._tileLayer = new L.TileLayer(a.tileUrl, a.tileOpts), this._dataLayer = new d(a.dataUrl, a.dataOpts), this._legends = a.legends || null, "string" == typeof a.tiptext && (this._tiptext = a.tiptext, this._tooltip = L.DomUtil.create("span", f), this.on("mouseover", this._onMouseOver, this), this.on("mouseout", this._onMouseOut, this)), L.LayerGroup.prototype.initialize.call(this, []), this.addLayer(this._tileLayer), e.isMobile() || this.addLayer(this._dataLayer), this._initialized = !0
            },
            getLegends: function () {
                return this._legends
            },
            on: function () {
                d.prototype.on.apply(this._dataLayer, arguments)
            },
            off: function () {
                d.prototype.off.apply(this._dataLayer, arguments)
            },
            onAdd: function (a) {
                L.LayerGroup.prototype.onAdd.apply(this, arguments), this._tooltip && a.getPanes().popupPane.appendChild(this._tooltip)
            },
            onRemove: function () {
                L.LayerGroup.prototype.onRemove.apply(this, arguments), this._tooltip && this._tooltip.parentNode && this._tooltip.parentNode.removeChild(this._tooltip)
            },
            addLayer: function () {
                if (this._initialized) try {
                    console.log("MouseOverLayer::addLayer - Immutable object")
                } catch (a) {} else L.LayerGroup.prototype.addLayer.apply(this, arguments)
            },
            removeLayer: function () {
                if (this._initialized) try {
                    console.log("MouseOverLayer::removeLayer - Immutable object")
                } catch (a) {} else L.LayerGroup.prototype.removeLayer.apply(this, arguments)
            },
            clearLayers: function () {
                if (this._initialized) try {
                    console.log("MouseOverLayer::clearLayers - Immutable object")
                } catch (a) {} else L.LayerGroup.prototype.clearLayers.apply(this, arguments)
            },
            _onMouseOver: function (a) {
                this._tooltip.innerHTML = L.Util.template(this._tiptext, a.data), L.DomUtil.setPosition(this._tooltip, this._map.latLngToLayerPoint(a.latlng)), this._tooltip.style.display = "block"
            },
            _onMouseOut: function () {
                this._tooltip.style.display = ""
            }
        }), L.mouseOverLayer = function (a) {
            return new L.MouseOverLayer(a)
        }, b.exports = L.mouseOverLayer
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/UtfGrid": 2
    }],
    8: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h = a("leaflet/layer/TileProvider"),
            i = a("hazdev-webutils/src/util/Util");
        e = "esri", f = "mapquest", g = {}, d = {
            provider: e
        }, g[e] = {
            url: "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            options: {
                subdomains: ["server", "services"],
                attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            }
        }, g[f] = {
            url: "https://otile{s}-s.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg",
            options: {
                subdomains: "1234",
                attribution: 'Data, imagery and map information provided by MapQuest, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> and contributors, <a href="https://wiki.openstreetmap.org/wiki/Legal_FAQ#3a._I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F">ODbL</a>'
            }
        };
        var j = function (a) {
            try {
                return h.create(g, i.extend({}, d, a))
            } catch (b) {
                return h.create(g, d)
            }
        };
        j.ESRI = e, j.MAPQUEST = f, b.exports = j
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/layer/TileProvider": 12
    }],
    9: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h = a("leaflet/layer/TileProvider"),
            i = a("hazdev-webutils/src/util/Util");
        e = "esri", f = "mapquest", g = {}, d = {
            provider: e
        }, g[e] = {
            url: "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            options: {
                subdomains: ["server", "services"],
                attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            }
        }, g[f] = {
            url: "https://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg",
            options: {
                subdomains: "1234",
                attribution: 'Data, imagery and map information provided by MapQuest, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> and contributors, <a href="https://wiki.openstreetmap.org/wiki/Legal_FAQ#3a._I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F">ODbL</a>'
            }
        };
        var j = function (a) {
            try {
                return h.create(g, i.extend({}, d, a))
            } catch (b) {
                return h.create(g, d)
            }
        };
        j.ESRI = e, j.MAPQUEST = f, b.exports = j
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/layer/TileProvider": 12
    }],
    10: [function (a, b, c) {
        "use strict";
        a("leaflet/layer/LegendLayer");
        var d = "https://earthquake.usgs.gov/basemap/tiles/plates",
            e = function (a) {
                var b;
                return a = a || {}, b = a.tileUrl || d + "/{z}/{x}/{y}.png", L.legendLayer(b, a)
            };
        L.tectonicPlates = e, b.exports = e
    }, {
        "leaflet/layer/LegendLayer": 6
    }],
    11: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h = a("leaflet/layer/TileProvider"),
            i = a("hazdev-webutils/src/util/Util");
        e = "esri", f = "natgeo", g = {}, d = {
            provider: e
        }, g[e] = {
            url: "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            options: {
                subdomains: ["server", "services"],
                attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            }
        }, g[f] = {
            url: "https://{s}.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
            options: {
                subdomains: ["server", "services"],
                attribution: "Content may not reflect National Geographic's current map policy. Sources: National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp."
            }
        };
        var j = function (a) {
            try {
                return h.create(g, i.extend({}, d, a))
            } catch (b) {
                return h.create(g, d)
            }
        };
        j.ESRI = e, j.NATGEO = f, b.exports = j
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/layer/TileProvider": 12
    }],
    12: [function (a, b, c) {
        "use strict";
        var d = a("hazdev-webutils/src/util/Util"),
            e = {
                create: function (a, b) {
                    var c, e, f;
                    return f = a[b.provider], e = f.url, c = d.extend({}, f.options, b), c.hasOwnProperty("provider") && delete c.provider, L.tileLayer(e, c)
                }
            };
        b.exports = e
    }, {
        "hazdev-webutils/src/util/Util": 21
    }],
    13: [function (a, b, c) {
        "use strict";
        var d = a("leaflet/layer/MouseOverLayer"),
            e = a("hazdev-webutils/src/util/Util"),
            f = "https://earthquake.usgs.gov/basemap/tiles/faults",
            g = function (a) {
                return a = e.extend({
                    tileUrl: f + "/{z}/{x}/{y}.png",
                    dataUrl: f + "/{z}/{x}/{y}.grid.json?callback={cb}",
                    tiptext: "{NAME}"
                }, a), d(a)
            };
        L.usFault = g, b.exports = g
    }, {
        "hazdev-webutils/src/util/Util": 21,
        "leaflet/layer/MouseOverLayer": 7
    }],
    14: [function (a, b, c) {
        "use strict";
        a("leaflet/layer/LegendLayer");
        var d = "https://earthquake.usgs.gov/basemap/tiles/ushaz",
            e = function (a) {
                var b;
                return a = a || {}, b = a.tileUrl || d + "/{z}/{x}/{y}.png", L.legendLayer(b, a)
            };
        L.usHazard = e, b.exports = e
    }, {
        "leaflet/layer/LegendLayer": 6
    }],
    15: [function (a, b, c) {
        "use strict";
        var d = a("../util/Events"),
            e = a("../util/Util"),
            f = function (a) {
                var b, c, f, g, h, i;
                return b = d(), c = function () {
                    f = a || [], g = null, h = null, a = null
                }, i = function (a) {
                    return a && a.silent === !0
                }, b.add = function () {
                    b.addAll(Array.prototype.slice.call(arguments, 0))
                }, b.addAll = function (a, c) {
                    f.push.apply(f, a), g = null, i(c) || b.trigger("add", a)
                }, b.data = function () {
                    return f
                }, b.deselect = function (a) {
                    if (null !== h) {
                        var c = h;
                        h = null, i(a) || b.trigger("deselect", c)
                    }
                }, b.destroy = e.compose(function (a) {
                    return f = null, g = null, h = null, i(a) || b.trigger("destroy"), a
                }, b.destroy), b.get = function (a) {
                    var c = b.getIds();
                    return c.hasOwnProperty(a) ? f[c[a]] : null
                }, b.getIds = function (a) {
                    var b, c = 0,
                        d = f.length;
                    if (a || null === g)
                        for (g = {}; d > c; c++) {
                            if (b = f[c].id, g.hasOwnProperty(b)) throw 'model with duplicate id "' + b + '" found in collection';
                            g[b] = c
                        }
                    return g
                }, b.getSelected = function () {
                    return h
                }, b.remove = function () {
                    b.removeAll(Array.prototype.slice.call(arguments, 0))
                }, b.removeAll = function (a, c) {
                    var d, e, j = a.length,
                        k = [],
                        l = b.getIds();
                    for (d = 0; j > d; d++) {
                        if (e = a[d], e === h && b.deselect(), !l.hasOwnProperty(e.id)) throw "removing object not in collection";
                        k.push(l[e.id])
                    }
                    for (k.sort(function (a, b) {
                            return a - b
                        }), d = k.length - 1; d >= 0; d--) f.splice(k[d], 1);
                    g = null, i(c) || b.trigger("remove", a)
                }, b.reset = function (a, c) {
                    var d = null;
                    if (null !== h && (d = h.id), f = null, g = null, h = null, f = a || [], c && c.silent === !0 || b.trigger("reset", a), null !== d) {
                        var i = b.get(d);
                        null !== i && (c = e.extend({}, c, {
                            reset: !0
                        }), b.select(i, c))
                    }
                }, b.select = function (a, c) {
                    if (null === a) return void b.deselect();
                    if (a !== h) {
                        if (null !== h && b.deselect(c), a !== b.get(a.id)) throw "selecting object not in collection";
                        h = a, c && c.silent === !0 || b.trigger("select", h, c)
                    }
                }, b.selectById = function (a, c) {
                    var d = b.get(a);
                    null !== d ? b.select(d, c) : b.deselect(c)
                }, b.sort = function (a, c) {
                    f.sort(a), b.reset(f, c)
                }, b.toJSON = function () {
                    var a, b, c, d = f.slice(0);
                    for (b = 0, c = d.length; c > b; b++) a = d[b], "object" == typeof a && null !== a && "function" == typeof a.toJSON && (d[b] = a.toJSON());
                    return d
                }, c(), b
            };
        b.exports = f
    }, {
        "../util/Events": 19,
        "../util/Util": 21
    }],
    16: [function (a, b, c) {
        "use strict";
        var d = a("../util/Util"),
            e = a("./View"),
            f = !1,
            g = null,
            h = null,
            i = null,
            j = {
                closable: !0,
                destroyOnHide: !1,
                title: document.title + " Says..."
            },
            k = function () {
                g = [], h = [], i = document.createElement("div"), i.classList.add("modal"), f = !0
            },
            l = function (a) {
                this.info && this.info.callback && "function" == typeof this.info.callback && this.info.callback(a, this.modal || {})
            },
            m = function () {
                var a;
                a = h.pop(), a && a instanceof Node && a.focus && a.focus()
            },
            n = function (a, b) {
                var c, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B;
                return b = d.extend({}, j, b), c = e(b), n = function () {
                    o = b.buttons, p = b.classes, q = b.closable, t = b.destroyOnHide, v = a, w = b.title, c.el.modal = c, z(), c.render(), f || k(), b = null
                }, y = function (a) {
                    var b, e, f, g = document.createElement("button");
                    for (f = d.extend({}, {
                            classes: [],
                            text: "Click Me",
                            title: "",
                            callback: function () {}
                        }, a), b = 0, e = f.classes.length; e > b; b++) g.classList.add(f.classes[b]);
                    return g.innerHTML = f.text, "" !== f.title && g.setAttribute("title", f.title), g.modal = c, g.info = f, f.callback && g.addEventListener("click", l), g
                }, z = function () {
                    var a, b, e;
                    if (d.empty(c.el), c.el.classList.add("modal-dialog"), p && p.length > 0)
                        for (b = 0, e = p.length; e > b; b++) c.el.classList.add(p[b]);
                    w ? (a = c.el.appendChild(document.createElement("header")), a.classList.add("modal-header"), x = a.appendChild(document.createElement("h3")), x.setAttribute("tabIndex", "-1"), x.classList.add("modal-title"), q && (r = a.appendChild(document.createElement("span")), r.classList.add("modal-close-link"), r.classList.add("material-icons"), r.setAttribute("title", "Close"), r.innerHTML = "close", r.addEventListener("click", c.hide))) : c.el.classList.add("no-header"), s = c.el.appendChild(document.createElement("section")), s.setAttribute("tabIndex", "-1"), s.classList.add("modal-content"), o && o.length ? (u = c.el.appendChild(document.createElement("footer")), u.classList.add("modal-footer")) : c.el.classList.add("no-footer")
                }, A = function (a) {
                    27 === a.keyCode && c.hide()
                }, B = function (a) {
                    "modal" === a.target.className && c.hide()
                }, c.destroy = function () {
                    var a;
                    if (i.removeEventListener("click", c.hide), o && o.length)
                        for (; u.childNodes.length > 0;) a = u.firstChild, a.removeEventListener("click", l), u.removeChild(a);
                    r && (r.removeEventListener("click", c.hide), r = null), delete c.el.modal, u = null, x = null, s = null, t = null, c.el = null, B = null
                }, c.hide = function (a) {
                    var b;
                    return b = c.el.parentNode === i, a === !0 ? (d.empty(i), g.splice(0, g.length), h.splice(1, h.length), m(), b && (c.trigger("hide", c), t && c.destroy())) : b && (c.el.parentNode.removeChild(c.el), g.length > 0 && g.pop().show(), m(), c.trigger("hide", c), t && c.destroy()), !i.firstChild && i.parentNode && (i.parentNode.removeChild(i), i.removeEventListener("click", B), document.body.classList.remove("backgroundScrollDisable"), window.removeEventListener("keydown", A)), c
                }, c.render = function (a) {
                    var b, e = a || v,
                        f = null,
                        g = o || [],
                        h = g.length;
                    if (d.empty(s), "string" == typeof e) s.innerHTML = e;
                    else {
                        if ("function" == typeof e) return c.render(e(c));
                        e instanceof Node && s.appendChild(e)
                    }
                    if (w && (x.innerHTML = w), o && o.length)
                        for (; u.childNodes.length > 0;) f = u.firstChild, d.removeEvent(f, "click", l), u.removeChild(f);
                    for (b = 0; h > b; b++) u.appendChild(y(g[b]));
                    return c.trigger("render", c), c
                }, c.setMessage = function (a) {
                    return v = a, c.trigger("message", c), c
                }, c.setOptions = function (b, e) {
                    return e && (b = d.extend({}, {
                        buttons: o,
                        classes: p,
                        closable: q,
                        message: v,
                        title: w
                    }, b)), o = b.buttons, p = b.classes, q = b.closable, v = a, w = b.title, c.trigger("options", c), c
                }, c.show = function () {
                    var a = null;
                    for (h.push(document.activeElement || !1); i.firstChild;) a = i.firstChild, a.modal && g.push(a.modal), i.removeChild(a);
                    return i.appendChild(c.el), i.addEventListener("click", B), i.parentNode || (document.body.appendChild(i), document.body.classList.add("backgroundScrollDisable"), window.addEventListener("keydown", A)), w ? x.focus() : s.focus(), c.trigger("show", c), c
                }, n(), c
            };
        b.exports = n
    }, {
        "../util/Util": 21,
        "./View": 18
    }],
    17: [function (a, b, c) {
        "use strict";
        var d = a("../util/Events"),
            e = a("../util/Util"),
            f = function (a) {
                var b, c, f;
                return b = d(), c = function () {
                    f = e.extend({}, a), a && a.hasOwnProperty("id") && (b.id = a.id), a = null
                }, b.get = function (a) {
                    return "undefined" == typeof a ? f : f.hasOwnProperty(a) ? f[a] : null
                }, b.set = function (a, c) {
                    var d, g = {},
                        h = !1;
                    for (d in a) f.hasOwnProperty(d) && f[d] === a[d] || (g[d] = a[d], h = !0);
                    if (f = e.extend(f, a), a && a.hasOwnProperty("id") && (b.id = a.id), !(c && c.hasOwnProperty("silent") && c.silent) && (h || c && c.hasOwnProperty("force") && c.force)) {
                        for (d in g) b.trigger("change:" + d, g[d]);
                        b.trigger("change", g)
                    }
                }, b.toJSON = function () {
                    var a, b, c = e.extend({}, f);
                    for (a in c) b = c[a], "object" == typeof b && null !== b && "function" == typeof b.toJSON && (c[a] = b.toJSON());
                    return c
                }, c(), b
            };
        b.exports = f
    }, {
        "../util/Events": 19,
        "../util/Util": 21
    }],
    18: [function (a, b, c) {
        "use strict";
        var d = a("./Model"),
            e = a("../util/Events"),
            f = a("../util/Util"),
            g = {},
            h = function (a) {
                var b, c, h;
                return b = e(), c = function (a) {
                    a = f.extend({}, g, a), b.el = a && a.hasOwnProperty("el") ? a.el : document.createElement("div"), b.model = a.model, b.model || (b.model = d({}), h = !0), b.model.on("change", "render", b)
                }, b.render = function () {}, b.destroy = f.compose(function () {
                    null !== b && (b.model.off("change", "render", b), h && b.model.destroy(), h = null, b.model = null, b.el = null, c = null, b = null)
                }, b.destroy), c(a), a = null, b
            };
        b.exports = h
    }, {
        "../util/Events": 19,
        "../util/Util": 21,
        "./Model": 17
    }],
    19: [function (a, b, c) {
        "use strict";
        var d = null,
            e = function (a) {
                return "string" == typeof a || a instanceof String
            },
            f = function () {
                var a, b, c;
                return a = {}, b = function () {
                    c = {}
                }, a.destroy = function () {
                    b = null, c = null, a = null
                }, a.off = function (a, b, d) {
                    var e;
                    if ("undefined" == typeof a) c = null, c = {};
                    else {
                        if (!c.hasOwnProperty(a)) return;
                        if ("undefined" == typeof b) delete c[a];
                        else {
                            var f = null;
                            for (e = c[a].length - 1; e >= 0 && (f = c[a][e], f.callback !== b || d && f.context !== d || (c[a].splice(e, 1), !d)); e--);
                            0 === c[a].length && delete c[a], f = null
                        }
                    }
                }, a.on = function (a, b, d) {
                    if (!(b || !b.apply || d && e(b) && d[b].apply)) throw new Error("Callback parameter is not callable.");
                    c.hasOwnProperty(a) || (c[a] = []), c[a].push({
                        callback: b,
                        context: d
                    })
                }, a.trigger = function (a) {
                    var b, d, f, g, h;
                    if (c.hasOwnProperty(a))
                        for (b = Array.prototype.slice.call(arguments, 1), h = c[a].slice(0), d = 0, f = h.length; f > d; d++) g = h[d], e(g.callback) ? g.context[g.callback].apply(g.context, b) : g.callback.apply(g.context, b)
                }, b(), a
            };
        d = f(), f.on = function () {
            return d.on.apply(d, arguments)
        }, f.off = function () {
            return d.off.apply(d, arguments)
        }, f.trigger = function () {
            return d.trigger.apply(d, arguments)
        };
        var g = function (a) {
            f.trigger("hashchange", a)
        };
        if ("onhashchange" in window) window.addEventListener && window.addEventListener("hashchange", g, !1);
        else {
            var h = document.location.hash;
            setInterval(function () {
                h !== document.location.hash && (h = document.location.hash, g({
                    type: "hashchange",
                    newURL: document.location.hash,
                    oldURL: h
                }))
            }, 300)
        }
        b.exports = f
    }, {}],
    20: [function (a, b, c) {
        "use strict";
        var d = a("./Events"),
            e = 0,
            f = function () {
                return "hazdev-webutils-message-" + e++
            },
            g = function (a) {
                var b, c, e, g, h, i, j, k, l, m, n, o, p, q;
                return b = d(), c = function (a) {
                    l = f(), j = a.container || document.body, k = a.content || "Something just happened...", e = parseInt(a.autoclose, 10) || 0, g = ["alert", "webutils-message"].concat(a.classes || []), h = a.closeable || !0, m = a.insertBefore || !1, q()
                }, o = function () {
                    return i = document.createElement("button"), i.setAttribute("href", "#"), i.setAttribute("tabindex", "0"), i.setAttribute("aria-label", "Close Alert"), i.setAttribute("aria-controls", l), i.classList.add("webutils-message-close"), i.classList.add("material-icons"), i.innerHTML = "close", i.addEventListener("click", p), i
                }, p = function (a) {
                    return b.hide(!0), a.preventDefault()
                }, q = function () {
                    n = document.createElement("div"), n.setAttribute("id", l), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "polite"), n.innerHTML = k, g.forEach(function (a) {
                        n.classList.add(a)
                    }), h && (n.classList.add("webutils-message-closeable"), n.appendChild(o())), e && window.setTimeout(b.hide, e), j && (m && j.firstChild ? j.insertBefore(n, j.firstChild) : j.appendChild(n))
                }, b.hide = function (a) {
                    n.classList.add("invisible"), window.setTimeout(function () {
                        n.parentNode && n.parentNode.removeChild(n), b.trigger("hide", {
                            userTriggered: a
                        }), b.destroy()
                    }, 262)
                }, b.destroy = function () {
                    i && i.removeEventListener("click", p), e = null, g = null, h = null, i = null, j = null, k = null, l = null, m = null, n = null, o = null, p = null, q = null, c = null, b = null
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "./Events": 19
    }],
    21: [function (a, b, c) {
        "use strict";
        var d = !1,
            e = !1,
            f = function () {};
        f.isMobile = function () {
                return d
            }, f.supportsDateInput = function () {
                return e
            }, f.extend = function (a) {
                var b, c, d, e;
                for (b = 1, c = arguments.length; c > b; b++)
                    if (d = arguments[b])
                        for (e in d) a[e] = d[e];
                return a
            }, f.equals = function (a, b) {
                var c, d;
                if (a === b) return !0;
                if (null === a || null === b) return !1;
                if ("object" == typeof a && "object" == typeof b) {
                    for (c in a)
                        if (a.hasOwnProperty(c) && !b.hasOwnProperty(c)) return !1;
                    for (d in b)
                        if (b.hasOwnProperty(d)) {
                            if (!a.hasOwnProperty(d)) return !1;
                            if (!f.equals(a[d], b[d])) return !1
                        } return !0
                }
                return a === b
            }, f.getEvent = function (a) {
                var b;
                return a || (a = window.event), a.target ? b = a.target : a.srcElement && (b = a.srcElement), 3 === b.nodeType && (b = b.parentNode), {
                    target: b,
                    originalEvent: a
                }
            }, f.getParentNode = function (a, b, c) {
                for (var d = a; d && d !== c && d.nodeName.toUpperCase() !== b.toUpperCase();) d = d.parentNode;
                return d && "nodeName" in d && d.nodeName.toUpperCase() === b.toUpperCase() ? d : null
            }, f.empty = function (a) {
                for (; a.firstChild;) a.removeChild(a.firstChild)
            }, f.detach = function (a) {
                a.parentNode && a.parentNode.removeChild(a)
            }, f.getWindowSize = function () {
                var a = {
                    width: null,
                    height: null
                };
                if ("innerWidth" in window && "innerHeight" in window) a = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                else {
                    var b = "documentElement" in document ? document.documentElement : document.body;
                    a = {
                        width: b.offsetWidth,
                        height: b.offsetHeight
                    }
                }
                return a
            }, f.compose = function () {
                var a = arguments;
                return function (b) {
                    var c, d, e;
                    for (c = 0, e = a.length; e > c; c++) d = a[c], d && d.call && (b = d.call(this, b));
                    return b
                }
            }, f.contains = function (a, b) {
                var c, d;
                for (c = 0, d = a.length; d > c; c++)
                    if (b === a[c]) return !0;
                return !1
            }, f.isArray = function (a) {
                return "function" == typeof Array.isArray ? Array.isArray(a) : "[object Array]" === Object.prototype.toString.call(a)
            }, f.loadScript = function (a, b) {
                var c, d, e, g, h;
                b = f.extend({}, {
                    success: null,
                    error: null,
                    done: null
                }, b), c = function () {
                    h.removeEventListener("load", g), h.removeEventListener("error", e), h.parentNode.removeChild(h), c = null, g = null, e = null, h = null
                }, d = function () {
                    null !== b.done && b.done(), b = null
                }, e = function () {
                    c(), null !== b.error && b.error.apply(null, arguments), d()
                }, g = function () {
                    c(), null !== b.success && b.success.apply(null, arguments), d()
                }, h = document.createElement("script"), h.addEventListener("load", g), h.addEventListener("error", e), h.src = a, h.async = !0, document.querySelector("script").parentNode.appendChild(h)
            },
            function () {
                var a = document.createElement("div"),
                    b = document.createElement("input"),
                    c = navigator.userAgent || navigator.vendor || window.opera;
                d = c.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i), b.setAttribute("type", "date"), e = "text" !== b.type, a = null
            }(), b.exports = f
    }, {}],
    22: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h, i = a("./Util"),
            j = 0,
            k = {
                url: null,
                success: null,
                error: null,
                done: null,
                data: null,
                callbackName: null,
                callbackParameter: "callback"
            },
            l = {
                url: null,
                success: null,
                error: null,
                done: null,
                method: "GET",
                headers: null,
                data: null,
                rawdata: null
            };
        d = function (a) {
            var b, c, d, e, f;
            if (a = i.extend({}, l, a), e = a.url, a.restrictOrigin && (e = g(e)), c = a.rawdata, null !== a.data && (d = h(a.data), "GET" === a.method ? e = e + "?" + d : (c = d, null === a.headers && (a.headers = {}), a.headers["Content-Type"] = "application/x-www-form-urlencoded")), f = new XMLHttpRequest, f.onreadystatechange = function () {
                    var b, c;
                    if (4 === f.readyState) {
                        if (200 === f.status) {
                            if (null !== a.success) try {
                                b = f.response, c = f.getResponseHeader("Content-Type"), c && -1 !== c.indexOf("json") && (b = JSON.parse(b)), a.success(b, f)
                            } catch (d) {
                                null !== a.error && a.error(d, f)
                            }
                        } else a.error && a.error(f.status, f);
                        null !== a.done && a.done(f)
                    }
                }, f.open(a.method, e, !0), null !== a.headers)
                for (b in a.headers) f.setRequestHeader(b, a.headers[b]);
            return f.send(c), f
        }, e = function () {
            return "_xhr_callback_" + (new Date).getTime() + "_" + ++j
        }, f = function (a) {
            var b, c, d;
            a = i.extend({}, k, a), d = a.url, b = i.extend({}, a.data), c = a.callbackName || e(), b[a.callbackParameter] = c, d += (-1 === d.indexOf("?") ? "?" : "&") + h(b), window[c] = function () {
                a.success.apply(null, arguments)
            }, i.loadScript(d, {
                error: a.error,
                done: function () {
                    window[c] = null, delete window[c], null !== a.done && a.done()
                }
            })
        }, g = function (a) {
            var b, c;
            return b = document.createElement("a"), b.setAttribute("href", a), c = b.pathname, 0 !== a.indexOf("http") && 0 !== a.indexOf("/") || 0 === c.indexOf("/") || (c = "/" + c), c
        }, h = function (a) {
            var b, c, d, e, f, g;
            b = [];
            for (c in a)
                if (d = encodeURIComponent(c), e = a[c], e instanceof Array)
                    for (f = 0, g = e.length; g > f; f++) b.push(d + "=" + encodeURIComponent(e[f]));
                else b.push(d + "=" + encodeURIComponent(e));
            return b.join("&")
        }, b.exports = {
            ajax: d,
            getCallbackName: e,
            jsonp: f,
            restrictOrigin: g,
            urlEncode: h
        }
    }, {
        "./Util": 21
    }],
    23: [function (a, b, c) {
        "use strict";
        var d = a("util/Util"),
            e = a("mvc/View"),
            f = {
                version: '<a href="https://github.com/usgs/earthquake-latest-earthquakes/blob/master/README.md">Version Info</a>'
            },
            g = function (a) {
                var b, c, g;
                return b = e(a), c = function (a) {
                    a = d.extend({}, f, a), g = a.version || null
                }, b.destroy = d.compose(function () {
                    g = null, c = null, b = null
                }, b.destroy), b.render = function () {
                    var a, c, d, e;
                    a = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAXCAMAAACbHilqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF7QgS////XKTUnsfi8n6ADXG3zeX0hbvb9/7+NZHK/f746Pb3+MXDu9rs/vvpsml76lRcSpXIKYC//vn1/NvX+PT0dq/W5DI/9Pv58fj+8aSlYVaI/fz9uc/i2+72++/s/LeqQAAAAx1JREFUeNqsVNuypCoM5SISY9MtoIhuxP//y1loT9eeOrMfTtWkuwwQsshdyG9EXErhkgtR5LaXBf+bJFGhzLK6HNvNdi7/IPHm7+OmUqjgn7EEcmwHJRNDNxaOUqvMt0gW5r9BXWgsmemCwqZEZi4bvZeXuqybHjZwXJU/WfUNEU+D2v2PE0SXh1KmQ4fxEsN72fd/hWo6/XEgElycPiosOI4s47zv+wPBOx/gy6C1qTc0FZnS9+j8YZVKKoxMxSuPS0dKtXSrEGJd5KNx8bihuBmJr1fyE2JA0YWJMG9PZ4ZgKnE1wxCitEPadiGmburkvIq1m6Z5sNr0iBtCWh0HL5GQ56gcUs3iDkmOJUsd1DDAfReMCb1UJslJTJG3Re5ifVCJNQDKSY4LsfU0eAQ214qLzFHc+USin07Zw6ajsLVJab1oq3m6IAoBas9S1pB0ANSIFKRQvaojHj6CisiDiMu25bxtW1XGV290JmWsNaoOg4M1cOwYr1BNxwYoO+hcvT5cCs5jl2ywg8rOSVFtusmb4O1gfEr4YKOMQRq+QEFZ5cHNkIakvUYgVPBK2WS9gYJXsDVtYnQ39S/ztX691ld/vNbdYbG+nHbVvcL6sn3v0tf0Ciolq5RxQPPW2zQcKegAJ9z2iRXN6zrhJzr5EGKWnWhLJBwCsbcrESnQTqnm2dLDWR10CqPzvbGnpsLvuioE3Tk+OzEhPlMk4Imd9u4xdyinGXxv2FmpvtdoBdT6YbQNeeursa1mf0O1tzumZgw3ODon2DZfdSm60l18muWGpLU2jjJKZ5zTmWk0urX8B+qB+kNb7VN37lNzqK3OboLb+0l7490Ma7yvHFvTsOxRYa2ecjhaQ/5unBiXyBhS+RnL8sSwKvmEBj3PE+eF4nkuhClF3m+4nmGZrL6/DMy2QpLLJ1ZtzJUWAizboKGrZSVhbkHxmoKUI6CwZryF6dgvMApyDDNY8YG6TLy6EkbIa2DRtb86t9ztDwXlW8q5QTUn38RtqP13Xv1MEWlK/kfx/4HC1Ced/g0U0rKN/wSq8DPSyD+JfwkwAB0JQqS/aIPkAAAAAElFTkSuQmCC", d = "data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAHgAZAwERAAIRAQMRAf/EAIMAAAICAwAAAAAAAAAAAAAAAAQHAAYCAwUBAAIDAQAAAAAAAAAAAAAAAAQFAQMGAhAAAgIBAwIFAgcAAAAAAAAAAQIDBAUAESESBjFBUSITYQeR0TJSkmMUEQABAwMCBAUFAQAAAAAAAAABABECIRIDMUFRYXEE8MHRIkKRsTJSkhP/2gAMAwEAAhEDEQA/AJ3Fj8pkfuB3ABlGqwjJ2I40eeRV2VizHYMNlXgfU60eOYjijR/aNlme8MzklGJaq013tY6eB2y0gW2fjjevJM8i8jobYSA8bdW3n4amknppxQ3Zf6RytKUiG80x4Ti5O38jHlojbzElSzPWyjgK5KRdUR6kblvr6+ugC94tpFxRaEgWl9WTK+WT95/HQDIlLTHZelX7szUb5GKq4t5SPoeuZSJGnVhyCOWXnR04EwFHpHfklsJxGWTlqlcHurM4yajiY1tpPYMcaVplVqorOIwGLP7t913Tfy8dX4MZEpU83VZyRMw2rI6BEi7alrvWaOX/ABWTHAW3ZCVdgxbbyUg7a5NZu+4RvwPRNjY+ulqJSO7l7P8AuNU74zd7HwLHVt3pbUBNqrGSrMQkgWSQEbqdjuORpvjz4TjiJagNoUh73t5mZIIieo9VnV7L+4T240vVYlkT31Yrdikyhnb2FVJc8NzwORxqDnxAUP0dUdn2maGV8hjUcRxV5qYe9S7byVeXHi/elgsV1yVeWqlaNp4+jpLyTq2ynYcoNvIaDOQGYLsHFK+ieXCw783DfdXr4f7I/wCa/noN0RcOIVfpi1A/c0VA1bc8tqWR7Nk9DRFlG0NmOVVYxKP0shIK+GrSxtd9PDJRjuicwhbImRqduUgfiNiKMhzXnlzEwoWFr3keh/vkX3UHAjQrvHJGQGI4j6H9Od9S9K8+q4tJyGwtL2XfpoNiP5Y8EJLWryR5ebD20r3ElmGfqssr1ZI3nYglwnSthFPHTyfPjnXQJo46eOCqlAETOOTSc3itpFx5fkEz+NBLSr//2Q==",
                        e = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAZCAMAAAB97TwtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF32Fu7amw/fr7EkJw+ufpiqO5Ol6F9tTY8Le94HWA54uU88TJ0hgr09vk6ZOc997hbIikxtPd656m5efsx4ST0qu25IGM/PDx9MzQsbXF3cHK2+PqwEtb2EJR7/H1////g2bP9gAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAB3UlEQVR42oyUiXbjIAxFhcCsNqTEAdI01v//5UhOJ9NmOWd8vGB8gYf0ZKDnw6jYWuSrut8f4N4q5vbsqimH3MDiYyyvYVC3MU31ex+m5l/B/Zrl4cK4vZqOu6SoXsAO6j6v25UEAAhZNGD0z7CPFflL4maC4E3vIwN3UW/lCa4qI3mR4oFHoKgwofF9xEcY88iIsvkBjnplGc3hFmR0dA+wyS4Tn4TwSQVCKi5/2UMJDKb6AI9aMilPeArbApnMKDS0Pq4rHZe2bMftchR4D5HyJSNvf9HWatvrPM/hyC1tF+44TNJ7hqKA58vgTO7Z0IfWB61P86yu88qU1ZNgk7YHbXkfPrTAcSsMd4YtWr3OM+ywOQi8mklPZDWYznuXLDHczDcsM7fwyZrvsJ20/mGkbDhoyw4vmTVDsXYT2K6dSa2nf7BhmNWfAy1fJyrJkfn6IA7OZYnIMpaFfsIu7nEeNK7ZYPccQZRsjkqTPf+yaM/DSwY9dCpiJF6HouSbM7hdtgfYpyTZzcBDjCsoEWVvp/hsfswq3VxXoYrRWEcwr13HTE1kdj+7CCEENiq+8TPDbdwrpbs0zPtKkdXL/9Yge+m6UyjV3b+rO7+pbip/FzRe/hvt+b/xR4ABAEawWK3XrIaKAAAAAElFTkSuQmCC", c = b.el, c.innerHTML = ["<h1>About Latest Earthquakes</h1>", "<small>" + g + "</small>", '<ul class="no-style separator">', "<li>", '<i class="material-icons">&#xE896;</i>', "<p>", "Clicking the list icon in the top right corner will load the ", "earthquake list.", "</p>", "</li>", "<li>", '<i class="material-icons">&#xE894;</i>', "<p>", "Clicking the map icon in the top right corner will load the ", "map.", "</p>", "</li>", "<li>", '<i class="material-icons">&#xE8B8;</i>', "<p>", "Clicking the options icon in the top right corner lets you ", "change which earthquakes are displayed, and many other map ", "and list options.", "</p>", "</li>", "<li>", '<i class="material-icons">&#xE8FD;</i>', "<p>", "Clicking the about icon in the top right corner loads this page.", "</p>", "</li>", "<li>Bookmark to save your settings.</li>", "</ul>", "<h2>Links</h2>", '<ul class="no-style separator">', "<li>", '<a href="/data/comcat/latest-eqs.php">', "About - Latest Earthquakes", "</a>", "</li>", "<li>", '<a href="/data/comcat/data-availability.php">', "Missing Earthquakes", "</a>", "</li>", "<li>", '<a href="/data/comcat/index.php">', "ANSS Comprehensive Earthquake Catalog (ComCat) Documentation", "</a>", "</li>", "<li>", '<a href="https://earthquake.usgs.gov/">', "Earthquake Hazards Program", "</a>", "</li>", "<li>", '<a href="/contactus/index.php">', "Contact Us", "</a>", "</li>", "</ul>", "<h2>In Partnership With</h2>", '<ul class="partners no-style separator">', '<li class="anss">', '<div class="row">', '<div class="column mobile-one-of-four logo-image">', '<img width="80" height="25" src="', a, '" ', 'aria-describedby="ANSS"/>', "</div>", '<div class="column mobile-three-of-four">', '<a href="/monitoring/anss/" ', 'title="Advanced National Seismic System" ', 'id="ANSS">', "ANSS - Advanced National Seismic System", "</a>", "</div>", "</div>", "</li>", '<li class="gsn">', '<div class="row">', '<div class="column mobile-one-of-four logo-image">', '<img width="25" height="30" src="', d, '" ', 'aria-describedby="GSN"/>', "</div>", '<div class="column mobile-three-of-four">', '<a href="/monitoring/gsn/" ', 'title="Global Seismographic Network" id="GSN">', "Global Seismographic Network", "</a>", "</div>", "</div>", "</li>", '<li class="nehrp">', '<div class="row">', '<div class="column mobile-one-of-four logo-image">', '<img width="44" height="25" src="', e, '" ', 'aria-describedby="NEHRP"/>', "</div>", '<div class="column mobile-three-of-four">', '<a href="http://www.nehrp.gov/" ', 'title="National Earthquake Hazards Reduction Program" ', 'id="NEHRP">', "NEHRP National Earthquake Hazards Reduction Program", "</a>", "</div>", "</div>", "</li>", "</ul>"].join("")
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "mvc/View": 18,
        "util/Util": 21
    }],
    24: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("util/Util"),
            f = {},
            g = function (a) {
                var b, c, g;
                return b = {}, c = function (a) {
                    var c, h;
                    a = e.extend({}, f, a), g = [], b.options = {};
                    for (c in a) h = a[c], "function" != typeof h.data && (h = d(h), g.push(h)), b.options[c] = h
                }, b.destroy = function () {
                    null !== b && (g.forEach(function (a) {
                        a.destroy()
                    }), g = null, b = null)
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "mvc/Collection": 15,
        "util/Util": 21
    }],
    25: [function (a, b, c) {
        "use strict";
        var d = a("util/Util"),
            e = {
                depthDecimals: 1,
                distanceDecimals: 1,
                empty: "&ndash;",
                fileSizes: [" B", " KB", " MB", " GB"],
                locationDecimals: 3,
                magnitudeDecimals: 1
            },
            f = .621371,
            g = ["I", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
            h = ["#FFFFFF", "#FFFFFF", "#ACD8E9", "#ACD8E9", "#83D0DA", "#7BC87F", "#F9F518", "#FAC611", "#FA8A11", "#F7100C", "#C80F0A", "#C80F0A", "#C80F0A"],
            i = function (a) {
                var b, c, i, j, k, l, m, n;
                return b = {}, c = function (a) {
                    a = d.extend({}, e, a), i = a.depthDecimals, j = a.distanceDecimals, k = a.empty, l = a.fileSizes, m = a.locationDecimals, n = a.magnitudeDecimals
                }, b.angle = function (a, b) {
                    var c;
                    return a || 0 === a ? (c = "number" == typeof b ? Number(a).toFixed(b) : Math.round(a), c + "&deg;") : k
                }, b.backAzimuth = function (a) {
                    return a >= 180 ? a -= 180 : 180 > a && (a += 180), a
                }, b.compassWinds = function (a) {
                    var b = 22.5,
                        c = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
                    return c.indexOf(a) > -1 ? a : c[Math.round(a % 360 / b)]
                }, b.date = function (a) {
                    var b, c, d;
                    return a && "function" == typeof a.getTime ? (b = a.getUTCFullYear(), c = a.getUTCMonth() + 1, d = a.getUTCDate(), 10 > c && (c = "0" + c), 10 > d && (d = "0" + d), b + "-" + c + "-" + d) : k
                }, b.datetime = function (a, c, d) {
                    var e, f;
                    return a || 0 === a ? ("function" == typeof a.getTime && (a = a.getTime()), c = c || 0, e = 60 * c * 1e3, f = new Date(a + e), b.date(f) + " " + b.time(f, d) + " (UTC" + b.timezoneOffset(c) + ")") : k
                }, b.depth = function (a, c, d) {
                    return a || 0 === a ? b.number(a, i, k, c) + b.uncertainty(d, i, "") : k
                }, b.distance = function (a, c) {
                    return b.number(a, j, k, c)
                }, b.dyfiLocation = function (a) {
                    var b, c, d, e;
                    return b = a.country, c = a.name, d = a.state, e = a.zip, '<span class="dyfi-response-location">' + c + ", " + d + "&nbsp;" + e + "<br /><small>" + b + "</small></span>"
                }, b.fileSize = function (a) {
                    var b;
                    if (!a && 0 !== a) return k;
                    for (b = 0, a = Number(a); a >= 1024;) a /= 1024, b++;
                    return a = b > 0 ? a.toFixed(1) : a.toFixed(0), a + l[b]
                }, b.intensity = function (a, c) {
                    var d;
                    return d = b.mmi(a), c = c || "", '<span class="mmi mmi' + d + '"><span class="roman"><strong>' + d + "</strong></span>" + c + "</span>"
                }, b.kmToMi = function (a) {
                    return a ? a * f : a
                }, b.latitude = function (a) {
                    var b;
                    return a || 0 === a ? (b = a >= 0 ? "N" : "S", a = Math.abs(a), "number" == typeof m && (a = a.toFixed(m)), a + "&deg;" + b) : k
                }, b.location = function (a, c) {
                    return b.latitude(a) + "&nbsp;" + b.longitude(c)
                }, b.longitude = function (a) {
                    var b;
                    return a || 0 === a ? (b = a >= 0 ? "E" : "W", a = Math.abs(a), "number" == typeof m && (a = a.toFixed(m)), a + "&deg;" + b) : k
                }, b.magnitude = function (a, c, d) {
                    return b.number(a, n, k, c) + b.uncertainty(d, n, "")
                }, b.mmi = function (a, b) {
                    return a = Math.round(a), g[a] || b || k
                }, b.mmiColor = function (a) {
                    return a = Math.round(a), h[a] || null
                }, b.number = function (a, b, c, d) {
                    return a || 0 === a ? ("number" == typeof b && (a = Number(a).toFixed(b)), d && (a += " " + d), a) : c
                }, b.time = function (a, b) {
                    var c, d, e, f;
                    return a && "function" == typeof a.getTime ? (c = a.getUTCHours(), d = a.getUTCMinutes(), e = a.getUTCSeconds(), f = "", 10 > c && (c = "0" + c), 10 > d && (d = "0" + d), 10 > e && (e = "0" + e), b && (f = a.getUTCMilliseconds(), f = 10 > f ? ".00" + f : 100 > f ? ".0" + f : "." + f), c + ":" + d + ":" + e + f) : k
                }, b.timezoneOffset = function (a) {
                    var b, c, d;
                    return a && 0 !== a ? (0 > a ? (d = "-", a *= -1) : d = "+", b = parseInt(a / 60, 10), c = parseInt(a % 60, 10), 10 > b && (b = "0" + b), 10 > c && (c = "0" + c), d + b + ":" + c) : ""
                }, b.uncertainty = function (a, c, d, e) {
                    return a || 0 === a ? (a = b.number(a, c, null, e), '<span class="uncertainty">&plusmn; ' + a + "</span>") : d
                }, c(a), a = null, b
            };
        i.MILES_PER_KILOMETER = f, b.exports = i
    }, {
        "util/Util": 21
    }],
    26: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("util/Util"),
            f = a("mvc/View"),
            g = {
                classPrefix: "generic-collection-view",
                containerNodeName: "ul",
                itemNodeName: "li",
                noDataMessage: "There is no data to display.",
                watchProperty: ""
            },
            h = function (a) {
                var b, c, h, i, j, k, l, m;
                return a = e.extend({}, g, a), b = f(a), c = function (a) {
                    b.collection = a.collection || d(), h = a.classPrefix, i = a.containerNodeName, j = a.itemNodeName, b.watchProperty = a.watchProperty, k = a.noDataMessage, b.el.classList.add(h), b.createScaffold(), b.model.off("change", "render", b), b.watchProperty && b.model.on("change:" + b.watchProperty, "onEvent", b), b.collection.on("reset", "render", b), b.collection.on("add", "render", b), b.collection.on("remove", "render", b)
                }, m = function () {
                    b.onContentClick.apply(this, arguments)
                }, b.createCollectionContainer = function (a) {
                    return a = a || document.createElement(i), a.classList.add(h + "-container"), a.classList.add("no-style"), a
                }, b.createCollectionItem = function (a) {
                    var c;
                    return c = document.createElement(j), c.classList.add(h + "-item"), a && (c.setAttribute("data-id", a.id), c.appendChild(b.createCollectionItemContent(a))), c
                }, b.createCollectionItemContent = function (a) {
                    var b;
                    return b = document.createElement("pre"), b.innerHTML = JSON.stringify(a, null, "  "), b
                }, b.createScaffold = function () {
                    var a;
                    a = b.el, a.innerHTML = ['<header class="', h, '-header"></header>', '<section class="', h, '-content"></section>', '<footer class="', h, '-footer"></footer>'].join(""), b.header = a.querySelector("." + h + "-header"), b.content = a.querySelector("." + h + "-content"), b.footer = a.querySelector("." + h + "-footer"), b.content.addEventListener("click", m)
                }, b.deselectAll = function () {
                    Array.prototype.forEach.call(b.content.querySelectorAll(".selected"), function (a) {
                        a && a.classList && a.classList.remove("selected")
                    })
                }, b.destroy = e.compose(function () {
                    b.content.removeEventListener("click", b.onContentClick, b), b.watchProperty && b.model.off("change:" + b.watchProperty, "onEvent", b), b.model.on("change", "render", b), b.collection.off("reset", "render", b), b.collection.off("add", "render", b), b.collection.off("remove", "render", b), m = null, h = null, i = null, b.watchProperty = null, j = null, k = null, l = null, c = null, b = null
                }, b.destroy), b.getClickedItem = function (a, b) {
                    var c;
                    for (c = a; c && !c.classList.contains(h + "-item");) c = e.getParentNode(c.parentNode, j, b);
                    return c
                }, b.getDataToRender = function () {
                    return b.collection.data().slice(0)
                }, b.onContentClick = function (a) {
                    var c, d;
                    a && a.target && (c = b.getClickedItem(a.target, b.content), c && b.watchProperty && (d = b.collection.get(c.getAttribute("data-id")), b.updateModel(d)))
                }, b.onEvent = function () {
                    var a;
                    b.watchProperty && (a = b.model.get(b.watchProperty), b.deselectAll(), b.setSelected(a))
                }, b.render = function () {
                    b.renderHeader(), b.renderContent(), b.renderFooter()
                }, b.renderContent = function () {
                    var a, c;
                    try {
                        c = b.getDataToRender(), 0 === c.length ? b.content.innerHTML = '<p class="alert info">' + k + "</p>" : (a = b.createCollectionContainer(), c.forEach(function (c) {
                            a.appendChild(b.createCollectionItem(c))
                        }), e.empty(b.content), b.content.appendChild(a), b.onEvent())
                    } catch (d) {
                        b.content.innerHTML = '<p class="alert error">An error occurred while rendering.\n<!-- ' + (d.stack || d.message) + " --></p>"
                    }
                }, b.renderFooter = function () {
                    b.footer.innerHTML = ""
                }, b.renderHeader = function () {
                    b.header.innerHTML = ""
                }, b.setSelected = function (a) {
                    var c;
                    a && (c = b.content.querySelector('[data-id="' + a.id + '"]'), c && c.classList && c.classList.add("selected"))
                }, b.updateModel = function (a) {
                    var c;
                    c = {}, c[b.watchProperty] = a, b.model.set(c)
                }, c(a), a = null, b
            };
        b.exports = h
    }, {
        "mvc/Collection": 15,
        "mvc/View": 18,
        "util/Util": 21
    }],
    27: [function (a, b, c) {
        "use strict";
        var d = function () {};
        d.boundsContain = function (a, b) {
            var c, d, e, f, g, h, i;
            if (d = b[0], e = b[1], f = a[1][0], h = a[0][0], g = a[1][1], i = a[0][1], c = g - i, d > f || h > d) return !1;
            if (c >= 360) return !0;
            for (; e > g;) e -= 360;
            for (; i > e;) e += 360;
            return g >= e && e >= i
        }, d.convertBounds = function (a) {
            return [
                [a._southWest.lat, a._southWest.lng],
                [a._northEast.lat, a._northEast.lng]
            ]
        }, b.exports = d
    }, {}],
    28: [function (a, b, c) {
        "use strict";
        var d = a("util/Events"),
            e = a("util/Util"),
            f = {
                defaults: null
            },
            g = function (a) {
                var b, c, g, h, i, j;
                return b = {}, c = function (a) {
                    a = e.extend({}, f, a), g = a.defaults, h = !1, i = !1, b.model = a.model, b.config = a.config
                }, b.destroy = function () {
                    null !== b && (b.stop(), b = null)
                }, b.getModelSettings = function () {
                    var a, c, d, e, f, g, h, i;
                    a = b.config, f = b.model.get(), h = {};
                    for (d in f) {
                        if (i = f[d], g = null, d in a.options)
                            if (Array.isArray(i))
                                for (g = [], c = 0, e = i.length; e > c; c++) g.push(i[c].id);
                            else i && i.id && (g = i.id);
                        else g = i;
                        h[d] = g
                    }
                    return h
                }, b.getUrlSettings = function () {
                    var a;
                    return a = b.parseHash(window.location.hash), 0 === Object.keys(a).length && (a = g), a
                }, b.onHashChange = function () {
                    h || (i = !0, b.setModelSettings(b.getUrlSettings(), !1)), h = !1
                }, b.onModelChange = function () {
                    i || (h = !0, b.setUrlSettings(b.getModelSettings())), i = !1
                }, b.parseHash = function (a) {
                    var b;
                    if (b = {}, a) {
                        a = decodeURIComponent(a.replace("#", ""));
                        try {
                            b = JSON.parse(a)
                        } catch (c) {
                            try {
                                b = JSON.parse(a + "}")
                            } catch (c) {}
                        }
                    }
                    return b
                }, b.setModelSettings = function (a, c) {
                    var d, e, f, g, h, i, j, k;
                    e = b.config, h = b.model.get(), j = {};
                    for (g in a) {
                        if (i = a[g], k = null, g in e.options) {
                            if (d = e.options[g], Array.isArray(i))
                                for (k = [], f = 0; f < i.length; f++) k.push(d.get(i[f]));
                            else if ("string" == typeof i) k = d.get(i);
                            else if (null !== i && "object" == typeof i) {
                                k = [];
                                for (f in i) i[f] === !0 && k.push(d.get(f))
                            }
                        } else {
                            if (!(g in h || c === !0)) continue;
                            k = i
                        }
                        j[g] = k
                    }
                    b.model.set(j)
                }, b.setUrlSettings = function (a) {
                    var b;
                    b = encodeURIComponent(JSON.stringify(a)), window.location = "#" + b
                }, b.start = function () {
                    j || (b.setModelSettings(e.extend({}, g, b.getUrlSettings()), !0), d.on("hashchange", "onHashChange", b), b.model.on("change", "onModelChange", b), j = !0)
                }, b.stop = function () {
                    j && (d.off("hashchange", "onHashChange", b), b.model.off("change", "onModelChange", b), j = !1)
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "util/Events": 19,
        "util/Util": 21
    }],
    29: [function (a, b, c) {
        "use strict";
        var d = a("latesteqs/LatestEarthquakes"),
            e = a("util/Xhr");
        SCENARIO_MODE ? e.ajax({
            url: "/scenarios/catalog/index.json.php",
            success: function (a) {
                var b;
                b = [];
                for (var c = 0, e = a.length; e > c; c++) b.push({
                    id: a[c].id,
                    name: a[c].title,
                    bbox: a[c].bbox,
                    params: {
                        catalog: a[c].id,
                        starttime: "1900-01-01T00:00:00Z"
                    }
                });
                d({
                    el: document.querySelector("#latest-earthquakes"),
                    feed: b
                })
            },
            error: function () {}
        }) : d({
            el: document.querySelector("#latest-earthquakes")
        })
    }, {
        "latesteqs/LatestEarthquakes": 32,
        "util/Xhr": 22
    }],
    30: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("latesteqs/FeedWarningView"),
            f = a("util/Message"),
            g = a("mvc/Model"),
            h = a("util/Util"),
            i = a("util/Xhr"),
            j = {
                config: null,
                model: null
            },
            k = function (a) {
                var b, c, k, l, m, n, o, p, q, r;
                return b = d(), l = null, m = null, n = {}, r = null, c = function (a) {
                    a = h.extend({}, j, a), o = null, p = h.isMobile() ? 500 : 2e3, k = a.app, m = e({
                        app: k,
                        maxResults: p
                    }), q = !1, b.model = a.model || g(), b.model.on("change:feed", "onFeedChange", b), b.model.on("change:sort", "onSort", b), b.model.on("change:autoUpdate", "setAutoUpdateInterval", b), b.on("loading", "loading", b), b.on("reset", "checkForEventInCollection", b), b.error = !1
                }, b.checkForEventInCollection = function () {
                    var a;
                    a = b.model.get("event"), a && (b.get(a.id) || b.model.set({
                        event: null
                    }))
                }, b.checkSearchLimit = function (a, c) {
                    b.trigger("loading"), a = a.replace("query.geojson", "count"), c = h.extend({}, c, {
                        format: "geojson"
                    }), r = i.ajax({
                        url: a,
                        data: c || null,
                        success: b.onCheckQuerySuccess,
                        error: b.onLoadError
                    })
                }, b.destroy = h.compose(function () {
                    null !== b && (b.model.off("change:feed", "onFeedChange", b), b.model.off("change:sort", "sort", b), b.model.off("change:autoUpdate", "setAutoUpdateInterval", b), b.off("reset", "checkForEventInCollection", b), null !== l && (clearInterval(l), l = null), null !== o && (o.hide(), o = null), null !== r && (r.abort(), r = null), q = null, c = null, b = null)
                }, b.destroy), b.load = function () {
                    var a, c, d;
                    a = b.model.get("feed"), a ? (a.bbox && b.model.set({
                        mapposition: [
                            [a.bbox[1], a.bbox[0]],
                            [a.bbox[3], a.bbox[2]]
                        ]
                    }), a.url ? (d = a.url, c = null, a.id === n.id && q ? b.loadUrl(d, c, b.onLoadSuccess) : b.loadUrl(d, c, b.onCheckFeedSuccess)) : (d = b.model.get("searchUrl"), c = a.params, b.checkSearchLimit(d, c))) : b.onLoadError("no feed selected")
                }, b.loading = function () {
                    null !== o && (o.hide(), o = null), o = f({
                        container: document.querySelector(".latest-earthquakes-footer"),
                        content: "Earthquakes loading",
                        classes: ["map-message"]
                    })
                }, b.loadQuery = function () {
                    var a, c, d;
                    a = b.model.get("feed"), d = b.model.get("searchUrl"), c = a.params, b.loadUrl(d, c, b.onLoadSuccess)
                }, b.loadUrl = function (a, c, d) {
                    b.trigger("loading"), r = i.ajax({
                        url: a,
                        data: c || null,
                        success: d,
                        error: b.onLoadError
                    })
                }, b.onCheckFeedSuccess = function (a) {
                    var c;
                    c = a.metadata, c.count > p ? m.showClientMaxError(b.onLoadSuccess, a) : 0 === c.count ? m.showNoDataError(b.onLoadSuccess, a) : b.onLoadSuccess(a)
                }, b.onCheckQuerySuccess = function (a) {
                    var c, d;
                    return c = a.count, d = a.maxAllowed, c > d ? void m.showServerMaxError(a) : void(c > p ? m.showClientMaxError(b.loadQuery, a) : 0 === c ? m.showNoDataError(b.loadQuery) : b.loadQuery())
                }, b.onFeedChange = function () {
                    var a;
                    m.dialog && (a = document.activeElement, m.hide(), a.focus()), b.load(), b.setAutoUpdateInterval()
                }, b.onLoadError = function (a) {
                    m.showServerError(), b.error = a, b.metadata = null, b.reset([])
                }, b.onLoadSuccess = function (a) {
                    return null !== o && (o.hide(), o = null), n = b.model.get("feed"), a.metadata.hasOwnProperty("status") && 200 !== a.metadata.status ? (b.error = !0, void m.showServiceError(a)) : (b.error = !1, b.metadata = a.metadata, b.reset(a.features, {
                        silent: !0
                    }), b.onSort(), void f({
                        autoclose: 3e3,
                        container: document.querySelector(".latest-earthquakes-footer"),
                        content: "Earthquakes updated",
                        classes: ["map-message", "info"]
                    }))
                }, b.onSort = function () {
                    var a;
                    a = b.model.get("sort"), a && a.sort && b.sort(a.sort)
                }, b.setAutoUpdateInterval = function () {
                    var a;
                    null !== l && (clearInterval(l), l = null), b.model.get("autoUpdate") && b.model.get("autoUpdate")[0] && (a = b.model.get("feed"), a.hasOwnProperty("autoUpdate") && a.autoUpdate && (l = setInterval(function () {
                        q = !0, b.load(), q = !1
                    }, a.autoUpdate)))
                }, c(a), b._feedWarningView = m, a = null, b
            };
        b.exports = k
    }, {
        "latesteqs/FeedWarningView": 31,
        "mvc/Collection": 15,
        "mvc/Model": 17,
        "util/Message": 20,
        "util/Util": 21,
        "util/Xhr": 22
    }],
    31: [function (a, b, c) {
        "use strict";
        var d = a("mvc/ModalView"),
            e = a("util/Util"),
            f = {
                app: null,
                maxResults: null
            },
            g = function (a) {
                var b, c, g, h, i;
                return b = {}, c = function (a) {
                    a = e.extend({}, f, a), g = a.app || {}, h = a.maxResults || 0, b.callback = null, b.data = null, b.dialog = null
                }, i = function () {
                    b.hide(), b.onDialogContinue()
                }, b.addBookmark = function () {
                    window.sidebar ? window.sidebar.addPanel(window.location, document.title, "") : window.external && window.external.AddFavorite && window.external.AddFavorite(window.location, document.title)
                }, b.destroy = function () {
                    i = null, g = null, h = null, c = null, b = null
                }, b.getDialogModifySearchAction = function (a) {
                    var b;
                    return b = document.createElement("p"), b.innerHTML = ['<a class="catalog-anchor" href="', SEARCH_PATH, window.location.hash, '">Modify Search</a>', '<small class="catalog-action-description">', a, "</small>"].join(""), b
                }, b.getDialogRevertAction = function (a) {
                    var b;
                    return b = document.createElement("p"), b.innerHTML = ['<p class="catalog-revert-wrapper">', '<button class="button-as-link revert">', "Show Realtime Data Instead", "</button>", '<small class="catalog-action-description">', "1 Day, Magnitude 2.5+ Worldwide", "</small>", "</p>"].join(""), b.querySelector(".revert").addEventListener("click", function () {
                        a.hide(), g.revertToDefaultFeed()
                    }), b
                }, b.hide = function () {
                    b.dialog && (b.dialog.off("hide", i), b.dialog.hide(), b.dialog = null)
                }, b.onDialogContinue = function () {
                    b.callback && b.callback(b.data)
                }, b.showClientMaxError = function (a, c) {
                    var e;
                    b.callback = a, b.data = c, e = document.createElement("div"), b.dialog = d(e, {
                        title: "Caution",
                        closable: !1,
                        classes: ["modal-warning", "catalog"],
                        buttons: [{
                            callback: function () {
                                b.hide(), b.onDialogContinue()
                            },
                            text: "Continue anyway"
                        }]
                    }), e.innerHTML = ["<p>", "The current selection includes more earthquakes than your device ", "may be able to display.", "</p>", '<div class="downloads"></div>'].join(""), e.appendChild(b.getDialogModifySearchAction("We recommend at most " + h + " earthquakes for your device.")), e.appendChild(b.getDialogRevertAction(b.dialog)), b.dialog.show(), b.dialog.on("hide", i)
                }, b.showNoDataError = function (a, c) {
                    var e;
                    b.callback = a, b.data = c, e = document.createElement("div"), b.dialog = d(e, {
                        title: "Caution",
                        closable: !0,
                        classes: ["modal-warning", "catalog"],
                        buttons: [{
                            callback: function () {
                                b.hide(), b.onDialogContinue()
                            },
                            text: "Continue"
                        }]
                    }), e.innerHTML = ["<p>", "The current selection does not currently include any earthquakes.", "</p>", "<p>", "Earthquakes happen around the world all the time. Change your ", "options to view more earthquakes.", "</p>"].join(""), b.dialog.show(), b.dialog.on("hide", i)
                }, b.showServerError = function () {
                    var a, c;
                    a = document.createElement("div"), c = b.supportsBookmark(), b.dialog = d(a, {
                        title: "Error",
                        closable: !1,
                        classes: ["modal-error", "catalog"],
                        destroyOnHide: !0
                    }), a.innerHTML = ["<p>", "Your search could not be completed at this time, please try again ", "later.", "</p>", "<p>", c ? '<button class="button-as-link bookmark">' : "", "Bookmark This Page", c ? "</button>" : "", '<small class="catalog-action-description">', "Your search may be okay, but the system may be down for ", "maintenance. Bookmark this page to try again later.", "</small>", "</p>"].join(""), a.appendChild(b.getDialogModifySearchAction("See the error message above for details about why the current request failed and modify appropriately.")), a.appendChild(b.getDialogRevertAction(b.dialog)), c && a.querySelector(".bookmark").addEventListener("click", b.addBookmark), b.dialog.show()
                }, b.showServerMaxError = function (a) {
                    var c;
                    c = document.createElement("div"), b.dialog = d(c, {
                        title: "Error",
                        closable: !1,
                        classes: ["modal-error", "catalog"],
                        destroyOnHide: !0
                    }), c.innerHTML = ["<p>", "The current selection includes ", a.count, " earthquakes, ", "which is more than the max allowed ", a.maxAllowed, "</p>"].join(""), c.appendChild(b.getDialogModifySearchAction("We recommend at most " + h + " earthquakes for your device.")), c.appendChild(b.getDialogRevertAction(b.dialog)), b.dialog.show()
                }, b.showServiceError = function (a) {
                    var c;
                    c = document.createElement("div"), b.dialog = d(c, {
                        title: "Error",
                        closable: !1,
                        classes: ["modal-error", "catalog"],
                        destroyOnHide: !0
                    }), c.innerHTML = ["<p>There was an error with your search:</p>", "<small>" + a.metadata.error + "</small>"].join(""), c.appendChild(b.getDialogModifySearchAction("See the error message above for details about why the current request failed and modify appropriately.")), c.appendChild(b.getDialogRevertAction(b.dialog)), b.dialog.show()
                }, b.supportsBookmark = function () {
                    return window.sidebar || window.external && window.external.AddFavorite
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "mvc/ModalView": 16,
        "util/Util": 21
    }],
    32: [function (a, b, c) {
        "use strict";
        var d = a("about/AboutView"),
            e = a("latesteqs/Catalog"),
            f = a("summary/EventSummaryView"),
            g = a("latesteqs/LatestEarthquakesConfig"),
            h = a("list/ListView"),
            i = a("map/MapView"),
            j = a("modes/ModesView"),
            k = a("latesteqs/ScenariosConfig"),
            l = a("settings/SettingsView"),
            m = a("latesteqs/LatestEarthquakesUrlManager"),
            n = a("util/Util"),
            o = a("mvc/View"),
            p = {
                config: null,
                settings: null
            },
            q = {},
            r = {
                autoUpdate: ["autoUpdate"],
                basemap: "grayscale",
                feed: "1day_m25",
                listFormat: "default",
                mapposition: [
                    [24.6, -125],
                    [50, -65]
                ],
                overlays: ["plates"],
                restrictListToMap: ["restrictListToMap"],
                search: null,
                searchUrl: "/fdsnws/event/1/query.geojson",
                sort: "newest",
                timezone: "utc",
                viewModes: {
                    list: !0,
                    map: !0,
                    settings: !1,
                    help: !1
                }
            },
            s = {
                autoUpdate: null,
                basemap: "grayscale",
                feed: "bssc2014",
                listFormat: "shakemap",
                mapposition: [
                    [24.6, -125],
                    [50, -65]
                ],
                overlays: ["plates", "faults"],
                restrictListToMap: ["restrictListToMap"],
                search: null,
                searchUrl: "/fdsnws/scenario/1/query.geojson",
                sort: "largest",
                timezone: null,
                viewModes: {
                    list: !0,
                    map: !0,
                    settings: !1,
                    help: !1
                }
            },
            t = function (a) {
                var b, c, t, u, v, w, x, y, z, A, B, C;
                return b = o(a), c = function (a) {
                    var c;
                    a = n.extend({}, p, a), c = b.el, A = j(), q = SCENARIO_MODE ? s : r, j.mobileCheck() && (q.viewModes = {
                        list: !0,
                        map: !1,
                        settings: !1,
                        help: !1
                    }), SCENARIO_MODE && c.classList.add("scenario-mode"), c.classList.add("latest-earthquakes"), c.innerHTML = '<header class="latest-earthquakes-header"><div class="latest-earthquakes-flex"><a href="/" class="latest-earthquakes-logo"><img src="/theme/images/usgs-logo.svg" alt="USGS"/></a></div><div class="latest-earthquakes-modes"></div></header><div class="latest-earthquakes-content"><div class="latest-earthquakes-list"><div class="list-view"></div></div><div class="latest-earthquakes-map"><div class="map-view"></div></div><div class="latest-earthquakes-settings"><div class="settings-view"></div></div><div class="latest-earthquakes-about"><div class="about-view"></div></div></div><footer class="latest-earthquakes-footer"><div class="event-summary-view"></div></footer>', w = c.querySelector(".latest-earthquakes-content"), u = e({
                        model: b.model,
                        app: b
                    }), v = SCENARIO_MODE ? k(n.extend({}, a.config, {
                        event: u,
                        feed: a.feed
                    })) : g(n.extend({}, a.config, {
                        event: u
                    })), A = j({
                        collection: v.options.viewModes,
                        el: c.querySelector(".latest-earthquakes-modes"),
                        model: b.model
                    }), A.render(), y = h({
                        el: c.querySelector(".list-view"),
                        collection: u,
                        model: b.model
                    }), z = i({
                        el: c.querySelector(".map-view"),
                        catalog: u,
                        model: b.model
                    }), B = l({
                        el: c.querySelector(".settings-view"),
                        catalog: u,
                        config: v,
                        model: b.model
                    }), t = d({
                        el: c.querySelector(".about-view"),
                        model: b.model
                    }), x = f({
                        el: c.querySelector(".event-summary-view"),
                        catalog: u,
                        model: b.model
                    }), C = m({
                        config: v,
                        defaults: n.extend({}, q, a.settings),
                        model: b.model
                    }), C.start()
                }, b.destroy = n.compose(function () {
                    null !== b && (C.destroy(), t.destroy(), y.destroy(), z.destroy(), A.destroy(), B.destroy(), v.destroy(), u.destroy(), u = null, v = null, w = null, t = null, y = null, z = null, A = null, B = null, b = null, c = null, C = null)
                }, b.destroy), b.render = function () {
                    var a;
                    a = (b.model.get("viewModes") || []).map(function (a) {
                        return a.id
                    }), v.options.viewModes.data().forEach(function (c) {
                        b.setMode(c.id, -1 !== a.indexOf(c.id))
                    })
                }, b.revertToDefaultFeed = function () {
                    b.model.set({
                        feed: v.options.feed.get("1day_m25")
                    })
                }, b.setMode = function (a, b) {
                    var c;
                    c = "mode-" + a, b ? w.classList.add(c) : w.classList.remove(c)
                }, c(a), a = null, b
            };
        b.exports = t
    }, {
        "about/AboutView": 23,
        "latesteqs/Catalog": 30,
        "latesteqs/LatestEarthquakesConfig": 33,
        "latesteqs/LatestEarthquakesUrlManager": 34,
        "latesteqs/ScenariosConfig": 35,
        "list/ListView": 39,
        "map/MapView": 45,
        "modes/ModesView": 47,
        "mvc/View": 18,
        "settings/SettingsView": 50,
        "summary/EventSummaryView": 52,
        "util/Util": 21
    }],
    33: [function (a, b, c) {
        "use strict";
        var d = a("core/Config"),
            e = a("list/DefaultListFormat"),
            f = a("list/DyfiListFormat"),
            g = a("leaflet/layer/Grayscale"),
            h = a("list/PagerListFormat"),
            i = a("leaflet/layer/Satellite"),
            j = a("list/ShakeMapListFormat"),
            k = a("leaflet/layer/Street"),
            l = a("leaflet/layer/TectonicPlates"),
            m = a("leaflet/layer/Terrain"),
            n = a("leaflet/layer/UsFault"),
            o = a("leaflet/layer/UsHazard"),
            p = a("util/Util"),
            q = {
                autoUpdate: [{
                    id: "autoUpdate",
                    name: "Auto Update"
                }],
                basemap: [{
                    id: "grayscale",
                    name: "Grayscale",
                    layer: g()
                }, {
                    id: "terrain",
                    name: "Terrain",
                    layer: m({
                        provider: m.NATGEO
                    })
                }, {
                    id: "street",
                    name: "Street",
                    layer: k()
                }, {
                    id: "satellite",
                    name: "Satellite",
                    layer: i()
                }],
                event: {},
                feed: [{
                    id: "1day_m25",
                    name: "1 Day, Magnitude 2.5+ U.S.",
                    url: "/earthquakes/feed/v1.0/summary/2.5_day.geojson",
                    autoUpdate: 6e4
                }, {
                    id: "1day_all",
                    name: "1 Day, All Magnitudes U.S.",
                    url: "/earthquakes/feed/v1.0/summary/all_day.geojson",
                    autoUpdate: 6e4
                }, {
                    id: "7day_m45",
                    name: "7 Days, Magnitude 4.5+ U.S.",
                    url: "/earthquakes/feed/v1.0/summary/4.5_week.geojson",
                    autoUpdate: 6e4
                }, {
                    id: "7day_m25",
                    name: "7 Days, Magnitude 2.5+ U.S.",
                    url: "/earthquakes/feed/v1.0/summary/2.5_week.geojson",
                    autoUpdate: 6e4
                }, {
                    id: "7day_all",
                    name: "7 Days, All Magnitudes U.S.",
                    url: "/earthquakes/feed/v1.0/summary/all_week.geojson",
                    autoUpdate: 6e4
                }, {
                    id: "30day_sig",
                    name: "30 Days, Significant Worldwide",
                    url: "/earthquakes/feed/v1.0/summary/significant_month.geojson",
                    autoUpdate: 9e5
                }, {
                    id: "30day_m45",
                    name: "30 Days, Magnitude 4.5+ U.S.",
                    url: "/earthquakes/feed/v1.0/summary/4.5_month.geojson",
                    autoUpdate: 9e5
                }, {
                    id: "30day_m25",
                    name: "30 Days, Magnitude 2.5+ U.S.",
                    url: "/earthquakes/feed/v1.0/summary/2.5_month.geojson",
                    autoUpdate: 9e5
                }],
                listFormat: [{
                    id: "default",
                    name: "Magnitude",
                    format: e()
                }, {
                    id: "dyfi",
                    name: "DYFI",
                    format: f()
                }, {
                    id: "shakemap",
                    name: "ShakeMap",
                    format: j()
                }, {
                    id: "losspager",
                    name: "PAGER",
                    format: h()
                }],
                viewModes: [{
                    id: "list",
                    name: "List",
                    icon: "&#xE896;"
                }, {
                    id: "map",
                    name: "Map",
                    icon: "&#xE894;"
                }, {
                    id: "settings",
                    name: "Settings",
                    icon: "&#xE8B8;"
                }, {
                    id: "help",
                    name: "About",
                    icon: "&#xE8FD;"
                }],
                overlays: [{
                    id: "plates",
                    name: "Plate Boundaries",
                    layer: l({
                        tileUrl: "/basemap/tiles/plates/{z}/{x}/{y}.png",
                        maxZoom: 12,
                        zIndex: 5
                    })
                }, {
                    id: "faults",
                    name: "U.S. Faults",
                    layer: n({
                        tileUrl: "/basemap/tiles/faults/{z}/{x}/{y}.png",
                        tileOpts: {
                            maxZoom: 12,
                            zIndex: 4
                        },
                        dataUrl: "/basemap/tiles/faults/{z}/{x}/{y}.grid.json?callback={cb}",
                        dataOpts: {
                            maxZoom: 12
                        }
                    })
                }, {
                    id: "ushazard",
                    name: "U.S. Hazard",
                    layer: o({
                        maxZoom: 12,
                        opacity: .6,
                        tileUrl: "/basemap/tiles/ushaz/{z}/{x}/{y}.png",
                        zIndex: 3
                    })
                }],
                restrictListToMap: [{
                    id: "restrictListToMap",
                    name: "Only List Earthquakes Shown on Map"
                }],
                sort: [{
                    id: "newest",
                    name: "Newest first",
                    sort: function (a, b) {
                        return b.properties.time - a.properties.time
                    }
                }, {
                    id: "oldest",
                    name: "Oldest first",
                    sort: function (a, b) {
                        return a.properties.time - b.properties.time
                    }
                }, {
                    id: "largest",
                    name: "Largest magnitude first",
                    sort: function (a, b) {
                        return b.properties.mag - a.properties.mag
                    }
                }, {
                    id: "smallest",
                    name: "Smallest magnitude first",
                    sort: function (a, b) {
                        return a.properties.mag - b.properties.mag
                    }
                }],
                timezone: [{
                    id: "utc",
                    name: '<abbr title="Coordinated Universal Time">UTC</abbr>',
                    offset: 0
                }, {
                    id: "local",
                    name: "Local System Time",
                    offset: -1 * (new Date).getTimezoneOffset()
                }]
            },
            r = function (a) {
                var b;
                return b = d(p.extend({}, q, a)), a = null, b
            };
        b.exports = r
    }, {
        "core/Config": 24,
        "leaflet/layer/Grayscale": 5,
        "leaflet/layer/Satellite": 8,
        "leaflet/layer/Street": 9,
        "leaflet/layer/TectonicPlates": 10,
        "leaflet/layer/Terrain": 11,
        "leaflet/layer/UsFault": 13,
        "leaflet/layer/UsHazard": 14,
        "list/DefaultListFormat": 36,
        "list/DyfiListFormat": 38,
        "list/PagerListFormat": 41,
        "list/ShakeMapListFormat": 42,
        "util/Util": 21
    }],
    34: [function (a, b, c) {
        "use strict";
        var d = a("core/UrlManager"),
            e = a("util/Util"),
            f = {
                hiddenSettings: ["searchForm", "searchUrl"]
            },
            g = function (a) {
                var b, c, g, h, i;
                return b = d(a), h = e.extend({}, b), c = function (a) {
                    a = e.extend({}, f, a), g = a.hiddenSettings, i = null
                }, b.convertBooleanToArray = function (a, b) {
                    var c;
                    return a.hasOwnProperty(b) && "boolean" == typeof a[b] && (c = [], a[b] === !0 && c.push(b), a[b] = c), a
                }, b.destroy = function () {
                    null !== h && (h.destroy(), h = null, b = null)
                }, b.getModelSettings = e.compose(b.getModelSettings, function (a) {
                    return b.hideSettings(a), a
                }), b.getUrlSettings = e.compose(b.getUrlSettings, function (a) {
                    return b.convertBooleanToArray(a, "restrictListToMap"), b.convertBooleanToArray(a, "autoUpdate"), a
                }), b.hideSettings = function (a) {
                    return g.forEach(function (b) {
                        delete a[b]
                    }), a
                }, b.setModelSettings = function (a, c) {
                    var d;
                    a.search && (d = b.config.options.feed, null !== i && d.remove(i), i = a.search, null !== i && d.add(i)), c || b.hideSettings(a), h.setModelSettings(a, c)
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "core/UrlManager": 28,
        "util/Util": 21
    }],
    35: [function (a, b, c) {
        "use strict";
        var d = a("core/Config"),
            e = a("list/DefaultListFormat"),
            f = a("leaflet/layer/Grayscale"),
            g = a("leaflet/layer/Satellite"),
            h = a("list/ShakeMapListFormat"),
            i = a("leaflet/layer/Street"),
            j = a("leaflet/layer/TectonicPlates"),
            k = a("leaflet/layer/Terrain"),
            l = a("leaflet/layer/UsFault"),
            m = a("leaflet/layer/UsHazard"),
            n = a("util/Util"),
            o = {
                basemap: [{
                    id: "grayscale",
                    name: "Grayscale",
                    layer: f()
                }, {
                    id: "terrain",
                    name: "Terrain",
                    layer: k({
                        provider: k.NATGEO
                    })
                }, {
                    id: "street",
                    name: "Street",
                    layer: i()
                }, {
                    id: "satellite",
                    name: "Satellite",
                    layer: g()
                }],
                event: {},
                feed: [],
                listFormat: [{
                    id: "default",
                    name: "Magnitude",
                    format: e()
                }, {
                    id: "shakemap",
                    name: "ShakeMap",
                    format: h()
                }],
                viewModes: [{
                    id: "list",
                    name: "List",
                    icon: "&#xE896;"
                }, {
                    id: "map",
                    name: "Map",
                    icon: "&#xE894;"
                }, {
                    id: "settings",
                    name: "Settings",
                    icon: "&#xE8B8;"
                }, {
                    id: "help",
                    name: "About",
                    icon: "&#xE8FD;"
                }],
                overlays: [{
                    id: "plates",
                    name: "Plate Boundaries",
                    layer: j({
                        zIndex: 5
                    })
                }, {
                    id: "faults",
                    name: "U.S. Faults",
                    layer: l({
                        tileOpts: {
                            zIndex: 4
                        }
                    })
                }, {
                    id: "ushazard",
                    name: "U.S. Hazard",
                    layer: m({
                        opacity: .6,
                        zIndex: 3
                    })
                }],
                restrictListToMap: [{
                    id: "restrictListToMap",
                    name: "Only List Earthquakes Shown on Map"
                }],
                sort: [{
                    id: "largest",
                    name: "Largest magnitude first",
                    sort: function (a, b) {
                        return b.properties.mag - a.properties.mag
                    }
                }, {
                    id: "smallest",
                    name: "Smallest magnitude first",
                    sort: function (a, b) {
                        return a.properties.mag - b.properties.mag
                    }
                }]
            },
            p = function (a) {
                var b;
                return b = d(n.extend({}, o, a)), a = null, b
            };
        b.exports = p
    }, {
        "core/Config": 24,
        "leaflet/layer/Grayscale": 5,
        "leaflet/layer/Satellite": 8,
        "leaflet/layer/Street": 9,
        "leaflet/layer/TectonicPlates": 10,
        "leaflet/layer/Terrain": 11,
        "leaflet/layer/UsFault": 13,
        "leaflet/layer/UsHazard": 14,
        "list/DefaultListFormat": 36,
        "list/ShakeMapListFormat": 42,
        "util/Util": 21
    }],
    36: [function (a, b, c) {
        "use strict";
        var d = a("core/Formatter"),
            e = a("util/Util"),
            f = {},
            g = function (a) {
                var b, c, g, h;
                return b = {
                    destroy: null,
                    format: null,
                    getAsideMarkup: null,
                    getCalloutMarkup: null,
                    getClasses: null,
                    getHeaderMarkup: null,
                    getProperty: null,
                    getSubheaderMarkup: null
                }, c = function (a) {
                    a = e.extend({}, f, a), g = a.formatter || d(), h = a.timezoneOffset || 0
                }, b.destroy = function () {
                    g = null, c = null, b = null
                }, b.format = function (a) {
                    var c;
                    return c = document.createElement("div"), b.getClasses({
                            eq: a,
                            classes: []
                        }).classes.forEach(function (a) {
                            c.classList.add(a)
                        }), c.innerHTML = ['<span class="list-callout">', b.getCalloutMarkup(a), "</span>", '<h1 class="list-header">', b.getHeaderMarkup(a), "</h1>", '<h2 class="list-subheader">', b.getSubheaderMarkup(a), "</h2>", '<aside class="list-aside">', b.getAsideMarkup(a), "</aside>"].join(""),
                        c
                }, b.getAsideMarkup = function (a) {
                    var b;
                    try {
                        b = a.geometry.coordinates[2]
                    } catch (c) {
                        b = null
                    }
                    return g.depth(b, "km")
                }, b.getCalloutMarkup = function (a) {
                    return g.magnitude(b.getProperty(a, "mag"))
                }, b.getClasses = function (a) {
                    var c, d;
                    return a = a || {}, d = a.eq || {}, c = a.classes || [], c.push("eq-list-item"), b.getProperty(d, "sig") >= 600 ? c.push("bigger") : b.getProperty(d, "mag") >= 4.5 && c.push("big"), a.classes = c, a
                }, b.getHeaderMarkup = function (a) {
                    var c, d;
                    return d = b.getProperty(a, "type") || null, c = b.getProperty(a, "place") || "Unknown Event", null === d || "earthquake" === d.toLowerCase() ? c : (d = d.toLowerCase(), d = "quarry" === d ? "Quarry Blast" : "nuke" === d ? "Nuclear Explosion" : "rockfall" === d ? "Rockslide" : "rockburst" === d ? "Rockslide" : "sonicboom" === d ? "Sonic Boom" : d.replace(/\w\S*/g, function (a) {
                        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase()
                    }), d + " " + c)
                }, b.getProperty = function (a, b) {
                    var c;
                    return a = a || {}, c = a.properties || {}, c.hasOwnProperty(b) ? c[b] : null
                }, b.getSubheaderMarkup = function (a) {
                    var c;
                    return SCENARIO_MODE ? (c = b.getProperty(a, "sources"), c = c.replace(/^,|,$/g, ""), c = c.replace(/,/g, ", "), c = c.toUpperCase()) : g.datetime(b.getProperty(a, "time"), h)
                }, b.setTimezoneOffset = function (a) {
                    h = a || 0
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "core/Formatter": 25,
        "util/Util": 21
    }],
    37: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("util/Util"),
            f = a("mvc/View"),
            g = {
                formats: [{
                    title: "ATOM",
                    description: "For Web Applications",
                    search: null,
                    extension: ".atom"
                }, {
                    title: "CSV",
                    description: "For spreadsheets",
                    search: "csv",
                    extension: ".csv"
                }, {
                    title: "GeoJson",
                    description: "For web applications",
                    search: "geojson",
                    extension: ".geojson"
                }, {
                    title: "KML - Color by Age",
                    description: "For google maps",
                    search: "kml&kmlcolorby=age",
                    extension: "_age.kml"
                }, {
                    title: "KML - Color by Age (animated)",
                    description: "For google maps",
                    search: "kml&kmlcolorby=age&kmlanimated=true",
                    extension: "_age_animated.kml"
                }, {
                    title: "KML - Color by Depth",
                    description: "For google maps",
                    search: "kml&kmlcolorby=depth",
                    extension: "_depth.kml"
                }, {
                    title: "KML - Color by Depth (animated)",
                    description: "For google maps",
                    search: "kml&kmlcolorby=depth&kmlanimated=true",
                    extension: "_depth_animated.kml"
                }, {
                    title: "QuakeML",
                    description: "For google maps",
                    search: "quakeml",
                    extension: ".quakeml"
                }]
            },
            h = function (a) {
                var b, c, h;
                return a = e.extend({}, g, a), h = f(a), b = function (a) {
                    h.collection = a.collection || d(), c = a.formats, h.collection.on("reset", "render", h), h.model.off("change", "render", h)
                }, h.destroy = e.compose(function () {
                    h.model.on("change", "render", h), c = null, b = null, h = null
                }, h.destroy), h.getDownloadLinks = function () {
                    var a, b, d, e, f, g, i;
                    if (a = [], void 0 !== h.collection.metadata && null !== h.collection.metadata && null !== h.collection.metadata.url) {
                        i = h.collection.metadata.url, e = c.length, ".geojson" === i.substr(-".geojson".length) ? (f = !1, g = ".geojson") : (f = !0, g = "geojson");
                        for (var j = 0; e > j; j++) b = c[j], f && null !== b.search ? (d = i.replace(/&callback=[\w]+/, "").replace("&jsonerror=true", ""), d = d.replace(g, encodeURI(b.search)), a.push({
                            title: b.title,
                            href: d,
                            description: b.description
                        })) : f || (d = i.replace(g, "") + b.extension, d = encodeURI(d), a.push({
                            title: b.title,
                            href: d,
                            description: b.description
                        }))
                    }
                    return a
                }, h.render = function () {
                    var a, b;
                    b = [], a = h.getDownloadLinks(), b.push('<ul class="download-view">');
                    for (var c = 0; c < a.length; c++) b.push('<li> <a class="download" href="' + a[c].href + '">' + a[c].title + "</a>"), a[c].description && b.push('<span class="download-description"> (' + a[c].description + ")</span>"), b.push("</li>");
                    b.push("</ul>"), h.el.innerHTML = b.join("")
                }, b(a), a = null, h
            };
        b.exports = h
    }, {
        "mvc/Collection": 15,
        "mvc/View": 18,
        "util/Util": 21
    }],
    38: [function (a, b, c) {
        "use strict";
        var d = a("list/DefaultListFormat"),
            e = a("core/Formatter"),
            f = a("util/Util"),
            g = {},
            h = function (a) {
                var b, c, h;
                return a = f.extend({}, g, a), b = d(a), c = function (a) {
                    h = a.formatter || e()
                }, b.destroy = function () {
                    h = null, c = null, b = null
                }, b.getAsideMarkup = function (a) {
                    var c, d;
                    return c = b.getProperty(a, "felt"), d = null !== c ? 1 !== c ? c + " responses" : c + " response" : "&ndash; responses", '<span class="responses">' + d + "</span>"
                }, b.getCalloutMarkup = function (a) {
                    var c, d, e;
                    return d = b.getProperty(a, "felt"), null === d ? (c = "&ndash;", e = "no-dyfi") : (c = b.getProperty(a, "cdi"), c = h.mmi(c), e = "roman mmi mmi" + c), '<span class="' + e + '">' + c + "</span>"
                }, b.getClasses = f.compose(b.getClasses, function (a) {
                    return a = a || {}, a.classes = a.classes || [], a.classes.push("dyfi-list-item"), a
                }), b.getHeaderMarkup = function (a) {
                    return b.getProperty(a, "title")
                }, c(a), a = null, b
            };
        b.exports = h
    }, {
        "core/Formatter": 25,
        "list/DefaultListFormat": 36,
        "util/Util": 21
    }],
    39: [function (a, b, c) {
        "use strict";
        var d, e, f = a("accordion/Accordion"),
            g = a("core/Formatter"),
            h = a("core/GenericCollectionView"),
            i = a("core/MapUtil"),
            j = a("list/MetadataView"),
            k = a("util/Util");
        d = {
            format: function (a) {
                var b;
                return b = document.createElement("pre"), b.classList.add("list-view-default-format"), b.innerHTML = JSON.stringify(a, null, "  "), b
            }
        }, e = {
            classPrefix: "list-view",
            containerNodeName: "ol",
            noDataMessage: "There are no events in the current feed.",
            watchProperty: "event"
        };
        var l = function (a) {
            var b, c, l, m, n, o, p, q, r, s, t, u;
            return a = k.extend({}, e, a), b = h(a), c = function (a) {
                p = a.formatter || g(), u = a.noDataMessage, b.filterEnabled = !1, b.mapEnabled = !1, b.model.on("change:listFormat", "render", b), b.model.on("change:timezone", "render", b), b.model.on("change:restrictListToMap", "onRestrictListToMap", b), b.footer.addEventListener("click", b.onFooterClick), b.header.classList.add("accordion"), b.header.classList.add("accordion-closed"), b.header.innerHTML = '<h3 class="header-title"></h3><span class="header-count"></span><span class="metadata-view-toggle accordion-toggle">Click for more information</span><div class="accordion-content metadata-view"></div>', b.metadataViewEl = b.header.querySelector(".metadata-view"), f({
                    el: b.header
                }), r = b.header.querySelector(".header-title"), q = b.header.querySelector(".header-count"), b.metadataView = j({
                    el: b.metadataViewEl,
                    collection: b.collection,
                    model: b.model
                })
            }, b.createCollectionItemContent = function (a) {
                var c;
                return c = t, c || (c = b.model.get("listFormat"), c = c ? c.format : d), c.format(a)
            }, b.destroy = k.compose(function () {
                b.footer.removeEventListener("click", b.onFooterClick), b.model.off("change:listFormat", "render", b), b.model.off("change:timezone", "render", b), b.model.off("change:restrictListToMap", "onRestrictListToMap", b), l = null, m = null, n = null, o = null, p = null, q = null, r = null, s = null, t = null, c = null, b = null
            }, b.destroy), b.filterEvents = function (a) {
                var c, d, e;
                for (b.mapEnabled = !1, e = b.model.get("viewModes") || [], d = 0; d < e.length; d++) "map" === e[d].id && (b.mapEnabled = !0);
                return b.mapEnabled && (l = b.model.get("mapposition")), l ? (c = [], c = a.filter(function (a) {
                    var b;
                    return b = a.geometry.coordinates, i.boundsContain(l, [b[1], b[0]])
                })) : a
            }, b.formatCountInfo = function (a, b, c) {
                var d;
                return d = c ? b + " of " + a + " earthquakes in map area." : a + " earthquakes."
            }, b.getDataToRender = function () {
                var a;
                return a = b.collection.data().slice(0), b.filterEnabled && (a = b.filterEvents(a)), a
            }, b.onFooterClick = function (a) {
                var c;
                c = a.target, c.classList.contains("settings-link") && b.onSettingsLinkClick()
            }, b.onRestrictListToMap = function () {
                var a;
                if (a = b.model.get("restrictListToMap"), a && 1 === a.length) {
                    if (b.filterEnabled) return;
                    b.filterEnabled = !0, b.model.on("change:mapposition", b.render, b)
                } else {
                    if (!b.filterEnabled) return;
                    b.filterEnabled = !1, b.model.off("change:mapposition", b.render, b)
                }
                b.render()
            }, b.onSettingsLinkClick = function () {
                b.model.set({
                    viewModes: [{
                        id: "settings"
                    }]
                })
            }, b.render = k.compose(function () {
                var a, c;
                a = b.model.get("listFormat"), a ? (a = a.format, c = b.model.get("timezone"), c && a.setTimezoneOffset(c.offset)) : a = d, t = a
            }, b.render), b.renderFooter = function () {
                var a;
                a = '<h4>Didn&apos;t find what you were looking for?</h4><ul><li>Check your <a href="javascript:void(null);" class="settings-link">Settings</a>.</li>' + (SCENARIO_MODE ? "" : '<li><a href="/data/comcat/data-availability.php">Which earthquakes are included on the map and list?</a></li><li><a href="/earthquakes/eventpage/unknown#tellus">Felt something not shown – report it here.</a></li>') + "</ul>", b.footer.innerHTML = a
            }, b.renderHeader = function () {
                var a, c, d, e, f;
                e = b.collection.metadata || {}, d = b.model.get("feed").name, f = e.hasOwnProperty("count") ? e.count : "&ndash;", a = b.getDataToRender().length, c = b.formatCountInfo(f, a, b.filterEnabled), r.innerHTML = d, q.innerHTML = c, b.metadataView.render()
            }, c(a), a = null, b
        };
        b.exports = l
    }, {
        "accordion/Accordion": 1,
        "core/Formatter": 25,
        "core/GenericCollectionView": 26,
        "core/MapUtil": 27,
        "list/MetadataView": 40,
        "util/Util": 21
    }],
    40: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("list/DownloadView"),
            f = a("core/Formatter"),
            g = a("core/GenericCollectionView"),
            h = a("mvc/ModalView"),
            i = a("util/Util"),
            j = {
                noDataMessage: "There are no events in the current feed."
            },
            k = function (a) {
                var b, c;
                return a = i.extend({}, j, a), c = g(a), b = function (a) {
                    c.collection = a.collection || d(), c.formatter = a.formatter || f(), c.model.off("change", "render", c), c.model.on("change:feed", "displaySearchParameters", c), c.el.innerHTML = '<dl class="metadata-list feed-metadata-list"><dt>Last Updated</dt><dd class="feed-update-time"></dd></dl><button class="download-button blue" type="button">Download</button><div class="search-parameter-view"><div>', c.downloadButtonEl = c.el.querySelector(".download-button"), c.downloadButtonEl.addEventListener("click", c.onDownloadButtonClick), c.feedUpdateTimeEl = c.el.querySelector(".feed-update-time"), c.searchButtonEl = document.createElement("button"), c.searchButtonEl.addEventListener("click", c.onSearchButtonClick), c.searchButtonEl.classList.add("search-button"), c.searchButtonEl.classList.add("blue"), c.searchButtonEl.innerHTML = "Modify Search", c.searchParameterViewEl = c.el.querySelector(".search-parameter-view"), c.downloadView = e({
                        model: c.model,
                        collection: c.collection
                    }), c.downloadModal = h(c.downloadView.el, {
                        title: "Download"
                    })
                }, c.destroy = i.compose(function () {
                    c && (c.downloadButtonEl.removeEventListener("click", c.onDownloadButtonClick), c.searchButtonEl.removeEventListener("click", c.onSearchButtonClick), c.model.on("change", "render", c), c.model.off("change:feed", "displaySearchParameters", c), b = null, c = null)
                }, c.destroy), c.displaySearchParameters = function () {
                    var a, b, d, e;
                    if (b = this.model.get("feed") || {}, i.empty(c.searchParameterViewEl), b.isSearch) {
                        a = [], e = b.params;
                        for (d in e) a.push("<dt>" + d + "</dt><dd>" + e[d] + "</dd>");
                        c.searchParameterViewEl.innerHTML = '<h4>Search Parameters</h4><dl class="metadata-list search-parameter-list">' + a.join("") + "</dl>", c.searchParameterViewEl.appendChild(c.searchButtonEl)
                    }
                }, c.onDownloadButtonClick = function () {
                    c.downloadModal.show()
                }, c.onSearchButtonClick = function () {
                    c.setWindowLocation(SEARCH_PATH + window.location.hash)
                }, c.render = function () {
                    var a, b;
                    a = c.collection.metadata || {}, b = c.formatter.datetime(a.generated), c.feedUpdateTimeEl.innerHTML = b, c.displaySearchParameters()
                }, c.setWindowLocation = function (a) {
                    window.location = a
                }, b(a), a = null, c
            };
        b.exports = k
    }, {
        "core/Formatter": 25,
        "core/GenericCollectionView": 26,
        "list/DownloadView": 37,
        "mvc/Collection": 15,
        "mvc/ModalView": 16,
        "util/Util": 21
    }],
    41: [function (a, b, c) {
        "use strict";
        var d = a("list/DefaultListFormat"),
            e = a("core/Formatter"),
            f = a("util/Util"),
            g = {},
            h = function (a) {
                var b, c, h;
                return a = f.extend({}, g, a), b = d(a), c = function (a) {
                    h = a.formatter || e()
                }, b.destroy = function () {
                    h = null, c = null, b = null
                }, b.getAsideMarkup = function (a) {
                    var c, d;
                    return d = b.getProperty(a, "mmi"), null !== d ? (d = h.mmi(d), '<span class="roman mmi mmi' + d + '">' + d + '</span> <abbr title="Modified Mercalli Intensity">MMI</abbr>') : c = "&ndash;"
                }, b.getCalloutMarkup = function (a) {
                    var c, d;
                    return c = b.getProperty(a, "alert"), d = null === c ? "&ndash;" : '<span class="alert pager-alertlevel-' + c.toLowerCase() + '">' + c.substring(0, 1).toUpperCase() + "</span>"
                }, b.getClasses = f.compose(b.getClasses, function (a) {
                    return a = a || {}, a.classes = a.classes || [], a.classes.push("pager-list-item"), a
                }), b.getHeaderMarkup = function (a) {
                    return b.getProperty(a, "title")
                }, c(a), a = null, b
            };
        b.exports = h
    }, {
        "core/Formatter": 25,
        "list/DefaultListFormat": 36,
        "util/Util": 21
    }],
    42: [function (a, b, c) {
        "use strict";
        var d = a("list/DefaultListFormat"),
            e = a("core/Formatter"),
            f = a("util/Util"),
            g = {},
            h = function (a) {
                var b, c, h;
                return a = f.extend({}, g, a), b = d(a), c = function (a) {
                    h = a.formatter || e()
                }, b.destroy = function () {
                    h = null, c = null, b = null
                }, b.getCalloutMarkup = function (a) {
                    var c, d;
                    return c = b.getProperty(a, "mmi"), null !== c ? (c = h.mmi(c), '<span class="roman mmi mmi' + c + '">' + c + "</span>") : d = "&ndash;"
                }, b.getClasses = f.compose(b.getClasses, function (a) {
                    return a = a || {}, a.classes = a.classes || [], a.classes.push("shakemap-list-item"), a
                }), b.getHeaderMarkup = function (a) {
                    return b.getProperty(a, "title")
                }, c(a), a = null, b
            };
        b.exports = h
    }, {
        "core/Formatter": 25,
        "list/DefaultListFormat": 36,
        "util/Util": 21
    }],
    43: [function (a, b, c) {
        "use strict";
        var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y = a("mvc/Collection"),
            z = a("core/Formatter"),
            A = a("mvc/Model"),
            B = a("util/Util");
        f = 36e5, d = 24 * f, k = 7 * d, h = 30 * d, g = "eq-age-hour", e = "eq-age-day", l = "eq-age-week", i = "eq-age-month", j = "eq-age-older", m = "eq-mag-unknown", n = "eq-mag-0", o = "eq-mag-1", p = "eq-mag-2", q = "eq-mag-3", r = "eq-mag-4", s = "eq-mag-5", t = "eq-mag-6", u = "eq-mag-7", v = "eq-type-eq", w = "eq-type-other", x = "rotate(45deg) scale(0.7071, 0.7071)";
        var C = {},
            D = function (a) {
                var b, c, D, E, F, G;
                return b = {}, c = function (a) {
                    a = B.extend({}, C, a), b.collection = a.collection || y(), b.el = a.el || document.createElement("div"), b.formatter = a.formatter || z(), b.model = a.model || A(), b.map = null, b.el.classList.add("earthquake-layer"), b.el.classList.add("leaflet-zoom-hide"), b.collection.on("reset", "render", b), b.el.addEventListener("click", D), b.model.on("change:event", "onSelect", b)
                }, D = function (a) {
                    b.onClick(a)
                }, E = function (a) {
                    b.onMoveEnd(a)
                }, F = function (a) {
                    b.onZoomEnd(a)
                }, G = function (a) {
                    b.render(a)
                }, b.addTo = function (a) {
                    return a.addLayer(b), b
                }, b.destroy = function () {
                    b.collection.off("reset", "render", b), b.el.removeEventListener("click", D), b.model.off("change:event", "onSelect", b), D = null, E = null, F = null, G = null, c = null, b = null
                }, b.getLatLng = function (a, b, c) {
                    var d, e, f;
                    for (d = a.geometry.coordinates, e = d[1], f = d[0]; b >= f;) f += 360;
                    for (; f > c;) f -= 360;
                    return [e, f]
                }, b.getMarker = function (a, c) {
                    var d, e;
                    return d = document.createElement("div"), d.setAttribute("data-id", a.id), e = b.map.latLngToLayerPoint(c), L.DomUtil.setPosition(d, e), b.setMarkerClasses(a, d), d
                }, b.onAdd = function (a) {
                    a.getPanes().overlayPane.appendChild(b.el), a.on("viewreset", G), a.on("zoomend", F), a.on("moveend", E, b), b.map = a, b.onZoomEnd(), b.render()
                }, b.onClick = function (a) {
                    var c, d, e;
                    c = null, e = a.target, d = e.getAttribute("data-id"), d && (c = b.collection.get(d)), b.model.set({
                        event: c
                    }), a && a.stopPropagation && a.stopPropagation()
                }, b.onMoveEnd = function () {
                    b.render()
                }, b.onRemove = function (a) {
                    a.getPanes().overlayPane.removeChild(b.el), a.off("viewreset", G), a.off("zoomend", F), b.map = null
                }, b.onSelect = function () {
                    var a, c, d;
                    d = b.el.querySelectorAll(".selected"), Array.prototype.forEach.call(d, function (a) {
                        a.classList.remove("selected")
                    }), a = b.model.get("event"), a && (c = b.el.querySelector('[data-id="' + a.id + '"]'), c && c.classList.add("selected"))
                }, b.onZoomEnd = function () {
                    var a, c;
                    null !== b.map && (a = b.el, c = b.map.getZoom(), c > 10 ? (b.map._container.classList.add("zoomedin"), b.map._container.classList.remove("zoomednormal"), b.map._container.classList.remove("zoomedout")) : c > 5 ? (b.map._container.classList.remove("zoomedin"), b.map._container.classList.add("zoomednormal"), b.map._container.classList.remove("zoomedout")) : (b.map._container.classList.remove("zoomedin"), b.map._container.classList.remove("zoomednormal"), b.map._container.classList.add("zoomedout")))
                }, b.render = function () {
                    var a, c, d, e, f, g, h, i, j, k;
                    if (null !== b.map) {
                        for (c = b.collection.data(), d = b.el, f = document.createDocumentFragment(), j = b.map, a = j.getCenter().lng, h = a - 180, i = a + 180, g = c.length - 1; g >= 0; g--) e = c[g], k = b.getMarker(e, b.getLatLng(e, h, i)), f.appendChild(k);
                        d.innerHTML = "", d.appendChild(f), b.onSelect()
                    }
                }, b.setMarkerClasses = function (a, b) {
                    var c, y, z, A, B, C, D, E, F, G;
                    return b.classList.add("earthquake-marker"), (E = a.properties) ? (A = E.mag, F = E.type, SCENARIO_MODE ? (C = E.mmi, D = "mmi" + this.formatter.mmi(C), b.classList.add(D)) : (c = (new Date).getTime() - E.time, y = f >= c ? g : d >= c ? e : k >= c ? l : h >= c ? i : j, b.classList.add(y)), B = A || 0 === A ? A >= 7 ? u : A >= 6 ? t : A >= 5 ? s : A >= 4 ? r : A >= 3 ? q : A >= 2 ? p : A >= 1 ? o : n : m, b.classList.add(B), "earthquake" === F ? G = v : (G = w, b.style.transform = (b.style.transform ? b.style.transform + " " : "") + x), void b.classList.add(G)) : z
                }, c(a), a = null, b
            };
        b.exports = D
    }, {
        "core/Formatter": 25,
        "mvc/Collection": 15,
        "mvc/Model": 17,
        "util/Util": 21
    }],
    44: [function (a, b, c) {
        "use strict";
        var d = L.Control.extend({
            options: {
                position: "bottomright"
            },
            onAdd: function () {
                var a, b;
                return a = L.DomUtil.create("div", "legend-control"), a.innerHTML = ['<div class="legend-container hide">', '<div class="legend-control-item">', "<h5>Magnitude</h5>", '<ol class="magnitude-legend">', '<li class="earthquake-marker eq-type-eq eq-mag-0"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-1"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-2"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-3"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-4"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-5"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-6"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-7"></li>', "</ol>", "</div>", '<div class="legend-control-item">', "<h5>Age (past)</h5>", '<ol class="age-legend">', "<li>", '<span class="earthquake-marker eq-age-hour"></span>', "<span>Hour</span>", "</li>", "<li>", '<span class="earthquake-marker eq-age-day"></span>', "<span>Day</span>", "</li>", "<li>", '<span class="earthquake-marker eq-age-week"></span>', "<span>Week</span>", "</li>", "<li>", '<span class="earthquake-marker eq-age-month"></span>', "<span>Month</span>", "</li>", "<li>", '<span class="earthquake-marker eq-age-older"></span>', "<span>Older</span>", "</li>", "</div>", '<div class="legend-container-message">', '<div class="collapsed">show legend</div>', '<div class="expanded">hide legend</div>', "</div>", "</div>"].join(""), b = a.querySelector(".legend-container"), b.addEventListener("click", function () {
                    this.classList.contains("hide") ? (this.classList.remove("hide"), this.classList.add("show")) : (this.classList.remove("show"), this.classList.add("hide"))
                }), a
            }
        });
        L.Control.LegendControl = d, L.control.legendControl = function (a) {
            return new d(a)
        }, b.exports = L.control.legendControl
    }, {}],
    45: [function (a, b, c) {
        "use strict";
        a("leaflet/control/MousePosition"), a("leaflet/control/ZoomToControl"), a("map/LegendControl"), a("map/ScenarioLegendControl");
        var d = a("map/EarthquakeLayer"),
            e = a("core/MapUtil"),
            f = a("util/Util"),
            g = a("mvc/View"),
            h = {
                locations: [{
                    title: "Alaska",
                    id: "alaska",
                    bounds: [
                        [72, -175],
                        [50, -129]
                    ]
                }, {
                    title: "California",
                    id: "california",
                    bounds: [
                        [42, -125],
                        [32, -113]
                    ]
                }, {
                    title: "Central U.S.",
                    id: "central_us",
                    bounds: [
                        [32, -104],
                        [40, -88]
                    ]
                }, {
                    title: "Hawaii",
                    id: "hawaii",
                    bounds: [
                        [22, -160],
                        [18, -154]
                    ]
                }, {
                    title: "Puerto Rico",
                    id: "puerto_rico",
                    bounds: [
                        [20, -70],
                        [16, -62]
                    ]
                }, {
                    title: "U.S.",
                    id: "us",
                    bounds: [
                        [50, -125],
                        [24.6, -65]
                    ]
                }, {
                    title: "World",
                    id: "world",
                    bounds: [
                        [70, 20],
                        [-70, 380]
                    ]
                }]
            },
            i = function (a) {
                var b, c, i, j, k, l, m, n, o, p, q, r, s;
                return b = g(a), c = function (a) {
                    var c;
                    a = f.extend({}, h, a), c = b.el, c.innerHTML = '<div class="map"></div>', b.basemap = null, b.ignoreNextMoveEnd = !1, b.overlays = [], b.config = a.config, b.map = L.map(c, {
                        attributionControl: !1,
                        maxBounds: [
                            [-90, -(1 / 0)],
                            [90, 1 / 0]
                        ],
                        zoomAnimation: !1
                    }), i = d({
                        collection: a.catalog,
                        model: b.model
                    }), b.map.addLayer(i), f.isMobile() || L.control.mousePosition().addTo(b.map), SCENARIO_MODE ? (L.control.scenarioLegendControl().addTo(b.map), b.createScenarioBadge()) : L.control.legendControl().addTo(b.map), L.control.scale({
                        position: "bottomright"
                    }).addTo(b.map), L.control.zoomToControl({
                        locations: a.locations,
                        position: "topright"
                    }).addTo(b.map), b.map.on("click", o, b), b.map.on("moveend", n, b), b.model.on("change:basemap", "onBasemapChange", b), b.model.on("change:mapposition", "onMapPositionChange", b), b.model.on("change:overlays", "onOverlayChange", b), b.model.on("change:viewModes", "onViewModesChange", b), b.model.on("change:event", "onChangeEvent", b)
                }, o = function () {
                    b.onClick()
                }, n = function () {
                    b.onMoveEnd()
                }, b.createScenarioBadge = function () {
                    var a;
                    a = document.createElement("div"), a.classList.add("scenario-badge", "leaflet-control", "alert", "warning"), a.innerHTML = "Scenarios", b.el.appendChild(a)
                }, b.deselectEventonMoveEnd = function () {
                    var a, c, d;
                    a = b.map.getBounds(), c = b.model.get("event"), a && c && b.isFilterEnabled() && (d = [c.geometry.coordinates[1], c.geometry.coordinates[0]], a = [
                        [a._southWest.lat, a._southWest.lng],
                        [a._northEast.lat, a._northEast.lng]
                    ], e.boundsContain(a, d) || b.model.set({
                        event: null
                    }))
                }, b.destroy = f.compose(function () {
                    b.map.off("click", o, b), b.map.off("moveend", n, b), b.model.off("change:basemap", j, b), b.model.off("change:mapposition", k, b), b.model.off("change:overlays", l, b), b.model.off("change:viewModes", m, b), b.model.off("change:event", b.onChangeEvent, b), b.map.removeLayer(i), i.destroy(), i = null, j = null, o = null, k = null, n = null, l = null, p = null, q = null, r = null, s = null, c = null, b = null
                }, b.destroy), b.getEventLocation = function () {
                    var a, c, d, e;
                    return a = b.model.get("event"), null !== a ? (d = a.geometry.coordinates[1], e = a.geometry.coordinates[0], c = [d, e]) : void 0
                }, b.getPaddedBounds = function (a, b) {
                    var c, d;
                    return d = 5, c = new L.LatLngBounds([Math.max(a - d, -90), Math.max(b - d, -180)], [Math.min(a + d, 90), Math.min(b + d, 180)])
                }, b.hasBounds = function () {
                    return !b.map.getSize().equals(new L.Point(0, 0))
                }, b.isEnabled = function () {
                    var a, c;
                    for (c = b.model.get("viewModes"), a = 0; a < c.length; a++)
                        if ("map" === c[a].id) return !0;
                    return !1
                }, b.isFilterEnabled = function () {
                    var a;
                    return a = b.model.get("restrictListToMap"), 0 === a.length ? !1 : !0
                }, b.onBasemapChange = function () {
                    p = !0
                }, b.onChangeEvent = function () {
                    var a, c, d, f;
                    if (!b.onMoveEndTriggered) try {
                        d = b.map, c = b.getEventLocation(), f = e.convertBounds(d.getBounds()), e.boundsContain(f, c) || (a = b.getPaddedBounds(c[0], c[1]), a.intersects(f) ? d.panTo(c) : d.fitBounds(a, {
                            animate: !1
                        }))
                    } catch (g) {}
                }, b.onClick = function () {
                    b.model.get("event") && b.model.set({
                        event: null
                    })
                }, b.onMapPositionChange = function () {
                    q = !0
                }, b.onMoveEnd = function () {
                    var a;
                    b.deselectEventonMoveEnd(), !b.ignoreNextMoveEnd && b.isEnabled() && b.hasBounds() && (b.onMoveEndTriggered = !0, a = b.map.getBounds(), b.model.set({
                        mapposition: e.convertBounds(a)
                    }), b.onMoveEndTriggered = !1), b.ignoreNextMoveEnd = !1
                }, b.onOverlayChange = function () {
                    r = !0
                }, b.onViewModesChange = function () {
                    s = !0
                }, b.render = function (a) {
                    (s || a === !0) && b.renderViewModesChange(), (p || a === !0) && b.renderBasemapChange(), (r || a === !0) && b.renderOverlayChange(), (q || a === !0) && b.renderMapPositionChange()
                }, b.renderBasemapChange = function () {
                    var a, c;
                    c = b.basemap, a = b.model.get("basemap"), b.basemap = a, p = !1, c && a && c.id === a.id || (c && b.map.removeLayer(c.layer), a && b.map.addLayer(a.layer))
                }, b.renderMapPositionChange = function () {
                    var a, c;
                    if (q = !1, b.isEnabled()) {
                        c = b.model.get("mapposition");
                        try {
                            a = b.map.getBounds()
                        } catch (d) {
                            a = L.latLngBounds([
                                [0, 0],
                                [0, 0]
                            ])
                        }
                        a.equals(c) || b.map.fitBounds(c, {
                            animate: !1
                        })
                    }
                    q = !1
                }, b.renderOverlayChange = function () {
                    var a, c, d, e;
                    for (d = b.overlays.slice(0), c = b.model.get("overlays") || [], b.overlays = c, r = !1, a = 0; a < d.length; a++) e = d[a], f.contains(c, e) || b.map.removeLayer(e.layer);
                    for (a = 0; a < c.length; a++) e = c[a], f.contains(d, e) || b.map.addLayer(e.layer)
                }, b.renderViewModesChange = function () {
                    s = !1, b.isEnabled() && (b.hasBounds() || (b.ignoreNextMoveEnd = !0), b.map.invalidateSize(), b.renderMapPositionChange(), b.model.get("event") && b.onChangeEvent())
                }, c(a), a = null, b
            };
        b.exports = i
    }, {
        "core/MapUtil": 27,
        "leaflet/control/MousePosition": 3,
        "leaflet/control/ZoomToControl": 4,
        "map/EarthquakeLayer": 43,
        "map/LegendControl": 44,
        "map/ScenarioLegendControl": 46,
        "mvc/View": 18,
        "util/Util": 21
    }],
    46: [function (a, b, c) {
        "use strict";
        var d = L.Control.extend({
            options: {
                position: "bottomright"
            },
            onAdd: function () {
                var a, b;
                return a = L.DomUtil.create("div", "legend-control"), a.innerHTML = ['<div class="legend-container hide">', '<div class="legend-control-item">', "<h5>Magnitude</h5>", '<ol class="magnitude-legend">', '<li class="earthquake-marker eq-type-eq eq-mag-0"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-1"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-2"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-3"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-4"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-5"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-6"></li>', '<li class="earthquake-marker eq-type-eq eq-mag-7"></li>', "</ol>", "</div>", '<div class="legend-control-item">', "<h5>Intensity (MMI)</h5>", '<ol class="intensity-legend">', "<li>", '<span class="earthquake-marker eq-type-eq mmiI"></span>', "<span>I</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiII"></span>', "<span>II</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiIII"></span>', "<span>III</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiIV"></span>', "<span>IV</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiV"></span>', "<span>V</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiVI"></span>', "<span>VI</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiVII"></span>', "<span>VII</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiVIII"></span>', "<span>VIII</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiIX"></span>', "<span>IX</span>", "</li>", "<li>", '<span class="earthquake-marker eq-type-eq mmiX"></span>', "<span>X+</span>", "</li>", "</ol>", "</div>", '<div class="legend-container-message">', '<div class="collapsed">show legend</div>', '<div class="expanded">hide legend</div>', "</div>", "</div>"].join(""), b = a.querySelector(".legend-container"), b.addEventListener("click", function () {
                    this.classList.contains("hide") ? (this.classList.remove("hide"), this.classList.add("show")) : (this.classList.remove("show"), this.classList.add("hide"))
                }), a
            }
        });
        L.Control.scenarioLegendControl = d, L.control.scenarioLegendControl = function (a) {
            return new d(a)
        }, b.exports = L.control.scenarioLegendControl
    }, {}],
    47: [function (a, b, c) {
        "use strict";
        var d = a("core/GenericCollectionView"),
            e = a("util/Util"),
            f = {
                classPrefix: "modes-view",
                watchProperty: "viewModes"
            },
            g = function () {
                var a, b, c;
                return a = !1, b = 640, c = window.innerWidth || document.body.clientWidth, b >= c && (a = !0), a
            },
            h = function (a, b) {
                var c, d, e;
                if (g()) e = [b];
                else if ("help" === b.id) e = [{
                    id: "help"
                }];
                else {
                    for (d = -1, e = [], c = 0; c < a.length; c++) b.id !== a[c].id && "help" !== a[c].id ? e.push(a[c]) : b.id === a[c].id && (d = c); - 1 === d ? e.push(b) : 0 === e.length && e.push({
                        id: "help"
                    })
                }
                return e
            },
            i = function (a) {
                var b;
                return a = e.extend({}, f, a), b = d(a), b.createCollectionItemContent = function (a) {
                    var b;
                    return b = document.createElement("i"), b.classList.add("material-icons"), b.setAttribute("title", a.name || "Icon"), b.innerHTML = a.icon || "crop_square", b
                }, b.setSelected = function (a) {
                    var c, d;
                    a && a.forEach(function (a) {
                        d = a.id, c = b.content.querySelector('[data-id="' + d + '"]'), c && c.classList.add("selected")
                    })
                }, b.updateModel = function (a) {
                    b.model.set({
                        viewModes: h(b.model.get("viewModes"), a)
                    })
                }, a = null, b
            };
        i.getModes = h, i.mobileCheck = g, b.exports = i
    }, {
        "core/GenericCollectionView": 26,
        "util/Util": 21
    }],
    48: [function (a, b, c) {
        "use strict";
        var d = a("settings/RadioOptionsView"),
            e = a("util/Util"),
            f = {
                classPrefix: "checkbox-options-view",
                inputType: "checkbox"
            },
            g = function (a) {
                var b;
                return a = e.extend({}, f, a), b = d(a), b.setSelected = function (a) {
                    var c, d;
                    a && a.forEach(function (a) {
                        c = a.id, d = b.content.querySelector('[data-id="' + c + '"] > input'), d && (d.checked = !0)
                    })
                }, b.updateModel = function (a) {
                    var c, d, e, f, g;
                    for (g = {}, f = b.model.get(b.watchProperty), f ? g[b.watchProperty] = f.slice(0) : g[b.watchProperty] = [], d = -1, e = g[b.watchProperty], c = 0; c < e.length; c++) a.id === e[c].id && (d = c); - 1 === d ? g[b.watchProperty].push(a) : g[b.watchProperty].splice(d, 1), b.model.set(g)
                }, a = null, b
            };
        b.exports = g
    }, {
        "settings/RadioOptionsView": 49,
        "util/Util": 21
    }],
    49: [function (a, b, c) {
        "use strict";
        var d = a("core/GenericCollectionView"),
            e = a("util/Util"),
            f = {
                classPrefix: "radio-options-view",
                containerNodeName: "ol",
                inputType: "radio",
                title: null
            },
            g = function (a) {
                var b, c;
                return a = e.extend({}, f, a), b = d(a), c = function (a) {
                    b.inputType = a.inputType, b.title = a.title
                }, b.createCollectionItemContent = function (a) {
                    var c, d, e;
                    return c = document.createDocumentFragment(), d = document.createElement("input"), d.setAttribute("name", b.watchProperty), d.setAttribute("type", b.inputType), d.setAttribute("value", a.id), d.setAttribute("id", b.watchProperty + "-" + a.id), e = document.createElement("label"), e.setAttribute("for", b.watchProperty + "-" + a.id), e.innerHTML = a.name, c.appendChild(d), c.appendChild(e), c
                }, b.deselectAll = function () {
                    Array.prototype.forEach.call(b.content.querySelectorAll('input[type="' + b.inputType + '"]'), function (a) {
                        a.checked = !1
                    })
                }, b.destroy = e.compose(function () {
                    c = null, b = null
                }, b.destroy), b.onContentClick = function (a) {
                    var c, d;
                    a && a.target && "INPUT" === a.target.nodeName && (c = b.getClickedItem(a.target, b.content), c && b.watchProperty && (d = b.collection.get(c.getAttribute("data-id")), b.updateModel(d)))
                }, b.renderHeader = function () {
                    b.title && (b.header.innerHTML = "<h4>" + b.title + "</h4>")
                }, b.setSelected = function (a) {
                    var c, d;
                    a && (c = a.id, d = b.content.querySelector('[data-id="' + c + '"] > input'), d && (d.checked = !0, document.activeElement !== d && d.focus()))
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "core/GenericCollectionView": 26,
        "util/Util": 21
    }],
    50: [function (a, b, c) {
        "use strict";
        var d = a("settings/CheckboxOptionsView"),
            e = a("latesteqs/LatestEarthquakesConfig"),
            f = a("settings/RadioOptionsView"),
            g = a("util/Util"),
            h = a("mvc/View"),
            i = {},
            j = function (a) {
                var b, c, j, k, l, m, n, o, p, q, r, s, t, u, v;
                return b = h(a), a = g.extend({}, i, a), c = function () {
                    k = a.config || e(), b.createSkeleton(), b.render(), b.model.off("change", "render", b)
                }, b.createSkeleton = function () {
                    b.el.innerHTML = '<section class="settings-header"></section><section class="settings-content"></section><section class="settings-footer"></section>', b.header = b.el.querySelector(".settings-header"), b.content = b.el.querySelector(".settings-content"), b.footer = b.el.querySelector(".settings-footer"), j = document.createElement("section"), l = document.createElement("p"), m = document.createElement("section"), n = document.createElement("h4"), o = document.createElement("section"), p = document.createElement("section"), q = document.createElement("section"), r = document.createElement("section"), s = document.createElement("section"), u = document.createElement("section"), v = document.createElement("section"), n.innerHTML = (SCENARIO_MODE ? "Scenario " : "") + "Earthquakes", l.className = "disclaimer", l.innerHTML = 'All lists include most worldwide events magnitude 4.5 and greater, <a href="/data/comcat/data-availability.php">read more</a>.', b.content.appendChild(n), b.content.appendChild(l), b.content.appendChild(j), b.content.appendChild(m), b.content.appendChild(u), b.content.appendChild(p), b.content.appendChild(q), b.content.appendChild(o), b.content.appendChild(r), b.content.appendChild(s), b.content.appendChild(v)
                }, b.destroy = g.compose(function () {
                    SCENARIO_MODE || t.removeEventListener("click", b.onSearchButtonClick, b), j = null, k = null, l = null, m = null, n = null, o = null, p = null, q = null, r = null, s = null, t = null, u = null, v = null, c = null, b = null
                }, b.destroy), b.render = function () {
                    b.renderHeader(), b.renderContent(), SCENARIO_MODE || b.renderSearchButton()
                }, b.renderContent = function () {
                    var a, c, e, g, h, i, l, n;
                    SCENARIO_MODE || (a = d({
                        el: j,
                        collection: k.options.autoUpdate,
                        model: b.model,
                        title: null,
                        watchProperty: "autoUpdate"
                    }), a.render()), c = f({
                        el: m,
                        collection: k.options.feed,
                        model: b.model,
                        title: null,
                        watchProperty: "feed"
                    }), c.render(), e = d({
                        el: o,
                        collection: k.options.restrictListToMap,
                        model: b.model,
                        watchProperty: "restrictListToMap"
                    }), e.render(), g = f({
                        el: p,
                        collection: k.options.listFormat,
                        model: b.model,
                        title: "List Format",
                        watchProperty: "listFormat"
                    }), g.render(), h = f({
                        el: q,
                        collection: k.options.sort,
                        model: b.model,
                        title: "List Sort Order",
                        watchProperty: "sort"
                    }), h.render(), i = f({
                        el: r,
                        collection: k.options.basemap,
                        model: b.model,
                        title: "Map Layers",
                        watchProperty: "basemap"
                    }), i.render(), l = d({
                        el: s,
                        collection: k.options.overlays,
                        model: b.model,
                        watchProperty: "overlays"
                    }), l.render(), SCENARIO_MODE || (n = f({
                        el: v,
                        collection: k.options.timezone,
                        model: b.model,
                        title: "Time Zone",
                        watchProperty: "timezone"
                    }), n.render())
                }, b.renderHeader = function () {
                    b.header.innerHTML = "<h3>Settings</h3><small>Bookmark to return to map/list with the same settings</small>"
                }, b.renderSearchButton = function () {
                    t = document.createElement("button"), t.addEventListener("click", b.onSearchButtonClick, b), t.classList.add("search-button"), t.classList.add("blue"), t.innerHTML = "Search Earthquake Catalog", u.appendChild(t)
                }, b.onSearchButtonClick = function () {
                    window.location = SEARCH_PATH + window.location.hash
                }, c(a), a = null, b
            };
        b.exports = j
    }, {
        "latesteqs/LatestEarthquakesConfig": 33,
        "mvc/View": 18,
        "settings/CheckboxOptionsView": 48,
        "settings/RadioOptionsView": 49,
        "util/Util": 21
    }],
    51: [function (a, b, c) {
        "use strict";
        var d = a("core/Formatter"),
            e = a("util/Util"),
            f = {},
            g = function (a) {
                var b, c, g, h;
                return b = {}, c = function (a) {
                    a = e.extend({}, f, a), g = a.formatter || d(), h = a.timezoneOffset || 0
                }, b.destroy = e.compose(function () {
                    g = null, c = null, b = null
                }, b.destroy), b.format = function (a) {
                    var b, c, d, e, f, i, j, k, l, m, n, o, p, q, r;
                    return i = document.createElement("div"), i.className = "event-summary", o = a.properties, b = o.alert, d = o.cdi, n = o.mmi, q = o.tsunami, p = new Date(o.time), r = o.url, e = a.geometry.coordinates, f = e[2], k = e[1], m = e[0], p = g.datetime(p, h, !1), l = g.location(k, m), f = g.depth(f, "km"), c = [], j = [], c.push("<h1>", '<a href="', r, '">', o.title, "</a>", "</h1>"), "undefined" != typeof d && null !== d && (d = g.mmi(d), j.push('<a href="' + r + '#dyfi" class="mmi' + d + '" title="Did You Feel It? maximum reported intensity"><strong class="roman">' + d + '</strong><br/><abbr title="Did You Feel It?">DYFI?</abbr></a>')), "undefined" != typeof n && null !== n && (n = g.mmi(n), j.push('<a href="' + r + '#shakemap" class="mmi' + n + '" title="ShakeMap maximum estimated intensity"><strong class="roman">' + n + '</strong><br/><abbr title="ShakeMap">ShakeMap</abbr></a>')), "undefined" != typeof b && null !== b && j.push('<a href="' + r + '#pager" class="pager-alertlevel-' + b.toLowerCase() + '" title="PAGER estimated impact alert level"><strong class="roman">' + b.toUpperCase() + '</strong><br/><abbr title="Prompt Assessment of Global Earthquakes for Response">PAGER</abbr></a>'), "undefined" != typeof q && null !== q && q > 0 && j.push('<a href="http://www.tsunami.gov/" class="tsunami" title="Tsunami Warning Center"><img src="images/tsunami.jpg" alt="Tsunami Warning Center"/></a>'), j.length > 0 && c.push('<div class="impact-bubbles">' + j.join("") + "</div>"), c.push("<dl>", "<dt>Time</dt>", "<dd>", '<time datetime="', p, '">', p, "</time>", "</dd>", "<dt>Location</dt>", '<dd class="location">', l, "</dd>", "<dt>Depth</dt>", '<dd class="depth">', f, "</dd>", "</dl>"), i.innerHTML = c.join(""), i
                }, b.setTimezoneOffset = function (a) {
                    h = a || 0
                }, c(a), a = null, b
            };
        b.exports = g
    }, {
        "core/Formatter": 25,
        "util/Util": 21
    }],
    52: [function (a, b, c) {
        "use strict";
        var d = a("mvc/Collection"),
            e = a("summary/EventSummaryFormat"),
            f = a("util/Util"),
            g = a("mvc/View"),
            h = {},
            i = function (a) {
                var b, c, i, j, k, l, m, n, o, p, q;
                return b = g(a), c = function (a) {
                    a = f.extend({}, h, a), i = document.createElement("button"), i.classList.add("summary-close"), j = a.formatter || e(), k = !1, n = 0, o = null, q = null, b.catalog = a.catalog || d(), b.model.off("change", "render", b), b.model.on("change:event", m, b), b.model.on("change:timezone", "render", b), i.addEventListener("click", l), b.el.addEventListener("touchstart", b.onDragStart, b)
                }, l = function () {
                    b.hideEventSummary()
                }, m = function () {
                    b.render()
                }, b.deselectEvent = function () {
                    b.model.set({
                        event: null
                    })
                }, b.destroy = f.compose(function () {
                    b.model.off("change:event", m, b), b.model.off("change:timezone", "render", b), i.removeEventListener("click", l), i = null, j = null, k = null, l = null, m = null, c = null, b = null
                }, b.destroy), b.hideEventSummary = function () {
                    b.deselectEvent(), b.el.classList.remove("smoothing"), b.el.classList.remove("show"), k = !1
                }, b.onDragEnd = function (a) {
                    return ("touchend" === a.type || "touchcancel" === a.type) && (b.el.removeEventListener("touchmove", b.onDragScroll, b), b.el.removeEventListener("touchend", b.onDragEnd, b), b.el.removeEventListener("touchcancel", b.onDragEnd, b)), Math.abs(o) < 5 && a.target ? void a.target.click() : (b.el.classList.add("smoothing"), o >= 1 * b.el.clientHeight / 3 ? b.hideEventSummary() : (b.setTranslate(0), b.setOpactity(1)), window.setTimeout(function () {
                        b.setTranslate(0), b.setOpactity(1)
                    }, 500), void(o = 0))
                }, b.onDragScroll = function (a) {
                    var c, d, e, f;
                    f = a.type, "touchmove" === f && (d = a.touches[0].clientY), e = d - q, o = e, b.setTranslate(e), o >= 1 * b.el.clientHeight / 3 ? (c = (p - o) / p * 3 / 2, b.setOpactity(c)) : o < 1 * b.el.clientHeight / 3 && b.setOpactity(1)
                }, b.onDragStart = function (a) {
                    p = b.el.clientHeight, "touchstart" === a.type && (a.preventDefault(), q = a.touches[0].clientY, b.el.addEventListener("touchmove", b.onDragScroll, b), b.el.addEventListener("touchend", b.onDragEnd, b), b.el.addEventListener("touchcancel", b.onDragEnd, b)), b.el.classList.remove("smoothing")
                }, b.setOpactity = function (a) {
                    b.el.style.opacity = a
                }, b.render = function () {
                    var a, c;
                    return (a = b.model.get("event")) ? (c = b.model.get("timezone"), c && j.setTimezoneOffset(c.offset), f.empty(b.el), b.el.appendChild(i), b.el.appendChild(j.format(a)), void(k || b.showEventSummary(a))) : void b.hideEventSummary()
                }, b.setTranslate = function (a) {
                    b.el.style["-webkit-transform"] = "translate3d(0px, " + a + "px, 0px)", b.el.style["-moz-transform"] = "translate3d(0px, " + a + "px, 0px)", b.el.style["-ms-transform"] = "translate3d(0px, " + a + "px, 0px)", b.el.style["-o-transform"] = "translate3d(0px, " + a + "px, 0px)", b.el.style.transform = "translate3d(0px, " + a + "px, 0px)"
                }, b.showEventSummary = function () {
                    b.el.classList.add("smoothing"), b.el.classList.add("show"), k = !0
                }, c(a), a = null, b
            };
        b.exports = i
    }, {
        "mvc/Collection": 15,
        "mvc/View": 18,
        "summary/EventSummaryFormat": 51,
        "util/Util": 21
    }]
}, {}, [29]);
