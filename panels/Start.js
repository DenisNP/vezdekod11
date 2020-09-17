import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { Button, Panel, PanelHeader, Placeholder, Title, Div } from "@vkontakte/vkui";
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import {getState} from "../state";

const Start = ({id, go}) => {

    const goNext = () => {
        getState(true);
        go("newPodcast");
    };

    return (
        
        <Panel id={id} >
            <PanelHeader>Подкаст</PanelHeader>
            
            <Placeholder stretched action={
                <Button onClick={goNext}>Подкасты</Button>
            }>
                <div style={{display: 'flex', justifyContent: 'center',  marginBottom: 10}}> 
                    <Icon56AddCircleOutline/>
                </div>

                 <Title level="2" weight="semibold" style={{color:'black', marginBottom: 10 }}>Добавьте первый подкаст</Title>    

               Добавляйте, редактируйте и делитесь<br/>подкастами вашего соообщеста.
            </Placeholder>
        </Panel>
    );
}

export default Start;
