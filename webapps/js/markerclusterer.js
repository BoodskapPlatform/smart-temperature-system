function MarkerClusterer(a,b,c){this.extend(MarkerClusterer,google.maps.OverlayView);this.map_=a;this.markers_=[];this.clusters_=[];this.sizes=[53,56,66,78,90];this.styles_=[];this.ready_=false;c=c||{};this.gridSize_=c.gridSize||60;this.minClusterSize_=c.minimumClusterSize||2;this.maxZoom_=c.maxZoom||null;this.styles_=c.styles||[];this.imagePath_=c.imagePath||this.MARKER_CLUSTER_IMAGE_PATH_;this.imageExtension_=c.imageExtension||this.MARKER_CLUSTER_IMAGE_EXTENSION_;this.zoomOnClick_=true;if(c.zoomOnClick!=
  undefined)this.zoomOnClick_=c.zoomOnClick;this.averageCenter_=false;if(c.averageCenter!=undefined)this.averageCenter_=c.averageCenter;this.setupStyles_();this.setMap(a);this.prevZoom_=this.map_.getZoom();var d=this;google.maps.event.addListener(this.map_,"zoom_changed",function(){var e=d.map_.getZoom(),f=d.map_.minZoom||0,g=Math.min(d.map_.maxZoom||100,d.map_.mapTypes[d.map_.getMapTypeId()].maxZoom);e=Math.min(Math.max(e,f),g);if(d.prevZoom_!=e){d.prevZoom_=e;d.resetViewport()}});google.maps.event.addListener(this.map_,
  "idle",function(){d.redraw()});if(b&&(b.length||Object.keys(b).length))this.addMarkers(b,false)}MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_="../images/m";MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_="png";MarkerClusterer.prototype.extend=function(a,b){return function(c){for(var d in c.prototype)this.prototype[d]=c.prototype[d];return this}.apply(a,[b])};MarkerClusterer.prototype.onAdd=function(){this.setReady_(true)};MarkerClusterer.prototype.draw=function(){};
