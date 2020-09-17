import React, {useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {PanelHeaderButton, Panel, PanelHeader, platform, IOS, SimpleCell, Avatar} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Snippet from "../components/Snippet";
import {authors, getState, setState} from "../state";
import "./Wall.css";

const osName = platform();

const Wall = ({id, go, help}) => {
    const [authorName, setAuthorName] = useState("");
    const [data, setData] = useState({});

    useEffect(() => {
        const state = getState();
        setAuthorName(authors[state.author].split(" ")[0]);
    }, []);

    useEffect(() => {
        setData(getState());
    });

    const helpHandler = () => {
        help();
        setData(getState());
    };

    const open = () => {
        go("show");
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                Новости
            </PanelHeader>
            <div className="wall-dummy"/>
            <SimpleCell
                description="только что"
                before={<Avatar src="http://lorempixel.com/200/200/people/"/>}
            >
                {authorName}
            </SimpleCell>
            <Snippet data={data} help={helpHandler} open={open}/>
            <div className="wall-dummy"/>
            <div className="wall-dummy"/>
            <div className="wall-dummy"/>
            <div className="wall-dummy"/>
        </Panel>
    );
}

export default Wall;
