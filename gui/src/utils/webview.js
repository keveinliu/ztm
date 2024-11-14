import store from '@/store';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Webview } from '@tauri-apps/api/webview';
import { getCurrentWindow, Window } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
// import { getCurrent as getCurrentDL } from '@tauri-apps/plugin-deep-link';

const openWebview = (app)=>{
	try{
		const platform = store.getters['account/platform'];
		if(!window.__TAURI_INTERNALS__  ){
			//|| platform=='android' || platform=='ios'
			// if(app.url.indexOf('/#/') == 0){
			if(!!app.url){	
				store.commit('notice/setApp', app);
			}
			// window.open(app.url);
			return
		}
		// const appWindow = new Window(`${app.name}-window`);
		const options = {
			url: app.url,
			proxyUrl: !!app.url?app.proxy:'',
			title: app.name,
			width:app.width||960
		};
		if(!!app.height){
			options.height = app.height;
		}
		
		if(!!app.url){
			options.proxyUrl = app.proxy
		}
		if(!options.url && !!app?.port){
			options.url = "http://"+(app?.port?.listen?.ip||'127.0.0.1')+':'+app?.port?.listen?.port;
		}
		if(platform=='android' || platform=='ios' ){
			//=============
			// invoke('load_webview_with_proxy', { 
			// 	url: options.url, 
			// 	proxyHost: (app?.port?.listen?.ip||'127.0.0.1'), 
			// 	proxyPort: app?.port?.listen?.port
			// });
			location.href=app.url;
			// getCurrentDL().then((urls)=>{
			// 	console.log(urls)
			// })
		}	else if(platform=='windows' || true){
			
			const pluginOption = {
									name: app.name,
									label: `${app.name}_webview`,
									curl: options.url,
									proxy: options?.proxyUrl || ''
			 }
			 invoke('create_proxy_webview', pluginOption);
			 
			// windows API not available on mobile
			// options.parent = getCurrentWindow();
			// const proxyUrl = options?.proxyUrl;
			// delete options.proxyUrl;
			// const appWindow = new Window(app.name, options);
			 
			// appWindow.once('tauri://created', function (win) {
			// 	 options.x = 0;
			// 	 options.y = 0;
			// 	 if(!options.height){
			// 		 options.height = 800;
			// 	 }
				
			// 	 const pluginOption = {
			// 			name: app.name,
			// 			label: `${app.name}_webview`,
			// 			curl: options.url,
			// 			proxy: proxyUrl || ''
			// 	  }
			// 	  invoke('create_proxy_webview', pluginOption);
				 
			// });
			// appWindow.once('tauri://error', function (e) {
			// 	 console.log(e)
			// });
			 // window successfully created
		} else {
			if(!options.proxyUrl){
				delete options.proxyUrl;
			}
			const webview = new WebviewWindow(`${app.name}-webview`, options);
			webview.once('tauri://created', function (d) {
				console.log('WebviewWindow://created')
				console.log(options)
				debugger
				webview.listen("click", ({ event, payload }) => {
					debugger
				});
			// webview successfully created
			});
			webview.once('tauri://error', function (e) {
				console.log('WebviewWindow://error')
				console.log(e)
			// an error happened creating the webview
			});
		}
	}catch(e){
		console.log(e)
	}
	
}

export {
	openWebview
};