MarkerClusterer.prototype.setupStyles_=function(){if(!this.styles_.length)for(var a=0,b;b=this.sizes[a];a++)this.styles_.push({url:this.imagePath_+(a+1)+"."+this.imageExtension_,height:b,width:b})};MarkerClusterer.prototype.fitMapToMarkers=function(){for(var a=this.getMarkers(),b=new google.maps.LatLngBounds,c=0,d;d=a[c];c++)b.extend(d.getPosition());this.map_.fitBounds(b)};MarkerClusterer.prototype.setStyles=function(a){this.styles_=a};MarkerClusterer.prototype.getStyles=function(){return this.styles_};
MarkerClusterer.prototype.isZoomOnClick=function(){return this.zoomOnClick_};MarkerClusterer.prototype.isAverageCenter=function(){return this.averageCenter_};MarkerClusterer.prototype.getMarkers=function(){return this.markers_};MarkerClusterer.prototype.getTotalMarkers=function(){return this.markers_.length};MarkerClusterer.prototype.setMaxZoom=function(a){this.maxZoom_=a};MarkerClusterer.prototype.getMaxZoom=function(){return this.maxZoom_};
MarkerClusterer.prototype.calculator_=function(a,b){for(var c=0,d=a.length,e=d;e!==0;){e=parseInt(e/10,10);c++}c=Math.min(c,b);return{text:d,index:c}};MarkerClusterer.prototype.setCalculator=function(a){this.calculator_=a};MarkerClusterer.prototype.getCalculator=function(){return this.calculator_};MarkerClusterer.prototype.addMarkers=function(a,b){if(a.length)for(var c=0,d;d=a[c];c++)this.pushMarkerTo_(d);else if(Object.keys(a).length)for(d in a)this.pushMarkerTo_(a[d]);b||this.redraw()};
MarkerClusterer.prototype.pushMarkerTo_=function(a){a.isAdded=false;if(a.draggable){var b=this;google.maps.event.addListener(a,"dragend",function(){a.isAdded=false;b.repaint()})}this.markers_.push(a)};MarkerClusterer.prototype.addMarker=function(a,b){this.pushMarkerTo_(a);b||this.redraw()};
MarkerClusterer.prototype.removeMarker_=function(a){var b=-1;if(this.markers_.indexOf)b=this.markers_.indexOf(a);else for(var c=0,d;d=this.markers_[c];c++)if(d==a){b=c;break}if(b==-1)return false;a.setMap(null);this.markers_.splice(b,1);return true};MarkerClusterer.prototype.removeMarker=function(a,b){var c=this.removeMarker_(a);if(!b&&c){this.resetViewport();this.redraw();return true}else return false};
MarkerClusterer.prototype.removeMarkers=function(a,b){for(var c=false,d=0,e;e=a[d];d++){e=this.removeMarker_(e);c=c||e}if(!b&&c){this.resetViewport();this.redraw();return true}};MarkerClusterer.prototype.setReady_=function(a){if(!this.ready_){this.ready_=a;this.createClusters_()}};MarkerClusterer.prototype.getTotalClusters=function(){return this.clusters_.length};MarkerClusterer.prototype.getMap=function(){return this.map_};MarkerClusterer.prototype.setMap=function(a){this.map_=a};
MarkerClusterer.prototype.getGridSize=function(){return this.gridSize_};MarkerClusterer.prototype.setGridSize=function(a){this.gridSize_=a};MarkerClusterer.prototype.getMinClusterSize=function(){return this.minClusterSize_};MarkerClusterer.prototype.setMinClusterSize=function(a){this.minClusterSize_=a};
MarkerClusterer.prototype.getExtendedBounds=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),d=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng());c=b.fromLatLngToDivPixel(c);c.x+=this.gridSize_;c.y-=this.gridSize_;d=b.fromLatLngToDivPixel(d);d.x-=this.gridSize_;d.y+=this.gridSize_;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(d);a.extend(c);a.extend(b);return a};
MarkerClusterer.prototype.isMarkerInBounds_=function(a,b){return b.contains(a.getPosition())};MarkerClusterer.prototype.clearMarkers=function(){this.resetViewport(true);this.markers_=[]};MarkerClusterer.prototype.resetViewport=function(a){for(var b=0,c;c=this.clusters_[b];b++)c.remove();for(b=0;c=this.markers_[b];b++){c.isAdded=false;a&&c.setMap(null)}this.clusters_=[]};
MarkerClusterer.prototype.repaint=function(){var a=this.clusters_.slice();this.clusters_.length=0;this.resetViewport();this.redraw();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};MarkerClusterer.prototype.redraw=function(){this.createClusters_()};
MarkerClusterer.prototype.distanceBetweenPoints_=function(a,b){if(!a||!b)return 0;var c=(b.lat()-a.lat())*Math.PI/180,d=(b.lng()-a.lng())*Math.PI/180;c=Math.sin(c/2)*Math.sin(c/2)+Math.cos(a.lat()*Math.PI/180)*Math.cos(b.lat()*Math.PI/180)*Math.sin(d/2)*Math.sin(d/2);return 12742*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))};
MarkerClusterer.prototype.addToClosestCluster_=function(a){var b=4E4,c=null;a.getPosition();for(var d=0,e;e=this.clusters_[d];d++){var f=e.getCenter();if(f){f=this.distanceBetweenPoints_(f,a.getPosition());if(f<b){b=f;c=e}}}if(c&&c.isMarkerInClusterBounds(a))c.addMarker(a);else{e=new Cluster(this);e.addMarker(a);this.clusters_.push(e)}};
MarkerClusterer.prototype.createClusters_=function(){if(this.ready_)for(var a=this.getExtendedBounds(new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),this.map_.getBounds().getNorthEast())),b=0,c;c=this.markers_[b];b++)!c.isAdded&&this.isMarkerInBounds_(c,a)&&this.addToClosestCluster_(c)};
function Cluster(a){this.markerClusterer_=a;this.map_=a.getMap();this.gridSize_=a.getGridSize();this.minClusterSize_=a.getMinClusterSize();this.averageCenter_=a.isAverageCenter();this.center_=null;this.markers_=[];this.bounds_=null;this.clusterIcon_=new ClusterIcon(this,a.getStyles(),a.getGridSize())}Cluster.prototype.isMarkerAlreadyAdded=function(a){if(this.markers_.indexOf)return this.markers_.indexOf(a)!=-1;else for(var b=0,c;c=this.markers_[b];b++)if(c==a)return true;return false};
Cluster.prototype.addMarker=function(a){if(this.isMarkerAlreadyAdded(a))return false;if(this.center_){if(this.averageCenter_){var b=this.markers_.length+1,c=(this.center_.lat()*(b-1)+a.getPosition().lat())/b;b=(this.center_.lng()*(b-1)+a.getPosition().lng())/b;this.center_=new google.maps.LatLng(c,b);this.calculateBounds_()}}else{this.center_=a.getPosition();this.calculateBounds_()}a.isAdded=true;this.markers_.push(a);c=this.markers_.length;c<this.minClusterSize_&&a.getMap()!=this.map_&&a.setMap(this.map_);
  if(c==this.minClusterSize_)for(b=0;b<c;b++)this.markers_[b].setMap(null);c>=this.minClusterSize_&&a.setMap(null);this.updateIcon();return true};Cluster.prototype.getMarkerClusterer=function(){return this.markerClusterer_};Cluster.prototype.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.center_,this.center_),b=this.getMarkers(),c=0,d;d=b[c];c++)a.extend(d.getPosition());return a};Cluster.prototype.remove=function(){this.clusterIcon_.remove();this.markers_.length=0;delete this.markers_};
