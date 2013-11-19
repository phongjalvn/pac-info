"use strict";angular.module("pacApp",["vegaModule"]).factory("compressNumber",[function(){var a=1e3,b=1e3*a,c=1e3*b,d=1e3*c;return function(e){var f=e,g="Reais";return e>d?(g="Trilhões",f=e/d):e>c?(g="Bilhões",f=e/c):e>b?(g="Milhões",f=e/b):e>a&&(g="Mil",f=e/a),{value:f,label:g}}}]).run(function(){delete $.fn.carousel.Constructor.DEFAULTS.interval}),angular.module("pacApp").controller("MainCtrl",["$scope","porRegiaoChart","estagioChart","evolucaoChart","distribuicaoChart","$location",function(a,b,c,d,e,f){a.regioes=[{name:"Norte"},{name:"Nordeste"},{name:"Centro-Oeste"},{name:"Sudeste"},{name:"Sul"}],a.evolucao=d,a.distribuicao=e,a.estagios=c,a.porRegiao=b,a.slides={list:a.regioes,current:a.regioes[0],next:function(){a.slides.move("right")},prev:function(){a.slides.move("left")},move:function(b){var c=a.slides.list,d=a.slides.current,e=c.indexOf(d)+1,f=(c.indexOf(d)||c.length)-1,g="right"===b?e:f;a.slides.current=c[g%c.length],a.porRegiao.carregarCategoria(a.banner.api,a.slides.current.name)}},a.$on("$locationChangeSuccess",function(){var b=f.path()||"/transportes",c={"/transportes":"Transportes","/comunidade-cidada":"Comunidade Cidadã","/habitacao":"Habitação","/agua-e-luz-para-todos":"Água e Luz para todos","/cidade-melhor":"Cidade Melhor","/energia":"Energia"},d=c[b];a.evolucao.carregarCategoria(b),a.distribuicao.carregarCategoria(b),a.estagios.carregarCategoria(b),a.porRegiao.carregarCategoria(b,a.slides.current.name),a.banner={title:d,api:b}})}]),angular.module("pacApp").directive("onSlide",[function(){return{restrict:"A",scope:{next:"&next",prev:"&prev"},link:function(a,b){b.on("slide.bs.carousel",function(b){a.$apply("left"===b.direction?a.next:a.prev)})}}}]).directive("pacRandomColor",["shuffle",function(a){return{restrict:"A",link:function(b,c){var d=a(["#FBAD2F","#68D286","#1DA1CD","#EB585C","#A085C6","#FF8FB4","#FDD26D"]);c.css("color",d[parseInt(Math.random()*d.length,10)])}}}]).directive("navbarPrincipal",[function(){return{restrict:"A",link:function(a,b){var c=b.offset().top,d=c,e=parseInt(b.css("height").replace("px",""),10);angular.element(window).scroll(function(){var a=angular.element(window).scrollTop();a>d?(b.addClass("navbar-fixed-top"),d=c,angular.element("body").css("padding-top",e)):(b.removeClass("navbar-fixed-top"),d=b.offset().top,angular.element("body").css("padding-top",0),c=b.offset().top)})}}}]).directive("navLink",["$location",function(a){return{restrict:"A",link:function(b,c,d){var e=c.find("a").prop("href").replace("#",""),f=function(){return a.path()},g=angular.isDefined(d.navLinkDefault);b.$watch(f,function(a){var b="/"===a||""===a;c.removeClass("active"),c.addClass(e.search(a)>=0&&!b?"active":""),c.addClass(g&&b?"active":"")})}}}]),angular.module("vegaModule",[]).service("vega",function(){return window.vg}).service("screen",["$timeout",function(a){function b(){var a=angular.element(window).scrollTop(),b=window.innerHeight;angular.forEach(c,function(e){var f=angular.element(e).offset().top,g=d[c.indexOf(e)],h=parseInt(angular.element(e).css("height").replace("px",""),10);a+b>f+h-h/3?g.didEnter||(g.didEnter=!0,g.onEnter.call()):g.didEnter&&(g.didEnter=!1,g.didCenter=!1,g.onLeave.call())})}var c=[],d=[];this.trackElement=function(a){var b={onEnter:angular.noop,onLeave:angular.noop,onCenter:angular.noop,didEnter:!1,didCenter:!1,didLeave:!1};return c.push(a),d.push(b),{onEnter:function(a){b.onEnter=a},onLeave:function(a){b.onLeave=a},onCenter:function(a){b.onCenter=a}}},angular.element(window).on("scroll",b),a(function(){b()})}]).directive("vegaChart",["vega","screen","chartSize",function(a,b,c){return{restrict:"A",scope:{data:"=",spec:"=",duration:"@"},link:function(d,e,f){function g(){var b=d.data.full,f=d.data.empty,g=c(e).width,h=d.spec(e,b,g,320>g);j&&i?i.width(h.width).data(b).update({duration:1e3}):a.parse.spec(h,function(a){i=a({el:e[0],data:f}).update(),setTimeout(function(){i.data(d.isInTheView?b:f).update({duration:1e3})},500)})}function h(){var a=d.data&&d.data.full&&d.data.full.table&&d.data.full.table.length>0;a&&g()}var i,j=!("false"==f.reuseSpec);d.isInTheView=!1,d.animate=d.animate||!0,d.$watch("data",h),angular.element(window).on("resize",h),b.trackElement(e).onEnter(function(){d.isInTheView=!0,h()}),b.trackElement(e).onLeave(function(){d.isInTheView=!1})}}}]),angular.module("pacApp").factory("apiUrl",function(){return function(a){return"http://localhost:9000/mock-api"+a+".json"}}),angular.module("pacApp").factory("PacService",["apiUrl","$http",function(a,b){var c=function(a,b){this.transformObjectFunction=a||angular.noop,this.resetObjectFunction=b||angular.noop};return c.prototype.get=function(c){var d=this;return b.get(a(c),{cache:!0,transformResponse:function(a){return d.transformResponse(a)}})},c.prototype.transformResponse=function(a){var b=[],c=angular.fromJson(a),d=this,e=c.length;return angular.forEach(c,function(a){var b=c.indexOf(a);d.transformObjectFunction(a,b,e);var f=angular.copy(a);d.resetObjectFunction(f,b,e),this.push(f)},b),{empty:{table:b},full:{table:c}}},c}]).factory("chartSize",function(){return function(a){return{width:parseInt(a.css("width").replace("px",""),10),height:200}}}),angular.module("pacApp").factory("porRegiaoSpec",["chartSize",function(){return function(a,b,c,d){return{width:c,height:180,padding:{top:d?30:20,left:0,bottom:30,right:d?10:0},data:[{name:"table"}],scales:[{name:"x",type:"ordinal",points:!0,padding:1,range:"width",domain:{data:"table",field:"data._id"}},{name:"y",range:"height",nice:!0,domain:{data:"table",field:"data.valor_total"}}],axes:[{type:"x",scale:"x",properties:{axis:{strokeWidth:{value:0}},majorTicks:{strokeWidth:{value:0}},labels:{fill:{value:"#FFF"},angle:{value:0},fontSize:{value:12},fontWeight:{value:"200"},align:{value:"center"}}}}],marks:[{type:"rect",from:{data:"table"},properties:{enter:{fill:{value:"#fff"},x:{scale:"x",field:"data._id",offset:15},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:0},width:{scale:"x",band:!0,offset:d?-20:-30}},update:{x:{scale:"x",field:"data._id",offset:15},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:0},width:{scale:"x",band:!0,offset:d?-20:-30}}}},{type:"text",from:{data:"table"},properties:{enter:{x:{scale:"x",field:"data._id"},y:{scale:"y",field:"data.valor_total",offset:-10},fill:{value:"#fff"},text:{field:"data.label"},align:{value:d?"left":"center"},angle:{value:d?-45:0},fontSize:{value:14}},update:{x:{scale:"x",field:"data._id"},y:{scale:"y",field:"data.valor_total",offset:-10},text:{field:"data.label"}}}}]}}}]).service("porRegiaoChart",["PacService","porRegiaoSpec","compressNumber",function(a,b,c){var d=this,e=0;this.spec=b;var f=new a(function(a){e+=a.valor_total},function(a){a.valor_total=""});this.carregarCategoria=function(a,b){e=0,f.get(a+"/by_region/"+b).success(function(a){var b=c(e);d.data=a,d.data.totalLabel=b.label,d.data.total=b.value.toFixed(0)})}}]),angular.module("pacApp").factory("evolucaoSpec",["chartSize",function(a){return function(b,c,d,e){return e=500>d,{width:d,height:a(b).height,padding:{top:e?30:20,left:e?10:0,bottom:e?70:30,right:e?20:10},data:[{name:"table"}],scales:[{name:"x",type:"ordinal",points:!0,padding:1,range:"width",domain:{data:"table",field:"data._id.data_balanco"},reverse:!0},{name:"y",type:"linear",range:"height",nice:!0,zero:!0,domain:{data:"table",field:"data.valor_total"}},{name:"width",type:"ordinal",range:"width",points:!0,domain:{data:"table",field:"index"}}],axes:[{type:"x",scale:"x",properties:{axis:{strokeWidth:{value:0},stroke:{value:"white"}},grid:{stroke:{value:"white"}},majorTicks:{strokeWidth:{value:0}},labels:{fill:{value:"white"},fontSize:{value:14},angle:{value:e?45:0},dy:{value:e?20:0},dx:{value:e?20:0}}}}],marks:[{type:"text",from:{data:"table"},properties:{enter:{x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total"},baseline:{value:"bottom"},fill:{value:"#fff"},text:{field:""},font:{value:"Helvetica Neue"},fontSize:{value:14},align:{value:"center"}},update:{x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total"},text:{field:"data.label"}}}},{type:"rect",from:{data:"table"},properties:{enter:{fill:{value:"#fff"},fillOpacity:{value:.5},x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total"},y2:{value:0}},update:{x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:-10},width:{value:2}}}},{type:"rect",from:{data:"table"},properties:{update:{fill:{value:"#fff"},x:{scale:"x",field:"data._id.data_balanco",offset:0},y:{group:"height"},width:{scale:"width",field:"index",mult:.835},height:{value:2}}}},{type:"area",from:{data:"table"},properties:{enter:{interpolate:{value:"monotone"},x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total",offset:5},y2:{scale:"y",value:0},fill:{value:"white"},fillOpacity:{value:.3}},update:{interpolate:{value:"monotone"},x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total",offset:5},y2:{scale:"y",value:0}}}},{type:"symbol",from:{data:"table"},properties:{enter:{shape:{value:"circle"},size:{value:50},x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total",offset:5},y2:{scale:"y",value:0},fill:{value:"white"}},update:{x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total",offset:5},y2:{scale:"y",value:0}}}},{type:"line",from:{data:"table"},properties:{enter:{interpolate:{value:"monotone"},x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:0},stroke:{value:"white"},strokeWidth:{value:2}},update:{x:{scale:"x",field:"data._id.data_balanco"},y:{scale:"y",field:"data.valor_total",offset:5},y2:{scale:"y",value:0}}}}]}}}]).service("evolucaoChart",["PacService","evolucaoSpec","compressNumber",function(a,b,c){var d=this;this.spec=b;var e=new a(function(a){a._id.data_balanco=a._id.data_balanco.substring(3)},function(a){a.valor_total="",a.label=""});this.carregarCategoria=function(a){e.get(a).success(function(a){var b=a.full.table[0].valor_total,e=c(b);d.data=a,d.data.total=e.value.toFixed(0),d.data.totalLabel=e.label})}}]),angular.module("pacApp").factory("distribuicaoSpec",["chartSize",function(a){return function(b,c,d,e){var f=400>d;return e=700>d,{width:a(b).width,height:a(b).height,padding:{top:20,left:0,bottom:f?70:e?60:30,right:0},data:[{name:"table",transform:[{type:"truncate",value:"data._id",output:"name",limit:f?15:e?20:20,position:"middle"}]}],scales:[{name:"x",type:"ordinal",points:!0,padding:1.5,range:"width",domain:{data:"table",field:"data._id"}},{name:"names",type:"ordinal",points:!0,padding:1.5,range:"width",domain:{data:"table",field:"name"}},{name:"y",range:"height",nice:!0,domain:{data:"table",field:"data.valor_total"}}],axes:[{type:"x",scale:"x",properties:{axis:{strokeWidth:{value:0}},majorTicks:{strokeWidth:{value:0}},labels:{fill:{value:"transparent"}}}}],marks:[{type:"rect",from:{data:"table"},properties:{enter:{fill:{value:"#fff"},x:{scale:"x",field:"data._id",offset:e?20:40},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:-10},width:{scale:"x",band:!0,offset:e?-40:-80}},update:{x:{scale:"x",field:"data._id",offset:e?20:40},y:{scale:"y",field:"data.valor_total"},y2:{scale:"y",value:-10},width:{scale:"x",band:!0,offset:e?-40:-80}}}},{type:"text",from:{data:"table"},properties:{enter:{x:{scale:"x",field:"data._id"},y:{scale:"y",field:"data.valor_total",offset:-10},fill:{value:"#fff"},text:{field:"data.label"},align:{value:"center"},fontSize:{value:14}},update:{x:{scale:"x",field:"data._id"},y:{scale:"y",field:"data.valor_total",offset:-10},text:{field:"data.label"}}}},{type:"text",from:{data:"table"},properties:{enter:{x:{scale:"x",field:"data._id"},y:{scale:"y",value:0},dy:{value:e?30:20},text:{field:"name"},fill:{value:"#FFF"},angle:{value:f?45:e?20:0},fontSize:{value:12},fontWeight:{value:"200"},align:{value:"center"}},update:{x:{scale:"x",field:"data._id"},y:{scale:"y",value:0},dy:{value:e?30:20},dx:{value:e?20:0},text:{field:"name"}}}}]}}}]).service("distribuicaoChart",["PacService","distribuicaoSpec",function(a,b){var c=this,d=[];this.spec=b;var e=new a(function(a){"Equipamentos - Estradas Vicinais"===a._id&&(a._id="Estradas"),d.push(a._id)},function(a){a.valor_total=""});this.carregarCategoria=function(a){d=[],e.get(a+"/by_type").success(function(a){c.data=a,c.data.tipos=d})}}]),angular.module("pacApp").factory("shuffle",[function(){return function(a){for(var b,c,d=a.length;d;b=parseInt(Math.random()*d,10),c=a[--d],a[d]=a[b],a[b]=c);return a}}]).factory("estagioSpec",[function(){return function(a,b,c,d){return d=350>c,{width:c,height:d?200:400,padding:{top:20,left:10,bottom:30,right:10},data:[{name:"table",transform:[{type:"pie",value:"data.total"}]}],scales:[{name:"r",type:"sqrt",domain:{data:"table",field:"data.total"},range:d?[80,100]:[130,180]}],marks:[{type:"arc",from:{data:"table"},properties:{enter:{x:{group:"width",mult:.5},y:{group:"height",mult:.5},startAngle:{field:"startAngle"},endAngle:{field:"endAngle"},innerRadius:{value:d?30:80},outerRadius:{scale:"r",field:"data.total"},fill:{field:"data.color"},stroke:{value:"white"},strokeWidth:{value:2}},update:{x:{group:"width",mult:.5},y:{group:"height",mult:.5},startAngle:{field:"startAngle"},endAngle:{field:"endAngle"},innerRadius:{value:d?30:80},outerRadius:{scale:"r",field:"data.total"}}}}]}}}]).factory("estagioLegendSpec",["chartSize",function(){return function(a,b,c,d){for(var e=[],f=[],g=0;g<b.table.length;g++)e.push(b.table[g]._id+" :  "+b.table[g].total),f.push(b.table[g].color);return{width:c,height:d?300:400,padding:{top:20,left:10,bottom:30,right:30},data:[{name:"table"}],scales:[{name:"r",type:"sqrt",domain:{data:"table",field:"data.total"},range:[130,180]},{name:"size",type:"ordinal",sort:!0,domain:{data:"table",field:"data.total"},range:[100,1e3]},{name:"estagios",type:"ordinal",sort:!0,domain:{data:"table",field:"data.total"},range:e},{name:"color",type:"ordinal",sort:!0,domain:{data:"table",field:"data.total"},range:f}],legends:[{size:"size",fill:"color",orient:"left",properties:{title:{fontSize:{value:16}},symbols:{stroke:{value:"transparent"},shape:{value:"circle"}},labels:{fill:{value:"#656567"},fontSize:{value:d?13:16},fontFamily:{value:"Helvetica"},text:{scale:"estagios"}},legend:{padding:{value:10},stroke:{value:"#ccc"},strokeWidth:{value:0},x:{x:0},y:{value:d?0:70}}}}]}}}]).service("estagioChart",["PacService","estagioSpec","estagioLegendSpec","shuffle",function(a,b,c,d){var e=this,f=d(["#FBAD2F","#68D286","#1DA1CD","#EB585C","#A085C6","#FF8FB4","#FDD26D"]),g=0,h=0;this.spec=b,this.legendSpec=c;var i=new a(function(a,b){a.color=f[b%f.length],g+=a.total,"Concluído"===a._id&&(h=a.total)},function(a){a.total=10});this.carregarCategoria=function(a){g=0,h=0,i.get(a+"/by_status").success(function(a){e.data=a,e.data.percentalConcluido=(h/g*100).toFixed(0)+"%",e.legendData={full:a.full,empty:a.full}})}}]);