import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { Button, Panel, PanelHeader, Placeholder, Title, Div } from "@vkontakte/vkui";
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import {getState} from "../state";

const Start = ({id, go}) => {

    const goNext = () => {
        getState(true);
        go("newPodcast");
    };

    return (
        
        <Panel id={id} >
            <PanelHeader>Подкасты</PanelHeader>
            
            <Placeholder stretched action={
                <Button onClick={goNext}>Поделиться подкастом</Button>
            }>
                <div style={{display: 'flex', justifyContent: 'center',  marginBottom: 10}}> 
                    <Icon56CheckCircleOutline/>
                </div>

                 <Title level="2" weight="semibold" style={{color:'black', marginBottom: 10 }}>Подкаст добавлен</Title>    

               Расскажите своим подписчиками<br />
               о новом подкасте, чтобы получить<br />
                больше слушателей
            </Placeholder>
        </Panel>
    );
}

export default Start;