Cluster.prototype.getSize=function(){return this.markers_.length};Cluster.prototype.getMarkers=function(){return this.markers_};Cluster.prototype.getCenter=function(){return this.center_};Cluster.prototype.calculateBounds_=function(){this.bounds_=this.markerClusterer_.getExtendedBounds(new google.maps.LatLngBounds(this.center_,this.center_))};Cluster.prototype.isMarkerInClusterBounds=function(a){return this.bounds_.contains(a.getPosition())};Cluster.prototype.getMap=function(){return this.map_};
Cluster.prototype.updateIcon=function(){var a=this.map_.getZoom(),b=this.markerClusterer_.getMaxZoom();if(b&&a>b)for(a=0;b=this.markers_[a];a++)b.setMap(this.map_);else if(this.markers_.length<this.minClusterSize_)this.clusterIcon_.hide();else{a=this.markerClusterer_.getStyles().length;a=this.markerClusterer_.getCalculator()(this.markers_,a);this.clusterIcon_.setCenter(this.center_);this.clusterIcon_.setSums(a);this.clusterIcon_.show()}};
function ClusterIcon(a,b,c){a.getMarkerClusterer().extend(ClusterIcon,google.maps.OverlayView);this.styles_=b;this.padding_=c||0;this.cluster_=a;this.center_=null;this.map_=a.getMap();this.sums_=this.div_=null;this.visible_=false;this.setMap(this.map_)}ClusterIcon.prototype.triggerClusterClick=function(){var a=this.cluster_.getMarkerClusterer();google.maps.event.trigger(a,"clusterclick",this.cluster_);a.isZoomOnClick()&&this.map_.fitBounds(this.cluster_.getBounds())};
ClusterIcon.prototype.onAdd=function(){this.div_=document.createElement("DIV");if(this.visible_){this.div_.style.cssText=this.createCss(this.getPosFromLatLng_(this.center_));this.div_.innerHTML=this.sums_.text}this.getPanes().overlayMouseTarget.appendChild(this.div_);var a=this;google.maps.event.addDomListener(this.div_,"click",function(){a.triggerClusterClick()})};
ClusterIcon.prototype.getPosFromLatLng_=function(a){a=this.getProjection().fromLatLngToDivPixel(a);a.x-=parseInt(this.width_/2,10);a.y-=parseInt(this.height_/2,10);return a};ClusterIcon.prototype.draw=function(){if(this.visible_){var a=this.getPosFromLatLng_(this.center_);this.div_.style.top=a.y+"px";this.div_.style.left=a.x+"px"}};ClusterIcon.prototype.hide=function(){if(this.div_)this.div_.style.display="none";this.visible_=false};
ClusterIcon.prototype.show=function(){if(this.div_){this.div_.style.cssText=this.createCss(this.getPosFromLatLng_(this.center_));this.div_.style.display=""}this.visible_=true};ClusterIcon.prototype.remove=function(){this.setMap(null)};ClusterIcon.prototype.onRemove=function(){if(this.div_&&this.div_.parentNode){this.hide();this.div_.parentNode.removeChild(this.div_);this.div_=null}};
ClusterIcon.prototype.setSums=function(a){this.sums_=a;this.text_=a.text;this.index_=a.index;if(this.div_)this.div_.innerHTML=a.text;this.useStyle()};ClusterIcon.prototype.useStyle=function(){var a=Math.max(0,this.sums_.index-1);a=Math.min(this.styles_.length-1,a);a=this.styles_[a];this.url_=a.url;this.height_=a.height;this.width_=a.width;this.textColor_=a.textColor;this.anchor_=a.anchor;this.textSize_=a.textSize;this.backgroundPosition_=a.backgroundPosition};
ClusterIcon.prototype.setCenter=function(a){this.center_=a};
ClusterIcon.prototype.createCss=function(a){var b=[];b.push("background-image:url("+this.url_+");");b.push("background-position:"+(this.backgroundPosition_?this.backgroundPosition_:"0 0")+";");if(typeof this.anchor_==="object"){typeof this.anchor_[0]==="number"&&this.anchor_[0]>0&&this.anchor_[0]<this.height_?b.push("height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;"):b.push("height:"+this.height_+"px; line-height:"+this.height_+"px;");typeof this.anchor_[1]==="number"&&
this.anchor_[1]>0&&this.anchor_[1]<this.width_?b.push("width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;"):b.push("width:"+this.width_+"px; text-align:center;")}else b.push("height:"+this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;");b.push("cursor:pointer; top:"+a.y+"px; left:"+a.x+"px; color:"+(this.textColor_?this.textColor_:"black")+"; position:absolute; font-size:"+(this.textSize_?this.textSize_:11)+"px; font-family:Arial,sans-serif; font-weight:bold");
  return b.join("")};
