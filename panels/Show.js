import React, {useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Button, Div, Header, InfoRow, Panel, Progress, Separator, SimpleCell} from "@vkontakte/vkui";
import {authors, getState} from "../state";
import "./Show.css";

const Show = ({id, help}) => {
    const [data, setData] = useState(getState());
    const [doneText, setDoneText] = useState("");

    useEffect(() => {
        if (!data || Number.isNaN(data.amount) || !data.amount) {
            setDoneText("Сбор скоро начнётся");
        } else {
            setDoneText(`Собрано ${data.donated.toLocaleString("ru-RU")} ₽ из ${data.amount.toLocaleString("ru-RU")} ₽`);
        }
    });

    useEffect(() => {
        setData(getState());
    });

    const helpHandler = () => {
        help();
        setData(getState());
    };

    return (
        <Panel id={id}>
            <div className="cover-img" style={{backgroundImage: `url(${data.image})`}} onClick={() => window.history.back()}/>
            <Header>{data.name}</Header>
            <SimpleCell description={`Автор ${authors[data.author || 0]}`}/>
            <Separator/>
            <Div>
                {data.desc}
            </Div>
            <Div className="amount-block amount-block-bottom">
                <InfoRow header={doneText} className="amount-info-row">
                    <Progress value={(!data || !data.amount || Number.isNaN(data.amount)) ? 0 : ((data.donated / data.amount) * 100)}/>
                </InfoRow>
                <Button
                    style={{marginLeft: 12, opacity: help ? 1.0 : 0.5}}
                    mode="commerce"
                    onClick={helpHandler}>
                    Помочь
                </Button>
            </Div>
        </Panel>
    );
}

export default Show;
