(
	function(context) {
		var INCLUDE = function () {
			var self = this;
			
			var iframe = document.createElement("iframe");
			iframe.setAttribute('id','include_js');
			iframe.setAttribute('frameborder','0');
			iframe.setAttribute('allowtransparency','true');
			iframe.setAttribute('style','background-color: transparent; border: 0px none transparent; overflow: hidden; display: block; position: fixed; visibility: visible; margin: 0px; padding: 0px; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;');
			document.getElementsByTagName('body')[0].appendChild(iframe);
			
			var iframe = document.getElementById('include_js');
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write("");
			iframe.contentWindow.document.close();
			
		  
			loadScript = function (script,location,callback) {
				var c;
				if(location=='iframe'){
					c = iframe.contentWindow.document.createElement("script");
				}
				else{
					c = document.createElement("script");
				}
				c.type = "text/javascript";
				c.src = script;
				c.onload = c.onreadystatechange = function () {
				  if (!(d = this.readyState) || d === "loaded" || d === "complete") {
					if (typeof callback === 'function') {
					  callback();
					}
				  }
				};
				if(location=='iframe'){
					iframe.contentWindow.document.getElementsByTagName('head')[0].appendChild(c);
				}
				else{
					document.getElementsByTagName('head')[0].appendChild(c);
				}
			}
			loadCss = function (css,callback) {
				var c = iframe.contentWindow.document.createElement("link");
				c.rel = "stylesheet";
				c.href = css;
				c.onload = c.onreadystatechange = function () {
				  if (!(d = this.readyState) || d === "loaded" || d === "complete") {
					if (typeof callback === 'function') {
					  callback();
					}
				  }
				};
				iframe.contentWindow.document.getElementsByTagName('head')[0].appendChild(c);
			}
		  
			loadDatabase = function(callback) {
				loadCss(
					'css/chord.css',
					function(){
						loadCss(
							'css/impress-demo.css',
							function(){
								loadScript(
									'js/impress.js',
									'iframe',
									function(){
										loadScript(
											'js/d3.v2.js',
											'iframe',
											function(){
												loadScript(
													'js/database.jsonp',
													'document',
													function() {	  
														  callback(database);
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		  
		    this.init = function(){
				loadDatabase(
					function(database) {
						// setup the fallback notice if impress is not supported
						var fallback = iframe.contentWindow.document.createElement("div");
						fallback.setAttribute('class','fallback-message');
						fallback.innerHTML = "<p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p><p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>";
						
						iframe.contentWindow.document.getElementsByTagName('body')[0].appendChild(fallback);
						
						// now setup the impress div and start to create the steps
						var impress = iframe.contentWindow.document.createElement("div");
						impress.setAttribute('id','impress');
						
						// render the various impress divs
						for(i=0;i<database.post.length;i++){
							var step = database.post[i];
							var div = iframe.contentWindow.document.createElement("div");
							
							
							div.setAttribute('id',step.id);
							
							div.setAttribute('class',step.class);
							
							if(step.data_x)
								div.setAttribute('data-x',step.data_x);
							if(step.data_y)
								div.setAttribute('data-y',step.data_y);
							if(step.data_z)
								div.setAttribute('data-z',step.data_z);
							if(step.data_scale)
								div.setAttribute('data-scale',step.data_scale);
							if(step.data_rotate_x)
								div.setAttribute('data-rotate-x',step.data_rotate_x);
							if(step.data_rotate_y)
								div.setAttribute('data-rotate-y',step.data_rotate_y);
							if(step.data_rotate)
								div.setAttribute('data-rotate',step.data_rotate);
								
							div.innerHTML = step.content;
							
							impress.appendChild(div);
						}
						
						iframe.contentWindow.document.getElementsByTagName('body')[0].appendChild(impress);
						
						// now that everything is created, go and init impress
						var initScript = iframe.contentWindow.document.createElement("script");
						initScript.type = "text/javascript";
						initScript.innerHTML = 'window.impress().init()';
						iframe.contentWindow.document.getElementsByTagName('body')[0].appendChild(initScript);
						
						iframe.contentWindow.focus();
						
						loadScript(
							'js/chord.js',
							'iframe',
							function() {	  
								  console.log('hi');
							}
						);
						
						window.loaded_its = 0;
						window.loaded_big = 0;
						
						iframe.contentWindow.document.addEventListener('impress:stepenter', function(e){
							console.log(e.target.id);
							if(e.target.id=='its' && !window.loaded_its){
								loadCss(
									'css/line.css',
									function(){
										loadScript(
											'js/line.js',
											'iframe',
											function() {	  
												  console.log('hi');
												  window.loaded_its = 1;
											}
										);
									}
								);
							}
							else if(e.target.id=='big' && !window.loaded_big){
								loadCss(
									'css/button.css',
									function(){
										loadCss(
											'css/stream.css',
											function(){
												loadScript(
													'js/stream_layers.js',
													'iframe',
													function() {	  
														  loadScript(
															'js/stream.js',
															'iframe',
															function() {	  
																  console.log('hi');
																  window.loaded_big = 1;
															}
														);
													}
												);
											}
										);
									}
								);
							}
						});
					}
				);
			}
		};
	
		context._INCLUDE = new INCLUDE();
	}

)(window);