import React, { useState, useEffect } from 'react';
import {View} from "@vkontakte/vkui";
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import Start from "./panels/Start";
import NewPodcast from "./panels/NewPodcast";
import Finish from "./panels/Finish";
import "./App.css";
import Edit from "./panels/Edit";
import Show from "./panels/Show";

const App = () => {
	const [activePanel, setActivePanel] = useState("start");

	const changePanel = (p) => {
		setActivePanel(p);
		window.history.pushState({panel: p}, "");
	};

	useEffect(() => {
		window.history.pushState({panel: "start"}, "");
		window.onpopstate = function(e) {
			setActivePanel((e.state && e.state.panel) || "start")
		};

		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	return (
		<View activePanel={activePanel}>
			<Start id="start" go={changePanel}/>
			<NewPodcast id="newPodcast" go={changePanel}/>
			<Edit id="edit"/>
			<Show id="show" go={changePanel}/>
			<Finish id="finish" go={changePanel}/>
		</View>
	);
}

export default App;

